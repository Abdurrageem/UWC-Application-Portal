import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Set base to your repo name for GitHub Pages (e.g., '/uwc-application-portal/')
  // Leave as '/' if deploying to a custom domain or root
  base: '/uwc-application-portal/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
