import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Building2, Handshake, TrendingUp,
  Briefcase, Shield, ArrowLeft, CheckCircle,
  User, Phone, Building, Clock, ArrowRight, ChevronRight,
} from 'lucide-react';
import VisualBackground from '../components/VisualBackground';

const OS_URL = import.meta.env.VITE_DASHBOARD_OS_URL || '';

function buildOSRedirect(path) {
  if (!OS_URL) return path;
  try {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      const params = new URLSearchParams();
      params.set('_t', token);
      params.set('_u', user);
      return `${OS_URL}${path}#${params.toString()}`;
    }
  } catch { /* ignore */ }
  return `${OS_URL}${path}`;
}

const ACCESS_TYPES = [
  {
    id: 'client',
    name: 'Client Access',
    icon: Building2,
    description: 'Enterprise customers & stakeholders',
    microtext: 'Access is restricted to authorized client stakeholders',
    hex: '#2564EA',
    glow: 'rgba(37,100,234,0.18)',
  },
  {
    id: 'partner',
    name: 'Partner Access',
    icon: Handshake,
    description: 'Technology & delivery partners',
    microtext: 'Partner access is granted by Kangqore',
    hex: '#10B981',
    glow: 'rgba(16,185,129,0.18)',
  },
  {
    id: 'investor',
    name: 'Investor Access',
    icon: TrendingUp,
    description: 'Shareholders & board members',
    microtext: 'Investor access is read-only and governed',
    hex: '#F59E0B',
    glow: 'rgba(245,158,11,0.18)',
  },
  {
    id: 'job_seeker',
    name: 'Job Seeker',
    icon: Briefcase,
    description: 'Candidates & applicants',
    microtext: 'Use the email you applied with',
    hex: '#8B5CF6',
    glow: 'rgba(139,92,246,0.18)',
  },
];

const ADMIN_TYPE = {
  id: 'admin',
  name: 'Admin',
  icon: Shield,
  description: 'Internal Kangqore access',
  microtext: 'Internal access only. Activity is logged',
  hex: '#EF4444',
  glow: 'rgba(239,68,68,0.18)',
};

