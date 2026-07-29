import fs from 'node:fs';
import path from 'node:path';
import type { Request, Response, NextFunction } from 'express';

// ─── Bot prerendering ──────────────────────────────────────────────────────────
// The public site is a client-rendered SPA, so the raw HTML payload is an empty
// <div id="root">. Googlebot will render JS eventually; GPTBot, ClaudeBot,
// PerplexityBot and CCBot will not. Without this, every service page is
// literally blank to the crawlers that feed AI answer engines.
//
// Static snapshots are produced by scripts/generate-prerender.mjs from the same
// servicesData.js the React app renders from. This middleware serves them to
// known bots only — humans always get the SPA.
// ────────────────────────────────────────────────────────────────────────────────

// Matched case-insensitively against User-Agent.
const BOT_UA =
  /(GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-Web|anthropic-ai|PerplexityBot|Google-Extended|Applebot-Extended|CCBot|cohere-ai|Meta-ExternalAgent|Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Twitterbot|facebookexternalhit|LinkedInBot|Discordbot|Slackbot)/i;

const SERVICE_PATH = /^\/services\/([a-z0-9-]+)\/?$/;

function snapshotDirs(): string[] {
  return [
    path.resolve(__dirname, '../../../../frontend/public/prerender/services'),
    path.resolve(__dirname, '../../../../frontend/build/prerender/services'),
    path.resolve(process.cwd(), 'frontend/public/prerender/services'),
    path.resolve(process.cwd(), '../frontend/public/prerender/services'),
    path.resolve(process.cwd(), 'public/prerender/services'),
  ];
}

/** Resolve a slug to its snapshot file, or null when absent. */
function findSnapshot(slug: string): string | null {
  // Defence-in-depth: the route regex already excludes traversal characters.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  for (const dir of snapshotDirs()) {
    const file = path.join(dir, `${slug}.html`);
    try {
      if (fs.existsSync(file)) return file;
    } catch {
      /* try next */
    }
  }
  return null;
}

export function isBot(userAgent: string | undefined): boolean {
  return Boolean(userAgent && BOT_UA.test(userAgent));
}

export function botPrerenderMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (!isBot(req.get('user-agent'))) return next();

  const match = SERVICE_PATH.exec(req.path);
  if (!match) return next();

  const file = findSnapshot(match[1]);
  if (!file) return next();

  try {
    const html = fs.readFileSync(file, 'utf8');
    res
      .set('Content-Type', 'text/html; charset=utf-8')
      // Let crawlers and CDNs cache, but keep it short so content edits
      // propagate without a purge.
      .set('Cache-Control', 'public, max-age=900')
      .set('X-Kangqore-Prerender', 'static')
      .set('Vary', 'User-Agent')
      .send(html);
  } catch (err) {
    console.error('kangqore-vis.prerender.error', err);
    next();
  }
}
