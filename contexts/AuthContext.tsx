'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { UserType, AuthResponse, UserResponse } from '@/types';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerCandidate: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  registerCompany: (email: string, password: string, companyName: string, industry: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get<UserResponse>('/auth/me');
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch {
      // Not authenticated
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });

    if (response.success && response.data) {
      api.setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresAt);
      await checkAuth();

      // Redirect based on user type
      if (response.data.userType === UserType.Candidate) {
        router.push('/candidate/dashboard');
      } else if (response.data.userType === UserType.Company) {
        router.push('/company/dashboard');
      } else if (response.data.userType === UserType.Admin) {
        router.push('/admin/dashboard');
      }

      return { success: true };
    }

    return { success: false, error: response.error || 'Login failed' };
  };

  const registerCandidate = async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await api.post<AuthResponse>('/auth/register/candidate', {
      email,
      password,
      firstName,
      lastName
    });

    if (response.success && response.data) {
      api.setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresAt);
      await checkAuth();
      router.push('/candidate/onboard');
      return { success: true };
    }

    return { success: false, error: response.error || 'Registration failed' };
  };

  const registerCompany = async (email: string, password: string, companyName: string, industry: string) => {
    const response = await api.post<AuthResponse>('/auth/register/company', {
      email,
      password,
      companyName,
      industry
    });

    if (response.success && response.data) {
      api.setTokens(response.data.accessToken, response.data.refreshToken, response.data.expiresAt);
      await checkAuth();
      router.push('/company/dashboard');
      return { success: true };
    }

    return { success: false, error: response.error || 'Registration failed' };
  };

  const logout = () => {
    api.clearTokens();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        registerCandidate,
        registerCompany,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
