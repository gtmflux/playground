#!/usr/bin/env python3
"""
Apollo Organization Enrichment for List 2 Brands
=================================================
Reads the secondary brand list (brands2.csv), skips domains already in the
primary list (brands.csv), and enriches each net-new domain via the Apollo
Organization Enrich API.

Outputs brands2_apollo.csv with Apollo data mapped to the primary schema +
extra Apollo-specific columns.

Features:
  - Incremental progress: saves after every batch so work isn't lost
  - Resumes from where it left off if the output file already exists
  - Rate-limited to stay under Apollo's 1000 req/min limit
"""

import argparse
import csv
import json
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

APOLLO_ENRICH_URL = "https://api.apollo.io/api/v1/organizations/enrich"
CONCURRENCY = 3   # parallel requests
BATCH_SIZE = 100  # progress reporting interval
MAX_PER_MINUTE = 900  # stay under Apollo's 1000/min limit


class RateLimiter:
    """Token-bucket rate limiter."""
    def __init__(self, max_per_minute: int):
        self._interval = 60.0 / max_per_minute
        self._lock = threading.Lock()
        self._last = 0.0

    def wait(self):
        with self._lock:
            now = time.monotonic()
            wait_time = self._last + self._interval - now
            if wait_time > 0:
                time.sleep(wait_time)
            self._last = time.monotonic()


def normalize_domain(value: str) -> str:
    d = value.strip().lower()
    d = re.sub(r'^https?://', '', d)
    d = re.sub(r'^www\.', '', d)
    d = d.rstrip('/')
    return d


def call_apollo(api_key: str, domain: str, session: requests.Session) -> dict | None:
    """Call Apollo Organization Enrich API. Returns org dict or None."""
    payload = {"api_key": api_key, "domain": domain}

    for attempt in range(3):
        try:
            resp = session.post(APOLLO_ENRICH_URL, json=payload, timeout=15)
            if resp.status_code == 200:
                return resp.json().get('organization')
            elif resp.status_code == 429:
                wait = 2 ** (attempt + 1)
                print(f'  Rate limited, waiting {wait}s...', flush=True)
                time.sleep(wait)
            elif resp.status_code == 422:
                return None
            else:
                print(f'  HTTP {resp.status_code} for {domain}, attempt {attempt+1}', flush=True)
                time.sleep(1)
        except (requests.RequestException, TimeoutError):
            time.sleep(1)
    return None


# Output columns: primary schema fields + Apollo-specific extras
OUTPUT_FIELDS = [
    'domain', 'domain_url', 'merchant_name', 'description', 'categories',
    'city', 'state', 'country_code', 'company_location', 'street_address',
    'zip', 'employee_count', 'emails', 'phones',
    'facebook', 'instagram', 'twitter', 'linkedin_url', 'linkedin_account',
    # Apollo extras
    'apollo_id', 'apollo_industry', 'apollo_keywords',
    'apollo_annual_revenue', 'apollo_annual_revenue_printed',
    'apollo_estimated_employees', 'apollo_founded_year',
    'apollo_total_funding', 'apollo_latest_funding_stage',
    'apollo_technologies', 'apollo_short_description',
    'apollo_logo_url', 'apollo_alexa_ranking',
    'apollo_sic_codes', 'apollo_naics_codes',
    'apollo_departmental_headcount',
    'source',
]


