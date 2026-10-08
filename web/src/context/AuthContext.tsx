'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  api,
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  ApiError,
} from '@/lib/api';
import { User } from '@/types';

export type { User };

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setStoredToken(null);
    setStoredUser(null);
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) {
      setUser(null);
      setToken(null);
      return;
    }

    try {
      const profile = await api.get<User>('/auth/profile', { token: currentToken });
      setUser(profile);
      setStoredUser(profile);
      setToken(currentToken);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        logout();
      }
    }
  }, [logout]);

  // Khởi tạo trạng thái auth từ localStorage và kiểm tra token với server
  useEffect(() => {
    const initialToken = getStoredToken();
    const initialUser = getStoredUser();

    if (initialToken) {
      setToken(initialToken);
      if (initialUser) {
        setUser(initialUser);
      }
      refreshProfile().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshProfile, logout]);

  const login = async (email: string, pass: string) => {
    const data = await api.post<{ access_token: string; user: User }>('/auth/login', {
      email,
      password: pass,
    });

    setStoredToken(data.access_token);
    setStoredUser(data.user);
    setToken(data.access_token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, pass: string) => {
    const data = await api.post<{ access_token: string; user: User }>('/auth/register', {
      name,
      email,
      password: pass,
    });

    setStoredToken(data.access_token);
    setStoredUser(data.user);
    setToken(data.access_token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
}
