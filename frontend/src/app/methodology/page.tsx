import React from "react";
import { Navbar } from "@/components/Navbar";

export default function Methodology() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-16 pb-24 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <a href="/" className="inline-flex items-center gap-2 font-mono text-[11px] text-muted hover:text-primary transition-colors tracking-[1px] mb-8 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          BACK TO QUANTUMTRACE
        </a>

        <div className="w-full rounded-2xl bg-card border border-border p-6 md:p-8 lg:p-9">
          <span className="font-mono text-[11px] text-primary tracking-[2px] mb-6 block">
            {"// METHODOLOGY"}
          </span>

          <div className="flex flex-col gap-8">
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                How Exposure Is Detected
              </h3>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8]">
                QuantumTrace queries the blockchain&apos;s public transaction history for your wallet address using the relevant block explorer API (Etherscan for Ethereum, Blockchain.info for Bitcoin, Solana RPC for Solana, XRPL cluster for XRP). It filters for outgoing transactions — transactions where your address is the sender. The presence of any outgoing transaction confirms that your public key has been revealed on-chain via your ECDSA or Ed25519 signature. For Solana, the address itself is the public key, so any on-chain activity constitutes exposure. For XRP, the account Sequence number directly indicates the count of outgoing transactions.
              </p>
            </section>

            <div className="h-[1px] w-full bg-border" />

            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                How the Risk Score Is Calculated
              </h3>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8]">
                The risk score is a weighted composite from 0 to 100.<br/><br/>
                Exposure binary: 50 points if any outgoing transaction exists.<br/>
                Years exposed: up to 30 points (6 points per year, capped at 5 years).<br/>
                Value score: 0 to 10 points based on INR value brackets (0 for under ₹10,000; 4 for ₹10,000–1,00,000; 7 for ₹1,00,000–5,00,000; 10 for over ₹5,00,000).<br/>
                Transaction count score: 0 to 10 points based on outgoing transaction count (0 for under 5; 4 for 5–50; 7 for 50–200; 10 for over 200).<br/><br/>
                Not exposed wallets score a maximum of 20 based on balance risk only.
              </p>
            </section>

            <div className="h-[1px] w-full bg-border" />

            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                Data Sources
              </h3>
              <ul className="flex flex-col gap-3 font-outfit text-[13px] text-secondary leading-[1.8]">
                <li>Ethereum data: Etherscan API (etherscan.io)</li>
                <li>Bitcoin data: Blockchain.info API (blockchain.info)</li>
                <li>Solana data: Solana Public RPC (api.mainnet-beta.solana.com)</li>
                <li>XRP data: XRPL Public Cluster (xrplcluster.com)</li>
                <li>Price data: CoinGecko API (coingecko.com) — updated in real-time on every scan</li>
              </ul>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8] mt-4 italic">
                QuantumTrace is read-only. It never requests wallet connection, private keys, or seed phrases. All data comes from public blockchain records.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
