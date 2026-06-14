// Universal PSED-style service page for all 61 capability pages.
// Takes { service, department } props derived from servicesData / departmentsData.
// Visual design mirrors /services/product-strategy-experience-design exactly —
// black bg, cyan accents, full-screen hero, GSAP journey timeline, capabilities
// accordion, differentiators, trust pillars, FAQ, related services, CTA.
// Content is data-driven: name, shortDescription, fullDescription, keyFeatures,
// relatedServiceSlugs are the only sources — nothing is hardcoded per-service.

import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, Zap, Target, Layers, Search,
  Cpu, Radar, ArrowRight, ChevronRight,
  TrendingUp, Users, BrainCircuit,
  ChevronDown, Activity, Shield,
  Globe, BarChart3, Network, Settings,
  Plus, X, Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import SvcRuler from './SvcRuler';
import ConciergeSection from '../../concierge/ConciergeSection';
import { servicesData } from '../../../data/servicesData';

gsap.registerPlugin(ScrollTrigger);

// ─── Typewriter badge ─────────────────────────────────────────────────────────
const TypewriterText = ({ text, start = true, delay = 28 }) => {
  const [current, setCurrent] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (start && idx < text.length) {
      const t = setTimeout(() => { setCurrent(p => p + text[idx]); setIdx(p => p + 1); }, delay);
      return () => clearTimeout(t);
    }
  }, [idx, delay, start, text]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{text}</span>
      <span className="absolute left-0 top-0 whitespace-nowrap">{current}</span>
    </span>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────
