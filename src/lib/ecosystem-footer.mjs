/**
 * @param {ReturnType<typeof import('./ecosystem.mjs').loadEcosystemConfig>} config
 * @param {{ hrefKey: string, routeKey?: string, suffix?: string, path?: string, href?: string }} item
 */
export function resolveFooterItemHref(config, item) {
  if (item.href) {
    return item.href;
  }
  const domain = config.domains[item.hrefKey]?.replace(/\/$/, '') ?? '#';
  if (item.routeKey) {
    return `${domain}${config.routes[item.routeKey] ?? ''}${item.suffix ?? ''}`;
  }
  return `${domain}${item.path ?? ''}`;
}

/**
 * @param {ReturnType<typeof import('./ecosystem.mjs').loadEcosystemConfig>} config
 * @param {{ onSpirzen?: boolean }} [options]
 */
export function buildFooterSections(config, options = {}) {
  const onSpirzen = options.onSpirzen === true;
  const year = new Date().getFullYear();
  const copyright = (config.footer?.copyright ?? '').replace('{year}', String(year));

  const columns = (config.footer?.columns ?? []).map((column) => ({
    title: column.title,
    items: column.items.map((item) => {
      const href = resolveFooterItemHref(config, item);
      if (onSpirzen && item.hrefKey === 'spirzen' && item.path && !item.href) {
        return {label: item.label, to: item.path};
      }
      return {label: item.label, href};
    }),
  }));

  return {copyright, columns};
}

/**
 * @param {ReturnType<typeof import('./ecosystem.mjs').loadEcosystemConfig>} config
 */
export function buildDocusaurusFooter(config) {
  const {copyright, columns} = buildFooterSections(config, {onSpirzen: true});
  return {
    style: 'dark',
    links: columns.map((column) => ({
      title: column.title,
      items: column.items.map((item) =>
        item.to ? {label: item.label, to: item.to} : {label: item.label, href: item.href},
      ),
    })),
    copyright,
  };
}
