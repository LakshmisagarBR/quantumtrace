import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "QuantumTrace — Is Your Crypto Wallet Quantum Safe? | Free Scanner",
  description:
    "Free quantum vulnerability scanner for Ethereum, Bitcoin, Solana, and XRP wallets. Check if your crypto wallet is safe from quantum computers. Scan any address to see your real risk before quantum computing breaks blockchain encryption by 2029.",
  keywords: [
    "quantum safe wallet",
    "quantum computing crypto risk",
    "is my wallet quantum safe",
    "quantum threat blockchain",
    "ethereum quantum vulnerability",
    "bitcoin quantum attack",
    "solana quantum risk",
    "xrp quantum safe",
    "crypto wallet scanner",
    "quantum resistant blockchain",
    "ECDSA quantum threat",
    "post quantum cryptography crypto",
    "QuantumTrace",
  ],
  verification: {
    google: "KtmvnNLMW8DVwXldw9jO8dm9LU8OnypSmkqlCJZJivs",
  },
  openGraph: {
    title: "QuantumTrace — Is Your Crypto Wallet Quantum Safe?",
    description:
      "Free multi-chain quantum vulnerability scanner. Check if your Ethereum, Bitcoin, Solana, or XRP wallet is exposed to quantum attacks. Scan any address — no wallet connection required.",
    url: "https://quantumtrace.vercel.app",
    siteName: "QuantumTrace",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantumTrace — Is Your Crypto Wallet Quantum Safe?",
    description:
      "Free quantum vulnerability scanner for ETH, BTC, SOL, and XRP wallets. Scan any address to check your real risk.",
  },
  metadataBase: new URL("https://quantumtrace.vercel.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans dark", outfit.variable, jetbrainsMono.variable)}>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
