import requests

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://www.asx.com.au/",
    "Origin": "https://www.asx.com.au",
}

# Test 1: Per-company announcements endpoint
print("--- Test 1: Per-company endpoint ---")
try:
    r = requests.get("https://www.asx.com.au/asx/1/company/BHP/announcements?count=10", headers=HEADERS, timeout=30)
    print(f"Status: {r.status_code}")
    print(r.text[:500])
except Exception as e:
    print(f"Error: {e}")

print()

# Test 2: Homepage feed (JSON)
print("--- Test 2: Homepage feed ---")
try:
    r = requests.get("https://www.asx.com.au/json/homepage_announcements.json", headers=HEADERS, timeout=30)
    print(f"Status: {r.status_code}")
    print(r.text[:500])
except Exception as e:
    print(f"Error: {e}")

print()

# Test 3: New-style search endpoint
print("--- Test 3: New search endpoint ---")
try:
    r = requests.get("https://www.asx.com.au/asx/1/search/announcements?count=10", headers=HEADERS, timeout=30)
    print(f"Status: {r.status_code}")
    print(r.text[:200])
except Exception as e:
    print(f"Error: {e}")
