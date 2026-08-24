import React, { useState, useEffect } from 'react';
import { ArrowUp, Accessibility, MessageCircle, Menu, X, ChevronDown, Building2, Users, Handshake, MessageSquare, Sparkles, Briefcase, TrendingUp, MapPin, UsersRound, Palette, Landmark, Shield, GraduationCap, Heart, FlaskConical, Tv, ShoppingCart, Plane, Zap, Factory, Database, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { departmentData } from '../data/departmentData';
import EQoreChatbot from './EQoreChatbot';

const DashboardFloatingButtons = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  // State for hiding individual buttons
  const [hideAccessibility, setHideAccessibility] = useState(false);
  const [hideRightButtons, setHideRightButtons] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Reset expanded menu when sidebar closes
  useEffect(() => {
    if (!showFullMenu) {
      setExpandedMenu(null);
    }
  }, [showFullMenu]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/1234567890?text=Hello%20Kangqore', '_blank');
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

  // Who We Are menu items
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

  // Industries menu items
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
    { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: '#' },
    { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: '#' },
    { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', href: '#' },
    { name: 'Instagram', icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', href: '#' },
    { name: 'YouTube', icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', href: '#' },
  ];

  return (
    <>
      {/* eQORE Chatbot - Floating above Accessibility */}
      <EQoreChatbot />

      {/* Accessibility Button - Bottom Left */}
      {!hideAccessibility ? (
        <div className="fixed bottom-8 left-8 z-50">
          {/* Close Button for Accessibility */}
          <button
            onClick={() => setHideAccessibility(true)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all"
            style={{ opacity: 0.7 }}
            aria-label="Hide accessibility button"
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.7}
          >
            <X className="w-3 h-3" />
          </button>
          <button
            onClick={() => setShowAccessibility(!showAccessibility)}
            className="p-3 bg-brand-gradient text-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.3),0_12px_32px_rgba(6,182,212,0.4)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),0_16px_40px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            aria-label="Accessibility options"
          >
            <Accessibility className="w-5 h-5" />
          </button>

        {/* Accessibility Panel */}
        {showAccessibility && (
          <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-2xl p-4 w-72 border border-gray-200">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-brand-blue" />
              Accessibility & Display
            </h3>
            

            {/* Font Size */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Font Size: {fontSize}%</p>
              <div className="flex gap-2">
                <button
                  onClick={() => adjustFontSize(-10)}
                  className="flex-1 py-2 px-3 bg-gray-100 dark:bg-[#0a0a0c] hover:bg-gray-200 rounded-lg font-bold transition-colors"
                >
                  A-
                </button>
                <button
                  onClick={() => adjustFontSize(10)}
                  className="flex-1 py-2 px-3 bg-gray-100 dark:bg-[#0a0a0c] hover:bg-gray-200 rounded-lg font-bold transition-colors"
                >
                  A+
                </button>
                <button
                  onClick={() => { setFontSize(100); document.documentElement.style.fontSize = '100%'; }}
                  className="py-2 px-3 bg-gray-100 dark:bg-[#0a0a0c] hover:bg-gray-200 rounded-lg text-sm transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="mb-4">
              <button
                onClick={toggleHighContrast}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  highContrast 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 dark:bg-[#0a0a0c] hover:bg-gray-200 text-gray-900 dark:text-white'
                }`}
              >
                High Contrast {highContrast ? 'ON' : 'OFF'}
              </button>
            </div>

            <button
              onClick={() => setShowAccessibility(false)}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        )}
        </div>
      ) : (
        /* Minimized Accessibility Restore Button */
        <button
          onClick={() => setHideAccessibility(false)}
          className="fixed bottom-8 left-8 z-50 p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 dark:text-gray-400 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Show accessibility button"
          title="Show accessibility options"
        >
          <Accessibility className="w-4 h-4" />
        </button>
      )}

      {/* Right Side Buttons */}
      {!hideRightButtons ? (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
          {/* Close Button for Right Side Buttons */}
          <button
            onClick={() => setHideRightButtons(true)}
            className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center z-10 transition-all"
            style={{ opacity: 0.7 }}
            aria-label="Hide floating buttons"
            onMouseEnter={(e) => e.target.style.opacity = 1}
            onMouseLeave={(e) => e.target.style.opacity = 0.7}
          >
            <X className="w-3 h-3" />
          </button>
          
          {/* Menu Button */}
        <button
          onClick={() => setShowFullMenu(true)}
          className="p-3 bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-100 text-gray-700 dark:text-gray-300 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.2)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 border border-gray-200 focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={openWhatsApp}
          className="p-3 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.3),0_12px_32px_rgba(34,197,94,0.4)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),0_16px_40px_rgba(34,197,94,0.5)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
          aria-label="Contact on WhatsApp"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </button>

        {/* Scroll to Top Button */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="p-3 bg-brand-gradient text-white rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.3),0_12px_32px_rgba(6,182,212,0.4)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.4),0_16px_40px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
        </div>
      ) : (
        /* Minimized Right Buttons Restore Button */
        <button
          onClick={() => setHideRightButtons(false)}
          className="fixed bottom-8 right-8 z-50 p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 dark:text-gray-400 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Show floating buttons"
          title="Show menu and actions"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      {/* Full Sidebar Menu Overlay */}
      {showFullMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998] bg-black/30"
            onClick={() => setShowFullMenu(false)}
          />
          
          {/* Sidebar Menu - 1/4 width on desktop, full height */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-96 lg:w-1/4 z-[9999] bg-white dark:bg-gray-900 dark:border-gray-800 shadow-2xl overflow-y-auto">
            {/* Background Pattern - Subtle diagonal lines */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  #000 10px,
                  #000 11px
                )`
              }}
            />
            
            {/* Header with Logo and Close Button */}
            <div className="relative px-6 pt-6">
              <div className="flex items-center justify-between">
                {/* Logo - 3x larger */}
                <Link to="/" onClick={() => setShowFullMenu(false)}>
                  <img 
                    src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" 
                    alt="Kangqore Logo" 
                    className="h-40"
                    style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(2395%) hue-rotate(201deg) brightness(95%) contrast(101%)' }}
                  />
                </Link>
                
                {/* Close Button - Circle with X */}
                <button
                  onClick={() => setShowFullMenu(false)}
                  className="w-10 h-10 rounded-full border-2 border-brand-blue flex items-center justify-center hover:bg-blue-50 dark:bg-blue-900/20 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-brand-blue" />
                </button>
              </div>
            </div>

            {/* Menu Content */}
            <div className="relative px-6 py-8">
              {/* Main Navigation with Dropdowns */}
              <nav className="mb-10">
                <ul className="space-y-2">
                  {/* What We Do - Dropdown */}
                  <li>
                    <button
                      onClick={() => toggleMenu('whatWeDo')}
                      className="w-full flex items-center justify-between text-xl text-gray-900 dark:text-white hover:text-brand-blue transition-colors font-semibold py-3"
                    >
                      <span>What We Do</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedMenu === 'whatWeDo' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedMenu === 'whatWeDo' && (
                      <div className="pl-4 pb-4 space-y-2 animate-fade-in">
                        <Link
                          to="/services"
                          onClick={() => setShowFullMenu(false)}
                          className="flex items-center gap-3 py-3 px-3 bg-brand-gradient text-white rounded-lg font-semibold mb-3"
                        >
                          <span>View All Services →</span>
                        </Link>
                        {departmentData.map((dept) => {
                          const IconComponent = dept.icon;
                          return (
                            <Link
                              key={dept.slug}
                              to={`/department/${dept.slug}`}
                              onClick={() => setShowFullMenu(false)}
                              className="flex items-center gap-3 py-2 text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors group"
                            >
                              <div className="w-8 h-8 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-brand-blue" />
                              </div>
                              <span className="text-sm">{dept.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>

                  {/* Who We Are - Dropdown */}
                  <li>
                    <button
                      onClick={() => toggleMenu('whoWeAre')}
                      className="w-full flex items-center justify-between text-xl text-gray-900 dark:text-white hover:text-brand-blue transition-colors font-semibold py-3"
                    >
                      <span>Who We Are</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedMenu === 'whoWeAre' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedMenu === 'whoWeAre' && (
                      <div className="pl-4 pb-4 space-y-2 animate-fade-in">
                        {whoWeAreItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setShowFullMenu(false)}
                              className="flex items-center gap-3 py-2 text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors group"
                            >
                              <div className="w-8 h-8 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-brand-blue" />
                              </div>
                              <span className="text-sm">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>

                  {/* Industries - Dropdown */}
                  <li>
                    <button
                      onClick={() => toggleMenu('industries')}
                      className="w-full flex items-center justify-between text-xl text-gray-900 dark:text-white hover:text-brand-blue transition-colors font-semibold py-3"
                    >
                      <span>Industries</span>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedMenu === 'industries' ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedMenu === 'industries' && (
                      <div className="pl-4 pb-4 space-y-2 animate-fade-in">
                        {industriesItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setShowFullMenu(false)}
                              className="flex items-center gap-3 py-2 text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors group"
                            >
                              <div className="w-8 h-8 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-brand-blue" />
                              </div>
                              <span className="text-sm">{item.name}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>

                  {/* Insights - Direct Link */}
                  <li>
                    <Link
                      to="/insights"
                      onClick={() => setShowFullMenu(false)}
                      className="block text-xl text-gray-900 dark:text-white hover:text-brand-blue transition-colors font-semibold py-3"
                    >
                      Insights
                    </Link>
                  </li>

                  {/* Contact Us - Direct Link */}
                  <li>
                    <Link
                      to="/contact"
                      onClick={() => setShowFullMenu(false)}
                      className="block text-xl text-gray-900 dark:text-white hover:text-brand-blue transition-colors font-semibold py-3"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Top Menu Elements - Smaller and thinner */}
              <nav className="mb-10">
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/careers"
                      onClick={() => setShowFullMenu(false)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors font-light"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/news"
                      onClick={() => setShowFullMenu(false)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors font-light"
                    >
                      News
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/communities"
                      onClick={() => setShowFullMenu(false)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors font-light"
                    >
                      Communities
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/investors"
                      onClick={() => setShowFullMenu(false)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors font-light"
                    >
                      Investors
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setShowFullMenu(false)}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors font-light group"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="userGradientDash" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1a1a1a" />
                            <stop offset="100%" stopColor="#4a4a4a" />
                          </linearGradient>
                        </defs>
                        <circle cx="12" cy="8" r="4" stroke="url(#userGradientDash)" strokeWidth="2" fill="none"/>
                        <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="url(#userGradientDash)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                      Login
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Social Icons */}
              <div className="flex items-center gap-5">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-brand-blue transition-colors"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardFloatingButtons;
