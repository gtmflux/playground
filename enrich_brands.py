#!/usr/bin/env python3
"""
Brand Data Enrichment & Qualification Script
=============================================
Reads a Store Leads CSV export and adds computed enrichment columns:
  - brand_tier (S/A/B/C/D) based on estimated yearly sales
  - revenue_bucket (human-readable range)
  - data_completeness_score (0-100)
  - social_reach_score (composite follower count)
  - social_reach_tier (High/Medium/Low/None)
  - review_score (weighted avg across platforms)
  - review_volume (total reviews)
  - tech_sophistication (Low/Medium/High/Enterprise)
  - primary_category (cleaned top-level category)
  - has_mobile_app (Yes/No)
  - contact_quality (0-100)
  - market_region (simplified)
  - ships_internationally (Yes/No)
  - qualification_score (master 0-100)
  - qualification_tier (Hot/Warm/Cool/Cold)
"""

import argparse
import csv
import re
import sys
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_usd(value: str) -> float:
    """Parse 'USD $1,234.56' into a float."""
    if not value:
        return 0.0
    cleaned = re.sub(r'[^0-9.]', '', value.replace('USD', '').replace('$', ''))
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def safe_int(value: str) -> int:
    try:
        return int(re.sub(r'[^0-9]', '', value)) if value else 0
    except ValueError:
        return 0


def safe_float(value: str) -> float:
    try:
        return float(value) if value else 0.0
    except ValueError:
        return 0.0


# ---------------------------------------------------------------------------
# Enrichment functions
# ---------------------------------------------------------------------------

def compute_brand_tier(yearly_sales: float) -> str:
    if yearly_sales >= 100_000_000:
        return 'S'
    elif yearly_sales >= 25_000_000:
        return 'A'
    elif yearly_sales >= 5_000_000:
        return 'B'
    elif yearly_sales >= 1_000_000:
        return 'C'
    else:
        return 'D'


def compute_revenue_bucket(yearly_sales: float) -> str:
    if yearly_sales >= 100_000_000:
        return '$100M+'
    elif yearly_sales >= 50_000_000:
        return '$50M-$100M'
    elif yearly_sales >= 25_000_000:
        return '$25M-$50M'
    elif yearly_sales >= 10_000_000:
        return '$10M-$25M'
    elif yearly_sales >= 5_000_000:
        return '$5M-$10M'
    elif yearly_sales >= 1_000_000:
        return '$1M-$5M'
    elif yearly_sales >= 100_000:
        return '$100K-$1M'
    else:
        return '<$100K'


COMPLETENESS_FIELDS = [
    'merchant_name', 'description', 'categories', 'employee_count',
    'estimated_yearly_sales', 'country_code', 'city', 'state',
    'emails', 'phones', 'facebook', 'instagram', 'twitter',
    'linkedin_url', 'pinterest', 'tiktok', 'youtube',
    'trustpilot_avgrating', 'meta_description', 'technologies',
]


def compute_data_completeness(row: dict) -> int:
    filled = sum(1 for f in COMPLETENESS_FIELDS if row.get(f, '').strip())
    return round(filled / len(COMPLETENESS_FIELDS) * 100)


def compute_social_reach(row: dict) -> int:
    fields = [
        'pinterest_followers', 'tiktok_followers',
        'twitter_followers', 'youtube_followers',
    ]
    return sum(safe_int(row.get(f, '')) for f in fields)


def compute_social_reach_tier(score: int) -> str:
    if score >= 500_000:
        return 'High'
    elif score >= 50_000:
        return 'Medium'
    elif score > 0:
        return 'Low'
    else:
        return 'None'


REVIEW_PLATFORMS = [
    ('trustpilot_avgrating', 'trustpilot_reviews'),
    ('yotpo_avgrating', 'yotpo_reviews'),
    ('judgeme_avgrating', 'judgeme_reviews'),
    ('loox_avgrating', 'loox_reviews'),
    ('okendo_avgrating', 'okendo_reviews'),
    ('stamped_avgrating', 'stamped_reviews'),
    ('rio_avgrating', 'rio_reviews'),
]


def compute_review_score(row: dict) -> float:
    total_weight = 0
    weighted_sum = 0.0
    for rating_col, count_col in REVIEW_PLATFORMS:
        rating = safe_float(row.get(rating_col, ''))
        count = safe_int(row.get(count_col, ''))
        if rating > 0 and count > 0:
            weighted_sum += rating * count
            total_weight += count
    return round(weighted_sum / total_weight, 2) if total_weight > 0 else 0.0


def compute_review_volume(row: dict) -> int:
    total = 0
    for _, count_col in REVIEW_PLATFORMS:
        total += safe_int(row.get(count_col, ''))
    return total


ENTERPRISE_TECH = {
    'google tag manager', 'google analytics 4', 'klaviyo', 'hubspot',
    'salesforce', 'segment', 'braze', 'iterable', 'contentful',
    'algolia', 'elasticsearch', 'next.js', 'headless',
}


