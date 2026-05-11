================================================================
QUANTUMTRACE â€” COMPLETE PROJECT MEMORY DOCUMENT
================================================================
Owner: Laksh | Status: In Development | Version: 2.1
Last Updated: May 11, 2026
================================================================


----------------------------------------------------------------
SECTION 1 â€” PROJECT IDENTITY
----------------------------------------------------------------

Name: QuantumTrace
Tagline: "Is Your Wallet Quantum Safe?"
Mission: To make the quantum threat to blockchain wallets visible,
personal, and actionable for everyday crypto users â€” before
cryptographically relevant quantum computers arrive around 2029.

Domain Target: quantumtrace.vercel.app
GitHub Repo: LakshmisagarBR/quantumtrace

What QuantumTrace is NOT:
- It is not a competing blockchain or wallet.
- It is not a quantum-safe wallet itself.
- It does not monitor live transactions.
- It does not detect if a public key has already been harvested.

What QuantumTrace IS:
- A read-only blockchain forensics and risk awareness tool.
- A multi-chain audit tool that scans Ethereum, Bitcoin, Solana,
  or XRP Ledger addresses and tells the user whether their public
  key is exposed on-chain, for how long, how much value is at
  risk, and what to do.
- A bridge between technical quantum cryptography research and
  the everyday crypto user who has never heard of Shor's Algorithm.


----------------------------------------------------------------
SECTION 2 â€” THE CORE PROBLEM BEING SOLVED
----------------------------------------------------------------

Every Ethereum wallet uses ECDSA (Elliptic Curve Digital Signature
Algorithm) for signing transactions. The security model assumes
that deriving a private key from a public key is computationally
impossible. For classical computers, this is true. For a quantum
computer running Shor's Algorithm, this is NOT true.

The exposure mechanic works as follows. When a wallet is first
created, only the wallet address is on-chain. The address is a
hash of the public key, and hashing is one-way â€” you cannot
reverse a hash to get the public key. So the public key is hidden.

The moment the wallet sends its first outgoing transaction, it must
sign that transaction using its private key. That signature,
by the mathematical design of ECDSA, reveals the public key to
anyone who looks at the transaction data. Once that first send
happens, the public key is permanently and immutably on the
public Ethereum blockchain for anyone to read forever â€” including
future quantum adversaries.

This creates the "harvest now, decrypt later" (HNDL) attack vector.
An adversary does not need a quantum computer today. They simply
download the public blockchain data (which is free), collect every
exposed public key, and store it. When quantum hardware matures
around 2029, they turn it on and derive private keys, draining
wallets one by one. The victim has no idea this is happening.

Google Quantum AI published a responsible-disclosure paper in
March 2026 estimating that a future quantum machine could crack a
Bitcoin or Ethereum private key in approximately 9 minutes. The
Federal Reserve published a separate paper warning that all
historical transaction privacy collapses permanently once CRQCs
(Cryptographically Relevant Quantum Computers) arrive.

The vast majority of everyday Ethereum users â€” estimated at 95%+
â€” have no idea any of this is happening. No wallet app (MetaMask,
Trust Wallet, Coinbase Wallet, etc.) surfaces this information.
No tool exists that lets a user simply paste their wallet address
and get a plain-English risk assessment. QuantumTrace fills
exactly that gap.


----------------------------------------------------------------
SECTION 3 â€” TECH STACK
----------------------------------------------------------------

Frontend:
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS
- Components: shadcn/ui
- Deployment: Vercel

Backend:
- Framework: FastAPI (Python)
- Deployment: Render (free tier)
- Language: Python 3.11+
- Dependencies: fastapi, uvicorn, httpx, python-dateutil, python-dotenv, base58

External APIs (all free tier, no keys required for BTC/SOL/XRP):
- Etherscan API: For Ethereum transaction history, balances.
  Base URL: https://api.etherscan.io/v2/api (V2 API)
  Key: Free tier, requires registration at etherscan.io
- Blockchain.info API: For Bitcoin transaction history and balances.
  Base URL: https://blockchain.info/rawaddr/{address}
  Key: None required. Completely free.
- Helius RPC: For Solana account info and transaction signatures.
  Base URL: https://mainnet.helius-rpc.com/?api-key={HELIUS_API_KEY}
  Key: Free tier at helius.dev (1M credits/month, 10 req/s).
  Migrated from public Solana RPC (api.mainnet-beta.solana.com) due to
  severe rate limiting on shared hosting IPs like Render.
