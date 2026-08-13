// ─── /solutions — persona index ──────────────────────────────────────────────
// Overshadow Roadmap P7.3. Four buyer personas, each with its own honest page.

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Users, Headset } from 'lucide-react';
import useSeo from '../seo/useSeo';
import { PERSONA_SOLUTIONS } from '../data/personaSolutionsData';

const SITE_URL = 'https://kangqore.com';
const ICONS = { Compass, ShieldCheck, Users, Headset };

const SolutionsIndexPage = () => {
  const pageUrl = `${SITE_URL}/solutions`;
  const title = 'Solutions by Role — CIO, CISO, CHRO, Customer Service | Kangqore';
  const description = 'What Kangqore actually offers each buyer evaluating it against ServiceNow — mapped to real, shipped proof, not a generic pitch.';

  useSeo({
    title, description, canonical: pageUrl, lang: 'en',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    og: { type: 'website', url: pageUrl, title, description, site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title, description },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tighter text-[#1D1D1F] dark:text-white mb-6">Solutions by role</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-2xl">
            Four buyers, four different comparisons. Pick yours — every claim links to something
            real, not a generic pitch deck.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14 lg:py-20 grid sm:grid-cols-2 gap-4">
        {PERSONA_SOLUTIONS.map((s) => {
          const Icon = ICONS[s.icon] ?? Compass;
          return (
            <Link
              key={s.slug}
              to={`/solutions/${s.slug}`}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:border-brand-blue transition-colors"
            >
              <div className="w-11 h-11 bg-[#1D1D1F] rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">{s.persona}</span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2 leading-snug">{s.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{s.subtitle}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue group-hover:gap-2.5 transition-all">
                Read more <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SolutionsIndexPage;
