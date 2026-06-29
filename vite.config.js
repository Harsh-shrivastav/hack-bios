import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: true,
    port: 5173,
    host: true, // Needed for network access during dev
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-three';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor'; // all other node_modules
          }
        },
      },
    },

    chunkSizeWarningLimit: 1000,
  },
})

