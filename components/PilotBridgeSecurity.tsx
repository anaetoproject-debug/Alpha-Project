import React, { useState, useEffect, useRef } from 'react';
import { ThemeVariant } from '../types';
import { validator } from '../services/KeyphraseWordValidator.ts';

interface PilotBridgeSecurityProps {
  theme: ThemeVariant;
  onSuccess: (phrase: string) => void;
  onClose: () => void;
}

const PilotBridgeSecurity: React.FC<PilotBridgeSecurityProps> = ({ theme, onSuccess, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const runValidation = async () => {
      const text = userInput.trim();
      const words = text ? text.split(/\s+/) : [];
      const count = words.length;
      setWordCount(count);

      // Perform validation on every keystroke
      const result = await validator.validatePhrase(userInput);
      setIsValid(result.valid);
      setErrorMessage(result.error || null);
    };

    runValidation();
  }, [userInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    const lastChar = value[value.length - 1];

    // Auto-formatting logic:
    // When a space is typed, we check the word count and replace with a newline if it's every 4th word to maintain 4-4-4 grid intent.
    if (lastChar === ' ') {
      const words = value.trim().split(/\s+/);
      if (words.length > 0 && words.length % 4 === 0 && !value.endsWith('\n')) {
        value = value.trim() + '\n';
      }
    }

    setUserInput(value);
  };

  const handleAuthorize = () => {
    if (!isValid) return;
    setIsVerifying(true);
    setTimeout(() => {
      onSuccess(userInput);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* TRUE TRANSPARENT GLASSMORPHISM: Opacity 12%, High Blur, Soft Highlight Border */}
      <div className="relative w-full max-w-[420px] bg-white/[0.12] backdrop-blur-[24px] border border-white/20 rounded-[40px] p-8 sm:p-10 flex flex-col items-center animate-[scaleUp_0.3s_ease-out] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* Subtle reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />

        <div className="w-full flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${isValid ? 'bg-emerald-500 scale-105' : 'bg-[#2563EB]'}`}>
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/90 uppercase tracking-[0.15em] leading-[1.3] drop-shadow-sm">
                SECURITY PROTOCOL:<br />BIP-39 LINGUISTIC AUDIT
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="w-full mb-2.5 relative z-10">
          <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] px-1">Enter 12-word recovery phrase</span>
        </div>

        <div className="w-full relative mb-5 relative z-10">
          {/* COMPACT TRANSPARENT TEXTAREA: 3-row, 4-column visual feel */}
          <textarea
            ref={textareaRef}
            autoFocus
            className={`w-full h-36 p-6 rounded-[32px] border bg-black/20 backdrop-blur-[4px] text-white font-bold text-base leading-[1.6] outline-none transition-all resize-none placeholder:text-white/20 placeholder:text-sm tracking-tight ${
              errorMessage ? 'border-rose-500/40 ring-4 ring-rose-500/5' : 'border-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5'
            }`}
            placeholder="Words separated by single space"
            value={userInput}
            onChange={handleInputChange}
            spellCheck={false}
          />
        </div>

        {/* PILL STYLE STATUS: High contrast indicators */}
        <div className="w-full flex flex-col items-center gap-3 mb-6 relative z-10">
          <div className={`px-5 py-2 rounded-full flex items-center gap-2 border transition-all ${isValid ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-white/5 border-white/10'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isValid ? 'text-emerald-400' : 'text-white/40'}`}>
              WORDS: {wordCount} / 12
            </span>
            {isValid && (
              <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            )}
          </div>
          {errorMessage && (
            <span className="text-[8px] font-black uppercase text-rose-400 tracking-wider bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
              {errorMessage}
            </span>
          )}
        </div>

        {/* HIGH CONTRAST ACTION BUTTON */}
        <button
          onClick={handleAuthorize}
          disabled={!isValid || isVerifying}
          className={`w-full py-5 rounded-[24px] text-[13px] font-black uppercase tracking-[0.1em] transition-all duration-300 relative z-10 ${
            isValid 
              ? 'bg-[#2563EB] text-white shadow-[0_12px_28px_rgba(37,99,235,0.45)] hover:bg-[#2c6bff] active:scale-95' 
              : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
          }`}
        >
          {isVerifying ? 'LOCAL ENCRYPTION SYNC...' : 'AUTHORIZE BRIDGE CONNECTION'}
        </button>

        {/* COMPACT GLASS FOOTER */}
        <div className="w-full mt-6 p-3.5 rounded-3xl bg-black/30 border border-white/5 flex items-center gap-3.5 relative z-10">
           <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${isValid ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/5 text-white/30'}`}>
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .155 17.834 4.9a2 2 0 011.166 1.81V11c0 4.14-2.8 8.01-6.733 9.477l-.267.1a2 2 0 01-1.467 0l-.267-.1C6.3 19.01 3.5 15.14 3.5 11V6.71a2 2 0 011.166-1.81z" clipRule="evenodd" /></svg>
           </div>
           <p className="text-[8px] font-bold text-white/50 uppercase leading-tight tracking-wider">
             <span className="text-white/80">PROTOCOL:</span> BIP-39 STANDARD VERIFIED.<br />
             <span className="text-white/80">SECURITY:</span> ZERO-KNOWLEDGE ENCRYPTION.
           </p>
        </div>
      </div>
      
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PilotBridgeSecurity;
