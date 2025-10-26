import { ApiConfig, ApiError, FetchOptions } from '../types';
import { appConfig } from './config';

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async fetchWithTimeout(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const { timeout = 10000, ...fetchOptions } = options;

    const controller: AbortController = new AbortController();
    const timeoutId: number = window.setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      const response: Response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async handleResponse<T>(response: Response, unwrapData: boolean = true): Promise<T> {
    if (!response.ok) {
      let errorMessage: string = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData === 'object') {
          errorMessage = errorData.message || errorData.error || errorMessage;
        }
      } catch {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      
      const error: ApiError = {
        message: errorMessage,
        status: response.status
      };
      throw error;
    }

    const data = await response.json();
    
    // Handle wrapped API responses { data: [...] }
    // For auth endpoints, we want to keep the full response structure
    if (unwrapData && data && typeof data === 'object' && 'data' in data) {
      return data.data;
    }
    
    return data;
  }

  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url: string = `${this.config.baseUrl}${endpoint}`;
    
    try {
      const response: Response = await this.fetchWithTimeout(url, {
        ...options,
        method: 'GET'
      });
      return await this.handleResponse<T>(response, true);
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0
        } as ApiError;
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: unknown, options: FetchOptions = {}, unwrapData: boolean = true): Promise<T> {
    const url: string = `${this.config.baseUrl}${endpoint}`;
    
    try {
      const response: Response = await this.fetchWithTimeout(url, {
        ...options,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: JSON.stringify(data)
      });
      return await this.handleResponse<T>(response, unwrapData);
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0
        } as ApiError;
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient({
  baseUrl: appConfig.apiBaseUrl,
  timeout: 10000
});

