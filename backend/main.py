import os
import re
import datetime
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dateutil.relativedelta import relativedelta
import httpx
import base58

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv not installed, rely on system env vars


def validate_bitcoin_address(address: str) -> bool:
    """
    Validates Bitcoin addresses across all three main formats:
    P2PKH (starts with 1), P2SH (starts with 3),
    and P2WPKH (starts with bc1q).
    """
    # P2PKH: starts with 1, 25-34 chars, base58 characters only
    p2pkh = re.match(r'^1[a-km-zA-HJ-NP-Z1-9]{24,33}$', address)
    # P2SH: starts with 3, 34 chars, base58 characters only
    p2sh = re.match(r'^3[a-km-zA-HJ-NP-Z1-9]{33}$', address)
    # P2WPKH: starts with bc1q, 42 chars total
    p2wpkh = re.match(r'^bc1q[a-z0-9]{38,}$', address)
    return bool(p2pkh or p2sh or p2wpkh)


def validate_solana_address(address: str) -> bool:
    """
    Validates Solana addresses. These are base58-encoded
    32-byte Ed25519 public keys, typically 32-44 characters.
    """
    # Solana addresses are base58, 32-44 characters
    if not re.match(r'^[1-9A-HJ-NP-Za-km-z]{32,44}$', address):
        return False
    # Additional check: must be valid base58
    try:
        decoded = base58.b58decode(address)
        return len(decoded) == 32
    except Exception:
        return False


def validate_xrp_address(address: str) -> bool:
    """
    Validates XRP Ledger addresses. These start with 'r'
    and are 25-34 base58check characters total.
    """
    return bool(re.match(r'^r[a-km-zA-HJ-NP-Z1-9]{24,33}$', address))


app = FastAPI(title="QuantumTrace API", version="2.0")

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

@app.api_route("/health", methods=["GET", "HEAD"])
def health_check():
    return {"status": "ok", "chains": ["ethereum", "bitcoin", "solana", "xrp"], "version": "2.0"}

