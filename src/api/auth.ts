import { apiClient } from './client';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AuthResponse = await apiClient.post<AuthResponse>('/auth/login', credentials, {}, false);
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AuthResponse = await apiClient.post<AuthResponse>('/auth/register', data, {}, false);
      return response;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('auth_token') !== null;
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  }
}

export const authService = new AuthService();

