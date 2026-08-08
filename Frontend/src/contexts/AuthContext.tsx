import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService, User, LoginResponse } from '../services/authService';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone_number: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone_number: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on startup
  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
        const userData = await SecureStore.getItemAsync('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  // Handle unauthorized responses globally
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await handleLogout();
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  const handleLoginSuccess = async (data: LoginResponse) => {
    await SecureStore.setItemAsync('access_token', data.accessToken);
    await SecureStore.setItemAsync('refresh_token', data.refreshToken);
    
    // Fetch user details since backend login only returns tokens
    const userProfile = await authService.getUserProfile(data.accessToken);
    
    await SecureStore.setItemAsync('user', JSON.stringify(userProfile));
    setUser(userProfile);
  };

  const login = async (phone_number: string, password: string) => {
    const data = await authService.login(phone_number, password);
    await handleLoginSuccess(data);
  };

  const register = async (userData: { name: string; email: string; password: string; phone_number: string }) => {
    await authService.register(userData);
    // Backend doesn't auto-login on register, it just returns a message.
    // So we manually log them in afterward using the provided credentials.
    await login(userData.phone_number, userData.password);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    await SecureStore.deleteItemAsync('user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        const userProfile = await authService.getUserProfile(token);
        await SecureStore.setItemAsync('user', JSON.stringify(userProfile));
        setUser(userProfile);
      }
    } catch (e) {
      console.error('Failed to refresh profile:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout: handleLogout, refreshProfile }}>
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
