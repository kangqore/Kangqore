import React, { useEffect, useState, useMemo } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
import { departmentsData, departmentsList } from '../../data/departmentsData';
import { servicesData } from '../../data/servicesData';

/**
 * Two stacked cards for the hero right panel — chat-bubble style, compact.
 *
 * UPPER CARD: relatable photo (4 themes cycle) with text overlay
 * LOWER CARD: brand-gradient showing all 62 services on a fast loop.
 */
const SERVICE_ROTATE_MS = 2800; // Faster loop for services

const EqoreIntelligenceFeed = ({ allServices }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!allServices || allServices.length === 0) return;
    
    // Initial populate
    setLogs(allServices.slice(0, 5).map((s, i) => ({ ...s, id: i })));
    
    let currentIndex = 5;
    const interval = setInterval(() => {
      const nextService = allServices[currentIndex % allServices.length];
      setLogs(prev => [{ ...nextService, id: Date.now() }, ...prev].slice(0, 5));
      currentIndex++;
    }, 2500);
    return () => clearInterval(interval);
  }, [allServices]);

  const getTagColor = (deptName) => {
    if (!deptName) return 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent';
    const sum = deptName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const types = ['text-emerald-400', 'text-amber-400', 'text-blue-400', 'bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent', 'text-purple-400'];
    return types[sum % types.length];
  };

  return (
    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl p-4 flex flex-col font-mono text-[10px] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/60 font-bold uppercase tracking-wider text-[8px]">SERVICES FEED</span>
        </div>
        <span className="text-white/60 text-[8px]">Total: {allServices?.length || 0}</span>
      </div>

      {/* Scrolling Logs */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {logs.map((log) => (
          <div key={log.id} className="animate-fade-in-up flex gap-2">
            <span className={`font-bold min-w-[50px] ${getTagColor(log.dept)}`}>
              [{log.dept ? log.dept.substring(0, 6).toUpperCase() : 'SYS'}]
            </span>
            <span className="text-white/80 line-clamp-1">{log.name}</span>
          </div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-500/50 animate-[progress_10s_linear_infinite]" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
};

const HeroGlassCards = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [deptIdx, setDeptIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  // Flatten all services from canonical servicesData (62 services)
  const ALL_SERVICES = useMemo(() => {
    return Object.keys(servicesData).map(slug => {
      const svc = servicesData[slug] || {};
      const dept = departmentsData[svc.departmentSlug] || {};
      return {
        name: svc.name || slug,
        dept: dept.shortName || dept.name || svc.departmentSlug || '',
        slug: slug,
        deptSlug: svc.departmentSlug || ''
      };
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  // Interval for Lower Card (6 Departments)
  useEffect(() => {
    if (reducedMotion || paused) return;
    const interval = setInterval(() => {
      setDeptIdx((prev) => (prev + 1) % departmentsList.length);
    }, SERVICE_ROTATE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, paused]);

  const currentDeptSlug = departmentsList[deptIdx];
  const currentDept = departmentsData[currentDeptSlug] || {};

  return (
    <div
      className="hidden lg:flex flex-col gap-8 w-[184px] xl:w-[208px] ml-auto translate-x-8 xl:translate-x-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="rotating informational cards"
    >
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="blob-cutout" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.15 A 0.12,0.15 0 0 1 0.12,0 L 0.88,0 A 0.12,0.15 0 0 1 1,0.15 L 1,0.60 A 0.08,0.10 0 0 1 0.92,0.70 A 0.16,0.20 0 0 0 0.76,0.90 A 0.08,0.10 0 0 1 0.68,1 L 0.12,1 A 0.12,0.15 0 0 1 0,0.85 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ───────────── UPPER CARD: eQORE Neural Intelligence Feed ───────────── */}
      <div className="relative aspect-[5/4] drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-500 ease-out group">
        <div 
          className="absolute inset-0 transition-all duration-500 overflow-hidden"
          style={{ clipPath: 'url(#blob-cutout)' }}
        >
          <EqoreIntelligenceFeed allServices={ALL_SERVICES} />
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          onClick={() => window.location.href = '/insights'}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/20 z-10"
          aria-label="View system insights"
        >
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={2.5} />
        </button>
      </div>

      {/* ───────────── LOWER CARD: Glassmorphism + Service Loop ───────────── */}
      <div className="relative aspect-[5/4] drop-shadow-[0_20px_40px_rgba(37,100,234,0.2)] hover:-translate-y-2 transition-all duration-500 ease-out group">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#2564ea]/12 to-[#4ab6d4]/12 backdrop-blur-2xl border border-white/20 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          style={{ clipPath: 'url(#blob-cutout)' }}
        >
          {/* Atmospheric glow accents */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white dark:bg-black/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white dark:bg-black/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top-left content */}
          <div className="absolute top-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-1.5 opacity-80">
              <Cpu className="w-3 h-3 text-white" />
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">
                Department {deptIdx + 1}/{departmentsList.length}
              </p>
            </div>
            
            <p
              key={`cat-${deptIdx}`}
              className="text-[10px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-[#2564ea] to-[#4ab6d4] bg-clip-text text-transparent mb-1 animate-fade-in line-clamp-1"
            >
              {currentDept.tagline}
            </p>
            
            <div
              key={`dept-${deptIdx}`}
              className="text-lg xl:text-xl font-black text-white tracking-tight leading-[1.2] animate-fade-in h-[3.6rem] overflow-hidden line-clamp-3"
            >
              {currentDept.name}
            </div>
          </div>

          {/* Mini progress bar — bottom-left */}
          <div className="absolute bottom-6 left-5 right-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{ width: `${((deptIdx + 1) / departmentsList.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          onClick={() => window.location.href = `/department/${currentDept.slug}`}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/20 z-10"
          aria-label="See more"
        >
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default HeroGlassCards;
