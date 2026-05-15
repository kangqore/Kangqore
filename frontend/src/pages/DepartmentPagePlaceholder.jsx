// ─── /departments/:slug — Phase C Placeholder ─────────────────────────────────
// Minimal single-department page rendering the canonical data from
// departmentsData.js + servicesData.js. Real template ships in Phase D
// (Section 21.4 of the project plan).
// Phase C ships `<meta robots="noindex,follow">` to keep crawlers off until
// the real template lands.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { departmentsData, departmentsList } from '../data/departmentsData';
import { servicesData } from '../data/servicesData';
import NotFound from './NotFound';

const DepartmentPagePlaceholder = () => {
  const { slug } = useParams();

  if (!slug || !departmentsList.includes(slug)) {
    return <NotFound />;
  }

  const d = departmentsData[slug];

  return (
    <>
      <Helmet>
        <title>{d.name} — {d.tagline} | Kangqore</title>
        <meta name="robots" content="noindex,follow" />
        <meta name="description" content={d.description} />
      </Helmet>

      <div className="min-h-[60vh] max-w-5xl mx-auto px-6 py-16">
        <div
          className="h-1.5 w-24 mb-6 rounded-full"
          style={{ backgroundColor: d.accentColor }}
        />

        <p className="text-sm uppercase tracking-widest mb-3" style={{ color: d.accentColor }}>
          {d.name}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{d.tagline}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-2 max-w-3xl">
          {d.description}
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Featured brand: <span className="font-semibold">{d.bannerBrand}</span>
          {' · '}
          {d.serviceCount} services
        </p>

        <h2 className="text-2xl font-semibold mb-4">Services in {d.shortName}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          {d.serviceSlugs.map((svcSlug) => {
            const svc = servicesData[svcSlug];
            if (!svc) return null;
            return (
              <li key={svcSlug}>
                <Link
                  to={`/services/${svcSlug}`}
                  className="block border border-gray-200 dark:border-gray-800 rounded-md px-4 py-3 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <p className="font-medium">{svc.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{svc.shortDescription}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          to="/departments"
          className="text-sm text-brand-blue hover:underline"
        >
          ← Back to all departments
        </Link>

        <p className="text-xs text-gray-400 mt-12 italic">
          Phase C placeholder — full template ships in Phase D.
        </p>
      </div>
    </>
  );
};

export default DepartmentPagePlaceholder;
