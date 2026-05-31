// ─── DepartmentCarousel — homepage 6-dept showcase ────────────────────────────
// Sources department data from the canonical single-source-of-truth
// (frontend/src/data/departmentsData.js + servicesData.js) so this carousel
// stays in lock-step with the 6-department × 61-service architecture and its
// 24 dataArchitecture invariant tests.
//
// Per Phase G locked constraints:
//  - All dept links use canonical `/departments/<slug>` (plural). The legacy
//    `/department/<old-slug>` pattern is forbidden — it would 301-hop through
//    the Express redirect middleware and dilute link equity.
//  - No hardcoded department data. Names, taglines, descriptions, and the
//    curated top-services list all derive from canonical sources.
//
// The only per-card local data is presentation-layer: the background image
// path and the cover-fit class overrides (some cards need `object-[center_top]`
// or `scale-[1.25]` so the image hero composition reads well at card size).
// ────────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { departmentsData, departmentsList } from '../../data/departmentsData';
import { servicesData } from '../../data/servicesData';

// Per-slug presentation overrides. Image paths point to the 6 PNGs in
// /public/images/departments/. `imageClass` falls back to a default when
// the dept-specific entry has no `imageClass` key.
const DEPT_PRESENTATION = {
  cognition: {
    image: '/images/departments/dept_bg_1_1778893880482.png',
  },
  foundry: {
    image: '/images/departments/dept_bg_2_1778893900884.png',
  },
  reimagine: {
    image: '/images/departments/dept_bg_3_1778893917993.png',
  },
  shield: {
    image: '/images/departments/dept_bg_4_1778893933258.png',
    imageClass:
      'object-cover object-[center_top] scale-[1.25] transition-transform duration-700 group-hover:scale-[1.35]',
  },
  platforms: {
    image: '/images/departments/dept_bg_5_1778893951306.png',
  },
  growth: {
    image: '/images/departments/dept_bg_6_1778893966258.png',
    imageClass:
      'object-cover object-[70%_top] scale-[1.25] transition-transform duration-700 group-hover:scale-[1.35]',
  },
};

const DEFAULT_IMAGE_CLASS =
  'object-cover transition-transform duration-700 group-hover:scale-110';

const DEPT_ICONS_THEMES = {
  cognition: 'brand',
  foundry: 'cyan',
  reimagine: 'dark',
  shield: 'dark',
  platforms: 'cyan',
  growth: 'glass',
};

const VISUAL_PANELS = {
  cognition: (
    <div className="bg-[#050507] border border-white/5 rounded-xl p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] text-slate-400 space-y-2 shadow-inner mt-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">eQORE NEURAL NODE</span>
      </div>
      <div className="flex gap-2"><span className="text-cyan-400 font-bold font-mono">[AGENT]</span><span className="text-slate-300 font-mono">orchestrating automation...</span></div>
      <div className="flex gap-2"><span className="text-cyan-400 font-bold font-mono">[THOUGHT]</span><span className="text-slate-300 font-mono">optimizing decision tree...</span></div>
      <div className="flex gap-2"><span className="text-emerald-400 font-bold font-mono">[METRIC]</span><span className="text-white font-semibold font-mono">manual processing -60%</span></div>
    </div>
  ),
  foundry: (
    <div className="bg-[#050507] border border-white/5 rounded-xl p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] text-slate-400 space-y-2 sm:space-y-2.5 shadow-inner mt-4 text-left">
      <div className="flex justify-between items-center text-white font-bold text-[8px] sm:text-[9px] uppercase tracking-wider border-b border-white/5 pb-2 font-mono">
        <span>GOLDEN PATH PIPELINE</span>
        <span className="text-emerald-400 font-mono">UPTIME 99.9%</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-500 font-mono">
          <span>Production Deployments</span>
          <span className="text-white font-mono">WEEKLY</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: '92%' }} />
        </div>
      </div>
    </div>
  ),
  reimagine: (
    <div className="bg-[#050507] border border-white/5 rounded-xl p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] text-slate-400 space-y-2 shadow-inner mt-4 text-left">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">
        <span>Migration diff</span>
      </div>
      <div className="text-red-400/80 line-through text-[8px] sm:text-[9px] font-mono text-left">- Legacy core DB bottleneck</div>
      <div className="text-emerald-400 text-[8px] sm:text-[9px] font-mono text-left">+ Managed SRE Serverless</div>
      <div className="text-cyan-400 text-[8px] sm:text-[9px] font-mono text-left">+ 45% latency reduction</div>
    </div>
  ),
  shield: (
    <div className="bg-[#050507] border border-white/5 rounded-xl p-3 sm:p-4 flex items-center justify-between shadow-inner mt-4 text-left">
      <div className="space-y-1">
        <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">SOC 2 / ISO 27001</div>
        <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono">Continuous posture audit</div>
      </div>
      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] sm:text-[9px] font-bold tracking-widest font-mono shadow-[0_0_12px_rgba(16,185,129,0.1)]">
        COMPLIANT
      </span>
    </div>
  ),
  platforms: (
    <div className="bg-[#050507] border border-white/5 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-4 shadow-inner mt-4 text-left">
      <span className="flex-1 text-center py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] sm:text-[9px] font-mono text-white">Salesforce</span>
      <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
      <span className="flex-1 text-center py-1 rounded-lg bg-white/5 border border-white/5 text-[8px] sm:text-[9px] font-mono text-white">ServiceNow</span>
    </div>
  ),
  growth: (
    <div className="bg-[#050507] border border-white/5 rounded-xl p-3 sm:p-4 font-mono text-[9px] sm:text-[10px] text-slate-400 space-y-2 shadow-inner mt-4 text-left">
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-500 font-bold border-b border-white/5 pb-2 font-mono">
        <span>Engine Funnel</span>
        <span className="text-emerald-400 font-mono">+40% ROI</span>
      </div>
      <div className="flex justify-between text-[8px] sm:text-[9px] font-mono">
        <span>GEO Optimization:</span>
        <span className="text-white font-mono">ACTIVE</span>
      </div>
      <div className="flex justify-between text-[8px] sm:text-[9px] font-mono">
        <span>Pipeline Attribution:</span>
        <span className="text-cyan-400 font-bold font-mono">3x Clarity</span>
      </div>
    </div>
  ),
};

