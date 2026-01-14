import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Jet Swap Production Bootloader
 * This file acts as the entry point for the ESM module graph.
 */

// Global error handler for module loading issues
window.addEventListener('error', (event) => {
  console.error('Jet Swap [Global Error]:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Jet Swap [Unhandled Promise]:', event.reason);
});

const mountApp = () => {
  console.log("Jet Swap: System Boot Initiated...");
  
  const container = document.getElementById('root');
  if (!container) {
    throw new Error("Target container 'root' not found in document.");
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Jet Swap: Interface Online.");
  } catch (err) {
    console.error("Jet Swap: Critical Mount Failure:", err);
  }
};

// Ensure DOM is fully interactive before mounting
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}