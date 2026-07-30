// ─── Service-page structured data graph ───────────────────────────────────────
// Builds a linked @graph (WebPage → Service → FAQPage → BreadcrumbList) rather
// than a bag of disconnected objects, so search and answer engines can resolve
// the page to a single service entity with stable @ids.
//
// Consumed by ServicePageReal via useSeo(). Everything is derived from
// servicesData so the 61 service pages stay in sync with one source of truth.
// ────────────────────────────────────────────────────────────────────────────────

const SITE_URL = 'https://kangqore.com';
const ORG_ID = `${SITE_URL}/#organization`;

/** Split "Title: description" capability items into structured offers. */
function toOffer(item) {
  const idx = item.indexOf(':');
  return idx === -1
    ? { name: item, description: item }
    : { name: item.slice(0, idx).trim(), description: item.slice(idx + 1).trim() };
}

export function buildServiceGraph({ svc, dept, pageUrl, pageTitle, pageDescription, ogImage }) {
  const graph = [];

  graph.push({
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${pageUrl}#service` },
    primaryImageOfPage: ogImage,
    inLanguage: 'en',
    // Marks the passages a voice assistant should read aloud. Pointing at the
    // H1 and the summary paragraph keeps spoken answers to the definition of
    // the service rather than whatever text happens to rank first.
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '[data-speakable]'],
    },
  });

  const offers = (svc.capabilityAreas || []).map((area) => ({
    '@type': 'OfferCatalog',
    name: area.title,
    description: area.desc,
    itemListElement: (area.items || []).map((item) => {
      const { name, description } = toOffer(item);
      return { '@type': 'Offer', itemOffered: { '@type': 'Service', name, description } };
    }),
  }));

  graph.push({
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: svc.name,
    serviceType: svc.name,
    description: svc.fullDescription || svc.shortDescription,
    url: pageUrl,
    provider: { '@id': ORG_ID },
    areaServed: ['United Kingdom', 'United States', 'European Union', 'India'],
    audience: { '@type': 'Audience', audienceType: 'Enterprise' },
    ...(dept ? { category: dept.name || dept.shortName } : {}),
    ...(offers.length ? { hasOfferCatalog: { '@type': 'OfferCatalog', name: `${svc.name} Capabilities`, itemListElement: offers } } : {}),
  });

  const faqs = svc.customFAQs || [];
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  // The delivery journey is a genuine ordered procedure, so HowTo is accurate
  // markup rather than decoration — and it is the shape answer engines quote
  // when asked "how does X get delivered".
  const journey = svc.customJourney || [];
  if (journey.length >= 3) {
    graph.push({
      '@type': 'HowTo',
      '@id': `${pageUrl}#howto`,
      name: `How Kangqore delivers ${svc.name}`,
      description: `The ${journey.length}-phase delivery model Kangqore uses for ${svc.name}.`,
      totalTime: 'P8W',
      step: journey.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.desc,
        url: `${pageUrl}#step-${i + 1}`,
      })),
    });
  }

  graph.push({
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/services` },
      ...(dept ? [{ '@type': 'ListItem', position: 3, name: dept.shortName || dept.name, item: `${SITE_URL}/departments/${dept.slug}` }] : []),
      { '@type': 'ListItem', position: dept ? 4 : 3, name: svc.name, item: pageUrl },
    ],
  });

  return { '@context': 'https://schema.org', '@graph': graph };
}

export { SITE_URL, ORG_ID };
