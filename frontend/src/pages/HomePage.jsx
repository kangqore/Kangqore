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
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Calendar, Clock,
  User, Mail, Building, MessageSquare, Check, Cpu, Zap, Users, ArrowRight, ArrowLeft, ArrowUpRight,
  Plus, X, Pause, Play, Briefcase, Globe, Phone, Send, Search, Menu,
  Facebook, Twitter, Linkedin, Instagram, Target, ShieldCheck, Scale, Handshake,
  Bot, RefreshCw, Cloud, TrendingUp, Lock, BarChart3, BookOpen,
  Landmark, Factory, Monitor, Sparkles
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
    tag: "ENTERPRISE TRANSFORMATION",
    title: "Your Business Is Ready To Scale.",
    titleGradient: "Your Systems May Not Be.",
    description: "Kangqore engineers advanced enterprise AI, scalable cloud architecture, and intelligent automation pipelines. We help ambitious companies eliminate operational drag, modernize infrastructure, and convert technology into measurable business growth.",
    microProof: "15 Depts • 61+ Services • Pure Engineering Execution",
    cta: "Get a Business Technology Diagnostic",
    link: "/contact",
    video: "https://cdn.pixabay.com/video/2023/10/20/185859-876772714_large.mp4" 
  },
  {
    id: 2,
    tag: "CYBERSECURITY & RISK",
    title: "Secure The Critical Systems",
    titleGradient: "Your Business Cannot Break.",
    description: "Kangqore actively strengthens critical applications, enterprise cloud environments, core infrastructure, and digital workflows. We deploy security-first engineering designed to systematically reduce operational vulnerabilities and protect business continuity.",
    microProof: "Cloud Risk • Business Continuity",
    cta: "Get Security Snapshot",
    link: "/contact",
    video: "https://cdn.pixabay.com/video/2020/09/11/49603-458315181_large.mp4" 
  },
  {
    id: 3,
    tag: "LEGACY MODERNIZATION",
    title: "Modernize Legacy Systems.",
    titleGradient: "Avoid The Rewrite Gamble.",
    description: "We partner with technology leaders to systematically reduce compounding technical debt and securely migrate outdated monolithic systems. Build highly resilient, cloud-ready architecture through tightly controlled and risk-managed engineering execution.",
    microProof: "Cloud Migration • Risk-Managed Sprints",
    cta: "Request Legacy Risk Audit",
    link: "/department/cloud-engineering",
    video: "https://cdn.pixabay.com/video/2023/05/22/164016-829398835_large.mp4" 
  },
  {
    id: 4,
    tag: "AGENTIC AI & AUTOMATION",
    title: "Automate Manual Workflows.",
    titleGradient: "Keep Control Of Decisions.",
    description: "We custom-design agentic AI workflows, advanced RAG systems, MLOps foundations, and intelligent automation pipelines that drastically reduce repetitive work. Maintain strict human oversight wherever enterprise accuracy, compliance, and judgment matter most.",
    microProof: "Enterprise-Ready AI • Human-in-the-Loop Architecture",
    cta: "Get AI Workflow Assessment",
    link: "/department/ai-cognitive",
    video: "https://cdn.pixabay.com/video/2020/09/11/49603-458315181_large.mp4" 
  },
  {
    id: 5,
    tag: "CONVERSION INTELLIGENCE",
    title: "Your Website Gets Traffic.",
    titleGradient: "But Is It Generating Pipeline?",
    description: "We combine technical SEO, advanced GEO, LLMO, precision CRO, deep funnel analytics, and AI-led lead qualification frameworks. Systematically convert your digital visibility into high-value, sales-ready opportunities for your enterprise pipeline.",
    microProof: "Predictive Lead Scoring • KVIS Visibility Systems",
    cta: "Find Conversion Leaks",
    link: "/department/digital-marketing",
    video: "https://cdn.pixabay.com/video/2023/10/20/185859-876772714_large.mp4"
  }
];

const caseStudies = [
  {
    id: 1,
    category: "FINANCIAL SERVICES",
    title: "Fortune 100 Investment Bank — Core Trading Infrastructure Modernization",
    description: "Reduced latency by 45% and secured $40M in operational savings via cloud modernization.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    link: "/case-studies"
  },
  {
    id: 2,
    category: "HEALTHCARE",
    title: "Top 5 U.S. Healthcare Network — Agentic AI for Claims Processing",
    description: "Achieved 3x faster claims processing and zero-downtime compliance across 12 regions.",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&q=80",
    link: "/case-studies"
  },
  {
    id: 3,
    category: "E-COMMERCE",
    title: "Fortune 500 Global Retailer — End-to-End Supply Chain Automation",
    description: "Delivered 99.99% uptime during peak events and increased checkout conversions by 18%.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    link: "/case-studies"
  },
  {
    id: 4,
    category: "LOGISTICS",
    title: "Tier-1 Global Logistics Carrier — Legacy-to-Microservices Migration",
    description: "Migrated 200+ legacy services to microservices, saving $15M annually in technical debt.",
    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=600&q=80",
    link: "/case-studies"
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
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [numericValue, duration]);

  return <>{count}{suffix}</>;
};

