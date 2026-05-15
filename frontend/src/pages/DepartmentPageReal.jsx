// ─── /departments/:slug — Real template (Phase D) ─────────────────────────────
// Replaces the Phase C placeholder. Indexable (no robots noindex).
//
// Structure per plan Section 21.4:
//   Hero → Overview (3 cols) → Banner brand band → Service grid →
//   Business outcomes → Related departments → Final CTA
//
// All copy reads from departmentsData.js + servicesData.js — non-engineers
// can edit content without touching this component.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Users, Wrench, Target } from 'lucide-react';

import {
  departmentsData,
  departmentsList,
} from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import { departmentSEO } from '../data/seoData';
import Breadcrumb from '../components/Breadcrumb';
import NotFound from './NotFound';

const DepartmentPage = () => {
  const { slug } = useParams();

  if (!slug || !departmentsList.includes(slug)) {
    return <NotFound />;
  }

  const d = departmentsData[slug];
  const seo = departmentSEO[slug] || {};
  const Icon = d.icon;

  return (
    <>
      <Helmet>
        <title>{seo.title || `${d.name} — ${d.tagline} | Kangqore`}</title>
        <meta name="description" content={seo.description || d.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      </Helmet>

      {/* Top accent band */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: d.accentColor }}
        aria-hidden="true"
      />

      <article className="max-w-6xl mx-auto px-6 py-12">
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Departments', href: '/departments' },
            { name: d.shortName },
          ]}
        />

        {/* HERO */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            {Icon && (
              <Icon
                className="w-7 h-7"
                style={{ color: d.accentColor }}
                aria-hidden="true"
              />
            )}
            <p
              className="text-sm uppercase tracking-widest font-semibold"
              style={{ color: d.accentColor }}
            >
              {d.name}
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight">
            {d.tagline}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-3 max-w-3xl">
            {d.description}
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 mb-8 max-w-3xl leading-relaxed">
            {d.heroBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: d.accentColor }}
            >
              Book a 30-min diagnostic
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 transition-colors"
            >
              See case studies
            </Link>
          </div>
        </header>

        {/* OVERVIEW (3-col) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-gray-200 dark:border-gray-800">
          <div>
            <Target className="w-6 h-6 mb-3" style={{ color: d.accentColor }} aria-hidden="true" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
              What this department does
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300">
              {d.description}
            </p>
          </div>
          <div>
            <Users className="w-6 h-6 mb-3" style={{ color: d.accentColor }} aria-hidden="true" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Who it&apos;s for
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300 mb-1">
              <span className="font-semibold">{d.buyerPersonas.primary}</span>
            </p>
            <p className="text-sm text-gray-500">
              {d.buyerPersonas.secondary.join(' · ')}
            </p>
          </div>
          <div>
            <Wrench className="w-6 h-6 mb-3" style={{ color: d.accentColor }} aria-hidden="true" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
              How we deliver
            </h2>
            <p className="text-base text-gray-700 dark:text-gray-300">
              {d.deliveryApproach}
            </p>
          </div>
        </section>

        {/* BANNER BRAND BAND */}
        <section
          className="-mx-6 px-6 md:px-12 py-10 mb-16 rounded-lg"
          style={{ backgroundColor: d.accentColor + '0D' /* ~5% tint */ }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p
                className="text-xs uppercase tracking-widest font-semibold mb-2"
                style={{ color: d.accentColor }}
              >
                Featured Brand
              </p>
              <p className="text-2xl md:text-3xl font-bold">{d.bannerBrand}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                The productized methodology that powers {d.shortName} engagements.
              </p>
            </div>
            <Link
              to={`/solutions/${d.bannerBrandSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-white font-medium hover:opacity-90 transition-opacity self-start md:self-auto"
              style={{ backgroundColor: d.accentColor }}
            >
              Learn more about {d.bannerBrand}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* SERVICE GRID */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Services in {d.shortName}
            <span className="text-base font-normal text-gray-500 ml-3">
              {d.serviceCount} services
            </span>
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {d.serviceSlugs.map((svcSlug) => {
              const svc = servicesData[svcSlug];
              if (!svc) return null;
              return (
                <li key={svcSlug}>
                  <Link
                    to={`/services/${svcSlug}`}
                    className="block h-full p-5 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors group"
                  >
                    <h3 className="font-semibold mb-1 group-hover:underline">
                      {svc.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {svc.shortDescription}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* BUSINESS OUTCOMES */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Business outcomes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.businessOutcomes.map((o, i) => (
              <div
                key={i}
                className="p-6 border border-gray-200 dark:border-gray-800 rounded-md"
              >
                <p
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{ color: d.accentColor }}
                >
                  {o.metric}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {o.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RELATED DEPARTMENTS */}
        {d.relatedDepartments && d.relatedDepartments.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              {d.shortName} pairs well with
            </h2>
            <ul className="flex flex-wrap gap-3">
              {d.relatedDepartments.map((relSlug) => {
                const rel = departmentsData[relSlug];
                if (!rel) return null;
                return (
                  <li key={relSlug}>
                    <Link
                      to={`/departments/${relSlug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full hover:border-gray-500 dark:hover:border-gray-500 transition-colors"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: rel.accentColor }}
                        aria-hidden="true"
                      />
                      <span className="font-medium">{rel.shortName}</span>
                      <span className="text-sm text-gray-500">— {rel.tagline}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* FINAL CTA */}
        <section
          className="-mx-6 px-6 md:px-12 py-10 rounded-lg text-center"
          style={{ backgroundColor: d.accentColor }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to talk about {d.shortName}?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Book a 30-minute architecture diagnostic with a named practice lead.
            Fixed agenda. No sales pitch.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
          >
            Book a diagnostic
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </article>
    </>
  );
};

export default DepartmentPage;
