
import React from 'react';
import { ThemeVariant } from '../types';

interface NewsHubProps {
  theme: ThemeVariant;
}

const NewsHub: React.FC<NewsHubProps> = ({ theme }) => {
  const isDark = theme === ThemeVariant.DARK_FUTURISTIC;

  return (
    <section className="w-full max-w-7xl px-4 py-20 mt-10 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col items-center">
        
        {/* Header Section */}
        <div className="w-full max-w-xl mb-16 text-center">
          <h2 className={`text-5xl sm:text-7xl font-black italic uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Jet <span className="text-blue-500">Intelligence</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500`}>
                Global Data Feed Active
              </p>
            </div>
          </div>
          <p className={`text-xs font-bold opacity-40 uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed`}>
            Sub-second market intelligence delivered via decentralized relay nodes.
          </p>
        </div>

        {/* Integrated News Widget Container with WHITE-LABEL CLOAK */}
        <div className="w-full max-w-3xl animate-[fadeIn_0.8s_ease-out]">
           <div className={`p-1 sm:p-1.5 rounded-[48px] overflow-hidden border transition-all duration-500 shadow-2xl ${
             isDark ? 'bg-[#1e293b]/20 border-white/5 hover:border-blue-500/30' : 'bg-gray-100/50 border-gray-100'
           }`}>
             
             {/* CLOAKING CONTAINER: Fixed height with overflow:hidden to crop out external branding */}
             <div 
               style={{
                 height: '410px', // Fixed height to clip bottom
                 backgroundColor: isDark ? '#0F172A' : '#ffffff', 
                 overflow: 'hidden', 
                 boxSizing: 'border-box', 
                 border: isDark ? '1px solid #1E293B' : '1px solid #e2e8f0', 
                 borderRadius: '36px', 
                 width: '100%',
                 position: 'relative'
               }}
             >
                {/* 
                  THE CROP: 
                  The iframe is 480px tall, but the container above is 410px. 
                  This hides the bottom 70px where CoinLib branding typically sits.
                */}
                <div style={{ height: '480px', padding: '0px', margin: '0px', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                  <iframe 
                    src={`https://widget.coinlib.io/widget?type=news&theme=${isDark ? 'dark' : 'light'}&cnt=8&pref_coin_id=1505&graph=yes`} 
                    width="100%" 
                    height="480px" 
                    scrolling="auto" 
                    marginWidth={0} 
                    marginHeight={0} 
                    frameBorder={0} 
                    style={{ border: 0, margin: 0, padding: 0 }}
                    title="Market Intelligence Feed"
                  ></iframe>
                </div>
                
                {/* Pointer events shield for the bottom crop area to prevent clicking hidden links */}
                <div className="absolute bottom-0 left-0 w-full h-10 z-10 bg-transparent pointer-events-none" />
             </div>
           </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-10">
             <div className="h-px w-12 bg-current" />
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             <div className="h-px w-12 bg-current" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-10 italic">
            Jet Protocol Relay v2.6.1
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsHub;
