import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format, addDays } from 'date-fns';
import { parseSchedulingRequest, parseSchedulingRequestAsync, timeRangeToTimeStr } from '../hooks/nlpSchedulingParser';
import AvailabilityPulse from '../components/scheduling/AvailabilityPulse';
import { useVoiceInput } from '../hooks/useVoiceInput';

const ConciergeSection = lazy(() =>
  import('../components/concierge/ConciergeSection')
);

import HeroGlassCards from '../components/hero/HeroGlassCards';
import HeroChatWidget from '../components/hero/HeroChatWidget';
import BIDSProductVisual from '../components/hero/BIDSProductVisual';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock,
  User, Mail, Building, MessageSquare, Check, Cpu, Zap, Users, ArrowRight, ArrowLeft, ArrowUpRight,
  Plus, X, Pause, Play, SkipForward, Briefcase, Globe, Phone, Send, Search, Menu,
  Facebook, Twitter, Linkedin, Instagram, Target, ShieldCheck, Scale, Handshake,
  Bot, RefreshCw, Cloud, TrendingUp, Lock, BarChart3, BookOpen,
  Landmark, Factory, Monitor, Sparkles, Quote, Star, Mic, Volume2, VolumeX
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useToast } from '../hooks/use-toast';
import { departmentData } from '../data/departmentData';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import NewModernSection from '../components/NewModernSection';
import VisualBackground from '../components/VisualBackground';
import SEO from '../components/SEO';
import { coreSEO } from '../data/seoData';
import SecondaryButton from '../components/ui/SecondaryButton';
import ExploreServices from '../components/ExploreServices';
import DepartmentsGrid from '../components/DepartmentsGrid';
import DepartmentCarousel from '../components/home/DepartmentCarousel';
import HomeRuler from '../components/home/HomeRuler';

// ============================================================================
// MOCK DATA
// ============================================================================
const heroSlides = [
  {
    id: 1,
    type: 'video',
    tag: "ENTERPRISE TRANSFORMATION",
    title: "Infrastructure So Intelligent, ",
    titleGradient: "Growth Becomes Inevitable.",
    description: "Kangqore partners with ambitious organizations to engineer intelligent digital infrastructure that modernizes operations, automates enterprise workflows, secures critical systems, and accelerates measurable growth.",
    cta: "Explore Our Capabilities",
    secondaryCta: "Schedule Your 30-min Discovery Call",
    link: "/services",
    secondaryLink: "/contact",
    video: "/videos/hero-bg.mp4",
  },
  {
    id: 2,
    type: 'chat',
    tag: "eQORE AI™ CONCIERGE",
    title: "Innovate ",
    titleTypewriter: "Your Next Move.",
    description: "",
    video: "/videos/hero-bg.mp4",
  },
];

const homeTestimonials = [
  {
    quote: "Their AI solutions helped us predict customer behavior with 95% accuracy, revolutionizing our marketing strategy.",
    author: "Sarah Chen",
    role: "VP Digital, Retail Giant",
    initials: "SC",
    rating: 5
  },
  {
    quote: "Kangqore transformed our digital infrastructure, resulting in 40% cost reduction and 3x faster deployment cycles.",
    author: "James Miller",
    role: "CTO, Fortune 500 Bank",
    initials: "JM",
    rating: 5
  },
  {
    quote: "The team's expertise in cloud migration was exceptional. Zero downtime during our entire transition.",
    author: "Michael Brown",
    role: "IT Director, Healthcare Corp",
    initials: "MB",
    rating: 5
  }
];

const newsItems = [
  {
    id: 1,
    type: "Platform Update",
    date: "Dec 18, 2025",
    title: "Kangqore Launches Next-Generation Agentic AI Integration Services",
    excerpt: "New autonomous agents allow enterprises to execute multi-step workflows across disparate business systems, driving operational efficiency.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
    link: "/insights"
  },
  {
    id: 2,
    type: "Tech Insight",
    date: "Dec 17, 2025",
    title: "The Death of the Cookie: Why First-Party Data Sovereignty is Critical",
    excerpt: "As third-party cookies disappear, enterprises must build robust CDP architectures to retain customer intelligence.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    link: "/insights"
  },
  {
    id: 3,
    type: "Company News",
    date: "Dec 10, 2025",
    title: "Kangqore Expands Cloud Engineering Practice",
    excerpt: "Bolstering our commitment to resilient digital foundations, the expanded practice focuses on Kubernetes orchestration and zero-trust security.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    link: "/insights"
  }
];

// ============================================================================
// SECTION 1: HERO CAROUSEL
// ============================================================================
// ============================================================================
// ============================================================================



const HUDText = ({ text, delay = 0, isCyan = false, startTyping = true, loop = false }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    if (!startTyping) return;
    
    let isCancelled = false;
    let timeout;
    
    const typeCycle = async () => {
      if (isCancelled) return;
      setDisplayText('');
      
      // Type out
      for (let i = 1; i <= text.length; i++) {
        if (isCancelled) return;
        setDisplayText(text.slice(0, i));
        await new Promise(r => { timeout = setTimeout(r, 60); });
      }
      
      if (!loop) return;
      
      // Pause at the end
      await new Promise(r => { timeout = setTimeout(r, 3000); });
      
      // Delete backwards
      for (let i = text.length - 1; i >= 0; i--) {
        if (isCancelled) return;
        setDisplayText(text.slice(0, i));
        await new Promise(r => { timeout = setTimeout(r, 30); });
      }
      
      // Small pause before restarting
      await new Promise(r => { timeout = setTimeout(r, 500); });
      
      if (!isCancelled) typeCycle();
    };
    
    const startTimeout = setTimeout(() => {
      typeCycle();
    }, delay);
    
    return () => {
      isCancelled = true;
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay, startTyping, loop]);

  return (
    <span className="relative inline-flex items-center">
      {displayText}
    </span>
  );
};

const trustLogos = [
  { name: "TATA Steel", src: "/assets/logos/tata-steel.png", scale: "h-10 sm:h-12" },
  { name: "Axis Bank", src: "/assets/logos/axis-bank.svg", scale: "h-8 sm:h-10" },
  { name: "Bank Of Baroda", src: "/assets/logos/bank-of-baroda.svg", scale: "h-10 sm:h-12" },
  { name: "Bank of India", src: "/assets/logos/bank-of-india.svg", scale: "h-10 sm:h-12" },
  { name: "SBI", src: "/assets/logos/sbi.svg", scale: "h-10 sm:h-12" },
  { name: "Indian Railways", src: "/assets/logos/indian-railways-grey.png", scale: "h-12 sm:h-16", preGreyed: true },
  { name: "RSB Industries", src: "/assets/logos/rsb-industries.png", scale: "h-8 sm:h-10" },
  { name: "Government Of Jharkhand", src: "/assets/logos/jharkhand.svg", scale: "h-12 sm:h-16" },
  { name: "Geeks IT Services", src: "/assets/logos/geeks-it-grey.png", scale: "h-10 sm:h-12", preGreyed: true },
  { name: "NIT Jamshedpur", src: "/assets/logos/nit-jamshedpur.png", scale: "h-12 sm:h-14" },
];

