export class UrlPolicy {
  private static patterns: Array<{ test: RegExp; description: string }> = [
    { test: /^\/$/, description: 'home' },
    { test: /^\/department\/[a-z0-9-]+$/, description: 'department hub' },
    { test: /^\/services\/[a-z0-9-]+\/[a-z0-9-]+$/, description: 'service spoke' },
    { test: /^\/industries\/[a-z0-9-]+$/, description: 'industry hub' },
    { test: /^\/case-studies\/[a-z0-9-]+$/, description: 'case study' },
    { test: /^\/insights\/[a-z0-9-]+$/, description: 'insight' },
    { test: /^\/blogs\/[a-z0-9-]+$/, description: 'blog post' },
    { test: /^\/white-papers?\/[a-z0-9-]+$/, description: 'white paper' },
  ];

  static validate(url: string): { ok: boolean; matched?: string } {
    const matched = this.patterns.find((p) => p.test.test(url));
    return { ok: Boolean(matched), matched: matched?.description };
  }
}