@app.get("/analyze/{address}")
async def analyze_address(address: str):
    # Validate address format
    if not re.match(r'^0x[0-9a-fA-F]{40}$', address):
        raise HTTPException(status_code=400, detail="Invalid Ethereum address format. Must be a 42-character hex string starting with 0x.")

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 1. Paginate Etherscan txlist to fetch ALL transactions
            # Etherscan V2 supports page/offset for pagination (max offset=10000)
            all_outgoing_txs = []
            total_tx_count = 0
            page_num = 1
            page_size = 10000
            max_pages = 10  # Cap at 100k txs to avoid timeout

            while page_num <= max_pages:
                tx_url = (
                    f"https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist"
                    f"&address={address}&sort=asc&page={page_num}&offset={page_size}"
                    f"&apikey={ETHERSCAN_API_KEY}"
                )
                tx_response = await client.get(tx_url)
                tx_data = tx_response.json()

                # Check if Etherscan returned an error
                if tx_data.get("status") == "0" and not isinstance(tx_data.get("result"), list):
                    error_msg = tx_data.get("result", "Unknown Etherscan error")
                    if "Invalid API" in str(error_msg) or "Missing" in str(error_msg) or "deprecated" in str(error_msg).lower():
                        raise HTTPException(status_code=502, detail=f"Etherscan API error: {error_msg}")
                    if "No transactions found" not in str(error_msg):
                        raise HTTPException(status_code=502, detail=f"Etherscan error: {error_msg}")
                    break  # No transactions found — stop paging

                page_txs = tx_data.get("result", [])
                if not isinstance(page_txs, list) or len(page_txs) == 0:
                    break

                total_tx_count += len(page_txs)
                outgoing_in_page = [tx for tx in page_txs if tx.get("from", "").lower() == address.lower()]
                all_outgoing_txs.extend(outgoing_in_page)

                if len(page_txs) < page_size:
                    break  # Last page

                page_num += 1
                await asyncio.sleep(0.2)  # Rate-limit between pages

            # Small delay to respect rate limit (Etherscan free tier is 5 calls/sec)
            await asyncio.sleep(0.2)

            # 2. Fetch ETH balance (V2 API)
            bal_url = f"https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address={address}&tag=latest&apikey={ETHERSCAN_API_KEY}"
            bal_response = await client.get(bal_url)
            bal_data = bal_response.json()

            # Check if balance fetch failed
            if bal_data.get("status") == "0" and ("Invalid API" in str(bal_data.get("result", "")) or "deprecated" in str(bal_data.get("result", "")).lower()):
                raise HTTPException(status_code=502, detail=f"Etherscan API error: {bal_data.get('result', '')}")

            await asyncio.sleep(0.2)
            price_url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr"
            price_response = await client.get(price_url)
            price_data = price_response.json()
            eth_usd = price_data.get("ethereum", {}).get("usd", 3500)
            eth_inr = price_data.get("ethereum", {}).get("inr", 290000)

            # Process outgoing transactions (already collected via pagination)
            outgoing_count = len(all_outgoing_txs)
            
            is_exposed = outgoing_count > 0
            exposure_date = None
            exposure_duration = None
            first_exposure_timestamp = 0
            delta = None

            if is_exposed:
                # First outgoing tx timestamp
                first_exposure_timestamp = int(all_outgoing_txs[0].get("timeStamp", 0))
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
            total_usd = eth_balance * eth_usd

            if is_exposed:
                # Graduated exposure score based on outgoing transaction count
                if outgoing_count > 50:
                    exposure_score = 50
                elif outgoing_count > 10:
                    exposure_score = 45
                elif outgoing_count > 2:
                    exposure_score = 40
                else:
                    exposure_score = 30  # 1-2 outgoing txs

                # Years exposed: use the relativedelta already calculated above
                # delta.years gives accurate full years, not calendar year subtraction
                years_score = min(delta.years, 5) * 6  # Max 30 points

                # Value score based on USD brackets (using CoinGecko price)
                if total_usd >= 100000:
                    value_score = 10
                elif total_usd >= 25000:
                    value_score = 7
                elif total_usd >= 5000:
                    value_score = 5
                elif total_usd >= 500:
                    value_score = 3
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

                risk_score = min(exposure_score + years_score + value_score + tx_score, 100)

            else:
                # Not exposed: only residual balance risk applies, max 20 points
                if total_usd >= 100000:
                    risk_score = 20
                elif total_usd >= 25000:
                    risk_score = 14
                elif total_usd >= 5000:
                    risk_score = 8
                else:
                    risk_score = 5

            risk_level = "CRITICAL" if risk_score > 60 else "MODERATE" if risk_score > 30 else "LOW"

            if is_exposed:
                recommendation = (
                    f"Your wallet was first exposed on {exposure_date}, giving adversaries "
                    f"{delta.years} year{'s' if delta.years != 1 else ''} to harvest your public key. "
                    f"Combined with ${round(total_usd):,} in exposed assets and "
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
                "chain": "ethereum",
                "address": address,
                "is_exposed": is_exposed,
                "exposure_date": exposure_date,
                "exposure_duration": exposure_duration,
                "outgoing_tx_count": outgoing_count,
                "total_tx_count": total_tx_count,
                "eth_balance": eth_balance,
                "balance": eth_balance,
                "balance_unit": "ETH",
                "total_value_usd": round(eth_balance * eth_usd, 2),
                "total_value_inr": round(eth_balance * eth_inr, 2),
                "risk_score": risk_score,
                "risk_level": risk_level,
                "recommendation": recommendation,
                "migration_note": "Ethereum Strawmap targets full quantum resistance by 2030 via EIP-8141.",
                "tokens": []
            }
            
    except HTTPException:
        raise  # Re-raise our specific error messages (e.g. invalid API key)
    except Exception as e:
        raise HTTPException(status_code=503, detail="External API unavailable. Try again shortly.")

