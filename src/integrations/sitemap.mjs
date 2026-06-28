import sitemap from '@astrojs/sitemap';

/**
 * Sitemap для порталов IT Universe.
 * @param {{ excludeRoot?: boolean }} [options]
 * excludeRoot: true — не включать `/` (redirect-stub на intro)
 */
export default function ituSitemap(options = {}) {
  const excludeRoot = options.excludeRoot ?? true;

  return sitemap({
    filter: (page) => {
      if (!excludeRoot) {
        return true;
      }
      try {
        const pathname = new URL(page).pathname.replace(/\/$/, '') || '/';
        return pathname !== '/';
      } catch {
        return true;
      }
    },
  });
}