- XRPL Public Cluster: For XRP Ledger account info and transactions.
  Base URL: https://xrplcluster.com
  Key: None required. Community cluster, always available.
- CoinGecko API: For current crypto prices in USD.
  Base URL: https://api.coingecko.com/api/v3
  IDs: ethereum, bitcoin, solana, ripple
  Key: Free tier, no key required for basic endpoints.

No AI API is needed. Zero generative AI calls. The entire
product is deterministic logic â€” fetch data, calculate, display.
This keeps the tool fast, free to run, and fully explainable.

Chain Configuration:
- All chain-specific settings live in frontend/src/lib/chains.ts
- This file is the single source of truth for chain names, colors,
  input placeholders, API paths, explorer URLs, and migration notes.
- Adding a new chain in the future is a one-file frontend change
  plus one new backend endpoint.

ENS Resolution:
- ENS names (like vitalik.eth) are resolved client-side in the
  Next.js frontend using the ethers.js library before the address
  is sent to the FastAPI backend. This means the backend always
  receives a raw 0x address, never an ENS name.


----------------------------------------------------------------
SECTION 4 â€” DESIGN SYSTEM
----------------------------------------------------------------

Philosophy: Cyber-forensic security instrument. The tool must
feel like a serious threat scanner â€” clinical, precise, and
authoritative â€” not like a crypto marketing page. The emotional
signal is "this is a real instrument" not "this is a DeFi app."

-- COLOR PALETTE --

Background Primary:   #06080f  (near black, very deep navy)
Background Secondary: #0b0f1a  (slightly lighter, for cards)
Background Tertiary:  #0f1422  (for nested elements)

Accent Cyan:          #00e5ff  (primary brand color, for safe/neutral)
Cyan Dim:             rgba(0, 229, 255, 0.12)  (for backgrounds)
Cyan Mid:             rgba(0, 229, 255, 0.40)  (for borders on focus)

Alert Red:            #ff3b5c  (for EXPOSED status, critical risk)
Red Dim:              rgba(255, 59, 92, 0.12)

Warning Amber:        #ffb020  (for IN PROGRESS, medium risk)
Amber Dim:            rgba(255, 176, 32, 0.12)

Safe Green:           #00ff88  (for QUANTUM SAFE status, low risk)
Green Dim:            rgba(0, 255, 136, 0.12)

Text Primary:         #e2e8f0
Text Secondary:       #94a3b8
Text Muted:           #64748b

Border Default:       rgba(0, 229, 255, 0.15)
Border Strong:        rgba(0, 229, 255, 0.30)

-- TYPOGRAPHY --

Primary Font (headings, body, labels, buttons):
  Font Family: Outfit or DM Sans
  Weights used: 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)
  Character: Rounded, geometric, modern sans-serif. Clean and
  approachable without being generic. Works at all sizes.

Data Font (wallet addresses, numbers, scores, technical values only):
  Font Family: JetBrains Mono
  Weights used: 400, 600
  Character: Precise, technical, monospaced. Used exclusively for
  raw data output so numbers feel accurate and trustworthy.

Import string for Google Fonts:
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

-- SPACING AND SHAPE --

Border Radius: 12px to 16px on all cards, inputs, buttons, pills.
  Inputs: 12px
  Cards: 16px
  Small pills/badges: 8px
  Buttons: 12px
Never use 0px radius (too sharp/harsh).
Never use 50% radius on non-circular elements (too playful).

Card Shadow: 0 4px 24px rgba(0, 0, 0, 0.4)
Focus Ring: 0 0 0 3px rgba(0, 229, 255, 0.15)

-- BACKGROUND TEXTURE --

A subtle grid pattern overlays the entire background using CSS:
  background-image:
    linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;

A large radial glow sits at the top center of the page:
  background: radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%);
  width: 600px; height: 600px; centered horizontally, offset upward.

-- COMPONENT RULES --

Every card has a 2px colored top border indicating its risk level:
  Red top border = EXPOSED / critical data
  Amber top border = WARNING / in-progress data
  Cyan top border = NEUTRAL / informational data
  Green top border = SAFE / positive data

Status pills are small inline badges with a colored dot, border,
and background tint matching their risk color.

Animated elements:
  Logo icon pulses with a box-shadow animation (3s infinite).
  The live indicator dot blinks (1.5s infinite).
  The scanning spinner rotates (0.8s linear infinite).
  The risk gauge fill animates from 0% to the score value on load
  using a CSS width transition (1.5s cubic-bezier easing).
  Page load uses staggered fadeInUp animations (0.1s delay each).


