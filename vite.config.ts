/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'DevNote',
        short_name: 'DevNote',
        description: 'DevNote',
        theme_color: '#020817',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 10000000,
      },
    }),
    // vueDevTools(),
  ],
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    chunkSizeWarningLimit: 2000,
  },
})
