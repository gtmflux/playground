#!/usr/bin/env python3
"""
Google Revenue Scraper via DuckDuckGo HTML Search
==================================================
Searches DuckDuckGo for "{brand_name} annual revenue" and extracts
revenue figures from search result snippets.

Uses DuckDuckGo HTML endpoint (no JS required, less aggressive blocking).
Includes random delays, User-Agent rotation, and incremental saves.
"""

import argparse
import csv
import json
import random
import re
import html as html_mod
import sys
import time
from pathlib import Path

import requests


DDG_URL = "https://html.duckduckgo.com/html/"

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
]


def normalize_domain(value: str) -> str:
    d = value.strip().lower()
    d = re.sub(r'^https?://', '', d)
    d = re.sub(r'^www\.', '', d)
    d = d.rstrip('/')
    return d


def search_ddg(query: str) -> list[str]:
    """Search DuckDuckGo HTML and return result snippets.
    Uses a fresh session per request to avoid fingerprinting."""
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Referer': 'https://duckduckgo.com/',
        'DNT': '1',
    }
    try:
        session = requests.Session()
        resp = session.get(DDG_URL, params={'q': query}, headers=headers, timeout=15)
        if resp.status_code != 200:
            return []
        raw = resp.text
        # Extract result snippets
        results = re.findall(r'class="result__snippet"[^>]*>(.*?)</a>', raw, re.DOTALL)
        # Also extract result titles for additional context
        titles = re.findall(r'class="result__a"[^>]*>(.*?)</a>', raw, re.DOTALL)
        snippets = []
        for r in results:
            clean = html_mod.unescape(re.sub(r'<[^>]+>', '', r)).strip()
            if clean:
                snippets.append(clean)
        for t in titles:
            clean = html_mod.unescape(re.sub(r'<[^>]+>', '', t)).strip()
            if clean and any(w in clean.lower() for w in ['revenue', 'billion', 'million', '$']):
                snippets.append(clean)
        return snippets
    except (requests.RequestException, TimeoutError):
        return []


