import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Award, Target, Users, 
  Lightbulb, Globe, Shield, Building2, Factory, ShoppingCart, Heart, 
  Briefcase, Zap, Star, Play, Pause, Search, Layers, Activity
} from 'lucide-react';
import PageHero from './PageHero';
import SEO from './SEO';
import Realistic3DIcon from './ui/Realistic3DIcon';
import AskEqoreCTA from './concierge/AskEqoreCTA';
import SecondaryButton from './ui/SecondaryButton';
import CaseStudiesSection from './services/shared/CaseStudiesSection';

// Custom Hook for Scroll Animations
const useScrollAnimation = (options = { threshold: 0.1, triggerOnce: true }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce) observer.unobserve(currentRef);
      } else if (!options.triggerOnce) {
        setIsVisible(false);
      }
    }, options);

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, isVisible];
};

// ─── Parallax Hook ────────────────────────────────────────────────────────────
// Returns a live `style` object with a `transform: translateY(Xpx)` value
// driven by window.scrollY × speed via requestAnimationFrame.
// speed > 0 → element moves DOWN slower than scroll (background layers)
// speed < 0 → element moves UP faster than scroll (foreground floats up)
const useParallax = (speed = 0.15, offset = 0) => {
  const ref = useRef(null);
  const rafId = useRef(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const compute = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      // distance from center of viewport to center of element
      const distFromCenter = rect.top + rect.height / 2 - viewH / 2;
      setY(distFromCenter * speed + offset);
    };

    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(compute);
    };

    compute(); // seed initial value
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [speed, offset]);

  return [ref, { transform: `translateY(${y}px)`, willChange: 'transform' }];
};

