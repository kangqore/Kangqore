// ─── /solutions/:slug — persona-targeted solution pages ─────────────────────
// Overshadow Roadmap P7.3: "Persona-targeted campaigns... mapped directly to
// the playbook's buying-persona chapter." One template, four data-driven
// instances — the same pattern the 62 service pages already use. Every proof
// link points at a page a prior Overshadow phase actually shipped.

import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Compass, ShieldCheck, Users, Headset, AlertTriangle } from 'lucide-react';
import useSeo from '../seo/useSeo';
import { PERSONA_SOLUTIONS } from '../data/personaSolutionsData';

const SITE_URL = 'https://kangqore.com';
const ICONS = { Compass, ShieldCheck, Users, Headset };

const PersonaSolutionPage = () => {
  const { slug } = useParams();
  const solution = PERSONA_SOLUTIONS.find((s) => s.slug === slug);

  if (!solution) return <Navigate to="/solutions" replace />;

  const Icon = ICONS[solution.icon] ?? Compass;
  const pageUrl = `${SITE_URL}/solutions/${solution.slug}`;
  const title = `${solution.title} | Kangqore`;

  useSeo({
    title, description: solution.subtitle, canonical: pageUrl, lang: 'en',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    og: { type: 'website', url: pageUrl, title, description: solution.subtitle, site_name: 'Kangqore', locale: 'en_GB' },
    twitter: { card: 'summary', site: '@kangqore', url: pageUrl, title, description: solution.subtitle },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-[#F5F5F7] dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <Link to="/solutions" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-brand-blue mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> All solutions
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#1D1D1F] rounded-2xl flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">{solution.persona}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tighter text-[#1D1D1F] dark:text-white mb-4">
            {solution.title}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-2xl">{solution.subtitle}</p>
        </div>
      </section>

      <article className="max-w-4xl mx-auto px-6 sm:px-8 py-14 lg:py-20">
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">What you're weighing</h2>
          <div className="space-y-3">
            {solution.painPoints.map((p, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-2 flex-shrink-0" />
                <span className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">The real proof, not a claim</h2>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
            {solution.proof.map((p) => (
              <Link key={p.to} to={p.to} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{p.label}</span>
                <ArrowRight className="w-4 h-4 text-brand-blue flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-6 flex gap-3 mb-14">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">{solution.honestNote}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-[#FAFAFA] dark:bg-gray-950/60 p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">Talk to someone who can walk through your specific comparison.</span>
          <Link to="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:gap-2.5 transition-all whitespace-nowrap">
            Get in touch <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
};

export default PersonaSolutionPage;
