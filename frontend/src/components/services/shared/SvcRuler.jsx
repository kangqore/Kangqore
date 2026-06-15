import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../reimagine/PSEDRuler.css';

const NAV_ITEMS = [
  { id: 'svc-hero',         num: '01', label: 'Overview'     },
  { id: 'svc-what',         num: '02', label: 'What Is It'   },
  { id: 'svc-concierge',    num: '03', label: 'eQORE AI™'    },
  { id: 'svc-capabilities', num: '04', label: 'Capabilities' },
  { id: 'svc-phases',       num: '05', label: 'Our Process'  },
  { id: 'svc-partnership',   num: '06', label: 'Partnership'  },
  { id: 'svc-faq',          num: '07', label: 'FAQ'          },
];

export default function SvcRuler() {
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

  return ReactDOM.createPortal(
    <div className="psed-ruler" style={{ '--progress': progress }}>
      <div className="relative flex flex-col">
        <div className="spine" />
        {NAV_ITEMS.map(({ id, num, label }, index) => {
          const isActive  = active === id;
          const isVisited = activeIndex > -1 && index < activeIndex;
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
              <span className="num ml-2.5 font-mono text-[7px] font-black tracking-[0.3em]">
                {num}
              </span>
              <span className="label ml-2 text-[8px] font-bold tracking-[0.14em] uppercase whitespace-nowrap overflow-hidden">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
