const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

interface ProfessionalServiceInput {
  name: string;
  description: string;
  url: string;
  areaServed?: string;
}

export function buildProfessionalServiceSchema(input: ProfessionalServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: input.name,
    description: input.description,
    url: input.url,
    areaServed: input.areaServed ?? 'Worldwide',
    provider: { '@id': `${BASE_URL}/#organization` },
  };
}
