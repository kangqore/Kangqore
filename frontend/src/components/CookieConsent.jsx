import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  const handleChooseCookies = () => {
    // For now, just close the banner - can be extended to show cookie preferences modal
    localStorage.setItem('cookieConsent', 'custom');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t border-gray-200 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Text Content */}
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              We use cookies to personalise content and ads, to provide social media features and to analyse our traffic. 
              We also disclose information about your use of our site with our social media, advertising and analytics partners. 
              Additional details are available in our{' '}
              <Link to="#" className="text-brand-blue underline hover:text-blue-800 font-medium">
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={handleChooseCookies}
              className="text-sm text-brand-blue underline hover:text-blue-800 font-medium transition-colors"
            >
              Choose Cookies
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2.5 bg-brand-gradient text-white text-sm font-semibold rounded-md hover:opacity-90 transition-colors shadow-sm"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
