// ─── Homepage 6-Department Grid (Phase D) ──────────────────────────────────────
// Replaces the legacy 15-department <ExploreServices /> carousel on the
// homepage. Static 6-card grid per plan Section 21.3 — NO carousel, NO
// auto-rotate, NO randomization.
//
// Each card surfaces: accent bar, dept name, tagline, service count,
// featured banner brand, top 3 hero services, and the dept-specific CTA.
//
// Order is fixed (matches departmentsList from departmentsData.js):
//   Cognition → Foundry → Reimagine → Shield → Platforms → Growth
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';

const DepartmentsGrid = () => {
  return (
    <section
      aria-labelledby="departments-grid-heading"
      className="py-20 px-6 bg-white dark:bg-black"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mb-12">
          <p className="text-sm uppercase tracking-widest text-brand-blue mb-3 font-semibold">
            Explore Kangqore Departments
          </p>
          <h2
            id="departments-grid-heading"
            className="text-3xl md:text-5xl font-bold mb-5 tracking-tight"
          >
            6 Departments. 61 Services. One Execution Ecosystem.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            61 services organised across six intelligence-led departments —
            built for modernization, execution, trust, platforms, and growth.
          </p>
        </div>

        {/* 6-card grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="flex flex-col h-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-md transition-all group bg-white dark:bg-gray-950"
                >
                  {/* Accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: d.accentColor }}
                    aria-hidden="true"
                  />

                  <div className="flex-1 flex flex-col p-6">
                    {/* Eyebrow + icon */}
                    <div className="flex items-center gap-2 mb-3">
                      {Icon && (
                        <Icon
                          className="w-5 h-5"
                          style={{ color: d.accentColor }}
                          aria-hidden="true"
                        />
                      )}
                      <p className="text-xs uppercase tracking-widest font-semibold text-gray-500">
                        Kangqore
                      </p>
                    </div>

                    {/* Department name */}
                    <h3 className="text-2xl font-bold mb-1">
                      {d.shortName.toUpperCase()}
                    </h3>
                    <p
                      className="text-sm font-medium mb-3"
                      style={{ color: d.accentColor }}
                    >
                      {d.tagline}
                    </p>

                    {/* Service count */}
                    <p className="text-xs text-gray-500 mb-4 font-medium">
                      {d.serviceCount} services
                    </p>

                    {/* Featured brand badge */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <span className="text-xs uppercase tracking-wider text-gray-500 mr-1.5">
                        Featured:
                      </span>
                      <span className="font-semibold">{d.bannerBrand}</span>
                    </p>

                    {/* Top 3 services */}
                    {top3.length > 0 && (
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-6 flex-1">
                        {top3.map((svc) => (
                          <li key={svc.slug}>· {svc.name}</li>
                        ))}
                      </ul>
                    )}

                    {/* CTA */}
                    <p
                      className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all mt-auto"
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
        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md border-2 border-gray-900 dark:border-white text-base font-semibold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
          >
            Explore All Services
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DepartmentsGrid;
