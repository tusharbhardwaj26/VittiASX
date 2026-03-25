import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}
resp = requests.get("https://www.asx.com.au/asx/rss/market.do", headers=headers)
print(f"Status: {resp.status_code}")
print(f"Headers: {dict(resp.headers)}")
print("\n--- CONTENT PREVIEW ---\n")
print(resp.text[:1000])
