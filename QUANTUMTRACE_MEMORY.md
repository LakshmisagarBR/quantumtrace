================================================================
QUANTUMTRACE â€” COMPLETE PROJECT MEMORY DOCUMENT
================================================================
Owner: Laksh | Status: In Development | Version: 1.0
Last Updated: April 27, 2026
================================================================


----------------------------------------------------------------
SECTION 1 â€” PROJECT IDENTITY
----------------------------------------------------------------

Name: QuantumTrace
Tagline: "Is Your Wallet Quantum Safe?"
Mission: To make the quantum threat to Ethereum wallets visible,
personal, and actionable for everyday crypto users â€” before
cryptographically relevant quantum computers arrive around 2029.

Domain Target: quantumtrace.vercel.app
GitHub Repo: LakshCoder10/quantumtrace (to be created)

What QuantumTrace is NOT:
- It is not a competing blockchain or wallet.
- It is not a quantum-safe wallet itself.
- It does not monitor live transactions.
- It does not detect if a public key has already been harvested.

What QuantumTrace IS:
- A read-only blockchain forensics and risk awareness tool.
- A historical audit tool that scans any Ethereum address and
  tells the user whether their public key is exposed on-chain,
  for how long, how much value is at risk, and what to do.
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
- Deployment: Fly.io
- Language: Python 3.11+

External APIs (all free tier):
- Etherscan API: For transaction history, balances, token holdings.
  Base URL: https://api.etherscan.io/api
  Key: Free tier, requires registration at etherscan.io
- CoinGecko API: For current ETH and ERC-20 token prices in
  both USD and INR.
  Base URL: https://api.coingecko.com/api/v3
  Key: Free tier, no key required for basic endpoints.

No AI API is needed. Zero generative AI calls. The entire
product is deterministic logic â€” fetch data, calculate, display.
This keeps the tool fast, free to run, and fully explainable.

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

Card 4 â€” VALUE AT RISK
  Top border: Red (if exposed) or Green (if safe)
  Value: INR amount (e.g., "â‚¹4,23,180") in red or green
  Sub: USD equivalent + ETH amount + "incl. tokens"

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
  exposure_binary: 0 if not exposed, 50 if exposed (base weight)
  years_exposed: min(years since first tx, 5) * 6  (max 30 points)
  value_score: based on INR value brackets (0-10 points)
  tx_count_score: based on transaction count brackets (0-10 points)
  Total: exposure_binary + years_exposed + value_score + tx_count_score
  Capped at 100. If not exposed, score is 0-10 based on balance only.

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
  Node 3 (amber blinking dot): "NOW Â· APR 2026" â€” ETH migration active
  Node 4 (muted dot): "~2029" â€” CRQC risk window opens
  Node 5 (muted dot): "2030" â€” ETH full quantum resistance target

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

Deployment: Fly.io (same as PulseBoard backend)
Base URL pattern: https://quantumtrace-api.fly.dev

-- PRIMARY ENDPOINT --

GET /analyze/{address}

Step 1 â€” Validate address format.
  Check that the address starts with "0x" and is exactly 42
  characters long (0x + 40 hex chars). If invalid, return:
  { "error": "Invalid Ethereum address format", "code": 400 }

Step 2 â€” Fetch transaction list from Etherscan.
  Call: https://api.etherscan.io/api?module=account&action=txlist
        &address={address}&sort=asc&apikey={ETHERSCAN_API_KEY}
  Filter the result to find only transactions where the "from"
  field equals the input address (outgoing transactions only).
  If the outgoing list is empty: public key is NOT exposed.
  If the outgoing list is non-empty: public key IS exposed.
    Record the timestamp of the very first outgoing transaction
    (txlist is sorted ascending, so first in list = earliest).

Step 3 â€” Fetch ETH balance from Etherscan.
  Call: https://api.etherscan.io/api?module=account&action=balance
        &address={address}&tag=latest&apikey={ETHERSCAN_API_KEY}
  Convert result from Wei to ETH (divide by 1e18).

Step 4 â€” Fetch ERC-20 token holdings from Etherscan.
  Call: https://api.etherscan.io/api?module=account&action=tokentx
        &address={address}&sort=desc&apikey={ETHERSCAN_API_KEY}
  Deduplicate by contractAddress to get unique token list.
  For v1, you can fetch prices for top 5 tokens by volume only.
  This avoids excessive CoinGecko calls.

Step 5 â€” Fetch current ETH price from CoinGecko.
  Call: https://api.coingecko.com/api/v3/simple/price
        ?ids=ethereum&vs_currencies=usd,inr
  Store eth_usd and eth_inr.

Step 6 â€” Calculate total portfolio value.
  eth_value_usd = eth_balance * eth_usd
  eth_value_inr = eth_balance * eth_inr
  Add token values if fetched. Sum to get total_usd, total_inr.

Step 7 â€” Calculate exposure duration.
  If exposed:
    first_exposure_timestamp = unix timestamp of first outgoing tx
    exposure_date = human readable date string
    exposure_duration = current timestamp - first_exposure_timestamp
    Format as "Xy Yd" (e.g., "3Y 44D")
  If not exposed:
    exposure_date = None
    exposure_duration = None

Step 8 â€” Calculate risk score (0-100).
  See formula in Section 6, Section F of this document.

