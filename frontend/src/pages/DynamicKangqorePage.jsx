// ---------------------------------------------------------------------------
// KIMMP Page Factory — Dynamic Page Renderer (PR-A2)
//
// Renders a stored, PUBLISHED KimmpGeneratedPage from its structured content.
// Wired as the catch-all route: an unmatched URL resolves to a KIMMP page if
// one exists, otherwise falls through to NotFound.
// ---------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import NotFound from './NotFound';
import { getRenderedPage } from '../services/kimmpPageService';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://kangqore.com';

function PageSection({ section }) {
  const { type, heading, body, items, buttonLabel } = section || {};

  if (type === 'cta') {
    return (
      <section className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
          {body && <p className="text-slate-300 mb-8 max-w-2xl mx-auto">{body}</p>}
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {buttonLabel || 'Get in touch'} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-14">
        {heading && <h2 className="text-2xl font-bold text-slate-900 mb-4">{heading}</h2>}
        {body && (
          <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-line">{body}</p>
        )}
        {Array.isArray(items) && items.length > 0 && (
          <ul className="grid sm:grid-cols-2 gap-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default function DynamicKangqorePage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\/+/, '');
  const [state, setState] = useState({ status: 'loading', page: null });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', page: null });
    getRenderedPage(slug)
      .then((page) => {
        if (active) setState({ status: page ? 'ready' : 'notfound', page });
      })
      .catch(() => {
        if (active) setState({ status: 'notfound', page: null });
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (state.status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
      </div>
    );
  }

  if (state.status === 'notfound' || !state.page) {
    return <NotFound />;
  }

  const page = state.page;
  const content = page.contentJson || {};
  const hero = content.hero || {};
  const seo = content.seo || {};
  const sections = Array.isArray(content.sections) ? content.sections : [];
  const internalLinks = Array.isArray(content.internalLinks) ? content.internalLinks : [];
  const pageUrl = `${SITE_URL}${page.route || `/${page.slug}`}`;
  const schemaTypes = Array.isArray(content.schema) ? content.schema : [];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaTypes[0] || 'WebPage',
    name: page.title,
    url: pageUrl,
    ...(seo.description ? { description: seo.description } : {}),
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>{seo.title || page.title}</title>
        {seo.description && <meta name="description" content={seo.description} />}
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.title || page.title} />
        {seo.description && <meta property="og:description" content={seo.description} />}
        <meta property="og:url" content={pageUrl} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <header className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {hero.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700 mb-3">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
            {hero.headline || page.title}
          </h1>
          {hero.subheadline && (
            <p className="mt-5 text-lg text-slate-600 max-w-2xl">{hero.subheadline}</p>
          )}
        </div>
      </header>

      {/* Sections */}
      {sections.map((section, i) => (
        <PageSection key={i} section={section} />
      ))}

      {/* Internal links */}
      {internalLinks.length > 0 && (
        <section className="border-t border-slate-100 bg-slate-50">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              Related
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {internalLinks.map((href, i) => (
                <Link key={i} to={href} className="text-emerald-700 hover:underline text-sm">
                  {href}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
