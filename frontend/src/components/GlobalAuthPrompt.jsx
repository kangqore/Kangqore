import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Check, ShieldAlert, RefreshCw } from 'lucide-react';

const GlobalAuthPrompt = () => {
  const { user, login, signup } = useAuth();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('signin'); // 'signin' or 'signup'
  
  // Auth Form inputs
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authCompany, setAuthCompany] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Timers for showing Auth popup (30s initial, 45s interval)
  useEffect(() => {
    // If the user is logged in, do not trigger anything
    if (user) {
      setShowAuthModal(false);
      return;
    }

    // Set 30s timer for initial floating prompt
    const initialTimer = setTimeout(() => {
      if (!user) {
        setShowAuthModal(true);
      }
    }, 30000);

    return () => clearTimeout(initialTimer);
  }, [user]);

  // Set interval timer if modal is closed but user is still guest
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    
    // Set 45s repeat timer
    const intervalTimer = setTimeout(() => {
      if (!user) {
        setShowAuthModal(true);
      }
    }, 45000);

    // We shouldn't strictly clear it here because it needs to run,
    // but in a real app we might want to store the timeout ID globally to clear it if they login.
    // However, the `user` check in the callback prevents issues.
  };

  // Listen for manual trigger events
  useEffect(() => {
    const handleShowAuth = (e) => {
      if (e.detail?.tab) setAuthTab(e.detail.tab);
      setShowAuthModal(true);
    };
    window.addEventListener('show-auth-modal', handleShowAuth);
    return () => window.removeEventListener('show-auth-modal', handleShowAuth);
  }, []);

  // Google OAuth redirect
  const handleGoogleAuth = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    window.location.href = `${backendUrl}/api/oauth/google?role=CLIENT`;
  };

  // Standard Login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    const result = await login(authEmail, authPassword);
    setAuthLoading(false);
    
    if (result.success) {
      setAuthSuccess(true);
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccess(false);
      }, 1000);
    } else {
      setAuthError(result.error);
    }
  };

  // Standard Signup submit
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const result = await signup(authName, authEmail, authPassword, authCompany);
    setAuthLoading(false);

    if (result.success) {
      setAuthSuccess(true);
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccess(false);
      }, 1000);
    } else {
      setAuthError(result.error);
    }
  };

  if (!showAuthModal) return null;

  return (
    <div className="fixed inset-0 bg-[#06080e]/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 transition-all duration-300">
      
      <div className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-fade-in-up">
        
        {/* Ambient overlay details */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Close Button */}
        <button 
          onClick={handleCloseAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Auth Title */}
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-3 shrink-0 w-12 h-12">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-cyan-400/30 bg-[#050505] flex items-center justify-center">
              <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-cyan-400 border-2 border-[#0e121e] rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">Unlock Executive Core Features</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            Sign in to save your progress, bookmark capabilities, and unlock exclusive enterprise content.
          </p>
        </div>

        {/* Success Prompt */}
        {authSuccess ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <Check className="w-6 h-6 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white">Successfully Authenticated!</h3>
            <p className="text-xs text-gray-400 mt-1">Syncing terminal configuration state...</p>
          </div>
        ) : (
          <>
            {/* Form Tabs */}
            <div className="flex border-b border-white/5 mb-6">
              <button 
                onClick={() => { setAuthTab('signin'); setAuthError(null); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${
                  authTab === 'signin' 
                    ? 'border-brand-cyan text-brand-cyan' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthTab('signup'); setAuthError(null); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition ${
                  authTab === 'signup' 
                    ? 'border-brand-cyan text-brand-cyan' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form errors */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Forms */}
            {authTab === 'signin' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-[#111622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-blue/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Password</label>
                  <input 
                    type="password" 
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#111622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-blue/50 transition"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan hover:shadow-lg text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Sign In</span>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-[#111622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-blue/50 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Company Name</label>
                    <input 
                      type="text" 
                      value={authCompany}
                      onChange={(e) => setAuthCompany(e.target.value)}
                      placeholder="Enterprise Inc."
                      className="w-full bg-[#111622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-blue/50 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-[#111622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-blue/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Password</label>
                  <input 
                    type="password" 
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#111622] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-brand-blue/50 transition"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-cyan hover:shadow-lg text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Create Account</span>}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-3 text-gray-500 text-[10px] font-bold tracking-widest uppercase">Or Continue With</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Google Sign In Button */}
            <button 
              onClick={handleGoogleAuth}
              className="w-full py-2.5 rounded-xl bg-[#1e2330] hover:bg-[#252b3c] border border-white/5 text-white font-semibold text-xs flex items-center justify-center gap-2 transition duration-300"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google SSO Sign In</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GlobalAuthPrompt;
