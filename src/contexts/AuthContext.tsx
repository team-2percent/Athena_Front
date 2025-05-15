"use client";

import React, { createContext, useContext, useCallback, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  role: "ADMIN" | "USER" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<"ADMIN" | "USER" | null>(null);
  
  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      return !!accessToken && !!refreshToken;
    }
    return false;
  }, []);

  const login = (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      const { role } = jwtDecode<{ role: "ADMIN" | "USER" }>(accessToken);
      setRole(role as "ADMIN" | "USER");
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ login, logout, checkAuth, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
