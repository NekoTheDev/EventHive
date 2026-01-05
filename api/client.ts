import axios from 'axios';

// Explicitly use the window origin to ensure absolute URLs.
// This helps MSW intercept requests reliably and prevents URL parsing errors
// that can occur with relative paths in some environments.
const baseURL = typeof window !== 'undefined' && window.location.origin 
  ? `${window.location.origin}/api` 
  : '/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);