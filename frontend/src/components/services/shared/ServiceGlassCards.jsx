import React, { useEffect, useState } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';

const FAQTeleprompter = ({ faqs }) => {
  const [faqIdx, setFaqIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
    
    const interval = setInterval(() => {
      setFaqIdx((prev) => (prev + 1) % faqs.length);
    }, 8000); // cycle every 8s

    return () => clearInterval(interval);
  }, [faqs]);

  // Typewriter effect
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
    const fullText = faqs[faqIdx]?.a || '';
    setDisplayText('');
    setIsTyping(true);

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30); // 30ms per char

    return () => clearInterval(typingInterval);
  }, [faqIdx, faqs]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl p-4 flex flex-col font-mono text-[10px] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/60 font-bold uppercase tracking-wider text-[8px]">FAQ FEED</span>
        </div>
        <span className="text-white/60 text-[8px]">Q: {faqIdx + 1}/{faqs.length}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden">
        <div className="animate-fade-in-up">
          <div className="font-bold text-cyan-400 mb-1 flex gap-2 items-start">
            <span className="shrink-0">[Q]</span> 
            <span className="line-clamp-2">{faqs[faqIdx]?.q}</span>
          </div>
          <div className="text-white/80 leading-relaxed overflow-y-auto pr-1" style={{ maxHeight: 'calc(100% - 20px)' }}>
            <span className="text-white/40 mr-2 shrink-0">[A]</span>
            {displayText}
            {isTyping && <span className="inline-block w-1 h-3 bg-cyan-400 ml-1 animate-pulse" />}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div key={`faq-progress-${faqIdx}`} className="h-full bg-cyan-500/50 animate-[progress_8s_linear]" />
        </div>
      </div>
    </div>
  );
};

const CapabilityCycler = ({ capabilities }) => {
  const [capIdx, setCapIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused || !capabilities || capabilities.length === 0) return;
    const interval = setInterval(() => {
      setCapIdx((prev) => (prev + 1) % capabilities.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reducedMotion, paused, capabilities]);

  if (!capabilities || capabilities.length === 0) return null;

  const currentCap = capabilities[capIdx];

  return (
    <div 
      className="relative aspect-[5/4] drop-shadow-[0_20px_40px_rgba(37,100,234,0.2)] hover:-translate-y-2 transition-all duration-500 ease-out group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
              Capability {capIdx + 1}/{capabilities.length}
            </p>
          </div>
          
          <p
            key={`title-${capIdx}`}
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200 mb-1 animate-fade-in line-clamp-2"
          >
            {currentCap.title}
          </p>
          
          <div
            key={`desc-${capIdx}`}
            className="text-sm xl:text-base font-medium text-white/80 tracking-tight leading-[1.3] animate-fade-in h-[3.6rem] overflow-hidden line-clamp-3"
          >
            {currentCap.desc}
          </div>
        </div>

        {/* Mini progress bar — bottom-left */}
        <div className="absolute bottom-6 left-5 right-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ width: `${((capIdx + 1) / capabilities.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Black circular arrow button — bottom-right cutout */}
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById('svc-capabilities');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/20 z-10"
        aria-label="See capabilities"
      >
        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={2.5} />
      </button>
    </div>
  );
};

const ServiceGlassCards = ({ faqs, capabilities }) => {
  return (
    <div
      className="hidden lg:flex flex-col gap-8 w-[184px] xl:w-[208px] shrink-0 ml-auto"
      aria-roledescription="rotating informational cards"
    >
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="blob-cutout" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.15 A 0.12,0.15 0 0 1 0.12,0 L 0.88,0 A 0.12,0.15 0 0 1 1,0.15 L 1,0.60 A 0.08,0.10 0 0 1 0.92,0.70 A 0.16,0.20 0 0 0 0.76,0.90 A 0.08,0.10 0 0 1 0.68,1 L 0.12,1 A 0.12,0.15 0 0 1 0,0.85 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ───────────── UPPER CARD: FAQ Teleprompter ───────────── */}
      <div className="relative aspect-[5/4] drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:-translate-y-2 transition-all duration-500 ease-out group">
        <div 
          className="absolute inset-0 transition-all duration-500 overflow-hidden"
          style={{ clipPath: 'url(#blob-cutout)' }}
        >
          <FAQTeleprompter faqs={faqs} />
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('svc-faqs');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 active:scale-95 transition-all duration-300 shadow-2xl backdrop-blur-md border border-white/20 z-10"
          aria-label="View all FAQs"
        >
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" strokeWidth={2.5} />
        </button>
      </div>

      {/* ───────────── LOWER CARD: Capabilities Cycler ───────────── */}
      <CapabilityCycler capabilities={capabilities} />
    </div>
  );
};

export default ServiceGlassCards;
