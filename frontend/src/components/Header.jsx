import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Globe, Menu, X, LogIn, LogOut, UserCircle, Search, Phone, ArrowRight, Building2, Users, Handshake, MessageSquare, Sparkles, Briefcase, TrendingUp, MapPin, UsersRound, Palette, BookOpen, FileText, Calendar, FileSpreadsheet, Award, Landmark, Shield, GraduationCap, Heart, FlaskConical, Tv, ShoppingCart, Plane, Zap, Factory, Database, Package, Sun, Moon, Mic } from 'lucide-react';
import { navigationItems } from '../mock/mockData';
import { useAuth } from '../context/AuthContext';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import GlobalSearch from './GlobalSearch';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';
import Realistic3DIcon from './ui/Realistic3DIcon';
import { useSmartNav } from '../hooks/useSmartNav';

const Header = ({ onMenuClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const [isLightBackground, setIsLightBackground] = useState(false);

  // Auto-hide smart navigation hook
  const { isSmartNavVisible, setNavHovered } = useSmartNav({ 
    timeout: 1000,
    disabled: isInHero
  });

  // Adaptive Glassmorphic Logic - Detects light sections under the header
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
        rootMargin: '-50px 0px -90% 0px', // Checks intersection at header's exact height
        threshold: 0
      });

      lightElements.forEach(el => observer.observe(el));
      return () => observer.disconnect();
    }, 500);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Handle scroll to hide/show utility bar and track hero section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setIsInHero(window.scrollY < window.innerHeight * 0.6);
    };
    
    // Initial check on mount
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse move to show utility bar when hovering top
  useEffect(() => {
    const handleMouseMove = (e) => {
      // If mouse is in the top 50px of the viewport, show the bar
      if (e.clientY < 50) {
        setIsHoveringTop(true);
      } else if (e.clientY > 100 && !activeDropdown) {
        // Only hide if we aren't interacting with a menu
        setIsHoveringTop(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [activeDropdown]);

  const showUtilityBar = !isScrolled || isHoveringTop;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // State for the mega-menu hover panel
  const [activeMegaDept, setActiveMegaDept] = useState(0);

  // Cmd+K / Ctrl+K keyboard shortcut opens GlobalSearch.
  // This is the Stripe / Linear / Notion pattern — search remains accessible
  // for power users even though the visible search icon was replaced by the
  // "Ask eQORE AI" pill in the nav. Documented in /eqore page tooltip.
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Opens the global eQORE chatbot console.
  const openEqoreChat = () => {
    navigate('/eqore-ai', {
      state: {
        returnTo: location.pathname + location.search,
        source: 'navbar_ask_eqore_ai',
      },
    });
  };

  // Phase D — build mega-menu categories from the 6-department canonical data.
  // Right pane shows the department's TOP 5 hero services (not all services).
  // Each hero service may reference a service whose canonical home is a
  // different department (e.g., Cognition's hero list includes AI Governance
  // which lives canonically in Shield) — surfaced with a small cross-cut badge.
  const servicesCategories = departmentsList.map((deptSlug) => {
    const dept = departmentsData[deptSlug];
    const heroSlugs = dept.heroServiceSlugs || dept.serviceSlugs.slice(0, 5);
    return {
      title: dept.shortName,
      fullName: dept.name,
      slug: dept.slug,
      icon: dept.icon,
      tagline: dept.tagline,
      description: dept.description,
      accentColor: dept.accentColor,
      bannerBrand: dept.bannerBrand,
      serviceCount: dept.serviceCount,
      items: heroSlugs
        .map((svcSlug) => {
          const svc = servicesData[svcSlug];
          if (!svc) return null;
          return {
            name: svc.name,
            slug: svc.slug,
            shortDescription: svc.shortDescription,
            // Cross-cut marker: true when the service's canonical home is a
            // DIFFERENT department than the one surfacing it in heroServiceSlugs.
            crossDepartment:
              svc.departmentSlug !== deptSlug
                ? departmentsData[svc.departmentSlug]?.shortName
                : null,
          };
        })
        .filter(Boolean),
    };
  });

  // Who We Are menu items
  const whoWeAreItems = [
    { name: t('menu.about_us'), path: '/about-us', icon: Building2 },
    { name: 'Values & Culture', path: '/values', icon: Heart },
    { name: t('menu.leadership'), path: '/leadership', icon: Users },
    { name: t('menu.partners'), path: '/partners', icon: Handshake },
    { name: t('menu.testimonials'), path: '/testimonials', icon: MessageSquare },
    { name: t('menu.eqore'), path: '/eqore', icon: Sparkles },
    { name: 'Careers', path: '/careers', icon: Briefcase },
    { name: t('menu.location'), path: '/location', icon: MapPin },
    { name: t('menu.community'), path: '/communities', icon: UsersRound },
    { name: t('menu.brand_identity'), path: '/brand-identity', icon: Palette }
  ];

  // Insights menu items
  const insightsItems = [
    { name: t('menu.blogs'), path: '/blogs', icon: BookOpen },
    { name: t('menu.case_studies'), path: '/case-studies', icon: FileText },
    { name: t('menu.brochures'), path: '/brochures', icon: FileSpreadsheet },
    { name: 'Podcasts', path: '/podcast', icon: Mic },
    { name: t('menu.events'), path: '/events', icon: Calendar },
    { name: t('menu.white_paper'), path: '/white-paper', icon: Award }
  ];

  // Industries menu items
  // Industries menu items
  const industriesItems = [
    { name: t('industries.banking'), path: '/industries/banking', icon: Landmark },
    { name: t('industries.insurance'), path: '/industries/insurance', icon: Shield },
    { name: t('industries.edtech'), path: '/industries/edtech', icon: GraduationCap },
    { name: t('industries.healthcare'), path: '/industries/healthcare', icon: Heart },
    { name: t('industries.life_science'), path: '/industries/life-science', icon: FlaskConical },
    { name: t('industries.media_tech'), path: '/industries/media-technology', icon: Tv },
    { name: t('industries.retail'), path: '/industries/retail', icon: ShoppingCart },
    { name: t('industries.travel_hospitality'), path: '/industries/travel-hospitality', icon: Plane },
    { name: t('industries.energy_utilities'), path: '/industries/energy-utilities', icon: Zap },
    { name: t('industries.manufacturing'), path: '/industries/manufacturing', icon: Factory },
    { name: t('industries.info_services'), path: '/industries/information-services', icon: Database },
    { name: t('industries.consumer_goods'), path: '/industries/consumer-goods', icon: Package }
  ];

  const navLinks = [
    { id: 'services', name: t('nav.what_we_do'), items: navigationItems.services, isMegaMenu: true, type: 'services' },
    { id: 'who-we-are', name: t('nav.who_we_are'), items: whoWeAreItems, isMegaMenu: true, type: 'whoWeAre' },
    { id: 'industries', name: t('nav.industries'), items: industriesItems, isMegaMenu: true, type: 'industries' },
    { id: 'insights', name: t('nav.insights'), items: insightsItems, isMegaMenu: true, type: 'insights' }
  ];

  return (
    <>
      <header 
        className={`fixed left-0 right-0 z-[10000] pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSmartNavVisible ? 'top-0' : '-top-40 opacity-0'
        }`}
        onMouseEnter={() => {
          setIsHoveringTop(true);
          setNavHovered(true);
        }}
        onMouseLeave={() => {
          setIsHoveringTop(false);
          setNavHovered(false);
        }}
      >
        {/* Top utility bar - Floating Pill */}
        <div 
          className={`hidden lg:block max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto transition-all duration-500 ease-in-out ${
            showUtilityBar ? 'mt-4 translate-y-0 opacity-100 h-9' : 'mt-0 -translate-y-full opacity-0 h-0 overflow-hidden'
          }`}
        >
          <div className="flex justify-end items-center h-full px-8 text-[13px] font-medium tracking-wide">
            <div className="flex items-center space-x-5 text-white drop-shadow-md">
                <Link to="/careers" className="hover:text-white/80 transition-colors">Careers</Link>
                <Link to="/news" className="hover:text-white/80 transition-colors">News</Link>
                <Link to="/communities" className="hover:text-white/80 transition-colors">Communities</Link>
                <Link to="/investors" className="hover:text-white/80 transition-colors">Investors</Link>

                <LanguageSwitcher />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-white" />}
                </button>
                
                {/* Login/Logout in top bar */}
                {user ? (
                  <>
                    <Link 
                      to={
                        user.role === 'ADMIN' ? '/dashboard/admin' :
                        user.role === 'CLIENT' ? '/dashboard/client' :
                        user.role === 'PARTNER' ? '/dashboard/partner' :
                        user.role === 'INVESTOR' ? '/dashboard/investor' :
                        user.role === 'JOB_SEEKER' ? '/dashboard/careers' :
                        '/client-portal'
                      }
                      className="flex items-center gap-1 hover:text-white/80 transition-colors font-medium"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold overflow-hidden">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : user.role === 'ADMIN' ? (
                          <img src="/assets/eqore_avatar.jpg" alt="Kangqore Admin" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px]">{user.name?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span>{user.name}</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login"
                    className="flex items-center gap-1.5 hover:text-white/80 transition-colors font-medium group"
                  >
                    <div className="relative w-5 h-5">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="userGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#e2e8f0" />
                          </linearGradient>
                        </defs>
                        <circle cx="12" cy="8" r="4" stroke="url(#userGradient)" strokeWidth="2" fill="none" />
                        <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="url(#userGradient)" strokeWidth="2" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                    <span>Login</span>
                  </Link>
                )}
              </div>
          </div>
        </div>

        <div 
          className={`max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto transition-all duration-500 ease-in-out ${
            showUtilityBar ? 'pt-2' : 'pt-6'
          }`}
        >
          <div className={`backdrop-blur-2xl rounded-full border shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between h-16 lg:h-20 px-6 lg:px-8 transition-colors duration-500 ${
            isLightBackground 
              ? 'bg-black/[0.03] dark:bg-black/10 border-black/5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.02)]' 
              : 'bg-white/[0.02] dark:bg-white/[0.01] border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
          }`}>
            {/* Logo Island Section */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center shrink-0 group"
                onClick={() => setActiveDropdown(null)}
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" 
                  alt="Kangqore Logo" 
                  className={`h-20 lg:h-28 -ml-2 transition-all duration-300 group-hover:scale-105 ${
                    isLightBackground ? 'brightness-0' : 'brightness-0 invert'
                  }`}
                />
              </Link>
            </div>

            {/* Desktop Navigation - Nested Pill Content */}
            <nav className={`hidden lg:flex items-center space-x-4 rounded-full px-5 py-0.5 border transition-colors duration-500 backdrop-blur-md ${
              isLightBackground
                ? 'bg-white/70 border-white/20 shadow-sm'
                : 'bg-black/70 border-white/10 shadow-sm'
            }`}>
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.id)}
                >
                  <button 
                    className={`flex items-center space-x-1 hover:text-brand-blue transition-colors duration-300 py-1.5 font-bold tracking-tight text-[14px] ${
                      isLightBackground ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.id ? 'rotate-180 text-brand-blue' : isLightBackground ? 'text-gray-500 group-hover:text-brand-blue' : 'text-white/60 group-hover:text-brand-blue'}`} />
                  </button>
                  
                  {/* Bridge area to prevent menu from closing */}
                  {activeDropdown === link.id && link.isMegaMenu && (
                    <div 
                      className="absolute top-full left-0 right-0 h-8 pointer-events-auto"
                      onMouseEnter={() => setActiveDropdown(link.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    />
                  )}
                  
                  {/* Mega Menu for Services (What We Do) */}
                  {activeDropdown === link.id && link.isMegaMenu && link.type === 'services' && (
                    <div 
                      className="fixed left-4 right-4 lg:left-10 lg:right-10 top-[138px] bottom-10 bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] overflow-hidden pointer-events-auto"
                      onMouseEnter={() => setActiveDropdown(link.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      <style>{`
                        @keyframes megaFadeIn {
                          from { opacity: 0; transform: translateY(10px) scale(0.98); }
                          to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                      `}</style>

                      <div className="h-full flex flex-col">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                          <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Enterprise Solutions</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{departmentsList.length} global departments · Specialized engineering execution</p>
                          </div>
                          <Link
                            to="/services"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white text-sm font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                          >
                            Explore All Services
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                        
                        {/* Two-Panel Body */}
                        <div className="flex flex-1 min-h-0 overflow-hidden">
                          {/* Left Panel - Department List */}
                          <div className="w-[380px] bg-gray-50/30 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800/50 overflow-y-auto shrink-0 custom-scrollbar">
                            <div className="py-4 px-4 space-y-1">
                              {servicesCategories.map((category, index) => {
                                const IconComponent = category.icon;
                                const isActive = activeMegaDept === index;
                                return (
                                  <button
                                    key={index}
                                    onMouseEnter={() => setActiveMegaDept(index)}
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      navigate(`/departments/${category.slug}`);
                                    }}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group ${
                                      isActive
                                        ? 'bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800'
                                        : 'hover:bg-white/50 dark:hover:bg-gray-900/40'
                                    }`}
                                  >
                                    <div
                                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                        isActive ? 'shadow-lg scale-110' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                                      }`}
                                      style={isActive ? { backgroundColor: category.accentColor } : undefined}
                                    >
                                      <IconComponent className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-[13px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700'}`}>
                                        {category.title}
                                      </p>
                                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{category.serviceCount} Core Services</p>
                                    </div>
                                    <ArrowRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} style={{ color: category.accentColor }} />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Right Panel - Active Department's Services */}
                          <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="px-12 py-10">
                              {servicesCategories[activeMegaDept] && (() => {
                                const activeCat = servicesCategories[activeMegaDept];
                                const ActiveIcon = activeCat.icon;
                                return (
                                  <>
                                    <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800/50">
                                      <div
                                        className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl animate-pulse-slow"
                                        style={{ backgroundColor: activeCat.accentColor }}
                                      >
                                        <ActiveIcon className="w-8 h-8 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-[11px] uppercase tracking-[0.3em] font-black mb-1.5 opacity-60" style={{ color: activeCat.accentColor }}>
                                          {activeCat.fullName}
                                        </p>
                                        <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{activeCat.tagline}</h4>
                                        <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">{activeCat.description}</p>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                      {activeCat.items.map((item, idx) => (
                                        <Link
                                          key={idx}
                                          to={`/services/${item.slug}`}
                                          onClick={() => setActiveDropdown(null)}
                                          className="group relative p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-2xl transition-all duration-300"
                                        >
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                              <h5 className="text-[15px] font-black text-gray-900 dark:text-white transition-colors mb-2 leading-tight group-hover:text-brand-blue">
                                                {item.name}
                                                {item.crossDepartment && (
                                                  <span className="block mt-1 text-[10px] text-brand-blue font-black uppercase tracking-wider">
                                                    Part of {item.crossDepartment}
                                                  </span>
                                                )}
                                              </h5>
                                              <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
                                                {item.shortDescription}
                                              </p>
                                            </div>
                                            <div className="mt-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-brand-blue group-hover:rotate-[-45deg]">
                                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                            </div>
                                          </div>
                                          <div
                                            className="absolute bottom-4 left-6 right-6 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"
                                            style={{ backgroundColor: activeCat.accentColor }}
                                          ></div>
                                        </Link>
                                      ))}
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mega Menu for Who We Are */}
                  {activeDropdown === link.id && link.isMegaMenu && link.type === 'whoWeAre' && (
                    <div 
                      className="fixed left-4 right-4 lg:left-10 lg:right-10 top-[138px] bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] p-10 pointer-events-auto"
                      onMouseEnter={() => setActiveDropdown(link.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      <div className="max-w-[1400px] mx-auto">
                        <div className="mb-10 flex items-end justify-between">
                          <div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Who We Are</h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Discover the engineering excellence and values driving global transformation.</p>
                          </div>
                          <Link to="/about-us" className="text-brand-blue font-black flex items-center gap-2 hover:gap-3 transition-all mb-2">
                            Our Story <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4">
                          {whoWeAreItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                              <Link
                                key={index}
                                to={item.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl transition-all duration-300"
                              >
                                <div className="flex flex-col items-center text-center gap-4">
                                  <Realistic3DIcon 
                                    icon={IconComponent} 
                                    className="w-14 h-14 group-hover:scale-110 transition-transform" 
                                    iconSize="w-6 h-6" 
                                    theme="brand" 
                                  />
                                  <h4 className="font-black text-[15px] text-gray-900 dark:text-white tracking-tight">
                                    {item.name}
                                  </h4>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mega Menu for Industries */}
                  {activeDropdown === link.id && link.isMegaMenu && link.type === 'industries' && (
                    <div 
                      className="fixed left-4 right-4 lg:left-10 lg:right-10 top-[138px] bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] p-10 pointer-events-auto"
                      onMouseEnter={() => setActiveDropdown(link.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      <div className="max-w-[1400px] mx-auto">
                        <div className="mb-10 flex items-end justify-between">
                          <div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Industries We Serve</h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Domain-specific engineering execution for global leaders.</p>
                          </div>
                          <Link to="/contact" className="text-brand-blue font-black flex items-center gap-2 hover:gap-3 transition-all mb-2">
                            Industry Consultation <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-6">
                          {industriesItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                              <Link
                                key={index}
                                to={item.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl transition-all duration-300 flex items-center gap-5"
                              >
                                <Realistic3DIcon 
                                  icon={IconComponent} 
                                  className="w-12 h-12 shrink-0 group-hover:scale-110 transition-transform" 
                                  iconSize="w-5 h-5" 
                                  theme="cyan" 
                                />
                                <h4 className="font-black text-[16px] text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                  {item.name}
                                </h4>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mega Menu for Insights */}
                  {activeDropdown === link.id && link.isMegaMenu && link.type === 'insights' && (
                    <div 
                      className="fixed left-4 right-4 lg:left-10 lg:right-10 top-[138px] bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] p-10 pointer-events-auto"
                      onMouseEnter={() => setActiveDropdown(link.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                      <div className="max-w-[1400px] mx-auto">
                        <div className="mb-10 flex items-end justify-between">
                          <div>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Insights & Knowledge</h3>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Expert perspectives on AI foundations, technical debt, and business velocity.</p>
                          </div>
                          <Link to="/blogs" className="text-brand-blue font-black flex items-center gap-2 hover:gap-3 transition-all mb-2">
                            View All Insights <ArrowRight className="w-5 h-5" />
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-5 gap-4">
                          {insightsItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                              <Link
                                key={index}
                                to={item.path}
                                onClick={() => setActiveDropdown(null)}
                                className="group p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl transition-all duration-300"
                              >
                                <div className="flex flex-col items-center text-center gap-4">
                                  <Realistic3DIcon 
                                    icon={IconComponent} 
                                    className="w-16 h-16 group-hover:scale-110 mb-2 transition-transform" 
                                    iconSize="w-7 h-7" 
                                    theme="brand" 
                                  />
                                  <h4 className="font-black text-[15px] text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                    {item.name}
                                  </h4>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Island Section - AI & Contact */}
            <div className="flex items-center gap-3">
              {/* "Ask eQORE AI" pill */}
              <button
                type="button"
                onClick={openEqoreChat}
                className="group relative hidden lg:inline-flex items-center justify-center rounded-full px-6 py-2.5 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-all duration-500 hover:scale-[1.05] active:scale-[0.98] border border-white/20"
                aria-label="Ask eQORE AI"
              >
                <style>{`
                  .ai-btn-fluid-base {
                    position: absolute;
                    inset: -50%;
                    background: linear-gradient(
                      -45deg, 
                      #1e3a8a 0%, #1e3a8a 10%,       /* Navy 10% */
                      #3b82f6 15%, #3b82f6 85%,      /* Blue 75% */
                      #06b6d4 90%, #06b6d4 95%,      /* Cyan 5% */
                      #1e3a8a 100%                   /* Return */
                    );
                    background-size: 200% 200%;
                    animation: consciousBreathe 6s ease-in-out infinite alternate;
                    z-index: 0;
                  }
                  .ai-btn-fluid-blobs {
                    position: absolute;
                    inset: -20%;
                    background-image: 
                      radial-gradient(circle at 30% 40%, rgba(168,85,247,0.8) 0%, transparent 15%),
                      radial-gradient(circle at 70% 60%, rgba(236,72,153,0.8) 0%, transparent 15%),
                      radial-gradient(circle at 45% 30%, rgba(239,68,68,0.9) 0%, transparent 10%),
                      radial-gradient(circle at 55% 70%, rgba(249,115,22,0.9) 0%, transparent 10%);
                    filter: blur(6px);
                    animation: synapseFire 4s ease-in-out infinite alternate;
                    mix-blend-mode: color-dodge;
                    z-index: 1;
                  }
                  .ai-btn-thread-layer {
                    position: absolute;
                    inset: -10%;
                    background-image: 
                      repeating-linear-gradient(60deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px),
                      repeating-linear-gradient(-60deg, transparent, transparent 4px, rgba(255,255,255,0.15) 4px, rgba(255,255,255,0.15) 5px);
                    background-size: 16px 16px;
                    z-index: 2;
                    opacity: 0.6;
                    mix-blend-mode: overlay;
                    animation: threadDrift 15s linear infinite;
                  }
                  .ai-btn-glass {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.3) 100%);
                    backdrop-filter: blur(2px);
                    z-index: 3;
                    transition: backdrop-filter 0.5s ease;
                  }
                  .group:hover .ai-btn-glass {
                    backdrop-filter: blur(0px);
                  }
                  @keyframes consciousBreathe {
                    0% { background-position: 0% 50%; transform: scale(1); }
                    50% { background-position: 100% 50%; transform: scale(1.02); }
                    100% { background-position: 0% 50%; transform: scale(1); }
                  }
                  @keyframes synapseFire {
                    0% { 
                      background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%; 
                      opacity: 0.3;
                    }
                    50% {
                      background-position: 5% 5%, -5% -5%, 5% -5%, -5% 5%;
                      opacity: 1;
                      filter: blur(4px) brightness(1.5);
                    }
                    100% { 
                      background-position: -5% 0%, 0% 5%, -5% -5%, 5% 0%; 
                      opacity: 0.4;
                    }
                  }
                  @keyframes threadDrift {
                    0% { background-position: 0px 0px; }
                    100% { background-position: 16px 16px; }
                  }
                `}</style>
                
                {/* Advanced Fluid Motion Graphics */}
                <div className="ai-btn-fluid-base"></div>
                <div className="ai-btn-fluid-blobs"></div>
                <div className="ai-btn-thread-layer"></div>
                <div className="ai-btn-glass"></div>
                
                <span className="relative z-10 flex items-center gap-2 text-[14px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Ask eQORE AI</span>
                </span>
              </button>

              {/* Desktop Contact Button */}
              <Link
                to="/contact"
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-black text-[14px] transition-all duration-300 hover:scale-[1.05] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Controls */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-white hover:bg-gray-200"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={onMenuClick}
                  className="p-3 bg-brand-gradient text-white rounded-full shadow-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mega Menus Rendered Outside the Pill to avoid filter clipping */}
        {navLinks.map((link) => (
          <React.Fragment key={`mega-${link.id}`}>
            {/* Bridge Area */}
            {activeDropdown === link.id && link.isMegaMenu && (
              <div 
                className="fixed left-0 right-0 top-[96px] h-12 pointer-events-auto z-[9998]"
                onMouseEnter={() => setActiveDropdown(link.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              />
            )}

            {/* Services Mega Menu */}
            {activeDropdown === link.id && link.isMegaMenu && link.type === 'services' && (
              <div 
                className={`fixed left-4 right-4 lg:left-10 lg:right-10 bottom-10 bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] overflow-hidden pointer-events-auto transition-all duration-500 ${
                  showUtilityBar ? 'top-[144px]' : 'top-[104px]'
                }`}
                onMouseEnter={() => setActiveDropdown(link.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <style>{`
                  @keyframes megaFadeIn {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                  }
                `}</style>

                <div className="h-full flex flex-col">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Enterprise Solutions</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{departmentsList.length} global departments · Specialized engineering execution</p>
                    </div>
                    <Link
                      to="/services"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white text-sm font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Explore All Services
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  {/* Two-Panel Body */}
                  <div className="flex flex-1 min-h-0 overflow-hidden">
                    {/* Left Panel - Department List */}
                    <div className="w-[380px] bg-gray-50/30 dark:bg-gray-800/20 border-r border-gray-100 dark:border-gray-800/50 overflow-y-auto shrink-0 custom-scrollbar">
                      <div className="py-4 px-4 space-y-1">
                        {servicesCategories.map((category, index) => {
                          const IconComponent = category.icon;
                          const isActive = activeMegaDept === index;
                          return (
                            <button
                              key={index}
                              onMouseEnter={() => setActiveMegaDept(index)}
                              onClick={() => {
                                setActiveDropdown(null);
                                navigate(`/departments/${category.slug}`);
                              }}
                              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group ${
                                isActive
                                  ? 'bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-100 dark:ring-gray-800'
                                  : 'hover:bg-white/50 dark:hover:bg-gray-900/40'
                              }`}
                            >
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                  isActive ? 'shadow-lg scale-110' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                                }`}
                                style={isActive ? { backgroundColor: category.accentColor } : undefined}
                              >
                                <IconComponent className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[13px] font-black uppercase tracking-wider transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700'}`}>
                                  {category.title}
                                </p>
                                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{category.serviceCount} Core Services</p>
                              </div>
                              <ArrowRight className={`w-4 h-4 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} style={{ color: category.accentColor }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Panel - Active Department's Services */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="px-12 py-10">
                        {servicesCategories[activeMegaDept] && (() => {
                          const activeCat = servicesCategories[activeMegaDept];
                          const ActiveIcon = activeCat.icon;
                          return (
                            <>
                              <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-800/50">
                                <div
                                  className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-2xl animate-pulse-slow"
                                  style={{ backgroundColor: activeCat.accentColor }}
                                >
                                  <ActiveIcon className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-[11px] uppercase tracking-[0.3em] font-black mb-1.5 opacity-60" style={{ color: activeCat.accentColor }}>
                                    {activeCat.fullName}
                                  </p>
                                  <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{activeCat.tagline}</h4>
                                  <p className="text-base text-gray-500 dark:text-gray-400 mt-2 font-medium max-w-2xl">{activeCat.description}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                                {activeCat.items.map((item, idx) => (
                                  <Link
                                    key={idx}
                                    to={`/services/${item.slug}`}
                                    onClick={() => setActiveDropdown(null)}
                                    className="group relative p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-2xl transition-all duration-300"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <h5 className="text-[15px] font-black text-gray-900 dark:text-white transition-colors mb-2 leading-tight group-hover:text-brand-blue">
                                          {item.name}
                                          {item.crossDepartment && (
                                            <span className="block mt-1 text-[10px] text-brand-blue font-black uppercase tracking-wider">
                                              Part of {item.crossDepartment}
                                            </span>
                                          )}
                                        </h5>
                                        <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium line-clamp-2">
                                          {item.shortDescription}
                                        </p>
                                      </div>
                                      <div className="mt-1 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-brand-blue group-hover:rotate-[-45deg]">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                      </div>
                                    </div>
                                    <div
                                      className="absolute bottom-4 left-6 right-6 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"
                                      style={{ backgroundColor: activeCat.accentColor }}
                                    ></div>
                                  </Link>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Who We Are Mega Menu */}
            {activeDropdown === link.id && link.isMegaMenu && link.type === 'whoWeAre' && (
              <div 
                className={`fixed left-4 right-4 lg:left-10 lg:right-10 bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] p-10 pointer-events-auto transition-all duration-500 ${
                  showUtilityBar ? 'top-[144px]' : 'top-[104px]'
                }`}
                onMouseEnter={() => setActiveDropdown(link.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="max-w-[1400px] mx-auto">
                  <div className="mb-10 flex items-end justify-between">
                    <div>
                      <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Who We Are</h3>
                      <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Discover the engineering excellence and values driving global transformation.</p>
                    </div>
                    <Link to="/about-us" className="text-brand-blue font-black flex items-center gap-2 hover:gap-3 transition-all mb-2">
                      Our Story <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4">
                    {whoWeAreItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className="group p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="flex flex-col items-center text-center gap-4">
                            <Realistic3DIcon 
                              icon={IconComponent} 
                              className="w-14 h-14 group-hover:scale-110 transition-transform" 
                              iconSize="w-6 h-6" 
                              theme="brand" 
                            />
                            <h4 className="font-black text-[15px] text-gray-900 dark:text-white tracking-tight">
                              {item.name}
                            </h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Industries Mega Menu */}
            {activeDropdown === link.id && link.isMegaMenu && link.type === 'industries' && (
              <div 
                className={`fixed left-4 right-4 lg:left-10 lg:right-10 bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] p-10 pointer-events-auto transition-all duration-500 ${
                  showUtilityBar ? 'top-[144px]' : 'top-[104px]'
                }`}
                onMouseEnter={() => setActiveDropdown(link.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="max-w-[1400px] mx-auto">
                  <div className="mb-10 flex items-end justify-between">
                    <div>
                      <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Industries We Serve</h3>
                      <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Domain-specific engineering execution for global leaders.</p>
                    </div>
                    <Link to="/contact" className="text-brand-blue font-black flex items-center gap-2 hover:gap-3 transition-all mb-2">
                      Industry Consultation <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6">
                    {industriesItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className="group p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl transition-all duration-300 flex items-center gap-5"
                        >
                          <Realistic3DIcon 
                            icon={IconComponent} 
                            className="w-12 h-12 shrink-0 group-hover:scale-110 transition-transform" 
                            iconSize="w-5 h-5" 
                            theme="cyan" 
                          />
                          <h4 className="font-black text-[16px] text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                            {item.name}
                          </h4>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Insights Mega Menu */}
            {activeDropdown === link.id && link.isMegaMenu && link.type === 'insights' && (
              <div 
                className={`fixed left-4 right-4 lg:left-10 lg:right-10 bg-white/95 dark:bg-black/95 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-gray-800 z-[9999] p-10 pointer-events-auto transition-all duration-500 ${
                  showUtilityBar ? 'top-[144px]' : 'top-[104px]'
                }`}
                onMouseEnter={() => setActiveDropdown(link.id)}
                onMouseLeave={() => setActiveDropdown(null)}
                style={{ animation: 'megaFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                <div className="max-w-[1400px] mx-auto">
                  <div className="mb-10 flex items-end justify-between">
                    <div>
                      <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Insights & Knowledge</h3>
                      <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Expert perspectives on AI foundations, technical debt, and business velocity.</p>
                    </div>
                    <Link to="/blogs" className="text-brand-blue font-black flex items-center gap-2 hover:gap-3 transition-all mb-2">
                      View All Insights <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4">
                    {insightsItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={index}
                          to={item.path}
                          onClick={() => setActiveDropdown(null)}
                          className="group p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-gray-900 hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="flex flex-col items-center text-center gap-4">
                            <Realistic3DIcon 
                              icon={IconComponent} 
                              className="w-16 h-16 group-hover:scale-110 mb-2 transition-transform" 
                              iconSize="w-7 h-7" 
                              theme="brand" 
                            />
                            <h4 className="font-black text-[15px] text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                              {item.name}
                            </h4>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </header>
      
      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default Header;