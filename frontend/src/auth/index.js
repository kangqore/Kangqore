/**
 * Auth Module (Frontend)
 * 
 * Centralized authentication utilities and components
 */

// Re-export from context
export { AuthProvider, useAuth } from '../context/AuthContext';

// Auth-related utilities
export const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'));
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const getUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const user = getUser();
  return user?.role || null;
};

export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};

export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};

// Role constants
export const ROLES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  PARTNER: 'PARTNER',
  INVESTOR: 'INVESTOR',
  JOB_SEEKER: 'JOB_SEEKER',
  VISITOR: 'VISITOR'
};

// Dashboard paths by role
export const DASHBOARD_PATHS = {
  ADMIN:      '/kangqore-view/admin',
  CLIENT:     '/kangqore-view/client',
  PARTNER:    '/kangqore-view/partner',
  INVESTOR:   '/kangqore-view/investor',
  JOB_SEEKER: '/kangqore-view/careers',
};

export const getDashboardPath = (role) => {
  return DASHBOARD_PATHS[role] || '/';
};
