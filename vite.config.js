import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at ai-materiality-map.org/data-workers/ — base sets the URL prefix,
// outDir puts the files under a matching directory so no rewrites are needed.
export default defineConfig({
  plugins: [react()],
  base: '/data-workers/',
  build: { outDir: 'dist/data-workers' },
})