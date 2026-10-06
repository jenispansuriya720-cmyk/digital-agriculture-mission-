import axios from 'axios';

/**
 * Resolves the API base URL.
 * Automatically guarantees the URL ends with '/api' without double '/api/api' or trailing slashes.
 * Works seamlessly whether VITE_API_URL is configured as:
 * - https://YOUR-RENDER-BACKEND.onrender.com/api
 * - https://YOUR-RENDER-BACKEND.onrender.com
 * - /api (default for local Vite proxy)
 */
const resolveBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || !envUrl.trim()) {
    return '/api';
  }

  // Strip trailing slashes
  const trimmed = envUrl.trim().replace(/\/+$/, '');

  // If already ending with /api, return it
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  // If user passed root domain (e.g. https://YOUR-RENDER-BACKEND.onrender.com), append /api
  return `${trimmed}/api`;
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('krishi_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401 response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('krishi_token');
        localStorage.removeItem('krishi_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
