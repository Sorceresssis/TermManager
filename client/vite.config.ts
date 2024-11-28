import nodePath from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    outDir: './dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      input: {
        home: nodePath.resolve(__dirname, './index.html'),
        login: nodePath.resolve(__dirname, './login.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': nodePath.resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
});
