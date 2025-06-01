import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env variables based on the current mode (development, production, etc)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: env.VITE_APP_NAME || 'My Awesome App',
          short_name: env.VITE_APP_NAME || 'AwesomeApp',
          description:
            env.VITE_APP_DESCRIPTION || 'My Awesome App using Vite and PWA',
          theme_color: '#2e2d30',
          background_color: '#2e2d30',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
          additionalManifestEntries: [
            { url: '/images/app-logo.jpg', revision: null },
            { url: '/images/company-logo-long.png', revision: null },
          ],
        },
        devOptions: {
          enabled: mode !== 'production',
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
