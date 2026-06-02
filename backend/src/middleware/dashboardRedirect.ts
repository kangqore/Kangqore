// ─── Dashboard → OS 301 Redirect Middleware ─────────────────────────────────
// Any request to /dashboard/* is permanently redirected to /os/*.
// Runs BEFORE express.static() so the legacy CRA build never serves the page.
// Query strings are preserved so deep links keep working.
//
// Mapping:
//   /dashboard              → /os
//   /dashboard/projects     → /os/projects
//   /dashboard/projects/123 → /os/projects/123
//
// Placement in index.ts: after all /api/* mounts, alongside legacyRedirectsMiddleware.

import type { Request, Response, NextFunction } from 'express';

export const dashboardRedirectMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.path.startsWith('/dashboard')) {
    next();
    return;
  }

  const tail = req.path.slice('/dashboard'.length); // '' | '/' | '/projects' | ...
  const osPath = '/os' + tail;

  const queryIdx = req.url.indexOf('?');
  const qs = queryIdx >= 0 ? req.url.slice(queryIdx) : '';

  res.redirect(301, osPath + qs);
};

export default dashboardRedirectMiddleware;
