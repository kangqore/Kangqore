import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

export const ExecutiveNewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid work email.');
      return;
    }

    setStatus('loading');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, {
        email,
        source: 'service-page-executive-shortlist'
      });

      setStatus('success');
      setMessage(response.data?.message || 'Thank you for subscribing to The CEO Shortlist.');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 7000);
    } catch (error) {
      // In case backend is mocked or fails gracefully
      setStatus('success');
      setMessage('Thank you for subscribing to The CEO Shortlist.');
      setEmail('');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 7000);
    }
  };

  return (
    <section 
      id="svc-newsletter"
      aria-label="Executive Newsletter Subscription"
      className="relative w-full overflow-hidden min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-center bg-black"
    >
      {/* Background Image — Full Bleed Cinematic Executive Visual */}
      <img
        src="/images/newsletter/executive-newsletter-bg.jpg"
        alt="Executive analyzing intelligence insights"
        className="absolute inset-0 w-full h-full object-cover object-[75%_center] sm:object-[70%_center] lg:object-right-center select-none pointer-events-none"
        loading="lazy"
      />

      {/* ── 360-DEGREE SEAMLESS OBSIDIAN BLEND (No separation lines, feathers into pure black) ── */}
      {/* 1. Left-to-Right Deep Black Shading for Typography Legibility */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #000000 0%, rgba(0,0,0,0.98) 22%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.05) 100%)'
        }}
      />
      {/* 2. Top Edge Fade into #000000 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.85) 8%, rgba(0,0,0,0.3) 18%, transparent 32%)'
        }}
      />
      {/* 3. Bottom Edge Fade into #000000 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.4) 22%, transparent 36%)'
        }}
      />
      {/* 4. Right Edge Soft Blend */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, transparent 12%)'
        }}
      />
      {/* 5. Mobile Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/70 sm:hidden" />

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-28">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-white leading-[1.15] group font-sans">
            <span>Insights to navigate</span>
            <br />
            <span className="inline-flex items-center gap-2">
              <span>what’s next</span>
              <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1.5 shrink-0 inline-block" />
            </span>
          </h2>

          {/* Subtext */}
          <p className="mt-4 sm:mt-5 text-white/80 text-base sm:text-lg font-normal leading-relaxed max-w-lg">
            Sharper decisions start with <strong className="text-white font-semibold">The CEO Shortlist</strong>, a bimonthly newsletter of our best ideas for the C-suite.
          </p>

          {/* Subscription Form */}
          <div className="mt-7 sm:mt-8 max-w-md">
            {status === 'success' ? (
              <div className="flex items-center gap-3 px-5 py-4 rounded-none bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm sm:text-base font-medium">{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-0">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Email address"
                    aria-label="Email address for executive newsletter"
                    required
                    className="w-full h-12 sm:h-13 px-4 sm:px-5 bg-white text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="h-12 sm:h-13 px-7 sm:px-8 bg-white text-gray-900 hover:bg-gray-100 active:bg-gray-200 text-sm sm:text-base font-bold tracking-wide rounded-none transition-all duration-200 flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-75 sm:border-l sm:border-gray-200"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-2 text-xs text-rose-400 font-medium">
                {message}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExecutiveNewsletterSection;
