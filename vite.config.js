import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the build works both at a domain root (Vercel) and under
  // a sub-path (GitHub Pages at /dal-map/). Safe because the app uses
  // HashRouter, so the document is always served from the root path.
  base: './',
})
