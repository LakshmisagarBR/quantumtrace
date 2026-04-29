import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio

app = FastAPI(title="QuantumTrace API", version="1.0")

# Allow CORS for local dev and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://quantumtrace.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ETHERSCAN_API_KEY = os.environ.get("ETHERSCAN_API_KEY", "")

@app.get("/health")
def health_check():
    return {"status": "ok", "chain": "ethereum", "version": "1.0"}

@app.get("/analyze/{address}")
async def analyze_address(address: str):
    # Validate address format
    if not address.startswith("0x") or len(address) != 42:
        raise HTTPException(status_code=400, detail="Invalid Ethereum address format")

    try:
        async with httpx.AsyncClient() as client:
            # 1. Fetch transaction list from Etherscan
            tx_url = f"https://api.etherscan.io/api?module=account&action=txlist&address={address}&sort=asc&apikey={ETHERSCAN_API_KEY}"
            tx_response = await client.get(tx_url)
            tx_data = tx_response.json()
            
            # Small delay to respect rate limit (Etherscan free tier is 5 calls/sec)
            await asyncio.sleep(0.2)

            # 2. Fetch ETH balance
            bal_url = f"https://api.etherscan.io/api?module=account&action=balance&address={address}&tag=latest&apikey={ETHERSCAN_API_KEY}"
            bal_response = await client.get(bal_url)
            bal_data = bal_response.json()

            # Process outgoing transactions
            tx_list = tx_data.get("result", [])
            if not isinstance(tx_list, list):
                tx_list = []
                
            outgoing_txs = [tx for tx in tx_list if tx.get("from", "").lower() == address.lower()]
            outgoing_count = len(outgoing_txs)
            
            is_exposed = outgoing_count > 0
            exposure_date = None
            exposure_duration = None
            first_exposure_timestamp = 0

            if is_exposed:
                import datetime
                from dateutil.relativedelta import relativedelta
                
                # First outgoing tx timestamp
                first_exposure_timestamp = int(outgoing_txs[0].get("timeStamp", 0))
                dt = datetime.datetime.fromtimestamp(first_exposure_timestamp)
                exposure_date = dt.strftime("%b %d, %Y")
                
                now = datetime.datetime.now()
                delta = relativedelta(now, dt)
                exposure_duration = f"{delta.years}Y {delta.months}M {delta.days}D"

            # Process Balance
            wei_balance = int(bal_data.get("result", 0)) if str(bal_data.get("result")).isdigit() else 0
            eth_balance = wei_balance / 10**18

            # Calculate mock risk score for now
            risk_score = 0
            if is_exposed:
                risk_score += 50
                # Years exposed max 30 points
                years_exposed = (datetime.datetime.now().year - datetime.datetime.fromtimestamp(first_exposure_timestamp).year)
                risk_score += min(years_exposed, 5) * 6
                risk_score += 10 # Some value score
                risk_score += min(outgoing_count, 100) // 10 # Some tx score
                risk_score = min(risk_score, 100)
            else:
                risk_score = 12 # Residual score

            risk_level = "CRITICAL" if risk_score > 60 else "MODERATE" if risk_score > 30 else "LOW"

            return {
                "address": address,
                "is_exposed": is_exposed,
                "exposure_date": exposure_date,
                "exposure_duration": exposure_duration,
                "outgoing_tx_count": outgoing_count,
                "total_tx_count": len(tx_list),
                "eth_balance": eth_balance,
                "total_value_usd": eth_balance * 3500, # Mock price
                "total_value_inr": eth_balance * 3500 * 83, # Mock price
                "risk_score": risk_score,
                "risk_level": risk_level,
                "recommendation": "Your wallet was first exposed...",
                "tokens": []
            }
            
    except Exception as e:
        raise HTTPException(status_code=503, detail="External API unavailable. Try again shortly.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
