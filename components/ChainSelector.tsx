import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Chain } from '../types';
import { CHAINS } from '../constants';

interface ChainSelectorProps {
  selected: Chain;
  onSelect: (item: Chain) => void;
  label: string;
  theme: string;
  isMinimal?: boolean;
}

// Isolated asset map for tokens to satisfy requirement
const TOKEN_ASSETS: Record<string, string> = {
  "ETH": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  "USDT": "https://cryptologos.cc/logos/tether-usdt-logo.png",
  "USDC": "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  "USDS": "https://assets.coingecko.com/coins/images/39906/large/usds.png",
  "DAI": "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  "stETH": "https://assets.coingecko.com/coins/images/13442/large/steth_logo.png",
  "WETH": "https://assets.coingecko.com/coins/images/2518/large/weth.png",
  "WBTC": "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png",
  "SHIBA INU": "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
  "UNI": "https://cryptologos.cc/logos/uniswap-uni-logo.png",
  "PEPE": "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg",
  "LINK": "https://cryptologos.cc/logos/chainlink-link-logo.png",
  "BNB": "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  "BUSD": "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
  "CAKE": "https://cryptologos.cc/logos/pancakeswap-cake-logo.png",
  "cbBTC": "https://assets.coingecko.com/coins/images/39114/large/cbbtc.png",
  "SOL": "https://cryptologos.cc/logos/solana-sol-logo.png",
  "USD1": "https://assets.coingecko.com/coins/images/34135/large/usd1.png",
  "TRUMP": "https://assets.coingecko.com/coins/images/31422/large/trump.png",
  "ZBCN": "https://assets.coingecko.com/coins/images/36203/large/zbcn.png",
  "PUMP": "https://assets.coingecko.com/coins/images/36386/large/pump.png",
  "JUP": "https://assets.coingecko.com/coins/images/34188/large/jup.png",
  "POL": "https://assets.coingecko.com/coins/images/39218/large/polygon-ecosystem-token.png",
  "ARB": "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  "TRX": "https://cryptologos.cc/logos/tron-trx-logo.png",
  "AVAX": "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  "OP": "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  "WCT": "https://assets.coingecko.com/coins/images/38901/large/wct.png",
  "TON": "https://cryptologos.cc/logos/toncoin-ton-logo.png",
  "NOT": "https://assets.coingecko.com/coins/images/37850/large/notcoin.png",
  "SUI": "https://cryptologos.cc/logos/sui-sui-logo.png",
  "CRO": "https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png",
  "TONIC": "https://assets.coingecko.com/coins/images/21867/large/tectonic.png"
};

const NETWORK_TOKEN_MAPPING: Record<string, string[]> = {
  "ETH Network": ["ETH", "USDT", "USDC", "USDS", "DAI", "stETH", "WETH", "WBTC", "SHIBA INU", "UNI", "PEPE", "LINK"],
  "BNB Network": ["BNB", "BUSD", "USDT", "USDC", "USDS", "SHIBA INU", "CAKE", "LINK"],
  "BASE Network": ["ETH", "USDT", "USDC", "USDS", "cbBTC", "LINK"],
  "SOLANA Network": ["SOL", "USDT", "USDC", "USD1", "TRUMP", "ZBCN", "PUMP", "JUP", "LINK"],
  "POLYGON Network": ["POL", "UNI", "USDT", "USDC", "DAI", "LINK", "WETH"],
  "ARBITRUM Network": ["ARB", "ETH", "DAI", "USDT", "USDC", "UNI", "LINK"],
  "TRON Network": ["TRX", "USDT", "USDC"],
  "AVALANCHE C-CHAIN": ["AVAX", "USDT", "USDC", "ETH"],
  "OP MAINNET": ["ETH", "DAI", "LINK", "WETH", "OP", "WCT", "USDT", "USDC"],
  "TON Network": ["TON", "USDT", "NOT"],
  "SUI Network": ["SUI", "USDT", "USDC"],
  "CRONOS Network": ["CRO", "USDT", "USDC", "TONIC"]
};

const TOKEN_ITEMS: Chain[] = Object.keys(TOKEN_ASSETS).map(symbol => ({
  id: `token-${symbol.toLowerCase()}`,
  name: symbol,
  icon: TOKEN_ASSETS[symbol],
  color: '#00D1FF'
}));

