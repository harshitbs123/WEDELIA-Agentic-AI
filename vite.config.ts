import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        wardrobe: resolve(__dirname, 'wardrobe.html'),
        p01: resolve(__dirname, '01-tokyo-editorial.html'),
        p02: resolve(__dirname, '02-brutalist-fashion-index.html'),
        p03: resolve(__dirname, '03-red-black-tokyo.html'),
        p04: resolve(__dirname, '04-vertical-japanese-poster.html'),
        p10: resolve(__dirname, '10-the-strange-one.html'),
      },
    },
  },
});
