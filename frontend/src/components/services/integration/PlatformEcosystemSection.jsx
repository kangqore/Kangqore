import React, { useState, useEffect } from 'react';
import { 
  Network, Globe, Zap, Layers, Cpu, Eye, ArrowRight, ShieldCheck, 
  CheckCircle2, Server, Terminal, ExternalLink, Database, Settings, 
  Boxes, Truck, Workflow, Users, Activity, BarChart, Shield, Search, 
  Radio, Compass, LayoutGrid, Cloud, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ═══════════════════════════════════════════════════════════════════════════════
   PLATFORM ECOSYSTEM SECTION — ARCHITECTURAL PLATFORMS & CAPABILITY COCKPIT
   Design: Chamfered Tech Cards with Layered 3D Fanned Gradient Wings & Liquid Obsidian Finish
   ═══════════════════════════════════════════════════════════════════════════════ */

const ICON_REGISTRY = {
  Network, Globe, Zap, Layers, Cpu, Eye, ShieldCheck, Server, 
  Database, Settings, Boxes, Truck, Workflow, Users, Activity, 
  BarChart, Shield, Search, Radio, Compass, LayoutGrid, Cloud, RefreshCw
};

export const PlatformEcosystemSection = ({
  eyebrow = 'THE PLATFORM ECOSYSTEM',
  title = 'The platforms,',
  titleHighlight = 'and what each is actually for.',
  subtitle = 'Platform choice is mostly settled by what the group already licenses and by whether the hard problem is transformation, throughput or partner exchange.',
  items = []
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setActiveTab(0);
  }, [items]);

  // Normalize items to ensure consistent schema
  const normalizedItems = (items && items.length > 0 ? items : []).map((item, idx) => {
    // Resolve icon
    let IconComp = Network;
    if (typeof item.icon === 'string') {
      IconComp = ICON_REGISTRY[item.icon] || Network;
    } else if (item.icon) {
      IconComp = item.icon;
    }

    // Resolve managed list
    let managedList = [];
    if (Array.isArray(item.managed)) {
      managedList = item.managed;
    } else if (typeof item.managed === 'string' && item.managed.length > 0) {
      managedList = item.managed.split(',').map(s => s.trim());
    }

    // Resolve selfHosted list
    let selfHostedList = [];
    if (Array.isArray(item.selfHosted)) {
      selfHostedList = item.selfHosted;
    } else if (typeof item.selfHosted === 'string' && item.selfHosted.length > 0) {
      selfHostedList = item.selfHosted.split(';').map(s => s.trim());
    }

    // Resolve category/tier
    const category = item.category || item.tag || (item.title ? item.title.toUpperCase().split(' ')[0] + ' FABRIC' : 'CORE PLANE');
    const num = item.num || String(idx + 1).padStart(2, '0');
    const keyRule = item.keyRule || item.rule || item.architecturalTruth || (selfHostedList[0] || 'Baseline architecture over bespoke point-to-point customization.');

    return {
      ...item,
      num,
      iconComp: IconComp,
      category,
      managedList,
      selfHostedList,
      keyRule
    };
  });

  const safeActiveTab = activeTab < normalizedItems.length ? activeTab : 0;
  const activeItem = normalizedItems[safeActiveTab] || {
    num: '01',
    title: 'Platform Architecture',
    category: 'CORE PLANE',
    desc: 'Production architecture specification for enterprise platform operations.',
    managedList: [],
    selfHostedList: [],
    keyRule: 'Governed architecture with end-to-end verification.'
  };

  // Auto-cycle through the platform tabs every 3 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || normalizedItems.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % normalizedItems.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused, normalizedItems.length]);

  if (normalizedItems.length === 0) return null;

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-20 md:py-32 bg-[#000000] relative overflow-hidden text-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* ── SECTION HEADER (2-COLUMN: HEADING LEFT, SUBTITLE RIGHT) ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-16 mb-16 md:mb-20">
          <div className="max-w-2xl">
            {eyebrow && (
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-12 bg-white/20" />
                <span className="text-sm font-semibold text-white/60 uppercase tracking-widest">
                  {eyebrow}
                </span>
              </div>
            )}
            <h2 className="text-[1.8rem] sm:text-[2.4rem] lg:text-[3rem] font-extrabold leading-[1.2] tracking-tight text-white font-display">
              {title}{' '}
              {titleHighlight && (
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  {titleHighlight}
                </span>
              )}
            </h2>
          </div>

          {subtitle && (
            <div className="max-w-xl lg:pb-2">
              <p className="text-white/60 text-base sm:text-lg leading-relaxed font-sans">
                {subtitle}
              </p>
            </div>
          )}
        </div>

        {/* ── MAIN SHOWCASE: FANNED 3D WINGS + MASTER CHAMFERED CARD CONTAINER ── */}
        <div className="relative w-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">

          {/* ═══ LEFT SIDE: 3D FANNED GEOMETRIC GRADIENT FINS ═══ */}
          <div className="w-full lg:w-[38%] flex flex-col justify-between relative">
            
            {/* Background Fanned Fin Layers with 3D White Glassmorphism */}
            <div className="relative w-full flex flex-col gap-2.5">
              {normalizedItems.map((item, idx) => {
                const Icon = item.iconComp;
                const isActive = safeActiveTab === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className="relative cursor-pointer group transition-all duration-300 select-none"
                  >
                    {/* Fin Wing Shape */}
                    <div
                      style={{
                        clipPath: 'polygon(16px 0%, 100% 0%, calc(100% - 16px) 100%, 0% 100%)',
                        transform: isActive ? 'translateX(10px) scale(1.02)' : 'translateX(0px)',
                      }}
                      className={`relative flex items-center justify-between px-5 py-3.5 transition-all duration-300 overflow-hidden ${
                        isActive
                          ? 'bg-[#181818] border-t border-b border-[#2a2a2a] shadow-[0_16px_40px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                          : 'backdrop-blur-2xl border-t border-b border-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:-translate-y-0.5'
                      }`}
                    >
                      {/* Active State: Liquid Black Impasto Paint Texture */}
                      {isActive && (
                        <>
                          <img
                            src="/images/capabilities/liquid-black-texture.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-90 select-none"
                          />
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg, rgba(16, 16, 18, 0.45) 0%, rgba(24, 24, 28, 0.25) 50%, rgba(16, 16, 18, 0.5) 100%)'
                            }}
                          />
                        </>
                      )}

                      {/* Inactive State 3D Iridescent Artwork Background */}
                      {!isActive && (
                        <>
                          <img
                            src="/images/capabilities/iridescent-glass-slabs-bg.jpg"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-60 select-none"
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.88) 0%, rgba(235, 242, 252, 0.75) 50%, rgba(255, 255, 255, 0.84) 100%)',
                            }}
                          />
                          <div className="absolute inset-0 pointer-events-none opacity-70 bg-gradient-to-b from-white via-transparent to-transparent" />
                        </>
                      )}

                      {/* Content Row */}
                      <div className="flex items-center gap-3.5 relative z-10">
                        <span className={`text-xs font-mono font-black tracking-widest transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`}>
                          {item.num}
                        </span>
                        <div className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-950'}`}>
                          <Icon className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-xs sm:text-sm font-bold tracking-tight font-display transition-colors ${isActive ? 'text-white font-extrabold' : 'text-slate-800 group-hover:text-slate-950'}`}>
                            {item.title}
                          </span>
                          <span className={`text-[11px] font-mono tracking-wider uppercase font-semibold transition-colors ${isActive ? 'text-white/60' : 'text-slate-500'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Right Arrow Indicator */}
                      <div className={`relative z-10 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100 text-white' : '-translate-x-2 opacity-0 group-hover:opacity-80 text-slate-700'}`}>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ RIGHT SIDE: MASTER CHAMFERED ARCHITECTURE CARD WITH 3D GLASS ARTWORK ═══ */}
          <div className="w-full lg:w-[62%] relative flex flex-col">
            
            {/* Chamfered Card Wrapper */}
            <div
              style={{
                clipPath: 'polygon(32px 0%, 100% 0%, 100% calc(100% - 32px), calc(100% - 32px) 100%, 0% 100%, 0% 32px)',
              }}
              className="relative w-full flex flex-col justify-between overflow-hidden backdrop-blur-3xl border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,1),inset_0_-2px_4px_rgba(0,0,0,0.06)] min-h-[480px]"
            >
              {/* 3D Iridescent Frosted Glass Background Artwork */}
              <img
                src="/images/capabilities/iridescent-glass-slabs-bg.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none opacity-85 select-none"
              />

              {/* Frosted Glass Overlay with Studio Lighting */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(244, 248, 255, 0.78) 50%, rgba(255, 255, 255, 0.88) 100%)'
                }}
              />

              {/* Specular Black Highlight on Top Edge */}
              <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-black to-transparent z-20" />

              {/* Ambient bottom light flare */}
              <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />

              {/* ── CARD BODY CONTENT ── */}
              <div className="p-6 sm:p-10 lg:p-12 relative z-10 flex flex-col justify-between h-full flex-grow">
                
                {/* Top Row: 3D Black Capsule Badge + Category Icon */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-[#25252a] via-[#141418] to-[#08080b] border border-white/20 text-white shadow-[0_4px_10px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.8)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-white/95">
                        TIER {activeItem.num} · {activeItem.category}
                      </span>
                    </div>

                    {/* Standalone Black Icon */}
                    <div className="text-slate-950 p-1">
                      {React.createElement(activeItem.iconComp, { className: "w-6 h-6 stroke-[2.2]" })}
                    </div>
                  </div>

                  {/* Title & Core Thesis Paragraph */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight mb-4 font-display">
                    {activeItem.title}
                  </h3>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-2xl font-sans font-medium mb-8">
                    {activeItem.desc}
                  </p>
                </div>

                {/* Sub-Card Grid: Managed Platforms vs Self-Hosted / Architecture */}
                <div className="pt-6 border-t border-slate-300/80 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    
                    {/* Sub-Card 1: MANAGED / CLOUD */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/95 via-white/85 to-[#f0f4fc]/90 border border-white shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold text-slate-900 tracking-wider">
                          MANAGED / CLOUD
                        </span>
                        <Cloud className="w-3.5 h-3.5 text-slate-900" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeItem.managedList.length > 0 ? (
                          activeItem.managedList.map((m, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-b from-white to-[#f5f6f9] border border-slate-200/80 text-slate-900 font-semibold font-sans shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-slate-400 hover:shadow-md transition-all"
                            >
                              {m}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-600 font-medium">Standard Cloud & SaaS Services</span>
                        )}
                      </div>
                    </div>

                    {/* Sub-Card 2: SELF-HOSTED / PERIMETER */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/95 via-white/85 to-[#f0f4fc]/90 border border-white shadow-[0_8px_20px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-mono font-bold text-slate-900 tracking-wider">
                          SELF-HOSTED / PERIMETER
                        </span>
                        <Server className="w-3.5 h-3.5 text-slate-900" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeItem.selfHostedList.length > 0 ? (
                          activeItem.selfHostedList.map((s, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-b from-white to-[#f5f6f9] border border-slate-200/80 text-slate-900 font-semibold font-sans shadow-[0_2px_6px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] hover:border-slate-400 hover:shadow-md transition-all"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-600 font-medium">Customer-operated VPC & on-premise nodes</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── CARD FOOTER BAR (SOLID #181818 COLOR) ── */}
              <div className="w-full bg-[#181818] border-t border-[#2a2a2a] p-5 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
                
                {/* Footer Specular Bottom Highlight (White Line) */}
                <div className="absolute bottom-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-20" />

                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-white shrink-0" />
                  <span className="text-xs text-white/70 font-mono leading-tight">
                    <strong className="text-white font-semibold">Architectural Truth:</strong> {activeItem.keyRule}
                  </span>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-white via-[#f4f5f8] to-[#d8dbe0] text-slate-950 text-xs font-bold tracking-wide transition-all shrink-0 border border-white shadow-[0_4px_14px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Talk To Our Experts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformEcosystemSection;
