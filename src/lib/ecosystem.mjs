import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function findRepoRoot(startDir = __dirname) {
  let dir = startDir;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, 'ecosystem-urls.json'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error('ecosystem-urls.json not found in repo root');
}

let cached = null;

export function loadEcosystemConfig(options = {}) {
  if (cached && !options.repoRoot && options.dev === undefined) {
    return cached;
  }

  const root = options.repoRoot ?? process.env.IT_REPO_ROOT ?? findRepoRoot();
  const raw = JSON.parse(fs.readFileSync(path.join(root, 'ecosystem-urls.json'), 'utf8'));
  const useDev = options.dev ?? process.env.IT_PORTAL_DEV === '1';
  const domains = {...raw.domains};

  if (useDev && raw.localDev) {
    for (const [key, url] of Object.entries(raw.localDev)) {
      if (url) {
        domains[key] = url.replace(/\/$/, '');
      }
    }
  }

  const config = {...raw, domains, repoRoot: root};
  if (!options.repoRoot) {
    cached = config;
  }
  return config;
}

export function resolvePortalBase(config, portalId) {
  const base = config.domains[portalId];
  if (!base) {
    throw new Error(`Unknown portal id: ${portalId}`);
  }
  return base.replace(/\/$/, '');
}

export function resolveNavHref(config, item) {
  const domain = config.domains[item.hrefKey]?.replace(/\/$/, '') ?? '#';
  if (!item.routeKey) {
    return domain;
  }
  return `${domain}${config.routes[item.routeKey] ?? ''}${item.suffix ?? ''}`;
}

export function buildNavItems(config, portalId, activeId = portalId) {
  return (config.nav?.ecosystem ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    href: resolveNavHref(config, item),
    active: item.id === activeId,
  }));
}

export {buildFooterSections, buildDocusaurusFooter, resolveFooterItemHref} from './ecosystem-footer.mjs';
