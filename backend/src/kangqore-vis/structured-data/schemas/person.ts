interface PersonInput {
  name: string;
  jobTitle?: string;
  url?: string;
  image?: string;
  sameAs?: string[];
  worksFor?: string;
}

export function buildPersonSchema(input: PersonInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    jobTitle: input.jobTitle,
    url: input.url,
    image: input.image,
    sameAs: input.sameAs,
    worksFor: input.worksFor ? { '@type': 'Organization', name: input.worksFor } : undefined,
  };
}
