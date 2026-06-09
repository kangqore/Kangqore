import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'problem',        num: '01', label: 'The Problem'      },
  { id: 'definition',     num: '02', label: 'What Is BIDS™'   },
  { id: 'concierge',      num: '03', label: 'eQORE AI™'       },
  { id: 'ceo-assessment', num: '04', label: 'Self-Assessment'  },
  { id: 'deliverables',   num: '05', label: 'Deliverables'     },
  { id: 'prescription',   num: '06', label: 'Prescription'     },
  { id: 'competitive',    num: '07', label: 'Competitive'      },
  { id: 'engagement',     num: '08', label: 'Engagement'       },
  { id: 'methodology',    num: '09', label: 'Methodology'      },
  { id: 'scorecard',      num: '10', label: 'Scorecard'        },
];

export default function BIDSRuler() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const ratios = new Map(NAV_ITEMS.map(({ id }) => [id, 0]));

    const observers = NAV_ITEMS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          let best = null, bestVal = 0;
          ratios.forEach((v, k) => { if (v > bestVal) { bestVal = v; best = k; } });
          setActive(best);
        },
        { threshold: [0, 0.05, 0.1, 0.2, 0.4, 0.6], rootMargin: '-15% 0px -25% 0px' }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isVisible = active !== null;

  return (
    <div
      className="hidden xl:block fixed z-40"
      style={{ left: '28px', top: '50%', transform: 'translateY(-50%)' }}
    >
      {/* Ruler — outer wrapper */}
      <div className="relative flex flex-col">

        {/* Vertical spine line */}
        <div
          className="absolute left-0 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 15%, rgba(255,255,255,0.07) 85%, transparent)' }}
        />

        {NAV_ITEMS.map(({ id, num, label }) => {
          const isActive = active === id;

          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="group relative flex items-center py-[13px] cursor-pointer focus:outline-none"
              aria-label={`Jump to ${label}`}
            >
              {/* Active dot on spine */}
              {isActive && (
                <div
                  className="absolute left-[-3px] w-[7px] h-[7px] rounded-full border border-white/40 bg-black z-10 transition-all duration-500"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
              )}

              {/* Tick mark extending right from spine */}
              <div
                className="flex-shrink-0 h-px transition-all duration-300"
                style={{
                  width: isActive ? '18px' : '8px',
                  backgroundColor: isActive
                    ? 'rgba(255,255,255,0.45)'
                    : 'rgba(255,255,255,0.12)',
                  marginLeft: '0px',
                }}
              />

              {/* Number */}
              <span
                className="ml-2.5 font-mono text-[8px] font-black tracking-[0.3em] transition-colors duration-300 flex-shrink-0"
                style={{ color: isActive ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)' }}
              >
                {num}
              </span>

              {/* Label — always mounted, opacity controlled */}
              <span
                className="ml-2 text-[9px] font-bold tracking-[0.14em] uppercase whitespace-nowrap transition-all duration-300 overflow-hidden"
                style={{
                  color: isActive
                    ? 'rgba(255,255,255,0.65)'
                    : 'rgba(255,255,255,0.0)',
                  maxWidth: isActive ? '90px' : '0px',
                  opacity: isActive ? 1 : 0,
                }}
              >
                {label}
              </span>

              {/* Hover label — only when not active */}
              {!isActive && (
                <span
                  className="ml-2 text-[9px] font-bold tracking-[0.14em] uppercase whitespace-nowrap overflow-hidden
                             opacity-0 group-hover:opacity-100 transition-all duration-200"
                  style={{
                    color: 'rgba(255,255,255,0.30)',
                    maxWidth: '90px',
                  }}
                >
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