const CAP_COLORS = ['#22D3EE', '#60A5FA', '#A78BFA', '#FB923C', '#34D399', '#F472B6', '#FDE047', '#E8614A'];
const ICON_POOL  = [Target, Zap, Layers, Search, Cpu, Radar, BrainCircuit, TrendingUp, Shield, Activity, Globe, BarChart3, Network, Settings, Rocket, Users];
const PHASE_GRADIENTS = ['from-slate-600 to-slate-800', 'from-blue-500 to-blue-700', 'from-brand-blue to-indigo-600', 'from-emerald-500 to-emerald-700', 'from-cyan-500 to-cyan-700'];
const JOURNEY_ICON_MAP = { Search, Target, Cpu, Rocket, Shield, TrendingUp, BrainCircuit, Network, Radar, Zap, Layers, Activity, Globe, Settings };
const TECH_STACK_ICON_COLORS = [
  { bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', glow: '0 8px 24px rgba(59,130,246,0.45), 0 2px 8px rgba(59,130,246,0.3)' },
  { bg: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)', glow: '0 8px 24px rgba(139,92,246,0.45), 0 2px 8px rgba(139,92,246,0.3)' },
  { bg: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)', glow: '0 8px 24px rgba(251,191,36,0.4),  0 2px 8px rgba(251,191,36,0.25)' },
  { bg: 'linear-gradient(135deg, #065f46 0%, #34d399 100%)', glow: '0 8px 24px rgba(52,211,153,0.4),  0 2px 8px rgba(52,211,153,0.25)' },
];

// Deterministic icon from slug (no Math.random → stable across renders)
const slugIcon = (slug) => ICON_POOL[Math.abs([...slug].reduce((a, c) => a + c.charCodeAt(0), 0)) % ICON_POOL.length];

// ─── Fixed delivery content (same across all 60 service pages) ───────────────

const HOW_WE_WORK = [
  { n: '01', color: CAP_COLORS[0], title: 'Concierge Engagement',         desc: 'Every client gets a dedicated specialist team matched to their context — not a generic delivery squad rotating across accounts.' },
  { n: '02', color: CAP_COLORS[1], title: 'Co-Ownership from Day One',    desc: 'We share accountability for your objectives and remain aligned to the same outcomes. We don\'t take briefs and disappear.' },
  { n: '03', color: CAP_COLORS[2], title: 'Transparent Communication',    desc: 'Weekly standups, sprint reviews, and clear escalation paths. No surprises, no opacity — consistent alignment at every level.' },
  { n: '04', color: CAP_COLORS[3], title: 'Domain-First Thinking',        desc: 'Every recommendation starts from your industry and business context. Sector knowledge is built into the engagement — not bolted on after.' },
  { n: '05', color: CAP_COLORS[4], title: 'Knowledge Transfer by Design', desc: 'We build your team\'s capability alongside the deliverable. When the engagement ends, your team owns the outcome fully.' },
  { n: '06', color: CAP_COLORS[5], title: 'Adaptive Scope Management',    desc: 'We adjust scope, pace, and approach as your business context evolves. Rigidity is a delivery risk — adaptability is built in.' },
];


// ─── Component ────────────────────────────────────────────────────────────────
export default function UniversalServicePage({ service, department }) {

  // ── Hero H1 split: optional \n forces a hard line-1; last word of line-2 gets gradient ──
  const heroTitleSource = service.heroTitle || service.name;
  const [heroLine1, heroLineBody] = heroTitleSource.includes('\n')
    ? heroTitleSource.split('\n')
    : [null, heroTitleSource];
  const words = heroLineBody.split(' ');
  const titleHighlight = words.length > 1 ? words[words.length - 1] : heroLineBody;
  const titleLine      = words.length > 1 ? words.slice(0, -1).join(' ') : '';

  // ── Section heading split: always derived from service.name, not heroTitle ──
  const nameWords          = service.name.split(' ');
  const sectionHighlight   = nameWords.length > 1 ? nameWords[nameWords.length - 1] : service.name;
  const sectionLine        = nameWords.length > 1 ? nameWords.slice(0, -1).join(' ') : '';

  // ── Capabilities from keyFeatures ────────────────────────────────────────
  const capabilities = (service.capabilityAreas || service.keyFeatures.map((f) => ({
    title: f,
    desc:  `Kangqore delivers ${f.toLowerCase()} through proven frameworks, enterprise-grade implementation, and continuous optimization — creating measurable business outcomes at scale.`,
    items: [
      `Enterprise-scale ${f.toLowerCase()} implementation`,
      `Proven methodologies and industry best practices`,
      `Continuous monitoring and outcome measurement`,
      `Custom solutions aligned with your business goals`,
    ],
  }))).map((c, i) => ({ n: String(i + 1).padStart(2, '0'), color: CAP_COLORS[i % CAP_COLORS.length], ...c }));

  // ── 4-phase engagement model ──────────────────────────────────────────────
  const journeyPhases = [
    { n: '01', phase: 'DISCOVER', color: '#94A3B8', title: 'Understand & Assess',   desc: `Assess the current state, define success criteria, and understand stakeholder priorities for your ${service.name} initiative.`, Icon: Search },
    { n: '02', phase: 'FRAME',    color: '#60A5FA', title: 'Design the Approach',   desc: `Architect the solution framework, define the delivery roadmap, and align execution with measurable business outcomes.`, kangqore: true, Icon: Target },
    { n: '03', phase: 'BUILD',    color: '#2564EA', title: 'Implement & Develop',   desc: `Execute the solution with precision — integrating ${(service.keyFeatures[0] || '').toLowerCase()}, ${(service.keyFeatures[1] || '').toLowerCase()}${service.keyFeatures[4] ? ', and ' + service.keyFeatures[4].toLowerCase() : ''}.`, kangqore: true, Icon: Cpu },
    { n: '04', phase: 'ACTIVATE', color: '#10B981', title: 'Launch & Scale',        desc: `Deploy, optimize, and evolve — ensuring lasting ${service.name} impact and continuous improvement over time.`, kangqore: true, Icon: Rocket },
  ];

  // ── Active journey: service override or default 4-phase model ───────────
  const activeJourney = (service.customJourney || journeyPhases).map((p, i) => ({
    ...p,
    n: String(i + 1).padStart(2, '0'),
    Icon: p.Icon || JOURNEY_ICON_MAP[p.icon] || Search,
  }));

  // ── Hero scrolling strip ──────────────────────────────────────────────────
  const HERO_CAPS  = (service.heroStripItems || service.keyFeatures).map((f, i) => ({ label: f, color: CAP_COLORS[i % CAP_COLORS.length], icon: ICON_POOL[i % ICON_POOL.length] }));
  const HERO_STRIP = [...HERO_CAPS, ...HERO_CAPS, ...HERO_CAPS];


  // ── Why Kangqore pillars (3 standard) ────────────────────────────────────
  // ── FAQ: service.customFAQs overrides generated defaults ─────────────────
  const faqs = service.customFAQs || [
    { q: `What is ${service.name}?`,                           a: service.fullDescription },
    { q: `How does Kangqore approach ${service.name}?`,        a: `Kangqore approaches ${service.name} through a four-phase model: Discover, Frame, Build, and Activate. We begin by understanding your current state and goals, design a tailored solution, implement it with precision, and continuously optimize for lasting results.` },
    { q: `What does a ${service.name} engagement include?`,    a: `A ${service.name} engagement typically covers: ${service.keyFeatures.join(', ')}. Each engagement is tailored to your specific business context and strategic objectives.` },
    { q: `Who is ${service.name} designed for?`,               a: `${service.name} is designed for organizations looking to drive meaningful outcomes through ${service.shortDescription.toLowerCase()}. It is relevant for both greenfield initiatives and optimization of existing capabilities.` },
    { q: `What outcomes can I expect?`,                        a: `Organizations that partner with Kangqore on ${service.name} typically achieve improved operational efficiency, accelerated delivery timelines, reduced risk, and measurable business impact aligned with their strategic objectives.` },
    { q: `How do I get started?`,                              a: `The first step is a 30-minute discovery call with a Kangqore specialist. We will assess your current state, understand your goals, and outline a clear path forward — with no commitment required.` },
  ];

  // ── Related services (lookup from servicesData) ───────────────────────────
  const relatedServices = (service.relatedServiceSlugs || []).slice(0, 3)
    .map(slug => { const r = servicesData[slug]; return r ? { name: r.name, link: `/services/${slug}`, Icon: slugIcon(slug), desc: r.shortDescription } : null; })
    .filter(Boolean);

  // ── Feature accordion (first 4 keyFeatures) ──────────────────────────────
  const featureLabels   = service.keyFeatures.slice(0, 4);
  const featureTitles   = featureLabels.map(f => f.split(' ')[0]);
const featureMicros   = service.featureMicros
    ? service.featureMicros.slice(0, 4)
    : featureLabels.map(f => `Building ${f.toLowerCase()} maturity that scales with your business.`);
  const featureIcons    = featureLabels.map((_, i) => ICON_POOL[i % ICON_POOL.length]);

  // ── State ─────────────────────────────────────────────────────────────────
  const [openFaq,          setOpenFaq]          = useState(null);
  const [activeCapability, setActiveCapability] = useState(0);
  const [expandedCaps,     setExpandedCaps]     = useState({});

  // ── Scroll animations ─────────────────────────────────────────────────────
  const [defRef,   defVisible]   = useScrollAnimation({ once: true, threshold: 0.1 });

  const [capRef,   capVisible]   = useScrollAnimation({ once: true, threshold: 0.05 });
  const [faqRef,   faqVisible]   = useScrollAnimation({ once: true, threshold: 0.1 });
  const [ctaRef,   ctaVisible]   = useScrollAnimation({ once: true, threshold: 0.2 });

  // ── GSAP refs ─────────────────────────────────────────────────────────────
  const sectionRef        = useRef(null);
  const differentiatorRef = useRef(null);
  const journeyRef        = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (differentiatorRef.current) {
        const items = differentiatorRef.current.querySelectorAll('.diff-item');
        gsap.fromTo(items,
          { opacity: 0, y: 30, x: -20 },
          { opacity: 1, y: 0, x: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
            scrollTrigger: { trigger: differentiatorRef.current, start: 'top 80%', once: true } }
        );
      }
      if (journeyRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: journeyRef.current, start: 'top 75%', end: 'bottom 60%', scrub: 0.8 },
        });
        const pathEl = journeyRef.current.querySelector('.svc-journey-path');
        if (pathEl) {
          const len = pathEl.getTotalLength();
          gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(pathEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
        }
        const glowEl = journeyRef.current.querySelector('.svc-journey-glow');
        if (glowEl) {
          const gl = glowEl.getTotalLength();
          gsap.set(glowEl, { strokeDasharray: gl, strokeDashoffset: gl });
          tl.to(glowEl, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);
        }
        journeyRef.current.querySelectorAll('.svc-journey-node').forEach((node, i) => {
          tl.fromTo(node, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(2)' }, i * 0.2);
        });
        gsap.fromTo(
          journeyRef.current.querySelectorAll('.svc-journey-card'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
            scrollTrigger: { trigger: journeyRef.current, start: 'top 60%', once: true } }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const safeCapIdx = activeCapability >= 0 ? activeCapability : 0;
  const badgeRaw   = service.heroBadge || service.shortDescription;
  const badgeText  = badgeRaw.length > 80 ? badgeRaw.slice(0, 77) + '…' : badgeRaw;

  return (
    <div ref={sectionRef} className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>

      <SvcRuler />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <div id="svc-hero" className="p-2 h-screen" style={{ backgroundColor: 'var(--page-bg, #000)' }}>
        <div className="relative w-full h-full overflow-hidden rounded-xl text-white">

          <img src={service.image} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16">
              <div className={`${service.heroMaxWidth || 'max-w-[62%]'} mt-[1cm]`}>

                {/* Typewriter badge */}
                <div className="inline-flex items-center gap-3 mb-10 mt-[1cm]">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
                  <p className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
                    <TypewriterText text={badgeText} start />
                  </p>
                </div>

                {/* H1 */}
                <h1 className={`${service.heroTitleSize || 'text-[2.6rem] sm:text-[3.4rem] lg:text-[4.4rem] xl:text-[5.2rem]'} font-extrabold leading-[1.05] tracking-[-0.04em] text-white mb-5 drop-shadow-2xl`}>
                  {heroLine1 && <>{heroLine1}<br /></>}
                  {titleLine && <>{titleLine}{' '}</>}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">{titleHighlight}.</span>
                </h1>

                {/* Sub */}
                <p className={`text-base sm:text-lg text-white/50 leading-[1.8] ${service.fullDescriptionMaxWidth || 'max-w-[520px]'} mb-12 font-medium`}>
                  {service.fullDescription}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                    {service.primaryCtaText || 'Talk To Our Experts'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <a href="#svc-capabilities" className="group inline-flex items-center gap-2 px-6 py-4 text-white/55 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200">
                    Explore Capabilities
                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>

                {/* Company fact strip */}
                <p className="text-[10px] font-semibold tracking-[0.2em] text-white/25 uppercase mt-[calc(2rem+0.5cm)]">
                  AI-first engineering company&nbsp;&nbsp;·&nbsp;&nbsp;6 Departments&nbsp;&nbsp;·&nbsp;&nbsp;60+ Services&nbsp;&nbsp;·&nbsp;&nbsp;Global Delivery
                </p>

              </div>
            </div>
          </div>

          {/* Scrolling capability strip */}
          <div
            className="absolute bottom-6 left-0 right-0 z-20 overflow-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
          >
            <div className="flex items-center gap-4 w-max" style={{ animation: 'svc-strip-scroll 40s linear infinite' }}>
              {HERO_STRIP.map((cap, i) => {
                const Icon = cap.icon;
                return (
                  <div key={i} className="flex items-center gap-4 bg-[#0a0a0c] border border-white/10 rounded-2xl p-1.5 pr-6 shadow-2xl flex-shrink-0 cursor-default hover:-translate-y-1 transition-transform duration-300">
                    <div
                      className="w-14 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${cap.color}55 0%, ${cap.color}cc 100%)`,
                        boxShadow: `0 4px 14px ${cap.color}55`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white drop-shadow" />
                    </div>
                    <span className="text-[14px] font-semibold text-white/90 tracking-tight whitespace-nowrap">{cap.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════ DEFINITION / OVERVIEW ══════════════════════ */}
      <section id="svc-what" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div ref={defRef} className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <div className="mb-14">
            {'whatIsEyebrow' in service
              ? service.whatIsEyebrow && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.whatIsEyebrow}</span>
                </div>
              )
              : (
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">WHAT IS {service.name.toUpperCase()}</span>
                </div>
              )
            }
            <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-0 max-w-4xl">
              {service.whatIsTitle
                ? <>{service.whatIsTitle}{service.whatIsTitleLine2 ? <><br />{service.whatIsTitleLine2}{' '}</> : ' '}<span className="bg-brand-gradient bg-clip-text text-transparent">{service.whatIsHighlight}</span></>
                : <>The complete {(sectionLine || service.name).toLowerCase()}{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">{sectionHighlight.toLowerCase()} framework.</span></>
              }
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-20">
            <div>
              <p className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-10 font-light max-w-xl">{service.shortDescription}</p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mb-0">
                {service.whatIsPara2 || <>A service can be technically delivered and still fail if the strategy and execution are misaligned.{' '}<span className="text-white">Kangqore closes that gap.</span></>}
              </p>
            </div>

            {service.capabilityAreas ? (
              /* ── Agentic AI Flow Diagram ── */
              <div className="flex items-center justify-center w-full">
                <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-h-[420px]">
                  <defs>
                    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2564ea"/>
                      <stop offset="100%" stopColor="#4ab6d4"/>
                    </linearGradient>
                    <marker id="diag-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0.5 L5,3 L0,5.5" stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.8"/>
                    </marker>
                    <clipPath id="capsule-clip">
                      <rect x="40" y="274" width="460" height="90" rx="30"/>
                    </clipPath>
                  </defs>

                  {/* ── LEFT: Automation / Workflow stack ── */}
                  <rect x="68" y="14" width="52" height="22" rx="11" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <line x1="94" y1="36" x2="78" y2="50" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
                  {/* Gear 1 */}
                  <circle cx="76" cy="64" r="16" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <circle cx="76" cy="64" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                  <rect x="73" y="45" width="6" height="5" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="73" y="78" width="6" height="5" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="57" y="61" width="5" height="6" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="90" y="61" width="5" height="6" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  {/* Gear 2 */}
                  <circle cx="104" cy="80" r="12" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <circle cx="104" cy="80" r="6" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                  <rect x="101" y="65" width="6" height="4" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="101" y="91" width="6" height="4" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="89" y="77" width="4" height="6" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="113" y="77" width="4" height="6" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  {/* Box stack + capsule */}
                  <line x1="76" y1="80" x2="38" y2="98" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
                  <rect x="10" y="98" width="52" height="20" rx="4" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <line x1="36" y1="118" x2="36" y2="132" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
                  <rect x="6" y="132" width="60" height="20" rx="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <line x1="36" y1="152" x2="36" y2="166" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
                  <rect x="10" y="166" width="52" height="20" rx="4" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <line x1="52" y1="186" x2="60" y2="198" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
                  {/* Bottom gear */}
                  <circle cx="64" cy="214" r="16" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <circle cx="64" cy="214" r="8" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                  <rect x="61" y="196" width="6" height="5" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="61" y="227" width="6" height="5" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="46" y="211" width="5" height="6" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  <rect x="79" y="211" width="5" height="6" rx="1" stroke="white" strokeWidth="1.2" strokeOpacity="0.8" fill="none"/>
                  {/* Dashed connector to agent circle */}
                  <path d="M 80 214 C 115 220 138 200 142 170" stroke="white" strokeWidth="1.2" strokeOpacity="0.35" strokeDasharray="3 3"/>

                  {/* ── MIDDLE: AI Agent circle ── */}
                  <circle cx="204" cy="122" r="68" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <circle cx="204" cy="96" r="15" stroke="white" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <rect x="190" y="92" width="28" height="8" rx="4" fill="url(#brand-grad)" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
                  <path d="M 186 122 C 192 136 216 136 222 122" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" fill="none"/>

                  {/* ── MIDDLE: Human Reviewer circle ── */}
                  <circle cx="338" cy="144" r="58" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <circle cx="328" cy="120" r="13" stroke="white" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <rect x="308" y="138" width="48" height="26" rx="3" stroke="white" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <line x1="306" y1="164" x2="368" y2="164" stroke="white" strokeWidth="1.8" strokeOpacity="0.8"/>
                  <line x1="322" y1="132" x2="312" y2="148" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>
                  <line x1="334" y1="132" x2="356" y2="148" stroke="white" strokeWidth="1.2" strokeOpacity="0.4"/>

                  {/* Bidirectional arcs */}
                  <path d="M 262 80 C 286 46 322 48 344 78" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" markerEnd="url(#diag-arrow)"/>
                  <path d="M 328 200 C 306 230 278 224 260 196" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" markerEnd="url(#diag-arrow)"/>

                  {/* ── RIGHT: Binary output speech bubble ── */}
                  <line x1="396" y1="118" x2="418" y2="108" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                  <rect x="418" y="52" width="110" height="80" rx="10" fill="#111111" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <path d="M 418 96 L 402 108 L 422 106 Z" fill="#111111" stroke="white" strokeWidth="1.2" strokeOpacity="0.8"/>
                  <text x="473" y="82" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="12" fontFamily="monospace" letterSpacing="1">01011</text>
                  <text x="473" y="99" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="12" fontFamily="monospace" letterSpacing="1">10110</text>
                  <text x="473" y="116" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="12" fontFamily="monospace" letterSpacing="1">01101</text>

                  {/* ── BOTTOM: Data & Tool Capsule ── */}
                  <rect x="40" y="274" width="460" height="90" rx="30" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  {/* Phone section dark fill */}
                  <rect x="155" y="274" width="115" height="90" fill="#1a1a1a" clipPath="url(#capsule-clip)"/>
                  {/* Section dividers */}
                  <line x1="155" y1="274" x2="155" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                  <line x1="270" y1="274" x2="270" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                  <line x1="385" y1="274" x2="385" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>

                  {/* Section 1: Document folders */}
                  <rect x="62" y="308" width="34" height="28" rx="3" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
                  <rect x="70" y="300" width="34" height="28" rx="3" fill="#0a0a0a" stroke="white" strokeWidth="1.5" strokeOpacity="0.7"/>
                  <rect x="78" y="292" width="34" height="28" rx="3" fill="#0a0a0a" stroke="white" strokeWidth="1.5" strokeOpacity="0.9"/>
                  <line x1="83" y1="300" x2="106" y2="300" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                  <line x1="83" y1="306" x2="106" y2="306" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                  <line x1="83" y1="312" x2="106" y2="312" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>

                  {/* Section 2: Phone with binary */}
                  <rect x="195" y="288" width="40" height="64" rx="6" fill="#222" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <rect x="207" y="346" width="16" height="4" rx="2" stroke="white" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
                  <text x="215" y="310" textAnchor="middle" fill="white" fillOpacity="0.7" fontSize="7" fontFamily="monospace">0101</text>
                  <text x="215" y="321" textAnchor="middle" fill="white" fillOpacity="0.7" fontSize="7" fontFamily="monospace">1010</text>
                  <text x="215" y="332" textAnchor="middle" fill="white" fillOpacity="0.7" fontSize="7" fontFamily="monospace">0110</text>

                  {/* Section 3: Robot (purple) */}
                  <line x1="318" y1="300" x2="318" y2="289" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                  <circle cx="318" cy="285" r="4" fill="url(#brand-grad)" stroke="white" strokeWidth="1" strokeOpacity="0.8"/>
                  <rect x="294" y="300" width="48" height="38" rx="8" fill="url(#brand-grad)" stroke="white" strokeWidth="1" strokeOpacity="0.4"/>
                  <circle cx="308" cy="316" r="6" fill="white"/>
                  <circle cx="330" cy="316" r="6" fill="white"/>
                  <circle cx="308" cy="316" r="3" fill="url(#brand-grad)"/>
                  <circle cx="330" cy="316" r="3" fill="url(#brand-grad)"/>
                  <path d="M 305 331 Q 318 340 331 331" stroke="white" strokeWidth="1.5" strokeOpacity="0.9" fill="none"/>
                  <rect x="338" y="287" width="36" height="22" rx="6" fill="#0a0a0a" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
                  <path d="M 338 304 L 332 310 L 340 310 Z" fill="#0a0a0a" stroke="white" strokeWidth="1" strokeOpacity="0.6"/>
                  <circle cx="347" cy="298" r="2.5" fill="white" fillOpacity="0.6"/>
                  <circle cx="356" cy="298" r="2.5" fill="white" fillOpacity="0.6"/>
                  <circle cx="365" cy="298" r="2.5" fill="white" fillOpacity="0.6"/>

                  {/* Section 4: Analytics — upward arrows */}
                  <line x1="402" y1="360" x2="468" y2="360" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
                  <line x1="412" y1="360" x2="412" y2="342" stroke="white" strokeWidth="2" strokeOpacity="0.8"/>
                  <path d="M 407 348 L 412 342 L 417 348" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
                  <line x1="430" y1="360" x2="430" y2="328" stroke="white" strokeWidth="2" strokeOpacity="0.8"/>
                  <path d="M 425 334 L 430 328 L 435 334" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
                  <line x1="448" y1="360" x2="448" y2="312" stroke="white" strokeWidth="2" strokeOpacity="0.8"/>
                  <path d="M 443 318 L 448 312 L 453 318" stroke="white" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>

                  {/* Dashed connectors from circles to capsule */}
                  <path d="M 180 186 C 172 230 162 255 148 274" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3"/>
                  <path d="M 338 202 C 330 235 316 256 302 274" stroke="white" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 3"/>
                </svg>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="group p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl relative overflow-hidden hover:border-transparent transition-all duration-500">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                  <div className="relative z-10">
                    <p className="text-[9px] font-black tracking-[0.4em] text-amber-400/70 group-hover:text-white/70 uppercase mb-4 transition-colors duration-500">THE CHALLENGE</p>
                    <p className="text-white font-semibold text-lg leading-snug">
                      Organizations face growing complexity in delivering {service.name} at enterprise scale without losing clarity or velocity.
                    </p>
                  </div>
                </div>
                <div className="group p-8 border border-white/[0.08] bg-[#06090f] rounded-2xl relative overflow-hidden hover:border-transparent transition-all duration-500">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                  <div className="relative z-10">
                    <p className="text-[9px] font-black tracking-[0.4em] text-cyan-400/70 group-hover:text-white/70 uppercase mb-4 transition-colors duration-500">THE SOLUTION</p>
                    <p className="text-white font-semibold text-lg leading-snug">
                      Kangqore helps businesses align intent, execution, and outcomes — so teams make better decisions earlier and deliver with greater confidence.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats row — full width */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-12 border-t border-white/[0.08] mb-16">
            {service.businessMetrics ? service.businessMetrics.map((m, i) => (
              <div key={i}>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-1">
                  {m.value}<span className="text-cyan-400">{m.suffix}</span>
                </p>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">{m.metricLabel}</p>
                <p className="text-white/40 text-sm leading-snug">{m.desc}</p>
              </div>
            )) : [
              [String(capabilities.length), 'Capability\nAreas'],
              ['4', 'Engagement\nPhases'],
              [String((service.relatedServiceSlugs || []).length), 'Related\nServices'],
              ['1', `${department.name}\nPractice`],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-black text-white tracking-tight mb-1">{v}</p>
                <p className="text-white/40 text-[10px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">{l}</p>
              </div>
            ))}
          </div>

          {/* Service identity bar */}
          <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 px-8 bg-[#06090f] border border-white/[0.08] rounded-2xl mb-10 relative overflow-hidden hover:border-transparent transition-all duration-500">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <span className="text-white font-black text-lg tracking-tight">{service.name}</span>
              <span className="hidden sm:block w-px h-5 bg-white/10" />
              <div className="flex flex-col gap-0.5">
                <span className="text-white/40 group-hover:text-white text-sm font-medium transition-colors duration-500">Kangqore {department.name} ™</span>
                {service.bannerBrandDesc && (
                  <span className="text-white/40 group-hover:text-white/65 text-[11px] font-medium tracking-wide transition-colors duration-500">{service.bannerBrandDesc}</span>
                )}
              </div>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {service.downloadAsset ? (
                <a href={service.downloadAsset} download className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  Download the Playbook
                </a>
              ) : (
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200">
                  Book a Discovery Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <a href="#svc-capabilities" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/40 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-colors duration-200">
                See Our Capabilities
              </a>
            </div>
          </div>

          {/* Challenge / Solution — plain, side-by-side, only when diagram is shown */}
          {service.capabilityAreas && (
            <div className="grid sm:grid-cols-2 gap-10 pt-10 border-t border-white/[0.06] mb-16">
              <div>
                <p className="text-[9px] font-black tracking-[0.4em] text-amber-400/70 uppercase mb-4">THE CHALLENGE</p>
                <p className="text-white/55 text-base font-medium leading-relaxed">
                  Organizations face growing complexity in delivering {service.name} at enterprise scale without losing clarity or velocity.
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[0.4em] text-cyan-400/70 uppercase mb-4">THE SOLUTION</p>
                <p className="text-white/55 text-base font-medium leading-relaxed">
                  Kangqore helps businesses align intent, execution, and outcomes — so teams make better decisions earlier and deliver with greater confidence.
                </p>
              </div>
            </div>
          )}

          {/* Pull-quote — hidden when businessMetrics are provided */}
          {!service.businessMetrics && (
            <div className="group border-l-2 border-white/10 pl-8 py-6 pr-8 rounded-r-2xl bg-[#06090f] relative overflow-hidden hover:border-transparent transition-all duration-500">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
              <div className="relative z-10">
                <p className="text-xl sm:text-2xl font-black text-white/40 group-hover:text-white leading-snug max-w-4xl transition-colors duration-500">
                  "{service.pullQuote || service.fullDescription}"
                </p>
                <p className="text-lg font-black text-white mt-3">
                  {service.pullQuoteSubtext || 'We align business intent, technical execution, and measurable outcomes — so you build with greater confidence.'}
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ══════════════════════ BADGE STRIP ══════════════════════ */}
      {!service.hideBadgeStrip && (
        <div className="border-t border-b border-white/[0.05] py-10" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <p className="text-[8px] font-black tracking-[0.45em] text-white/20 uppercase mb-7 text-center">CORE CAPABILITY PRINCIPLES</p>
            <div className="flex flex-nowrap items-center justify-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {service.keyFeatures.map((f, i, arr) => (
                <React.Fragment key={f}>
                  <span className="flex-shrink-0 text-white/40 text-[10px] font-bold tracking-[0.12em] whitespace-nowrap">{f}</span>
                  {i < arr.length - 1 && <span className="flex-shrink-0 mx-4 text-white/10 text-xs select-none">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ eQORE AI CONCIERGE ══════════════════════ */}
      <div id="svc-concierge">
        <ConciergeSection inverted suggestedPrompts={service.conciergeChips || [
          `What is ${service.name}?`,
          `What capabilities does Kangqore offer for ${service.name}?`,
          `How does the ${service.name} engagement process work?`,
          `What deliverables will I receive?`,
          `How long does a ${service.name} engagement take?`,
          ...service.keyFeatures.map(f => `Tell me about ${f.toLowerCase()}`),
          `Which industries does ${service.name} apply to?`,
          `Request a ${service.name} Discovery Call`,
        ]} />
      </div>

      {/* ══════════════════════ CAPABILITIES ══════════════════════ */}
      {service.capabilityAreas ? (
        /* ── BENTO GRID (when capabilityAreas override is set) ── */
        <section id="svc-capabilities" className="py-24 overflow-hidden relative" style={{ backgroundColor: '#000000' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .svc-cap-desc {
              opacity: 1; transform: translateY(0);
              transition: opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1);
              visibility: visible;
            }
            .svc-cap-group:hover .svc-cap-desc {
              opacity: 0; transform: translateY(12px); visibility: hidden; pointer-events: none;
            }
            .svc-cap-items {
              opacity: 0; transform: translateY(12px);
              transition: opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1);
              pointer-events: none; visibility: hidden;
            }
            .svc-cap-group:hover .svc-cap-items {
              opacity: 1; transform: translateY(0); pointer-events: auto; visibility: visible;
            }
            .svc-cap-no-scroll::-webkit-scrollbar { display: none; }
            .svc-cap-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          `}} />
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            {/* Section Header — mirrors DepartmentCarousel */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                  {service.capabilitiesLabel || 'CAPABILITIES'}
                </span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                  {service.capabilitiesSectionTitle
                    ? <>{service.capabilitiesSectionTitle}{' '}<span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">{service.capabilitiesSectionHighlight}</span></>
                    : <>Our{' '}<span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Capabilities.</span></>
                  }
                </h2>
                <p className="text-lg text-white/40 leading-relaxed max-w-md lg:text-right">
                  {capabilities.length} Capability Area{capabilities.length !== 1 ? 's' : ''}. Engineered for enterprise.
                </p>
              </div>
            </div>

            {/* Bento Grid */}
            <div className={`grid gap-3 grid-cols-1 ${capabilities.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {capabilities.map((cap, i) => {
                const isExpanded = !!expandedCaps[i];
                const cardClass = capabilities.length === 3
                  ? i === 0
                    ? 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]'
                    : 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]'
                  : 'col-span-1 h-[380px] lg:h-[400px]';
                const bgImage = cap.image || service.image || '';

                return (
                  <div
                    key={i}
                    className={`group svc-cap-group relative rounded-2xl overflow-hidden shadow-sm transition-all duration-500 ${cardClass} ${isExpanded ? 'bg-[#0a0a0c] border border-white/10 shadow-2xl' : 'border border-transparent hover:shadow-[0_20px_40px_rgba(37,100,234,0.15)] hover:-translate-y-1'}`}
                  >
                    {/* Background Image */}
                    <div className={`absolute inset-0 z-0 overflow-hidden rounded-2xl transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                      {bgImage && (
                        <img src={bgImage} alt={cap.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 bg-black/30 z-[1]" />
                      <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0) 100%)' }} />
                    </div>

                    {/* Hover Gradient Overlay */}
                    {!isExpanded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2564ea]/90 to-[#4ab6d4]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    )}

                    {/* Default Content */}
                    <div className={`relative z-20 h-full flex flex-col justify-between p-8 lg:p-10 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                      <div className="flex flex-col h-full">
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 transition-transform duration-300 shrink-0">
                          {cap.title}
                        </h3>
                        <p className="text-xs lg:text-sm font-semibold text-cyan-400 mb-6 shrink-0">
                          {cap.items.length} Key Capabilities
                        </p>
                        <div className="relative flex-1">
                          <p className="svc-cap-desc absolute inset-0 text-white/90 leading-relaxed text-sm lg:text-[15px]">
                            {cap.desc}
                          </p>
                          <ul className="svc-cap-items absolute inset-0 space-y-2.5">
                            <span className="block text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2.5">Key Capabilities:</span>
                            {cap.items.slice(0, 6).map((item, j) => (
                              <li key={j} className="flex items-start text-white/90 text-[13px] lg:text-sm font-medium">
                                <span className="mr-2 text-cyan-400 opacity-80">✦</span>
                                {item.includes(':') ? item.split(':')[0] : item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="inline-flex items-center text-white font-bold w-fit mt-4 shrink-0 transition-all duration-300 text-sm lg:text-base">
                        Explore Capability
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </div>
                    </div>

                    {/* Expanded Detail Overlay */}
                    <div className={`absolute inset-0 z-30 bg-[#0a0a0c]/98 backdrop-blur-xl p-6 lg:p-8 flex flex-col justify-between overflow-y-auto svc-cap-no-scroll transition-all duration-500 ease-in-out border-t border-white/10 ${isExpanded ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
                      <div className="flex flex-col text-left">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[9px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 font-mono">
                            {cap.items.length} Sub-Capabilities
                          </span>
                          <span className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase font-mono">{cap.n}</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                          {cap.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed">
                          {cap.desc}
                        </p>
                        <ul className="space-y-3">
                          {cap.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-300 leading-snug">
                              <span className="text-cyan-400 font-bold shrink-0 mt-0.5">✦</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-white/5 mt-6 flex justify-between items-center pr-14">
                        <a href="/contact" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors group/link">
                          Discuss This Capability
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </a>
                      </div>
                    </div>

                    {/* Plus / X Toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedCaps(p => ({ ...p, [i]: !p[i] })); }}
                      className={`absolute bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isExpanded ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:scale-110 active:scale-95'}`}
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        /* ── ORIGINAL LIST + DETAIL PANEL (all other services) ── */
        <section id="svc-capabilities" className="py-32 relative" style={{ backgroundColor: '#000000' }}>
          <div ref={capRef} className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.capabilitiesLabel || 'THE FRAMEWORK'}</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                {service.capabilitiesSectionTitle
                  ? <>{service.capabilitiesSectionTitle}{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">{service.capabilitiesSectionHighlight}</span></>
                  : <>{capabilities.length} Core Capability{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">Areas</span></>
                }
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 lg:gap-24 lg:h-[560px]">
              {/* Capability list */}
              <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
                {capabilities.map((c, i) => {
                  const active = activeCapability === i;
                  return (
                    <div key={c.n} className="border-b border-white/[0.06]">
                      <div
                        onMouseEnter={() => setActiveCapability(i)}
                        onClick={() => setActiveCapability(active ? -1 : i)}
                        className="group flex items-center justify-between gap-5 py-5 cursor-pointer"
                      >
                        <div className="flex items-center gap-5">
                          <span className={`w-2.5 h-2.5 flex-shrink-0 transition-colors duration-200 ${active ? 'bg-cyan-400' : 'bg-transparent'}`} />
                          <span className={`text-base sm:text-lg lg:text-xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{c.title}</span>
                        </div>
                        <ChevronRight className={`lg:hidden w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${active ? 'rotate-90' : ''}`} />
                      </div>
                      {active && (
                        <div className="lg:hidden pb-6 pl-7 pr-2">
                          <p className="text-[9px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-3">CAPABILITY {c.n}</p>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">{c.desc}</p>
                          <ul className="space-y-1.5">
                            {c.items.map(item => (
                              <li key={item} className="flex items-start gap-3">
                                <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: c.color }} />
                                <span className="text-white/45 text-xs font-medium">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Desktop detail panel */}
              <div className="hidden lg:flex items-start pt-5">
                <div className="w-full sticky top-8">
                  <p className="text-[10px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-6">CAPABILITY {capabilities[safeCapIdx].n}</p>
                  <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">{capabilities[safeCapIdx].title}</h3>
                  <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">{capabilities[safeCapIdx].desc}</p>
                  <ul className="space-y-3">
                    {capabilities[safeCapIdx].items.map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: capabilities[safeCapIdx].color }} />
                        <span className="text-white/55 text-sm font-medium leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ PHILOSOPHY / FEATURES ══════════════════════ */}
      <section className="py-32" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">THE PHILOSOPHY</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Built for Impact.<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">Delivered with Precision.</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
              Every {service.name} decision stays coherent from strategy through delivery.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-3">
            {featureLabels.map((label, i) => {
              const FIcon = featureIcons[i];
              const n = String(i + 1).padStart(2, '0');
              const isWide = i === 0 || i === 3;
              const ACCENT = ['#2564ea','#4ab6d4','#6366f1','#10b981'];
              return (
                <div
                  key={label}
                  className={`group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#06090f] p-7 flex flex-col justify-between hover:border-white/[0.14] transition-all duration-500 ${isWide ? 'sm:col-span-2' : 'sm:col-span-1'}`}
                >
                  {/* top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, ${ACCENT[i]}, transparent)` }} />

                  {/* faint bg glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at top left, ${ACCENT[i]}0d 0%, transparent 65%)` }} />

                  {/* Large bg number */}
                  <span className="absolute bottom-4 right-5 font-mono text-[5rem] lg:text-[6rem] font-black leading-none select-none text-white/[0.04] group-hover:text-white/[0.07] transition-colors duration-500 tabular-nums">
                    {n}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] group-hover:border-white/20 transition-all duration-500"
                    style={{ background: `${ACCENT[i]}14` }}>
                    <FIcon className="w-4 h-4 transition-colors duration-500" style={{ color: `${ACCENT[i]}99` }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <p className="text-[9px] font-black tracking-[0.28em] uppercase mb-2 transition-colors duration-500"
                      style={{ color: `${ACCENT[i]}80` }}>
                      {n} — {featureTitles[i]}
                    </p>
                    <h3 className="text-white/70 group-hover:text-white font-black text-lg leading-snug mb-2 transition-colors duration-300">
                      {label}
                    </h3>
                    <p className="text-white/40 group-hover:text-white/70 text-xs font-medium leading-relaxed transition-colors duration-500 max-w-sm">
                      {featureMicros[i]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ══════════════════════ COMPARISON TABLE ══════════════════════ */}
      {service.comparisonTable && (
        <section className="py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-14">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">WHY IT MATTERS</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                {service.comparisonTable.heading || <>The shift from automation<br /><span className="bg-brand-gradient bg-clip-text text-transparent">to autonomy.</span></>}
              </h2>
            </div>
            <div className="grid lg:grid-cols-[1fr_64px_1fr] gap-0 items-stretch">
              {/* Before panel */}
              <div className="rounded-2xl lg:rounded-r-none bg-white/[0.025] border border-white/[0.05] lg:border-r-0 p-8 lg:p-10">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-white/25 block mb-8">
                  {service.comparisonTable.colA || 'Traditional Automation'}
                </span>
                <div className="space-y-7">
                  {service.comparisonTable.rows.map((row, i) => (
                    <div key={i}>
                      <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white/20 block mb-1.5">{row.dimension}</span>
                      <p className="text-white/30 text-sm font-medium leading-relaxed">{row.before}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Centre divider */}
              <div className="hidden lg:flex flex-col items-center justify-center relative">
                <div className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
                <div className="relative z-10 w-9 h-9 rounded-full bg-[#000] border border-cyan-400/25 flex items-center justify-center shadow-[0_0_16px_rgba(34,211,238,0.12)]">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400/70" />
                </div>
              </div>

              {/* After panel */}
              <div className="rounded-2xl lg:rounded-l-none bg-[#000] border border-cyan-400/10 lg:border-l-0 border-l-2 border-l-cyan-400/20 p-8 lg:p-10">
                <span className="text-[9px] font-black tracking-[0.35em] uppercase text-cyan-400/60 block mb-8">
                  {service.comparisonTable.colB || 'Agentic AI'}
                </span>
                <div className="space-y-7">
                  {service.comparisonTable.rows.map((row, i) => (
                    <div key={i}>
                      <span className="text-[8px] font-black tracking-[0.3em] uppercase text-white/25 block mb-1.5">{row.dimension}</span>
                      <p className="text-white font-semibold text-sm leading-relaxed">{row.after}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ ARCHITECTURE ══════════════════════ */}
      {service.architectureNodes && (
        <section className="py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">ARCHITECTURE</span>
                </div>
                <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                  How It Works.<br />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">The 4-Layer Stack.</span>
                </h2>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
                Every {service.name} deployment runs on a governed, modular architecture built for enterprise scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-0 lg:divide-x lg:divide-white/[0.05]">
              {service.architectureNodes.map((node, idx) => {
                const NodeIcon = JOURNEY_ICON_MAP[node.icon] || Target;
                const LAYER_COLORS = ['#2564ea', '#4ab6d4', '#6366f1', '#10b981'];
                const color = LAYER_COLORS[idx % LAYER_COLORS.length];
                return (
                  <div key={idx} className="px-8 first:pl-0 last:pr-0 flex flex-col gap-4 py-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[8px] font-black tracking-[0.3em] text-white/15">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <NodeIcon className="w-3.5 h-3.5" style={{ color: `${color}80` }} />
                    </div>
                    <h3 className="text-white font-black text-sm leading-snug">{node.title}</h3>
                    <p className="text-white/40 text-xs font-medium leading-relaxed">{node.description}</p>
                    <ul className="space-y-1.5 mt-auto pt-4 border-t border-white/[0.04]">
                      {node.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-white/40 font-medium">
                          <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: `${color}50` }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════ INDUSTRY USE CASES ══════════════════════ */}
      {service.industryUseCases && (
        <section className="py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-14">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">BY INDUSTRY</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Agents built for<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">your industry.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
              {service.industryUseCases.map((item, idx) => (
                <div key={idx} className="bg-[#000000] p-8 flex flex-col gap-4">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">{item.industry}</span>
                  <p className="text-white font-bold text-lg leading-snug">{item.headline}</p>
                  <ul className="space-y-2 mt-1">
                    {item.agents.map((agent, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <span className="text-white/50 text-sm font-medium leading-relaxed">{agent}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ OUTCOMES ══════════════════════ */}
      {service.outcomeCard && (() => {
        const allCards = [
          service.outcomeCard,
          ...(service.outcomeCard2 ? [service.outcomeCard2] : []),
          ...(service.outcomeCard3 ? [service.outcomeCard3] : []),
        ];
        const gridCols = allCards.length === 3 ? 'lg:grid-cols-3'
                       : allCards.length === 2 ? 'lg:grid-cols-2'
                       : 'lg:grid-cols-1';
        const pad = allCards.length === 3 ? 'p-8 lg:p-10' : 'p-10 lg:p-14';
        const metricSize = allCards.length === 3 ? 'clamp(2.8rem, 5vw, 4.5rem)' : 'clamp(3.5rem, 8vw, 6rem)';
        return (
          <section className="py-24" style={{ backgroundColor: '#000000' }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

              <div className="flex items-center gap-4 mb-16">
                <div className="h-[1px] w-8 bg-white/20" />
                <span className="text-[9px] font-black tracking-[0.35em] text-white/40 uppercase">Engagement Outcomes</span>
              </div>

              <div className={`grid gap-px ${gridCols} bg-white/[0.04] rounded-2xl overflow-hidden`}>
                {allCards.map((card, idx) => (
                  <div key={idx} className={`bg-[#000000] ${pad} flex flex-col gap-8`}>
                    <div>
                      <span className="font-black leading-none text-white" style={{ fontSize: metricSize }}>
                        {card.metric}
                      </span>
                      <p className="text-white/45 text-sm font-semibold leading-snug max-w-[18ch] mt-2">
                        {card.metricLabel}
                      </p>
                      {card.metricContext && (
                        <p className="text-white/25 text-xs font-medium mt-1.5">{card.metricContext}</p>
                      )}
                    </div>
                    <div className="border-t border-white/[0.06] pt-6">
                      <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40 block mb-5">
                        {card.industry}
                      </span>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[9px] font-black tracking-[0.25em] uppercase text-white/40 mb-1.5">The Challenge</p>
                          <p className="text-white/50 text-xs font-medium leading-relaxed">{card.problem}</p>
                        </div>
                        <div className="h-px bg-white/[0.05]" />
                        <div>
                          <p className="text-[9px] font-black tracking-[0.25em] uppercase text-white/40 mb-1.5">The Outcome</p>
                          <p className="text-white/85 font-semibold text-xs leading-relaxed">{card.outcome}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between flex-wrap gap-3">
                      <p className="text-white/40 text-xs font-medium italic">
                        Engagement confidential — details available on request.
                      </p>
                      {service.methodologyBrief && (
                        <a
                          href={service.methodologyBrief}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] uppercase text-white/30 hover:text-cyan-400/70 transition-colors duration-200"
                        >
                          Download Methodology
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        );
      })()}

      {/* ══════════════════════ MID-PAGE CTA ══════════════════════ */}
      {service.outcomeCard && (
        <section className="py-20" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <p className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-xl">
              Your next workflow runs itself.
            </p>
            <Link
              to="/contact"
              className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.12)]"
            >
              Schedule a Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════ JOURNEY TIMELINE ══════════════════════ */}
      <section id="svc-phases" className="py-32 overflow-hidden relative" style={{ backgroundColor: '#000000' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={journeyRef}>
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

            {/* Timeline cards */}
            <div className="w-full lg:w-[55%] relative">
              <div className="hidden lg:block absolute left-[14px] top-0 bottom-0 w-[30px]" style={{ zIndex: 1 }}>
                <svg className="w-full h-full" viewBox="0 0 30 1000" preserveAspectRatio="none" fill="none">
                  <defs>
                    <linearGradient id="svc-jg" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" /><stop offset="25%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#2564ea" /><stop offset="75%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <filter id="svc-jglow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
                  <path className="svc-journey-glow" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#svc-jg)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#svc-jglow)" opacity="0.4" />
                  <path className="svc-journey-path" d="M 15 0 C 15 100, 22 150, 15 250 S 8 400, 15 500 C 22 650, 8 700, 15 750 S 22 900, 15 1000" stroke="url(#svc-jg)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  {activeJourney.map((_, i) => {
                    const cy = Math.round(1000 / (2 * activeJourney.length) + i * 1000 / activeJourney.length);
                    return (
                      <g key={i} className="svc-journey-node" style={{ transformOrigin: `15px ${cy}px` }}>
                        <circle cx="15" cy={cy} r="9" fill="none" stroke="url(#svc-jg)" strokeWidth="0.8" opacity="0.2">
                          <animate attributeName="r" values="9;13;9" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.2;0.08;0.2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                        </circle>
                        <circle cx="15" cy={cy} r="7" fill="#06090f" stroke="url(#svc-jg)" strokeWidth="1.5" />
                        <circle cx="15" cy={cy} r="3" fill="url(#svc-jg)" opacity="0.7">
                          <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                        </circle>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="space-y-6 lg:pl-[55px]">
                {activeJourney.map((item, idx) => {
                  const { Icon } = item;
                  return (
                    <div key={idx} className="svc-journey-card group">
                      <div className="relative bg-[#06090f] border border-white/[0.08] rounded-3xl p-6 lg:p-8 hover:border-transparent transition-all duration-500 hover:-translate-y-1 flex items-start gap-6 overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                        <div className={`relative z-10 w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br ${PHASE_GRADIENTS[idx]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="relative z-10 flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-mono text-[9px] font-bold tracking-[0.3em] text-white/20 group-hover:text-white/80 uppercase transition-colors duration-500">{item.phase}</div>
                            {item.kangqore && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 group-hover:bg-white/15 border border-brand-blue/20 group-hover:border-white/30 rounded-full transition-colors duration-500">
                                <div className="w-1 h-1 bg-brand-blue group-hover:bg-white rounded-full animate-pulse transition-colors duration-500" />
                                <span className="text-[7px] font-bold tracking-[0.15em] text-brand-blue group-hover:text-white uppercase transition-colors duration-500">Kangqore</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-lg font-black text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-white/40 group-hover:text-white font-light leading-relaxed transition-colors duration-500">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky right panel */}
            <div className="w-full lg:w-[45%] lg:sticky lg:top-32">
              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] w-12 bg-white/20" />
                    <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.name} Journey</span>
                  </div>
                  <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                    From Ambition to<br />
                    <span className="bg-brand-gradient bg-clip-text text-transparent">Delivered Outcomes.</span>
                  </h2>
                  <p className="text-white/40 text-lg font-light leading-relaxed max-w-lg">
                    A connected system for moving from business goals through solution design to implementation and continuous optimization.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                  {[['Phases', String(activeJourney.length).padStart(2, '0')], ['Timeline', '4-16 wks'], ['Confidence', '100%']].map(([label, val], i) => (
                    <div key={label}>
                      <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase font-bold mb-2">{label}</div>
                      <div className={`text-2xl font-black ${i === 2 ? 'bg-brand-gradient bg-clip-text text-transparent' : 'text-white'}`}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ SERVICE PACKAGES ══════════════════════ */}
      {service.servicePackages && (
        <section className="py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-14">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">HOW WE ENGAGE</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                Five ways to start.<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">One partner throughout.</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
              {service.servicePackages.map((pkg, idx) => (
                <div key={idx} className="bg-[#000000] p-7 flex flex-col gap-4">
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30">0{idx + 1}</span>
                  <p className="text-white font-bold text-base leading-snug">{pkg.name}</p>
                  <p className="text-white/40 text-sm font-medium leading-relaxed flex-1">{pkg.description}</p>
                  {pkg.duration && (
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30 bg-white/[0.04] px-2 py-1 rounded-md self-start">
                      {pkg.duration}{pkg.tier && <span className="text-white/15 mx-1">·</span>}{pkg.tier && pkg.tier}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ TRUST PILLARS / PARTNERSHIP MODEL ══════════════════════ */}
      <section id="svc-partnership" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">HOW WE WORK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-white">
              The Kangqore{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Partnership Model</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {HOW_WE_WORK.map((c, i) => {
              const elevated = i === 1 || i === 4;
              return (
                <div key={c.n} className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${elevated ? 'lg:-translate-y-4' : ''}`}>
                  <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 group-hover:h-64 sm:group-hover:h-72 shadow-lg">
                    <img src={`/assets/engines/engine${(i % 6) + 1}.png`} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#06090f] flex flex-col flex-1">
                    <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-3">{c.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{c.desc.split('.')[0]}.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TECH STACK (service-specific) ══════════════════════ */}
      {service.techStack && service.techStack.length > 0 && (
        <section className="py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">TECH STACK</span>
                </div>
                <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                  {service.name} Tools{' '}
                  <span className="bg-brand-gradient bg-clip-text text-transparent">& Technology.</span>
                </h2>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
                The stack powering every autonomous agent we build.
              </p>
            </div>

            {/* Editorial list */}
            <div>
              {service.techStack.map((item, i) => {
                const TechIcon = JOURNEY_ICON_MAP[item.icon] || Network;
                const n = String(i + 1).padStart(2, '0');
                return (
                  <div key={item.title} className="group relative">
                    <div className="h-px bg-white/[0.07] group-hover:bg-transparent transition-colors duration-500" />
                    <div className="relative flex items-center gap-6 lg:gap-10 py-8 lg:py-10 overflow-hidden">
                      {/* Gradient left bar */}
                      <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(180deg, #2564ea, #4ab6d4)' }} />
                      {/* Subtle bg wash */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: 'linear-gradient(90deg, rgba(37,100,234,0.04) 0%, transparent 60%)' }} />

                      {/* Ghost number */}
                      <span className="hidden sm:block relative z-10 font-mono text-[3.5rem] lg:text-[4.5rem] font-black leading-none select-none text-white/[0.05] group-hover:text-white/[0.1] transition-colors duration-500 w-20 lg:w-28 flex-shrink-0 text-right tabular-nums">
                        {n}
                      </span>

                      {/* Icon */}
                      <div
                        className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: TECH_STACK_ICON_COLORS[i % TECH_STACK_ICON_COLORS.length].bg,
                          boxShadow: TECH_STACK_ICON_COLORS[i % TECH_STACK_ICON_COLORS.length].glow,
                        }}
                      >
                        <TechIcon className="w-5 h-5 text-white drop-shadow" />
                      </div>

                      {/* Content */}
                      <div className="relative z-10 flex-1 min-w-0">
                        <h3 className="text-xl lg:text-2xl font-black text-white/75 group-hover:text-white mb-1.5 transition-colors duration-300 leading-tight">{item.title}</h3>
                        <p className="text-white/40 group-hover:text-white/70 text-sm font-medium leading-relaxed transition-colors duration-500">{item.desc}</p>
                      </div>

                      {/* Arrow ring */}
                      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full border border-white/[0.08] group-hover:border-cyan-400/40 group-hover:bg-cyan-400/[0.08] flex items-center justify-center transition-all duration-500">
                        <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="h-px bg-white/[0.07]" />
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section id="svc-faq" className="py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div ref={faqRef} className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-end mb-20">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">BEFORE YOU SIGN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-white">
                The hard questions,<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">answered.</span>
              </h2>
            </div>
            <div className="lg:pb-3 flex flex-col items-start gap-6">
              <p className="text-lg sm:text-xl font-bold text-white leading-snug">
                Talk through your specific workflow in 30 minutes.
              </p>
              <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                Schedule a Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <div className="space-y-0">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="border-t border-white/[0.06]">
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-start justify-between gap-8 py-7 text-left group">
                    <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-white/20 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="pb-7 pr-12">
                      <p className="text-white/70 text-base font-medium leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="border-t border-white/[0.06]" />
          </div>
        </div>
      </section>

      {/* ══════════════════════ RELATED SERVICES ══════════════════════ */}
      {relatedServices.length > 0 && (
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-14">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">EXTEND YOUR STRATEGY</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-white">
                  Related <span className="bg-brand-gradient bg-clip-text text-transparent">Capabilities.</span>
                </h2>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
                Complementary services that extend and compound your {service.name} investment.
              </p>
            </div>

            {/* Asymmetric grid: 1 featured large + 2 stacked */}
            <div className="grid lg:grid-cols-5 gap-3">

              {/* Featured card */}
              {relatedServices[0] && (() => {
                const e = relatedServices[0];
                const { Icon } = e;
                return (
                  <Link to={e.link} className="group lg:col-span-2 relative flex flex-col justify-between p-9 rounded-3xl border border-white/[0.08] bg-[#06090f] min-h-[360px] lg:min-h-[420px] overflow-hidden transition-all duration-500 hover:border-transparent hover:-translate-y-1 hover:shadow-[0_28px_56px_rgba(37,100,234,0.2)]">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(135deg, #2564ea 0%, #4ab6d4 100%)' }} />
                    {/* Ghost number */}
                    <span className="absolute -bottom-2 -right-2 text-[140px] font-black leading-none select-none text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-700 pointer-events-none">01</span>
                    {/* Top */}
                    <div className="relative z-10">
                      <div className="w-11 h-11 bg-white/[0.06] group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:text-white transition-all duration-500 mb-7">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-[9px] font-black tracking-[0.3em] text-white/20 group-hover:text-white/50 uppercase block mb-2 transition-colors duration-500">01 — RELATED</span>
                    </div>
                    {/* Bottom */}
                    <div className="relative z-10">
                      <h3 className="text-2xl lg:text-3xl font-black text-white mb-3 leading-tight">{e.name}</h3>
                      <p className="text-white/40 group-hover:text-white text-sm font-medium leading-relaxed mb-7 transition-colors duration-500 max-w-xs">{e.desc}</p>
                      <span className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-white/40 group-hover:text-white transition-colors duration-500">
                        Explore Capability <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </Link>
                );
              })()}

              {/* Right column: 2 stacked */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                {relatedServices.slice(1).map((e, idx) => {
                  const { Icon } = e;
                  const n = String(idx + 2).padStart(2, '0');
                  return (
                    <Link key={e.name} to={e.link} className="group relative flex items-center gap-6 p-8 rounded-3xl border border-white/[0.08] bg-[#06090f] flex-1 overflow-hidden transition-all duration-500 hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(37,100,234,0.15)]">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
                      {/* Ghost number */}
                      <span className="absolute -bottom-3 -right-3 text-[100px] font-black leading-none select-none text-white/[0.03] group-hover:text-white/[0.08] transition-colors duration-700 pointer-events-none">{n}</span>
                      {/* Icon */}
                      <div className="relative z-10 w-12 h-12 flex-shrink-0 bg-white/[0.06] group-hover:bg-white/20 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-white transition-all duration-500">
                        <Icon className="w-5 h-5" />
                      </div>
                      {/* Content */}
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="font-mono text-[8px] font-black tracking-[0.3em] text-white/18 group-hover:text-white/50 uppercase mb-1.5 transition-colors duration-500">{n} — RELATED</div>
                        <h3 className="text-xl font-black text-white mb-1.5 truncate">{e.name}</h3>
                        <p className="text-white/40 group-hover:text-white text-sm font-medium leading-snug line-clamp-2 transition-colors duration-500">{e.desc}</p>
                      </div>
                      {/* Arrow ring */}
                      <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full border border-white/[0.12] group-hover:border-white/40 group-hover:bg-white/10 flex items-center justify-center transition-all duration-500">
                        <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                      </div>
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-32" style={{ backgroundColor: '#000000' }}>
        <div ref={ctaRef} className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-end">

            {/* Left — statement */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">NEXT STEP</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
                One conversation.<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">One agent in production.</span>
              </h2>
              <p className="text-white/45 text-lg font-medium leading-relaxed max-w-xl">
                Talk through your highest-value workflow in 30 minutes — we will scope the right entry point and show you what a production agent looks like for your context.
              </p>
            </div>

            {/* Right — actions + proof points */}
            <div className="flex flex-col gap-6 lg:items-end">
              <div className="flex flex-row items-center gap-6 flex-wrap">
                <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a href="/assets/kangqore-agentic-ai-playbook.pdf" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-white/50 font-semibold text-sm hover:text-white transition-colors duration-200">
                  Download the Playbook
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
              <div className="flex flex-col gap-2 lg:items-end">
                <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white/20">From first call to first agent</span>
                <span className="text-white/50 text-sm font-semibold">Strategy → Build → Production in 8 weeks</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Keyframe animations ─────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes svc-strip-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes svc-strip-scroll { 0%, 100% { transform: translateX(0); } }
        }
      ` }} />
    </div>
  );
}
