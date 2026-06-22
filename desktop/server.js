const express = require('express');
const path = require('path');
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

  // SPA fallback — any unmatched route returns index.html so React Router handles it
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });

  return app;
}

module.exports = { createServer };
