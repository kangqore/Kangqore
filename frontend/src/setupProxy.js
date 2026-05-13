/**
 * CRA dev-server proxy.
 * Production: backend serves both static frontend and dynamic /api, /sitemap.xml,
 * /robots.txt, /llms.txt on the same origin — no proxy needed.
 * Dev: CRA runs on :3000, backend on :5050 — proxy KangqoreVis public + API routes.
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const TARGET = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

module.exports = function (app) {
  const proxy = createProxyMiddleware({ target: TARGET, changeOrigin: true });
  app.use('/api', proxy);
  app.use('/sitemap.xml', proxy);
  app.use('/robots.txt', proxy);
  app.use('/llms.txt', proxy);
};