const HeroCarousel = () => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isChatEngaged, setIsChatEngaged] = useState(false);
  const videoRef = useRef(null);
  const touchStartX = useRef(0);
  const clickCount = useRef(0);
  const clickTimeout = useRef(null);
  const slideCount = heroSlides.length;

  // Derived: auto-play only when ALL conditions are met
  const isAutoPlaying = !isManuallyPaused && !isChatEngaged;

  // Listen for eQORE chat engagement events from HeroChatWidget
  useEffect(() => {
    const handleChatEngaged = () => setIsChatEngaged(true);
    const handleChatIdle = () => setIsChatEngaged(false);
    window.addEventListener('hero-chat-engaged', handleChatEngaged);
    window.addEventListener('hero-chat-idle', handleChatIdle);
    return () => {
      window.removeEventListener('hero-chat-engaged', handleChatEngaged);
      window.removeEventListener('hero-chat-idle', handleChatIdle);
    };
  }, []);

  // Auto-advance with dynamic duration
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const duration = activeSlide === 0 ? 62000 : 20000;
    const timer = setTimeout(() => {
      setActiveSlide(prev => (prev + 1) % slideCount);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [isAutoPlaying, activeSlide, slideCount]);

  // Pause/play video based on active slide
  useEffect(() => {
    if (videoRef.current) {
      if (activeSlide === 0) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeSlide]);

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goToSlide((activeSlide + 1) % slideCount);
      else goToSlide((activeSlide - 1 + slideCount) % slideCount);
    }
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <>
    <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">

    <section
      className="relative w-full h-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // Multi-click navigation on empty-area clicks (not buttons, links, inputs, or the chat widget)
        const tag = e.target.tagName.toLowerCase();
        const isInteractive = ['button', 'a', 'input', 'textarea', 'select'].includes(tag);
        const isInsideInteractive = e.target.closest('button, a, input, textarea, form, [role="button"], .hero-chat-widget');
        if (!isInteractive && !isInsideInteractive) {
          clickCount.current += 1;
          if (clickTimeout.current) clearTimeout(clickTimeout.current);
          clickTimeout.current = setTimeout(() => {
            if (clickCount.current === 1) {
              setIsManuallyPaused(prev => !prev);
            } else if (clickCount.current === 2) {
              goToSlide((activeSlide + 1) % slideCount);
            } else if (clickCount.current >= 3) {
              goToSlide((activeSlide - 1 + slideCount) % slideCount);
            }
            clickCount.current = 0;
          }, 250);
        }
      }}
    >
      {/* ── ACTUAL HERO AREA (bg + content + dots only — trust strip & HeroBottomStrip live OUTSIDE this wrapper) ── */}
      <div className="relative h-full overflow-hidden pb-[0.3cm]">
      {/* ── BACKGROUND LAYERS (stacked, crossfade via opacity) ── */}
      {heroSlides.map((slide, index) => (
        <div
          key={`bg-${slide.id}`}
          className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
            index === activeSlide ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-[#0a1228]">
            {(slide.type === 'video' || slide.video) && (
              <video
                ref={index === 0 ? videoRef : null}
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback"
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            )}
            {slide.type === 'chat' && slide.image && !slide.video && (
              <img
                src={slide.image}
                alt="Kangqore AI Tennis"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center calc(50% + 38px)' }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
        </div>
      ))}

      {/* ── CONTENT LAYERS (stacked, crossfade) ── */}
      <div className="relative z-[2] h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={`content-${slide.id}`}
            className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
              index === activeSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-[194px] lg:pt-[250px] pb-[167px] sm:pb-[175px] h-full flex flex-col">

              {/* Right panel — conditional per slide type */}
              {slide.type === 'video' && (
                <div className="hidden lg:block absolute top-[253px] right-6 sm:right-8 lg:right-16 xl:right-24 w-[245px] xl:w-[265px] z-10 scale-[1.02] origin-top-right">
                  <HeroGlassCards />
                </div>
              )}


              <div className={`${slide.type === 'chat' ? 'w-full' : 'max-w-5xl'} flex flex-col h-full`}>

                <div className="space-y-5 flex-shrink-0">

                  <h1
                    key={`title-${slide.id}`}
                    className={`text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white animate-in fade-in zoom-in-75 duration-1000 ease-out origin-left ${
                      slide.id === 2 ? '-translate-y-6' : ''
                    }`}
                  >
                  {slide.title}
                  {slide.titleTypewriter && (
                    <HUDText text={slide.titleTypewriter} delay={300} startTyping={index === activeSlide} loop={true} />
                  )}
                  {slide.titleGradient && (
                    <>
                      {' '}
                      <span className="bg-brand-gradient bg-clip-text text-transparent">{slide.titleGradient}</span>
                    </>
                  )}
                </h1>

                {slide.description && (
                  <p
                    key={`desc-${slide.id}`}
                    className="text-base sm:text-lg lg:text-xl text-gray-300 leading-[1.8] max-w-3xl animate-fade-in font-medium line-clamp-3 py-4 sm:py-6"
                  >
                    {slide.description}
                  </p>
                )}

                {/* Chat widget for slide 2 */}
                {slide.type === 'chat' && (
                  <div className="py-4 sm:py-6 hero-chat-widget" style={{ overflow: 'visible' }}>
                    <HeroChatWidget isActive={index === activeSlide} />
                  </div>
                )}

                </div>

                <div className="flex-grow min-h-[20px]" />

                {/* CTAs for slides */}
                {slide.cta && (
                  <div className="flex flex-col sm:flex-row items-center gap-8 animate-fade-in">
                    {slide.cta && (
                      <Link
                        to={slide.link}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/[0.07] backdrop-blur-md border border-white/14 text-white shadow-xl hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)]"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        <span className="relative z-10 text-white font-bold tracking-wide text-[13px]">
                          {slide.cta}
                        </span>
                        <div className="relative z-10 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-white shadow-md">
                          <ArrowRight className="w-4 h-4 text-white group-hover:text-gray-900 transition-all duration-500 group-hover:translate-x-0.5" />
                        </div>
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-cyan-400/50 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </Link>
                    )}

                    {slide.secondaryCta && (
                      <Link
                        to={slide.secondaryLink || "/contact"}
                        className="group inline-flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity duration-300"
                      >
                        <span className="text-[13px] font-bold text-white/90 tracking-wide uppercase">
                          {slide.secondaryCta}
                        </span>
                        <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Slide Dot Indicators ── */}
      <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 z-30 hero-slide-indicators mt-[76px]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            {heroSlides.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-500 rounded-full ${
                  index === activeSlide
                    ? 'w-8 h-[5px] bg-brand-gradient shadow-lg shadow-blue-500/30'
                    : 'w-[5px] h-[5px] bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Media Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToSlide((activeSlide + 1) % slideCount);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95 opacity-25 hover:opacity-100"
              aria-label="Next slide"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          @keyframes trust-logo-scroll { 0%, 100% { transform: translateX(0); } }
        }
        @keyframes heroPulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        @keyframes scroll-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-line {
          animation: scroll-line 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes pond-button {
          0% { transform: scale(1); opacity: 1; }
          20% { transform: scale(2); opacity: 0.2; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pond-ring {
          0% { transform: scale(1); opacity: 0.8; border-width: 2px; }
          100% { transform: scale(4); opacity: 0; border-width: 0px; }
        }
        .animate-pond-button {
          animation: pond-button 0.8s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
        }
        .animate-pond-ring {
          animation: pond-ring 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes statementGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>



    </div>

    {/* ── Hero Trust Logo Strip (Free from container) ── */}
    <div className="relative z-20 w-full bg-transparent py-[calc(1.25rem+0.5cm)] sm:py-[calc(1.5rem+0.5cm)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-10">
        <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-[0.25em] text-center mx-auto leading-relaxed whitespace-nowrap">
          TRUSTED BY GLOBAL ENTERPRISES TO DELIVER AT SCALE.
        </p>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-[heroTrustMarquee_35s_linear_infinite] items-center gap-12 sm:gap-16 lg:gap-20 hover:[animation-play-state:paused] py-2">
          {[...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos].map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="flex flex-col items-center justify-center group shrink-0 w-28 sm:w-32">
              <div className="h-10 sm:h-12 w-full flex items-center justify-center opacity-100 transition-opacity duration-300">
                <img src={logo.src} alt={logo.name} className="max-h-8 sm:max-h-10 w-auto object-contain filter brightness-0 dark:invert transition-transform duration-300 group-hover:scale-105" />
              </div>
              <span className="mt-3 text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/75 transition-colors duration-300 uppercase tracking-widest text-center">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes heroTrustMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>
    </div>
    </>
  );
};



// ============================================================================
// TRUST & INTELLIGENCE LAYER (McKinsey Editorial Style)
// ============================================================================
// ============================================================================
// TRUST & INTELLIGENCE LAYER (McKinsey Editorial Mastery)
// ============================================================================
const trustCards = [
  {
    type: "CASE STUDY",
    title: "Scaling mental health where life happens: Helping communities thrive across the lifespan",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    href: "/case-studies",
    aspect: "aspect-[7/10]",
  },
  {
    type: "PODCAST",
    title: "What it takes to build 'genius at scale' in the age of AI",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=80",
    href: "/insights",
    aspect: "aspect-square",
  },
  {
    type: "BOOK",
    title: "Rewired, second edition: How leading companies win with tech and AI",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    href: "/insights",
    aspect: "aspect-[11/16]",
  },
  {
    type: "ARTICLE",
    title: "Where AI will create value — and where it won't",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    href: "/insights",
    aspect: "aspect-[4/5]",
  },
  {
    type: "REPORT",
    title: "Shopping in the age of AI: Redefining stores for a new era",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    href: "/insights",
    aspect: "aspect-[4/5]",
  },
];

const EditorialCard = ({ card, featured = false }) => {
  return (
    <Link
      to={card.href}
      className={`group relative z-10 overflow-hidden bg-slate-900 dark:bg-black transition-all duration-700 w-full rounded-2xl ${card.aspect}`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-2xl" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8">
        <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.2em] text-gray-400 font-sans">
          {card.type}
        </p>
        <h3 className={`font-serif text-white leading-[1.1] tracking-tight group-hover:underline decoration-white/30 underline-offset-8 transition-all ${featured ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-xl md:text-2xl'}`}>
          {card.title} <span className="inline-block ml-1 font-sans text-xl font-light">›</span>
        </h3>
      </div>
    </Link>
  );
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const InsightsSubscribeBlock = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, {
        email,
        source: 'homepage_insights'
      });

      setStatus('success');
      setMessage(response.data.message || 'Successfully subscribed!');
      setEmail('');

      // Auto-reset after 6 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 6000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Something went wrong. Please try again.');

      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-black p-10 flex flex-col justify-center aspect-video rounded-2xl">
      {status === 'success' ? (
        /* ── Success State ── */
        <div className="flex flex-col items-center justify-center text-center gap-4 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="font-serif text-2xl text-white leading-[1.2]">You're in.</h3>
          <p className="text-sm text-gray-400 font-sans max-w-xs">{message}</p>
        </div>
      ) : (
        /* ── Default / Loading / Error State ── */
        <>
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-8 text-center leading-[1.2]">
            Subscribe to the latest Kangqore Insights on the topics you care about.
          </h3>
          
          <form onSubmit={handleSubscribe} className="relative mb-4 flex rounded-xl overflow-hidden">
            <input 
              type="email"
              id="insights-subscribe-email"
              name="insights-email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setMessage(''); } }}
              placeholder="Email address"
              disabled={status === 'loading'}
              className="w-full bg-white dark:bg-black px-6 py-4 text-gray-900 dark:text-white focus:outline-none font-sans text-base disabled:opacity-60"
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#0055ff] px-6 flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-60 min-w-[60px]"
            >
              {status === 'loading' ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6 text-white" />
              )}
            </button>
          </form>

          {/* Feedback message */}
          {status === 'error' && message && (
            <p className="text-red-400 text-xs font-sans text-center mb-6">{message}</p>
          )}
          {status !== 'error' && <div className="mb-6" />}

          <div className="relative flex items-center justify-center mb-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900 dark:bg-black font-sans">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black dark:bg-gray-900 dark:border-gray-800/5 transition-colors font-sans rounded-xl">
              Apple
            </button>
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black dark:bg-gray-900 dark:border-gray-800/5 transition-colors font-sans rounded-xl">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black dark:bg-gray-900 dark:border-gray-800/5 transition-colors font-sans rounded-xl">
              LinkedIn
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const TrustIntelligenceLayer = () => {
  return (
    <section id="trust-intelligence" className="relative z-20 bg-white dark:bg-black py-24 md:pb-32 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        
        {/* The McKinsey Hero Grid Layout (Applied to Intelligence Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.75fr] gap-4">
          
          {/* 1. Headline Block (Top Left - Spans 2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-black py-12 flex flex-col justify-center">
            <div className="flex flex-col md:flex-row md:items-center gap-10 lg:pr-10">
              <p className="max-w-2xl text-2xl md:text-3xl lg:text-4xl leading-snug md:leading-snug text-gray-900 dark:text-white font-medium tracking-tight">
                Insights engineered for decision-makers. The ideas, research, and perspectives defining the future of intelligent enterprise infrastructure.
              </p>
              <Link to="/insights" className="w-14 h-14 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center group hover:scale-110 hover:shadow-[0_0_20px_rgba(37,100,234,0.3)] transition-all duration-500 shrink-0 mt-4 md:mt-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ArrowRight className="w-6 h-6 text-white dark:text-gray-900 group-hover:text-white relative z-10 transition-all duration-500 -rotate-45 group-hover:rotate-0 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* 2. Featured Card (Right Side - Spans entire height) */}
          <div className="lg:row-span-2 lg:col-start-3 h-full">
            <EditorialCard card={trustCards[0]} featured={true} />
          </div>

          {/* 3. Small Card Left (Bottom Left) */}
          <div className="lg:col-start-1 lg:row-start-2">
            <EditorialCard card={trustCards[2]} />
          </div>

          {/* 4. Small Card Middle (Bottom Middle) */}
          <div className="lg:col-start-2 lg:row-start-2">
            <EditorialCard card={trustCards[3]} />
          </div>

        </div>

        {/* Second Row Grid (Mixed Content + Subscribe) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <EditorialCard card={trustCards[1]} />
          <EditorialCard card={trustCards[4]} />
          
          {/* The Intelligence Subscribe Block */}
          <InsightsSubscribeBlock />
        </div>
      </div>
    </section>
  );
};



// ============================================================================
// STRATEGIC PARTNERSHIPS MARQUEE
// ============================================================================
const partnerLogos = [
  { label: "Microsoft", src: "/assets/badges/microsoft.svg", scale: "h-10 sm:h-12" },
  { label: "NASSCOM", src: "/assets/badges/nasscom.svg", scale: "h-10 sm:h-12" },
  { label: "Adobe", src: "/assets/badges/adobe.svg", scale: "h-10 sm:h-12" },
  { label: "Salesforce", src: "/assets/badges/salesforce.svg", scale: "h-10 sm:h-12" },
  { label: "ServiceNow", src: "/assets/badges/servicenow.svg", scale: "h-10 sm:h-12" },
  { label: "Azure", src: "/assets/badges/azure.svg", scale: "h-10 sm:h-12" },
  { label: "AWS", src: "/assets/badges/aws.svg", scale: "h-10 sm:h-12" },
  { label: "Databricks", src: "/assets/badges/databricks.svg", scale: "h-10 sm:h-12" },
  { label: "Neo4j", src: "/assets/badges/neo4j.svg", scale: "h-10 sm:h-12" },
  { label: "Fivetran", src: "/assets/badges/fivetran.svg", scale: "h-10 sm:h-12" },
  { label: "Snowflake", src: "/assets/badges/snowflake.svg", scale: "h-10 sm:h-12" },
  { label: "Power BI", src: "/assets/badges/powerbi.svg", scale: "h-10 sm:h-12" },
  { label: "Google Cloud", src: "/assets/badges/gcp.svg", scale: "h-10 sm:h-12" },
];

// ============================================================================
// BIDS + PHILOSOPHY — two-panel split card layout
// ============================================================================
const BIDSSection = () => null;
const PhilosophySection = () => null;

const BIDSPhilosophySection = () => (
  <section className="bg-white dark:bg-black px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div className="flex flex-col md:flex-row gap-4 max-w-[1600px] mx-auto">

      {/* ── Left card — Kangqore BIDS™ ── */}
      <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[640px] flex flex-col">
        {/* Full-bleed image background */}
        <img
          src="/images/imgbg3.png"
          alt="Kangqore BIDS Dashboard"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient — transparent at top, deep black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/90" />

        {/* Content pinned to bottom */}
        <div className="relative z-10 mt-auto p-8 sm:p-10">
          {/* Icon badge */}
          <div className="w-10 h-10 rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center mb-6">
            <BarChart3 className="w-4 h-4 text-white" strokeWidth={2} />
          </div>

          <h2 className="text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] font-bold leading-[1.1] tracking-[-0.03em] text-white mb-4">
            Kangqore BIDS™
          </h2>
          <p className="text-white/65 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            A proprietary intelligence framework that diagnoses bottlenecks, maps growth
            opportunities, and recommends data-backed transformation priorities.
          </p>
          <Link
            to="/bids"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 active:scale-[0.97] transition-all duration-200"
          >
            Explore BIDS™
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Right card — Our Philosophy ── */}
      <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[640px] bg-white flex flex-col">
        {/* Chess image bleeds in from the top — decorative, fades to white */}
        <div className="absolute top-0 left-0 right-0 h-[65%] overflow-hidden">
          <img
            src="/images/chess_bg.png"
            alt=""
            className="w-full h-full object-cover object-top"
          />
          {/* Fade to white at bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-b from-transparent to-white" />
        </div>

        {/* Content pinned to bottom */}
        <div className="relative z-10 mt-auto p-8 sm:p-10">
          {/* Icon badge */}
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center mb-6">
            <Sparkles className="w-4 h-4 text-gray-700" strokeWidth={2} />
          </div>

          <h2 className="text-[2rem] sm:text-[2.4rem] lg:text-[2.8rem] font-bold leading-[1.1] tracking-[-0.03em] text-gray-900 mb-4">
            We Innovate Futures.
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-sm">
            Companies don't evolve by ideas alone. They evolve through innovation —
            building future-ready systems for the next generation of business.
          </p>
          <Link
            to="/about-us"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 active:scale-[0.97] transition-all duration-200"
          >
            Our Philosophy
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  </section>
);

const PartnerBadgesStrip = () => {
  // Triple the logos to ensure seamless infinite scroll
  const marqueeLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="w-full bg-white dark:bg-black py-24 sm:py-28 border-t border-gray-100 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Left-aligned heading block — exact match to "Explore our services" */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gray-400"></div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                Our Ecosystem
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl">
              Strategic <span className="bg-brand-gradient bg-clip-text text-transparent">Partnerships</span>
            </h2>
          </div>

          <Link to="/partners" className="hidden md:flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all mb-2">
            View Full Partner Ecosystem →
          </Link>
        </div>
      </div>

      {/* Full-width Right-to-Left Infinite Marquee — logos only */}
      <div className="relative w-full overflow-hidden">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
        
        <div className="flex w-max animate-[partnerMarquee_30s_linear_infinite] items-center gap-16 sm:gap-24 lg:gap-32 py-10 hover:[animation-play-state:paused]">
          {marqueeLogos.map((logo, index) => (
            <div
              key={`${logo.label}-${index}`}
              className="flex items-center justify-center shrink-0 group"
            >
              <img
                src={logo.src}
                alt={logo.label}
                className={`${logo.scale} w-auto object-contain grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 cursor-pointer filter`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile "View Full Partner Ecosystem" link */}
      <div className="md:hidden flex justify-center mt-8">
        <Link to="/partners" className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all">
          View Full Partner Ecosystem →
        </Link>
      </div>
      
      <style>{`
        @keyframes partnerMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
};

// ============================================================================
// STICKY MOBILE CTA
// ============================================================================
const StickyMobileCTA = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setIsVisible(footerRect.top > window.innerHeight + 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <Link
        to="/contact"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
      >
        Get a Free Consultation
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};



// ============================================================================
// SECTION 3: EXPLORE SERVICES
// ============================================================================




// ... (other imports)

// ============================================================================
// SECTION 4: INDUSTRIES WE SERVE
// ============================================================================
const IndustriesWeServe = () => {
  const { t } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  
  // Group industries into categories
  const categories = {
    "Financial Services": departmentData.filter(d => ["Banking", "Capital_Markets", "Insurance", "Payments"].includes(d.id)),
    "Healthcare & Life Sciences": departmentData.filter(d => ["Healthcare", "Life_Sciences", "Medical_Technology"].includes(d.id)),
    "Communications & Media": departmentData.filter(d => ["Communications", "Media_Entertainment", "Information_Services", "Education"].includes(d.id)),
    "Retail & Consumer": departmentData.filter(d => ["Retail", "Consumer_Goods", "Travel_Hospitality"].includes(d.id)),
    "Industrial & Manufacturing": departmentData.filter(d => ["Manufacturing", "Automotive", "Aerospace_Defense", "Oil_Gas", "Utilities"].includes(d.id)),
    "Technology & Services": departmentData.filter(d => ["High_Tech", "Software_Platforms", "Professional_Services"].includes(d.id)),
    "Public Sector": departmentData.filter(d => ["Public_Sector"].includes(d.id))
  };

  return (
    <section className="py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div 
          ref={titleRef}
          className={`mb-12 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-500"></div>
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              {t('home.industries_section.label')}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('home.industries_section.heading_prefix')} <span className="bg-brand-gradient bg-clip-text text-transparent">{t('home.industries_section.heading_highlight')}</span> {t('home.industries_section.heading_suffix')}.
            </h2>
            <p className="text-lg text-gray-400 leading-relaxed max-w-md lg:text-right">
              {t('home.industries_section.description')}
            </p>
          </div>
        </div>

        {/* Minimalist Industries List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12">
          {[
            { id: 'banking', to: '/industries/banking' },
            { id: 'insurance', to: '/industries/insurance' },
            { id: 'healthcare', to: '/industries/healthcare' },
            { id: 'retail', to: '/industries/retail' },
            { id: 'manufacturing', to: '/industries/manufacturing' },
            { id: 'energy_utilities', to: '/industries/energy' },
            { id: 'travel_hospitality', to: '/industries/travel' },
            { id: 'saas', to: '/industries/saas' },
            { id: 'edtech', to: '/industries/edtech' },
            { id: 'media_tech', to: '/industries/media-technology' },
            { id: 'life_science', to: '/industries/life-science' },
          ].map((item, idx) => (
            <Link 
              key={idx}
              to={item.to}
              className="group flex items-center justify-between py-5 border-b border-white/5 hover:border-brand-blue/30 transition-all duration-300"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                {t(`industries.${item.id}`)}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-brand-cyan group-hover:translate-x-1 group-hover:rotate-[-45deg] transition-all duration-500" />
            </Link>
          ))}
          
          {/* Last Action: Explore All */}
          <Link 
            to="/industries"
            className="group flex items-center justify-between py-5 border-b border-brand-blue/20 hover:border-brand-blue/50 transition-all duration-300"
          >
            <span className="text-sm font-extrabold uppercase tracking-widest text-brand-cyan group-hover:text-white transition-colors">
              Explore the other INDUSTRIES
            </span>
            <ArrowRight className="w-4 h-4 text-brand-cyan group-hover:translate-x-1 group-hover:rotate-[-45deg] transition-all duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 4.5: TRUST STATEMENT (Philosophy)
// ============================================================================

// Typewriter component for Trust Statement headline
const TrustStatementTypewriter = ({ isVisible }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Text with highlight markers
  const fullText = `We Don't Deliver Projects.\nWe Deliver [[Business Outcomes]].`;
  
  // Parse text to find highlighted sections
  const parseText = (text) => {
    const regex = /\[\[(.*?)\]\]/g;
    let match;
    let lastIndex = 0;
    let cleanText = '';
    const highlights = [];

    while ((match = regex.exec(text)) !== null) {
      cleanText += text.slice(lastIndex, match.index);
      const start = cleanText.length;
      cleanText += match[1];
      const end = cleanText.length;
      highlights.push({ start, end });
      lastIndex = regex.lastIndex;
    }
    cleanText += text.slice(lastIndex);
    
    return { text: cleanText, highlights };
  };

  const { text, highlights } = parseText(fullText);

  useEffect(() => {
    if (!isVisible) return;
    
    if (currentIndex < text.length) {
      const char = text[currentIndex];
      let delay = 35; // Cinematic base speed
      
      // Add rhythmic pauses for punctuation
      if (char === '.' || char === '!' || char === '?') delay = 500;
      else if (char === ',' || char === '&' || char === ';') delay = 250;

      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, isVisible, text]);

  const renderText = () => {
    const displayText = displayedText;
    if (!displayText) return null;

    let result = [];
    let lastIndex = 0;
    
    const activeHighlights = highlights.filter(h => h.start < displayText.length);

    activeHighlights.forEach((highlight, idx) => {
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`plain-${idx}`}>
            {displayText.slice(lastIndex, highlight.start)}
          </span>
        );
      }
      
      const end = Math.min(highlight.end, displayText.length);
      if (end > highlight.start) {
        result.push(
          <span 
            key={`highlight-${idx}`}
            className="bg-brand-gradient bg-clip-text text-transparent"
          >
            {displayText.slice(highlight.start, end)}
          </span>
        );
      }
      
      lastIndex = highlight.end;
    });

    if (lastIndex < displayText.length) {
      result.push(
        <span key="remaining">
          {displayText.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl whitespace-pre-line">
      {renderText()}
      {!isComplete && (
        <span className="inline-block w-1 h-8 md:h-10 lg:h-12 bg-brand-gradient ml-1" />
      )}
    </h2>
  );
};const TrustStatementSection = () => {
  const [ref, visible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [activeIndex, setActiveIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const values = [
    {
      title: "Solution-First Approach",
      desc: "We design solutions aligned to your business objectives — not just technical requirements.",
      tags: ["Business Alignment", "Value-Driven", "Strategic ROI"]
    },
    {
      title: "Ownership Beyond Go-Live",
      desc: "Post-deployment support, optimization, and issue resolution are built into our engagement model.",
      tags: ["Continuous Support", "L3 Managed", "SLA Assurance"]
    },
    {
      title: "Clear Ownership & Governance",
      desc: "Clear milestones, governance, and escalation paths — no ambiguity, no surprises.",
      tags: ["Transparency", "Milestone Tracking", "Risk Mitigation"]
    },
    {
      title: "Long-Term Partnership Mindset",
      desc: "We operate as an extension of your organization, not an external vendor.",
      tags: ["Embedded Teams", "Strategic Growth", "Culture Fit"]
    }
  ];

  // Removed auto-cycle to prioritize user-driven hover interaction


  return (
    <section id="trust-statement" className="py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-50 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 lg:items-start"
        >
          {/* Left Column: Heading & Context */}
          <div className={`transition-all duration-1000 lg:pt-8 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <TrustStatementTypewriter isVisible={visible} />
            <p className="mt-8 text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg font-medium">
              Most firms hand off a deliverable and move on. We stay embedded — owning performance, stability, and continuous improvement long after go-live.
            </p>
            
            <div className="mt-12">
              <Link 
                to="/services"
                className="group inline-flex items-center gap-3 text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs hover:text-brand-blue transition-colors"
              >
                Explore How We Deliver
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive List — hover on desktop, tap on mobile */}
          <div 
            className="flex flex-col"
            onMouseLeave={() => {
              setIsHovered(false);
              setActiveIndex(null);
            }}
          >
            {values.map((val, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(prev => prev === idx ? null : idx)}
                  className="relative border-b border-gray-100 last:border-0 group cursor-pointer"
                >
                  <div className="transition-all duration-500 py-8 px-0">
                    {/* Header: Title + Chevron for mobile affordance */}
                    <div className="flex items-center justify-between">
                      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold transition-all duration-500 ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {val.title}
                      </h3>
                      <ChevronDown className={`w-5 h-5 lg:hidden text-gray-400 transition-transform duration-500 ${
                        isActive ? 'rotate-180 text-gray-900 dark:text-white' : ''
                      }`} />
                    </div>

                    {/* Content (Description + Tags) */}
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isActive ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                    }`}>
                      <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                        {val.desc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {val.tags.map(tag => (
                          <span key={tag} className="px-4 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  const sectionRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the section has moved through the viewport
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const scrollDistance = viewportHeight + rect.height;
        const scrollPosition = viewportHeight - rect.top;
        const progress = scrollPosition / scrollDistance;
        
        // Move content up as we scroll down
        setParallaxOffset((progress - 0.5) * -100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="pt-32 pb-24 relative overflow-hidden bg-[#111827]"
    >
      <div 
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        {/* Section Header */}
        <div 
          ref={titleRef}
          className={`mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-cyan-400"></div>
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest font-mono">
                INSIGHTS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-display">
              Research & <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Insights</span>.
            </h2>
          </div>
          <Link 
            to="/contact" 
            className="group flex items-center gap-3 text-[15px] font-bold text-white hover:text-cyan-400 transition-colors uppercase tracking-widest"
          >
            {t('home.case_studies.see_all')}
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-brand-blue transition-all duration-300 shadow-lg">
              <ArrowRight className="w-5 h-5 text-gray-900 group-hover:text-white transition-all duration-300" />
            </span>
          </Link>
        </div>

        {/* Editorial Layered Content Architecture Composition */}
        <div className="flex flex-col gap-16 w-full pt-6">
          
          {/* Hero Composition: Neon Waves + Overlay Card (Top Row) */}
          <div className="relative w-full h-[340px] flex items-center group">
            
            {/* Media Block: Edge-to-edge backdrop SVG */}
            <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl z-0">
              {/* Custom High-Fidelity Laser Glow Neon waves background */}
              <svg className="absolute inset-0 w-full h-full object-cover scale-[1.01] group-hover:scale-[1.04] transition-transform duration-[1.5s] ease-out" viewBox="0 0 800 350" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="neon-wave-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#080a10" />
                    <stop offset="50%" stopColor="#030408" />
                    <stop offset="100%" stopColor="#010204" />
                  </linearGradient>
                  <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="100%" height="100%" fill="url(#neon-wave-bg)" />
                {/* Tech grid lines */}
                <g stroke="rgba(255,255,255,0.02)" strokeWidth="1">
                  <path d="M0 50 H800 M0 100 H800 M0 150 H800 M0 200 H800 M0 250 H800 M0 300 H800" />
                  <path d="M50 0 V350 M100 0 V350 M150 0 V350 M200 0 V350 M250 0 V350 M300 0 V350 M350 0 V350 M400 0 V350 M450 0 V350 M500 0 V350 M550 0 V350 M600 0 V350 M650 0 V350 M700 0 V350 M750 0 V350" />
                </g>
                {/* Wavy Neon Curves - Laser cores on glowing blur paths */}
                <path d="M-50 160 Q150 40 350 160 T750 160" stroke="#f43f5e" strokeWidth="6" filter="url(#neon-glow)" opacity="0.7" fill="none" />
                <path d="M-50 160 Q150 40 350 160 T750 160" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" fill="none" />

                <path d="M-50 190 Q150 310 350 190 T750 190" stroke="#3b82f6" strokeWidth="5" filter="url(#neon-glow)" opacity="0.65" fill="none" />
                <path d="M-50 190 Q150 310 350 190 T750 190" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" fill="none" />

                <path d="M-50 130 Q150 180 350 130 T750 130" stroke="#a855f7" strokeWidth="5" filter="url(#neon-glow)" opacity="0.6" fill="none" />
                <path d="M-50 130 Q150 180 350 130 T750 130" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" fill="none" />
              </svg>
            </div>

            {/* Content Block: Floating Card overlay, 40% width, aligned right, taller height for overflow overlap */}
            <div className="absolute right-6 w-[90%] md:w-[40%] h-[300px] bg-[#20242e] p-8 lg:p-10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-6">
                  — Report
                </p>
                <h3 className="text-xl md:text-2xl font-medium text-white leading-tight mb-8 font-display">
                  AI meets the grid: Shaping the data center power play
                </h3>
              </div>
              <div className="mt-auto">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono block">
                  CAPGEMINI RESEARCH INSTITUTE
                </span>
              </div>
            </div>

          </div>

          {/* Row 2: Story Block A (Left) & Story Block B (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            
            {/* Story Block A: Solid Slate-Blue Glass Card (col-span-4) */}
            <div className="group relative lg:col-span-4 w-full rounded-3xl bg-[#1c2d47] p-8 lg:p-10 flex flex-col justify-between h-[380px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-500">
              {/* Bevel highlight */}
              <div className="absolute inset-0 z-30 pointer-events-none rounded-3xl border border-white/[0.06] shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.12),inset_0_-1.5px_0_0_rgba(0,0,0,0.6)]" />
              
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-6">
                  — Capgemini Research Institute
                </p>
                <h3 className="text-lg lg:text-xl font-medium text-white leading-relaxed mb-8 font-display">
                  Open source: Key to reclaiming public sector digital sovereignty
                </h3>
              </div>
              
              <div className="mt-auto">
                <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase font-mono block">
                  CAPGEMINI RESEARCH INSTITUTE
                </span>
              </div>
            </div>

            {/* Story Block B: Organic Leaves + Overlay Card (col-span-8) */}
            <div className="relative lg:col-span-8 w-full h-[380px] flex items-center group">
              
              {/* Media Block: Edge-to-edge backdrop SVG */}
              <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-2xl z-0">
                {/* Custom Organic Teal Foliage / Bokeh SVG Background */}
                <svg className="absolute inset-0 w-full h-full object-cover scale-[1.01] group-hover:scale-[1.04] transition-transform duration-[1.5s] ease-out" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="organic-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#011b15" />
                      <stop offset="50%" stopColor="#010c10" />
                      <stop offset="100%" stopColor="#000204" />
                    </linearGradient>
                    <filter id="organic-glow-filter-1" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="25" result="blur" />
                    </filter>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#organic-grad-1)" />
                  {/* Glowing bokeh spots */}
                  <circle cx="600" cy="180" r="140" fill="#0d9488" opacity="0.25" filter="url(#organic-glow-filter-1)" />
                  <circle cx="450" cy="120" r="100" fill="#0891b2" opacity="0.2" filter="url(#organic-glow-filter-1)" />
                  <circle cx="720" cy="140" r="90" fill="#10b981" opacity="0.15" filter="url(#organic-glow-filter-1)" />
                  
                  {/* Overlapping organic leaves tapering to beautiful points (Uncropped) */}
                  <g fill="#0d9488" opacity="0.22">
                    {/* Leaf 1 (Large) */}
                    <path d="M 480 400 C 550 300, 640 180, 720 100 C 660 160, 540 280, 480 400 Z" />
                    {/* Leaf 2 (Medium) */}
                    <path d="M 560 400 C 620 310, 700 220, 780 160 C 730 210, 630 300, 560 400 Z" opacity="0.6" />
                    {/* Leaf 3 (Small) */}
                    <path d="M 400 400 C 460 320, 540 240, 620 180 C 570 230, 470 320, 400 400 Z" opacity="0.8" fill="#115e59" />
                  </g>
                  
                  {/* Fine glowing neon-teal outline veins tapering to tips */}
                  <path d="M 480 400 C 550 300, 640 180, 720 100" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />
                  <path d="M 560 400 C 620 310, 700 220, 780 160" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
                  <path d="M 400 400 C 460 320, 540 240, 620 180" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" fill="none" />
                </svg>
              </div>

              {/* Content Block: Floating Card overlay, 42% width, aligned left, taller height for overflow overlap */}
              <div className="absolute left-6 w-[90%] md:w-[42%] h-[340px] bg-[#20242e] p-8 lg:p-10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.7)] z-10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 mb-6">
                    — Report
                  </p>
                  <h3 className="text-lg lg:text-xl font-medium text-white leading-relaxed mb-8 font-display">
                    Data-powered Innovation Review | Wave 12
                  </h3>
                </div>
                <div className="mt-auto">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase font-mono block">
                    CAPGEMINI RESEARCH INSTITUTE
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* New CTA Banner - Attached to bottom (Outside Parallax) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-20">
        <div className="bg-brand-gradient p-8 md:p-12 rounded-t-sm shadow-2xl animate-fade-in-up">
          <div className="max-w-4xl">
            <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8">
              Explore how organizations partner with us to strengthen delivery performance, enhance compliance posture, and achieve measurable operational outcomes.
            </h3>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 text-lg font-bold text-white hover:text-white/90 transition-colors group"
            >
              Speak with our team
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
// ============================================================================

// ============================================================================
// SECTION 5.5: LEADERSHIP (FOUNDER STATEMENT)
// ============================================================================

const LeadershipSection = () => {
  const [ref, visible] = useScrollAnimation({ once: true, threshold: 0.15 });

  return (
    <section className="py-24 md:py-36 bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div 
          ref={ref}
          className={`grid lg:grid-cols-12 gap-16 lg:gap-24 items-center transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          {/* Left Column: Simple rectangular premium portrait (Col 5) */}
          <div className="lg:col-span-5 relative group">
            <div className="relative overflow-hidden shadow-2xl max-w-sm sm:max-w-md mx-auto lg:mx-0 aspect-[4/5] rounded-xl border border-gray-100 dark:border-neutral-900">
              <img 
                src="/images/leadership/ceo-mahesh-kumar.png" 
                alt="C.O.D.E., Founder and CEO" 
                className="w-full h-full object-cover object-top block transform scale-[1.01] group-hover:scale-105 transition-transform duration-[1.2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Right Column: Clean Minimalist Editorial Text (Col 7) */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6 text-left">
            
            <div className="space-y-6 text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100 leading-[1.7] font-sans">
              <p>
                The next era won't be defined by companies that adopt AI. It will be defined by those that use it to amplify what only humans bring: <span className="font-bold text-black dark:text-white">imagination, ambition, judgment, and the courage to pursue what once seemed impossible.</span>
              </p>
              <p>
                Machines can automate tasks and accelerate decisions, but <span className="font-bold text-black dark:text-white">they cannot create purpose, vision, or meaning.</span> That's why we've chosen a side: <span className="font-bold text-black dark:text-white">human outcomes always lead.</span> Humans set the destination; intelligent systems accelerate the journey. The future belongs to organizations that <span className="font-bold text-black dark:text-white">combine human ingenuity with intelligent systems</span> to achieve more than either could alone.
              </p>
              <p>
                <span className="font-bold text-black dark:text-white">At Kangqore, we innovate futures.</span>
              </p>
            </div>

            {/* Editorial Attribution & Minimalist Links */}
            <div className="pt-6 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between mt-8">
              <div>
                <p className="text-gray-900 dark:text-white font-semibold text-lg tracking-tight">C.O.D.E.</p>
                <p className="text-xs text-neutral-500 font-medium tracking-wider uppercase mt-0.5">Founder & CEO, Kangqore</p>
              </div>

              {/* Minimalist standalone social icons matching the reference image */}
              <div className="flex items-center gap-6">
                <a
                  href="https://in.linkedin.com/in/maheshkumario"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-neutral-400 opacity-70 hover:opacity-100 hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-300 ease-out"
                  aria-label="LinkedIn"
                >
                  <svg 
                    className="w-6 h-6 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/maheshkumarx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-neutral-400 opacity-70 hover:opacity-100 hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-300 ease-out flex items-center justify-center"
                  aria-label="X"
                >
                  <svg 
                    className="w-5 h-5 fill-current" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};



// ============================================================================
// SECTION 9: EQORE COMMAND CENTER (Automation)
// ============================================================================
const EqoreTypingSection = ({ bookingRef }) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState("Command the Intelligence Core...");

  const { listening, toggle } = useVoiceInput({
    onFinal: (text) => {
      setInputValue(text);
      executeAutomate(text);
    }
  });

  const executeAutomate = async (text) => {
    if (!text || !text.trim() || isProcessing) return;

    setIsProcessing(true);
    setFeedback("Processing with NLP engine...");

    try {
      // Advanced NLP Parser — async call to chrono-node backend
      const intent = await parseSchedulingRequestAsync(text);

      if (intent.understood) {
        let finalTimeStr = intent.timeStr;
        if (!finalTimeStr && intent.timeRange) {
          finalTimeStr = timeRangeToTimeStr(intent.timeRange);
        }

        if (finalTimeStr && intent.targetDate) {
          if (bookingRef.current) {
            bookingRef.current.selectDateTime(intent.targetDate, finalTimeStr);
            setFeedback(intent.summary || `Automation engaged: Setting consultation for ${format(intent.targetDate, 'EEEE')} at ${finalTimeStr}.`);
            
            // Scroll to widget to show selection
            const widget = document.getElementById('scheduling-widget');
            if (widget) widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          // Understood partially (e.g. "next week" with no time)
          setFeedback(intent.summary || "Please specify a time, e.g., 'Friday at 2pm'.");
          if (intent.targetDate && bookingRef.current) {
             // Just select the date
             bookingRef.current.selectDateTime(intent.targetDate, "09:00 AM"); // placeholder time
             const widget = document.getElementById('scheduling-widget');
             if (widget) widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } else {
        setFeedback("Could not parse schedule. Try: 'Friday at 10:00 AM' or 'tomorrow afternoon'.");
      }
    } catch (err) {
      setFeedback("NLP engine unavailable. Try: 'Friday at 10:00 AM' or 'tomorrow afternoon'.");
    } finally {
      setIsProcessing(false);
      setInputValue('');
    }
  };

  const handleAutomate = async (e) => {
    e.preventDefault();
    await executeAutomate(inputValue);
  };

  return (
    <section className="pb-32 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* eQORE Avatar with Circular Pulse Ring */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-[heroPulseRing_3s_ease-out_infinite]" />
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 dark:border-white/10 shadow-2xl bg-black relative z-10 transition-transform duration-500 hover:scale-110">
              <img src="/images/eqore-avatar.png" alt="eQORE" className="w-full h-full object-cover" />
            </div>
            {/* Mic Button (Replaces Status Indicator) */}
            <button 
              type="button"
              onClick={toggle}
              className={`absolute bottom-0 right-0 w-8 h-8 rounded-full border-2 border-white dark:border-[#0a0a0c] flex items-center justify-center z-20 shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-colors duration-300 ${listening ? 'bg-red-500 text-white' : 'bg-cyan-400 text-white hover:bg-cyan-300'}`}
              aria-label="Start voice input"
            >
              {listening && <div className="absolute inset-0 rounded-full bg-red-500/50 animate-ping pointer-events-none" />}
              <Mic className="w-4 h-4 relative z-10" />
            </button>
          </div>

          {/* Premium Minimal Input Content */}
          <div className="flex-1 w-full relative">
            {/* Custom Marquee Placeholder Overlay */}
            {!inputValue && (
              <div className="absolute inset-0 pointer-events-none flex items-center overflow-hidden whitespace-nowrap z-0">
                <style>
                  {`
                    @keyframes placeholder-scroll {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .animate-placeholder-scroll {
                      animation: placeholder-scroll 25s linear infinite;
                    }
                  `}
                </style>
                <div className="flex animate-placeholder-scroll">
                  <span className="text-2xl md:text-4xl font-light tracking-tight text-gray-300 pr-20">
                    Ask eQORE to book your 30-minute Discovery Call at your preferred date and time.
                  </span>
                  <span className="text-2xl md:text-4xl font-light tracking-tight text-gray-300 pr-20">
                    Ask eQORE to book your 30-minute Discovery Call at your preferred date and time.
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleAutomate} className="relative group z-10">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder=""
                className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 px-0 py-5 text-2xl md:text-4xl font-light tracking-tight text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:border-cyan-400 transition-all duration-500 pr-16"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                <button 
                  type="submit"
                  disabled={isProcessing || !inputValue.trim()}
                  className="p-3 text-cyan-400 hover:text-brand-blue hover:scale-125 active:scale-95 transition-all duration-300 disabled:opacity-0"
                >
                  {isProcessing ? <RefreshCw className="w-6 h-6 md:w-7 md:h-7 animate-spin" /> : <Send className="w-6 h-6 md:w-7 md:h-7" />}
                </button>
              </div>
              
              {/* Animated underline glow on hover/focus */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-cyan-400 transition-all duration-700 group-focus-within:w-full group-hover:w-full opacity-50 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};





// ============================================================================
// REMAINING SECTIONS IMPORTED FROM ORIGINAL COMPONENTS
// ============================================================================
import BookingWidget from '../components/scheduling/BookingWidget';

import TransformCTA from '../components/TransformCTA';
import EqoreShowSection from '../components/podcast/EqoreShowSection';



// ============================================================================
// CAREERS SECTION — SCROLL-DRIVEN STICKY ZOOM & TEXT CROSS-FADE
// ============================================================================
const CareersSection = () => {
  const { t } = useTranslation();
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // 1. Text & CTA fade out and slide left as scroll begins (0 -> 40%)
  const textOpacity = useTransform(scrollYProgress, [0, 0.38], [1, 0]);
  const textX = useTransform(scrollYProgress, [0, 0.38], [0, -60]);
  const textScale = useTransform(scrollYProgress, [0, 0.38], [1, 0.95]);

  // 2. Right Image expands from 50% width to 100% full cover (15% -> 85%)
  const imageWidth = useTransform(scrollYProgress, [0.15, 0.82], ["50%", "100%"]);
  const imageScale = useTransform(scrollYProgress, [0.15, 0.82], [1, 1.18]);
  const cardRadius = useTransform(scrollYProgress, [0.4, 0.85], ["2rem", "0.5rem"]);
  const borderOpacity = useTransform(scrollYProgress, [0.4, 0.85], [0.1, 0]);
  const darkOverlayOpacity = useTransform(scrollYProgress, [0.15, 0.75], [0.7, 0.1]);

  return (
    <section ref={targetRef} className="relative h-[260vh] bg-white dark:bg-black text-white">
      {/* Pinned full-viewport container during scroll */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-8">
        
        <motion.div 
          style={{ borderRadius: cardRadius }}
          className="relative w-full max-w-7xl h-[78vh] bg-[#0a0a0c] overflow-hidden shadow-2xl border border-white/[0.08] flex items-center justify-center transition-all duration-75"
        >
          <div className="w-full h-full relative flex items-center">
            
            {/* Left Column: Text and CTA (Fades Out on Scroll) */}
            <motion.div 
              style={{ 
                opacity: textOpacity, 
                x: textX,
                scale: textScale
              }}
              className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center relative z-20 pointer-events-auto"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-brand-blue/20 border border-brand-blue/30 rounded-full shadow-[0_0_15px_rgba(37,100,234,0.3)]">
                  {t('careers_section.badge', 'Careers')}
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-[1.12] tracking-tight">
                {t('careers_section.heading', 'Build your future with Kangqore')}
              </h2>
              
              <p className="text-base sm:text-lg text-gray-400 font-medium mb-10 max-w-md leading-[1.6]">
                {t('careers_section.description', 'The next-generation AI-first, digital-first, cloud-first partner, we stand at the forefront of business evolution.')}
              </p>
              
              <div>
                <a 
                  href="/careers" 
                  className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-[15px] hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all duration-300"
                >
                  {t('careers_section.cta', 'Explore Careers')}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </motion.div>

            {/* Right Column -> Expands to Full Screen Container Width */}
            <motion.div 
              style={{ width: imageWidth }}
              className="absolute right-0 top-0 bottom-0 h-full overflow-hidden z-10 hidden lg:block"
            >
              <motion.img 
                style={{ scale: imageScale }}
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
                alt="Kangqore Team Collaboration"
                className="w-full h-full object-cover origin-center transition-transform duration-75"
              />
              {/* Dynamic Overlay Gradient that clears as image expands */}
              <motion.div 
                style={{ opacity: darkOverlayOpacity }}
                className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" 
              />
            </motion.div>

            {/* Mobile Fallback Background Image */}
            <div className="absolute inset-0 z-0 lg:hidden overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
                alt="Kangqore Team Collaboration"
                className="w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent" />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};


// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================
const HomePage = () => {
  const bookingRef = useRef(null);
  const [lockedIntent, setLockedIntent] = useState(null);

  useEffect(() => {
    const handleNBALock = (e) => {
      const hco = e.detail;
      if (hco.persona === 'ENTERPRISE_BUYER' || hco.decisionState === 'VENDOR_SELECTION') {
        setLockedIntent('enterpriseBuyer');
      } else if (hco.persona === 'DEVELOPER' || hco.decisionState === 'EVALUATION') {
        setLockedIntent('developer');
      }
    };
    window.addEventListener('kq_nba_locked', handleNBALock);
    
    // Check initial state from HCIP backend
    if (typeof window !== 'undefined') {
      import('../hooks/useVisitorIdentity').then(({ getSessionUuid, getVisitorUuid }) => {
        const BASE = import.meta.env.VITE_BACKEND_URL || '';
        fetch(`${BASE}/api/hcip/recommendations/${getSessionUuid()}?visitorId=${getVisitorUuid()}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.hco && data.hco.confidence.overall > 70) {
              if (data.hco.persona === 'ENTERPRISE_BUYER') setLockedIntent('enterpriseBuyer');
              else if (data.hco.persona === 'DEVELOPER') setLockedIntent('developer');
            }
          })
          .catch(() => {});
      });
    }

    return () => window.removeEventListener('kq_nba_locked', handleNBALock);
  }, []);

  return (
    <>
      <SEO 
        title={coreSEO.home.title}
        description={coreSEO.home.description}
        keywords={coreSEO.home.keywords}
        url={coreSEO.home.url}
        schemas={[{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Kangqore",
          "url": "https://kangqore.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://kangqore.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }]}
      />
      <HomeRuler />
      <HeroCarousel />
      {/* Dynamic AI Banner if website shifted */}
      {lockedIntent && (
        <div className="w-full bg-brand-blue/10 border-b border-brand-cyan/20 py-3 text-center animate-fade-in z-50 relative">
          <span className="text-brand-cyan font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-cyan animate-pulse mr-2" />
            System Realigned: {lockedIntent === 'enterpriseBuyer' ? 'Enterprise Architecture Mode' : 'Developer Docs Mode'} Active
          </span>
        </div>
      )}

      {/* Dynamic Layout Shift */}
      {lockedIntent === 'enterpriseBuyer' ? (
        <>
          <div id="home-services"><DepartmentCarousel /></div>
          <div id="home-industries"><IndustriesWeServe /></div>
          <TrustIntelligenceLayer />
        </>
      ) : (
        <TrustIntelligenceLayer />
      )}

      <div id="home-concierge">
        <Suspense fallback={<div className="w-full h-[200px]" aria-hidden="true" />}>
          <ConciergeSection />
        </Suspense>
      </div>

      {/* ── Intelligent Solutions 3-card section ── */}
      <section className="py-20 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-16 max-w-3xl">
            {lockedIntent === 'enterpriseBuyer' ? (
              <>Enterprise cloud infrastructure that powers up your <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">scale</span>.</>
            ) : lockedIntent === 'developer' ? (
              <>Developer tools that power up your <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">code</span>.</>
            ) : (
              <>Intelligent solutions that power up your <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">business</span>.</>
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {[
              {
                title: 'Industries',
                description: 'Select your industry. Discover our impact.',
                image: '/images/chess_bg.png',
                link: '/',
                scrollTo: 'home-industries',
                raise: false,
              },
              {
                title: 'Services',
                description: 'Experience our services. Transform your business.',
                image: '/images/hybrid-it-reality-7793698.jpg',
                link: '/services',
                raise: true,
              },
              {
                title: 'Kangqore BIDS™',
                description: 'Explore our intelligence platform. Accelerate your performance.',
                image: '/images/imgbg3.png',
                link: '/bids',
                raise: false,
              },
            ].map((card) => (
              <Link
                key={card.title}
                to={card.link}
                onClick={card.scrollTo ? (e) => { e.preventDefault(); document.getElementById(card.scrollTo)?.scrollIntoView({ behavior: 'smooth' }); } : undefined}
                className={`group relative block${card.raise ? ' md:-translate-y-10' : ''}`}
              >
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Overlapping dark content panel */}
                <div className="relative -mt-16 mx-3 bg-[#0d0d0d] rounded-2xl px-6 pt-6 pb-7 z-10 group-hover:bg-[#131313] transition-colors duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">{card.title}</h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        <span className="font-bold text-white">{card.title} : </span>
                        {card.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-blue/30 group-hover:scale-110 transition-transform duration-300">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Phase D — 6-department canonical grid replaces the legacy 15-dept carousel. */}
      {lockedIntent !== 'enterpriseBuyer' && (
        <>
          <div id="home-services"><DepartmentCarousel /></div>
          <div id="home-industries"><IndustriesWeServe /></div>
        </>
      )}
      <TrustStatementSection />
      <PartnerBadgesStrip />
      <div id="home-bids"><BIDSPhilosophySection /></div>
      <TestimonialsSection />
      <LeadershipSection />
      <EqoreShowSection />

      <section id="scheduling-widget" className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Schedule Your <span className="bg-brand-gradient bg-clip-text text-transparent">Consultation</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Choose a time that works for you and let's discuss how we can innovate your future together.
          </p>
          <AvailabilityPulse eventTypeSlug="discovery-call" />
        </div>
        <BookingWidget ref={bookingRef} eventTypeSlug="discovery-call" />
      </section>

      <EqoreTypingSection bookingRef={bookingRef} />

      <CareersSection />
      <TransformCTA />
      <StickyMobileCTA />
    </>
  );
};

export default HomePage;
