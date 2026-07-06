export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'ADMIN' | 'CLIENT';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  visitorUuid?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
  role?: 'ADMIN' | 'CLIENT' | 'PARTNER' | 'INVESTOR' | 'JOB_SEEKER';
  visitorUuid?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
