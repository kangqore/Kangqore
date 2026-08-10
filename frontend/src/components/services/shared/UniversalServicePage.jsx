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
  Plus, X, Download, ShieldCheck, Eye, Database, Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import SvcRuler from './SvcRuler';
import { CardRail } from './mobileRail';
import { article, lowerServiceName, resolveServiceFaqs, genericServicePackages, faqParagraphs } from '../../../data/serviceFaqs';
import ConciergeSection from '../../concierge/ConciergeSection';
import { AIToolsSection, AIInsightsSection } from '../cognition/AICustomSections';
import { servicesData } from '../../../data/servicesData';
import ResponsiveImage from '../../media/ResponsiveImage';
import Beams from '../../ui/Beams';
import { BackgroundBeams } from '../../ui/background-beams';
import GeminiComparisonSection from './GeminiComparisonSection';
import { BackgroundNoiseGrid } from '../../ui/BackgroundNoiseGrid';
import { AgenticModernization3DModel } from '../../ui/AgenticModernization3DModel';
import { AgenticAI3DModel } from '../../ui/AgenticAI3DModel';

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
const JOURNEY_ICON_MAP = { Search, Target, Cpu, Rocket, Shield, TrendingUp, BrainCircuit, Network, Radar, Zap, Layers, Activity, Globe, Settings, ShieldCheck, Eye, Database, Lock };
const TECH_STACK_ICON_COLORS = [
  { bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', glow: '0 8px 24px rgba(59,130,246,0.45), 0 2px 8px rgba(59,130,246,0.3)' },
  { bg: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)', glow: '0 8px 24px rgba(139,92,246,0.45), 0 2px 8px rgba(139,92,246,0.3)' },
  { bg: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)', glow: '0 8px 24px rgba(251,191,36,0.4),  0 2px 8px rgba(251,191,36,0.25)' },
  { bg: 'linear-gradient(135deg, #065f46 0%, #34d399 100%)', glow: '0 8px 24px rgba(52,211,153,0.4),  0 2px 8px rgba(52,211,153,0.25)' },
];

// Deterministic icon from slug (no Math.random → stable across renders)

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
    // The 3D tilt is driven by inline transforms, so the global
    // prefers-reduced-motion CSS cannot suppress it — it has to be gated here.
    if (typeof window !== 'undefined'
        && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
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
              // Hover lift is neutral: the blue glow (rgba(37,100,234,0.3))
              // was reading as a light source behind the card. Depth kept.
              : 'bg-[#0d0e12] border border-white/[0.08] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85),0_5px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-8px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.8)]'
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
          <ResponsiveImage
            src={bgImage}
            alt={`${cap.title} — ${cap.desc || 'Kangqore capability'}`}
            // Bento imagery is heavy and almost entirely below the fold. The
            // first card is the LCP candidate, so it loads eagerly with high
            // priority; the rest defer until near-viewport.
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            width="800"
            height="600"
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
            <p className={`svc-cap-desc absolute inset-0 leading-relaxed text-sm lg:text-[16px] ${isVibrant ? 'text-gray-800' : 'text-white/90'}`}>
              {cap.desc}
            </p>
            <ul className={`svc-cap-items absolute inset-0 space-y-2.5 ${isVibrant ? 'text-gray-800' : 'text-white/90'}`}>
              <span className={`block text-xs font-bold uppercase tracking-widest mb-2.5 ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>Key Capabilities:</span>
              {cap.items.slice(0, 6).map((item, j) => (
                <li key={j} className="flex items-start text-[14px] lg:text-sm font-medium">
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
      <div className={`absolute inset-0 z-30 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto svc-cap-no-scroll transition-all duration-500 ease-in-out border-t backdrop-blur-xl ${isVibrant ? 'bg-white/98 border-gray-200' : 'bg-[#0a0a0c]/98 border-white/10'} ${isExpanded ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`} tabIndex={isExpanded ? 0 : -1} inert={!isExpanded}>
        <div className="flex flex-col text-left">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border font-mono ${isVibrant ? 'text-gray-700 bg-gray-100/50 border-gray-300' : 'text-slate-300 bg-white/5 border-white/10'}`}>
              {cap.items.length} Sub-Capabilities
            </span>
            <span className={`text-[11px] font-black tracking-[0.3em] uppercase font-mono ${isVibrant ? 'text-blue-600' : 'text-cyan-400'}`}>{cap.n}</span>
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
          {/* py-1 + min-h take the hit box from 16px to 24px — WCAG 2.2 AA
              target size (2.5.8). The text metrics are unchanged. */}
          <a href="/contact" className={`inline-flex items-center gap-2 py-1 min-h-[24px] text-xs sm:text-sm font-bold transition-colors group/link ${isVibrant ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-cyan-400'}`}>
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

// ─── Universal Parity Data Synthesizer ─────────────────────────────────────────
// Ensures ALL 62 service pages meet the Gold Benchmark standard (/services/agentic-ai)
// by automatically providing domain-tailored fallbacks for Bento Grid, Comparison Matrix,
// Architecture Stack, Industry Use Cases Grid, Outcome Cards, Service Packages, Business Metrics,
// Custom FAQs, Journey Timeline, Hero Titles/Badges, Concierge Chips, Trust Signals, Tools Stack, and Playbook Asset.
function getParityService(service, department) {
  if (!service) return service;
  const name = service.name || 'Enterprise Service';
  const slug = service.slug || 'service';
  const deptSlug = service.departmentSlug || (department && department.slug) || 'cognition';
  const keyFeatures = service.keyFeatures || [];

  // Hero Fallbacks
  const heroTitle = service.heroTitle || (name + '\nSolutions at Enterprise Scale');
  const heroBadge = service.heroBadge || (
    deptSlug === 'foundry' ? 'Cloud-Native. Resilient. Scalable.' :
    deptSlug === 'reimagine' ? 'Transform. Modernize. Accelerate.' :
    deptSlug === 'shield' ? 'Zero-Trust. Risk-Managed. Audit-Ready.' :
    deptSlug === 'platforms' ? 'Connected Platforms. Maximum ROI.' :
    deptSlug === 'growth' ? 'Data-Driven. High-Velocity. Conversational.' :
    'Reasoning. Learning. Autonomous.'
  );
  const heroMaxWidth = service.heroMaxWidth || 'max-w-[82%]';
  const heroTitleSize = service.heroTitleSize || 'text-[1.5rem] sm:text-[1.88rem] lg:text-[2.6rem] xl:text-[3.4rem]';

  // WhatIs Fallbacks
  const whatIsTitle = service.whatIsTitle || name;
  const whatIsHighlight = service.whatIsHighlight || 'Engineered for Enterprise Scale.';
  const whatIsPara2 = service.whatIsPara2 || (
    deptSlug === 'foundry' ? `Kangqore delivers end-to-end ${lowerServiceName(name)} engineering, cloud architecture, and DevOps automation — building high-availability systems that scale effortlessly under heavy enterprise workloads.` :
    deptSlug === 'reimagine' ? `Kangqore accelerates ${lowerServiceName(name)} through proven modernization playbooks, technical debt reduction, and cloud-native re-platforming — delivering speed and agility without operational disruption.` :
    deptSlug === 'shield' ? `Kangqore embeds robust ${lowerServiceName(name)} controls, zero-trust security architecture, and regulatory compliance validation — protecting critical assets against emerging operational and cyber risks.` :
    deptSlug === 'platforms' ? `Kangqore unifies ${lowerServiceName(name)} across SaaS platforms, ERP systems, and enterprise APIs — creating seamless workflow integration and maximizing technology investment yield.` :
    deptSlug === 'growth' ? `Kangqore powers ${lowerServiceName(name)} through first-party data strategies, conversion rate engineering, and omnichannel AI marketing — driving measurable revenue and customer acquisition.` :
    `Kangqore implements ${lowerServiceName(name)} solutions that understand context, learn from operational data, and execute complex business workflows with continuous governance.`
  );
  const whatIsEyebrow = service.whatIsEyebrow || `What ${name} services does Kangqore offer?`;
  const bannerBrandDesc = service.bannerBrandDesc || (
    deptSlug === 'foundry' ? 'Our enterprise cloud & engineering platform' :
    deptSlug === 'reimagine' ? 'Our enterprise modernization playbook' :
    deptSlug === 'shield' ? 'Our trust & security governance framework' :
    deptSlug === 'platforms' ? 'Our enterprise platform integration suite' :
    deptSlug === 'growth' ? 'Our growth & conversion engineering system' :
    'Our enterprise AI & cognitive computing platform'
  );

  // Business Metrics Fallback
  const businessMetrics = (service.businessMetrics && service.businessMetrics.length > 0)
    ? service.businessMetrics
    : (
      deptSlug === 'foundry' ? [
        { title: 'Deployment Velocity', desc: `Increase in deployment velocity and release frequency across ${lowerServiceName(name)} pipelines.`, value: '10', suffix: 'x', metricLabel: 'Faster Releases', icon: 'Zap' },
        { title: 'System Availability', desc: `High-availability uptime maintained across production workloads and cloud infrastructure.`, value: '99.99', suffix: '%', metricLabel: 'Uptime SLA', icon: 'Target' },
        { title: 'Infrastructure Savings', desc: `Reduction in cloud waste and infrastructure spending through automated resource optimization.`, value: '40', suffix: '%', metricLabel: 'Cost Reduction', icon: 'TrendingUp' },
        { title: 'Defect Reduction', desc: 'Decrease in production defects after implementing automated CI/CD quality gates.', value: '85', suffix: '%', metricLabel: 'Fewer Defects', icon: 'Shield' },
      ] :
      deptSlug === 'reimagine' ? [
        { title: 'Modernization Velocity', desc: `Accelerated transformation cycle times for ${lowerServiceName(name)} applications.`, value: '3', suffix: 'x', metricLabel: 'Faster Delivery', icon: 'Zap' },
        { title: 'Technical Debt Elimination', desc: 'Systematic reduction of legacy codebase technical debt and maintenance overhead.', value: '75', suffix: '%', metricLabel: 'Debt Reduced', icon: 'TrendingUp' },
        { title: 'Latency Compression', desc: 'Improvement in system response times and transaction processing speed.', value: '60', suffix: '%', metricLabel: 'Faster Latency', icon: 'Target' },
        { title: 'Portfolio ROI', desc: 'Return on investment delivered across modernized enterprise applications.', value: '250', suffix: '%', metricLabel: 'Measurable ROI', icon: 'Shield' },
      ] :
      deptSlug === 'shield' ? [
        { title: 'Threat Detection Rate', desc: `Improvement in threat detection and security event classification for ${lowerServiceName(name)}.`, value: '99.8', suffix: '%', metricLabel: 'Detection Rate', icon: 'ShieldCheck' },
        { title: 'Incident Response Time', desc: 'Reduction in mean time to detect and remediate security incidents.', value: '70', suffix: '%', metricLabel: 'Faster Response', icon: 'Zap' },
        { title: 'Compliance Coverage', desc: 'Controls mapped and validated against ISO 27001, SOC 2, NIST, and GDPR standards.', value: '100', suffix: '%', metricLabel: 'Audit Readiness', icon: 'Target' },
        { title: 'Security Incident Reduction', desc: 'Reduction in security breaches after zero-trust control enforcement.', value: '85', suffix: '%', metricLabel: 'Fewer Incidents', icon: 'Lock' },
      ] :
      deptSlug === 'platforms' ? [
        { title: 'Process Cycle Time', desc: `Reduction in end-to-end business process execution time across ${lowerServiceName(name)}.`, value: '60', suffix: '%', metricLabel: 'Faster Cycle', icon: 'Zap' },
        { title: 'Platform Adoption', desc: 'User adoption rate achieved across integrated enterprise platform workflows.', value: '95', suffix: '%', metricLabel: 'User Adoption', icon: 'Target' },
        { title: 'Integration Errors', desc: 'Reduction in data synchronization errors between enterprise platform silos.', value: '90', suffix: '%', metricLabel: 'Error Reduction', icon: 'TrendingUp' },
        { title: 'Enterprise TCO', desc: 'Lower total cost of ownership through platform consolidation and licensing efficiency.', value: '35', suffix: '%', metricLabel: 'TCO Reduction', icon: 'Shield' },
      ] :
      deptSlug === 'growth' ? [
        { title: 'Conversion Rate Lift', desc: `Increase in user conversion rates engineered through ${lowerServiceName(name)} optimization.`, value: '45', suffix: '%', metricLabel: 'Conversion Lift', icon: 'TrendingUp' },
        { title: 'Acquisition Cost Reduction', desc: 'Decrease in customer acquisition cost (CAC) via precision targeted campaigns.', value: '35', suffix: '%', metricLabel: 'Lower CAC', icon: 'Target' },
        { title: 'Organic Traffic Surge', desc: 'Growth in high-intent organic search traffic and search engine visibility.', value: '180', suffix: '%', metricLabel: 'Traffic Growth', icon: 'Zap' },
        { title: 'Creative Productivity', desc: 'Savings in creative asset production costs using automated GenAI workflows.', value: '40', suffix: '%', metricLabel: 'Ops Savings', icon: 'Shield' },
      ] : [
        { title: 'Accuracy & Quality', desc: `Improvement in operational accuracy and solution precision for ${lowerServiceName(name)}.`, value: '94', suffix: '%', metricLabel: 'High Accuracy', icon: 'BrainCircuit' },
        { title: 'Process Automation', desc: 'End-to-end automation rate achieved across complex decision workflows.', value: '65', suffix: '%', metricLabel: 'Automated Rate', icon: 'Target' },
        { title: 'Insight Discovery', desc: 'Faster time to actionable insights derived from unstructured enterprise data.', value: '5', suffix: 'x', metricLabel: 'Faster Insights', icon: 'Zap' },
        { title: 'Production Models', desc: 'Scalable models and cognitive services operationalized across client estates.', value: '100', suffix: '+', metricLabel: 'Models Live', icon: 'Layers' },
      ]
    );

  // Capability Areas Fallback
  const capabilityAreas = (service.capabilityAreas && service.capabilityAreas.length > 0)
    ? service.capabilityAreas
    : (
      deptSlug === 'foundry' ? [
        { title: `${name} Architecture & Cloud Design`, desc: `Design resilient, high-availability cloud architectures tailored for ${lowerServiceName(name)} workloads.`, items: [`Cloud Infrastructure: Architect multi-cloud architectures across AWS, Azure, and GCP for ${lowerServiceName(name)}.`, `Scalability & Resilience: Engineer automated auto-scaling and failover capabilities for production systems.`, `Performance Engineering: Eliminate latency bottlenecks through rigorous performance tuning.`, `Infrastructure as Code: Provision repeatable environments using Terraform, Pulumi, and Ansible.`, `Container Orchestration: Deploy Kubernetes meshes for containerized microservices.`, `High Availability: Ensure 99.99% system availability with disaster recovery protocols.`] },
        { title: `DevOps & CI/CD Automation`, desc: `Streamline software delivery pipelines with automated testing, build, and deployment automation.`, items: [`Automated Build Pipelines: Build robust CI/CD pipelines using GitHub Actions, GitLab, and Jenkins.`, `Shift-Left Security: Embed SAST/DAST security scanning directly into commit pipelines.`, `Environment Provisioning: Automate ephemeral preview environments for rapid QA validation.`, `Zero-Downtime Releases: Deploy blue/green and canary release strategies with automated rollback.`, `Dependency Management: Maintain secure, automated dependency scanning and updates.`, `Pipeline Observability: Track build times, test pass rates, and release frequency.`] },
        { title: `Quality Engineering & Testing`, desc: `Ensure code quality, performance, and security through continuous automated testing.`, items: [`Test Automation: Implement unit, integration, and end-to-end automated test suites.`, `Performance & Load Testing: Simulate high-concurrency traffic using k6 and Locust.`, `Security Testing: Conduct vulnerability assessments and penetration testing on endpoints.`, `API Contract Testing: Validate API contracts across microservice boundaries.`, `Regression Guardrails: Guarantee zero functional regression during continuous deployments.`, `Quality Telemetry: Track test coverage, code quality metrics, and technical debt.`] },
        { title: `Site Reliability & Observability`, desc: `Deliver 24/7 system visibility, automated incident remediation, and SLA tracking.`, items: [`Full-Stack Observability: Monitor metrics, logs, and distributed traces using Datadog and Grafana.`, `SLO & SLA Management: Define and track service level objectives and error budgets.`, `Automated Alerting: Configure intelligent incident alerting with PagerDuty integration.`, `Chaos Engineering: Conduct resilience experiments to validate failover systems under stress.`, `Log Management: Centralize log aggregation and structured log analysis.`, `Incident Post-Mortems: Drive continuous reliability improvements through blameless post-mortems.`] },
        { title: `Embedded & Systems Engineering`, desc: `Develop robust low-level software, firmware, and edge computing solutions.`, items: [`Firmware Development: Write high-performance C/C++ firmware for microcontrollers.`, `Edge Computing: Deploy real-time edge processing for industrial and IoT hardware.`, `RTOS Integration: Engineer deterministic real-time operating system applications.`, `Hardware Interfacing: Integrate I2C, SPI, CAN bus, and Ethernet communications.`, `Power Optimization: Optimize low-power states for battery-operated hardware.`, `Hardware-in-the-Loop Testing: Validate embedded code against physical hardware simulators.`] },
        { title: `Security & Infrastructure Hardening`, desc: `Protect systems with identity management, network isolation, and zero-trust controls.`, items: [`Zero-Trust Architecture: Implement identity-based perimeter security and microsegmentation.`, `Secrets Management: Secure API keys, certificates, and database credentials with HashiCorp Vault.`, `Network Security: Configure firewalls, WAFs, DDoS protection, and VPC peering.`, `Data Encryption: Enforce AES-256 encryption for data at rest and TLS 1.3 for data in transit.`, `Access Governance: Enforce role-based access control (RBAC) and least-privilege policies.`, `Compliance Hardening: Harden infrastructure against CIS benchmarks and SOC 2 requirements.`] },
        { title: `${name} Transformation Strategy`, desc: `Establish enterprise engineering standards, architecture blueprints, and operating models.`, items: [`Engineering Strategy: Define technical vision, target architecture, and multi-year roadmaps.`, `Technology Selection: Evaluate and benchmark tools, frameworks, and cloud vendors.`, `Platform Engineering: Build internal developer platforms (IDP) to accelerate engineering teams.`, `Skill Enablement: Train engineering teams on modern cloud-native and DevOps practices.`, `Vendor Management: Manage cloud vendor commitments, licensing, and infrastructure spending.`, `Continuous Improvement: Conduct maturity assessments and benchmark against industry leaders.`] }
      ] :
      deptSlug === 'reimagine' ? [
        { title: `Legacy Codebase Assessment & Blueprint`, desc: `Analyze legacy systems, quantify technical debt, and create prioritized modernization blueprints.`, items: [`Codebase Discovery: Map legacy dependencies, architecture, and hidden business logic.`, `Technical Debt Scoring: Score technical debt to prioritize refactoring vs. re-platforming.`, `Migration Blueprint: Create dynamic modernization roadmaps mapped to business outcomes.`, `Risk Quantification: Assess operational risk, compliance vulnerabilities, and failure points.`, `Cost-Benefit Analysis: Evaluate cloud-native ROI against maintenance overhead.`, `Architecture Recommendations: Target modular microservices or serverless architectures.`] },
        { title: `Application Modernization & Refactoring`, desc: `Transform monolithic legacy applications into scalable, cloud-native microservices.`, items: [`Monolith Decomposition: Deconstruct monoliths into independently deployable microservices.`, `API-Led Architecture: Replace legacy integration with versioned REST and GraphQL APIs.`, `Code Refactoring: Modernize legacy codebases to current language standards and patterns.`, `Containerization: Package applications into Docker containers for Kubernetes deployment.`, `Cloud Re-platforming: Migrate workloads to AWS, Azure, or GCP with minimal downtime.`, `UI/UX Refreshes: Rebuild legacy frontends into modern, responsive React/Next.js interfaces.`] },
        { title: `Digital Business Transformation`, desc: `Reimagine business models and operations through digital technology and innovation.`, items: [`Business Model Innovation: Identify new digital product and monetization opportunities.`, `Process Digitization: Convert manual paper-based workflows into automated digital experiences.`, `Customer Experience Design: Create seamless omnichannel user journeys across web and mobile.`, `Operational Excellence: Streamline internal business operations through modern software.`, `Data Monetization: Transform internal data assets into external customer-facing APIs.`, `Change Management: Guide teams through digital culture and operating model shifts.`] },
        { title: `MVP Acceleration & Prototyping`, desc: `Build and validate minimum viable products in rapid 8-week engineering sprints.`, items: [`Rapid Prototyping: Turn concept ideas into interactive, high-fidelity clickable prototypes.`, `Agile Sprint Execution: Deliver functional MVP builds through focused 2-week iterations.`, `Product Validation: Test MVP features with real target users to measure market demand.`, `Architecture Foundation: Build MVPs on production-grade cloud-native foundations.`, `Go-to-Market Readiness: Prepare launch collateral, deployment pipelines, and analytics.`, `Iterative Scale: Transition validated MVPs into full enterprise platform builds.`] },
        { title: `Product Strategy & UX Architecture`, desc: `Define strategic product vision and design intuitive, high-converting digital experiences.`, items: [`User Research: Conduct deep qualitative user interviews and quantitative heuristic audits.`, `UX/UI Design Systems: Create scalable, accessible design systems with reusable components.`, `Information Architecture: Map clear user flows, site navigation, and content hierarchies.`, `Usability Testing: Validate design prototypes to eliminate user friction before engineering.`, `Product Analytics: Integrate product telemetry to track feature adoption and engagement.`, `Accessibility Compliance: Design for WCAG 2.1 AA compliance across digital interfaces.`] },
        { title: `Technology Advisory & Consulting`, desc: `Provide expert technology guidance, architecture reviews, and vendor selection.`, items: [`Technology Advisory: Provide executive advisory on tech strategy, AI, and modernization.`, `Architecture Audits: Evaluate software architecture for scalability, security, and performance.`, `Vendor & Tool Selection: Conduct RFP evaluations and unbiased tool selection benchmarks.`, `IT Governance: Establish architecture review boards and technology standards.`, `Mergers & Acquisitions Tech Due Diligence: Audit target technology stacks during M&A.`, `Cost Optimization: Rationalize software license spending and technology redundancy.`] },
        { title: `${name} Innovation & Scale`, desc: `Drive emerging technology adoption, experimental pilots, and scalable growth.`, items: [`Innovation Labs: Run rapid technology spikes to test emerging technologies.`, `Blockchain Solutions: Implement smart contracts and decentralized ledgers where appropriate.`, `Scaling Frameworks: Prepare modernized platforms to handle 10x traffic growth.`, `Continuous Modernization: Embed continuous refactoring practices into engineering backlogs.`, `Value Realization: Measure modernization outcomes against initial business cases.`, `Enterprise Alignment: Align engineering roadmaps directly with board-level business goals.`] }
      ] :
      deptSlug === 'shield' ? [
        { title: `Zero-Trust Security Architecture`, desc: `Design identity-centric, least-privilege security architectures for enterprise workloads.`, items: [`Identity-First Security: Implement zero-trust identity verification across all access points.`, `Microsegmentation: Isolate network workloads to prevent lateral movement of threats.`, `Least-Privilege Controls: Enforce strict role-based access control (RBAC) and ABAC.`, `Continuous Authentication: Validate session health and device posture continuously.`, `Secure Enclaves: Protect sensitive workloads inside isolated hardware security modules.`, `Perimeter Defense: Deploy cloud WAF, DDoS protection, and API security gateways.`] },
        { title: `Cyber Threat Detection & SOC Operations`, desc: `Monitor, detect, and remediate security threats 24/7 across multi-cloud and on-premise environments.`, items: [`24/7 SOC Monitoring: Continuous threat monitoring using advanced SIEM/SOAR platforms.`, `Threat Intelligence: Ingest global threat feeds to proactively block emerging attack vectors.`, `Automated Incident Response: Execute automated playbooks for immediate threat containment.`, `Endpoint Detection (EDR): Deploy EDR/XDR agents across all enterprise endpoints.`, `Log Analytics: Collect and analyze security logs across networks, servers, and applications.`, `Vulnerability Management: Conduct continuous vulnerability scanning and patch management.`] },
        { title: `Data Privacy & Governance`, desc: `Protect sensitive enterprise data assets and ensure global privacy compliance.`, items: [`Data Classification: Automatically discover, label, and track sensitive enterprise data.`, `Data Masking & Anonymization: Protect PII and confidential records in non-production environments.`, `Encryption Infrastructure: Enforce AES-256 encryption at rest and TLS 1.3 in transit.`, `Consent & Rights Management: Implement automated GDPR/CCPA data subject request workflows.`, `DLP Policy Enforcement: Prevent unauthorized data exfiltration with Data Loss Prevention (DLP).`, `Cryptographic Key Vaults: Secure master keys and certificates with hardware security modules.`] },
        { title: `Operational Technology (OT) & SCADA Security`, desc: `Secure industrial control systems, IoT hardware, and operational technology environments.`, items: [`IT/OT Convergence Security: Bridge IT and OT networks safely without compromising safety.`, `Industrial Anomaly Detection: Detect non-standard traffic and commands on SCADA networks.`, `Asset Discovery: Map all connected OT hardware, PLCs, and industrial sensor endpoints.`, `Protocol Inspection: Deep packet inspection for Modbus, DNP3, and PROFINET industrial protocols.`, `Air-Gapped Protections: Secure legacy OT systems with hardware diodes and strict isolation.`, `OT Incident Playbooks: Tailor incident response plans to prevent physical operational disruption.`] },
        { title: `Finance & Operational Risk Management`, desc: `Identify, quantify, and mitigate operational, financial, and strategic enterprise risks.`, items: [`Risk Assessment Frameworks: Evaluate operational risks using NIST and ISO 31000 frameworks.`, `Financial Risk Modeling: Assess credit, market, and operational financial risk exposures.`, `Audit & Controls Validation: Validate internal financial and IT controls against SOX mandates.`, `Third-Party Risk Management: Audit vendor security postures and supply chain risks.`, `Business Continuity Planning: Develop Disaster Recovery (DR) and BCP recovery playbooks.`, `Governance Reporting: Deliver executive risk scorecards and board-level risk reporting.`] },
        { title: `Quality Assurance & Security Testing`, desc: `Validate software security and compliance through rigorous penetration testing and QA.`, items: [`Penetration Testing: Conduct black-box, white-box, and gray-box security penetration tests.`, `Code Security Audits: Scan application codebases for OWASP Top 10 vulnerabilities.`, `Red Team Simulations: Simulate real-world cyber attacks to test defense posture.`, `Compliance Audits: Validate controls against ISO 27001, SOC 2, HIPAA, and PCI-DSS.`, `Automated QA Testing: Execute security and functional QA tests in CI/CD pipelines.`, `Remediation Guidance: Provide step-by-step developer remediation for security flaws.`] },
        { title: `Security Culture & Change Enablement`, desc: `Train employees and foster a security-first culture across the enterprise.`, items: [`Security Awareness Training: Conduct anti-phishing simulations and employee security training.`, `DevSecOps Enablement: Train developers on secure coding practices and threat modeling.`, `Policy & Standards Management: Draft and maintain clear enterprise security policies.`, `Executive Briefings: Provide board and C-suite briefings on cybersecurity risk posture.`, `Incident Simulation Exercises: Run tabletop crisis response exercises for leadership teams.`, `Continuous Security Posture: Track security posture scores and drive year-over-year progress.`] }
      ] :
      deptSlug === 'platforms' ? [
        { title: `Enterprise Platform Integration & iPaaS`, desc: `Connect ERP, CRM, and custom platforms with robust, scalable integration middleware.`, items: [`API Architecture: Design reusable, versioned RESTful and GraphQL API integration layers.`, `iPaaS Deployment: Implement MuleSoft, Boomi, or Workato for enterprise cloud integration.`, `Real-Time Data Sync: Maintain real-time data consistency across distributed platform silos.`, `Legacy System Connectors: Connect legacy mainframes and databases to modern cloud SaaS.`, `Event-Driven Integration: Deploy Kafka and Event Mesh for decoupled asynchronous workflows.`, `Integration Telemetry: Monitor API health, message queues, latency, and error rates.`] },
        { title: `Salesforce Solutions & Optimization`, desc: `Transform customer relationships with custom Salesforce implementation and engineering.`, items: [`Sales & Service Cloud: Implement custom workflows for sales automation and service desks.`, `Marketing Cloud Integration: Connect marketing automation with unified customer data.`, `Apex & LWC Development: Build custom Lightning Web Components and Apex logic.`, `Salesforce Integration: Connect Salesforce seamlessly with ERP, billing, and CDP platforms.`, `Data Migration & Hygiene: Cleanse and migrate legacy CRM records into Salesforce.`, `Salesforce Governance: Establish user permissions, role hierarchies, and release gates.`] },
        { title: `ServiceNow & Service Management`, desc: `Optimize IT service management, digital workflows, and operational efficiency.`, items: [`ITSM Implementation: Streamline incident, problem, change, and request management.`, `ITOM & Asset Management: Gain full visibility into IT infrastructure and configuration items (CMDB).`, `HR Service Delivery: Automate employee onboarding, HR requests, and case management.`, `Custom App Development: Build custom workflow applications on the ServiceNow platform.`, `ServiceNow Integration: Connect ServiceNow with Jira, Monitoring tools, and IAM systems.`, `Process Automation: Automate approval routing and service fulfillment workflows.`] },
        { title: `Pimcore PIM & DAM Platform`, desc: `Centralize product information, digital assets, and e-commerce master data.`, items: [`PIM Implementation: Centralize product data attributes, categories, and localized content.`, `Digital Asset Management (DAM): Store, tag, and distribute digital media assets globally.`, `Multi-Channel Publishing: Syndicated product feeds to Amazon, e-commerce, and print.`, `Data Modeling: Design complex product data structures and relationship hierarchies.`, `ERP & E-Commerce Sync: Sync Pimcore seamlessly with SAP, Salesforce Commerce, and Magento.`, `Asset Rights Management: Control permissions and usage rights for enterprise media.`] },
        { title: `Global Capability Centers (GCC)`, desc: `Establish and scale high-performing offshore global capability centers.`, items: [`GCC Setup Strategy: Plan operating models, location selection, and legal entity setup.`, `Talent Acquisition: Recruit and onboard top engineering, product, and AI talent.`, `Operational Governance: Establish delivery frameworks aligned with HQ standards.`, `Infrastructure & Security: Provision secure workspaces, VPNs, and hardware equipment.`, `Knowledge Transfer: Execute structured knowledge transfer from onshore teams.`, `Cost & Performance Tracking: Monitor GCC productivity, quality metrics, and cost savings.`] },
        { title: `Talent & Organizational Transformation`, desc: `Optimize workforce capabilities, organizational design, and HR technology.`, items: [`Org Structure Design: Design agile team topologies and functional reporting structures.`, `Workforce Upskilling: Deliver technical training on cloud, AI, and modern platforms.`, `HR Tech Implementation: Deploy Workday, SuccessFactors, or custom HR portal tools.`, `Change Management: Execute structured change enablement programs for tech rollouts.`, `Performance Management: Establish KPI scorecards and continuous feedback loops.`, `Culture & Retention: Build engineering culture initiatives to retain top tech talent.`] },
        { title: `Supply Chain & Logistics Engineering`, desc: `Optimize supply chain visibility, planning, and logistics execution platforms.`, items: [`Supply Chain Visibility: Build real-time tracking dashboards for global inventory.`, `Demand Forecasting: Use predictive analytics to optimize inventory stocking levels.`, `Logistics Integration: Connect warehouse management (WMS) and transportation (TMS) platforms.`, `Supplier Portal Engineering: Build secure portals for vendor onboarding and invoicing.`, `Track & Trace Systems: Implement RFID and IoT tracking across supply chain routes.`, `Resilience Planning: Simulate supply chain disruptions to optimize backup sourcing.`] }
      ] :
      deptSlug === 'growth' ? [
        { title: `Customer Data Strategy & CDP`, desc: `Build a unified first-party customer data foundation to combat cookie deprecation.`, items: [`First-Party Data Strategy: Design data collection frameworks across web, app, and POS.`, `CDP Implementation: Deploy Segment, Tealium, or Hightouch for unified customer profiles.`, `Identity Resolution: Merge anonymous visitor data into unified cross-channel profiles.`, `Real-Time Segmentation: Create dynamic audience segments for personalized marketing.`, `Data Privacy Compliance: Enforce consent preferences and GDPR/CCPA data governance.`, `Data Activation: Sync audience segments to ad platforms, email tools, and CRMs.`] },
        { title: `GenAI Marketing Readiness & Creative Ops`, desc: `Scale creative asset production and content personalization with Generative AI workflows.`, items: [`GenAI Creative Workflows: Deploy AI tools for rapid ad copy, banner, and video creation.`, `Brand Voice Guardrails: Fine-tune GenAI models to maintain 100% brand voice consistency.`, `Content Personalization: Generate personalized email and landing page copy at scale.`, `Creative Asset Audits: Evaluate creative performance using computer vision analytics.`, `Workflow Automation: Streamline creative approval and asset management pipelines.`, `Creative Cost Savings: Cut external agency production costs by 40% using GenAI.`] },
        { title: `Performance Marketing & PPC Engineering`, desc: `Drive high-ROI customer acquisition across Google, Meta, LinkedIn, and programmatic channels.`, items: [`PPC Campaign Architecture: Structure high-converting Google Search and Shopping campaigns.`, `Social Advertising: Engineer targeted paid social campaigns across Meta, LinkedIn, and TikTok.`, `Retargeting Systems: Build multi-touch retargeting sequences based on user intent signals.`, `Bid Automation: Deploy AI-driven bidding strategies to optimize cost-per-acquisition (CPA).`, `Creative A/B Testing: Continuously test ad creatives, headlines, and call-to-action hooks.`, `Attribution Modeling: Track multi-touch attribution to allocate marketing spend accurately.`] },
        { title: `SEO & Organic Growth Strategy`, desc: `Dominate search engine rankings through technical SEO, content clustering, and intent matching.`, items: [`Technical SEO Audits: Optimize Core Web Vitals, site crawlability, and schema markup.`, `Content Cluster Architecture: Build topical authority through structured hub-and-spoke content.`, `Search Intent Matching: Align content with high-value transactional and commercial queries.`, `Off-Page Digital PR: Build high-authority backlink footprints through strategic PR campaigns.`, `Programmatic SEO: Generate thousands of high-quality landing pages for long-tail search.`, `Organic Analytics: Track keyword rankings, organic traffic, and conversion attribution.`] },
        { title: `Conversion Rate Optimization (CRO)`, desc: `Maximize conversion yield from existing website traffic using data-driven experimentation.`, items: [`Heuristic & UX Audits: Identify conversion friction points across checkout and signup flows.`, `Behavior Analytics: Analyze heatmaps, session recordings, and drop-off funnels in Hotjar.`, `A/B & Multivariate Testing: Run statistically rigorous tests in Optimizely or VWO.`, `Copywriting Optimization: Craft persuasive value propositions and friction-free microcopy.`, `Landing Page Engineering: Build ultra-fast, high-converting custom landing pages.`, `CRO ROI Tracking: Measure incremental revenue generated per optimization experiment.`] },
        { title: `Growth Funnel & Revenue Engineering`, desc: `Design and optimize end-to-end user journeys from initial impression to customer expansion.`, items: [`Funnel Architecture: Map complete customer acquisition, activation, and retention loops.`, `Lead Scoring & Nurturing: Build automated email nurture sequences based on user behavior.`, `Retention Engineering: Implement product-led growth (PLG) tactics to reduce customer churn.`, `Virality & Referral Loops: Engineer referral mechanics that turn users into brand advocates.`, `Pricing & Packaging Optimization: Experiment with pricing tiers to maximize Average Revenue Per User.`, `Revenue Analytics: Track CAC, LTV, payback period, and funnel drop-off metrics in real time.`] },
        { title: `Omnichannel Campaign Execution`, desc: `Plan and execute integrated marketing campaigns across digital and traditional channels.`, items: [`Campaign Strategy: Define campaign themes, target buyer personas, and messaging matrix.`, `Media Planning: Allocate media budgets strategically across channels for maximum impact.`, `Influencer & PR Integration: Coordinate digital PR and influencer amplification campaigns.`, `Event & Launch Marketing: Drive registration and engagement for virtual and live events.`, `Campaign Analytics: Deliver unified real-time reporting dashboards for executive leadership.`, `Continuous Optimization: Adjust campaign spend and messaging mid-flight based on performance.`] }
      ] : [
        { title: `Managing ${name} Solution Quality`, desc: `Ensure ${lowerServiceName(name)} solutions operate with consistent accuracy, reliability, and enterprise performance.`, items: [`Data & Pipeline Engineering: Design robust validation pipelines for ${lowerServiceName(name)}.`, `Quality Assurance & Testing: Establish frameworks to evaluate accuracy and production readiness.`, `Risk & Anomaly Detection: Identify and mitigate anomalies and unmanaged risks early.`, `Continuous Telemetry: Monitor operational telemetry and maintain optimal system effectiveness.`, `Evaluation & Benchmarking: Measure systems against predefined quality metrics and benchmarks.`, `Resilience & Reliability: Improve fault tolerance and system recovery capabilities.`] },
        { title: `Establishing Ethical Governance & Control`, desc: `Develop governance frameworks that ensure ${lowerServiceName(name)} operates responsibly and transparently.`, items: [`Responsible Frameworks: Define governance principles guiding design, deployment, and operations.`, `Fairness & Transparency: Implement controls that promote explainability and equitable outcomes.`, `Explainable Architecture: Enable stakeholders to understand decision pathways and reasoning.`, `Accountability & Oversight: Establish structures defining ownership and approval workflows.`, `Human-in-the-Loop Oversight: Integrate human review mechanisms for high-impact decisions.`, `Governance Controls: Apply tailored controls for core enterprise systems.`] },
        { title: `Enterprise ${name} Lifecycle Governance`, desc: `Establish enterprise-wide governance for managing ${lowerServiceName(name)} across development and maintenance.`, items: [`Lifecycle Management: Govern solutions through development, deployment, and maintenance.`, `Version Control & Lineage: Maintain complete version history and operational reproducibility.`, `Deployment Release Gates: Implement controlled release management and gated approvals.`, `Performance Validation: Continuously validate reliability and business effectiveness.`, `Change Management: Manage updates and retraining cycles with minimal disruption.`, `Centralized Asset Registry: Maintain a single repository of metadata and documentation.`] },
        { title: `Compliance & Risk Management`, desc: `Ensure ${lowerServiceName(name)} complies with global regulations and risk requirements.`, items: [`Regulatory Alignment: Align solutions with international regulations and governance rules.`, `Data Privacy & Protection: Implement controls for anonymization and secure handling.`, `Audit & Policy Enforcement: Maintain audit trails and policy enforcement evidence.`, `Enterprise Risk Mitigation: Identify, assess, prioritize, and mitigate business risks.`, `Security & Access Governance: Protect assets through identity management and RBAC.`, `Compliance Monitoring: Continuously track compliance posture and generate reports.`] },
        { title: `Security, Trust & Infrastructure`, desc: `Protect ${lowerServiceName(name)} systems and enterprise data against security risks.`, items: [`Security Architecture: Design secure infrastructures with zero-trust security principles.`, `Threat & Injection Defense: Protect systems against data leakage and vulnerabilities.`, `Identity & Access Management: Enforce role-based access and least-privilege controls.`, `Threat Detection Telemetry: Continuously detect malicious behavior across environments.`, `Secrets Management: Secure API keys, tokens, and confidential enterprise assets.`, `Infrastructure Hardening: Implement encryption and secure deployment pipelines.`] },
        { title: `Observability & Operations`, desc: `Provide continuous visibility into health, performance, cost, and reliability.`, items: [`Full Telemetry Observability: Monitor behavior, latency, throughput, and system health.`, `Operational Monitoring: Track service availability, response times, and resource usage.`, `Cost Optimization: Analyze infrastructure spending and resource efficiency.`, `Incident Management: Detect, investigate, and recover from failures rapidly.`, `Capacity Management: Plan and optimize infrastructure capacity for enterprise workloads.`, `Operational Analytics: Deliver executive dashboards and SLA reporting.`] },
        { title: `${name} Strategy & Transformation`, desc: `Establish operating models, frameworks, and strategic transformation roadmaps.`, items: [`Transformation Strategy: Define vision, principles, and strategic roadmaps.`, `Operating Model Design: Design governance structures, roles, and decision authorities.`, `Maturity Assessment: Evaluate capabilities, identify gaps, and build roadmaps.`, `Policy Management: Develop enterprise policies and governance standards.`, `Portfolio Governance: Prioritize and oversee enterprise initiatives and value realization.`, `Adoption & Change Management: Drive organizational readiness and change management.`] }
      ]
    );

  // Comparison Table Fallback
  const comparisonTable = service.comparisonTable || (
    deptSlug === 'foundry' ? {
      colA: `Legacy Fragile Infrastructure`,
      colB: `Modern Cloud-Native Foundry (Engineering Foundry™)`,
      heading: `Legacy Infrastructure vs. Modern Cloud-Native Foundry`,
      rows: [
        { dimension: 'Deployment Velocity', before: 'Manual release cycles taking weeks with frequent rollback risks.', after: 'Automated CI/CD pipelines deploying multiple times daily with zero downtime.' },
        { dimension: 'System Uptime', before: 'Single points of failure causing unexpected outages and revenue loss.', after: 'High-availability Kubernetes mesh with 99.99% multi-region uptime SLA.' },
        { dimension: 'Infrastructure Spending', before: 'Unmonitored server sprawl and high static cloud licensing costs.', after: 'FinOps resource optimization delivering 40% reduction in cloud waste.' },
        { dimension: 'Security & Compliance', before: 'Perimeter-only security with unpatched vulnerabilities across servers.', after: 'Shift-left DevSecOps with automated SAST/DAST scanning and CIS hardening.' },
        { dimension: 'Scalability', before: 'Manual server provisioning requiring weeks of lead time for traffic spikes.', after: 'Elastic auto-scaling responding instantly to real-time traffic surges.' }
      ]
    } :
    deptSlug === 'reimagine' ? {
      colA: `Legacy Monolith & Tech Debt`,
      colB: `Modernized Agile Enterprise (eQORE™ Playbook)`,
      heading: `Legacy Monolith vs. Modernized Agile Enterprise`,
      rows: [
        { dimension: 'System Architecture', before: 'Tightly coupled legacy monolith impossible to update without system risk.', after: 'Decoupled cloud-native microservices with versioned REST/GraphQL APIs.' },
        { dimension: 'Modernization Speed', before: 'Multi-year manual rewriting programs that stall and exceed budgets.', after: 'Accelerated modernization sprints powered by automated discovery tools.' },
        { dimension: 'Technical Debt', before: 'Accumulating tech debt consuming 80% of engineering maintenance budget.', after: 'Systematic debt reduction freeing 75% of bandwidth for new feature innovation.' },
        { dimension: 'Customer Experience', before: 'Outdated legacy UI/UX with high user drop-off and support tickets.', after: 'Modern, responsive, accessible React/Next.js frontends built for engagement.' },
        { dimension: 'Business Agility', before: 'Months required to launch new digital features or product capabilities.', after: 'Deploy new digital capabilities in weeks with validated market feedback.' }
      ]
    } :
    deptSlug === 'shield' ? {
      colA: `Unmonitored / Reactive Security`,
      colB: `Governed Zero-Trust Security (Shield™)`,
      heading: `Reactive Security vs. Governed Zero-Trust Security`,
      rows: [
        { dimension: 'Perimeter Defense', before: 'Implicit trust within internal network leaving lateral movement unblocked.', after: 'Zero-Trust architecture with continuous identity and posture verification.' },
        { dimension: 'Threat Detection', before: 'Reactive incident response after breaches have already compromised data.', after: '24/7 SOC telemetry detecting and isolating threats within seconds.' },
        { dimension: 'Audit Readiness', before: 'Panic before regulatory audits with incomplete manual log spreadsheets.', after: '100% continuous audit readiness with immutable cryptographic ledgers.' },
        { dimension: 'Data Protection', before: 'Unencrypted sensitive records vulnerable to exfiltration and leaks.', after: 'AES-256 encryption at rest, TLS 1.3 in transit, and automated PII masking.' },
        { dimension: 'Risk Visibility', before: 'Siloed risk assessments that sit in unread PDF reports.', after: 'Real-time executive risk dashboards mapping vulnerabilities enterprise-wide.' }
      ]
    } :
    deptSlug === 'platforms' ? {
      colA: `Disconnected Platform Silos`,
      colB: `Unified Enterprise Platform (ALIS™)`,
      heading: `Disconnected Silos vs. Unified Enterprise Platform`,
      rows: [
        { dimension: 'Data Synchronization', before: 'Batch overnight file transfers creating stale data across ERP and CRM.', after: 'Real-time event-driven integration keeping data synchronized instantly.' },
        { dimension: 'Workflow Efficiency', before: 'Manual double-data entry across Salesforce, ServiceNow, and SAP.', after: 'End-to-end automated workflows bridging platforms without human touch.' },
        { dimension: 'Platform Adoption', before: 'Low user adoption due to complex, unoptimized SaaS configurations.', after: '95% adoption rates achieved through intuitive, customized user flows.' },
        { dimension: 'Integration Costs', before: 'Expensive point-to-point custom code brittle to platform version updates.', after: 'Standardized iPaaS connectors with automated contract validation.' },
        { dimension: 'Total Cost of Ownership', before: 'Redundant software licenses and unmanaged SaaS app proliferation.', after: 'Consolidated platform architecture yielding 35% reduction in TCO.' }
      ]
    } :
    deptSlug === 'growth' ? {
      colA: `Ad Waste & Fragmented Marketing`,
      colB: `Precision Growth Engineering (KVIS™)`,
      heading: `Fragmented Marketing vs. Precision Growth Engineering`,
      rows: [
        { dimension: 'Customer Data', before: 'Third-party cookie reliance vulnerable to browser privacy changes.', after: 'Unified first-party CDP profiles driving real-time cross-channel targeting.' },
        { dimension: 'Acquisition Cost (CAC)', before: 'Rising ad costs and wasted ad spend on unqualified audience clicks.', after: '35% reduction in CAC through AI-optimized bidding and audience intent.' },
        { dimension: 'Conversion Yield', before: 'Static landing pages with unmeasured drop-off and low conversion rates.', after: 'Data-driven CRO experiments generating +45% lift in conversion rates.' },
        { dimension: 'Creative Production', before: 'Slow agency creative cycles bottlenecking campaign launch frequency.', after: 'GenAI creative operations delivering 10x asset volume at 40% lower cost.' },
        { dimension: 'Attribution', before: 'Last-click attribution misallocating budget to unproductive ad networks.', after: 'Multi-touch attribution models giving 100% clarity on true revenue ROI.' }
      ]
    } : {
      colA: `Legacy / Unmonitored ${name}`,
      colB: `Governed Enterprise ${name} (eQORE™)`,
      heading: `Legacy ${name} vs. Governed Enterprise ${name}`,
      rows: [
        { dimension: 'Autonomy & Control', before: `Unmonitored ${lowerServiceName(name)} processes with manual intervention and high error rates.`, after: `Governed execution — pre-action approval gates, policy controls, and automated kill-switches.` },
        { dimension: 'Workflow Velocity', before: `Fragmented scripts and legacy silos with manual handoffs and no audit trails.`, after: `Continuous audit logging — automated policy enforcement and end-to-end execution.` },
        { dimension: 'System Reliability', before: `Silent system drift and unmonitored performance decay degrading quality over time.`, after: `Real-time drift detection — automated alerts trigger human-in-the-loop review before impact.` },
        { dimension: 'Data Integration', before: `Disconnected data stores creating data leakage and compliance vulnerabilities.`, after: `Centralized platform registry — enterprise-wide visibility, risk classification, and RBAC controls.` },
        { dimension: 'Enterprise Outcomes', before: `Unpredictable cycle times, compliance risks, and high operational overhead.`, after: `Audit-ready business outcomes — scale rapidly with verified explainability and trust.` }
      ]
    }
  );

  // Architecture Nodes Fallback
  const architectureNodes = (service.architectureNodes && service.architectureNodes.length > 0)
    ? service.architectureNodes
    : (
      deptSlug === 'foundry' ? [
        { title: 'Edge & Multi-Cloud Ingestion', icon: 'Cloud', description: 'Multi-region ingress gateways, load balancers, and CDN networks accepting global enterprise traffic.', features: ['Multi-Cloud Ingress', 'Global CDN Acceleration', 'DDoS Protection'] },
        { title: 'Container & Service Mesh', icon: 'Cpu', description: 'Kubernetes orchestration mesh managing containerized microservices, service discovery, and traffic routing.', features: ['Kubernetes Mesh', 'Auto-Scaling Pods', 'Service Discovery'] },
        { title: 'CI/CD & Delivery Engine', icon: 'Zap', description: 'Automated release pipelines executing SAST/DAST testing, container builds, and zero-downtime cutovers.', features: ['Automated Testing', 'GitOps Pipelines', 'Canary Releases'] },
        { title: 'Observability & SRE Guard', icon: 'Activity', description: 'Unified monitoring stack collecting distributed traces, metrics, and logs with automated alerting.', features: ['Datadog/Grafana Telemetry', 'Automated Alerting', 'SLA Tracking'] }
      ] :
      deptSlug === 'reimagine' ? [
        { title: 'Legacy Assessment & Ingestion', icon: 'Search', description: 'Automated code scanners map legacy dependencies, quantify technical debt, and extract business logic.', features: ['AST Code Scanners', 'Dependency Mapping', 'Debt Scoring'] },
        { title: 'Microservices & API Gateway', icon: 'Layers', description: 'Decoupled cloud-native microservices exposed through versioned, documented REST/GraphQL APIs.', features: ['Microservices Mesh', 'API Management', 'Contract Validation'] },
        { title: 'Cloud-Native Application Core', icon: 'Cpu', description: 'Scalable containerized application engine running on modern Kubernetes and serverless backends.', features: ['Container Runtime', 'Serverless Functions', 'Event-Driven Workflows'] },
        { title: 'Continuous Refactoring & Telemetry', icon: 'Activity', description: 'Continuous quality monitoring ensuring modernized applications maintain high performance and zero debt.', features: ['Quality Telemetry', 'Performance Auditing', 'Regression Testing'] }
      ] :
      deptSlug === 'shield' ? [
        { title: 'Perimeter & Identity Defense', icon: 'Lock', description: 'Identity-first zero-trust gateway enforcing multi-factor authentication, RBAC, and device health checks.', features: ['Zero-Trust Gateway', 'Identity Verification', 'WAF Protection'] },
        { title: 'Threat Intelligence & SOC Engine', icon: 'ShieldCheck', description: '24/7 SIEM/SOAR threat monitoring ingesting global threat feeds to detect and isolate intrusions.', features: ['24/7 SIEM Monitoring', 'Threat Feeds', 'SOAR Playbooks'] },
        { title: 'Data Privacy & Cryptographic Core', icon: 'Key', description: 'AES-256 encryption engine, hardware key vaults, and automated PII masking protecting data assets.', features: ['AES-256 Encryption', 'HSM Key Vaults', 'PII Masking'] },
        { title: 'Audit Ledger & Incident Mesh', icon: 'Activity', description: 'Immutable audit log ledger documenting all access events and executing rapid incident containment.', features: ['Immutable Audit Logs', 'Automated Containment', 'SOC Scorecards'] }
      ] :
      deptSlug === 'platforms' ? [
        { title: 'Enterprise Connector Layer', icon: 'Layers', description: 'Standardized iPaaS connectors interfacing with Salesforce, ServiceNow, SAP, and legacy ERP databases.', features: ['iPaaS Connectors', 'Legacy DB Bridges', 'API Gateways'] },
        { title: 'Orchestration & Workflow Engine', icon: 'Workflow', description: 'Centralized process engine managing cross-platform workflows, approval routing, and event queues.', features: ['Workflow Engine', 'Event Bus', 'Approval Gates'] },
        { title: 'Platform Data Mesh & MDM', icon: 'Database', description: 'Master Data Management (MDM) core keeping product, customer, and asset records synchronized.', features: ['MDM Synchronization', 'Data Cleansing', 'Schema Mapping'] },
        { title: 'Governance & Portal Core', icon: 'Shield', description: 'Unified administrative portal enforcing platform security, user permissions, and compliance auditing.', features: ['RBAC Governance', 'Platform Telemetry', 'Audit Logging'] }
      ] :
      deptSlug === 'growth' ? [
        { title: 'Customer Data Platform (CDP)', icon: 'Database', description: 'First-party customer data hub unifying web, mobile, and offline signals into 360-degree buyer profiles.', features: ['Unified Profiles', 'First-Party Tracking', 'Consent Governance'] },
        { title: 'Audience & AI Segmentation Engine', icon: 'BrainCircuit', description: 'Predictive AI engine scoring buyer intent and generating dynamic real-time target segments.', features: ['Intent Scoring', 'Dynamic Segments', 'Predictive LTV'] },
        { title: 'Omnichannel Campaign Execution Mesh', icon: 'Zap', description: 'Automated execution engine pushing personalized messaging across Search, Paid Social, Email, and Web.', features: ['Cross-Channel Push', 'GenAI Ad Workflows', 'Bid Optimization'] },
        { title: 'Attribution & CRO Analytics Dashboard', icon: 'Activity', description: 'Real-time revenue dashboard delivering multi-touch attribution metrics and experiment test results.', features: ['Multi-Touch Attribution', 'A/B Test Analytics', 'ROI Scorecards'] }
      ] : [
        { title: 'Policy & Ethics Layer', icon: 'ShieldCheck', description: `Define enterprise ${lowerServiceName(name)} principles, ethical guardrails, and automated risk classification across all systems.`, features: ['Risk Tiering', 'Ethical Guardrails', 'Usage Policies', 'Regulatory Alignment'] },
        { title: 'Control & Orchestration Engine', icon: 'BrainCircuit', description: `Centralized system registries, automated release gates, behavioral boundaries, and lifecycle documentation.`, features: ['Central Registries', 'Release Gates', 'Behavior Limits', 'Version Control'] },
        { title: 'Data & Privacy Core', icon: 'Lock', description: `Strict oversight over enterprise data ingestion, masking, privacy protection, and lineage tracking.`, features: ['Data Masking', 'Consent Management', 'Lineage Tracking', 'PII Protection'] },
        { title: 'Execution Oversight & Telemetry', icon: 'Activity', description: `Real-time human-in-the-loop checkpoints, anomaly detection alerts, and emergency kill-switches.`, features: ['HITL Workflows', 'Immutable Audit Logs', 'Anomaly Alerts', 'Emergency Kill-Switches'] }
      ]
    );

  // Industry Use Cases Fallback
  const industryUseCases = (service.industryUseCases && service.industryUseCases.length > 0)
    ? service.industryUseCases
    : (
      deptSlug === 'foundry' ? [
        { industry: 'Banking & Financial Services', headline: `High-frequency trading and core banking infrastructure engineered for 99.999% uptime.`, agents: [`${name} Cloud Specialist`, 'DevSecOps Compliance Guard', 'SRE Incident Remediation Agent'] },
        { industry: 'Healthcare & Life Sciences', headline: `HIPAA-compliant cloud architecture and medical device firmware engineering.`, agents: ['HIPAA Infrastructure Auditor', 'Medical Firmware Specialist', 'Kubernetes Compliance Guard'] },
        { industry: 'Manufacturing & Industrial', headline: `Edge computing and IoT sensor infrastructure for smart factories.`, agents: ['Industrial IoT Specialist', 'Edge Computing Architect', 'SCADA Network Engineer'] },
        { industry: 'Retail & E-Commerce', headline: `High-scalability infrastructure handling Black Friday traffic spikes without latency.`, agents: ['Auto-Scaling Architect', 'Global CDN Specialist', 'Performance Tuning Agent'] },
        { industry: 'Media & Telecommunications', headline: `Low-latency video streaming pipelines and high-throughput network architectures.`, agents: ['Streaming Infrastructure Engineer', 'Network Security Specialist', 'Multi-Cloud Architect'] },
        { industry: 'Energy & Utilities', headline: `Resilient grid monitoring software and mission-critical embedded systems.`, agents: ['Grid Infrastructure Specialist', 'Embedded Systems Engineer', 'Disaster Recovery Architect'] }
      ] :
      deptSlug === 'reimagine' ? [
        { industry: 'Banking & Financial Services', headline: `Core banking monolith decomposition and cloud-native API transformation.`, agents: [`${name} Modernization Architect`, 'Core Banking Refactoring Agent', 'API Layer Specialist'] },
        { industry: 'Healthcare & Life Sciences', headline: `Legacy EHR modernization and interoperable FHIR API integration.`, agents: ['EHR Modernization Specialist', 'FHIR Integration Engineer', 'Clinical UX Designer'] },
        { industry: 'Manufacturing & Supply Chain', headline: `Mainframe ERP modernization and cloud-native logistics re-platforming.`, agents: ['ERP Refactoring Specialist', 'Cloud Re-platforming Agent', 'Supply Chain Tech Advisor'] },
        { industry: 'Retail & Consumer Goods', headline: `E-commerce legacy backend transformation into headless microservices.`, agents: ['Headless Commerce Specialist', 'Microservices Architect', 'UX Conversion Designer'] },
        { industry: 'Insurance', headline: `Policy administration system refactoring and automated digital claims portals.`, agents: ['Policy System Specialist', 'Legacy Code Parser Agent', 'Digital Portal Architect'] },
        { industry: 'Public Sector', headline: `Government legacy software modernization with SOC 2 / FedRAMP compliance.`, agents: ['GovTech Modernization Specialist', 'Security Compliance Auditor', 'Cloud Migration Lead'] }
      ] :
      deptSlug === 'shield' ? [
        { industry: 'Banking & Financial Services', headline: `Zero-trust cyber defense and SOX/FCA compliance validation.`, agents: [`${name} Security Auditor`, 'SOC Incident Analyst', 'SOX Compliance Guard'] },
        { industry: 'Healthcare & Life Sciences', headline: `Patient data privacy protection and HIPAA zero-trust infrastructure.`, agents: ['HIPAA Privacy Shield Agent', 'Clinical Data Protection Specialist', 'EHR Security Auditor'] },
        { industry: 'Manufacturing & Defense', headline: `Industrial OT/SCADA cybersecurity and air-gapped network defense.`, agents: ['Industrial OT Security Agent', 'SCADA Firewall Engineer', 'Defense Compliance Lead'] },
        { industry: 'Retail & E-Commerce', headline: `PCI-DSS payment security and customer PII data leak prevention.`, agents: ['PCI-DSS Compliance Auditor', 'Data Loss Prevention Agent', 'Fraud Defense Specialist'] },
        { industry: 'Technology & SaaS', headline: `ISO 27001 and SOC 2 Type II audit readiness and penetration testing.`, agents: ['SOC 2 Audit Specialist', 'Penetration Testing Engineer', 'API Security Auditor'] },
        { industry: 'Energy & Critical Infrastructure', headline: `NERC CIP compliance and nation-state threat intelligence protection.`, agents: ['Critical Infrastructure Agent', 'Threat Intelligence Lead', 'Grid Cyber Security Guard'] }
      ] :
      deptSlug === 'platforms' ? [
        { industry: 'Banking & Financial Services', headline: `ServiceNow ITSM and Salesforce Financial Services Cloud integration.`, agents: [`${name} Platform Architect`, 'Financial Cloud Specialist', 'ServiceNow ITSM Lead'] },
        { industry: 'Healthcare & Life Sciences', headline: `Unified provider management and Veeva/Salesforce Health Cloud deployment.`, agents: ['Health Cloud Specialist', 'Provider Integration Lead', 'ServiceNow Workflow Engineer'] },
        { industry: 'Manufacturing & Automotive', headline: `Pimcore PIM product data syndication across global dealer networks.`, agents: ['PIM Data Architect', 'Supply Chain Platform Lead', 'SAP Integration Specialist'] },
        { industry: 'Retail & Consumer Goods', headline: `Omnichannel CRM integration connecting Salesforce Commerce with ERP backends.`, agents: ['Salesforce Commerce Specialist', 'Omnichannel CRM Lead', 'ERP Integration Agent'] },
        { industry: 'Global Technology Enterprises', headline: `Global Capability Center (GCC) setup and offshore engineering team scaling.`, agents: ['GCC Setup Strategist', 'Offshore Delivery Lead', 'Talent Ops Specialist'] },
        { industry: 'Professional Services', headline: `Unified Services Management (USM) streamlining PSA, CRM, and billing.`, agents: ['USM Platform Lead', 'PSA Integration Specialist', 'Workflow Automation Agent'] }
      ] :
      deptSlug === 'growth' ? [
        { industry: 'Banking & Financial Services', headline: `First-party CDP customer acquisition and compliant fintech growth funnels.`, agents: [`${name} Growth Engineer`, 'Fintech CDP Specialist', 'Compliance Marketing Lead'] },
        { industry: 'Healthcare & Wellness', headline: `Patient acquisition funnels and HIPAA-compliant digital marketing analytics.`, agents: ['Patient Growth Architect', 'HIPAA Analytics Specialist', 'CRO Experimentation Lead'] },
        { industry: 'E-Commerce & D2C Retail', headline: `GenAI creative operations and multi-touch PPC ad spend optimization.`, agents: ['D2C Growth Engineer', 'GenAI Creative Lead', 'PPC Bidding Specialist'] },
        { industry: 'B2B Software & SaaS', headline: `Product-led growth (PLG) funnels and technical SEO content clustering.`, agents: ['SaaS PLG Specialist', 'Technical SEO Architect', 'B2B Funnel Engineer'] },
        { industry: 'Real Estate & Property', headline: `Omnichannel lead generation and automated CRM lead scoring sequences.`, agents: ['Lead Generation Lead', 'CRM Nurturing Specialist', 'Paid Social Architect'] },
        { industry: 'Higher Education & EdTech', headline: `Student enrollment growth funnels and personalized conversion landing pages.`, agents: ['Enrollment Growth Specialist', 'Landing Page Engineer', 'Conversion Analytics Lead'] }
      ] : [
        { industry: 'Banking & Financial Services', headline: `Model risk management (MRM) and ${lowerServiceName(name)} explainability.`, agents: [`${name} Risk Auditor Agent`, 'Regulatory Compliance Agent', 'Decision Explainability Agent'] },
        { industry: 'Healthcare & Life Sciences', headline: `Clinical ${lowerServiceName(name)} validation and patient data privacy.`, agents: ['Clinical Validation Agent', 'HIPAA Privacy Shield Agent', 'EHR Consent Agent'] },
        { industry: 'Manufacturing & Industry', headline: `Industrial ${lowerServiceName(name)} safety and automated QA compliance.`, agents: ['Industrial Safety Auditor', 'QA Compliance Agent', 'Predictive Maintenance Auditor'] },
        { industry: 'Retail & Consumer Goods', headline: `Fairness and consumer data privacy controls for ${lowerServiceName(name)}.`, agents: ['Pricing Fairness Agent', 'Bias Detection Agent', 'Consumer Privacy Agent'] },
        { industry: 'IT & Infrastructure', headline: `Policy enforcement and multi-tenant security for ${lowerServiceName(name)}.`, agents: ['Policy Enforcement Agent', 'Multi-Tenant Security Agent', 'API Governance Agent'] },
        { industry: 'EdTech & Higher Ed', headline: `Student data privacy and ${lowerServiceName(name)} evaluation fairness.`, agents: ['Student Privacy Agent', 'Evaluation Fairness Agent', 'Administrative Audit Agent'] }
      ]
    );

  // Service Packages Fallback
  const servicePackages = (service.servicePackages && service.servicePackages.length > 0)
    ? service.servicePackages
    : genericServicePackages(service);

  // Outcome Cards Fallback
  const outcomeCard = service.outcomeCard || {
    illustrative: true,
    metric: deptSlug === 'foundry' ? '99.99%' : deptSlug === 'reimagine' ? '65%' : deptSlug === 'shield' ? '99.8%' : deptSlug === 'platforms' ? '60%' : deptSlug === 'growth' ? '+45%' : '65%',
    metricLabel: `Improvement in ${lowerServiceName(name)} operational performance`,
    industry: 'Global Enterprise Organization',
    problem: `Legacy bottlenecks and fragmented tools severely impacted execution speed and created operational risks for ${lowerServiceName(name)}.`,
    outcome: `Kangqore engineered an integrated ${lowerServiceName(name)} solution with automated pipelines — delivering measurable performance lift and 100% operational reliability.`
  };
  const outcomeCard2 = service.outcomeCard2 || {
    illustrative: true,
    metric: deptSlug === 'foundry' ? '10x' : deptSlug === 'reimagine' ? '3x' : deptSlug === 'shield' ? '100%' : deptSlug === 'platforms' ? '95%' : deptSlug === 'growth' ? '-35%' : '99.9%',
    metricLabel: `Efficiency gain in ${lowerServiceName(name)} workflows`,
    industry: 'Financial & Enterprise Services',
    problem: `Manual overhead and unmonitored system changes created continuous delay and compliance exposure.`,
    outcome: `Kangqore deployed automated governance, real-time telemetry, and streamlined workflows — achieving maximum operational yield.`
  };
  // No generated fallback for a third outcome card. The previous default keyed
  // its metric off deptSlug and fell through to '0%' for cognition (and a bare
  // '0' for shield), so twelve Cognition services publicly displayed
  // "0% — Cost reduction and ROI impact" directly beneath two positive results,
  // reading as a declining sequence. It also invented a client descriptor
  // ("High-Tech & Industrial Group") for an engagement that does not exist.
  // A third card now renders only when a service supplies real data for it.
  const outcomeCard3 = service.outcomeCard3 || null;

  // Custom FAQs Fallback. Resolved through data/serviceFaqs.js so the accordion,
  // the runtime JSON-LD graph and the bot snapshot all show the same list —
  // Google requires FAQ markup to match what is visible on the page.
  const customFAQs = resolveServiceFaqs(service);

  // Custom Journey Fallback
  const customJourney = (service.customJourney && service.customJourney.length > 0)
    ? service.customJourney
    : [
        { phase: 'DISCOVER', icon: 'Search', title: `${name} Discovery`, desc: `Assess current landscape, map architecture dependencies, identify high-impact targets, and establish baseline performance KPIs.` },
        { phase: 'ARCHITECT', icon: 'Target', title: 'Target Architecture', desc: `Design resilient solution blueprints, API integration layers, security controls, and governance frameworks mapped to business goals.`, kangqore: true },
        { phase: 'ENGINEER', icon: 'Cpu', title: 'Build & Deploy', desc: `Develop, automate, and validate production pipelines — executing continuous integration, testing, and deployment at enterprise scale.`, kangqore: true },
        { phase: 'GOVERN', icon: 'Shield', title: 'Govern & Monitor', desc: `Activate real-time telemetry, automated release gates, compliance tracking, and human-in-the-loop operational oversight.`, kangqore: true },
        { phase: 'SCALE', icon: 'TrendingUp', title: 'Scale & Compound', desc: `Expand capabilities enterprise-wide, continuously optimize performance and costs, and drive long-term business value realization.`, kangqore: true }
      ];

  // Feature Micros Fallback
  // No fallback. The previous one was four fixed strings in a fixed order, so
  // "Continuous training" was explained as "seamless integration with existing
  // enterprise platforms" — four cards, four mismatches, on every page that did
  // not override it. Generating a line from the label instead just restates the
  // heading in more words. A service that has something to say here supplies
  // `featureMicros`; the rest render the label alone, which is honest.
  const featureMicros = (service.featureMicros && service.featureMicros.length > 0)
    ? service.featureMicros
    : [];

  // Hero Strip Items Fallback
  const heroStripItems = (service.heroStripItems && service.heroStripItems.length > 0)
    ? service.heroStripItems
    : (
      deptSlug === 'foundry' ? ['Cloud Infrastructure', 'DevOps Automation', 'CI/CD Pipelines', 'Site Reliability', 'Embedded Systems', 'Quality Engineering', 'Infrastructure as Code', 'Microservices Mesh'] :
      deptSlug === 'reimagine' ? ['Legacy Refactoring', 'Application Modernization', 'Cloud Re-platforming', 'Digital Transformation', 'MVP Acceleration', 'Product UX Architecture', 'Tech Debt Elimination', 'API Modernization'] :
      deptSlug === 'shield' ? ['Zero-Trust Architecture', '24/7 SOC Operations', 'Threat Detection', 'Data Privacy & PII', 'OT & SCADA Security', 'SOC 2 & ISO 27001', 'Penetration Testing', 'Risk Governance'] :
      deptSlug === 'platforms' ? ['Salesforce Engineering', 'ServiceNow ITSM', 'Pimcore PIM/DAM', 'Enterprise iPaaS', 'GCC Setup & Scaling', 'Supply Chain Tech', 'Unified Service Management', 'ERP Integration'] :
      deptSlug === 'growth' ? ['Customer Data Strategy', 'First-Party CDP', 'GenAI Marketing Ops', 'PPC & Ad Engineering', 'Technical SEO', 'Conversion Rate Optimization', 'Growth Funnel Architecture', 'Omnichannel Campaigns'] :
      ['Machine Learning Engineering', 'Natural Language Intelligence', 'Computer Vision', 'Generative AI Services', 'Decision Intelligence', 'Knowledge Graphs', 'Autonomous Agents', 'AI Governance']
    );

  // Trust Signals Fallback
  const trustSignals = (service.trustSignals && service.trustSignals.length > 0)
    ? service.trustSignals
    : [
        `Enterprise-grade delivery framework validated across Banking, Healthcare, Manufacturing & Tech`,
        `Built-in governance, zero-trust security controls & compliance audit readiness`,
        `Proven track record of high-availability deployment and measurable ROI impact`,
        `Open architecture supporting multi-cloud, hybrid, and legacy integration targets`
      ];

  // Concierge Chips Fallback
  const conciergeChips = (service.conciergeChips && service.conciergeChips.length > 0)
    ? service.conciergeChips
    : [
        `How fast can you assess our current ${lowerServiceName(name)} environment?`,
        `What architecture standards and governance controls come built-in?`,
        `How do you handle integration with legacy enterprise systems?`,
        `What timeline and delivery packages are available?`,
        `Book ${article(name)} ${name} strategy session`
      ];

  // Tools Stack Fallback
  const toolsStack = service.toolsStack || (
    deptSlug === 'foundry' ? {
      title: `${name} Technology Stack`,
      subtitle: `The enterprise-grade toolchain powering high-availability cloud, DevOps, and engineering infrastructure.`,
      items: [
        { icon: 'Cloud', title: 'Cloud & Infrastructure', desc: 'AWS, Azure, Google Cloud Platform, HashiCorp Terraform, Ansible, and Pulumi for automated IaC.' },
        { icon: 'Cpu', title: 'Containers & Mesh', desc: 'Kubernetes, Docker, Istio service mesh, Helm, and Amazon EKS / Azure AKS / GCP GKE.' },
        { icon: 'Zap', title: 'CI/CD & Delivery', desc: 'GitHub Actions, GitLab CI, Jenkins, ArgoCD, SonarQube, and automated security scanners.' },
        { icon: 'Activity', title: 'Observability & SRE', desc: 'Datadog, Prometheus, Grafana, OpenTelemetry, PagerDuty, and ELK log stack.' }
      ]
    } :
    deptSlug === 'reimagine' ? {
      title: `${name} Technology Stack`,
      subtitle: `The modern engineering stack powering codebase refactoring, digital transformation, and fast-track MVPs.`,
      items: [
        { icon: 'Layers', title: 'Modern Application Frameworks', desc: 'React, Next.js, Node.js, Spring Boot, Go, and Python FastAPI for high-performance backends.' },
        { icon: 'Workflow', title: 'API & Microservices', desc: 'GraphQL, RESTful API gateways, Kong, Apigee, and gRPC for high-throughput service communication.' },
        { icon: 'Search', title: 'Code Parsing & Discovery', desc: 'SonarQube, Cast, Semgrep, and automated AST analyzers for legacy codebase extraction.' },
        { icon: 'Cloud', title: 'Cloud-Native Deployment', desc: 'Docker, Kubernetes, AWS Fargate, Azure App Service, and serverless Lambda architectures.' }
      ]
    } :
    deptSlug === 'shield' ? {
      title: `${name} Technology Stack`,
      subtitle: `The security and compliance toolchain protecting enterprise infrastructure, identity, and sensitive data.`,
      items: [
        { icon: 'ShieldCheck', title: 'SIEM & SOC Operations', desc: 'Splunk, Microsoft Sentinel, Elastic Security, Palo Alto Cortex, and automated SOAR playbooks.' },
        { icon: 'Lock', title: 'Identity & Access (IAM)', desc: 'Okta, Microsoft Entra ID (Azure AD), CyberArk, and HashiCorp Vault for secrets management.' },
        { icon: 'Key', title: 'Data Security & DLP', desc: 'Varonis, Cloudflare Access, AWS KMS, Hardware Security Modules (HSM), and Symantec DLP.' },
        { icon: 'Activity', title: 'Vulnerability & Compliance', desc: 'Qualys, Tenable Nessus, CrowdStrike Falcon EDR, and automated CIS compliance auditors.' }
      ]
    } :
    deptSlug === 'platforms' ? {
      title: `${name} Technology Stack`,
      subtitle: `The enterprise platform middleware and integration toolchain connecting SaaS, ERP, and custom systems.`,
      items: [
        { icon: 'Layers', title: 'Enterprise Platforms', desc: 'Salesforce Sales/Service/Marketing Cloud, ServiceNow ITSM/ITOM, and Pimcore PIM/DAM.' },
        { icon: 'Workflow', title: 'iPaaS & Middleware', desc: 'MuleSoft Anypoint, Boomi, Workato, Apache Kafka event streams, and Software AG webMethods.' },
        { icon: 'Database', title: 'ERP & Master Data', desc: 'SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365, and Informatica MDM.' },
        { icon: 'Shield', title: 'Platform Security & APIs', desc: 'OAuth 2.0, SAML 2.0, Apigee API Gateway, OpenID Connect, and enterprise RBAC controls.' }
      ]
    } :
    deptSlug === 'growth' ? {
      title: `${name} Technology Stack`,
      subtitle: `The growth engineering, customer data, and marketing technology stack driving conversions and ROI.`,
      items: [
        { icon: 'Database', title: 'Customer Data Platforms', desc: 'Segment, Tealium, Hightouch, Snowflake, and Google BigQuery for unified customer data.' },
        { icon: 'TrendingUp', title: 'Analytics & Attribution', desc: 'Google Analytics 4, Mixpanel, Amplitude, AppsFlyer, and multi-touch attribution models.' },
        { icon: 'Zap', title: 'CRO & Experimentation', desc: 'Optimizely, VWO, Hotjar, Google Tag Manager, and custom React A/B testing engines.' },
        { icon: 'BrainCircuit', title: 'GenAI & Ad Tech', desc: 'Midjourney, Jasper, Copy.ai, Google Ads API, Meta Marketing API, and LinkedIn Campaign Manager.' }
      ]
    } : {
      title: `${name} Technology Stack`,
      subtitle: `The enterprise-grade toolchain powering cognitive computing, machine learning, and AI governance.`,
      items: [
        { icon: 'BrainCircuit', title: 'Models & Frameworks', desc: 'PyTorch, TensorFlow, Hugging Face, scikit-learn, and custom neural network architectures.' },
        { icon: 'Cpu', title: 'Foundation LLMs', desc: 'GPT-4o, Claude 3.5, Gemini 1.5, Llama 3, and fine-tuned open-weights enterprise models.' },
        { icon: 'Layers', title: 'Vector & Knowledge DBs', desc: 'Pinecone, Weaviate, Qdrant, Neo4j knowledge graphs, and Apache Kafka streaming.' },
        { icon: 'Shield', title: 'MLOps & Governance', desc: 'MLflow, LangSmith, Weights & Biases, SHAP explainability, and immutable audit ledgers.' }
      ]
    }
  );

  const downloadAsset = service.downloadAsset || `/assets/downloads/kangqore-${slug}-playbook.pdf`;
  const downloadAssetTitle = service.downloadAssetTitle || 'Download the Playbook';

  return {
    ...service,
    heroTitle,
    heroBadge,
    heroMaxWidth,
    heroTitleSize,
    whatIsTitle,
    whatIsHighlight,
    whatIsPara2,
    whatIsEyebrow,
    bannerBrandDesc,
    businessMetrics,
    capabilityAreas,
    comparisonTable,
    architectureNodes,
    industryUseCases,
    servicePackages,
    outcomeCard,
    outcomeCard2,
    outcomeCard3,
    customFAQs,
    customJourney,
    featureMicros,
    heroStripItems,
    trustSignals,
    conciergeChips,
    toolsStack,
    downloadAsset,
    downloadAssetTitle,
  };
}

// Service names are interpolated into prose, and 17 of the 62 begin with a
// vowel ("Agentic AI Services", "AI Governance", "Analytics"), which rendered
// as "a Agentic AI Services engagement". Article is chosen from the name.
// `article` moved to data/serviceFaqs.js so the prerender generator and the
// schema builder resolve it identically. The old local copy tested the first
// letter against /^[aeiou]/, which produced "a MLOps engagement" — acronyms are
// read letter-by-letter, so the vowel test has to follow pronunciation.

// Maps the free-text industry labels used in servicesData onto the canonical
// /industries/* routes. Anything unmapped renders without a link rather than
// guessing a slug and shipping a 404.
const INDUSTRY_ROUTES = {
  'banking & financial services': 'banking',
  'banking and financial services': 'banking',
  'financial services': 'banking',
  insurance: 'insurance',
  healthcare: 'healthcare',
  'healthcare & life sciences': 'healthcare',
  'life sciences': 'life-science',
  manufacturing: 'manufacturing',
  'retail & consumer': 'retail',
  'retail & consumer goods': 'retail',
  retail: 'retail',
  'consumer goods': 'consumer-goods',
  edtech: 'edtech',
  'media & entertainment': 'media-technology',
  'media & technology': 'media-technology',
  'energy & utilities': 'energy-utilities',
  'travel & hospitality': 'travel-hospitality',
  'information services': 'information-services',
};

function industrySlug(label) {
  return INDUSTRY_ROUTES[String(label || '').trim().toLowerCase()] || null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function UniversalServicePage({ service: rawService, department }) {
  const service = getParityService(rawService, department);

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
  const HERO_CAP_IMAGES = {
    'Autonomous Goal Execution': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Agent Orchestration': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Memory & Knowledge': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Intelligence': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Governance': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Security': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Operations': '/images/capabilities/agentic-governed-autonomy.png',
    'Enterprise Integrations': '/images/capabilities/agentic-governed-autonomy.png',
  };
  const HERO_CAPS  = (service.heroStripItems || service.keyFeatures).map((f, i) => ({
    label: f,
    color: CAP_COLORS[i % CAP_COLORS.length],
    icon: ICON_POOL[i % ICON_POOL.length],
    bgImage: HERO_CAP_IMAGES[f] || (service.architectureNodes && service.architectureNodes[i % service.architectureNodes.length]?.bgImage) || `/images/architecture/agentic-${['perceive','reason','plan','act','learn'][i % 5]}.png`
  }));
  const HERO_STRIP = [...HERO_CAPS, ...HERO_CAPS, ...HERO_CAPS];


  // ── Why Kangqore pillars (3 standard) ────────────────────────────────────
  // ── FAQ: service.customFAQs overrides generated defaults ─────────────────
  const faqs = service.customFAQs || [
    { q: `What is ${service.name}?`,                           a: service.fullDescription },
    { q: `How does Kangqore approach ${service.name}?`,        a: `Kangqore approaches ${service.name} through a four-phase model: Discover, Frame, Build, and Activate. We begin by understanding your current state and goals, design a tailored solution, implement it with precision, and continuously optimize for lasting results.` },
    { q: `What does ${article(service.name)} ${service.name} engagement include?`,    a: `${article(service.name) === 'an' ? 'An' : 'A'} ${service.name} engagement typically covers: ${service.keyFeatures.join(', ')}. Each engagement is tailored to your specific business context and strategic objectives.` },
    { q: `Who is ${service.name} designed for?`,               a: `${service.name} is designed for organizations looking to drive meaningful outcomes through ${service.shortDescription.toLowerCase()}. It is relevant for both greenfield initiatives and optimization of existing capabilities.` },
    { q: `What outcomes can I expect?`,                        a: `Organizations that partner with Kangqore on ${service.name} typically achieve improved operational efficiency, accelerated delivery timelines, reduced risk, and measurable business impact aligned with their strategic objectives.` },
    { q: `How do I get started?`,                              a: `The first step is a 30-minute discovery call with a Kangqore specialist. We will assess your current state, understand your goals, and outline a clear path forward — with no commitment required.` },
  ];

  // ── Topic cluster: every sibling service in the same practice ─────────────
  // Three related links left each service page a near dead-end for crawlers and
  // gave the 61-page catalog no traversable hub↔spoke structure. Linking the
  // full practice turns each page into a real cluster node.
  const clusterSiblings = Object.keys(servicesData)
    .filter(s => s !== service.slug && servicesData[s].departmentSlug === service.departmentSlug)
    .map(s => ({ slug: s, name: servicesData[s].name, link: `/services/${s}` }));

  // ── Feature accordion (first 4 keyFeatures) ──────────────────────────────
  const featureLabels   = service.keyFeatures.slice(0, 4);
const featureMicros   = service.featureMicros
    ? service.featureMicros.slice(0, 4)
    : featureLabels.map(f => `Building ${f.toLowerCase()} maturity that scales with your business.`);
  const featureIcons    = featureLabels.map((_, i) => ICON_POOL[i % ICON_POOL.length]);

  // ── State ─────────────────────────────────────────────────────────────────
  const [openFaq,          setOpenFaq]          = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [expandedCaps,     setExpandedCaps]     = useState({});
  // Data-boundary blocks: none open on load, active only while hovered/focused.
  const [openBoundary,     setOpenBoundary]     = useState(null);

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

          {service.showBeams ? (
            <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden pointer-events-none">
              <BackgroundBeams />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none z-10" />
            </div>
          ) : service.slug === 'agentic-ai' ? (
            <div className="absolute inset-0 w-full h-full bg-[#02050b] overflow-hidden pointer-events-none">
              <div className="absolute inset-0 z-0">
                <Beams
                  beamWidth={2}
                  beamHeight={15}
                  beamNumber={12}
                  lightColor="#ffffff"
                  speed={2}
                  noiseIntensity={1.75}
                  scale={0.2}
                  rotation={0}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none z-10" />
            </div>
          ) : service.slug === 'agentic-ai-led-application-modernization' ? (
            <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden pointer-events-none">
              <BackgroundNoiseGrid />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70 pointer-events-none z-10" />
            </div>
          ) : service.useAbstractHero ? (
            <div className="absolute inset-0 w-full h-full bg-[#02050b] overflow-hidden pointer-events-none">
              {/* Abstract Gradient Mesh */}
              <div className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute top-[20%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tl from-indigo-600/20 via-blue-500/10 to-transparent blur-[140px] animate-pulse" style={{ animationDuration: '12s' }} />
              <div className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-t from-cyan-600/15 via-teal-500/5 to-transparent blur-[100px]" />

              {/* Cybernetic Tech Grid */}
              <div 
                className="absolute inset-0 opacity-[0.14]" 
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
                  backgroundSize: '4rem 4rem',
                  maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)'
                }}
              />

              {/* Text-Free Animated Particle Field / Glowing Node Mesh */}
              <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hero-node-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <g stroke="url(#hero-node-grad)" strokeWidth="1" fill="none">
                  <path d="M120,180 L380,110 L720,280 L1080,160 L1400,240 M380,110 L580,420 L920,380 M720,280 L1220,520 M280,580 L580,420 L980,660 M920,380 L1350,480" className="animate-pulse" style={{ animationDuration: '7s' }} />
                </g>
                <circle cx="120" cy="180" r="3" fill="#38bdf8" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="380" cy="110" r="2.5" fill="#818cf8" />
                <circle cx="720" cy="280" r="4" fill="#38bdf8" />
                <circle cx="1080" cy="160" r="3" fill="#60a5fa" />
                <circle cx="580" cy="420" r="2.5" fill="#38bdf8" />
                <circle cx="920" cy="380" r="3.5" fill="#818cf8" />
                <circle cx="1220" cy="520" r="2.5" fill="#38bdf8" />
                <circle cx="1400" cy="240" r="3" fill="#60a5fa" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
            </div>
          ) : (
            <>
              <ResponsiveImage src={service.image} alt="" aria-hidden="true" loading="lazy" sizes="100vw" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
            </>
          )}

          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16">
              <div className={`${service.heroMaxWidth || 'max-w-[62%]'} mt-[1cm]`}>

                {/* Typewriter badge */}
                <div className="inline-flex items-center gap-3 mb-10 mt-[1cm]">
                  <p className="text-xs font-bold tracking-[0.2em] text-white uppercase">
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
                  <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-sm tracking-wide hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                    {service.primaryCtaText || 'Talk To Our Experts'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                  <a href="#svc-capabilities" className="group inline-flex items-center gap-2 px-6 py-4 text-white/55 hover:text-white text-sm font-bold tracking-wide transition-colors duration-200">
                    Explore Capabilities
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                </div>

                {/* Company fact strip */}
                <p className="text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase mt-[calc(2rem+0.5cm)]">
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
                // The list is tripled so the CSS scroll loop wraps without a
                // visible gap — copies 2 and 3 are pure animation scaffolding.
                // Hiding them from the a11y tree means screen readers announce
                // each capability once instead of three times, and text
                // extraction (crawlers, answer engines) counts them once.
                const isDuplicate = i >= HERO_CAPS.length;
                return (
                  <div 
                    key={i} 
                    aria-hidden={isDuplicate ? 'true' : undefined} 
                    className="relative flex items-center gap-4 bg-[#060a12] border border-white/15 rounded-2xl p-2 pr-6 shadow-2xl flex-shrink-0 cursor-default hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                  >
                    {/* Background Image overlay */}
                    {cap.bgImage && (
                      <ResponsiveImage
                        src={cap.bgImage}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        sizes="300px"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:opacity-65 group-hover:scale-105 transition-all duration-500 pointer-events-none"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#060a12]/90 via-[#060a12]/60 to-[#060a12]/90 pointer-events-none z-0" />

                    <div
                      className="relative z-10 w-12 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${cap.color}55 0%, ${cap.color}cc 100%)`,
                        boxShadow: `0 4px 14px ${cap.color}55`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white drop-shadow" />
                    </div>
                    <span className="relative z-10 text-[14px] font-bold text-white/95 tracking-tight whitespace-nowrap drop-shadow-sm">{cap.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════ DEFINITION / OVERVIEW ══════════════════════ */}
      <section id="svc-what" className="py-16 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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

          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-20 lg:gap-16 items-start mb-20">
            <div>
              {/* data-speakable pairs with SpeakableSpecification in the page
                  schema: this is the passage a voice assistant reads aloud. */}
              <p data-speakable className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-8 font-light max-w-xl">{service.shortDescription}</p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mb-0">
                {service.whatIsPara2 || <>A service can be technically delivered and still fail if the strategy and execution are misaligned.{' '}<span className="text-white">Kangqore closes that gap.</span></>}
              </p>
              {service.whatIsPara3 && <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mt-8 mb-0">{service.whatIsPara3}</p>}
              {service.whatIsPara4 && <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-xl text-white/60 mt-8 mb-0">{service.whatIsPara4}</p>}
            </div>

            {service.capabilityAreas ? (
              service.slug === 'agentic-ai-led-application-modernization' ? (
                /* ── Agentic AI-led Modernization Flow Diagram ── */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible" role="group" aria-label="Architecture diagram — scroll sideways to see the full flow" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[660px] sm:min-w-0">
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
                    <text x="75" y="60" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.5">LEGACY CORE</text>
                    <text x="75" y="121" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace" letterSpacing="0.5">MONOLITH</text>

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
                    <text x="270" y="195" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.5">MODERNIZATION ENGINE</text>

                    {/* ── RIGHT: Cloud Native Target ── */}
                    <circle cx="450" cy="70" r="18" fill="#0c0e14" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <circle cx="410" cy="140" r="20" fill="#0c0e14" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8"/>
                    <circle cx="490" cy="140" r="23" fill="#0c0e14" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8"/>
                    
                    {/* Connecting lines of the target mesh */}
                    <line x1="438" y1="83" x2="422" y2="124" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5"/>
                    <line x1="462" y1="83" x2="478" y2="124" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5"/>
                    <line x1="428" y1="140" x2="472" y2="140" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5"/>

                    {/* Labels inside microservices */}
                    <text x="450" y="73" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">API</text>
                    <text x="410" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">DB</text>
                    <text x="490" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">K8S</text>

                    {/* Text labels on right target */}
                    <text x="450" y="44" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.5">CLOUD NATIVE</text>
                    <text x="450" y="180" textAnchor="middle" fill="#00f0ff" fillOpacity="0.8" fontSize="9" fontFamily="monospace" letterSpacing="0.5">MICROSERVICES</text>

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
                    <text x="97" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">1. CODE SCAN</text>

                    {/* Section 2: Code Refactoring */}
                    <g transform="translate(192, 290)">
                      {/* Input logic block */}
                      <rect x="0" y="10" width="14" height="14" rx="2" fill="none" stroke="white" strokeWidth="1.2" strokeOpacity="0.6"/>
                      <text x="7" y="20" textAnchor="middle" fill="white" fillOpacity="0.6" fontSize="9" fontFamily="monospace">&lt;</text>
                      {/* Transform arrow */}
                      <path d="M 18 17 L 26 17" stroke="#00f0ff" strokeWidth="1.5" markerEnd="url(#diag-arrow-cyan)"/>
                      {/* Output microservices */}
                      <circle cx="36" cy="11" r="5" fill="none" stroke="#00f0ff" strokeWidth="1.2"/>
                      <circle cx="36" cy="23" r="5" fill="none" stroke="#00f0ff" strokeWidth="1.2"/>
                    </g>
                    <text x="212" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">2. REFACTOR</text>

                    {/* Section 3: Automated QA / Test */}
                    <g transform="translate(312, 290)">
                      {/* Shield icon */}
                      <path d="M 15 5 C 22 5 27 8 27 15 C 27 23 15 29 15 29 C 15 29 3 23 3 15 C 3 8 8 5 15 5 Z" fill="none" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glow-modern)"/>
                      {/* Checkmark inside */}
                      <path d="M 10 16 L 13 19 L 20 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <text x="327" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">3. AUTO QA</text>

                    {/* Section 4: Machine Speed stats */}
                    <g transform="translate(415, 290)">
                      {/* Speedometer arch */}
                      <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round"/>
                      <path d="M 5 25 A 20 20 0 0 1 35 11" fill="none" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" filter="url(#glow-modern)"/>
                      {/* Indicator needle */}
                      <line x1="25" y1="25" x2="35" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="25" cy="25" r="3" fill="white"/>
                    </g>
                    <text x="442" y="348" textAnchor="middle" fill="#00f0ff" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">4. MACHINE SPEED</text>
                  </svg>
                </div>
              ) : service.slug === 'ai-governance' ? (
                /* ── AI Governance Flow Diagram ── */
                <div className="flex items-center justify-start sm:justify-center w-full lg:-mt-16 overflow-x-auto sm:overflow-visible" role="group" aria-label="Architecture diagram — scroll sideways to see the full flow" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[660px] sm:min-w-0">
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

                      <filter id="glow-cyan-gov" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-purple-gov" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="7" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-green-gov" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <marker id="arrow-cyan-matrix" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#00f0ff" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="arrow-green-matrix" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#34d399" strokeWidth="1.2" fill="none"/>
                      </marker>

                      <clipPath id="capsule-clip-gov">
                        <rect x="35" y="270" width="470" height="96" rx="20"/>
                      </clipPath>
                    </defs>

                    {/* ── TOP SYSTEM STATUS & FRAMEWORK BANNER ── */}
                    <g transform="translate(100, 6)">
                      <rect x="0" y="0" width="340" height="22" rx="11" fill="#080c14" stroke="url(#gov-cyan)" strokeWidth="1" strokeOpacity="0.5" />
                      <circle cx="16" cy="11" r="3.5" fill="#00c875" filter="url(#glow-green-gov)" />
                      <text x="28" y="14.5" fill="#00f0ff" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="0.8">eQORE™ ENTERPRISE AI GOVERNANCE MATRIX :: NIST &amp; EU AI ACT COMPLIANT</text>
                    </g>

                    {/* ── LEFT COLUMN: INPUT & CAPABILITY CHIPS ── */}
                    <text x="75" y="42" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.8">FRAMEWORK INPUTS</text>
                    
                    {/* Chip 1: Prompts & RAG */}
                    <g transform="translate(15, 54)">
                      <rect x="0" y="0" width="118" height="26" rx="6" fill="#080c14" stroke="url(#gov-gold)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="12" cy="13" r="3" fill="#f59e0b" />
                      <text x="22" y="12" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace" fontWeight="bold">PROMPTS &amp; RAG DATA</text>
                      <text x="22" y="20" fill="#fbbf24" fillOpacity="0.9" fontSize="9" fontFamily="monospace">INPUT SHIELDING</text>
                    </g>

                    {/* Chip 2: Agent Actions */}
                    <g transform="translate(15, 88)">
                      <rect x="0" y="0" width="118" height="26" rx="6" fill="#080c14" stroke="url(#gov-gold)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="12" cy="13" r="3" fill="#ea580c" />
                      <text x="22" y="12" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace" fontWeight="bold">AGENT TOOL ACTIONS</text>
                      <text x="22" y="20" fill="#ea580c" fillOpacity="0.9" fontSize="9" fontFamily="monospace">POLICY INTERCEPT</text>
                    </g>

                    {/* Chip 3: LLM & GenAI Models */}
                    <g transform="translate(15, 122)">
                      <rect x="0" y="0" width="118" height="26" rx="6" fill="#080c14" stroke="url(#gov-cyan)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="12" cy="13" r="3" fill="#00f0ff" />
                      <text x="22" y="12" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace" fontWeight="bold">LLM &amp; GENAI MODELS</text>
                      <text x="22" y="20" fill="#00f0ff" fillOpacity="0.9" fontSize="9" fontFamily="monospace">BIAS DRIFT &lt; 0.01%</text>
                    </g>

                    {/* Chip 4: Enterprise GRC */}
                    <g transform="translate(15, 156)">
                      <rect x="0" y="0" width="118" height="26" rx="6" fill="#080c14" stroke="url(#gov-purple)" strokeWidth="1.2" strokeOpacity="0.8"/>
                      <circle cx="12" cy="13" r="3" fill="#a78bfa" />
                      <text x="22" y="12" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace" fontWeight="bold">ENTERPRISE GRC</text>
                      <text x="22" y="20" fill="#a78bfa" fillOpacity="0.9" fontSize="9" fontFamily="monospace">EU AI ACT TIERING</text>
                    </g>

                    {/* Laser stream connectors (Left to Center Matrix) */}
                    <path d="M 133 67 C 160 67, 175 102, 194 102" stroke="url(#gov-gold)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" markerEnd="url(#arrow-cyan-matrix)" />
                    <path d="M 133 101 L 194 116" stroke="url(#gov-gold)" strokeWidth="1.5" strokeOpacity="0.9" markerEnd="url(#arrow-cyan-matrix)" />
                    <path d="M 133 135 L 194 135" stroke="url(#gov-cyan)" strokeWidth="1.5" strokeOpacity="0.9" markerEnd="url(#arrow-cyan-matrix)" />
                    <path d="M 133 169 C 160 169, 175 150, 194 150" stroke="url(#gov-purple)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" markerEnd="url(#arrow-cyan-matrix)" />

                    {/* ── CENTER: 4-QUADRANT GOVERNANCE MATRIX & KERNEL (cx=270, cy=125) ── */}
                    <text x="270" y="42" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.8">eQORE™ GOVERNANCE MATRIX</text>
                    
                    {/* Outer Regulatory Perimeter Circle (R=72) */}
                    <circle cx="270" cy="125" r="72" fill="#04070d" stroke="url(#gov-purple)" strokeWidth="1.5" filter="url(#glow-purple-gov)" />
                    
                    {/* Outer Radar Grid Marks */}
                    <circle cx="270" cy="125" r="56" fill="#070b16" stroke="#00f0ff" strokeWidth="1" strokeDasharray="6 3" />
                    <circle cx="270" cy="125" r="38" fill="none" stroke="white" strokeWidth="0.8" strokeOpacity="0.15" />

                    {/* 4 Quadrant Accent Dividers */}
                    <line x1="270" y1="53" x2="270" y2="197" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" />
                    <line x1="198" y1="125" x2="342" y2="125" stroke="white" strokeWidth="0.8" strokeOpacity="0.2" />

                    {/* 4 Core Framework Capability Nodes */}
                    {/* Top-Left Quadrant Node: ETHICS */}
                    <g transform="translate(230, 80)">
                      <circle cx="0" cy="0" r="4" fill="#f59e0b" filter="url(#glow-cyan-gov)" />
                      <text x="-6" y="-6" textAnchor="end" fill="#fbbf24" fontSize="9" fontWeight="bold" fontFamily="monospace">RESPONSIBLE AI</text>
                    </g>
                    {/* Top-Right Quadrant Node: MODEL GOV */}
                    <g transform="translate(310, 80)">
                      <circle cx="0" cy="0" r="4" fill="#00f0ff" filter="url(#glow-cyan-gov)" />
                      <text x="6" y="-6" fill="#00f0ff" fontSize="9" fontWeight="bold" fontFamily="monospace">MODEL GOVERNANCE</text>
                    </g>
                    {/* Bottom-Right Quadrant Node: RISK & SEC */}
                    <g transform="translate(310, 170)">
                      <circle cx="0" cy="0" r="4" fill="#7f53f9" />
                      <text x="6" y="10" fill="#a78bfa" fontSize="9" fontWeight="bold" fontFamily="monospace">RISK &amp; SECURITY</text>
                    </g>
                    {/* Bottom-Left Quadrant Node: OPS & AUDIT */}
                    <g transform="translate(230, 170)">
                      <circle cx="0" cy="0" r="4" fill="#00c875" />
                      <text x="-6" y="10" textAnchor="end" fill="#00c875" fontSize="9" fontWeight="bold" fontFamily="monospace">OPS &amp; ASSURANCE</text>
                    </g>

                    {/* Center Hexagonal Engine Processor Kernel */}
                    <g transform="translate(248, 103)">
                      <rect x="0" y="0" width="44" height="44" rx="10" fill="#080e1a" stroke="url(#gov-cyan)" strokeWidth="1.5" filter="url(#glow-cyan-gov)" />
                      <path d="M 22 7 L 36 15 L 36 29 L 22 37 L 8 29 L 8 15 Z" fill="none" stroke="#00f0ff" strokeWidth="1.4" />
                      <circle cx="22" cy="22" r="4" fill="#00f0ff" filter="url(#glow-cyan-gov)" />
                    </g>

                    {/* Output Laser Path (Center to Right Outcomes) */}
                    <path d="M 342 125 L 410 125" stroke="url(#gov-green)" strokeWidth="2.5" filter="url(#glow-green-gov)" markerEnd="url(#arrow-green-matrix)" />

                    {/* ── RIGHT COLUMN: AUDIT VERIFIED COMPLIANCE LEDGER ── */}
                    <text x="465" y="42" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.8">VERIFIED OUTCOMES</text>

                    <g transform="translate(410, 52)">
                      <rect x="0" y="0" width="118" height="136" rx="10" fill="#080d16" stroke="url(#gov-green)" strokeWidth="1.5" filter="url(#glow-green-gov)" />
                      
                      {/* Badge Header */}
                      <rect x="8" y="8" width="102" height="18" rx="5" fill="#00c875" fillOpacity="0.15" />
                      <text x="59" y="20.5" textAnchor="middle" fill="#00c875" fontSize="9" fontWeight="black" fontFamily="monospace">VERIFIED PASSPORT</text>

                      {/* Checklist */}
                      <text x="12" y="42" fill="#00c875" fontSize="9" fontWeight="bold">✓</text>
                      <text x="23" y="42" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">EU AI Act Aligned</text>

                      <text x="12" y="60" fill="#00c875" fontSize="9" fontWeight="bold">✓</text>
                      <text x="23" y="60" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">Model Quality &gt; 99.8%</text>

                      <text x="12" y="78" fill="#00c875" fontSize="9" fontWeight="bold">✓</text>
                      <text x="23" y="78" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">Zero-Trust Shielded</text>

                      <text x="12" y="96" fill="#00c875" fontSize="9" fontWeight="bold">✓</text>
                      <text x="23" y="96" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">Immutable Audit Log</text>

                      <text x="12" y="114" fill="#00c875" fontSize="9" fontWeight="bold">✓</text>
                      <text x="23" y="114" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">Kill-Switch Ready</text>
                    </g>

                    {/* ── BOTTOM: 4-STAGE CONTINUOUS LIFECYCLE PIPELINE ── */}
                    <g transform="translate(30, 256)">
                      {/* Outer Capsule Container */}
                      <rect x="0" y="0" width="480" height="96" rx="20" fill="#050810" stroke="white" strokeWidth="1.2" strokeOpacity="0.25"/>
                      
                      {/* Active Stage Highlights */}
                      <rect x="120" y="0" width="120" height="96" fill="#121724" fillOpacity="0.5"/>
                      <rect x="360" y="0" width="120" height="96" fill="url(#gov-green)" fillOpacity="0.12" clipPath="url(#capsule-clip-gov)"/>
                      
                      {/* Segment Dividers */}
                      <line x1="120" y1="0" x2="120" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
                      <line x1="240" y1="0" x2="240" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
                      <line x1="360" y1="0" x2="360" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>

                      {/* Stage 1: Discovery & Risk Tiering */}
                      <g transform="translate(45, 18)">
                        <circle cx="15" cy="15" r="14" fill="#0c101c" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.9"/>
                        <circle cx="15" cy="15" r="6" fill="#f59e0b" />
                        <line x1="15" y1="0" x2="15" y2="30" stroke="white" strokeOpacity="0.3" />
                        <line x1="0" y1="15" x2="30" y2="15" stroke="white" strokeOpacity="0.3" />
                      </g>
                      <text x="60" y="68" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">1. RISK TIERING</text>
                      <text x="60" y="80" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">ISO / EU AI ACT</text>

                      {/* Stage 2: Pre-Deploy Evaluation */}
                      <g transform="translate(165, 18)">
                        <circle cx="15" cy="8" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="6" cy="22" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="24" cy="22" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <line x1="12" y1="11" x2="8" y2="19" stroke="#7f53f9" strokeWidth="1.4" />
                        <line x1="18" y1="11" x2="22" y2="19" stroke="#7f53f9" strokeWidth="1.4" />
                        <circle cx="15" cy="8" r="2" fill="#a78bfa" filter="url(#glow-purple-gov)"/>
                      </g>
                      <text x="180" y="68" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">2. EXPLAINABILITY</text>
                      <text x="180" y="80" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace">SHAP &amp; LINEAGE</text>

                      {/* Stage 3: Runtime Policy Intercept */}
                      <g transform="translate(285, 18)">
                        <rect x="5" y="3" width="20" height="24" rx="4" fill="#0c101c" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glow-cyan-gov)"/>
                        <path d="M 10 13 L 20 13 M 10 18 L 17 18 M 15 8 L 20 8" stroke="#00f0ff" strokeWidth="1.4" strokeLinecap="round" />
                      </g>
                      <text x="300" y="68" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">3. POLICY GATE</text>
                      <text x="300" y="80" textAnchor="middle" fill="#00f0ff" fontSize="9" fontFamily="monospace">PRE-ACTION CHECK</text>

                      {/* Stage 4: Continuous Assurance */}
                      <g transform="translate(405, 18)">
                        <path d="M 5 26 A 18 18 0 0 1 41 26" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.25" strokeLinecap="round"/>
                        <path d="M 5 26 A 18 18 0 0 1 34 11" fill="none" stroke="#00c875" strokeWidth="3" strokeLinecap="round" filter="url(#glow-green-gov)"/>
                        <line x1="23" y1="26" x2="33" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="23" cy="26" r="3" fill="#00c875"/>
                      </g>
                      <text x="420" y="68" textAnchor="middle" fill="#00c875" fontSize="9" fontWeight="bold" fontFamily="monospace">4. AUDIT READY</text>
                      <text x="420" y="80" textAnchor="middle" fill="#00c875" fontSize="9" fontWeight="bold" fontFamily="monospace">100% COVERED</text>
                    </g>
                  </svg>
                </div>
              ) : service.slug === 'mlops' ? (
                /* ── MLOps ML Pipeline Diagram ── */
                <div className="flex items-center justify-start sm:justify-center w-full lg:-mt-16 overflow-x-auto sm:overflow-visible" role="group" aria-label="MLOps Pipeline diagram — data to retrain" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3/4 min-w-[495px] sm:min-w-0 mx-auto">
                    <defs>
                      <linearGradient id="ml-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c"/>
                        <stop offset="100%" stopColor="#f59e0b"/>
                      </linearGradient>
                      <linearGradient id="ml-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f0ff"/>
                        <stop offset="100%" stopColor="#2564ea"/>
                      </linearGradient>
                      <linearGradient id="ml-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7f53f9"/>
                        <stop offset="100%" stopColor="#a78bfa"/>
                      </linearGradient>
                      <linearGradient id="ml-indigo" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1"/>
                        <stop offset="100%" stopColor="#818cf8"/>
                      </linearGradient>
                      <linearGradient id="ml-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#eab308"/>
                        <stop offset="100%" stopColor="#fbbf24"/>
                      </linearGradient>
                      <linearGradient id="ml-green" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00c875"/>
                        <stop offset="100%" stopColor="#34d399"/>
                      </linearGradient>
                      <linearGradient id="ml-red" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444"/>
                        <stop offset="100%" stopColor="#f87171"/>
                      </linearGradient>
                      <linearGradient id="ml-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899"/>
                        <stop offset="100%" stopColor="#f472b6"/>
                      </linearGradient>

                      <filter id="glow-orange-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-cyan-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-purple-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-indigo-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-gold-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-green-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-red-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="glow-pink-ml">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <marker id="diag-arrow-orange-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#f59e0b" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-cyan-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#00f0ff" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-purple-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#a78bfa" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-indigo-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#818cf8" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-gold-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#fbbf24" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-green-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#34d399" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-red-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#f87171" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <marker id="diag-arrow-pink-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0.5 L5,3 L0,5.5" stroke="#f472b6" strokeWidth="1.2" fill="none"/>
                      </marker>
                      <clipPath id="capsule-clip-mlops">
                        <rect x="35" y="270" width="470" height="96" rx="20"/>
                      </clipPath>
                    </defs>

                    {/* ── ROW 1: PIPELINE UPSTREAM ── */}
                    {/* Stage 1: DATA */}
                    <rect x="20" y="55" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-orange)" strokeWidth="1.5" filter="url(#glow-orange-ml)"/>
                    <text x="60" y="78" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">DATA</text>
                    <text x="60" y="90" textAnchor="middle" fill="#ea580c" fontSize="9" fontFamily="monospace">Ingest &amp; Ver</text>

                    {/* Stage 2: FEATURES */}
                    <rect x="140" y="55" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-cyan)" strokeWidth="1.5" filter="url(#glow-cyan-ml)"/>
                    <text x="180" y="78" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">FEATURES</text>
                    <text x="180" y="90" textAnchor="middle" fill="#00f0ff" fontSize="9" fontFamily="monospace">Store &amp; Sync</text>

                    {/* Stage 3: TRAINING */}
                    <rect x="260" y="55" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-purple)" strokeWidth="1.5" filter="url(#glow-purple-ml)"/>
                    <text x="300" y="78" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">TRAINING</text>
                    <text x="300" y="90" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace">Auto-Tuning</text>

                    {/* Stage 4: REGISTRY */}
                    <rect x="380" y="55" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-indigo)" strokeWidth="1.5" filter="url(#glow-indigo-ml)"/>
                    <text x="420" y="78" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">REGISTRY</text>
                    <text x="420" y="90" textAnchor="middle" fill="#818cf8" fontSize="9" fontFamily="monospace">Model Catalog</text>

                    {/* ── ROW 2: PIPELINE DOWNSTREAM ── */}
                    {/* Stage 5: GATE */}
                    <rect x="380" y="175" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-gold)" strokeWidth="1.5" filter="url(#glow-gold-ml)"/>
                    <text x="420" y="198" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">GATE</text>
                    <text x="420" y="210" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="monospace">CI/CD Check</text>

                    {/* Stage 6: SERVING */}
                    <rect x="260" y="175" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-green)" strokeWidth="1.5" filter="url(#glow-green-ml)"/>
                    <text x="300" y="198" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">SERVING</text>
                    <text x="300" y="210" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="monospace">API Endpoint</text>

                    {/* Stage 7: DRIFT */}
                    <rect x="140" y="175" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-red)" strokeWidth="1.5" filter="url(#glow-red-ml)"/>
                    <text x="180" y="198" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">DRIFT</text>
                    <text x="180" y="210" textAnchor="middle" fill="#f87171" fontSize="9" fontFamily="monospace">Telemetry Mon</text>

                    {/* Stage 8: RETRAIN */}
                    <rect x="20" y="175" width="80" height="50" rx="8" fill="#080e1a" stroke="url(#ml-pink)" strokeWidth="1.5" filter="url(#glow-pink-ml)"/>
                    <text x="60" y="198" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="monospace">RETRAIN</text>
                    <text x="60" y="210" textAnchor="middle" fill="#f472b6" fontSize="9" fontFamily="monospace">Trigger Loop</text>

                    {/* ── CONNECTIONS / PIPELINE ARROWS ── */}
                    {/* Row 1 horizontal arrows */}
                    <path d="M 100 80 L 132 80" fill="none" stroke="url(#ml-cyan)" strokeWidth="1.5" markerEnd="url(#diag-arrow-cyan-ml)"/>
                    <path d="M 220 80 L 252 80" fill="none" stroke="url(#ml-purple)" strokeWidth="1.5" markerEnd="url(#diag-arrow-purple-ml)"/>
                    <path d="M 340 80 L 372 80" fill="none" stroke="url(#ml-indigo)" strokeWidth="1.5" markerEnd="url(#diag-arrow-indigo-ml)"/>

                    {/* Curved downward connector on the right */}
                    <path d="M 420 105 C 420 120 420 160 420 167" fill="none" stroke="url(#ml-gold)" strokeWidth="1.5" markerEnd="url(#diag-arrow-gold-ml)"/>

                    {/* Row 2 horizontal arrows (right to left) */}
                    <path d="M 380 200 L 348 200" fill="none" stroke="url(#ml-green)" strokeWidth="1.5" markerEnd="url(#diag-arrow-green-ml)"/>
                    <path d="M 260 200 L 228 200" fill="none" stroke="url(#ml-red)" strokeWidth="1.5" markerEnd="url(#diag-arrow-red-ml)"/>
                    <path d="M 140 200 L 108 200" fill="none" stroke="url(#ml-pink)" strokeWidth="1.5" markerEnd="url(#diag-arrow-pink-ml)"/>

                    {/* Upward loopback connector from RETRAIN to DATA */}
                    <path d="M 60 175 L 60 113" fill="none" stroke="url(#ml-orange)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#diag-arrow-orange-ml)"/>

                    {/* Labels / System Titles */}
                    <text x="270" y="32" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.8">ENTERPRISE ML LIFECYCLE (MLOPS)</text>

                    {/* ── BOTTOM: 4-STAGE CONTINUOUS LIFECYCLE PIPELINE ── */}
                    <g transform="translate(30, 256)">
                      {/* Outer Capsule Container */}
                      <rect x="0" y="0" width="480" height="96" rx="20" fill="#050810" stroke="white" strokeWidth="1.2" strokeOpacity="0.25"/>
                      
                      {/* Active Stage Highlights */}
                      <rect x="120" y="0" width="120" height="96" fill="#121724" fillOpacity="0.5"/>
                      <rect x="360" y="0" width="120" height="96" fill="url(#ml-green)" fillOpacity="0.12" clipPath="url(#capsule-clip-mlops)"/>
                      
                      {/* Segment Dividers */}
                      <line x1="120" y1="0" x2="120" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
                      <line x1="240" y1="0" x2="240" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>
                      <line x1="360" y1="0" x2="360" y2="96" stroke="white" strokeWidth="1" strokeOpacity="0.15"/>

                      {/* Stage 1: Build & Ingest */}
                      <g transform="translate(45, 18)">
                        <circle cx="15" cy="15" r="14" fill="#0c101c" stroke="#ea580c" strokeWidth="1.5" strokeOpacity="0.9"/>
                        <circle cx="15" cy="15" r="6" fill="#ea580c" />
                        <line x1="15" y1="0" x2="15" y2="30" stroke="white" strokeOpacity="0.3" />
                        <line x1="0" y1="15" x2="30" y2="15" stroke="white" strokeOpacity="0.3" />
                      </g>
                      <text x="60" y="68" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">1. INGESTION</text>
                      <text x="60" y="80" textAnchor="middle" fill="#ea580c" fontSize="9" fontFamily="monospace">VERSIONED DATA</text>

                      {/* Stage 2: Training & Validation */}
                      <g transform="translate(165, 18)">
                        <circle cx="15" cy="8" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="6" cy="22" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <circle cx="24" cy="22" r="4.5" fill="#0c101c" stroke="#a78bfa" strokeWidth="1.5"/>
                        <line x1="12" y1="11" x2="8" y2="19" stroke="#7f53f9" strokeWidth="1.4" />
                        <line x1="18" y1="11" x2="22" y2="19" stroke="#7f53f9" strokeWidth="1.4" />
                        <circle cx="15" cy="8" r="2" fill="#a78bfa" filter="url(#glow-purple-ml)"/>
                      </g>
                      <text x="180" y="68" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">2. PIPELINES</text>
                      <text x="180" y="80" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="monospace">AUTO TRAINING</text>

                      {/* Stage 3: Deployment Gate */}
                      <g transform="translate(285, 18)">
                        <rect x="5" y="3" width="20" height="24" rx="4" fill="#0c101c" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glow-cyan-ml)"/>
                        <path d="M 10 13 L 20 13 M 10 18 L 17 18 M 15 8 L 20 8" stroke="#00f0ff" strokeWidth="1.4" strokeLinecap="round" />
                      </g>
                      <text x="300" y="68" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">3. DEPLOY GATE</text>
                      <text x="300" y="80" textAnchor="middle" fill="#00f0ff" fontSize="9" fontFamily="monospace">SAFETY &amp; BIAS</text>

                      {/* Stage 4: Telemetry & Monitoring */}
                      <g transform="translate(405, 18)">
                        <path d="M 5 26 A 18 18 0 0 1 41 26" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.25" strokeLinecap="round"/>
                        <path d="M 5 26 A 18 18 0 0 1 34 11" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" filter="url(#glow-green-ml)"/>
                        <line x1="23" y1="26" x2="33" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        <circle cx="23" cy="26" r="3" fill="#34d399"/>
                      </g>
                      <text x="420" y="68" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">4. TELEMETRY</text>
                      <text x="420" y="80" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">DRIFT MONITOR</text>
                    </g>
                  </svg>
                </div>
              ) : (
                /* ── Agentic AI Flow Diagram ── */
                <div className="flex items-center justify-start sm:justify-center w-full lg:-mt-16 overflow-x-auto sm:overflow-visible" role="group" aria-label="Architecture diagram — scroll sideways to see the full flow" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[660px] sm:min-w-0">
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
                    <circle cx="30" cy="83" r="2.5" fill="#ea580c"/>
                    <circle cx="26" cy="119" r="2.5" fill="#f59e0b"/>
                    <circle cx="30" cy="155" r="2.5" fill="#ea580c"/>

                    {/* Text tags inside inputs */}
                    <text x="75" y="86" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">SSE / WEBHOOKS</text>
                    <text x="75" y="122" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">REST / GQL API</text>
                    <text x="75" y="158" textAnchor="middle" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace" fontWeight="bold" letterSpacing="0.2">AMQP / KAFKA</text>

                    <text x="75" y="52" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.5">WORKFLOW TRIGGERS</text>
                    <text x="75" y="186" textAnchor="middle" fill="#ea580c" fillOpacity="0.8" fontSize="9" fontFamily="monospace" letterSpacing="0.5">INCOMING EVENTS</text>

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
                    <text x="204" y="123" textAnchor="middle" fill="white" fontSize="9" fontWeight="black" fontFamily="monospace">RAG</text>
                    {/* Satellite 2: Document parser subagent */}
                    <circle cx="270" cy="52" r="12" fill="#0c0e14" stroke="url(#agentic-purple)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <text x="270" y="55" textAnchor="middle" fill="white" fontSize="9" fontWeight="black" fontFamily="monospace">PLAN</text>
                    {/* Satellite 3: API call executor subagent */}
                    <circle cx="336" cy="120" r="12" fill="#0c0e14" stroke="url(#agentic-purple)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <text x="336" y="123" textAnchor="middle" fill="white" fontSize="9" fontWeight="black" fontFamily="monospace">EXEC</text>

                    {/* Satellite Orbits */}
                    <path d="M 270 52 C 200 52 204 120 204 120" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>
                    <path d="M 204 120 C 204 120 208 188 270 188" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>
                    <path d="M 270 188 C 332 188 336 120 336 120" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>
                    <path d="M 336 120 C 336 120 332 52 270 52" stroke="white" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3"/>

                    {/* Text labels in center */}
                    <text x="270" y="206" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.5">COGNITIVE ROUTING</text>

                    {/* ── RIGHT: Targets & Orchestrated Outcomes ── */}
                    <circle cx="450" cy="70" r="18" fill="#0c0e14" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <circle cx="410" cy="140" r="20" fill="#0c0e14" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    <circle cx="490" cy="140" r="23" fill="#0c0e14" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.9"/>
                    
                    {/* Connecting lines of target node mesh */}
                    <line x1="438" y1="83" x2="422" y2="124" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.5"/>
                    <line x1="462" y1="83" x2="478" y2="124" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.5"/>
                    <line x1="428" y1="140" x2="472" y2="140" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.5"/>

                    {/* Labels inside nodes */}
                    <text x="450" y="73" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">MUTATE</text>
                    <text x="410" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">COMMIT</text>
                    <text x="490" y="143" textAnchor="middle" fill="white" fillOpacity="0.9" fontSize="9" fontFamily="monospace">CALLBACK</text>

                    {/* Text labels on right target */}
                    <text x="474" y="44" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="9" fontFamily="monospace" letterSpacing="0.5">WORKFLOW OUTCOME</text>
                    <text x="450" y="180" textAnchor="middle" fill="#00c875" fillOpacity="0.8" fontSize="9" fontFamily="monospace" letterSpacing="0.5">AUTONOMOUS SYNC</text>

                    {/* ── Connecting Pipelines ── */}
                    <path d="M 130 120 Q 170 90 190 120" fill="none" stroke="url(#agentic-orange)" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="3 3"/>
                    <path d="M 350 120 Q 380 90 410 120" fill="none" stroke="url(#agentic-green)" strokeWidth="1.8" strokeOpacity="0.8" markerEnd="url(#diag-arrow-green)"/>

                    {/* Resolved Checklist speech bubble */}
                    <line x1="396" y1="118" x2="418" y2="108" stroke="white" strokeWidth="1" strokeOpacity="0.5"/>
                    <rect x="418" y="52" width="112" height="80" rx="12" fill="#0b0f19" stroke="url(#agentic-green)" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow-green)"/>
                    <path d="M 418 96 L 402 108 L 422 106 Z" fill="#0b0f19" stroke="#00c875" strokeWidth="1.2" strokeOpacity="0.8"/>
                    
                    <text x="430" y="78" fill="#00c875" fontSize="9" fontWeight="black" fontFamily="sans-serif">✓</text>
                    <text x="444" y="78" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace">Payload parsed</text>
                    <text x="430" y="96" fill="#00c875" fontSize="9" fontWeight="black" fontFamily="sans-serif">✓</text>
                    <text x="444" y="96" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace">DAG orchestrated</text>
                    <text x="430" y="114" fill="#00c875" fontSize="9" fontWeight="black" fontFamily="sans-serif">✓</text>
                    <text x="444" y="114" fill="white" fillOpacity="0.8" fontSize="9" fontFamily="monospace">Tx committed</text>

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
                    <text x="97" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">1. INGEST</text>

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
                    <text x="212" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">2. ORCHESTRATE</text>

                    {/* Section 3: Execute */}
                    <g transform="translate(312, 290)">
                      <rect x="5" y="4" width="20" height="22" rx="3" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeOpacity="0.8" filter="url(#glow-cyan)"/>
                      <path d="M 11 12 L 19 12 M 11 17 L 17 17 M 15 8 L 19 8" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    </g>
                    <text x="327" y="348" textAnchor="middle" fill="white" fillOpacity="0.5" fontSize="9" fontFamily="monospace">3. EXECUTE</text>

                    {/* Section 4: Sync */}
                    <g transform="translate(415, 290)">
                      <path d="M 5 25 A 20 20 0 0 1 45 25" fill="none" stroke="white" strokeWidth="2.5" strokeOpacity="0.3" strokeLinecap="round"/>
                      <path d="M 5 25 A 20 20 0 0 1 35 11" fill="none" stroke="#00c875" strokeWidth="3" strokeLinecap="round" filter="url(#glow-green)"/>
                      <line x1="25" y1="25" x2="35" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="25" cy="25" r="3" fill="white"/>
                    </g>
                    <text x="442" y="348" textAnchor="middle" fill="#00c875" fillOpacity="0.9" fontSize="9" fontWeight="bold" fontFamily="monospace">4. SYNC</text>
                  </svg>
                </div>
              ) ) : null}
          </div>

          {/* Stats row — full width */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-12 border-t border-white/[0.08] mb-16">
            {service.businessMetrics ? service.businessMetrics.map((m, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                  {m.value}<span className="text-cyan-400">{m.suffix}</span>
                </p>
                <p className="text-white font-bold text-xs uppercase tracking-widest mb-2">{m.metricLabel}</p>
                <p className="text-white/50 text-sm leading-snug">{m.desc}</p>
              </div>
            )) : [
              [String(capabilities.length), 'Capability\nAreas'],
              ['4', 'Engagement\nPhases'],
              [String((service.relatedServiceSlugs || []).length), 'Related\nServices'],
              ['1', `${department.name}\nPractice`],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-black text-white tracking-tight mb-1">{v}</p>
                <p className="text-white/60 text-[11px] font-bold tracking-wide uppercase leading-tight whitespace-pre-line">{l}</p>
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
                <span className="text-white/50 group-hover:text-white text-sm font-medium transition-colors duration-500">{service.bannerBrand ? `Kangqore ${service.bannerBrand}` : `Kangqore ${department.name} ™`}</span>
                {service.bannerBrandDesc && (
                  <span className="text-white/50 group-hover:text-white/65 text-[11px] font-medium tracking-wide transition-colors duration-500">{service.bannerBrandDesc}</span>
                )}
              </div>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 flex-shrink-0">
              {service.downloadAsset ? (
                <a href={service.downloadAsset} download className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm tracking-wide hover:bg-white/90 transition-colors duration-200">
                  <Download className="w-4 h-4" />
                  {service.downloadAssetTitle || 'Download the Playbook'}
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

          {/* Challenge / Solution block removed: the copy was service-agnostic
              boilerplate ("Organizations face growing complexity in delivering
              X at enterprise scale") that read identically for all 62 services
              and therefore said nothing about any of them. It occupied the slot
              between the hero and the capability grid where a reader decides
              whether to continue. Reinstate only with real per-service copy. */}

          {/* Pull-quote — hidden when businessMetrics are provided */}
          {!service.businessMetrics && (
            <div className="group border-l-2 border-white/10 pl-8 py-6 pr-8 rounded-r-2xl bg-[#06090f] relative overflow-hidden hover:border-transparent transition-all duration-500">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(90deg, #2564ea 0%, #4ab6d4 100%)' }} />
              <div className="relative z-10">
                <p className="text-xl sm:text-2xl font-black text-white/50 group-hover:text-white leading-snug max-w-4xl transition-colors duration-500">
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
            <p className="text-[11px] font-black tracking-[0.45em] text-white/60 uppercase mb-7 text-center">CORE CAPABILITY PRINCIPLES</p>
            {/* Overflows below ~640px (547px of badges in a 342px gutter), and
                Chrome does not make an overflow container focusable on its own,
                so a keyboard-only visitor could not reach the badges past the
                fold. `justify-start` matters too: a centered flex container puts
                the leading overflow outside the scrollable range entirely. */}
            <div
              className="flex flex-nowrap items-center justify-start sm:justify-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
              role="group"
              aria-label="Core capability principles"
              tabIndex={0}
            >
              {service.keyFeatures.map((f, i, arr) => (
                <React.Fragment key={f}>
                  <span className="flex-shrink-0 text-white/60 text-[11px] font-bold tracking-[0.12em] whitespace-nowrap">{f}</span>
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
          `How long does ${article(service.name)} ${service.name} engagement take?`,
          ...service.keyFeatures.map(f => `Tell me about ${f.toLowerCase()}`),
          `Which industries does ${service.name} apply to?`,
          `Request ${article(service.name)} ${service.name} Discovery Call`,
        ]} />
      </div>

      {/* WHY SHIFT and FRAMEWORK sections removed.
          "What Changes When Agents Do the Work" (whyShift) argued the same case
          as the comparison table below, which presents it as a scannable grid.
          "How a Kangqore Modernization Runs" (modernizationFramework) restated
          the engagement model already covered by "Five ways to start", which
          carries durations and tiers the three-step version lacked.
          Together they cost 1,267px of height for duplicated argument. */}

      {/* ══════════════════════ CAPABILITIES ══════════════════════ */}
      {service.capabilityAreas ? (
        /* ── BENTO GRID (when capabilityAreas override is set) ── */
        <section id="svc-capabilities" className="py-16 md:py-24 overflow-hidden relative" style={{ backgroundColor: '#000000' }}>
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
            .svc-ghost-num::after {
              content: attr(data-ghost);
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
                <p className="text-lg text-white/50 leading-relaxed max-w-md lg:text-right">
                  {capabilities.length} Capability Area{capabilities.length !== 1 ? 's' : ''}. Engineered for enterprise.
                </p>
              </div>
            </div>

            {/* Bento Grid — the single largest block on the mobile page: eight
                380px cards stacked cost 3,124px. Below `sm` it becomes a rail. */}
            <CardRail
              label="Capability areas"
              className={`grid gap-3 grid-cols-1 ${capabilities.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
            >
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
                } else if (capabilities.length === 5) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
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
            </CardRail>
          </div>
        </section>
      ) : (
        /* ── ORIGINAL LIST + DETAIL PANEL (all other services) ── */
        <section id="svc-capabilities" className="py-16 md:py-32 relative" style={{ backgroundColor: '#000000' }}>
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
                          <span className={`text-base sm:text-lg lg:text-xl font-bold leading-snug transition-colors duration-200 ${active ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{c.title}</span>
                        </div>
                        <ChevronRight className={`lg:hidden w-4 h-4 text-white/20 flex-shrink-0 transition-transform duration-200 ${active ? 'rotate-90' : ''}`} />
                      </div>
                      {active && (
                        <div className="lg:hidden pb-6 pl-7 pr-2">
                          <p className="text-[11px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-3">CAPABILITY {c.n}</p>
                          <p className="text-white/70 text-sm leading-relaxed mb-4">{c.desc}</p>
                          <ul className="space-y-1.5">
                            {c.items.map(item => (
                              <li key={item} className="flex items-start gap-3">
                                <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: c.color }} />
                                <span className="text-white/50 text-xs font-medium">{item}</span>
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
                  <p className="text-[11px] font-black tracking-[0.35em] text-cyan-400 uppercase mb-6">CAPABILITY {capabilities[safeCapIdx].n}</p>
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
      {service.slug !== 'agentic-ai-led-application-modernization' && (
        <section className="py-16 md:py-32" style={{ backgroundColor: '#000000' }}>
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
              <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
                Every decision stays coherent from strategy through delivery.
              </p>
            </div>

            {/* Bento grid */}
            <CardRail label="Delivery principles" className="grid grid-cols-1 sm:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-3">
              {featureLabels.map((label, i) => {
                const FIcon = featureIcons[i];
                const n = String(i + 1).padStart(2, '0');
                const isWide = i === 0 || i === 3;
                // ACCENT drives the icon tint, the top border and the card
                // wash — none of which carry text, so the palette is free to
                // stay at brand values. The separate ACCENT_TEXT palette that
                // used to sit here existed only for the eyebrow label, which is
                // gone; brand blue is 3.88:1 on this #06090f card and could not
                // be used for text. If a text element is ever added back here,
                // it needs its own lifted palette, not ACCENT.
                const ACCENT = ['#2564ea','#4ab6d4','#6366f1','#10b981'];
                return (
                  <div
                    key={label}
                    data-index={n}
                    className={`kq-card-index group relative rounded-2xl overflow-hidden border border-white/[0.07] bg-[#06090f] p-7 flex flex-col justify-between hover:border-white/[0.14] transition-all duration-500 ${isWide ? 'sm:col-span-2' : 'sm:col-span-1'}`}
                  >
                    {/* top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, ${ACCENT[i]}, transparent)` }} />

                    {/* faint bg glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"
                      style={{ background: `radial-gradient(ellipse at top left, ${ACCENT[i]}0d 0%, transparent 65%)` }} />

                    {/* The large background number is drawn by `.kq-card-index`
                        in index.css, from the data-index attribute above. It used
                        to be a <span> of real text at 4% alpha — 1.07:1 — which
                        axe only stopped reporting because the micro paragraph
                        happened to overlap it. `aria-hidden` does not help: the
                        text is still on screen, so 1.4.3 still applies, and axe
                        is right to say so. Pure ornament belongs in CSS, where it
                        is not a text node at all. */}

                    {/* Icon */}
                    <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] group-hover:border-white/20 transition-all duration-500"
                      style={{ background: `${ACCENT[i]}14` }}>
                      <FIcon className="w-4 h-4 transition-colors duration-500" style={{ color: `${ACCENT[i]}99` }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* No eyebrow. It used to read `{n} — label.split(' ')[0]`,
                          which on MLOps produced two cards both labeled "MODEL"
                          ("Model versioning", "Model monitoring") and on every
                          page restated a word the heading below already shows.
                          The card is already numbered by the watermark behind
                          it, so the index alone would only duplicate that. */}
                      <h3 className="text-white/70 group-hover:text-white font-black text-lg leading-snug mb-2 transition-colors duration-300">
                        {label}
                      </h3>
                      {featureMicros[i] && (
                        <p className="text-white/50 group-hover:text-white/70 text-xs font-medium leading-relaxed transition-colors duration-500 max-w-sm">
                          {featureMicros[i]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardRail>

          </div>
        </section>
      )}


      {/* ══════════════════════ COMPARISON TABLE ══════════════════════ */}
      {service.comparisonTable && (
        <GeminiComparisonSection comparisonTable={service.comparisonTable} lede={service.comparisonLede || service.comparisonTable?.lede} />
      )}

      {/* ══════════════════════ ARCHITECTURE ══════════════════════ */}
      {service.architectureNodes && service.slug !== 'agentic-ai-led-application-modernization' && service.slug !== 'agentic-ai' && (
        <section id="svc-architecture" className="py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-[1px] w-12 bg-white/20" />
                  <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">ARCHITECTURE & EXECUTION LOOP</span>
                </div>
                <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                  How It Works.<br />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">
                    {service.architectureNodes.length === 5 ? 'The 5-Stage Autonomous Execution Loop.' : 'The 4-Layer Stack.'}
                  </span>
                </h2>
              </div>
              <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
                Every deployment runs on a governed, modular architecture built for enterprise scale.
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${service.architectureNodes.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
              {service.architectureNodes.map((node, idx) => {
                const NodeIcon = JOURNEY_ICON_MAP[node.icon] || Target;
                const LAYER_COLORS = ['#38bdf8', '#818cf8', '#6366f1', '#10b981', '#f59e0b'];
                const color = LAYER_COLORS[idx % LAYER_COLORS.length];

                return (
                  <div 
                    key={idx} 
                    className="group relative rounded-2xl overflow-hidden min-h-[310px] flex flex-col justify-between p-6 border border-white/10 bg-[#060a12] transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] cursor-pointer"
                  >
                    {/* NORMAL STATE BACKGROUND: Background Image */}
                    {node.bgImage && (
                      <div className="absolute inset-0 w-full h-full group-hover:opacity-0 transition-opacity duration-500">
                        <ResponsiveImage 
                          src={node.bgImage} 
                          alt={node.title} 
                          className="w-full h-full object-cover object-center" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />
                      </div>
                    )}

                    {/* HOVERED STATE BACKGROUND: Solid Background Colour */}
                    <div className="absolute inset-0 bg-[#060a12] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* CARD CONTENT LAYER */}
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div>
                        {/* Title (Always visible) */}
                        <h3 className="text-white font-black text-2xl tracking-tight leading-snug mb-3 drop-shadow-md">
                          {node.title}
                        </h3>

                        {/* NORMAL STATE: Description Text (Fades out on hover) */}
                        <div className="group-hover:opacity-0 transition-opacity duration-300">
                          <p className="text-white/70 text-xs font-medium leading-relaxed">
                            {node.description}
                          </p>
                        </div>

                        {/* HOVERED STATE: Capability List (Fades in on hover) */}
                        <div className="absolute top-12 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none group-hover:pointer-events-auto">
                          <ul className="space-y-2.5 pt-2">
                            {node.features.map((f, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-white font-semibold">
                                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* NORMAL STATE GRAPHICS (Bottom): Accent Stage Indicator & Graphic Icon (Fades out on hover) */}
                      <div className="group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                        <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                          STAGE 0{idx + 1}
                        </span>
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-white/10 border border-white/15">
                          <NodeIcon className="w-3.5 h-3.5 text-cyan-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* ══════════════════════ CUSTOM AI INSIGHTS SECTION ══════════════════════ */}
      {service.slug === 'agentic-ai' && (
        <AIInsightsSection />
      )}

      {/* ══════════════════════ INDUSTRY USE CASES ══════════════════════ */}
      {service.industryUseCases && (
        <section className="py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="mb-14">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">BY INDUSTRY</span>
              </div>
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white">
                {/* Per service. "Agents built for your industry" is right for
                    one service and wrong for the rest — the MLOps page ran it
                    over a list of models, pipelines and registries. */}
                {service.industryHeading || 'Agents built for'}<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">{service.industryHeadingHighlight || 'your industry.'}</span>
              </h2>
              <p className="mt-5 text-white/55 text-base font-medium leading-relaxed max-w-3xl">
                {service.industryLede || `Kangqore deploys ${lowerServiceName(service.name)} across ${(service.industryUseCases || []).length} regulated and complex sectors. Each engagement starts from that sector's constraints — its compliance regime, data residency rules, and legacy estate — rather than a generic template.`}
              </p>
            </div>
            <CardRail label="Industry use cases" hairline className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
              {service.industryUseCases.map((item, idx) => (
                <div key={idx} className="group bg-[#000000] p-8 flex flex-col transition-all duration-500 hover:bg-[#060a10] cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/60 group-hover:text-cyan-400 transition-colors duration-300">{item.industry}</span>
                    <span className="text-white/50 group-hover:text-cyan-400 text-xs font-bold transition-transform duration-500 group-hover:rotate-45 select-none sm:inline hidden">+</span>
                  </div>

                  {/* Expanded by default below `sm`. The collapse is driven purely
                      by group-hover, which no touch device fires — so on a phone
                      the headline, the agent list and the industry cross-link
                      were all unreachable, not merely hidden. */}
                  <div className="grid grid-rows-[1fr] sm:grid-rows-[0fr] sm:group-hover:grid-rows-[1fr] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
                    <div className="min-h-0 flex flex-col gap-4 mt-4">
                      <p className="text-white font-bold text-lg leading-snug">{item.headline}</p>
                      <ul className="space-y-2">
                        {/* `items` is the neutral key; `agents` is kept for the
                            four services that were written when this section was
                            agent-specific. An MLOps page listing "Clinical
                            Validation Agent" was describing a product we do not
                            sell here. */}
                        {(item.items || item.agents || []).map((agent, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                            <span className="text-white/50 text-sm font-medium leading-relaxed">{agent}</span>
                          </li>
                        ))}
                      </ul>
                      {/* Contextual cross-link into the industry hub. These are the
                          in-content links that build topical authority — unlike the
                          sitewide nav, which crawlers discount as boilerplate. */}
                      {industrySlug(item.industry) && (
                        <Link
                          to={`/industries/${industrySlug(item.industry)}`}
                          className="mt-2 inline-flex items-center gap-1.5 py-1 min-h-[24px] text-xs font-semibold text-cyan-400/80 hover:text-cyan-300 transition-colors"
                        >
                          {service.name} for {item.industry}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardRail>
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
          <section className="py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

              <div className="flex items-center gap-4 mb-16">
                <div className="h-[1px] w-8 bg-white/20" />
                <span className="text-[11px] font-black tracking-[0.35em] text-white/60 uppercase">Engagement Outcomes</span>
              </div>

              <CardRail label="Engagement outcomes" hairline className={`grid gap-px ${gridCols} bg-white/[0.04] rounded-2xl overflow-hidden`}>
                {allCards.map((card, idx) => (
                  <div key={idx} className={`bg-[#000000] p-6 sm:${pad} flex flex-col gap-6 sm:gap-8`}>
                    <div>
                      <span className="font-black leading-none text-white" style={{ fontSize: metricSize }}>
                        {card.metric}
                      </span>
                      <p className="text-white/50 text-sm font-semibold leading-snug max-w-[18ch] mt-2">
                        {card.metricLabel}
                      </p>
                      {card.metricContext && (
                        <p className="text-white/50 text-xs font-medium mt-1.5">{card.metricContext}</p>
                      )}
                    </div>
                    <div className="border-t border-white/[0.06] pt-6">
                      <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/60 block mb-5">
                        {card.industry}
                      </span>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[11px] font-black tracking-[0.25em] uppercase text-white/60 mb-1.5">The Challenge</p>
                          <p className="text-white/50 text-xs font-medium leading-relaxed">{card.problem}</p>
                        </div>
                        <div className="h-px bg-white/[0.05]" />
                        <div>
                          <p className="text-[11px] font-black tracking-[0.25em] uppercase text-white/60 mb-1.5">The Outcome</p>
                          <p className="text-white/85 font-semibold text-xs leading-relaxed">{card.outcome}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between flex-wrap gap-3">
                      {/* "Engagement confidential" asserts a real, named client exists.
                          Cards flagged illustrative — and the generated fallbacks, which
                          are templates rather than engagements — must not make that claim. */}
                      <p className="text-white/50 text-xs font-medium italic">
                        {card.illustrative
                          ? 'Illustrative scenario — modeled on typical engagement patterns, not a specific client result.'
                          : 'Engagement confidential — details available on request.'}
                      </p>
                      {service.methodologyBrief && (
                        <a
                          href={service.methodologyBrief}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.15em] uppercase text-white/60 hover:text-cyan-400/70 transition-colors duration-200"
                        >
                          Download Methodology
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardRail>

            </div>
          </section>
        );
      })()}

      {/* ══════════════════════ MID-PAGE CTA ══════════════════════ */}
      {service.outcomeCard && (
        <section className="py-16" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-8">
            <p className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-xl">
              {service.midCta || 'Your next workflow runs itself.'}
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
        <section id="svc-phases" className="py-16 md:py-32 overflow-hidden relative" style={{ backgroundColor: '#000000' }}>
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
                              <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-white/60 group-hover:text-white/80 uppercase transition-colors duration-500">{item.phase}</div>
                              {item.kangqore && (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-blue/10 group-hover:bg-white/15 border border-brand-blue/20 group-hover:border-white/30 rounded-full transition-colors duration-500">
                                  <div className="w-1 h-1 bg-brand-blue group-hover:bg-white rounded-full animate-pulse transition-colors duration-500" />
                                  <span className="text-[11px] font-bold tracking-[0.15em] text-brand-blue group-hover:text-white uppercase transition-colors duration-500">Kangqore</span>
                                </div>
                              )}
                            </div>
                            <h4 className="text-lg font-black text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-white/50 group-hover:text-white font-light leading-relaxed transition-colors duration-500">{item.desc}</p>
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
                    <p className="text-white/50 text-lg font-light leading-relaxed max-w-lg">
                      A connected system for moving from business goals through solution design to implementation and continuous optimization.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                    {[['Phases', String(activeJourney.length).padStart(2, '0')], ['Timeline', '4-16 wks'], ['Confidence', '100%']].map(([label, val], i) => (
                      <div key={label}>
                        <div className="font-mono text-[11px] text-white/60 tracking-widest uppercase font-bold mb-2">{label}</div>
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
        <section className="py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
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
              <p className="mt-5 text-white/55 text-base font-medium leading-relaxed max-w-3xl">
                {service.engagementLede || `There are five entry points, from a two-week advisory audit to an ongoing managed program. Most clients begin with a scoped pilot to prove the model on one workflow before committing to the wider estate.`}
              </p>
            </div>
            <CardRail label="Ways to start" hairline className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
              {service.servicePackages.map((pkg, idx) => (
                <div key={idx} className="bg-[#000000] p-7 flex flex-col gap-4 transition-colors duration-300 hover:bg-[#060a10]">
                  <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/60">0{idx + 1}</span>
                  <p className="text-white font-bold text-base leading-snug">{pkg.name}</p>
                  <p className="text-white/50 text-sm font-medium leading-relaxed flex-1">{pkg.description}</p>
                  {pkg.duration && (
                    <span className="text-[11px] font-black tracking-[0.2em] uppercase text-white/60 bg-white/[0.04] px-2 py-1 rounded-md self-start">
                      {pkg.duration}{pkg.tier && <span className="text-white/15 mx-1">·</span>}{pkg.tier && pkg.tier}
                    </span>
                  )}
                </div>
              ))}
            </CardRail>
          </div>
        </section>
      )}

      {/* ══════════════════════ TRUST PILLARS / PARTNERSHIP MODEL ══════════════════════ */}
      {/* Opt-out per service via hidePartnershipModel — the six claims here are
          generic to consultancy and add ~1,160px for ~93 words. */}
      {!service.hidePartnershipModel && (
      <section id="svc-partnership" className="py-16 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
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
          <CardRail label="How we work" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:items-start">
            {HOW_WE_WORK.map((c, i) => {
              const elevated = i === 1 || i === 4;
              return (
                <div key={c.n} className={`group relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${elevated ? 'lg:-translate-y-4' : ''}`}>
                  <div className="w-full h-40 sm:h-64 rounded-2xl overflow-hidden transition-all duration-500 sm:group-hover:h-72 shadow-lg">
                    <img src={`/assets/engines/engine${(i % 6) + 1}.png`} alt={c.title} loading="lazy" decoding="async" width="600" height="400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="relative w-[92%] mx-auto -mt-12 bg-[#06090f] border border-white/10 rounded-xl p-6 sm:p-8 shadow-2xl transition-all duration-500 group-hover:border-white/20 group-hover:bg-[#06090f] flex flex-col flex-1">
                    <h3 className="text-white font-bold text-lg sm:text-xl leading-tight mb-3">{c.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{c.desc.split('.')[0]}.</p>
                  </div>
                </div>
              );
            })}
          </CardRail>
        </div>
      </section>
      )}

      {/* ══════════════════════ TECH STACK (service-specific) ══════════════════════ */}
      {service.techStack && service.techStack.length > 0 && (
        <section className="py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
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
              <p className="text-white/50 text-sm font-medium leading-relaxed max-w-xs lg:text-right">
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
                        <p className="text-white/50 group-hover:text-white/70 text-sm font-medium leading-relaxed transition-colors duration-500">{item.desc}</p>
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
        <AIToolsSection
          title={service.toolsStack.title}
          eyebrow={service.toolsStack.eyebrow}
          titleHighlight={service.toolsStack.titleHighlight}
          subtitle={service.toolsStack.subtitle}
          items={service.toolsStack.items}
          image={
            service.slug === 'agentic-ai-led-application-modernization' ? (
              <AgenticModernization3DModel />
            ) : service.slug === 'agentic-ai' ? (
              <AgenticAI3DModel />
            ) : (
              service.toolsStack.image
            )
          }
          imageAlt={service.toolsStack.imageAlt}
        />
      )}

      {/* ══════════════════ DATA BOUNDARY ══════════════════ */}
      {/* Sits between the method and the FAQ deliberately: the method describes
          what agents do to the client's code, this describes where that code
          lives while they do it. Page-scoped — every statement here is a
          representation to an enterprise buyer, so no service inherits it by
          default. Only add the key to a service whose facts you have confirmed. */}
      {service.dataBoundary && (
        <section className="py-16 md:py-24 border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                {service.dataBoundary.eyebrow}
              </span>
            </div>
            <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6 max-w-3xl">
              {service.dataBoundary.title}{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {service.dataBoundary.titleHighlight}
              </span>
            </h2>
            {service.dataBoundary.lede && (
              <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-3xl mb-14">
                {service.dataBoundary.lede}
              </p>
            )}
            {/* Collapsed by default; a block is active only while hovered or
                focused, and leaving the grid closes it. Hover alone would lock
                out touch and keyboard, so focus and click open a block too and
                each header is a real button with aria-expanded. */}
            <div
              className="grid md:grid-cols-2 gap-x-16 gap-y-4"
              onMouseLeave={() => setOpenBoundary(null)}
            >
              {service.dataBoundary.blocks.map((b, i) => {
                const isOpen = openBoundary === i;
                const panelId = `boundary-panel-${i}`;
                return (
                  <div key={b.label} className="group" onMouseEnter={() => setOpenBoundary(i)}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onFocus={() => setOpenBoundary(i)}
                      onClick={() => setOpenBoundary(i)}
                      className="w-full text-left py-3 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    >
                      <span
                        className={`block h-[2px] rounded-full mb-5 transition-all duration-500 ${isOpen ? 'w-24' : 'w-16 opacity-60'}`}
                        style={{ background: 'linear-gradient(90deg, #2564ea, #4ab6d4)' }}
                      />
                      <span
                        className={`block font-bold text-lg leading-snug tracking-tight transition-colors duration-300 ${
                          isOpen ? 'text-white' : 'text-white/55 group-hover:text-white/80'
                        }`}
                      >
                        {b.label}
                      </span>
                      <span
                        id={panelId}
                        className="grid transition-all duration-500 ease-out motion-reduce:transition-none"
                        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                      >
                        <span className="overflow-hidden">
                          <span
                            className={`block text-white/60 text-base leading-relaxed pt-3 transition-opacity duration-300 motion-reduce:transition-none ${
                              isOpen ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            {b.body}
                          </span>
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════ FAQ ══════════════════════ */}
      <section id="svc-faq" className="py-16 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div ref={faqRef} className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-32 items-end mb-10 sm:mb-20">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">BEFORE YOU SIGN</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.2] tracking-tight text-white">
                The hard questions,<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">answered (FAQ).</span>
              </h2>
              <p className="mt-5 text-white/55 text-base font-medium leading-relaxed max-w-2xl">
                {service.faqLede || `The questions below are the ones buyers actually ask in a first call — on scope, risk, timelines and what happens when something goes wrong. Answers are direct rather than promotional.`}
              </p>
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
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-start justify-between gap-5 sm:gap-8 py-4 sm:py-7 text-left group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white'}`}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-white/20 flex-shrink-0 mt-0.5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {/* Every answer stays in the DOM and collapses via grid-template-rows
                      rather than `{isOpen && …}`. Conditional rendering meant seven of
                      eight answers did not exist in the markup — the FAQPage schema
                      described text no crawler could find on the page, which is exactly
                      the mismatch Google's FAQ guidance rejects. 0fr→1fr animates to the
                      natural height, so no max-height has to be guessed. */}
                  <div
                    id={`faq-answer-${i}`}
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-5 sm:pb-7 pr-6 sm:pr-12 space-y-4">
                        {faqParagraphs(faq.a).map((para, p) => (
                          <p key={p} className="text-white/70 text-base font-medium leading-relaxed">{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-white/[0.06]" />
          </div>
        </div>
      </section>

      {/* RELATED SERVICES section removed — 744px of page height for 87 words
          (11.7 words per 100px, among the lowest-density blocks on the page).
          The two service links it carried are still emitted in the prerender
          snapshot as <h2>Related Services</h2>, and the Practice Cluster below
          keeps a human-facing path to sibling services, so internal linking and
          topical clustering are preserved. `relatedServiceSlugs` in the data is
          still read by the prerender generator and the JSON-LD graph. */}

      {/* ══════════════════════ PRACTICE CLUSTER ══════════════════════ */}
      {clusterSiblings.length > 0 && (
        <section className="py-16 border-t border-white/[0.06]" style={{ backgroundColor: '#000000' }} aria-labelledby="practice-cluster-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{department.name}</span>
            </div>
            <h2 id="practice-cluster-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              The complete <span className="bg-brand-gradient bg-clip-text text-transparent">{department.name}</span> practice.
            </h2>
            <p className="text-white/50 text-sm font-medium leading-relaxed max-w-2xl mb-10">
              {service.name} is one of {clusterSiblings.length + 1} services in this practice. Explore how they combine.
            </p>

            <nav aria-label={`Other ${department.name} services`}>
              {/* Two columns on mobile too. This is a link index, not prose —
                  one column cost 527px of near-empty rows for 52 words. */}
              <ul className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-1">
                {clusterSiblings.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to={s.link}
                      className="group flex items-center justify-between gap-4 py-3 border-b border-white/[0.06] text-white/55 hover:text-white transition-colors duration-300"
                    >
                      <span className="text-sm font-medium leading-snug">{s.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Removed links wrapper per request */}
          </div>
        </section>
      )}

      {/* ══════════════════════ CTA ══════════════════════ */}
      <section className="py-16 md:py-32" style={{ backgroundColor: '#000000' }}>
        <div ref={ctaRef} className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 lg:gap-24 items-end">

            {/* Left — statement */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">NEXT STEP</span>
              </div>
              {/* Per service. The default promises an agent in production, which
                  is right for one service and wrong for the other 61 — on the
                  MLOps page the packages directly above say "First Model to
                  Production" and this contradicted them eight lines later. */}
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6">
                {service.closingCta?.title || 'One conversation.'}<br />
                <span className="bg-brand-gradient bg-clip-text text-transparent">{service.closingCta?.highlight || 'One agent in production.'}</span>
              </h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed max-w-xl">
                {service.closingCta?.body || 'Talk through your highest-value workflow in 30 minutes — we will scope the right entry point and show you what a production agent looks like for your context.'}
              </p>
            </div>

            {/* Right — actions + proof points */}
            <div className="flex flex-col gap-6 lg:items-end">
              <div className="flex flex-row items-center gap-6 flex-wrap">
                <Link to="/contact" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-gray-900 font-black text-sm tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                  Schedule a Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a href="/assets/kangqore-agentic-ai-playbook.pdf" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 py-1 min-h-[24px] text-white/50 font-semibold text-sm hover:text-white transition-colors duration-200">
                  Download the Playbook
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
              <div className="group/weeks flex flex-col gap-1 lg:items-end cursor-default select-none">
                <span className="text-[11px] font-black tracking-[0.25em] uppercase text-white/50 group-hover/weeks:text-white/80 transition-colors duration-300">{service.closingCta?.proofLabel || 'From first call to first agent'}</span>
                <span className="text-white/50 text-[11px] font-semibold group-hover/weeks:text-white/70 transition-colors duration-300">Strategy → Build → Production in 8 weeks</span>
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
