import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Deployed on GitHub Pages at cunyan-ma.github.io/dal-map/, so the base
  // must match the repo path for asset + data URLs to resolve correctly.
  base: '/dal-map/',
})
