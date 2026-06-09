import React, { useState } from 'react';
import { Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const NewsletterForm = ({ source = 'sidebar', variant = 'default' }) => {
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

    try {
      const response = await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, {
        email,
        source
      });

      setStatus('success');
      setMessage(response.data.message || 'Successfully subscribed!');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to subscribe. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-semibold">You're subscribed!</p>
            <p className="text-sm text-green-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="email"
          id="newsletter-email-inline"
          name="newsletter-email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={status === 'loading'}
        />
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-brand-gradient text-white rounded-lg text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Stay Ahead with Kangqore Insights
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
        Get the latest research, analysis, and perspectives delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input 
          type="email"
          id="newsletter-email"
          name="newsletter-email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          disabled={status === 'loading'}
        />
        
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      {status === 'error' && message && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {message}
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;
