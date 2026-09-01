// Universal PSED-style service page for all 62 capability pages.
// Takes { service, department } props derived from servicesData / departmentsData.
// Visual design mirrors /services/product-strategy-experience-design exactly —
// black bg, cyan accents, full-screen hero, GSAP journey timeline, capabilities
// accordion, differentiators, trust pillars, FAQ, related services, CTA.
// Content is data-driven: name, shortDescription, fullDescription, keyFeatures,
// relatedServiceSlugs are the only sources — nothing is hardcoded per-service.

import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket, Zap, Target, Layers, Search,
  Cpu, Radar, ArrowRight, ChevronRight, ChevronLeft,
  TrendingUp, Users, BrainCircuit,
  ChevronDown, Activity, Shield,
  Globe, BarChart3, Network, Settings,
  Plus, X, Download, ShieldCheck, Eye, Database, Lock, UserCog
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
import { BackgroundNoiseGrid } from '../../ui/BackgroundNoiseGrid';
import { AgenticModernization3DModel } from '../../ui/AgenticModernization3DModel';
import { AgenticAI3DModel } from '../../ui/AgenticAI3DModel';
import { IntegrationEcosystemSection } from '../integration/IntegrationEcosystemSection';
import { PlatformEcosystemSection } from '../integration/PlatformEcosystemSection';
import { MLOps3DModel } from '../../ui/MLOps3DModel';
import { GenAI3DModel } from '../../ui/GenAI3DModel';
import { EnterpriseIntegration3DModel } from '../../ui/EnterpriseIntegration3DModel';
import ServiceGlassCards from './ServiceGlassCards';
import SolutionsCarousel from './SolutionsCarousel';
import { ExecutiveNewsletterSection } from './ExecutiveNewsletterSection';


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

