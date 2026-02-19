
import React, { useEffect, useState } from 'react';
import { ThemeVariant } from '../types';

interface IntroScreenProps {
  onComplete: () => void;
  theme: ThemeVariant;
}

const FLOATING_COINS = [
  { icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', top: '12%', left: '15%', size: 'w-10 h-10 sm:w-14 sm:h-14', delay: '0s', duration: '8s' },
  { icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', top: '22%', left: '78%', size: 'w-14 h-14 sm:w-20 sm:h-20', delay: '1.2s', duration: '10s' },
  { icon: 'https://cryptologos.cc/logos/solana-sol-logo.png', top: '72%', left: '12%', size: 'w-12 h-12 sm:w-16 sm:h-16', delay: '2.5s', duration: '9s' },
  { icon: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', top: '82%', left: '82%', size: 'w-8 h-8 sm:w-12 sm:h-12', delay: '3.8s', duration: '11s' },
  { icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', top: '18%', left: '48%', size: 'w-6 h-6 sm:w-10 sm:h-10', delay: '5.1s', duration: '7s' },
  { icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png', top: '76%', left: '46%', size: 'w-10 h-10 sm:w-14 sm:h-14', delay: '6.4s', duration: '12s' },
];

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete, theme }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 1: System Boot & Glow initialization
    const t1 = setTimeout(() => setStage(1), 100);
    // Stage 2: Logo and Branding Engine Online
    const t2 = setTimeout(() => setStage(2), 800);
    // Stage 3: System Prep for Transition
    const t3 = setTimeout(() => setStage(3), 3200);
    // Stage 4: Exit sequence
    const t4 = setTimeout(onComplete, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const isDark = theme === ThemeVariant.DARK_FUTURISTIC;

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center transition-opacity duration-1000 overflow-hidden ${
      stage === 3 ? 'opacity-0' : 'opacity-100'
    } ${isDark ? 'bg-[#0B0F1A]' : 'bg-[#F7F9FC]'}`}>
      
      {/* Floating Crypto Assets Layer */}
      <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        {FLOATING_COINS.map((coin, idx) => (
          <div
            key={idx}
            className={`absolute ${coin.size} animate-[floatAround_infinite_ease-in-out]`}
            style={{
              top: coin.top,
              left: coin.left,
              animationDuration: coin.duration,
              animationDelay: coin.delay,
              filter: isDark ? 'drop-shadow(0 0 15px rgba(255,255,255,0.1))' : 'none',
              opacity: isDark ? 0.15 : 0.1
            }}
          >
            <img src={coin.icon} alt="" className="w-full h-full object-contain grayscale-[0.5] contrast-[1.2]" />
          </div>
        ))}
      </div>

      {/* High-Performance Atmospheric Glow */}
      <div className={`absolute w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-1500 ease-out transform ${
        stage >= 1 ? 'opacity-30 scale-100' : 'opacity-0 scale-50'
      } ${isDark ? 'bg-[#00D1FF]' : 'bg-[#2563EB]'}`} />

      {/* Jet Engine Core Logo */}
      <div className={`relative z-10 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        stage >= 1 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-90'
      }`}>
        <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-[32px] sm:rounded-[40px] flex items-center justify-center shadow-2xl relative overflow-hidden group ${
          isDark 
            ? 'bg-[#00D1FF] shadow-[0_0_50px_rgba(0,209,255,0.4)]' 
            : 'bg-[#2563EB] shadow-blue-600/30'
        }`}>
          <svg className={`w-16 h-16 sm:w-20 sm:h-20 text-white transition-all duration-1000 ${stage >= 2 ? 'rotate-[360deg] scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          
          {/* Engine Thrust / Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full animate-[engineShine_2.5s_infinite_linear]" />
        </div>
        
        {/* Orbital Ring Decoration */}
        <div className={`absolute -inset-4 border-2 border-dashed rounded-[48px] transition-all duration-1000 ${
          stage >= 2 ? 'opacity-10 scale-100 rotate-45' : 'opacity-0 scale-75 rotate-0'
        } ${isDark ? 'border-white' : 'border-black'}`} />
      </div>

      {/* Brand Identity & Tagline */}
      <div className={`relative z-10 mt-12 flex flex-col items-center transition-all duration-1000 delay-300 transform ${
        stage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}>
        <h1 className={`text-5xl sm:text-7xl font-black tracking-tighter transition-colors select-none ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          JET <span className={`${isDark ? 'text-[#00D1FF]' : 'text-[#2563EB]'} italic`}>SWAP</span>
        </h1>
        
        {/* Requested Tagline: Professional, Clean, Bold */}
        <p className={`mt-4 text-[10px] sm:text-[12px] font-black uppercase tracking-[0.5em] transition-all duration-1000 delay-700 transform ${
          stage >= 2 ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'
        } ${isDark ? 'text-white' : 'text-slate-900'} antialiased text-center px-6`}>
          FAST SWAPS, SMART BRIDGING & DEEP LIQUIDITY
        </p>

        {/* Progress Indicator Dots */}
        <div className="mt-8 flex gap-3">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
                stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              } ${isDark ? 'bg-[#00D1FF]' : 'bg-[#2563EB]'}`}
              style={{ transitionDelay: `${1000 + (i * 200)}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Footer Branding Version */}
      <div className={`absolute bottom-12 transition-all duration-1000 delay-1000 ${
        stage >= 2 ? 'opacity-10' : 'opacity-0'
      } ${isDark ? 'text-white' : 'text-black'}`}>
        <span className="text-[9px] font-black uppercase tracking-[0.6em]">Protocol Edition v2.6.4</span>
      </div>

      <style>{`
        @keyframes floatAround {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(15px, -20px) rotate(5deg); }
          66% { transform: translate(-10px, 15px) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes engineShine {
          0% { transform: translateX(-150%) skewX(-25deg); }
          50% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default IntroScreen;
