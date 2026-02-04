import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Enable HMR with proper host configuration
    host: true,
    // Watch backend files for changes and trigger frontend reload
    watch: {
      ignored: ['!**/backend/**'],
    },
    proxy: {
      // Proxy API requests to Express backend
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // Preserve the /api prefix
        rewrite: (path) => path,
      },
    },
  },
});
