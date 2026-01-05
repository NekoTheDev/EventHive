import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

async function enableMocking() {
  // Strict guard: ensure we are in a browser environment.
  // We check for 'window' and 'navigator' to exclude Node.js/SSR.
  if (
    typeof window === 'undefined' || 
    typeof navigator === 'undefined'
  ) {
    return;
  }

  // Check for Service Worker support (needed for MSW in browser)
  if (!('serviceWorker' in navigator)) {
    console.warn('MSW: Service Worker not supported in this environment. Mocking disabled.');
    return;
  }

  try {
    // Dynamically import the worker factory.
    // This strictly isolates 'msw/browser' imports preventing side-effects in non-browser builds.
    const { createWorker } = await import('./mocks/browser');
    
    // Create the worker instance
    const worker = createWorker();
    
    if (!worker) {
      console.warn('MSW: Worker creation failed. Mocking disabled.');
      return;
    }

    // Start the worker
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  } catch (error) {
    console.error('Failed to initialize MSW:', error);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

// Initialize MSW then render
enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});