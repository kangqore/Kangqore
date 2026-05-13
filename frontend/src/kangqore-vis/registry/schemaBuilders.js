const BASE_URL = 'https://kangqore.com';

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Kangqore',
  legalName: 'Kangqore Global Pvt Ltd',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${BASE_URL}/#logo`,
    url: `${BASE_URL}/assets/logo.png`,
    contentUrl: `${BASE_URL}/assets/logo.png`,
    width: 512,
    height: 512,
    caption: 'Kangqore',
  },
  image: { '@id': `${BASE_URL}/#logo` },
  description:
    'Kangqore is a value-driven IT company that enables enterprises and institutions to achieve end-to-end digital transformation through modern engineering and AI-enabled innovation.',
  foundingDate: '2024',
  sameAs: [
    'https://www.linkedin.com/company/kangqore',
    'https://x.com/kangqore',
    'https://www.facebook.com/kangqore',
    'https://www.instagram.com/kangqore',
    'https://www.youtube.com/@kangqore',
    'https://www.reddit.com/r/kangqore',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      url: `${BASE_URL}/contact`,
      availableLanguage: ['English'],
    },
  ],
};

export function buildBreadcrumbList(url) {
  if (!url || url === '/') return null;
  const paths = url.split('/').filter(Boolean);
  const itemListElement = [{ '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL }];
  let current = '';
  paths.forEach((segment, idx) => {
    current += `/${segment}`;
    const name = segment
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    itemListElement.push({
      '@type': 'ListItem',
      position: idx + 2,
      name,
      item: `${BASE_URL}${current}`,
    });
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement };
}

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Kangqore',
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

export function buildFAQPage(items) {
  if (!items || items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function buildService({ name, description, url, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: url?.startsWith('http') ? url : `${BASE_URL}${url ?? ''}`,
    serviceType: category,
    areaServed: 'Worldwide',
    provider: { '@id': `${BASE_URL}/#organization` },
  };
}

export function buildArticle({ headline, description, url, image, datePublished, dateModified, authorName, section }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: url?.startsWith('http') ? url : `${BASE_URL}${url ?? ''}`,
    image,
    datePublished,
    dateModified: dateModified ?? datePublished,
    articleSection: section,
    author: { '@type': 'Person', name: authorName },
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

export const SCHEMA_BASE_URL = BASE_URL;
