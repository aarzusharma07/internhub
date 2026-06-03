'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiLogin, apiRegister, apiGetMe } from '@/lib/api';

interface User { id: string; name: string; email: string; role: 'student' | 'recruiter' | 'admin'; status: string; }
interface AuthContextType {
  user: User | null; loading: boolean; login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: Record<string, string>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void; demoLogin: (role: 'student' | 'recruiter' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('imp_token');
    const savedUser = localStorage.getItem('imp_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      apiGetMe().then(data => { if (data?.success) { setUser(data.user); localStorage.setItem('imp_user', JSON.stringify(data.user)); } });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    if (data?.success) {
      localStorage.setItem('imp_token', data.token);
      localStorage.setItem('imp_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data?.message || 'Login failed' };
  };

  const register = async (body: Record<string, string>) => {
    const data = await apiRegister(body);
    if (data?.success) {
      localStorage.setItem('imp_token', data.token);
      localStorage.setItem('imp_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    }
    return { success: false, message: data?.message || 'Registration failed' };
  };

  // Demo login — instantly logs in as any role using mock data
  const demoLogin = (role: 'student' | 'recruiter' | 'admin') => {
    const demoUsers: Record<string, User> = {
      student: { id: 'demo-student', name: 'Priya Sharma (Demo)', email: 'priya@demo.com', role: 'student', status: 'active' },
      recruiter: { id: 'demo-recruiter', name: 'TechNova HR (Demo)', email: 'hr@demo.com', role: 'recruiter', status: 'active' },
      admin: { id: 'demo-admin', name: 'Platform Admin (Demo)', email: 'admin@demo.com', role: 'admin', status: 'active' },
    };
    const u = demoUsers[role];
    localStorage.setItem('imp_token', `demo_token_${role}`);
    localStorage.setItem('imp_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('imp_token');
    localStorage.removeItem('imp_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
