const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

function createServer(frontendBuildPath, backendUrl) {
  const app = express();

  const proxy = createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    ws: true,
    on: {
      error: (err, req, res) => {
        console.error('[desktop proxy]', err.message);
        if (res && !res.headersSent) {
          res.status(502).json({ error: 'Backend unavailable', detail: err.message });
        }
      },
    },
  });

  // Proxy all API and WebSocket traffic to the backend
  app.use('/api', proxy);
  app.use('/socket.io', proxy);

  // Serve the built Vite SPA
  app.use(express.static(frontendBuildPath));

  const indexPath = path.join(frontendBuildPath, 'index.html');
  let indexHtml = '';
  try {
    indexHtml = fs.readFileSync(indexPath, 'utf8');
  } catch {
    // index.html may not exist yet if frontend has not been built
  }

  // SPA fallback — any unmatched route returns cached index.html so React Router handles it
  app.use((req, res) => {
    res.type('html').send(indexHtml);
  });

  return app;
}

module.exports = { createServer };
