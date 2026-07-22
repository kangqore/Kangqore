import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, UserCircle, ArrowUp, ChevronUp, MessageCircle, Accessibility, Menu, X, ChevronRight, ChevronDown, Building2, Users, Handshake, MessageSquare, Sparkles, Briefcase, TrendingUp, MapPin, UsersRound, Palette, BookOpen, FileText, Calendar, FileSpreadsheet, Award, Landmark, Shield, GraduationCap, Heart, FlaskConical, Tv, ShoppingCart, Plane, Zap, Factory, Database, Package, Moon, Sun, Plus } from 'lucide-react';
import { departmentData } from '../data/departmentData';
import { useAuth } from '../context/AuthContext';
import EQoreChatbot from './EQoreChatbot';

const FloatingButtons = ({ showFullMenu, setShowFullMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [isOmniOpen, setIsOmniOpen] = useState(false);
  const [isYielding, setIsYielding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 600);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const [hasUnread, setHasUnread] = useState(false);
  useEffect(() => {
    const handleUnread = (e) => setHasUnread(e.detail?.hasUnread || false);
    window.addEventListener('eqore-unread-status', handleUnread);
    return () => window.removeEventListener('eqore-unread-status', handleUnread);
  }, []);

  const [isLightBackground, setIsLightBackground] = useState(false);
  const [isErootActive, setIsErootActive] = useState(false);

  useEffect(() => {
    const handleErootVisibility = (e) => {
      setIsErootActive(e.detail?.visible || false);
    };
    window.addEventListener('eroot-visibility', handleErootVisibility);
    return () => {
      window.removeEventListener('eroot-visibility', handleErootVisibility);
    };
  }, []);

  useEffect(() => {
    // Smart Yielding Logic: Dim utilities when hovering over interactive content
    const handleMouseEnter = () => setIsYielding(true);
    const handleMouseLeave = () => setIsYielding(false);

    const interactiveElements = document.querySelectorAll('.pm-pod-card, .pm-kpi-card, .cta-section, .carousel-nav');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Adaptive logic for bottom right floating button
  useEffect(() => {
    const timeout = setTimeout(() => {
      const sections = document.querySelectorAll('section, main > div, footer, .hero-section');
      const lightElements = [];
      
      sections.forEach(sec => {
        const style = window.getComputedStyle(sec);
        const bgColor = style.backgroundColor;
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            const a = rgb[3] !== undefined ? parseFloat(rgb[3]) : 1;
            if (a > 0.1) {
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              if (luminance > 0.6) { // Threshold for light backgrounds
                lightElements.push(sec);
              }
            }
          }
        }
      });

      const intersectingSet = new Set();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            intersectingSet.add(entry.target);
          } else {
            intersectingSet.delete(entry.target);
          }
        });
        setIsLightBackground(intersectingSet.size > 0);
      }, {
        rootMargin: '-90% 0px 0px 0px', // Checks intersection at the bottom of the viewport
        threshold: 0
      });

      lightElements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (showFullMenu) {
      setIsOmniOpen(false); // Close Omni-Trigger when Sidebar opens
      setExpandedMenu(null);
    }
  }, [showFullMenu]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    setShowFullMenu(false);
    navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOmniOpen(false);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/1234567890?text=Hello%20Kangqore', '_blank');
    setIsOmniOpen(false);
  };

  const toggleChatbot = () => {
    window.dispatchEvent(new CustomEvent('toggle-eqore-chatbot'));
    setIsOmniOpen(false);
  };

  const adjustFontSize = (change) => {
    const newSize = Math.min(150, Math.max(80, fontSize + change));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const toggleMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Menu items data
  const whoWeAreItems = [
    { name: 'About Us', path: '/about-us', icon: Building2 },
    { name: 'Leadership', path: '/leadership', icon: Users },
    { name: 'Partners', path: '/partners', icon: Handshake },
    { name: 'Testimonials', path: '/testimonials', icon: MessageSquare },
    { name: 'eQORE', path: '/eqore', icon: Sparkles },
    { name: 'Careers', path: '/careers', icon: Briefcase },
    { name: 'Investors', path: '/investors', icon: TrendingUp },
    { name: 'Location', path: '/location', icon: MapPin },
    { name: 'Community', path: '/communities', icon: UsersRound },
    { name: 'Brand Identity', path: '/brand-identity', icon: Palette }
  ];

  const industriesItems = [
    { name: 'Banking', path: '/industries/banking', icon: Landmark },
    { name: 'Insurance', path: '/industries/insurance', icon: Shield },
    { name: 'EdTech', path: '/industries/edtech', icon: GraduationCap },
    { name: 'Healthcare', path: '/industries/healthcare', icon: Heart },
    { name: 'Life Science', path: '/industries/life-science', icon: FlaskConical },
    { name: 'Media & Technology', path: '/industries/media-technology', icon: Tv },
    { name: 'Retail', path: '/industries/retail', icon: ShoppingCart },
    { name: 'Travel & Hospitality', path: '/industries/travel-hospitality', icon: Plane },
    { name: 'Energy & Utilities', path: '/industries/energy-utilities', icon: Zap },
    { name: 'Manufacturing', path: '/industries/manufacturing', icon: Factory },
    { name: 'Information Services', path: '/industries/information-services', icon: Database },
    { name: 'Consumer Goods', path: '/industries/consumer-goods', icon: Package }
  ];

  const insightsItems = [
    { name: 'Blogs', path: '/blogs', icon: BookOpen },
    { name: 'Case Studies', path: '/case-studies', icon: FileText },
    { name: 'Brochures', path: '/brochures', icon: FileSpreadsheet },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'White Papers', path: '/white-paper', icon: Award }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: 'https://www.linkedin.com/company/kangqore' },
    { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: 'https://x.com/kangqore' },
    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: 'https://www.facebook.com/kangqore' },
    { name: 'Instagram', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', href: 'https://www.instagram.com/kangqore' }
  ];

  return (
    <>
      <EQoreChatbot />

      {/* New Vertical Floating Stack (eQORE AI & Menu) - Moved to LEFT */}
      <div 
        className={`fixed left-8 bottom-[calc(2rem+2cm)] sm:bottom-[calc(2.5rem+2cm)] z-[50] flex flex-col items-center gap-4 transition-all duration-700 ease-in-out ${
          !isVisible || isYielding || showFullMenu ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >

        {/* Hamburger Menu Button (Mobile Only) */}
        <div className="group/item relative md:hidden">
          <button
            onClick={() => setShowFullMenu(true)}
            className="w-[56px] h-[56px] rounded-full bg-brand-gradient text-white shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 hover:shadow-[0_0_25px_rgba(74,182,212,0.5)]"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          {/* Tooltip */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">
            Open Menu
          </div>
        </div>
      </div>

      {/* Unified Omni-Action Trigger - Moved to RIGHT */}
      <div 
        className={`fixed bottom-9 sm:bottom-11 right-[calc(2rem+0.5cm)] z-[40] flex flex-col-reverse items-center gap-4 transition-all duration-500 ${isYielding || showFullMenu || isErootActive ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}
      >
        {/* Standalone Scroll to Top - Rendered first to be at the very bottom in flex-col-reverse */}
        {isVisible && (
          <button onClick={scrollToTop} className="w-[44px] h-[44px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-full shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center group/btn overflow-hidden relative" title="Scroll to Top">
            <div className="flex flex-col items-center justify-center -space-y-[12px] group-hover/btn:-translate-y-1 transition-transform relative z-10 pt-[2px]">
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </div>
          </button>
        )}

        <button
          onClick={() => setIsOmniOpen(!isOmniOpen)}
          className={`w-12 h-12 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 flex items-center justify-center ${
            isOmniOpen 
              ? (isLightBackground ? 'bg-brand-blue text-white rotate-45' : 'bg-white text-gray-900 rotate-45')
              : (isLightBackground ? 'bg-gray-900 text-white' : 'bg-brand-gradient text-white')
          }`}
          aria-label="Toggle Actions"
        >
          {isOmniOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>

        <div className={`flex flex-col gap-4 transition-all duration-500 origin-bottom ${
          isOmniOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
        }`}>
          {/* eQORE AI Button */}
          <div className="group/item relative">
            <button
              onClick={toggleChatbot}
              className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center transition-all duration-500 hover:scale-110 hover:shadow-[0_0_25px_rgba(37,100,234,0.4)] group"
              aria-label="Ask eQORE AI"
            >
              <img 
                src="/images/eqore-avatar.png" 
                alt="eQORE AI" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              {hasUnread && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
              )}
            </button>
            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10">
              Ask eQORE AI
            </div>
          </div>
          <button onClick={openWhatsApp} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-lg border border-gray-100 flex items-center justify-center group" title="WhatsApp Support">
            <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="#25D366" stroke="none" strokeWidth="0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </button>
          <button onClick={() => { setShowAccessibility(!showAccessibility); setIsOmniOpen(false); }} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full shadow-lg border border-gray-100 flex items-center justify-center group" title="Appearance Settings">
            <svg className="w-6 h-6 transition-transform group-hover:scale-110 text-brand-blue" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="0">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Zm0-19.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.5 10a1.5 1.5 0 0 0 0 3h1.867l-1.393 4.873a1.5 1.5 0 1 0 2.884.825L12 11.237l2.142 7.461a1.5 1.5 0 1 0 2.884-.825L15.633 13H17.5a1.5 1.5 0 0 0 0-3h-11Z" />
            </svg>
          </button>
        </div>

        {/* Accessibility Panel */}
        {showAccessibility && (
          <div className="absolute bottom-24 right-0 bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl p-8 w-80 border border-gray-100 dark:border-gray-700 z-[101] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-3 text-xl">Appearance</h3>
              <button onClick={() => setShowAccessibility(false)} className="w-8 h-8 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center text-gray-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-6">
              <button onClick={toggleDarkMode} className="w-full py-4 px-5 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-between font-bold transition-all">
                {isDarkMode ? "Dark Mode ON" : "Dark Mode OFF"}
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isDarkMode ? 'bg-brand-blue' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white dark:bg-black transition-all ${isDarkMode ? 'left-7' : 'left-1'}`}></div>
                </div>
              </button>
              <div className="flex gap-2 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <button onClick={() => adjustFontSize(-10)} className="flex-1 py-2 font-black">A-</button>
                <button onClick={() => { setFontSize(100); document.documentElement.style.fontSize = '100%'; }} className="flex-1 py-2 text-[10px] text-gray-400 uppercase">Reset</button>
                <button onClick={() => adjustFontSize(10)} className="flex-1 py-2 font-black">A+</button>
              </div>
              <button onClick={toggleHighContrast} className={`w-full py-4 px-5 rounded-2xl border-2 font-bold ${highContrast ? 'bg-gray-900 text-white' : 'border-gray-100 dark:text-white'}`}>High Contrast {highContrast ? 'ON' : 'OFF'}</button>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Menu Overlay */}
      <AnimatePresence>
        {showFullMenu && (
          <div className="fixed inset-0 z-[9998] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
              onClick={() => setShowFullMenu(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative h-full w-full sm:w-[450px] bg-[#0a0a0c]/90 backdrop-blur-2xl border-l border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col z-[9999]"
            >
              {/* Decorative background glow */}
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] bg-brand-blue/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -left-[20%] w-[250px] h-[250px] bg-cyan-400/5 rounded-full blur-[100px]" />
              </div>

              {/* Sidebar Header */}
              <div className="px-10 pt-8 pb-6 flex items-center justify-between border-b border-white/5 relative z-10">
                <Link to="/" onClick={() => setShowFullMenu(false)}>
                  <img 
                    src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" 
                    alt="Kangqore" 
                    className="h-20 lg:h-24 object-contain" 
                    style={{ filter: 'brightness(0) invert(1)' }} 
                  />
                </Link>
                <button 
                  onClick={() => setShowFullMenu(false)} 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 border border-white/10 transition-all group"
                >
                  <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Sidebar Navigation */}
              <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6 relative z-10 custom-scrollbar">
                <nav className="space-y-5">
                  {/* Category: What We Do */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => toggleMenu('whatWeDo')} 
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${expandedMenu === 'whatWeDo' ? 'bg-brand-blue/20 text-brand-blue shadow-[0_0_15px_rgba(37,100,234,0.3)]' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <span className={`text-lg font-bold transition-all duration-300 ${expandedMenu === 'whatWeDo' ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                          What We Do
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-500 ${expandedMenu === 'whatWeDo' ? 'rotate-180 text-brand-blue' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedMenu === 'whatWeDo' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 pl-12 pt-1">
                            {departmentData.map((dept) => (
                              <Link 
                                key={dept.slug} 
                                to={`/department/${dept.slug}`} 
                                onClick={() => setShowFullMenu(false)} 
                                className="group/link py-1.5 text-[14px] text-white/50 hover:text-brand-blue flex items-center justify-between transition-colors"
                              >
                                <span>{dept.name}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Category: Who We Are */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => toggleMenu('whoWeAre')} 
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${expandedMenu === 'whoWeAre' ? 'bg-cyan-400/20 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                          <Users className="w-5 h-5" />
                        </div>
                        <span className={`text-lg font-bold transition-all duration-300 ${expandedMenu === 'whoWeAre' ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                          Who We Are
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-500 ${expandedMenu === 'whoWeAre' ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedMenu === 'whoWeAre' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 pl-12 pt-1">
                            {whoWeAreItems.map((item) => (
                              <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setShowFullMenu(false)} 
                                className="group/link py-1.5 text-[14px] text-white/50 hover:text-cyan-400 flex items-center justify-between transition-colors"
                              >
                                <span>{item.name}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Category: Industries */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => toggleMenu('industries')} 
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${expandedMenu === 'industries' ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className={`text-lg font-bold transition-all duration-300 ${expandedMenu === 'industries' ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                          Industries
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-500 ${expandedMenu === 'industries' ? 'rotate-180 text-purple-400' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedMenu === 'industries' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 pl-12 pt-1 max-h-[200px] overflow-y-auto custom-scrollbar pr-4">
                            {industriesItems.map((item) => (
                              <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setShowFullMenu(false)} 
                                className="group/link py-1.5 text-[14px] text-white/50 hover:text-purple-400 flex items-center justify-between transition-colors"
                              >
                                <span>{item.name}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Category: Insights */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => toggleMenu('insights')} 
                      className="w-full flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${expandedMenu === 'insights' ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-white/50 group-hover:text-white'}`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className={`text-lg font-bold transition-all duration-300 ${expandedMenu === 'insights' ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                          Insights
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-500 ${expandedMenu === 'insights' ? 'rotate-180 text-amber-400' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedMenu === 'insights' && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-1 pl-12 pt-1 max-h-[200px] overflow-y-auto custom-scrollbar pr-4">
                            {insightsItems.map((item) => (
                              <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setShowFullMenu(false)} 
                                className="group/link py-1.5 text-[14px] text-white/50 hover:text-amber-400 flex items-center justify-between transition-colors"
                              >
                                <span>{item.name}</span>
                                <ChevronRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Direct Link: Contact */}
                  <Link 
                    to="/contact" 
                    onClick={() => setShowFullMenu(false)} 
                    className="flex items-center gap-3 group py-1.5"
                  >
                    <div className="p-2 rounded-xl bg-white/5 text-white/50 group-hover:bg-brand-gradient group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,100,234,0.4)] transition-all duration-300">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold text-white/70 group-hover:text-white transition-all">Contact Us</span>
                  </Link>

                  {/* Auth Section */}
                  <div className="pt-3 mt-3 border-t border-white/5">
                    {user ? (
                      <div className="space-y-3">
                        <Link 
                          to={
                            user.role === 'ADMIN'      ? '/kangqore-view/admin'    :
                            user.role === 'CLIENT'     ? '/kangqore-view/client'   :
                            user.role === 'PARTNER'    ? '/kangqore-view/partner'  :
                            user.role === 'INVESTOR'   ? '/kangqore-view/investor' :
                            user.role === 'JOB_SEEKER' ? '/kangqore-view/careers'  :
                            '/kangqore-view/client'
                          }
                          onClick={() => setShowFullMenu(false)}
                          className="flex items-center gap-3 group py-1.5"
                        >
                          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white font-bold overflow-hidden shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : user.role === 'ADMIN' ? (
                              <img src="/assets/eqore_avatar.jpg" alt="Kangqore Admin" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[15px] font-bold text-white group-hover:text-brand-blue transition-colors truncate">{user.name}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">{user.role?.replace('_', ' ')}</p>
                          </div>
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 group py-1.5"
                        >
                          <div className="p-2 rounded-xl bg-white/5 text-white/50 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-300">
                            <LogOut className="w-5 h-5" />
                          </div>
                          <span className="text-lg font-bold text-white/70 group-hover:text-red-400 transition-all">Logout</span>
                        </button>
                      </div>
                    ) : (
                      <Link 
                        to="/login" 
                        onClick={() => setShowFullMenu(false)} 
                        className="flex items-center gap-3 group py-1.5"
                      >
                        <div className="p-2 rounded-xl bg-white/5 text-white/50 group-hover:bg-cyan-400 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300">
                          <LogIn className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold text-white/70 group-hover:text-white transition-all">Login</span>
                      </Link>
                    )}
                  </div>
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="px-10 py-6 border-t border-white/5 relative z-10 bg-black/20">
                <p className="text-[9px] uppercase tracking-widest font-bold text-white/30 mb-4">Connect with us</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, i) => (
                    <a 
                      key={i} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener" 
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-brand-blue hover:shadow-[0_0_20px_rgba(37,100,234,0.4)] transition-all duration-300 group"
                      title={social.name}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-[10px] text-white/20 font-medium tracking-tight">
                  <p>© 2026 Kangqore Global Pvt Ltd.</p>
                  <Link to="/privacy" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingButtons;
