// ─── /services/:slug — Phase C Placeholder (flat URL) ─────────────────────────
// Minimal single-service page rendering canonical data from servicesData.js +
// departmentsData.js. Real template ships in Phase D (Section 21.5 of the
// project plan).
// Phase C ships `<meta robots="noindex,follow">` to keep crawlers off until
// the real template lands.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { servicesData, servicesList } from '../data/servicesData';
import { departmentsData } from '../data/departmentsData';
import NotFound from './NotFound';

const ServicePagePlaceholder = () => {
  const { slug } = useParams();

  if (!slug || !servicesList.includes(slug)) {
    return <NotFound />;
  }

  const svc = servicesData[slug];
  const dept = departmentsData[svc.departmentSlug];

  return (
    <>
      <Helmet>
        <title>{svc.name} — {dept.shortName} | Kangqore</title>
        <meta name="robots" content="noindex,follow" />
        <meta name="description" content={svc.shortDescription} />
      </Helmet>

      <div className="min-h-[60vh] max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:underline">Home</Link>
          {' › '}
          <Link to="/departments" className="hover:underline">Departments</Link>
          {' › '}
          <Link to={`/departments/${dept.slug}`} className="hover:underline">
            {dept.shortName}
          </Link>
          {' › '}
          <span className="text-gray-700 dark:text-gray-300">{svc.name}</span>
        </nav>

        <p
          className="text-sm uppercase tracking-widest mb-3"
          style={{ color: dept.accentColor }}
        >
          {dept.name}
        </p>
        <h1 className="text-4xl font-bold mb-4">{svc.name}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">
          {svc.shortDescription}
        </p>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
          {svc.fullDescription}
        </p>

        {svc.keyFeatures && svc.keyFeatures.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-3">Key capabilities</h2>
            <ul className="list-disc list-inside space-y-1 mb-10 text-gray-700 dark:text-gray-300">
              {svc.keyFeatures.map((feat) => (
                <li key={feat}>{feat}</li>
              ))}
            </ul>
          </>
        )}

        {svc.relatedServiceSlugs && svc.relatedServiceSlugs.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-3">Related services</h2>
            <ul className="space-y-2 mb-10">
              {svc.relatedServiceSlugs.slice(0, 3).map((relSlug) => {
                const rel = servicesData[relSlug];
                if (!rel) return null;
                return (
                  <li key={relSlug}>
                    <Link
                      to={`/services/${relSlug}`}
                      className="text-brand-blue hover:underline"
                    >
                      {rel.name}
                    </Link>
                    <span className="text-xs text-gray-500 ml-2">
                      ({departmentsData[rel.departmentSlug].shortName})
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <p className="text-sm text-gray-500">
          Banner brand: <span className="font-semibold">{svc.bannerBrand}</span>
        </p>

        <p className="text-xs text-gray-400 mt-12 italic">
          Phase C placeholder — full template ships in Phase D.
        </p>
      </div>
    </>
  );
};

export default ServicePagePlaceholder;
