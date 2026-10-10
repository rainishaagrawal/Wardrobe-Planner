import axios from 'axios';
import { getToken, removeToken } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // Preserve the backend's uniform response structure
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and let the app handle redirection
      removeToken();
      // Only reload or broadcast event if needed. We'll let AuthContext handle state if possible,
      // but an event or reload works as a catch-all for deeply nested invalid calls.
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'An unexpected error occurred. Please try again.';
};

export default api;
