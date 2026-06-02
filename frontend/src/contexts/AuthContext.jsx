import React, { createContext, useState, useEffect, useCallback } from 'react';
import { api } from '../config/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('recipe_hub_token') || null;
    } catch (e) {
      console.warn('recipe_hub localStorage is restricted:', e.message);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch the authenticated user's profile statistics from the backend
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response?.data?.error || error.message);
      // If unauthorized, log out automatically
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync token to Axios default headers and localStorage safely
  useEffect(() => {
    try {
      if (token) {
        try {
          localStorage.setItem('recipe_hub_token', token);
        } catch (e) {
          console.warn('Failed to set localStorage token:', e.message);
        }

        // Extremely safe header allocation to prevent undefined exceptions
        if (api.defaults.headers) {
          api.defaults.headers.common = api.defaults.headers.common || {};
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        fetchProfile();
      } else {
        try {
          localStorage.removeItem('recipe_hub_token');
        } catch (e) {
          console.warn('Failed to clear localStorage token:', e.message);
        }

        if (api.defaults.headers && api.defaults.headers.common) {
          delete api.defaults.headers.common['Authorization'];
        }
        setUser(null);
        setLoading(false);
      }
    } catch (err) {
      console.error('useAuth useEffect error:', err.message);
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchProfile]);

  // Sign in action
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Login failed. Please verify credentials.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Register action
  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/signup', { username, email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Registration failed. Please check inputs.';
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout action
  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('recipe_hub_token');
      localStorage.removeItem('recipe_hub_bookmarks');
    } catch (e) {
      console.warn('Failed to clear localStorage on logout:', e.message);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    refreshProfile: fetchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
