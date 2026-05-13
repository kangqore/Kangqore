const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

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

export function buildOrganizationSchema() {
  return ORGANIZATION_SCHEMA;
}
