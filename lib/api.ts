import { ApiResponse, AuthResponse } from '@/types';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = Cookies.get('accessToken') || null;
      this.refreshToken = Cookies.get('refreshToken') || null;
    }
  }

  setTokens(accessToken: string, refreshToken: string, expiresAt: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    const expiresDate = new Date(expiresAt);
    Cookies.set('accessToken', accessToken, { expires: expiresDate, sameSite: 'lax' });
    Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: 'lax' });
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (!response.ok) return false;

      const result: ApiResponse<AuthResponse> = await response.json();
      if (result.success && result.data) {
        this.setTokens(result.data.accessToken, result.data.refreshToken, result.data.expiresAt);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, { ...options, headers });

      // If unauthorized, try to refresh token
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, { ...options, headers });
        }
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {};

    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData
      });

      // If unauthorized, try to refresh token
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          (headers as Record<string, string>)['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
          });
        }
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}

export const api = new ApiClient();
export default api;
