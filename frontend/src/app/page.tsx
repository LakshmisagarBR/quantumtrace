"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import type { ResultType } from "@/components/ResultsDashboard";
import { useState } from "react";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (scannedAddress: string) => {
    setAddress(scannedAddress);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/${scannedAddress}`);
      if (!response.ok) {
        let errorMsg = "Failed to scan address. It might be invalid or network error.";
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMsg = errorData.detail;
        } catch {
          // response wasn't JSON, use default message
        }
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 pt-16 relative z-10">
        {!address || (error && !loading) ? (
          <Hero onScan={handleScan} />
        ) : loading ? (
          <div className="py-[150px] flex flex-col items-center justify-center">
            <div className="w-[60px] h-[60px] rounded-full border-[3px] border-border-strong border-t-primary animate-spin mb-6" />
            <h2 className="text-sm tracking-[3px] text-primary font-mono mb-2">SCANNING BLOCKCHAIN...</h2>
            <p className="text-muted font-mono text-xs">{address}</p>
          </div>
        ) : (
          <div className="pt-8">
            <ResultsDashboard result={result} />
          </div>
        )}
        
        {error && (
          <div className="max-w-[640px] mx-auto mt-4 p-4 border border-destructive bg-destructive/10 rounded-lg text-center text-destructive font-mono text-sm">
            {error}
          </div>
        )}
      </main>

      {/* Page Footer Bar */}
      <footer className="w-full border-t border-border py-6 px-6 mt-auto">
        <div className="max-w-[1200px] mx-auto flex flex-row items-center justify-between flex-wrap gap-3">
          <span className="font-mono text-[10px] text-muted tracking-[1px]">
            © 2026 QUANTUMTRACE · READ-ONLY · NO WALLET CONNECTION
          </span>
          <div className="flex flex-row gap-5">
            <a href="https://github.com/LakshmisagarBR/quantumtrace" target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-muted hover:text-primary transition-colors no-underline tracking-[1px]">
              GITHUB
            </a>
            <a href="#" className="font-mono text-[10px] text-muted hover:text-primary transition-colors no-underline tracking-[1px]">
              METHODOLOGY
            </a>
            <a href="#" className="font-mono text-[10px] text-muted hover:text-primary transition-colors no-underline tracking-[1px]">
              SOURCES
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