def extract_revenue(snippets: list[str]) -> dict | None:
    """Extract the best revenue figure from search snippets."""
    candidates = []

    for snippet in snippets:
        text = snippet.lower()

        # Pattern 1: $X billion/million
        for m in re.finditer(r'\$\s*([\d,\.]+)\s*(billion|million|trillion|b(?:illion)?|m(?:illion)?)\b', text):
            amount = float(m.group(1).replace(',', ''))
            unit = m.group(2)
            if unit.startswith('b'):
                amount *= 1_000_000_000
            elif unit.startswith('m'):
                amount *= 1_000_000
            elif unit.startswith('t'):
                amount *= 1_000_000_000_000
            candidates.append(amount)

        # Pattern 2: X billion/million in revenue/sales
        for m in re.finditer(r'([\d,\.]+)\s*(billion|million)\s*(?:in\s+)?(?:revenue|sales|annual)', text):
            amount = float(m.group(1).replace(',', ''))
            unit = m.group(2)
            if unit == 'billion':
                amount *= 1_000_000_000
            else:
                amount *= 1_000_000
            candidates.append(amount)

        # Pattern 3: revenue of $X,XXX,XXX or $XM/$XB
        for m in re.finditer(r'revenue[^.]{0,30}\$([\d,\.]+)\s*(b|m|k)?', text):
            amount = float(m.group(1).replace(',', ''))
            suffix = m.group(2) or ''
            if suffix == 'b':
                amount *= 1_000_000_000
            elif suffix == 'm':
                amount *= 1_000_000
            elif suffix == 'k':
                amount *= 1_000
            candidates.append(amount)

        # Pattern 4: US$XXXm format
        for m in re.finditer(r'us\$([\d,\.]+)\s*(b|m|k)', text):
            amount = float(m.group(1).replace(',', ''))
            suffix = m.group(2)
            if suffix == 'b':
                amount *= 1_000_000_000
            elif suffix == 'm':
                amount *= 1_000_000
            elif suffix == 'k':
                amount *= 1_000
            candidates.append(amount)

    if not candidates:
        return None

    # Filter to reasonable revenue range ($500K to $500B)
    valid = [c for c in candidates if 500_000 <= c <= 500_000_000_000]
    if not valid:
        return None

    # Return median to avoid outliers
    valid.sort()
    median = valid[len(valid) // 2]
    return {'revenue': median, 'count': len(valid)}


def format_revenue(amount: float) -> str:
    """Format revenue as a readable string like '$750M' or '$1.2B'."""
    if amount >= 1_000_000_000:
        return f"${amount / 1_000_000_000:.1f}B"
    elif amount >= 1_000_000:
        return f"${amount / 1_000_000:.0f}M"
    elif amount >= 1_000:
        return f"${amount / 1_000:.0f}K"
    return f"${amount:.0f}"


def main():
    parser = argparse.ArgumentParser(description='Scrape revenue data from Google/DDG')
    parser.add_argument('--input', default='brands_enriched.csv', help='Input CSV')
    parser.add_argument('-o', '--output', default='revenue_scraped.csv', help='Output CSV')
    parser.add_argument('--limit', type=int, default=0, help='Max brands to process')
    parser.add_argument('--delay-min', type=float, default=2.0, help='Min delay between requests')
    parser.add_argument('--delay-max', type=float, default=5.0, help='Max delay between requests')
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    # Load already-processed domains (for resume)
    already_done = set()
    if output_path.exists():
        with open(output_path, 'r', newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                d = normalize_domain(row.get('domain', ''))
                if d:
                    already_done.add(d)
    print(f'Already processed: {len(already_done)} (resume)', flush=True)

    # Load brands that need revenue
    print('Loading brands without revenue...', flush=True)
    todo = []
    with open(input_path, 'r', newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            domain = normalize_domain(row.get('domain', ''))
            if domain in already_done:
                continue
            # Skip if already has revenue
            rev = row.get('estimated_yearly_sales', '').strip()
            apollo_rev = row.get('apollo_annual_revenue', '').strip()
            if rev or apollo_rev:
                continue
            name = row.get('merchant_name', '').strip()
            if not name:
                continue
            todo.append({'domain': domain, 'merchant_name': name, 'source': row.get('source', '')})

    print(f'Brands to scrape: {len(todo)}', flush=True)

    if args.limit > 0:
        todo = todo[:args.limit]
        print(f'Limited to: {args.limit}')

    # Open output file
    out_fields = ['domain', 'merchant_name', 'scraped_revenue', 'scraped_revenue_printed',
                  'snippet_count', 'source', 'search_query']
    mode = 'a' if already_done else 'w'
    with open(output_path, mode, newline='', encoding='utf-8') as fout:
        writer = csv.DictWriter(fout, fieldnames=out_fields)
        if mode == 'w':
            writer.writeheader()

        found = 0
        not_found = 0
        consecutive_empty = 0
        start_time = time.time()

        for i, item in enumerate(todo):
            name = item['merchant_name']
            domain = item['domain']

            query = f"{name} annual revenue"

            # Retry logic for empty results (likely rate-limited)
            snippets = []
            for retry in range(3):
                snippets = search_ddg(query)
                if snippets:
                    consecutive_empty = 0
                    break
                # Back off before retry
                time.sleep(3 * (retry + 1))

            if not snippets:
                consecutive_empty += 1
                if consecutive_empty >= 5:
                    print(f'  WARNING: {consecutive_empty} consecutive empty results, '
                          f'cooling down 60s...', flush=True)
                    time.sleep(60)
                    consecutive_empty = 0

            result = extract_revenue(snippets) if snippets else None

            out_row = {
                'domain': domain,
                'merchant_name': name,
                'source': item['source'],
                'search_query': query,
            }

            if result:
                found += 1
                out_row['scraped_revenue'] = str(result['revenue'])
                out_row['scraped_revenue_printed'] = format_revenue(result['revenue'])
                out_row['snippet_count'] = str(result['count'])
            else:
                not_found += 1
                out_row['scraped_revenue'] = ''
                out_row['scraped_revenue_printed'] = ''
                out_row['snippet_count'] = '0'

            writer.writerow(out_row)

            # Progress
            total_done = i + 1
            if total_done % 25 == 0:
                elapsed = time.time() - start_time
                rate = total_done / elapsed * 60
                pct_found = found / total_done * 100 if total_done else 0
                remaining = (len(todo) - total_done) / (rate / 60) if rate > 0 else 0
                print(f'  [{total_done}/{len(todo)}] found={found} ({pct_found:.0f}%) '
                      f'rate={rate:.0f}/min ETA={remaining/60:.0f}min', flush=True)
                fout.flush()

            # Random delay to avoid blocking
            delay = random.uniform(args.delay_min, args.delay_max)
            time.sleep(delay)

    elapsed = time.time() - start_time
    print(f'\nDone! Scraped {len(todo)} brands in {elapsed:.0f}s')
    print(f'  Revenue found: {found}')
    print(f'  No data:       {not_found}')
    print(f'  Output:        {output_path}')


if __name__ == '__main__':
    main()