// ─── EIP Parallax Image Card with dynamic scroll & mouse tilt ─────────────────
const EIPParallaxImageCard = ({ src, alt }) => {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });

  // Scroll parallax
  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight || 800;
      const centerOffset = (rect.top + rect.height / 2) - (windowH / 2);
      const parallaxVal = centerOffset * 0.12;
      setScrollY(parallaxVal);
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // 3D Mouse Parallax
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 7;
    const rotateY = (x / (rect.width / 2)) * 7;
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x: rotateX, y: rotateY, glareX, glareY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, active: false });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex items-center justify-start sm:justify-center w-full overflow-visible lg:mt-0 pt-0 pb-0 select-none"
      role="group"
      aria-label={alt}
      tabIndex={0}
    >
      <div className="relative w-full max-w-[540px] ml-auto">
        {/* 3D Perspective Card Container */}
        <div
          className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#0a0f1a]/90 backdrop-blur-md transition-all duration-200 ease-out group"
          style={{
            transform: tilt.active
              ? `perspective(1000px) translateY(${scrollY}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
              : `perspective(1000px) translateY(${scrollY}px) rotateX(0deg) rotateY(0deg) scale(1)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Inner Image with scrub parallax */}
          <div
            className="absolute inset-0 w-full h-[120%] -top-[10%] transition-transform duration-100 ease-out"
            style={{
              transform: `translateY(${-scrollY * 0.35}px)`,
              willChange: 'transform',
            }}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Interactive Dynamic Specular Lighting Glare */}
          {tilt.active && (
            <div
              className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 350px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.18), transparent 70%)`,
              }}
            />
          )}

          {/* Subtle perimeter neon highlight border */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 pointer-events-none z-20" />
        </div>
      </div>
    </div>
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

const DEFAULT_ARCHITECTURE_STAGE_IMAGES = [
  { image: '/images/insights/execution-gap.png', blendMode: 'multiply', objectFit: 'cover', bgColor: 'bg-gradient-to-b from-[#d5d7dc] via-[#e2e4e8] to-[#ffffff]', textColor: 'text-black', descColor: 'text-black/80' },
  { image: '/images/insights/tokenomics.png', blendMode: 'multiply', objectFit: 'contain', bgColor: 'bg-[#ffffff]', textColor: 'text-black', descColor: 'text-black/80' },
  { image: '/images/insights/pulse-of-change.png', blendMode: 'screen', objectFit: 'cover', bgColor: 'bg-[#0b062b]', textColor: 'text-white', descColor: 'text-white/80' },
  { image: '/images/insights/leadership-principles.png', blendMode: 'multiply', objectFit: 'contain', bgColor: 'bg-[#ececec]', textColor: 'text-black', descColor: 'text-black/80' },
  { image: '/images/insights/production-audit.png', blendMode: 'screen', objectFit: 'cover', bgColor: 'bg-[#0f151c]', textColor: 'text-white', descColor: 'text-white/80' },
];

// Deterministic icon from slug (no Math.random → stable across renders)

const CARD_PALETTES = [
  {
    // 01 Arctic Ice (#E6F4FF → #B3DAFF)
    bg: 'linear-gradient(135deg, #e6f4ff 0%, #b3daff 100%)',
    border: 'rgba(179, 218, 255, 0.7)',
    glow: '0 16px 40px -10px rgba(59, 130, 246, 0.25)',
    accent: '#2563EB',
    titleColor: '#0F172A',
    descColor: '#334155',
    deliverableColor: '#1E293B',
    borderDivider: 'rgba(37, 99, 235, 0.25)',
    iconBadgeBg: 'bg-white/80',
    icon: Target,
  },
  {
    // 02 Skyline Blue (#D6EBFF → #93C5FD)
    bg: 'linear-gradient(135deg, #d6ebff 0%, #93c5fd 100%)',
    border: 'rgba(147, 197, 253, 0.7)',
    glow: '0 16px 40px -10px rgba(37, 99, 235, 0.25)',
    accent: '#1D4ED8',
    titleColor: '#0F172A',
    descColor: '#1E293B',
    deliverableColor: '#0F172A',
    borderDivider: 'rgba(29, 78, 216, 0.25)',
    iconBadgeBg: 'bg-white/80',
    icon: Layers,
  },
  {
    // 03 Azure Blue (#C7E0FF → #60A5FA)
    bg: 'linear-gradient(135deg, #c7e0ff 0%, #60a5fa 100%)',
    border: 'rgba(96, 165, 250, 0.7)',
    glow: '0 16px 40px -10px rgba(29, 78, 216, 0.3)',
    accent: '#1E40AF',
    titleColor: '#0F172A',
    descColor: '#1E293B',
    deliverableColor: '#0F172A',
    borderDivider: 'rgba(30, 64, 175, 0.25)',
    iconBadgeBg: 'bg-white/80',
    icon: Shield,
  },
  {
    // 04 True Blue (#93BFFF → #3B82F6)
    bg: 'linear-gradient(135deg, #93bfff 0%, #3b82f6 100%)',
    border: 'rgba(59, 130, 246, 0.7)',
    glow: '0 16px 40px -10px rgba(59, 130, 246, 0.4)',
    accent: '#FFFFFF',
    numberColor: '#E0F2FE',
    titleColor: '#FFFFFF',
    descColor: '#F0F9FF',
    deliverableColor: '#FFFFFF',
    borderDivider: 'rgba(255, 255, 255, 0.35)',
    iconBadgeBg: 'bg-white/20 text-white',
    icon: Zap,
  },
  {
    // 05 Sapphire Blue (#60A5FA → #1D4ED8)
    bg: 'linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%)',
    border: 'rgba(29, 78, 216, 0.7)',
    glow: '0 16px 40px -10px rgba(29, 78, 216, 0.45)',
    accent: '#FFFFFF',
    numberColor: '#BFDBFE',
    titleColor: '#FFFFFF',
    descColor: '#EFF6FF',
    deliverableColor: '#FFFFFF',
    borderDivider: 'rgba(255, 255, 255, 0.35)',
    iconBadgeBg: 'bg-white/20 text-white',
    icon: Rocket,
  },
  {
    // 06 Cobalt Blue (#3B82F6 → #1E40AF)
    bg: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    border: 'rgba(30, 64, 175, 0.7)',
    glow: '0 16px 40px -10px rgba(30, 64, 175, 0.45)',
    accent: '#FFFFFF',
    numberColor: '#93C5FD',
    titleColor: '#FFFFFF',
    descColor: '#EFF6FF',
    deliverableColor: '#FFFFFF',
    borderDivider: 'rgba(255, 255, 255, 0.35)',
    iconBadgeBg: 'bg-white/20 text-white',
    icon: Cpu,
  },
  {
    // 07 Indigo Blue (#6366F1 → #4338CA)
    bg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    border: 'rgba(67, 56, 202, 0.7)',
    glow: '0 16px 40px -10px rgba(99, 102, 241, 0.45)',
    accent: '#FFFFFF',
    numberColor: '#C7D2FE',
    titleColor: '#FFFFFF',
    descColor: '#EEF2FF',
    deliverableColor: '#FFFFFF',
    borderDivider: 'rgba(255, 255, 255, 0.35)',
    iconBadgeBg: 'bg-white/20 text-white',
    icon: Radar,
  },
  {
    // 08 Navy Blue (#1E3A8A → #0F172A)
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
    border: 'rgba(30, 58, 138, 0.7)',
    glow: '0 16px 40px -10px rgba(30, 58, 138, 0.45)',
    accent: '#60A5FA',
    numberColor: '#93C5FD',
    titleColor: '#FFFFFF',
    descColor: '#E2E8F0',
    deliverableColor: '#F8FAFC',
    borderDivider: 'rgba(96, 165, 250, 0.35)',
    iconBadgeBg: 'bg-white/10 text-[#60A5FA]',
    icon: BrainCircuit,
  },
  {
    // 09 Midnight Blue (#1E293B → #0B1020)
    bg: 'linear-gradient(135deg, #1e293b 0%, #0b1020 100%)',
    border: 'rgba(30, 41, 59, 0.7)',
    glow: '0 16px 40px -10px rgba(30, 41, 59, 0.45)',
    accent: '#38BDF8',
    numberColor: '#7DD3FC',
    titleColor: '#FFFFFF',
    descColor: '#E2E8F0',
    deliverableColor: '#F8FAFC',
    borderDivider: 'rgba(56, 189, 248, 0.35)',
    iconBadgeBg: 'bg-white/10 text-[#38BDF8]',
    icon: TrendingUp,
  },
  {
    // 10 Ocean Deep (#0D47A1 → #042F6C)
    bg: 'linear-gradient(135deg, #0d47a1 0%, #042f6c 100%)',
    border: 'rgba(13, 71, 161, 0.7)',
    glow: '0 16px 40px -10px rgba(13, 71, 161, 0.45)',
    accent: '#64B5F6',
    numberColor: '#90CAF9',
    titleColor: '#FFFFFF',
    descColor: '#E3F2FD',
    deliverableColor: '#F5F5F5',
    borderDivider: 'rgba(100, 181, 246, 0.35)',
    iconBadgeBg: 'bg-white/10 text-[#64B5F6]',
    icon: Search,
  },
];

// ─── Service Package Card with Collapsible Deliverables ───────────────────────
const ServicePackageCardItem = ({ pkg, idx, offsetClass = '' }) => {
  const [expanded, setExpanded] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });
  const cardRef = useRef(null);
  const palette = CARD_PALETTES[idx % CARD_PALETTES.length];

  // Base subtle organic rotation per card index (feels like physical card floating in space)
  const baseRotations = [-2.2, 1.8, -1.5, 2.4, -1.8, 2.0];
  const baseRot = baseRotations[idx % baseRotations.length];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Calculate 3D tilt angles
    const rotateX = (-y / (rect.height / 2)) * 9;
    const rotateY = (x / (rect.width / 2)) * 9;
    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const transformStyle = tilt.active
    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(18px) scale(1.03)`
    : `perspective(1000px) rotate(${baseRot}deg) rotateX(2deg) rotateY(-2deg) translateZ(0px)`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setExpanded((prev) => !prev)}
      className={`group relative rounded-[2.2rem] p-7 flex flex-col gap-4 transition-transform duration-200 ease-out self-start w-full cursor-pointer select-none ${offsetClass}`}
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        boxShadow: tilt.active
          ? `-26px 36px 60px -12px rgba(0, 0, 0, 0.7), -8px 12px 24px -6px rgba(0, 0, 0, 0.45), inset 1.5px 1.5px 0px rgba(255, 255, 255, 0.55)`
          : `-16px 22px 42px -10px rgba(0, 0, 0, 0.6), -4px 8px 18px -4px rgba(0, 0, 0, 0.4), inset 1.5px 1.5px 0px rgba(255, 255, 255, 0.45)`,
        transform: transformStyle,
        transformStyle: 'preserve-3d',
        willChange: 'transform, box-shadow',
      }}
    >
      {/* Package Title */}
      <p className="font-extrabold text-xl sm:text-[1.35rem] leading-snug tracking-tight pointer-events-none" style={{ color: palette.titleColor }}>
        {pkg.name}
      </p>

      {/* Package Description */}
      <p className="text-sm font-medium leading-relaxed pointer-events-none" style={{ color: palette.descColor }}>
        {pkg.description}
      </p>
      
      {/* Collapsible Deliverables */}
      {Array.isArray(pkg.deliverables) && pkg.deliverables.length > 0 && (
        <div className="mt-auto pt-2 relative z-20 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="group/btn inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.2em] uppercase cursor-pointer py-1 focus:outline-none focus:ring-0 focus-visible:outline-none select-none"
            title="Read deliverables"
            style={{ color: palette.accent }}
          >
            {/* Per-package label override. "You leave with" is right for an
                engagement model, where the list is deliverables, and wrong
                wherever the list is something else (measures, preconditions).
                Falls back to the original string, so every package that does
                not set it renders exactly as before. */}
            <span>{pkg.disclosureLabel || 'You leave with'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} style={{ color: palette.accent }} />
          </button>

          {expanded && (
            <div className="mt-3 pt-3 space-y-2 relative z-20" style={{ borderTop: `1px solid ${palette.borderDivider}` }}>
              <ul className="space-y-2">
                {pkg.deliverables.map((d, di) => (
                  <li key={di} className="flex items-start gap-2.5 text-[12px] font-semibold leading-snug" style={{ color: palette.deliverableColor }}>
                    <span className="shrink-0 mt-px font-bold" style={{ color: palette.accent }}>✦</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {!Array.isArray(pkg.deliverables) && <div className="mt-auto" />}
    </div>
  );
};

// ─── Service Packages Section with 4-Card Truncation + Read More ───────────
const ServicePackagesSection = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (service.hideEngagement || !service.servicePackages || service.servicePackages.length === 0) {
    return null;
  }

  const packages = service.servicePackages;
  const hasMoreThan4 = packages.length > 4;
  const visiblePackages = hasMoreThan4 && !isExpanded ? packages.slice(0, 4) : packages;

  return (
    <section className="py-16 md:py-32 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          
          {/* Left Column: Heading & Description */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-32 flex flex-col">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.engagementEyebrow || 'HOW WE ENGAGE'}</span>
            </div>
            <h2 className="text-[2rem] sm:text-[2.6rem] lg:text-[3.2rem] font-extrabold leading-[1.15] tracking-tight text-white mb-6">
              {service.engagementHeading || 'Five ways to start.'}<br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">{service.engagementHeadingHighlight || 'One partner throughout.'}</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg font-normal leading-relaxed mb-0">
              {service.engagementLede || `Five entry points, from a three-week audit to continuous assurance. Most programs start by finding out which systems are in scope and what evidence is missing, because building controls before you know your risk tiers is the most common way governance work stalls.`}
            </p>

            {/* Read More button on Desktop Left Column */}
            {hasMoreThan4 && (
              <div className="hidden lg:block mt-8">
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-expanded={isExpanded}
                  className="text-[#60a5fa] hover:text-white py-1 min-h-[24px] font-semibold text-sm tracking-wide uppercase transition-colors inline-flex items-center gap-2 cursor-pointer select-none"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Staggered Offset Card Cluster */}
          <div className="w-full lg:w-7/12">
            <CardRail label="Ways to start" className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Column 1 (Cards 0, 2, 4...) */}
              <div className="flex flex-col gap-6 lg:gap-8">
                {visiblePackages.filter((_, idx) => idx % 2 === 0).map((pkg, idx) => {
                  const originalIdx = idx * 2;
                  return (
                    <ServicePackageCardItem
                      key={originalIdx}
                      pkg={pkg}
                      idx={originalIdx}
                      offsetClass={idx === 1 ? 'lg:translate-y-4' : idx === 2 ? 'lg:translate-y-8' : ''}
                    />
                  );
                })}
              </div>

              {/* Column 2 (Cards 1, 3, 5...) - Offset downwards for staggered cluster effect */}
              <div className="flex flex-col gap-6 lg:gap-8 lg:pt-12">
                {visiblePackages.filter((_, idx) => idx % 2 === 1).map((pkg, idx) => {
                  const originalIdx = idx * 2 + 1;
                  return (
                    <ServicePackageCardItem
                      key={originalIdx}
                      pkg={pkg}
                      idx={originalIdx}
                      offsetClass={idx === 1 ? 'lg:translate-y-6' : ''}
                    />
                  );
                })}
              </div>
            </CardRail>

            {/* Read More button on Mobile / below grid */}
            {hasMoreThan4 && (
              <div className="lg:hidden mt-8 flex justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-expanded={isExpanded}
                  className="text-[#60a5fa] hover:text-white py-1 min-h-[24px] font-semibold text-sm tracking-wide uppercase transition-colors inline-flex items-center gap-2 cursor-pointer select-none"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

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
          <h3 id={`svc-cap-${i}-title`} className={`text-2xl lg:text-3xl font-bold mb-2 transition-transform duration-300 shrink-0 ${isVibrant ? 'text-gray-900' : 'text-white'}`}>
            {cap.title}
          </h3>
          <p className={`text-xs lg:text-sm font-semibold mb-6 shrink-0 ${isVibrant ? 'text-gray-500' : 'text-white/50'}`}>
            {cap.items.length} Key Capabilities
          </p>
          <div className="relative flex-1">
            <p className={`svc-cap-desc absolute inset-0 leading-relaxed text-sm lg:text-[16px] ${isVibrant ? 'text-gray-800' : 'text-white/90'}`}>
              {cap.desc}
            </p>
            <ul className={`svc-cap-items absolute inset-0 space-y-2.5 ${isVibrant ? 'text-gray-800' : 'text-white/90'}`}>
              <span className={`block text-xs font-bold uppercase tracking-widest mb-2.5 ${isVibrant ? 'text-blue-600' : 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent'}`}>Key Capabilities:</span>
              {cap.items.slice(0, 4).map((item, j) => (
                <li key={j} className="flex items-start text-[14px] lg:text-sm font-medium">
                  <span className={`mr-2 opacity-80 ${isVibrant ? 'text-blue-600' : 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent'}`}>✦</span>
                  {item.includes(':') ? item.split(':')[0] : item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Expanded Detail Overlay */}
      <div className={`absolute inset-0 z-30 p-6 lg:p-8 flex flex-col justify-between overflow-y-auto svc-cap-no-scroll transition-all duration-500 ease-in-out border-t backdrop-blur-xl ${isVibrant ? 'bg-white/98 border-gray-200' : 'bg-[#0a0a0c]/98 border-white/10'} ${isExpanded ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`} tabIndex={isExpanded ? 0 : -1} inert={!isExpanded} aria-labelledby={`svc-cap-${i}-title`}>
        <div className="flex flex-col text-left">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border font-mono ${isVibrant ? 'text-gray-700 bg-gray-100/50 border-gray-300' : 'text-slate-300 bg-white/5 border-white/10'}`}>
              {cap.items.length} Sub-Capabilities
            </span>
          </div>
          {/* The overlay covers the card face, so a sighted reader still needs
              the title for context — but it was an <h4> repeating the <h3>
              behind it, which put all 14 titles into the outline twice. It is
              now presentational, and the panel is labeled by that <h3>.
              cap.desc was also repeated verbatim here; the reader has just
              read it on the card face, so it is gone rather than duplicated. */}
          <p aria-hidden="true" className={`text-xl sm:text-2xl font-bold mb-5 tracking-tight ${isVibrant ? 'text-gray-900' : 'text-white'}`}>
            {cap.title}
          </p>
          <ul className="space-y-3">
            {cap.items.map((item, j) => (
              <li key={j} className={`flex items-start gap-2 text-sm leading-snug ${isVibrant ? 'text-gray-800' : 'text-slate-300'}`}>
                <span className={`font-bold shrink-0 mt-0.5 ${isVibrant ? 'text-blue-600' : 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent'}`}>✦</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className={`pt-4 border-t mt-6 flex justify-between items-center pr-14 ${isVibrant ? 'border-gray-200' : 'border-white/5'}`}>
          {/* py-1 + min-h take the hit box from 16px to 24px — WCAG 2.2 AA
              target size (2.5.8). The text metrics are unchanged. */}
          <a href="/contact" className={`inline-flex items-center gap-2 py-1 min-h-[24px] text-xs sm:text-sm font-bold transition-colors group/link ${isVibrant ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent'}`}>
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
// ── Section copy that must not inherit the agentic defaults ─────────────────
// Three blocks on this template had no per-department fallback, so any service
// that did not write its own rendered the copy belonging to /services/agentic-ai:
// 56 pages headed their industry grid "Agents built for your industry" and closed
// with "One agent in production", under content about cloud migration, Salesforce
// rollouts, penetration testing and SEO. The industry grid below the heading is
// already department-aware, so the heading was the only part still contradicting it.
//
// Keyed by department, the way heroBadge and industryUseCases already are. One
// entry fixes every service in that department, and `service.X ||` below keeps a
// per-service override winning — which is how the five individually written pages
// keep their own copy.
const DEPT_SECTION_COPY = {
  foundry: {
    architectureEyebrow: 'ARCHITECTURE & DELIVERY MODEL',
    industryHeading: 'Infrastructure built for',
    industryHeadingHighlight: 'your industry.',
    midCta: 'Uptime is an architecture decision, not a hope.',
    closingCta: {
      title: 'One architecture review.',
      highlight: 'One system that holds under load.',
      body: 'Bring the service that wakes people up at night — the one that degrades under load, or takes a week to deploy safely. In 30 minutes we will tell you what is architectural, what is operational, and which of the two is actually costing you.',
    },
  },
  reimagine: {
    architectureEyebrow: 'HOW A MIGRATION IS SEQUENCED',
    industryHeading: 'Modernization shaped by',
    industryHeadingHighlight: 'your industry.',
    midCta: 'The old system still runs the business. That is the constraint.',
    closingCta: {
      title: 'One estate review.',
      highlight: 'One migration you can defend.',
      body: 'Bring the system nobody wants to touch — no tests, no documentation, one person who understands it. In 30 minutes we will tell you what can be replaced outright, what has to be strangled slowly, and what is cheaper to leave alone.',
    },
  },
  shield: {
    architectureEyebrow: 'HOW CONTROLS ARE ENFORCED',
    industryHeading: 'Controls mapped to',
    industryHeadingHighlight: 'your industry.',
    midCta: 'The audit arrives whether the evidence is ready or not.',
    closingCta: {
      title: 'One control review.',
      highlight: 'One posture you can evidence.',
      body: 'Bring your last audit finding, or the control you already know would not survive one. In 30 minutes we will tell you what is a genuine gap, what is a documentation problem, and which of the two an assessor will actually fail you on.',
    },
  },
  platforms: {
    architectureEyebrow: 'HOW A ROLLOUT IS STRUCTURED',
    industryHeading: 'Platform work grounded in',
    industryHeadingHighlight: 'your industry.',
    midCta: 'The license is bought. The value is in what you configure.',
    closingCta: {
      title: 'One platform review.',
      highlight: 'One rollout people actually use.',
      body: 'Bring the platform you have already paid for and the process it was meant to fix. In 30 minutes we will tell you what is a configuration problem, what is a process problem, and why adoption stalled where it did.',
    },
  },
  growth: {
    architectureEyebrow: 'HOW THE GROWTH LOOP IS BUILT',
    industryHeading: 'Growth work tuned to',
    industryHeadingHighlight: 'your industry.',
    midCta: 'The traffic is already arriving. Most of it leaves.',
    closingCta: {
      title: 'One funnel review.',
      highlight: 'One number that moves.',
      body: 'Bring the channel that costs the most and the page it lands on. In 30 minutes we will tell you where the spend is being wasted, what the page is failing to do, and which single change is worth testing first.',
    },
  },
  cognition: {
    architectureEyebrow: 'ARCHITECTURE & DATA FLOW',
    industryHeading: 'Intelligence built for',
    industryHeadingHighlight: 'your industry.',
    midCta: 'The data is already there. The decision still takes a week.',
    closingCta: {
      title: 'One data review.',
      highlight: 'One decision that gets faster.',
      body: 'Bring the decision that takes too long and the data you already hold about it. In 30 minutes we will tell you what a model can reliably predict, what it cannot, and whether the bottleneck is the data or the process around it.',
    },
  },
};

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
  const deptCopy = DEPT_SECTION_COPY[deptSlug] || DEPT_SECTION_COPY.cognition;
  const industryHeading = service.industryHeading || deptCopy.industryHeading;
  const industryHeadingHighlight = service.industryHeadingHighlight || deptCopy.industryHeadingHighlight;
  const architectureEyebrow = service.architectureEyebrow || deptCopy.architectureEyebrow;
  const midCta = service.midCta || deptCopy.midCta;
  const closingCta = service.closingCta || deptCopy.closingCta;

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
    architectureEyebrow,
    industryHeading,
    industryHeadingHighlight,
    midCta,
    closingCta,
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
  'manufacturing & industry': 'manufacturing',
  'edtech & higher ed': 'edtech',
  // No entry for "IT & Infrastructure" on purpose. The nearest route,
  // /industries/information-services, is content platforms and knowledge
  // management — not IT operations — so linking it would send a reader
  // somewhere that does not answer the question the card raised.
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
  // Aliases for labels used on the big-data industry grid. Only added where an
  // /industries page actually exists — an unmapped label renders without a
  // link, which is correct, rather than linking somewhere that does not answer
  // the question the card raised.
  'manufacturing & industrial': 'manufacturing',
  'retail & e-commerce': 'retail',
  ecommerce: 'retail',
  'media & entertainment ': 'media-technology',
  'media & telecommunications': 'media-technology',
  education: 'edtech',
  'education & research': 'edtech',
  'tourism & hospitality': 'travel-hospitality',
  'energy & resources': 'energy-utilities',
  // Digital process automation industry grid. Automotive, Logistics & Supply
  // Chain, Government & Public Sector and Professional Services are left
  // unmapped on purpose — no /industries page covers them, and an unlinked card
  // is better than one that lands somewhere unrelated.
  'technology & telecommunications': 'media-technology',
};

function industrySlug(label) {
  return INDUSTRY_ROUTES[String(label || '').trim().toLowerCase()] || null;
}

// Quiet conversion point for the middle of the page. Measured on
// /services/genai-business-services, there were 9,294px between the hero CTA
// and the next one — the capability grid, the comparison table, the
// architecture and the industries all carried no way to act. This is
// deliberately lighter than the full-width mid-page band so the two do not
// compete: a rule, a line of copy, and a link.
const InlineCta = ({ text, cta = 'Talk through your workflow' }) => (
  <section className="border-t border-white/[0.06]" style={{ backgroundColor: '#000000' }}>
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
      <p className="text-white/70 text-lg font-medium leading-snug max-w-2xl">{text}</p>
      <Link
        to="/contact"
        className="flex-shrink-0 inline-flex items-center gap-2 py-2 min-h-[24px] text-sm font-black tracking-wide bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors"
      >
        {cta}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </section>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function UniversalServicePage({ service: rawService, department }) {
  const service = getParityService(rawService, department);
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);

  // ── Hero H1 split: optional \n forces a hard line-1; last word of line-2 gets gradient ──
  const heroTitleSource = service.heroTitle || service.name;
  const [heroLine1, heroLineBody] = heroTitleSource.includes('\n')
    ? heroTitleSource.split('\n')
    : [null, heroTitleSource];
  const words = heroLineBody.split(' ');
  const customHighlight = service.heroTitleHighlight;
  let titleLine, titleHighlight;
  if (customHighlight && heroLineBody.includes(customHighlight)) {
    const idx = heroLineBody.lastIndexOf(customHighlight);
    titleLine = heroLineBody.slice(0, idx);
    titleHighlight = customHighlight;
  } else {
    titleHighlight = words.length > 1 ? words[words.length - 1] : heroLineBody;
    titleLine      = words.length > 1 ? words.slice(0, -1).join(' ') : '';
  }

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
  const [openFaq,          setOpenFaq]          = useState(null);
  const [isFaqExpanded,    setIsFaqExpanded]    = useState(false);
  const [activeCapability, setActiveCapability] = useState(0);
  const [activeArchNode,   setActiveArchNode]   = useState(0);
  const [archOffset,       setArchOffset]       = useState(0);
  const [isArchPaused,     setIsArchPaused]     = useState(false);
  const [expandedCaps,     setExpandedCaps]     = useState({});
  // Data-boundary blocks: none open on load, active only while hovered/focused.
  const [openBoundary,     setOpenBoundary]     = useState(null);

  // ── Architecture Automated Loop (Advances by 3 cards per batch) ─────────
  useEffect(() => {
    setArchOffset(0);
    setActiveArchNode(0);
  }, [service.slug]);

  useEffect(() => {
    const totalArch = service.architectureNodes?.length || 0;
    if (totalArch <= 3 || isArchPaused) return;

    const timer = setInterval(() => {
      setArchOffset(prev => {
        const next = (prev + 3) % totalArch;
        setActiveArchNode(next);
        return next;
      });
    }, 5500);

    return () => clearInterval(timer);
  }, [service.architectureNodes, service.slug, isArchPaused]);

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

  // Built once here rather than inline, because it renders in one of two slots.
  // Default is after the engagement band. `toolsStackAfterCapabilities` moves
  // it directly under the capability grid, for services where the stack is an
  // extension of the capability list rather than a footnote to the engagement
  // model — a platform page whose products ARE the offer reads that way, and
  // burying the product landscape below "how we engage" puts the answer after
  // the pricing. Extracting it keeps one copy of the markup, so the two slots
  // cannot drift apart.
  const isEcosystemCockpit = 
    service.departmentSlug === 'platforms' || 
    service.department === 'Platforms' ||
    service.departmentSlug === 'cognition' || 
    service.department === 'Cognition' || 
    service.departmentSlug === 'shield' || 
    service.department === 'Shield' || 
    service.departmentSlug === 'foundry' || 
    service.department === 'Foundry' || 
    service.departmentSlug === 'reimagine' || 
    service.department === 'Reimagine' || 
    service.departmentSlug === 'growth' || 
    service.department === 'Growth' || 
    [
      'enterprise-integration-platform',
      'servicenow',
      'salesforce',
      'talent-organization',
      'pimcore',
      'global-capability-centers',
      'supply-chain',
      'unified-services-management',
      'agentic-ai',
      'agentic-ai-led-application-modernization',
      'ai-cognitive-computing',
      'data-science-ai',
      'genai-business-services',
      'mlops',
      'analytics',
      'big-data',
      'digital-process-automation',
      'robotic-process-automation',
      'business-process-management',
      'intelligent-automation',
      'ai-governance',
      'it-security-services',
      'finance-risk-management',
      'quality-engineering-assurance',
      'operation-technology',
      'managed-cloud-services',
      'aws',
      'microsoft-services',
      'google-cloud-services',
      'cloud-computing',
      'embedded-design-systems',
      'engineering-foundry',
      'engineering-rd-services',
      'product-digital-engineering',
      'devops-as-a-service',
      'managed-infrastructure-services',
      'modernization-infrastructure',
      'managed-services',
      'support-maintenance',
      'software-development',
      'api-microservices-engineering',
      'internet-of-things',
      'application-modernization',
      'digital-transformation',
      'legacy-modernization',
      'technology-modernization',
      'technology-transformation',
      'digital-business-transformation',
      'technology-consulting',
      'strategy-consulting',
      'discover-frame-workshops',
      'mvp-acceleration',
      'product-strategy-experience-design',
      'blockchain',
      'cdp-strategy',
      'marketing-ai-readiness',
      'social-media-management',
      'performance-marketing',
      'seo-organic-growth-strategy',
      'growth-funnels-conversion-engineering',
      'conversion-rate-optimization',
      'campaign-planning'
    ].includes(service.slug);

  const toolsStackSection = (!service.hideToolsStack && service.toolsStack) ? (
    isEcosystemCockpit ? (
      <PlatformEcosystemSection
        eyebrow={service.toolsStack?.eyebrow}
        title={service.toolsStack?.title}
        titleHighlight={service.toolsStack?.titleHighlight}
        subtitle={service.toolsStack?.subtitle}
        items={service.toolsStack?.items}
      />
    ) : (
      <AIToolsSection
        title={service.toolsStack?.title}
        eyebrow={service.toolsStack?.eyebrow}
        titleHighlight={service.toolsStack?.titleHighlight}
        subtitle={service.toolsStack?.subtitle}
        items={service.toolsStack?.items}
        image={
          service.slug === 'agentic-ai-led-application-modernization' ? (
            <AgenticModernization3DModel />
          ) : service.slug === 'agentic-ai' ? (
            <AgenticAI3DModel />
          ) : service.slug === 'mlops' ? (
            <MLOps3DModel />
          ) : service.slug === 'genai-business-services' ? (
            <GenAI3DModel />
          ) : (
            service.toolsStack?.image
          )
        }
        imageAlt={service.toolsStack?.imageAlt}
        inlineModel={service.slug === 'mlops' || service.slug === 'genai-business-services'}
      />
    )
  ) : null;

  return (
    <div ref={sectionRef} className="text-white overflow-x-hidden font-sans selection:bg-brand-blue selection:text-white" style={{ backgroundColor: '#000000' }}>

      <SvcRuler />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <div id="svc-hero" className="p-2 h-screen" style={{ backgroundColor: 'var(--page-bg, #000)' }}>
        <div className="relative w-full h-full overflow-hidden rounded-xl text-white">

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

          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex items-center justify-between">
              <div className={`${service.heroMaxWidth || 'w-full md:max-w-[58%] lg:max-w-[60%]'} mt-[1cm] shrink-0`}>

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
              
              <ServiceGlassCards 
                faqs={faqs} 
                capabilities={service.capabilityAreas || service.keyFeatures.map((f, i) => ({ title: f, desc: featureMicros[i] }))} 
              />
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
                    className="relative flex items-center gap-3 px-3 py-2 flex-shrink-0 cursor-default group hover:-translate-y-1 transition-all duration-300 border border-white/20 hover:border-white/40"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
                  >
                      {/* Top-Left Accent Bracket */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
                      {/* Bottom-Right Accent Bracket */}
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />
                      
                      {/* HUD Inner Square */}
                      <div className="relative flex items-center justify-center w-6 h-6 border border-white/20 flex-shrink-0">
                         {/* Dot without glowing shadow */}
                         <div className="w-1.5 h-1.5 bg-white/50" />
                      </div>

                      {/* Data Values */}
                      <div className="flex flex-col justify-center pr-2">
                        <span className="text-white font-mono font-bold text-sm leading-none">
                          {String((i % HERO_CAPS.length) + 1).padStart(2, '0')}
                        </span>
                        <span className="text-white/50 font-mono text-[11px] tracking-widest uppercase mt-1 leading-tight">
                          {cap.label}
                        </span>
                      </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════ DEFINITION / OVERVIEW ══════════════════════ */}
      <section id="svc-what" className="pt-16 md:pt-24 pb-8 md:pb-12 relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <div ref={defRef} className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 transition-all duration-1000 ${defVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {!(service.whatIsSideBySideHeading || service.slug === 'enterprise-integration-platform') && (
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
                {/* `whatIsHighlightNewLine` puts the gradient clause on its own
                    line without needing a second white line to carry the break.
                    The <br> is suppressed below `sm`: forcing it there costs a
                    third line, because the first clause already wraps at 28.8px
                    in a 342px column. Desktop gets the deliberate break, mobile
                    keeps natural wrapping. */}
                {/* The two break flags used to be mutually exclusive branches of
                    one ternary, so a heading could have a break after line 1 or
                    before the highlight, never both — and a three-line heading
                    was unreachable. They compose now. Every previous combination
                    renders identically: title alone, title + line2, and
                    title + highlightNewLine all produce the same markup as
                    before. */}
                {service.whatIsTitle
                  ? <>
                      {service.whatIsTitle}
                      {service.whatIsTitleLine2 && <><br />{service.whatIsTitleLine2}</>}
                      {service.whatIsHighlightNewLine && <br className="hidden sm:block" />}
                      {' '}
                      <span className="bg-brand-gradient bg-clip-text text-transparent">{service.whatIsHighlight}</span>
                    </>
                  : <>The complete {(sectionLine || service.name).toLowerCase()}{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">{sectionHighlight.toLowerCase()} framework.</span></>
                }
              </h2>
            </div>
          )}

          <div className={`grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] gap-16 lg:gap-16 items-start ${service.slug === 'enterprise-integration-platform' ? 'mb-8' : 'mb-20'}`}>
            <div>
              {(service.whatIsSideBySideHeading || service.slug === 'enterprise-integration-platform') && (
                <div className="mb-10">
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
                  <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-0 max-w-4xl font-display">
                    {service.whatIsTitle
                      ? <>
                          {service.whatIsTitle}
                          {service.whatIsTitleLine2 && <><br />{service.whatIsTitleLine2}</>}
                          {service.whatIsHighlightNewLine && <br className="hidden sm:block" />}
                          {' '}
                          <span className="bg-brand-gradient bg-clip-text text-transparent">{service.whatIsHighlight}</span>
                        </>
                      : <>The complete {(sectionLine || service.name).toLowerCase()}{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">{sectionHighlight.toLowerCase()} framework.</span></>
                    }
                  </h2>
                </div>
              )}

              {/* data-speakable pairs with SpeakableSpecification in the page
                  schema: this is the passage a voice assistant reads aloud. */}
              <p data-speakable className="text-white/60 text-lg sm:text-xl leading-[1.7] mb-8 font-light max-w-2xl">{service.shortDescription}</p>
              <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mb-0">
                {service.whatIsPara2 || <>A service can be technically delivered and still fail if the strategy and execution are misaligned.{' '}<span className="text-white">Kangqore closes that gap.</span></>}
              </p>
              {/* Both paragraphs stay in the DOM at all times and collapse via
                  grid-template-rows, the same pattern the FAQ uses.
                  Previously whatIsPara3 was line-clamped and whatIsPara4 was
                  rendered only when expanded — so para4 did not exist in the
                  markup until somebody clicked, and neither paragraph reached
                  the prerender snapshot. Content a crawler cannot see is
                  content that was not published. `inert` keeps the collapsed
                  text out of the tab order without hiding it from the parser. */}
              {/* whatIsPara3 always shows in full; only whatIsPara4 collapses,
                  and it collapses to nothing rather than to a fraction. The
                  first cut used grid-template-rows: 0.34fr to preview part of
                  the block, which cut a sentence in half and left dead space
                  above the control. A partial-height teaser is worse than a
                  clean break: the reader sees a rendering fault, not an
                  affordance.

                  Both paragraphs stay in the DOM either way. Before this they
                  did not — para3 was line-clamped and para4 was rendered only
                  once expanded, so no crawler ever saw it. `inert` keeps the
                  collapsed paragraph out of the tab order while leaving it in
                  the markup. */}
              {/* whatIsCollapseAfterPara2: opt-in only, unset on the other 61
                  services so their para2 -> para3 (always visible) -> Read
                  More(para4) behavior above is untouched. Where set, para3
                  moves inside the collapsible panel alongside para4/para5, so
                  the fold lands right after para2 instead of after para3 —
                  /services/operation-technology asked for the fold earlier
                  because para2 alone already states the service in full and
                  para3 is elaboration, not a second load-bearing claim. */}
              {service.whatIsCollapseAfterPara2 ? (
                (service.whatIsPara3 || service.whatIsPara4) && (
                  <div className="mt-8">
                    <div
                      id="svc-whatis-more"
                      className="grid transition-all duration-500 ease-out motion-reduce:transition-none"
                      style={{ gridTemplateRows: isReadMoreExpanded ? '1fr' : '0fr' }}
                      inert={!isReadMoreExpanded}
                    >
                      <div className="overflow-hidden">
                        {service.whatIsPara3 && (
                          <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mb-0">
                            {service.whatIsPara3}
                          </p>
                        )}
                        {service.whatIsPara4 && (
                          <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mt-8 mb-0">
                            {service.whatIsPara4}
                          </p>
                        )}
                        {service.whatIsPara5 && (
                          <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mt-8 mb-0">
                            {service.whatIsPara5}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsReadMoreExpanded(!isReadMoreExpanded)}
                      aria-expanded={isReadMoreExpanded}
                      aria-controls="svc-whatis-more"
                      className="text-[#60a5fa] hover:text-white mt-4 py-1 min-h-[24px] font-semibold text-sm tracking-wide uppercase transition-colors flex items-center gap-2"
                    >
                      {isReadMoreExpanded ? 'Read Less' : 'Read More'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isReadMoreExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                )
              ) : service.whatIsPara3 && (
                <div className="mt-8">
                  <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mb-0">
                    {service.whatIsPara3}
                  </p>

                  {service.whatIsPara4 && (
                    <div
                      id="svc-whatis-more"
                      className="grid transition-all duration-500 ease-out motion-reduce:transition-none"
                      style={{ gridTemplateRows: isReadMoreExpanded ? '1fr' : '0fr' }}
                      inert={!isReadMoreExpanded}
                    >
                      <div className="overflow-hidden">
                        <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mt-8 mb-0">
                          {service.whatIsPara4}
                        </p>
                        {service.whatIsPara5 && (
                          <p className="text-lg sm:text-xl leading-[1.7] font-light max-w-2xl text-white/60 mt-8 mb-0">
                            {service.whatIsPara5}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Only rendered when there is a fourth paragraph to reveal.
                      /services/mlops sets para3 and not para4, and would
                      otherwise show a control that expands nothing.
                      aria-expanded and aria-controls pair it with the panel. */}
                  {service.whatIsPara4 && (
                    <button
                      onClick={() => setIsReadMoreExpanded(!isReadMoreExpanded)}
                      aria-expanded={isReadMoreExpanded}
                      aria-controls="svc-whatis-more"
                      /* py-1 min-h takes this over the 24x24 floor. It measured
                         110x20 and was the only WCAG 2.5.8 failure on three
                         service pages. */
                      className="text-[#60a5fa] hover:text-white mt-4 py-1 min-h-[24px] font-semibold text-sm tracking-wide uppercase transition-colors flex items-center gap-2"
                    >
                      {isReadMoreExpanded ? 'Read Less' : 'Read More'}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isReadMoreExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              )}
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
              ) : service.slug === 'genai-business-services' ? (
                /* ── Grounded Generation Flow ──
                   Replaces the shared agentic default, which labeled this page
                   AI COMMANDER, AGENTIC ORCHESTRATOR, AUTONOMOUS COMMIT and
                   REASON > PLAN > EXECUTE — an agent execution loop above a page
                   about generative systems.

                   Every label is at least 12 user units. This column renders at
                   roughly 509px against a 540-unit viewBox, a 0.94 scale, so 12
                   units reaches the screen at 11.3px and anything smaller drops
                   under the readable floor. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:sticky lg:top-32 lg:-mt-2" role="group" aria-label="Grounded generation flow — corpus to retrieval, context, generation, guardrails, and either a cited answer or a refusal" tabIndex={0}>
                  <svg viewBox="0 0 720 550" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[85%] min-w-[450px] sm:min-w-0 ml-auto">
                    <title>Generative AI Architecture</title>
                    <defs>
                      <linearGradient id="adv-blue-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa"/>
                        <stop offset="100%" stopColor="#2563eb"/>
                      </linearGradient>
                      <linearGradient id="adv-white-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="100%" stopColor="#93c5fd"/>
                      </linearGradient>
                      <linearGradient id="adv-light-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#93c5fd"/>
                        <stop offset="100%" stopColor="#3b82f6"/>
                      </linearGradient>
                      <linearGradient id="adv-slate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#334155"/>
                        <stop offset="100%" stopColor="#0f172a"/>
                      </linearGradient>
                      <linearGradient id="adv-panel-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0f172a"/>
                        <stop offset="100%" stopColor="#020617"/>
                      </linearGradient>

                      <filter id="adv-glow-blue">
                        <feGaussianBlur stdDeviation="4" result="blur1"/>
                        <feGaussianBlur stdDeviation="8" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="adv-glow-white">
                        <feGaussianBlur stdDeviation="4" result="blur1"/>
                        <feGaussianBlur stdDeviation="8" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <filter id="adv-glow-lightblue">
                        <feGaussianBlur stdDeviation="4" result="blur1"/>
                        <feGaussianBlur stdDeviation="8" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* ── BACKGROUND ORBITS / NETWORK ── */}
                    <g opacity="0.4">
                      <ellipse cx="360" cy="260" rx="220" ry="80" fill="none" stroke="#2563eb" strokeWidth="1" transform="rotate(-15 360 260)" />
                      <ellipse cx="360" cy="260" rx="280" ry="110" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="4 8" transform="rotate(25 360 260)" />
                    </g>
                    
                    {/* Background Data Streams */}
                    <path d="M 0 100 C 200 50, 450 450, 720 350" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <path d="M 0 450 C 200 500, 400 50, 720 150" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* ── TOP LAYER: DURABLE ASSETS ── */}
                    <g transform="translate(60, 20)">
                      <rect x="0" y="0" width="600" height="70" rx="12" fill="url(#adv-panel-bg)" stroke="#334155" strokeWidth="1.5" />
                      <text x="300" y="20" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="2" fill="#94a3b8">THE DURABLE ASSETS (PERSIST ACROSS WORKFLOWS)</text>
                      
                      <g transform="translate(20, 30)">
                        <rect x="0" y="0" width="130" height="30" rx="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="1" filter="url(#adv-glow-blue)"/>
                        <foreignObject x="6" y="5" width="20" height="20">
                          <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-400">
                            <Database size={16} />
                          </div>
                        </foreignObject>
                        <text x="32" y="19" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#ffffff">YOUR CORPUS</text>
                      </g>

                      <g transform="translate(160, 30)">
                        <rect x="0" y="0" width="135" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <foreignObject x="6" y="5" width="20" height="20">
                          <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-300">
                            <Settings size={16} />
                          </div>
                        </foreignObject>
                        <text x="32" y="19" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#93c5fd">RETRIEVAL CONFIG</text>
                      </g>

                      <g transform="translate(305, 30)">
                        <rect x="0" y="0" width="145" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <foreignObject x="6" y="5" width="20" height="20">
                          <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-300">
                            <Layers size={16} />
                          </div>
                        </foreignObject>
                        <text x="32" y="19" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#93c5fd">VERSIONED PROMPTS</text>
                      </g>

                      <g transform="translate(460, 30)">
                        <rect x="0" y="0" width="120" height="30" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <foreignObject x="6" y="5" width="20" height="20">
                          <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-300">
                            <BarChart3 size={16} />
                          </div>
                        </foreignObject>
                        <text x="32" y="19" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#93c5fd">EVALUATION SET</text>
                      </g>
                    </g>

                    {/* ── LEFT: ASKING USER ── */}
                    <path d="M 120 320 C 170 320, 220 300, 260 270" fill="none" stroke="#60a5fa" strokeWidth="2" filter="url(#adv-glow-blue)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
                    </path>

                    <g transform="translate(30, 260)">
                      <path d="M 10 90 L 110 90 L 95 60 L 25 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                      <rect x="25" y="20" width="70" height="40" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" filter="url(#adv-glow-blue)" />
                      <line x1="30" y1="28" x2="60" y2="28" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="36" x2="80" y2="36" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="44" x2="50" y2="44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="52" x2="70" y2="52" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                      
                      <circle cx="60" cy="5" r="16" fill="#64748b" />
                      <path d="M 30 50 C 30 25, 90 25, 90 50 L 95 90 L 25 90 Z" fill="#475569" />
                      <path d="M 90 50 C 110 50, 110 65, 90 65" fill="none" stroke="#475569" strokeWidth="12" strokeLinecap="round" />
                    </g>
                    <text x="85" y="375" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">ASKING USER</text>
                    <text x="85" y="390" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">SCOPED PERMISSIONS</text>

                    {/* ── TOP LEFT: RAG ENGINE (RETRIEVE/ASSEMBLE) ── */}
                    <g transform="translate(130, 130)">
                      <rect x="0" y="0" width="130" height="70" rx="12" fill="url(#adv-panel-bg)" stroke="#93c5fd" strokeWidth="2" filter="url(#adv-glow-lightblue)" />
                      <foreignObject x="25" y="10" width="30" height="30">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-300">
                          <Search size={24} />
                        </div>
                      </foreignObject>
                      <foreignObject x="75" y="10" width="30" height="30">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-200">
                          <BrainCircuit size={24} />
                        </div>
                      </foreignObject>
                      <text x="65" y="55" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">RETRIEVE &amp; ASSEMBLE</text>
                      <text x="65" y="68" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="monospace">CONTEXT ENGINEERING</text>
                    </g>
                    {/* Connection to Globe */}
                    <path d="M 210 200 C 240 220, 270 230, 290 240" fill="none" stroke="#60a5fa" strokeWidth="1.5" filter="url(#adv-glow-blue)" strokeDasharray="4 4">
                       <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.8s" repeatCount="indefinite" />
                    </path>

                    {/* ── TOP RIGHT: GUARDRAILS ── */}
                    <g transform="translate(470, 130)">
                      <rect x="0" y="0" width="130" height="70" rx="12" fill="url(#adv-panel-bg)" stroke="#3b82f6" strokeWidth="2" filter="url(#adv-glow-blue)" />
                      <foreignObject x="50" y="10" width="30" height="30">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-blue-400">
                          <ShieldCheck size={24} />
                        </div>
                      </foreignObject>
                      <text x="65" y="55" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">GUARDRAILS</text>
                      <text x="65" y="68" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="monospace">ON BOTH SIDES OF MODEL</text>
                    </g>
                    {/* Connection from Globe to Guardrails/Arm */}
                    <path d="M 430 240 C 470 210, 500 190, 520 180" fill="none" stroke="#60a5fa" strokeWidth="1.5" filter="url(#adv-glow-blue)" strokeDasharray="4 4">
                       <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.8s" repeatCount="indefinite" />
                    </path>

                    {/* ── RIGHT: LLM GENERATION ── */}
                    <g transform="translate(500, 240)">
                      <path d="M 0 80 L 120 80 L 100 30 L 20 30 Z" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
                      <path d="M 50 30 L 70 30 L 75 10 L 45 10 Z" fill="#334155" />
                      <path d="M 60 15 L 80 -25" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                      <circle cx="80" cy="-25" r="6" fill="#3b82f6" filter="url(#adv-glow-blue)" />
                      <path d="M 80 -25 L 40 -50" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 40 -50 L 30 -60 M 40 -50 L 50 -60" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="40" cy="-50" r="4" fill="#93c5fd" filter="url(#adv-glow-lightblue)" />
                      
                      <rect x="85" y="10" width="30" height="60" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                      <line x1="90" y1="20" x2="110" y2="20" stroke="#60a5fa" strokeWidth="2" />
                      <line x1="90" y1="35" x2="110" y2="35" stroke="#93c5fd" strokeWidth="2" />
                      <line x1="90" y1="50" x2="110" y2="50" stroke="#ffffff" strokeWidth="2" />
                    </g>
                    <text x="560" y="345" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="monospace">LLM GENERATION</text>
                    <text x="560" y="360" textAnchor="middle" fill="#94a3b8" fontSize="12" fontFamily="monospace">MODEL ROUTING</text>
                    
                    {/* Fine-Tuning Tag */}
                    <g transform="translate(520, 375)">
                      <rect x="0" y="0" width="80" height="16" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                      <text x="40" y="11" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#94a3b8">FINE-TUNING (OPT)</text>
                    </g>

                    {/* Connecting line from Globe to Generation */}
                    <path d="M 435 260 C 470 260, 490 270, 520 280" fill="none" stroke="#60a5fa" strokeWidth="2" filter="url(#adv-glow-blue)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
                    </path>


                    {/* ── CENTER GLOBE: YOUR CORPUS ── */}
                    <g transform="translate(260, 160)">
                      <circle cx="100" cy="100" r="90" fill="#0f172a" stroke="url(#adv-blue-glow)" strokeWidth="2" filter="url(#adv-glow-blue)"/>
                      <circle cx="100" cy="100" r="90" fill="url(#adv-slate-grad)" fillOpacity="0.8"/>
                      {/* Grid lines for globe effect */}
                      <ellipse cx="100" cy="100" rx="40" ry="90" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
                      <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
                      <path d="M 18 50 Q 100 80 182 50" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                      <path d="M 18 150 Q 100 120 182 150" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                      
                      {/* Center Node Icon */}
                      <circle cx="100" cy="100" r="32" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5"/>
                      <foreignObject x="75" y="75" width="50" height="50">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-blue-400">
                          <Database size={28} />
                        </div>
                      </foreignObject>
                    </g>
                    <text x="360" y="380" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold" fontFamily="monospace" letterSpacing="2">YOUR CORPUS</text>
                    <text x="360" y="395" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="monospace">GROUNDED RETRIEVAL AND ASSEMBLY</text>


                    {/* ── BOTTOM RIGHT: OUTCOMES ── */}
                    {/* Connection to Answer */}
                    <path d="M 560 395 C 560 415, 520 425, 480 435" fill="none" stroke="#ffffff" strokeWidth="2" filter="url(#adv-glow-white)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1.2s" repeatCount="indefinite" />
                    </path>
                    
                    {/* Connection to Refusal */}
                    <path d="M 560 395 C 560 430, 560 475, 480 475" fill="none" stroke="#60a5fa" strokeWidth="2" filter="url(#adv-glow-blue)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />
                    </path>

                    {/* ANSWER Box */}
                    <g transform="translate(230, 415)">
                      <rect x="0" y="0" width="250" height="40" rx="8" fill="#0f172a" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="2" filter="url(#adv-glow-white)" />
                      <foreignObject x="10" y="8" width="24" height="24">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-white">
                          <Target size={20} />
                        </div>
                      </foreignObject>
                      <text x="40" y="24" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#ffffff">ANSWER:</text>
                      <text x="90" y="24" fontFamily="monospace" fontSize="12" fill="#e2e8f0" fillOpacity="0.9">shows the exact passage it used</text>
                    </g>

                    {/* REFUSE Box */}
                    <g transform="translate(230, 465)">
                      <rect x="0" y="0" width="250" height="40" rx="8" fill="#0f172a" stroke="#60a5fa" strokeOpacity="0.8" strokeWidth="2" filter="url(#adv-glow-blue)" />
                      <foreignObject x="10" y="8" width="24" height="24">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-blue-400">
                          <Lock size={18} />
                        </div>
                      </foreignObject>
                      <text x="40" y="24" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#60a5fa">REFUSAL:</text>
                      <text x="95" y="24" fontFamily="monospace" fontSize="12" fill="#93c5fd" fillOpacity="0.9">nothing relevant; not a fault.</text>
                    </g>


                    {/* ── BASE LAYER: EVALUATION ── */}
                    <g transform="translate(60, 520)">
                      <rect x="0" y="0" width="600" height="20" rx="4" fill="#0f172a" stroke="#60a5fa" strokeOpacity="0.5" strokeWidth="1" filter="url(#adv-glow-blue)" />
                      <foreignObject x="130" y="2" width="16" height="16">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-blue-400">
                          <Activity size={12} />
                        </div>
                      </foreignObject>
                      <text x="300" y="13" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" fill="#ffffff" letterSpacing="1">EVALUATION SET PROVES IT WORKS (RUNS ON EVERY CHANGE)</text>
                    </g>
                  </svg>
                </div>
              ) : service.slug === 'ai-governance' ? (
                /* ── AI Governance Flow Diagram (Agentic Layout) ── */
                <div className="flex items-center justify-start sm:justify-center w-full lg:-mt-16 overflow-x-auto sm:overflow-visible" role="group" aria-label="AI Governance Pipeline diagram" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <defs>
                      <linearGradient id="gov-blue-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#1d4ed8"/>
                      </linearGradient>
                      <linearGradient id="gov-cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee"/>
                        <stop offset="100%" stopColor="#0891b2"/>
                      </linearGradient>
                      <linearGradient id="gov-slate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b"/>
                        <stop offset="100%" stopColor="#0f172a"/>
                      </linearGradient>

                      <filter id="glow-blue-intense-gov">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="6" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <filter id="glow-cyan-intense-gov">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="6" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* ── BACKGROUND ORBITS / NETWORK ── */}
                    <ellipse cx="270" cy="210" rx="180" ry="80" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-15 270 210)" strokeDasharray="4 8" />
                    <ellipse cx="270" cy="210" rx="220" ry="100" fill="none" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.2" transform="rotate(25 270 210)" strokeDasharray="12 4" />
                    
                    {/* Data streams (background) */}
                    <path d="M 0 100 C 150 50, 350 350, 540 300" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <path d="M 0 350 C 200 400, 300 50, 540 100" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* ── LEFT: COMPLIANCE PIPELINE / SERVER CLUSTER ── */}
                    <g transform="translate(10, 180)">
                      {/* Secure Vault / Checkpoint */}
                      <rect x="0" y="20" width="80" height="70" rx="8" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" filter="url(#glow-cyan-intense-gov)" />
                      <path d="M 10 35 L 70 35" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                      <path d="M 10 75 L 70 75" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2" />
                      {/* Checkmark inside a glowing circle */}
                      <circle cx="40" cy="55" r="14" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" filter="url(#glow-blue-intense-gov)" />
                      <path d="M 34 55 L 38 59 L 46 51" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      {/* AI nodes connecting */}
                      <line x1="20" y1="20" x2="20" y2="10" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="20" cy="10" r="3" fill="#60a5fa" />
                      <line x1="60" y1="20" x2="60" y2="10" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="60" cy="10" r="3" fill="#60a5fa" />
                    </g>
                    <text x="55" y="325" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">COMPLIANCE PIPELINE</text>
                    <text x="55" y="340" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">EU AI ACT &amp; NIST</text>

                    {/* Connection from Servers to Core */}
                    <path d="M 90 235 L 185 215" fill="none" stroke="#22d3ee" strokeWidth="2.5" filter="url(#glow-cyan-intense-gov)" strokeDasharray="8 8">
                      <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    {/* Drone 1 */}
                    <g transform="translate(137, 225)">
                      <polygon points="0,-8 10,0 0,8 -10,0" fill="#22d3ee" filter="url(#glow-cyan-intense-gov)" />
                      <circle cx="0" cy="0" r="3" fill="#0f172a" />
                    </g>

                    {/* ── TOP RIGHT: CYBERSECURITY SHIELD ── */}
                    <g transform="translate(380, 40)">
                      {/* High-tech desk / terminal */}
                      <path d="M 0 90 L 120 90 L 100 55 L 20 55 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                      <path d="M 25 20 Q 60 10 95 20 L 90 50 Q 60 40 30 50 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue-intense-gov)" />
                      {/* Screen UI */}
                      <line x1="40" y1="28" x2="80" y2="28" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                      <line x1="35" y1="36" x2="65" y2="36" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                      <line x1="75" y1="36" x2="85" y2="36" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* User silhouette */}
                      <circle cx="60" cy="-5" r="14" fill="#64748b" />
                      <path d="M 35 45 C 35 15, 85 15, 85 45 L 90 90 L 30 90 Z" fill="#475569" />
                      <path d="M 85 45 C 105 45, 105 60, 85 60" fill="none" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
                    </g>
                    <text x="440" y="155" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold" fontFamily="monospace">CYBERSECURITY SHIELD</text>
                    <text x="440" y="170" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">ZERO-TRUST ARCHITECTURE</text>

                    {/* Connection from Core to Shield */}
                    <path d="M 335 165 L 420 100" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue-intense-gov)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
                    </path>

                    {/* ── BOTTOM RIGHT: RISK MANAGEMENT ── */}
                    <g transform="translate(370, 230)">
                      {/* Radar / Continuous Assurance Scanner */}
                      <circle cx="70" cy="40" r="35" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" filter="url(#glow-cyan-intense-gov)" />
                      {/* Radar grid and sweep */}
                      <circle cx="70" cy="40" r="20" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" />
                      <line x1="35" y1="40" x2="105" y2="40" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
                      <line x1="70" y1="5" x2="70" y2="75" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.5" />
                      <path d="M 70 40 L 70 5 A 35 35 0 0 1 105 40 Z" fill="#60a5fa" fillOpacity="0.2" filter="url(#glow-blue-intense-gov)" />
                      {/* Detected Risk Blip (Neutralized) */}
                      <circle cx="85" cy="25" r="4" fill="#22d3ee" filter="url(#glow-cyan-intense-gov)" />
                      <circle cx="50" cy="55" r="3" fill="#3b82f6" />
                      {/* Connection node */}
                      <circle cx="10" cy="70" r="3" fill="#3b82f6" filter="url(#glow-blue-intense-gov)" />
                      <path d="M 10 70 L 35 40" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2 2" />
                    </g>
                    <text x="440" y="325" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">RISK MANAGEMENT</text>
                    <text x="440" y="340" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">CONTINUOUS ASSURANCE</text>

                    {/* Connection from Core to Management */}
                    <path d="M 350 210 L 415 255" fill="none" stroke="#22d3ee" strokeWidth="2.5" filter="url(#glow-cyan-intense-gov)" strokeDasharray="8 8">
                      <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1s" repeatCount="indefinite" />
                    </path>
                    <g transform="translate(382, 232)">
                      <polygon points="0,-8 10,0 0,8 -10,0" fill="#3b82f6" filter="url(#glow-blue-intense-gov)" />
                      <circle cx="0" cy="0" r="3" fill="#0f172a" />
                    </g>

                    {/* ── TOP LEFT: TRUST ── */}
                    <g transform="translate(60, 40)">
                      {/* Transparency AI Eye */}
                      <circle cx="30" cy="40" r="25" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue-intense-gov)" />
                      {/* Eye shape */}
                      <path d="M 10 40 Q 30 20 50 40 Q 30 60 10 40 Z" fill="none" stroke="#60a5fa" strokeWidth="2" />
                      <circle cx="30" cy="40" r="8" fill="#22d3ee" filter="url(#glow-cyan-intense-gov)" />
                      <circle cx="30" cy="40" r="3" fill="#0f172a" />
                    </g>
                    <text x="90" y="130" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="monospace">TRUST</text>
                    <text x="90" y="145" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">TRANSPARENCY &amp; ETHICS</text>
                    <path d="M 110 95 L 205 165" fill="none" stroke="#3b82f6" strokeWidth="1.5" filter="url(#glow-blue-intense-gov)" strokeDasharray="4 4">
                       <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.8s" repeatCount="indefinite" />
                    </path>

                    {/* ── CENTER GLOBE / AI GOVERNANCE BRAIN ── */}
                    <g transform="translate(195, 135)">
                      <circle cx="75" cy="75" r="85" fill="#0f172a" stroke="url(#gov-blue-glow)" strokeWidth="3" filter="url(#glow-blue-intense-gov)"/>
                      <circle cx="75" cy="75" r="85" fill="url(#gov-slate-grad)" fillOpacity="0.9"/>
                      
                      {/* Advanced Grid Patterns */}
                      <path d="M 20 75 L 130 75 M 75 20 L 75 130" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
                      <circle cx="75" cy="75" r="65" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="5 15">
                        <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="15s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="75" cy="75" r="55" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 6" />
                      <circle cx="75" cy="75" r="45" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="20 10">
                        <animateTransform attributeName="transform" type="rotate" from="360 75 75" to="-360 75 75" dur="10s" repeatCount="indefinite" />
                      </circle>

                      {/* Advanced Cyber Lock */}
                      <circle cx="75" cy="75" r="30" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" filter="url(#glow-cyan-intense-gov)"/>
                      <circle cx="75" cy="75" r="26" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4">
                        <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="4s" repeatCount="indefinite" />
                      </circle>
                      {/* Lock Shackle */}
                      <path d="M 67 70 L 67 60 C 67 55, 83 55, 83 60 L 83 70" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Lock Body */}
                      <rect x="63" y="70" width="24" height="18" rx="3" fill="#22d3ee" filter="url(#glow-cyan-intense-gov)" />
                      {/* Keyhole */}
                      <circle cx="75" cy="77" r="2.5" fill="#0f172a" />
                      <line x1="75" y1="79" x2="75" y2="84" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    <text x="270" y="325" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="2">AI GOVERNANCE</text>
                    <text x="270" y="340" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace">EMBEDDED CONTROL LIFECYCLE</text>
                  </svg>
                </div>
              ) : service.slug === 'ai-cognitive-computing' ? (
                /* ── Perception to Evidence ──
                   Replaces the shared agentic default, which labeled this page
                   AI COMMANDER, AGENTIC ORCHESTRATOR, AUTONOMOUS COMMIT and
                   REASON > PLAN > EXECUTE — an agent execution loop above copy
                   about reading documents, images and audio.

                   The four stages match the architectureNodes below it exactly,
                   so the summary and the detail cannot drift apart.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches the
                   screen at 11.3px. Nothing here is smaller than 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Cognitive pipeline — unstructured inputs through perception, representation and reasoning to an answer with its evidence, or a case routed to a person" tabIndex={0}>
                  <svg viewBox="0 0 540 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How a cognitive system turns unstructured input into an evidenced answer</title>
                    <desc>Documents, images, speech and sensor streams are perceived, represented as embeddings and entities, and reasoned over. Outputs above the confidence threshold return with their source; the rest route to a person.</desc>

                    <defs>
                      {/* objectBoundingBox units are not rendered on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="cog-spine" gradientUnits="userSpaceOnUse" x1="26" y1="186" x2="514" y2="186">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="cog-stage" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="212">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="cog-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="cog-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="cog-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── Inputs ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHAT YOU ALREADY HOLD</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">documents · images · video · speech · sensor streams</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#cog-tick)">
                      <line x1="81" y1="94" x2="81" y2="156" />
                    </g>
                    <text x="92" y="130" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">including the scanned and handwritten</text>

                    {/* ── The four stages, matching architectureNodes ── */}
                    <line x1="26" y1="186" x2="514" y2="186" stroke="url(#cog-spine)" strokeWidth="2" strokeOpacity="0.45" />

                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26" y="160" width="110" height="52" rx="9" fill="url(#cog-stage)" stroke="#2564ea" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="81" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">PERCEIVE</text>
                      <text x="81" y="200" fontSize="12" fill="white" fillOpacity="0.55">OCR · vision · ASR</text>

                      <rect x="152" y="160" width="110" height="52" rx="9" fill="url(#cog-stage)" stroke="#3080e6" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="207" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">REPRESENT</text>
                      <text x="207" y="200" fontSize="12" fill="white" fillOpacity="0.55">embeddings</text>

                      <rect x="278" y="160" width="110" height="52" rx="9" fill="url(#cog-stage)" stroke="#3b9ce0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="333" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">REASON</text>
                      <text x="333" y="200" fontSize="12" fill="white" fillOpacity="0.55">infer · rank</text>

                      <rect x="404" y="160" width="110" height="52" rx="9" fill="url(#cog-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="459" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">EVIDENCE</text>
                      <text x="459" y="200" fontSize="12" fill="white" fillOpacity="0.55">attribution</text>
                    </g>

                    <g stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#cog-arrow)">
                      <line x1="138" y1="186" x2="149" y2="186" />
                      <line x1="264" y1="186" x2="275" y2="186" />
                      <line x1="390" y1="186" x2="401" y2="186" />
                    </g>

                    {/* ── The confidence threshold decides the branch ── */}
                    <text x="270" y="240" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">confidence threshold you set</text>

                    <path d="M 459 214 C 459 254, 300 254, 160 254 C 150 254, 145 260, 145 272" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#cog-arrow)" />
                    <path d="M 459 214 L 459 272" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#cog-arrow-amber)" />

                    <rect x="26" y="276" width="238" height="62" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="145" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">ANSWER</text>
                    <text x="145" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">with the source it used</text>

                    <rect x="340" y="276" width="174" height="62" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="427" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">TO A PERSON</text>
                    <text x="427" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">below the threshold</text>

                    {/* ── Measurement runs across the whole path ── */}
                    <rect x="26" y="364" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="391" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">accuracy and drift measured per segment, not in aggregate</text>
                  </svg>
                </div>
              ) : service.slug === 'intelligent-automation' ? (
                /* ── Manual work to straight-through ──
                   Replaces the shared agentic default, which labeled an
                   automation page AI COMMANDER, AGENTIC ORCHESTRATOR,
                   AUTONOMOUS AGENTS and AUTONOMOUS COMMIT.

                   The four stages match the delivery path stated in the
                   what-is block, and the branch is the number this service is
                   actually measured on: straight-through rate, not bots built.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is smaller than 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Automation pipeline — manual work is discovered, orchestrated, executed by digital workers and operated, then either completes straight through or routes to a person where judgment is required" tabIndex={0}>
                  <svg viewBox="0 0 540 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How manual work becomes straight-through processing</title>
                    <desc>Invoices, claims, onboarding and exceptions are discovered through process mining, orchestrated into a workflow, executed by digital workers and document processing, and operated by a Center of Excellence. Cases above the confidence threshold complete without a person; the rest route to one.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="ia-spine" gradientUnits="userSpaceOnUse" x1="26" y1="186" x2="514" y2="186">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="ia-stage" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="212">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="ia-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="ia-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="ia-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── Inputs ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHAT YOUR PEOPLE DO BY HAND</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">invoices · claims · onboarding · reconciliations · exceptions</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#ia-tick)">
                      <line x1="81" y1="94" x2="81" y2="156" />
                    </g>
                    <text x="92" y="130" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">including the workarounds nobody documented</text>

                    {/* ── The four stages ── */}
                    <line x1="26" y1="186" x2="514" y2="186" stroke="url(#ia-spine)" strokeWidth="2" strokeOpacity="0.45" />

                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26" y="160" width="110" height="52" rx="9" fill="url(#ia-stage)" stroke="#2564ea" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="81" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">DISCOVER</text>
                      <text x="81" y="200" fontSize="12" fill="white" fillOpacity="0.55">process mining</text>

                      <rect x="152" y="160" width="110" height="52" rx="9" fill="url(#ia-stage)" stroke="#3080e6" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="207" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">ORCHESTRATE</text>
                      <text x="207" y="200" fontSize="12" fill="white" fillOpacity="0.55">workflow layer</text>

                      <rect x="278" y="160" width="110" height="52" rx="9" fill="url(#ia-stage)" stroke="#3b9ce0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="333" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">EXECUTE</text>
                      <text x="333" y="200" fontSize="12" fill="white" fillOpacity="0.55">bots · IDP · AI</text>

                      <rect x="404" y="160" width="110" height="52" rx="9" fill="url(#ia-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="459" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">OPERATE</text>
                      <text x="459" y="200" fontSize="12" fill="white" fillOpacity="0.55">CoE · monitoring</text>
                    </g>

                    <g stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ia-arrow)">
                      <line x1="138" y1="186" x2="149" y2="186" />
                      <line x1="264" y1="186" x2="275" y2="186" />
                      <line x1="390" y1="186" x2="401" y2="186" />
                    </g>

                    {/* ── The threshold decides who touches the case ── */}
                    <text x="270" y="240" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">confidence threshold you set</text>

                    <path d="M 459 214 C 459 254, 300 254, 160 254 C 150 254, 145 260, 145 272" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ia-arrow)" />
                    <path d="M 459 214 L 459 272" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#ia-arrow-amber)" />

                    <rect x="26" y="276" width="238" height="62" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="145" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">STRAIGHT THROUGH</text>
                    <text x="145" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">no person touches it</text>

                    <rect x="340" y="276" width="174" height="62" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="427" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">TO A PERSON</text>
                    <text x="427" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">judgment required</text>

                    {/* ── The number that actually matters ── */}
                    <rect x="26" y="364" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="391" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">measured on straight-through rate per process, not on bots deployed</text>
                  </svg>
                </div>
              ) : service.slug === 'big-data' ? (
                /* ── Ingest to serve ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR and AUTONOMOUS COMMIT on an
                   infrastructure page.

                   The four layers match architectureNodes below it, and the
                   branch is the argument this page makes: a green orchestrator
                   says the job ran, not that what it wrote is correct.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is smaller than 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Data platform layers — sources are ingested, stored, processed and served; contract and quality tests decide whether data reaches consumers or the pipeline stops. Cost per terabyte is measured across every layer" tabIndex={0}>
                  <svg viewBox="0 0 540 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How raw sources become data somebody downstream can trust</title>
                    <desc>Transactional systems, event streams, files and third-party feeds are ingested, stored in an open table format, processed and served. Where contract and quality tests pass, data reaches consumers; where they fail the pipeline stops rather than writing quietly. Cost per terabyte is measured across every layer.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="bd-spine" gradientUnits="userSpaceOnUse" x1="26" y1="186" x2="514" y2="186">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="bd-stage" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="212">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="bd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="bd-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="bd-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── Sources ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHAT YOU ALREADY GENERATE</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">transactions · events · sensors · files · third-party feeds</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#bd-tick)">
                      <line x1="81" y1="94" x2="81" y2="156" />
                    </g>
                    <text x="92" y="130" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">schemas that change without telling you</text>

                    {/* ── The four layers, matching architectureNodes ── */}
                    <line x1="26" y1="186" x2="514" y2="186" stroke="url(#bd-spine)" strokeWidth="2" strokeOpacity="0.45" />

                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26" y="160" width="110" height="52" rx="9" fill="url(#bd-stage)" stroke="#2564ea" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="81" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">INGEST</text>
                      <text x="81" y="200" fontSize="12" fill="white" fillOpacity="0.55">batch · CDC · stream</text>

                      <rect x="152" y="160" width="110" height="52" rx="9" fill="url(#bd-stage)" stroke="#3080e6" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="207" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">STORE</text>
                      <text x="207" y="200" fontSize="12" fill="white" fillOpacity="0.55">table format</text>

                      <rect x="278" y="160" width="110" height="52" rx="9" fill="url(#bd-stage)" stroke="#3b9ce0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="333" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">PROCESS</text>
                      <text x="333" y="200" fontSize="12" fill="white" fillOpacity="0.55">spark · SQL</text>

                      <rect x="404" y="160" width="110" height="52" rx="9" fill="url(#bd-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="459" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">SERVE</text>
                      <text x="459" y="200" fontSize="12" fill="white" fillOpacity="0.55">BI · apps · models</text>
                    </g>

                    <g stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#bd-arrow)">
                      <line x1="138" y1="186" x2="149" y2="186" />
                      <line x1="264" y1="186" x2="275" y2="186" />
                      <line x1="390" y1="186" x2="401" y2="186" />
                    </g>

                    {/* ── The tests decide which way this goes ── */}
                    <text x="270" y="240" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">contract and quality tests, at the boundary</text>

                    <path d="M 459 214 C 459 254, 300 254, 160 254 C 150 254, 145 260, 145 272" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#bd-arrow)" />
                    <path d="M 459 214 L 459 272" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#bd-arrow-amber)" />

                    <rect x="26" y="276" width="238" height="62" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="145" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">DATA REACHES CONSUMERS</text>
                    <text x="145" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">and can be traced back</text>

                    <rect x="340" y="276" width="174" height="62" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="427" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">PIPELINE STOPS</text>
                    <text x="427" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">instead of writing quietly</text>

                    {/* ── The number that decides whether it survives ── */}
                    <rect x="26" y="364" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="391" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">cost per terabyte measured at every layer, attributed to a team</text>
                  </svg>
                </div>
              ) : service.slug === 'servicenow' ? (
                /* ── What the release cadence does to a build ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on
                   a ServiceNow page. That is also measurable: the page-quality
                   rubric counts agentic vocabulary as off-topic contamination
                   on every non-agentic service, and those three labels were
                   two thirds of this page's score on that check.

                   The diagram is the page's argument rather than a product
                   map. Two family releases a year is the fixed input; the only
                   variable is which side of the split a build sits on. Baseline
                   rides the upgrade, work outside the platform model gets
                   retested every six months, and the compounding of that choice
                   is what decides whether the instance stays inside the support
                   window.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="What the ServiceNow release cadence does to a build: two named family releases ship each year; configuration kept close to baseline upgrades with the platform, while work built outside the platform model is retested and often reworked every six months; the first path stays inside the support window, the second falls out of it and needs a remediation project" tabIndex={0}>
                  <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>Why a ServiceNow build is priced twice a year</title>
                    <desc>ServiceNow ships two named family releases annually. Configuration kept close to baseline is carried by the upgrade at no additional cost. Anything built outside the platform model must be retested and frequently reworked on that same cadence, for as long as the instance lives. The first path keeps the instance inside the supported window where upgrades stay routine maintenance; the second accumulates deferrals until the instance falls out of support and getting current becomes a remediation project of its own.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="snow-spine" gradientUnits="userSpaceOnUse" x1="26" y1="150" x2="514" y2="150">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <marker id="snow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="snow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#00c875" />
                      </marker>
                      <marker id="snow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                    </defs>

                    {/* ── The fixed input ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">TWO FAMILY RELEASES A YEAR</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">Xanadu · Yokohama · Zurich · and the next one</text>

                    <line x1="270" y1="94" x2="270" y2="128" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" />
                    <text x="270" y="120" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">every build meets this, twice</text>

                    <line x1="26" y1="150" x2="506" y2="150" stroke="url(#snow-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#snow-arrow)" />

                    {/* ── The only variable: which side the build sits on ── */}
                    <rect x="26" y="172" width="230" height="104" rx="9" fill="#08160f" stroke="#00c875" strokeOpacity="0.4" strokeWidth="1.5" />
                    <text x="141" y="198" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.6" fill="#00c875">CLOSE TO BASELINE</text>
                    <text x="141" y="223" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">carried by the upgrade</text>
                    <text x="141" y="243" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">tested, not rebuilt</text>
                    <text x="141" y="263" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">cost: near zero</text>

                    <rect x="284" y="172" width="230" height="104" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.5" />
                    <text x="399" y="198" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">OUTSIDE THE MODEL</text>
                    <text x="399" y="223" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">retested every six months</text>
                    <text x="399" y="243" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">often reworked</text>
                    <text x="399" y="263" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">cost: recurring, forever</text>

                    <line x1="141" y1="278" x2="141" y2="304" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#snow-green)" />
                    <line x1="399" y1="278" x2="399" y2="304" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#snow-amber)" />

                    {/* ── Where each path ends up ── */}
                    <rect x="26" y="308" width="230" height="64" rx="9" fill="#0a1220" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="141" y="332" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">INSIDE SUPPORT</text>
                    <text x="141" y="353" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">upgrades stay routine</text>

                    <rect x="284" y="308" width="230" height="64" rx="9" fill="#0a1220" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="399" y="332" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">OUT OF WINDOW</text>
                    <text x="399" y="353" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">remediation project</text>

                    {/* ── The number the instance is held to ── */}
                    <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="419" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">upgrade lag, measured in family releases behind</text>
                  </svg>
                </div>
              ) : service.slug === 'quality-engineering-assurance' ? (
                /* ── A green run is a claim, not evidence ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on
                   a page about whether a test suite can be believed.

                   The five stages match architectureNodes exactly. The argument
                   is the annotation under the spine and the loop at the foot: a
                   suite only does work while a red build still changes what
                   somebody does next, and the stage that compounds is the one
                   connecting what escaped back to what was scoped.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12. The widest
                   stage label (ENGINEER, 8 characters at 12 units in a 96-unit
                   box) clears by 19 units each side. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="How a release decision is made: the question is whether a change is safe to ship, answered by evidence rather than by a count of passing tests; the loop runs scope, engineer, run, decide and learn; the decision either ships with evidence or holds with a recorded override; what escaped in production feeds back into what gets scoped next" tabIndex={0}>
                  <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>Why a green build is a claim rather than evidence</title>
                    <desc>A release asks one question: is this change safe to ship. The quality loop answers it in five stages — scope what is worth testing, engineer the suite as an owned product, run it fast enough to be used before merge, decide at a gate with an agreed blocking list, and learn from what reached production anyway. A red build only does work while the team still believes it, which is why flake rate is measured before coverage is widened. The decision either ships with evidence a release manager can read, or holds with the override recorded rather than silent. What escaped, and which test should have caught it, feeds back into scope.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="qea-spine" gradientUnits="userSpaceOnUse" x1="26" y1="222" x2="514" y2="222">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="qea-stage" gradientUnits="userSpaceOnUse" x1="0" y1="164" x2="0" y2="216">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="qea-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="qea-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="qea-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── The question a release actually asks ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">THE QUESTION A RELEASE ASKS</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">is this change safe to ship?</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#qea-tick)">
                      <line x1="74" y1="94" x2="74" y2="158" />
                    </g>
                    <text x="86" y="132" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">answered with evidence, not with a count of passing tests</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="164" width="96" height="52" rx="9" fill="url(#qea-stage)" stroke="#2564ea" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="74"  y="195" fontSize="12" fontWeight="bold" fill="white">SCOPE</text>

                      <rect x="124" y="164" width="96" height="52" rx="9" fill="url(#qea-stage)" stroke="#2c74e8" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="172" y="195" fontSize="12" fontWeight="bold" fill="white">ENGINEER</text>

                      <rect x="222" y="164" width="96" height="52" rx="9" fill="url(#qea-stage)" stroke="#3486e4" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="270" y="195" fontSize="12" fontWeight="bold" fill="white">RUN</text>

                      <rect x="320" y="164" width="96" height="52" rx="9" fill="url(#qea-stage)" stroke="#3f9ede" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="368" y="195" fontSize="12" fontWeight="bold" fill="white">DECIDE</text>

                      <rect x="418" y="164" width="96" height="52" rx="9" fill="url(#qea-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="466" y="195" fontSize="12" fontWeight="bold" fill="white">LEARN</text>
                    </g>

                    <line x1="26" y1="222" x2="506" y2="222" stroke="url(#qea-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#qea-arrow)" />

                    {/* ── What the whole thing rests on ── */}
                    <text x="270" y="248" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">a red build only works while the team still believes it</text>

                    <path d="M 270 256 C 270 288, 210 288, 145 288 C 138 288, 133 294, 133 302" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#qea-arrow)" />
                    <path d="M 270 256 C 270 288, 350 288, 420 288 C 427 288, 432 294, 432 302" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#qea-arrow-amber)" />

                    <rect x="26" y="306" width="214" height="66" rx="9" fill="#08160f" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="133" y="330" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">SHIP WITH EVIDENCE</text>
                    <text x="133" y="350" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">the gate can say why</text>

                    <rect x="300" y="306" width="214" height="66" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="407" y="330" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">HOLD, OR OVERRIDE</text>
                    <text x="407" y="350" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">recorded, never silent</text>

                    {/* ── The stage that compounds ── */}
                    <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <path d="M 62 407 a 9 9 0 1 0 5 -3" fill="none" stroke="#4ab6d4" strokeOpacity="0.7" strokeWidth="1.5" markerEnd="url(#qea-arrow)" />
                    <text x="290" y="419" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">what escaped, and which test should have caught it</text>
                  </svg>
                </div>
              ) : service.slug === 'supply-chain' ? (
                /* ── The engine and what it runs on ──
                   Replaces the shared agentic default, which put AGENTIC
                   ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on a
                   planning page. The argument is the page's own: the planning
                   engine is fine, the four inputs underneath it are estimates
                   nobody has revisited, and the output is a confident wrong
                   answer arriving faster than the spreadsheet it replaced.

                   The five stages match servicePackages and capabilityAreas.
                   The band underneath names the four measures the FAQ commits
                   to, each of which a planner can pull from their own system.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="A planning engine runs on lead times, bills of material, calendars and demand history; where those are unverified estimates the plan is confidently wrong. The lifecycle runs assess, select, verify, implement and operate, measured on forecast accuracy at an agreed level, inventory against service level, planner time on exceptions, and system override rate" tabIndex={0}>
                <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                  <title>Why planning tools return confident wrong answers</title>
                  <desc>A planning platform is an engine running on four inputs: lead times, bills of material, calendars and demand history. Where those are estimates nobody has revisited since the last implementation, the engine returns an answer built on them faster than the spreadsheet it replaced. Verifying the parameters is the gate before configuration. The lifecycle runs assess, select, verify, implement and operate, and is measured on forecast accuracy at an agreed level and horizon, inventory against service level, the share of planner time spent on exceptions, and the rate at which planners override the system.</desc>

                  <defs>
                    <linearGradient id="sc-spine" gradientUnits="userSpaceOnUse" x1="26" y1="286" x2="514" y2="286">
                      <stop offset="0" stopColor="#2564ea" />
                      <stop offset="1" stopColor="#4ab6d4" />
                    </linearGradient>
                    <linearGradient id="sc-stage" gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="280">
                      <stop offset="0" stopColor="#131d31" />
                      <stop offset="1" stopColor="#0a0f1a" />
                    </linearGradient>
                    <marker id="sc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                    </marker>
                    <marker id="sc-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                    </marker>
                  </defs>

                  {/* ── What the engine runs on ── */}
                  <text x="26" y="30" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.4" fill="#f59e0b">ESTIMATES NOBODY REVISITED</text>
                  <g fontFamily="monospace" textAnchor="middle">
                    <rect x="26"  y="42" width="112" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="82"  y="63" fontSize="12" fill="white" fillOpacity="0.8">LEAD TIMES</text>
                    <rect x="148" y="42" width="112" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="204" y="63" fontSize="12" fill="white" fillOpacity="0.8">BILLS OF MAT.</text>
                    <rect x="270" y="42" width="112" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="326" y="63" fontSize="12" fill="white" fillOpacity="0.8">CALENDARS</text>
                    <rect x="392" y="42" width="122" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="453" y="63" fontSize="12" fill="white" fillOpacity="0.8">DEMAND HISTORY</text>
                    <path d="M 82 80 L 258 106"  stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sc-arrow-amber)" />
                    <path d="M 204 80 L 264 104" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sc-arrow-amber)" />
                    <path d="M 326 80 L 276 104" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sc-arrow-amber)" />
                    <path d="M 453 80 L 282 106" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sc-arrow-amber)" />
                  </g>

                  {/* ── The engine ── */}
                  <rect x="150" y="112" width="240" height="40" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.16" />
                  <text x="270" y="137" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.2" fill="white" fillOpacity="0.85">THE PLANNING ENGINE</text>
                  <path d="M 270 154 L 270 174" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.4" markerEnd="url(#sc-arrow-amber)" />
                  <text x="270" y="190" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#f59e0b" fillOpacity="0.95">a confident answer, faster than the spreadsheet</text>

                  {/* ── The gate ── */}
                  <rect x="26" y="204" width="488" height="38" rx="9" fill="#0a1220" stroke="#2564ea" strokeOpacity="0.5" />
                  <text x="270" y="228" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.2" fill="#4ab6d4">VERIFY THE PARAMETERS BEFORE CONFIGURING ANYTHING</text>

                  {/* ── The lifecycle ── */}
                  <line x1="26" y1="296" x2="514" y2="296" stroke="url(#sc-spine)" strokeWidth="2" markerEnd="url(#sc-arrow)" />
                  <g fontFamily="monospace" textAnchor="middle">
                    <rect x="26"  y="262" width="88" height="30" rx="7" fill="url(#sc-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="70"  y="281" fontSize="12" fill="white" fillOpacity="0.85">ASSESS</text>
                    <rect x="126" y="262" width="88" height="30" rx="7" fill="url(#sc-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="170" y="281" fontSize="12" fill="white" fillOpacity="0.85">SELECT</text>
                    <rect x="226" y="262" width="88" height="30" rx="7" fill="url(#sc-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="270" y="281" fontSize="12" fill="white" fillOpacity="0.85">VERIFY</text>
                    <rect x="326" y="262" width="98" height="30" rx="7" fill="url(#sc-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="375" y="281" fontSize="12" fill="white" fillOpacity="0.85">IMPLEMENT</text>
                    <rect x="436" y="262" width="78" height="30" rx="7" fill="url(#sc-stage)" stroke="#4ab6d4" strokeOpacity="0.5" />
                    <text x="475" y="281" fontSize="12" fill="white" fillOpacity="0.85">OPERATE</text>
                  </g>

                  {/* ── What it is measured on ── */}
                  <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                  <text x="270" y="412" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">forecast accuracy at an agreed level · inventory vs service</text>
                  <text x="270" y="428" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">planner time on exceptions · system override rate</text>
                </svg>
                </div>
              ) : service.slug === 'salesforce' ? (
                /* ── What a decade of changes leaves behind ──
                   Replaces the shared agentic default, which put AGENTIC
                   ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on a CRM
                   page. The argument is the top contrast: an org accumulates
                   fields, layouts and three separate automation engines that
                   can all write the same record, and the assessment is the
                   gate that decides what survives before anything is built.

                   The five stages match servicePackages and capabilityAreas.
                   The band underneath names the four measures the outcome
                   tiles and the final FAQ are both held to, each of which an
                   org owner can pull from setup and login history.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="A Salesforce org after a decade of changes accumulates custom fields, page layouts, three separate automation engines and duplicated report definitions; the org health assessment is the gate before any build, and the lifecycle runs assess, retire, build, integrate and run, measured on fields with an owner, automation paths per object, seats actually signed into and metrics with one definition" tabIndex={0}>
                <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                  <title>What a decade of Salesforce changes leaves behind</title>
                  <desc>A long-lived Salesforce org accumulates custom fields nobody owns, a page layout per profile, automation split across workflow rules, Process Builder and Flow that can all update the same record, and report definitions that disagree. The org health assessment is the gate: it decides what is retired before anything new is built. The lifecycle runs assess, retire, build, integrate and run, and is measured on fields with a named owner, how many automation paths can write one object, how many purchased seats are actually signed into, and how many board-facing metrics resolve to a single definition.</desc>

                  <defs>
                    <linearGradient id="sf-spine" gradientUnits="userSpaceOnUse" x1="26" y1="286" x2="514" y2="286">
                      <stop offset="0" stopColor="#2564ea" />
                      <stop offset="1" stopColor="#4ab6d4" />
                    </linearGradient>
                    <linearGradient id="sf-stage" gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="280">
                      <stop offset="0" stopColor="#131d31" />
                      <stop offset="1" stopColor="#0a0f1a" />
                    </linearGradient>
                    <marker id="sf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                    </marker>
                    <marker id="sf-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                    </marker>
                  </defs>

                  {/* ── What accumulates ── */}
                  <text x="26" y="30" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.4" fill="#f59e0b">AFTER A DECADE OF CHANGES</text>
                  <g fontFamily="monospace" textAnchor="middle">
                    <rect x="26"  y="42" width="112" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="82"  y="63" fontSize="12" fill="white" fillOpacity="0.8">FIELDS</text>
                    <rect x="148" y="42" width="112" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="204" y="63" fontSize="12" fill="white" fillOpacity="0.8">LAYOUTS</text>
                    <rect x="270" y="42" width="112" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="326" y="63" fontSize="12" fill="white" fillOpacity="0.8">REPORTS</text>
                    <rect x="392" y="42" width="122" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                    <text x="453" y="63" fontSize="12" fill="white" fillOpacity="0.8">SEATS</text>
                  </g>

                  {/* ── Three engines, one record ── */}
                  <g fontFamily="monospace" textAnchor="middle">
                    <rect x="26"  y="96" width="152" height="32" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.3" />
                    <text x="102" y="116" fontSize="12" fill="white" fillOpacity="0.72">WORKFLOW RULES</text>
                    <rect x="194" y="96" width="152" height="32" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.3" />
                    <text x="270" y="116" fontSize="12" fill="white" fillOpacity="0.72">PROCESS BUILDER</text>
                    <rect x="362" y="96" width="152" height="32" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.3" />
                    <text x="438" y="116" fontSize="12" fill="white" fillOpacity="0.72">FLOW</text>
                    <path d="M 102 130 L 262 154" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sf-arrow-amber)" />
                    <path d="M 270 130 L 270 152" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sf-arrow-amber)" />
                    <path d="M 438 130 L 278 154" stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="1.4" markerEnd="url(#sf-arrow-amber)" />
                    <text x="270" y="176" fontSize="12" fill="#f59e0b" fillOpacity="0.95">all three can write the same record</text>
                  </g>

                  {/* ── The gate ── */}
                  <rect x="26" y="192" width="488" height="40" rx="9" fill="#0a1220" stroke="#2564ea" strokeOpacity="0.5" />
                  <text x="270" y="217" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.2" fill="#4ab6d4">ORG HEALTH ASSESSMENT — WHAT SURVIVES, WHAT RETIRES</text>

                  {/* ── The lifecycle ── */}
                  <line x1="26" y1="286" x2="514" y2="286" stroke="url(#sf-spine)" strokeWidth="2" markerEnd="url(#sf-arrow)" />
                  <g fontFamily="monospace" textAnchor="middle">
                    <rect x="26"  y="252" width="88" height="30" rx="7" fill="url(#sf-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="70"  y="271" fontSize="12" fill="white" fillOpacity="0.85">ASSESS</text>
                    <rect x="126" y="252" width="88" height="30" rx="7" fill="url(#sf-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="170" y="271" fontSize="12" fill="white" fillOpacity="0.85">RETIRE</text>
                    <rect x="226" y="252" width="88" height="30" rx="7" fill="url(#sf-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="270" y="271" fontSize="12" fill="white" fillOpacity="0.85">BUILD</text>
                    <rect x="326" y="252" width="98" height="30" rx="7" fill="url(#sf-stage)" stroke="#2564ea" strokeOpacity="0.42" />
                    <text x="375" y="271" fontSize="12" fill="white" fillOpacity="0.85">INTEGRATE</text>
                    <rect x="436" y="252" width="78" height="30" rx="7" fill="url(#sf-stage)" stroke="#4ab6d4" strokeOpacity="0.5" />
                    <text x="475" y="271" fontSize="12" fill="white" fillOpacity="0.85">RUN</text>
                  </g>

                  {/* ── The modern layer, sequenced after the foundation ── */}
                  <g fontFamily="monospace" textAnchor="middle">
                    <rect x="26"  y="312" width="236" height="34" rx="7" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="144" y="333" fontSize="12" fill="white" fillOpacity="0.7">DATA CLOUD — ONE PROFILE</text>
                    <rect x="278" y="312" width="236" height="34" rx="7" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="396" y="333" fontSize="12" fill="white" fillOpacity="0.7">AGENTFORCE — AFTER, NOT BEFORE</text>
                  </g>

                  {/* ── What it is measured on ── */}
                  <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                  <text x="270" y="412" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">fields with an owner · automation paths per object</text>
                  <text x="270" y="428" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">seats actually signed into · metrics with one definition</text>
                </svg>
                </div>
              ) : service.slug === 'unified-services-management' ? (
                /* ── Five intakes, or one ──
                   Replaces the shared Platforms default. The argument is the
                   top contrast: five functions each with their own intake,
                   their own clock and their own idea of ownership, against one
                   taxonomy every function routes through.

                   The five stages match architectureNodes below exactly. The
                   band underneath names the four measures the outcome tiles and
                   the final FAQ are both held to, all of which a service owner
                   can pull from their own tooling.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Five separate service intakes across IT, HR, facilities, legal and finance, each with its own clock and ownership model, against one taxonomy every function routes through; the lifecycle runs assess, design, build, extend and operate, measured on requests through one intake, time spent unowned, reassignment rate and catalog actually used" tabIndex={0}>
                  <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>Why one platform can still be five operating models</title>
                    <desc>IT, HR, facilities, legal and finance each run their own intake, their own response clock and their own idea of who owns a request, even on a single platform. One service model routes every function through one taxonomy with ownership that is never null. The lifecycle runs assess, design, build, extend and operate, and is measured on requests arriving through the governed intake, time spent unowned, reassignment rate and how much of the catalog is actually used.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="usm-spine" gradientUnits="userSpaceOnUse" x1="26" y1="286" x2="514" y2="286">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="usm-stage" gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="280">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="usm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="usm-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                    </defs>

                    {/* ── Five intakes ── */}
                    <text x="26" y="30" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.4" fill="#f59e0b">FIVE INTAKES, FIVE CLOCKS</text>
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="42" width="90" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                      <text x="71"  y="63" fontSize="12" fill="white" fillOpacity="0.8">IT</text>
                      <rect x="126" y="42" width="90" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                      <text x="171" y="63" fontSize="12" fill="white" fillOpacity="0.8">HR</text>
                      <rect x="226" y="42" width="90" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                      <text x="271" y="63" fontSize="12" fill="white" fillOpacity="0.8">FACILITIES</text>
                      <rect x="326" y="42" width="90" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                      <text x="371" y="63" fontSize="12" fill="white" fillOpacity="0.8">LEGAL</text>
                      <rect x="426" y="42" width="88" height="34" rx="7" fill="#171208" stroke="#f59e0b" strokeOpacity="0.35" />
                      <text x="470" y="63" fontSize="12" fill="white" fillOpacity="0.8">FINANCE</text>
                    </g>
                    <g stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#usm-arrow-amber)">
                      <line x1="71"  y1="78" x2="71"  y2="104" /><line x1="171" y1="78" x2="171" y2="104" />
                      <line x1="271" y1="78" x2="271" y2="104" /><line x1="371" y1="78" x2="371" y2="104" />
                      <line x1="470" y1="78" x2="470" y2="104" />
                    </g>
                    <text x="270" y="126" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">one license · five operating models · email fills the gaps</text>

                    {/* ── One taxonomy ── */}
                    <rect x="26" y="146" width="488" height="58" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="270" y="170" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#4ab6d4">ONE SERVICE TAXONOMY</text>
                    <text x="270" y="190" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">one intake · one clock · ownership never null</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="228" width="96" height="52" rx="9" fill="url(#usm-stage)" stroke="#2564ea" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="74"  y="259" fontSize="12" fontWeight="bold" fill="white">ASSESS</text>
                      <rect x="124" y="228" width="96" height="52" rx="9" fill="url(#usm-stage)" stroke="#2c74e8" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="172" y="259" fontSize="12" fontWeight="bold" fill="white">DESIGN</text>
                      <rect x="222" y="228" width="96" height="52" rx="9" fill="url(#usm-stage)" stroke="#3486e4" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="270" y="259" fontSize="12" fontWeight="bold" fill="white">BUILD</text>
                      <rect x="320" y="228" width="96" height="52" rx="9" fill="url(#usm-stage)" stroke="#3f9ede" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="368" y="259" fontSize="12" fontWeight="bold" fill="white">EXTEND</text>
                      <rect x="418" y="228" width="96" height="52" rx="9" fill="url(#usm-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="466" y="259" fontSize="12" fontWeight="bold" fill="white">OPERATE</text>
                    </g>
                    <line x1="26" y1="286" x2="506" y2="286" stroke="url(#usm-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#usm-arrow)" />

                    {/* ── One function at a time ── */}
                    <rect x="26" y="312" width="488" height="58" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="270" y="336" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">EXTENDED ONE FUNCTION AT A TIME</text>
                    <text x="270" y="356" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">each measured before the next one starts</text>

                    {/* ── What it is held to ── */}
                    <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="419" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">one intake · unowned time · reassignments · catalog used</text>
                  </svg>
                </div>
              ) : service.slug === 'talent-organization' ? (
                /* ── The boxes moved, the authority did not ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AUTONOMOUS COMMIT and AGENTIC ORCHESTRATOR above the fold on
                   an organization-design page. On this service that default is
                   worse than merely off-topic: a technology buyer recognises it
                   as a template artifact and reads it as nobody having built
                   the page for them.

                   The diagram is the page's own thesis. The same three
                   escalations reach the same three desks before and after a
                   reorganization, because a chart was redrawn and no decision
                   right moved. The lower half shows what a redesign changes,
                   and the band names the measures the comparison table and the
                   outcome tiles are both held to.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Why most reorganizations do not change anything: before the reorganization three escalations reach three desks, and after it the chart has been redrawn but the same escalations reach the same desks because no decision right moved. A redesign moves decision rights to named roles with thresholds and retires the forums that held them, and is measured on time to decision, internal fill, regretted attrition and layers between a customer and a yes" tabIndex={0}>
                  <svg viewBox="0 0 540 470" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>Why the chart changed and nothing else did</title>
                    <desc>Before a reorganization, escalations converge on a small number of desks. After it, the chart has been redrawn and the same escalations reach the same desks, because reporting lines moved and decision rights did not. A redesign moves those rights to named roles with defined thresholds and retires the forums that used to hold them, and is measured on time to decision, internal fill on critical roles, regretted attrition and the number of layers between a customer and a yes.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the divider below is a straight line. */}
                      <linearGradient id="to-rule" gradientUnits="userSpaceOnUse" x1="26" y1="0" x2="514" y2="0">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <marker id="to-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="to-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#00c875" />
                      </marker>
                    </defs>

                    {/* ── Before and after, and nothing changed ── */}
                    <text x="26"  y="30" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.4" fill="#f59e0b">BEFORE THE REORG</text>
                    <text x="300" y="30" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.4" fill="#f59e0b">AFTER THE ANNOUNCEMENT</text>

                    <rect x="26" y="40" width="230" height="120" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.28" />
                    <g fill="#f59e0b" fillOpacity="0.75">
                      <rect x="52"  y="58" width="46" height="17" rx="3" /><rect x="118" y="58" width="46" height="17" rx="3" /><rect x="184" y="58" width="46" height="17" rx="3" />
                    </g>
                    <g stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.5" markerEnd="url(#to-arrow-amber)">
                      <line x1="75"  y1="78" x2="103" y2="118" /><line x1="141" y1="78" x2="141" y2="118" /><line x1="207" y1="78" x2="179" y2="118" />
                    </g>
                    <g fill="#f59e0b">
                      <circle cx="103" cy="126" r="6" /><circle cx="141" cy="126" r="6" /><circle cx="179" cy="126" r="6" />
                    </g>
                    <text x="141" y="150" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">three desks</text>

                    <rect x="284" y="40" width="230" height="120" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.28" />
                    <g fill="#f59e0b" fillOpacity="0.75">
                      <rect x="300" y="58" width="40" height="17" rx="3" /><rect x="356" y="58" width="52" height="17" rx="3" /><rect x="424" y="58" width="46" height="17" rx="3" /><rect x="480" y="58" width="20" height="17" rx="3" />
                    </g>
                    <g stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.5" markerEnd="url(#to-arrow-amber)">
                      <line x1="320" y1="78" x2="361" y2="118" /><line x1="382" y1="78" x2="382" y2="118" /><line x1="447" y1="78" x2="437" y2="118" /><line x1="490" y1="78" x2="443" y2="118" />
                    </g>
                    <g fill="#f59e0b">
                      <circle cx="361" cy="126" r="6" /><circle cx="399" cy="126" r="6" /><circle cx="437" cy="126" r="6" />
                    </g>
                    <text x="399" y="150" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">the same three desks</text>

                    <text x="270" y="182" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">the chart changed · the authority did not</text>

                    <line x1="26" y1="206" x2="514" y2="206" stroke="url(#to-rule)" strokeWidth="2" strokeOpacity="0.4" />

                    {/* ── What a redesign actually moves ── */}
                    <text x="26" y="240" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.4" fill="#00c875">WHAT A REDESIGN MOVES</text>

                    <rect x="26" y="252" width="488" height="118" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.4" strokeWidth="1.5" />
                    <g fill="#00c875" fillOpacity="0.8">
                      <rect x="60"  y="274" width="60" height="18" rx="3" /><rect x="240" y="274" width="60" height="18" rx="3" /><rect x="420" y="274" width="60" height="18" rx="3" />
                    </g>
                    <text x="90"  y="308" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">named role</text>
                    <text x="270" y="308" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">named role</text>
                    <text x="450" y="308" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">named role</text>
                    <g stroke="#00c875" strokeOpacity="0.5" strokeWidth="1.5" markerEnd="url(#to-arrow)">
                      <line x1="90"  y1="316" x2="90"  y2="332" /><line x1="270" y1="316" x2="270" y2="332" /><line x1="450" y1="316" x2="450" y2="332" />
                    </g>
                    <text x="270" y="352" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.65">decision thresholds · retired forums · one owner each</text>

                    {/* ── What it is measured on ── */}
                    <rect x="26" y="390" width="488" height="60" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="414" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.8" fill="#4ab6d4">CHECKED A YEAR LATER</text>
                    <text x="270" y="434" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.75">time to decision · internal fill · attrition · layers to a yes</text>
                  </svg>
                </div>
              ) : service.slug === 'enterprise-integration-platform' ? (
                <EIPParallaxImageCard
                  src="/images/services/enterprise-integration-architecture.png"
                  alt="Kangqore team collaborating on Enterprise Integration Platform architecture"
                />
              ) : service.slug === 'finance-risk-management' ? (
                /* ── One ledger, two functions ──
                   Replaces the shared Shield default, which put Zero-Trust
                   Security Architecture, SOC Operations and Incident Mesh above
                   the fold on a Finance & Risk page. Measured before the
                   rewrite: 103 security terms and zero finance terms.

                   The five stages match architectureNodes exactly. The argument
                   is the split and the rejoin: the CFO view and the CRO view are
                   built from the same ledger by different teams, and the whole
                   page exists to say they should share a data model. So the
                   diagram forks at the top and converges at the bottom, and the
                   band underneath names the number that proves it worked.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12, and the
                   widest stage label (MODERNIZE, 9 characters at 12 units in a
                   96-unit box) clears by 15 units each side. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="How finance and risk are joined: one general ledger feeds a CFO view of forecast, close and performance and a CRO view of credit, market and liquidity exposure; the lifecycle runs assess, architect, modernize, automate and operate; both views converge on one governed finance and risk data model, measured on close days, forecast variance, exposure refresh and control coverage" tabIndex={0}>
                  <svg viewBox="0 0 540 470" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>Why the forecast and the risk report disagree about the same quarter</title>
                    <desc>One general ledger feeds two views built by different teams: a CFO view of forecast, close and performance, and a CRO view of credit, market, liquidity and counterparty exposure. The lifecycle runs assess, architect, modernize, automate and operate. Both views converge on a single governed finance and risk data model with declared lineage, measured on close days, forecast variance, exposure refresh frequency and control coverage.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="frm-spine" gradientUnits="userSpaceOnUse" x1="26" y1="286" x2="514" y2="286">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="frm-stage" gradientUnits="userSpaceOnUse" x1="0" y1="228" x2="0" y2="280">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="frm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="frm-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── The one thing both views are built from ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">ONE GENERAL LEDGER</text>
                    <rect x="26" y="46" width="488" height="44" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="74" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">transactions · positions · exposures · entities</text>

                    {/* ── Two functions read it separately ── */}
                    <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#frm-tick)">
                      <path d="M 200 92 C 200 112, 145 112, 145 128" fill="none" />
                      <path d="M 340 92 C 340 112, 395 112, 395 128" fill="none" />
                    </g>

                    <rect x="26" y="132" width="214" height="62" rx="9" fill="#0a1220" stroke="#2564ea" strokeOpacity="0.5" strokeWidth="1.5" />
                    <text x="133" y="156" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.8" fill="#7aa5f5">THE CFO VIEW</text>
                    <text x="133" y="176" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.75">forecast · close · margin</text>

                    <rect x="300" y="132" width="214" height="62" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.5" strokeWidth="1.5" />
                    <text x="407" y="156" textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="0.8" fill="#4ab6d4">THE CRO VIEW</text>
                    <text x="407" y="176" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.75">credit · market · liquidity</text>

                    <text x="270" y="214" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">same quarter, different extract, different answer</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="228" width="96" height="52" rx="9" fill="url(#frm-stage)" stroke="#2564ea" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="74"  y="259" fontSize="12" fontWeight="bold" fill="white">ASSESS</text>

                      <rect x="124" y="228" width="96" height="52" rx="9" fill="url(#frm-stage)" stroke="#2c74e8" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="172" y="259" fontSize="12" fontWeight="bold" fill="white">ARCHITECT</text>

                      <rect x="222" y="228" width="96" height="52" rx="9" fill="url(#frm-stage)" stroke="#3486e4" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="270" y="259" fontSize="12" fontWeight="bold" fill="white">MODERNIZE</text>

                      <rect x="320" y="228" width="96" height="52" rx="9" fill="url(#frm-stage)" stroke="#3f9ede" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="368" y="259" fontSize="12" fontWeight="bold" fill="white">AUTOMATE</text>

                      <rect x="418" y="228" width="96" height="52" rx="9" fill="url(#frm-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="466" y="259" fontSize="12" fontWeight="bold" fill="white">OPERATE</text>
                    </g>

                    <line x1="26" y1="286" x2="506" y2="286" stroke="url(#frm-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#frm-arrow)" />

                    {/* ── Where the two views rejoin ── */}
                    <g stroke="#00c875" strokeOpacity="0.5" strokeWidth="1.5" markerEnd="url(#frm-arrow)">
                      <path d="M 145 292 C 145 316, 240 316, 262 320" fill="none" />
                      <path d="M 395 292 C 395 316, 300 316, 278 320" fill="none" />
                    </g>

                    <rect x="26" y="326" width="488" height="66" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="270" y="350" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">ONE FINANCE AND RISK DATA MODEL</text>
                    <text x="270" y="370" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">declared lineage · one number, two views</text>

                    {/* ── What the program is held to ── */}
                    <rect x="26" y="412" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="439" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">close days · forecast variance · exposure refresh · controls</text>
                  </svg>
                </div>
              ) : service.slug === 'robotic-process-automation' ? (
                /* ── The bot depends on a surface it does not own ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on
                   a page about driving legacy interfaces.

                   The five stages match architectureNodes exactly. The argument
                   is the top band and the branch: the bot reaches systems with
                   no API through the interface, and the interface belongs to
                   somebody else's release calendar. A green run is not the same
                   as a correct one, which is why the branch tests the output
                   rather than the exit code.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12, and the
                   widest stage label (MAINTAIN, 8 characters at 12 units in a
                   96-unit box) clears by 18 units each side. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="How a bot estate stays alive: the bot drives systems with no API through their interface, and that interface changes on someone else's release calendar; the lifecycle runs qualify, design, build, deploy and maintain; each run is checked at the output, so work either completes correctly or the run is stopped rather than writing the wrong value" tabIndex={0}>
                  <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>Why a bot estate needs engineering rather than a demo</title>
                    <desc>Bots reach mainframes, thick clients, Citrix sessions and vendor portals through the only door available, the interface, which changes on somebody else's release calendar. The lifecycle runs qualify, design, build, deploy and maintain. Every run is verified at the output rather than by exit code, so work either completes correctly or the run stops instead of writing the wrong value silently. Break-fix load is measured as a share of team capacity.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="rpa-spine" gradientUnits="userSpaceOnUse" x1="26" y1="222" x2="514" y2="222">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="rpa-stage" gradientUnits="userSpaceOnUse" x1="0" y1="164" x2="0" y2="216">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="rpa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="rpa-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="rpa-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── The systems only a bot can reach ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">SYSTEMS WITH NO USABLE API</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">mainframe · thick client · Citrix · vendor portal</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#rpa-tick)">
                      <line x1="81" y1="94" x2="81" y2="158" />
                    </g>
                    <text x="92" y="132" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">reached through the interface, not an endpoint</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="164" width="96" height="52" rx="9" fill="url(#rpa-stage)" stroke="#2564ea" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="74"  y="195" fontSize="12" fontWeight="bold" fill="white">QUALIFY</text>

                      <rect x="124" y="164" width="96" height="52" rx="9" fill="url(#rpa-stage)" stroke="#2c74e8" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="172" y="195" fontSize="12" fontWeight="bold" fill="white">DESIGN</text>

                      <rect x="222" y="164" width="96" height="52" rx="9" fill="url(#rpa-stage)" stroke="#3486e4" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="270" y="195" fontSize="12" fontWeight="bold" fill="white">BUILD</text>

                      <rect x="320" y="164" width="96" height="52" rx="9" fill="url(#rpa-stage)" stroke="#3f9ede" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="368" y="195" fontSize="12" fontWeight="bold" fill="white">DEPLOY</text>

                      <rect x="418" y="164" width="96" height="52" rx="9" fill="url(#rpa-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="466" y="195" fontSize="12" fontWeight="bold" fill="white">MAINTAIN</text>
                    </g>

                    <line x1="26" y1="222" x2="506" y2="222" stroke="url(#rpa-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#rpa-arrow)" />

                    {/* ── What decides whether a run counts ── */}
                    <text x="270" y="248" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">verified at the output, not by the exit code</text>

                    <path d="M 270 256 C 270 288, 210 288, 145 288 C 138 288, 133 294, 133 302" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#rpa-arrow)" />
                    <path d="M 270 256 C 270 288, 350 288, 420 288 C 427 288, 432 294, 432 302" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#rpa-arrow-amber)" />

                    <rect x="26" y="306" width="214" height="66" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="133" y="330" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">WORK COMPLETES</text>
                    <text x="133" y="350" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">and reconciles</text>

                    <rect x="300" y="306" width="214" height="66" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="407" y="330" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">THE RUN STOPS</text>
                    <text x="407" y="350" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">instead of writing quietly</text>

                    {/* ── The number the estate is held to ── */}
                    <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="419" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">break-fix load, measured against team capacity</text>
                  </svg>
                </div>
              ) : service.slug === 'business-process-management' ? (
                /* ── Many local variants to one governed standard ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on
                   a process-governance page.

                   The five stages match architectureNodes below it exactly.
                   The argument is the top and bottom rows rather than the
                   spine: a multinational starts with the same value stream run
                   several ways in several markets, and ends with one standard
                   design plus a register of variants that each carry the
                   regulation requiring them. Retiring the undocumented ones is
                   the work; keeping the statutory ones is the point.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is under 12, and the
                   widest stage label (TRANSFORM, 9 characters at 12 units in a
                   96-unit box) clears by 15 units each side. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="How one value stream is standardized across markets: the same process runs several ways across entities and jurisdictions; the lifecycle runs discover, design, transform, govern and optimize; the result is one global standard design plus a register of statutory local variants, each carrying the regulation that requires it" tabIndex={0}>
                  <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How one value stream becomes one governed standard across every market</title>
                    <desc>The same value stream runs several ways across entities, ledgers and jurisdictions, and most of the variance is undocumented. The lifecycle runs discover, design, transform, govern and optimize. The result is a single global standard design alongside a register of statutory local variants, each carrying the regulation that requires it, an owner and a review date. Conformance is measured by market rather than assumed.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="bpm-spine" gradientUnits="userSpaceOnUse" x1="26" y1="222" x2="514" y2="222">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="bpm-stage" gradientUnits="userSpaceOnUse" x1="0" y1="164" x2="0" y2="216">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="bpm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="bpm-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="bpm-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── What a group actually starts with ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">ONE VALUE STREAM, EVERY MARKET</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">entities · ledgers · jurisdictions · acquired businesses</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#bpm-tick)">
                      <line x1="81" y1="94" x2="81" y2="158" />
                    </g>
                    <text x="92" y="132" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">and nobody knows how many variants exist</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="164" width="96" height="52" rx="9" fill="url(#bpm-stage)" stroke="#2564ea" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="74"  y="195" fontSize="12" fontWeight="bold" fill="white">DISCOVER</text>

                      <rect x="124" y="164" width="96" height="52" rx="9" fill="url(#bpm-stage)" stroke="#2c74e8" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="172" y="195" fontSize="12" fontWeight="bold" fill="white">DESIGN</text>

                      <rect x="222" y="164" width="96" height="52" rx="9" fill="url(#bpm-stage)" stroke="#3486e4" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="270" y="195" fontSize="12" fontWeight="bold" fill="white">TRANSFORM</text>

                      <rect x="320" y="164" width="96" height="52" rx="9" fill="url(#bpm-stage)" stroke="#3f9ede" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="368" y="195" fontSize="12" fontWeight="bold" fill="white">GOVERN</text>

                      <rect x="418" y="164" width="96" height="52" rx="9" fill="url(#bpm-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="466" y="195" fontSize="12" fontWeight="bold" fill="white">OPTIMIZE</text>
                    </g>

                    <line x1="26" y1="222" x2="506" y2="222" stroke="url(#bpm-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#bpm-arrow)" />

                    {/* ── The question every variant has to answer ── */}
                    <text x="270" y="248" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">which regulation requires this to be different here?</text>

                    <path d="M 270 256 C 270 288, 210 288, 145 288 C 138 288, 133 294, 133 302" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#bpm-arrow)" />
                    <path d="M 270 256 C 270 288, 350 288, 420 288 C 427 288, 432 294, 432 302" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#bpm-arrow-amber)" />

                    <rect x="26" y="306" width="214" height="66" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="133" y="330" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">ONE GLOBAL STANDARD</text>
                    <text x="133" y="350" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">owned by a named person</text>

                    <rect x="300" y="306" width="214" height="66" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="407" y="330" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">STATUTORY VARIANTS</text>
                    <text x="407" y="350" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">registered, not tolerated</text>

                    {/* ── What the program is held to ── */}
                    <rect x="26" y="392" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="419" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">conformance measured by market, not assumed</text>
                  </svg>
                </div>
              ) : service.slug === 'digital-process-automation' ? (
                /* ── Where work arrives, to where it finishes ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR and AUTONOMOUS COMMIT above the fold on
                   a process-digitization page and accounted for most of the
                   off-topic word count.

                   The five stages match architectureNodes below it exactly. The
                   case record is drawn as the center of the diagram because it
                   is the argument this page makes: without one, work has no
                   state, no owner and no trail, and automating it just moves an
                   unmanaged process faster.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is smaller than 12, and
                   the widest label (ORCHESTRATE, 11 characters at 12 units in a
                   96-unit box) clears by 7 units each side. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="How a digital process runs: work arrives through email, portals, phone, documents and APIs; the lifecycle runs discover, design, digitize, orchestrate and optimize; a single case record holds state, owner, SLA and audit trail, from which cases either complete untouched or route to human review with context assembled" tabIndex={0}>
                  <svg viewBox="0 0 540 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How work with no system of its own becomes a governed digital process</title>
                    <desc>Work arrives through email, portals, phone, documents and APIs with no case record behind it. The lifecycle runs discover, design, digitize, orchestrate and optimize. A single case record then holds state, owner, SLA and audit trail; from there cases either complete untouched or route to human review with context already assembled. Straight-through rate is measured against the baseline.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="dpa-spine" gradientUnits="userSpaceOnUse" x1="26" y1="222" x2="514" y2="222">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="dpa-stage" gradientUnits="userSpaceOnUse" x1="0" y1="164" x2="0" y2="216">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="dpa-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="dpa-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="dpa-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── Where the work turns up ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHERE WORK ARRIVES TODAY</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">email · portal · phone · PDF · shared mailbox · API</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#dpa-tick)">
                      <line x1="81" y1="94" x2="81" y2="158" />
                    </g>
                    <text x="92" y="132" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">and none of it has a case record</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26"  y="164" width="96" height="52" rx="9" fill="url(#dpa-stage)" stroke="#2564ea" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="74"  y="195" fontSize="12" fontWeight="bold" fill="white">DISCOVER</text>

                      <rect x="124" y="164" width="96" height="52" rx="9" fill="url(#dpa-stage)" stroke="#2c74e8" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="172" y="195" fontSize="12" fontWeight="bold" fill="white">DESIGN</text>

                      <rect x="222" y="164" width="96" height="52" rx="9" fill="url(#dpa-stage)" stroke="#3486e4" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="270" y="195" fontSize="12" fontWeight="bold" fill="white">DIGITIZE</text>

                      <rect x="320" y="164" width="96" height="52" rx="9" fill="url(#dpa-stage)" stroke="#3f9ede" strokeOpacity="0.6"  strokeWidth="1.5" />
                      <text x="368" y="195" fontSize="12" fontWeight="bold" fill="white">ORCHESTRATE</text>

                      <rect x="418" y="164" width="96" height="52" rx="9" fill="url(#dpa-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="466" y="195" fontSize="12" fontWeight="bold" fill="white">OPTIMIZE</text>
                    </g>

                    <line x1="26" y1="222" x2="506" y2="222" stroke="url(#dpa-spine)" strokeWidth="2" strokeOpacity="0.45" markerEnd="url(#dpa-arrow)" />

                    {/* ── The thing that holds it together ── */}
                    <rect x="26" y="248" width="488" height="58" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="270" y="272" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#4ab6d4">ONE CASE RECORD</text>
                    <text x="270" y="292" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">state · owner · SLA · audit trail</text>

                    {/* ── Which way a case goes ── */}
                    <path d="M 270 308 C 270 336, 210 336, 145 336 C 138 336, 133 342, 133 350" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#dpa-arrow)" />
                    <path d="M 270 308 C 270 336, 350 336, 420 336 C 427 336, 432 342, 432 350" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#dpa-arrow-amber)" />

                    <rect x="26" y="354" width="214" height="60" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="133" y="378" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">COMPLETES UNTOUCHED</text>
                    <text x="133" y="398" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">straight through</text>

                    <rect x="340" y="354" width="174" height="60" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="427" y="378" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">HUMAN REVIEW</text>
                    <text x="427" y="398" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">context assembled</text>

                    {/* ── The number the program is held to ── */}
                    <text x="270" y="438" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">straight-through rate, measured against the baseline</text>
                  </svg>
                </div>
              ) : service.slug === 'analytics' ? (
                /* ── Data to a decision that changes ──
                   Replaces the shared agentic default, which put AI COMMANDER,
                   AGENTIC ORCHESTRATOR, REASON > PLAN > EXECUTE and AUTONOMOUS
                   COMMIT on an analytics page. The off-topic word count scored
                   clean at 4 because SVG labels are terse -- the metric counts
                   words, not whether a whole diagram belongs to another product.

                   The four stages match architectureNodes below it, and the
                   branch is the argument the page actually makes: the ladder is
                   worthless if the number gets disputed in the meeting.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is smaller than 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Analytics lifecycle — enterprise data passes through understand, anticipate, decide and respond; on one agreed definition a decision changes, without it the number gets disputed. Governance runs underneath all four stages" tabIndex={0}>
                  <svg viewBox="0 0 540 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How enterprise data becomes a decision that actually changes</title>
                    <desc>Warehouse tables, events, applications and spreadsheets move through four stages: understand what happened, anticipate what is likely, decide what to do, respond while it still matters. Where one agreed definition exists the decision changes; where it does not, the number is disputed instead. Lineage, quality and controls sit underneath every stage.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="an-spine" gradientUnits="userSpaceOnUse" x1="26" y1="186" x2="514" y2="186">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="an-stage" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="212">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="an-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="an-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="an-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── Inputs ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHAT YOU ALREADY MEASURE</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">warehouse · events · applications · the spreadsheets nobody admits to</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#an-tick)">
                      <line x1="81" y1="94" x2="81" y2="156" />
                    </g>
                    <text x="92" y="130" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">four teams, four definitions of revenue</text>

                    {/* ── The four stages, matching architectureNodes ── */}
                    <line x1="26" y1="186" x2="514" y2="186" stroke="url(#an-spine)" strokeWidth="2" strokeOpacity="0.45" />

                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26" y="160" width="110" height="52" rx="9" fill="url(#an-stage)" stroke="#2564ea" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="81" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">UNDERSTAND</text>
                      <text x="81" y="200" fontSize="12" fill="white" fillOpacity="0.55">what happened</text>

                      <rect x="152" y="160" width="110" height="52" rx="9" fill="url(#an-stage)" stroke="#3080e6" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="207" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">ANTICIPATE</text>
                      <text x="207" y="200" fontSize="12" fill="white" fillOpacity="0.55">what is likely</text>

                      <rect x="278" y="160" width="110" height="52" rx="9" fill="url(#an-stage)" stroke="#3b9ce0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="333" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">DECIDE</text>
                      <text x="333" y="200" fontSize="12" fill="white" fillOpacity="0.55">what to do</text>

                      <rect x="404" y="160" width="110" height="52" rx="9" fill="url(#an-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="459" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">RESPOND</text>
                      <text x="459" y="200" fontSize="12" fill="white" fillOpacity="0.55">while it matters</text>
                    </g>

                    <g stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#an-arrow)">
                      <line x1="138" y1="186" x2="149" y2="186" />
                      <line x1="264" y1="186" x2="275" y2="186" />
                      <line x1="390" y1="186" x2="401" y2="186" />
                    </g>

                    {/* ── One definition decides which way this goes ── */}
                    <text x="270" y="240" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">one agreed definition, or none</text>

                    <path d="M 459 214 C 459 254, 300 254, 160 254 C 150 254, 145 260, 145 272" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#an-arrow)" />
                    <path d="M 459 214 L 459 272" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#an-arrow-amber)" />

                    <rect x="26" y="276" width="238" height="62" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="145" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">A DECISION CHANGES</text>
                    <text x="145" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">and somebody owns it</text>

                    <rect x="340" y="276" width="174" height="62" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="427" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">THE MEETING</text>
                    <text x="427" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">reconciles the numbers</text>

                    {/* ── The foundation under all four stages ── */}
                    <rect x="26" y="364" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="391" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">lineage, quality and controls run under every stage above</text>
                  </svg>
                </div>
              ) : service.slug === 'data-science-ai' ? (
                /* ── Data to a decision ──
                   Replaces the shared agentic default, which labeled a data
                   science page AI COMMANDER, AGENTIC ORCHESTRATOR, AUTONOMOUS
                   AGENTS and AUTONOMOUS COMMIT.

                   The four stages match architectureNodes below it exactly, so
                   the summary and the detail cannot drift apart.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is smaller than 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="Data science pipeline — records you already hold pass through features, a model and validation, then serve either a decision with its reason or a case routed to a person" tabIndex={0}>
                  <svg viewBox="0 0 540 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How a data science pipeline turns records into a decision</title>
                    <desc>Transactions, claims, sensor readings and CRM records become features, feed a model, are validated per segment, and are served. Predictions above the confidence threshold return with the reason that drove them; the rest route to a person.</desc>

                    <defs>
                      {/* objectBoundingBox units do not render on a zero-height
                          element, and the spine below is a straight line. */}
                      <linearGradient id="ds-spine" gradientUnits="userSpaceOnUse" x1="26" y1="186" x2="514" y2="186">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="ds-stage" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="212">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="ds-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="ds-arrow-amber" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" />
                      </marker>
                      <marker id="ds-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── Inputs ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHAT YOU ALREADY RECORD</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">transactions · claims · sensor readings · CRM history</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#ds-tick)">
                      <line x1="81" y1="94" x2="81" y2="156" />
                    </g>
                    <text x="92" y="130" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">including the columns nobody trusts yet</text>

                    {/* ── The four stages, matching architectureNodes ── */}
                    <line x1="26" y1="186" x2="514" y2="186" stroke="url(#ds-spine)" strokeWidth="2" strokeOpacity="0.45" />

                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26" y="160" width="110" height="52" rx="9" fill="url(#ds-stage)" stroke="#2564ea" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="81" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">FEATURES</text>
                      <text x="81" y="200" fontSize="12" fill="white" fillOpacity="0.55">joins · lineage</text>

                      <rect x="152" y="160" width="110" height="52" rx="9" fill="url(#ds-stage)" stroke="#3080e6" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="207" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">MODEL</text>
                      <text x="207" y="200" fontSize="12" fill="white" fillOpacity="0.55">baseline first</text>

                      <rect x="278" y="160" width="110" height="52" rx="9" fill="url(#ds-stage)" stroke="#3b9ce0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="333" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">VALIDATE</text>
                      <text x="333" y="200" fontSize="12" fill="white" fillOpacity="0.55">per segment</text>

                      <rect x="404" y="160" width="110" height="52" rx="9" fill="url(#ds-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="459" y="182" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="white">SERVE</text>
                      <text x="459" y="200" fontSize="12" fill="white" fillOpacity="0.55">where it is used</text>
                    </g>

                    <g stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ds-arrow)">
                      <line x1="138" y1="186" x2="149" y2="186" />
                      <line x1="264" y1="186" x2="275" y2="186" />
                      <line x1="390" y1="186" x2="401" y2="186" />
                    </g>

                    {/* ── The confidence threshold decides the branch ── */}
                    <text x="270" y="240" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">confidence threshold you set</text>

                    <path d="M 459 214 C 459 254, 300 254, 160 254 C 150 254, 145 260, 145 272" fill="none" stroke="#00c875" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ds-arrow)" />
                    <path d="M 459 214 L 459 272" fill="none" stroke="#f59e0b" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#ds-arrow-amber)" />

                    <rect x="26" y="276" width="238" height="62" rx="9" fill="#08130d" stroke="#00c875" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="145" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#00c875">DECISION</text>
                    <text x="145" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">with the reason attached</text>

                    <rect x="340" y="276" width="174" height="62" rx="9" fill="#171208" stroke="#f59e0b" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="427" y="300" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#f59e0b">TO A PERSON</text>
                    <text x="427" y="320" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">below the threshold</text>

                    {/* ── Measurement runs across the whole path ── */}
                    <rect x="26" y="364" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="391" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">accuracy and drift watched per segment, not in aggregate</text>
                  </svg>
                </div>
              ) : service.slug === 'mlops' ? (
                /* ── MLOps ML Pipeline Diagram ── */
                <div className="flex items-center justify-start sm:justify-center w-full lg:-mt-16 overflow-x-auto sm:overflow-visible" role="group" aria-label="MLOps Pipeline diagram — human-in-the-loop" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <defs>
                      <linearGradient id="ml-blue-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa"/>
                        <stop offset="100%" stopColor="#2563eb"/>
                      </linearGradient>
                      <linearGradient id="ml-cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee"/>
                        <stop offset="100%" stopColor="#0891b2"/>
                      </linearGradient>
                      <linearGradient id="ml-slate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#334155"/>
                        <stop offset="100%" stopColor="#0f172a"/>
                      </linearGradient>

                      <filter id="glow-blue-intense">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="6" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <filter id="glow-cyan-intense">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="6" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* ── BACKGROUND ORBITS / NETWORK ── */}
                    <ellipse cx="270" cy="210" rx="160" ry="60" fill="none" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.4" transform="rotate(-15 270 210)" />
                    <ellipse cx="270" cy="210" rx="200" ry="80" fill="none" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.2" transform="rotate(25 270 210)" />
                    
                    {/* Data streams (background) */}
                    <path d="M 0 100 C 150 50, 350 350, 540 300" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <path d="M 0 350 C 200 400, 300 50, 540 100" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />


                    {/* ── LEFT: HUMAN ENGINEER / MLOPS CONSOLE ── */}
                    {/* Connecting line */}
                    <path d="M 120 280 C 150 280, 180 260, 205 235" fill="none" stroke="#22d3ee" strokeWidth="2" filter="url(#glow-cyan-intense)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
                    </path>

                    <g transform="translate(20, 220)">
                      {/* Desk/Laptop */}
                      <path d="M 10 90 L 110 90 L 95 60 L 25 60 Z" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                      <rect x="25" y="20" width="70" height="40" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow-cyan-intense)" />
                      {/* Screen content */}
                      <line x1="30" y1="28" x2="60" y2="28" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="36" x2="80" y2="36" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="44" x2="50" y2="44" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                      <line x1="30" y1="52" x2="70" y2="52" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                      
                      {/* Human Silhouette */}
                      <circle cx="60" cy="5" r="16" fill="#64748b" />
                      <path d="M 30 50 C 30 25, 90 25, 90 50 L 95 90 L 25 90 Z" fill="#475569" />
                      <path d="M 90 50 C 110 50, 110 65, 90 65" fill="none" stroke="#475569" strokeWidth="12" strokeLinecap="round" /> {/* Arm reaching out */}
                    </g>
                    <text x="75" y="335" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">ML ENGINEER</text>
                    <text x="75" y="350" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">HUMAN-IN-THE-LOOP</text>

                    {/* ── TOP LEFT: AI AGENT / ROBOT ── */}
                    <g transform="translate(60, 60)">
                      <rect x="0" y="0" width="50" height="50" rx="12" fill="#0f172a" stroke="#60a5fa" strokeWidth="2" filter="url(#glow-blue-intense)" />
                      <foreignObject x="5" y="5" width="40" height="40">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-blue-400">
                          <BrainCircuit size={28} />
                        </div>
                      </foreignObject>
                    </g>
                    <text x="85" y="125" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold" fontFamily="monospace">AI SUPERVISOR</text>

                    {/* Connection from Agent to Globe */}
                    <path d="M 110 85 C 150 85, 170 120, 220 175" fill="none" stroke="#60a5fa" strokeWidth="1.5" filter="url(#glow-blue-intense)" strokeDasharray="4 4">
                       <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.8s" repeatCount="indefinite" />
                    </path>

                    {/* ── RIGHT: PRODUCTION / FACTORY & EDGE ── */}
                    <g transform="translate(390, 200)">
                      {/* Base platform */}
                      <path d="M 0 80 L 120 80 L 100 30 L 20 30 Z" fill="#0f172a" stroke="#0891b2" strokeWidth="1.5" />
                      
                      {/* Factory Arm Base */}
                      <path d="M 50 30 L 70 30 L 75 10 L 45 10 Z" fill="#334155" />
                      {/* Robotic Arm Segments */}
                      <path d="M 60 15 L 80 -25" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
                      <circle cx="80" cy="-25" r="6" fill="#0891b2" filter="url(#glow-cyan-intense)" />
                      <path d="M 80 -25 L 40 -50" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                      {/* Arm claw */}
                      <path d="M 40 -50 L 30 -60 M 40 -50 L 50 -60" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="40" cy="-50" r="4" fill="#60a5fa" filter="url(#glow-blue-intense)" />
                      
                      {/* Server Rack / Edge Node */}
                      <rect x="85" y="10" width="30" height="60" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                      <line x1="90" y1="20" x2="110" y2="20" stroke="#22d3ee" strokeWidth="2" />
                      <line x1="90" y1="35" x2="110" y2="35" stroke="#22d3ee" strokeWidth="2" />
                      <line x1="90" y1="50" x2="110" y2="50" stroke="#60a5fa" strokeWidth="2" />
                    </g>
                    <text x="450" y="305" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">PRODUCTION ENVIRONMENT</text>
                    <text x="450" y="320" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">AUTOMATED EXECUTION</text>

                    {/* Connecting line from Globe to Production */}
                    <path d="M 315 180 C 350 180, 400 170, 430 150" fill="none" stroke="#60a5fa" strokeWidth="2" filter="url(#glow-blue-intense)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path d="M 310 215 C 340 230, 380 250, 410 260" fill="none" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow-cyan-intense)" />

                    {/* ── FLOATING DATA NODES (Code, Analytics) ── */}
                    <g transform="translate(390, 50)">
                      <circle cx="25" cy="25" r="20" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="2 4" />
                      <foreignObject x="13" y="13" width="24" height="24">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                          <TrendingUp size={24} />
                        </div>
                      </foreignObject>
                    </g>
                    <path d="M 310 160 C 330 130, 360 100, 395 80" fill="none" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 3" />

                    <g transform="translate(130, 30)">
                      <circle cx="20" cy="20" r="16" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
                      <foreignObject x="10" y="10" width="20" height="20">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full text-blue-400">
                          <Network size={20} />
                        </div>
                      </foreignObject>
                    </g>
                    <path d="M 165 60 C 180 90, 200 120, 235 155" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />

                    {/* ── CENTER GLOBE / CORE MODEL ── */}
                    <g transform="translate(195, 135)">
                      <circle cx="75" cy="75" r="75" fill="#0f172a" stroke="url(#ml-blue-glow)" strokeWidth="2" filter="url(#glow-blue-intense)"/>
                      <circle cx="75" cy="75" r="75" fill="url(#ml-slate-grad)" fillOpacity="0.8"/>
                      {/* Grid lines for globe effect */}
                      <ellipse cx="75" cy="75" rx="35" ry="75" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
                      <ellipse cx="75" cy="75" rx="75" ry="25" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
                      <path d="M 15 35 Q 75 60 135 35" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                      <path d="M 15 115 Q 75 90 135 115" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
                      
                      {/* Center Node Icon */}
                      <circle cx="75" cy="75" r="28" fill="#1e293b" stroke="#00f0ff" strokeWidth="1.5"/>
                      <foreignObject x="55" y="55" width="40" height="40">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">
                          <Cpu size={24} />
                        </div>
                      </foreignObject>
                    </g>
                    <text x="270" y="325" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="2">MLOPS SERVICES</text>
                    <text x="270" y="340" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace">KEEPS MODELS RIGHT IN PRODUCTION</text>

                  </svg>
                </div>
              ) : service.slug === 'operation-technology' ? (
                /* ── Plant floor to enterprise, five stages ──
                   Replaces the shared agentic default, which labeled an OT
                   engineering page AI COMMANDER, AGENTIC ORCHESTRATOR and
                   AUTONOMOUS COMMIT — an AI agent execution loop above copy
                   about SCADA, PLCs and industrial connectivity.

                   The five stages match architectureNodes below it exactly
                   (Assess, Architect, Connect, Operate, Optimize), so the
                   summary and the detail cannot drift apart. The closing
                   split visualizes the FAQ answer on connectivity loss:
                   control stays local no matter what the upstream link is
                   doing, and the enterprise side sees it once reconnected —
                   not a success/exception branch like the automation pages,
                   since both outcomes here are the point, not a fallback.

                   Label floor: this column renders at roughly 509px against a
                   540-unit viewBox, a 0.94 scale, so a 12-unit label reaches
                   the screen at 11.3px. Nothing here is smaller than 12. */
                <div className="flex items-center justify-start sm:justify-center w-full overflow-x-auto sm:overflow-visible lg:-mt-8" role="group" aria-label="OT transformation pipeline — plant-floor assets are assessed, architected, connected, operated and optimized, with control staying local and enterprise systems seeing it once reconnected" tabIndex={0}>
                  <svg viewBox="0 0 540 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <title>How plant-floor assets become enterprise operational intelligence</title>
                    <desc>PLCs, SCADA, HMIs and sensors are assessed, architected, connected and operated, then optimized into predictive intelligence. Control stays local if the upstream link drops; the enterprise side syncs once it returns.</desc>

                    <defs>
                      <linearGradient id="ot-spine" gradientUnits="userSpaceOnUse" x1="26" y1="186" x2="507" y2="186">
                        <stop offset="0" stopColor="#2564ea" />
                        <stop offset="1" stopColor="#4ab6d4" />
                      </linearGradient>
                      <linearGradient id="ot-stage" gradientUnits="userSpaceOnUse" x1="0" y1="160" x2="0" y2="212">
                        <stop offset="0" stopColor="#131d31" />
                        <stop offset="1" stopColor="#0a0f1a" />
                      </linearGradient>
                      <marker id="ot-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#4ab6d4" />
                      </marker>
                      <marker id="ot-arrow-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#2564ea" />
                      </marker>
                      <marker id="ot-tick" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                        <path d="M0,0 L10,5 L0,10 z" fill="#ffffff" fillOpacity="0.35" />
                      </marker>
                    </defs>

                    {/* ── What's on the floor today ── */}
                    <text x="26" y="34" fontFamily="monospace" fontSize="12" fontWeight="bold" letterSpacing="1.6" fill="#4ab6d4">WHAT SITS ON YOUR PLANT FLOOR</text>
                    <rect x="26" y="46" width="488" height="46" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.3" />
                    <text x="270" y="75" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.85">PLC · HMI · SCADA · DCS · sensors · edge gateways</text>

                    <g stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4" markerEnd="url(#ot-tick)">
                      <line x1="81" y1="94" x2="81" y2="156" />
                    </g>
                    <text x="92" y="130" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.45">including what nobody has fully inventoried yet</text>

                    {/* ── The five stages, matching architectureNodes ── */}
                    <line x1="26" y1="186" x2="507" y2="186" stroke="url(#ot-spine)" strokeWidth="2" strokeOpacity="0.45" />

                    <g fontFamily="monospace" textAnchor="middle">
                      <rect x="26" y="160" width="85" height="52" rx="9" fill="url(#ot-stage)" stroke="#2564ea" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="68.5" y="182" fontSize="12" fontWeight="bold" letterSpacing="0.4" fill="white">ASSESS</text>
                      <text x="68.5" y="200" fontSize="11" fill="white" fillOpacity="0.55">discover</text>

                      <rect x="125" y="160" width="85" height="52" rx="9" fill="url(#ot-stage)" stroke="#2b78e0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="167.5" y="182" fontSize="12" fontWeight="bold" letterSpacing="0.4" fill="white">ARCHITECT</text>
                      <text x="167.5" y="200" fontSize="11" fill="white" fillOpacity="0.55">zones · edge</text>

                      <rect x="224" y="160" width="85" height="52" rx="9" fill="url(#ot-stage)" stroke="#3080e6" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="266.5" y="182" fontSize="12" fontWeight="bold" letterSpacing="0.4" fill="white">CONNECT</text>
                      <text x="266.5" y="200" fontSize="11" fill="white" fillOpacity="0.55">OPC UA/MQTT</text>

                      <rect x="323" y="160" width="85" height="52" rx="9" fill="url(#ot-stage)" stroke="#3b9ce0" strokeOpacity="0.6" strokeWidth="1.5" />
                      <text x="365.5" y="182" fontSize="12" fontWeight="bold" letterSpacing="0.4" fill="white">OPERATE</text>
                      <text x="365.5" y="200" fontSize="11" fill="white" fillOpacity="0.55">change · OEMs</text>

                      <rect x="422" y="160" width="85" height="52" rx="9" fill="url(#ot-stage)" stroke="#4ab6d4" strokeOpacity="0.75" strokeWidth="1.5" />
                      <text x="464.5" y="182" fontSize="12" fontWeight="bold" letterSpacing="0.4" fill="white">OPTIMIZE</text>
                      <text x="464.5" y="200" fontSize="11" fill="white" fillOpacity="0.55">predict · AI</text>
                    </g>

                    <g stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ot-arrow)">
                      <line x1="113" y1="186" x2="123" y2="186" />
                      <line x1="212" y1="186" x2="222" y2="186" />
                      <line x1="311" y1="186" x2="321" y2="186" />
                      <line x1="410" y1="186" x2="420" y2="186" />
                    </g>

                    {/* ── If the upstream link drops, control does not ── */}
                    <text x="270" y="240" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.5">if the upstream link drops</text>

                    <path d="M 464 214 C 464 240, 260 240, 145 240 L 145 254" fill="none" stroke="#4ab6d4" strokeOpacity="0.55" strokeWidth="1.5" markerEnd="url(#ot-arrow)" />
                    <path d="M 464 214 C 464 236, 430 236, 408 254" fill="none" stroke="#2564ea" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#ot-arrow-2)" />

                    <rect x="26" y="258" width="238" height="58" rx="9" fill="#0a1220" stroke="#4ab6d4" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="145" y="282" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#4ab6d4">PLANT KEEPS RUNNING</text>
                    <text x="145" y="302" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">control stays local either way</text>

                    <rect x="302" y="258" width="212" height="58" rx="9" fill="#0a1220" stroke="#2564ea" strokeOpacity="0.45" strokeWidth="1.5" />
                    <text x="408" y="282" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="bold" letterSpacing="0.6" fill="#93c5fd">ENTERPRISE SEES IT</text>
                    <text x="408" y="302" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.8">telemetry syncs on reconnect</text>

                    {/* ── Measurement runs across the whole path ── */}
                    <rect x="26" y="336" width="488" height="44" rx="9" fill="#0a1220" stroke="#ffffff" strokeOpacity="0.14" />
                    <text x="270" y="363" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="white" fillOpacity="0.6">asset visibility and downtime measured against your own baseline</text>
                  </svg>
                </div>
              ) : (
                /* ── Agentic AI Flow Diagram (Upgraded) ── */
                <div className="flex items-center justify-start sm:justify-center w-full lg:-mt-16 overflow-x-auto sm:overflow-visible" role="group" aria-label="Agentic AI Pipeline diagram" tabIndex={0}>
                  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[95%] min-w-[460px] sm:min-w-0 ml-auto">
                    <defs>
                      <linearGradient id="agentic-blue-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6"/>
                        <stop offset="100%" stopColor="#1d4ed8"/>
                      </linearGradient>
                      <linearGradient id="agentic-cyan-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee"/>
                        <stop offset="100%" stopColor="#0891b2"/>
                      </linearGradient>
                      <linearGradient id="agentic-slate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e293b"/>
                        <stop offset="100%" stopColor="#0f172a"/>
                      </linearGradient>

                      <filter id="glow-blue-intense">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="6" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      <filter id="glow-cyan-intense">
                        <feGaussianBlur stdDeviation="3" result="blur1"/>
                        <feGaussianBlur stdDeviation="6" result="blur2"/>
                        <feMerge>
                          <feMergeNode in="blur2"/>
                          <feMergeNode in="blur1"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* ── BACKGROUND ORBITS / NETWORK ── */}
                    <ellipse cx="270" cy="210" rx="180" ry="80" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-15 270 210)" strokeDasharray="4 8" />
                    <ellipse cx="270" cy="210" rx="220" ry="100" fill="none" stroke="#0891b2" strokeWidth="1" strokeOpacity="0.2" transform="rotate(25 270 210)" strokeDasharray="12 4" />
                    
                    {/* Data streams (background) */}
                    <path d="M 0 100 C 150 50, 350 350, 540 300" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                    <path d="M 0 350 C 200 400, 300 50, 540 100" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />

                    {/* ── LEFT: ENTERPRISE SYSTEMS / SERVER CLUSTER ── */}
                    <g transform="translate(10, 180)">
                      {/* Rack 1 */}
                      <rect x="0" y="20" width="40" height="90" rx="4" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" filter="url(#glow-cyan-intense)" />
                      <line x1="5" y1="35" x2="35" y2="35" stroke="#22d3ee" strokeWidth="2" />
                      <line x1="5" y1="55" x2="25" y2="55" stroke="#60a5fa" strokeWidth="2" />
                      <line x1="5" y1="75" x2="35" y2="75" stroke="#22d3ee" strokeWidth="2" />
                      <circle cx="30" cy="55" r="3" fill="#22d3ee" />
                      
                      {/* Rack 2 */}
                      <rect x="50" y="0" width="50" height="110" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue-intense)" />
                      <line x1="60" y1="20" x2="90" y2="20" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="60" y1="40" x2="80" y2="40" stroke="#60a5fa" strokeWidth="2" />
                      <line x1="60" y1="60" x2="90" y2="60" stroke="#3b82f6" strokeWidth="2" />
                      <line x1="60" y1="80" x2="85" y2="80" stroke="#22d3ee" strokeWidth="2" />
                      <circle cx="85" cy="40" r="4" fill="#60a5fa" />
                      <circle cx="70" cy="100" r="3" fill="#ef4444" /> {/* Blinking error maybe */}
                    </g>
                    <text x="55" y="325" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">ENTERPRISE CLOUD</text>
                    <text x="55" y="340" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">EVENTS &amp; TRIGGERS</text>

                    {/* Connection from Servers to Core */}
                    <path d="M 120 230 C 150 230, 180 220, 205 210" fill="none" stroke="#22d3ee" strokeWidth="2.5" filter="url(#glow-cyan-intense)" strokeDasharray="8 8">
                      <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
                    </path>
                    {/* Agent Drone 1 carrying data */}
                    <g transform="translate(150, 215)">
                      <polygon points="0,-8 10,0 0,8 -10,0" fill="#22d3ee" filter="url(#glow-cyan-intense)" />
                      <circle cx="0" cy="0" r="3" fill="#0f172a" />
                    </g>

                    {/* ── TOP RIGHT: HUMAN AI COMMANDER ── */}
                    <g transform="translate(380, 40)">
                      {/* High-tech desk */}
                      <path d="M 0 90 L 120 90 L 100 55 L 20 55 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                      {/* Console Screen */}
                      <path d="M 25 20 Q 60 10 95 20 L 90 50 Q 60 40 30 50 Z" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue-intense)" />
                      {/* Screen UI */}
                      <line x1="40" y1="28" x2="80" y2="28" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                      <line x1="35" y1="36" x2="65" y2="36" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                      <line x1="75" y1="36" x2="85" y2="36" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="50" cy="45" r="4" fill="#ef4444" /> {/* Alert */}
                      
                      {/* Human Commander */}
                      <circle cx="60" cy="-5" r="14" fill="#64748b" />
                      <path d="M 35 45 C 35 15, 85 15, 85 45 L 90 90 L 30 90 Z" fill="#475569" />
                      <path d="M 85 45 C 105 45, 105 60, 85 60" fill="none" stroke="#475569" strokeWidth="10" strokeLinecap="round" /> {/* Arm interacting */}
                    </g>
                    <text x="440" y="155" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold" fontFamily="monospace">AI COMMANDER</text>
                    <text x="440" y="170" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">HUMAN IN THE LOOP</text>

                    {/* Connection from Core to Commander */}
                    <path d="M 325 160 C 350 140, 380 120, 410 100" fill="none" stroke="#3b82f6" strokeWidth="2" filter="url(#glow-blue-intense)" strokeDasharray="6 6">
                      <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
                    </path>

                    {/* ── BOTTOM RIGHT: EXECUTION PIPELINE / FACTORY ── */}
                    <g transform="translate(370, 230)">
                      {/* Pipeline Base */}
                      <path d="M 0 80 L 140 80 L 115 30 L 25 30 Z" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" filter="url(#glow-cyan-intense)" />
                      {/* Factory Execution Node 1 */}
                      <circle cx="40" cy="15" r="16" fill="#1e293b" stroke="#0891b2" strokeWidth="2" />
                      <circle cx="40" cy="15" r="8" fill="#22d3ee" filter="url(#glow-cyan-intense)" />
                      {/* Factory Execution Node 2 */}
                      <circle cx="100" cy="15" r="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                      <circle cx="100" cy="15" r="8" fill="#3b82f6" filter="url(#glow-blue-intense)" />
                      {/* Laser Cutter / Processor arm */}
                      <path d="M 70 -25 L 70 5 L 85 10" fill="none" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
                      <circle cx="85" cy="10" r="3" fill="#ef4444" filter="url(#glow-blue-intense)" />
                      <line x1="85" y1="13" x2="95" y2="25" stroke="#ef4444" strokeWidth="2" /> {/* Laser beam */}
                      
                      {/* Processing Data block on conveyor */}
                      <rect x="35" y="45" width="20" height="15" rx="2" fill="#60a5fa" filter="url(#glow-blue-intense)" />
                      <rect x="85" y="45" width="20" height="15" rx="2" fill="#22d3ee" filter="url(#glow-cyan-intense)" />
                      {/* Conveyor Belt */}
                      <line x1="20" y1="65" x2="120" y2="65" stroke="#475569" strokeWidth="4" strokeDasharray="8 4" />
                    </g>
                    <text x="440" y="325" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">WORKFLOW EXECUTION</text>
                    <text x="440" y="340" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">AUTONOMOUS COMMIT</text>

                    {/* Connection from Core to Factory */}
                    <path d="M 330 210 C 360 210, 390 220, 420 240" fill="none" stroke="#22d3ee" strokeWidth="2.5" filter="url(#glow-cyan-intense)" strokeDasharray="8 8">
                      <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1s" repeatCount="indefinite" />
                    </path>
                    {/* Agent Drone 2 carrying payload to execution */}
                    <g transform="translate(370, 220)">
                      <polygon points="0,-8 10,0 0,8 -10,0" fill="#3b82f6" filter="url(#glow-blue-intense)" />
                      <circle cx="0" cy="0" r="3" fill="#0f172a" />
                    </g>

                    {/* ── TOP LEFT: RAG KNOWLEDGE BASE ── */}
                    <g transform="translate(60, 40)">
                      <path d="M 20 0 L 60 20 L 40 40 L 0 20 Z" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
                      <path d="M 20 15 L 60 35 L 40 55 L 0 35 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                      <path d="M 20 30 L 60 50 L 40 70 L 0 50 Z" fill="#0f172a" stroke="#1d4ed8" strokeWidth="2" filter="url(#glow-blue-intense)" />
                      <circle cx="30" cy="25" r="4" fill="#60a5fa" />
                    </g>
                    <text x="90" y="130" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold" fontFamily="monospace">ENTERPRISE KNOWLEDGE</text>
                    <path d="M 110 90 C 150 110, 180 140, 220 160" fill="none" stroke="#3b82f6" strokeWidth="1.5" filter="url(#glow-blue-intense)" strokeDasharray="4 4">
                       <animate attributeName="stroke-dashoffset" from="8" to="0" dur="0.8s" repeatCount="indefinite" />
                    </path>

                    {/* ── CENTER GLOBE / ORCHESTRATOR BRAIN ── */}
                    <g transform="translate(195, 135)">
                      {/* Brain Core Outer */}
                      <circle cx="75" cy="75" r="85" fill="#0f172a" stroke="url(#agentic-blue-glow)" strokeWidth="3" filter="url(#glow-blue-intense)"/>
                      <circle cx="75" cy="75" r="85" fill="url(#agentic-slate-grad)" fillOpacity="0.9"/>
                      
                      {/* Brain Data Rings */}
                      <circle cx="75" cy="75" r="65" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="10 15">
                        <animateTransform attributeName="transform" type="rotate" from="0 75 75" to="360 75 75" dur="10s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="75" cy="75" r="45" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="20 10">
                        <animateTransform attributeName="transform" type="rotate" from="360 75 75" to="0 75 75" dur="7s" repeatCount="indefinite" />
                      </circle>

                      {/* Inner Core */}
                      <circle cx="75" cy="75" r="28" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" filter="url(#glow-cyan-intense)"/>
                      <foreignObject x="55" y="55" width="40" height="40">
                        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full flex items-center justify-center text-white">
                          <BrainCircuit size={24} />
                        </div>
                      </foreignObject>
                    </g>
                    <text x="270" y="325" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold" fontFamily="monospace" letterSpacing="2">AGENTIC ORCHESTRATOR</text>
                    <text x="270" y="340" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="monospace">REASON &gt; PLAN &gt; EXECUTE</text>
                  </svg>
                </div>
              ) ) : null}
          </div>

          {/* Stats row — full width.
              The outcome cards further down carry an "Illustrative scenario"
              line and these did not, so the larger and more prominent numbers
              were the unqualified ones. Any service flagging a metric
              illustrative now gets the same disclaimer beneath them.

              Opt out with hideMetrics, which suppresses the row AND the
              disclaimer below it. Deleting businessMetrics is not the way:
              getParityService resolves an absent key to a per-department
              default, so a page that removes its own metrics gets generic
              department figures instead of nothing — that is exactly how
              "60% Faster Cycle / 35% TCO Reduction" reappeared on a service
              management page. Defaults to showing. */}
          {!service.hideMetrics && (
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ${service.slug === 'enterprise-integration-platform' ? 'pt-6 sm:pt-8' : 'pt-12'} border-t border-white/[0.08]`}>
            {service.businessMetrics ? service.businessMetrics.map((m, i) => (
              <div key={i}>
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                  {m.value}<span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">{m.suffix}</span>
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
          )}

          {/* Two different disclaimers, because these are two different kinds
              of number. `illustrative` marks a figure we modeled; `sourced`
              marks a real figure that is not ours, and it renders the
              attribution instead — calling published research "modeled on
              typical engagement patterns" would be false. Sourced wins when
              both appear, since a misattributed real figure is the worse
              error. Suppressed with the row itself under hideMetrics: a
              disclaimer for figures nobody can see is worse than neither. */}
          {service.hideMetrics ? null : (service.businessMetrics || []).some((m) => m.sourced) ? (
            <p className="text-white/60 text-[11px] font-medium leading-snug mt-4 mb-0 max-w-3xl">
              {service.metricsNote || `Source: ${[...new Set((service.businessMetrics || []).filter((m) => m.sourced).map((m) => m.source))].join('; ')}. Figures describe the market, not Kangqore engagement results.`}
            </p>
          ) : (service.businessMetrics || []).some((m) => m.illustrative) ? (
            <p className="text-white/60 text-[11px] font-medium leading-snug mt-4 mb-0 max-w-3xl">
              Illustrative figures — modeled on typical engagement patterns, not a specific client result.
            </p>
          ) : null}



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



      {/* ══════════════════════ eQORE AI CONCIERGE ══════════════════════ */}
      <div id="svc-concierge">
        <ConciergeSection inverted heading={service.conciergeHeading} intro={service.conciergeIntro} suggestedPrompts={service.conciergeChips || [
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

      {/* ══════════════════ ENTERPRISE ARCHITECTURE STACK ══════════════════ */}
      {/* Opt-in, page-scoped. A layered architecture drawn from data rather
          than as a bespoke SVG, for three reasons: it is reusable by any
          service that has a genuine layer model, every label is real text so
          the crawler that never runs our JS receives the whole diagram, and it
          reflows on a phone instead of becoming a 460px horizontal scroll.
          Signal flows bottom-up — systems emit, the top layer decides. */}
      {service.enterpriseArchitecture && (
        <section className="py-16 md:py-24 border-t border-white/[0.05] overflow-hidden" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                {service.enterpriseArchitecture?.eyebrow}
              </span>
            </div>
            <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6 max-w-4xl">
              {service.enterpriseArchitecture?.title}{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {service.enterpriseArchitecture?.titleHighlight}
              </span>
            </h2>
            {service.enterpriseArchitecture.lede && (
              <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-3xl mb-14">
                {service.enterpriseArchitecture.lede}
              </p>
            )}

            <ol className="relative flex flex-col gap-3" aria-label="Assurance architecture, decomposed from the business outcome at the top down to the systems under test at the foot">
              {service.enterpriseArchitecture.layers.map((layer, li) => (
                <li key={layer.label} className="relative">
                  {/* Read downward as a decomposition: the outcome at the top
                      is supported by the layer beneath it, and so on down to
                      the systems a release can actually break. */}
                  {li > 0 && (
                    <span aria-hidden="true" className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#4ab6d4]/45 text-xs leading-none">&#9660;</span>
                  )}
                  <div
                    className="rounded-2xl border px-5 py-5 sm:px-7 sm:py-6 transition-colors duration-500"
                    style={{
                      borderColor: `rgba(74,182,212,${0.14 + li * 0.06})`,
                      background: `linear-gradient(135deg, rgba(37,100,234,${0.05 + li * 0.025}) 0%, rgba(74,182,212,${0.03 + li * 0.02}) 100%)`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-4">
                      <h3 className="text-base sm:text-lg font-bold tracking-tight text-white">{layer.label}</h3>
                      {layer.role && (
                        <p className="text-xs sm:text-sm text-white/55 font-medium sm:text-right sm:max-w-md leading-snug">{layer.role}</p>
                      )}
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {layer.nodes.map((n) => (
                        <li
                          key={n}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm leading-snug text-white/75"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            {service.enterpriseArchitecture.principle && (
              <p className="mt-10 border-l-2 border-[#4ab6d4]/50 pl-5 text-white/70 text-base sm:text-lg leading-relaxed max-w-3xl">
                {service.enterpriseArchitecture.principle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ══════════════════════ CAPABILITIES ══════════════════════ */}
      {service.capabilityAreas ? (
        /* ── BENTO GRID (when capabilityAreas override is set) ── */
        <section id="svc-capabilities" className="py-16 md:py-24 overflow-hidden relative" style={{ backgroundColor: '#000000' }}>
          <style dangerouslySetInnerHTML={{__html: `
            .svc-cap-desc {
              opacity: 1; transform: translateY(0);
              transition: opacity 0.4s cubic-bezier(0.25,1,0.5,1), transform 0.4s cubic-bezier(0.25,1,0.5,1);
              visibility: visible;
              /* Safety net, not a layout mechanism. The description box is
                 sized by the flex row above it, so a long description used to
                 spill straight out of its box and render across the "Explore
                 Capability" link at the foot of the card. Measured on
                 /services/robotic-process-automation before this: 4 of 7 cards
                 overflowing, the worst by 74px. Copy should still be written to
                 fit the card; this only guarantees that when it is not, the
                 text clips instead of colliding with a control. */
              overflow: hidden;
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
                {/* Opt-in. The default is a count and a stock phrase; a service
                    that has something to say about how its capabilities fit
                    together should be able to say it here. */}
                <p className="text-lg text-white/50 leading-relaxed max-w-md lg:text-right">
                  {service.capabilitiesLede
                    || `${capabilities.length} Capability Area${capabilities.length !== 1 ? 's' : ''}. Engineered for enterprise.`}
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
                  /* The previous six-card shape left a hole. A tall opener plus
                     a single two-wide closer tiles as [00][01][02] / [00][03][04]
                     / [05 wide-2] — which leaves the third column of the last
                     row empty, and an empty cell at the foot of a bento reads
                     as a missing card rather than as composition.

                     Two two-wide cards instead, one per remaining row:
                       r1  [00 tall][01][02]
                       r2  [00     ][03 wide-2]
                       r3  [04][05 wide-2]
                     No gaps, and the width lands on 03 and 05 rather than on
                     03 alone. No page shipped with exactly six areas before
                     this, so nothing else changes shape. */
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 3 || i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 8) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 7) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 9) {
                  /* ── Nine ──
                     There was no case for nine, so every card fell through to
                     the 1x1 default and the section rendered as a flat 3x3 grid
                     of squares. Every other supported count gets a bento; nine
                     did not, purely because no page had shipped with nine areas
                     before.

                     A tall opener plus two two-wide cards, offset to different
                     columns so the widths do not stack into a stripe:

                       lg, three columns          sm, two columns
                       r1  [00 tall][01][02]      r1  [00 tall][01]
                       r2  [00     ][03][04]      r2  [00     ][02]
                       r3  [05 wide-2   ][06]     r3  [03][04]
                       r4  [07][08 wide-2   ]     r4  [05 wide-2]
                                                  r5  [06][07]
                                                  r6  [08 wide-2]

                     No gaps at either breakpoint. The widths land on 05 and 08
                     starting in different columns, which is the same reasoning
                     as the six-card case: an offset reads as composition, a
                     stack reads as a template. */
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5 || i === 8) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 10) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 8) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 9) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 12) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 3) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 7) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 8) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 11) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 20) {
                  /* ── 8 + 8 + 4 ──
                     Three bento movements in one continuous grid. Blocks A and
                     B repeat the same shape (a tall opener, a two-wide, then a
                     full-width closer) so the eye learns the rhythm and reads
                     the repeat as structure rather than as a longer list. Block
                     C breaks it with a two-card pinwheel, which is what stops
                     the last four reading as an afterthought.

                     Tiling in three columns, no gaps:
                       A  r1-2 [00 tall][01][02] / [03][04]
                          r3   [05 wide-2      ][06]
                          r4   [07 wide-3           ]
                       B  r5-6 [08 tall][09][10] / [11][12]
                          r7   [13 wide-2      ][14]
                          r8   [15 wide-3           ]
                       C  r9   [16 wide-2      ][17]
                          r10  [18][19 wide-2      ] */
                  if (i === 0 || i === 8) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 5 || i === 13 || i === 16 || i === 19) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 7 || i === 15) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else cardClass = 'col-span-1 h-[380px] lg:h-[400px]';
                } else if (capabilities.length === 14) {
                  if (i === 0) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 3) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 7) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
                  else if (i === 8) cardClass = 'col-span-1 sm:row-span-2 h-[380px] sm:h-[772px] lg:h-[812px]';
                  else if (i === 11) cardClass = 'col-span-1 sm:col-span-2 lg:col-span-3 h-[380px] lg:h-[400px]';
                  else if (i === 13) cardClass = 'col-span-1 sm:col-span-2 h-[380px] lg:h-[400px]';
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
                          <p className="text-[11px] font-black tracking-[0.35em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-3">CAPABILITY {c.n}</p>
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
              {capabilities.length > 0 && capabilities[safeCapIdx] && (
                <div className="hidden lg:flex items-start pt-5">
                  <div className="w-full sticky top-8">
                    <p className="text-[11px] font-black tracking-[0.35em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent uppercase mb-6">CAPABILITY {capabilities[safeCapIdx]?.n}</p>
                    <h3 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-4">{capabilities[safeCapIdx]?.title}</h3>
                    <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">{capabilities[safeCapIdx]?.desc}</p>
                    <ul className="space-y-3">
                      {capabilities[safeCapIdx]?.items?.map(item => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: capabilities[safeCapIdx]?.color }} />
                          <span className="text-white/55 text-sm font-medium leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PHILOSOPHY / FEATURES section removed — the badge strip already
         renders keyFeatures in one line; this bento-card re-render added
         ~923px on desktop with zero new information. */}


      {/* Closes the first half of the CTA gap — the capability grid alone runs
          3,222px on this service with nothing actionable in it. */}
      {service.capabilityAreas && service.inlineCtaAfterCapabilities && (
        <InlineCta text={service.inlineCtaAfterCapabilities} />
      )}

      {/* ══════════════════════ SOLUTIONS CAROUSEL ══════════════════════ */}
      {/* Opt-in per service. Renders nothing without solutionsCarousel data,
          so the other 61 pages are unaffected. */}
      {service.solutionsCarousel && (
        <SolutionsCarousel
          eyebrow={service.solutionsCarousel.eyebrow}
          title={service.solutionsCarousel.title}
          titleHighlight={service.solutionsCarousel.titleHighlight}
          subtitle={service.solutionsCarousel.subtitle}
          items={service.solutionsCarousel.items}
        />
      )}

      {/* 3D Ecosystem Cockpit / Tools & Technology Stack — situated directly below Capabilities */}
      {toolsStackSection}


      {/* ══════════════════════ INDUSTRY USE CASES ══════════════════════ */}
      {/* Opt-out per service via hideIndustry, mirroring hideComparison. An
          absent industryUseCases resolves to the department default through
          getParityService, so deletion alone shows generic sector copy. */}
      {!service.hideIndustry && service.industryUseCases && (
        <section id="svc-industry" className="py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
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
                    <span className="text-[11px] font-black tracking-[0.3em] uppercase text-white/60 group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors duration-300">{item.industry}</span>
                    <span className="text-white/50 group-hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent text-xs font-bold transition-transform duration-500 group-hover:rotate-45 select-none sm:inline hidden">+</span>
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
                          className="mt-2 inline-flex items-center gap-1.5 py-1 min-h-[24px] text-xs font-semibold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors"
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

      {/* ══════════════════════ ARCHITECTURE ══════════════════════ */}
      {/* Opt-out per service via hideArchitecture, mirroring hideComparison.
          Deleting the data key does not remove this section: getParityService
          resolves an absent `architectureNodes` to the department default, so
          the page swaps in a generic 4-Layer Stack rather than hiding
          anything. Defaults to showing, so the other 61 pages are unchanged. */}
      {!service.hideArchitecture && service.architectureNodes && service.slug !== 'agentic-ai-led-application-modernization' && service.slug !== 'agentic-ai' && (() => {
        const archNodes = service.architectureNodes || [];
        const totalArch = archNodes.length;
        const visibleArchIndices = totalArch <= 3
          ? archNodes.map((_, i) => i)
          : [0, 1, 2].map(k => (archOffset + k) % totalArch);

        return (
          <section id="svc-architecture" className="py-24 md:py-32" style={{ backgroundColor: '#000000' }}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

              {/* Header: Eyebrow + Title (Left) and Lede (Right) */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 md:mb-18">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] w-12 bg-white/20" />
                    <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.architectureEyebrow || 'ARCHITECTURE & EXECUTION LOOP'}</span>
                  </div>
                  <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white font-display">
                    {service.architectureTitle || 'How It Works.'}{' '}
                    <span className="bg-brand-gradient bg-clip-text text-transparent">
                      {service.architectureTitleHighlight
                        || (service.architectureNodes.length === 5 ? 'The 5-Stage Autonomous Execution Loop.' : `The ${service.architectureNodes.length}-Layer Stack.`)}
                    </span>
                  </h2>
                </div>
                <div className="max-w-md lg:pb-1">
                  <p className="text-white/60 text-base sm:text-lg font-medium leading-relaxed">
                    {service.architectureLede || 'Every deployment runs on a governed, modular architecture built for enterprise scale.'}
                  </p>
                </div>
              </div>

              {/* 2-Column Master-Detail: Interactive 4:5 Media Left, 3 Stacked Cards Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                
                {/* Left Column: 4:5 Visual Showcase Card */}
                <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
                  <div className="relative w-full max-w-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#080d16] shadow-[0_20px_60px_rgba(0,0,0,0.9)] aspect-[4/5] group">
                    {/* Layer Image (4:5) with Smooth Transition */}
                    <img
                      src={archNodes[activeArchNode]?.image || '/images/architecture/enterprise-architecture-showcase-4-5.jpg'}
                      alt={archNodes[activeArchNode]?.title || 'Enterprise Architecture'}
                      className="w-full h-full object-cover object-center transition-all duration-700 select-none pointer-events-none"
                    />
                  </div>
                </div>

                {/* Right Column: 3-Card Automated Rotating Stack (All 3 Open, Smooth In-Place Fade) */}
                <div 
                  className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center space-y-6 sm:space-y-8"
                  onMouseEnter={() => setIsArchPaused(true)}
                  onMouseLeave={() => setIsArchPaused(false)}
                >
                  {visibleArchIndices.map((nodeIdx, slotIdx) => {
                    const node = archNodes[nodeIdx];
                    if (!node) return null;
                    const isActive = activeArchNode === nodeIdx;

                    return (
                      <div
                        key={slotIdx}
                        onClick={() => setActiveArchNode(nodeIdx)}
                        onMouseEnter={() => setActiveArchNode(nodeIdx)}
                        className="group cursor-pointer select-none"
                      >
                        <div className={`relative pl-6 sm:pl-8 border-l-2 sm:border-l-[3px] transition-colors duration-500 ${
                          isActive 
                            ? 'border-white' 
                            : 'border-white/80 hover:border-white'
                        }`}>
                          {/* Smooth in-place cross-fade */}
                          <div key={nodeIdx} className="animate-arch-fade">
                            {/* Title */}
                            <div className="flex items-center gap-3">
                              <h3 className={`text-xl sm:text-2xl lg:text-[1.65rem] font-extrabold tracking-tight transition-colors duration-300 font-display ${
                                isActive ? 'text-white' : 'text-white/95 group-hover:text-white'
                              }`}>
                                {node.title}
                              </h3>
                            </div>

                            {/* Open Description */}
                            <div className="mt-2.5 sm:mt-3">
                              <p className="text-sm sm:text-base text-white/75 font-normal leading-relaxed">
                                {node.description}
                              </p>
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
      })()}

      {/* ══════════════════════ CUSTOM AI INSIGHTS SECTION ══════════════════════ */}
      {service.slug === 'agentic-ai' && (
        <AIInsightsSection />
      )}

      {/* ══════════════════════ OUTCOMES ══════════════════════ */}
      {/* Opt-out per service via hideOutcomeCards. getParityService synthesizes
          outcomeCard/outcomeCard2 for any service that supplies none, so
          deleting the keys does not remove this band — it restores two
          invented engagements instead. The outcomesHeading renders inside this
          block, so hiding it takes the heading with it. The mid-page CTA below
          is also keyed on outcomeCard and is deliberately left alone. */}
      {!service.hideOutcomeCards && service.outcomeCard && (() => {
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

              {/* The section shipped with an eyebrow and no h2 at all, so it was
                  the one block on the page absent from the heading outline.
                  Both are opt-in: a service that sets neither renders exactly
                  as before. */}
              <div className={`flex items-center gap-4 ${service.outcomesHeading ? 'mb-4' : 'mb-16'}`}>
                <div className="h-[1px] w-8 bg-white/20" />
                <span className="text-[11px] font-black tracking-[0.35em] text-white/60 uppercase">{service.outcomesEyebrow || 'Engagement Outcomes'}</span>
              </div>
              {service.outcomesHeading && (
                <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-16 max-w-4xl">
                  {service.outcomesHeading}<br />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">{service.outcomesHeadingHighlight}</span>
                </h2>
              )}

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
                          className="group inline-flex items-center gap-1.5 text-[11px] font-black tracking-[0.15em] uppercase text-white/60 hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent transition-colors duration-200"
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

      {/* ══════════════════════ COMMAND CENTER ══════════════════════ */}
      {/* Opt-in, page-scoped. An executive console rendered in HTML rather than
          as an image or an SVG, so every figure is selectable text a crawler
          receives and a screen reader can announce in reading order. Nothing
          here is a client result: the disclaimer is part of the component and
          not a caption a future edit can drop, because a dashboard is the most
          quotable thing on a page and the easiest to mistake for measurement. */}
      {service.commandCenter && (
        <section className="py-16 md:py-24 border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                {service.commandCenter?.eyebrow}
              </span>
            </div>
            <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-6 max-w-4xl">
              {service.commandCenter?.title}{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                {service.commandCenter?.titleHighlight}
              </span>
            </h2>
            {service.commandCenter.lede && (
              <p className="text-white/55 text-base sm:text-lg leading-relaxed max-w-3xl mb-12">
                {service.commandCenter.lede}
              </p>
            )}

            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#2564ea]/[0.07] to-[#4ab6d4]/[0.05] p-5 sm:p-8">
              {/* Headline index */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-7 border-b border-white/10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                    {service.commandCenter.headline.label}
                  </p>
                  <p className="text-white/60 text-sm leading-snug max-w-md">
                    {service.commandCenter.headline.note}
                  </p>
                </div>
                <p className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-none bg-brand-gradient bg-clip-text text-transparent">
                  {service.commandCenter.headline.value}
                  <span className="text-xl sm:text-2xl text-white/50 font-bold"> / {service.commandCenter.headline.outOf}</span>
                </p>
              </div>

              {/* Domain scores */}
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.07] rounded-2xl overflow-hidden my-7">
                {service.commandCenter.domains.map((d) => (
                  <li key={d.label} className="bg-[#050a14] px-4 py-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55 mb-2 leading-snug">{d.label}</p>
                    <p className="text-3xl font-extrabold text-white tracking-tight leading-none mb-3">{d.value}</p>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden" role="img" aria-label={`${d.label}: ${d.value} out of 100`}>
                      <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${d.value}%` }} />
                    </div>
                  </li>
                ))}
              </ul>

              {/* Signals */}
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 pb-7 border-b border-white/10">
                {service.commandCenter.signals.map((s) => (
                  <li key={s.label} className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-2.5">
                    <span className="text-sm text-white/60 leading-snug">{s.label}</span>
                    <span className={`text-sm font-bold tracking-tight shrink-0 ${s.good === false ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {s.value}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Risk register */}
              <div className="pt-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
                  {service.commandCenter.risksLabel}
                </p>
                <ol className="flex flex-col gap-2.5">
                  {service.commandCenter.risks.map((r, ri) => (
                    <li key={r.item} className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
                      <span className="font-mono text-xs text-white/50 tabular-nums shrink-0">{String(ri + 1).padStart(2, '0')}</span>
                      <span className="flex-1 text-sm text-white/75 leading-snug">{r.item}</span>
                      <span
                        className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                          r.level === 'HIGH'
                            ? 'bg-red-500/15 text-red-300'
                            : r.level === 'MEDIUM'
                              ? 'bg-amber-500/15 text-amber-300'
                              : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {r.level}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <p className="mt-5 text-sm text-white/55 leading-relaxed max-w-3xl">
              Illustrative console. Every figure above is a worked example of the shape this reporting takes —
              thresholds, domains and weightings are set against your own baseline during the engagement, and
              Kangqore publishes no client metrics it has not measured.
            </p>
          </div>
        </section>
      )}

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
              {service.midCtaLabel || 'Schedule a Demo'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════ JOURNEY TIMELINE ══════════════════════ */}
      {/* Suppressed by default wherever a service defines its own engagement
          packages, because the generic four-phase default said the same thing
          twice. `showJourney` opts back in for a service whose methodology is
          genuinely distinct from its commercial packages — a phased delivery
          model is not the same statement as "here are five ways to buy", and a
          page carrying a real one should be able to show it. Without the flag
          the other 61 pages behave exactly as before. */}
      {(!service.servicePackages || service.showJourney) && (
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
                            {/* h3, not h4: the only heading above these cards
                                is the section h2, so h4 skipped a level. Axe
                                flags it as heading-order and a screen-reader
                                user loses the outline. Visual size is set by
                                the class, not by the tag. */}
                            <h3 className="text-lg font-black text-white mb-1">{item.title}</h3>
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
                      <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.journeyEyebrow || `${service.name} Journey`}</span>
                    </div>
                    <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white mb-8">
                      {service.journeyHeading
                        ? <>{service.journeyHeading}<br /><span className="bg-brand-gradient bg-clip-text text-transparent">{service.journeyHeadingHighlight}</span></>
                        : <>From Ambition to<br /><span className="bg-brand-gradient bg-clip-text text-transparent">Delivered Outcomes.</span></>}
                    </h2>
                    <p className="text-white/50 text-lg font-light leading-relaxed max-w-lg">
                      {service.journeyLede
                        || 'A connected system for moving from business goals through solution design to implementation and continuous optimization.'}
                    </p>
                  </div>
                  {/* The third stat used to read "Confidence — 100%" on all 62
                      pages. Nothing measures it, no client produced it, and on
                      an assurance page it is the least defensible sentence we
                      could publish. Replaced with a statement about how we
                      work, which is true everywhere and claims no number.
                      Overridable per service via `journeyStats`. */}
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                    {(service.journeyStats
                      || [['Phases', String(activeJourney.length).padStart(2, '0')], ['Timeline', '4-16 wks'], ['Delivery', 'Co-owned']]
                    ).map(([label, val], i) => (
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

      {/* ══════════════════════ SERVICE PACKAGES (2-Column Offset Layout) ══════════════════════ */}
      <ServicePackagesSection service={service} />

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
                          background: TECH_STACK_ICON_COLORS[i % TECH_STACK_ICON_COLORS.length]?.bg,
                          boxShadow: TECH_STACK_ICON_COLORS[i % TECH_STACK_ICON_COLORS.length]?.glow,
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
                        <ArrowRight className="w-3.5 h-3.5 text-white/15 group-hover:text-[#2564ea] group-hover:translate-x-0.5 transition-all duration-300" />
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


      {/* ══════════════════════ ACCELERATORS ══════════════════════ */}
      {/* Opt-in, page-scoped. Named methods and reusable assets a practice
          brings to an engagement — deliberately not described as products,
          because Kangqore ships no licensed software and a page that implies
          otherwise is a representation to a buyer. Each card states what the
          asset is for, then what it actually does, so the name is a label on
          real work rather than a trademark standing on its own. */}
      {service.accelerators && (
        <section className="py-16 md:py-24 border-t border-white/[0.05]" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                {service.accelerators.eyebrow}
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
              <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white max-w-3xl">
                {service.accelerators.title}{' '}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  {service.accelerators.titleHighlight}
                </span>
              </h2>
              {service.accelerators.lede && (
                <p className="text-lg text-white/50 leading-relaxed max-w-md lg:text-right">
                  {service.accelerators.lede}
                </p>
              )}
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {service.accelerators.items.map((a, ai) => (
                <li
                  key={a.name}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors duration-500 hover:border-[#4ab6d4]/40 hover:bg-white/[0.04]"
                >
                  <span className="font-mono text-xs text-white/50 tabular-nums mb-4">{String(ai + 1).padStart(2, '0')}</span>
                  <h3 className="text-lg font-bold tracking-tight text-white leading-snug mb-3">{a.name}</h3>
                  <p className="text-sm text-white/55 leading-relaxed mb-5">{a.desc}</p>
                  <ul className="mt-auto flex flex-col gap-1.5 border-t border-white/[0.07] pt-4">
                    {a.functions.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-white/65 leading-snug">
                        <span aria-hidden="true" className="text-[#4ab6d4]/60 shrink-0">&#8250;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {service.accelerators.footnote && (
              <p className="mt-8 text-sm text-white/55 leading-relaxed max-w-3xl">
                {service.accelerators.footnote}
              </p>
            )}
          </div>
        </section>
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
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.faqEyebrow || 'BEFORE YOU SIGN'}</span>
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
            {((faqs.length > 5 && !isFaqExpanded) ? faqs.slice(0, 5) : faqs).map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className={`border-t border-white/[0.06] relative overflow-hidden transition-all duration-500 ${isOpen ? 'rounded-xl my-2' : ''}`}>
                  {/* Active State: Liquid Black Impasto Paint Texture — same as 3D Ecosystem Cockpit */}
                  {isOpen && (
                    <>
                      <img
                        src="/images/capabilities/liquid-black-texture.png"
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-80 select-none"
                      />
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.72) 40%, rgba(0, 0, 0, 0.82) 100%)'
                        }}
                      />
                      {/* Subtle top-edge highlight */}
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
                    </>
                  )}
                  {/* <h3> wraps the button rather than sitting inside it: the
                      WAI-ARIA accordion pattern, and the only valid nesting —
                      <button> takes phrasing content, so an <h3> within it is
                      invalid HTML. Before this the questions were plain <span>s,
                      which left every FAQ out of the document outline. They are
                      the most query-shaped strings on any service page, so an
                      answer engine segmenting the document had nothing to
                      anchor them to. */}
                  <h3 className="m-0 relative z-10">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className={`w-full flex items-center justify-between gap-5 sm:gap-8 py-4 sm:py-7 text-left group ${isOpen ? 'px-5 sm:px-8' : ''}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                    >
                      <span className={`text-base font-semibold leading-snug transition-colors duration-200 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white'}`}>{faq.q}</span>
                      {/* Bright thick + sign, rotates to × when expanded */}
                      <span
                        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? 'bg-white/10 rotate-45'
                            : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                        }`}
                      >
                        <Plus
                          className={`w-5 h-5 stroke-[3] transition-colors duration-300 ${
                            isOpen ? 'text-white' : 'text-white/50 group-hover:text-white'
                          }`}
                        />
                      </span>
                    </button>
                  </h3>
                  {/* Every answer stays in the DOM and collapses via grid-template-rows
                      rather than `{isOpen && …}`. Conditional rendering meant seven of
                      eight answers did not exist in the markup — the FAQPage schema
                      described text no crawler could find on the page, which is exactly
                      the mismatch Google's FAQ guidance rejects. 0fr→1fr animates to the
                      natural height, so no max-height has to be guessed. */}
                  <div
                    id={`faq-answer-${i}`}
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className={`pb-5 sm:pb-7 pr-6 sm:pr-12 space-y-4 ${isOpen ? 'px-5 sm:px-8' : ''}`}>
                        {faqParagraphs(faq.a).map((para, p) => (
                          <p key={p} className="text-white/70 text-base font-medium leading-relaxed">{para}</p>
                        ))}
                        {/* Citations. An answer that asserts what a third party
                            does with your data should link the document that says
                            so — it is the difference between a claim and a
                            checkable one, and generative engines preferentially
                            cite pages that themselves cite sources. Rendered as
                            real anchors rather than bare URLs so the link text
                            carries the publisher name. */}
                        {Array.isArray(faq.sources) && faq.sources.length > 0 && (
                          <div className="pt-1">
                            <span className="block text-[11px] font-black tracking-[0.2em] uppercase text-white/50 mb-2">Sources</span>
                            <ul className="flex flex-wrap gap-x-5 gap-y-2">
                              {faq.sources.map((src) => (
                                <li key={src.url}>
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 py-1 min-h-[24px] text-sm font-semibold bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent hover:bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent underline underline-offset-4 transition-colors"
                                  >
                                    {src.label}
                                    <ArrowRight className="w-3 h-3 shrink-0" />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t border-white/[0.06]" />
          </div>

          {faqs.length > 5 && (
            <div className="mt-8 flex justify-start">
              <button
                type="button"
                onClick={() => setIsFaqExpanded((prev) => !prev)}
                aria-expanded={isFaqExpanded}
                className="text-[#60a5fa] hover:text-white py-1 min-h-[24px] font-semibold text-sm tracking-wide uppercase transition-colors inline-flex items-center gap-2 cursor-pointer select-none"
              >
                {isFaqExpanded ? 'Read Less' : 'Read More'}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFaqExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ EXECUTIVE NEWSLETTER (FULL BLEED) ══════════════════════ */}
      <ExecutiveNewsletterSection />

      {/* ══════════════════════ PRACTICE CLUSTER ══════════════════════ */}
      {clusterSiblings.length > 0 && (
        <section className="py-16" style={{ backgroundColor: '#000000' }} aria-labelledby="practice-cluster-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-white/20" />
              {/* Department names are internal taxonomy. "COGNITION" and "SHIELD"
                  mean something on an org chart and nothing to a buyer, and this
                  heading put one in an h2 on every service page. Opt-in override;
                  services that do not set it render exactly as before. */}
              <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">{service.practiceLabel || department.name}</span>
            </div>
            <h2 id="practice-cluster-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              {service.practiceHeading
                ? <>{service.practiceHeading}{' '}<span className="bg-brand-gradient bg-clip-text text-transparent">{service.practiceHeadingHighlight}</span></>
                : <>The complete <span className="bg-brand-gradient bg-clip-text text-transparent">{department.name}</span> practice.</>}
            </h2>
            <p className="text-white/50 text-sm font-medium leading-relaxed max-w-2xl mb-10">
              {service.practiceLede || `${service.name} is one of ${clusterSiblings.length + 1} services in this practice. Explore how they combine.`}
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
                  {service.closingCta?.primaryLabel || 'Schedule a Demo'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <a href="/assets/kangqore-agentic-ai-playbook.pdf" target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 py-1 min-h-[24px] text-white/50 font-semibold text-sm hover:text-white transition-colors duration-200">
                  {service.closingCta?.secondaryLabel || 'Download the Playbook'}
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
