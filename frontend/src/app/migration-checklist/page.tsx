"use client";

import { Navbar } from "@/components/Navbar";

export default function MigrationChecklist() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 pt-20 pb-24 relative z-10">
        <span className="font-mono text-[11px] text-primary tracking-[2px] block mb-3">
          {"// QUANTUMTRACE · MIGRATION CHECKLIST"}
        </span>

        <h1 className="font-outfit text-[28px] md:text-[36px] font-bold text-foreground mb-3 leading-tight">
          Quantum-Safe Wallet Migration Checklist
        </h1>
        <p className="font-outfit text-[14px] text-secondary leading-[1.8] mb-10">
          If your wallet&apos;s public key has been exposed on-chain, follow this step-by-step
          checklist to migrate your assets to a fresh, unexposed address. This process takes
          approximately 15 minutes and requires no technical expertise beyond basic wallet usage.
        </p>

        <div className="flex flex-col gap-6">
          {/* Step 1 */}
          <div className="rounded-xl border border-border bg-card p-6 md:p-7">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xl text-primary opacity-40 font-bold min-w-[32px]">01</span>
              <div>
                <h2 className="font-outfit font-semibold text-[15px] text-foreground mb-2">
                  Prepare a fresh wallet
                </h2>
                <ul className="list-none flex flex-col gap-2.5">
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Open MetaMask, Rabby, or any non-custodial wallet and create a <strong className="text-foreground">new account</strong>.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    <strong className="text-foreground">Write down the seed phrase</strong> on paper. Never store it digitally, in screenshots, or in cloud storage.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Copy the new wallet&apos;s <strong className="text-foreground">receiving address</strong>. This address has never transacted — its public key is hidden.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-border bg-card p-6 md:p-7">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xl text-primary opacity-40 font-bold min-w-[32px]">02</span>
              <div>
                <h2 className="font-outfit font-semibold text-[15px] text-foreground mb-2">
                  Transfer all ETH first
                </h2>
                <ul className="list-none flex flex-col gap-2.5">
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    From your <strong className="text-foreground">exposed wallet</strong>, send your entire ETH balance (minus gas) to the new address.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Use a reasonable gas fee — there is no urgency today, but do not delay beyond a few days.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Wait for the transaction to <strong className="text-foreground">confirm on-chain</strong> before proceeding.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-border bg-card p-6 md:p-7">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xl text-primary opacity-40 font-bold min-w-[32px]">03</span>
              <div>
                <h2 className="font-outfit font-semibold text-[15px] text-foreground mb-2">
                  Transfer all ERC-20 tokens
                </h2>
                <ul className="list-none flex flex-col gap-2.5">
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Check your exposed wallet for <strong className="text-foreground">USDT, USDC, LINK, UNI, and any other tokens</strong> you hold.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Send each token individually to the new wallet. Each transfer requires its own gas fee in ETH — ensure you left enough ETH in Step 2.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    For NFTs, use your wallet&apos;s <strong className="text-foreground">&quot;Send NFT&quot;</strong> function or OpenSea&apos;s transfer feature.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-border bg-card p-6 md:p-7">
            <div className="flex items-start gap-4">
              <span className="font-mono text-xl text-primary opacity-40 font-bold min-w-[32px]">04</span>
              <div>
                <h2 className="font-outfit font-semibold text-[15px] text-foreground mb-2">
                  Verify and decommission
                </h2>
                <ul className="list-none flex flex-col gap-2.5">
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    <strong className="text-foreground">Scan your new wallet</strong> on QuantumTrace. It should show &quot;NOT EXPOSED&quot; with a low risk score.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    Verify on <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="text-primary border-b border-primary/30 hover:border-primary no-underline transition-colors">etherscan.io</a> that the old wallet balance is zero.
                  </li>
                  <li className="font-outfit text-[12px] text-secondary leading-[1.7] pl-4 border-l-2 border-border">
                    <strong className="text-foreground">Never send from the new wallet</strong> until Ethereum&apos;s EIP-8141 quantum-resistant signatures ship (expected late 2026). Receiving is always safe.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Important note */}
        <div className="mt-10 p-5 md:p-6 rounded-xl border border-warning/30 bg-warning/5">
          <span className="font-mono text-[10px] text-warning tracking-[2px] block mb-2">
            {"// IMPORTANT NOTE"}
          </span>
          <p className="font-outfit text-[12px] text-secondary leading-[1.8]">
            Sending a transaction from the new wallet will expose its public key — resetting your exposure clock to that date. 
            For maximum security, use the new wallet <strong className="text-foreground">only for receiving</strong> until Ethereum implements 
            native post-quantum signatures. If you must transact, repeat this migration process afterward.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-10">
          <a href="/" className="font-mono text-[11px] text-primary border-b border-primary/30 hover:border-primary no-underline transition-colors tracking-[1px]">
            ← BACK TO SCANNER
          </a>
        </div>
      </main>

      <footer className="w-full border-t border-border py-6 px-6 mt-auto">
        <div className="max-w-[800px] mx-auto flex flex-row items-center justify-between flex-wrap gap-3">
          <span className="font-mono text-[10px] text-muted tracking-[1px]">
            © 2026 QUANTUMTRACE · READ-ONLY · NO WALLET CONNECTION
          </span>
          <a href="https://github.com/LakshmisagarBR/quantumtrace" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted hover:text-primary transition-colors no-underline tracking-[1px]">
            GITHUB
          </a>
        </div>
      </footer>
    </div>
  );
}
