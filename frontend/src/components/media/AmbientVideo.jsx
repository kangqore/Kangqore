import React, { useEffect, useRef, useState } from 'react';

// ─── AmbientVideo ─────────────────────────────────────────────────────────────
// Decorative background video that refuses to cost anything until it is both
// wanted and affordable.
//
// The footer previously rendered <video autoPlay preload="auto"> pointing at a
// 148 MB file, on every page of the site. Because the element is decorative
// (a backdrop behind a logo and a tagline) none of that download bought the
// visitor anything.
//
// This component:
//   - renders nothing but the CSS background until the element is near-viewport
//   - honours prefers-reduced-motion (never loads — motion is the whole point)
//   - honours Save-Data and 2g/3g connections
//   - uses preload="none" so even when mounted the browser fetches lazily
//
// It is deliberately NOT marked up with VideoObject schema: this is decoration,
// not content, and describing it as a video object to search engines would be
// misleading structured data.
// ────────────────────────────────────────────────────────────────────────────────

function connectionAllowsVideo() {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return true; // unknown connection — assume it is fine
  if (c.saveData) return false;
  return !/(^|-)(2g|slow-2g)$/.test(c.effectiveType || '');
}

export default function AmbientVideo({ src, type = 'video/mp4', className, style, ...rest }) {
  const holderRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !connectionAllowsVideo()) return;

    const node = holderRef.current;
    if (!node) return;

    if (!('IntersectionObserver' in window)) {
      setActive(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={holderRef} aria-hidden="true" className={className} style={style}>
      {active && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }}
          {...rest}
        >
          <source src={src} type={type} />
        </video>
      )}
    </div>
  );
}
