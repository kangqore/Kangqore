
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // We might need to manually set token if login() expects credentials

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      navigate(`/login?error=${error}`);
      return;
    }

    const processLogin = async () => {
      if (token) {
        localStorage.setItem('token', token);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

        try {
          // Fetch user details to populate localStorage and Context
          // We need to decode the token or fetch from API. Fetching is safer.
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || ''}/api/profile/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            // Ensure we save the full user object as AuthContext expects
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Now redirect based on role
            const userRole = (searchParams.get('role') || data.user.role || 'CLIENT').toUpperCase();
            
            // Role to dashboard path mapping
            const roleRoutes = {
              'CLIENT': '/dashboard/client',
              'PARTNER': '/dashboard/partner',
              'INVESTOR': '/dashboard/investor',
              'JOB_SEEKER': '/dashboard/careers',
              'ADMIN': '/dashboard/admin'
            };
            
            const targetPath = roleRoutes[userRole] || '/dashboard/client';
            window.location.href = targetPath;
          } else {
            console.error('Failed to fetch user profile');
            navigate('/login?error=profile_fetch_failed');
          }
        } catch (error) {
          console.error('Error in AuthCallback:', error);
          navigate('/login?error=callback_error');
        }
      } else {
        navigate('/login');
      }
    };

    processLogin();

  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Authenticating...</h2>
        <p className="text-gray-500">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