----------------------------------------------------------------
SECTION 5 â€” UX FLOW (END TO END)
----------------------------------------------------------------

STATE 1 â€” LANDING / HERO STATE
The user arrives on the homepage. They see the navbar, the hero
headline ("Is Your Wallet Quantum Safe?"), a short subheading
explaining the threat in two sentences, the search input box,
and a stats bar below showing global context numbers (2.4T at
risk, 2029 timeline, 9-minute key crack, 65%+ RWAs on ETH).

The page is clean. There are no results sections visible yet.
The only call to action is the input box.

STATE 2 â€” SCANNING STATE
User pastes a wallet address (0x format) or an ENS name and
clicks the SCAN button or presses Enter.

If ENS, the frontend resolves it to a 0x address via ethers.js.
The input box and button become disabled.
A scanning animation appears: a spinning ring, a "SCANNING
BLOCKCHAIN..." label, and a cycling step text that shows each
stage of the analysis (validating address, fetching transactions,
detecting exposure, calculating risk, generating report).

The frontend sends a GET request to the FastAPI backend:
  GET https://your-fly-app.fly.dev/analyze/{address}

STATE 3 â€” RESULTS STATE
The backend responds with a JSON object. The frontend hides the
scanning animation, populates all result sections with real data,
and smoothly scrolls the user down to the results area.
The risk gauge animates from 0% to the calculated score.

The user can run a new scan at any time by editing the input and
clicking SCAN again. Previous results are replaced by new ones.


----------------------------------------------------------------
SECTION 6 â€” FRONTEND SECTIONS (COMPLETE SPEC)
----------------------------------------------------------------

-- NAVBAR --
Position: Fixed, top, full width, sticky scroll behavior.
Background: rgba(6, 8, 15, 0.90) with backdrop-filter blur(12px).
Border: 1px solid border-default on the bottom.
Left: Logo â€” "QT" icon in a small bordered square (cyan, with
  pulse animation) + "QUANTUMTRACE" text in JetBrains Mono.
Right: Small tag reading "ETH MAINNET Â· v1.0" in muted text.

-- SECTION A: HERO --
Layout: Centered, full-width, generous vertical padding.

Elements top to bottom:
1. Animated badge: small pill with a blinking cyan dot and text
   "LIVE THREAT SCANNER Â· ETHEREUM MAINNET" in JetBrains Mono.
2. H1 headline: "Is Your Wallet" on line one, "Quantum Safe?"
   on line two. "Quantum Safe?" is colored in cyan. Font: Outfit
   800. Size: clamp(36px, 6vw, 72px).
3. Subheading paragraph: Two sentences in JetBrains Mono, muted
   color, explaining the quantum threat and what the tool does.
   Max-width 500px, centered.
4. Search box (see full spec in Section B below).
5. Stats bar: Four statistics in a horizontal row, each showing
   a cyan number and a muted uppercase label below it.
   Stats: "$2.4T / BTC AT RISK", "~2029 / CRQC TIMELINE",
   "9 MIN / KEY CRACK TIME", "65%+ / RWAs ON ETH".
   Separated by top and bottom 1px borders.

-- SECTION B: SEARCH INPUT --
Max-width: 640px, centered.
Structure (left to right, inside a flex container):
  1. Label above: "// ENTER ETHEREUM WALLET ADDRESS OR ENS NAME"
     in JetBrains Mono, small, muted, letter-spaced.
  2. Input container: rounded 12px, border in border-strong color,
     background in bg-secondary.
     - Left prefix block: "ETH://" in cyan, on a cyan-dim background,
       separated by a right border. This is decorative but signals
       the expected format.
     - Input field: JetBrains Mono, transparent background, no
       outline, placeholder text in muted color.
       Placeholder: "0x4f3a...b291 or vitalik.eth"
     - SCAN button: Cyan background, black text, Outfit font,
       bold, letter-spaced, rounded right side. Hover state adds
       a glow box-shadow in cyan.
  3. Hint text below: "// No wallet connection required. Read-only
     analysis using public blockchain data." in small muted mono.

Focus state: The entire input container gets border-color cyan
and a subtle cyan glow box-shadow.

-- SECTION C: SCANNING ANIMATION --
Appears in place of input, hidden by default, shown during API call.
Content: Centered spinning ring (border-top cyan, rest of border
muted), "SCANNING BLOCKCHAIN..." label, and a cycling step text
that updates every 400ms through these messages:
  - "Validating address format..."
  - "Fetching transaction history from Etherscan..."
  - "Scanning for outgoing transactions..."
  - "Detecting public key exposure..."
  - "Fetching token balances..."
  - "Calculating risk score..."
  - "Generating report..."

