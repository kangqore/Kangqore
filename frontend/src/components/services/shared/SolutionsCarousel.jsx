// ─── Solutions Carousel ────────────────────────────────────────────────────────
// A numbered, horizontally scrolling band of solution cards.
//
// Data-driven, unlike EPISolutionsCarousel, whose four cards are hardcoded into
// the component and cannot be reused. This one renders whatever a service puts
// in `solutionsCarousel`, so a second page wanting the same treatment needs
// data and no new component.
//
// Renders nothing without items, so it is safe to mount unconditionally.
// ────────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';

const SolutionsCarousel = ({ eyebrow, title, titleHighlight, subtitle, items = [] }) => {
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
          opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [items.length]);

  // The arrows are the only affordance on a desktop trackpad-less mouse, so
  // they report their own reachability rather than sitting permanently active.
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
    // One card plus its gap, so a click always lands a card on the left edge
    // instead of leaving a sliver of the previous one.
    const card = el.querySelector('.sol-card');
    const step = card ? card.getBoundingClientRect().width + 24 : 380;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="max-w-3xl">
            {eyebrow && (
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-px bg-white/25" />
                <span className="text-[11px] font-black tracking-[0.35em] text-white/60 uppercase">{eyebrow}</span>
              </div>
            )}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.08]">
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">{titleHighlight}</span>
                </>
              )}
            </h2>
            {subtitle && (
              <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed mt-6 max-w-2xl">{subtitle}</p>
            )}
          </div>

          <div className="flex gap-3 shrink-0">
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

        {/* tabIndex makes the rail keyboard-scrollable, which is the only way to
            reach later cards without a mouse once the arrows are the affordance. */}
        <div
          ref={railRef}
          tabIndex={0}
          role="group"
          aria-label={title}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory sol-rail focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-3xl"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((s, i) => (
            <article
              key={s.title}
              className="sol-card group relative flex-none w-[280px] sm:w-[330px] lg:w-[380px] snap-start rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 lg:p-9 flex flex-col transition-colors duration-500 hover:border-white/25"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-extrabold tracking-tight bg-brand-gradient bg-clip-text text-transparent tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <h3 className="text-xl lg:text-[1.35rem] font-extrabold text-white tracking-tight mb-4 leading-snug">{s.title}</h3>
              <p className="text-white/55 text-sm lg:text-[0.95rem] font-light leading-relaxed flex-grow">{s.desc}</p>

              {/* Only rendered where a genuinely related page exists. A "learn
                  more" that resolves to the contact form is worse than none. */}
              {s.href && (
                <Link
                  to={s.href}
                  /* py-1.5 carries the 11px line box past the 24px WCAG 2.5.8
                     floor; without it the row measures 17px tall. */
                  className="mt-7 py-1.5 inline-flex items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  {s.linkLabel || 'Learn more'}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: '.sol-rail::-webkit-scrollbar { display: none; }' }} />
    </section>
  );
};

export default SolutionsCarousel;
