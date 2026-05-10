"use client";

import React, { useState } from "react";
import { CHAINS, ChainId } from "@/lib/chains";

function StatWithTooltip({ value, label, citation }: { value: string; label: string; citation: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="flex flex-col items-center text-center gap-1 py-5 md:items-start md:text-left relative cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(prev => !prev)}
    >
      <span className="font-mono text-2xl font-bold text-primary">
        {value}
        <sup className="text-[9px] text-muted font-normal ml-0.5 align-super">ⓘ</sup>
      </span>
      <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">{label}</span>
      {showTooltip && (
        <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 mt-2 w-[260px] p-3 rounded-lg border border-border-strong bg-[#0b0f1a] shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-border-strong" />
          <p className="font-outfit text-[10px] text-secondary leading-[1.6] text-center">
            {citation}
          </p>
        </div>
      )}
    </div>
  );
}

export function Hero({ onScan }: { onScan: (address: string, chain: string) => void }) {
  const [input, setInput] = useState("");
  const [activeChain, setActiveChain] = useState<ChainId>('ethereum');
  const activeChainConfig = CHAINS.find(c => c.id === activeChain) || CHAINS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onScan(input.trim(), activeChain);
    }
  };

  // Prefix label per chain
  const prefixMap: Record<ChainId, string> = {
    ethereum: 'ETH://',
    bitcoin: 'BTC://',
    solana: 'SOL://',
    xrp: 'XRP://',
  };

  return (
    <section className="pt-[72px] md:pt-[100px] pb-[40px] md:pb-[80px] w-full flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-strong bg-[rgba(0,229,255,0.12)] mb-8">
        <div className="w-[6px] h-[6px] rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-primary text-[11px] tracking-[2px]">
          LIVE THREAT SCANNER • MULTI-CHAIN
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.05] mb-5 tracking-tight text-foreground">
        Is Your Wallet <br />
        <span className="text-primary">Quantum Safe?</span>
      </h1>

      <p className="font-mono text-muted text-sm max-w-[500px] leading-[1.7] mb-8 md:mb-12">
        Quantum computers arriving by 2029 can derive private keys from exposed
        public keys. Scan any Ethereum, Bitcoin, Solana, or XRP address to find out your real risk —
        before it is too late.
      </p>

      {/* Chain Tab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 max-w-[640px] mx-auto pb-1 w-full">
        {CHAINS.map((chain) => (
          <button
            key={chain.id}
            onClick={() => {
              setActiveChain(chain.id);
              setInput(''); // Clear input when switching chains
            }}
            className={`
              w-full py-2 px-2 md:px-3 rounded-xl border font-mono text-[11px]
              tracking-[1px] transition-all duration-200 whitespace-nowrap
              ${activeChain === chain.id
                ? 'bg-card border-current font-semibold'
                : 'border-border text-muted hover:border-border-strong hover:text-secondary'
              }
            `}
            style={activeChain === chain.id ? { color: chain.borderColor, borderColor: chain.borderColor } : {}}
          >
            {chain.name}
          </button>
        ))}
      </div>

      {/* Helper text for wallet apps */}
      <p className="font-mono text-[10px] text-muted tracking-[1px] mb-3 max-w-[640px] mx-auto text-left w-full">
        {"// "}{activeChainConfig.helperText}
      </p>

      <div className="w-full max-w-[640px] flex flex-col items-start text-left">
        <label className="font-mono text-[10px] text-muted tracking-[2px] mb-2 uppercase">
          {"// ENTER " + activeChainConfig.name.toUpperCase() + " WALLET ADDRESS"}
        </label>
        
        <form 
          onSubmit={handleSubmit}
          className="w-full flex items-stretch h-[56px] rounded-xl border border-border-strong bg-bg-secondary focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all overflow-hidden"
        >
          <div
            className="min-w-[80px] px-4 flex items-center justify-center border-r border-border"
            style={{ backgroundColor: `${activeChainConfig.borderColor}1F`, color: activeChainConfig.borderColor }}
          >
            <span className="font-mono text-xs font-bold">{prefixMap[activeChain]}</span>
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-foreground tracking-[1px] px-[18px] placeholder:text-muted"
            placeholder={activeChainConfig.placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="h-full px-7 bg-primary text-black font-bold text-xs tracking-[2px] hover:bg-[#33ecff] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-2"
          >
            SCAN <span>→</span>
          </button>
        </form>
        
        <span className="font-mono text-[10px] text-muted mt-2.5 block">
          {"// No wallet connection required. Read-only analysis using public blockchain data."}
        </span>
      </div>

      <div className="w-full max-w-[1100px] mt-[40px] md:mt-[60px] rounded-2xl border border-border py-0 md:py-6 grid grid-cols-2 md:flex md:flex-wrap md:gap-6 md:items-center md:justify-between md:px-8 bg-[#0b0f1a]/50 overflow-visible">
        <div className="border-b border-r md:border-0 border-border">
          <StatWithTooltip
            value="$2.4T"
            label="BTC AT RISK"
            citation="Based on Deloitte's 2024 report estimating ~25% of all Bitcoin (worth trillions) is in quantum-vulnerable addresses with exposed public keys."
          />
        </div>
        <div className="border-b md:border-0 border-border">
          <StatWithTooltip
            value="~2029"
            label="CRQC TIMELINE"
            citation="Projected timeline from the Global Risk Institute's 2024 Quantum Threat Timeline Report and Google Quantum AI's March 2026 responsible-disclosure paper."
          />
        </div>
        <div className="border-r md:border-0 border-border">
          <StatWithTooltip
            value="9 MIN"
            label="KEY CRACK TIME"
            citation="Based on theoretical CRQC estimates from the Quantum Threat Timeline Report (IQSD, 2024) and academic projections for Shor's algorithm on secp256k1 with ~4,000 logical qubits."
          />
        </div>
        <div>
          <StatWithTooltip
            value="65%+"
            label="RWAs ON ETH"
            citation="Based on RWA.xyz 2024 market data showing Ethereum hosts over 65% of all tokenized real-world assets by value across public blockchains."
          />
        </div>
      </div>
    </section>
  );
}

