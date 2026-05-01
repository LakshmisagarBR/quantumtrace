export type ChainId = 'ethereum' | 'bitcoin' | 'solana' | 'xrp';

export interface ChainConfig {
  id: ChainId;
  name: string;
  ticker: string;
  color: string;        // Tailwind color class for active tab
  borderColor: string;  // CSS color for active tab border
  placeholder: string;  // Input placeholder text
  helperText: string;   // Wallet apps that use this chain
  addressExample: string; // Example address for the placeholder
  apiPath: string;      // Backend endpoint path segment
  explorerUrl: string;  // Block explorer base URL for verification
  migrationNote: string; // Chain-specific migration status note
}

export const CHAINS: ChainConfig[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    ticker: 'ETH',
    color: 'text-cyan-400',
    borderColor: '#00e5ff',
    placeholder: '0x4f3a...b291',
    helperText: 'MetaMask · Trust Wallet · Coinbase Wallet · Rainbow',
    addressExample: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    apiPath: 'analyze',
    explorerUrl: 'https://etherscan.io/address/',
    migrationNote: 'Ethereum Strawmap targets full quantum resistance by 2030 via EIP-8141.'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    ticker: 'BTC',
    color: 'text-orange-400',
    borderColor: '#f97316',
    placeholder: '1A1zP1...or 3J98t...or bc1q...',
    helperText: 'Exodus · Electrum · Ledger BTC · Bitcoin Core',
    addressExample: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    apiPath: 'analyze/bitcoin',
    explorerUrl: 'https://blockchain.info/address/',
    migrationNote: 'Bitcoin has no active quantum migration plan. BIP 360 is debated with no implementation timeline.'
  },
  {
    id: 'solana',
    name: 'Solana',
    ticker: 'SOL',
    color: 'text-purple-400',
    borderColor: '#a855f7',
    placeholder: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
    helperText: 'Phantom · Solflare · Backpack · Glow',
    addressExample: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV',
    apiPath: 'analyze/solana',
    explorerUrl: 'https://solscan.io/account/',
    migrationNote: 'Solana Foundation announced Dilithium testnet in December 2025. Mainnet timeline not yet confirmed.'
  },
  {
    id: 'xrp',
    name: 'XRP',
    ticker: 'XRP',
    color: 'text-blue-400',
    borderColor: '#60a5fa',
    placeholder: 'rN7n3473SaZBCG4dFL83w7PB5AMxgLp9nB',
    helperText: 'XUMM · Ledger XRP · Coinbase XRP · Trust Wallet',
    addressExample: 'rN7n3473SaZBCG4dFL83w7PB5AMxgLp9nB',
    apiPath: 'analyze/xrp',
    explorerUrl: 'https://xrpscan.com/account/',
    migrationNote: 'XRP Ledger post-quantum roadmap targets full transition by 2028.'
  }
];

// Helper to get a chain config by its id
export function getChain(id: ChainId): ChainConfig {
  return CHAINS.find(c => c.id === id) || CHAINS[0];
}