-- SECTION D: REPORT HEADER --
Shown only after a successful scan.
Left: Small label "// SCAN COMPLETE Â· ETHEREUM MAINNET" in muted mono.
Right: The scanned address in a small cyan pill (truncated if long:
  first 10 chars + "..." + last 8 chars).

-- SECTION E: REPORT CARDS (4-card grid) --
Responsive grid, 4 columns on desktop, 2 on mobile.
Each card has: a colored top border, a card label in small muted
mono, a large value in JetBrains Mono with a risk color, and a
small sub-label below.

Card 1 â€” PUBLIC KEY STATUS
  Top border: Red (if exposed) or Green (if safe)
  Value: "EXPOSED" in red OR "NOT EXPOSED" in green
  Sub: "Key visible on-chain since first send" or "No outgoing
  transactions found â€” key not yet revealed"

Card 2 â€” EXPOSURE DURATION
  Top border: Amber
  Value: Duration in JetBrains Mono (e.g., "3Y 44D") in amber
  Sub: "First exposed: Mar 14, 2021" (date of first outgoing tx)
  If not exposed, shows "â€”" and "No exposure detected"

Card 3 â€” OUTGOING TRANSACTIONS
  Top border: Cyan
  Value: Total count of outgoing transactions in cyan
  Sub: "Signature visible in every tx"

Card 4 – VALUE AT RISK
  Top border: Red (if exposed) or Green (if safe)
  Value: USD amount (e.g., "$5,042") in red or green
  Sub: Balance in native token + "USD value via CoinGecko at time of scan"

-- SECTION F: RISK GAUGE --
Full-width card with rounded corners, bg-secondary background.
Header row: "// QUANTUM RISK SCORE" label on the left, the
  numerical score (e.g., "78 / 100") on the right in large
  JetBrains Mono colored in the appropriate risk color.
Gauge track: A thin horizontal bar, full width. Filled from left
  to right using a gradient (green â†’ amber â†’ red). The fill
  percentage equals the risk score. A white glowing tick mark
  sits at the fill endpoint.
Labels below gauge: "LOW RISK" (green, left), "MODERATE" (center),
  "CRITICAL" (red, right) in small spaced mono text.
Risk explanation paragraph below: A dynamically generated 3-4
  sentence paragraph in JetBrains Mono explaining the specific
  factors that produced this score for THIS wallet â€” including
  the exact exposure date, duration, value, and transaction count.
  This paragraph sits inside a left-bordered block colored in
  the risk color (red, amber, or green).

Risk score calculation formula (weighted):
  exposure_score: Graduated based on outgoing tx count:
    0 outgoing tx → 0 points
    1-2 outgoing tx → 30 points
    3-10 outgoing tx → 40 points
    11-50 outgoing tx → 45 points
    Over 50 outgoing tx → 50 points
  years_exposed: min(years since first tx, 5) * 6  (max 30 points)
  value_score: based on USD value brackets (0-10 points):
    Under $500 → 0 pts; $500-$5K → 3 pts; $5K-$25K → 5 pts;
    $25K-$100K → 7 pts; Over $100K → 10 pts
  tx_count_score: based on transaction count brackets (0-10 points)
  Total: exposure_score + years_exposed + value_score + tx_count_score
  Capped at 100. If not exposed, score is 0-20 based on USD balance only.

-- SECTION G: HNDL WARNING --
Full-width card with amber border tint.
A large faint "âš " character sits decoratively in the top right
as a background watermark (low opacity).

Title: "// HARVEST NOW, DECRYPT LATER Â· ACTIVE THREAT" in amber.
Body text: Two paragraphs in JetBrains Mono explaining:
  Para 1 â€” What HNDL is and that the harvesting is already happening.
  Para 2 â€” That the blockchain is permanent and immutable, meaning
  nothing can retroactively hide an already-exposed public key.

Timeline visualization below the text:
  A horizontal row of 5 nodes connected by lines, each showing:
  Node 1 (red dot): The wallet's first exposure date
  Node 2 (red dot): August 2024 â€” NIST PQC standards finalized
  Node 3 (amber blinking dot): "NOW Â· APR 2026" Â€” ETH migration active
  Node 4 (muted dot): "~2029" Â€” CRQC risk window opens
  Node 5 (muted dot): "2030" Â€” ETH full quantum resistance target

