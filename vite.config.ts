import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

// BASE_PATH est fourni par le workflow de déploiement (ex. "/yomu/") ; "/" en local.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [
    preact(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Yomu — lecture japonaise',
        short_name: 'Yomu',
        description: 'Textes japonais annotés et leçons de grammaire JLPT',
        lang: 'fr',
        theme_color: '#b23a48',
        background_color: '#faf7f2',
        display: 'standalone',
        start_url: base,
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,json}'] },
    }),
  ],
});
