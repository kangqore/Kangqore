// ─── /services/:slug — Real template (Phase D + Phase G2) ─────────────────────
// Phase D shipped the canonical flat /services/<slug> route with a clean skeleton
// (Hero → Problem → Features → Approach → Related → CTA). Phase G2 layers a
// premium render path on top WITHOUT touching the skeleton.
//
// Fork rule: if a slug is registered in PREMIUM_REGISTRY (per-dept premium
// content modules under components/services/<dept>/), render the premium path
// via ServicePageTemplate (the lifted legacy template, with disableSEO so this
// component still owns canonical SEO/canonical/JSON-LD/OG). Otherwise the
// existing skeleton renders unchanged.
//
// Per Phase G locked constraints:
//  - /services/<slug> is canonical for both paths.
//  - Breadcrumbs use canonical 6-dept names (dept.shortName) and plural URL
//    pattern /departments/<slug>. No "AI & Cognitive" / "Digital Marketing"
//    legacy labels leak through.
//  - Premium content does not duplicate base identity fields (name/slug/
//    departmentSlug/shortDescription/fullDescription stay in servicesData).
//  - JSX, lucide icons, and section components live in dept-scoped modules —
//    never in servicesData.js.
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { servicesData, servicesList } from '../data/servicesData';
import { departmentsData } from '../data/departmentsData';
import { serviceSEO } from '../data/seoData';
import Breadcrumb from '../components/Breadcrumb';
import ServicePageTemplate from '../components/ServicePageTemplate';
import { COGNITION_SECTIONS } from '../components/services/cognition/sections';
import { FOUNDRY_SECTIONS } from '../components/services/foundry/sections';
import { REIMAGINE_SECTIONS } from '../components/services/reimagine/sections';
import { SHIELD_SECTIONS } from '../components/services/shield/sections';
import { PLATFORMS_SECTIONS } from '../components/services/platforms/sections';
import { GROWTH_SECTIONS } from '../components/services/growth/sections';
import NotFound from './NotFound';

const SITE_URL = 'https://kangqore.com';
const ORG_NAME = 'Kangqore';

// Per-service premium content registry, namespaced by dept. Each entry is a
// presentation-layer object that merges over the canonical base service to
// produce the legacy-template-compatible shape (highFidelity, capabilities,
// customSections JSX, hero customization, stats, etc.). Future phases (G4
// Growth, G5 Platforms, G6 Foundry) add their own modules and spread them in.
const PREMIUM_REGISTRY = {
  ...COGNITION_SECTIONS,
  ...FOUNDRY_SECTIONS,
  ...REIMAGINE_SECTIONS,
  ...SHIELD_SECTIONS,
  ...PLATFORMS_SECTIONS,
  ...GROWTH_SECTIONS,
};

const ServicePage = () => {
  const { slug } = useParams();

  if (!slug || !servicesList.includes(slug)) {
    return <NotFound />;
  }

  const svc = servicesData[slug];
  const dept = departmentsData[svc.departmentSlug];
  const seo = serviceSEO[slug] || {};

  const pageUrl = `${SITE_URL}/services/${slug}`;
  const deptUrl = `${SITE_URL}/departments/${dept.slug}`;
  const pageTitle = seo.title || `${svc.name} — ${dept.shortName} | Kangqore`;
  const pageDescription = seo.description || svc.shortDescription;
  const ogImage = `${SITE_URL}/og/default.png`;

  // JSON-LD: Service schema + BreadcrumbList (deep breadcrumb even though URL is flat).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': pageUrl,
        name: svc.name,
        description: svc.shortDescription,
        provider: {
          '@type': 'Organization',
          name: ORG_NAME,
          url: SITE_URL,
        },
        serviceType: dept.tagline,
        url: pageUrl,
        brand: {
          '@type': 'Brand',
          name: svc.bannerBrand.replace(/[™®]/g, '').trim(),
        },
        isPartOf: {
          '@type': 'Service',
          name: dept.name,
          url: deptUrl,
        },
        ...(svc.relatedServiceSlugs && svc.relatedServiceSlugs.length > 0
          ? {
              isRelatedTo: svc.relatedServiceSlugs.slice(0, 3).map((relSlug) => {
                const rel = servicesData[relSlug];
                return {
                  '@type': 'Service',
                  name: rel?.name || relSlug,
                  url: `${SITE_URL}/services/${relSlug}`,
                };
              }),
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Departments', item: `${SITE_URL}/departments` },
          { '@type': 'ListItem', position: 3, name: dept.shortName, item: deptUrl },
          { '@type': 'ListItem', position: 4, name: svc.name, item: pageUrl },
        ],
      },
    ],
  };

  // Canonical Helmet block — emitted for BOTH skeleton and premium paths so
  // SEO/canonical/JSON-LD/OG behavior is identical regardless of which body
  // renders. ServicePageTemplate's own SEO is suppressed via disableSEO.
  const canonicalHelmet = (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={ORG_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD: Service + BreadcrumbList */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );

  const accentBand = (
    <div
      className="h-1 w-full"
      style={{ backgroundColor: dept.accentColor }}
      aria-hidden="true"
    />
  );

  // ─── Premium path ──────────────────────────────────────────────────────────
  // When a slug is registered in PREMIUM_REGISTRY, render via the lifted
  // ServicePageTemplate with canonical department metadata. The premium
  // service object merges:
  //   1. Base identity fields from canonical servicesData (preserved verbatim)
  //   2. The dept-module's presentation layer (highFidelity, capabilities,
  //      customSections JSX, hero customization, stats — all resolved at
  //      module load, including lucide icons that data files don't import)
  const premiumExtras = PREMIUM_REGISTRY[slug];
  if (premiumExtras) {
    // Spread order matters: presentation layer first, then identity fields
    // re-asserted from canonical base so dept modules CANNOT accidentally
    // override name/slug/shortDescription (DoD #3 enforcement). The dept
    // module IS allowed to override fullDescription and image — the hero
    // description and visuals are presentation choices.
    const premiumService = {
      fullDescription: svc.fullDescription,
      image: svc.image,
      ...premiumExtras,
      name: svc.name,
      slug: svc.slug,
      shortDescription: svc.shortDescription,
    };

    // Canonical 6-dept metadata for the template — uses shortName so the
    // breadcrumb reads "Home > Services > Cognition > Agentic AI", NOT
    // "AI & Cognitive". URL pattern is /departments/<slug> (plural).
    const premiumDept = {
      name: dept.shortName,
      slug: dept.slug,
      description: dept.description,
    };

    return (
      <>
        {canonicalHelmet}
        {accentBand}
        <ServicePageTemplate
          service={premiumService}
          department={premiumDept}
          disableSEO
        />
      </>
    );
  }

  // ─── Skeleton path (unchanged from Phase D) ────────────────────────────────
  return (
    <>
      {canonicalHelmet}
      {accentBand}

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
