import os
import re
import datetime
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dateutil.relativedelta import relativedelta
import httpx

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

@app.on_event("startup")
async def startup_check():
    if not ETHERSCAN_API_KEY:
        import warnings
        warnings.warn(
            "ETHERSCAN_API_KEY is not set. All analysis requests will fail. "
            "Set this environment variable before running in production.",
            RuntimeWarning
        )

@app.get("/health")
def health_check():
    return {"status": "ok", "chain": "ethereum", "version": "1.0"}

@app.get("/analyze/{address}")
async def analyze_address(address: str):
    # Validate address format
    if not re.match(r'^0x[0-9a-fA-F]{40}$', address):
        raise HTTPException(status_code=400, detail="Invalid Ethereum address format. Must be a 42-character hex string starting with 0x.")

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

            await asyncio.sleep(0.2)
            price_url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr"
            price_response = await client.get(price_url)
            price_data = price_response.json()
            eth_usd = price_data.get("ethereum", {}).get("usd", 3500)
            eth_inr = price_data.get("ethereum", {}).get("inr", 290000)

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
            delta = None

            if is_exposed:
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

            # --- Risk Score Calculation ---
            risk_score = 0

            if is_exposed:
                # Base score for any exposure at all
                exposure_binary = 50

                # Years exposed: use the relativedelta already calculated above
                # delta.years gives accurate full years, not calendar year subtraction
                years_score = min(delta.years, 5) * 6  # Max 30 points

                # Value score based on INR brackets
                total_inr = eth_balance * eth_inr  # uses real price from CoinGecko
                if total_inr >= 500000:
                    value_score = 10
                elif total_inr >= 100000:
                    value_score = 7
                elif total_inr >= 10000:
                    value_score = 4
                else:
                    value_score = 0

                # Transaction count score based on brackets
                if outgoing_count > 200:
                    tx_score = 10
                elif outgoing_count > 50:
                    tx_score = 7
                elif outgoing_count > 5:
                    tx_score = 4
                else:
                    tx_score = 0

                risk_score = min(exposure_binary + years_score + value_score + tx_score, 100)

            else:
                # Not exposed: only residual balance risk applies, max 20 points
                total_inr = eth_balance * eth_inr
                if total_inr >= 500000:
                    risk_score = 20
                elif total_inr >= 100000:
                    risk_score = 14
                elif total_inr >= 10000:
                    risk_score = 8
                else:
                    risk_score = 5

            risk_level = "CRITICAL" if risk_score > 60 else "MODERATE" if risk_score > 30 else "LOW"

            if is_exposed:
                recommendation = (
                    f"Your wallet was first exposed on {exposure_date}, giving adversaries "
                    f"{delta.years} year{'s' if delta.years != 1 else ''} to harvest your public key. "
                    f"Combined with ₹{round(total_inr):,} in exposed assets and "
                    f"{outgoing_count} on-chain signatures, this wallet represents a "
                    f"{risk_level.lower()}-priority migration target. "
                    f"Cryptographically relevant quantum computers are projected to arrive by 2029. "
                    f"Immediate action: move all assets to a fresh wallet address that has never sent a transaction."
                )
            else:
                recommendation = (
                    f"This wallet has never sent a transaction, meaning its public key has never "
                    f"been revealed on the Ethereum blockchain. It is currently safe from quantum attacks. "
                    f"To maintain this safety, avoid sending any transaction from this address until "
                    f"Ethereum's EIP-8141 upgrade ships in late 2026 with native quantum-resistant signatures."
                )

            return {
                "address": address,
                "is_exposed": is_exposed,
                "exposure_date": exposure_date,
                "exposure_duration": exposure_duration,
                "outgoing_tx_count": outgoing_count,
                "total_tx_count": len(tx_list),
                "eth_balance": eth_balance,
                "total_value_usd": round(eth_balance * eth_usd, 2),
                "total_value_inr": round(eth_balance * eth_inr, 2),
                "risk_score": risk_score,
                "risk_level": risk_level,
                "recommendation": recommendation,
                "tokens": []
            }
            
    except Exception as e:
        raise HTTPException(status_code=503, detail="External API unavailable. Try again shortly.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
