import React, { useEffect, useState, useMemo } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
import { departmentData } from '../../data/departmentData';

/**
 * Two stacked cards for the hero right panel — chat-bubble style, compact.
 *
 * UPPER CARD: relatable photo (4 themes cycle) with text overlay
 * LOWER CARD: brand-gradient showing all 61 services on a fast loop.
 */
const SERVICE_ROTATE_MS = 2800; // Faster loop for services

const EqoreIntelligenceFeed = () => {
  const [logs, setLogs] = useState([
    { id: 1, type: 'SUCCESS', text: 'Cloud Mesh Optimization complete (+14% efficiency)', time: '0ms' },
    { id: 2, type: 'REASONING', text: 'Evaluating agentic workflows for Supply Chain...', time: '1.2s' },
    { id: 3, type: 'SECURE', text: 'Zero-Trust handshake validated across 14 nodes.', time: '2.5s' },
  ]);

  useEffect(() => {
    const rawLogs = [
      { type: 'SUCCESS', text: 'Cloud Mesh Optimization complete (+14% efficiency)' },
      { type: 'REASONING', text: 'Evaluating agentic workflows for Supply Chain...' },
      { type: 'SECURE', text: 'Zero-Trust handshake validated across 14 nodes.' },
      { type: 'ACTIVE', text: 'eQORE Concierge handling 42 executive sessions' },
      { type: 'INFRA', text: 'Scaling Kubernetes cluster for peak demand' },
      { type: 'AI', text: 'Model reasoning: "Determine optimal claims path"' },
      { type: 'DATA', text: 'Synced 4.2TB across distributed data lakes' },
      { type: 'INSIGHT', text: 'Predictive Maintenance anomaly detected (R4)' },
      { type: 'SYNC', text: 'Global state synchronization complete' },
      { type: 'AGENT', text: 'Autonomous agent "Alpha" dispatched to Finance' },
    ];
    const interval = setInterval(() => {
      const nextLog = rawLogs[Math.floor(Math.random() * rawLogs.length)];
      setLogs(prev => [{ ...nextLog, id: Date.now() }, ...prev].slice(0, 5));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-xl p-4 flex flex-col font-mono text-[10px] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/60 font-bold uppercase tracking-wider text-[8px]">eQORE™ NEURAL FEED</span>
        </div>
        <span className="text-white/30 text-[8px]">Uptime: 99.99%</span>
      </div>

      {/* Scrolling Logs */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        {logs.map((log) => (
          <div key={log.id} className="animate-fade-in-up flex gap-2">
            <span className={`font-bold min-w-[50px] ${
              log.type === 'SUCCESS' ? 'text-emerald-400' :
              log.type === 'REASONING' ? 'text-amber-400' :
              log.type === 'SECURE' ? 'text-blue-400' :
              'text-cyan-400'
            }`}>
              [{log.type}]
            </span>
            <span className="text-white/80 line-clamp-1">{log.text}</span>
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
  const [serviceIdx, setServiceIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  // Flatten all services from departmentData
  const ALL_SERVICES = useMemo(() => {
    return departmentData.flatMap(dept => 
      dept.services.map(service => ({
        name: service.name,
        dept: dept.name,
        slug: service.slug,
        deptSlug: dept.slug
      }))
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  // Interval for Lower Card (61 Services)
  useEffect(() => {
    if (reducedMotion || paused) return;
    const interval = setInterval(() => {
      setServiceIdx((prev) => (prev + 1) % ALL_SERVICES.length);
    }, SERVICE_ROTATE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, paused, ALL_SERVICES.length]);

  const currentService = ALL_SERVICES[serviceIdx];

  return (
    <div
      className="hidden lg:flex flex-col gap-5 w-[184px] xl:w-[208px] ml-auto"
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
          className="absolute inset-0 bg-[#0a1228] transition-all duration-500 overflow-hidden"
          style={{ clipPath: 'url(#blob-cutout)' }}
        >
          <EqoreIntelligenceFeed />
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          onClick={() => window.location.href = '/insights'}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#0a192f] text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-black active:scale-95 transition-all duration-300 shadow-2xl ring-2 ring-white/10 z-10"
          aria-label="View system insights"
        >
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={2.5} />
        </button>
      </div>

      {/* ───────────── LOWER CARD: Glassmorphism + Service Loop ───────────── */}
      <div className="relative aspect-[5/4] drop-shadow-[0_20px_40px_rgba(37,100,234,0.2)] hover:-translate-y-2 transition-all duration-500 ease-out group">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#2564ea]/40 to-[#4ab6d4]/40 backdrop-blur-2xl border border-white/30 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
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
                Service {serviceIdx + 1}/61
              </p>
            </div>
            
            <p
              key={`dept-${serviceIdx}`}
              className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200 mb-1 animate-fade-in line-clamp-1"
            >
              {currentService.dept}
            </p>
            
            <div
              key={`service-${serviceIdx}`}
              className="text-lg xl:text-xl font-black text-white tracking-tight leading-[1.2] animate-fade-in h-[3.6rem] overflow-hidden line-clamp-3"
            >
              {currentService.name}
            </div>
          </div>

          {/* Mini progress bar — bottom-left */}
          <div className="absolute bottom-6 left-5 right-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-linear"
              style={{ width: `${((serviceIdx + 1) / ALL_SERVICES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          onClick={() => window.location.href = `/services/${currentService.deptSlug}/${currentService.slug}`}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#0a192f] text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-black active:scale-95 transition-all duration-300 shadow-2xl ring-2 ring-white/10 z-10"
          aria-label="See more"
        >
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default HeroGlassCards;
