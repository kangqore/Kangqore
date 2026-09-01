import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Cpu } from 'lucide-react';

const FAQTeleprompter = ({ faqs }) => {
  const [faqIdx, setFaqIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setFaqIdx(0);
  }, [faqs]);

  const safeFaqIdx = (faqs && faqs.length > 0 && faqIdx >= 0 && faqIdx < faqs.length) ? faqIdx : 0;
  const currentFaq = faqs?.[safeFaqIdx] || faqs?.[0] || {};
  const fullText = currentFaq?.a || '';
  // Calculate dynamic duration: 30ms per character + 10 seconds pause at the end
  const durationMs = Math.max(8000, (fullText.length * 30) + 10000);
  const durationSec = (durationMs / 1000).toFixed(1);

  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
    
    const timer = setTimeout(() => {
      setFaqIdx((prev) => (prev + 1) % faqs.length);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [faqIdx, faqs, durationMs]);

  // Typewriter effect
  useEffect(() => {
    if (!faqs || faqs.length === 0) return;
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

  // Auto-scroll to bottom as text is typed
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText]);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl p-4 flex flex-col font-mono text-[11px] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gradient animate-pulse" />
          <span className="text-white/60 font-bold uppercase tracking-wider text-[11px]">FAQ FEED</span>
        </div>
        <span className="text-white/60 text-[11px]">Q: {faqIdx + 1}/{faqs.length}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2 overflow-hidden relative">
        <div 
          key={faqIdx} 
          className="flex flex-col w-full h-full animate-fade-in-up"
        >
          <div className="font-bold bg-brand-gradient bg-clip-text text-transparent mb-1 flex gap-2 items-start shrink-0">
            <span className="shrink-0">[Q]</span> 
            <span className="line-clamp-2">{faqs[faqIdx]?.q}</span>
          </div>
          {/* Scrolls, so it needs to be reachable and scrollable from the
              keyboard. Without tabIndex nobody navigating without a mouse can
              read past the visible portion of the answer. */}
          <div 
            ref={containerRef}
            tabIndex={0}
            role="region"
            aria-label={`Answer: ${faqs[faqIdx]?.q || 'FAQ'}`}
            className="text-white/80 leading-relaxed overflow-y-auto pr-1 whitespace-pre-wrap scrollbar-hide" 
            style={{ maxHeight: '100%' }}
          >
            <span className="text-white/50 mr-2 shrink-0">[A]</span>
            {displayText}
            {isTyping && <span className="inline-block w-1 h-3 bg-brand-gradient ml-1 animate-pulse" />}
          </div>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            key={`faq-progress-${faqIdx}`} 
            className="h-full bg-brand-gradient opacity-50"
            style={{ animation: `progress ${durationSec}s linear` }}
          />
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
    setCapIdx(0);
  }, [capabilities]);

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

  const safeCapIdx = (capIdx >= 0 && capIdx < capabilities.length) ? capIdx : 0;
  const currentCap = capabilities[safeCapIdx] || capabilities[0] || {};

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
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/90">
              Capability {safeCapIdx + 1}/{capabilities.length}
            </p>
          </div>
          
          <div
            key={`title-${safeCapIdx}`}
            /* `line-clamp` needs display:-webkit-box, and the `flex` that used
               to sit here won the display cascade — so the clamp never applied
               and any capability title over roughly forty characters ran down
               over the progress bar and the arrow button. Measured at 18px of
               overflow on /services/robotic-process-automation before this.
               `h-full flex items-center` was also inert: the wrapper is
               position:absolute with auto height, so there was nothing to
               center against. Three lines, not four — at the lg card width
               (184px) four lines still reach past the bar. */
            className="text-lg xl:text-xl font-black text-white tracking-tight leading-[1.2] animate-fade-in-up overflow-hidden line-clamp-3 mt-2"
          >
            {currentCap.title || ''}
          </div>
        </div>

        {/* Mini progress bar — bottom-left */}
        <div className="absolute bottom-6 left-5 right-12 h-[2px] bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{ width: `${((safeCapIdx + 1) / capabilities.length) * 100}%` }}
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
