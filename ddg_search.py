import urllib.request
import json
import ssl
from urllib.parse import quote

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

q = quote("how to pass solution_id in facebook embedded signup extras setup")
req = urllib.request.Request(
    f"https://html.duckduckgo.com/html/?q={q}",
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'}
)
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        html = response.read().decode('utf-8')
        print(html)
except Exception as e:
    print(f"Error: {e}")
