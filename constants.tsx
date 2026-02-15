
import { Chain, Token, NewsItem } from './types.ts';

export const CHAINS: Chain[] = [
  { id: 'ethereum', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', color: '#627EEA' },
  { id: 'bsc', name: 'BNB Smart Chain', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', color: '#F3BA2F' },
  { id: 'solana', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', color: '#14F195' },
  { id: 'base', name: 'Base', icon: 'https://avatars.githubusercontent.com/u/108554348?v=4', color: '#0052FF' },
  { id: 'tron', name: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png', color: '#FF0013' },
  { id: 'avalanche', name: 'Avalanche C-chain', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', color: '#E84142' },
  { id: 'ton', name: 'Ton', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png', color: '#0088CC' },
  { id: 'cronos', name: 'Cronos chain', icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png', color: '#002D74' },
  { id: 'arbitrum', name: 'Arbitrum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', color: '#28A0F0' },
  { id: 'polygon', name: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png', color: '#8247E5' },
  { id: 'gnosis', name: 'Gnosis chain', icon: 'https://cryptologos.cc/logos/gnosis-gno-logo.png', color: '#00a68c' },
  { id: 'optimism', name: 'OP Mainnet', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png', color: '#FF0420' },
];

export const TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', decimals: 18 },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', decimals: 18 },
  { symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', decimals: 9 },
  { symbol: 'TRX', name: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png', decimals: 6 },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', decimals: 18 },
  { symbol: 'TON', name: 'Toncoin', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png', decimals: 9 },
  { symbol: 'CRO', name: 'Cronos', icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png', decimals: 18 },
  { symbol: 'ARB', name: 'Arbitrum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', decimals: 18 },
  { symbol: 'MATIC', name: 'Polygon', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png', decimals: 18 },
  { symbol: 'GNO', name: 'Gnosis', icon: 'https://cryptologos.cc/logos/gnosis-gno-logo.png', decimals: 18 },
  { symbol: 'OP', name: 'Optimism', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', decimals: 6 },
  { symbol: 'USDT', name: 'Tether', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', decimals: 6 },
];

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'POPULAR' | 'MULTI-CHAIN' | 'SOLANA' | 'SMART CHAIN' | 'HARDWARE' | 'EXCHANGE';
  recommended?: boolean;
}

export const WALLETS: WalletProvider[] = [
  // POPULAR
  { id: 'metamask', name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg', description: 'INJECTED CONNECTOR', category: 'POPULAR', recommended: true },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: 'https://images.ctfassets.net/q5ulk4u677os/479N7p94mX76uYmKySnu9m/809c95d336a53c076579294e094770e5/coinbase-wallet-logo.png', description: 'CUSTOM CONNECTOR', category: 'POPULAR', recommended: true },
  { id: 'best-wallet', name: 'Best Wallet', icon: 'https://avatars.githubusercontent.com/u/108554348?v=4', description: 'MULTI-CHAIN JET ENGINE', category: 'POPULAR', recommended: true },
  { id: 'trust', name: 'Trust Wallet', icon: 'https://cryptologos.cc/logos/trust-wallet-twt-logo.png', description: 'POPULAR CONNECTOR', category: 'POPULAR' },
  { id: 'phantom', name: 'Phantom', icon: 'https://cryptologos.cc/logos/phantom-phantom-logo.png', description: 'SOLANA ECOSYSTEM', category: 'POPULAR' },
  { id: 'okx', name: 'OKX Wallet', icon: 'https://cryptologos.cc/logos/okx-okb-logo.png', description: 'WEB3 WALLET', category: 'POPULAR' },
  { id: 'binance', name: 'Binance Web3 Wallet', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', description: 'EXCHANGE CONNECT', category: 'POPULAR' },

  // MULTI-CHAIN
  { id: 'zerion', name: 'Zerion', icon: 'https://avatars.githubusercontent.com/u/29591456?s=200&v=4', description: 'DEFI CONNECTOR', category: 'MULTI-CHAIN' },
  { id: 'exodus', name: 'Exodus', icon: 'https://cryptologos.cc/logos/exodus-exodus-logo.png', description: 'MULTI-ASSET', category: 'MULTI-CHAIN' },
  { id: 'rabby', name: 'Rabby Wallet', icon: 'https://avatars.githubusercontent.com/u/84683050?s=200&v=4', description: 'EVM EXPERT', category: 'MULTI-CHAIN' },
  { id: 'argent', name: 'Argent', icon: 'https://cryptologos.cc/logos/argent-argent-logo.png', description: 'L2 SPECIALIST', category: 'MULTI-CHAIN' },
  { id: 'zengo', name: 'Zengo', icon: 'https://avatars.githubusercontent.com/u/38146747?s=200&v=4', description: 'KEYLESS SECURITY', category: 'MULTI-CHAIN' },
  { id: 'atomic', name: 'Atomic Wallet', icon: 'https://cryptologos.cc/logos/atomic-wallet-coin-awc-logo.png', description: 'MULTI-CHAIN HUB', category: 'MULTI-CHAIN' },
  { id: 'gem', name: 'Gem Wallet', icon: 'https://avatars.githubusercontent.com/u/74300405?s=200&v=4', description: 'WEB3 BROWSER', category: 'MULTI-CHAIN' },
  { id: 'rainbow', name: 'Rainbow Wallet', icon: 'https://avatars.githubusercontent.com/u/48327834?s=200&v=4', description: 'NFT CONNECTOR', category: 'MULTI-CHAIN' },
  { id: 'oneinch', name: '1inch Wallet', icon: 'https://cryptologos.cc/logos/1inch-1inch-logo.png', description: 'AGGREGATOR HUB', category: 'MULTI-CHAIN' },
  { id: 'hot', name: 'Hot Wallet', icon: 'https://avatars.githubusercontent.com/u/104381005?s=200&v=4', description: 'NEAR ECOSYSTEM', category: 'MULTI-CHAIN' },
  { id: 'keplr', name: 'Keplr Wallet', icon: 'https://avatars.githubusercontent.com/u/53235659?s=200&v=4', description: 'COSMOS HUB', category: 'MULTI-CHAIN' },
  { id: 'tomi', name: 'Tomi Wallet', icon: 'https://avatars.githubusercontent.com/u/109000100?s=200&v=4', description: 'PRIVACY HUB', category: 'MULTI-CHAIN' },
  { id: 'bitkeep', name: 'BitKeep', icon: 'https://avatars.githubusercontent.com/u/41555355?s=200&v=4', description: 'ASSET MANAGEMENT', category: 'MULTI-CHAIN' },
  { id: 'imtoken', name: 'imToken', icon: 'https://avatars.githubusercontent.com/u/18520894?s=200&v=4', description: 'ETHEREUM WALLET', category: 'MULTI-CHAIN' },
  { id: 'math', name: 'Math Wallet', icon: 'https://avatars.githubusercontent.com/u/32777322?s=200&v=4', description: 'MULTI-PLATFORM', category: 'MULTI-CHAIN' },

  // SOLANA
  { id: 'solflare', name: 'Solflare', icon: 'https://avatars.githubusercontent.com/u/81728514?s=200&v=4', description: 'SOLANA EXPERT', category: 'SOLANA' },

  // SMART CHAIN
  { id: 'coin98', name: 'Coin98 Wallet', icon: 'https://cryptologos.cc/logos/coin98-c98-logo.png', description: 'MULTI-CHAIN HUB', category: 'SMART CHAIN' },
  { id: 'kucoin', name: 'KuCoin Web3 Wallet', icon: 'https://cryptologos.cc/logos/kucoin-token-kcs-logo.png', description: 'ECOSYSTEM WALLET', category: 'SMART CHAIN' },
  { id: 'bybit', name: 'Bybit Web3 Wallet', icon: 'https://avatars.githubusercontent.com/u/43795150?s=200&v=4', description: 'EXCHANGE WALLET', category: 'SMART CHAIN' },

  // HARDWARE
  { id: 'tangem', name: 'Tangem', icon: 'https://avatars.githubusercontent.com/u/43644917?s=200&v=4', description: 'CARD WALLET', category: 'HARDWARE' },
  { id: 'safepal', name: 'SafePal', icon: 'https://cryptologos.cc/logos/safepal-sfp-logo.png', description: 'HARDWARE HUB', category: 'HARDWARE' },
  { id: 'ledger', name: 'Ledger Live', icon: 'https://avatars.githubusercontent.com/u/11053076?s=200&v=4', description: 'COLD STORAGE', category: 'HARDWARE' },
  { id: 'trezor', name: 'Trezor Wallet', icon: 'https://avatars.githubusercontent.com/u/3820980?s=200&v=4', description: 'LEGACY HARDWARE', category: 'HARDWARE' },

  // EXCHANGE
  { id: 'crypto-com', name: 'Crypto.com Wallet', icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png', description: 'DEFI WALLET', category: 'EXCHANGE' },
  { id: 'kraken', name: 'Kraken Wallet', icon: 'https://cryptologos.cc/logos/kraken-kraken-logo.png', description: 'EXCHANGE APP', category: 'EXCHANGE' },
  { id: 'uphold', name: 'Uphold', icon: 'https://avatars.githubusercontent.com/u/6462615?s=200&v=4', description: 'MULTI-ASSET', category: 'EXCHANGE' },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'mock-news-1',
    title: 'Jet Swap V2.5 Synchronization Complete',
    summary: 'The cross-chain intelligence network has achieved sub-second latency across 12 major protocols.',
    fullText: 'Jet Swap v2.5 introduces neural-assisted routing and zero-knowledge liquidity audits for all active flight paths.',
    category: 'Platform Updates',
    timestamp: 'Jan 2026',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600',
    trending: true,
    important: true
  },
  {
    id: 'mock-news-2',
    title: 'Arbitrum Network Liquidity Surge',
    summary: 'Institutional adoption on Arbitrum reaches record highs as bridging costs decrease.',
    fullText: 'Market data indicates a 15% increase in total value locked (TVL) on L2 scaling solutions.',
    category: 'Market News',
    timestamp: 'Jan 2026',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004009?auto=format&fit=crop&q=80&w=600',
    trending: false,
    important: false
  }
];
