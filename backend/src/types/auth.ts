export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'ADMIN' | 'CLIENT' | 'TEAM';
  deptId?: string;
  departmentSlug?: string;
  isDepartmentLead?: boolean;
  isDepartmentHr?: boolean;
  teamCategory?: string;
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
  role?: 'ADMIN' | 'CLIENT' | 'PARTNER' | 'INVESTOR' | 'JOB_SEEKER' | 'JOURNALIST' | 'ANALYST' | 'VISITOR' | 'TEAM' | 'EXECUTIVE';
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
  deptId?: string;
  departmentSlug?: string;
  isDepartmentLead?: boolean;
  isDepartmentHr?: boolean;
  teamCategory?: string;
  iat?: number;
  exp?: number;
}
