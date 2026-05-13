const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

interface ServiceInput {
  name: string;
  description: string;
  url: string;
  category?: string;
  serviceArea?: string;
}

export function buildServiceSchema(input: ServiceInput) {
  const absolute = input.url.startsWith('http') ? input.url : `${BASE_URL}${input.url}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absolute,
    serviceType: input.category,
    areaServed: input.serviceArea ?? 'Worldwide',
    provider: { '@id': `${BASE_URL}/#organization` },
  };
}
