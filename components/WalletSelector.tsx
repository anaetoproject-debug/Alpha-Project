
import React, { useState, useMemo } from 'react';
import { ThemeVariant } from '../types';
import { WALLETS, WalletProvider } from '../services/constants.tsx';
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

  const categories = ['ALL', 'POPULAR', 'MULTI-CHAIN', 'SOLANA', 'SMART CHAIN', 'HARDWARE', 'EXCHANGE'];

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
    const catsToGroup = activeFilter === 'ALL' 
      ? categories.filter(c => c !== 'ALL') 
      : [activeFilter];
    
    catsToGroup.forEach(cat => {
      const groupWallets = filteredWallets.filter(w => w.category === cat);
      if (groupWallets.length > 0) {
        groups[cat] = groupWallets;
      }
    });
    return groups;
  }, [filteredWallets, activeFilter]);

  const isDark = true; // Forcing dark as per reference image and brand requirements

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
      
      <div className={`relative w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[32px] sm:rounded-[40px] border border-white/10 bg-[#0B0F1A] transition-all duration-500 overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)]`}>
        
        {/* Modal Header: Search + Close */}
        <div className="px-4 sm:px-10 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-4 mb-6">
            <div className={`flex-1 flex items-center gap-3 px-5 py-3.5 rounded-[24px] bg-white/5 border border-white/5 focus-within:border-[#00D1FF]/50 transition-all shadow-inner`}>
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
            <button onClick={onClose} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white group">
              <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Tab Filters */}
          <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-2xl text-[9px] font-black tracking-[0.2em] transition-all shrink-0 border ${
                  activeFilter === cat 
                  ? 'bg-[#00D1FF] text-[#0B0F1A] border-[#00D1FF] shadow-[0_4px_20px_rgba(0,209,255,0.4)]' 
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Wallet Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 custom-scrollbar overscroll-contain pb-12">
          {(Object.entries(walletsByGroup) as [string, WalletProvider[]][]).map(([groupName, wallets]) => (
            <div key={groupName} className="mb-8">
              {/* Group Label */}
              <div className="flex items-center gap-3 mb-5 px-1">
                <div className="w-[3px] h-3 bg-[#00D1FF]/40 rounded-full" />
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{groupName}</h3>
              </div>

              {/* Responsive Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {wallets.map(wallet => (
                  <button
                    key={wallet.id}
                    disabled={!!connecting}
                    onClick={() => handleWalletClick(wallet)}
                    className={`group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-[32px] border bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/20 transition-all ${connecting === wallet.id ? 'border-[#00D1FF]/40 bg-[#00D1FF]/5' : ''}`}
                  >
                    {/* Visual Status Indicator */}
                    {wallet.recommended && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00D1FF]/10 border border-[#00D1FF]/20">
                        <div className="w-1 h-1 rounded-full bg-[#00D1FF] animate-pulse" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-[#00D1FF]">SECURE</span>
                      </div>
                    )}

                    {/* Highly Defined Icon Container */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-[24px] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-xl overflow-hidden p-1.5">
                      <img 
                        src={wallet.icon} 
                        alt={wallet.name} 
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'auto' }}
                      />
                    </div>
                    
                    <div className="text-center">
                      <span className="block text-sm sm:text-base font-black text-white tracking-tighter mb-1.5">{wallet.name}</span>
                      <span className="block text-[8px] sm:text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none">{wallet.description}</span>
                    </div>

                    {connecting === wallet.id && (
                      <div className="absolute inset-0 bg-[#0B0F1A]/80 backdrop-blur-[4px] flex flex-col items-center justify-center rounded-[32px] z-20">
                        <div className="w-10 h-10 border-3 border-[#00D1FF] border-t-transparent rounded-full animate-spin mb-3" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00D1FF]">Connecting...</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filteredWallets.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center gap-6">
              <div className="p-6 rounded-full bg-white/5 border border-white/10">
                <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.5em] text-white/20">OPERATOR NOT DETECTED</p>
            </div>
          )}
        </div>

        {/* Sticky Disclaimer */}
        <div className="p-6 border-t border-white/5 shrink-0 bg-[#0B0F1A]/80 backdrop-blur-xl">
           <p className="text-[8px] sm:text-[10px] font-bold text-white/20 leading-relaxed text-center uppercase tracking-[0.25em] max-w-lg mx-auto">
             Encrypted session active. BIP-39 Compliance verified by Jet Protocol engine.
           </p>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 209, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 209, 255, 0.2); }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default WalletSelector;
