/**
 * CRA dev-server proxy.
 * Production: backend serves both static frontend and dynamic /api, /sitemap.xml,
 * /robots.txt, /llms.txt on the same origin — no proxy needed.
 * Dev: CRA runs on :3000, backend on :5050 — proxy KangqoreVis public + API routes.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND       = process.env.REACT_APP_BACKEND_URL     || 'http://localhost:5050';
const KANGQORE_VIEW = process.env.REACT_APP_DASHBOARD_OS_URL || 'http://localhost:5174';

module.exports = function (app) {
  const backendProxy = createProxyMiddleware({ target: BACKEND,       changeOrigin: true });
  const kvProxy      = createProxyMiddleware({ target: KANGQORE_VIEW, changeOrigin: true, ws: true });

  // kangqore-view routes — mirrors nginx production routing
  app.use('/os',     kvProxy);
  app.use('/portal', kvProxy);
  app.use('/assets', kvProxy);  // Vite built assets

  // Vite dev server internals (only needed in dev)
  app.use('/@vite',          kvProxy);
  app.use('/@react-refresh', kvProxy);
  app.use('/@id',            kvProxy);
  app.use('/src',            kvProxy);  // Vite serves source files directly

  // Backend + SEO routes + WebSocket
  app.use('/socket.io',   backendProxy);
  app.use('/api',         backendProxy);
  app.use('/sitemap.xml', backendProxy);
  app.use('/robots.txt',  backendProxy);
  app.use('/llms.txt',    backendProxy);
};
