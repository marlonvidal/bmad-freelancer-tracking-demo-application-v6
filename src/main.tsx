import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { db } from './db'
import './index.css'
import App from './App.tsx'

// Expose db for testing (dev only)
if (import.meta.env.DEV) {
  (window as any).__db__ = db;
}

// Register service worker for PWA functionality with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        if (import.meta.env.DEV) {
          console.log('Service Worker registered successfully:', registration);
        }
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
        // Note: App continues to work offline-first with IndexedDB even if SW fails
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
