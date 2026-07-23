import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getVisitorUuid } from '../hooks/useVisitorIdentity';

const AuthContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // If we have local data, show it first for responsiveness
      if (userData && userData !== 'undefined') {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }

      // Always fetch latest data from backend to sync state
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${API}/auth/me`);
          const latestUser = response.data.user;
          setUser(latestUser);
          localStorage.setItem('user', JSON.stringify(latestUser));
        } catch (e) {
          console.error('Failed to refresh user data:', e);
          if (e.response && e.response.status === 401) {
            logout();
          }
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Re-validate user on location change to prevent phantom logout
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData && userData !== 'undefined' && !user) {
      try {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('Failed to restore user on navigation:', e);
      }
    }
  }, [location, user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      const vUuid = getVisitorUuid()
      if (vUuid && user?.id) {
        axios.post(`${API}/public/visitor/stitch`, { visitorUuid: vUuid, userId: user.id }).catch(() => {})
      }
      return { success: true };
    } catch (error) {
       // If backend is unreachable or DB is down
       if (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500)) {
           console.warn('Backend unavailable.');
           return {
             success: false,
             error: 'The service is temporarily unavailable. Please try again in a moment.',
             isNetworkError: true
            };
       }

      return {
        success: false, 
        error: error.response?.data?.error?.message || error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (name, email, password, company) => {
    try {
      const response = await axios.post(`${API}/auth/signup`, { 
        name, 
        email, 
        password, 
        company 
      });
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      const vUuid = getVisitorUuid()
      if (vUuid && user?.id) {
        axios.post(`${API}/public/visitor/stitch`, { visitorUuid: vUuid, userId: user.id }).catch(() => {})
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user data (e.g., after avatar change)
  const updateUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
