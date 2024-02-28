import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  /*server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },*/
  plugins: [
    vue(),
    VitePWA({
      mode: 'development',
      base: '/',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['/favicon.png'],
      strategies: 'injectManifest',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Template Project',
        short_name: 'Template',
        theme_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/main.ts',
      name: 'form-library',
    },
  },
  test: {
    environment: 'jsdom',
    clearMocks: true,
    reporters: ['default', 'json'],
    outputFile: 'results/vitest-results.json',
    coverage: {
      provider: 'istanbul',
      all: true,
      include: ['src'],
      exclude: ['src/**/__tests__/', 'src/main.ts', 'src/router/index.ts', 'src/models', 'src/config', 'src/constants'],
      reporter: ['json-summary', 'text', 'html', 'lcov'],
    },
  },
});
