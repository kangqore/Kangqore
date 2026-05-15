import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Globe, Menu, X, LogIn, LogOut, UserCircle, Search, Phone, ArrowRight, Building2, Users, Handshake, MessageSquare, Sparkles, Briefcase, TrendingUp, MapPin, UsersRound, Palette, BookOpen, FileText, Calendar, FileSpreadsheet, Award, Landmark, Shield, GraduationCap, Heart, FlaskConical, Tv, ShoppingCart, Plane, Zap, Factory, Database, Package, Sun, Moon, Mic } from 'lucide-react';
import { navigationItems } from '../mock/mockData';
import { useAuth } from '../context/AuthContext';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import GlobalSearch from './GlobalSearch';
import LanguageSwitcher from './LanguageSwitcher';
import { useTheme } from '../context/ThemeContext';
import Realistic3DIcon from './ui/Realistic3DIcon';

const Header = ({ onMenuClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // State for the mega-menu hover panel
  const [activeMegaDept, setActiveMegaDept] = useState(0);

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
    { name: t('nav.what_we_do'), items: navigationItems.services, isMegaMenu: true, type: 'services' },
    { name: t('nav.who_we_are'), items: whoWeAreItems, isMegaMenu: true, type: 'whoWeAre' },
    { name: t('nav.industries'), items: industriesItems, isMegaMenu: true, type: 'industries' },
    { name: t('nav.insights'), items: insightsItems, isMegaMenu: true, type: 'insights' }
  ];

  return (
    <>
      <header className="bg-white dark:bg-black shadow-sm dark:shadow-gray-900/50">
        {/* Top utility bar - Hidden on mobile/tablet, visible on lg and up */}
        <div className="hidden lg:block border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-10 text-sm">
              <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                <Link to="/careers" className="hover:text-gray-900 dark:text-white dark:hover:text-white transition-colors">Careers</Link>
                <Link to="/news" className="hover:text-gray-900 dark:text-white dark:hover:text-white transition-colors">News</Link>
                <Link to="/communities" className="hover:text-gray-900 dark:text-white dark:hover:text-white transition-colors">Communities</Link>
                <Link to="/investors" className="hover:text-gray-900 dark:text-white dark:hover:text-white transition-colors">Investors</Link>

                <LanguageSwitcher />
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
                      className="flex items-center gap-1 hover:text-brand-blue transition-colors font-medium"
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
                      className="flex items-center gap-1 hover:text-red-600 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login"
                    className="flex items-center gap-1.5 hover:text-brand-blue transition-colors font-medium group"
                  >
                    <div className="relative w-5 h-5">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="userGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1a1a1a" />
                            <stop offset="100%" stopColor="#4a4a4a" />
                          </linearGradient>
                        </defs>
                        <circle cx="12" cy="8" r="4" stroke="url(#userGradient)" strokeWidth="2" fill="none" className="group-hover:stroke-blue-600 transition-colors"/>
                        <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="url(#userGradient)" strokeWidth="2" strokeLinecap="round" fill="none" className="group-hover:stroke-blue-600 transition-colors"/>
                      </svg>
                    </div>
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center"
                onClick={() => setActiveDropdown(null)}
              >
                <img 
                  src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" 
                  alt="Kangqore Logo" 
                  className="h-32 lg:h-48"
                  style={{ filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(2395%) hue-rotate(201deg) brightness(95%) contrast(101%)' }}
                />
              </Link>
            </div>

            {/* Desktop Navigation - Centered (Hidden on mobile/tablet) */}
            <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
              >
                {link.isDirectLink ? (
                  <Link 
                    to={link.path}
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-colors py-2 font-medium"
                  >
                    <span>{link.name}</span>
                  </Link>
                ) : (
                  <button 
                    className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-brand-blue transition-colors py-2 font-medium"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                
                {/* Bridge area to prevent menu from closing */}
                {activeDropdown === link.name && link.isMegaMenu && (
                  <div 
                    className="absolute top-full left-0 right-0 h-4"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  />
                )}
                
                {/* Mega Menu for Services (What We Do) */}
                {activeDropdown === link.name && link.isMegaMenu && link.type === 'services' && (
                  <div 
                    className="fixed left-0 right-0 top-[120px] bottom-0 bg-white dark:bg-black shadow-2xl border-t border-gray-100 dark:border-gray-700 z-[9999] overflow-hidden"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                    style={{ animation: 'megaFadeIn 0.25s ease-out' }}
                  >
                    <style>{`
                      @keyframes megaFadeIn {
                        from { opacity: 0; transform: translateY(-8px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>

                    <div className="h-full flex flex-col">
                      {/* Top Bar */}
                      <div className="flex items-center justify-between px-10 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-900/60 shrink-0">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Departments</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{departmentsList.length} departments · {departmentsList.reduce((a, s) => a + departmentsData[s].serviceCount, 0)} services</p>
                        </div>
                        <Link
                          to="/services"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 group"
                        >
                          View All Services
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                      
                      {/* Two-Panel Body */}
                      <div className="flex flex-1 min-h-0 overflow-hidden">
                        {/* Left Panel - Department List */}
                        <div className="w-[340px] bg-gray-50/80 dark:bg-gray-800/80 border-r border-gray-100 dark:border-gray-700 overflow-y-auto shrink-0" style={{ scrollbarWidth: 'thin' }}>
                          <div className="py-3 px-3">
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
                                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 group mb-0.5 ${
                                    isActive
                                      ? 'bg-white dark:bg-black dark:border-gray-800 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-gray-100'
                                      : 'hover:bg-white dark:bg-black dark:border-gray-800/60'
                                  }`}
                                >
                                  <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                                      isActive
                                        ? 'shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 group-hover:bg-gray-200'
                                    }`}
                                    style={isActive ? { backgroundColor: category.accentColor } : undefined}
                                  >
                                    <IconComponent className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-300'}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:text-white'}`}>
                                      {category.title.toUpperCase()}
                                    </p>
                                    <p
                                      className="text-[11px] transition-colors"
                                      style={isActive ? { color: category.accentColor } : undefined}
                                    >
                                      {isActive ? category.tagline : `${category.serviceCount} services`}
                                    </p>
                                  </div>
                                  <ArrowRight
                                    className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                                      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 text-gray-400'
                                    }`}
                                    style={isActive ? { color: category.accentColor } : undefined}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Panel - Active Department's Services */}
                        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                          <div className="px-10 py-6">
                            {/* Department Header */}
                            {servicesCategories[activeMegaDept] && (() => {
                              const activeCat = servicesCategories[activeMegaDept];
                              const ActiveIcon = activeCat.icon;
                              return (
                                <>
                                  <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
                                    <div
                                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                                      style={{ backgroundColor: activeCat.accentColor }}
                                    >
                                      <ActiveIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <p
                                        className="text-[11px] uppercase tracking-widest font-semibold mb-0.5"
                                        style={{ color: activeCat.accentColor }}
                                      >
                                        {activeCat.fullName}
                                      </p>
                                      <h4 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{activeCat.tagline}</h4>
                                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{activeCat.description}</p>
                                    </div>
                                    <Link
                                      to={`/departments/${activeCat.slug}`}
                                      onClick={() => setActiveDropdown(null)}
                                      className="text-xs font-semibold transition-colors flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full hover:opacity-90"
                                      style={{
                                        color: '#ffffff',
                                        backgroundColor: activeCat.accentColor,
                                      }}
                                    >
                                      View Department
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  </div>

                                  {/* Banner brand badge */}
                                  <div className="mb-5 flex items-center gap-2 text-xs">
                                    <span className="uppercase tracking-widest text-gray-400">Featured:</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{activeCat.bannerBrand}</span>
                                  </div>

                                  {/* Top hero services grid (5 max) */}
                                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                                    {activeCat.items.map((item, idx) => (
                                      <Link
                                        key={idx}
                                        to={`/services/${item.slug}`}
                                        onClick={() => setActiveDropdown(null)}
                                        className="group relative p-5 rounded-2xl border border-gray-100 bg-white dark:bg-black dark:border-gray-800 hover:bg-gray-50 hover:border-gray-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-200"
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1 min-w-0">
                                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white transition-colors mb-1.5 leading-snug group-hover:underline">
                                              {item.name}
                                              {item.crossDepartment && (
                                                <span className="ml-1.5 text-[10px] text-gray-400 font-normal">
                                                  (in {item.crossDepartment})
                                                </span>
                                              )}
                                            </h5>
                                            {item.shortDescription && (
                                              <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 group-hover:text-gray-500 transition-colors">
                                                {item.shortDescription}
                                              </p>
                                            )}
                                          </div>
                                          <div className="mt-0.5 w-7 h-7 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center shrink-0 transition-all duration-200">
                                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:translate-x-0.5 transition-all" />
                                          </div>
                                        </div>
                                        {/* Bottom accent line — uses department accent color */}
                                        <div
                                          className="absolute bottom-0 left-5 right-5 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"
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

                      {/* Bottom CTA Bar */}
                      <div className="shrink-0 border-t border-gray-100 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 dark:from-black dark:via-black dark:to-black px-10 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
                            <p className="text-white/90 text-sm font-medium">Ready to transform your business?</p>
                            <p className="text-white/50 text-sm hidden xl:block">Let's discuss how our services can help you achieve your goals.</p>
                          </div>
                          <Link
                            to="/contact"
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-black text-gray-900 dark:text-white text-sm font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 group shrink-0"
                          >
                            Contact Us
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Who We Are */}
                {activeDropdown === link.name && link.isMegaMenu && link.type === 'whoWeAre' && (
                  <div 
                    className="fixed left-0 right-0 top-[120px] bg-white dark:bg-black dark:border-gray-800 shadow-2xl border-t border-gray-200 z-[9999] animate-fade-in"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="max-w-[1400px] mx-auto px-8 py-10">
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Who We Are</h3>
                        <p className="text-gray-600 dark:text-gray-400">Discover our story, leadership, and the values that drive our success</p>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-4">
                        {whoWeAreItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={index}
                              to={item.path}
                              onClick={() => setActiveDropdown(null)}
                              className="group p-4 rounded-xl hover:bg-blue-50 dark:bg-blue-900/20 transition-all duration-300"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Realistic3DIcon 
                                  icon={IconComponent} 
                                  className="w-10 h-10 group-hover:scale-110" 
                                  iconSize="w-5 h-5" 
                                  theme="brand" 
                                />
                                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                  {item.name}
                                </h4>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      
                      {/* CTA */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-brand-blue to-cyan-400 rounded-xl p-6 text-white shadow-xl">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                              <h4 className="text-xl font-bold mb-1">Join Our Team</h4>
                              <p className="text-white/90 text-sm">Explore career opportunities and grow with us.</p>
                            </div>
                            <Link
                              to="/careers"
                              onClick={() => setActiveDropdown(null)}
                              className="px-6 py-3 bg-white dark:bg-black dark:border-gray-800 text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                            >
                              View Careers
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Industries */}
                {activeDropdown === link.name && link.isMegaMenu && link.type === 'industries' && (
                  <div 
                    className="fixed left-0 right-0 top-[120px] bg-white dark:bg-black dark:border-gray-800 shadow-2xl border-t border-gray-200 z-[9999] animate-fade-in"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="max-w-[1400px] mx-auto px-8 py-10">
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Industries We Serve</h3>
                        <p className="text-gray-600 dark:text-gray-400">Delivering tailored solutions across diverse industry verticals</p>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        {industriesItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={index}
                              to={item.path}
                              onClick={() => setActiveDropdown(null)}
                              className="group p-4 rounded-xl hover:bg-blue-50 dark:bg-blue-900/20 transition-all duration-300 flex items-center gap-3"
                            >
                              <Realistic3DIcon 
                                icon={IconComponent} 
                                className="w-12 h-12 group-hover:scale-110" 
                                iconSize="w-6 h-6" 
                                theme="cyan" 
                              />
                              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                {item.name}
                              </h4>
                            </Link>
                          );
                        })}
                      </div>
                      
                      {/* CTA */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-brand-blue to-cyan-400 rounded-xl p-6 text-white shadow-xl">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                              <h4 className="text-xl font-bold mb-1">Industry-specific Solutions</h4>
                              <p className="text-white/90 text-sm">Let's discuss how we can help transform your industry.</p>
                            </div>
                            <Link
                              to="/contact"
                              onClick={() => setActiveDropdown(null)}
                              className="px-6 py-3 bg-white dark:bg-black dark:border-gray-800 text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                            >
                              Get Started
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu for Insights */}
                {activeDropdown === link.name && link.isMegaMenu && link.type === 'insights' && (
                  <div 
                    className="fixed left-0 right-0 top-[120px] bg-white dark:bg-black dark:border-gray-800 shadow-2xl border-t border-gray-200 z-[9999] animate-fade-in"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="max-w-[1400px] mx-auto px-8 py-10">
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Insights & Knowledge</h3>
                        <p className="text-gray-600 dark:text-gray-400">Expert perspectives on the future of AI, technology, and business strategy</p>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-4">
                        {insightsItems.map((item, index) => {
                          const IconComponent = item.icon;
                          return (
                            <Link
                              key={index}
                              to={item.path}
                              onClick={() => setActiveDropdown(null)}
                              className="group p-4 rounded-xl hover:bg-blue-50 dark:bg-blue-900/20 transition-all duration-300"
                            >
                              <div className="flex flex-col items-center text-center gap-3">
                                <Realistic3DIcon 
                                  icon={IconComponent} 
                                  className="w-16 h-16 group-hover:scale-110 mb-2" 
                                  iconSize="w-8 h-8" 
                                  theme="brand" 
                                />
                                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">
                                  {item.name}
                                </h4>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      
                      {/* Featured Insight / CTA */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 flex items-center gap-6">
                            <div className="w-24 h-24 bg-brand-gradient rounded-lg flex items-center justify-center shrink-0">
                              <Tv className="w-12 h-12 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">eQORE Podcast</h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Listen to industry experts discuss the latest in agentic AI.</p>
                              <Link to="/podcast" onClick={() => setActiveDropdown(null)} className="text-brand-blue font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                Listen Now <ArrowRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                          
                          <div className="bg-brand-gradient rounded-xl p-6 text-white shadow-xl flex items-center justify-between">
                            <div>
                              <h4 className="text-xl font-bold mb-1">Newsletter</h4>
                              <p className="text-white/90 text-sm">Get the latest insights delivered to your inbox.</p>
                            </div>
                            <Link
                              to="/newsletter"
                              onClick={() => setActiveDropdown(null)}
                              className="px-6 py-3 bg-white dark:bg-black dark:border-gray-800 text-brand-blue font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg whitespace-nowrap"
                            >
                              Subscribe
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Dropdown for other items */}
                {activeDropdown === link.name && !link.isMegaMenu && (
                  <>
                    {/* Bridge area for regular dropdowns */}
                    <div 
                      className="absolute top-full left-0 right-0 h-2"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    />
                    <div 
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-black dark:border-gray-800 shadow-xl rounded-lg border border-gray-100 py-2 z-50"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.items.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:bg-blue-900/20 hover:text-brand-blue transition-colors"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Search Button */}
            <button 
              onClick={() => setShowSearch(true)}
              className="hidden lg:flex p-3 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full transition-colors"
              data-testid="global-search-btn"
              title="Search"
            >
              <Search className="w-7 h-7 text-gray-700 dark:text-gray-200" strokeWidth={2.5} />
            </button>
            
            {/* Desktop Contact Button */}
            <Link 
              to="/contact"
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-full font-semibold transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
    
    {/* Global Search Modal */}
    <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default Header;