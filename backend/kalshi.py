import os
from pathlib import Path
from dotenv import load_dotenv
import requests
import json
import time
from datetime import date

load_dotenv()

API_BASE = "https://api.elections.kalshi.com/trade-api/v2"
KEY_ID = os.getenv("key_ID")

if not KEY_ID:
    raise RuntimeError("Missing key_ID in backend/.env")

def fetch_settled_markets():
    ts = int(time.time()) - 5 * 60
    all_markets = []
    cursor = None

    while True:
        params = {
            "status": "settled",
            "min_settled_ts": ts,
            "mve_filter": "exclude",
            "limit": 1000
        }
        if cursor:
            params["cursor"] = cursor

        r = requests.get(f"{API_BASE}/markets", params=params)
        r.raise_for_status()
        time.sleep(0.05)
        data = r.json()
        all_markets.extend(data.get("markets", []))
        cursor = data.get("cursor")
        if not cursor:
            break

    return all_markets

def find_losing_trades(markets):
    losing_trades = []
    for market in markets:
        ticker = market['ticker']
        r = requests.get(f"{API_BASE}/markets/trades", params={"ticker": ticker, "limit": 1000})
        r.raise_for_status()
        time.sleep(0.05)
        data = r.json()
        trades = data["trades"]
        cursor = data.get("cursor")
        while cursor:
            r = requests.get(
                f"{API_BASE}/markets/trades", 
                params={"ticker": ticker, "limit": 1000, "cursor": cursor})
            r.raise_for_status()
            data = r.json()
            trades.extend(data["trades"])
            cursor = data.get("cursor")
            time.sleep(0.05)
        for trade in trades:
            if trade['taker_side'] != market['result']:
                yes_price = float(trade['yes_price_dollars'])
                no_price = float(trade['no_price_dollars'])
                contracts = float(trade['count_fp'])
                entry_price = yes_price if trade['taker_side'] == 'yes' else no_price
                loss = round(entry_price * contracts, 2)

                losing_trades.append({
                    "ticker": ticker,
                    "taker_side": trade['taker_side'],
                    "entry_price": entry_price,
                    "contracts": contracts,
                    "loss": loss
                })
    return losing_trades

def get_losing_trades():
    print("Fetching settled markets...")
    markets = fetch_settled_markets()
    print(f"Found {len(markets)} settled markets")
    print("Finding losing trades...")
    losing_trades = find_losing_trades(markets)
    print(f"Found {len(losing_trades)} losing trades")
    return sorted(losing_trades, key=lambda x: x['loss'], reverse=True)

def update_top_ten(top_ten, new_trades):
    combined = top_ten + new_trades
    return sorted(combined, key=lambda x: x['loss'], reverse=True)[:10]

