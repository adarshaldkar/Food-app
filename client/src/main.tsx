import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { Toaster } from './components/ui/sonner.tsx'

// Apply initial theme class to html element
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('vite-ui-theme') || 'light';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
