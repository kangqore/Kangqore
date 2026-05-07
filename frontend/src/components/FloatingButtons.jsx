import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle, Accessibility, Menu, X, ChevronRight, ChevronDown, Building2, Users, Handshake, MessageSquare, Sparkles, Briefcase, TrendingUp, MapPin, UsersRound, Palette, BookOpen, FileText, Calendar, FileSpreadsheet, Award, Landmark, Shield, GraduationCap, Heart, FlaskConical, Tv, ShoppingCart, Plane, Zap, Factory, Database, Package, Moon, Sun, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { departmentData } from '../data/departmentData';
import EQoreChatbot from './EQoreChatbot';

const FloatingButtons = ({ showFullMenu, setShowFullMenu }) => {
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
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
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

  const socialLinks = [
    { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: 'https://www.linkedin.com/company/kangqore' },
    { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: 'https://x.com/kangqore' },
    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: 'https://www.facebook.com/kangqore' },
    { name: 'Instagram', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', href: 'https://www.instagram.com/kangqore' }
  ];

  return (
    <>
      <EQoreChatbot />

      {/* Unified Omni-Action Trigger */}
      <div 
        className={`fixed bottom-8 right-8 z-[40] flex flex-col-reverse items-center gap-4 transition-all duration-500 ${isYielding || showFullMenu ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100 translate-y-0'}`}
      >
        <button
          onClick={() => setIsOmniOpen(!isOmniOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 flex items-center justify-center ${
            isOmniOpen ? 'bg-gray-900 text-white rotate-45' : 'bg-brand-gradient text-white'
          }`}
          aria-label="Toggle Actions"
        >
          {isOmniOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>

        <div className={`flex flex-col gap-4 transition-all duration-500 origin-bottom ${
          isOmniOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
        }`}>
          {isVisible && (
            <button onClick={scrollToTop} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center group/btn" title="Scroll to Top">
              <ArrowUp className="w-5 h-5 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          )}
          <button onClick={openWhatsApp} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-[#25D366] rounded-full shadow-lg border border-gray-100 flex items-center justify-center" title="WhatsApp Support">
            <MessageCircle className="w-5 h-5" />
          </button>
          <button onClick={toggleChatbot} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue rounded-full shadow-lg border border-gray-100 flex items-center justify-center" title="Chat with eQORE">
            <Sparkles className="w-5 h-5" />
          </button>
          <button onClick={() => { setShowAccessibility(!showAccessibility); setIsOmniOpen(false); }} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center" title="Appearance Settings">
            <Accessibility className="w-5 h-5" />
          </button>
          <button onClick={() => { setShowFullMenu(true); setIsOmniOpen(false); }} className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 dark:text-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center" title="Sitemap Menu">
            <Menu className="w-5 h-5" />
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
      {showFullMenu && (
        <div className="fixed inset-0 z-[9998] flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowFullMenu(false)} />
          <div className="relative h-full w-full sm:w-96 lg:w-1/4 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl overflow-y-auto z-[9999] animate-in slide-in-from-right duration-500">
            <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-gray-100">
              <img src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" alt="Kangqore" className="h-12" style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(2395%) hue-rotate(201deg) brightness(95%) contrast(101%)' }} />
              <button onClick={() => setShowFullMenu(false)} className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center hover:bg-gray-100 dark:bg-[#0a0a0c] transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-8 space-y-10">
              <nav className="space-y-6">
                <div>
                  <button onClick={() => toggleMenu('whatWeDo')} className="w-full flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white group">
                    <span className="group-hover:text-brand-blue transition-colors">What We Do</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedMenu === 'whatWeDo' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMenu === 'whatWeDo' && (
                    <div className="mt-4 grid gap-2">
                      {departmentData.map((dept) => (
                        <Link key={dept.slug} to={`/department/${dept.slug}`} onClick={() => setShowFullMenu(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3">
                          <dept.icon className="w-4 h-4 opacity-50" />
                          {dept.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <button onClick={() => toggleMenu('whoWeAre')} className="w-full flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white group">
                    <span className="group-hover:text-brand-blue transition-colors">Who We Are</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedMenu === 'whoWeAre' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMenu === 'whoWeAre' && (
                    <div className="mt-4 grid gap-2">
                      {whoWeAreItems.map((item) => (
                        <Link key={item.path} to={item.path} onClick={() => setShowFullMenu(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3">
                          <item.icon className="w-4 h-4 opacity-50" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <button onClick={() => toggleMenu('industries')} className="w-full flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white group">
                    <span className="group-hover:text-brand-blue transition-colors">Industries</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedMenu === 'industries' ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMenu === 'industries' && (
                    <div className="mt-4 grid gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {industriesItems.map((item) => (
                        <Link key={item.path} to={item.path} onClick={() => setShowFullMenu(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3">
                          <item.icon className="w-4 h-4 opacity-50" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link to="/contact" onClick={() => setShowFullMenu(false)} className="block text-lg font-bold text-gray-900 dark:text-white hover:text-brand-blue transition-colors">Contact Us</Link>
              </nav>
              <div className="pt-10 border-t border-gray-100 flex gap-6">
                {socialLinks.map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noopener" className="text-gray-400 hover:text-brand-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon} /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingButtons;
