// ─── Legacy URL 301 Redirect Middleware ────────────────────────────────────────
// Maps legacy URLs (15 old /department/<slug> + 61 old nested service paths)
// to the new canonical URLs (/departments/<slug> and flat /services/<slug>).
//
// Data source: backend/src/data/legacyRedirects.generated.json
// Canonical authoring source: shared/legacyRedirects.json at repo root.
// Mirror is regenerated via `npm run redirects:generate` from the root.
// CI gate: `npm run redirects:check` enforces no drift.
//
// CRITICAL: this middleware MUST be wired into backend/src/index.ts:
//   - AFTER all /api/* route mounts (otherwise API requests could be intercepted)
//   - BEFORE express.static() (otherwise static lookups absorb legacy paths)
//   - BEFORE the SPA fallback (otherwise React Router gets the request)
//
// See plan Section 20.5.1 for placement rationale.
// ────────────────────────────────────────────────────────────────────────────────

import type { Request, Response, NextFunction } from 'express';
import legacyRedirectsMap from '../data/legacyRedirects.generated.json';

type RedirectMap = Record<string, string>;
const redirects = legacyRedirectsMap as RedirectMap;

export const legacyRedirectsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Defensive guard: never redirect API paths even if a misconfig adds one
  // to the map. /api/* is the application's lifeblood.
  if (req.path.startsWith('/api/')) {
    next();
    return;
  }

  const dest = redirects[req.path];
  if (!dest) {
    next();
    return;
  }

  // Preserve query string (e.g., ?utm_source=newsletter) across the redirect
  // so attribution and tracking continue to work after the 301.
  const queryIdx = req.url.indexOf('?');
  const queryString = queryIdx >= 0 ? req.url.slice(queryIdx) : '';

  res.redirect(301, dest + queryString);
};

export default legacyRedirectsMiddleware;
