"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'analyst' | 'admin';
  avatar?: string;
  investorProfile?: {
    riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
    preferredSectors: string[];
    ticketSizeRange: { min: number; max: number };
    esgRequired: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  demoLogin: () => Promise<boolean>;
  googleLogin: (email: string, name?: string, avatar?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('vanguard_token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data?.user) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (credentials: any): Promise<boolean> => {
    setError(null);
    try {
      const response = await api.post('/auth/login', credentials);
      const { token: newToken, user: newUser } = response.data;
      if (typeof window !== 'undefined') localStorage.setItem('vanguard_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    }
  };

  const register = async (data: any): Promise<boolean> => {
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      const { token: newToken, user: newUser } = response.data;
      if (typeof window !== 'undefined') localStorage.setItem('vanguard_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
      return false;
    }
  };

  const demoLogin = async (): Promise<boolean> => {
    setError(null);
    try {
      const response = await api.post('/auth/demo-login');
      const { token: newToken, user: newUser } = response.data;
      if (typeof window !== 'undefined') localStorage.setItem('vanguard_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (err: any) {
      setError('Demo login temporarily unavailable.');
      return false;
    }
  };

  const googleLogin = async (email: string, name?: string, avatar?: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await api.post('/auth/google-login', { email, name, avatar });
      const { token: newToken, user: newUser } = response.data;
      if (typeof window !== 'undefined') localStorage.setItem('vanguard_token', newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (err: any) {
      setError('Google authentication error.');
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('vanguard_token');
    setToken(null);
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        demoLogin,
        googleLogin,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};