export default function Login() {
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedRole,    setSelectedRole]    = useState(null);
  const [formData,        setFormData]        = useState({ email: '', password: '', role: '' });
  const [showPassword,    setShowPassword]    = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [signupMode,      setSignupMode]      = useState(searchParams.get('mode') === 'signup');
  const [signupData,      setSignupData]      = useState({ name: '', email: '', company: '', phone: '', password: '', confirmPassword: '' });
  const [signupLoading,   setSignupLoading]   = useState(false);
  const [signupError,     setSignupError]     = useState('');
  const [signupSuccess,   setSignupSuccess]   = useState(false);

  useEffect(() => {
    const token      = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        const roleRoutes = {
          'CLIENT':     '/portal/client',
          'PARTNER':    '/portal/partner',
          'INVESTOR':   '/portal/investor',
          'JOB_SEEKER': '/portal/careers',
          'ADMIN':      '/os/kimmp',
        };
        const dest = roleRoutes[user.role];
        if (dest) window.location.replace(buildOSRedirect(dest));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role: role.id });
    setError('');
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setFormData({ email: '', password: '', role: '' });
    setError('');
    setSignupData({ name: '', email: '', company: '', phone: '', password: '', confirmPassword: '' });
    setSignupError('');
    setSignupSuccess(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (signupData.password !== signupData.confirmPassword) { setSignupError('Passwords do not match'); return; }
    if (signupData.password.length < 6) { setSignupError('Password must be at least 6 characters'); return; }
    setSignupLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    signupData.email,
          password: signupData.password,
          name:     signupData.name,
          role:     selectedRole.id.toUpperCase(),
          phone:    signupData.phone   || null,
          company:  signupData.company || null,
        }),
      });
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { throw new Error('Server returned an invalid response'); }
      if (!response.ok) throw new Error(data?.error?.message || data?.detail || 'Registration failed');
      setSignupSuccess(true);
    } catch (err) {
      setSignupError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const text = await response.text();
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch { throw new Error('Server returned an invalid response'); }
      if (!response.ok) throw new Error(data?.error?.message || data?.detail || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const roleRoutes = {
        'client':     '/portal/client',
        'partner':    '/portal/partner',
        'investor':   '/portal/investor',
        'job_seeker': '/portal/careers',
        'admin':      '/os/kimmp',
      };
      window.location.href = buildOSRedirect(roleRoutes[data.user.role.toLowerCase()] || '/os/kimmp');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const role = selectedRole;

  return (
    <div
      className="min-h-screen text-white font-sans overflow-x-hidden"
      style={{ backgroundColor: '#000000' }}
    >
      {/* Ambient glow — shifts to role colour once selected */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[600px] blur-[140px] rounded-full pointer-events-none transition-all duration-700"
        style={{ backgroundColor: role ? role.glow : 'rgba(37,100,234,0.12)' }}
      />

      {/* ── Minimal top bar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5">
        <Link to="/" className="text-white font-black text-xl tracking-tight hover:text-white/80 transition-colors">
          Kangqore
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </Link>
      </header>

      {/* ── Main ── */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-8 pb-24">

        {/* ══════════ ROLE SELECTION ══════════ */}
        {!role && (
          <div className="w-full max-w-2xl space-y-10">
            {/* Heading */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                <p className="text-[10px] font-black tracking-[0.25em] text-white/60 uppercase">Secure Portal Access</p>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-[1.1] text-white">
                Sign in to{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">Kangqore</span>
              </h1>
              <p className="text-white/40 text-base font-medium">
                Access is role-based. Select your access type to continue.
              </p>
            </div>

            {/* Role cards — 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ACCESS_TYPES.map((at) => {
                const Icon = at.icon;
                return (
                  <button
                    key={at.id}
                    onClick={() => handleRoleSelect(at)}
                    className="group flex flex-col p-6 border border-white/[0.08] bg-[#06090f] rounded-2xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1 text-left"
                    style={{ boxShadow: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 32px ${at.glow}`}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div
                      className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center mb-4"
                      style={{ backgroundColor: at.hex + '15' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: at.hex }} strokeWidth={1.75} />
                    </div>
                    <div className="w-5 h-0.5 rounded-full mb-3" style={{ backgroundColor: at.hex }} />
                    <p className="text-white font-black text-lg mb-1">{at.name}</p>
                    <p className="text-white/40 text-sm font-medium leading-snug flex-1">{at.description}</p>
                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
                      <span className="text-xs font-bold" style={{ color: at.hex + 'cc' }}>Continue</span>
                      <ChevronRight
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
                        style={{ color: at.hex + 'cc' }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Security footnote + admin */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-white/20 text-xs font-bold tracking-wide">
                {['SOC2', 'Audit Logs', 'Encryption', 'SSO'].map((b, i, arr) => (
                  <React.Fragment key={b}>
                    <span>{b}</span>
                    {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-white/10" />}
                  </React.Fragment>
                ))}
              </div>
              <button
                onClick={() => handleRoleSelect(ADMIN_TYPE)}
                className="inline-flex items-center gap-1.5 text-white/25 hover:text-white/50 text-xs font-bold tracking-wide transition-colors duration-200"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-white/30 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => { setSelectedRole(ACCESS_TYPES[0]); setSignupMode(true); }}
                className="text-white/70 hover:text-white font-semibold transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        )}

        {/* ══════════ FORM VIEW ══════════ */}
        {role && (
          <div className="w-full max-w-md space-y-6">
            {/* Back */}
            <button
              onClick={handleBackToRoles}
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to access types
            </button>

            {/* Role pill */}
            <div
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border"
              style={{ borderColor: role.hex + '30', backgroundColor: role.hex + '0c' }}
            >
              <role.icon className="w-4 h-4" style={{ color: role.hex }} strokeWidth={1.75} />
              <span className="text-sm font-bold" style={{ color: role.hex }}>{role.name}</span>
              <CheckCircle className="w-4 h-4 ml-1" style={{ color: role.hex + 'aa' }} strokeWidth={2} />
            </div>

            {/* Sign In / Create Account toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/[0.08] bg-[#06090f] p-1">
              <button
                onClick={() => { setSignupMode(false); setSignupError(''); }}
                className={`flex-1 py-2.5 text-sm font-black rounded-lg transition-all duration-200 ${
                  !signupMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setSignupMode(true); setError(''); setSignupSuccess(false); }}
                className={`flex-1 py-2.5 text-sm font-black rounded-lg transition-all duration-200 ${
                  signupMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* ── Signup success ── */}
            {signupMode && signupSuccess && (
              <div className="p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: role.hex + '15' }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: role.hex }} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Account Created</h3>
                <p className="text-white/40 text-sm mb-7">Your account is ready. Sign in to access your portal.</p>
                <button
                  onClick={() => { setSignupMode(false); setSignupSuccess(false); setSignupData({ name: '', email: '', company: '', phone: '', password: '', confirmPassword: '' }); }}
                  className="w-full py-4 rounded-xl font-black text-sm text-gray-900 bg-white hover:bg-white/90 transition-colors duration-200"
                >
                  Go to Sign In
                </button>
              </div>
            )}

            {/* ── Signup form ── */}
            {signupMode && !signupSuccess && (
              <div className="p-7 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <h3 className="text-2xl font-black text-white mb-1">Create Your Account</h3>
                <p className="text-white/35 text-sm mb-7">{role.description}</p>

                {signupError && (
                  <div className="mb-6 p-4 border border-red-500/20 bg-red-500/[0.07] rounded-xl">
                    <p className="text-red-400 text-sm font-medium">{signupError}</p>
                  </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  {[
                    { icon: User,     label: 'Full Name *',            type: 'text',  key: 'name',            placeholder: 'Jane Smith',            required: true  },
                    { icon: Mail,     label: 'Email Address *',        type: 'email', key: 'email',           placeholder: 'you@company.com',        required: true  },
                    { icon: Building, label: 'Company / Organization', type: 'text',  key: 'company',         placeholder: 'Your Company',           required: false },
                    { icon: Phone,    label: 'Phone Number',           type: 'tel',   key: 'phone',           placeholder: '+1 (555) 000-0000',      required: false },
                  ].map(({ icon: Icon, label, type, key, placeholder, required }) => (
                    <div key={key}>
                      <label className="block text-xs font-black tracking-[0.12em] text-white/30 uppercase mb-2">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                        <input
                          type={type}
                          value={signupData[key]}
                          onChange={e => setSignupData({ ...signupData, [key]: e.target.value })}
                          placeholder={placeholder}
                          required={required}
                          className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
                        />
                      </div>
                    </div>
                  ))}

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-black tracking-[0.12em] text-white/30 uppercase mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-black tracking-[0.12em] text-white/30 uppercase mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={e => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full mt-2 py-4 rounded-xl font-black text-sm text-gray-900 bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {signupLoading ? 'Creating Account…' : 'Sign Up Now'}
                  </button>
                </form>
              </div>
            )}

            {/* ── Login form ── */}
            {!signupMode && (
              <div className="p-7 border border-white/[0.08] bg-[#06090f] rounded-2xl">
                <h3 className="text-2xl font-black text-white mb-1">Sign In</h3>
                <p className="text-white/35 text-sm mb-7">{role.microtext}</p>

                {error && (
                  <div className="mb-6 p-4 border border-red-500/20 bg-red-500/[0.07] rounded-xl">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* OAuth */}
                <div className="space-y-2.5 mb-7">
                  <button
                    onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/google?role=${role.id.toUpperCase()}`}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.07] rounded-xl text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" />
                    Continue with Google
                  </button>
                  <button
                    onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/linkedin?role=${role.id.toUpperCase()}`}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-[#0A66C2]/30 bg-[#0A66C2]/[0.08] hover:bg-[#0A66C2]/[0.16] rounded-xl text-[#60A5FA] text-sm font-semibold transition-all duration-200"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    Continue with LinkedIn
                  </button>
                  <button
                    onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/apple?role=${role.id.toUpperCase()}`}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.07] rounded-xl text-white/70 hover:text-white text-sm font-semibold transition-all duration-200"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.69-.74 1.55.19 2.58.91 3.25 1.91-2.9 1.83-2.39 5.56.55 6.78-.65 1.66-1.55 3.32-2.57 4.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    Continue with Apple
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.07]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#06090f] text-white/20 text-[10px] font-black tracking-[0.2em] uppercase">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Email / password */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black tracking-[0.12em] text-white/30 uppercase mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black tracking-[0.12em] text-white/30 uppercase mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" strokeWidth={1.5} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required
                        className="w-full pl-11 pr-12 py-3.5 bg-white/[0.04] border border-white/[0.10] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/25 focus:bg-white/[0.06] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-xs font-bold text-white/30 hover:text-white/60 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black text-sm text-gray-900 bg-white hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 mt-1"
                  >
                    {loading ? 'Signing in…' : 'Sign In'}
                  </button>
                </form>
              </div>
            )}

            {/* Security note */}
            <p className="text-center text-white/20 text-xs font-medium flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" strokeWidth={2} />
              Secure, role-based access. All actions are audited.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