def compute_tech_sophistication(row: dict) -> str:
    count = safe_int(row.get('technologies_count', ''))
    techs = set(t.strip().lower() for t in row.get('technologies', '').split(':') if t.strip())
    enterprise_count = len(techs & ENTERPRISE_TECH)

    if count >= 30 or enterprise_count >= 4:
        return 'Enterprise'
    elif count >= 20 or enterprise_count >= 2:
        return 'High'
    elif count >= 10:
        return 'Medium'
    else:
        return 'Low'


def compute_primary_category(row: dict) -> str:
    cats = row.get('categories', '')
    if not cats:
        return 'Unknown'
    first = cats.split(':')[0].strip('/')
    parts = first.split('/')
    return parts[0].strip() if parts else 'Unknown'


def compute_has_mobile_app(row: dict) -> str:
    ios = row.get('ios_app_id', '').strip()
    android = row.get('android_app_id', '').strip()
    return 'Yes' if ios or android else 'No'


def compute_contact_quality(row: dict) -> int:
    score = 0
    if row.get('emails', '').strip():
        score += 35
    if row.get('phones', '').strip():
        score += 25
    if row.get('linkedin_url', '').strip():
        score += 25
    if row.get('facebook', '').strip() or row.get('instagram', '').strip():
        score += 15
    return score


REGION_MAP = {
    'US': 'North America', 'CA': 'North America', 'MX': 'North America',
    'GB': 'Europe', 'UK': 'Europe', 'DE': 'Europe', 'FR': 'Europe',
    'IT': 'Europe', 'ES': 'Europe', 'NL': 'Europe', 'SE': 'Europe',
    'NO': 'Europe', 'DK': 'Europe', 'FI': 'Europe', 'BE': 'Europe',
    'AT': 'Europe', 'CH': 'Europe', 'IE': 'Europe', 'PT': 'Europe',
    'PL': 'Europe', 'CZ': 'Europe', 'RO': 'Europe', 'HU': 'Europe',
    'GR': 'Europe', 'BG': 'Europe', 'HR': 'Europe', 'SK': 'Europe',
    'SI': 'Europe', 'LT': 'Europe', 'LV': 'Europe', 'EE': 'Europe',
    'LU': 'Europe',
    'AU': 'APAC', 'NZ': 'APAC', 'JP': 'APAC', 'KR': 'APAC',
    'CN': 'APAC', 'IN': 'APAC', 'SG': 'APAC', 'HK': 'APAC',
    'TW': 'APAC', 'TH': 'APAC', 'MY': 'APAC', 'PH': 'APAC',
    'ID': 'APAC', 'VN': 'APAC',
    'BR': 'LATAM', 'AR': 'LATAM', 'CL': 'LATAM', 'CO': 'LATAM',
    'PE': 'LATAM', 'EC': 'LATAM', 'UY': 'LATAM',
    'AE': 'MENA', 'SA': 'MENA', 'IL': 'MENA', 'EG': 'MENA',
    'TR': 'MENA', 'QA': 'MENA', 'KW': 'MENA', 'BH': 'MENA',
    'ZA': 'Africa', 'NG': 'Africa', 'KE': 'Africa',
}


def compute_market_region(row: dict) -> str:
    cc = row.get('country_code', '').strip().upper()
    return REGION_MAP.get(cc, 'Other')


def compute_ships_internationally(row: dict) -> str:
    ships = row.get('ships_to_countries', '').strip()
    if not ships:
        return 'Unknown'
    countries = [c.strip() for c in ships.split(':') if c.strip()]
    if len(countries) > 3:
        return 'Yes'
    if any(kw in ships.lower() for kw in ['international']):
        return 'Yes'
    return 'No'


def compute_qualification_score(row: dict, enriched: dict) -> int:
    """
    Master qualification score (0-100) combining:
      - Revenue weight: 30 pts
      - Social reach: 15 pts
      - Review quality: 15 pts
      - Contact quality: 15 pts
      - Data completeness: 10 pts
      - Tech sophistication: 10 pts
      - Mobile app: 5 pts
    """
    score = 0.0
    yearly = parse_usd(row.get('estimated_yearly_sales', ''))

    # Revenue (0-30)
    if yearly >= 100_000_000:
        score += 30
    elif yearly >= 25_000_000:
        score += 25
    elif yearly >= 10_000_000:
        score += 20
    elif yearly >= 5_000_000:
        score += 15
    elif yearly >= 1_000_000:
        score += 10
    elif yearly >= 100_000:
        score += 5

    # Social reach (0-15)
    sr = enriched['social_reach_score']
    if sr >= 500_000:
        score += 15
    elif sr >= 100_000:
        score += 12
    elif sr >= 50_000:
        score += 9
    elif sr >= 10_000:
        score += 6
    elif sr > 0:
        score += 3

    # Reviews (0-15)
    rv = enriched['review_volume']
    rs = enriched['review_score']
    if rv >= 10_000 and rs >= 4.0:
        score += 15
    elif rv >= 1_000 and rs >= 3.5:
        score += 12
    elif rv >= 100 and rs >= 3.0:
        score += 9
    elif rv > 0:
        score += 4

    # Contact quality (0-15)
    score += enriched['contact_quality'] * 15 / 100

    # Data completeness (0-10)
    score += enriched['data_completeness_score'] * 10 / 100

    # Tech sophistication (0-10)
    ts = enriched['tech_sophistication']
    if ts == 'Enterprise':
        score += 10
    elif ts == 'High':
        score += 7
    elif ts == 'Medium':
        score += 4
    else:
        score += 1

    # Mobile app (0-5)
    if enriched['has_mobile_app'] == 'Yes':
        score += 5

    return round(score)


