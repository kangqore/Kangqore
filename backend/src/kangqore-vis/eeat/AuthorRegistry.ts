export interface AuthorProfile {
  slug: string;
  name: string;
  jobTitle: string;
  bioUrl: string;
  imageUrl?: string;
  sameAs?: string[];
}

const AUTHORS: AuthorProfile[] = [
  {
    slug: 'kangqore-founders',
    name: 'Kangqore Founders',
    jobTitle: 'Founders',
    bioUrl: '/leadership',
    sameAs: ['https://www.linkedin.com/company/kangqore'],
  },
];

export class AuthorRegistry {
  static list(): AuthorProfile[] {
    return [...AUTHORS];
  }

  static getBySlug(slug: string): AuthorProfile | undefined {
    return AUTHORS.find((a) => a.slug === slug);
  }

  static register(profile: AuthorProfile): void {
    const idx = AUTHORS.findIndex((a) => a.slug === profile.slug);
    if (idx >= 0) AUTHORS[idx] = profile;
    else AUTHORS.push(profile);
  }
}
