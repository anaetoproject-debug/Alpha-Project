
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

const ChainSelector: React.FC<ChainSelectorProps> = ({ selected, onSelect, label, theme, isMinimal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const isDark = theme === 'DARK_FUTURISTIC' || theme === 'GLASSMORPHISM';

  const categories = ['All', 'L1', 'L2', 'EVM', 'Non-EVM'];

  const filteredItems = useMemo(() => {
    return CHAINS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const isL2 = ['arbitrum', 'optimism', 'base', 'polygon'].includes(c.id);
      const isNonEVM = ['solana', 'tron', 'ton'].includes(c.id);
      
      if (activeTab === 'L2' && !isL2) return false;
      if (activeTab === 'L1' && isL2) return false;
      if (activeTab === 'EVM' && isNonEVM) return false;
      if (activeTab === 'Non-EVM' && !isNonEVM) return false;
      
      return matchesSearch;
    });
  }, [search, activeTab]);

  const getButtonStyles = () => {
    if (isMinimal) return 'bg-transparent border-none p-0 hover:bg-transparent';
    switch (theme) {
      case 'DARK_FUTURISTIC':
        return 'bg-[#151926] border-white/5 hover:border-cyan-500/30 text-white';
      case 'GRADIENT_PREMIUM':
        return 'bg-white border-blue-100 hover:border-blue-300 text-slate-900';
      default:
        return 'bg-gray-50 border-gray-100 hover:border-gray-300 text-slate-900';
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center px-0 sm:px-4 animate-[fadeInOverlay_0.3s_ease-out]">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <div className={`relative w-full max-w-2xl h-full sm:h-auto sm:max-h-[85vh] flex flex-col rounded-t-[32px] sm:rounded-[48px] border transition-all duration-500 overflow-hidden ${
        isDark ? 'bg-[#0B0F1A] border-white/10 text-white shadow-2xl' : 'bg-white border-gray-100 text-slate-900 shadow-2xl'
      }`}>
        
        {/* Mobile drag indicator */}
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
                    ? (isDark ? 'bg-emerald-500 text-black border-emerald-500 shadow-lg' : 'bg-blue-600 text-white border-blue-600 shadow-lg')
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
              <p className="text-[10px] font-black uppercase tracking-[0.4em]">Signal Lost: Zero Networks</p>
            </div>
          )}
        </div>

        <div className={`p-4 sm:p-6 border-t shrink-0 ${isDark ? 'bg-black/40 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
           <p className="text-[8px] sm:text-[10px] font-bold opacity-40 leading-relaxed text-center uppercase tracking-[0.2em] max-w-sm mx-auto">
             Primary liquidity anchor protocol active.
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
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg">
              <img src={selected.icon} alt={selected.name} className="w-5 h-5 sm:w-6 h-6 object-contain" />
            </div>
            <span className="font-black text-sm sm:text-base tracking-tight truncate max-w-[80px] sm:max-w-none">{selected.name}</span>
          </div>
          <svg className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
