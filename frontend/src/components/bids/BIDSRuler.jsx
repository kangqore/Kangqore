import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './BIDSRuler.css';

const NAV_ITEMS = [
  { id: 'problem',        num: '01', label: 'The Problem'     },
  { id: 'definition',     num: '02', label: 'What Is BIDS™'  },
  { id: 'concierge',      num: '03', label: 'eQORE AI™'      },
  { id: 'ceo-assessment', num: '04', label: 'Self-Assessment' },
  { id: 'deliverables',   num: '05', label: 'Deliverables'    },
  { id: 'prescription',   num: '06', label: 'Prescription'    },
  { id: 'competitive',    num: '07', label: 'Competitive'     },
  { id: 'engagement',     num: '08', label: 'Engagement'      },
  { id: 'methodology',    num: '09', label: 'Methodology'     },
  { id: 'scorecard',      num: '10', label: 'Scorecard'       },
];

export default function BIDSRuler() {
  const { theme } = useTheme();
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

  const activeIndex = NAV_ITEMS.findIndex(item => item.id === active);
  const progress = activeIndex >= 0 ? activeIndex / (NAV_ITEMS.length - 1) : 0;

  return (
    <div
      className={`bids-ruler hidden lg:block fixed z-40 ${theme}`}
      style={{ left: '28px', top: '50%', transform: 'translateY(-50%)', '--progress': progress }}
    >
      <div className="relative flex flex-col">
        <div className="spine" />

        {NAV_ITEMS.map(({ id, num, label }, index) => {
          const isActive   = active === id;
          const isVisited  = activeIndex > -1 && index < activeIndex;

          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`ruler-item group flex items-center py-[11px] focus:outline-none
                ${isActive  ? 'active'  : ''}
                ${isVisited ? 'visited' : ''}`}
              aria-label={`Jump to ${label}`}
            >
              {isActive && <div className="dot" />}
              <div className="tick" style={{ width: isActive ? '20px' : '8px' }} />
              <span className="num ml-2.5 font-mono text-[8px] font-black tracking-[0.3em]">
                {num}
              </span>
              <span className="label ml-2 text-[9px] font-bold tracking-[0.14em] uppercase whitespace-nowrap overflow-hidden">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
