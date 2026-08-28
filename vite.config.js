// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // base este setat corect
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Folderul public este inclus
  publicDir: 'public',
  server: {
    historyApiFallback: true, // Pentru dezvoltare locală
  },
});