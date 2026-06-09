import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, ArrowLeft, CheckCircle, AlertCircle, 
  Loader2, KeyRound 
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await axios.post(`${BACKEND_URL}/api/auth/forgot-password`, { email });
      
      setStatus('success');
      setMessage('If an account exists with this email, you will receive password reset instructions.');
    } catch (error) {
      // Still show success to prevent email enumeration
      setStatus('success');
      setMessage('If an account exists with this email, you will receive password reset instructions.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Login */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-brand-gradient px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white dark:bg-gray-900 dark:border-gray-800/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-blue-100">
              No worries, we'll send you reset instructions
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            {status === 'success' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Check Your Email</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setEmail('');
                    }}
                    className="w-full py-3 border border-gray-300 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors"
                  >
                    Try Another Email
                  </button>
                  <Link 
                    to="/login"
                    className="block w-full py-3 bg-brand-gradient text-white font-semibold rounded-xl hover:opacity-90 transition-colors text-center"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-brand-blue transition-colors"
                      placeholder="Enter your email"
                      disabled={status === 'loading'}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Enter the email address associated with your account
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-brand-gradient text-white font-semibold rounded-xl hover:opacity-90 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      Send Reset Instructions
                    </>
                  )}
                </button>

                {/* Links */}
                <div className="text-center text-sm">
                  <span className="text-gray-500">Remember your password? </span>
                  <Link to="/login" className="text-brand-blue hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? <a href="/contact" className="text-brand-blue hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