// Trust Pillars Carousel Component
const TrustPillarsCarousel = ({ pillars, rightPanelTitle, rightPanelDescription, rightPanelButtonText }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % pillars.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + pillars.length) % pillars.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance slides every 5000ms (5 seconds) when playing
  React.useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillars.length, isPlaying]);

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Panel - Sliding Cards */}
        <div className="relative bg-brand-gradient rounded-3xl p-8 lg:p-12 min-h-[500px] flex flex-col justify-between shadow-2xl border border-white/10">
          <div className="flex-1 transition-all duration-300 ease-in-out">
            {/* Dynamic Icon Rendering */}
            <div className="mb-8">
              {(() => {
                const defaultIcons = [Shield, Search, Activity, Layers, Target, Globe, Zap];
                const IconComponent = pillars[currentSlide].icon || defaultIcons[currentSlide % defaultIcons.length];
                return (
                  <Realistic3DIcon 
                    icon={IconComponent} 
                    className="w-16 h-16" 
                    iconSize="w-8 h-8" 
                    theme="glass" 
                  />
                );
              })()}
            </div>

            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-300 font-display tracking-tight leading-[1.1]">
              {pillars[currentSlide].title}
            </h3>
            <p className="text-xl text-white/80 leading-relaxed transition-all duration-300 font-light">
              {pillars[currentSlide].description}
            </p>
          </div>
          
          {/* Custom Navigation Pill */}
          <div className="flex items-center gap-1 mt-12 bg-white dark:bg-gray-900 dark:border-gray-800/5 backdrop-blur-md border border-white/10 rounded-full w-fit p-1.5 shadow-xl">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full hover:bg-white dark:bg-black/10 flex items-center justify-center transition-colors text-white"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full hover:bg-white dark:bg-black/10 flex items-center justify-center transition-colors text-white mx-1"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full hover:bg-white dark:bg-black/10 flex items-center justify-center transition-colors text-white"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex gap-1.5 px-4 items-center border-l border-white/10 ml-2 h-6">
              {pillars.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentSlide ? 'w-6 bg-white dark:bg-black' : 'w-1.5 bg-white dark:bg-black/30 hover:bg-white dark:bg-black/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Static Content */}
        <div className="relative p-8 lg:p-12 min-h-[500px] flex flex-col justify-center">
          <div className="relative z-10 max-w-xl">
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-brand-blue rounded-full mb-8"></div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 font-display tracking-tight leading-tight">
              {rightPanelTitle || 'Our AI-Led Systems: Built for Trust, Control & Scalability'}
            </h2>
            <p className="text-xl text-white/70 leading-relaxed mb-10 font-light tracking-wide">
              {rightPanelDescription || 'Kangqore designs agentic AI systems that operate with autonomy — without compromising security, compliance, or governance. By combining AI-native engineering with enterprise-grade control frameworks, we enable organizations to scale intelligent systems responsibly and confidently.'}
            </p>
            <SecondaryButton 
              text={rightPanelButtonText || 'Request a Consultation'} 
              link="/contact" 
              theme="glass"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Solutions Carousel Component  
const SolutionsCarousel = ({ solutions }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % solutions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + solutions.length) % solutions.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance slides every 3000ms (3 seconds) when playing
  React.useEffect(() => {
    if (!isPlaying || !solutions || solutions.length === 0) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solutions?.length, isPlaying]);

  if (!solutions || solutions.length === 0) return null;

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Solution Card */}
        <div className="relative bg-brand-gradient rounded-3xl p-10 lg:p-12 min-h-[450px] flex flex-col justify-between shadow-2xl">
          <div className="flex-1 transition-all duration-300 ease-in-out">
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 transition-all duration-300">
              {solutions[currentSlide].title}
            </h3>
            <p className="text-lg text-white/95 leading-relaxed transition-all duration-300">
              {solutions[currentSlide].description}
            </p>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-white dark:bg-black/20 hover:bg-white dark:bg-black/30 flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Previous solution"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex gap-2 flex-1 justify-center">
              {solutions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? 'w-8 bg-white dark:bg-black' : 'w-2 bg-white dark:bg-black/40'
                  }`}
                  aria-label={`Go to solution ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full bg-white dark:bg-black/20 hover:bg-white dark:bg-black/30 flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-white dark:bg-black/20 hover:bg-white dark:bg-black/30 flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Next solution"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Right - Content on Background (No Panel) */}
        <div className="relative">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Our Solutions
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Kangqore delivers next-generation AI-powered solutions that help organizations accelerate innovation, enhance operational efficiency, and enable intelligent customer interactions.
            </p>
            <p className="text-lg text-white/90 leading-relaxed">
              By combining advanced AI engineering with deep domain expertise, we help enterprises build Agile, Secure, and Scalable digital journeys aligned to their specific needs.
            </p>
            <div className="mt-8">
              <SecondaryButton 
                text="Request a Consultation" 
                link="/contact" 
                theme="light"
              />
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Capabilities Carousel Component
const CapabilitiesCarousel = ({ cards, iconArray }) => {
  // Bento grid layout configuration based on card count
  // Layout pattern (for 6 cards):
  //   Row 1: [card0] [card1] [card2] [card3 — tall, spans 2 rows]
  //   Row 2: [card4]   [card5 — wide, spans 2 cols]  [card3 cont.]
  const getGridPlacement = (index, total) => {
    if (total >= 6) {
      // 6+ cards: classic bento with tall right card
      const placements = [
        'col-span-1 row-span-1',                          // 0: top-left
        'col-span-1 row-span-1',                          // 1: top-center-left
        'col-span-1 row-span-1',                          // 2: top-center-right
        'col-span-1 row-span-2 bento-tall',               // 3: right tall
        'col-span-1 row-span-1',                          // 4: bottom-left
        'col-span-2 row-span-1 bento-wide',               // 5: bottom-center wide
      ];
      return placements[index] || 'col-span-1 row-span-1';
    } else if (total === 5) {
      const placements = [
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
        'col-span-1 row-span-2 bento-tall',
        'col-span-3 row-span-1 bento-wide',
      ];
      return placements[index] || 'col-span-1 row-span-1';
    } else if (total === 4) {
      const placements = [
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
      ];
      return placements[index] || 'col-span-1 row-span-1';
    } else {
      // 3 or fewer: simple equal grid
      return 'col-span-1 row-span-1';
    }
  };

  // Only show first 6 cards in the bento grid (extras are hidden)
  const visibleCards = cards.slice(0, 6);
  const gridCols = visibleCards.length <= 4 ? visibleCards.length : 4;

  return (
    <div className="relative">
      {/* Bento Grid */}
      <div
        className="bento-capabilities-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridAutoRows: 'minmax(280px, 1fr)',
          gap: '8px',
        }}
      >
        {visibleCards.map((card, idx) => {
          const placement = getGridPlacement(idx, visibleCards.length);
          const isTall = placement.includes('bento-tall');
          const isWide = placement.includes('bento-wide');

          // Fallback image placeholders for cards without bgImage
          const fallbackImages = [
            '/images/capabilities/data-analytics.png',
            '/images/capabilities/software-engineering.png',
            '/images/capabilities/business-strategy.png',
            '/images/capabilities/digital-transformation.png',
            '/images/capabilities/cloud-infrastructure.png',
            '/images/capabilities/ai-cognitive.png',
          ];
          const bgImage = card.bgImage || fallbackImages[idx % fallbackImages.length];

          return (
            <div
              key={idx}
              className={`bento-card relative rounded-[16px] overflow-hidden group cursor-pointer ${placement}`}
              style={{ minHeight: isTall ? '576px' : '280px' }}
            >
              {/* Background Image — fills entire card */}
              <div className="absolute inset-0 z-0">
                <img
                  src={bgImage}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Text Overlay — positioned at top with cream/frosted background */}
              <div className="relative z-10 flex flex-col h-full">
                <div
                  className="bento-text-overlay p-5 lg:p-6"
                  style={{
                    background: 'linear-gradient(180deg, rgba(245,244,240,0.92) 0%, rgba(245,244,240,0.85) 70%, rgba(245,244,240,0) 100%)',
                  }}
                >
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight leading-snug mb-1.5">
                    {card.title}
                  </h3>
                  {card.description && (
                    <p className="text-[13px] lg:text-sm text-gray-600 leading-relaxed font-normal line-clamp-3">
                      {card.description}
                    </p>
                  )}
                </div>
                {/* Spacer to push content to bottom if needed */}
                <div className="flex-1" />
              </div>

              {/* Subtle hover overlay */}
              <div className="absolute inset-0 z-[5] bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Show remaining cards if more than 6 */}
      {cards.length > 6 && (
        <div
          className="mt-2"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(cards.length - 6, 4)}, 1fr)`,
            gap: '8px',
          }}
        >
          {cards.slice(6).map((card, idx) => {
            const realIdx = idx + 6;
            const fallbackImages = [
              '/images/capabilities/data-analytics.png',
              '/images/capabilities/software-engineering.png',
              '/images/capabilities/business-strategy.png',
              '/images/capabilities/digital-transformation.png',
              '/images/capabilities/cloud-infrastructure.png',
              '/images/capabilities/ai-cognitive.png',
            ];
            const bgImage = card.bgImage || fallbackImages[realIdx % fallbackImages.length];

            return (
              <div
                key={realIdx}
                className="bento-card relative rounded-[16px] overflow-hidden group cursor-pointer"
                style={{ minHeight: '280px' }}
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={bgImage}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className="bento-text-overlay p-5 lg:p-6"
                    style={{
                      background: 'linear-gradient(180deg, rgba(245,244,240,0.92) 0%, rgba(245,244,240,0.85) 70%, rgba(245,244,240,0) 100%)',
                    }}
                  >
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 tracking-tight leading-snug mb-1.5">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="text-[13px] lg:text-sm text-gray-600 leading-relaxed font-normal line-clamp-3">
                        {card.description}
                      </p>
                    )}
                  </div>
                  <div className="flex-1" />
                </div>
                <div className="absolute inset-0 z-[5] bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Optimized Reveal Animation */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, opacity;
        }
        
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Bento grid responsive */
        @media (max-width: 1023px) {
          .bento-capabilities-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .bento-capabilities-grid .bento-tall {
            grid-row: span 1 !important;
            min-height: 280px !important;
          }
          .bento-capabilities-grid .bento-wide {
            grid-column: span 2 !important;
          }
          .bento-capabilities-grid .col-span-1 {
            grid-column: span 1;
          }
          .bento-capabilities-grid .col-span-2 {
            grid-column: span 2;
          }
          .bento-capabilities-grid .col-span-3 {
            grid-column: span 2;
          }
        }

        @media (max-width: 639px) {
          .bento-capabilities-grid {
            grid-template-columns: 1fr !important;
          }
          .bento-capabilities-grid .bento-tall,
          .bento-capabilities-grid .bento-wide {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            min-height: 260px !important;
          }
          .bento-capabilities-grid .col-span-1,
          .bento-capabilities-grid .col-span-2,
          .bento-capabilities-grid .col-span-3 {
            grid-column: span 1 !important;
          }
        }

        /* Bento card image zoom on hover */
        .bento-card:hover img {
          transform: scale(1.05);
        }
      `}} />
    </div>
  );
};

