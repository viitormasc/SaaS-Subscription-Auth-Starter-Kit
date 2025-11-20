import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      html2canvas: path.resolve(__dirname, "node_modules/html2canvas-pro") // THis need to be done to generate the Dashboard PDF beacuse html2canvas cant work with tailwind v4. oklch colors and html2canvas-pro can
    },
  },
});
