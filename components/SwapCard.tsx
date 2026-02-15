import React, { useState, useEffect, useMemo } from 'react';
import { ThemeVariant, SwapState, Chain, Token } from '../types';
import { CHAINS, TOKENS } from '../constants';
import ChainSelector from './ChainSelector';
import TokenSelector from './TokenSelector';
import { getLiveQuotes } from '../services/cmcService';

interface SwapCardProps {
  theme: ThemeVariant;
  onConfirm: (state: SwapState) => void;
  walletConnected: boolean;
  onConnect: (state: SwapState) => void;
  isKeyboardVisible?: boolean;
}

const INITIAL_PRICES: Record<string, number> = {
  'ETH': 2642.15, 'BNB': 584.20, 'SOL': 142.50, 'TRX': 0.12, 'AVAX': 34.80,
  'TON': 5.20, 'CRO': 0.08, 'ARB': 0.95, 'MATIC': 0.52, 'GNO': 185.00,
  'OP': 1.65, 'USDC': 1.00, 'USDT': 1.00,
};

const SwapCard: React.FC<SwapCardProps> = ({ theme, walletConnected, onConfirm, onConnect }) => {
  const [intent, setIntent] = useState<'swap' | 'bridge'>('swap');
  const [livePrices, setLivePrices] = useState<Record<string, number>>(INITIAL_PRICES);
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState<'source' | 'dest' | null>(null);
  
  const [state, setState] = useState<SwapState>({
    sourceChain: CHAINS[0],
    destChain: CHAINS[0], // Synchronized by default for SWAP
    sourceToken: TOKENS[0],
    destToken: TOKENS[0],
    amount: '',
    estimatedOutput: ''
  });

  useEffect(() => {
    const fetchPrices = async () => {
      const symbols = TOKENS.map(t => t.symbol);
      const quotes = await getLiveQuotes(symbols);
      if (quotes) {
        const newPrices: Record<string, number> = {};
        Object.keys(quotes).forEach(symbol => {
          newPrices[symbol] = quotes[symbol].price;
        });
        setLivePrices(newPrices);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    if (parseFloat(state.amount) > 0) {
      const sourcePrice = livePrices[state.sourceToken.symbol] || 1;
      const destPrice = livePrices[state.destToken.symbol] || 1;
      const rate = sourcePrice / destPrice;
      const output = (parseFloat(state.amount) * rate * 0.995).toFixed(4);
      setState(prev => ({ ...prev, estimatedOutput: output }));
    } else {
      setState(prev => ({ ...prev, estimatedOutput: '' }));
    }
  }, [state.amount, state.sourceToken, state.destToken, livePrices]);

  const sourceUsdValue = useMemo(() => {
    const amt = parseFloat(state.amount);
    if (isNaN(amt)) return '0.00';
    return (amt * (livePrices[state.sourceToken.symbol] || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [state.amount, state.sourceToken, livePrices]);

  const minOutput = useMemo(() => {
    const amt = parseFloat(state.estimatedOutput);
    if (isNaN(amt)) return '0.00';
    return (amt * (livePrices[state.destToken.symbol] || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [state.estimatedOutput, state.destToken, livePrices]);

  const handleSwapDirection = () => {
    setState(prev => ({
      ...prev,
      // In Swap mode, chains are locked so swap doesn't affect them. 
      // In Bridge mode, chains are swapped.
      sourceChain: intent === 'swap' ? prev.sourceChain : prev.destChain,
      destChain: intent === 'swap' ? prev.destChain : prev.sourceChain,
      sourceToken: prev.destToken,
      destToken: prev.sourceToken,
      amount: prev.estimatedOutput,
      estimatedOutput: prev.amount
    }));
  };

  const handleSourceChainSelect = (chain: Chain) => {
    if (intent === 'swap') {
      // BI-DIRECTIONAL LOCK: Update both selectors simultaneously
      setState(prev => ({ ...prev, sourceChain: chain, destChain: chain }));
    } else {
      setState(prev => ({ ...prev, sourceChain: chain }));
    }
  };

  const handleDestChainSelect = (chain: Chain) => {
    if (intent === 'swap') {
      // BI-DIRECTIONAL LOCK: Update both selectors simultaneously
      setState(prev => ({ ...prev, sourceChain: chain, destChain: chain }));
    } else {
      setState(prev => ({ ...prev, destChain: chain }));
    }
  };

  const toggleIntent = (newIntent: 'swap' | 'bridge') => {
    setIntent(newIntent);
    if (newIntent === 'swap') {
      // Ensure shared network state when entering swap mode
      setState(prev => ({ ...prev, destChain: prev.sourceChain }));
    }
  };

  return (
    <div className={`w-full max-w-[440px] p-4 sm:p-6 rounded-[32px] sm:rounded-[40px] bg-[#0F172A]/80 backdrop-blur-xl border border-white/[0.05] shadow-[0_24px_80px_rgba(0,0,0,0.8)] transition-all duration-500 relative z-10`}>
      
      {/* Tab Selectors */}
      <div className="flex justify-center gap-10 sm:gap-14 mb-4 sm:mb-6">
        <button onClick={() => toggleIntent('swap')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative pb-2 ${intent === 'swap' ? 'text-[#00D1FF]' : 'text-white/20 hover:text-white/40'}`}>
          SWAP
          {intent === 'swap' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#00D1FF] rounded-full shadow-[0_0_8px_rgba(0,209,255,0.6)]" />}
        </button>
        <button onClick={() => toggleIntent('bridge')} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative pb-2 ${intent === 'bridge' ? 'text-[#00D1FF]' : 'text-white/20 hover:text-white/40'}`}>
          PILOT BRIDGE
          {intent === 'bridge' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-[#00D1FF] rounded-full shadow-[0_0_8px_rgba(0,209,255,0.6)]" />}
        </button>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* SELL / FROM SECTION */}
        <div className="p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] bg-[#0B0F1A]/60 border border-white/[0.03] focus-within:border-cyan-500/20 transition-all">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">SELL / FROM</span>
            <div className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5">
              <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">BAL: 0.00</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4 bg-white/[0.02] p-2 rounded-2xl border border-white/[0.02]">
            <div className="flex-1">
               <ChainSelector 
                selected={state.sourceChain} 
                onSelect={handleSourceChainSelect} 
                label="" 
                theme={ThemeVariant.DARK_FUTURISTIC} 
                isMinimal={true}
              />
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="flex-1">
              <button 
                onClick={() => setIsTokenSelectorOpen('source')}
                className="w-full flex items-center justify-between gap-1.5 px-2 py-1 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <img src={state.sourceToken.icon} className="w-4 h-4 object-contain rounded-full shadow-sm" alt="" />
                  <span className="font-black text-[13px] uppercase text-white tracking-tight">{state.sourceToken.symbol}</span>
                </div>
                <svg className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between px-1">
            <input 
              type="number" 
              placeholder="0.0" 
              autoFocus
              className="bg-transparent border-none outline-none flex-1 text-3xl sm:text-4xl font-black text-white placeholder:text-white/10 w-full tracking-tighter"
              value={state.amount}
              onChange={(e) => setState(prev => ({ ...prev, amount: e.target.value }))}
            />
            <span className="text-[11px] font-bold text-white/30 tracking-tight pb-1.5 shrink-0">≈ ${sourceUsdValue}</span>
          </div>
        </div>

        {/* DIRECTIONAL ARROW */}
        <div className="relative h-2 flex items-center justify-center -my-2 z-10">
          <button 
            onClick={handleSwapDirection}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B0F1A] border border-white/10 flex items-center justify-center text-[#00D1FF] hover:scale-110 active:scale-95 transition-all shadow-xl group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
          </button>
        </div>

        {/* BUY / RECEIVE SECTION */}
        <div className="p-4 sm:p-5 rounded-[24px] sm:rounded-[28px] bg-[#0B0F1A]/60 border border-white/[0.03]">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.15em]">BUY / RECEIVE</span>
          </div>
          
          <div className="flex items-center gap-2 mb-4 bg-white/[0.02] p-2 rounded-2xl border border-white/[0.02]">
            <div className="flex-1">
               <ChainSelector 
                selected={state.destChain} 
                onSelect={handleDestChainSelect} 
                label="" 
                theme={ThemeVariant.DARK_FUTURISTIC} 
                isMinimal={true}
              />
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="flex-1">
              <button 
                onClick={() => setIsTokenSelectorOpen('dest')}
                className="w-full flex items-center justify-between gap-1.5 px-2 py-1 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <img src={state.destToken.icon} className="w-4 h-4 object-contain rounded-full shadow-sm" alt="" />
                  <span className="font-black text-[13px] uppercase text-white tracking-tight">{state.destToken.symbol}</span>
                </div>
                <svg className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between px-1">
            <input 
              type="text"
              readOnly
              className="bg-transparent border-none outline-none flex-1 text-3xl sm:text-4xl font-black text-white/30 truncate tracking-tighter w-full"
              value={state.estimatedOutput || '0.0'}
            />
            <span className="text-[11px] font-bold text-white/30 tracking-tight pb-1.5 shrink-0">≈ ${minOutput}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => walletConnected ? onConfirm(state) : onConnect(state)}
        className="w-full mt-5 sm:mt-7 py-4 sm:py-5 rounded-2xl bg-[#002D74] text-white font-black uppercase tracking-[0.05em] text-[12px] sm:text-sm hover:bg-[#00388A] transition-all shadow-[0_12px_32px_rgba(0,45,116,0.4)] active:scale-[0.98] focus:ring-2 focus:ring-cyan-500/50"
      >
        CONNECT PILOT
      </button>

      <TokenSelector 
        isOpen={!!isTokenSelectorOpen} 
        onClose={() => setIsTokenSelectorOpen(null)} 
        selected={isTokenSelectorOpen === 'source' ? state.sourceToken : state.destToken}
        onSelect={(t) => {
          if (isTokenSelectorOpen === 'source') setState(prev => ({ ...prev, sourceToken: t }));
          else setState(prev => ({ ...prev, destToken: t }));
        }}
        theme={ThemeVariant.DARK_FUTURISTIC}
      />
    </div>
  );
};

export default SwapCard;