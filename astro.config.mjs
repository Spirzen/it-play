import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import patchAstroRedirects from './src/integrations/patch-astro-redirects.mjs';
import ituSitemap from './src/integrations/sitemap.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Прод play.spirzen.ru: IT_PLAY_SITE=https://play.spirzen.ru, BASE=/
 * Локально: http://localhost:4322
 */
const site = process.env.IT_PLAY_SITE ?? 'http://localhost:4322';
const base = process.env.IT_PLAY_BASE ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [react(), ituSitemap({ excludeRoot: false }), patchAstroRedirects()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  },
});
