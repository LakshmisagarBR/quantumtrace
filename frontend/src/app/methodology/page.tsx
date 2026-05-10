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
            {/* Section 1: Exposure Detection */}
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                How Exposure Is Detected
              </h3>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8]">
                QuantumTrace queries the blockchain&apos;s public transaction history for your wallet address using the relevant block explorer API (Etherscan for Ethereum, Blockchain.info for Bitcoin, Solana RPC for Solana, XRPL cluster for XRP). It filters for outgoing transactions — transactions where your address is the sender. The presence of any outgoing transaction confirms that your public key has been revealed on-chain via your ECDSA or Ed25519 signature. For Solana, the address itself is the public key, so any on-chain activity constitutes exposure. For XRP, the account Sequence number directly indicates the count of outgoing transactions.
              </p>
            </section>

            <div className="h-[1px] w-full bg-border" />

            {/* Section 2: Risk Score Calculation */}
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                How the Risk Score Is Calculated
              </h3>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8] mb-4">
                The risk score is a weighted composite from 0 to 100, composed of four components. Maximum score is 100.
              </p>

              {/* Component 1: Graduated Exposure Score */}
              <div className="p-4 rounded-xl border border-border bg-[rgba(0,229,255,0.03)] mb-4">
                <h4 className="font-outfit font-semibold text-[12px] text-primary mb-2 tracking-[1px]">
                  1. EXPOSURE SCORE (0–50 POINTS)
                </h4>
                <p className="font-outfit text-[12px] text-secondary leading-[1.7] mb-3">
                  Graduated based on the number of outgoing transactions — each transaction re-exposes your public key signature on-chain.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="font-mono text-[10px] text-muted tracking-[1px] py-2 pr-4">OUTGOING TXS</th>
                        <th className="font-mono text-[10px] text-muted tracking-[1px] py-2">POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[12px] text-secondary">
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">0 transactions</td>
                        <td className="py-2 text-safe">0 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">1–2 transactions</td>
                        <td className="py-2 text-warning">30 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">3–10 transactions</td>
                        <td className="py-2 text-warning">40 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">11–50 transactions</td>
                        <td className="py-2 text-destructive">45 points</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Over 50 transactions</td>
                        <td className="py-2 text-destructive">50 points</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Component 2: Years Exposed */}
              <div className="p-4 rounded-xl border border-border bg-[rgba(0,229,255,0.03)] mb-4">
                <h4 className="font-outfit font-semibold text-[12px] text-primary mb-2 tracking-[1px]">
                  2. YEARS EXPOSED (0–30 POINTS)
                </h4>
                <p className="font-outfit text-[12px] text-secondary leading-[1.7]">
                  6 points per full year since the first outgoing transaction, capped at 5 years (maximum 30 points). Calculated using the relativedelta between the first outgoing transaction timestamp and the current date.
                </p>
              </div>

              {/* Component 3: Value Score */}
              <div className="p-4 rounded-xl border border-border bg-[rgba(0,229,255,0.03)] mb-4">
                <h4 className="font-outfit font-semibold text-[12px] text-primary mb-2 tracking-[1px]">
                  3. VALUE SCORE (0–10 POINTS)
                </h4>
                <p className="font-outfit text-[12px] text-secondary leading-[1.7] mb-3">
                  Based on the wallet&apos;s current USD value, calculated as (token balance) × (CoinGecko USD price at time of scan).
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="font-mono text-[10px] text-muted tracking-[1px] py-2 pr-4">USD VALUE</th>
                        <th className="font-mono text-[10px] text-muted tracking-[1px] py-2">POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[12px] text-secondary">
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">Under $500</td>
                        <td className="py-2">0 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">$500 – $5,000</td>
                        <td className="py-2">3 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">$5,000 – $25,000</td>
                        <td className="py-2">5 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">$25,000 – $100,000</td>
                        <td className="py-2">7 points</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Over $100,000</td>
                        <td className="py-2">10 points</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Component 4: Transaction Count Score */}
              <div className="p-4 rounded-xl border border-border bg-[rgba(0,229,255,0.03)] mb-4">
                <h4 className="font-outfit font-semibold text-[12px] text-primary mb-2 tracking-[1px]">
                  4. TRANSACTION COUNT SCORE (0–10 POINTS)
                </h4>
                <p className="font-outfit text-[12px] text-secondary leading-[1.7] mb-3">
                  Higher transaction counts increase the statistical surface area for cryptanalytic attack.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="font-mono text-[10px] text-muted tracking-[1px] py-2 pr-4">OUTGOING TXS</th>
                        <th className="font-mono text-[10px] text-muted tracking-[1px] py-2">POINTS</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[12px] text-secondary">
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">0–5 transactions</td>
                        <td className="py-2">0 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">6–50 transactions</td>
                        <td className="py-2">4 points</td>
                      </tr>
                      <tr className="border-b border-white/[0.04]">
                        <td className="py-2 pr-4">51–200 transactions</td>
                        <td className="py-2">7 points</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Over 200 transactions</td>
                        <td className="py-2">10 points</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Unexposed wallets */}
              <div className="p-4 rounded-xl border border-border bg-[rgba(0,229,255,0.03)]">
                <h4 className="font-outfit font-semibold text-[12px] text-primary mb-2 tracking-[1px]">
                  UNEXPOSED WALLETS
                </h4>
                <p className="font-outfit text-[12px] text-secondary leading-[1.7]">
                  Wallets with zero outgoing transactions receive only a residual balance risk score (maximum 20 points) based on USD value: 5 for under $5,000; 8 for $5,000–$25,000; 14 for $25,000–$100,000; 20 for over $100,000. No exposure, years, or transaction count components apply.
                </p>
              </div>
            </section>

            <div className="h-[1px] w-full bg-border" />

            {/* Section 3: Chain-Specific Vulnerability Notes */}
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                Chain-Specific Vulnerability Notes
              </h3>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8] mb-4">
                Different blockchains use different signature algorithms, and these algorithms have different quantum vulnerability profiles.
              </p>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                  <h4 className="font-mono text-[11px] text-destructive mb-2 tracking-[1px]">ETH / BTC / XRP — ECDSA (secp256k1)</h4>
                  <p className="font-outfit text-[12px] text-secondary leading-[1.7]">
                    Ethereum, Bitcoin, and XRP Ledger all use ECDSA signatures based on the secp256k1 elliptic curve. This algorithm is vulnerable to <strong className="text-foreground">Shor&apos;s algorithm</strong>, which provides an exponential quantum speedup for solving the discrete logarithm problem. Once a sufficiently powerful quantum computer (CRQC) exists, exposed ECDSA public keys can be reversed to private keys in minutes. This is the most severe quantum vulnerability class in blockchain cryptography.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#a855f7]/20 bg-[#a855f7]/5">
                  <h4 className="font-mono text-[11px] text-[#a855f7] mb-2 tracking-[1px]">SOL — Ed25519</h4>
                  <p className="font-outfit text-[12px] text-secondary leading-[1.7]">
                    Solana uses Ed25519 signatures (Edwards-curve Digital Signature Algorithm). Ed25519 is vulnerable to <strong className="text-foreground">Grover&apos;s algorithm</strong>, which provides a quadratic quantum speedup — effectively halving the security bits. For a 128-bit key, this reduces effective security to ~64 bits, which is attackable but significantly less efficient than Shor&apos;s exponential attack on ECDSA. The quantum risk for Solana is real but arrives later than for ECDSA-based chains. Migration to post-quantum signatures is still recommended.
                  </p>
                </div>
              </div>

              <p className="font-outfit text-[12px] text-muted leading-[1.7] mt-3 italic">
                Note: QuantumTrace does not reduce the Solana risk score automatically. The same graduated scoring formula applies across all chains. The Ed25519 distinction is presented as contextual information for security-literate users to factor into their own threat models.
              </p>
            </section>

            <div className="h-[1px] w-full bg-border" />

            {/* Section 4: Risk Levels */}
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                Risk Level Classification
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="font-mono text-[10px] text-muted tracking-[1px] py-2 pr-4">SCORE RANGE</th>
                      <th className="font-mono text-[10px] text-muted tracking-[1px] py-2">LEVEL</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[12px]">
                    <tr className="border-b border-white/[0.04]">
                      <td className="py-2 pr-4 text-secondary">0–30</td>
                      <td className="py-2 text-safe">LOW</td>
                    </tr>
                    <tr className="border-b border-white/[0.04]">
                      <td className="py-2 pr-4 text-secondary">31–60</td>
                      <td className="py-2 text-warning">MODERATE</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-secondary">61–100</td>
                      <td className="py-2 text-destructive">CRITICAL</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <div className="h-[1px] w-full bg-border" />

            {/* Section 5: Data Sources */}
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                Data Sources
              </h3>
              <ul className="flex flex-col gap-3 font-outfit text-[13px] text-secondary leading-[1.8]">
                <li><strong className="text-foreground">Ethereum data:</strong> Etherscan V2 API (etherscan.io) — transaction history, ETH balance</li>
                <li><strong className="text-foreground">Bitcoin data:</strong> Blockchain.info rawaddr API (blockchain.info) — transaction history, BTC balance in satoshis</li>
                <li><strong className="text-foreground">Solana data:</strong> Solana Public RPC (api.mainnet-beta.solana.com) — account info, transaction signatures, SOL balance in lamports</li>
                <li><strong className="text-foreground">XRP data:</strong> XRPL Public Cluster (xrplcluster.com) — account info, account transactions, XRP balance in drops</li>
                <li><strong className="text-foreground">Price data:</strong> CoinGecko API (coingecko.com) — real-time USD prices for ETH, BTC, SOL, and XRP, fetched on every scan</li>
              </ul>
              <p className="font-outfit text-[13px] text-secondary leading-[1.8] mt-4 italic">
                QuantumTrace is read-only. It never requests wallet connection, private keys, or seed phrases. All data comes from public blockchain records. No AI models are used — the entire scoring pipeline is deterministic.
              </p>
            </section>

            <div className="h-[1px] w-full bg-border" />

            {/* Section 6: Homepage Statistics Sources */}
            <section>
              <h3 className="font-outfit font-semibold text-[14px] text-primary mb-3">
                Homepage Statistics Sources
              </h3>
              <ul className="flex flex-col gap-3 font-outfit text-[13px] text-secondary leading-[1.8]">
                <li><strong className="text-foreground">$2.4T BTC at risk:</strong> Based on Deloitte&apos;s 2024 report estimating approximately 25% of all Bitcoin resides in quantum-vulnerable addresses with exposed public keys.</li>
                <li><strong className="text-foreground">~2029 CRQC timeline:</strong> Projected timeline from the Global Risk Institute&apos;s 2024 Quantum Threat Timeline Report and Google Quantum AI&apos;s March 2026 responsible-disclosure paper.</li>
                <li><strong className="text-foreground">9 MIN key crack time:</strong> Based on theoretical CRQC estimates from the Quantum Threat Timeline Report (IQSD, 2024) and academic projections for Shor&apos;s algorithm on secp256k1 with approximately 4,000 logical qubits.</li>
                <li><strong className="text-foreground">65%+ RWAs on ETH:</strong> Based on RWA.xyz 2024 market data showing Ethereum hosts over 65% of all tokenized real-world assets by value across public blockchains.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
