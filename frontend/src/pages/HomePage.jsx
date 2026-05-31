import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format, addDays } from 'date-fns';
import { parseSchedulingRequest, parseSchedulingRequestAsync, timeRangeToTimeStr } from '../hooks/nlpSchedulingParser';
import AvailabilityPulse from '../components/scheduling/AvailabilityPulse';

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
  Landmark, Factory, Monitor, Sparkles, Quote, Star
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
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085844_21a8f4b3-dea5-4ede-be16-d53f6973bb14.mp4",
  },
  {
    id: 2,
    type: 'chat',
    tag: "eQORE AI™ CONCIERGE",
    title: "Innovate Your Next Move.",
    description: "",
    video: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085844_21a8f4b3-dea5-4ede-be16-d53f6973bb14.mp4",
  },
  {
    id: 3,
    type: 'product',
    tag: "PROPRIETARY INTELLIGENCE",
    title: "Kangqore BIDS™",
    description: "Kangqore BIDS™ is a proprietary intelligence framework that diagnoses operational bottlenecks, maps growth opportunities, and recommends data-backed transformation priorities across technology, operations, marketing, security, and business systems.",
    cta: "Request a Diagnostic Assessment",
    secondaryCta: "Explore BIDS™",
    link: "/contact",
    secondaryLink: "/bids",
    background: "/images/imgbg3.png",
  },
  {
    id: 4,
    type: 'statement',
    tag: "OUR PHILOSOPHY",
    title: "",
    description: "",
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
// HERO BOTTOM STRIP — Stats / Featured / Podcast
// ============================================================================

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');
  const hasDecimal = value.includes('.');

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = progress * numericValue;
      setCount(hasDecimal ? currentVal.toFixed(1) : Math.floor(currentVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericValue, duration, hasDecimal]);

  return <>{count}{suffix}</>;
};

const heroStats = [
  { value: '6', label: 'Departments' },
  { value: '61+', label: 'Capabilities' },
  { value: '150+', label: 'Projects Delivered' },
  { value: '98.4%', label: 'Client Satisfaction' }
];

