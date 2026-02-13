#!/usr/bin/env python3
"""
Final merge: combines all data sources into one enriched CSV.

Sources (in priority order):
  1. brands.csv (list 1) - 96 cols, revenue-filtered to $5M-$50M
  2. brands2_apollo.csv - list 2 brands enriched via Apollo API
  3. brands2.csv - remaining list 2 brands (basic 8 cols)

Deduplicates on normalized domain. Runs enrichment scoring on all rows.
"""

import csv
import re
import sys
from pathlib import Path

# Import enrichment functions from the main script
sys.path.insert(0, '.')
from enrich_brands import (
    enrich_row, parse_usd, normalize_domain, ENRICHED_COLUMNS,
    load_secondary_csv,
)


# Apollo output columns we want to carry through
APOLLO_EXTRA_COLS = [
    'apollo_id', 'apollo_industry', 'apollo_keywords',
    'apollo_annual_revenue', 'apollo_annual_revenue_printed',
    'apollo_estimated_employees', 'apollo_founded_year',
    'apollo_total_funding', 'apollo_latest_funding_stage',
    'apollo_technologies', 'apollo_short_description',
    'apollo_logo_url',
]


def main():
    brands_csv = Path('brands.csv')
    apollo_csv = Path('brands2_apollo.csv')
    list2_csv = Path('brands2.csv')
    output_csv = Path('brands_enriched.csv')

    min_rev = 5_000_000
    max_rev = 50_000_000

    seen_domains = set()
    all_rows = []

    # --- Source 1: Primary list (rich, revenue-filtered) ---
    print('Loading list 1 (brands.csv)...', flush=True)
    with open(brands_csv, 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        list1_fields = reader.fieldnames or []
        count = 0
        for row in reader:
            yearly = parse_usd(row.get('estimated_yearly_sales', ''))
            if yearly < min_rev or yearly > max_rev:
                continue
            domain_key = normalize_domain(row.get('domain', ''))
            if domain_key in seen_domains:
                continue
            seen_domains.add(domain_key)
            row['source'] = 'list1'
            all_rows.append(row)
            count += 1
    print(f'  {count} brands from list 1 ($5M-$50M)')

    # --- Source 2: Apollo-enriched list 2 brands ---
    apollo_enriched_domains = set()
    if apollo_csv.exists():
        print('Loading Apollo-enriched brands (brands2_apollo.csv)...', flush=True)
        count = 0
        with open(apollo_csv, 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                domain_key = normalize_domain(row.get('domain', ''))
                if not domain_key or domain_key in seen_domains:
                    continue
                # Only keep if Apollo actually returned data
                if not row.get('apollo_id', '').strip():
                    continue
                seen_domains.add(domain_key)
                apollo_enriched_domains.add(domain_key)
                row['source'] = 'list2_apollo'
                all_rows.append(row)
                count += 1
        print(f'  {count} Apollo-enriched brands added')

    # --- Source 3: Remaining list 2 brands (basic data) ---
    print('Loading remaining list 2 brands (brands2.csv)...', flush=True)
    list2_rows = load_secondary_csv(list2_csv)
    count = 0
    for row in list2_rows:
        domain_key = normalize_domain(row.get('domain', ''))
        if not domain_key or domain_key in seen_domains:
            continue
        seen_domains.add(domain_key)
        row['source'] = 'list2'
        all_rows.append(row)
        count += 1
    print(f'  {count} basic list 2 brands added')

    print(f'\nTotal unique brands: {len(all_rows)}')

    # --- Build output fields ---
    output_fields = list1_fields + ['source'] + APOLLO_EXTRA_COLS + ENRICHED_COLUMNS
    # Deduplicate field names while preserving order
    seen_fields = set()
    deduped_fields = []
    for f in output_fields:
        if f not in seen_fields:
            deduped_fields.append(f)
            seen_fields.add(f)
    output_fields = deduped_fields

    # --- Enrich and write ---
    print('Enriching and writing...', flush=True)
    stats = {'list1': 0, 'list2_apollo': 0, 'list2': 0}
    tier_stats = {t: 0 for t in ['S', 'A', 'B', 'C', 'D']}
    qual_stats = {t: 0 for t in ['Hot', 'Warm', 'Cool', 'Cold']}

    with open(output_csv, 'w', newline='', encoding='utf-8') as fout:
        writer = csv.DictWriter(fout, fieldnames=output_fields, extrasaction='ignore')
        writer.writeheader()

        for row in all_rows:
            # For Apollo rows, map apollo_annual_revenue -> estimated_yearly_sales
            # so the enrichment scoring can use it
            if row.get('source') == 'list2_apollo':
                apollo_rev = row.get('apollo_annual_revenue', '')
                if apollo_rev and not row.get('estimated_yearly_sales'):
                    try:
                        rev_float = float(apollo_rev)
                        row['estimated_yearly_sales'] = f'USD ${rev_float:,.2f}'
                    except (ValueError, TypeError):
                        pass
                apollo_emp = row.get('apollo_estimated_employees', '')
                if apollo_emp and not row.get('employee_count'):
                    row['employee_count'] = apollo_emp

            enriched = enrich_row(row)
            row.update(enriched)
            writer.writerow(row)

            src = row.get('source', 'list2')
            stats[src] = stats.get(src, 0) + 1
            tier_stats[enriched['brand_tier']] += 1
            qual_stats[enriched['qualification_tier']] += 1

    print(f'\n=== OUTPUT: {len(all_rows)} brands -> {output_csv} ===')
    print(f'\n--- Source Distribution ---')
    for src, cnt in stats.items():
        print(f'  {src}: {cnt}')
    print(f'\n--- Brand Tier Distribution ---')
    for tier in ['S', 'A', 'B', 'C', 'D']:
        pct = tier_stats[tier] * 100 / len(all_rows) if all_rows else 0
        print(f'  {tier}: {tier_stats[tier]:>5} ({pct:.1f}%)')
    print(f'\n--- Qualification Tier Distribution ---')
    for tier in ['Hot', 'Warm', 'Cool', 'Cold']:
        pct = qual_stats[tier] * 100 / len(all_rows) if all_rows else 0
        print(f'  {tier:5}: {qual_stats[tier]:>5} ({pct:.1f}%)')


if __name__ == '__main__':
    main()
