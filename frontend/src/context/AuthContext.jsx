import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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
      if (userData) {
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
    
    if (token && userData && !user) {
      try {
        setUser(JSON.parse(userData));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('Failed to restore user on navigation:', e);
      }
    }
  }, [location, user]);

  // DEMO MODE: Bypass backend if DB is down
  const enableDemoMode = (role = 'client') => {
    const demoUser = {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@kangqore.com',
      role: role.toUpperCase(),
      company: 'Demo Corp',
      avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
    };
    
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
    setUser(demoUser);
    return { success: true };
  };

  const login = async (email, password) => {
    // Secret backdoor for demo
    if (email.startsWith('demo') && password === 'demo') {
        const role = email.includes('admin') ? 'admin' : 
                     email.includes('partner') ? 'partner' : 
                     email.includes('investor') ? 'investor' : 
                     email.includes('career') ? 'job_seeker' : 'client';
        return enableDemoMode(role);
    }

    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { token, refreshToken, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return { success: true };
    } catch (error) {
       // If backend is unreachable or DB is down
       if (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500)) {
           console.warn('Backend unavailable, suggesting demo mode.');
           return { 
             success: false, 
             error: 'Database unavailable. Use email "demo@kangqore.com" and password "demo" to enter Offline Mode.',
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
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateUser, enableDemoMode }}>
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
