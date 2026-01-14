
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Jet Swap Bootloader
 * Ensures the DOM is ready and React 19 is mounted correctly.
 */

const init = () => {
  console.log("Jet Swap: Initializing Application...");
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("Jet Swap Critial Error: Root element #root not found.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Jet Swap: Application Mounted Successfully.");
  } catch (error) {
    console.error("Jet Swap: Runtime Mounting Error:", error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
