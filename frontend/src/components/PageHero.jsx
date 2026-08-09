import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SecondaryButton from './ui/SecondaryButton';
import { BackgroundBeams } from './ui/background-beams';

/**
 * Reusable Page Hero Component
 * Upgraded to match the premium UI/UX container design of the HomePage hero carousel
 * 
 * @param {Object} props
 * @param {string} props.badge - Small badge text (e.g., "About Us", "Services")
 * @param {string} props.title - Main heading (can include HTML for gradient text)
 * @param {React.ReactNode} props.titleHighlight - Text to highlight with gradient
 * @param {string} props.description - Hero description text
 * @param {Object} props.primaryButton - Primary CTA button { text, link }
 * @param {Object} props.secondaryButton - Secondary button { text, link }
 * @param {Array} props.stats - Array of stat objects { value, label, color }
 * @param {boolean} props.showWave - Whether to show wave divider at bottom (default: false)
 */
const PageHero = ({
  badge,
  title,
  titleHighlight,
  description,
  primaryButton,
  secondaryButton,
  stats = [],
  showWave = false,
  videoBackground,
  showBeams = false,
  breadcrumb,
  children
}) => {
  return (
    <div className="w-full h-[100svh] bg-white dark:bg-black p-2 relative transition-colors duration-500">
      <section className="relative w-full h-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228] pt-[194px] lg:pt-[250px] pb-12">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {showBeams ? (
            <BackgroundBeams />
          ) : videoBackground ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={videoBackground} type="video/mp4" />
            </video>
          ) : (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Subtle radial gradient grid for tech aesthetic */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]"></div>
            </div>
          )}
          
          {/* Gradients matching home page depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
        {/* Content Wrapper */}
        <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10 flex flex-col pb-8 sm:pb-12">
          <div className={`flex-1 grid gap-12 lg:gap-16 items-start sm:items-center ${stats.length > 0 ? 'lg:grid-cols-2' : ''}`}>
            {/* Left Content */}
            <div className="flex flex-col h-full max-w-5xl">
              
              {/* Breadcrumb */}
              {breadcrumb && breadcrumb.length > 0 && (
                <nav className="flex flex-wrap items-center gap-1.5 text-xs font-medium mb-8 tracking-wide text-white/50" aria-label="Breadcrumb">
                  {breadcrumb.map((crumb, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="flex-shrink-0 text-white/30">/</span>}
                      {crumb.link ? (
                        <Link to={crumb.link} className="whitespace-nowrap transition-colors duration-200 hover:text-white/80">{crumb.label}</Link>
                      ) : (
                        <span className="font-semibold text-white/70">{crumb.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}

              {/* Badge */}
              {badge && (
                <span className="inline-block self-start px-4 py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-8 bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                  {badge}
                </span>
              )}

              {/* Text Content (HomePage Layout) */}
              <div className="space-y-5 flex-shrink-0">
                <h1 className="text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white animate-fade-in">
                  {title}
                  {titleHighlight && (
                    <>
                      <br />
                      <span className="bg-brand-gradient bg-clip-text text-transparent">
                        {titleHighlight}
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-[1.8] max-w-3xl font-medium animate-fade-in py-4 sm:py-6">
                  {description}
                </p>
              </div>

              {/* Buttons (HomePage CTA UI) */}
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-8 animate-fade-in">
                {primaryButton && (
                  <Link
                    to={primaryButton.link}
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/90 hover:bg-white backdrop-blur-xl text-gray-900 shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                    <span className="relative z-10 text-gray-900 font-bold tracking-wide text-[13px] uppercase">
                      {primaryButton.text}
                    </span>
                    <div className="relative z-10 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-blue shadow-md">
                      <ArrowRight className="w-4 h-4 text-white transition-all duration-500 group-hover:translate-x-0.5" />
                    </div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-cyan-400/50 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>
                )}
                {secondaryButton && (
                  <Link
                    to={secondaryButton.link}
                    className="group inline-flex items-center justify-center sm:justify-start gap-2 px-4 py-2 hover:opacity-80 transition-opacity duration-300"
                  >
                    <span className="text-[13px] font-bold text-white/90 tracking-wide uppercase">
                      {secondaryButton.text}
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right - Stats Cards (Adapted for dark theme) */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 lg:pl-10 mt-12 lg:mt-0 relative z-10 animate-fade-in">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-6 sm:p-8 hover:scale-[1.02] hover:bg-white/10 transition-all duration-500 text-center shadow-2xl">
                    <div className={`text-4xl lg:text-5xl font-bold tracking-tighter mb-2 ${stat.color || 'text-white'}`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-400 font-medium tracking-tight text-sm sm:text-base leading-tight uppercase">{stat.label}</div>
                    {stat.sublabel && (
                      <div className="text-gray-500 text-xs mt-2">{stat.sublabel}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wave Divider (Disabled by default to match home page look) */}
        {showWave && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-white dark:text-black transition-colors duration-500">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
            </svg>
          </div>
        )}

        {children && (
          <div className="absolute bottom-[102px] sm:bottom-[114px] left-0 right-0 z-30">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
              {children}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default PageHero;
