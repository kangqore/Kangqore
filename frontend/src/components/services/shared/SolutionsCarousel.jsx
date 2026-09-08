// ─── Solutions Carousel (Apple-Inspired Design) ──────────────────────────────────
// Horizontally scrolling cards inspired by Apple's card design:
// - Deep obsidian black container with smooth rounded corners (rounded-[34px])
// - Bold, crisp title at the top
// - Rich, expressive middle graphic artwork
// - Bottom area: card description on the left, decorative showpiece '+' badge on the right
// ────────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { getSolutionVisual } from './SolutionsCardVisuals';

const SolutionsCarousel = ({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  items = [],
  numbered = false,
}) => {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (!items.length) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sol-card',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [items.length]);

  // Sync reachability for scroll arrows
  const syncEdges = () => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };

  useEffect(() => {
    syncEdges();
    const el = railRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [items.length]);

  const nudge = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('.sol-card');
    const step = card ? card.getBoundingClientRect().width + 24 : 420;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header: Eyebrow + Heading on Left, Description on Top-Right */}
        <div className="mb-14">
          {eyebrow && (
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-px bg-white/25" />
              <span className="text-[11px] font-black tracking-[0.35em] text-white/60 uppercase">
                {eyebrow}
              </span>
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 lg:gap-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.08]">
                {title}
                {titleHighlight && (
                  <>
                    <br />
                    <span className="bg-brand-gradient bg-clip-text text-transparent">
                      {titleHighlight}
                    </span>
                  </>
                )}
              </h2>
            </div>

            {subtitle && (
              <div className="max-w-xl lg:max-w-md xl:max-w-xl shrink-0 lg:pt-2">
                <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scrolling Card Rail */}
        <div
          ref={railRef}
          tabIndex={0}
          role="group"
          aria-label={title}
          className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory sol-rail focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-3xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((s, i) => (
            <article
              key={s.title}
              className="sol-card group relative flex-none w-[320px] sm:w-[410px] lg:w-[450px] h-[480px] sm:h-[500px] snap-start rounded-[32px] sm:rounded-[36px] bg-[#050508] border border-white/[0.08] hover:border-white/20 p-8 sm:p-9 flex flex-col justify-between overflow-hidden transition-all duration-500 shadow-2xl"
              style={{ opacity: 0 }}
            >
              {/* Subtle ambient lighting on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/[0.07] rounded-full blur-3xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700" />

              {/* Numbering (optional, disabled by default) */}
              {numbered && (
                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <span className="text-3xl font-extrabold tracking-tight bg-brand-gradient bg-clip-text text-transparent tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              )}

              {/* Top: Clean Headline */}
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[1.65rem] font-bold text-white tracking-tight leading-[1.18] group-hover:text-blue-200/90 transition-colors">
                  {s.title}
                </h3>
              </div>

              {/* Middle: Expressive Artwork Showcase */}
              <div className="relative z-10 flex-1 w-full my-3 flex items-center justify-center min-h-[190px] overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
                {getSolutionVisual(s.title, i)}
              </div>

              {/* Bottom Area: Card description */}
              <div className="relative z-10 pt-2">
                <p className="text-white/65 text-sm sm:text-[0.92rem] font-normal leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Navigation Affordance: Right-Aligned < and > */}
        <div className="flex justify-end items-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Previous solutions"
            className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center transition-colors duration-300 enabled:hover:border-white/40 enabled:hover:bg-white/5 disabled:opacity-30 disabled:cursor-default"
          >
            <ArrowRight className="w-5 h-5 text-white/70 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Next solutions"
            className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center transition-colors duration-300 enabled:hover:border-white/40 enabled:hover:bg-white/5 disabled:opacity-30 disabled:cursor-default"
          >
            <ArrowRight className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .sol-rail::-webkit-scrollbar { display: none; }
      `,
        }}
      />
    </section>
  );
};

export default SolutionsCarousel;
