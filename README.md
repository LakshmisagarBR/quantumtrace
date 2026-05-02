# QuantumTrace — Quantum Vulnerability Scanner

<div align="center">

![QuantumTrace](https://img.shields.io/badge/QuantumTrace-v2.0-00e5ff?style=for-the-badge&labelColor=06080f)
![Chains](https://img.shields.io/badge/Chains-ETH%20%7C%20BTC%20%7C%20SOL%20%7C%20XRP-00e5ff?style=for-the-badge&labelColor=06080f)
![Read Only](https://img.shields.io/badge/Read--Only-No%20Wallet%20Needed-00ff88?style=for-the-badge&labelColor=06080f)
![License](https://img.shields.io/badge/License-MIT-ffb020?style=for-the-badge&labelColor=06080f)

**Is your crypto wallet safe from quantum computers?**

[🔍 Live Demo](https://quantumtrace.vercel.app) · [📖 Methodology](https://quantumtrace.vercel.app/methodology) · [📚 Sources](https://quantumtrace.vercel.app/sources) · [🛡️ Migration Guide](https://quantumtrace.vercel.app/migration-checklist)

</div>

---

## What Is QuantumTrace?

QuantumTrace is a free, read-only blockchain forensics tool that scans any Ethereum, Bitcoin, Solana, or XRP wallet address and tells you whether your public key is already exposed on-chain — and what that means for your funds when quantum computers arrive around 2029.

The threat is not hypothetical. In March 2026, Google Quantum AI published a paper estimating that a future quantum machine running Shor's Algorithm could crack a Bitcoin or Ethereum private key in approximately **9 minutes** — well within Bitcoin's 10-minute block time. The Federal Reserve has separately warned that when this capability arrives, all historical transaction privacy collapses permanently.

QuantumTrace makes this threat **personal and measurable**. Paste your wallet address, and within seconds you will know your real exposure status, how long your key has been visible on-chain, the INR and USD value of assets at risk, a risk score from 0 to 100, and a concrete action plan.

No wallet connection required. No private keys. No seed phrases. Everything comes from public blockchain data.

---

## How the Exposure Mechanic Works

Understanding why this matters requires understanding one critical fact about how blockchains work.

When you create a wallet, only your **wallet address** appears on-chain. Your address is a hash of your public key — and hashing is a one-way function, so nobody can reverse it to get your public key. At this stage, your wallet is relatively safe even against a quantum computer, because Shor's Algorithm needs the public key as its input, and it isn't visible yet.

The moment you **send your first outgoing transaction**, your wallet must cryptographically sign it using your private key. That signature, by the mathematical design of ECDSA, permanently reveals your public key to anyone reading the blockchain. After that first send, your public key is immutably on-chain forever.

This creates the **Harvest Now, Decrypt Later (HNDL)** attack: adversaries are downloading blockchain data today, collecting exposed public keys, and storing them. When quantum hardware matures, they derive private keys, sign fraudulent transactions as you, and drain your wallet. The blockchain cannot tell the difference — the signature is cryptographically valid.

QuantumTrace checks whether your address has ever sent a transaction, and if so, for how long your key has been sitting on a public ledger that quantum-armed adversaries may already have copied.

> **Important:** QuantumTrace cannot detect whether your key has already been harvested. Harvesting is silent and leaves no trace. It detects the *necessary condition* for the attack — key exposure — and tells you whether you need to act before the threat window opens.

---

## Features

QuantumTrace covers four blockchains in v2.0, each with a tab on the hero input showing which wallet apps use that chain so users know exactly which tab to pick.

**Ethereum** uses the Etherscan API to check outgoing transaction history. Public key exposure follows the classic ECDSA mechanic — any wallet that has ever sent a transaction has its key on-chain.

**Bitcoin** supports all three address formats: P2PKH (starting with `1`), P2SH (starting with `3`), and Native SegWit P2WPKH (starting with `bc1q`). Uses the Blockchain.info API, no key required.

**Solana** has a unique mechanic: a Solana address *is* the public key (base58-encoded). Any account that has ever appeared in any on-chain transaction has its public key exposed by definition. Uses the public Solana RPC endpoint.

**XRP Ledger** uses the account Sequence number to determine exposure. The Sequence starts at 1 when an account is created and increments by 1 per outgoing transaction, so `Sequence - 1` directly gives the outgoing transaction count. Uses the public XRPL cluster, no key required.

Every scan produces a **Risk Score from 0 to 100** built from four weighted factors: whether the key is exposed at all (50 points base), how many years it has been exposed (up to 30 points), the INR value of exposed assets (up to 10 points), and the number of outgoing transactions (up to 10 points).

The **Harvest Now, Decrypt Later warning** includes a personalised five-node timeline showing the wallet's actual first exposure date, the August 2024 NIST PQC standards milestone, the current 2026 migration window, the ~2029 CRQC risk window, and the 2030 target for Ethereum's full quantum resistance.

The **Migration Guide** is chain-specific. Ethereum users are directed to monitor EIP-8141 in the Hegotá upgrade. Bitcoin users are directed to BIP 360. Solana users see the Dilithium testnet status. XRP users see Ripple's official 2028 post-quantum roadmap. Every step links to the authoritative source.

The **Chain Status Board** shows the quantum readiness of five major blockchains — Bitcoin, Ethereum, Solana, XRP Ledger, and Algorand — with their cryptographic algorithm, migration status, and a progress bar.

---

## Tech Stack

QuantumTrace is built on a deliberately simple, fast stack with zero AI API calls. The entire product is deterministic logic: fetch public blockchain data, calculate, display.

The **frontend** is Next.js 14 with the App Router, styled with Tailwind CSS and shadcn/ui components, deployed on Vercel. The primary font is Outfit (rounded, geometric headings) and JetBrains Mono is used exclusively for raw data values — wallet addresses, scores, balances — to make technical output feel precise and trustworthy.

The **backend** is FastAPI (Python 3.11+), deployed on Render. It handles four separate analysis endpoints, one per chain, each calling the chain's public API, fetching real-time prices from CoinGecko, calculating the risk score, and returning a structured JSON response.

The **external APIs** are all free-tier with no payment required. Etherscan API for Ethereum transaction history and balances. Blockchain.info API for Bitcoin. Solana's public mainnet RPC for Solana account data. The XRPL public cluster for XRP. CoinGecko for real-time ETH, BTC, SOL, and XRP prices in both USD and INR.

---

## Project Structure

```
quantumtrace/
├── backend/
│   ├── main.py              # FastAPI app — all four chain endpoints
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx                    # Main page, routing logic
    │   │   ├── layout.tsx                  # SEO metadata, font loading
    │   │   ├── methodology/page.tsx        # How exposure is detected
    │   │   ├── migration-checklist/page.tsx # Step-by-step migration guide
    │   │   ├── sources/page.tsx            # All primary sources cited
    │   │   └── sitemap.ts                  # Auto-generated sitemap
    │   ├── components/
    │   │   ├── Hero.tsx                    # Landing input with chain tabs
    │   │   ├── Navbar.tsx                  # Navigation bar
    │   │   └── ResultsDashboard.tsx        # Full results experience
    │   └── lib/
    │       └── chains.ts                   # Chain configuration (URLs, labels, etc.)
    ├── public/
    │   └── quantumStatus.json              # Chain status board data (manually maintained)
    ├── tailwind.config.ts
    └── package.json
```

---

## Getting Started

### Prerequisites

You will need Node.js 18+ for the frontend and Python 3.11+ for the backend. You will also need a free Etherscan API key from [etherscan.io](https://etherscan.io) — no other API keys are required since the other data sources are public.

### Backend Setup

Clone the repository, then navigate into the backend directory and install dependencies.

```bash
git clone https://github.com/LakshCoder10/quantumtrace.git
cd quantumtrace/backend
pip install -r requirements.txt
```

Create a `.env` file in the backend directory with your Etherscan API key. This file is listed in `.gitignore` and will never be committed.

```
ETHERSCAN_API_KEY=your_actual_key_here
```

Start the backend server with the following command. It will run on port 8000 by default.

```bash
uvicorn main:app --reload --port 8000
```

You can verify it is running correctly by visiting `http://localhost:8000/health`, which should return a JSON response confirming all four chains are available and the version is 2.0.

### Frontend Setup

In a separate terminal, navigate into the frontend directory and install dependencies.

```bash
cd quantumtrace/frontend
npm install
```

Create a `.env.local` file in the frontend directory telling Next.js where to find the backend. This file is also in `.gitignore`.

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the development server.

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Deployment

The production deployment uses **Vercel for the frontend** and **Render for the backend**. Both platforms detect changes on the main branch and redeploy automatically on every push.

For Render, set the root directory to `backend`, the build command to `pip install -r requirements.txt`, and the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`. Add `ETHERSCAN_API_KEY` as an environment variable in the Render dashboard before deploying.

For Vercel, set the root directory to `frontend` and add `NEXT_PUBLIC_API_URL` as an environment variable pointing to your Render backend URL (for example, `https://quantumtrace-api.onrender.com`).

After both are deployed, update the `allow_origins` list in `backend/main.py` to include your actual Vercel URL if it differs from the current value.

---

## The Quantum Threat Context

The urgency behind QuantumTrace comes from a convergence of two forces in 2025–2026 that most people have not connected yet.

On one side, **tokenization is exploding**. BlackRock, Franklin Templeton, Nasdaq, and JPMorgan are tokenizing equities, bonds, real estate, and stablecoins onto blockchains — primarily Ethereum, which commands over 65% of all tokenized real-world assets. The on-chain value at stake is approaching tens of trillions of dollars.

On the other side, **the quantum threat is arriving faster than expected**. Google Quantum AI's March 2026 paper reduced the estimated qubit count needed to break ECDSA by roughly 20x compared to prior estimates, putting the threat firmly within a 3-to-5-year window. NIST finalized its post-quantum cryptography standards (FIPS 203, 204, 205) in August 2024. The Ethereum Foundation formed a dedicated Post-Quantum Security team in January 2026. The Strawmap, published the same month, outlines seven hard forks through 2029 targeting full quantum resistance.

The intersection — trillions in tokenized assets secured by an algorithm with a credible 2029 attack deadline — is the gap QuantumTrace addresses. Not by solving the protocol problem (that is engineering work years in progress) but by solving the awareness and action problem for individual users right now, while there is still time to act.

---

## Roadmap

Version 2.0 is the current release, covering all four major chains. The planned V3 features include ENS name resolution for Ethereum wallets (resolving `vitalik.eth` to its 0x address client-side via ethers.js), ERC-20 token balance aggregation so the total value at risk includes tokens not just the native asset, loading skeleton states for a more polished scan experience, batch scanning of multiple addresses, and the quantum vulnerability badge integration with PulseBoard.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. The project is intentionally kept simple — any contribution should align with the core principle of deterministic, read-only blockchain analysis with no AI calls and no wallet connections.

---

## Sources and Research

The claims in this project are grounded in primary sources. The full list is available at [quantumtrace.vercel.app/sources](https://quantumtrace.vercel.app/sources) and includes the Google Quantum AI March 2026 whitepaper, the Ethereum Foundation Strawmap, Vitalik Buterin's quantum roadmap post, Ripple's official post-quantum readiness document, Algorand's Falcon-1024 technical brief, and the NIST FIPS 203/204/205 standards documentation.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">

Built by [Laksh](https://github.com/LakshCoder10) · [quantumtrace.vercel.app](https://quantumtrace.vercel.app)

*Read-only · No wallet connection · Public blockchain data only*

</div>
