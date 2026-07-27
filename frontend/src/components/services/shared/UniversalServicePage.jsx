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
  Plus, X, Download, ShieldCheck, Eye, Database,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import SvcRuler from './SvcRuler';
import ConciergeSection from '../../concierge/ConciergeSection';
import { AIToolsSection } from '../cognition/AICustomSections';
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


// ─── 3D Realistic Card Object Component ───────────────────────────────────────
const BentoCard = ({ cap, i, cardClass, isVibrant, isExpanded, setExpandedCaps, service }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isExpanded) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const transformStyle = tilt.active
    ? {
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`,
        transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
      }
    : {
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease',
      };

  const bgImage = cap.image || service.image || '';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`group svc-cap-group relative rounded-2xl overflow-hidden transition-all duration-500 ${cardClass} ${
        isVibrant 
          ? (isExpanded 
              ? 'bg-white border border-gray-200 shadow-2xl' 
              : 'bg-white border border-gray-200/80 shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]'
            ) 
          : (isExpanded 
              ? 'bg-[#0a0a0c] border border-white/10 shadow-2xl' 
              : 'bg-[#0d0e12] border border-white/[0.08] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85),0_5px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-8px_rgba(37,100,234,0.3),0_10px_20px_rgba(0,0,0,0.8)]'
            )
      }`}
    >
      {/* 3D Realistic Bevel & Edge Highlights */}
      {!isVibrant && !isExpanded && (
        <>
          {/* Inner border to look like thick beveled edge */}
          <div className="absolute inset-0 z-30 pointer-events-none rounded-2xl border border-white/[0.06] shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15),inset_0_-1.5px_0_0_rgba(0,0,0,0.6)]" />
          {/* Subtle bottom shadow ridge for realistic depth */}
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-black/40 z-30 pointer-events-none" />
        </>
      )}

      {/* Glossy reflection sweep overlay */}
      {!isExpanded && (
        <div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" 
          style={{
            transform: tilt.active ? `translate3d(${-tilt.y * 1.5}px, ${tilt.x * 1.5}px, 0)` : 'none',
            transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        />
      )}

      {/* Background Image */}
      <div className={`absolute inset-0 z-0 overflow-hidden rounded-2xl transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {bgImage && (
          <img 
            src={bgImage} 
            alt={cap.title} 
            className="w-full h-full object-cover transition-transform duration-700" 
            style={{
              transform: tilt.active ? `translate3d(${-tilt.y * 0.5}px, ${tilt.x * 0.5}px, 0) scale3d(1.03, 1.03, 1.03)` : 'none',
              transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        )}
        {!isVibrant && (
          <>
            <div className="absolute inset-0 bg-black/35 z-[1]" />
            <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(0,0,0,0.8) 0%,rgba(0,0,0,0.45) 45%,rgba(0,0,0,0) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(0deg,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0) 100%)' }} />
          </>
        )}
        {isVibrant && (
          <>
            <div className="absolute inset-0 bg-white/20 z-[1]" />
            <div className="absolute inset-x-0 top-0 h-1/2 z-[2]" style={{ background: 'linear-gradient(180deg,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.6) 45%,rgba(255,255,255,0) 100%)' }} />
          </>
        )}
      </div>

      {/* Hover Gradient Overlay */}
      {!isExpanded && !isVibrant && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
      )}
      {!isExpanded && isVibrant && (
        <div className="absolute inset-0 bg-white/95 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
      )}

      {/* Default Content */}
      <div className={`relative z-20 h-full flex flex-col justify-between p-8 lg:p-10 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex flex-col h-full">
          <h3 className={`text-2xl lg:text-3xl font-bold mb-2 transition-transform duration-300 shrink-0 ${isVibrant ? 'text-gray-900' : 'text-white'}`}>
            {cap.title}
          </h3>
          <p className={`text-xs lg:text-sm font-semibold mb-6 shrink-0 ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>
            {cap.items.length} Key Capabilities
          </p>
          <div className="relative flex-1">
            <p className={`svc-cap-desc absolute inset-0 leading-relaxed text-sm lg:text-[15px] ${isVibrant ? 'text-gray-800' : 'text-white/90'}`}>
              {cap.desc}
            </p>
            <ul className={`svc-cap-items absolute inset-0 space-y-2.5 ${isVibrant ? 'text-gray-800' : 'text-white/90'}`}>
              <span className={`block text-xs font-bold uppercase tracking-widest mb-2.5 ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>Key Capabilities:</span>
              {cap.items.slice(0, 6).map((item, j) => (
                <li key={j} className="flex items-start text-[13px] lg:text-sm font-medium">
                  <span className={`mr-2 opacity-80 ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>✦</span>
                  {item.includes(':') ? item.split(':')[0] : item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`inline-flex items-center font-bold w-fit mt-4 shrink-0 transition-all duration-300 text-sm lg:text-base ${isVibrant ? 'text-gray-900 group-hover:text-blue-600' : 'text-white'}`}>
          Explore Capability
          <ArrowRight className="ml-2 w-5 h-5" />
        </div>
      </div>

      {/* Expanded Detail Overlay */}
      <div className={`absolute inset-0 z-30 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto svc-cap-no-scroll transition-all duration-500 ease-in-out border-t backdrop-blur-xl ${isVibrant ? 'bg-white/98 border-gray-200' : 'bg-[#0a0a0c]/98 border-white/10'} ${isExpanded ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <div className="flex flex-col text-left">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[9px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border font-mono ${isVibrant ? 'text-gray-700 bg-gray-100/50 border-gray-300' : 'text-slate-300 bg-white/5 border-white/10'}`}>
              {cap.items.length} Sub-Capabilities
            </span>
            <span className={`text-[10px] font-black tracking-[0.3em] uppercase font-mono ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>{cap.n}</span>
          </div>
          <h4 className={`text-xl sm:text-2xl font-bold mb-2 tracking-tight ${isVibrant ? 'text-gray-900' : 'text-white'}`}>
            {cap.title}
          </h4>
          <p className={`text-xs sm:text-sm mb-5 leading-relaxed ${isVibrant ? 'text-gray-700' : 'text-slate-400'}`}>
            {cap.desc}
          </p>
          <ul className="space-y-3">
            {cap.items.map((item, j) => (
              <li key={j} className={`flex items-start gap-2 text-sm leading-snug ${isVibrant ? 'text-gray-800' : 'text-slate-300'}`}>
                <span className={`font-bold shrink-0 mt-0.5 ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={`pt-4 border-t mt-6 flex justify-between items-center pr-14 ${isVibrant ? 'border-gray-200' : 'border-white/5'}`}>
          <a href="/contact" className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors group/link ${isVibrant ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-cyan-400'}`}>
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
};

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
  const [openFaq,          setOpenFaq]          = useState(0);
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
              <p className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-8 font-light max-w-xl">{service.shortDescription}</p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mb-0">
                {service.whatIsPara2 || <>A service can be technically delivered and still fail if the strategy and execution are misaligned.{' '}<span className="text-white">Kangqore closes that gap.</span></>}
              </p>
              {service.whatIsPara3 && <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mt-8 mb-0">{service.whatIsPara3}</p>}
              {service.whatIsPara4 && <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mt-8 mb-0">{service.whatIsPara4}</p>}
            </div>

            {service.capabilityAreas ? (
              service.slug === 'agentic-ai-led-application-modernization' ? (
                /* ── Agentic AI-led Modernization Flow Diagram ── */
                <div className="flex items-center justify-center w-full">
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-h-[420px]">
                    <defs>
                      <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2564ea"/>
                        <stop offset="100%" stopColor="#4ab6d4"/>
                      </linearGradient>
                      <linearGradient id="legacy-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c"/>
                        <stop offset="100%" stopColor="#a855f7"/>
                      </linearGradient>
                      <linearGradient id="modern-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2564ea"/>
                        <stop offset="100%" stopColor="#00f0ff"/>
                      </linearGradient>
                      <filter id="glow-modern">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-agent">
                        <feGaussianBlur stdDeviation="8" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <marker id="diag-arrow-cyan" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#00f0ff" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <clipPath id="capsule-clip-mod">
                        <rect x="40" y="274" width="460" height="90" rx="30"/>
                      </clipPath>
                    </defs>

                    {/* ── LEFT: Legacy Server Stack / Monolith ── */}
                    <rect x="30" y="70" width="90" height="26" rx="4" fill="#0c0e14" stroke="url(#legacy-orange)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <rect x="25" y="106" width="100" height="26" rx="4" fill="#0c0e14" stroke="url(#legacy-orange)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <rect x="20" y="142" width="110" height="26" rx="4" fill="#0c0e14" stroke="url(#legacy-orange)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    {/* Monolith lines/connections (Spaghetti logic) */}
                    <path d="M 45,83 L 105,83 M 40,119 L 110,119 M 35,155 L 115,155" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
                    <circle cx="50" cy="83" r="2.5" fill="#ea580c" fillOpacity="0.7"/>
                    <circle cx="100" cy="119" r="2.5" fill="#a855f7" fillOpacity="0.7"/>
                    <circle cx="75" cy="155" r="2.5" fill="#ea580c" fillOpacity="0.7"/>
                    {/* Text labels on left stack */}
                    <text x="75" y="60" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.5">LEGACY CORE</text>
                    <text x="75" y="121" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="8" fontFamily="monospace" letterSpacing="0.5">MONOLITH</text>

                    {/* ── CENTER: Modernization Agent Engine ── */}
                    <circle cx="270" cy="120" r="54" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <circle cx="270" cy="120" r="48" fill="url(#modern-blue)" fillOpacity="0.12" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.6"/>
                    
                    {/* Internal Processor design */}
                    <rect x="256" y="106" width="28" height="28" rx="4" fill="#111" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                    {/* Processor Pins */}
                    <line x1="262" y1="102" x2="262" y2="106" stroke="white" strokeWidth="1.2"/>
                    <line x1="270" y1="102" x2="270" y2="106" stroke="white" strokeWidth="1.2"/>
                    <line x1="278" y1="102" x2="278" y2="106" stroke="white" strokeWidth="1.2"/>
                    <line x1="262" y1="134" x2="262" y2="138" stroke="white" strokeWidth="1.2"/>
                    <line x1="270" y1="134" x2="270" y2="138" stroke="white" strokeWidth="1.2"/>
                    <line x1="278" y1="134" x2="278" y2="138" stroke="white" strokeWidth="1.2"/>
                    <line x1="252" y1="112" x2="256" y2="112" stroke="white" strokeWidth="1.2"/>
                    <line x1="252" y1="120" x2="256" y2="120" stroke="white" strokeWidth="1.2"/>
                    <line x1="252" y1="128" x2="256" y2="128" stroke="white" strokeWidth="1.2"/>
                    <line x1="284" y1="112" x2="288" y2="112" stroke="white" strokeWidth="1.2"/>
                    <line x1="284" y1="120" x2="288" y2="120" stroke="white" strokeWidth="1.2"/>
                    <line x1="284" y1="128" x2="288" y2="128" stroke="white" strokeWidth="1.2"/>
                    
                    {/* Central Node Spark */}
                    <circle cx="270" cy="120" r="3.5" fill="#00f0ff"/>

                    {/* Text labels in center */}
                    <text x="270" y="55" textAnchor="middle" fill="#00f0ff" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.8">COGNITIVE ENGINE</text>
                    <text x="270" y="195" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.5">MODERNIZATION ENGINE</text>

                    {/* ── RIGHT: Cloud Native Target ── */}
                    <circle cx="450" cy="70" r="18" fill="#0c0e14" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <circle cx="410" cy="140" r="18" fill="#0c0e14" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <circle cx="490" cy="140" r="18" fill="#0c0e14" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8"/>
                    
                    {/* Connecting lines of the target mesh */}
                    <line x1="438" y1="83" x2="422" y2="124" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5"/>
                    <line x1="462" y1="83" x2="478" y2="124" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5"/>
                    <line x1="428" y1="140" x2="472" y2="140" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5"/>

                    {/* Labels inside microservices */}
                    <text x="450" y="73" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontFamily="monospace">API</text>
                    <text x="410" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontFamily="monospace">DB</text>
                    <text x="490" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontFamily="monospace">K8S</text>

                    {/* Text labels on right target */}
                    <text x="450" y="44" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.5">CLOUD NATIVE</text>
                    <text x="450" y="180" textAnchor="middle" fill="#00f0ff" fillOpacity="0.8" fontSize="8" fontFamily="monospace" letterSpacing="0.5">MICROSERVICES</text>

                    {/* ── Pipelines from Legacy to Engine, and Engine to Microservices ── */}
                    <path d="M 130 120 Q 180 90 216 120" fill="none" stroke="url(#legacy-orange)" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3 3"/>
                    <path d="M 130 138 Q 180 168 216 120" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="3 3"/>
                    
                    <path d="M 324 120 Q 370 90 412 120" fill="none" stroke="url(#modern-blue)" strokeWidth="1.8" strokeOpacity="0.8" markerEnd="url(#diag-arrow-cyan)"/>
                    <path d="M 324 120 Q 370 150 412 120" fill="none" stroke="#00f0ff" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="4 4"/>

                    {/* ── BOTTOM: Modernization Metrics & Status Panel ── */}
                    <rect x="40" y="274" width="460" height="90" rx="30" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                    {/* Segment fills */}
                    <rect x="155" y="274" width="115" height="90" fill="#1a1a1a" fillOpacity="0.5" clipPath="url(#capsule-clip-mod)"/>
                    <rect x="385" y="274" width="115" height="90" fill="url(#modern-blue)" fillOpacity="0.1" clipPath="url(#capsule-clip-mod)"/>
                    
                    {/* Dividers */}
                    <line x1="155" y1="274" x2="155" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
                    <line x1="270" y1="274" x2="270" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
                    <line x1="385" y1="274" x2="385" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>

                    {/* Section 1: Code Scanning */}
                    <g transform="translate(82, 290)">
                      <rect x="0" y="5" width="22" height="30" rx="3" stroke="white" strokeWidth="1.2" strokeOpacity="0.7" fill="none"/>
                      <line x1="4" y1="12" x2="18" y2="12" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                      <line x1="4" y1="18" x2="18" y2="18" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                      <line x1="4" y1="24" x2="12" y2="24" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                      {/* Scanning radar line */}
                      <line x1="-5" y1="16" x2="27" y2="16" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow-modern)"/>
                    </g>
                    <text x="97" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace">1. CODE SCAN</text>

                    {/* Section 2: Code Refactoring */}
                    <g transform="translate(192, 290)">
                      {/* Input logic block */}
                      <rect x="0" y="10" width="14" height="14" rx="2" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.6"/>
                      <text x="7" y="20" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="8" fontFamily="monospace">&lt;</text>
                      {/* Transform arrow */}
                      <path d="M 18 17 L 26 17" stroke="#00f0ff" strokeWidth="1.5" markerEnd="url(#diag-arrow-cyan)"/>
                      {/* Output microservices */}
                      <circle cx="36" cy="11" r="5" fill="none" stroke="#00f0ff" strokeWidth="1.2"/>
                      <circle cx="36" cy="23" r="5" fill="none" stroke="#00f0ff" strokeWidth="1.2"/>
                    </g>
                    <text x="212" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace">2. REFACTOR</text>

                    {/* Section 3: Automated QA / Test */}
                    <g transform="translate(312, 290)">
                      {/* Shield icon */}
                      <path d="M 15 5 C 22 5 27 8 27 15 C 27 23 15 29 15 29 C 15 29 3 23 3 15 C 3 8 8 5 15 5 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glow-modern)"/>
                      {/* Checkmark inside */}
                      <path d="M 10 16 L 13 19 L 20 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <text x="327" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace">3. AUTO QA</text>

                    {/* Section 4: Machine Speed stats */}
                    <g transform="translate(415, 290)">
                      {/* Speedometer arch */}
                      <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round"/>
                      <path d="M 5 25 A 20 20 0 0 1 35 11" fill="none" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" filter="url(#glow-modern)"/>
                      {/* Indicator needle */}
                      <line x1="25" y1="25" x2="35" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="25" cy="25" r="3" fill="white"/>
                    </g>
                    <text x="442" y="348" textAnchor="middle" fill="#00f0ff" fillOpacity="0.9" fontSize="8" fontWeight="bold" fontFamily="monospace">4. MACHINE SPEED</text>
                  </svg>
                </div>
              ) : service.slug === 'ai-governance' ? (
                /* ── AI Governance Flow Diagram ── */
                <div className="flex items-center justify-center w-full lg:-mt-16">
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-h-[420px]">
                    <defs>
                      <linearGradient id="gov-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2564ea"/>
                        <stop offset="100%" stopColor="#00f0ff"/>
                      </linearGradient>
                      <linearGradient id="gov-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7f53f9"/>
                        <stop offset="100%" stopColor="#a78bfa"/>
                      </linearGradient>
                      <linearGradient id="gov-green" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00c875"/>
                        <stop offset="100%" stopColor="#34d399"/>
                      </linearGradient>
                      <linearGradient id="gov-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c"/>
                        <stop offset="100%" stopColor="#fbbf24"/>
                      </linearGradient>

                      <filter id="glow-cyan-gov" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-purple-gov" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="7" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-green-gov" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <marker id="diag-arrow-cyan-gov" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#00f0ff" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-green-gov" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#34d399" strokeWidth="1.2" fill="none"/>
                      </marker>

                      <clipPath id="capsule-clip-gov">
                        <rect x="35" y="270" width="470" height="96" rx="20"/>
                      </clipPath>
                    </defs>

                    {/* ── TOP SYSTEM STATUS BANNER ── */}
                    <g transform="translate(140, 16)">
                      <rect x="0" y="0" width="260" height="22" rx="11" fill="#080c14" stroke="#00c875" strokeWidth="1" strokeOpacity="0.4" />
                      <circle cx="16" cy="11" r="3.5" fill="#00c875" filter="url(#glow-green-gov)" />
                      <text x="28" y="14" fill="#00c875" fontSize="7.5" fontWeight="bold" fontFamily="monospace" letterSpacing="0.8">eQORE™ :: CONTINUOUS GOVERNANCE ACTIVE</text>
                    </g>

                    {/* ── LEFT: INPUT STREAM CAPSULES ── */}
                    <text x="75" y="48" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.8">GOVERNANCE INPUTS</text>
                    
                    {/* Input 1: Prompts */}
                    <g transform="translate(20, 56)">
                      <rect x="0" y="0" width="110" height="26" rx="6" fill="#080c14" stroke="url(#gov-gold)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="14" cy="13" r="3" fill="#f59e0b" />
                      <text x="24" y="16" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace" fontWeight="bold">MODEL PROMPTS</text>
                    </g>
                    {/* Input 2: Agent Actions */}
                    <g transform="translate(20, 88)">
                      <rect x="0" y="0" width="110" height="26" rx="6" fill="#080c14" stroke="url(#gov-gold)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="14" cy="13" r="3" fill="#ea580c" />
                      <text x="24" y="16" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace" fontWeight="bold">AGENT ACTIONS</text>
                    </g>
                    {/* Input 3: RAG / Context */}
                    <g transform="translate(20, 120)">
                      <rect x="0" y="0" width="110" height="26" rx="6" fill="#080c14" stroke="url(#gov-cyan)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="14" cy="13" r="3" fill="#00f0ff" />
                      <text x="24" y="16" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace" fontWeight="bold">RAG / CONTEXT</text>
                    </g>
                    {/* Input 4: 3rd Party Models */}
                    <g transform="translate(20, 152)">
                      <rect x="0" y="0" width="110" height="26" rx="6" fill="#080c14" stroke="url(#gov-purple)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="14" cy="13" r="3" fill="#a78bfa" />
                      <text x="24" y="16" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace" fontWeight="bold">3RD PARTY LLMS</text>
                    </g>

                    {/* Connecting input paths to central engine */}
                    <path d="M 130 69 C 160 69, 175 117, 196 117" stroke="url(#gov-gold)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" markerEnd="url(#diag-arrow-cyan-gov)" />
                    <path d="M 130 101 L 196 117" stroke="url(#gov-gold)" strokeWidth="1.5" strokeOpacity="0.9" markerEnd="url(#diag-arrow-cyan-gov)" />
                    <path d="M 130 133 L 196 117" stroke="url(#gov-cyan)" strokeWidth="1.5" strokeOpacity="0.9" markerEnd="url(#diag-arrow-cyan-gov)" />
                    <path d="M 130 165 C 160 165, 175 117, 196 117" stroke="url(#gov-purple)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" markerEnd="url(#diag-arrow-cyan-gov)" />

                    {/* ── CENTER: eQORE™ GOVERNANCE ENGINE KERNEL ── */}
                    <text x="270" y="48" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.8">eQORE™ GOVERNANCE KERNEL</text>
                    
                    {/* Outer Orbit Shield */}
                    <circle cx="270" cy="117" r="70" fill="#050810" stroke="url(#gov-purple)" strokeWidth="1.5" filter="url(#glow-purple-gov)" />
                    {/* Inner Dashed Radar */}
                    <circle cx="270" cy="117" r="52" fill="#090d1a" stroke="#00f0ff" strokeWidth="1" strokeDasharray="5 3" />
                    <circle cx="270" cy="117" r="36" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.15" />
                    
                    {/* Hexagon Core Engine Chip */}
                    <g transform="translate(248, 95)">
                      <rect x="0" y="0" width="44" height="44" rx="10" fill="#090e18" stroke="url(#gov-cyan)" strokeWidth="1.5" filter="url(#glow-cyan-gov)" />
                      <path d="M 22 8 L 36 15 L 36 29 L 22 36 L 8 29 L 8 15 Z" fill="none" stroke="#00f0ff" strokeWidth="1.4" />
                      <circle cx="22" cy="22" r="4" fill="#00f0ff" filter="url(#glow-cyan-gov)" />
                    </g>

                    {/* Satellites on orbit */}
                    <g transform="translate(270, 47)">
                      <circle cx="0" cy="0" r="4" fill="#7f53f9" />
                      <text x="0" y="-7" textAnchor="middle" fill="#a78bfa" fontSize="6.5" fontWeight="bold" fontFamily="monospace">RISK</text>
                    </g>
                    <g transform="translate(340, 117)">
                      <circle cx="0" cy="0" r="4" fill="#00f0ff" />
                      <text x="8" y="2" fill="#00f0ff" fontSize="6.5" fontWeight="bold" fontFamily="monospace">BIAS</text>
                    </g>
                    <g transform="translate(270, 187)">
                      <circle cx="0" cy="0" r="4" fill="#00c875" />
                      <text x="0" y="11" textAnchor="middle" fill="#00c875" fontSize="6.5" fontWeight="bold" fontFamily="monospace">AUDIT</text>
                    </g>
                    <g transform="translate(200, 117)">
                      <circle cx="0" cy="0" r="4" fill="#ea580c" />
                      <text x="-8" y="2" textAnchor="end" fill="#fbbf24" fontSize="6.5" fontWeight="bold" fontFamily="monospace">POLICY</text>
                    </g>

                    {/* Connecting output path from center to right */}
                    <path d="M 340 117 L 415 117" stroke="url(#gov-green)" strokeWidth="2.5" filter="url(#glow-green-gov)" markerEnd="url(#diag-arrow-green-gov)" />

                    {/* ── RIGHT: AUDIT VERIFIED COMPLIANCE LEDGER ── */}
                    <text x="470" y="48" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.8">COMPLIANCE OUTCOME</text>
                    
                    <g transform="translate(415, 56)">
                      <rect x="0" y="0" width="112" height="124" rx="10" fill="#080d16" stroke="url(#gov-green)" strokeWidth="1.5" filter="url(#glow-green-gov)" />
                      
                      {/* Badge Header */}
                      <rect x="8" y="8" width="96" height="16" rx="4" fill="#00c875" fillOpacity="0.15" />
                      <text x="56" y="19" textAnchor="middle" fill="#00c875" fontSize="7.5" fontWeight="black" fontFamily="monospace">VERIFIED PASSPORT</text>

                      {/* Checklist */}
                      <text x="14" y="40" fill="#00c875" fontSize="8" fontWeight="bold">✓</text>
                      <text x="24" y="40" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace">EU AI Act Aligned</text>

                      <text x="14" y="58" fill="#00c875" fontSize="8" fontWeight="bold">✓</text>
                      <text x="24" y="58" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace">Bias &lt; 0.01 Threshold</text>

                      <text x="14" y="76" fill="#00c875" fontSize="8" fontWeight="bold">✓</text>
                      <text x="24" y="76" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace">Zero-Trust Shielded</text>

                      <text x="14" y="94" fill="#00c875" fontSize="8" fontWeight="bold">✓</text>
                      <text x="24" y="94" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace">Audit Trail Logged</text>

                      <text x="14" y="112" fill="#00c875" fontSize="8" fontWeight="bold">✓</text>
                      <text x="24" y="112" fill="white" fillOpacity="0.9" fontSize="7.5" fontFamily="monospace">Kill-Switch Ready</text>
                    </g>

                    {/* ── BOTTOM: 4-STAGE GOVERNANCE PIPELINE BAR ── */}
                    <g transform="translate(35, 270)">
                      {/* Outer Container */}
                      <rect x="0" y="0" width="470" height="96" rx="20" fill="#050810" stroke="white" strokeWidth="1.2" strokeOpacity="0.25"/>
                      
                      {/* Active Stage Highlights */}
                      <rect x="117.5" y="0" width="117.5" height="96" fill="#121724" fillOpacity="0.5"/>
                      <rect x="352.5" y="0" width="117.5" height="96" fill="url(#gov-green)" fillOpacity="0.12" clipPath="url(#capsule-clip-gov)"/>
                      
                      {/* Stage Dividers */}
                      <line x1="117.5" y1="0" x2="117.5" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
                      <line x1="235" y1="0" x2="235" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
                      <line x1="352.5" y1="0" x2="352.5" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>

                      {/* Stage 1: Risk Tiering */}
                      <g transform="translate(43, 20)">
                        <circle cx="15" cy="15" r="14" fill="#0c101c" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.9"/>
                        <circle cx="15" cy="15" r="6" fill="#f59e0b" />
                        <line x1="15" y1="0" x2="15" y2="30" stroke="white" strokeOpacity="0.3" />
                        <line x1="0" y1="15" x2="30" y2="15" stroke="white" strokeOpacity="0.3" />
                      </g>
                      <text x="58" y="70" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontWeight="bold" fontFamily="monospace">1. RISK TIERING</text>
                      <text x="58" y="82" textAnchor="middle" fill="#f59e0b" fontSize="6.5" fontFamily="monospace">ISO / EU AI ACT</text>

                      {/* Stage 2: Explainability */}
                      <g transform="translate(161, 20)">
                        <circle cx="15" cy="8" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="6" cy="22" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="24" cy="22" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <line x1="12" y1="11" x2="8" y2="19" stroke="#7f53f9" strokeWidth="1.4" />
                        <line x1="18" y1="11" x2="22" y2="19" stroke="#7f53f9" strokeWidth="1.4" />
                        <circle cx="15" cy="8" r="2" fill="#a78bfa" filter="url(#glow-purple-gov)"/>
                      </g>
                      <text x="176" y="70" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontWeight="bold" fontFamily="monospace">2. EXPLAINABILITY</text>
                      <text x="176" y="82" textAnchor="middle" fill="#a78bfa" fontSize="6.5" fontFamily="monospace">SHAP &amp; LINEAGE</text>

                      {/* Stage 3: Policy Gate */}
                      <g transform="translate(279, 20)">
                        <rect x="5" y="3" width="20" height="24" rx="4" fill="#0c101c" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glow-cyan-gov)"/>
                        <path d="M 10 13 L 20 13 M 10 18 L 17 18 M 15 8 L 20 8" stroke="#00f0ff" strokeWidth="1.4" strokeLinecap="round" />
                      </g>
                      <text x="294" y="70" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontWeight="bold" fontFamily="monospace">3. POLICY GATE</text>
                      <text x="294" y="82" textAnchor="middle" fill="#00f0ff" fontSize="6.5" fontFamily="monospace">PRE-ACTION CHECK</text>

                      {/* Stage 4: Continuous Audit */}
                      <g transform="translate(397, 20)">
                        <path d="M 5 26 A 18 18 0 0 1 41 26" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.25" strokeLinecap="round"/>
                        <path d="M 5 26 A 18 18 0 0 1 34 11" fill="none" stroke="#00c875" strokeWidth="3" strokeLinecap="round" filter="url(#glow-green-gov)"/>
                        <line x1="23" y1="26" x2="33" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="23" cy="26" r="3" fill="#00c875"/>
                      </g>
                      <text x="411" y="70" textAnchor="middle" fill="#00c875" fontSize="8" fontWeight="bold" fontFamily="monospace">4. AUDIT READY</text>
                      <text x="411" y="82" textAnchor="middle" fill="#00c875" fontSize="6.5" fontWeight="bold" fontFamily="monospace">100% COVERED</text>
                    </g>
                  </svg>
                </div>
              ) : (
                /* ── Agentic AI Flow Diagram ── */
                <div className="flex items-center justify-center w-full lg:-mt-16">
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-h-[420px]">
                    <defs>
                      <linearGradient id="agentic-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c"/>
                        <stop offset="100%" stopColor="#f59e0b"/>
                      </linearGradient>
                      <linearGradient id="agentic-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7f53f9"/>
                        <stop offset="100%" stopColor="#a78bfa"/>
                      </linearGradient>
                      <linearGradient id="agentic-green" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00c875"/>
                        <stop offset="100%" stopColor="#34d399"/>
                      </linearGradient>
                      <linearGradient id="agentic-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2564ea"/>
                        <stop offset="100%" stopColor="#00f0ff"/>
                      </linearGradient>
                      <filter id="glow-orange">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-purple">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-green">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-cyan">
                        <feGaussianBlur stdDeviation="5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <marker id="diag-arrow-purple" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#a78bfa" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#34d399" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <clipPath id="capsule-clip-agent">
                        <rect x="40" y="274" width="460" height="90" rx="30"/>
                      </clipPath>
                    </defs>

                    {/* ── LEFT: Workflow Triggers & Inputs ── */}
                    <rect x="25" y="70" width="100" height="26" rx="6" fill="#0c0e14" stroke="url(#agentic-orange)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <rect x="20" y="106" width="110" height="26" rx="6" fill="#0c0e14" stroke="url(#agentic-orange)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <rect x="25" y="142" width="100" height="26" rx="6" fill="#0c0e14" stroke="url(#agentic-orange)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    
                    {/* Inner items lines */}
                    <line x1="45" y1="83" x2="105" y2="83" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
                    <line x1="40" y1="119" x2="110" y2="119" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
                    <line x1="45" y1="155" x2="105" y2="155" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
                    
                    {/* Active inputs indicator circles */}
                    <circle cx="38" cy="83" r="2.5" fill="#ea580c"/>
                    <circle cx="34" cy="119" r="2.5" fill="#f59e0b"/>
                    <circle cx="38" cy="155" r="2.5" fill="#ea580c"/>

                    {/* Text tags inside inputs */}
                    <text x="75" y="86" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">SSE / WEBHOOKS</text>
                    <text x="75" y="122" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">REST / GQL API</text>
                    <text x="75" y="158" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">AMQP / KAFKA</text>

                    <text x="75" y="52" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.5">WORKFLOW TRIGGERS</text>
                    <text x="75" y="186" textAnchor="middle" fill="#ea580c" fillOpacity="0.8" fontSize="8" fontFamily="monospace" letterSpacing="0.5">INCOMING EVENTS</text>

                    {/* ── CENTER: Cognitive Orchestrator & Planner Loop ── */}
                    {/* Main Orb */}
                    <circle cx="270" cy="120" r="54" stroke="white" strokeWidth="1.5" strokeOpacity="0.3"/>
                    <circle cx="270" cy="120" r="48" fill="url(#agentic-purple)" fillOpacity="0.08" stroke="url(#agentic-purple)" strokeWidth="1.5" strokeOpacity="0.8"/>
                    
                    {/* Central Brain Hub */}
                    <rect x="256" y="106" width="28" height="28" rx="6" fill="#111" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <circle cx="270" cy="120" r="4" fill="#7f53f9" filter="url(#glow-purple)"/>

                    {/* Pin lines */}
                    <line x1="262" y1="102" x2="262" y2="106" stroke="white" strokeWidth="1.2"/>
                    <line x1="270" y1="102" x2="270" y2="106" stroke="white" strokeWidth="1.2"/>
                    <line x1="278" y1="102" x2="278" y2="106" stroke="white" strokeWidth="1.2"/>
                    <line x1="262" y1="134" x2="262" y2="138" stroke="white" strokeWidth="1.2"/>
                    <line x1="270" y1="134" x2="270" y2="138" stroke="white" strokeWidth="1.2"/>
                    <line x1="278" y1="134" x2="278" y2="138" stroke="white" strokeWidth="1.2"/>
                    
                    {/* Rotating Sub-Agent Satellites */}
                    {/* Satellite 1: CRM subagent */}
                    <circle cx="204" cy="120" r="12" fill="#0c0e14" stroke="url(#agentic-purple)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <text x="204" y="123" textAnchor="middle" fill="white" fontSize="7" fontWeight="black" fontFamily="monospace">RAG</text>
                    {/* Satellite 2: Document parser subagent */}
                    <circle cx="270" cy="52" r="12" fill="#0c0e14" stroke="url(#agentic-purple)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <text x="270" y="55" textAnchor="middle" fill="white" fontSize="7" fontWeight="black" fontFamily="monospace">PLAN</text>
                    {/* Satellite 3: API call executor subagent */}
                    <circle cx="336" cy="120" r="12" fill="#0c0e14" stroke="url(#agentic-purple)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <text x="336" y="123" textAnchor="middle" fill="white" fontSize="7" fontWeight="black" fontFamily="monospace">EXEC</text>

                    {/* Satellite Orbits */}
                    <path d="M 270 52 C 200 52 204 120 204 120" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>
                    <path d="M 204 120 C 204 120 208 188 270 188" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>
                    <path d="M 270 188 C 332 188 336 120 336 120" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>
                    <path d="M 336 120 C 336 120 332 52 270 52" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>

                    {/* Text labels in center */}
                    <text x="270" y="206" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.5">COGNITIVE ROUTING</text>

                    {/* ── RIGHT: Targets & Orchestrated Outcomes ── */}
                    <circle cx="450" cy="70" r="18" fill="#0c0e14" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <circle cx="410" cy="140" r="18" fill="#0c0e14" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <circle cx="490" cy="140" r="18" fill="#0c0e14" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    
                    {/* Connecting lines of target node mesh */}
                    <line x1="438" y1="83" x2="422" y2="124" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.5"/>
                    <line x1="462" y1="83" x2="478" y2="124" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.5"/>
                    <line x1="428" y1="140" x2="472" y2="140" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.5"/>

                    {/* Labels inside nodes */}
                    <text x="450" y="73" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontFamily="monospace">MUTATE</text>
                    <text x="410" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontFamily="monospace">COMMIT</text>
                    <text x="490" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="8" fontFamily="monospace">CALLBACK</text>

                    {/* Text labels on right target */}
                    <text x="474" y="44" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.5">WORKFLOW OUTCOME</text>
                    <text x="450" y="180" textAnchor="middle" fill="#00c875" fillOpacity="0.8" fontSize="8" fontFamily="monospace" letterSpacing="0.5">AUTONOMOUS SYNC</text>

                    {/* ── Connecting Pipelines ── */}
                    <path d="M 130 120 Q 170 90 190 120" fill="none" stroke="url(#agentic-orange)" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3 3"/>
                    <path d="M 350 120 Q 380 90 410 120" fill="none" stroke="url(#agentic-green)" strokeWidth="1.8" strokeOpacity="0.8" markerEnd="url(#diag-arrow-green)"/>

                    {/* Resolved Checklist speech bubble */}
                    <line x1="396" y1="118" x2="418" y2="108" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                    <rect x="418" y="52" width="112" height="80" rx="12" fill="#0b0f19" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow-green)"/>
                    <path d="M 418 96 L 402 108 L 422 106 Z" fill="#0b0f19" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.8"/>
                    
                    <text x="430" y="78" fill="#00c875" fontSize="8" fontWeight="black" fontFamily="sans-serif">✓</text>
                    <text x="444" y="78" fill="white" fillOpacity="0.8" fontSize="8.5" fontFamily="monospace">Payload parsed</text>
                    <text x="430" y="96" fill="#00c875" fontSize="8" fontWeight="black" fontFamily="sans-serif">✓</text>
                    <text x="444" y="96" fill="white" fillOpacity="0.8" fontSize="8.5" fontFamily="monospace">DAG orchestrated</text>
                    <text x="430" y="114" fill="#00c875" fontSize="8" fontWeight="black" fontFamily="sans-serif">✓</text>
                    <text x="444" y="114" fill="white" fillOpacity="0.8" fontSize="8.5" fontFamily="monospace">Tx committed</text>

                    {/* ── BOTTOM: Modernization Metrics & Status Panel ── */}
                    <rect x="40" y="274" width="460" height="90" rx="30" stroke="white" strokeWidth="1.5" strokeOpacity="0.8"/>
                    {/* Segment fills */}
                    <rect x="155" y="274" width="115" height="90" fill="#1a1a1a" fillOpacity="0.5" clipPath="url(#capsule-clip-agent)"/>
                    <rect x="385" y="274" width="115" height="90" fill="url(#agentic-green)" fillOpacity="0.1" clipPath="url(#capsule-clip-agent)"/>
                    
                    {/* Dividers */}
                    <line x1="155" y1="274" x2="155" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
                    <line x1="270" y1="274" x2="270" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>
                    <line x1="385" y1="274" x2="385" y2="364" stroke="white" strokeWidth="1" strokeOpacity="0.3"/>

                    {/* Section 1: Ingest */}
                    <g transform="translate(82, 290)">
                      <circle cx="15" cy="15" r="12" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" />
                      <circle cx="15" cy="15" r="6" fill="none" stroke="#ea580c" strokeOpacity="0.6" strokeWidth="1.2" />
                      <line x1="15" y1="0" x2="15" y2="30" stroke="white" strokeOpacity="0.3" />
                      <line x1="0" y1="15" x2="30" y2="15" stroke="white" strokeOpacity="0.3" />
                      <line x1="-5" y1="15" x2="35" y2="15" stroke="#ea580c" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow-orange)" />
                    </g>
                    <text x="97" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace">1. INGEST</text>

                    {/* Section 2: Orchestrate */}
                    <g transform="translate(192, 290)">
                      <circle cx="15" cy="8" r="4.5" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.6"/>
                      <circle cx="6" cy="20" r="4.5" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.6"/>
                      <circle cx="24" cy="20" r="4.5" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.6"/>
                      <line x1="12" y1="11" x2="8" y2="17" stroke="#7f53f9" strokeWidth="1.2" />
                      <line x1="18" y1="11" x2="22" y2="17" stroke="#7f53f9" strokeWidth="1.2" />
                      <line x1="10.5" y1="20" x2="19.5" y2="20" stroke="#7f53f9" strokeWidth="1.2" />
                      <circle cx="15" cy="8" r="2" fill="#7f53f9" filter="url(#glow-purple)"/>
                    </g>
                    <text x="212" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace">2. ORCHESTRATE</text>

                    {/* Section 3: Execute */}
                    <g transform="translate(312, 290)">
                      <rect x="5" y="4" width="20" height="22" rx="3" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow-cyan)"/>
                      <path d="M 11 12 L 19 12 M 11 17 L 17 17 M 15 8 L 19 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </g>
                    <text x="327" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="monospace">3. EXECUTE</text>

                    {/* Section 4: Sync */}
                    <g transform="translate(415, 290)">
                      <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round"/>
                      <path d="M 5 25 A 20 20 0 0 1 35 11" fill="none" stroke="#00c875" strokeWidth="3" strokeLinecap="round" filter="url(#glow-green)"/>
                      <line x1="25" y1="25" x2="35" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="25" cy="25" r="3" fill="white"/>
                    </g>
                    <text x="442" y="348" textAnchor="middle" fill="#00c875" fillOpacity="0.9" fontSize="8" fontWeight="bold" fontFamily="monospace">4. SYNC</text>
                  </svg>
                </div>
              ) ) : (
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
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
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

      {/* ══════════════════════ WHY SHIFT ══════════════════════ */}
      {service.whyShift && (
        <section className="py-24 relative" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <p className="text-[10px] font-black tracking-[0.3em] text-cyan-400/70 uppercase mb-5">{service.whyShift.label || 'Why This Approach'}</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-14">{service.whyShift.title}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {service.whyShift.items.map((item, i) => (
                <div key={i} className="flex gap-6 p-8 border border-white/[0.06] rounded-2xl bg-[#03060d] hover:border-white/[0.12] transition-colors duration-300">
                  <span className="text-5xl font-black text-white/[0.07] leading-none flex-shrink-0 select-none tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-white/55 text-base leading-relaxed font-light pt-1">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ FRAMEWORK ══════════════════════ */}
      {service.modernizationFramework && (
        <section className="py-24 relative border-t border-white/[0.04]" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <p className="text-[10px] font-black tracking-[0.3em] text-cyan-400/70 uppercase mb-5">{service.modernizationFramework.label || 'Our Framework'}</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-16">{service.modernizationFramework.title}</h2>
            <div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
              {service.modernizationFramework.steps.map((step, i) => (
                <div key={i}>
                  <div className="text-[72px] font-black text-white/[0.05] leading-none mb-3 select-none tabular-nums">{String(i + 1).padStart(2, '0')}</div>
                  <div className="w-10 h-[2px] mb-6" style={{ background: 'linear-gradient(90deg,#2564ea,#4ab6d4)' }} />
                  <p className="text-white/55 text-base leading-relaxed font-light">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
                const isVibrant = service.capabilitiesTheme === 'vibrant-bento';
                const isDarkBento7 = service.capabilitiesTheme === 'dark-bento-7';
                
                let cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                
                if (isDarkBento7 && capabilities.length === 7) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 7) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 6) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 8) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 7) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 10) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 8) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 9) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                }

                return (
                  <BentoCard
                    key={i}
                    cap={cap}
                    i={i}
                    cardClass={cardClass}
                    isVibrant={isVibrant}
                    isExpanded={isExpanded}
                    setExpandedCaps={setExpandedCaps}
                    service={service}
                  />
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
                  <div key={idx} className="px-8 first:pl-0 last:pr-0 flex flex-col gap-4 py-2 rounded-xl transition-colors duration-300 hover:bg-[#06090f]">
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
                <div key={idx} className="bg-[#000000] p-8 flex flex-col gap-4 transition-colors duration-300 hover:bg-[#060a10]">
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
      {!service.servicePackages && (
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
      )}

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
                <div key={idx} className="bg-[#000000] p-7 flex flex-col gap-4 transition-colors duration-300 hover:bg-[#060a10]">
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

      {/* ══════════════════════ TOOLS & TECHNOLOGY ══════════════════════ */}
      {service.toolsStack && (
        <AIToolsSection title={service.toolsStack.title} items={service.toolsStack.items} />
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
                <span className="bg-brand-gradient bg-clip-text text-transparent">answered (FAQ).</span>
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
