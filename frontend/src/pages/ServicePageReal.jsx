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

import useSeo from '../seo/useSeo';
import { buildServiceGraph } from '../seo/serviceSchema';
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

  // Everything below the hook must be computed unconditionally: hooks cannot sit
  // behind the NotFound early-return. `valid` gates the payload, not the call.
  const valid = Boolean(slug && servicesList.includes(slug));
  const svc = valid ? servicesData[slug] : null;
  const dept = svc ? departmentsData[svc.departmentSlug] : null;
  const seo = (valid && serviceSEO[slug]) || {};

  const pageUrl = `${SITE_URL}/services/${slug}`;
  const pageTitle = seo.title || (svc && dept ? `${svc.name} — ${dept.shortName} | Kangqore` : 'Kangqore');
  const pageDescription = seo.description || svc?.shortDescription || '';
  const ogImage = `${SITE_URL}/og/default.png`;

  useSeo(
    valid
      ? {
          title: pageTitle,
          description: pageDescription,
          keywords: seo.keywords,
          canonical: pageUrl,
          robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          lang: 'en',
          og: {
            type: 'website',
            url: pageUrl,
            title: pageTitle,
            description: pageDescription,
            image: ogImage,
            site_name: ORG_NAME,
            locale: 'en_GB',
          },
          twitter: {
            card: 'summary_large_image',
            site: '@kangqore',
            url: pageUrl,
            title: pageTitle,
            description: pageDescription,
            image: ogImage,
          },
          // Regional variants: the platform serves UK/US/EU/India from one URL,
          // so every locale points at the canonical and x-default anchors it.
          hreflang: [
            { lang: 'en-GB', url: pageUrl },
            { lang: 'en-US', url: pageUrl },
            { lang: 'en-IN', url: pageUrl },
            { lang: 'x-default', url: pageUrl },
          ],
          jsonLd: [buildServiceGraph({ svc, dept, pageUrl, pageTitle, pageDescription, ogImage })],
        }
      : null
  );

  if (!valid) {
    return <NotFound />;
  }

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
    return <ServicePageTemplate service={psedService} department={psedDept} disableSEO />;
  }

  // ─── Universal path: all 60 other services → PSED-style template ───────────
  const universalDept = { name: dept.shortName, slug: dept.slug };
  return <UniversalServicePage service={svc} department={universalDept} />;
};

export default ServicePage;
