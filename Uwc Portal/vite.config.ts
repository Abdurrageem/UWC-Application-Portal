import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Set base to your repo name for GitHub Pages
  // Must match exactly (case-sensitive): /REPO-NAME/
  base: '/UWC-Application-Portal/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
