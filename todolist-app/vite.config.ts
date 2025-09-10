import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import tailwindcss
import type { UserConfig } from 'vitest' // Import UserConfig from vitest

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], // Add tailwindcss()
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // Will create this file
    globals: true,
  } as UserConfig, // Cast test config to UserConfig
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})