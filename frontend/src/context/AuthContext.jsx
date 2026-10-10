import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authApi';
import { getToken, setToken, removeToken } from '../utils/storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeAuth = async () => {
    const token = getToken();
    if (token) {
      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization failed', error);
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeAuth();

    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      removeToken();
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    setToken(res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    setToken(res.data.token);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res;
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
