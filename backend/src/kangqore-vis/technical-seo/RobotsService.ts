const BASE_URL = process.env.PUBLIC_BASE_URL || 'https://kangqore.com';

// AI / answer-engine crawlers we explicitly welcome. Stating these by name is a
// deliberate GEO/LLMO position rather than relying on the `*` wildcard: several
// of these bots are documented to treat an explicit Allow as a stronger signal,
// and being enumerated here makes the stance auditable.
const AI_CRAWLERS = [
  'GPTBot',            // OpenAI — ChatGPT browsing + training
  'OAI-SearchBot',     // OpenAI — ChatGPT Search index
  'ChatGPT-User',      // OpenAI — user-initiated fetches
  'ClaudeBot',         // Anthropic — Claude
  'Claude-Web',        // Anthropic — user-initiated fetches
  'anthropic-ai',      // Anthropic — legacy token
  'PerplexityBot',     // Perplexity
  'Google-Extended',   // Google — Gemini / AI Overviews grounding
  'Applebot-Extended', // Apple Intelligence
  'CCBot',             // Common Crawl — feeds many downstream models
  'cohere-ai',
  'Meta-ExternalAgent',
];

// Private surfaces. Kept in one place so the static mirror in
// frontend/public/robots.txt cannot drift from what actually ships.
const DISALLOWED = [
  '/admin',
  '/api',
  '/dashboard',
  '/auth/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/kangqore-view/',
  '/book/',
];

export class RobotsService {
  static generate(): string {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      return ['User-agent: *', 'Disallow: /', '', `Sitemap: ${BASE_URL}/sitemap.xml`].join('\n');
    }

    const lines: string[] = [
      '# Kangqore — robots.txt',
      '# Public marketing pages are crawlable; admin / auth / API are not.',
      '',
      'User-agent: *',
      'Allow: /',
      ...DISALLOWED.map((p) => `Disallow: ${p}`),
      '',
      '# ─── AI & answer engines: explicitly allowed ───',
    ];

    for (const bot of AI_CRAWLERS) {
      lines.push('', `User-agent: ${bot}`, 'Allow: /', ...DISALLOWED.map((p) => `Disallow: ${p}`));
    }

    lines.push(
      '',
      `Sitemap: ${BASE_URL}/sitemap.xml`,
      `# LLM-friendly index: ${BASE_URL}/llms.txt`,
    );

    return lines.join('\n');
  }
}
