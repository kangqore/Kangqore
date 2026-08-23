// ─── Service-page structured data graph ───────────────────────────────────────
// Builds a linked @graph (WebPage → Service → FAQPage → BreadcrumbList) rather
// than a bag of disconnected objects, so search and answer engines can resolve
// the page to a single service entity with stable @ids.
//
// Consumed by ServicePageReal via useSeo(). Everything is derived from
// servicesData so the 61 service pages stay in sync with one source of truth.
// ────────────────────────────────────────────────────────────────────────────────

import { resolveServiceFaqs, faqPlainText } from '../data/serviceFaqs';

const SITE_URL = 'https://kangqore.com';
const ORG_ID = `${SITE_URL}/#organization`;
const REVIEWER_ID = `${SITE_URL}/#mahesh-kumar`;

// The named human behind a reviewed page. Every field here is already published
// on the site — name and title on the home page byline and /leadership, the two
// sameAs profiles from the same block, the portrait from /images/leadership.
// Nothing is asserted that a reader cannot already check, which is the whole
// point of the signal: an identity a search engine can resolve to a real person
// with a history, rather than a name typed into a schema block.
const REVIEWER = {
  '@type': 'Person',
  '@id': REVIEWER_ID,
  name: 'Mahesh Kumar',
  jobTitle: 'Founder & CEO',
  url: `${SITE_URL}/leadership`,
  image: `${SITE_URL}/images/leadership/ceo-mahesh-kumar.png`,
  worksFor: { '@id': ORG_ID },
  sameAs: ['https://in.linkedin.com/in/maheshkumario', 'https://x.com/maheshkumarx'],
};

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
    // Freshness and accountability, and only where both are facts.
    // `lastReviewed` is set by hand on a service when its copy is actually
    // rewritten and signed off, so a page nobody has touched publishes neither
    // a date nor a reviewer — rather than a build-time date and a name
    // asserting a review that never happened on 62 pages at once.
    //
    // `author` is the organization because Kangqore wrote the copy;
    // `reviewedBy` is the person because a named human checked it on that date.
    // Inverting those would be the more flattering claim and the less true one.
    ...(svc.lastReviewed
      ? { dateModified: svc.lastReviewed, author: { '@id': ORG_ID }, reviewedBy: REVIEWER }
      : {}),
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

  // Resolved, not read straight off `svc.customFAQs`. Only 4 of 62 services
  // define their own, so gating on that field emitted FAQPage on 6% of pages
  // while the other 58 rendered a visible six-question accordion carrying no
  // markup at all. The resolver returns exactly what the page shows.
  const faqs = resolveServiceFaqs(svc);
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        // Flattened: an answer may carry paragraph breaks for rendering, and
        // schema.org wants plain text here — a quotable block should not make an
        // answer engine strip layout characters first.
        acceptedAnswer: { '@type': 'Answer', text: faqPlainText(f.a) },
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
