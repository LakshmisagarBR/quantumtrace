"use client";

import React from "react";
import { getChain, ChainId } from '@/lib/chains';

export type ResultType = {
  chain: string;
  address: string;
  is_exposed: boolean;
  exposure_date: string | null;
  exposure_duration: string | null;
  outgoing_tx_count: number;
  total_tx_count: number;
  balance: number;
  balance_unit: string;
  total_value_usd: number;
  total_value_inr: number;
  risk_score: number;
  risk_level: string;
  recommendation: string;
  migration_note: string;
  tokens: Array<{ symbol: string; balance: number }>;
};

type ChainEntry = {
  chain: string;
  ticker: string;
  algorithm: string;
  migration_status: string;
  status: "critical" | "progress" | "safe";
  progress_percent: number;
  last_updated: string;
  href: string;
};

const CHAIN_DATA: ChainEntry[] = [
  { chain: "Bitcoin", ticker: "BTC", algorithm: "ECDSA (secp256k1)", migration_status: "BIP 360 debated — no timeline", status: "critical", progress_percent: 5, last_updated: "April 2026", href: "https://bitcoin.org" },
  { chain: "Ethereum", ticker: "ETH", algorithm: "ECDSA + BLS", migration_status: "Strawmap active · 2030 target", status: "progress", progress_percent: 25, last_updated: "April 2026", href: "https://ethereum.org/roadmap/future-proofing/" },
  { chain: "Solana", ticker: "SOL", algorithm: "Ed25519", migration_status: "Dilithium testnet Dec 2025", status: "progress", progress_percent: 20, last_updated: "April 2026", href: "https://solana.com" },
  { chain: "XRP Ledger", ticker: "XRP", algorithm: "ECDSA / Ed25519", migration_status: "PQC roadmap · 2028 target", status: "progress", progress_percent: 30, last_updated: "April 2026", href: "https://ripple.com/insights/post-quantum-readiness-on-the-xrp-ledger/" },
  { chain: "Algorand", ticker: "ALGO", algorithm: "Falcon-1024 (NIST)", migration_status: "Live on mainnet Nov 2025", status: "safe", progress_percent: 85, last_updated: "April 2026", href: "https://algorand.co/technology/post-quantum" },
];

function truncateAddress(addr: string): string {
  if (addr.length <= 20) return addr;
  return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
}

