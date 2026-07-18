import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require   = createRequire(import.meta.url)

export default defineConfig(({ mode }) => {
  const env    = loadEnv(mode, process.cwd(), '')
  const isDev  = mode === 'development'

  const BACKEND       = env.VITE_BACKEND_URL       || 'http://localhost:5050'
  const KANGQORE_VIEW = env.VITE_DASHBOARD_OS_URL  || 'http://localhost:5174'

  const extraPlugins = []

  if (env.ENABLE_HEALTH_CHECK === 'true') {
    try {
      const { healthCheckPlugin } = require('./plugins/health-check/vite-plugin.cjs')
      extraPlugins.push(healthCheckPlugin())
    } catch (_) { /* not available in this environment */ }
  }

  return {
    plugins: [
      react({ include: /\.(jsx|tsx|js|ts)$/ }),
      ...extraPlugins,
    ],

    resolve: {
      alias: {
        '@':              path.resolve(__dirname, 'src'),
        '@features':      path.resolve(__dirname, 'src/os/features'),
        '@components':    path.resolve(__dirname, 'src/os/components'),
        '@store':         path.resolve(__dirname, 'src/os/store'),
        '@hooks':         path.resolve(__dirname, 'src/os/hooks'),
        '@lib':           path.resolve(__dirname, 'src/os/lib'),
        '@design-system': path.resolve(__dirname, 'src/os/design-system'),
        '@pages':         path.resolve(__dirname, 'src/os/pages'),
        '@portals':       path.resolve(__dirname, 'src/os/portals'),
        '@os/tokens':     path.resolve(__dirname, 'src/os/tokens'),
        '@os/motion':     path.resolve(__dirname, 'src/os/motion'),
      },
    },

    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    server: {
      port: 3000,
      proxy: process.env.DISABLE_API_PROXY ? {} : {
        '/socket.io':   { target: BACKEND, changeOrigin: true, ws: true },
        '/api':         { target: BACKEND, changeOrigin: true },
        '/sitemap.xml': { target: BACKEND, changeOrigin: true },
        '/robots.txt':  { target: BACKEND, changeOrigin: true },
        '/llms.txt':    { target: BACKEND, changeOrigin: true },
      },
    },

    build: {
      outDir: 'build',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('/node_modules/react') ||
                id.includes('/node_modules/react-dom') ||
                id.includes('/node_modules/react-router-dom')) return 'vendor'
            if (id.includes('/node_modules/framer-motion') ||
                id.includes('/node_modules/gsap')) return 'ui'
            if (id.includes('/node_modules/@radix-ui')) return 'radix'
          },
        },
      },
    },
  }
})
