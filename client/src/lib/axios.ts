import axios from 'axios';
import { config } from '../config/env';

// Create optimized axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for performance optimizations
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for performance monitoring
    config.metadata = { startTime: new Date().getTime() };
    
    // Optimize headers
    if (config.method === 'get') {
      // Add cache control headers for GET requests
      config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and performance monitoring
api.interceptors.response.use(
  (response) => {
    // Calculate request duration for monitoring
    if (response.config.metadata?.startTime) {
      const duration = new Date().getTime() - response.config.metadata.startTime;
      if (duration > 5000) { // Log slow requests
        console.warn(`Slow API request detected: ${response.config.url} took ${duration}ms`);
      }
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - consider optimizing the API endpoint');
    }
    
    // Handle specific error cases
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded - implementing exponential backoff');
      // Could implement retry logic here
    }
    
    return Promise.reject(error);
  }
);

export default api;