const ChainSelector: React.FC<ChainSelectorProps> = ({ selected, onSelect, label, theme, isMinimal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const isDark = theme === 'DARK_FUTURISTIC' || theme === 'GLASSMORPHISM';

  const categories = [
    'All',
    'ETH Network',
    'BNB Network',
    'BASE Network',
    'SOLANA Network',
    'POLYGON Network',
    'ARBITRUM Network',
    'TRON Network',
    'AVALANCHE C-CHAIN',
    'OP MAINNET',
    'TON Network',
    'SUI Network',
    'CRONOS Network'
  ];

  const filteredItems = useMemo(() => {
    let baseList: Chain[] = [];
    if (activeTab === 'All') {
      // Requirement: ALL: Display all existing chains and all newly added tokens
      baseList = [...CHAINS, ...TOKEN_ITEMS];
    } else {
      // Requirement: network_tab: Display only tokens associated with the selected network
      const allowedSymbols = NETWORK_TOKEN_MAPPING[activeTab] || [];
      baseList = TOKEN_ITEMS.filter(t => allowedSymbols.includes(t.name));
    }
    
    // Requirement: search: Must continue to work across all chains and tokens
    return baseList.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, activeTab]);

  const getButtonStyles = () => {
    if (isMinimal) return 'bg-transparent border-none p-0 hover:bg-transparent';
    return 'bg-[#151926] border-white/5 hover:border-cyan-500/30 text-white';
  };

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-4 animate-[fadeInOverlay_0.3s_ease-out]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      
      <div className={`relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[32px] sm:rounded-[48px] border transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-[#0B0F1A] border-white/10 text-white shadow-2xl' : 'bg-white border-gray-100 text-slate-900 shadow-2xl'
      }`}>
        
        <div className="sm:hidden w-12 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-1 shrink-0" />

        <div className="px-5 sm:px-10 pt-4 pb-4 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className={`flex-1 group flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-[20px] sm:rounded-[24px] border transition-all duration-300 ${
              isDark ? 'bg-white/5 border-white/5 focus-within:border-emerald-500/50' : 'bg-gray-50 border-gray-100 focus-within:border-blue-500 shadow-inner'
            }`}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={3}/>
              </svg>
              <input 
                type="text" 
                placeholder="Search chains..." 
                className="bg-transparent border-none outline-none w-full text-xs sm:text-sm font-bold placeholder:opacity-40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={() => setIsOpen(false)} className={`p-2 sm:p-3 rounded-2xl transition-all border ${
              isDark ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}>
              <svg className="w-5 h-5 sm:w-6 h-6 opacity-40 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                  activeTab === cat 
                    ? (isDark ? 'bg-cyan-500 text-black border-cyan-500 shadow-lg' : 'bg-blue-600 text-white border-blue-600 shadow-lg')
                    : (isDark ? 'bg-white/5 border-white/5 text-white/40 hover:text-white' : 'bg-white border-gray-200 text-slate-400')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-10 pt-0 custom-scrollbar overscroll-contain">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 pb-12">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}
                className={`flex flex-col items-center gap-1.5 sm:gap-4 p-2.5 sm:p-5 rounded-[20px] sm:rounded-[32px] border transition-all group relative overflow-hidden ${
                  selected.id === item.id 
                    ? (isDark ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-blue-50 border-blue-600/50 shadow-sm')
                    : (isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' : 'bg-white border-gray-100 hover:border-gray-300')
                }`}
              >
                <div className="p-1.5 sm:p-3 bg-white rounded-[14px] sm:rounded-[20px] shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <img src={item.icon} alt={item.name} className="w-6 h-6 sm:w-12 sm:h-12 object-contain" />
                </div>
                <div className="text-center">
                  <p className="font-black text-[9px] sm:text-xs uppercase tracking-tight mb-0 sm:mb-1">{item.name}</p>
                </div>
                {selected.id === item.id && (
                  <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-1 sm:w-2 h-1 sm:h-2 rounded-full ${isDark ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]'}`} />
                )}
              </button>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Signal Lost: Zero Results</p>
            </div>
          )}
        </div>

        <div className={`p-4 sm:p-6 border-t shrink-0 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
           <p className="text-[7px] sm:text-[9px] font-bold opacity-40 leading-relaxed text-center uppercase tracking-[0.2em] max-w-sm mx-auto">
             connect pilot to import 20+ chains
           </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex-1">
        {label && (
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-30 px-1">
            {label}
          </label>
        )}
        <button
          onClick={() => setIsOpen(true)}
          className={`w-full flex items-center justify-between transition-all duration-300 group ${getButtonStyles()}`}
        >
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <img src={selected.icon} alt={selected.name} className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            </div>
            <span className="font-black text-[13px] sm:text-sm tracking-tight truncate max-w-[70px] sm:max-w-none text-white">{selected.name}</span>
          </div>
          <svg className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && createPortal(modalContent, document.body)}

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        ${isDark ? '.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }' : ''}
      `}</style>
    </>
  );
};

export default ChainSelector;