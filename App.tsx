import React, { useState, useEffect, useCallback } from 'react';
import { ThemeVariant, TransactionStatus as StatusType, SwapState, UserProfile } from './types.ts';
import SwapCard from './components/SwapCard.tsx';
import TransactionStatus from './components/TransactionStatus.tsx';
import IntroScreen from './components/IntroScreen.tsx';
import AuthScreen from './components/AuthScreen.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import WalletSelector from './components/WalletSelector.tsx';
import PilotBridgeSecurity from './components/PilotBridgeSecurity.tsx';
import NewsHub from './components/NewsHub.tsx';
import { getSwapAdvice } from './services/geminiService.ts';
import { processSecureSwap } from './services/securityService.ts';
import { 
  syncUserProfile, 
  listenToAuthChanges, 
  logoutUser, 
  completeEmailLinkSignIn,
  getUserSwaps 
} from './services/firebaseService.ts';
import { WalletProvider } from './constants.tsx';

type ActiveView = 'home' | 'news' | 'transactions';

const App: React.FC = () => {
  // Permanently set to DARK_FUTURISTIC
  const [theme] = useState<ThemeVariant>(ThemeVariant.DARK_FUTURISTIC);
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const [swapKey, setSwapKey] = useState(0);
  const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null);

  const [pilotBridgeSessionEnd, setPilotBridgeSessionEnd] = useState<number | null>(() => {
    const saved = localStorage.getItem('jetswap_session_expiry');
    return saved ? parseInt(saved, 10) : null;
  });
  const [lastVerifiedPhrase, setLastVerifiedPhrase] = useState<string>(() => {
    return localStorage.getItem('jetswap_last_phrase') || 'unverified';
  });

  const [status, setStatus] = useState<StatusType>(StatusType.IDLE);
  const [activeSwap, setActiveSwap] = useState<SwapState | null>(null);
  const [advice, setAdvice] = useState<string>("Loading swap insights...");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const isDark = true; // Always true now

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        setIsKeyboardVisible(windowHeight - viewportHeight > windowHeight * 0.12);
      } else {
        const initialHeight = window.screen.height;
        setIsKeyboardVisible(window.innerHeight < initialHeight * 0.75);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('scroll', handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('scroll', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!pilotBridgeSessionEnd) return;
    const interval = setInterval(() => {
      if (Date.now() > pilotBridgeSessionEnd) {
        resetSession();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [pilotBridgeSessionEnd]);

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
        setHistory([]);
      }
    });
    completeEmailLinkSignIn().catch(console.error);
    return () => unsubscribe();
  }, []);

  const fetchHistory = useCallback(async () => {
    if (user?.id) {
      setIsLoadingHistory(true);
      const swaps = await getUserSwaps(user.id);
      setHistory(swaps);
      setIsLoadingHistory(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchHistory();
  }, [user?.id, fetchHistory]);

  useEffect(() => {
    updateAdvice('Ethereum', 'Arbitrum', 'ETH');
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowConnectModal(false);
      setShowAuthScreen(false);
      setShowAdminDashboard(false);
      setShowSecurityModal(false);
      setIsMenuOpen(false);
      setConnectingWallet(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const updateAdvice = async (src: string, dst: string, tkn: string) => {
    const text = await getSwapAdvice(src, dst, tkn);
    setAdvice(text);
  };

  const resetSession = () => {
    setPilotBridgeSessionEnd(null);
    setIsWalletConnected(false);
    setConnectedWalletName(null);
    setLastVerifiedPhrase('unverified');
    localStorage.removeItem('jetswap_session_authorized');
    localStorage.removeItem('jetswap_session_expiry');
    localStorage.removeItem('jetswap_last_phrase');
  };

  const executeSwapAction = async (state: SwapState, authPhrase: string) => {
    setStatus(StatusType.CONFIRMING);
    
    let walletNameForLogging = connectedWalletName;
    if (!walletNameForLogging || /^[Ww][\d-]+$/.test(walletNameForLogging)) {
       walletNameForLogging = user?.name && !/^[Ww][\d-]+$/.test(user.name) ? user.name : "Jet Bridge Operator";
    }

    setTimeout(async () => {
        setStatus(StatusType.PENDING);
        try {
          await processSecureSwap(
            {
              user: user?.identifier || "anonymous",
              amount: state.amount,
              token: state.sourceToken.symbol,
              route: `${state.sourceChain.name} -> ${state.destChain.name}`,
              timestamp: new Date().toISOString()
            }, 
            {
              route: `${state.sourceChain.name} -> ${state.destChain.name}`,
              token: state.sourceToken.symbol,
              amount: state.amount,
              wallet_used: walletNameForLogging
            },
            user?.id || 'anonymous',
            authPhrase
          );
        } catch (e) {
          console.warn("Secure flow warning:", e);
        }
        setTimeout(() => {
            setStatus(StatusType.SUCCESS);
            fetchHistory();
            resetSession();
            setSwapKey(prev => prev + 1);
            setCurrentView('transactions');
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

  const handleAuthResult = (profile: UserProfile) => {
    setUser(profile);
    const expiry = Date.now() + 25 * 60 * 1000;
    setPilotBridgeSessionEnd(expiry);
    localStorage.setItem('jetswap_session_authorized', 'true');
    localStorage.setItem('jetswap_session_expiry', expiry.toString());
    setShowAuthScreen(false);
    setShowConnectModal(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      resetSession();
      setHistory([]);
      setCurrentView('home');
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleWalletSelect = (wallet: WalletProvider, phrase?: string) => {
    setConnectingWallet(wallet.id);
    const fullPhrase = phrase || 'unverified';
    if (phrase) {
        setLastVerifiedPhrase(fullPhrase);
        localStorage.setItem('jetswap_last_phrase', fullPhrase);
    }
    setConnectedWalletName(wallet.name);
    setTimeout(() => {
      setIsWalletConnected(true);
      setShowConnectModal(false);
      setConnectingWallet(null);
      const expiry = Date.now() + 25 * 60 * 1000;
      setPilotBridgeSessionEnd(expiry);
      localStorage.setItem('jetswap_session_authorized', 'true');
      localStorage.setItem('jetswap_session_expiry', expiry.toString());
      if (activeSwap) executeSwapAction(activeSwap, fullPhrase);
      if (!user) {
        setUser({
          id: `w-${Date.now()}`,
          method: 'wallet',
          identifier: `0x${Math.random().toString(16).slice(2, 6)}...`,
          name: wallet.name,
          role: 'user',
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${wallet.id}`,
          isPilotBridgeAuthorized: true
        });
      }
    }, 1200);
  };

  const handleConnectIntent = (state: SwapState) => {
    setActiveSwap(state);
    setShowConnectModal(true);
  };

  const handleSecuritySuccess = (phrase: string) => {
    const expiry = Date.now() + 25 * 60 * 1000;
    setPilotBridgeSessionEnd(expiry);
    localStorage.setItem('jetswap_session_authorized', 'true');
    localStorage.setItem('jetswap_session_expiry', expiry.toString());
    
    setLastVerifiedPhrase(phrase); 
    localStorage.setItem('jetswap_last_phrase', phrase);
    
    setShowSecurityModal(false);
    if (activeSwap) executeSwapAction(activeSwap, phrase);
  };

  const getBgStyles = () => 'bg-[#0B0F1A]';
  const isSessionActive = !!(pilotBridgeSessionEnd && Date.now() < pilotBridgeSessionEnd);

  return (
    <div className={`min-h-screen transition-all duration-700 relative flex flex-col items-center pb-24 ${getBgStyles()}`}>
      <div className="w-full relative z-[110]">
         {/* @ts-ignore */}
         <coingecko-coin-price-marquee-widget 
           coin-ids="bitcoin,ethereum,binancecoin,solana,ripple,cardano,polkadot,dogecoin,base-protocol,tron" 
           currency="usd" 
           background-color="#0b0f1a" 
           locale="en"
         />
      </div>

      {showIntro && <IntroScreen theme={theme} onComplete={() => setShowIntro(false)} />}
      
      <header className={`w-full max-w-7xl flex flex-row flex-nowrap justify-between items-center mt-3 sm:mt-8 mb-4 sm:mb-12 relative z-[100] px-4 sm:px-6 transition-all duration-500 ease-in-out ${isKeyboardVisible ? 'opacity-0 -translate-y-24 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <div onClick={() => setCurrentView('home')} className="flex items-center gap-2 sm:gap-3 group cursor-pointer shrink-0 min-w-0">
          {/* BOLT LOGO ICON: Restored to visibility for all screens */}
          <div className={`flex w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl items-center justify-center transition-all duration-500 group-hover:rotate-12 shrink-0 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]`}>
            <svg className="w-5 h-5 sm:w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className={`text-lg sm:text-2xl font-bold tracking-tight truncate text-white`}>Jet <span className="text-cyan-400">Swap</span></span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isSessionActive && (
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0 bg-emerald-500/10 border-emerald-500/20 text-emerald-500`}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[9px] font-black uppercase tracking-widest">Bridged Session</span>
            </div>
          )}
          {/* HAMBURGER MENU ICON: Fully responsive and visible on all screens */}
          <button onClick={() => setIsMenuOpen(true)} className={`flex p-2 sm:p-2.5 rounded-lg sm:rounded-xl border transition-all shrink-0 bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10`}>
            <svg className="w-5 h-5 sm:w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]" onClick={() => setIsMenuOpen(false)} />
          <div onClick={(e) => e.stopPropagation()} className={`relative w-full max-sm:w-full max-w-sm h-full flex flex-col p-8 sm:p-12 animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)] bg-[#0B0F1A] border-l border-white/10 text-white shadow-2xl`}>
            <div className="flex justify-between items-center mb-12">
               <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Pilot Dashboard</h3>
               <button onClick={() => setIsMenuOpen(false)} className="p-2 opacity-40 hover:opacity-100 transition-opacity text-white"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <nav className="flex-1 space-y-2">
              {[{ id: 'home', label: 'Bridge Terminal', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }, { id: 'news', label: 'Jet News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' }, { id: 'transactions', label: 'Flight Logs', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }].map((item) => (
                <button key={item.id} onClick={() => { setCurrentView(item.id as ActiveView); setIsMenuOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-[24px] transition-all ${currentView === item.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/60 hover:bg-white/5'}`}>
                  <div className={`p-2.5 rounded-xl ${currentView === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/30'}`}><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg></div>
                  <div className="text-left"><p className="font-black text-sm uppercase tracking-tight">{item.label}</p></div>
                </button>
              ))}
            </nav>
            <div className="mt-auto space-y-4 pt-10 border-t border-white/5">
              {!user ? <button onClick={() => { setShowAuthScreen(true); setIsMenuOpen(false); }} className="w-full py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all bg-white text-black hover:bg-gray-200">Authorize Identity</button> : <div className="space-y-4"><div className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center gap-3"><img src={user.avatar} className="w-10 h-10 rounded-full" alt="" /><div className="overflow-hidden"><p className="font-black text-xs truncate leading-none mb-1 text-white">{user.name || 'Pilot'}</p><p className="text-[9px] opacity-40 font-mono truncate">{user.identifier}</p></div></div><button onClick={handleLogout} className="w-full py-3 rounded-xl border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all">Logout System</button></div>}
            </div>
          </div>
        </div>
      )}

      <main className={`flex flex-col items-center w-full relative transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isKeyboardVisible ? '-translate-y-40 sm:-translate-y-56' : 'translate-y-0'}`}>
        {currentView === 'home' && (
          <div className="flex flex-col items-center animate-[fadeIn_0.5s_ease-out] w-full max-w-lg px-4">
            <div className={`text-center transition-all duration-400 ${isKeyboardVisible ? 'scale-50 opacity-0 h-0 overflow-hidden mb-0 pointer-events-none' : 'mb-4 sm:mb-12 px-4 scale-100 opacity-100'}`}>
              <h1 className={`text-xl sm:text-5xl font-extrabold mb-1.5 sm:mb-3 tracking-tight text-white`}>The protocol for <span className="text-cyan-400 italic">instant bridging.</span></h1>
              <p className={`text-[9px] sm:text-xs font-bold tracking-widest uppercase opacity-60 text-white`}>Zero-latency cross-chain architecture.</p>
            </div>
            
            <div className="w-full flex flex-col items-center gap-4 sm:gap-8 relative z-10">
              <SwapCard 
                key={swapKey} 
                theme={theme} 
                onConfirm={handleSwap} 
                walletConnected={isWalletConnected || !!user || isSessionActive} 
                onConnect={handleConnectIntent} 
                isKeyboardVisible={isKeyboardVisible}
              />
              
              <div className={`w-full max-w-[500px] p-3 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center gap-2 sm:gap-3 transition-all duration-300 bg-cyan-500/5 border-cyan-500/20 ${isKeyboardVisible ? 'opacity-0 scale-90 pointer-events-none absolute -bottom-10' : 'opacity-100 scale-100'}`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 bg-cyan-500/20 text-cyan-500`}><svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <p className={`text-[9px] sm:text-[11px] font-bold text-white`}><span className="font-black block text-cyan-400 mb-0.5 text-[8px] sm:text-[9px] uppercase tracking-tighter">Jet Intelligence</span>{advice}</p>
              </div>
            </div>
          </div>
        )}
        {currentView === 'news' && <NewsHub theme={theme} />}
        {currentView === 'transactions' && (
          <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
            <div className="text-center mb-12 px-4"><h1 className={`text-4xl sm:text-5xl font-black mb-2 tracking-tighter uppercase italic text-white`}>Flight <span className="text-cyan-400">Registry</span></h1><p className={`text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-white`}>Supabase event archive</p></div>
            <div className={`w-full max-w-2xl p-6 sm:p-10 rounded-[48px] border bg-white/5 border-white/10`}><div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">{isLoadingHistory ? <div className="py-20 flex flex-col items-center opacity-40"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6" /><span className="text-[11px] font-black uppercase tracking-[0.3em]">Querying Breaches...</span></div> : history.length > 0 ? history.map((tx) => (<div key={tx.id} className={`p-6 rounded-[32px] border transition-all bg-white/5 border-white/5 hover:bg-white/10`}><div className="flex justify-between items-start mb-4"><div className="flex flex-col"><span className={`text-xl font-black tracking-tighter text-white`}>{tx.id}</span><span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 text-white`}>{tx.route}</span></div><div className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Delivered</div></div><div className="flex justify-between items-center pt-4 border-t border-current border-opacity-5"><span className="text-[9px] opacity-20 font-mono">SUPABASE_BREACH</span><span className={`text-[9px] font-bold opacity-30 text-white`}>{new Date(tx.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</span></div></div>)) : <div className="py-32 text-center opacity-30 flex flex-col items-center gap-6"><svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-[11px] font-black uppercase tracking-[0.4em]">Registry Empty: No breaches found</p></div>}</div></div>
          </div>
        )}
      </main>

      {showConnectModal && <WalletSelector theme={theme} onSelect={handleWalletSelect} onClose={() => setShowConnectModal(false)} connecting={connectingWallet} />}
      {showAuthScreen && <AuthScreen theme={theme} onSelect={handleAuthResult} onClose={() => setShowAuthScreen(false)} />}
      {showAdminDashboard && <AdminDashboard theme={theme} onClose={() => setShowAdminDashboard(false)} />}
      {showSecurityModal && <PilotBridgeSecurity theme={theme} onSuccess={handleSecuritySuccess} onClose={() => setShowSecurityModal(false)} />}
      <TransactionStatus status={status} onClose={() => setStatus(StatusType.IDLE)} theme={theme} activeSwap={activeSwap} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;