import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || '';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [customizing, setCustomizing] = useState(false);

  const [functionalCookies, setFunctionalCookies] = useState(false);
  const [targetingCookies, setTargetingCookies] = useState(false);
  const [performanceCookies, setPerformanceCookies] = useState(false);

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

  const handleSaveConsent = async (preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent('cookies-accepted'));

    // Sync preferences with visitor profile in the database
    const visitorUuid = localStorage.getItem('kq_visitor_uuid');
    if (visitorUuid) {
      try {
        await fetch(`${API}/api/public/visitor/consent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitorUuid, preferences }),
        });
      } catch (err) {
        console.warn('[CookieConsent Sync Failed]', err);
      }
    }
  };

  const handleAcceptAll = () => {
    handleSaveConsent({
      necessary: true,
      functional: true,
      targeting: true,
      performance: true,
    });
  };

  if (!showBanner) return null;

  return (
    // Landmark: the banner's heading and body sat outside every landmark on
    // every page, which is two of the eight "region" violations.
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-2 left-2 right-2 z-[99999] max-w-screen-2xl mx-auto bg-black border border-neutral-800 rounded-2xl lg:rounded-3xl animate-slide-up text-left pt-4 pb-4 px-4 lg:pt-6 lg:pb-8 lg:px-8 max-h-[90vh] overflow-y-auto no-scrollbar"
      style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {customizing ? (
        <div className="w-full px-2 md:px-8 flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-16">
          {/* Left Side: Title, and Allow All */}
          <div className="flex flex-col gap-6 lg:w-[35%] w-full">

            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              Manage your cookies
            </h2>

            <button
              onClick={handleAcceptAll}
              className="w-[180px] py-2 bg-transparent border border-neutral-600 hover:border-white text-white font-bold rounded-full transition-all text-center text-xs"
            >
              Allow all
            </button>
          </div>

          {/* Right Side: Accordion / Toggles list & Save button */}
          <div className="flex flex-col gap-6 lg:w-[60%] w-full relative">

            <div className="flex flex-col border-t border-neutral-800">
              {/* Strictly Necessary Cookies */}
              <div className="flex items-center justify-between py-4 border-b border-neutral-800">
                <span className="text-white font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>+</span> Strictly Necessary Cookies
                </span>
                <span className="text-[#1e62c9] text-xs font-bold uppercase tracking-wider select-none">
                  Always Active
                </span>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between py-4 border-b border-neutral-800">
                <span className="text-white font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>+</span> Functional Cookies
                </span>
                <button
                  onClick={() => setFunctionalCookies(!functionalCookies)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    functionalCookies ? 'bg-[#1e62c9]' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white transition-transform ${
                      functionalCookies ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  >
                    {functionalCookies ? (
                      <span className="text-[11px] text-[#1e62c9] font-bold">✓</span>
                    ) : (
                      <span className="text-[11px] text-neutral-500 font-bold">✕</span>
                    )}
                  </span>
                </button>
              </div>

              {/* Targeting Cookies */}
              <div className="flex items-center justify-between py-4 border-b border-neutral-800">
                <span className="text-white font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>+</span> Targeting Cookies
                </span>
                <button
                  onClick={() => setTargetingCookies(!targetingCookies)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    targetingCookies ? 'bg-[#1e62c9]' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white transition-transform ${
                      targetingCookies ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  >
                    {targetingCookies ? (
                      <span className="text-[11px] text-[#1e62c9] font-bold">✓</span>
                    ) : (
                      <span className="text-[11px] text-neutral-500 font-bold">✕</span>
                    )}
                  </span>
                </button>
              </div>

              {/* Performance Cookies */}
              <div className="flex items-center justify-between py-4 border-b border-neutral-800">
                <span className="text-white font-semibold text-sm md:text-base flex items-center gap-2">
                  <span>+</span> Performance Cookies
                </span>
                <button
                  onClick={() => setPerformanceCookies(!performanceCookies)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    performanceCookies ? 'bg-[#1e62c9]' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white transition-transform ${
                      performanceCookies ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  >
                    {performanceCookies ? (
                      <span className="text-[11px] text-[#1e62c9] font-bold">✓</span>
                    ) : (
                      <span className="text-[11px] text-neutral-500 font-bold">✕</span>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {/* Save Preferences Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  handleSaveConsent({
                    necessary: true,
                    functional: functionalCookies,
                    targeting: targetingCookies,
                    performance: performanceCookies,
                  });
                }}
                className="w-[180px] py-2 border border-neutral-600 hover:border-white text-white font-bold rounded-full bg-transparent hover:bg-white/5 transition-all text-center text-xs"
              >
                Save my preferences
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full px-0 md:px-8 flex flex-col gap-6">

          {/* Bottom Row: Text Content & Buttons */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-16">
            <div className="flex flex-col gap-1.5 lg:gap-3 lg:flex-1">
              {/* The heading is decorative reassurance; on a 390px viewport it cost
                  a whole line that pushed the hero CTA off-screen. */}
              <h2 className="hidden lg:block text-xl font-bold text-white tracking-tight leading-snug">
                At Kangqore, we value your privacy.
              </h2>

              {/* Mobile: a one-line notice. The full disclosure is not removed —
                  it stays one tap away behind "Manage" and the Cookie policy
                  link, so consent remains informed. The long-form copy below
                  previously occupied ~45% of the first mobile viewport and
                  buried both hero CTAs. */}
              <p className="lg:hidden text-[14px] text-slate-300 leading-snug font-normal">
                We use cookies to run this site and understand how it is used.{' '}
                {/* py-1.5 on an inline element grows the hit box without
                    growing the line box, so the target clears 24px without
                    moving any text. WCAG 2.2 SC 2.5.8 exempts links inside a
                    sentence, but the exemption is a reason not to redesign the
                    layout — not a reason to leave a 14px target. */}
                <Link to="/cookies" className="text-white underline font-semibold py-1.5">
                  Cookie policy
                </Link>
              </p>

              <p className="hidden lg:block text-[11px] text-slate-400 leading-relaxed font-normal">
                When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies.
                This information might be about you, your preferences or your device and is mostly used to make the site work as you expect it to.
                The information does not usually directly identify you, but it can give you a more personalized web experience.
                Because we respect your right to privacy, you can choose not to allow some types of cookies.
                However, blocking some types of cookies may impact your experience of the site and the services we are able to offer.
                To find out more, read our updated{' '}
                <Link to="/cookies" className="text-white hover:text-slate-300 underline font-semibold transition-colors py-1.5">
                  Cookie policy
                </Link>
                .
              </p>
            </div>

            {/* Actions — side by side on mobile so they occupy one row, not two */}
            <div className="flex flex-row items-center gap-3 sm:gap-6 w-full lg:w-auto justify-end flex-shrink-0">
              <button
                onClick={() => setCustomizing(true)}
                className="flex-1 lg:flex-none lg:w-[180px] py-2.5 lg:py-2 bg-transparent border border-neutral-600 hover:border-white text-white font-bold rounded-full transition-all text-center text-xs"
              >
                <span className="lg:hidden">Manage</span>
                <span className="hidden lg:inline">Customize cookies</span>
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 lg:flex-none lg:w-[180px] py-2.5 lg:py-2 text-white text-xs font-bold rounded-full transition-all shadow-md hover:opacity-90 active:opacity-80 text-center"
                style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }}
              >
                <span className="lg:hidden">Accept all</span>
                <span className="hidden lg:inline">Accept all cookies</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookieConsent;
