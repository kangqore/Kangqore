import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Building2, Handshake, TrendingUp,
  Briefcase, Shield, ArrowLeft, CheckCircle, Newspaper, LineChart,
  User, Phone, Building, ArrowRight,
} from 'lucide-react';
import Header from '../components/Header';
import FloatingButtons from '../components/FloatingButtons';

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
  {
    id: 'journalist',
    name: 'Journalist Access',
    icon: Newspaper,
    description: 'Media & press relations',
    microtext: 'Access restricted to verified press',
    hex: '#EC4899',
    glow: 'rgba(236,72,153,0.18)',
  },
  {
    id: 'analyst',
    name: 'Analyst Access',
    icon: LineChart,
    description: 'Industry & financial analysts',
    microtext: 'Access restricted to approved analysts',
    hex: '#06B6D4',
    glow: 'rgba(6,182,212,0.18)',
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
  const [showFullMenu,    setShowFullMenu]    = useState(false);

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
          'CLIENT':     '/kangqore-view/client',
          'PARTNER':    '/kangqore-view/partner',
          'INVESTOR':   '/kangqore-view/investor',
          'JOB_SEEKER': '/kangqore-view/careers',
          'JOURNALIST': '/kangqore-view/journalist',
          'ANALYST':    '/kangqore-view/analyst',
          'ADMIN':      '/kangqore-view/admin',
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
      const response = await fetch(`/api/auth/register`, {
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
      const response = await fetch(`/api/auth/login`, {
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
        'client':     '/kangqore-view/client',
        'partner':    '/kangqore-view/partner',
        'investor':   '/kangqore-view/investor',
        'job_seeker': '/kangqore-view/careers',
        'journalist': '/kangqore-view/journalist',
        'analyst':    '/kangqore-view/analyst',
        'admin':      '/kangqore-view/admin',
      };
      window.location.href = buildOSRedirect(roleRoutes[data.user.role.toLowerCase()] || '/kangqore-view/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const role = selectedRole;

  return (
    <div
      className={`text-white font-sans ${role ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'}`}
      style={{ backgroundColor: '#000000' }}
    >
      {/* Pure, Minimal Enterprise Background */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundColor: '#060606' }}>
        {/* Extremely subtle noise texture for a premium matte finish */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {!role && <Header onMenuClick={() => setShowFullMenu(true)} />}
      <FloatingButtons showFullMenu={showFullMenu} setShowFullMenu={setShowFullMenu} />

      {/* ── Main ── */}
      <main className={`relative z-10 flex ${!role ? 'flex-col items-center justify-center px-4 pt-52 pb-24' : 'w-full h-screen overflow-hidden'}`}>

        {/* ══════════ ROLE SELECTION ══════════ */}
        {!role && (
          <div className="w-full max-w-5xl space-y-12 relative">
            
            {/* Heading */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Sign in to Kangqore
              </h1>
              <p className="text-[#888888] text-base font-medium">
                Access is role-based. Select your access type to continue.
              </p>
            </div>

            {/* Role cards — 2×2 Enterprise Grid */}
            <style>{`
              @keyframes fade-in-up-stagger {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACCESS_TYPES.map((at) => {
                const Icon = at.icon;
                return (
                  <button
                    key={at.id}
                    onClick={() => handleRoleSelect(at)}
                    className="group relative flex flex-col p-6 text-left overflow-hidden rounded-2xl border border-white/[0.08] border-t-white/[0.15] border-b-black/80 bg-[#0A0A0A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.8),0_10px_20px_-5px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.9),0_20px_40px_-10px_rgba(0,0,0,0.8)] hover:border-t-white/[0.25] transform hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-300"
                  >
                    {/* Background Texture matching GlobalAuthPrompt */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl">
                      <img 
                        src="/images/capabilities/agentic-governed-autonomy.png" 
                        alt="background texture" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-[#141414]/70 z-[1] transition-colors duration-300 group-hover:bg-[#141414]/50" />
                      <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.55) 45%,rgba(0,0,0,0) 100%)' }} />
                    </div>

                    {/* Ambient overlay details */}
                    <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none z-[3] opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: at.hex }} />
                    <div className="absolute -bottom-12 -left-12 w-28 h-28 rounded-full blur-2xl pointer-events-none z-[3] opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: at.hex }} />

                    {/* Minimal colored accent bar on the left */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-white"
                    />
                    
                    <div className="relative z-10 flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/20 bg-black/20 shadow-inner">
                        <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                      <ArrowRight
                        className="w-4 h-4 text-white/60 group-hover:text-white transition-colors duration-200"
                      />
                    </div>
                    
                    <h3 className="relative z-10 text-white font-bold text-lg mb-1 tracking-tight drop-shadow-md">
                      {at.name}
                    </h3>
                    
                    <p className="relative z-10 text-white/80 text-sm font-medium leading-relaxed drop-shadow-sm">
                      {at.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Footer row: Security, Sign Up, and Admin */}
            <div className="flex items-center justify-between pt-2">
              {/* Left: Security footnote */}
              <div className="flex items-center gap-4 text-white/20 text-xs font-bold tracking-wide">
                {['SOC2', 'Audit Logs', 'Encryption', 'SSO'].map((b, i, arr) => (
                  <React.Fragment key={b}>
                    <span>{b}</span>
                    {i < arr.length - 1 && <span className="w-1 h-1 rounded-full bg-white/10" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Center: Sign up link */}
              <p className="text-center text-white/30 text-xs font-medium">
                Don't have an account?{' '}
                <button
                  onClick={() => { setSelectedRole(ACCESS_TYPES[0]); setSignupMode(true); }}
                  className="text-white/70 hover:text-white font-semibold transition-colors"
                >
                  Sign up
                </button>
              </p>

              {/* Right: Admin / We Innovate Future */}
              <button
                onClick={() => handleRoleSelect(ADMIN_TYPE)}
                className="inline-flex items-center gap-1.5 text-white/25 text-xs font-bold tracking-wide"
              >
                We Innovate Future
              </button>
            </div>
          </div>
        )}

        {/* ══════════ 2-COLUMN FORM VIEW ══════════ */}
        {role && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 animate-fade-in-up relative">
            
            {/* ── Futuristic Center Back Button ── */}
            <button
              onClick={handleBackToRoles}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 hidden lg:flex items-center gap-3 px-2 py-2 pr-6 rounded-[2rem] bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:bg-[#111622] hover:border-white/20 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1A1F2E] flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-all duration-300 shadow-inner">
                <ArrowLeft className="w-4 h-4 text-white/70 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-300" />
              </div>
              <div className="flex flex-col items-start justify-center">
                <span className="text-white/40 text-[9px] font-black tracking-[0.2em] uppercase leading-none mb-1 group-hover:text-white/60 transition-colors">Return</span>
                <span className="text-white text-[13px] font-bold tracking-wide leading-none">Back to roles</span>
              </div>
            </button>
            
            {/* ── Left Column (Display) ── */}
            <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden px-12 py-20">
              
              {/* Noise overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

              {/* Top Left Logo */}
              <div className="absolute top-0 left-[100px] z-20">
                <a href="/">
                  <img src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" alt="Kangqore Logo" className="h-[180px] w-auto object-contain hover:opacity-90 transition-opacity" />
                </a>
              </div>
              


              {/* Typography */}
              <div className="text-center z-20 mb-16 mt-20">
                <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.2] tracking-tight max-w-[500px]">
                  Unlock executive capabilities for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">enterprise</span>.
                </h1>
              </div>

              {/* Abstract Glassmorphic Floating Graphic */}
              <div className="relative w-full max-w-[500px] h-[400px] flex items-center justify-center z-10">
                
                {/* Background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-cyan/20 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-brand-blue/20 rounded-full blur-[80px]" />
                
                {/* Back Left Card */}
                <div className="absolute left-[5%] top-[15%] w-[220px] h-[300px] rounded-3xl border border-white/10 bg-[#141414]/80 backdrop-blur-md shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500 overflow-hidden">
                   <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-brand-blue/20 to-transparent pointer-events-none" />
                   <div className="p-5 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5 text-brand-blue" />
                      </div>
                      <div className="h-3 w-3/4 bg-white/10 rounded-full mb-3" />
                      <div className="h-3 w-1/2 bg-white/10 rounded-full mb-8" />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-blue"></div><div className="h-2 w-full bg-white/5 rounded-full" /></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-cyan"></div><div className="h-2 w-4/5 bg-white/5 rounded-full" /></div>
                      </div>
                   </div>
                   {/* Decorative elements */}
                   <div className="absolute bottom-5 left-5 right-5 h-20 bg-gradient-to-t from-white/5 to-transparent rounded-xl border border-white/5" />
                </div>

                {/* Back Right Card */}
                <div className="absolute right-[5%] top-[25%] w-[200px] h-[280px] rounded-3xl border border-white/10 bg-[#141414]/80 backdrop-blur-md shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500 overflow-hidden">
                   <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />
                   <div className="p-5 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                        <LineChart className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="h-3 w-full bg-white/10 rounded-full mb-3" />
                      <div className="h-3 w-2/3 bg-white/10 rounded-full mb-6" />
                      
                      <div className="flex items-end gap-2 h-16 mt-4">
                        <div className="w-full bg-purple-500/40 rounded-t-sm" style={{ height: '40%' }}></div>
                        <div className="w-full bg-purple-500/60 rounded-t-sm" style={{ height: '70%' }}></div>
                        <div className="w-full bg-purple-500/80 rounded-t-sm" style={{ height: '100%' }}></div>
                        <div className="w-full bg-purple-500/40 rounded-t-sm" style={{ height: '60%' }}></div>
                      </div>
                   </div>
                </div>

                {/* Front Center Card */}
                <div className="absolute z-10 top-[5%] w-[260px] h-[360px] rounded-[2rem] border border-white/20 bg-[#1A1F2E]/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-500 overflow-hidden flex flex-col group cursor-default">
                  {/* Top Bar */}
                  <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  {/* Content area */}
                  <div className="flex-1 relative overflow-hidden">
                    <img 
                      src="/images/capabilities/agentic-ai.png" 
                      alt="Agentic AI" 
                      className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/80 to-transparent flex flex-col justify-end p-6">
                      <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center mb-3 backdrop-blur-md">
                        <CheckCircle className="w-4 h-4 text-brand-cyan" />
                      </div>
                      <h4 className="text-white font-extrabold text-xl mb-1 drop-shadow-md">Governed Autonomy</h4>
                      <p className="text-brand-cyan text-xs font-bold tracking-widest uppercase mb-3">System Active</p>
                      
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan w-3/4 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── Right Column (Auth Form) ── */}
            <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">
              
              {/* Noise overlay to match */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

              {/* Mobile Back Button */}
              <button
                onClick={handleBackToRoles}
                className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-2 text-white/40 hover:text-white text-sm font-medium transition-colors duration-200 z-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              {/* The Auth Card */}
              <div className="w-full max-w-md relative z-10">
                <div className="relative overflow-hidden p-6 sm:p-8 rounded-[1.5rem] border border-white/[0.08] border-t-white/[0.15] border-b-black/80 bg-[#141414] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_6px_rgba(0,0,0,0.8),0_20px_40px_-10px_rgba(0,0,0,0.7)]">
                  {/* Background Texture */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[1.5rem]">
                    <img 
                      src="/images/capabilities/agentic-governed-autonomy.png" 
                      alt="background texture" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-[#141414]/70 z-[1]" />
                    <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.55) 45%,rgba(0,0,0,0) 100%)' }} />
                  </div>

                  {/* Ambient overlay details */}
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none z-[3] opacity-50" />
                  <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none z-[3] opacity-50" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <img src="/assets/kangqore-icon-white.png" alt="Kangqore" className="w-[50px] h-[50px] object-contain mx-auto mb-4" />
                      <h2 className="text-[22px] leading-tight font-extrabold tracking-tight text-white mb-2">Unlock Executive Core Features</h2>
                      <p className="text-[13px] text-white/40 max-w-[300px] mx-auto leading-relaxed">
                        Sign in to save your progress, bookmark capabilities, and unlock exclusive enterprise content.
                      </p>
                    </div>

                    {/* Success State */}
                    {signupMode && signupSuccess ? (
                      <div className="py-8 text-center">
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Account Created!</h3>
                        <p className="text-sm text-white/40 mb-6">Your {role.name} account is ready.</p>
                        <button
                          onClick={() => { setSignupMode(false); setSignupSuccess(false); setSignupData({ name: '', email: '', company: '', phone: '', password: '', confirmPassword: '' }); }}
                          className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-blue to-brand-cyan shadow-lg hover:shadow-[0_0_20px_rgba(37,100,234,0.3)] transition-all duration-300"
                        >
                          Go to Sign In
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Tabs */}
                        <div className="flex border-b border-white/5 mb-6">
                          <button 
                            onClick={() => { setSignupMode(false); setError(''); }}
                            className={`flex-1 pb-3.5 text-[15px] font-bold border-b-[3px] transition-all duration-200 ${
                              !signupMode 
                                ? 'border-brand-cyan text-brand-cyan' 
                                : 'border-transparent text-white/40 hover:text-white/80'
                            }`}
                          >
                            Sign In
                          </button>
                          <button 
                            onClick={() => { setSignupMode(true); setSignupError(''); setSignupSuccess(false); }}
                            className={`flex-1 pb-3.5 text-[15px] font-bold border-b-[3px] transition-all duration-200 ${
                              signupMode 
                                ? 'border-brand-cyan text-brand-cyan' 
                                : 'border-transparent text-white/40 hover:text-white/80'
                            }`}
                          >
                            Create Account
                          </button>
                        </div>

                        {/* Forms */}
                        {!signupMode ? (
                          <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-start gap-2.5">
                                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                              </div>
                            )}
                            <div>
                              <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase mb-2">Email Address</label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="you@company.com"
                                required
                                className="w-full bg-[#111622] border border-white/10 rounded-[12px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none focus:border-brand-blue/50 focus:bg-white/[0.04] transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase mb-2">Password</label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={formData.password}
                                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                                  placeholder="••••••••"
                                  required
                                  className="w-full bg-[#111622] border border-white/10 rounded-[12px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none focus:border-brand-blue/50 focus:bg-white/[0.04] transition-all pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full mt-2 py-3.5 rounded-[12px] font-bold text-[15px] text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:shadow-[0_0_20px_rgba(37,100,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                              {loading ? 'Signing in…' : 'Sign In'}
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={(e) => { setSignupData(prev => ({ ...prev, confirmPassword: prev.password })); handleSignupSubmit(e); }} className="space-y-4">
                            {signupError && (
                              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium flex items-start gap-2.5">
                                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span>{signupError}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase mb-2">Full Name</label>
                                <input
                                  type="text"
                                  value={signupData.name}
                                  onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                                  placeholder="Jane Doe"
                                  required
                                  className="w-full bg-[#111622] border border-white/10 rounded-[12px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none focus:border-brand-blue/50 focus:bg-white/[0.04] transition-all"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase mb-2">Company Name</label>
                                <input
                                  type="text"
                                  value={signupData.company}
                                  onChange={e => setSignupData({ ...signupData, company: e.target.value })}
                                  placeholder="Enterprise Inc."
                                  className="w-full bg-[#111622] border border-white/10 rounded-[12px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none focus:border-brand-blue/50 focus:bg-white/[0.04] transition-all"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase mb-2">Email Address</label>
                              <input
                                type="email"
                                value={signupData.email}
                                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                                placeholder="you@company.com"
                                required
                                className="w-full bg-[#111622] border border-white/10 rounded-[12px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none focus:border-brand-blue/50 focus:bg-white/[0.04] transition-all"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-white/40 tracking-widest uppercase mb-2">Password</label>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  value={signupData.password}
                                  onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                                  placeholder="Minimum 6 characters"
                                  required
                                  className="w-full bg-[#111622] border border-white/10 rounded-[12px] px-4 py-3.5 text-[14px] text-white placeholder-white/20 outline-none focus:border-brand-blue/50 focus:bg-white/[0.04] transition-all pr-12"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            
                            <button
                              type="submit"
                              disabled={signupLoading}
                              className="w-full mt-2 py-3.5 rounded-[12px] font-bold text-[15px] text-white bg-gradient-to-r from-brand-blue to-brand-cyan hover:shadow-[0_0_20px_rgba(37,100,234,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                              {signupLoading ? 'Creating Account…' : 'Create Account'}
                            </button>
                          </form>
                        )}

                        {/* Divider & OAuth */}
                        <div className="mt-8 relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/[0.06]" />
                          </div>
                          <div className="relative bg-[#141414] px-4 text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
                            Or continue with
                          </div>
                        </div>

                        <div className="mt-6">
                          <button
                            onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/oauth/google?role=${role.id.toUpperCase()}`}
                            className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#111622] border border-white/10 hover:border-white/20 hover:bg-white/[0.04] rounded-[12px] text-white/90 font-bold text-[13px] transition-all duration-200"
                          >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="" />
                            Google SSO Sign In
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
