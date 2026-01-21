import React from 'react';
import { ThemeVariant } from '../types';

interface ThemeSwitcherProps {
  current: ThemeVariant;
  onChange: (variant: ThemeVariant) => void;
  isKeyboardVisible?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ current, onChange, isKeyboardVisible }) => {
  const themes = [
    { id: ThemeVariant.DARK_FUTURISTIC, label: 'Dark Mode' },
    { id: ThemeVariant.GRADIENT_PREMIUM, label: 'Gradient' },
  ];

  // If keyboard is visible, we shift it slightly or lower opacity to avoid being intrusive.
  // In many cases, it's better to hide it entirely or move it further up.
  // We'll use a transform to push it up if keyboard is active.
  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-1 p-1 bg-black/10 backdrop-blur-md rounded-full border border-white/20 z-50 transition-all duration-500 ${
        isKeyboardVisible ? 'opacity-0 pointer-events-none translate-y-20' : 'opacity-100 translate-y-0'
      }`}
    >
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => onChange(theme.id)}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
            current === theme.id
              ? 'bg-white text-black shadow-lg'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          {theme.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;