/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  registerWithCode: (data: {
    name: string;
    email: string;
    password: string;
    code: string;
    politicalParty?: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: any;
    phone?: string;
    commissionId?: string;
  }) => Promise<any>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cmj_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('cmj_token');
      if (storedToken) {
        try {
          const { user } = await api.getMe();
          setUser(user);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          localStorage.removeItem('cmj_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('cmj_token', res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithCode = async (data: {
    name: string;
    email: string;
    password: string;
    code: string;
    politicalParty?: string;
    bio?: string;
    photoUrl?: string;
    socialLinks?: any;
    phone?: string;
    commissionId?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await api.registerWithCode(data);
      localStorage.setItem('cmj_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cmj_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const { user } = await api.getMe();
      setUser(user);
    } catch (e) {
      logout();
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true; // Admin has super access
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, registerWithCode, logout, refreshUser, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