def map_apollo_to_row(org: dict, original_row: dict) -> dict:
    """Map Apollo API response fields to our output schema."""
    row = dict(original_row)  # Start with existing data from brands2

    if not org:
        row['source'] = 'list2'
        return row

    # Map core fields (only fill if not already present)
    if not row.get('merchant_name'):
        row['merchant_name'] = org.get('name', '')
    if not row.get('description'):
        row['description'] = org.get('short_description', '')

    row['domain'] = normalize_domain(org.get('primary_domain', '') or row.get('domain', ''))
    row['domain_url'] = org.get('website_url', '') or row.get('domain_url', '')

    # Location
    row['city'] = org.get('city', '') or row.get('city', '')
    row['state'] = org.get('state', '') or row.get('state', '')
    country = org.get('country', '')
    row['country_code'] = country_to_code(country) if country else ''
    row['company_location'] = org.get('raw_address', '') or row.get('company_location', '')
    row['street_address'] = org.get('street_address', '') or ''
    row['zip'] = org.get('postal_code', '') or ''

    # Contact
    row['phones'] = org.get('phone', '') or ''
    row['employee_count'] = str(org.get('estimated_num_employees', '')) if org.get('estimated_num_employees') else ''

    # Social
    fb_url = org.get('facebook_url', '') or ''
    row['facebook'] = extract_handle(fb_url) if fb_url else ''
    tw_url = org.get('twitter_url', '') or ''
    row['twitter'] = extract_handle(tw_url) if tw_url else ''
    li_url = org.get('linkedin_url', '') or row.get('linkedin_url', '')
    row['linkedin_url'] = li_url
    row['linkedin_account'] = extract_handle(li_url) if li_url else ''

    # Apollo-specific enrichment
    row['apollo_id'] = org.get('id', '')
    row['apollo_industry'] = org.get('industry', '')
    keywords = org.get('keywords', []) or []
    row['apollo_keywords'] = ':'.join(keywords[:20])
    row['apollo_annual_revenue'] = str(org.get('annual_revenue', '')) if org.get('annual_revenue') else ''
    row['apollo_annual_revenue_printed'] = org.get('annual_revenue_printed', '') or ''
    row['apollo_estimated_employees'] = str(org.get('estimated_num_employees', '')) if org.get('estimated_num_employees') else ''
    row['apollo_founded_year'] = str(org.get('founded_year', '')) if org.get('founded_year') else ''
    row['apollo_total_funding'] = str(org.get('total_funding', '')) if org.get('total_funding') else ''
    row['apollo_latest_funding_stage'] = org.get('latest_funding_stage', '') or ''
    tech_names = org.get('technology_names', []) or []
    row['apollo_technologies'] = ':'.join(tech_names)
    row['apollo_short_description'] = org.get('short_description', '') or ''
    row['apollo_logo_url'] = org.get('logo_url', '') or ''
    row['apollo_alexa_ranking'] = str(org.get('alexa_ranking', '')) if org.get('alexa_ranking') else ''
    sic = org.get('sic_codes', []) or []
    row['apollo_sic_codes'] = ':'.join(sic)
    naics = org.get('naics_codes', []) or []
    row['apollo_naics_codes'] = ':'.join(naics)
    dept = org.get('departmental_head_count', {}) or {}
    row['apollo_departmental_headcount'] = json.dumps(dept) if dept else ''

    row['source'] = 'list2_apollo'
    return row


COUNTRY_MAP = {
    'united states': 'US', 'canada': 'CA', 'mexico': 'MX',
    'united kingdom': 'GB', 'germany': 'DE', 'france': 'FR',
    'italy': 'IT', 'spain': 'ES', 'netherlands': 'NL',
    'sweden': 'SE', 'norway': 'NO', 'denmark': 'DK',
    'finland': 'FI', 'belgium': 'BE', 'austria': 'AT',
    'switzerland': 'CH', 'ireland': 'IE', 'portugal': 'PT',
    'poland': 'PL', 'czech republic': 'CZ', 'australia': 'AU',
    'new zealand': 'NZ', 'japan': 'JP', 'south korea': 'KR',
    'china': 'CN', 'india': 'IN', 'singapore': 'SG',
    'hong kong': 'HK', 'taiwan': 'TW', 'brazil': 'BR',
    'argentina': 'AR', 'colombia': 'CO', 'chile': 'CL',
    'israel': 'IL', 'turkey': 'TR', 'south africa': 'ZA',
    'united arab emirates': 'AE', 'saudi arabia': 'SA',
}


def country_to_code(country: str) -> str:
    return COUNTRY_MAP.get(country.strip().lower(), '')


def extract_handle(url: str) -> str:
    """Extract the last path segment as a social handle."""
    url = url.strip().rstrip('/')
    if '/' in url:
        return url.rsplit('/', 1)[-1]
    return url


LIST2_COLUMN_MAP = {
    'Domain Name': 'domain',
    'domain_url': 'domain_url',
    'merchant_name': 'merchant_name',
    'categories': 'categories',
    'city': 'city',
    'company_location': 'company_location',
    'description': 'description',
    'linkedin_url': 'linkedin_url',
}


