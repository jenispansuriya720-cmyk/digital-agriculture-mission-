import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { emailOrMobile: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('krishi_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('krishi_token') || null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('krishi_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('krishi_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { emailOrMobile: string; password: string }) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setUser(res.data);
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('krishi_token', res.data.token);
      }
      localStorage.setItem('krishi_user', JSON.stringify(res.data));
    }
  };

  const register = async (userData: any) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      setUser(res.data);
      if (res.data.token) {
        setToken(res.data.token);
        localStorage.setItem('krishi_token', res.data.token);
      }
      localStorage.setItem('krishi_user', JSON.stringify(res.data));
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    const res = await authService.updateProfile(profileData);
    if (res.success && res.data) {
      setUser(prev => ({ ...prev, ...res.data }));
      localStorage.setItem('krishi_user', JSON.stringify({ ...user, ...res.data }));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('krishi_token');
    localStorage.removeItem('krishi_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
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
