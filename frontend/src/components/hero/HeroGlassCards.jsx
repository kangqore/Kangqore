import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Two stacked cards for the hero right panel — chat-bubble style, compact.
 *
 * UPPER CARD: relatable photo (4 themes cycle) with text overlay
 * LOWER CARD: brand-gradient with verified metric (synced with upper)
 *
 * Synced rotation every ~5.5s. Dash-style progress indicator inside the
 * lower card, bottom-left. Black circular arrow buttons hang off the
 * bottom-right corners of each card (chat-bubble accent).
 *
 * Hidden below `lg`. Halved size from the previous version.
 */

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=600&q=80',
    imageAlt: 'Engineering team',
    headline: 'Built for production.',
    metric: '61',
    metricLabel: 'services across our practice',
  },
  {
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    imageAlt: 'AI cognitive systems',
    headline: 'Deep specialization.',
    metric: '15',
    metricLabel: 'specialized practice areas',
  },
  {
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    imageAlt: 'Cloud infrastructure',
    headline: 'Across many sectors.',
    metric: '12',
    metricLabel: 'industries we work across',
  },
  {
    image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=600&q=80',
    imageAlt: 'Documented engineering depth',
    headline: 'Documented depth.',
    metric: '77+',
    metricLabel: 'detailed service pages',
  },
];

const ROTATE_MS = 5500;

const HeroGlassCards = () => {
  const [activeIdx, setActiveIdx] = useState(0);
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
    if (reducedMotion || paused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [reducedMotion, paused]);

  const slide = SLIDES[activeIdx];

  return (
    <div
      className="hidden lg:flex flex-col gap-3 w-[210px] xl:w-[230px] ml-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="rotating informational cards"
    >
      {/* ───────────── UPPER CARD: Image with cutout ───────────── */}
      <div className="relative aspect-[5/4]">
        {/* Masked Card Background & Image */}
        <div 
          className="absolute inset-0 rounded-[1.75rem] overflow-hidden bg-[#0a1228] shadow-xl"
          style={{
            WebkitMaskImage: 'radial-gradient(circle 64px at 100% 100%, transparent 64px, black 65px)',
            maskImage: 'radial-gradient(circle 64px at 100% 100%, transparent 64px, black 65px)'
          }}
        >
          {/* Crossfade image stack */}
          {SLIDES.map((s, i) => (
            <img
              key={s.image}
              src={s.image}
              alt={i === activeIdx ? s.imageAlt : ''}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
                i === activeIdx ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              aria-hidden={i !== activeIdx}
            />
          ))}

          {/* Dark gradient for text legibility at top */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent" />

          {/* Top-left content */}
          <div className="absolute top-0 left-0 right-0 p-5 pr-10">
            <p
              key={`headline-${activeIdx}`}
              className="text-xl font-bold text-white leading-tight animate-fade-in font-display"
            >
              {slide.headline}
            </p>
          </div>
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          className="absolute bottom-0 right-0 w-[48px] h-[48px] rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-100 transition-all shadow-lg ring-1 ring-white/10"
          aria-label="Learn more"
        >
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* ───────────── LOWER CARD: Glassmorphism + metric ───────────── */}
      <div className="relative aspect-[5/4]">
        <div
          className="absolute inset-0 rounded-[1.75rem] overflow-hidden shadow-xl bg-gradient-to-br from-[#2564ea] to-[#4ab6d4] backdrop-blur-lg border border-white/20"
          style={{
            WebkitMaskImage: 'radial-gradient(circle 64px at 100% 100%, transparent 64px, black 65px)',
            maskImage: 'radial-gradient(circle 64px at 100% 100%, transparent 64px, black 65px)'
          }}
        >
          {/* Atmospheric glow accents */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-white dark:bg-black/25 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white dark:bg-black/15 rounded-full blur-2xl pointer-events-none" />

          {/* Top-left content */}
          <div className="absolute top-0 left-0 right-0 p-5">
            <p
              key={`label-${activeIdx}`}
              className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 mb-2 animate-fade-in"
            >
              {slide.metricLabel}
            </p>
            <div
              key={`metric-${activeIdx}`}
              className="text-5xl font-black text-white tracking-tight leading-none animate-fade-in"
            >
              {slide.metric}
            </div>
          </div>

          {/* Progress dashes — bottom-left */}
          <div className="absolute bottom-5 left-5 flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === activeIdx ? 'w-6 bg-white dark:bg-black' : 'w-3 bg-white dark:bg-black/40 hover:bg-white dark:bg-black/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIdx}
              />
            ))}
          </div>
        </div>

        {/* Black circular arrow button — bottom-right cutout */}
        <button
          type="button"
          className="absolute bottom-0 right-0 w-[48px] h-[48px] rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-100 transition-all shadow-lg ring-1 ring-white/10"
          aria-label="See more"
        >
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

export default HeroGlassCards;
