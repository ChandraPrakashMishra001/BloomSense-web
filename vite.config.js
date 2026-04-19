import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 800,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('@google/model-viewer'))  return 'viewer';
          if (id.includes('firebase/firestore'))    return 'firebase-db';
          if (id.includes('firebase/auth') || id.includes('firebase/app')) return 'firebase-core';
          if (id.includes('framer-motion'))         return 'animation';
          if (id.includes('lucide-react'))          return 'icons';
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/')) return 'vendor';
        }
      }
    }
  }
})

