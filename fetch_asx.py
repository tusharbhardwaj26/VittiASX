"""
ASX Daily Announcement Fetcher
--------------------------------
Fetches all ASX announcements for today, generates bullet-point summaries
using Groq AI, tags each announcement, and saves a dated JSON log to logs/.

Usage:
    python fetch_asx.py [--date YYYY-MM-DD]  (defaults to today)

GitHub Actions runs this daily at 10pm UTC (8am AEST next day).
"""

import os
import json
import time
import argparse
import requests
from datetime import datetime, timezone, timedelta
from pathlib import Path
from groq import Groq

# ─────────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────────

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = "llama-3.3-70b-versatile"

ASX_ANNOUNCEMENTS_URL = (
    "https://www.asx.com.au/asx/1/search/announcements"
    "?count=500&market_sensitive="
)

AEST = timezone(timedelta(hours=10))

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.asx.com.au/",
    "Origin": "https://www.asx.com.au",
}

KNOWN_TAGS = [
    "Results", "AGM", "Capital Raise", "Dividend",
    "Quarterly", "Production", "Merger & Acquisition",
    "Board Change", "Trading Halt", "Compliance",
    "Mining", "Healthcare", "Technology", "Finance",
    "Energy", "Property", "Retail", "Other",
]

LOGS_DIR = Path(__file__).parent / "logs"

# ─────────────────────────────────────────────────────────────
# Fetch
# ─────────────────────────────────────────────────────────────

def fetch_announcements(date_str: str) -> list[dict]:
    """Fetch all ASX announcements for a given date (YYYY-MM-DD)."""
    url = (
        f"https://www.asx.com.au/asx/1/search/announcements"
        f"?count=500&market_sensitive=&dateRange=custom"
        f"&startDate={date_str}&endDate={date_str}"
    )
    print(f"[fetch] GET {url}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        items = data.get("data", [])
        print(f"[fetch] Retrieved {len(items)} announcements")
        return items
    except Exception as e:
        print(f"[fetch] Error: {e}")
        return []


def parse_announcement(item: dict) -> dict:
    """Extract relevant fields from a raw ASX announcement item."""
    return {
        "ticker": item.get("issuer_code", ""),
        "company": item.get("issuer_full_name", ""),
        "headline": item.get("header", ""),
        "time": item.get("document_release_date", ""),
        "url": f"https://www.asx.com.au{item.get('url', '')}",
        "market_sensitive": bool(item.get("market_sensitive", False)),
        "document_type": item.get("document_type", ""),
        "summary": [],
        "tags": [],
    }


# ─────────────────────────────────────────────────────────────
# Groq AI Summarisation
# ─────────────────────────────────────────────────────────────

def build_prompt(headline: str, company: str, doc_type: str, market_sensitive: bool) -> str:
    sensitivity = "MARKET SENSITIVE" if market_sensitive else "not market sensitive"
    tags_list = ", ".join(KNOWN_TAGS)
    return f"""You are a financial analyst assistant specialising in ASX (Australian Securities Exchange) announcements.

Announcement details:
- Company: {company}
- Headline: {headline}
- Document Type: {doc_type}
- Market Sensitive: {sensitivity}

Tasks:
1. Write 3–5 concise bullet points summarising what this announcement likely covers based on the headline and document type. Each bullet should start with a dash (-).
2. Choose 1–4 relevant tags from this list only: {tags_list}

Respond in this exact JSON format (no markdown, no extra text):
{{
  "summary": ["bullet 1", "bullet 2", "bullet 3"],
  "tags": ["Tag1", "Tag2"]
}}"""


def summarise_batch(client: Groq, announcements: list[dict], delay: float = 1.0) -> list[dict]:
    """Summarise announcements one by one with rate-limit delay."""
    results = []
    total = len(announcements)

    for i, ann in enumerate(announcements, 1):
        print(f"[groq] {i}/{total}  {ann['ticker']} – {ann['headline'][:60]}")

        prompt = build_prompt(
            ann["headline"],
            ann["company"],
            ann["document_type"],
            ann["market_sensitive"],
        )

        try:
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=300,
            )
            raw = response.choices[0].message.content.strip()
            parsed = json.loads(raw)
            ann["summary"] = parsed.get("summary", [])
            ann["tags"] = parsed.get("tags", [])
        except json.JSONDecodeError:
            print(f"[groq] JSON parse error for {ann['ticker']}, using fallback")
            ann["summary"] = [f"ASX announcement: {ann['headline']}"]
            ann["tags"] = ["Other"]
        except Exception as e:
            print(f"[groq] Error for {ann['ticker']}: {e}")
            ann["summary"] = [f"ASX announcement: {ann['headline']}"]
            ann["tags"] = ["Other"]

        results.append(ann)

        if i < total:
            time.sleep(delay)

    return results


# ─────────────────────────────────────────────────────────────
# Save
# ─────────────────────────────────────────────────────────────

def save_log(date_str: str, announcements: list[dict]) -> Path:
    LOGS_DIR.mkdir(exist_ok=True)
    path = LOGS_DIR / f"{date_str}.json"

    payload = {
        "date": date_str,
        "total": len(announcements),
        "market_sensitive_count": sum(1 for a in announcements if a["market_sensitive"]),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "announcements": announcements,
    }

    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    print(f"[save] Written {len(announcements)} announcements → {path}")
    return path


# ─────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Fetch and summarise ASX announcements")
    parser.add_argument(
        "--date",
        default=datetime.now(AEST).strftime("%Y-%m-%d"),
        help="Date to fetch (YYYY-MM-DD), defaults to today AEST",
    )
    parser.add_argument(
        "--no-ai",
        action="store_true",
        help="Skip Groq summarisation (useful for testing)",
    )
    args = parser.parse_args()

    print(f"\n{'='*60}")
    print(f"  ASX Announcement Fetcher  |  {args.date}")
    print(f"{'='*60}\n")

    # 1. Fetch
    raw_items = fetch_announcements(args.date)
    if not raw_items:
        print("[main] No announcements found. Saving empty log.")
        save_log(args.date, [])
        return

    # 2. Parse
    announcements = [parse_announcement(item) for item in raw_items]

    # 3. Filter out blank headlines
    announcements = [a for a in announcements if a["headline"].strip()]
    print(f"[main] {len(announcements)} valid announcements after filtering")

    # 4. AI summarise
    if not args.no_ai:
        if not GROQ_API_KEY:
            print("[main] WARNING: GROQ_API_KEY not set. Using --no-ai fallback.")
            for a in announcements:
                a["summary"] = [f"ASX announcement: {a['headline']}"]
                a["tags"] = ["Other"]
        else:
            client = Groq(api_key=GROQ_API_KEY)
            announcements = summarise_batch(client, announcements, delay=0.5)
    else:
        for a in announcements:
            a["summary"] = [f"ASX announcement: {a['headline']}"]
            a["tags"] = ["Other"]

    # 5. Save
    save_log(args.date, announcements)
    print("\n[main] Done.")


if __name__ == "__main__":
    main()