-- SECTION H: MIGRATION GUIDE --
Full-width card, cyan-accented title "// RECOMMENDED ACTION PLAN".
Four sequential steps, each in its own bordered card:

Step 1 â€” Create a fresh Ethereum wallet immediately
  Tag: "DO NOW" (red)
  Description: Explains that a new wallet whose public key has never
  been on-chain is safe. Do not reuse any address that has sent a tx.

Step 2 â€” Migrate your assets to the fresh wallet
  Tag: "DO NOW" (red)
  Description: Explains the migration process and the important nuance
  that the act of sending assets FROM the old wallet exposes the new
  wallet's key too â€” but you reset the exposure clock to today.

Step 3 â€” Monitor Ethereum's EIP-8141 rollout
  Tag: "WATCH 2026" (amber)
  Description: EIP-8141 via the HegotÃ¡ upgrade (late 2026) introduces
  native support for quantum-resistant signature schemes. This is the
  permanent protocol-level fix. Links to strawmap.org.

Step 4 â€” Consider quantum-safe chains for long-term holdings
  Tag: "LONG-TERM" (green)
  Description: For assets held beyond 2029, Algorand (Falcon-1024
  live mainnet) and QANplatform (ML-DSA) are already quantum-safe.

-- SECTION I: CHAIN STATUS BOARD --
Table layout, full width.
Title: "// QUANTUM READINESS Â· MAJOR BLOCKCHAINS Â· UPDATED APRIL 2026"

Columns: CHAIN, ALGORITHM, MIGRATION STATUS, STATUS PILL, PROGRESS BAR

Rows (5 chains, this data is maintained via a static JSON config):
  Bitcoin â€” ECDSA secp256k1 â€” BIP 360 debated, no timeline â€” CRITICAL (red) â€” 5%
  Ethereum â€” ECDSA + BLS â€” Strawmap active, 2030 target â€” IN PROGRESS (amber) â€” 25%
  Solana â€” Ed25519 â€” Dilithium testnet Dec 2025 â€” IN PROGRESS (amber) â€” 20%
  XRP Ledger â€” ECDSA/Ed25519 â€” PQC roadmap, 2028 target â€” IN PROGRESS (amber) â€” 30%
  Algorand â€” Falcon-1024 NIST â€” Live on mainnet Nov 2025 â€” QUANTUM SAFE (green) â€” 85%

This section is maintained manually via a file called
quantumStatus.json in the frontend's public directory. No API
needed. The developer (Laksh) updates it as the landscape evolves.

-- SECTION J: EDUCATIONAL FOOTER --
Three-column card grid (stacks to single column on mobile).
Title: "// TECHNICAL PRIMER Â· WHY THIS MATTERS"

Column 1 â€” What is Shor's Algorithm?
  Explains Shor's Algorithm in plain language: that it can solve
  the discrete logarithm problem underlying ECDSA in polynomial
  time on a quantum computer, whereas classical computers would
  take billions of years.

Column 2 â€” Why is ECDSA Vulnerable?
  Explains that ECDSA signatures mathematically reveal the public
  key, and that once the public key is on-chain, Shor's Algorithm
  has everything it needs to derive the private key.

Column 3 â€” What are NIST PQC Standards?
  Explains FIPS 203 (ML-KEM/Kyber), FIPS 204 (ML-DSA/Dilithium),
  and FIPS 205 (SLH-DSA/SPHINCS+) finalized August 2024 as the
  gold standard for quantum-resistant cryptography.

Each column has a cyan left-border accent.

-- FOOTER BAR --
Full width, top border, flex row.
Left: "Â© 2026 QUANTUMTRACE Â· READ-ONLY Â· NO WALLET CONNECTION"
Right: Links to GITHUB, METHODOLOGY, SOURCES


----------------------------------------------------------------
SECTION 7 â€” BACKEND ARCHITECTURE (FastAPI)
----------------------------------------------------------------

Deployment: Render (free tier)
Base URL pattern: https://quantumtrace-backend.onrender.com

-- ENDPOINTS OVERVIEW (V2 MULTI-CHAIN) --

GET /health
  Returns: { "status": "ok", "chains": ["ethereum", "bitcoin", "solana", "xrp"], "version": "2.0" }

GET /analyze/{address}           â€” Ethereum analysis
GET /analyze/bitcoin/{address}   â€” Bitcoin analysis
GET /analyze/solana/{address}    â€” Solana analysis
GET /analyze/xrp/{address}       â€” XRP Ledger analysis

