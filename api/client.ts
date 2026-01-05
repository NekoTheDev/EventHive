import axios from 'axios';

// Use a relative path for the baseURL.
// This allows the browser to resolve the origin automatically and ensures
// that MSW can intercept requests reliably without origin mismatch issues.
export const apiClient = axios.create({
  baseURL: '/api',
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