@app.get("/analyze/bitcoin/{address}")
async def analyze_bitcoin(address: str):
    """
    Analyzes a Bitcoin address for quantum vulnerability.
    Checks all three address formats (P2PKH, P2SH, P2WPKH).
    Uses Blockchain.info API (free, no key required).
    """

    # Step 1: Validate the Bitcoin address format
    if not validate_bitcoin_address(address):
        raise HTTPException(
            status_code=400,
            detail="Invalid Bitcoin address. Must be a P2PKH (starts with 1), P2SH (starts with 3), or P2WPKH (starts with bc1q) address."
        )

    async with httpx.AsyncClient(timeout=20.0) as client:

        # Step 2: Fetch transaction history from Blockchain.info
        # Paginate using offset to get ALL transactions (not just first 50)
        # The rawaddr API returns newest-first; n_tx gives the total count
        try:
            # First call to get n_tx (total count) and first batch
            tx_url = f"https://blockchain.info/rawaddr/{address}?limit=100&offset=0"
            tx_response = await client.get(tx_url)
            tx_data = tx_response.json()
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail="Could not reach Bitcoin blockchain data provider. Please try again shortly."
            )

        # Step 3: Determine exposure status by paginating ALL transactions
        # For Bitcoin, any outgoing transaction (where this address
        # is in the inputs) reveals the public key via scriptSig
        total_tx_count = tx_data.get("n_tx", 0)
        btc_balance_satoshis = tx_data.get("final_balance", 0)  # Grab balance from first response

        is_exposed = False
        exposure_date = None
        exposure_duration = None
        outgoing_count = 0
        first_exposure_timestamp = None

        # Process first batch
        transactions = tx_data.get("txs", [])
        for tx in transactions:
            inputs = tx.get("inputs", [])
            for inp in inputs:
                prev_out = inp.get("prev_out", {})
                if prev_out.get("addr") == address:
                    outgoing_count += 1
                    # Track the oldest (largest time value will be overwritten
                    # by older ones as we paginate to earlier txs)
                    tx_time = tx.get("time")
                    if tx_time:
                        if not is_exposed:
                            is_exposed = True
                        # Always update — since we're going newest→oldest,
                        # the last one we see will be the oldest
                        first_exposure_timestamp = tx_time

        # Paginate remaining pages if there are more txs
        fetched = len(transactions)
        page_size = 100
        max_pages = 50  # Cap at 5000 txs to avoid timeout

        page = 1
        while fetched < total_tx_count and page < max_pages:
            await asyncio.sleep(0.4)  # Rate-limit — Blockchain.info has no key

            # Fetch with retry on rate limits
            page_txs = None
            for retry in range(3):
                try:
                    offset_url = f"https://blockchain.info/rawaddr/{address}?limit={page_size}&offset={fetched}"
                    offset_response = await client.get(offset_url)

                    # Blockchain.info returns 429 on rate limit
                    if offset_response.status_code == 429 or offset_response.status_code >= 500:
                        await asyncio.sleep(1.0 * (2 ** retry))
                        continue

                    offset_data = offset_response.json()
                    page_txs = offset_data.get("txs", [])
                    break  # Success
                except Exception:
                    await asyncio.sleep(1.0 * (2 ** retry))
                    continue

            if not page_txs:
                break  # Exhausted retries or no more txs

            for tx in page_txs:
                inputs = tx.get("inputs", [])
                for inp in inputs:
                    prev_out = inp.get("prev_out", {})
                    if prev_out.get("addr") == address:
                        outgoing_count += 1
                        tx_time = tx.get("time")
                        if tx_time:
                            if not is_exposed:
                                is_exposed = True
                            first_exposure_timestamp = tx_time

            fetched += len(page_txs)
            page += 1

        # Step 4: Calculate exposure duration if exposed
        if is_exposed and first_exposure_timestamp:
            first_dt = datetime.datetime.fromtimestamp(
                first_exposure_timestamp, tz=datetime.timezone.utc
            )
            exposure_date = first_dt.strftime("%b %d, %Y")
            now = datetime.datetime.now(tz=datetime.timezone.utc)
            delta = relativedelta(now, first_dt)
            exposure_duration = f"{delta.years}Y {delta.months}M {delta.days}D"
        else:
            delta = None

        # Step 5: Convert BTC balance (already fetched from first rawaddr response)
        # 1 BTC = 100,000,000 satoshis
        btc_balance = btc_balance_satoshis / 100_000_000

        # Step 6: Fetch real BTC price from CoinGecko
        await asyncio.sleep(0.2)
        try:
            price_url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr"
            price_response = await client.get(price_url)
            price_data = price_response.json()
            btc_usd = price_data.get("bitcoin", {}).get("usd", 60000)
            btc_inr = price_data.get("bitcoin", {}).get("inr", 5000000)
        except Exception:
            btc_usd = 60000
            btc_inr = 5000000

        total_value_usd = round(btc_balance * btc_usd, 2)
        total_value_inr = round(btc_balance * btc_inr, 2)

        # Step 7: Calculate risk score using the same weighted formula
        # Bitcoin gets a severity multiplier because it has NO migration
        # plan and the Google paper specifically targeted Bitcoin's timeline
        risk_score = 0
        if is_exposed:
            # Graduated exposure score based on outgoing transaction count
            if outgoing_count > 50:
                exposure_score = 50
            elif outgoing_count > 10:
                exposure_score = 45
            elif outgoing_count > 2:
                exposure_score = 40
            else:
                exposure_score = 30  # 1-2 outgoing txs
            years_score = min(delta.years, 5) * 6 if delta else 0
            # Value score based on USD brackets
            if total_value_usd >= 100000:
                value_score = 10
            elif total_value_usd >= 25000:
                value_score = 7
            elif total_value_usd >= 5000:
                value_score = 5
            elif total_value_usd >= 500:
                value_score = 3
            else:
                value_score = 0
            if outgoing_count > 200:
                tx_score = 10
            elif outgoing_count > 50:
                tx_score = 7
            elif outgoing_count > 5:
                tx_score = 4
            else:
                tx_score = 0
            risk_score = min(exposure_score + years_score + value_score + tx_score, 100)
        else:
            if total_value_usd >= 100000:
                risk_score = 20
            elif total_value_usd >= 25000:
                risk_score = 14
            elif total_value_usd >= 5000:
                risk_score = 8
            else:
                risk_score = 5

        risk_level = "CRITICAL" if risk_score > 60 else "MODERATE" if risk_score > 30 else "LOW"

        # Step 8: Generate recommendation string
        if is_exposed:
            recommendation = (
                f"Your Bitcoin wallet was first exposed on {exposure_date}, "
                f"giving adversaries {delta.years if delta else 0} year{'s' if delta and delta.years != 1 else ''} "
                f"to harvest your public key. Bitcoin has NO quantum migration roadmap — "
                f"BIP 360 is debated with no implementation timeline. With ${round(total_value_usd):,} "
                f"at risk and no protocol-level fix coming, this represents a {risk_level.lower()}-priority "
                f"situation. Immediate action: move all BTC to a fresh address that has never spent."
            )
        else:
            recommendation = (
                f"This Bitcoin address has never spent any funds, meaning its public key has "
                f"never been revealed on-chain. It is currently safe from quantum attacks. "
                f"Monitor BIP 360 developments, though no implementation timeline exists as of 2026."
            )

        # Step 9: Return the complete response
        return {
            "chain": "bitcoin",
            "address": address,
            "is_exposed": is_exposed,
            "exposure_date": exposure_date,
            "exposure_duration": exposure_duration,
            "outgoing_tx_count": outgoing_count,
            "total_tx_count": total_tx_count,
            "balance": btc_balance,
            "balance_unit": "BTC",
            "total_value_usd": total_value_usd,
            "total_value_inr": total_value_inr,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "migration_note": "Bitcoin has no active quantum migration plan. BIP 360 is proposed but has no implementation timeline as of April 2026.",
            "tokens": []
        }


