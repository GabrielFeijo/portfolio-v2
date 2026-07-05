import path from 'path'
import { defineConfig } from 'vitest/config'

const threeModule = path.resolve(__dirname, 'node_modules/three/build/three.module.js')

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      three: threeModule,
    },
    dedupe: ['three'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/vite-env.d.ts',
        'src/types/**',
        'src/components/three/shaders/sun-material.ts',
        'src/components/three/shaders/atmosphere-material.ts',
        'src/utils/glsl/**',
      ],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
  },
})
