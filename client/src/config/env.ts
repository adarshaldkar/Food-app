// Environment configuration
// This file centralizes all environment variables for the client

export const config = {
  // API URLs
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1',
  
  // Stripe
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  
  // Helper functions
  getApiUrl: (path: string) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  },
  
  getBackendUrl: (path: string) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
    return `${backendUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }
};

export default config;


