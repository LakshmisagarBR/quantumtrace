"use client";

import React from "react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(6,8,15,0.90)] backdrop-blur-[12px] border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md border border-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.2)] animate-pulse">
            <span className="font-mono text-primary text-xs font-bold">QT</span>
          </div>
          <span className="font-mono text-primary text-lg tracking-[2px] font-bold">
            QUANTUMTRACE
          </span>
        </div>
        <div>
          <span className="px-3 py-1 rounded-md border border-muted text-muted font-mono text-[11px]">
            MULTI-CHAIN • v2.0
          </span>
        </div>
      </div>
    </nav>
  );
}