def compute_qualification_tier(score: int) -> str:
    if score >= 75:
        return 'Hot'
    elif score >= 55:
        return 'Warm'
    elif score >= 35:
        return 'Cool'
    else:
        return 'Cold'


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

ENRICHED_COLUMNS = [
    'brand_tier',
    'revenue_bucket',
    'data_completeness_score',
    'social_reach_score',
    'social_reach_tier',
    'review_score',
    'review_volume',
    'tech_sophistication',
    'primary_category',
    'has_mobile_app',
    'contact_quality',
    'market_region',
    'ships_internationally',
    'qualification_score',
    'qualification_tier',
]


def enrich_row(row: dict) -> dict:
    yearly_sales = parse_usd(row.get('estimated_yearly_sales', ''))
    social_reach = compute_social_reach(row)
    review_score = compute_review_score(row)
    review_volume = compute_review_volume(row)
    tech_soph = compute_tech_sophistication(row)
    has_app = compute_has_mobile_app(row)
    contact_q = compute_contact_quality(row)
    completeness = compute_data_completeness(row)

    enriched = {
        'brand_tier': compute_brand_tier(yearly_sales),
        'revenue_bucket': compute_revenue_bucket(yearly_sales),
        'data_completeness_score': completeness,
        'social_reach_score': social_reach,
        'social_reach_tier': compute_social_reach_tier(social_reach),
        'review_score': review_score,
        'review_volume': review_volume,
        'tech_sophistication': tech_soph,
        'primary_category': compute_primary_category(row),
        'has_mobile_app': has_app,
        'contact_quality': contact_q,
        'market_region': compute_market_region(row),
        'ships_internationally': compute_ships_internationally(row),
    }

    qual_score = compute_qualification_score(row, enriched)
    enriched['qualification_score'] = qual_score
    enriched['qualification_tier'] = compute_qualification_tier(qual_score)

    return enriched


def main():
    parser = argparse.ArgumentParser(description='Enrich and qualify Store Leads brand data')
    parser.add_argument('-i', '--input', default='brands.csv', help='Input CSV path (default: brands.csv)')
    parser.add_argument('-o', '--output', default='brands_enriched.csv', help='Output CSV path (default: brands_enriched.csv)')
    parser.add_argument('--min-revenue', type=float, default=5_000_000, help='Minimum yearly revenue filter in USD (default: 5000000)')
    parser.add_argument('--max-revenue', type=float, default=50_000_000, help='Maximum yearly revenue filter in USD (default: 50000000)')
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if not input_path.exists():
        print(f'Error: {input_path} not found', file=sys.stderr)
        sys.exit(1)

    print(f'Revenue filter: ${args.min_revenue:,.0f} - ${args.max_revenue:,.0f}')

    with open(input_path, 'r', newline='', encoding='utf-8') as fin:
        reader = csv.DictReader(fin)
        original_fields = reader.fieldnames or []
        output_fields = original_fields + ENRICHED_COLUMNS

        with open(output_path, 'w', newline='', encoding='utf-8') as fout:
            writer = csv.DictWriter(fout, fieldnames=output_fields)
            writer.writeheader()

            stats = {tier: 0 for tier in ['S', 'A', 'B', 'C', 'D']}
            qual_stats = {tier: 0 for tier in ['Hot', 'Warm', 'Cool', 'Cold']}
            total_read = 0
            total_written = 0

            for row in reader:
                total_read += 1
                yearly_sales = parse_usd(row.get('estimated_yearly_sales', ''))
                if yearly_sales < args.min_revenue or yearly_sales > args.max_revenue:
                    continue

                enriched = enrich_row(row)
                row.update(enriched)
                writer.writerow(row)

                stats[enriched['brand_tier']] += 1
                qual_stats[enriched['qualification_tier']] += 1
                total_written += 1

    print(f'Read {total_read} brands, wrote {total_written} -> {output_path}')
    print(f'\n--- Brand Tier Distribution ---')
    for tier in ['S', 'A', 'B', 'C', 'D']:
        pct = stats[tier] * 100 / total_written if total_written else 0
        print(f'  {tier}: {stats[tier]:>5} ({pct:.1f}%)')
    print(f'\n--- Qualification Tier Distribution ---')
    for tier in ['Hot', 'Warm', 'Cool', 'Cold']:
        pct = qual_stats[tier] * 100 / total_written if total_written else 0
        print(f'  {tier:5}: {qual_stats[tier]:>5} ({pct:.1f}%)')


if __name__ == '__main__':
    main()
