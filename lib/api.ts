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
    console.log('[API] setTokens called, token length:', accessToken?.length, 'expiresAt:', expiresAt);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    // Parse expiration date, fallback to 1 day if invalid
    let expiresDate = new Date(expiresAt);
    if (isNaN(expiresDate.getTime())) {
      console.warn('[API] Invalid expiresAt date, using 1 day fallback');
      expiresDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    // Set cookies with path to ensure they're available on all routes
    Cookies.set('accessToken', accessToken, { expires: expiresDate, sameSite: 'lax', path: '/' });
    Cookies.set('refreshToken', refreshToken, { expires: 7, sameSite: 'lax', path: '/' });

    // Verify cookie was set
    const verifyToken = Cookies.get('accessToken');
    console.log('[API] Cookie verification - token set:', !!verifyToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
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

  private getAccessToken(): string | null {
    // Always read fresh from cookies on client to ensure we have the latest token
    // This handles SSR hydration, module reloads, and cross-tab token updates
    if (typeof window !== 'undefined') {
      const cookieToken = Cookies.get('accessToken');
      console.log('[API] getAccessToken - cookie token exists:', !!cookieToken, 'in-memory token exists:', !!this.accessToken);
      if (cookieToken) {
        this.accessToken = cookieToken;
        this.refreshToken = Cookies.get('refreshToken') || null;
      } else if (this.accessToken) {
        // Cookie was cleared but in-memory token exists - clear it
        console.log('[API] Cookie cleared, clearing in-memory token');
        this.accessToken = null;
        this.refreshToken = null;
      }
    }
    return this.accessToken;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAccessToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    console.log('[API] Request to', endpoint, '- Auth header set:', !!token);

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

      // Handle empty responses (204 No Content, etc.)
      const text = await response.text();
      if (!text) {
        if (response.ok) {
          return { success: true, data: null as T };
        }
        return { success: false, error: `Request failed with status ${response.status}` };
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        return { success: false, error: 'Invalid JSON response from server' };
      }

      // Handle both wrapped { success, data } and unwrapped responses
      if (result.success !== undefined) {
        // Normalize error field - backend may return 'message' instead of 'error'
        if (!result.success && !result.error && result.message) {
          result.error = result.message;
        }
        return result;
      }

      // If the response is the data directly (no success wrapper)
      if (response.ok) {
        return { success: true, data: result as T };
      }

      // Error response
      return {
        success: false,
        error: result.message || result.error || `Request failed with status ${response.status}`
      };
    } catch (error) {
      console.error('API request error:', error);
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
    const token = this.getAccessToken();

    const headers: HeadersInit = {};

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
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

      // Handle empty responses (204 No Content, etc.)
      const text = await response.text();
      if (!text) {
        if (response.ok) {
          return { success: true, data: null as T };
        }
        return { success: false, error: `Request failed with status ${response.status}` };
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        return { success: false, error: 'Invalid JSON response from server' };
      }

      // Handle both wrapped { success, data } and unwrapped responses
      if (result.success !== undefined) {
        // Normalize error field - backend may return 'message' instead of 'error'
        if (!result.success && !result.error && result.message) {
          result.error = result.message;
        }
        return result;
      }

      if (response.ok) {
        return { success: true, data: result as T };
      }

      return {
        success: false,
        error: result.message || result.error || `Request failed with status ${response.status}`
      };
    } catch (error) {
      console.error('API upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}

export const api = new ApiClient();
export default api;
