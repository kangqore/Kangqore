const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

export class RobotsService {
  static generate(): string {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      return ['User-agent: *', 'Disallow: /', '', `Sitemap: ${BASE_URL}/sitemap.xml`].join('\n');
    }
    return [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api',
      'Disallow: /dashboard',
      '',
      `Sitemap: ${BASE_URL}/sitemap.xml`,
    ].join('\n');
  }
}
