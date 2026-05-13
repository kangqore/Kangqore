const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

interface ArticleInput {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  section?: string;
}

export function buildArticleSchema(input: ArticleInput) {
  const absolute = input.url.startsWith('http') ? input.url : `${BASE_URL}${input.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: absolute,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    articleSection: input.section,
    author: { '@type': 'Person', name: input.authorName },
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}
