import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = useCallback(async (username, email, password, firstName, lastName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/auth/signup`, {
        username,
        email,
        password,
        firstName,
        lastName,
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  const getCurrentUser = useCallback(async () => {
    if (!token) return null;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      return response.data.user;
    } catch (err) {
      console.error('Failed to get current user:', err);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
    getCurrentUser,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
