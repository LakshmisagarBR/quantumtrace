"use client";

import React, { useState } from "react";

export function Hero({ onScan }: { onScan: (address: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onScan(input.trim());
    }
  };

  return (
    <section className="pt-[100px] pb-[80px] w-full flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-strong bg-[rgba(0,229,255,0.12)] mb-8">
        <div className="w-[6px] h-[6px] rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-primary text-[11px] tracking-[2px]">
          LIVE THREAT SCANNER • ETHEREUM MAINNET
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.05] mb-5 tracking-tight text-foreground">
        Is Your Wallet <br />
        <span className="text-primary">Quantum Safe?</span>
      </h1>

      <p className="font-mono text-muted text-sm max-w-[500px] leading-[1.7] mb-12">
        Quantum computers arriving by 2029 can derive private keys from exposed
        public keys. Scan any Ethereum address to find out your real risk —
        before it is too late.
      </p>

      <div className="w-full max-w-[640px] flex flex-col items-start text-left">
        <label className="font-mono text-[10px] text-muted tracking-[2px] mb-2 uppercase">
          {"// ENTER ETHEREUM WALLET ADDRESS"}
        </label>
        
        <form 
          onSubmit={handleSubmit}
          className="w-full flex items-stretch h-[56px] rounded-xl border border-border-strong bg-bg-secondary focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(0,229,255,0.15)] transition-all overflow-hidden"
        >
          <div className="min-w-[80px] px-4 flex items-center justify-center bg-[rgba(0,229,255,0.12)] border-r border-border">
            <span className="font-mono text-primary text-xs font-bold">ETH://</span>
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-foreground tracking-[1px] px-[18px] placeholder:text-muted"
            placeholder="0x4f3a...b291 (Ethereum address)"
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

      <div className="w-full max-w-[1100px] mt-[60px] border-y border-border py-6 flex flex-wrap gap-6 items-center justify-between px-8 bg-[#0b0f1a]/50">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="font-mono text-2xl font-bold text-primary">$2.4T</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">BTC AT RISK</span>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="font-mono text-2xl font-bold text-primary">~2029</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">CRQC TIMELINE</span>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="font-mono text-2xl font-bold text-primary">9 MIN</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">KEY CRACK TIME</span>
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
          <span className="font-mono text-2xl font-bold text-primary">65%+</span>
          <span className="text-[9px] text-muted tracking-[2px] uppercase font-semibold">RWAs ON ETH</span>
        </div>
      </div>
    </section>
  );
}
