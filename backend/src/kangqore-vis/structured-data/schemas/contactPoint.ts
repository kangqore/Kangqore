interface ContactPointInput {
  contactType: 'sales' | 'support' | 'partnerships' | 'press' | 'careers';
  email?: string;
  telephone?: string;
  url?: string;
  areaServed?: string[];
  availableLanguage?: string[];
}

export function buildContactPointSchema(input: ContactPointInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPoint',
    contactType: input.contactType,
    email: input.email,
    telephone: input.telephone,
    url: input.url,
    areaServed: input.areaServed,
    availableLanguage: input.availableLanguage ?? ['English'],
  };
}
