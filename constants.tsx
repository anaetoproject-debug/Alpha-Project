
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
  category: 'Popular' | 'Multi-Chain' | 'Solana' | 'Smart' | 'Hardware' | 'Exchange';
  recommended?: boolean;
}

export const WALLETS: WalletProvider[] = [
  { id: 'metamask', name: 'MetaMask', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg', description: 'Injected Connector', category: 'Popular', recommended: true },
  { id: 'okx', name: 'OKX Wallet', icon: 'https://assets.coingecko.com/markets/images/221/large/okx.png', description: 'Injected Connector', category: 'Exchange' },
  { id: 'coinbase', name: 'Coinbase', icon: 'https://assets.coingecko.com/coins/images/18060/large/coinbase-wallet.png', description: 'Custom Connector', category: 'Popular', recommended: true },
  { id: 'phantom', name: 'Phantom', icon: 'https://assets.coingecko.com/coins/images/24645/large/phantom.png', description: 'Injected Connector', category: 'Solana', recommended: true },
  { id: 'zerion', name: 'Zerion', icon: 'https://assets.coingecko.com/coins/images/25605/large/zerion.png', description: 'Injected Connector', category: 'Multi-Chain' },
  { id: 'rainbow', name: 'Rainbow', icon: 'https://assets.coingecko.com/coins/images/25442/large/rainbow.png', description: 'WalletConnect', category: 'Multi-Chain' },
  { id: 'bybit', name: 'Bybit Wallet', icon: 'https://assets.coingecko.com/markets/images/698/large/bybit.png', description: 'Injected Connector', category: 'Exchange' },
  { id: 'bitget', name: 'Bitget Wallet', icon: 'https://assets.coingecko.com/markets/images/1000/large/bitget.png', description: 'Injected Connector', category: 'Exchange' },
  { id: 'trezor', name: 'Trezor', icon: 'https://assets.coingecko.com/coins/images/22033/large/trezor.png', description: 'Hardware Connector', category: 'Hardware' },
  { id: 'ledger', name: 'Ledger Live', icon: 'https://assets.coingecko.com/coins/images/18260/large/ledger.png', description: 'Hardware Connector', category: 'Hardware' },
  { id: 'agent', name: 'Agent', icon: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3B5yew995DqGupYp7u5R951XpE62X6G17TjAnz7YyK6U/logo.png', description: 'Custom Connector', category: 'Smart' },
  { id: 'glow', name: 'Glow', icon: 'https://assets.coingecko.com/coins/images/25667/large/glow.png', description: 'Injected Connector', category: 'Solana' },
  { id: 'backpack', name: 'Backpack', icon: 'https://assets.coingecko.com/coins/images/30391/large/backpack.png', description: 'Injected Connector', category: 'Solana' },
  { id: 'best-wallet', name: 'Best Wallet', icon: 'https://assets.coingecko.com/coins/images/32517/large/best_wallet.png', description: 'WalletConnect', category: 'Popular' },
  { id: '1inch', name: '1inch Wallet', icon: 'https://assets.coingecko.com/coins/images/14468/large/1inch.png', description: 'Injected Connector', category: 'Multi-Chain' },
  { id: 'cryptocom', name: 'Crypto.com Wallet', icon: 'https://assets.coingecko.com/coins/images/7310/large/cro.png', description: 'Custom Connector', category: 'Exchange' },
  { id: 'safepal', name: 'Safepal', icon: 'https://assets.coingecko.com/coins/images/13768/large/safepal.png', description: 'Injected Connector', category: 'Multi-Chain' },
  { id: 'tangem', name: 'Tangem', icon: 'https://assets.coingecko.com/coins/images/22033/large/tangem.png', description: 'Hardware Connector', category: 'Hardware' },
  { id: 'hot-wallet', name: 'Hot Wallet', icon: 'https://assets.coingecko.com/coins/images/35222/large/hot.png', description: 'Injected Connector', category: 'Smart' },
  { id: 'keplr', name: 'Keplr Wallet', icon: 'https://assets.coingecko.com/markets/images/1025/large/keplr.png', description: 'Injected Connector', category: 'Multi-Chain' },
  { id: 'coin98', name: 'Coin98 Wallet', icon: 'https://assets.coingecko.com/coins/images/17153/large/coin98.png', description: 'Injected Connector', category: 'Multi-Chain' },
  { id: 'tomi', name: 'Tomi Wallet', icon: 'https://assets.coingecko.com/coins/images/28734/large/tomi.png', description: 'Injected Connector', category: 'Smart' },
  { id: 'atomic', name: 'Atomic Wallet', icon: 'https://assets.coingecko.com/coins/images/3414/large/atomic_wallet.png', description: 'Custom Connector', category: 'Multi-Chain' },
  { id: 'gem-wallet', name: 'Gem Wallet', icon: 'https://assets.coingecko.com/coins/images/33076/large/gem_wallet.png', description: 'Injected Connector', category: 'Smart' },
  { id: 'kucoin-web3', name: 'Kucoin Web3 Wallet', icon: 'https://assets.coingecko.com/markets/images/61/large/kucoin.png', description: 'Injected Connector', category: 'Exchange' },
  { id: 'bybit-web3', name: 'Bybit Web3 Wallet', icon: 'https://assets.coingecko.com/markets/images/698/large/bybit.png', description: 'Injected Connector', category: 'Exchange' },
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'JetSwap v2.5 Protocol Upgrade Live on Mainnet',
    summary: 'JetSwap announces the successful deployment of v2.5, featuring 40% lower gas fees on Arbitrum and Base.',
    fullText: 'The v2.5 upgrade introduces a new routing engine that optimizes gas usage across Layer 2 solutions.',
    category: 'Platform Updates',
    timestamp: 'Jan 24, 2026 • 10:42 AM',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000',
    important: true,
    trending: true
  },
  {
    id: 'n2',
    title: 'New Partnership: JetSwap x Solana Foundation',
    summary: 'Strategic alliance aimed at scaling cross-chain liquidity between Ethereum and Solana ecosystem.',
    fullText: 'We are thrilled to partner with the Solana Foundation...',
    category: 'Announcements',
    timestamp: 'Jan 24, 2026 • 09:15 AM',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=1000',
    trending: true
  }
];
