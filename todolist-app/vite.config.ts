import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import tailwindcss

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Add tailwindcss()
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // Will create this file
    globals: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})