Step 9 â€” Generate recommendation string.
  A template string populated with the wallet's specific data.
  Example: "Your wallet was first exposed on {exposure_date},
  giving adversaries {exposure_duration} to harvest your public
  key. Combined with {total_inr} in exposed assets and
  {outgoing_tx_count} on-chain signatures, this wallet represents
  a {risk_level} priority migration target. Quantum computers
  capable of exploiting this are projected to arrive by 2029."

Step 10 â€” Return JSON response.
  {
    "address": "0x...",
    "is_exposed": true/false,
    "exposure_date": "March 14, 2021" or null,
    "exposure_duration": "3Y 44D" or null,
    "outgoing_tx_count": 247,
    "total_tx_count": 389,
    "eth_balance": 1.84,
    "total_value_usd": 5042.00,
    "total_value_inr": 423180.00,
    "risk_score": 78,
    "risk_level": "HIGH",
    "recommendation": "Your wallet was first exposed...",
    "tokens": [ { "symbol": "USDC", "balance": 120.5, ... } ]
  }

-- SECONDARY ENDPOINT --

GET /health
  Returns: { "status": "ok", "chain": "ethereum", "version": "1.0" }
  Used by Fly.io health checks and for frontend status verification.

-- ENVIRONMENT VARIABLES (Fly.io secrets) --
  ETHERSCAN_API_KEY=your_key_here
  COINGECKO_API_KEY=optional_for_pro
  ALLOWED_ORIGINS=https://quantumtrace.vercel.app

-- ERROR HANDLING --
  All Etherscan/CoinGecko calls wrapped in try/except.
  Rate limits: Etherscan free tier allows 5 calls/second.
    Add a small asyncio.sleep(0.2) between sequential calls.
  If Etherscan returns an error for the address (e.g., address
    has no transactions): treat as not exposed, zero balance.
  Always return a valid JSON response, never a raw 500 error.
  On any upstream failure, return:
    { "error": "External API unavailable. Try again shortly.", "code": 503 }

-- CORS CONFIGURATION --
  Allow only https://quantumtrace.vercel.app in production.
  Allow localhost:3000 in development.


----------------------------------------------------------------
SECTION 8 â€” DATA FLOW (END TO END)
----------------------------------------------------------------

1. User types "0x4f3a...b291" or "vitalik.eth" into input.
2. User clicks SCAN or presses Enter.
3. If ENS name: ethers.js resolves it to 0x address client-side.
4. Frontend sends: GET /analyze/0x4f3a...b291 to FastAPI on Fly.io.
5. FastAPI validates address format.
6. FastAPI calls Etherscan for transaction list (outgoing filter).
7. FastAPI calls Etherscan for ETH balance.
8. FastAPI calls Etherscan for ERC-20 token activity.
9. FastAPI calls CoinGecko for ETH price (USD + INR).
10. FastAPI calculates: exposure status, duration, value, risk score.
11. FastAPI returns JSON to frontend.
12. Frontend receives JSON, populates all UI sections.
13. Risk gauge animates from 0% to score.
14. Page scrolls smoothly to results.
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
  17. Deploy frontend to Vercel, backend to Fly.io.
  18. Write launch post for ETHIndia community and crypto Twitter.


----------------------------------------------------------------
SECTION 11 â€” FUTURE ROADMAP (POST V1)
----------------------------------------------------------------

V2 â€” Multi-chain expansion (in priority order):
  1. Solana blockchain support (Solscan API, Ed25519 analysis)
  2. Bitcoin blockchain support (Blockchain.info API)
  3. XRP Ledger support (XRPL public API, free, no key needed)

V3 â€” Advanced features:
  - Batch address scanning (scan up to 10 addresses at once)
  - Portfolio risk aggregation across multiple wallets
  - Email alert when EIP-8141 ships on Ethereum mainnet
  - Integration into PulseBoard as the quantum badge feature

Hackathon targets:
  - ETHIndia (primary target â€” build the demo around Ethereum)
  - ETH Grants from Ethereum Foundation post-quantum team
  - QANplatform ecosystem grants (they actively fund PQC tooling)


----------------------------------------------------------------
SECTION 12 â€” KEY FACTS TO KNOW WHILE BUILDING
----------------------------------------------------------------

The HNDL threat is already active. Adversaries are collecting
blockchain data NOW. The scan does not detect if harvesting has
occurred â€” it detects exposure status, which is the necessary
condition for an HNDL attack to succeed.

Only the SENDER's public key is exposed in a transaction.
The recipient's public key remains hidden. The backend only
checks for outgoing transactions (where "from" = the address).

A wallet with only incoming transactions (zero outgoing) has
never exposed its public key and should be flagged as NOT EXPOSED
regardless of how large its balance is.

The 2029 timeline comes from Google Quantum AI's March 2026
responsible-disclosure paper. This is the most credible public
estimate for when CRQCs could break ECDSA at scale.

Migration to a fresh address is a temporary fix, not permanent.
The permanent fix is EIP-8141 at the Ethereum protocol level.
QuantumTrace should communicate this distinction clearly to users.

QuantumTrace covers ALL Ethereum-compatible wallets in v1:
MetaMask, Trust Wallet, Coinbase Wallet, Rainbow, Ledger
(when connected to Ethereum), Phantom (Ethereum network).
This is because the tool queries the Ethereum blockchain directly,
not the wallet application.

================================================================
END OF QUANTUMTRACE PROJECT MEMORY DOCUMENT
================================================================