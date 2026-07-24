import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Deployed under power-map.ai/data-worker via the power-map umbrella project,
  // which proxies /data-worker/* to this app. The absolute sub-path base makes
  // every asset + data URL resolve to /data-worker/... regardless of trailing
  // slash; the CSV fetches in SupplyChain derive from import.meta.env.BASE_URL,
  // so they follow automatically.
  base: '/data-worker/',
})
