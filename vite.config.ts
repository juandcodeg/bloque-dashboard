import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    preact(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['fish-icon.webp'],
      manifest: {
        name: 'Bloque Dashboard',
        short_name: 'Bloque',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f0f0f',
        theme_color: '#38bdf8', // tailwind sky-400
        icons: [
          {
            src: 'fish-icon-192.webp',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'fish-icon.webp',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});

