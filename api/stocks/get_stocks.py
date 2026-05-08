import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

SYMBOLS = [
    # Indices — no .us suffix on stooq
    {'stooq': '^dji',     'display': 'DOW'},
    {'stooq': '^spx',     'display': 'S&P 500'},
    {'stooq': '^ndx',     'display': 'NASDAQ'},
    # Magnificent 7
    {'stooq': 'aapl.us',  'display': 'AAPL'},
    {'stooq': 'msft.us',  'display': 'MSFT'},
    {'stooq': 'nvda.us',  'display': 'NVDA'},
    {'stooq': 'amzn.us',  'display': 'AMZN'},
    {'stooq': 'meta.us',  'display': 'META'},
    {'stooq': 'googl.us', 'display': 'GOOGL'},
    {'stooq': 'tsla.us',  'display': 'TSLA'},
]

CORS_HEADERS = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}


def fetch_one(sym):
    url = f'https://stooq.com/q/l/?s={urllib.parse.quote(sym)}&f=sd2t2ohlcv&h&e=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
        return data.get('symbols', [{}])[0]
    except Exception:
        return {}


import urllib.parse


def handler(event, context):
    try:
        with ThreadPoolExecutor(max_workers=10) as pool:
            futures = {pool.submit(fetch_one, s['stooq']): i for i, s in enumerate(SYMBOLS)}
            results = [None] * len(SYMBOLS)
            for future in as_completed(futures):
                results[futures[future]] = future.result()

        stocks = []
        for i, sym in enumerate(SYMBOLS):
            q = results[i] or {}
            price  = q.get('close') or 0
            open_p = q.get('open')  or price
            change = round(price - open_p, 2)
            pct    = round(change / open_p * 100, 2) if open_p else 0
            stocks.append({'display': sym['display'], 'price': price, 'change': change, 'changePercent': pct})

        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'stocks': stocks})}
    except Exception as e:
        return {'statusCode': 502, 'headers': CORS_HEADERS, 'body': json.dumps({'error': str(e)})}
