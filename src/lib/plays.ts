import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PLAYS_ROOT = path.join(__dirname, '..', '..', 'plays');

export type PlayMeta = {
  title?: string;
  description?: string;
  category?: string;
  categoryTitle?: string;
  component?: string;
  tags?: string[];
  encyclopediaUrl?: string;
  order?: number;
};

export type PlayEntry = {
  slug: string;
  category: string;
  categoryTitle: string;
  component: string;
  title: string;
  description: string;
  tags: string[];
  encyclopediaUrl?: string;
  order: number;
  dir: string;
};

export type SearchIndexEntry = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  categoryTitle: string;
};

export type CategoryGroup = {
  id: string;
  title: string;
  plays: PlayEntry[];
};

function readMeta(dir: string): PlayMeta {
  const metaPath = path.join(dir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')) as PlayMeta;
  } catch {
    return {};
  }
}

function humanizeSlug(part: string): string {
  return part
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function walkPlays(root: string, prefix = ''): PlayEntry[] {
  const entries: PlayEntry[] = [];
  if (!fs.existsSync(root)) {
    return entries;
  }

  for (const name of fs.readdirSync(root, {withFileTypes: true})) {
    if (!name.isDirectory()) continue;
    const dir = path.join(root, name.name);
    const metaPath = path.join(dir, 'meta.json');
    const slugPart = prefix ? `${prefix}/${name.name}` : name.name;

    if (fs.existsSync(metaPath)) {
      const meta = readMeta(dir);
      const category = meta.category ?? (prefix || name.name);
      const categoryTitle = meta.categoryTitle ?? humanizeSlug(category);
      entries.push({
        slug: slugPart,
        category,
        categoryTitle,
        component: meta.component ?? name.name,
        title: meta.title ?? humanizeSlug(name.name),
        description: meta.description ?? '',
        tags: meta.tags ?? [],
        encyclopediaUrl: meta.encyclopediaUrl,
        order: meta.order ?? 0,
        dir,
      });
    } else {
      entries.push(...walkPlays(dir, slugPart));
    }
  }

  return entries;
}

export function loadAllPlays(): PlayEntry[] {
  return walkPlays(PLAYS_ROOT).sort((a, b) => {
    const cat = a.categoryTitle.localeCompare(b.categoryTitle, 'ru');
    if (cat !== 0) return cat;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title, 'ru');
  });
}

export function loadPlayBySlug(slug: string): PlayEntry | undefined {
  return loadAllPlays().find((p) => p.slug === slug.replace(/^\/+|\/+$/g, ''));
}

export function groupByCategory(plays: PlayEntry[]): Map<string, PlayEntry[]> {
  const map = new Map<string, PlayEntry[]>();
  for (const play of plays) {
    const list = map.get(play.category) ?? [];
    list.push(play);
    map.set(play.category, list);
  }
  return map;
}

export function buildSearchIndex(plays: PlayEntry[]): SearchIndexEntry[] {
  return plays.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    category: p.category,
    categoryTitle: p.categoryTitle,
  }));
}

export function getCategoryTitles(plays: PlayEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const play of plays) {
    if (!map.has(play.category)) {
      map.set(play.category, play.categoryTitle);
    }
  }
  return map;
}
