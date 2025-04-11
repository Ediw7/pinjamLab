import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    historyApiFallback: true,
    headers: {
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    },
  },
})
