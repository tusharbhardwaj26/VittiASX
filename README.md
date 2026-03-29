# Vitti ASX Intelligence Center

Welcome to the **Vitti ASX Intelligence Center**!

This is an automated tool designed to help you instantly understand what is happening on the Australian Securities Exchange (ASX), even if you have zero trading experience.

Every day, hundreds of companies release official announcements on the stock market. Reading through all of these dense, financial PDFs is impossible. This tool does the hard work for you.

---

## What This Tool Does For You

1. **Auto-Fetches the News:** Automatically pulls the latest official announcements from the ASX every 20 minutes during market hours.
2. **AI Summaries:** Instead of reading a 50-page PDF, AI reads it instantly and gives you 3 bullet points explaining what happened.
3. **Flags Market-Sensitive News:** The ASX tells us if a piece of news is expected to move the stock price. These are highlighted in your feed so you know what matters.
4. **Highlights Bullish News:** Our AI analyzes text and flags positive announcements with a green **▲ BULLISH** badge and a glowing green card.
5. **Tracks Substantial Holders:** Detects when major investors cross the 5% ownership threshold — a key signal for potential takeovers or institutional confidence.
6. **Organizes by Category:** Filter news by type — Bullish, Dividends, Capital Raises, Results, Substantial Holding, Trading Halts, and more.

---

## How to Use the Dashboard

1. **Pick a Date:** On the left sidebar, choose the date you want to inspect.
2. **Filter by Category:** Use the tab bar at the top to filter by "Bullish", "Substantial Holding", "Results", etc.
3. **Search:** Type a ticker (e.g. `BHP`) or company name into the search bar to find specific news.
4. **Market Overview:** The sidebar shows a live summary — total announcements, sensitive news count, substantial holders, bullish signals, active tickers, and trading halts.
5. **Export:** Click **Export CSV Data** in the sidebar to download the full day's data.

---

## How to Run Locally

1. Open your terminal and navigate to this folder.
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open your browser and go to: `http://localhost:3000`

The dashboard auto-refreshes every 5 minutes. To manually fetch fresh announcements, run:
```bash
python fetch_asx.py
```

---

## Automated Data Pipeline

The GitHub Actions workflow runs automatically during ASX market hours **(10:00 AM – 4:00 PM AEST, Monday–Friday)** at 20-minute intervals. Runs are offset to `:03`, `:23`, `:43` past the hour to reduce GitHub scheduler congestion.

> **Note:** GitHub's free-tier scheduler is not perfectly precise and may occasionally delay runs by up to 30 minutes. All runs are idempotent — re-running the script never creates duplicates.

You can also trigger a run manually from the **GitHub Actions** tab.

---

## For Developers & Technical Users

For a deeper understanding of the architecture and AI pipeline:

- [High-Level Design (HLD)](docs/HLD.md)
- [Low-Level Design (LLD)](docs/LLD.md)

---
*Created by [Tushar Bhardwaj](https://minianonlink.vercel.app/tusharbhardwaj) for automated market intelligence.*
