import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AmbientVideo from './media/AmbientVideo';

const FOOTER_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const socialLinks = [
  { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: 'https://www.linkedin.com/company/kangqore' },
  { name: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: 'https://x.com/kangqore' },
  { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: 'https://www.facebook.com/kangqore' },
  { name: 'Instagram', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', href: 'https://www.instagram.com/kangqore' },
];

const SocialIcon = ({ social }) => (
  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name}
    style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'all 0.2s' }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
  >
    <svg viewBox="0 0 24 24" style={{ width: 15, height: 15 }}><path d={social.icon} fill="white" /></svg>
  </a>
);

const navLinkStyle = {
  display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
  color: 'inherit', marginBottom: 14, textDecoration: 'none', transition: 'color 0.2s',
};

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // idle | loading | success | error
  const [subscribeMsg, setSubscribeMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setSubscribeStatus('error');
      setSubscribeMsg('Please enter a valid email address.');
      return;
    }

    setSubscribeStatus('loading');

    try {
      const response = await axios.post(`${FOOTER_BACKEND_URL}/api/newsletter/subscribe`, {
        email,
        source: 'footer'
      });

      setSubscribeStatus('success');
      setSubscribeMsg(response.data.message || 'Successfully subscribed!');
      setEmail('');

      setTimeout(() => {
        setSubscribeStatus('idle');
        setSubscribeMsg('');
      }, 5000);
    } catch (error) {
      setSubscribeStatus('error');
      setSubscribeMsg(error.response?.data?.error || 'Something went wrong. Please try again.');

      setTimeout(() => {
        setSubscribeStatus('idle');
        setSubscribeMsg('');
      }, 5000);
    }
  };

  useEffect(() => {
    const fitWatermark = () => {
      const svg = document.getElementById('footerWatermarkSvg');
      const text = document.getElementById('footerWatermarkText');
      if (!svg || !text) return;
      try { const b = text.getBBox(); svg.setAttribute('viewBox', `${b.x} ${b.y} ${b.width} ${b.height}`); } catch(e) {}
    };
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitWatermark); }
    else { window.addEventListener('load', fitWatermark); }
    window.addEventListener('resize', fitWatermark);
    return () => window.removeEventListener('resize', fitWatermark);
  }, []);

  const legalLinks = [
    { name: 'Privacy', path: '/privacy' }, { name: 'Terms', path: '/terms' },
    { name: 'Cookies', path: '/cookies' }, { name: 'Accessibility', path: '/accessibility' },
    { name: 'Sitemap', path: '/sitemap' },
  ];

  return (
    <footer className="bg-white dark:bg-black text-[#2d3148] dark:text-gray-300" style={{ padding: '97px 24px 0', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Two-Card Grid */}
      <div style={{ maxWidth: 1150, margin: '0 auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: 16, alignItems: 'stretch' }} className="footer-grid-wrapper">

        {/* LEFT CARD — Video Background */}
        <div style={{ position: 'relative', minHeight: 420, borderRadius: 28, padding: 32, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', background: '#111214', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Decorative only. Gated on viewport, motion preference and
              connection quality — see AmbientVideo. The card's #111214
              background is the intended appearance when it does not load. */}
          <AmbientVideo
            src="/videos/hero-bg.mp4"
            style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          />

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, paddingTop: '10px' }}>
            <img src="/assets/logo-main.png" alt="Kangqore" style={{ width: '200px', height: 'auto', objectFit: 'contain' }} />
          </div>

          {/* Tagline */}
          <div style={{ marginTop: 'auto', marginBottom: 28, position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", paddingRight: 16 }}>
              Kangqore partners with ambitious organizations to engineer intelligent digital infrastructure that modernizes operations, automates enterprise workflows, secures critical systems, and accelerates measurable growth.
            </p>
          </div>

          {/* Social Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.3px' }}>Stay in touch!</span>
            <div style={{ display: 'flex', gap: 7 }}>
              {socialLinks.map(s => <SocialIcon key={s.name} social={s} />)}
            </div>
          </div>
        </div>

        {/* RIGHT CARD — Navigation */}
        <div className="bg-[#f0f1f5] dark:bg-[#0a0a0c] footer-right-card" style={{ borderRadius: 28, padding: 40, overflow: 'visible', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>

          {/* Nav Columns */}
          <div style={{ display: 'flex', gap: 28, paddingTop: 8, flexWrap: 'wrap' }} className="footer-nav-cols">
            {/* Capabilities */}
            <div style={{ flex: '0 1 150px', minWidth: 140 }}>
              <h3 className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, fontStyle: 'italic', marginBottom: 18 }}>Capabilities</h3>
              <Link to="/department/ai-cognitive" style={navLinkStyle}>AI & Cognitive</Link>
              <Link to="/department/cloud-engineering" style={navLinkStyle}>Cloud & Engineering</Link>
              <Link to="/department/cybersecurity" style={navLinkStyle}>Cybersecurity</Link>
              <Link to="/department/digital-transformation-modernization" style={navLinkStyle}>Digital Transformation</Link>
              <Link to="/services" style={{ ...navLinkStyle, color: '#2564ea', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>View All →</Link>
            </div>
            {/* Company */}
            <div style={{ flex: '0 1 150px', minWidth: 140 }}>
              <h3 className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, fontStyle: 'italic', marginBottom: 18 }}>Company</h3>
              <Link to="/about-us" style={navLinkStyle}>{t('menu.about_us')}</Link>
              <Link to="/values" style={navLinkStyle}>Values & Culture</Link>
              <Link to="/leadership" style={navLinkStyle}>{t('menu.leadership')}</Link>
              <Link to="/careers" style={navLinkStyle}>Careers</Link>
              <Link to="/partners" style={navLinkStyle}>{t('menu.partners')}</Link>
            </div>
            {/* Insights */}
            <div style={{ flex: '0 1 150px', minWidth: 140 }}>
              <h3 className="text-gray-600 dark:text-gray-400" style={{ fontFamily: "'Caveat', cursive", fontSize: 24, fontWeight: 600, fontStyle: 'italic', marginBottom: 18 }}>Insights</h3>
              <Link to="/blogs" style={navLinkStyle}>Engineering Blog</Link>
              <Link to="/case-studies" style={navLinkStyle}>Case Studies</Link>
              <Link to="/white-paper" style={navLinkStyle}>White Papers</Link>
              <Link to="/events" style={navLinkStyle}>Events & Webinars</Link>
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 48, flexWrap: 'wrap', gap: 24 }} className="footer-bottom-row">
            {/* Copyright + Legal */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 500, color: '#4b5563', marginBottom: 8 }}>
                © {new Date().getFullYear()} Kangqore Global Pvt Ltd. All rights reserved.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {legalLinks.map((l, i) => (
                  <React.Fragment key={l.name}>
                    <Link to={l.path} style={{ fontSize: 11, color: '#9ca3af', textDecoration: 'none', fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#2564ea'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                    >{l.name}</Link>
                    {i < legalLinks.length - 1 && <span style={{ color: '#d1d5db', fontSize: 11 }}>•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Subscribe CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="footer-subscribe-block">
              <h4 style={{ fontSize: 15, fontWeight: 400, color: '#4b5563', lineHeight: 1.45, fontFamily: "'DM Sans', sans-serif" }}>
                AI moves fast.<br/><strong style={{ display: 'block', fontSize: 19, fontWeight: 700, color: 'inherit' }}>Stay ahead with Kangqore.</strong>
              </h4>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', width: 310, background: 'var(--tw-bg-opacity, #fff)', border: '1px solid #e5e7eb', borderRadius: 12, padding: 5, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }} className="footer-subscribe-form">
                <input type="email" aria-label="Email address for newsletter" placeholder="Enter email address" value={email} onChange={e => { setEmail(e.target.value); if (subscribeStatus === 'error') { setSubscribeStatus('idle'); setSubscribeMsg(''); } }} required
                  disabled={subscribeStatus === 'loading'}
                  style={{ flex: 1, padding: '11px 14px', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: 'inherit', opacity: subscribeStatus === 'loading' ? 0.6 : 1 }} />
                <button type="submit"
                  disabled={subscribeStatus === 'loading'}
                  style={{ padding: '11px 22px', background: '#111214', color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, fontWeight: 600, border: 'none', borderRadius: 8, cursor: subscribeStatus === 'loading' ? 'wait' : 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)', transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s', opacity: subscribeStatus === 'loading' ? 0.7 : 1 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.35), 0 3px 10px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#111214'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)'; }}
                >{subscribeStatus === 'loading' ? 'Sending...' : subscribeStatus === 'success' ? '✓ Subscribed' : 'Subscribe'}</button>
              </form>
              {subscribeStatus === 'success' && <p style={{ fontSize: 12, color: '#10b981', fontWeight: 500 }}>✓ {subscribeMsg}</p>}
              {subscribeStatus === 'error' && subscribeMsg && <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 500 }}>{subscribeMsg}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div style={{ maxWidth: 1150, margin: '-60px auto 0', pointerEvents: 'none', userSelect: 'none', position: 'relative', zIndex: 0, lineHeight: 0 }} aria-hidden="true">
        <svg id="footerWatermarkSvg" viewBox="62 95 876 175" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
          <text id="footerWatermarkText" x="500" y="240" textAnchor="middle" fontSize="320" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '-0.03em', fill: 'rgba(0,0,0,0.04)' }}>Kangqore</text>
        </svg>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 860px) {
          .footer-grid-wrapper { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-right-card { padding: 24px !important; }
          .footer-nav-cols { gap: 32px !important; }
          .footer-bottom-row { flex-direction: column !important; align-items: flex-start !important; }
          .footer-subscribe-form { width: 100% !important; }
          .footer-subscribe-block { width: 100%; }
        }
      `}</style>
    </footer>
  );
};
export default Footer;