export function ResultsDashboard({ result, onReset }: { result: ResultType | null; onReset: () => void }) {
  if (!result) return null;

  const isExposed = result.is_exposed;

  const chainDisplayName = result.chain === 'xrp' ? 'XRP Ledger' :
    result.chain.charAt(0).toUpperCase() + result.chain.slice(1);

  function getMigrationSteps(result: ResultType) {
    const chain = result.chain;
    const chainName = chain === 'xrp' ? 'XRP Ledger' :
      chain.charAt(0).toUpperCase() + chain.slice(1);
    const ticker = result.balance_unit;
    const date = result.exposure_date ?? 'an earlier date';

    const step01 = {
      num: "01",
      title: `Create a fresh ${chainName} wallet immediately`,
      desc: `Generate a brand new ${chainName} wallet address that has never sent any transaction. Its public key will remain hidden until it transacts. Never reuse an address that has previously signed a transaction on-chain.`,
      link: chain === 'ethereum' ? "→ HOW TO CREATE A SECURE WALLET"
        : chain === 'bitcoin' ? "→ HOW TO CREATE A SECURE WALLET"
        : chain === 'solana' ? "→ CREATE A PHANTOM WALLET"
        : "→ CREATE AN XUMM WALLET",
      href: chain === 'ethereum'
        ? "https://support.metamask.io/start/creating-a-new-wallet/"
        : chain === 'bitcoin'
        ? "https://support.metamask.io/start/getting-started-with-metamask"
        : chain === 'solana'
        ? "https://phantom.com"
        : "https://xumm.app",
      target: "_blank",
      tag: "DO NOW",
      tagClass: "text-destructive border-destructive/40 bg-destructive/10",
    };

    const step02 = {
      num: "02",
      title: `Migrate your assets to the fresh wallet`,
      desc: `Send all ${ticker} from your exposed wallet to the new address. Note: this transaction will expose the new wallet's key too — but your exposure clock resets to today, not ${date}.`,
      link: "→ MIGRATION CHECKLIST",
      href: "/migration-checklist",
      target: "_self",
      tag: "DO NOW",
      tagClass: "text-destructive border-destructive/40 bg-destructive/10",
    };

    const step03Ethereum = {
      num: "03",
      title: "Monitor Ethereum's EIP-8141 rollout",
      desc: `Ethereum's Hegotá upgrade (late 2026) introduces native quantum-resistant signature support. Once live, wallets can adopt post-quantum signatures without changing addresses. This is the permanent protocol-level fix.`,
      link: "→ ETHEREUM ROADMAP",
      href: "https://ethereum.org/roadmap/future-proofing/",
      target: "_blank",
      tag: "WATCH 2026",
      tagClass: "text-warning border-warning/40 bg-warning/10",
    };

    const step03Bitcoin = {
      num: "03",
      title: "Monitor BIP 360 developments",
      desc: `BIP 360 proposes a quantum-safe address format for Bitcoin, but has no implementation timeline as of 2026. Bitcoin's governance makes migration significantly harder than other chains. Monitor the Bitcoin development mailing list for progress.`,
      link: "→ BIP 360 PROPOSAL",
      href: "https://github.com/bitcoin/bips/blob/master/bip-0360.mediawiki",
      target: "_blank",
      tag: "WATCH — NO TIMELINE",
      tagClass: "text-warning border-warning/40 bg-warning/10",
    };

    const step03Solana = {
      num: "03",
      title: "Monitor Solana's Dilithium testnet progress",
      desc: `The Solana Foundation announced a Dilithium (ML-DSA) testnet in December 2025. Mainnet migration has no confirmed timeline yet. Watch Solana Foundation announcements for updates on when quantum-safe signatures arrive on mainnet.`,
      link: "→ SOLANA FOUNDATION NEWS",
      href: "https://solana.com/news",
      target: "_blank",
      tag: "WATCH 2026",
      tagClass: "text-warning border-warning/40 bg-warning/10",
    };

    const step03XRP = {
      num: "03",
      title: "Monitor XRP Ledger's post-quantum roadmap",
      desc: `Ripple published a detailed post-quantum readiness roadmap in April 2026, targeting full transition by 2028. H1 2026 milestones are active. XRPL's native key rotation gives existing accounts a practical migration path without losing their accounts — a structural advantage over most other chains.`,
      link: "→ XRPL POST-QUANTUM ROADMAP",
      href: "https://ripple.com/insights/post-quantum-readiness-on-the-xrp-ledger/",
      target: "_blank",
      tag: "WATCH 2026–2028",
      tagClass: "text-warning border-warning/40 bg-warning/10",
    };

    const step04 = {
      num: "04",
      title: "Consider quantum-safe chains for long-term holdings",
      desc: `For assets held beyond 2029, consider chains already running NIST-approved quantum-safe cryptography: Algorand (Falcon-1024 on mainnet since November 2025) or QANplatform (ML-DSA signatures, mainnet mid-2026).`,
      link: "→ ALGORAND POST-QUANTUM TECHNOLOGY",
      href: "https://algorand.co/technology/post-quantum",
      target: "_blank",
      tag: "LONG-TERM",
      tagClass: "text-safe border-safe/40 bg-safe/10",
    };

    const step03 = chain === 'ethereum' ? step03Ethereum
      : chain === 'bitcoin' ? step03Bitcoin
      : chain === 'solana' ? step03Solana
      : step03XRP;

    const exposedSteps = [step01, step02, step03, step04];
    const safeSteps = [
      { ...step03, num: "01" },
      { ...step04, num: "02" },
    ];

    return { exposedSteps, safeSteps };
  }

  const { exposedSteps, safeSteps } = getMigrationSteps(result);
  const migrationSteps = isExposed ? exposedSteps : safeSteps;

  return (
    <div className="w-full flex flex-col gap-10 pb-[100px] animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button
        onClick={onReset}
        className="flex items-center gap-2 font-mono text-[11px] text-muted hover:text-primary transition-colors tracking-[1px] mb-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        SCAN ANOTHER ADDRESS
      </button>

      {/* Contextual Banner */}
      <div className="w-full rounded-2xl border border-border bg-[rgba(0,229,255,0.05)] p-5 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-9 h-9 rounded-lg border border-primary bg-[rgba(0,229,255,0.12)] flex items-center justify-center shrink-0">
          <span className="text-primary font-serif italic text-lg">i</span>
        </div>
        <div>
          <h3 className="font-semibold text-[13px] text-foreground mb-1">
            What does this scan tell you?
          </h3>
          <p className="text-[12px] text-secondary leading-[1.6]">
            {isExposed
              ? "This is a forward-looking risk assessment, not an active attack alert. Your funds are safe today. This report shows whether action is needed before 2029."
              : "This wallet has never sent a transaction. Its public key has never been revealed on-chain and is currently not at risk from quantum attacks. No immediate action is required."}
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-muted tracking-[2px]">
          {"// SCAN COMPLETE • " + result.chain.toUpperCase() + " MAINNET"}
        </span>
        <a
          href={`${getChain(result.chain as ChainId)?.explorerUrl || ''}${result.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-lg border border-primary bg-[rgba(0,229,255,0.12)] hover:bg-[rgba(0,229,255,0.20)] transition-colors group"
          title={`View on ${getChain(result.chain as ChainId)?.name || ''} explorer`}
        >
          <span className="font-mono text-[12px] text-primary flex items-center">
            {truncateAddress(result.address)}
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">↗</span>
          </span>
        </a>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card
          title="PUBLIC KEY STATUS"
          value={isExposed ? "EXPOSED" : "NOT EXPOSED"}
          subValue={isExposed ? "Key visible on-chain since first send" : "No outgoing transactions found"}
          color={isExposed ? "destructive" : "safe"}
          extra={isExposed ? "Not an active attack — this key could be targeted when quantum hardware matures (~2029)." : "This wallet has not yet revealed its public key on-chain."}
        />
        <Card
          title="EXPOSURE DURATION"
          value={isExposed ? result.exposure_duration ?? "—" : "—"}
          subValue={isExposed ? `First exposed: ${result.exposure_date}` : "No exposure detected"}
          color={isExposed ? "warning" : "primary"}
        />
        <Card
          title="OUTGOING TRANSACTIONS"
          value={result.outgoing_tx_count.toString()}
          subValue={isExposed ? "Signature visible in every tx" : "Signature never revealed"}
          color="primary"
        />
        <Card
          title="VALUE AT RISK"
          value={`₹${Math.round(result.total_value_inr).toLocaleString('en-IN')}`}
          subValue={`~$${result.total_value_usd.toLocaleString()} USD`}
          extra2={`${result.balance.toFixed(4)} ${result.balance_unit}`}
          color={isExposed ? "destructive" : "safe"}
        />
      </div>

      {/* Risk Gauge */}
      <div className="w-full bg-card rounded-2xl border border-border p-6 md:p-8 flex flex-col gap-5">
        <div className="flex justify-between items-end">
          <span className="font-mono text-[11px] text-muted tracking-[2px]">{"// QUANTUM RISK SCORE"}</span>
          <span className={`font-mono text-[32px] font-bold text-${isExposed ? 'destructive' : 'safe'}`}>
            {result.risk_score} / 100
          </span>
        </div>
        
        <div className="w-full h-2 rounded-full bg-white/5 relative overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-safe via-warning to-destructive transition-all duration-1000"
            style={{ width: `${result.risk_score}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_10px_white] transition-all duration-1000"
            style={{ left: `calc(${result.risk_score}% - 1.5px)` }}
          />
        </div>
        
        <div className="flex justify-between font-outfit text-[10px]">
          <span className="text-safe">LOW RISK</span>
          <span className="text-muted">MODERATE</span>
          <span className="text-destructive">CRITICAL</span>
        </div>

        <p className="font-outfit text-[12px] text-secondary italic mt-2">
          This score reflects your 3-year forward risk exposure, not an immediate threat level.
        </p>

        <div className={`p-4 md:p-5 rounded-xl border-l-[3px] ${isExposed ? 'bg-destructive/10 border-destructive' : 'bg-safe/10 border-safe'}`}>
          <p className="font-mono text-[12px] text-secondary leading-[1.8]">
            {isExposed
              ? `This wallet was first exposed on ${result.exposure_date} — giving adversaries over ${result.exposure_duration?.split(' ')[0]} to harvest your public key from the blockchain. Combined with ₹${result.total_value_inr.toLocaleString()} in exposed assets and ${result.outgoing_tx_count} on-chain signatures, this wallet represents a ${result.risk_level.toLowerCase()}-priority migration target. Cryptographically relevant quantum computers are projected to arrive by 2029.`
              : `This wallet has never made an outgoing transaction, meaning its public key has never been revealed on the ${chainDisplayName} blockchain. While the wallet balance creates a small residual score, there is no active quantum exposure. Continue to use fresh addresses for any future transactions.`}
          </p>
        </div>
      </div>

      {/* ============================================ */}
      {/* PHASE 2 SECTION A: HNDL Warning with Timeline */}
      {/* ============================================ */}
      {isExposed && (
        <div className="w-full rounded-2xl border border-warning/30 bg-card p-6 md:p-8 relative">
          {/* Decorative watermark */}
          <span className="absolute top-4 right-6 text-[64px] opacity-[0.04] text-white pointer-events-none">⚠</span>

          <span className="font-mono text-[11px] text-warning tracking-[2px] block mb-5">
            {"// HARVEST NOW, DECRYPT LATER · ACTIVE THREAT"}
          </span>

          <p className="font-outfit text-[13px] text-secondary leading-[1.9] mb-4">
            Your public key has been publicly visible on the{' '}{chainDisplayName}{' '}blockchain since {result.exposure_date}. State-level adversaries and well-funded threat actors are known to be downloading entire blockchain datasets today — storing public keys to decrypt once quantum hardware matures.
          </p>
          <p className="font-outfit text-[13px] text-secondary leading-[1.9] mb-8">
            The Federal Reserve has explicitly warned that when quantum computing capability arrives, all historical transaction privacy collapses permanently. The harvesting of your public key may have already occurred — but there is still time to act.
          </p>

          {/* Timeline */}
          <span className="font-mono text-[10px] text-muted tracking-[2px] block mb-1">
            {"// YOUR EXPOSURE TIMELINE"}
          </span>

          <div className="flex flex-row items-start overflow-x-auto gap-0 py-4 mt-4">
            {/* Node 1 */}
            <div className="flex flex-col items-center min-w-[120px] flex-1">
              <div className="w-[10px] h-[10px] rounded-full bg-destructive shadow-[0_0_8px_2px_#ff3b5c]" />
              <span className="font-mono text-[10px] tracking-[1px] text-destructive mt-3">{result.exposure_date}</span>
              <span className="font-outfit text-[9px] text-muted text-center max-w-[100px] leading-[1.5] mt-1.5">Public key exposed on-chain</span>
            </div>
            {/* Line */}
            <div className="h-[1px] flex-1 bg-border min-w-[30px] self-start mt-[4px]" />
            {/* Node 2 */}
            <div className="flex flex-col items-center min-w-[120px] flex-1">
              <div className="w-[10px] h-[10px] rounded-full bg-destructive" />
              <span className="font-mono text-[10px] tracking-[1px] text-muted mt-3">AUG 2024</span>
              <span className="font-outfit text-[9px] text-muted text-center max-w-[100px] leading-[1.5] mt-1.5">NIST PQC standards finalized</span>
            </div>
            {/* Line */}
            <div className="h-[1px] flex-1 bg-border min-w-[30px] self-start mt-[4px]" />
            {/* Node 3 */}
            <div className="flex flex-col items-center min-w-[120px] flex-1">
              <div className={`w-[10px] h-[10px] rounded-full ${result.chain === 'bitcoin' ? 'bg-destructive' : 'bg-warning'} animate-pulse`} />
              <span className={`font-mono text-[10px] tracking-[1px] ${result.chain === 'bitcoin' ? 'text-destructive' : 'text-warning'} mt-3`}>NOW · 2026</span>
              <span className="font-outfit text-[9px] text-muted text-center max-w-[100px] leading-[1.5] mt-1.5">
                {result.chain === 'ethereum' ? 'ETH migration in progress' : result.chain === 'bitcoin' ? 'No migration roadmap active' : result.chain === 'solana' ? 'Dilithium testnet active' : 'XRPL PQC roadmap active'}
              </span>
            </div>
            {/* Line */}
            <div className="h-[1px] flex-1 bg-border min-w-[30px] self-start mt-[4px]" />
            {/* Node 4 */}
            <div className="flex flex-col items-center min-w-[120px] flex-1">
              <div className="w-[10px] h-[10px] rounded-full bg-muted" />
              <span className="font-mono text-[10px] tracking-[1px] text-muted mt-3">~2029</span>
              <span className="font-outfit text-[9px] text-muted text-center max-w-[100px] leading-[1.5] mt-1.5">CRQC risk window opens</span>
            </div>
            {/* Line */}
            <div className="h-[1px] flex-1 bg-border min-w-[30px] self-start mt-[4px]" />
            {/* Node 5 */}
            <div className="flex flex-col items-center min-w-[120px] flex-1">
              <div className="w-[10px] h-[10px] rounded-full bg-muted" />
              <span className="font-mono text-[10px] tracking-[1px] text-muted mt-3">2030</span>
              <span className="font-outfit text-[9px] text-muted text-center max-w-[100px] leading-[1.5] mt-1.5">ETH full quantum resistance</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PHASE 2 SECTION B: Migration Guide         */}
      {/* ========================================== */}
      <div className="w-full rounded-2xl bg-card border border-border p-6 md:p-8 lg:p-9">
        <span className="font-mono text-[11px] text-primary tracking-[2px] mb-6 block">
          {"// RECOMMENDED ACTION PLAN"}
        </span>

        <div className="flex flex-col gap-4">
          {migrationSteps.map((step) => (
            <div key={step.num} className="flex flex-row gap-5 items-start p-5 md:p-6 rounded-xl border border-border bg-bg-tertiary transition-all hover:border-primary cursor-default">
              <span className="font-mono text-xl text-primary opacity-40 font-bold min-w-[32px]">{step.num}</span>
              <div className="flex-1">
                <h4 className="font-outfit font-semibold text-[13px] text-foreground mb-1.5">{step.title}</h4>
                <p className="font-outfit text-[12px] text-secondary leading-[1.7] mb-2">{step.desc}</p>
                <a
                  href={step.href}
                  target={step.target || undefined}
                  rel={step.target ? "noopener noreferrer" : undefined}
                  className="font-mono text-[10px] text-primary border-b border-border pb-[1px] hover:border-primary transition-colors no-underline"
                >
                  {step.link}
                </a>
              </div>
              <span className={`font-mono text-[9px] tracking-[1px] px-2 py-1 rounded-sm border self-start shrink-0 ${step.tagClass}`}>
                {step.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Chain-specific migration note */}
        {result.migration_note && (
          <div className="mt-4 p-3 rounded-xl border border-border bg-bg-tertiary">
            <p className="font-mono text-[10px] text-muted leading-[1.7]">
              {"// CHAIN MIGRATION STATUS: "}{result.migration_note}
            </p>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* PHASE 2 SECTION C: Chain Status Board       */}
      {/* ========================================== */}

      {/* Section Divider */}
      <div className="flex flex-row items-center gap-4 my-8">
        <div className="flex-1 h-[1px] bg-border" />
        <span className="font-mono text-[10px] text-muted tracking-[3px]">CHAIN STATUS BOARD</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      <div className="w-full rounded-2xl bg-card border border-border p-6 md:p-8 lg:p-9">
        <span className="font-mono text-[11px] text-muted tracking-[1px] mb-6 block">
          {"// QUANTUM READINESS · MAJOR BLOCKCHAINS · UPDATED APRIL 2026"}
        </span>

        {/* Header Row */}
        <div className="flex flex-row items-center gap-2 pb-3 border-b border-border">
          <span className="font-outfit font-semibold text-[9px] text-muted tracking-[2px] uppercase flex-[2]">Chain</span>
          <span className="font-outfit font-semibold text-[9px] text-muted tracking-[2px] uppercase flex-[3] hidden md:block">Algorithm</span>
          <span className="font-outfit font-semibold text-[9px] text-muted tracking-[2px] uppercase flex-[4] hidden lg:block">Migration Status</span>
          <span className="font-outfit font-semibold text-[9px] text-muted tracking-[2px] uppercase flex-[2]">Status</span>
          <span className="font-outfit font-semibold text-[9px] text-muted tracking-[2px] uppercase flex-[2]">Progress</span>
        </div>

        {/* Data Rows */}
        {CHAIN_DATA.map((row, i) => (
          <div key={row.ticker} className={`flex flex-row items-center gap-2 py-4 ${i < CHAIN_DATA.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] transition-colors rounded-lg px-2`}>
            <a href={row.href} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-primary hover:underline flex-[2]">{row.chain}</a>
            <span className="font-mono text-[11px] text-muted flex-[3] hidden md:block">{row.algorithm}</span>
            <span className="font-outfit text-[11px] text-secondary flex-[4] hidden lg:block">{row.migration_status}</span>
            <div className="flex-[2]">
              <StatusPill status={row.status} />
            </div>
            <div className="flex items-center gap-2 flex-[2]">
              <div className="w-[70px] h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${row.status === 'critical' ? 'bg-destructive' : row.status === 'progress' ? 'bg-warning' : 'bg-safe'}`}
                  style={{ width: `${row.progress_percent}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-muted">{row.progress_percent}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* PHASE 2 SECTION D: Educational Footer       */}
      {/* ========================================== */}

      {/* Section Divider */}
      <div className="flex flex-row items-center gap-4 my-8">
        <div className="flex-1 h-[1px] bg-border" />
        <span className="font-mono text-[10px] text-muted tracking-[3px]">UNDERSTANDING THE THREAT</span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>

      <div className="w-full rounded-2xl bg-card border border-border p-6 md:p-8 lg:p-9 mb-16 overflow-hidden">
        <span className="font-mono text-[11px] text-muted tracking-[2px] mb-6 block">
          {"// TECHNICAL PRIMER · WHY THIS MATTERS"}
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          <div className="border-l-[2px] border-border pl-4 min-w-0">
            <span className="font-outfit font-semibold text-[12px] text-primary mb-2.5 block">
              What is Shor&apos;s Algorithm?
            </span>
            <p className="font-outfit text-[11px] text-muted leading-[1.8]">
              Developed by Peter Shor in 1994, Shor&apos;s Algorithm allows a quantum computer to solve the discrete logarithm problem — the mathematical foundation of elliptic curve cryptography — in polynomial time. On a classical computer, this would take billions of years. On a sufficiently powerful quantum machine, it could take minutes.
            </p>
            <a href="https://en.wikipedia.org/wiki/Shor%27s_algorithm" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary border-b border-border pb-[1px] hover:border-primary transition-colors no-underline mt-3 inline-block">→ Shor&apos;s Algorithm (Wikipedia)</a>
          </div>
          <div className="border-l-[2px] border-border pl-4 min-w-0">
            <span className="font-outfit font-semibold text-[12px] text-primary mb-2.5 block">
              Why is ECDSA vulnerable?
            </span>
            <p className="font-outfit text-[11px] text-muted leading-[1.8]">
              Ethereum&apos;s ECDSA signatures are designed to reveal your public key the moment you send any transaction. Once that public key is on-chain, Shor&apos;s Algorithm can derive your private key from it. Private key equals complete wallet ownership — and blockchain transactions are irreversible by design.
            </p>
            <a href="https://ethereum.org/roadmap/future-proofing/" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary border-b border-border pb-[1px] hover:border-primary transition-colors no-underline mt-3 inline-block">→ Ethereum post-quantum roadmap</a>
          </div>
          <div className="border-l-[2px] border-border pl-4 min-w-0">
            <span className="font-outfit font-semibold text-[12px] text-primary mb-2.5 block">
              What are NIST PQC Standards?
            </span>
            <p className="font-outfit text-[11px] text-muted leading-[1.8]">
              In August 2024, NIST finalized three post-quantum cryptography standards: ML-KEM (FIPS 203) for key encapsulation, ML-DSA / Dilithium (FIPS 204) for digital signatures, and SLH-DSA / SPHINCS+ (FIPS 205) for hash-based signatures. These are resistant to Shor&apos;s Algorithm and represent the current global standard for quantum-safe cryptography.
            </p>
            <a href="https://csrc.nist.gov/Projects/post-quantum-cryptography/post-quantum-cryptography-standardization" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-primary border-b border-border pb-[1px] hover:border-primary transition-colors no-underline mt-3 inline-block">→ NIST PQC Standards (Official)</a>
          </div>
        </div>
      </div>
      
    </div>
  );
}

/* ============================================ */
/* Sub-components                                */
/* ============================================ */

function StatusPill({ status }: { status: "critical" | "progress" | "safe" }) {
  const config = {
    critical: { text: "CRITICAL", dotClass: "bg-destructive", pillClass: "text-destructive border-destructive/40 bg-destructive/10" },
    progress: { text: "IN PROGRESS", dotClass: "bg-warning", pillClass: "text-warning border-warning/40 bg-warning/10" },
    safe: { text: "QUANTUM SAFE", dotClass: "bg-safe", pillClass: "text-safe border-safe/40 bg-safe/10" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border font-mono text-[9px] tracking-[1px] ${c.pillClass}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${c.dotClass}`} />
      {c.text}
    </span>
  );
}

function Card({ title, value, subValue, color, extra, extra2 }: { title: string; value: string; subValue: string; color: string; extra?: string; extra2?: string }) {
  const borderColor = color === 'destructive' ? 'border-destructive' : color === 'warning' ? 'border-warning' : color === 'safe' ? 'border-safe' : 'border-primary';
  const textColor = color === 'destructive' ? 'text-destructive' : color === 'warning' ? 'text-warning' : color === 'safe' ? 'text-safe' : 'text-primary';
  
  return (
    <div className={`bg-card rounded-2xl border border-border-strong border-t-[2px] ${borderColor} p-7 md:p-8 flex flex-col overflow-hidden`}>
      <span className="font-outfit font-semibold text-[10px] text-muted tracking-[2px] mb-3">{title}</span>
      <span className={`font-mono text-2xl font-bold ${textColor} mb-1 break-all`}>{value}</span>
      <span className="font-outfit text-[11px] text-muted">{subValue}</span>
      {extra2 && <span className="font-mono text-[11px] text-muted mt-0.5">{extra2}</span>}
      {extra && <span className="font-outfit text-[11px] text-secondary italic mt-3 pt-3 border-t border-border">{extra}</span>}
    </div>
  );
}
