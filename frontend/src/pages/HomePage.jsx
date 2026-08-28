import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import AvailabilityPulse from '../components/scheduling/AvailabilityPulse';

const ConciergeSection = lazy(() =>
  import('../components/concierge/ConciergeSection')
);

import HeroGlassCards from '../components/hero/HeroGlassCards';

import { Link } from 'react-router-dom';
import {
  ChevronDown, Check, ArrowRight
} from 'lucide-react';

import { useScrollAnimation } from '../hooks/useScrollAnimation';

import SEO from '../components/SEO';
import { BOOKING_CTA_LABEL, BOOKING_CTA_HREF } from '../data/cta';
import { coreSEO } from '../data/seoData';
import DepartmentCarousel from '../components/home/DepartmentCarousel';
import HomeRuler from '../components/home/HomeRuler';
import BookingWidget from '../components/scheduling/BookingWidget';
import TransformCTA from '../components/TransformCTA';
import EqoreShowSection from '../components/podcast/EqoreShowSection';
import LatestInsightsSection from '../components/home/LatestInsightsSection';
import CareersSection from '../components/home/CareersSection';

// ============================================================================
// HERO
// ============================================================================
// Dropped alongside the carousel: `id` and `type` (only ever read by the slide
// loop), `tag: "ENTERPRISE TRANSFORMATION"` (never rendered), and
// `secondaryCta` / `secondaryLink` — the booking CTA's wording and target now
// come from data/cta.js so they cannot drift from the page's other CTAs.
const HERO = {
  title: "Infrastructure So Intelligent, ",
  titleGradient: "Growth Becomes Inevitable.",
  description: "Kangqore partners with ambitious organizations to engineer intelligent digital infrastructure that modernizes operations, automates enterprise workflows, secures critical systems, and accelerates measurable growth.",
  cta: "Explore Our Capabilities",
  link: "/services",
  video: "/videos/hero-bg.mp4",
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

// This was previously a full carousel over a one-item `heroSlides` array:
// auto-advance on a 62s timer, touch-swipe handlers, a click counter giving
// 1-click-pause / 2-click-next / 3-click-prev, opacity-crossfade stacks, and
// branches for a chat slide (`type === 'chat'`) and a second slide (`id === 2`)
// that never existed. None of it was reachable with one slide, and
// HeroChatWidget — 351 lines, eagerly imported — could never mount.
const HeroSection = () => {
  const slide = HERO;

  return (
    <>
    <div className="w-full h-screen bg-white dark:bg-black p-2 relative transition-colors duration-500">

    <section className="relative w-full h-full overflow-hidden rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] border border-white/5 ring-1 ring-white/10 z-[1] bg-[#0a1228]">

      {/* ── HERO AREA (bg + content — trust strip lives OUTSIDE this wrapper) ── */}
      <div className="relative h-full overflow-hidden pb-[0.3cm]">

        {/* ── BACKGROUND ── */}
        <div className="absolute inset-0 z-[1]">
          <div className="absolute inset-0 bg-[#0a1228]">
            <video
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="relative z-[2] h-full">
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-[194px] lg:pt-[250px] pb-[167px] sm:pb-[175px] h-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="w-full md:max-w-[58%] lg:max-w-[60%] flex flex-col h-full justify-center z-10">

              <div className="flex-shrink-0">
                <h1 className="mb-5 text-[2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.5rem] font-bold leading-[1.1] sm:leading-[0.96] tracking-[-0.045em] text-white animate-in fade-in zoom-in-75 duration-1000 ease-out origin-left">
                  <span className="block xl:whitespace-nowrap">{slide.title}</span>
                  <span className="block bg-brand-gradient bg-clip-text text-transparent xl:whitespace-nowrap mt-1 sm:mt-2">{slide.titleGradient}</span>
                </h1>

                <p className="mb-12 text-base sm:text-lg lg:text-xl text-gray-300 leading-[1.8] max-w-3xl animate-fade-in font-medium line-clamp-3">
                  {slide.description}
                </p>
              </div>

              {/* ── CTAs ── */}
              <div className="flex flex-col sm:flex-row items-center gap-8 animate-fade-in mt-2">
                <Link viewTransition
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

                {/* Booking CTA — wording and target come from data/cta.js so this
                    cannot drift from the other booking CTAs on the page. It used
                    to read "Schedule Your 30-min Discovery Call" and navigate to
                    /contact, away from the BookingWidget mounted below. */}
                <a
                  href={BOOKING_CTA_HREF}
                  className="group inline-flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity duration-300"
                >
                  <span className="text-[13px] font-bold text-white/90 tracking-wide uppercase">
                    {BOOKING_CTA_LABEL}
                  </span>
                  <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>

            {/* Right Side: Hero Glass Cards (desktop only) */}
            <div className="hidden lg:block absolute right-[6%] xl:right-[10%] top-[30%] lg:top-[35%] z-10 pointer-events-auto">
              <HeroGlassCards />
            </div>
          </div>
        </div>

      </div>
    </section>

    </div>

    {/* ── Hero Trust Logo Strip (Free from container) ── */}
    <div className="relative z-20 w-full bg-transparent py-[calc(1.25rem+0.5cm)] sm:py-[calc(1.5rem+0.5cm)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-10">
        {/* `whitespace-nowrap` on a ~48-character eyebrow at tracking-[0.25em],
            inside an overflow-hidden parent, clipped this at both edges on any
            viewport under ~400px. Letting it wrap costs nothing. */}
        <p className="text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-white/50 uppercase tracking-[0.25em] text-center mx-auto leading-relaxed">
          TRUSTED BY GLOBAL ENTERPRISES TO DELIVER AT SCALE.
        </p>
      </div>
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-[heroTrustMarquee_35s_linear_infinite] items-center gap-12 sm:gap-16 lg:gap-20 hover:[animation-play-state:paused] py-2">
          {[...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos].map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="flex flex-col items-center justify-center group shrink-0 w-28 sm:w-32">
              <div className="h-10 sm:h-12 w-full flex items-center justify-center transition-opacity duration-300">
                {/* Was `brightness-0`, which flattens every mark to a solid black
                    silhouette — discarding the brand identity these logos are
                    here to lend. Grayscale reads as deliberate and stays legible. */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  decoding="async"
                  className="max-h-8 sm:max-h-10 w-auto object-contain grayscale opacity-75 dark:invert transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                />
              </div>
              {/* Was text-[9px] at text-gray-400 / dark:text-white/30 — measured
                  2.54:1 and 2.48:1, both failing WCAG 1.4.3 (needs 4.5:1) on the
                  highest-value trust copy on the page. Now 11px at gray-600 /
                  white-70, which clears it in both themes. */}
              <span className="mt-3 text-[11px] font-bold text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 uppercase tracking-widest text-center">
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

const EditorialCard = ({ card }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`group relative z-10 w-full ${card.aspect} rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-shadow duration-500`}
    >
      <Link viewTransition
        to={card.href}
        className="block w-full h-full rounded-[28px] overflow-hidden bg-gray-900 relative"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[28px]">
          <img
            src={card.image}
            alt={card.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        </div>

        {/* Spatial Glass Edge (Inner Ring) */}
        <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20 pointer-events-none" />

        <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8 pointer-events-none">
          <p className="mb-3 text-xs md:text-[13px] font-semibold uppercase tracking-[0.15em] text-white/80 font-sans drop-shadow-sm">
            {card.type}
          </p>
          <h3 className="font-sans text-sm md:text-[15px] lg:text-base font-semibold text-white leading-[1.3] tracking-tight drop-shadow-md">
            {card.title} <span className="inline-block ml-0.5 text-white/50 font-normal">›</span>
          </h3>
        </div>
      </Link>
    </motion.div>
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
    <motion.div 
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="bg-[#1c1c1e] p-8 flex flex-col justify-center h-full min-h-[360px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] border border-white/10 relative overflow-hidden w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col justify-center">
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
            <h3 className="font-serif text-xl md:text-2xl text-white mb-6 text-center leading-[1.2] drop-shadow-sm px-2">
              Subscribe to the latest Kangqore Insights on the topics you care about.
            </h3>
            
            <form onSubmit={handleSubscribe} className="relative mb-5 flex rounded-xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
              <input 
                type="email"
                id="insights-subscribe-email"
                name="insights-email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setMessage(''); } }}
                placeholder="Email address"
                disabled={status === 'loading'}
                className="w-full bg-transparent px-5 py-3 text-white placeholder-white/50 focus:outline-none font-sans text-[15px] disabled:opacity-60"
              />
              <motion.button 
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={status === 'loading'}
                className="bg-[#007aff] px-6 flex items-center justify-center hover:bg-blue-500 transition-colors disabled:opacity-60 min-w-[60px]"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </form>

            {/* Feedback message */}
            {status === 'error' && message && (
              <p className="text-red-400 text-xs font-sans text-center mb-4">{message}</p>
            )}

            <div className="relative flex items-center justify-center mb-6 mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-[#1c1c1e] font-sans">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['Apple', 'Google', 'LinkedIn'].map((provider) => (
                <motion.button 
                  key={provider}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="flex items-center justify-center gap-2 border border-white/10 py-3 px-2 text-[10px] font-bold text-white uppercase tracking-widest bg-transparent rounded-xl transition-colors font-sans shadow-sm"
                >
                  {provider}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
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
              <Link viewTransition to="/insights" className="w-14 h-14 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center group hover:scale-110 hover:shadow-[0_0_20px_rgba(37,100,234,0.3)] transition-all duration-500 shrink-0 mt-4 md:mt-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ArrowRight className="w-6 h-6 text-white dark:text-gray-900 group-hover:text-white relative z-10 transition-all duration-500 -rotate-45 group-hover:rotate-0 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* 2. Featured Card (Right Side - Spans entire height) */}
          <div className="lg:row-span-2 lg:col-start-3 h-full flex flex-col justify-end">
            <EditorialCard card={trustCards[0]} />
          </div>

          {/* 3. Small Card Left (Bottom Left) */}
          <div className="lg:col-start-1 lg:row-start-2 h-full flex flex-col justify-end">
            <EditorialCard card={trustCards[2]} />
          </div>

          {/* 4. Small Card Middle (Bottom Middle) */}
          <div className="lg:col-start-2 lg:row-start-2 h-full flex flex-col justify-end">
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
    <section className="w-full bg-white dark:bg-black py-24 sm:py-28 border-t border-gray-100 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Left-aligned heading block — exact match to "Explore our services" */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl">
              Strategic <span className="bg-brand-gradient bg-clip-text text-transparent">Partnerships</span>
            </h2>
          </div>

          <Link viewTransition to="/partners" className="hidden md:flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all mb-2">
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
        <Link viewTransition to="/partners" className="inline-flex items-center gap-2 text-brand-blue font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all">
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
      {/* Was "Get a Free Consultation" → /contact, which navigated past the
          BookingWidget already on this page. Same wording and target as every
          other booking CTA now. */}
      <a
        href={BOOKING_CTA_HREF}
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
      >
        {BOOKING_CTA_LABEL}
        <ArrowRight className="w-4 h-4" />
      </a>
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
  return (
    <section className="py-32 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div 
          ref={titleRef}
          className={`mb-12 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('home.industries_section.heading_prefix')} <span className="bg-brand-gradient bg-clip-text text-transparent">{t('home.industries_section.heading_highlight')}</span>{t('home.industries_section.heading_suffix') ? ' ' + t('home.industries_section.heading_suffix') : ''}.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-md lg:text-right">
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
            <Link viewTransition 
              key={idx}
              to={item.to}
              className="group flex items-center justify-between py-5 transition-all duration-300"
            >
              <span className="text-sm font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-900 transition-colors">
                {t(`industries.${item.id}`)}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-1 group-hover:rotate-[-45deg] transition-all duration-500" />
            </Link>
          ))}
          
          {/* Last Action: Explore All */}
          <Link viewTransition 
            to="/industries"
            className="group flex items-center justify-between py-5 transition-all duration-300"
          >
            <span className="text-sm font-extrabold uppercase tracking-widest bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:text-gray-900 transition-colors">
              Explore the other INDUSTRIES
            </span>
            <ArrowRight className="w-4 h-4 bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent group-hover:translate-x-1 group-hover:rotate-[-45deg] transition-all duration-500" />
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
              <Link viewTransition 
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
// MAIN HOMEPAGE COMPONENT
// ============================================================================

const SectionWrapper = ({ children, id, className = "" }) => (
  <motion.div
    id={id}
    className={className}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
  >
    {children}
  </motion.div>
);

const HomePage = () => {

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
      <HeroSection />
      {/* Dynamic AI Banner if website shifted */}
      {lockedIntent && (
        <div className="w-full bg-brand-blue/10 border-b border-brand-cyan/20 py-3 text-center animate-fade-in z-50 relative">
          <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-brand-cyan animate-pulse mr-2" />
            System Realigned: {lockedIntent === 'enterpriseBuyer' ? 'Enterprise Architecture Mode' : 'Developer Docs Mode'} Active
          </span>
        </div>
      )}

      {/* Dynamic Layout Shift */}
      {lockedIntent === 'enterpriseBuyer' ? (
        <>
          <SectionWrapper id="home-services"><DepartmentCarousel /></SectionWrapper>

          <SectionWrapper id="home-industries"><IndustriesWeServe /></SectionWrapper>
          <SectionWrapper><TrustIntelligenceLayer /></SectionWrapper>
        </>
      ) : (
        <SectionWrapper><TrustIntelligenceLayer /></SectionWrapper>
      )}

      <SectionWrapper id="home-concierge">
        <Suspense fallback={<div className="w-full h-[200px]" aria-hidden="true" />}>
          <ConciergeSection />
        </Suspense>
      </SectionWrapper>

      {/* ── Intelligent Solutions 3-card section ── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-16 max-w-3xl">
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
              <Link viewTransition
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
          <SectionWrapper id="home-services"><DepartmentCarousel /></SectionWrapper>

          <SectionWrapper id="home-industries"><IndustriesWeServe /></SectionWrapper>
        </>
      )}
      <TrustStatementSection />
      <PartnerBadgesStrip />
      <SectionWrapper><LatestInsightsSection /></SectionWrapper>
      <SectionWrapper><LeadershipSection /></SectionWrapper>
      <SectionWrapper><EqoreShowSection /></SectionWrapper>


      {/* scroll-mt keeps the heading clear of the fixed header when the page's
          booking CTAs anchor here (see data/cta.js). */}
      <section id="scheduling-widget" className="scroll-mt-28 py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Book a 30-minute <span className="bg-brand-gradient bg-clip-text text-transparent">discovery call</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Choose a time that works for you and let's discuss how we can innovate your future together.
          </p>
          <AvailabilityPulse eventTypeSlug="discovery-call" />
        </div>
        <BookingWidget eventTypeSlug="discovery-call" showVoiceAssistant />
      </section>

      <SectionWrapper>
        <CareersSection />
      </SectionWrapper>

      <TransformCTA />
      <StickyMobileCTA />
    </>
  );
};

export default HomePage;
