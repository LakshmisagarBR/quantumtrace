"use client";

import React from "react";

export type ResultType = {
  is_exposed: boolean;
  address: string;
  exposure_duration: string;
  exposure_date: string;
  outgoing_tx_count: number;
  total_value_inr: number;
  total_value_usd: number;
  eth_balance: number;
  risk_score: number;
  risk_level: string;
};

export function ResultsDashboard({ result }: { result: ResultType | null }) {
  if (!result) return null;

  const isExposed = result.is_exposed;

  return (
    <div className="w-full flex flex-col gap-8 pb-[100px] animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Contextual Banner */}
      <div className="w-full rounded-2xl border border-border bg-[rgba(0,229,255,0.05)] p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
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
          {"// SCAN COMPLETE • ETHEREUM MAINNET"}
        </span>
        <div className="px-3 py-1.5 rounded-lg border border-primary bg-[rgba(0,229,255,0.12)]">
          <span className="font-mono text-[12px] text-primary">{result.address}</span>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          title="PUBLIC KEY STATUS"
          value={isExposed ? "EXPOSED" : "NOT EXPOSED"}
          subValue={isExposed ? "Key visible on-chain since first send" : "No outgoing transactions found"}
          color={isExposed ? "destructive" : "safe"}
          extra={isExposed ? "Not an active attack — this key could be targeted when quantum hardware matures (~2029)." : "This wallet has not yet revealed its public key on-chain."}
        />
        <Card
          title="EXPOSURE DURATION"
          value={isExposed ? result.exposure_duration : "—"}
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
          value={`₹${(result.total_value_inr).toLocaleString()}`}
          subValue={`~$${(result.total_value_usd).toLocaleString()} USD • ${result.eth_balance.toFixed(2)} ETH`}
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

        <div className={`p-4 md:p-5 rounded-xl border-l-[3px] bg-${isExposed ? 'destructive' : 'safe'}/10 border-${isExposed ? 'destructive' : 'safe'}`}>
          <p className="font-mono text-[12px] text-secondary leading-[1.8]">
            {isExposed
              ? `This wallet was first exposed on ${result.exposure_date} — giving adversaries over ${result.exposure_duration.split(' ')[0]} to harvest your public key from the blockchain. Combined with ₹${result.total_value_inr.toLocaleString()} in exposed assets and ${result.outgoing_tx_count} on-chain signatures, this wallet represents a ${result.risk_level.toLowerCase()}-priority migration target. Cryptographically relevant quantum computers are projected to arrive by 2029.`
              : "This wallet has never made an outgoing transaction, meaning its public key has never been revealed on the Ethereum blockchain. While the wallet balance creates a small residual score, there is no active quantum exposure. Continue to use fresh addresses for any future transactions."}
          </p>
        </div>
      </div>
      
    </div>
  );
}

function Card({ title, value, subValue, color, extra }: { title: string, value: string, subValue: string, color: string, extra?: string }) {
  const borderColor = color === 'destructive' ? 'border-destructive' : color === 'warning' ? 'border-warning' : color === 'safe' ? 'border-safe' : 'border-primary';
  const textColor = color === 'destructive' ? 'text-destructive' : color === 'warning' ? 'text-warning' : color === 'safe' ? 'text-safe' : 'text-primary';
  
  return (
    <div className={`bg-card rounded-2xl border border-border-strong border-t-[2px] ${borderColor} p-6 flex flex-col`}>
      <span className="font-outfit font-semibold text-[10px] text-muted tracking-[2px] mb-3">{title}</span>
      <span className={`font-mono text-2xl font-bold ${textColor} mb-1`}>{value}</span>
      <span className="font-outfit text-[11px] text-muted">{subValue}</span>
      {extra && <span className="font-outfit text-[11px] text-secondary italic mt-3 pt-3 border-t border-border">{extra}</span>}
    </div>
  );
}
