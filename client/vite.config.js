
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/WEBSITE/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true
      },
      '/sitemap.xml': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true
      },
      '/robots.txt': {
        target: 'http://127.0.0.1:5005',
        changeOrigin: true
      }
    }
  }
});
