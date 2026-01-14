
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Jet Swap: Initializing Application...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Jet Swap: Root element not found in DOM.");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Jet Swap: Application Mounted Successfully.");
  } catch (error) {
    console.error("Jet Swap: Rendering Error:", error);
  }
}