All endpoints return the same JSON response shape:
  {
    "chain": "ethereum" | "bitcoin" | "solana" | "xrp",
    "address": "...",
    "is_exposed": true/false,
    "exposure_date": "March 14, 2021" or null,
    "exposure_duration": "3Y 2M 15D" or null,
    "outgoing_tx_count": 247,
    "total_tx_count": 389,
    "balance": 1.84,
    "balance_unit": "ETH" | "BTC" | "SOL" | "XRP",
    "total_value_usd": 5042.00,
    "total_value_inr": 423180.00,
    "risk_score": 78,
    "risk_level": "CRITICAL" | "MODERATE" | "LOW",
    "recommendation": "Your wallet was first exposed...",
    "migration_note": "Chain-specific migration status...",
    "tokens": []
  }

-- ETHEREUM ENDPOINT: GET /analyze/{address} --
  Exposure rule: Outgoing transactions reveal the public key.
  Data source: Etherscan V2 API (requires ETHERSCAN_API_KEY).
  Balance: Wei from Etherscan, converted to ETH.
  Price: CoinGecko id "ethereum".

-- BITCOIN ENDPOINT: GET /analyze/bitcoin/{address} --
  Exposure rule: Spending transactions reveal public key via scriptSig.
  Supported formats: P2PKH (1...), P2SH (3...), P2WPKH (bc1q...).
  Data source: Blockchain.info rawaddr API (free, no key).
  Balance: Satoshis from rawaddr, converted to BTC (Ã· 100,000,000).
  Price: CoinGecko id "bitcoin".
  Validation: validate_bitcoin_address() with three regex patterns.

-- SOLANA ENDPOINT: GET /analyze/solana/{address} --
  Exposure rule: Solana address IS the public key (base58-encoded).
    Any account that exists on-chain has its key exposed by definition.
    Unlike Ethereum, no outgoing transaction is required for exposure.
  Data source: Helius RPC (mainnet.helius-rpc.com, free tier).
    Migrated from public Solana RPC due to rate limiting on Render.
    Uses getAccountInfo, getSignaturesForAddress, getBlock, getEpochInfo,
    and getBlockTime JSON-RPC methods.
  Two-Phase Scan Architecture:
    Phase 1 (Count): Fetches up to 3 pages (3000 txs) via
      getSignaturesForAddress. Sufficient for scoring (>50 = max).
      If capped, response includes tx_count_capped: true and frontend
      displays count as "3,000+".
    Phase 2 (Binary Search for First Exposure Date): If Phase 1 doesn't
      reach the end of tx history, a binary search across the blockchain's
      slot range finds the true first transaction. Uses getBlock to sample
      blocks and getSignaturesForAddress(before: ref_sig) to check if the
      account had activity before each midpoint. Converges in ~10 iterations.
      If rate-limited mid-search, assumes account existed (conservative) to
      avoid getting stuck on the same mid_slot.
  Balance: Lamports from account info, converted to SOL (Ã· 1,000,000,000).
  Price: CoinGecko id "solana".
  Validation: validate_solana_address() with base58 decode + 32-byte check.

-- XRP ENDPOINT: GET /analyze/xrp/{address} --
  Exposure rule: Same as Ethereum â€” outgoing transactions reveal key.
    Exposure determined by account Sequence number (outgoing_count = Sequence - 1).
  Data source: XRPL public cluster (xrplcluster.com).
    Uses account_info and account_tx JSON-RPC methods.
  Balance: Drops from account_data, converted to XRP (Ã· 1,000,000).
  Price: CoinGecko id "ripple".
  XRP epoch: close_time is seconds since Jan 1 2000.
    Convert to Unix by adding 946684800.
  Validation: validate_xrp_address() â€” starts with 'r', 25-34 chars.

-- ADDRESS VALIDATION HELPERS --
  Three helper functions at the top of main.py:
  - validate_bitcoin_address(address) â€” regex for P2PKH/P2SH/P2WPKH
  - validate_solana_address(address) â€” regex + base58.b58decode + 32-byte check
  - validate_xrp_address(address) â€” regex for r-prefixed base58check

-- ENVIRONMENT VARIABLES --
  ETHERSCAN_API_KEY=your_key_here  (required for Ethereum scans)
  HELIUS_API_KEY=your_key_here     (required for Solana scans, free at helius.dev)
  ALLOWED_ORIGINS=https://quantumtrace.vercel.app

-- ERROR HANDLING --
  All external API calls wrapped in try/except.
  Rate limits: Short asyncio.sleep() delays between sequential calls.
  On upstream failure, return 503 with clear message.
  Invalid addresses return 400 with format-specific guidance.
  API keys are sanitized from exception messages before logging to
  prevent credential leaks in Render server logs.

