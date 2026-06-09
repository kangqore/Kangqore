'use strict'
const fs   = require('fs')
const path = require('path')

function visualEditsPlugin() {
  return {
    name: 'kangqore-visual-edits',

    configureServer(server) {
      // Liveness ping (no auth)
      server.middlewares.use('/ping', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'ok', time: new Date().toISOString() }))
      })

      // Full dev-server-setup (Emergent.sh / cloud IDE integration)
      try {
        const setupDevServer = require('./dev-server-setup')

        // Build a mock devServer.app that routes into Vite's Connect stack
        let jsonBodyParser = null
        try { jsonBodyParser = require('body-parser').json() } catch (_) {}

        const mockApp = {
          use: (...args) => server.middlewares.use(...args),
          get:  (p, h) => server.middlewares.use(p, (req, res, next) =>
            req.method === 'GET'  ? h(req, res, next) : next()),
          post: (p, h) => server.middlewares.use(p, (req, res, next) => {
            if (req.method !== 'POST') return next()
            if (!jsonBodyParser) return h(req, res, next)
            jsonBodyParser(req, res, () => h(req, res, next))
          }),
        }

        // setupDevServer sets config.setupMiddlewares; call it with our mock
        const mockConfig = {}
        setupDevServer(mockConfig)
        if (typeof mockConfig.setupMiddlewares === 'function') {
          const mockDevServer = { app: mockApp }
          mockConfig.setupMiddlewares([], mockDevServer)
        }
      } catch (_) {
        // Cloud IDE integration not available in this environment — /ping only
      }
    },
  }
}

module.exports = { visualEditsPlugin }