// Why Kangqore Carousel Component
const WhyKangqoreCarousel = ({ items }) => {
  const containerRef = React.useRef(null);
  
  const scrollLeft = () => {
    if (containerRef.current) containerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    if (containerRef.current) containerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel">
      {/* Scrollable Container */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-6 lg:gap-8 pb-12 pt-4 snap-x snap-mandatory hide-scrollbar pr-4 lg:pr-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-900 dark:border-gray-800 p-8 lg:p-10 rounded-[32px] hover:scale-[1.02] flex-none w-[320px] sm:w-[380px] lg:w-[420px] transition-transform duration-500 flex flex-col items-start relative min-h-[320px] shadow-sm shrink-0 snap-start"
            >
              <div className="mb-8">
                <Realistic3DIcon 
                  icon={item.icon} 
                  className="w-14 h-14" 
                  theme="dark" 
                />
              </div>
              <h3 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-4 leading-tight font-display pr-4">{item.title}</h3>
              <p className="text-gray-500 font-light tracking-tight leading-relaxed pr-8">{item.description}</p>
              
              {/* Floating Action Button (+ icon) */}
              <div className="absolute bottom-6 right-6 w-10 h-10 bg-[#1D1D1F] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 hover:bg-black transition-all duration-300 shadow-md">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons 
          Positioned below the carousel on the right side to match Apple UI reference */}
      <div className="flex justify-end pr-4 sm:pr-8 gap-3 mt-6">
        <button 
          onClick={scrollLeft} 
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-900 dark:text-white shadow-sm"
          aria-label="Previous card"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
            <path d="M5 1L11 7L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          onClick={scrollRight} 
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-900 dark:text-white shadow-sm"
          aria-label="Next card"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 1L11 7L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

// ─── Philosophy Accordion Item ────────────────────────────────────────────────
const PhilosophyAccordionItem = ({ feature, isOpen, onClick }) => {
   return (
      <div 
         className={`group rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden ${
            isOpen 
               ? 'bg-white dark:bg-gray-900 dark:border-gray-800 shadow-xl' 
               : 'bg-gray-50/50 hover:bg-white dark:bg-gray-900 dark:border-gray-800'
         }`}
         onClick={onClick}
      >
         <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Realistic3DIcon 
                  icon={feature.icon || Target} 
                  className="w-12 h-12" 
                  iconSize="w-5 h-5" 
                  theme={isOpen ? "dark" : "light"} 
               />
               <div>
                  <h4 className={`text-sm font-bold tracking-tight transition-colors duration-300 ${
                     isOpen ? 'text-gray-900 dark:text-white' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-300'
                  }`}>
                     {feature.title}
                  </h4>
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest transition-opacity duration-300 ${
                     isOpen ? 'text-black opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'
                  }`}>
                     {feature.label}
                  </p>
               </div>
            </div>
            <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-black' : 'text-gray-300'}`}>
               <ChevronDown className="w-5 h-5" />
            </div>
         </div>
         <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-5 pb-5 pt-0 ml-14">
               <p className="text-sm text-gray-500 font-light leading-relaxed pl-4">
                  {feature.content}
               </p>
            </div>
         </div>
      </div>
   );
};

const GenericMidPageCTA = ({ serviceName, ctaLink }) => {
  return (
    <section className="py-24 bg-[#FEFFFC]">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
          <div 
            className="absolute -inset-20 z-0" 
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/3182768/pexels-photo-3182768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10"></div>
          
          <div className="relative z-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">Assess Your {serviceName || 'Capabilities'} Maturity</h2>
            <p className="text-xl text-white/90 mb-10 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">
              Don't guess. Download the <strong className="text-white">Kangqore {serviceName || 'Maturity'} Scorecard</strong> to objectively assess your capabilities, readiness, and ROI potential.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SecondaryButton 
                text="Get Your Free Assessment Toolkit" 
                link={ctaLink || "/contact"} 
                theme="light"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicePageTemplate = ({ service, department, disableSEO = false }) => {
  const [openFaq, setOpenFaq] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const [activePhilosophyIndex, setActivePhilosophyIndex] = useState(0);
  
  // Animation Hooks for each section
  const [capabilitiesRef, capabilitiesVisible] = useScrollAnimation({ threshold: 0.1 });
  const [highFidelityNarrativeRef, highFidelityNarrativeVisible] = useScrollAnimation({ threshold: 0.1 });
  const [highFidelityPhilosophyRef, highFidelityPhilosophyVisible] = useScrollAnimation({ threshold: 0.1 });
  const [philosophyRef, philosophyVisible] = useScrollAnimation({ threshold: 0.1 });
  const [matrixRef, matrixVisible] = useScrollAnimation({ threshold: 0.1 });
  const [trustPillarsRef, trustPillarsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [whyKangqoreRef, whyKangqoreVisible] = useScrollAnimation({ threshold: 0.1 });
  const [industriesRef, industriesVisible] = useScrollAnimation({ threshold: 0.1 });
  const [faqRef, faqVisible] = useScrollAnimation({ threshold: 0.1 });
  const [technologiesRef, technologiesVisible] = useScrollAnimation({ threshold: 0.1 });

  // ── Parallax refs (speed controls depth — lower = more subtle) ──
  const [parallaxNarrativeImgRef, parallaxNarrativeImgStyle] = useParallax(-0.08);   // image floats up
  const [parallaxNarrativeBgRef,  parallaxNarrativeBgStyle]  = useParallax(0.12);    // BG orb drifts down
  const [parallaxMatrixBgRef,     parallaxMatrixBgStyle]     = useParallax(0.1);     // matrix section BG
  const [parallaxSchematicRef,    parallaxSchematicStyle]    = useParallax(-0.15);   // schematic text lifts
  const [parallaxBlob1Ref,        parallaxBlob1Style]        = useParallax(0.15);    // deep bg orb
  const [parallaxBlob2Ref,        parallaxBlob2Style]        = useParallax(-0.1);    // mid bg orb
  const [parallaxCapHeadRef,      parallaxCapHeadStyle]      = useParallax(-0.05);   // cap section header
  const [parallaxTrustBgRef,      parallaxTrustBgStyle]      = useParallax(0.09);    // trust BG orb
  const [parallaxWhyBgRef,        parallaxWhyBgStyle]        = useParallax(0.08);    // why kangqore BG
  const [parallaxIndustriesBgRef, parallaxIndustriesBgStyle] = useParallax(0.07);   // industries BG
  const [parallaxCtaBgRef,        parallaxCtaBgStyle]        = useParallax(0.12);   // CTA section BG orb

  // Staggered Matrix Tile Parallax (different speeds for rhythmic lift)
  const [parallaxTile1Ref, parallaxTile1Style] = useParallax(-0.02);
  const [parallaxTile2Ref, parallaxTile2Style] = useParallax(-0.04);
  const [parallaxTile3Ref, parallaxTile3Style] = useParallax(-0.06);
  const [parallaxTile4Ref, parallaxTile4Style] = useParallax(-0.08);
  const [parallaxTile5Ref, parallaxTile5Style] = useParallax(-0.10);
  const [parallaxTile6Ref, parallaxTile6Style] = useParallax(-0.12);

  const toggleCard = (index) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Use custom capabilities from service file or fallback to defaults
  const capabilityCards = service.capabilities || [
    { title: 'Strategy & Planning', items: [
      { heading: 'Assessment & Discovery', description: `Comprehensive analysis of your current state and ${service.name.toLowerCase()} requirements to identify opportunities.` },
      { heading: 'Roadmap Development', description: `Create a detailed implementation roadmap aligned with your business objectives and timelines.` },
      { heading: 'Architecture Design', description: `Design scalable and robust ${service.name.toLowerCase()} architecture tailored to your needs.` },
      { heading: 'Business Case Development', description: `Build compelling business cases with ROI projections and success metrics.` }
    ]},
    { title: 'Implementation & Delivery', items: [
      { heading: 'Agile Development', description: `Iterative development approach ensuring flexibility and rapid delivery of ${service.name.toLowerCase()} solutions.` },
      { heading: 'Integration Services', description: `Seamless integration with existing systems, APIs, and third-party platforms.` },
      { heading: 'Quality Assurance', description: `Rigorous testing protocols ensuring reliability, performance, and security standards.` },
      { heading: 'Change Management', description: `Comprehensive change management and user adoption programs for successful transitions.` }
    ]},
    { title: 'Operations & Optimization', items: [
      { heading: 'Managed Services', description: `24/7 monitoring, maintenance, and support to ensure optimal ${service.name.toLowerCase()} performance.` },
      { heading: 'Performance Optimization', description: `Continuous performance tuning and optimization to maximize efficiency and value.` },
      { heading: 'Analytics & Insights', description: `Data-driven insights and reporting to track KPIs and identify improvement opportunities.` },
      { heading: 'Continuous Innovation', description: `Stay ahead with latest ${(service?.name || 'service').toLowerCase()} trends, updates, and innovation initiatives.` }
    ]}
  ];

  // Use custom FAQs from service file or fallback to defaults
  const faqs = service.customFAQs || [
    { question: `What is ${service?.name || 'this service'} and how can it benefit my organization?`, answer: `${service?.name || 'This service'} helps organizations ${typeof service.description === 'string' ? service.description.toLowerCase() : 'achieve digital transformation'}. By implementing ${(service?.name || '').toLowerCase()}, you can improve efficiency, reduce costs, and gain competitive advantage.` },
    { question: `How long does a typical ${(service?.name || '').toLowerCase()} project take?`, answer: `Project duration varies based on scope and complexity. A typical engagement ranges from 8-16 weeks for initial implementation, with ongoing optimization. We work with you to define realistic timelines aligned with your business priorities.` },
    { question: `What industries do you serve for ${(service?.name || '').toLowerCase()}?`, answer: `We serve clients across all major industries including Banking, Healthcare, Retail, Manufacturing, Technology, and more. Our industry-specific expertise ensures solutions are tailored to your sector's unique requirements.` },
    { question: `How do you ensure successful delivery?`, answer: `We follow a proven methodology combining agile practices, quality assurance, and change management. Regular checkpoints, transparent communication, and dedicated project management ensure successful outcomes.` },
    { question: `What post-implementation support do you offer?`, answer: `We provide comprehensive support including 24/7 technical assistance, regular health checks, optimization recommendations, and training. Our team remains engaged to ensure you maximize value from your investment.` }
  ];

  // Use custom technologies from service file or fallback to defaults
  const technologies = service.technologies || ['AWS', 'Azure', 'Google Cloud', 'Kubernetes', 'Docker', 'Python', 'React', 'Node.js', 'TensorFlow', 'MongoDB'];

  // Use custom "Why Kangqore" reasons or fallback to defaults
  const iconMap = { Award, Target, Users, Lightbulb, Globe, Shield };
  const iconArray = [Award, Target, Users, Lightbulb, Globe, Shield];
  
  const whyKangqore = (service.whyKangqore || [
    { icon: Award, title: 'Proven Expertise', description: `Years of experience delivering successful ${(service?.name || '').toLowerCase()} projects across industries.` },
    { icon: Target, title: 'Tailored Solutions', description: 'Customized approaches that address your unique business challenges and goals.' },
    { icon: Users, title: 'Dedicated Team', description: 'Access to certified professionals with deep domain expertise.' },
    { icon: Lightbulb, title: 'Innovation Focus', description: 'Leveraging latest technologies and best practices for optimal results.' },
    { icon: Globe, title: 'Global Delivery', description: 'Scalable delivery model with resources across multiple geographies.' },
    { icon: Shield, title: 'Quality Assurance', description: 'Rigorous quality standards and proven methodologies ensure success.' }
  ]).map((item, index) => ({
    ...item,
    icon: item.icon || iconArray[index % iconArray.length]
  }));

  // Use custom industries or fallback to defaults
  const industryIconMap = { Building2, Heart, ShoppingCart, Factory, Zap, Briefcase };
  const industryIconArray = [Building2, Heart, ShoppingCart, Factory, Zap, Briefcase, Building2, Factory, Briefcase, Building2, ShoppingCart, Heart];
  
  const industries = (service.industries || [
    { name: 'Banking & Financial Services', icon: Building2 },
    { name: 'Healthcare & Life Sciences', icon: Heart },
    { name: 'Retail & Consumer Goods', icon: ShoppingCart },
    { name: 'Manufacturing', icon: Factory },
    { name: 'Technology', icon: Zap },
    { name: 'Professional Services', icon: Briefcase }
  ]).map((item, index) => ({
    ...item,
    icon: item.icon || industryIconArray[index % industryIconArray.length]
  }));

  // Button Config
  const primaryButton = service.primaryButton || { text: 'Schedule Your 30-min Discovery Call', link: '/contact' };
  const secondaryButton = service.secondaryButton === null ? null : (service.secondaryButton || { text: 'Explore Our Capabilities', link: `/departments/${department.slug}` });

  // ─── JSON-LD SCHEMA GENERATION (SEO/AEO/GEO) ────────────────────────────────
  const baseUrl = "https://kangqore.com";
  // The service slug isn't guaranteed natively, so we fall back to a safe route computation if not provided
  const safeSlug = service.slug || service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const serviceUrl = `${baseUrl}/services/${department.slug}/${safeSlug}`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "provider": {
      "@type": "Organization",
      "name": "Kangqore"
    },
    "description": service.description || service.shortDescription || service.name,
    "url": serviceUrl,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Service Capabilities",
      "itemListElement": (service.capabilities || []).map((cap, index) => ({
        "@type": "OfferCatalog",
        "position": index + 1,
        "name": cap.title,
        "description": cap.description || (cap.items && cap.items[0]?.description) || cap.title
      }))
    }
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": `${baseUrl}/services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": department.name,
        "item": `${baseUrl}/departments/${department.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": service.name,
        "item": serviceUrl
      }
    ]
  };

  const pageSchemas = [serviceSchema, breadcrumbSchema];
  if (faqSchema) pageSchemas.push(faqSchema);

  // Asset Inheritance Logic
  const videoBg = service.videoBackground || department.videoBackground;
  const finalCapabilityCards = capabilityCards.map(card => ({
    ...card,
    bgImage: card.bgImage || department.defaultCapabilityImage
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {!disableSEO && (
        <SEO
          title={service.name}
          description={service.description || service.shortDescription}
          schemas={pageSchemas}
          url={serviceUrl}
        />
      )}

      {/* Hero Section */}
      {service.heroSection ? service.heroSection : (
        <PageHero
          badge={null}
          title={service.titleLine1 || service.name}
          titleHighlight={service.titleHighlight || ""}
          description={service.fullDescription || service.description || service.shortDescription}
          primaryButton={primaryButton}
          secondaryButton={secondaryButton}
          stats={service.stats || [
            { value: '10+', label: 'Projects Delivered', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
            { value: '98%', label: 'Client Satisfaction', color: 'text-blue-400' },
            { value: '24/7', label: 'Support', color: 'text-sky-400' },
            { value: 'Global', label: 'Delivery', color: 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent' },
          ]}
          videoBackground={videoBg}
          showBeams={service.showBeams}
          breadcrumb={[
            { label: 'Home', link: '/' },
            { label: 'Services', link: '/services' },
            { label: department.name, link: `/departments/${department.slug}` },
            { label: service.name }
          ]}
          showWave={false}
        />
      )}

      {/* Overview Section */}
      {!service.hideOverview && <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6">
          {service.fullWidthCustomOverview && service.customOverview ? (
            <div className="w-full">
              {service.customOverview}
            </div>
          ) : service.highFidelity ? (
            <div className="space-y-32">
              {/* High-Fidelity Section 1: Wide-Canvas Challenge & Narrative */}

              <div 
                ref={highFidelityNarrativeRef}
                className={`grid lg:grid-cols-12 gap-16 items-center reveal-on-scroll ${highFidelityNarrativeVisible ? 'is-visible' : ''}`}
              >
                <div className="lg:col-span-7 relative z-10">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="h-[1.5px] w-16 bg-brand-blue"></div>
                      <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">{service.highFidelity.narrative?.badge || 'Strategic Insight'}</span>
                   </div>
                   <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                      {service.highFidelity.narrative?.titleLine1 || service.name}{' '}
                      <span className="text-transparent bg-clip-text bg-brand-gradient italic">{service.highFidelity.narrative?.titleHighlight || 'Resilience'}</span>{' '}
                      {service.highFidelity.narrative?.titleLine2}
                   </h2>
                   <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                   <p className="text-2xl text-gray-500 leading-relaxed font-light max-w-4xl mb-12">
                      {service.highFidelity.narrative?.description || service.description || service.shortDescription}
                   </p>

                   <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                      <div className="space-y-2">
                         <div className="font-mono text-[10px] text-brand-blue font-bold tracking-widest uppercase">{service.highFidelity.narrative?.bottleneckLabel || 'The Impediment'}</div>
                         <p className="stat-counter-text text-sm text-gray-400 leading-relaxed font-light italic">{service.highFidelity.narrative?.bottleneckText || 'Fragmented systems and escalating architectural debt.'}</p>
                      </div>
                      <div className="space-y-2">
                         <div className="font-mono text-[10px] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent font-bold tracking-widest uppercase">{service.highFidelity.narrative?.requirementLabel || 'The Requirement'}</div>
                         <p className="stat-counter-text text-sm text-gray-400 leading-relaxed font-light italic">{service.highFidelity.narrative?.requirementText || 'Observable, secure, and optimized ecosystems.'}</p>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-5 relative group" ref={parallaxNarrativeImgRef} style={parallaxNarrativeImgStyle}>
                   <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] aspect-[4/5] bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center">
                      <img
                        src={service.highFidelity.narrative?.image || service.image}
                        alt={service.name}
                        className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      />
                      <div className="absolute bottom-10 left-10 right-10 p-6 bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl">
                         <div className="flex justify-between items-center mb-4">
                            <span className="font-mono text-[9px] text-gray-400 uppercase tracking-widest font-bold">{service.highFidelity.narrative?.statusLabel || 'System Health'}</span>
                            <span className="text-[10px] font-bold text-brand-blue font-mono">{service.highFidelity.narrative?.statusValue || 'Optimized'}</span>
                         </div>
                         <div className="h-1 bg-gray-100 dark:bg-[#0a0a0c] rounded-full overflow-hidden">
                            <div className="h-full bg-brand-gradient w-full animate-shimmer"></div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* High-Fidelity Section 2: Full-Width Strategic Hub */}
              <div 
                ref={highFidelityPhilosophyRef}
                className={`relative reveal-on-scroll ${highFidelityPhilosophyVisible ? 'is-visible' : ''}`}
              >
                <div className="absolute inset-0 bg-slate-900 rounded-[3rem] -rotate-1 scale-[1.01] opacity-[0.02] pointer-events-none"></div>
                <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[3rem] p-10 lg:p-16 shadow-[0_80px_150px_-40px_rgba(0,0,0,0.08)] overflow-hidden">
                   {service.highFidelity.philosophy?.bgElement && service.highFidelity.philosophy.bgElement}
                   
                   <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
                      <div className="lg:col-span-8">
                         <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1.5px] w-16 bg-brand-blue"></div>
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">The Philosophy</span>
                         </div>
                         <h3 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight leading-[0.95] mb-10 font-display">
                            {service.highFidelity.philosophy?.title !== "" && (
                               <>
                                 {service.highFidelity.philosophy?.title || service.name}{' '}
                               </>
                             )}
                            <span className="text-transparent bg-clip-text bg-brand-gradient italic font-extrabold">{service.highFidelity.philosophy?.titleHighlight || 'Logic-First.'}</span>
                         </h3>
                          <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                         <p className="text-xl lg:text-2xl text-gray-400 font-light leading-snug max-w-4xl opacity-80">
                            "{service.highFidelity.philosophy?.description || 'We architect systems that prioritize relevance and governance — turning reactive assets into proactive strategic advantages.'}"
                         </p>
                      </div>

                      <div className="lg:col-span-4">
                         {service.highFidelity.philosophy?.features ? (
                            <div className="flex flex-col gap-4">
                               {service.highFidelity.philosophy.features.map((feature, i) => {
                                  // We'll use a local state in the main component or a sub-component
                                  // For simplicity in a template, we can make it a small sub-component
                                  return (
                                     <PhilosophyAccordionItem 
                                        key={i}
                                        feature={feature}
                                        isOpen={activePhilosophyIndex === i}
                                        onClick={() => setActivePhilosophyIndex(activePhilosophyIndex === i ? -1 : i)}
                                     />
                                  );
                               })}
                            </div>
                         ) : (
                            <div className="flex flex-col gap-3">
                               {(service.highFidelity.philosophy?.pills || ['Enterprise ROI', 'Hardened Security', 'Velocity', 'Zero Debt']).map((pill, i) => (
                                  <div key={i} className="px-6 py-4 bg-gray-50/50 rounded-2xl group hover:bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
                                     <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-800 dark:text-gray-50 tracking-tight uppercase tracking-wider">{pill}</span>
                                        <ArrowRight className="w-4 h-4 text-brand-blue/0 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                                     </div>
                                  </div>
                               ))}
                            </div>
                         )}
                      </div>
                   </div>
                </div>
              </div>

              {/* eQORE Concierge CTA — placed directly below "The Philosophy" section */}
              {!service.hideEqoreCTA && (
                <AskEqoreCTA
                  kind="service"
                  name={service.name}
                  slug={service.slug}
                  departmentName={service.department || service.parentDepartmentName}
                />
              )}

              {/* High-Fidelity Section 3: Enablement Matrix */}
               {service.preMatrixSection && service.preMatrixSection}
              <div 
                ref={matrixRef}
                className={`py-12 reveal-on-scroll ${matrixVisible ? 'is-visible' : ''}`}
              >
                 <div className="flex justify-between items-end mb-20 gap-8">
                    <div className="max-w-4xl">
                       <div className="flex items-center gap-4 mb-8">
                           <div className="h-[1.5px] w-16 bg-brand-blue"></div>
                           <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">{service.highFidelity.matrix?.engineId || 'Engine :: Kang_V4'}</span>
                        </div>
                       <h3 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 tracking-tight font-display leading-[0.95]">
                         {service.highFidelity.matrix?.title ? (
                           <>
                             {service.highFidelity.matrix.title.split(' ').slice(0, -1).join(' ')}{' '}
                             <span className="text-transparent bg-clip-text bg-brand-gradient italic">{service.highFidelity.matrix.title.split(' ').slice(-1)}</span>
                           </>
                         ) : (
                           <>Enablement <span className="text-transparent bg-clip-text bg-brand-gradient italic">Matrix.</span></>
                         )}
                       </h3>
                       <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
                    </div>
                    <div className="hidden lg:block pb-2">
                       <p className="text-sm text-gray-400 italic max-w-xs text-right leading-relaxed font-light">{service.highFidelity.matrix?.subtext || 'Comprehensive deconstruction of the enterprise journey into modular, governed intelligence layers.'}</p>
                    </div>
                 </div>

                 <div className={`grid gap-px bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-[3rem] overflow-hidden shadow-2xl ${
                    (service.highFidelity.matrix?.layers?.length || 4) === 6
                      ? 'lg:grid-cols-6'
                      : (service.highFidelity.matrix?.layers?.length || 4) === 5 
                        ? 'lg:grid-cols-5' 
                        : 'lg:grid-cols-4'
                  }`}>
                    {(service.highFidelity.matrix?.layers || [
                      { title: 'Discovery', id: 'DS_CORE', icon: <Search />, desc: 'Intelligent analysis and requirement discovery.' },
                      { title: 'Design', id: 'DE_FRAME', icon: <Layers />, desc: 'Robust architecture and framework design.' },
                      { title: 'Delivery', id: 'DV_ENGINE', icon: <Zap />, desc: 'High-velocity implementation and delivery.' },
                      { title: 'Optimization', id: 'OP_MAX', icon: <Activity />, desc: 'Continuous performance and cost optimization.' }
                    ]).map((item, idx) => {
                       const tileRefs = [parallaxTile1Ref, parallaxTile2Ref, parallaxTile3Ref, parallaxTile4Ref, parallaxTile5Ref, parallaxTile6Ref];
                       const tileStyles = [parallaxTile1Style, parallaxTile2Style, parallaxTile3Style, parallaxTile4Style, parallaxTile5Style, parallaxTile6Style];
                       
                       return (
                         <div 
                           key={idx} 
                           ref={tileRefs[idx % 6]}
                           style={tileStyles[idx % 6]}
                           className={`bg-white dark:bg-black hover:bg-gray-50 transition-all duration-500 group relative ${
                             (service.highFidelity.matrix?.layers?.length || 4) === 6
                               ? 'p-8 lg:p-10'
                               : 'p-14 lg:p-16'
                           }`}
                         >
                            <div className="absolute top-10 right-12 font-mono text-[9px] text-gray-300 font-bold tracking-widest bg-gray-50 dark:bg-[#050505] px-3 py-1 rounded-full">{item.id}</div>
                            <div className="text-brand-blue mb-12 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                               {React.isValidElement(item.icon) ? React.cloneElement(item.icon, { size: 40, strokeWidth: 1.2 }) : <item.icon size={40} strokeWidth={1.2} />}
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-none italic font-display">{item.title}</h4>
                            <p className="text-gray-500 text-base leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                            <div className="mt-12 w-8 h-[2px] bg-gray-100 dark:bg-[#0a0a0c] group-hover:w-full group-hover:bg-brand-blue/20 transition-all duration-700"></div>
                         </div>
                       );
                     })}
                  </div>
              </div>

              {/* High-Fidelity Section 4: Result -> Growth Schematic */}
              <div className="text-center py-48 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-gray-100 to-transparent"></div>
                
                <div className="flex items-center justify-center gap-4 mb-12">
                   <div className="h-[1.5px] w-16 bg-brand-blue/30"></div>
                   <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">System Outcome</span>
                   <div className="h-[1.5px] w-16 bg-brand-blue/30"></div>
                 </div>

                 <div ref={parallaxSchematicRef} style={parallaxSchematicStyle} className="relative z-10 px-4">
                   <p className="text-6xl lg:text-[10rem] font-bold text-gray-900 dark:text-white tracking-tighter leading-[0.9] mb-12 font-display">
                       <span className="inline-block opacity-90">{service.highFidelity.schematic?.titleLine1 || 'Accelerate'}{' '}</span>
                       <span className="text-transparent bg-clip-text bg-brand-gradient inline-block hover:scale-[1.01] transition-transform duration-700">
                         {service.highFidelity.schematic?.titleHighlight || 'Everything.'}
                       </span>
                   </p>
                    <p className="text-xl lg:text-2xl text-gray-400 font-light italic max-w-5xl mx-auto px-4 opacity-80">
                        {service.highFidelity.schematic?.description || 'Your transformation journey should fuel undisputed competitive advantage.'}
                    </p>
                 </div>
                 
                 <div className="mt-24 inline-flex flex-wrap justify-center gap-16 text-center relative z-10">
                    {(service.highFidelity.schematic?.stats || [
                      { label: 'Latency', val: 'ZERO' },
                      { label: 'ROI', val: 'EXPONENTIAL' },
                      { label: 'Security', val: 'ABSOLUTE' }
                    ]).map((stat, i) => (
                      <div key={i} className="flex flex-col gap-2">
                         <div className="font-mono text-[10px] text-gray-300 tracking-widest uppercase font-bold">{stat.label}</div>
                         <div className="text-sm font-bold text-slate-900 dark:text-white tracking-widest">{stat.val}</div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                {service.customOverview ? (
                  service.customOverview
                ) : (
                  <>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">Overview</h2>
                    <div className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed space-y-4">{service.fullDescription || service.description}</div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                      With deep expertise in {department.name.toLowerCase()}, we deliver solutions that drive measurable business outcomes. Our approach combines industry best practices with cutting-edge technology to ensure your success.
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gradient text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all">
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className={`rounded-2xl shadow-2xl w-full object-cover ${service.imageClassName || 'aspect-video'}`}
                />
              </div>
            </div>
          )}
        </div>
      </section>}

      {/* Custom Full-Width Sections (between Overview and Capabilities) */}
      {service.customSections && service.customSections}

      {/* Capabilities Section */}
      {capabilityCards && capabilityCards.length > 0 && (
        <section 
          id="capabilities"
          ref={capabilitiesRef} 
          className={`py-24 lg:py-32 bg-[#FEFFFC] overflow-hidden relative reveal-on-scroll ${capabilitiesVisible ? 'is-visible' : ''}`}
        >
          <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
            <div 
              ref={parallaxCapHeadRef} 
              style={parallaxCapHeadStyle}
              className="mb-20 text-left max-w-6xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1.5px] w-16 bg-brand-blue"></div>
                <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">Core Expertise</span>
              </div>
              <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
                {service.capabilitiesTitle ? (
                  <>
                    {service.capabilitiesTitle.split(' ').slice(0, -2).join(' ')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] italic whitespace-nowrap">{service.capabilitiesTitle.split(' ').slice(-2).join(' ')}</span>
                  </>
                ) : (
                  <>Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] italic">Capabilities.</span></>
                )}
              </h2>
              <div className="w-24 h-1.5 bg-brand-blue/20 rounded-full mb-10"></div>
              <p className="text-xl lg:text-2xl text-gray-500 font-light tracking-tight leading-[1.4] max-w-6xl opacity-80 mt-6 lg:mt-8">
                {service.capabilitiesDescription || 'Kangqore provides comprehensive digital transformation services that empower organizations to foster agility, enhance customer experience, and spur business transformation. Our services leverage advanced technology enablers such as AI, Cloud, Automation, and Advanced Analytics to modernize operations, unlock actionable insights, and scale up quickly.'}
              </p>
            </div>
            <CapabilitiesCarousel cards={finalCapabilityCards} iconArray={iconArray} />
          </div>
        </section>
      )}

      {/* Fallback eQORE CTA — only renders for pages WITHOUT highFidelity
          (those have the CTA placed inline below the Philosophy section instead).
          Decoupled from the legacy hideGenericMidPageCta flag. */}
      {!service.hideEqoreCTA && !service.highFidelity && (
        <AskEqoreCTA
          kind="service"
          name={service.name}
          slug={service.slug}
          departmentName={service.department || service.parentDepartmentName}
        />
      )}

      {/* Custom Sections after Capabilities */}
      {service.postCapabilitiesSections && service.postCapabilitiesSections}

      {/* Case Studies / Proof — renders only when the service supplies caseStudies data */}
      {service.caseStudies && service.caseStudies.length > 0 && (
        <CaseStudiesSection
          caseStudies={service.caseStudies}
          title={service.caseStudiesTitle}
          intro={service.caseStudiesIntro}
          serviceName={service.name}
        />
      )}

      {/* Solutions Carousel */}
      {service.solutions && service.solutions.length > 0 && (
        <section className="py-20 bg-[#000000] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <SolutionsCarousel solutions={service.solutions} />
        </section>
      )}

      {/* Trust Pillars Carousel */}
      {service.trustPillars && service.trustPillars.length > 0 && (
        <section 
          ref={trustPillarsRef}
          className={`py-20 bg-[#000000] relative overflow-hidden reveal-on-scroll ${trustPillarsVisible ? 'is-visible' : ''}`}
        >
          {/* Video Background */}
          {service.trustPillarsVideo && (
            <div className="absolute inset-0 z-0">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-30"
              >
                <source src={service.trustPillarsVideo} type="video/mp4" />
              </video>
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
            </div>
          )}


          
          <TrustPillarsCarousel 
            pillars={service.trustPillars} 
            rightPanelTitle={service.trustPillarsRightTitle} 
            rightPanelDescription={service.trustPillarsRightDescription}
            rightPanelButtonText={service.trustPillarsRightButton}
          />
        </section>
      )}

      {/* Custom sections injected before Why Kangqore */}
      {service.preWhyKangqoreSections && service.preWhyKangqoreSections}

    {/* Why Kangqore */}
      {whyKangqore && whyKangqore.length > 0 && <section
        ref={whyKangqoreRef}
        className={`pt-24 lg:pt-32 pb-32 lg:pb-40 bg-[#FEFFFC] reveal-on-scroll relative overflow-hidden ${whyKangqoreVisible ? 'is-visible' : ''}`}
      >
        {/* Parallax Background decorative element */}
        <div ref={parallaxWhyBgRef} style={{...parallaxWhyBgStyle, pointerEvents: 'none'}} className="absolute -left-64 top-20 w-[600px] h-[600px] bg-gradient-to-r from-brand-blue/5 to-transparent rounded-full blur-[100px]" />
        
        <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="mb-20 text-left max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">The Advantage</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] italic">Kangqore</span> for {service?.name || 'this service'}?
            </h2>
            <div className={`w-24 h-1.5 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] rounded-full mb-10 opacity-20`}></div>
            {service.whyKangqoreIntro ? (
              <p className="text-2xl text-gray-500 leading-relaxed font-light max-w-4xl">{service.whyKangqoreIntro}</p>
            ) : (
              <p className="text-2xl text-gray-500 leading-relaxed font-light max-w-4xl">Partner with us to leverage our expertise and accelerate your ${(service?.name || '').toLowerCase()} journey.</p>
            )}
          </div>
          <WhyKangqoreCarousel items={whyKangqore} />
        </div>
      </section>}

      {/* Custom sections injected after Why Kangqore */}
      {service.postWhyKangqoreSections && service.postWhyKangqoreSections}

      {/* Industry Expertise */}
      {industries && industries.length > 0 && <section
        ref={industriesRef}
        className={`py-24 lg:py-32 bg-[#FEFFFC] reveal-on-scroll relative overflow-hidden ${industriesVisible ? 'is-visible' : ''}`}
      >
        
        <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
          <div className="mb-20 text-left max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1.5px] w-16 bg-brand-blue"></div>
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">Sector Depth</span>
            </div>
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-10 font-display tracking-tight leading-[0.95]">
              {(service.industryTitle || service.industriesTitle) ? (
                <>
                  {(service.industryTitle || service.industriesTitle).split(' ').slice(0, -2).join(' ')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] italic">{(service.industryTitle || service.industriesTitle).split(' ').slice(-2).join(' ')}</span>
                </>
              ) : (
                <>Industry-Specific <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] italic">Solutions.</span></>
              )}
            </h2>
            <div className={`w-24 h-1.5 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] rounded-full mb-10 opacity-20`}></div>
            {service.industryIntro ? (
              <div className="text-2xl text-gray-500 leading-relaxed font-light max-w-4xl space-y-4">
                {service.industryIntro.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-2xl text-gray-500 leading-relaxed font-light max-w-4xl">We bring deep domain knowledge to deliver {service.name.toLowerCase()} solutions across industries.</p>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[280px]">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon;
              
              const isLarge = index === 0 || index === 3;
              const spanClass = isLarge ? "col-span-2 lg:col-span-2" : "col-span-2 lg:col-span-1";
              
              // Premium Unsplash placeholders if none provided natively
              const fallbackImages = [
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
                "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
              ];
              const bgImage = industry.image || fallbackImages[index % fallbackImages.length];

              return (
                <div key={index} className={`relative rounded-[24px] overflow-hidden group hover:scale-[1.02] transition-transform duration-500 shadow-sm ${spanClass} flex flex-col justify-end p-6 lg:p-8 cursor-pointer`}>
                  {/* Background Image & Gradient Mask */}
                  <div className="absolute inset-0 z-0">
                    <img src={bgImage} alt={industry.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Foreground Content */}
                  <div className="relative z-10 text-left transform transition-transform duration-500 group-hover:-translate-y-2">
                    {IconComponent && <IconComponent className="w-8 h-8 text-white mb-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300" strokeWidth={1.5} />}
                    <h4 className="text-xl md:text-2xl font-semibold text-white tracking-tight mb-2 leading-tight">{industry.name}</h4>
                    <p className="text-sm md:text-base text-white/80 font-light tracking-tight leading-snug line-clamp-2 mt-2 group-hover:text-white transition-colors duration-300">
                      {industry.description || `Transformative digital enablement.`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>}

      {/* Custom Sections after Industry (e.g., for Related Offerings) */}
      {service.postIndustrySections && service.postIndustrySections}

      {/* FAQ */}
      {faqs && faqs.length > 0 && <section
        ref={faqRef}
        className={`py-20 bg-[#FEFFFC] reveal-on-scroll ${faqVisible ? 'is-visible' : ''}`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {service.faqSubline || `Common questions about our ${service.name.toLowerCase()} services`}
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] mb-6 group/faq"
                onMouseEnter={() => setOpenFaq(index)}
                onMouseLeave={() => setOpenFaq(-1)}
              >
                <button className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#FEFFFC] transition-colors" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span className="font-bold text-gray-900 dark:text-white pr-4 text-lg">{faq.question}</span>
                  {openFaq === index ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] flex items-center justify-center text-white shadow-lg">
                      <ChevronUp className="w-5 h-5 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#0a0a0c] flex items-center justify-center text-gray-400 group-hover/faq:bg-gray-200 transition-colors">
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    </div>
                  )}
                </button>
                {openFaq === index && <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed animate-in slide-in-from-top-2 duration-200">{faq.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* Custom Sections after FAQ */}
      {service.postFAQSections && service.postFAQSections}


      {/* CTA Section */}
      {service.finalCtaSection ? service.finalCtaSection : (
        <section className="py-24 bg-white dark:bg-black">
          <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6">
            <div className="relative cta-section rounded-[32px] p-16 lg:p-24 text-center text-white overflow-hidden shadow-2xl bg-gradient-to-r from-[#2564ea] to-[#4ab6d4]">
              {/* Background Image with parallax */}
              <div 
                ref={parallaxCtaBgRef}
                className="absolute -inset-20 z-0" 
                style={{
                  ...parallaxCtaBgStyle,
                  backgroundImage: 'url("https://images.pexels.com/photos/3182768/pexels-photo-3182768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              ></div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea]/95 to-[#4ab6d4]/95 mix-blend-multiply z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent z-10"></div>
              
              {/* Content */}
              <div className="relative z-20">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-display">{service.ctaTitle || 'Ready to Get Started?'}</h2>
                <p className="text-xl text-white/90 mb-10 max-w-4xl mx-auto font-light leading-relaxed tracking-wide">{service.ctaDescription || `Let's discuss how ${service.name.toLowerCase()} can drive your success.`}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to={service.ctaButtonLink || "/contact"} className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-brand-blue font-semibold rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl group">
                    {service.ctaButtonText || 'Talk to Our Experts'} 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {service.ctaSecondaryButton && (
                    <Link to={service.ctaSecondaryButton.link} className="inline-flex items-center gap-2 px-10 py-5 bg-transparent text-white border border-white/30 font-semibold rounded-full hover:bg-white dark:bg-gray-900 dark:border-gray-800/10 transition-all duration-300 transform hover:scale-105">
                      {service.ctaSecondaryButton.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServicePageTemplate;