const HeroBottomStrip = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true, threshold: 0.1 });

  return (
    <div 
      ref={sectionRef}
      className="relative z-20 w-full bg-black/40 backdrop-blur-xl border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-12 flex flex-col md:flex-row flex-wrap justify-between items-center gap-10">
        {heroStats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center sm:items-start group cursor-default">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white group-hover:text-cyan-400 transition-colors duration-300 font-display">
              {isVisible ? <AnimatedNumber value={stat.value} /> : '0'}
            </div>
            <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white/70 transition-colors mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HUDText = ({ text, delay = 0, isCyan = false }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    setDisplayText('');
    let i = 0;
    
    const startTimer = setTimeout(() => {
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(prev => text.slice(0, prev.length + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }, delay);
    
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  return (
    <span className="relative inline-flex items-center">
      {displayText}
      {displayText.length < text.length && (
        <span className={`inline-block w-[0.4em] h-[1em] ml-[0.1em] ${isCyan ? 'bg-cyan-400' : 'bg-white/70'} animate-[pulse_0.1s_ease-in-out_infinite]`} />
      )}
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
    
    const duration = activeSlide === 0 ? 15000 : 10000;
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
    <div className="w-full bg-white dark:bg-black px-2 pt-2 pb-2 relative transition-colors duration-500">

    <section
      className="relative w-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228]"
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
      <div className="relative min-h-[720px] sm:min-h-[760px] lg:min-h-[800px] overflow-hidden pb-[0.3cm]">
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
            {slide.type === 'product' && slide.background && (
              <img
                src={slide.background}
                alt="Kangqore BIDS Dashboard"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {slide.type === 'statement' && (
              <>
                <img 
                  src="/images/chess_bg.png" 
                  alt="Chess Background" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                {/* Subtle dark overlay to ensure the text remains legible over the image */}
                <div className="absolute inset-0 bg-black/40" />
              </>
            )}
            {/* Gradient overlays — skip for statement slide to keep it bright */}
            {slide.type !== 'statement' && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              </>
            )}
          </div>
        </div>
      ))}

      {/* ── CONTENT LAYERS (stacked, crossfade) ── */}
      <div className="relative z-[2] min-h-[720px] sm:min-h-[760px] lg:min-h-[800px]">
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


              {/* ── Statement slide: matched to reference design ── */}
              {slide.type === 'statement' ? (
                <div className="w-full h-full relative">
                  {/* Centered text block — matching reference placement */}
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                    <div className="flex items-start gap-4 sm:gap-6 lg:gap-8 translate-x-[40px] sm:translate-x-[60px] md:translate-x-[90px] lg:translate-x-[120px] xl:translate-x-[160px]">
                      {/* Rotating circle badge — matching reference */}
                      <Link 
                        to="/about-us" 
                        className="relative w-[50px] h-[50px] sm:w-[65px] sm:h-[65px] md:w-[80px] md:h-[80px] lg:w-[90px] lg:h-[90px] flex-shrink-0 mt-1 sm:mt-2 block cursor-pointer group hover:scale-110 transition-transform duration-300 z-10"
                      >
                        <div className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]">
                          {/* Outer ring with gradient border */}
                          <div className="absolute inset-0 rounded-full p-[2px] bg-brand-gradient">
                            <div className="w-full h-full rounded-full bg-[#0a1228] opacity-80" />
                          </div>
                          {/* Rotating text */}
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                            <defs>
                              <path id="circlePath4" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                              <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#4ab6d4" />
                                <stop offset="100%" stopColor="#2564ea" />
                              </linearGradient>
                            </defs>
                            <text fill="#ffffff" fontSize="10.5" fontWeight="700" letterSpacing="3.5">
                              <textPath href="#circlePath4">KNOW ABOUT KANGQORE • ★ ★ ★ • </textPath>
                            </text>
                          </svg>
                          {/* Center arrow */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white -rotate-45" strokeWidth={3} />
                          </div>
                        </div>
                      </Link>
                    <h1 className="leading-[1.12] tracking-[-0.02em] text-white mb-0 select-none text-left">
                      {/* Line 1: "Companies don't evolve" */}
                      <span className="block">
                        <span className="text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem] font-black italic uppercase">Companies</span>
                        <span className="text-[0.55rem] sm:text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem] font-bold lowercase ml-1.5 sm:ml-2 opacity-90">don't evolve</span>
                      </span>
                      {/* Line 2: "by ideas alone. They evolve" */}
                      <span className="block">
                        <span className="text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem] font-black italic uppercase">By Ideas Alone.</span>
                        <span className="text-[0.55rem] sm:text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem] font-bold normal-case ml-1.5 sm:ml-2 opacity-90">They evolve</span>
                      </span>
                      {/* Line 3: "through innovation." */}
                      <span className="block">
                        <span className="text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem] font-black italic uppercase">Through</span>
                        <span className="ml-1.5 sm:ml-2">
                          <span className="text-[1.1rem] sm:text-[1.6rem] md:text-[2.1rem] lg:text-[2.6rem] xl:text-[2.9rem] font-black italic uppercase bg-brand-gradient bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(37,100,234,0.3)]">Innovation.</span>
                        </span>
                      </span>
                      {/* Line 4: "At Kangqore" & "We Innovate Futures." */}
                      <span className="flex items-baseline gap-3 sm:gap-4 -mt-1 sm:-mt-2">
                        <span className="text-[0.55rem] sm:text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem] font-bold tracking-[0.2em] text-white whitespace-nowrap">At Kangqore</span>
                        <span className="text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.75rem] font-black italic uppercase bg-brand-gradient bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(37,100,234,0.3)]">We Innovate Futures.</span>
                      </span>
                    </h1>
                    </div>
                  </div>

                  {/* Subline — anchored bottom-left, matching the reference */}
                  <p className="absolute bottom-0 left-[40px] text-[0.55rem] sm:text-[0.7rem] md:text-[0.8rem] lg:text-[0.9rem] xl:text-[1rem] text-white/70 leading-[1.65] max-w-2xl animate-fade-in font-bold">
                    AI, Engineering, Cloud, Cybersecurity, and Intelligent Transformation,<br className="hidden sm:block" /> building future-ready systems for the next generation of business.
                  </p>
                </div>
              ) : (
              <div className={`${
                slide.type === 'product' 
                  ? 'max-w-[680px]' 
                  : slide.type === 'chat' 
                    ? 'max-w-[1000px]'
                    : 'max-w-5xl'
              } flex flex-col h-full`}>
                
                <div className="space-y-5 flex-shrink-0">

                  <h1
                    key={`title-${slide.id}`}
                    className={`text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white animate-fade-in ${
                      (slide.id === 2 || slide.id === 3) ? 'whitespace-nowrap text-[6.5vw] sm:text-[2.8rem]' : ''
                    }`}
                  >
                  {slide.title}
                  {slide.titleGradient && (
                    <>
                      {' '}
                      <span className="bg-brand-gradient bg-clip-text text-transparent">{slide.titleGradient}</span>
                    </>
                  )}
                </h1>

                {/* Trademark badge for BIDS slide */}
                {slide.trademark && (
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-gradient shadow-lg shadow-blue-500/20">
                    <span className="text-[13px] font-bold text-white tracking-wide">{slide.trademark}</span>
                  </div>
                )}

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
                    <HeroChatWidget />
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
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] bg-white/70 backdrop-blur-xl text-gray-900 shadow-xl"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        <span className="relative z-10 text-gray-900 font-bold tracking-wide text-[13px]">
                          {slide.cta}
                        </span>
                        <div className="relative z-10 w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center transition-all duration-500 group-hover:bg-brand-blue shadow-md">
                          <ArrowRight className="w-4 h-4 text-white transition-all duration-500 group-hover:translate-x-0.5" />
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
                        <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
              )}
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
                setIsManuallyPaused(prev => !prev);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
              aria-label={isManuallyPaused ? "Start autoplay" : "Pause autoplay"}
            >
              {isManuallyPaused ? (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              ) : (
                <Pause className="w-5 h-5 fill-current" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToSlide((activeSlide + 1) % slideCount);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>
      </div>
      <style>{`
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

    <section className="relative w-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228] mt-2">


      {/* ── Hero Bottom Strip ── */}
      <HeroBottomStrip />
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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

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

const PartnerBadgesStrip = () => {
  // Triple the logos to ensure seamless infinite scroll
  const marqueeLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  return (
    <section className="w-full bg-white dark:bg-black py-24 sm:py-28 border-y border-gray-100 dark:border-gray-800/50">
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
            Many More+
            <ArrowRight className="w-5 h-5" />
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

      {/* Mobile "Many More+" link */}
      <div className="md:hidden flex justify-center mt-8">
        <Link to="/partners" className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all">
          Many More+
          <ArrowRight className="w-5 h-5" />
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
              At Kangqore, engagement doesn't end with delivery. We take ownership of outcomes — from strategy and execution to long-term stability and support.
            </p>
            
            <div className="mt-12">
              <Link 
                to="/services/post-delivery-support"
                className="group inline-flex items-center gap-3 text-gray-900 dark:text-white font-bold uppercase tracking-widest text-xs hover:text-brand-blue transition-colors"
              >
                Understand Post-Delivery Support
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive List */}
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
                  className="relative border-b border-gray-100 last:border-0 group cursor-pointer"
                >
                  <div className="transition-all duration-500 py-8 px-0">
                    {/* Header: Title */}
                    <div className="flex items-center">
                      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold transition-all duration-500 ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {val.title}
                      </h3>
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

// ============================================================================
// SECTION 5: TESTIMONIALS
// ============================================================================
const TestimonialCard = ({ testimonial, index, isActive, onHover }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  // Abstract gradients for the left image area
  const gradients = [
    "from-purple-600 via-pink-600 to-rose-500",
    "from-indigo-600 via-blue-600 to-cyan-500",
    "from-teal-600 via-emerald-500 to-cyan-500"
  ];
  const bgGradient = gradients[index % gradients.length];

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onHover}
      className={`group relative flex flex-col md:flex-row rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-2xl cursor-pointer transform origin-center w-full max-w-[85vw] md:max-w-3xl min-h-[400px] md:min-h-[500px] flex-shrink-0 ${
        cardVisible ? 'translate-y-0' : 'translate-y-20 opacity-0'
      } ${
        isActive 
          ? 'scale-100 z-30 opacity-100 mx-0 lg:mx-4 blur-none' 
          : 'scale-[0.45] z-10 opacity-60 hover:opacity-80 -mx-[25vw] md:-mx-[220px] lg:-mx-[260px] xl:-mx-[280px] blur-[1px]'
      }`}
      style={{ transitionDelay: cardVisible ? '0s' : `${index * 0.15}s` }}
    >
      {/* Left side: Abstract Graphic */}
      <div className={`w-full md:w-2/5 min-h-[200px] md:min-h-full bg-gradient-to-br ${bgGradient} relative overflow-hidden flex-shrink-0`}>
        {/* Decorative glass shapes */}
        <div className="absolute top-1/4 -left-1/4 w-full h-full bg-white/10 backdrop-blur-md rounded-3xl transform rotate-12 group-hover:rotate-45 transition-transform duration-1000 ease-in-out" />
        <div className="absolute -bottom-1/4 right-0 w-3/4 h-3/4 bg-black/10 backdrop-blur-md rounded-3xl transform -rotate-12 group-hover:-rotate-45 transition-transform duration-1000 ease-in-out" />
        
        {/* Quote watermark */}
        <div className="absolute bottom-6 left-6 opacity-40 mix-blend-overlay">
          <Quote className="w-16 h-16 text-white" />
        </div>
      </div>

      {/* Right side: Content */}
      <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-between relative bg-[#E9EEF5] dark:bg-gray-900">
        <div className="relative z-10">
          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-6">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#020D3C] text-[#020D3C] dark:fill-brand-blue dark:text-brand-blue" />
            ))}
          </div>

          {/* Quote Text */}
          <blockquote className="text-xl md:text-2xl font-bold text-[#020D3C] dark:text-white leading-tight mb-10">
            {testimonial.quote}
          </blockquote>
        </div>

        {/* Author details */}
        <div className="flex items-center gap-4 mt-auto relative z-10">
          {/* Avatar Initials */}
          <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-[#020D3C] dark:text-gray-300 font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
            {testimonial.initials}
          </div>
          <div>
            <cite className="not-italic text-base font-bold text-[#020D3C] dark:text-white block">
              {testimonial.author}
            </cite>
            <span className="text-xs font-bold text-[#020D3C]/70 dark:text-gray-400 uppercase tracking-widest block mt-1">
              {testimonial.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  const sectionRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

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
        
        // Move content up as we scroll down (speed up the scroll)
        // Offset range from 100px (when entering) to -100px (when leaving)
        setParallaxOffset((progress - 0.5) * -150);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="pt-32 pb-0 relative bg-fixed bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1600&q=80')" 
      }}
    >
      {/* Dark Overlay to ensure readability */}
      <div className="absolute inset-0 bg-gray-900/90 dark:bg-black/90"></div>

      <div 
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div 
          ref={titleRef}
          className={`mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-cyan-400"></div>
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                TESTIMONIALS
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              {t('home.case_studies.heading_prefix')} {t('home.case_studies.heading_highlight')}.
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

        <div className="flex flex-col xl:flex-row items-center justify-start overflow-hidden xl:overflow-visible -space-y-4 xl:-space-y-0 w-full pt-10 pb-20">
          {homeTestimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial} 
              index={index} 
              isActive={activeIndex === index}
              onHover={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* New CTA Banner - Attached to bottom (Outside Parallax) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-16">
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
// SECTION 5.5: LEADERSHIP
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
                alt="Mahesh Kumar, Founder and CEO" 
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
                <p className="text-gray-900 dark:text-white font-semibold text-lg tracking-tight">Mahesh Kumar</p>
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

  const handleAutomate = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    setFeedback("Processing with NLP engine...");

    try {
      // Advanced NLP Parser — async call to chrono-node backend
      const intent = await parseSchedulingRequestAsync(inputValue);

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
            {/* Status Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-cyan-400 border-2 border-white dark:border-[#0a0a0c] rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"></div>
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
                className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 px-0 py-5 text-2xl md:text-4xl font-light tracking-tight text-gray-900 dark:text-white placeholder-gray-300 focus:outline-none focus:border-cyan-400 transition-all duration-500"
              />
              <button 
                type="submit"
                disabled={isProcessing || !inputValue.trim()}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-cyan-400 hover:text-brand-blue hover:scale-125 active:scale-95 transition-all duration-300 disabled:opacity-0"
              >
                {isProcessing ? <RefreshCw className="w-7 h-7 animate-spin" /> : <Send className="w-7 h-7" />}
              </button>
              
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
// CAREERS SECTION
// ============================================================================
const CareersSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-[#0a0a0c] rounded-[2rem] overflow-hidden shadow-2xl border border-white/[0.05]">
          <div className="grid lg:grid-cols-2">
            {/* Left Column: Text and CTA */}
            <div className="p-12 lg:p-16 xl:p-24 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-brand-blue/20 border border-brand-blue/30 rounded-full shadow-[0_0_15px_rgba(37,100,234,0.3)]">
                  {t('careers_section.badge', 'Careers')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
                {t('careers_section.heading', 'Build your future with Kangqore')}
              </h2>
              <p className="text-lg text-gray-400 font-medium mb-12 max-w-md leading-[1.6]">
                {t('careers_section.description', 'The next-generation AI-first, digital-first, cloud-first partner, we stand at the forefront of business evolution.')}
              </p>
              
              <div>
                <a 
                  href="/careers" 
                  className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-[15px] hover:bg-gray-100 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300"
                >
                  {t('careers_section.cta', 'Explore Careers')}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative h-96 lg:h-auto overflow-hidden bg-[#111]">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
                alt="Kangqore Team Collaboration"
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
              />
              {/* Subtle inner gradient to blend edges */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-transparent to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================
const HomePage = () => {
  const bookingRef = useRef(null);

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
      <HeroCarousel />
      <TrustIntelligenceLayer />
      <Suspense fallback={<div className="w-full h-[200px]" aria-hidden="true" />}>
        <ConciergeSection />
      </Suspense>
      {/* Phase D — 6-department canonical grid replaces the legacy 15-dept carousel.
          ExploreServices is no longer rendered (kept in repo only as fallback during transition;
          deletion scheduled for the cleanup PR after Phase F). */}
      <DepartmentCarousel />
      <IndustriesWeServe />
      <TrustStatementSection />
      <PartnerBadgesStrip />
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