// Build the carousel view once at module load — keeps the render loop simple
// and means any canonical-data change is picked up at hot-reload time.
const carouselDepartments = departmentsList.map((slug) => {
  const dept = departmentsData[slug];
  const presentation = DEPT_PRESENTATION[slug] || {};
  return {
    slug,
    title: dept.name,
    subtitle: dept.tagline,
    description: dept.description,
    link: `/departments/${slug}`,
    image: presentation.image,
    imageClass: presentation.imageClass || DEFAULT_IMAGE_CLASS,
    topServices: dept.heroServiceSlugs.map((s) => servicesData[s].name),
    icon: dept.icon,
    serviceCount: dept.serviceCount,
    businessOutcomes: dept.businessOutcomes,
    accentColor: dept.accentColor,
  };
});

const DepartmentCarousel = () => {
  const navigate = useNavigate();
  const [expandedDepts, setExpandedDepts] = useState({});

  const toggleExpand = (slug, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedDepts((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleCardClick = (slug, link, e) => {
    const isExpanded = !!expandedDepts[slug];
    if (isExpanded) return;
    if (e.target.closest('.toggle-expand-btn')) return;
    navigate(link);
  };

  const getCardClasses = (slug) => {
    switch (slug) {
      case 'shield':
        return 'col-span-1 sm:row-span-2 row-span-1 h-[380px] sm:h-[772px] lg:h-[812px]';
      case 'growth':
        return 'sm:col-span-2 col-span-1 row-span-1 h-[380px] lg:h-[400px]';
      default:
        return 'col-span-1 row-span-1 h-[380px] lg:h-[400px]';
    }
  };

  return (
    <section className="py-24 bg-[#F5F5F7] dark:bg-[#0a0a0c] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        .bento-desc {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          visibility: visible;
        }
        .group:hover .bento-desc {
          opacity: 0;
          transform: translateY(12px);
          visibility: hidden;
          pointer-events: none;
        }
        .bento-services {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
          visibility: hidden;
        }
        .group:hover .bento-services {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          visibility: visible;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-gray-400 dark:bg-gray-700"></div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              What we offer
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white">
              Explore <span className="bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent">Kangqore Capabilities</span>.
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-md lg:text-right">
              6 Departments. 61 Capabilities. One Execution Ecosystem.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 sm:grid-rows-auto md:grid-rows-2 grid-cols-1">
          {carouselDepartments.map((dept) => {
            const cardPlacement = getCardClasses(dept.slug);
            const isExpanded = !!expandedDepts[dept.slug];
            const outcome = dept.businessOutcomes && dept.businessOutcomes[0];
            const IconComponent = dept.icon;

            return (
              <div
                key={dept.slug}
                onClick={(e) => handleCardClick(dept.slug, dept.link, e)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(37,100,234,0.15)] transition-all duration-500 hover:-translate-y-1 block ${cardPlacement} ${
                  isExpanded 
                    ? 'bg-[#0a0a0c] border border-white/10 shadow-2xl' 
                    : 'border border-transparent'
                }`}
              >
                {/* Background Image */}
                <div className={`absolute inset-0 z-0 overflow-hidden rounded-2xl transition-opacity duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <img
                    src={dept.image}
                    alt={dept.title}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${dept.imageClass}`}
                  />
                  {/* Subtle overall dark tint for contrast */}
                  <div className="absolute inset-0 bg-black/25 z-[1] group-hover:bg-black/15 transition-colors duration-500" />
                  
                  {/* Premium top gradient vignette */}
                  <div
                    className="absolute inset-x-0 top-0 h-1/2 z-[2]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.45) 45%, rgba(0, 0, 0, 0) 100%)',
                    }}
                  />
                </div>

                {/* Hover Gradient Overlay */}
                {!isExpanded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2564ea]/90 to-[#4ab6d4]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                )}

                {/* Default Content Overlay */}
                <div className={`relative z-20 h-full flex flex-col justify-between p-8 lg:p-10 transition-opacity duration-300 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                      {dept.title}
                    </h3>
                    <p className="text-xs lg:text-sm font-semibold text-brand-cyan mb-6 group-hover:text-white transition-colors duration-300 shrink-0">
                      {dept.subtitle}
                    </p>

                    {/* Description vs Top Services container */}
                    <div className="relative flex-1">
                      {/* Short Description (Visible by default, hidden on hover) */}
                      <p className="bento-desc absolute inset-0 text-white/90 leading-relaxed text-sm lg:text-[15px]">
                        {dept.description}
                      </p>

                      {/* Top Services List (Hidden by default, visible on hover) */}
                      <ul className="bento-services absolute inset-0 space-y-2.5">
                        <span className="block text-xs font-bold uppercase tracking-widest text-brand-cyan mb-2.5">Key Services:</span>
                        {dept.topServices.slice(0, 6).map((service, sIdx) => (
                          <li key={sIdx} className="flex items-start text-white/90 text-[13px] lg:text-sm font-medium">
                            <span className="mr-2 text-brand-cyan opacity-80">✦</span>
                            {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Floating Action Link Button */}
                  <div className="inline-flex items-center text-white font-bold w-fit mt-4 shrink-0 transition-all duration-300 group-hover:translate-x-1.5 text-sm lg:text-base">
                    Learn More
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Detailed Content Overlay */}
                <div
                  className={`absolute inset-0 z-30 bg-[#0a0a0c]/98 backdrop-blur-xl p-6 lg:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar transition-all duration-500 ease-in-out border-t border-white/10 ${
                    isExpanded 
                      ? 'opacity-100 pointer-events-auto translate-y-0' 
                      : 'opacity-0 pointer-events-none translate-y-4'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    {/* Top Row: Icon & Category badge */}
                    <div className="flex items-center justify-between mb-4">
                      {IconComponent && (
                        <div 
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-white relative overflow-hidden group/icon"
                          style={{
                            background: `linear-gradient(135deg, ${dept.accentColor} 0%, ${dept.accentColor}dd 100%)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                          <IconComponent className="w-5.5 h-5.5 sm:w-6 sm:h-6 relative z-10" strokeWidth={1.5} fill="currentColor" />
                        </div>
                      )}
                      <span className="text-[9px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 font-mono">
                        {dept.serviceCount} Capabilities
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight font-display">
                      {dept.title}
                    </h4>
                    <p className="text-[9px] sm:text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest font-mono">
                      {dept.subtitle}
                    </p>

                    {/* Outcome Badge in Glass Container */}
                    {outcome && (
                      <div className="mb-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-md">
                        <span 
                          className="text-xl sm:text-2xl font-black shrink-0 tracking-tight leading-none drop-shadow-md"
                          style={{ color: dept.accentColor }}
                        >
                          {outcome.metric}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-300 leading-snug font-medium">
                          {outcome.label}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {dept.description}
                    </p>

                    {/* Custom Visual Panel Mockup */}
                    {VISUAL_PANELS[dept.slug]}
                  </div>

                  {/* Bottom Link (leaves space for close button via pr-14) */}
                  <div className="pt-4 border-t border-white/5 mt-6 flex justify-between items-center pr-14">
                    <Link
                      to={dept.link}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors group/link"
                    >
                      Explore Full Department
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Floating Plus/X Action Button */}
                <button
                  onClick={(e) => toggleExpand(dept.slug, e)}
                  className={`toggle-expand-btn absolute bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isExpanded 
                      ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 hover:scale-110 active:scale-95' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:scale-110 active:scale-95'
                  }`}
                  aria-label={isExpanded ? "Collapse details" : "Expand details"}
                >
                  {isExpanded ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default DepartmentCarousel;

