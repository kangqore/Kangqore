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
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { servicesData, servicesList } from '../data/servicesData';
import { departmentsData } from '../data/departmentsData';
import { serviceSEO } from '../data/seoData';
import ServicePageTemplate from '../components/ServicePageTemplate';
import { REIMAGINE_SECTIONS } from '../components/services/reimagine/sections';
import UniversalServicePage from '../components/services/shared/UniversalServicePage';
import NotFound from './NotFound';

const SITE_URL = 'https://kangqore.com';
const ORG_NAME = 'Kangqore';

// PSED-only registry — product-strategy-experience-design keeps its bespoke
// ProductStrategyBIDSPage design (it is the reference for all other pages).
// All 60 other services (including all other reimagine slugs) go through
// UniversalServicePage below.
const PSED_REGISTRY = {
  'product-strategy-experience-design': REIMAGINE_SECTIONS['product-strategy-experience-design'],
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



  // ─── PSED: keep bespoke ProductStrategyBIDSPage (the reference design) ───────
  const psedExtras = PSED_REGISTRY[slug];
  if (psedExtras) {
    const psedService = {
      fullDescription: svc.fullDescription,
      image: svc.image,
      ...psedExtras,
      name: svc.name,
      slug: svc.slug,
      shortDescription: svc.shortDescription,
    };
    const psedDept = { name: dept.shortName, slug: dept.slug, description: dept.description };
    return (
      <>
        {canonicalHelmet}
        <ServicePageTemplate service={psedService} department={psedDept} disableSEO />
      </>
    );
  }

  // ─── Universal path: all 60 other services → PSED-style template ───────────
  const universalDept = { name: dept.shortName, slug: dept.slug };
  return (
    <>
      {canonicalHelmet}
      <UniversalServicePage service={svc} department={universalDept} />
    </>
  );
};

export default ServicePage;
