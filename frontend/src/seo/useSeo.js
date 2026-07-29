// ─── Deterministic document-head management ───────────────────────────────────
// Replaces react-helmet, which silently stopped applying <meta>/<link>/<script>
// tags under React 19 + StrictMode (its side-effect cleanup reverts them on the
// StrictMode remount, so only <title> survived). The symptom in production was
// every service page canonicalising to the homepage and shipping the sitewide
// default description — i.e. instructing Google to de-index the page.
//
// This hook writes to document.head imperatively instead:
//   - tags are UPSERTED by selector, so the static defaults in index.html are
//     updated in place rather than duplicated;
//   - tags this module owns are marked with data-kq-seo so page-scoped ones
//     (JSON-LD, hreflang) can be cleaned up on route change without touching
//     the sitewide tags index.html ships.
// ────────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';

const OWNED = 'data-kq-seo';

/** Upsert a tag by selector; create (marked as owned) when absent. */
function upsert(selector, createEl, attrs) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = createEl();
    el.setAttribute(OWNED, '');
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v != null && v !== '') el.setAttribute(k, String(v));
  }
}

function setMetaName(name, content) {
  if (!content) return;
  upsert(`meta[name="${name}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute('name', name);
    return m;
  }, { content });
}

function setMetaProp(property, content) {
  if (!content) return;
  upsert(`meta[property="${property}"]`, () => {
    const m = document.createElement('meta');
    m.setAttribute('property', property);
    return m;
  }, { content });
}

function setLink(rel, href) {
  if (!href) return;
  upsert(`link[rel="${rel}"]`, () => {
    const l = document.createElement('link');
    l.setAttribute('rel', rel);
    return l;
  }, { href });
}

/** Remove only the page-scoped tags this module previously added. */
function clearPageScoped() {
  document.head
    .querySelectorAll(`script[type="application/ld+json"][${OWNED}], link[rel="alternate"][${OWNED}]`)
    .forEach((n) => n.remove());
}

/**
 * Apply a page's SEO to document.head.
 * Safe to call on every render — it is idempotent per input.
 */
export function applySeo({
  title,
  description,
  keywords,
  canonical,
  robots,
  lang,
  og = {},
  twitter = {},
  jsonLd = [],
  hreflang = [],
} = {}) {
  if (typeof document === 'undefined') return;

  if (title) document.title = title;
  if (lang) document.documentElement.setAttribute('lang', lang);

  setMetaName('description', description);
  setMetaName('keywords', keywords);
  setMetaName('robots', robots);
  setLink('canonical', canonical);

  for (const [k, v] of Object.entries(og)) setMetaProp(`og:${k}`, v);
  for (const [k, v] of Object.entries(twitter)) setMetaName(`twitter:${k}`, v);

  // Page-scoped tags are replaced wholesale so stale schema/hreflang from the
  // previous route cannot leak into this one.
  clearPageScoped();

  for (const { lang: hl, url } of hreflang) {
    if (!hl || !url) continue;
    const l = document.createElement('link');
    l.setAttribute('rel', 'alternate');
    l.setAttribute('hreflang', hl);
    l.setAttribute('href', url);
    l.setAttribute(OWNED, '');
    document.head.appendChild(l);
  }

  for (const schema of jsonLd) {
    if (!schema) continue;
    let json;
    try {
      json = JSON.stringify(schema);
    } catch {
      continue; // never let a circular schema object break the page
    }
    const s = document.createElement('script');
    s.setAttribute('type', 'application/ld+json');
    s.setAttribute(OWNED, '');
    s.textContent = json;
    document.head.appendChild(s);
  }
}

/**
 * React binding for applySeo. Re-applies whenever the serialised input changes.
 */
export default function useSeo(config) {
  const key = JSON.stringify(config ?? {});
  useEffect(() => {
    applySeo(config);
    // `key` is the deep-equality signal; `config` identity changes every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
