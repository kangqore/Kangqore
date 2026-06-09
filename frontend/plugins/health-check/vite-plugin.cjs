'use strict'
const os = require('os')

function healthCheckPlugin() {
  const SERVER_START = Date.now()
  const status = {
    state: 'idle',
    errors: [],
    warnings: [],
    lastCompileTime: null,
    lastSuccessTime: null,
    compileDuration: 0,
    totalCompiles: 0,
  }

  function formatBytes(b) {
    if (!b) return '0 B'
    const k = 1024, s = ['B','KB','MB','GB'], i = Math.floor(Math.log(b)/Math.log(k))
    return Math.round(b/Math.pow(k,i)*100)/100 + ' ' + s[i]
  }
  function formatMs(ms) {
    const s = Math.floor(ms/1000), m = Math.floor(s/60), h = Math.floor(m/60)
    return h > 0 ? `${h}h ${m%60}m ${s%60}s` : m > 0 ? `${m}m ${s%60}s` : `${s}s`
  }

  function send(res, body, code = 200) {
    const payload = typeof body === 'string' ? body : JSON.stringify(body)
    res.statusCode = code
    res.setHeader('Content-Type', typeof body === 'string' ? 'text/plain' : 'application/json')
    res.end(payload)
  }

  return {
    name: 'kangqore-health-check',

    buildStart() {
      status.state = 'compiling'
      status.lastCompileTime = Date.now()
      if (!status.firstCompileTime) status.firstCompileTime = Date.now()
    },

    buildEnd(err) {
      status.totalCompiles++
      status.compileDuration = Date.now() - (status.lastCompileTime || Date.now())
      if (err) {
        status.state = 'failed'
        status.errors = [{ message: err.message, stack: err.stack }]
      } else {
        status.state = 'success'
        status.lastSuccessTime = Date.now()
        status.errors = []
      }
    },

    configureServer(server) {
      const uptime = () => Date.now() - SERVER_START
      const mem    = () => process.memoryUsage()

      server.middlewares.use('/health/simple', (req, res) => {
        const map = { success: [200,'OK'], compiling: [200,'COMPILING'], idle: [200,'IDLE'] }
        const [code, text] = map[status.state] || [503, 'ERROR']
        res.statusCode = code; res.end(text)
      })

      server.middlewares.use('/health/ready', (req, res) => {
        const ready = status.state === 'success'
        send(res, { ready, state: status.state }, ready ? 200 : 503)
      })

      server.middlewares.use('/health/live', (req, res) => {
        send(res, { alive: true, timestamp: new Date().toISOString() })
      })

      server.middlewares.use('/health/errors', (req, res) => {
        send(res, { errorCount: status.errors.length, errors: status.errors, state: status.state })
      })

      server.middlewares.use('/health/stats', (req, res) => {
        send(res, {
          totalCompiles: status.totalCompiles,
          lastCompileDuration: status.compileDuration ? `${status.compileDuration}ms` : null,
          serverUptime: formatMs(uptime()),
        })
      })

      server.middlewares.use('/health', (req, res) => {
        const m = mem()
        send(res, {
          status: status.state === 'success' ? 'healthy' : 'unhealthy',
          timestamp: new Date().toISOString(),
          uptime: { seconds: Math.floor(uptime()/1000), formatted: formatMs(uptime()) },
          vite: { state: status.state, errors: status.errors.length, warnings: status.warnings.length },
          server: {
            nodeVersion: process.version,
            platform: os.platform(),
            memory: { heapUsed: formatBytes(m.heapUsed), heapTotal: formatBytes(m.heapTotal) },
          },
          environment: process.env.NODE_ENV || 'development',
        })
      })

      console.log('[Health Check] ✓ endpoints: /health /health/simple /health/ready /health/live')
    },
  }
}

module.exports = { healthCheckPlugin }
