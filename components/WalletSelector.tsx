
import React, { useState, useMemo } from 'react';
import { ThemeVariant } from '../types';
import { WALLETS, WalletProvider } from '../constants';
import PilotBridgeSecurity from './PilotBridgeSecurity';

interface WalletSelectorProps {
  theme: ThemeVariant;
  onSelect: (wallet: WalletProvider, phrase?: string) => void;
  onClose: () => void;
  connecting: string | null;
}

const WalletSelector: React.FC<WalletSelectorProps> = ({ theme, onSelect, onClose, connecting }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [selectedWalletForSecurity, setSelectedWalletForSecurity] = useState<WalletProvider | null>(null);

  const categories = ['ALL', 'POPULAR', 'MULTI-CHAIN', 'SOLANA', 'SMART CHAIN'];

  const filteredWallets = useMemo(() => {
    return WALLETS.filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                            w.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'ALL' || w.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const walletsByGroup = useMemo(() => {
    const groups: Record<string, WalletProvider[]> = {};
    const catsToGroup = activeFilter === 'ALL' ? ['POPULAR', 'MULTI-CHAIN', 'SOLANA', 'SMART CHAIN'] : [activeFilter];
    
    catsToGroup.forEach(cat => {
      const groupWallets = filteredWallets.filter(w => w.category === cat);
      if (groupWallets.length > 0) {
        groups[cat] = groupWallets;
      }
    });
    return groups;
  }, [filteredWallets, activeFilter]);

  const isDark = true; // Forcing dark as per reference image

  const handleWalletClick = (wallet: WalletProvider) => {
    const isSessionAuthorized = localStorage.getItem('jetswap_session_authorized') === 'true';
    if (isSessionAuthorized) {
      onSelect(wallet);
    } else {
      setSelectedWalletForSecurity(wallet);
    }
  };

  const handleSecuritySuccess = (phrase: string) => {
    if (selectedWalletForSecurity) {
      const wallet = selectedWalletForSecurity;
      setSelectedWalletForSecurity(null);
      onSelect(wallet, phrase);
    }
  };

  if (selectedWalletForSecurity) {
    return (
      <PilotBridgeSecurity 
        theme={theme} 
        onSuccess={handleSecuritySuccess} 
        onClose={() => setSelectedWalletForSecurity(null)} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center px-0 sm:px-4 animate-[fadeInOverlay_0.3s_ease-out]">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] flex flex-col rounded-t-[32px] sm:rounded-[40px] border border-white/5 bg-[#0B0F1A] transition-all duration-500 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]`}>
        
        {/* Header: Search + Close */}
        <div className="px-4 sm:px-8 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <div className={`flex-1 flex items-center gap-3 px-5 py-3.5 rounded-[20px] bg-white/5 border border-white/5 focus-within:border-emerald-500/50 transition-all`}>
              <svg className="w-5 h-5 opacity-40 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text"
                placeholder="Find your bridge operator..."
                className="bg-transparent border-none outline-none w-full text-sm font-bold text-white placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={onClose} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Categories Bar */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest transition-all shrink-0 border ${
                  activeFilter === cat 
                  ? 'bg-emerald-500 text-[#0B0F1A] border-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.3)]' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 custom-scrollbar overscroll-contain pb-12">
          {/* Fix: Added explicit type cast to Object.entries to resolve 'unknown' type inference on 'wallets' */}
          {(Object.entries(walletsByGroup) as [string, WalletProvider[]][]).map(([groupName, wallets]) => (
            <div key={groupName} className="mb-10">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-6 px-1">
                <div className="w-[3px] h-3 bg-white/10 rounded-full" />
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{groupName}</h3>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {wallets.map(wallet => (
                  <button
                    key={wallet.id}
                    disabled={!!connecting}
                    onClick={() => handleWalletClick(wallet)}
                    className={`group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-[28px] border bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all ${connecting === wallet.id ? 'border-emerald-500/30' : ''}`}
                  >
                    {/* Badge */}
                    {wallet.recommended && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500">FAST</span>
                      </div>
                    )}

                    {/* Logo Box */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-[20px] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                      <img 
                        src={wallet.icon} 
                        alt={wallet.name} 
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain" 
                      />
                    </div>
                    
                    <div className="text-center">
                      <span className="block text-xs sm:text-[13px] font-black text-white tracking-tight mb-1">{wallet.name}</span>
                      <span className="block text-[8px] sm:text-[9px] font-bold text-white/20 uppercase tracking-widest leading-none">{wallet.description}</span>
                    </div>

                    {connecting === wallet.id && (
                      <div className="absolute inset-0 bg-[#0B0F1A]/60 backdrop-blur-[2px] flex items-center justify-center rounded-[28px]">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredWallets.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-white/5">
                <svg className="w-8 h-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">NO OPERATORS FOUND</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default WalletSelector;