def load_list2(path: Path) -> list[dict]:
    rows = []
    with open(path, 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for raw in reader:
            row = {}
            for src_col, dst_col in LIST2_COLUMN_MAP.items():
                val = raw.get(src_col, '').strip()
                if val:
                    row[dst_col] = val
            if 'domain' not in row and 'domain_url' in row:
                row['domain'] = normalize_domain(row['domain_url'])
            elif 'domain' in row:
                row['domain'] = normalize_domain(row['domain'])
            rows.append(row)
    return rows


def load_primary_domains(path: Path) -> set[str]:
    domains = set()
    with open(path, 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            d = normalize_domain(row.get('domain', ''))
            if d:
                domains.add(d)
    return domains


def load_already_done(path: Path) -> set[str]:
    """Load domains already processed from an existing output file."""
    if not path.exists():
        return set()
    done = set()
    with open(path, 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            d = normalize_domain(row.get('domain', ''))
            if d:
                done.add(d)
    return done


def main():
    parser = argparse.ArgumentParser(description='Enrich list 2 brands via Apollo API')
    parser.add_argument('--api-key', required=True, help='Apollo API key')
    parser.add_argument('--primary', default='brands.csv', help='Primary CSV (for dedup)')
    parser.add_argument('--secondary', default='brands2.csv', help='Secondary CSV to enrich')
    parser.add_argument('-o', '--output', default='brands2_apollo.csv', help='Output path')
    parser.add_argument('--limit', type=int, default=0, help='Max domains to process (0=all)')
    args = parser.parse_args()

    primary_path = Path(args.primary)
    secondary_path = Path(args.secondary)
    output_path = Path(args.output)

    # Load primary domains for dedup
    print('Loading primary domains for dedup...', flush=True)
    primary_domains = load_primary_domains(primary_path)
    print(f'  {len(primary_domains)} primary domains loaded')

    # Load already-processed domains (for resume)
    already_done = load_already_done(output_path)
    print(f'  {len(already_done)} already processed (resume)')

    # Load secondary list
    print('Loading secondary list...', flush=True)
    list2_rows = load_list2(secondary_path)
    print(f'  {len(list2_rows)} rows loaded')

    # Filter to net-new domains only
    todo = []
    seen = set()
    for row in list2_rows:
        d = normalize_domain(row.get('domain', ''))
        if not d or d in primary_domains or d in seen:
            continue
        seen.add(d)
        if d not in already_done:
            todo.append(row)

    print(f'  {len(todo)} net-new domains to enrich via Apollo')
    if args.limit > 0:
        todo = todo[:args.limit]
        print(f'  Limited to {args.limit}')

    # Open output file (append if resuming, write if fresh)
    mode = 'a' if already_done else 'w'
    with open(output_path, mode, newline='', encoding='utf-8') as fout:
        writer = csv.DictWriter(fout, fieldnames=OUTPUT_FIELDS, extrasaction='ignore')
        if mode == 'w':
            writer.writeheader()

        enriched_count = 0
        skipped_count = 0
        processed_count = 0
        write_lock = threading.Lock()
        rate_limiter = RateLimiter(MAX_PER_MINUTE)
        start_time = time.time()
        session = requests.Session()
        session.headers.update({'Content-Type': 'application/json', 'Cache-Control': 'no-cache'})

        def process_one(idx_row):
            idx, row = idx_row
            domain = normalize_domain(row.get('domain', ''))
            rate_limiter.wait()
            org = call_apollo(args.api_key, domain, session)
            return idx, row, org

        with ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
            futures = {executor.submit(process_one, (i, row)): i
                       for i, row in enumerate(todo)}

            for future in as_completed(futures):
                idx, row, org = future.result()

                with write_lock:
                    if org:
                        enriched_count += 1
                    else:
                        skipped_count += 1
                    processed_count += 1

                    mapped = map_apollo_to_row(org, row)
                    writer.writerow(mapped)

                    if processed_count % BATCH_SIZE == 0:
                        elapsed = time.time() - start_time
                        rate = processed_count / elapsed * 60
                        remaining = (len(todo) - processed_count) / (rate / 60) if rate > 0 else 0
                        print(f'  [{processed_count}/{len(todo)}] enriched={enriched_count} '
                              f'skipped={skipped_count} rate={rate:.0f}/min '
                              f'ETA={remaining/60:.0f}min', flush=True)
                        fout.flush()

    elapsed = time.time() - start_time
    print(f'\nDone! Processed {len(todo)} domains in {elapsed:.0f}s')
    print(f'  Enriched: {enriched_count}')
    print(f'  No data:  {skipped_count}')
    print(f'  Output:   {output_path}')


if __name__ == '__main__':
    main()
