import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /ai-engineering-journey/; local dev/preview stays at root.
  base: command === 'build' ? '/ai-engineering-journey/' : '/',
  plugins: [react(), tailwindcss()],
  // Shown on the home page as "Updated <date>", so visitors can tell the guide is kept current.
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // Content (.js lessons and ROADMAP.md) lives in the folders one level above webapp/
      allow: ['..'],
    },
  },
}))
