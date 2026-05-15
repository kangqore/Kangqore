// ─── /departments — Phase C Placeholder ────────────────────────────────────────
// Minimal index page listing all 6 canonical departments.
// Real template ships in Phase D (Section 21.3 of the project plan).
// Phase C ships `<meta robots="noindex,follow">` to keep crawlers off until
// the real template lands.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { departmentsData, departmentsList } from '../data/departmentsData';

const DepartmentsIndexPage = () => {
  return (
    <>
      <Helmet>
        <title>Departments — 6 Departments · 61 Services | Kangqore</title>
        <meta name="robots" content="noindex,follow" />
        <meta
          name="description"
          content="6 Kangqore departments · 61 services. AI & Automation, Cloud & Engineering, Modernization, Security & Trust, Enterprise Platforms, and Growth."
        />
      </Helmet>

      <div className="min-h-[60vh] max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-widest text-brand-blue mb-3">
          Kangqore
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          6 Departments · 61 Services
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl">
          Explore Kangqore's six canonical departments, each organising the
          services that drive intelligence-led execution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentsList.map((slug) => {
            const d = departmentsData[slug];
            return (
              <Link
                key={slug}
                to={`/departments/${slug}`}
                className="block border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
              >
                <div
                  className="h-1 w-12 mb-4 rounded-full"
                  style={{ backgroundColor: d.accentColor }}
                />
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Kangqore
                </p>
                <h2 className="text-xl font-bold mb-1">{d.shortName}</h2>
                <p className="text-sm text-gray-500 mb-3">{d.tagline}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {d.description}
                </p>
                <p className="text-xs text-gray-500">
                  {d.serviceCount} services · Featured: {d.bannerBrand}
                </p>
              </Link>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-12 italic">
          Phase C placeholder — full template ships in Phase D.
        </p>
      </div>
    </>
  );
};

export default DepartmentsIndexPage;
