// ─── /services/:slug — Real template (Phase D) ────────────────────────────────
// Replaces the Phase C placeholder. Indexable (no robots noindex).
//
// Structure per plan Section 21.5:
//   Hero → Problem it solves → What Kangqore delivers (key features) →
//   Delivery approach → Related services → Final CTA
//
// Use cases section is omitted if servicesData[slug].useCases is absent
// (graceful empty state — content authors can add later without component change).
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { servicesData, servicesList } from '../data/servicesData';
import { departmentsData } from '../data/departmentsData';
import { serviceSEO } from '../data/seoData';
import Breadcrumb from '../components/Breadcrumb';
import NotFound from './NotFound';

const ServicePage = () => {
  const { slug } = useParams();

  if (!slug || !servicesList.includes(slug)) {
    return <NotFound />;
  }

  const svc = servicesData[slug];
  const dept = departmentsData[svc.departmentSlug];
  const seo = serviceSEO[slug] || {};

  return (
    <>
      <Helmet>
        <title>{seo.title || `${svc.name} — ${dept.shortName} | Kangqore`}</title>
        <meta name="description" content={seo.description || svc.shortDescription} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      </Helmet>

      {/* Top accent band (inherits department color) */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: dept.accentColor }}
        aria-hidden="true"
      />

      <article className="max-w-4xl mx-auto px-6 py-12">
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'Departments', href: '/departments' },
            { name: dept.shortName, href: `/departments/${dept.slug}` },
            { name: svc.name },
          ]}
        />

        {/* HERO */}
        <header className="mb-12">
          <Link
            to={`/departments/${dept.slug}`}
            className="text-sm uppercase tracking-widest font-semibold hover:underline inline-block mb-3"
            style={{ color: dept.accentColor }}
          >
            {dept.name}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {svc.name}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {svc.shortDescription}
          </p>
          <div className="mt-6">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: dept.accentColor }}
            >
              Talk to an expert
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* PROBLEM IT SOLVES (uses fullDescription) */}
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
            What it solves
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
            {svc.fullDescription}
          </p>
        </section>

        {/* WHAT KANGQORE DELIVERS (keyFeatures) */}
        {svc.keyFeatures && svc.keyFeatures.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              What Kangqore delivers
            </h2>
            <ul className="space-y-2.5">
              {svc.keyFeatures.map((feat) => (
                <li key={feat} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 mt-0.5 shrink-0"
                    style={{ color: dept.accentColor }}
                    aria-hidden="true"
                  />
                  <span className="text-base text-gray-700 dark:text-gray-200">
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* DELIVERY APPROACH (inherits from department) */}
        <section className="mb-12 p-6 border-l-4 rounded-md bg-gray-50 dark:bg-gray-900" style={{ borderColor: dept.accentColor }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Delivery approach
          </h2>
          <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed">
            {dept.deliveryApproach}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Under <span className="font-semibold">{svc.bannerBrand}</span>
          </p>
        </section>

        {/* RELATED SERVICES (cap at 3) */}
        {svc.relatedServiceSlugs && svc.relatedServiceSlugs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Related services
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {svc.relatedServiceSlugs.slice(0, 3).map((relSlug) => {
                const rel = servicesData[relSlug];
                if (!rel) return null;
                const relDept = departmentsData[rel.departmentSlug];
                return (
                  <li key={relSlug}>
                    <Link
                      to={`/services/${relSlug}`}
                      className="block h-full p-4 border border-gray-200 dark:border-gray-800 rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors group"
                    >
                      <p
                        className="text-xs uppercase tracking-wider font-semibold mb-1"
                        style={{ color: relDept.accentColor }}
                      >
                        {relDept.shortName}
                      </p>
                      <p className="font-semibold group-hover:underline mb-1">
                        {rel.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rel.shortDescription}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Talk to an expert about {svc.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
            Book a 30-minute call with a {dept.shortName} practice lead.
            Fixed agenda. No sales pitch.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: dept.accentColor }}
          >
            Book a call
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </article>
    </>
  );
};

export default ServicePage;
