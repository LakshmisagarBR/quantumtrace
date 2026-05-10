import React from "react";
import { Navbar } from "@/components/Navbar";

export default function MigrationChecklist() {
  const steps = [
    {
      num: "01",
      title: "Create a fresh wallet",
      desc: "Generate a completely new wallet address using the official app for your blockchain. Do not use any address that has previously signed a transaction. Write down your seed phrase on paper and store it offline in a secure location.",
    },
    {
      num: "02",
      title: "Test with a small amount first",
      desc: "Send a small test transaction ($1 or less) from your old wallet to the new address. Confirm it arrives correctly by checking the block explorer. This verifies you have the correct address before transferring your full balance.",
    },
    {
      num: "03",
      title: "Transfer your full balance",
      desc: "Once the test transaction is confirmed, send the remaining funds from your exposed wallet to the new address. For ETH and Solana, remember to leave a small amount to cover the final gas or transaction fee.",
    },
    {
      num: "04",
      title: "Verify on the block explorer",
      desc: "After the transfer, paste your new wallet address into the relevant block explorer (Etherscan, Solscan, Blockchain.info, or XRPScan) and confirm the full balance has arrived. Do not use the exposed wallet again.",
    },
    {
      num: "05",
      title: "Monitor your chain's quantum-safe upgrade",
      desc: "Your migration buys you time, but is not a permanent fix. The sending transaction from your new wallet will eventually expose its public key too. The permanent fix comes when your chain deploys quantum-resistant signatures at the protocol level. Monitor the roadmap links below for your specific chain.",
    },
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
            {"// MIGRATION CHECKLIST"}
          </span>

          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-row gap-5 items-start p-5 md:p-6 rounded-xl border border-border bg-bg-tertiary transition-all hover:border-primary cursor-default">
                <span className="font-mono text-xl text-primary opacity-40 font-bold min-w-[32px]">{step.num}</span>
                <div className="flex-1">
                  <h4 className="font-outfit font-semibold text-[13px] text-foreground mb-1.5">{step.title}</h4>
                  <p className="font-outfit text-[12px] text-secondary leading-[1.7]">{step.desc}</p>
                  
                  {step.num === "05" && (
                    <div className="mt-4 flex flex-col gap-2">
                      <a href="https://ethereum.org/roadmap/future-proofing/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary hover:underline self-start">→ Ethereum Roadmap</a>
                      <a href="https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary hover:underline self-start">→ Bitcoin BIP 360</a>
                      <a href="https://solana.com/news" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary hover:underline self-start">→ Solana News</a>
                      <a href="https://ripple.com/insights/post-quantum-readiness-on-the-xrp-ledger/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary hover:underline self-start">→ XRP Ledger Roadmap</a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