@app.get("/analyze/solana/{address}")
async def analyze_solana(address: str):
    """
    Analyzes a Solana wallet address for quantum vulnerability.
    Uses the public Solana RPC endpoint (no API key required).
    IMPORTANT: In Solana, the address IS the public key (base58
    encoded). Any account that exists on-chain has its public key
    exposed by definition — no outgoing transaction required.
    """

    # Step 1: Validate Solana address format
    if not validate_solana_address(address):
        raise HTTPException(
            status_code=400,
            detail="Invalid Solana address. Must be a 32-44 character base58-encoded public key."
        )

    async with httpx.AsyncClient(timeout=60.0) as client:

        # Step 2: Check if the account exists on-chain via Solana RPC
        # If it exists, the public key (= the address) is on-chain
        try:
            rpc_url = "https://api.mainnet-beta.solana.com"
            account_payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getAccountInfo",
                "params": [address, {"encoding": "base58"}]
            }
            account_response = await client.post(
                rpc_url,
                json=account_payload,
                headers={"Content-Type": "application/json"}
            )
            account_data = account_response.json()
        except Exception:
            raise HTTPException(
                status_code=503,
                detail="Could not reach Solana RPC endpoint. Please try again shortly."
            )

        account_info = account_data.get("result", {}).get("value")

        # If account_info is None, this address has never been used
        is_exposed = account_info is not None

        # Step 3: Get transaction count and first transaction date
        outgoing_count = 0
        total_tx_count = 0
        exposure_date = None
        exposure_duration = None
        first_exposure_timestamp = None

        if is_exposed:
            await asyncio.sleep(0.3)
            try:
                # ============================================================
                # PHASE 1: Fast pagination for count (3 pages max).
                # For scoring, >50 txs = max exposure score, so exact count
                # beyond that doesn't affect the risk calculation.
                # ============================================================
                all_count = 0
                oldest_block_time = None
                before_sig = None
                reached_end = False

                for page_idx in range(3):
                    params: dict = {"limit": 1000}
                    if before_sig:
                        params["before"] = before_sig

                    sig_payload = {
                        "jsonrpc": "2.0",
                        "id": 1,
                        "method": "getSignaturesForAddress",
                        "params": [address, params]
                    }

                    page = None
                    for retry in range(3):
                        sig_response = await client.post(
                            rpc_url,
                            json=sig_payload,
                            headers={"Content-Type": "application/json"}
                        )
                        sig_data = sig_response.json()

                        if "error" in sig_data:
                            await asyncio.sleep(1.0 * (2 ** retry))
                            continue

                        page = sig_data.get("result", [])
                        break

                    if page is None or len(page) == 0:
                        reached_end = True
                        break

                    all_count += len(page)
                    oldest_block_time = page[-1].get("blockTime")
                    before_sig = page[-1].get("signature")

                    if len(page) < 1000:
                        reached_end = True
                        break

                    await asyncio.sleep(0.5)

                total_tx_count = all_count
                outgoing_count = all_count
                first_exposure_timestamp = oldest_block_time

                # ============================================================
                # PHASE 2: Binary search for true first tx date.
                # If pagination didn't reach the end, the oldest_block_time
                # is NOT the true first tx — it's just the Nth most recent.
                # Use a binary search on slot ranges: get a block at a mid
                # slot, grab a reference sig from it, then check if target
                # account has any sigs before that reference.
                # This finds the first tx in ~10 RPC calls instead of 1000+.
                # ============================================================
                if not reached_end:
                    # Get current slot for the upper bound
                    epoch_payload = {"jsonrpc": "2.0", "id": 1, "method": "getEpochInfo"}
                    epoch_resp = await client.post(rpc_url, json=epoch_payload, headers={"Content-Type": "application/json"})
                    epoch_data = epoch_resp.json()
                    current_slot = epoch_data.get("result", {}).get("absoluteSlot", 0)

                    low_slot = 0
                    high_slot = current_slot
                    best_oldest_time = None

                    # Binary search: ~15 iterations covers the full slot range
                    for _ in range(15):
                        if high_slot - low_slot < 500_000:  # ~2.5 days precision
                            break

                        mid_slot = (low_slot + high_slot) // 2
                        await asyncio.sleep(0.8)

                        # Get a block near mid_slot to find a reference signature
                        block_payload = {
                            "jsonrpc": "2.0", "id": 1,
                            "method": "getBlock",
                            "params": [mid_slot, {
                                "encoding": "json",
                                "transactionDetails": "signatures",
                                "maxSupportedTransactionVersion": 0
                            }]
                        }
                        block_resp = await client.post(rpc_url, json=block_payload, headers={"Content-Type": "application/json"})
                        block_data = block_resp.json()

                        if "error" in block_data:
                            # Slot was skipped or unavailable — nudge forward
                            low_slot = mid_slot + 1
                            continue

                        block = block_data.get("result")
                        if not block or not block.get("signatures"):
                            low_slot = mid_slot + 1
                            continue

                        ref_sig = block["signatures"][-1]
                        await asyncio.sleep(0.8)

                        # Check if target account has sigs BEFORE this reference
                        check_payload = {
                            "jsonrpc": "2.0", "id": 1,
                            "method": "getSignaturesForAddress",
                            "params": [address, {"limit": 1, "before": ref_sig}]
                        }
                        check_resp = await client.post(rpc_url, json=check_payload, headers={"Content-Type": "application/json"})
                        check_data = check_resp.json()

                        if "error" in check_data:
                            await asyncio.sleep(2)
                            continue

                        account_sigs = check_data.get("result", [])
                        if account_sigs:
                            # Account has activity before mid_slot — go older
                            high_slot = mid_slot
                            best_oldest_time = account_sigs[0].get("blockTime")
                        else:
                            # No activity before mid_slot — first tx is after this
                            low_slot = mid_slot + 1

                    # Use the binary search result if we found one
                    if best_oldest_time:
                        first_exposure_timestamp = best_oldest_time
                    elif high_slot < current_slot:
                        # Get the block time at the narrowed-down slot
                        await asyncio.sleep(0.5)
                        bt_payload = {"jsonrpc": "2.0", "id": 1, "method": "getBlockTime", "params": [high_slot]}
                        bt_resp = await client.post(rpc_url, json=bt_payload, headers={"Content-Type": "application/json"})
                        bt_data = bt_resp.json()
                        if bt_data.get("result"):
                            first_exposure_timestamp = bt_data["result"]

            except Exception:
                pass

        if is_exposed and first_exposure_timestamp:
            first_dt = datetime.datetime.fromtimestamp(
                first_exposure_timestamp, tz=datetime.timezone.utc
            )
            exposure_date = first_dt.strftime("%b %d, %Y")
            now = datetime.datetime.now(tz=datetime.timezone.utc)
            delta = relativedelta(now, first_dt)
            exposure_duration = f"{delta.years}Y {delta.months}M {delta.days}D"
        else:
            delta = None

        # Step 4: Get SOL balance
        # account_info.lamports gives the balance in lamports
        # 1 SOL = 1,000,000,000 lamports
        sol_balance = 0
        if account_info:
            lamports = account_info.get("lamports", 0)
            sol_balance = lamports / 1_000_000_000

        # Step 5: Fetch real SOL price from CoinGecko
        await asyncio.sleep(0.2)
        try:
            price_url = "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,inr"
            price_response = await client.get(price_url)
            price_data = price_response.json()
            sol_usd = price_data.get("solana", {}).get("usd", 150)
            sol_inr = price_data.get("solana", {}).get("inr", 12500)
        except Exception:
            sol_usd = 150
            sol_inr = 12500

        total_value_usd = round(sol_balance * sol_usd, 2)
        total_value_inr = round(sol_balance * sol_inr, 2)

        # Step 6: Calculate risk score
        risk_score = 0
        if is_exposed:
            # Graduated exposure score based on outgoing transaction count
            if outgoing_count > 50:
                exposure_score = 50
            elif outgoing_count > 10:
                exposure_score = 45
            elif outgoing_count > 2:
                exposure_score = 40
            else:
                exposure_score = 30  # 1-2 outgoing txs
            years_score = min(delta.years, 5) * 6 if delta else 0
            # Value score based on USD brackets
            if total_value_usd >= 100000:
                value_score = 10
            elif total_value_usd >= 25000:
                value_score = 7
            elif total_value_usd >= 5000:
                value_score = 5
            elif total_value_usd >= 500:
                value_score = 3
            else:
                value_score = 0
            if outgoing_count > 200:
                tx_score = 10
            elif outgoing_count > 50:
                tx_score = 7
            elif outgoing_count > 5:
                tx_score = 4
            else:
                tx_score = 0
            risk_score = min(exposure_score + years_score + value_score + tx_score, 100)
        else:
            if total_value_usd >= 100000:
                risk_score = 20
            elif total_value_usd >= 25000:
                risk_score = 14
            elif total_value_usd >= 5000:
                risk_score = 8
            else:
                risk_score = 5

        risk_level = "CRITICAL" if risk_score > 60 else "MODERATE" if risk_score > 30 else "LOW"

        # Step 7: Generate recommendation
        if is_exposed:
            recommendation = (
                f"Your Solana wallet address IS your public key by design — it has been "
                f"publicly visible on the Solana blockchain since {exposure_date}. "
                f"Unlike Ethereum, you do not need to send a transaction to expose your key in Solana. "
                f"The Solana Foundation announced a Dilithium (ML-DSA) testnet in December 2025, "
                f"but mainnet migration has no confirmed timeline. With ${round(total_value_usd):,} "
                f"at risk, this represents a {risk_level.lower()}-priority situation."
            )
        else:
            recommendation = (
                f"This Solana address has never been used on-chain, meaning it has not yet "
                f"been initialized and its public key is not yet visible. Once you receive "
                f"or send any SOL, the account will be initialized and the public key exposed. "
                f"Monitor Solana's Dilithium testnet progress for the eventual quantum-safe upgrade."
            )

        return {
            "chain": "solana",
            "address": address,
            "is_exposed": is_exposed,
            "exposure_date": exposure_date,
            "exposure_duration": exposure_duration,
            "outgoing_tx_count": outgoing_count,
            "total_tx_count": total_tx_count,
            "balance": sol_balance,
            "balance_unit": "SOL",
            "total_value_usd": total_value_usd,
            "total_value_inr": total_value_inr,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "migration_note": "Solana Foundation announced Dilithium (ML-DSA) testnet in December 2025. Mainnet migration timeline is not yet confirmed.",
            "tokens": []
        }


