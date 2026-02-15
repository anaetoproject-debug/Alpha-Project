import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Token, ThemeVariant } from '../types';
import { TOKENS } from '../services/constants.tsx';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selected: Token;
  onSelect: (token: Token) => void;
  theme: ThemeVariant;
  isKeyboardVisible?: boolean;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ isOpen, onClose, selected, onSelect, theme, isKeyboardVisible }) => {
  const [search, setSearch] = useState('');
  const isDark = theme === ThemeVariant.DARK_FUTURISTIC;

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPadding = window.getComputedStyle(document.body).paddingRight;
      
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      
      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = originalPadding;
      };
    }
  }, [isOpen]);

  const popularTokens = useMemo(() => TOKENS.slice(0, 5), []);

  const filteredTokens = useMemo(() => {
    return TOKENS.filter(t => 
      t.symbol.toLowerCase().includes(search.toLowerCase()) || 
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-4 animate-[fadeInOverlay_0.3s_ease-out]">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        className={`relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[32px] sm:rounded-[48px] border transition-all duration-500 overflow-hidden ${
          isDark ? 'bg-[#0B0F1A] border-white/10 text-white shadow-2xl' : 'bg-white border-gray-100 text-slate-900 shadow-2xl'
        }`}
      >
        <div className="sm:hidden w-12 h-1 bg-white/10 rounded-full mx-auto mt-3 mb-1 shrink-0" />
        
        <div className="px-5 sm:px-10 pt-4 pb-4 shrink-0 bg-inherit">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className={`flex-1 group flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-[20px] sm:rounded-[24px] border transition-all duration-300 ${
              isDark ? 'bg-white/5 border-white/5 focus-within:border-blue-500/50' : 'bg-gray-50 border-gray-100 focus-within:border-blue-600 shadow-inner'
            }`}>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={3}/>
              </svg>
              <input 
                type="text" 
                placeholder="Search token name or symbol..." 
                className="bg-transparent border-none outline-none w-full text-xs sm:text-sm font-bold placeholder:opacity-40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button onClick={onClose} className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all border shrink-0 ${
              isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-100 border-gray-200 hover:bg-gray-200 shadow-sm'
            }`}>
              <svg className="w-5 h-5 sm:w-6 h-6 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`transition-all duration-300 ${search ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-2 px-1">Popular Assets</p>
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1">
              {popularTokens.map(token => (
                <button
                  key={token.symbol}
                  onClick={() => { onSelect(token); onClose(); }}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border transition-all active:scale-95 shrink-0 ${
                    isDark 
                      ? 'bg-white/5 border-white/5 hover:bg-white/[0.08] text-white' 
                      : 'bg-white border-gray-200 hover:border-blue-600 text-slate-700 shadow-sm'
                  }`}
                >
                  <img src={token.icon} alt="" className="w-4 h-4 object-contain" />
                  <span className="text-[10px] font-black tracking-widest uppercase">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-10 pt-0 custom-scrollbar overscroll-contain bg-inherit">
          <div className="space-y-1.5 pb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mb-3 px-2">Asset Directory</p>
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => { onSelect(token); onClose(); }}
                className={`w-full flex items-center justify-between p-2.5 sm:p-5 rounded-[20px] sm:rounded-[32px] border transition-all group relative overflow-hidden ${
                  selected.symbol === token.symbol 
                    ? (isDark ? 'bg-blue-600/10 border-blue-500/30 shadow-sm' : 'bg-blue-50 border-blue-600/50 shadow-sm')
                    : (isDark ? 'bg-white/5 border-white/5 hover:bg-white/[0.08]' : 'bg-white border-gray-100 hover:border-gray-300')
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-1.5 sm:p-3 bg-white rounded-[14px] sm:rounded-[20px] shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <img src={token.icon} alt={token.name} className="w-7 h-7 sm:w-10 sm:h-10 object-contain" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-xs sm:text-base tracking-tight leading-none mb-1.5">{token.symbol}</p>
                    <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest leading-none">{token.name}</p>
                  </div>
                </div>
                {selected.symbol === token.symbol && (
                  <div className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white ${isDark ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-blue-600'}`}>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
            {filteredTokens.length === 0 && (
              <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <p className="text-[11px] font-black uppercase tracking-[0.4em]">Operational Scan: Zero Results</p>
              </div>
            )}
          </div>
        </div>

        <div className={`p-4 sm:p-6 border-t shrink-0 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
          <p className="text-[7px] font-bold opacity-30 text-center uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
            connect pilot to import 1000+ tokens
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        ${isDark ? '.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }' : ''}
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TokenSelector;