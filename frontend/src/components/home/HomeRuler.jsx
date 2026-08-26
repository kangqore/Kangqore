import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../services/reimagine/PSEDRuler.css';

// Every id here must correspond to a real section on the homepage — the
// IntersectionObserver below silently skips ids it cannot find, so a stale
// entry renders as a tick that can never activate or scroll.
//
// Removed: { id: 'home-bids', num: '06', label: 'Kangqore BIDS™' }. There is no
// `home-bids` element on the page; BIDS™ appears only as one card in the
// "Intelligent solutions" grid, which is not a section of its own. Re-add this
// entry if a dedicated BIDS™ section is ever added to the homepage.
const NAV_ITEMS = [
  { id: 'trust-intelligence', num: '01', label: 'Insights'     },
  { id: 'home-concierge',     num: '02', label: 'eQORE AI™'   },
  { id: 'home-services',      num: '03', label: 'Our Services' },
  { id: 'home-industries',    num: '04', label: 'Industries'   },
  { id: 'trust-statement',    num: '05', label: 'Why Kangqore' },
  { id: 'scheduling-widget',  num: '06', label: 'Book a Call'  },
];

export default function HomeRuler() {
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
