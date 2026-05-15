// ─── /departments — Real index (Phase D) ──────────────────────────────────────
// Replaces the Phase C placeholder. Indexable (no robots noindex).
//
// Visual structure per plan Section 21.3 / 21.7:
//   6 department tiles, each with its own accent color + brand-pillar treatment.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight } from 'lucide-react';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import { coreSEO } from '../data/seoData';

const DepartmentsIndexPage = () => {
  const seo = coreSEO.departments || {};

  return (
    <>
      <Helmet>
        <title>{seo.title || 'Departments — 6 Departments · 61 Services | Kangqore'}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      </Helmet>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-14 max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-brand-blue mb-3">
            Kangqore
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            6 Departments · 61 Services
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            One intelligence-led execution ecosystem, organised across six
            specialised departments. Each department owns a clear capability
            domain — AI, cloud, modernization, trust, enterprise platforms,
            and growth.
          </p>
        </header>

        {/* 6-card grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {departmentsList.map((slug) => {
            const d = departmentsData[slug];
            const Icon = d.icon;
            const top3 = (d.heroServiceSlugs || d.serviceSlugs.slice(0, 3))
              .slice(0, 3)
              .map((s) => servicesData[s])
              .filter(Boolean);

            return (
              <li key={slug}>
                <Link
                  to={`/departments/${slug}`}
                  className="block h-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 transition-colors group"
                >
                  {/* Accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: d.accentColor }}
                    aria-hidden="true"
                  />

                  <div className="p-6">
                    {/* Eyebrow + icon */}
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && (
                        <Icon
                          className="w-5 h-5"
                          style={{ color: d.accentColor }}
                          aria-hidden="true"
                        />
                      )}
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                        Kangqore
                      </p>
                    </div>

                    {/* Name + tagline */}
                    <h2 className="text-2xl font-bold mb-1">{d.shortName}</h2>
                    <p className="text-sm font-medium mb-3" style={{ color: d.accentColor }}>
                      {d.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {d.description}
                    </p>

                    {/* Banner brand badge */}
                    <p className="text-xs text-gray-500 mb-4">
                      Featured: <span className="font-semibold text-gray-700 dark:text-gray-200">{d.bannerBrand}</span>
                      {' · '}
                      {d.serviceCount} services
                    </p>

                    {/* Top 3 services */}
                    {top3.length > 0 && (
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-5">
                        {top3.map((svc) => (
                          <li key={svc.slug}>· {svc.name}</li>
                        ))}
                      </ul>
                    )}

                    {/* CTA */}
                    <p
                      className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all"
                      style={{ color: d.accentColor }}
                    >
                      Explore {d.shortName.toUpperCase()}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-base font-semibold text-brand-blue hover:underline"
          >
            Explore all 61 services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default DepartmentsIndexPage;
