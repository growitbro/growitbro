import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'growitbro' below to your actual GitHub repository name
export default defineConfig({
  plugins: [react()],
  base: '/growitbro/',          // <── replace with your repo name if different
})