@app.get("/analyze/xrp/{address}")
async def analyze_xrp(address: str):
    """
    Analyzes an XRP Ledger address for quantum vulnerability.
    Uses the public XRPL cluster API (completely free, no key).
    Exposure is determined by the account Sequence number —
    each outgoing transaction increments it by 1 from a base of 1.
    """

    # Step 1: Validate XRP address format
    if not validate_xrp_address(address):
        raise HTTPException(
            status_code=400,
            detail="Invalid XRP address. Must start with 'r' and be 25-34 characters long."
        )

    async with httpx.AsyncClient(timeout=15.0) as client:

        # Step 2: Fetch account info from XRPL public cluster
        try:
            xrpl_url = "https://xrplcluster.com"
            account_payload = {
                "method": "account_info",
                "params": [{
                    "account": address,
                    "ledger_index": "current"
                }]
            }
            account_response = await client.post(
                xrpl_url,
                json=account_payload,
                headers={"Content-Type": "application/json"}
            )
            account_data = account_response.json()
        except Exception:
            raise HTTPException(
                status_code=503,
                detail="Could not reach XRP Ledger API. Please try again shortly."
            )

        # Check if account exists
        result = account_data.get("result", {})
        if result.get("status") == "error":
            # Account not found on ledger — never been funded
            return {
                "chain": "xrp",
                "address": address,
                "is_exposed": False,
                "exposure_date": None,
                "exposure_duration": None,
                "outgoing_tx_count": 0,
                "total_tx_count": 0,
                "balance": 0,
                "balance_unit": "XRP",
                "total_value_usd": 0,
                "total_value_inr": 0,
                "risk_score": 0,
                "risk_level": "LOW",
                "recommendation": "This XRP address has never been activated on the ledger. It has no exposure risk.",
                "migration_note": "XRP Ledger has a post-quantum roadmap targeting full transition by 2028.",
                "tokens": []
            }

        account_info = result.get("account_data", {})

        # Step 3: Determine exposure from Sequence number
        # Sequence starts at 1 when account is created.
        # Each outgoing transaction increments it by 1.
        # Therefore outgoing_count = Sequence - 1
        sequence = account_info.get("Sequence", 1)
        outgoing_count = max(sequence - 1, 0)
        is_exposed = outgoing_count > 0

        # Step 4: Get first transaction date if exposed
        exposure_date = None
        exposure_duration = None
        first_exposure_timestamp = None
        delta = None

        if is_exposed:
            await asyncio.sleep(0.2)
            try:
                tx_payload = {
                    "method": "account_tx",
                    "params": [{
                        "account": address,
                        "limit": 1,
                        "forward": True,
                        "ledger_index_min": -1
                    }]
                }
                tx_response = await client.post(
                    xrpl_url,
                    json=tx_payload,
                    headers={"Content-Type": "application/json"}
                )
                tx_data = tx_response.json()
                transactions = tx_data.get("result", {}).get("transactions", [])

                if transactions:
                    # XRP close_time is seconds since Jan 1 2000
                    # Convert to Unix timestamp by adding 946684800
                    xrp_epoch_offset = 946684800
                    close_time = transactions[0].get("tx", {}).get("date", 0)
                    first_exposure_timestamp = close_time + xrp_epoch_offset
            except Exception:
                pass

        if is_exposed and first_exposure_timestamp:
            first_dt = datetime.datetime.fromtimestamp(
                first_exposure_timestamp, tz=datetime.timezone.utc
            )
            exposure_date = first_dt.strftime("%b %d, %Y")
            now = datetime.datetime.now(tz=datetime.timezone.utc)
            delta = relativedelta(now, first_dt)
            exposure_duration = f"{delta.years}Y {delta.months}M {delta.days}D"

        # Step 5: Get XRP balance
        # Balance in account_data is in drops (1 XRP = 1,000,000 drops)
        balance_drops = int(account_info.get("Balance", 0))
        xrp_balance = balance_drops / 1_000_000

        # Step 6: Fetch real XRP price from CoinGecko
        await asyncio.sleep(0.2)
        try:
            price_url = "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd,inr"
            price_response = await client.get(price_url)
            price_data = price_response.json()
            xrp_usd = price_data.get("ripple", {}).get("usd", 0.5)
            xrp_inr = price_data.get("ripple", {}).get("inr", 42)
        except Exception:
            xrp_usd = 0.5
            xrp_inr = 42

        total_value_usd = round(xrp_balance * xrp_usd, 2)
        total_value_inr = round(xrp_balance * xrp_inr, 2)

        # Step 7: Calculate risk score
        risk_score = 0
        if is_exposed:
            # Graduated exposure score based on outgoing transaction count
            if outgoing_count > 50:
                exposure_score = 50
            elif outgoing_count > 10:
                exposure_score = 45
            elif outgoing_count > 2:
                exposure_score = 40
            else:
                exposure_score = 30  # 1-2 outgoing txs
            years_score = min(delta.years, 5) * 6 if delta else 0
            # Value score based on USD brackets
            if total_value_usd >= 100000:
                value_score = 10
            elif total_value_usd >= 25000:
                value_score = 7
            elif total_value_usd >= 5000:
                value_score = 5
            elif total_value_usd >= 500:
                value_score = 3
            else:
                value_score = 0
            if outgoing_count > 200:
                tx_score = 10
            elif outgoing_count > 50:
                tx_score = 7
            elif outgoing_count > 5:
                tx_score = 4
            else:
                tx_score = 0
            risk_score = min(exposure_score + years_score + value_score + tx_score, 100)
        else:
            if total_value_usd >= 100000:
                risk_score = 20
            elif total_value_usd >= 25000:
                risk_score = 14
            elif total_value_usd >= 5000:
                risk_score = 8
            else:
                risk_score = 5

        risk_level = "CRITICAL" if risk_score > 60 else "MODERATE" if risk_score > 30 else "LOW"

        # Step 8: Generate recommendation
        if is_exposed:
            recommendation = (
                f"Your XRP wallet was first exposed on {exposure_date}, with "
                f"{outgoing_count} outgoing transactions revealing your public key. "
                f"XRP Ledger has published a post-quantum readiness roadmap targeting "
                f"full transition by 2028 — one of the most aggressive timelines of any "
                f"major chain. With ${round(total_value_usd):,} at risk, monitor Ripple's "
                f"H1 2026 milestones and prepare to migrate to a fresh address."
            )
        else:
            recommendation = (
                f"This XRP account exists on the ledger but has never sent a transaction, "
                f"meaning its public key has not been revealed on-chain. It is currently safe. "
                f"XRP Ledger's 2028 post-quantum transition will eventually provide a "
                f"permanent protocol-level fix without requiring address changes."
            )

        return {
            "chain": "xrp",
            "address": address,
            "is_exposed": is_exposed,
            "exposure_date": exposure_date,
            "exposure_duration": exposure_duration,
            "outgoing_tx_count": outgoing_count,
            "total_tx_count": outgoing_count,
            "balance": xrp_balance,
            "balance_unit": "XRP",
            "total_value_usd": total_value_usd,
            "total_value_inr": total_value_inr,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "recommendation": recommendation,
            "migration_note": "XRP Ledger has a post-quantum roadmap with H1 2026 milestones and a full transition target of 2028.",
            "tokens": []
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
