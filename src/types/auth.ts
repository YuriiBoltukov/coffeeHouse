export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  password: string;
  confirmPassword: string;
  city: string;
  street: string;
  houseNumber: number;
  paymentMethod: 'cash' | 'card';
}

export interface AuthResponse {
  message: string;
  data?: {
    access_token: string;
    user: {
      id: number;
      login: string;
      city: string;
      street: string;
      houseNumber: number;
      paymentMethod: string;
      createdAt: string;
    };
  };
}

