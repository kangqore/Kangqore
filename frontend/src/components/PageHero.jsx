import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SecondaryButton from './ui/SecondaryButton';

/**
 * Reusable Page Hero Component
 * Based on the Partners page design - blue gradient hero with pattern overlay
 * 
 * @param {Object} props
 * @param {string} props.badge - Small badge text (e.g., "About Us", "Services")
 * @param {string} props.title - Main heading (can include HTML for gradient text)
 * @param {React.ReactNode} props.titleHighlight - Text to highlight with gradient
 * @param {string} props.description - Hero description text
 * @param {Object} props.primaryButton - Primary CTA button { text, link }
 * @param {Object} props.secondaryButton - Secondary button { text, link }
 * @param {Array} props.stats - Array of stat objects { value, label, color }
 * @param {boolean} props.showWave - Whether to show wave divider at bottom (default: true)
 */
const PageHero = ({
  badge,
  title,
  titleHighlight,
  description,
  primaryButton = { text: 'Get Started', link: '/contact' },
  secondaryButton,
  stats = [],
  showWave = true,
  videoBackground,
  breadcrumb
}) => {
  return (
    <section className={`relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden ${!videoBackground ? 'bg-[#F5F5F7]' : 'bg-[#1D1D1F]'}`}>
      {/* Video Background */}
      {videoBackground && (
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={videoBackground} type="video/mp4" />
          </video>
          {/* 40% Black overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}

      {/* Background Pattern */}
      {!videoBackground && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]"></div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Breadcrumb inside hero */}
            {breadcrumb && breadcrumb.length > 0 && (
              <nav className={`flex flex-wrap items-center gap-1.5 text-xs font-medium mb-6 tracking-wide ${videoBackground ? 'text-white/50' : 'text-gray-400'}`} aria-label="Breadcrumb">
                {breadcrumb.map((crumb, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className={`flex-shrink-0 ${videoBackground ? 'text-white/30' : 'text-gray-300'}`}>/</span>}
                    {crumb.link ? (
                      <Link to={crumb.link} className={`whitespace-nowrap transition-colors duration-200 ${videoBackground ? 'hover:text-white/80' : 'hover:text-gray-700 dark:text-gray-300'}`}>{crumb.label}</Link>
                    ) : (
                      <span className={`font-semibold ${videoBackground ? 'text-white/70' : 'text-gray-600 dark:text-gray-400'}`}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            {badge && (
              <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8 ${videoBackground ? 'bg-white dark:bg-gray-900 dark:border-gray-800/10 text-white border border-white/20' : 'bg-[#1D1D1F] text-white'}`}>
                {badge}
              </span>
            )}
            <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-semibold tracking-tighter leading-[0.95] mb-8 font-display ${videoBackground ? 'text-white' : 'text-[#1D1D1F]'}`}>
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">
                    {titleHighlight}
                  </span>
                </>
              )}
            </h1>
            <div className={`text-xl md:text-2xl font-light tracking-tight leading-snug mb-10 space-y-4 max-w-3xl ${videoBackground ? 'text-white/70' : 'text-gray-500'}`}>
              {description}
            </div>
            <div className="flex flex-wrap gap-6 items-center">
              {primaryButton && (
                <Link
                  to={primaryButton.link}
                  className={`inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group ${videoBackground ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-[#1D1D1F]' : 'bg-[#1D1D1F] text-white'}`}
                >
                  {primaryButton.text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              {secondaryButton && (
                <SecondaryButton 
                  text={secondaryButton.text} 
                  link={secondaryButton.link} 
                  theme={videoBackground ? 'glass' : 'dark'}
                />
              )}
            </div>
          </div>

          {/* Right - Stats Cards */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[24px] p-8 hover:scale-[1.02] transition-transform duration-500 shadow-sm text-center">
                  <div className={`stat-counter-text text-4xl lg:text-5xl font-semibold tracking-tighter mb-2 ${stat.color || 'text-[#1D1D1F]'}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-500 font-medium italic tracking-tight text-lg leading-tight">{stat.label}</div>
                  {stat.sublabel && (
                    <div className="text-gray-500 text-sm mt-2">{stat.sublabel}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wave Divider */}
      {showWave && (
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      )}
    </section>
  );
};

export default PageHero;