-- SECURITY --
  No credentials in source code — all from os.environ.get().
  .env files are gitignored and never committed.
  CORS locked to localhost:3000 and quantumtrace.vercel.app.
  Read-only operations only — no wallet connections, no signing.
  Input validation on all 4 chains before any API calls.
  Startup warnings if API keys are missing.

-- CORS CONFIGURATION --
  Allow only https://quantumtrace.vercel.app in production.
  Allow localhost:3000 in development.


----------------------------------------------------------------
SECTION 8 â€” DATA FLOW (END TO END)
----------------------------------------------------------------

1. User selects a chain tab (Ethereum/Bitcoin/Solana/XRP).
2. User types a wallet address into the chain-specific input.
3. User clicks SCAN or presses Enter.
4. If Ethereum ENS name: ethers.js resolves to 0x address client-side.
5. Frontend determines API path from chain config:
     Ethereum â†’ GET /analyze/{address}
     Bitcoin  â†’ GET /analyze/bitcoin/{address}
     Solana   â†’ GET /analyze/solana/{address}
     XRP      â†’ GET /analyze/xrp/{address}
6. Frontend sends request to FastAPI backend.
7. FastAPI validates address format (chain-specific regex).
8. FastAPI calls chain-specific data source for tx history.
9. FastAPI calls chain-specific data source for balance.
10. FastAPI calls CoinGecko for asset price (USD).
11. FastAPI calculates: exposure status, duration, value, risk score.
12. FastAPI returns standardized JSON (same shape for all chains).
13. Frontend receives JSON, populates all UI sections.
14. Results show chain-specific balance unit (ETH/BTC/SOL/XRP).
15. Migration note shows chain-specific quantum readiness status.
16. Risk gauge animates from 0% to score.
Total round-trip time target: under 3 seconds on a good connection.


----------------------------------------------------------------
SECTION 9 â€” QUANTUMSTATUS.JSON (Static Config File)
----------------------------------------------------------------

This file lives in the Next.js /public directory and is imported
by the Chain Status Board component. The developer updates it
manually as the quantum-safe blockchain landscape evolves.

Structure:
[
  {
    "chain": "Bitcoin",
    "ticker": "BTC",
    "algorithm": "ECDSA (secp256k1)",
    "migration_status": "BIP 360 debated, no implementation timeline",
    "status": "critical",
    "progress_percent": 5,
    "last_updated": "April 2026"
  },
  {
    "chain": "Ethereum",
    "ticker": "ETH",
    "algorithm": "ECDSA + BLS signatures",
    "migration_status": "Strawmap active Â· EIP-8141 proposed Â· 2030 target",
    "status": "progress",
    "progress_percent": 25,
    "last_updated": "April 2026"
  },
  ...
]

Status values: "critical" | "progress" | "safe"
These map directly to the red/amber/green pill colors in the UI.


----------------------------------------------------------------
SECTION 10 â€” BUILD ORDER (WHAT TO BUILD FIRST)
----------------------------------------------------------------

Phase 1 â€” The working slice (build this before anything else):
  1. Next.js project setup with Tailwind + shadcn/ui.
  2. Navbar component (static).
  3. Hero section with search input (no functionality yet).
  4. FastAPI backend with /health and /analyze endpoints.
     At this stage, /analyze only needs to return exposure status
     and balance. Risk score and tokens come later.
  5. Wire frontend input to backend. Make a real address scan.
  6. Report cards section (just 4 cards, real data).
  Ship this. A user can paste an address and see EXPOSED or SAFE.
  That alone is already useful and demonstrable.

Phase 2 â€” Full results experience:
  7. Risk gauge with score and recommendation paragraph.
  8. HNDL warning section with static timeline.
  9. Migration guide (static content, 4 steps).
  10. Chain status board reading from quantumStatus.json.
  11. Educational footer (static content).

Phase 3 â€” Polish and launch:
  12. ENS name resolution.
  13. ERC-20 token balances and INR values.
  14. Mobile responsiveness testing.
  15. Error states (invalid address, API down, no transactions).
  16. Loading skeleton states for result cards.
  17. Deploy frontend to Vercel, backend to Render.
  18. Write launch post for ETHIndia community and crypto Twitter.


----------------------------------------------------------------
SECTION 11 â€” ROADMAP
----------------------------------------------------------------

