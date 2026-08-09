// ─── Mobile card rail ─────────────────────────────────────────────────────────
// Adds the accessibility contract around the `.kq-rail` layout, which lives in
// index.css (see the block there for why the layout is a media query rather
// than Tailwind variants, and for the measurements that motivated it).
//
// Below 640px a card grid becomes a horizontally-scrollable snap rail. Above it,
// the same node is the original grid and this component adds nothing at all.
// ────────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';

/** True while the viewport is narrow enough that a rail actually scrolls. */
export function useIsRail() {
  const [isRail, setIsRail] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsRail(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return isRail;
}

/**
 * Wraps a card grid so it becomes a swipeable rail on mobile.
 *
 * `hairline` is for grids that draw their separators as a container background
 * showing through `gap-px`. Once the cards are separate objects on a rail they
 * need their own border instead.
 *
 * The role/label/tabIndex are applied only while the node genuinely scrolls.
 * A scroll region must be reachable by keyboard (WCAG 2.1.1) — Chrome does not
 * make overflow containers focusable on its own — but on desktop the same node
 * is a static grid, where a focus stop that scrolls nothing is just an extra
 * tab press on the way to the content.
 */
export const CardRail = ({ label, hairline = false, className = '', children, ...rest }) => {
  const isRail = useIsRail();
  return (
    <div
      className={`kq-rail ${hairline ? 'kq-rail--hairline ' : ''}${className}`}
      role={isRail ? 'group' : undefined}
      aria-label={isRail ? `${label} — scroll sideways to see all ${React.Children.count(children)}` : undefined}
      tabIndex={isRail ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
};

export default CardRail;
