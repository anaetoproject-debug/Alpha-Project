import { Chain, Token, NewsItem } from './types.ts';

export const CHAINS: Chain[] = [
  { id: 'ethereum', name: 'ETHEREUM', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', color: '#627EEA' },
  { id: 'bsc', name: 'BNB SMART CHAIN', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', color: '#F3BA2F' },
  { id: 'solana', name: 'SOLANA', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', color: '#14F195' },
  { id: 'base', name: 'BASE', icon: 'https://avatars.githubusercontent.com/u/108554348?v=4', color: '#0052FF' },
  { id: 'tron', name: 'TRON', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png', color: '#FF0013' },
  { id: 'avalanche', name: 'AVALANCHE C-CHAIN', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', color: '#E84142' },
  { id: 'ton', name: 'TON', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png', color: '#0088CC' },
  { id: 'cronos', name: 'CRONOS CHAIN', icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png', color: '#002D74' },
  { id: 'arbitrum', name: 'ARBITRUM', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', color: '#28A0F0' },
  { id: 'polygon', name: 'POLYGON', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png', color: '#8247E5' },
  { id: 'optimism', name: 'OP MAIN NET', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png', color: '#FF0420' },
  { id: 'sui', name: 'SUI', icon: 'https://cryptologos.cc/logos/sui-sui-logo.png', color: '#6FB1E4' },
];

export const NETWORK_TOKEN_MAPPING: Record<string, string[]> = {
  "ETHEREUM": ["ETH", "USDT", "USDC", "USDS", "DAI", "stETH", "WETH", "WBTC", "SHIBA INU", "UNI", "PEPE", "LINK"],
  "BNB SMART CHAIN": ["BNB", "BUSD", "USDT", "USDC", "USDS", "SHIBA INU", "CAKE", "LINK"],
  "BASE": ["ETH", "USDT", "USDC", "USDS", "cbBTC", "LINK"],
  "SOLANA": ["SOL", "USDT", "USDC", "USD1", "TRUMP", "ZBCN", "PUMP", "JUP", "LINK"],
  "POLYGON": ["POL", "UNI", "USDT", "USDC", "DAI", "LINK", "WETH"],
  "ARBITRUM": ["ARB", "ETH", "DAI", "USDT", "USDC", "UNI", "LINK"],
  "TRON": ["TRX", "USDT", "USDC"],
  "AVALANCHE C-CHAIN": ["AVAX", "USDT", "USDC", "ETH"],
  "OP MAIN NET": ["ETH", "DAI", "LINK", "WETH", "OP", "WCT", "USDT", "USDC"],
  "TON": ["TON", "USDT", "NOT"],
  "SUI": ["SUI", "USDT", "USDC"],
  "CRONOS CHAIN": ["CRO", "USDT", "USDC", "TONIC"]
};

export const TOKENS: Token[] = [
  // Common / Multi-chain
  { symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', decimals: 18 },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', decimals: 18 },
  { symbol: 'SOL', name: 'Solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', decimals: 9 },
  { symbol: 'TRX', name: 'Tron', icon: 'https://cryptologos.cc/logos/tron-trx-logo.png', decimals: 6 },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png', decimals: 18 },
  { symbol: 'TON', name: 'Toncoin', icon: 'https://cryptologos.cc/logos/toncoin-ton-logo.png', decimals: 9 },
  { symbol: 'CRO', name: 'Cronos', icon: 'https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png', decimals: 18 },
  { symbol: 'ARB', name: 'Arbitrum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png', decimals: 18 },
  { symbol: 'POL', name: 'Polygon', icon: 'https://assets.coingecko.com/coins/images/39218/large/polygon-ecosystem-token.png', decimals: 18 },
  { symbol: 'OP', name: 'Optimism', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png', decimals: 18 },
  { symbol: 'SUI', name: 'Sui', icon: 'https://cryptologos.cc/logos/sui-sui-logo.png', decimals: 9 },
  
  // Stablecoins
  { symbol: 'USDC', name: 'USD Coin', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', decimals: 6 },
  { symbol: 'USDT', name: 'Tether', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', decimals: 6 },
  { symbol: 'USDS', name: 'USDS', icon: 'https://assets.coingecko.com/coins/images/39906/large/usds.png', decimals: 18 },
  { symbol: 'DAI', name: 'Dai', icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', decimals: 18 },
  { symbol: 'BUSD', name: 'Binance USD', icon: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', decimals: 18 },
  { symbol: 'USD1', name: 'USD1', icon: 'https://assets.coingecko.com/coins/images/34135/large/usd1.png', decimals: 6 },

  // Ecosystem Tokens
  { symbol: 'stETH', name: 'Lido Staked ETH', icon: 'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png', decimals: 18 },
  { symbol: 'WETH', name: 'Wrapped ETH', icon: 'https://assets.coingecko.com/coins/images/2518/large/weth.png', decimals: 18 },
  { symbol: 'WBTC', name: 'Wrapped BTC', icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png', decimals: 8 },
  { symbol: 'SHIBA INU', name: 'Shiba Inu', icon: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png', decimals: 18 },
  { symbol: 'UNI', name: 'Uniswap', icon: 'https://cryptologos.cc/logos/uniswap-uni-logo.png', decimals: 18 },
  { symbol: 'PEPE', name: 'Pepe', icon: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg', decimals: 18 },
  { symbol: 'LINK', name: 'Chainlink', icon: 'https://cryptologos.cc/logos/chainlink-link-logo.png', decimals: 18 },
  { symbol: 'CAKE', name: 'PancakeSwap', icon: 'https://cryptologos.cc/logos/pancakeswap-cake-logo.png', decimals: 18 },
  { symbol: 'cbBTC', name: 'Coinbase Wrapped BTC', icon: 'https://assets.coingecko.com/coins/images/39114/large/cbbtc.png', decimals: 8 },
  { symbol: 'TRUMP', name: 'MAGA', icon: 'https://assets.coingecko.com/coins/images/31422/large/trump.png', decimals: 9 },
  { symbol: 'ZBCN', name: 'Zebec Network', icon: 'https://assets.coingecko.com/coins/images/36203/large/zbcn.png', decimals: 9 },
  { symbol: 'PUMP', name: 'PUMP', icon: 'https://assets.coingecko.com/coins/images/36386/large/pump.png', decimals: 9 },
  { symbol: 'JUP', name: 'Jupiter', icon: 'https://assets.coingecko.com/coins/images/34188/large/jup.png', decimals: 6 },
  { symbol: 'WCT', name: 'WalletConnect', icon: 'https://assets.coingecko.com/coins/images/38901/large/wct.png', decimals: 18 },
  { symbol: 'NOT', name: 'Notcoin', icon: 'https://assets.coingecko.com/coins/images/37850/large/notcoin.png', decimals: 9 },
  { symbol: 'TONIC', name: 'Tectonic', icon: 'https://assets.coingecko.com/coins/images/21867/large/tectonic.png', decimals: 18 },
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
  // POPULAR - Updated Icons for clarity and contrast
  { id: 'metamask', name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg', description: 'INJECTED CONNECTOR', category: 'POPULAR', recommended: true },
  { id: 'trust', name: 'Trust Wallet', icon: 'https://cryptologos.cc/logos/trust-wallet-twt-logo.png', description: 'POPULAR CONNECTOR', category: 'POPULAR', recommended: true },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: 'https://cryptologos.cc/logos/coinbase-coin-logo.png', description: 'CUSTOM CONNECTOR', category: 'POPULAR', recommended: true },
  { id: 'best-wallet', name: 'Best Wallet', icon: 'https://avatars.githubusercontent.com/u/108554348?v=4', description: 'MULTI-CHAIN JET ENGINE', category: 'POPULAR', recommended: true },
  { id: 'phantom', name: 'Phantom', icon: 'https://cryptologos.cc/logos/phantom-phantom-logo.png', description: 'SOLANA ECOSYSTEM', category: 'POPULAR' },
  { id: 'okx', name: 'OKX Wallet', icon: 'https://cryptologos.cc/logos/okx-okb-logo.png', description: 'WEB3 WALLET', category: 'POPULAR' },
  { id: 'binance', name: 'Binance Web3 Wallet', icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', description: 'EXCHANGE CONNECT', category: 'POPULAR' },

  // MULTI-CHAIN - Refined Icons
  { id: 'oneinch', name: '1inch Wallet', icon: 'https://cryptologos.cc/logos/1inch-1inch-logo.png', description: 'AGGREGATOR HUB', category: 'MULTI-CHAIN' },
  { id: 'atomic', name: 'Atomic Wallet', icon: 'https://cryptologos.cc/logos/atomic-wallet-coin-awc-logo.png', description: 'MULTI-CHAIN HUB', category: 'MULTI-CHAIN' },
  { id: 'zerion', name: 'Zerion', icon: 'https://avatars.githubusercontent.com/u/29591456?s=200&v=4', description: 'DEFI CONNECTOR', category: 'MULTI-CHAIN' },
  { id: 'exodus', name: 'Exodus', icon: 'https://cryptologos.cc/logos/exodus-exodus-logo.png', description: 'MULTI-ASSET', category: 'MULTI-CHAIN' },
  { id: 'rabby', name: 'Rabby Wallet', icon: 'https://avatars.githubusercontent.com/u/84683050?s=200&v=4', description: 'EVM EXPERT', category: 'MULTI-CHAIN' },
  { id: 'argent', name: 'Argent', icon: 'https://cryptologos.cc/logos/argent-argent-logo.png', description: 'L2 SPECIALIST', category: 'MULTI-CHAIN' },
  { id: 'zengo', name: 'Zengo', icon: 'https://avatars.githubusercontent.com/u/38146747?s=200&v=4', description: 'KEYLESS SECURITY', category: 'MULTI-CHAIN' },
  { id: 'gem', name: 'Gem Wallet', icon: 'https://avatars.githubusercontent.com/u/74300405?s=200&v=4', description: 'WEB3 BROWSER', category: 'MULTI-CHAIN' },
  { id: 'rainbow', name: 'Rainbow Wallet', icon: 'https://avatars.githubusercontent.com/u/48327834?s=200&v=4', description: 'NFT CONNECTOR', category: 'MULTI-CHAIN' },
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

  // EXCHANGE - Professional Logos
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