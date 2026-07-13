import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const threeModule = path.resolve(__dirname, 'node_modules/three/build/three.module.js')
const threeRoot = path.resolve(__dirname, 'node_modules/three')

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: command === 'serve',
    target: 'esnext',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@react-three') || id.includes('/three/') || id.includes('/three-stdlib/') || id.includes('/camera-controls/')) {
            return 'vendor-3d'
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('/zustand/')) {
            return 'vendor-state'
          }

          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) {
            return 'vendor-form'
          }

          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'vendor-react'
          }

          if (id.includes('lucide-react')) {
            return 'vendor-icons'
          }

          return 'vendor-misc'
        },
      },
    },
  },
  server: {
    sourcemapIgnoreList: false,
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: /^three$/, replacement: threeModule },
      { find: /^three\/(.*)$/, replacement: `${threeRoot}/$1` },
    ],
    dedupe: ['three'],
  },
}))
