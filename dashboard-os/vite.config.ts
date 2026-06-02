import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@design-system': resolve(__dirname, 'src/design-system'),
      '@features': resolve(__dirname, 'src/features'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@store': resolve(__dirname, 'src/store'),
      '@types': resolve(__dirname, 'src/types'),
      '@portals': resolve(__dirname, 'src/portals'),
    },
  },

  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },

  build: {
    // Raise the warning threshold — 500 KB is aggressive for an enterprise SPA
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Stable, cache-friendly vendor chunks
        // Each chunk changes only when its specific deps update — not on every deploy
        // Rolldown requires manualChunks as a function (not object)
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('recharts'))          return 'vendor-charts'
          if (id.includes('socket.io-client'))  return 'vendor-socket'
          if (id.includes('@tanstack/'))         return 'vendor-query'
          if (id.includes('@radix-ui/') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) return 'vendor-ui'
          if (id.includes('/react-dom/') || id.includes('/react-router') || id.includes('/react-hook-form') || id.includes('/react-hot-toast')) return 'vendor-react'
          if (id.includes('/react/'))             return 'vendor-react'
          return undefined
        },
      },
    },
  },
})