const heroStats = [
  { value: '15', label: 'Departments' },
  { value: '61+', label: 'Services' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' }
];

import { usePodcast } from '../context/PodcastContext';

const HeroBottomStrip = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true, threshold: 0.1 });
  const { isPlaying, togglePlay } = usePodcast();

  return (
    <div 
      ref={sectionRef}
      className="relative z-20 w-full bg-black/40 backdrop-blur-xl border-t border-white/[0.08] shadow-2xl overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-0 items-center">
        
        {/* Left Zone — Company Stats */}
        <div className="py-8 lg:py-12 lg:pr-12 grid grid-cols-2 gap-x-8 gap-y-6 lg:border-r lg:border-white/[0.06]">
          {heroStats.map((stat, i) => (
            <div key={i} className="group cursor-default">
              <div className="text-2xl sm:text-3xl font-black text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300 font-display">
                {isVisible ? <AnimatedNumber value={stat.value} /> : '0'}
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Center Zone — Featured Image (Hidden on Tablet) */}
        <div className="hidden lg:flex items-center justify-center px-10 py-8">
          <div className="relative w-full max-w-[280px] aspect-[16/10] group cursor-pointer transition-all duration-500">
            <img
              src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80"
              alt="The Age of Agentic AI"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/40 to-transparent">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-0.5">Featured</p>
              <p className="text-white text-xs font-bold leading-tight group-hover:text-cyan-50 transition-colors">The Age of Agentic AI</p>
            </div>
            
            {/* Play overlay subtle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center ring-1 ring-white/20">
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone — Podcast Highlight */}
        <div className="py-8 lg:py-12 lg:pl-12 lg:border-l lg:border-white/[0.06] flex items-center gap-6 xl:gap-8">
          {/* Left Part — Info & Waveform */}
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-2">PODCAST</p>
            <h3 className="text-white font-bold text-base leading-tight mb-1">
              The eQORE Show: Agentic Consent
            </h3>
            <p className="text-white/40 text-xs font-semibold mb-4">Episode 1 — Now Streaming</p>
            
            {/* Waveform with centered White Play Button */}
            <div 
              onClick={togglePlay}
              className="relative flex items-center justify-center h-12 w-full max-w-[240px] group cursor-pointer"
            >
              <div className="flex items-center gap-1 h-6 w-full">
                {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7, 0.5, 0.3, 0.6, 0.8, 0.4, 0.7, 0.5, 0.9, 0.6, 0.8].map((h, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      isPlaying ? 'bg-cyan-400 animate-waveform-bounce' : 'bg-cyan-400/30 group-hover:bg-cyan-400/50'
                    }`}
                    style={{ 
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.05}s`
                    }} 
                  />
                ))}
              </div>
              {/* White Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 ring-4 ring-black/20">
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-black fill-current" />
                  ) : (
                    <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => document.getElementById('eqore-show')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-cyan-400 transition-colors items-center gap-2 mt-5"
            >
              Listen Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Part — Cover Image */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 xl:w-40 xl:h-40 flex-shrink-0 group cursor-pointer">
            <img 
              src="/images/Ep-01.png" 
              alt="The eQORE Show" 
              className="w-full h-full object-contain transition-transform duration-700"
            />
          </div>
        </div>

      </div>
      <style>{`
        @keyframes waveform-bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        .animate-waveform-bounce {
          animation: waveform-bounce 0.8s ease-in-out infinite;
        }
      `}</style>
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

const HeroCarousel = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [toggleEffect, setToggleEffect] = useState(false);

  const togglePlayPause = () => {
    setIsPaused(prev => !prev);
    setToggleEffect(true);
    setTimeout(() => setToggleEffect(false), 800);
  };

  const handleBackgroundClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    togglePlayPause();
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setTimeout(() => setIsAnimating(false), 800);
      }
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isAnimating, isPaused]);

  const slide = heroSlides[currentSlide];

  return (
    <>
    <section className="relative overflow-hidden cursor-pointer" onClick={handleBackgroundClick}>
      {/* Full-bleed video background */}
      <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085844_21a8f4b3-dea5-4ede-be16-d53f6973bb14.mp4" type="video/mp4" />
          </video>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        {/* ── Hero Content ── */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 sm:pt-40 lg:pt-[200px] pb-16 sm:pb-20 lg:pb-24">
          <div className="transform translate-y-[0.8cm]">
            {/* Glass cards — absolute positioned right side, lg+ only */}
          <div className="hidden lg:block absolute top-36 sm:top-40 lg:top-52 right-6 sm:right-8 lg:right-12 w-[245px] xl:w-[265px] z-10 -mt-[3.2cm] translate-x-[1.1cm]">
            <HeroGlassCards />
          </div>

          <div className="max-w-[850px] space-y-6">
            
            {slide.microProof && (
              <div key={`micro-${currentSlide}`} className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-[#0a192f]/60 border-l-2 border-cyan-400 border-r border-t border-b border-white/10 backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(34,211,238,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 w-full h-[1px] bg-cyan-400/20 blur-[1px] animate-[scan_2s_ease-in-out_infinite]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                  <HUDText text={slide.tag} isCyan={true} />
                </span>
                <span className="w-1 h-1 rounded-sm bg-cyan-400/50 animate-[pulse_0.5s_infinite]"></span>
                <span className="text-[10px] sm:text-[11px] text-cyan-100/70 font-mono uppercase tracking-wider line-clamp-1">
                  <HUDText text={slide.microProof} delay={slide.tag.length * 30 + 100} />
                </span>
              </div>
            )}

            <h1 
              key={`title-${currentSlide}`}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-white animate-fade-in"
            >
              {slide.title}
              {slide.titleGradient && (
                <>
                  <br />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">{slide.titleGradient}</span>
                </>
              )}
            </h1>
            
            <p 
              key={`desc-${currentSlide}`}
              className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl animate-fade-in font-medium line-clamp-3 py-6 sm:py-8"
            >
              {slide.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 animate-fade-in">
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

              <button 
                onClick={() => document.getElementById('eqore-ai-concierge')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity duration-300"
              >
                <span className="text-[13px] font-bold text-white/90 tracking-wide uppercase">
                  Ask eQORE AI<sup className="text-[9px] ml-0.5 opacity-70">™</sup>
                </span>
                <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

          <style>{`
            @keyframes heroPulseRing {
              0% { transform: scale(1); opacity: 0.6; }
              70% { transform: scale(1.35); opacity: 0; }
              100% { transform: scale(1.35); opacity: 0; }
            }
          `}</style>
        </div>

        {/* Invisible spacer to replace removed carousel indicators and maintain layout height */}
        <div className="h-[48px] mt-16 w-full pointer-events-none opacity-0" aria-hidden="true" />
      </div>
    </div>

      {/* ── Hero Bottom Strip: Events | Featured | Highlights ── */}
      <HeroBottomStrip />

      <style>{`
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
      `}</style>
    </section>
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
      className={`group relative overflow-hidden bg-slate-900 dark:bg-black transition-all duration-700 w-full ${card.aspect}`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
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
    <div className="bg-gray-900 dark:bg-black p-10 flex flex-col justify-center aspect-video">
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
          
          <form onSubmit={handleSubscribe} className="relative mb-4 flex">
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
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white dark:bg-gray-900 dark:border-gray-800/5 transition-colors font-sans">
              Apple
            </button>
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white dark:bg-gray-900 dark:border-gray-800/5 transition-colors font-sans">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white dark:bg-gray-900 dark:border-gray-800/5 transition-colors font-sans">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl mb-10">
              What’s your next <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">brilliant move?</span>
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <p className="max-w-md text-xl leading-relaxed text-gray-600 dark:text-gray-400 font-sans">
                Game-changing work. People-powered growth. We help you think bigger, build stronger, and expand opportunity for all.
              </p>
              <Link to="/insights" className="w-14 h-14 rounded-full border border-gray-200 dark:border-white/20 flex items-center justify-center group hover:bg-gray-900 dark:hover:bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-500 shrink-0">
                <ArrowRight className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors" />
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
// TRUST LOGO STRIP (Social Proof)
// ============================================================================
const trustLogos = [
  { name: "Axis Bank", src: "/assets/logos/axis-bank.svg", scale: "h-8 sm:h-10" },
  { name: "Bank Of Baroda", src: "/assets/logos/bank-of-baroda.svg", scale: "h-10 sm:h-12" },
  { name: "Bank of India", src: "/assets/logos/bank-of-india.svg", scale: "h-10 sm:h-12" },
  { name: "SBI", src: "/assets/logos/sbi.svg", scale: "h-10 sm:h-12" },
  { name: "Indian Railways", src: "/assets/logos/indian-railways-grey.png", scale: "h-12 sm:h-16", preGreyed: true },
  { name: "RSB Industries", src: "/assets/logos/rsb-industries.png", scale: "h-8 sm:h-10" },
  { name: "Government Of Jharkhand", src: "/assets/logos/jharkhand.svg", scale: "h-12 sm:h-16" },
  { name: "Geeks IT Services", src: "/assets/logos/geeks-it-grey.png", scale: "h-10 sm:h-12", preGreyed: true },
  { name: "NIT Jamshedpur", src: "/assets/logos/nit-jamshedpur.png", scale: "h-12 sm:h-14" },
  { name: "TATA Steel", src: "/assets/logos/tata-steel.png", scale: "h-10 sm:h-12" },
];

const TrustLogoStrip = () => {
  return (
    <section className="relative w-full bg-white dark:bg-black py-12 sm:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-10">
        <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] text-center">
          Trusted by <span className="text-gray-900 dark:text-white font-extrabold">150+</span> leading Indian enterprises and <span className="text-gray-900 dark:text-white font-extrabold">50+</span> Fortune <span className="text-gray-900 dark:text-white font-extrabold">500</span> organizations worldwide.
        </p>
        <p className="text-[7px] sm:text-[8px] mt-2 font-medium text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] text-center">
          Our speed in learning and executing is unmatched, earning the trust of hundreds of founders.
        </p>
      </div>
      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-black to-transparent z-10" />
        {/* Scrolling track */}
        <div className="flex animate-marquee-horizontal items-start pt-6 pb-8 w-max">
          {[...trustLogos, ...trustLogos].map((logo, i) => {
            return (
              <div
                key={`${logo.name}-${i}`}
                className="flex flex-col items-center group px-12 shrink-0 transition-all duration-300"
              >
                <div className={`flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-300 filter grayscale ${logo.preGreyed ? '' : 'brightness-0'} dark:invert`}>
                  <img 
                    src={logo.src} 
                    alt={logo.name} 
                    className={`${logo.scale} w-auto object-contain transition-transform duration-300 group-hover:scale-110`}
                  />
                </div>
                <span className="mt-4 text-[10px] font-black text-brand-blue dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 uppercase tracking-widest translate-y-2 group-hover:translate-y-0">
                  {logo.name}
                </span>
              </div>
            );
          })}
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
                className={`${logo.scale} w-auto object-contain opacity-30 group-hover:opacity-100 transition-all duration-500 cursor-pointer filter dark:invert dark:brightness-200`}
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
// SECTION 2: VALUE PROPOSITION
// ============================================================================





const TypewriterText = ({ isVisible }) => {
  const { t, i18n } = useTranslation();
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [parsedContent, setParsedContent] = useState({ text: '', highlights: [] });

  const rawText = t('home.typewriter');

  // Parse the text for delimiters [[...]] to identify highlights
  useEffect(() => {
    const parseText = (text) => {
      const regex = /\[\[(.*?)\]\]/g;
      let match;
      let lastIndex = 0;
      let cleanText = '';
      const highlights = [];

      while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        cleanText += text.slice(lastIndex, match.index);
        
        // Calculate start of highlight in the clean text
        const start = cleanText.length;
        
        // Add the content inside brackets
        cleanText += match[1];
        
        // Calculate end of highlight
        const end = cleanText.length;
        
        highlights.push({ start, end });
        lastIndex = regex.lastIndex;
      }
      
      // Add remaining text
      cleanText += text.slice(lastIndex);
      
      return { text: cleanText, highlights };
    };

    const parsed = parseText(rawText);
    setParsedContent(parsed);
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [rawText, i18n.language]); // Re-parse when text or language changes
  
  useEffect(() => {
    if (!isVisible || !parsedContent.text) return;
    
    if (currentIndex < parsedContent.text.length) {
      const char = parsedContent.text[currentIndex];
      let delay = 10; // Hollywood CGI Cyber speed (super fast)
      
      // Add rhythmic pauses for punctuation
      if (char === '.' || char === '!' || char === '?') delay = 120;
      else if (char === ',' || char === '&' || char === ';') delay = 60;

      const timeout = setTimeout(() => {
        setDisplayedText(parsedContent.text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, isVisible, parsedContent.text]);

  const renderText = () => {
    const text = displayedText;
    const { highlights } = parsedContent;
    
    if (!text) return null;

    let result = [];
    let lastIndex = 0;
    
    // Find highlights that intersect with the currently displayed text
    const activeHighlights = highlights.filter(h => h.start < text.length);

    activeHighlights.forEach((highlight, idx) => {
      // Text before highlight
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`plain-${idx}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }
      
      // Highlighted text
      // Clip end index to current text length (for typing effect)
      const end = Math.min(highlight.end, text.length);
      if (end > highlight.start) {
        result.push(
          <span 
            key={`highlight-${idx}`}
            className="bg-brand-gradient bg-clip-text text-transparent"
          >
            {text.slice(highlight.start, end)}
          </span>
        );
      }
      
      lastIndex = highlight.end;
    });

    // Remaining text after last highlight (if any) that has been typed so far
    if (lastIndex < text.length) {
      result.push(
        <span key="remaining">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white max-w-5xl mb-6 leading-tight tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] dark:drop-shadow-[0_0_12px_rgba(74,182,212,0.2)]">
      {renderText()}
      {!isComplete && (
        <span className="inline-block w-1 h-12 md:h-14 lg:h-16 bg-brand-cyan ml-1 animate-[pulse_0.4s_ease-in-out_infinite] shadow-[0_0_10px_#4ab6d4]" />
      )}
    </h2>
  );
};

const ROIBanner = () => {
  return (
    <div className="w-full relative rounded-xl overflow-hidden shadow-2xl mb-16 border border-white/10 hover:shadow-[0_20px_50px_rgba(37,100,234,0.3)] transition-shadow duration-500 group">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] opacity-95 mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay group-hover:opacity-20 transition-opacity duration-700" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch text-white px-6 py-8 md:p-8 gap-6 md:gap-8">
        
        {/* Left Column: Title + First Stat */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6 lg:mb-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">AI that delivers ROI</h3>
            <Link to="/services" className="lg:hidden text-xs sm:text-sm font-bold bg-white dark:bg-gray-900 dark:border-gray-800 text-[#2564ea] px-4 py-2 rounded shadow hover:bg-gray-100 hover:scale-105 transition-all inline-flex items-center gap-1 whitespace-nowrap">
              Find out more <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div>
            <p className="text-sm sm:text-base leading-relaxed text-blue-50 font-medium">
              <strong className="text-2xl sm:text-3xl font-extrabold text-white mr-1 drop-shadow-sm">45%</strong>
              reduction in app dev effort enabled by AI Force.Software for a Financial services major
            </p>
          </div>
        </div>

        {/* Dividers & Middle Column 1 */}
        <div className="hidden lg:block w-[1px] bg-white dark:bg-black/20 self-stretch" />
        <div className="flex-1 flex items-end">
          <p className="text-sm sm:text-base leading-relaxed text-blue-50 font-medium">
            <strong className="text-2xl sm:text-3xl font-extrabold text-white mr-1 drop-shadow-sm">20%</strong>
            IT Ops MTTR reduction enabled by AI Force.Ops for a Tools manufacturer
          </p>
        </div>

        {/* Dividers & Middle Column 2 */}
        <div className="hidden lg:block w-[1px] bg-white dark:bg-black/20 self-stretch" />
        <div className="flex-1 flex items-end">
          <p className="text-sm sm:text-base leading-relaxed text-blue-50 font-medium">
            <strong className="text-2xl sm:text-3xl font-extrabold text-white mr-1 drop-shadow-sm">3x</strong>
            faster time-to-market achieved via Agentic AI workflows for a Global E-commerce leader
          </p>
        </div>

        {/* Dividers & Right Column */}
        <div className="hidden lg:block w-[1px] bg-white dark:bg-black/20 self-stretch" />
        <div className="flex-1 flex flex-col justify-between">
          <div className="hidden lg:flex justify-end mb-6 lg:mb-4">
            <Link to="/services" className="text-sm font-bold bg-white dark:bg-gray-900 dark:border-gray-800 text-[#2564ea] px-5 py-2.5 rounded shadow-lg hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all inline-flex items-center gap-1.5 whitespace-nowrap">
              Find out more <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-blue-50 font-medium">
            <strong className="text-2xl sm:text-3xl font-extrabold text-white mr-1 drop-shadow-sm">87%</strong>
            investigation time reduction through AI-enabled trade surveillance for a Financial Services major
          </p>
        </div>
        
      </div>
    </div>
  );
};

const ValueProposition = () => {
  const { t, i18n } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });

  return (
    <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-32 lg:pb-40 bg-white dark:bg-black overflow-hidden">
      <VisualBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={titleRef}
          className={`mb-8 lg:mb-10 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <p className="text-gray-500 dark:text-gray-400 text-xl md:text-2xl lg:text-3xl max-w-4xl mb-12 leading-relaxed font-medium tracking-tight">
            {t('home.value_prop_intro')}
          </p>
          
          <ROIBanner />
          
          <TypewriterText isVisible={titleVisible} key={i18n.language} />
          
          <SecondaryButton 
            text="Explore Our Capabilities" 
            link="/services" 
            theme="light"
            className="mt-4"
          />
        </div>
      </div>
    </section>
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
  const fullText = `We don't sell services, We Deliver [[End-to-End Solutions]] With Accountability.`;
  
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
    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl">
      {renderText()}
      {!isComplete && (
        <span className="inline-block w-1 h-12 md:h-14 lg:h-16 bg-brand-gradient ml-1" />
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
    <section className="py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-50 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={ref}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24"
        >
          {/* Left Column: Heading & Context */}
          <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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
                    {/* Header: Title + Arrow */}
                    <div className="flex items-center justify-between gap-4">
                      <h3 className={`text-2xl md:text-3xl lg:text-4xl font-bold transition-all duration-500 ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {val.title}
                      </h3>
                      
                      {/* Arrow / Button */}
                      <div className={`transition-all duration-500 flex-shrink-0 flex items-center justify-center rounded-full ${
                        isActive ? 'w-12 h-12 bg-brand-blue text-white shadow-lg shadow-blue-500/20' : 'w-10 h-10 border border-gray-200 text-gray-400'
                      }`}>
                        <ArrowRight className={`transition-transform duration-500 ${isActive ? 'w-6 h-6 rotate-[-45deg]' : 'w-5 h-5'}`} />
                      </div>
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
// SECTION 5: CASE STUDIES
// ============================================================================
const CaseStudyCard = ({ study, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  return (
    <a 
      href={study.link}
      ref={cardRef}
      className={`group relative h-[500px] rounded-[2rem] overflow-hidden transition-all duration-700 transform hover:scale-[1.02] ${
        cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 0.15}s` }}
    >
      <img 
        src={study.image} 
        alt={study.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
      
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 block">
            {study.category}
          </span>
          <h3 className="text-xl font-bold text-white mb-3 leading-snug">
            {study.title}
          </h3>
          <p className="text-sm text-gray-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {study.description}
          </p>
        </div>
      </div>
    </a>
  );
};

const CaseStudiesSection = () => {
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
      <div className="absolute inset-0 bg-gray-900/90"></div>

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
              <div className="h-[1px] w-12 bg-gray-400"></div>
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                {t('home.case_studies.label')}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              {t('home.case_studies.heading_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300">{t('home.case_studies.heading_highlight')}</span>.
            </h2>
          </div>
          <Link 
            to="/case-studies" 
            className="group flex items-center gap-3 text-[15px] font-bold text-white hover:text-cyan-400 transition-colors uppercase tracking-widest"
          >
            {t('home.case_studies.see_all')}
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-brand-blue transition-all duration-300 shadow-lg">
              <ArrowRight className="w-5 h-5 text-gray-900 group-hover:text-white transition-all duration-300" />
            </span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.slice(0, 3).map((study, index) => (
            <CaseStudyCard key={study.id} study={study} index={index} />
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

// Typewriter component for Leadership Statement headline
const LeadershipTypewriter = ({ isVisible }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Text with highlight markers
  const fullText = `"We don't just build technology. We take [[accountability]] for business outcomes."`;
  
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
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 15);
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
            className="text-transparent bg-clip-text bg-brand-gradient"
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
    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
      {renderText()}
      {!isComplete && (
        <span className="inline-block w-1 h-10 md:h-12 bg-brand-gradient ml-1" />
      )}
    </h2>
  );
};

const LeadershipSection = () => {
  const [ref, visible] = useScrollAnimation({ once: true, threshold: 0.2 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: y * -10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="py-32 bg-white dark:bg-black overflow-hidden relative">
      {/* Decorative Background Element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] font-black text-gray-50/50 dark:text-gray-800/10 pointer-events-none select-none z-0">
        FOUNDER
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div 
          ref={ref}
          className={`grid lg:grid-cols-2 gap-16 lg:gap-24 items-center transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          {/* Image Side with 3D Tilt */}
          <div 
            className="relative group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="relative rounded-[3rem] overflow-visible aspect-[4/5] max-w-md mx-auto lg:mx-0 transition-transform duration-200 ease-out shadow-2xl"
              style={{
                transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Image Container */}
              <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-[#f5f5f7] dark:bg-black">
                <img 
                  src="/images/leadership/ceo-mahesh-kumar.png" 
                  alt="Mahesh Kumar, Founder and CEO" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Floating Glass Nameplate */}
              <div 
                className="absolute -bottom-6 -right-6 lg:-right-12 p-8 rounded-3xl glass-morphism dark:dark-glass shadow-2xl border border-white/20 dark:border-white/10 z-20 min-w-[280px]"
                style={{ transform: 'translateZ(50px)' }}
              >
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-blue/10 rounded-full animate-pulse"></div>
                  <p className="text-gray-900 dark:text-white font-black text-3xl tracking-tight">Mahesh Kumar</p>
                  <p className="text-brand-blue dark:text-brand-cyan font-bold tracking-widest uppercase text-[10px] mt-2 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-brand-blue dark:bg-brand-cyan"></span>
                    Founder & CEO, Kangqore
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-10 lg:pl-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-brand-blue"></div>
                <span className="text-xs font-black text-brand-blue uppercase tracking-[0.3em]">
                  The Visionary
                </span>
              </div>
              <LeadershipTypewriter isVisible={visible} />
            </div>
            
            <div className="space-y-8 text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              <p className="relative">
                <span className="absolute -left-6 top-0 text-6xl font-serif text-gray-100 dark:text-gray-800 pointer-events-none">"</span>
                At Kangqore, we bridge strategy and execution. We help businesses modernize systems, build scalable platforms, and deploy AI-led solutions that perform in real-world conditions.
              </p>
              <p className="text-gray-900 dark:text-white font-bold border-l-4 border-brand-blue pl-6 py-2">
                Our promise is simple: build systems that endure, scale, and deliver measurable value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// SECTION 6: FEATURED INSIGHTS (The Fix)
// ============================================================================
const insightsData = [
  {
    id: 1,
    contentType: "Blogs",
    date: "13 January 2026",
    author: "Kangqore",
    title: "AI-Native Networks: Engineering the Future of Intelligent Telecom",
    tags: ["Agentic AI", "Cloud Platforms", "Enterprise AI"],
    tagColors: ["bg-cyan-200", "bg-blue-200", "bg-cyan-200"],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    link: "#"
  },
  {
    id: 2,
    contentType: "Whitepaper",
    date: "10 January 2026",
    author: "Kangqore",
    title: "The State of Enterprise AI: 2026 Outlook",
    description: "A comprehensive analysis of how large-scale organizations are moving from pilot to production, featuring insights from 500+ CTOs.",
    tags: ["Strategy", "Innovation"],
    tagColors: ["bg-purple-200", "bg-pink-200"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    link: "#"
  },
  {
    id: 3,
    contentType: "Case Study",
    date: "05 January 2026",
    author: "Kangqore",
    title: "Modernizing Legacy Banking Systems at Scale",
    description: "How a leading global bank reduced technical debt by 40% and accelerated feature delivery using our AI-driven migration framework.",
    tags: ["Banking", "Cloud"],
    tagColors: ["bg-green-200", "bg-emerald-200"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    link: "#"
  }
];

const FeaturedCard = ({ item }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  return (
    <div 
      ref={cardRef}
      className={`relative group h-full min-h-[500px] rounded-[2rem] overflow-hidden transition-all duration-700 transform hover:scale-[1.02] cursor-pointer bg-gray-900 ${
        cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
    >
      <img 
        src={item.image} 
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
      />
      
      <div className="absolute top-6 left-6 z-20">
        <span className="px-4 py-2 bg-white dark:bg-black text-gray-900 dark:text-white text-xs font-bold uppercase tracking-wide rounded-full">
          {item.contentType}
        </span>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
          {item.title}
        </h3>
      </div>
    </div>
  );
};

const StandardCard = ({ item, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation({ once: true, threshold: 0.2 });
  
  return (
    <div 
      ref={cardRef}
      className={`flex flex-col bg-[#f5f5f7] dark:bg-black rounded-[2rem] overflow-hidden transition-all duration-700 transform hover:scale-[1.02] group cursor-pointer ${
        cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${index * 0.15 + 0.2}s` }}
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <span className="px-4 py-2 bg-white dark:bg-black text-gray-900 dark:text-white text-xs font-bold uppercase tracking-wide rounded-full">
            {item.contentType}
          </span>
        </div>
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-3">
          <span>{item.author}</span>
          <span>{item.date}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-brand-blue transition-colors">
          {item.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {item.description}
        </p>
        
        <div className="mt-auto flex flex-wrap gap-2">
          {item.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className={`px-3 py-1 ${item.tagColors[idx] || 'bg-gray-100 dark:bg-[#0a0a0c]'} text-gray-900 dark:text-white text-[10px] md:text-xs font-medium rounded-sm`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedInsightsSection = () => {
  const { t } = useTranslation();
  const [titleRef, titleVisible] = useScrollAnimation({ once: true, threshold: 0.3 });
  
  return (
    <section className="py-32 bg-[#f5f5f7] dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div 
          ref={titleRef}
          className={`mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div>
             <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-gray-400"></div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                {t('home.insights.label')}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              {t('home.insights.heading_highlight')} That Drive{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                Change
              </span>
              .
            </h2>
          </div>
           <Link 
            to="/insights" 
            className="group flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white hover:text-brand-blue transition-colors"
          >
            {t('home.insights.view_all')}
            <span className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <FeaturedCard item={insightsData[0]} />
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
             <StandardCard item={insightsData[1]} index={0} />
             <StandardCard item={insightsData[2]} index={1} />
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




const CareersCTASection = () => {
  const { t } = useTranslation();
  // Team members data - 4 Women, 3 Men (Global Diverse)
  const teamMembers = [
    { id: 1, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", alt: "Senior Executive" }, // Woman
    { id: 2, img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80", alt: "Tech Lead" }, // Man
    { id: 3, img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", alt: "Product Designer" }, // Woman
    { id: 4, img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80", alt: "Engineering Manager" }, // Man
    { id: 5, img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80", alt: "Lead Developer" }, // Woman (Fixed Again)
    { id: 6, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", alt: "Solutions Architect" }, // Man
    { id: 7, img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80", alt: "HR Director" }, // Woman
  ];

  return (
    <section className="py-32 bg-brand-gradient text-white relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-cyan-400 rounded-full blur-[128px] opacity-20 mix-blend-screen"></div>
         <div className="absolute top-1/2 right-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-purple-500 rounded-full blur-[128px] opacity-20 mix-blend-screen"></div>
         <div className="absolute bottom-0 left-1/3 w-48 h-48 md:w-64 md:h-64 bg-blue-400 rounded-full blur-[96px] opacity-20 mix-blend-screen"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="text-left space-y-6 md:space-y-8">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              {t('home.careers.heading_prefix')} <br className="hidden sm:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-cyan-300 animate-shimmer bg-[length:200%_auto] font-extrabold drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{t('home.careers.heading_highlight')}</span> {t('home.careers.heading_suffix')}
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-blue-50 max-w-xl leading-relaxed">
              {t('home.careers.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              {/* ── Primary CTA: "Explore Careers" — Hero-style luminous pill ── */}
              <Link
                to="/careers"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: '0 0 20px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                {/* Hover glow sweep */}
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                  background: 'radial-gradient(ellipse 120% 80% at 50% 120%, rgba(255,255,255,0.15) 0%, transparent 70%)',
                }} />
                
                <span className="relative z-10 text-white font-semibold tracking-wide text-[15px]">
                  {t('home.careers.explore')}
                </span>
                
                {/* Arrow with animated slide */}
                <span className="relative z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800/10 border border-white/20 flex items-center justify-center group-hover:bg-white dark:bg-gray-900 dark:border-gray-800 group-hover:border-white transition-all duration-500">
                  <ArrowRight className="w-4 h-4 text-gray-900 dark:text-white group-hover:translate-x-0.5 transition-all duration-500" />
                </span>
                
                {/* Bottom shimmer line */}
                <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>

              {/* ── Secondary CTA: "Our Culture" — Hero-style AI-alive glass pill ── */}
              <Link 
                to="/culture"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, rgba(37,100,234,0.15) 0%, rgba(74,182,212,0.1) 100%)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(74,182,212,0.3)',
                  boxShadow: '0 0 24px rgba(37,100,234,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                {/* Animated gradient border overlay on hover */}
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                  background: 'radial-gradient(ellipse 120% 80% at 50% 120%, rgba(74,182,212,0.2) 0%, transparent 70%)',
                }} />

                <span className="relative z-10 text-white/90 font-semibold tracking-wide text-[15px] group-hover:text-white transition-colors duration-300">
                  {t('home.careers.how_we_work')}
                </span>

                {/* Animated icon container */}
                <span className="relative z-10 w-9 h-9 flex items-center justify-center">
                  <span className="relative w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/20 border border-white/15 flex items-center justify-center group-hover:from-blue-500/50 group-hover:to-cyan-400/40 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4 text-cyan-300 group-hover:text-white transition-colors duration-300" />
                  </span>
                </span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">30+</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('home.careers.stats.builders')}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">61</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('home.careers.stats.clients')}</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white">15</div>
                <div className="text-xs sm:text-sm text-blue-200">{t('home.careers.stats.culture')}</div>
              </div>
            </div>
            <p className="pt-4 sm:pt-6 text-xs sm:text-sm text-blue-200/80 italic">
              {t('home.careers.quote')}
            </p>
          </div>

          {/* Right Column: Team Grid */}
          <div className="relative mt-12 lg:mt-0">
            {/* Grid Layout - Changed to hide on very small screens, responsive on sm up */}
            <div className="hidden sm:grid grid-cols-3 gap-3 md:gap-4 transform lg:rotate-2 lg:hover:rotate-0 transition-transform duration-700 ease-out">
              {/* Column 1 - Downward offset */}
              <div className="flex flex-col gap-3 md:gap-4 mt-8 md:mt-12">
                <div className="relative h-32 md:h-48 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img src={teamMembers[0].img} alt={teamMembers[0].alt} className="w-full h-full object-cover" />
                </div>
                <div className="relative h-40 md:h-56 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img src={teamMembers[1].img} alt={teamMembers[1].alt} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Column 2 - Centered */}
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="relative h-24 md:h-40 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                   <img src={teamMembers[2].img} alt={teamMembers[2].alt} className="w-full h-full object-cover" />
                </div>
                <div className="relative h-48 md:h-64 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 ring-2 ring-white/30 z-10">
                   <img src={teamMembers[3].img} alt={teamMembers[3].alt} className="w-full h-full object-cover" />
                </div>
                <div className="relative h-24 md:h-40 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                   <img src={teamMembers[4].img} alt={teamMembers[4].alt} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Column 3 - Upward offset */}
              <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8">
                <div className="relative h-40 md:h-56 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img src={teamMembers[5].img} alt={teamMembers[5].alt} className="w-full h-full object-cover" />
                </div>
                <div className="relative h-32 md:h-48 rounded-xl md:rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <img src={teamMembers[6].img} alt={teamMembers[6].alt} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            
            {/* Mobile-only featured image (since grid is too complex for very small screens) */}
            <div className="sm:hidden relative h-64 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/30">
                <img src={teamMembers[3].img} alt={teamMembers[3].alt} className="w-full h-full object-cover" />
            </div>
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
import ContactForm from '../components/ContactForm';
import TransformCTA from '../components/TransformCTA';
import EqoreShowSection from '../components/podcast/EqoreShowSection';



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
      <TrustLogoStrip />
      <ValueProposition />
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
      <CaseStudiesSection />
      <LeadershipSection />
      <FeaturedInsightsSection />
      <EqoreShowSection />

      <section id="scheduling-widget" className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Schedule Your <span className="bg-brand-gradient bg-clip-text text-transparent">Consultation</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Choose a time that works for you and let's discuss how we can innovate your future together.
          </p>
          <AvailabilityPulse eventTypeSlug="discovery-cmkfi" />
        </div>
        <BookingWidget ref={bookingRef} eventTypeSlug="discovery-cmkfi" />
      </section>

      <EqoreTypingSection bookingRef={bookingRef} />

      <CareersCTASection />
      <ContactForm />
      <TransformCTA />
      <StickyMobileCTA />
    </>
  );
};

export default HomePage;
