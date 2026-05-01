"use client";

import React, { useState } from "react";
import { CHAINS, ChainId } from "@/lib/chains";

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
      <div className="flex flex-row flex-wrap gap-2 mb-4 max-w-[640px] mx-auto pb-1 w-full justify-center md:justify-start">
        {CHAINS.map((chain) => (
          <button
            key={chain.id}
            onClick={() => {
              setActiveChain(chain.id);
              setInput(''); // Clear input when switching chains
            }}
            className={`
              flex-1 min-w-[70px] py-2 px-2 md:px-3 rounded-xl border font-mono text-[11px]
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

      <div className="w-full max-w-[1100px] mt-[40px] md:mt-[60px] rounded-2xl md:rounded-none border md:border-y md:border-x-0 border-border py-0 md:py-6 grid grid-cols-2 md:flex md:flex-wrap md:gap-6 md:items-center md:justify-between md:px-8 bg-[#0b0f1a]/50 overflow-hidden">
        <div className="flex flex-col items-center text-center gap-1 py-5 border-b border-r md:border-0 border-border md:items-start md:text-left">
          <span className="font-mono text-2xl font-bold text-primary">$2.4T</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">BTC AT RISK</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1 py-5 border-b md:border-0 border-border md:items-start md:text-left">
          <span className="font-mono text-2xl font-bold text-primary">~2029</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">CRQC TIMELINE</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1 py-5 border-r md:border-0 border-border md:items-start md:text-left">
          <span className="font-mono text-2xl font-bold text-primary">9 MIN</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">KEY CRACK TIME</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1 py-5 md:items-start md:text-left">
          <span className="font-mono text-2xl font-bold text-primary">65%+</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">RWAs ON ETH</span>
        </div>
      </div>
    </section>
  );
}
