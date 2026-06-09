/**
 * CRA dev-server proxy.
 * Production: backend serves both static frontend and dynamic /api, /sitemap.xml,
 * /robots.txt, /llms.txt on the same origin — no proxy needed.
 * Dev: CRA runs on :3000, backend on :5050 — proxy KangqoreVis public + API routes.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const path = require('path');

const BACKEND       = import.meta.env.VITE_BACKEND_URL     || '';
const KANGQORE_VIEW = import.meta.env.VITE_DASHBOARD_OS_URL || 'http://localhost:5174';

module.exports = function (app) {
  const backendProxy = createProxyMiddleware({ target: BACKEND,       changeOrigin: true });
  const kvProxy      = createProxyMiddleware({ target: KANGQORE_VIEW, changeOrigin: true, ws: true });

  // kangqore-view routes — mirrors nginx production routing
  app.use('/os',     kvProxy);
  app.use('/portal', kvProxy);
  
  // Conditionally proxy /assets to Vite dev server or serve locally
  app.use('/assets', (req, res, next) => {
    const localPath = path.join(__dirname, '../public/assets', req.path);
    if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
      return next(); // serve locally via CRA dev server
    }
    return kvProxy(req, res, next); // proxy to Vite
  });

  // Vite dev server internals (only needed in dev)
  // IMPORTANT: /node_modules/.vite must be proxied — without it CRA's SPA
  // fallback returns index.html for Vite's pre-bundled ESM deps, causing a
  // silent parse failure that leaves the page blank.
  app.use('/node_modules/.vite', kvProxy);  // Vite pre-bundled deps
  app.use('/node_modules/vite',  kvProxy);  // @vite/client imports env.mjs from here
  app.use('/@vite',              kvProxy);
  app.use('/@react-refresh',     kvProxy);
  app.use('/@id',                kvProxy);
  app.use('/src',                kvProxy);  // Vite serves source files directly

  // Backend + SEO routes + WebSocket
  app.use('/socket.io',   backendProxy);
  app.use('/api',         backendProxy);
  app.use('/sitemap.xml', backendProxy);
  app.use('/robots.txt',  backendProxy);
  app.use('/llms.txt',    backendProxy);
};