V2 â€” Multi-chain expansion (COMPLETED â€” May 2026):
  âœ“ Bitcoin blockchain support (Blockchain.info API, P2PKH/P2SH/P2WPKH)
  âœ“ Solana blockchain support (Public RPC, Ed25519 analysis)
  âœ“ XRP Ledger support (XRPL public cluster, free, no key needed)
  âœ“ Four-tab chain selector in the Hero UI
  âœ“ Chain-specific input placeholders, labels, and helper text
  âœ“ Unified response shape across all four chains
  âœ“ Chain-specific migration notes in the results dashboard
  âœ“ Navbar updated to MULTI-CHAIN Â· v2.0
  âœ“ Dynamic multi-chain logic in UI (Migration steps, HNDL warning, Timeline Node 3)
  âœ“ Enhanced UI/UX (Reset Scan button, Explorer address links, Chain-aware loading states)
  âœ“ Dedicated static pages created (/migration-checklist, /methodology, /sources)
  âœ“ Vercel Analytics and Speed Insights deployed via .npmrc configuration

V2.1 – Scoring, credibility & Solana overhaul (COMPLETED — May 2026):
  ✔ Replaced INR value brackets with dynamic USD brackets using CoinGecko prices
  ✔ Replaced binary 50-point exposure jump with graduated exposure scoring (0/30/40/45/50)
  ✔ Added Ed25519 vs ECDSA nuance note for Solana scan results
  ✔ Added source citation tooltips to all four homepage stats
  ✔ Complete methodology page rewrite with accurate scoring tables
  ✔ Eliminated all ₹/INR references from codebase (USD only)
  ✔ Chain-Specific Vulnerability Notes section added to methodology
  ✔ Migrated Solana RPC from public endpoint to Helius (free tier, 10 req/s)
  ✔ Implemented two-phase Solana scan: Phase 1 count + Phase 2 binary search
  ✔ Fixed first-exposure date bug for mega-wallets (was showing today's date)
  ✔ Fixed reached_end false positive when pagination is rate-limited vs genuinely empty
  ✔ Fixed binary search stuck-loop when rate-limited (now advances conservatively)
  ✔ Added tx_count_capped field — frontend shows "3,000+" for capped counts
  ✔ Added HELIUS_API_KEY environment variable with startup warning
  ✔ Sanitized error logging to prevent API key leaks in server logs
  ✔ Reduced all artificial delays from 2.5-3s to 0.1-0.2s (Helius headroom)
  ✔ Security audit: no hardcoded creds, .env gitignored, CORS locked, input validated

V3 â€” Advanced features (NEXT):
  - Batch address scanning (scan up to 10 addresses at once)
  - Portfolio risk aggregation across multiple wallets
  - Email alert when EIP-8141 ships on Ethereum mainnet
  - Integration into PulseBoard as the quantum badge feature

V4 â€” Additional chains:
  - Cardano (Ed25519 variant)
  - Polkadot (Sr25519/Ed25519)
  - Cosmos/Tendermint chains

Hackathon targets:
  - ETHIndia (primary target â€” multi-chain demo)
  - ETH Grants from Ethereum Foundation post-quantum team
  - QANplatform ecosystem grants (they actively fund PQC tooling)


----------------------------------------------------------------
SECTION 12 â€” KEY FACTS TO KNOW WHILE BUILDING
----------------------------------------------------------------

The HNDL threat is already active. Adversaries are collecting
blockchain data NOW. The scan does not detect if harvesting has
occurred â€” it detects exposure status, which is the necessary
condition for an HNDL attack to succeed.

Exposure rules differ by chain:
- Ethereum: Only SENDER's public key is exposed (outgoing tx).
- Bitcoin: Only SENDER's public key is exposed (spending tx via scriptSig).
- Solana: The address IS the public key. Any on-chain account
  has its public key exposed by definition â€” no outgoing tx needed.
- XRP: Same as Ethereum â€” outgoing tx reveals the public key.
  Sequence number directly tells how many outgoing txs occurred.

A wallet with only incoming transactions (zero outgoing) has
never exposed its public key and should be flagged as NOT EXPOSED
regardless of how large its balance is. EXCEPTION: Solana,
where any initialized account is exposed.

The 2029 timeline comes from Google Quantum AI's March 2026
responsible-disclosure paper. This is the most credible public
estimate for when CRQCs could break ECDSA at scale.

Migration to a fresh address is a temporary fix, not permanent.
This is because the tool queries the Ethereum blockchain directly,
not the wallet application.

================================================================
END OF QUANTUMTRACE PROJECT MEMORY DOCUMENT
================================================================