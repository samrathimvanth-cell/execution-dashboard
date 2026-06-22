import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/execution-dashboard/',
  root: '.',
  optimizeDeps: {
    entries: ['src/**/*.{js,jsx}'],
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
})
