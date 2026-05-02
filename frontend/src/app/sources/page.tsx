import React from "react";
import { Navbar } from "@/components/Navbar";

export default function Sources() {
  const sources = [
    {
      title: "Google Quantum AI — March 2026 whitepaper on breaking ECDSA",
      url: "https://quantumai.google/research/overview"
    },
    {
      title: "Ethereum post-quantum roadmap (ethereum.org)",
      url: "https://ethereum.org/roadmap/future-proofing/"
    },
    {
      title: "Ethereum Strawmap",
      url: "https://strawmap.org"
    },
    {
      title: "Ethereum pq.ethereum.org (EF Post-Quantum team)",
      url: "https://pq.ethereum.org"
    },
    {
      title: "EIP-8141 specification",
      url: "https://eips.ethereum.org/EIPS/eip-8141"
    },
    {
      title: "NIST Post-Quantum Cryptography Standards (FIPS 203/204/205)",
      url: "https://csrc.nist.gov/Projects/post-quantum-cryptography/post-quantum-cryptography-standardization"
    },
    {
      title: "Algorand post-quantum technology",
      url: "https://algorand.co/technology/post-quantum"
    },
    {
      title: "Algorand Falcon signatures technical brief (Nov 3 2025)",
      url: "https://algorand.co/blog/technical-brief-quantum-resistant-transactions-on-algorand-with-falcon-signatures"
    },
    {
      title: "Ripple XRP Ledger post-quantum readiness (Apr 20 2026)",
      url: "https://ripple.com/insights/post-quantum-readiness-on-the-xrp-ledger/"
    },
    {
      title: "Solana Foundation — Dilithium testnet announcement (Dec 2025)",
      url: "https://solana.com/news"
    },
    {
      title: "Shor's Algorithm — Wikipedia",
      url: "https://en.wikipedia.org/wiki/Shor%27s_algorithm"
    },
    {
      title: "Tangem — Quantum-resistant crypto guide (April 2026)",
      url: "https://tangem.com/en/blog/post/quantum-resistant-crypto/"
    }
  ];

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
            {"// PRIMARY SOURCES"}
          </span>

          <div className="flex flex-col gap-3">
            {sources.map((source, index) => (
              <div key={index} className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-bg-tertiary">
                <span className="font-outfit text-[13px] text-foreground font-medium">
                  {source.title}
                </span>
                <a 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-mono text-[10px] text-primary hover:underline break-all"
                >
                  {source.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
