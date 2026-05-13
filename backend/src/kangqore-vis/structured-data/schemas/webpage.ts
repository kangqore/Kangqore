const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

interface WebPageInput {
  url: string;
  name: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
}

export function buildWebPageSchema(input: WebPageInput) {
  const absolute = input.url.startsWith('http') ? input.url : `${BASE_URL}${input.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absolute}#webpage`,
    url: absolute,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    datePublished: input.datePublished,
    dateModified: input.dateModified,
  };
}
