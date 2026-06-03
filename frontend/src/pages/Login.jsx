import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, Handshake, TrendingUp, Briefcase, Shield, Lock as LockIcon, ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is already logged in and redirect to their portal
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        const base = process.env.REACT_APP_DASHBOARD_OS_URL || '';
        const roleRoutes = {
          'CLIENT':     `${base}/portal/client`,
          'PARTNER':    `${base}/portal/partner`,
          'INVESTOR':   `${base}/portal/investor`,
          'JOB_SEEKER': `${base}/portal/careers`,
          'ADMIN':      `${base}/os/kimmp`,
        };
        const dest = roleRoutes[user.role];
        if (dest) {
          const hash = base
            ? `#_t=${encodeURIComponent(token)}&_u=${encodeURIComponent(userString)}`
            : '';
          window.location.replace(dest + hash);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const accessTypes = [
    { 
      id: 'client', 
      name: 'Client Access', 
      icon: Building2, 
      description: 'For enterprise customers & stakeholders',
      microtext: 'Access is restricted to authorized client stakeholders',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-brand-blue',
      borderColor: 'border-brand-blue',
      hoverBg: 'hover:bg-blue-50'
    },
    { 
      id: 'partner', 
      name: 'Partner Access', 
      icon: Handshake, 
      description: 'For technology & delivery partners',
      microtext: 'Partner access is granted by Kangqore',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      hoverBg: 'hover:bg-emerald-50'
    },
    { 
      id: 'investor', 
      name: 'Investor Access', 
      icon: TrendingUp, 
      description: 'For shareholders & board members',
      microtext: 'Investor access is read-only and governed',
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      hoverBg: 'hover:bg-amber-50'
    },
    { 
      id: 'job_seeker', 
      name: 'Job Seeker', 
      icon: Briefcase, 
      description: 'For candidates and applicants',
      microtext: 'Use the email you applied with',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-500',
      hoverBg: 'hover:bg-purple-50'
    },
    { 
      id: 'admin', 
      name: 'Admin', 
      icon: Shield, 
      description: 'Internal Kangqore access',
      microtext: 'Internal access only. Activity is logged',
      color: 'red',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      borderColor: 'border-red-500',
      hoverBg: 'hover:bg-red-50'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role: role.id });
    setError('');
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setFormData({ email: '', password: '', role: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse parse login response:', text);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        // Handle Node.js backend error format (data.error.message) 
        // fallback to FastAPI format (data.detail) or generic text
        const errorMessage = data?.error?.message || data?.detail || 'Login failed';
        throw new Error(errorMessage);
      }

      // Store token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to kangqore-view based on role.
      // In dev (different ports) thread token + user through the URL hash so
      // kangqore-view's auth store can read them across the port boundary.
      const base = process.env.REACT_APP_DASHBOARD_OS_URL || '';
      const roleRoutes = {
        'client':     `${base}/portal/client`,
        'partner':    `${base}/portal/partner`,
        'investor':   `${base}/portal/investor`,
        'job_seeker': `${base}/portal/careers`,
        'admin':      `${base}/os/kimmp`,
      };

      const userRole = data.user.role.toLowerCase();
      const dest = roleRoutes[userRole] || `${base}/os/kimmp`;

      // Append hash handoff only when crossing ports (dev). In prod base is
      // empty so same-origin localStorage is already shared — no hash needed.
      const hash = base
        ? `#_t=${encodeURIComponent(data.token)}&_u=${encodeURIComponent(JSON.stringify(data.user))}`
        : '';
      window.location.href = dest + hash;
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col">
      {/* Global Navbar */}
      <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          
          {/* Role Selection View */}
          {!selectedRole ? (
            <div className="space-y-10">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Sign in to Kangqore</h1>
                <p className="text-gray-500 text-lg">Access is role-based. Select your access type to continue.</p>
              </div>

              {/* Access Type Cards - 2x2 Grid on Desktop, Stacked on Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {/* Client Access Tile */}
                <button
                  onClick={() => handleRoleSelect(accessTypes.find(t => t.id === 'client'))}
                  className="group bg-[#2563EB] text-white rounded-xl p-6 text-left shadow-[0px_10px_22px_rgba(0,0,0,0.12)] hover:shadow-[0px_14px_28px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 h-[120px] flex items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Building2 className="w-8 h-8 text-white flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold mb-0.5">Client Access</h3>
                        <p className="text-white/75 text-sm">Enterprise customers & stakeholders</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Partner Access Tile */}
                <button
                  onClick={() => handleRoleSelect(accessTypes.find(t => t.id === 'partner'))}
                  className="group bg-[#059669] text-white rounded-xl p-6 text-left shadow-[0px_10px_22px_rgba(0,0,0,0.12)] hover:shadow-[0px_14px_28px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 h-[120px] flex items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Handshake className="w-8 h-8 text-white flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold mb-0.5">Partner Access</h3>
                        <p className="text-white/75 text-sm">Technology & delivery partners</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Investor Access Tile */}
                <button
                  onClick={() => handleRoleSelect(accessTypes.find(t => t.id === 'investor'))}
                  className="group bg-[#D97706] text-white rounded-xl p-6 text-left shadow-[0px_10px_22px_rgba(0,0,0,0.12)] hover:shadow-[0px_14px_28px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 h-[120px] flex items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <TrendingUp className="w-8 h-8 text-white flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold mb-0.5">Investor Access</h3>
                        <p className="text-white/75 text-sm">Shareholders & board members</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Job Seeker Tile */}
                <button
                  onClick={() => handleRoleSelect(accessTypes.find(t => t.id === 'job_seeker'))}
                  className="group bg-[#7C3AED] text-white rounded-xl p-6 text-left shadow-[0px_10px_22px_rgba(0,0,0,0.12)] hover:shadow-[0px_14px_28px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300 h-[120px] flex items-center"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Briefcase className="w-8 h-8 text-white flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-bold mb-0.5">Job Seeker</h3>
                        <p className="text-white/75 text-sm">Candidates & applicants</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>



              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <LockIcon className="w-4 h-4" />
                <span>Secure, role-based access. All actions are audited.</span>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-brand-blue hover:text-blue-700 font-semibold">
                    Sign up now
                  </Link>
                </p>
              </div>

              {/* Admin Login & Compliance - Right Bottom */}
              <div className="flex items-center justify-between pt-6">
                {/* Compliance Badges */}
                <div className="flex items-center gap-3 text-gray-400 text-xs">
                  <span>SOC2</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Audit Logs</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>Encryption</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>SSO</span>
                </div>

                {/* Admin Link - Right aligned */}
                <button
                  onClick={() => handleRoleSelect(accessTypes.find(t => t.id === 'admin'))}
                  className="text-gray-500 text-xs font-medium hover:text-gray-700 dark:text-gray-300 hover:underline transition-colors inline-flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Login
                </button>
              </div>
            </div>
          ) : (
            /* Login Form View */
            <div className="max-w-md mx-auto space-y-8">
              {/* Back Button */}
              <button
                onClick={handleBackToRoles}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to access types</span>
              </button>

              {/* Selected Role Card */}
              <div className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border-2 ${selectedRole.borderColor} shadow-sm`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${selectedRole.bgColor} rounded-xl flex items-center justify-center`}>
                    <selectedRole.icon className={`w-6 h-6 ${selectedRole.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRole.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedRole.description}</p>
                  </div>
                  <CheckCircle className={`w-6 h-6 ${selectedRole.iconColor} ml-auto`} />
                </div>
              </div>

              {/* Login Form */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h3>
                <p className="text-gray-500 text-sm mb-6">{selectedRole.microtext}</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Social Login Options */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/oauth/google?role=${selectedRole.id.toUpperCase()}`}
                    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-700 dark:text-gray-300 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-all font-sans"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Sign in with Google
                  </button>
                  
                  <button
                    onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/oauth/linkedin?role=${selectedRole.id.toUpperCase()}`}
                    className="w-full flex items-center justify-center gap-3 bg-[#0A66C2] text-white py-3 border border-transparent rounded-xl font-medium hover:bg-[#004182] transition-all font-sans"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    Sign in with LinkedIn
                  </button>

                  <button
                    onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/oauth/apple?role=${selectedRole.id.toUpperCase()}`}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 border border-transparent rounded-xl font-medium hover:bg-gray-800 transition-all font-sans"
                  >
                     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.69-.74 1.55.19 2.58.91 3.25 1.91-2.9 1.83-2.39 5.56.55 6.78-.65 1.66-1.55 3.32-2.57 4.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    Sign in with Apple
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-black text-gray-500">Or continue with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-sm text-brand-blue hover:text-blue-700 font-medium">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-brand-blue hover:text-blue-700 font-semibold">
                      Sign up now
                    </Link>
                  </p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                <LockIcon className="w-4 h-4" />
                <span>Secure, role-based access. All actions are audited.</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Login;
