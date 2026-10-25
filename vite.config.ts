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
        p01: resolve(__dirname, '01-tokyo-editorial.html'),
        p02: resolve(__dirname, '02-brutalist-fashion-index.html'),
        p03: resolve(__dirname, '03-red-black-tokyo.html'),
        p04: resolve(__dirname, '04-vertical-japanese-poster.html'),
        p05: resolve(__dirname, '05-fashion-newspaper.html'),
        p06: resolve(__dirname, '06-white-void.html'),
        p07: resolve(__dirname, '07-tokyo-street-contact-sheet.html'),
        p08: resolve(__dirname, '08-fashion-terminal.html'),
        p09: resolve(__dirname, '09-collage-cut-paper.html'),
        p10: resolve(__dirname, '10-the-strange-one.html'),
      },
    },
  },
});
