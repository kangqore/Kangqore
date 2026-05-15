// ─── Frontend Legacy Redirect Routes ───────────────────────────────────────────
// Client-side `<Navigate>` fallback for the 76 legacy URLs.
//
// Why ALSO client-side? In dev mode (CRA dev server on localhost:3000), the
// Express backend is NOT in the request path — only the React app is. Without
// these routes, clicking a legacy URL in dev would 404.
//
// In production, the Express middleware at `backend/src/middleware/legacyRedirects.ts`
// intercepts the request and returns a real HTTP 301 BEFORE the JS bundle loads,
// so these client-side routes are never reached. They are the dev-mode and
// edge-case safety net.
//
// Data source: frontend/src/data/legacyRedirects.generated.json
//   (canonical authoring source: shared/legacyRedirects.json at repo root)
//
// CRITICAL: must be mounted as the FIRST routes in App.js's <Routes> block so
// they take precedence over any legacy <Route> entries that still exist
// (e.g., the 61 nested service routes in serviceRoutes.jsx).
// ────────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import legacyRedirects from '../data/legacyRedirects.generated.json';

export const legacyRedirectRoutes = Object.entries(legacyRedirects).map(([from, to]) => (
  <Route
    key={`legacy-redirect-${from}`}
    path={from}
    element={<Navigate to={to} replace />}
  />
));

export default legacyRedirectRoutes;
