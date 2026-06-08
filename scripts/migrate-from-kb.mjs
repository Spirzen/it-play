/**
 * Копирует React-демо из it-knowledge-base в it-play (about + tools).
 * Usage: node scripts/migrate-from-kb.mjs [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IT_PLAY_ROOT = path.join(__dirname, '..');
const KB_ROOT = path.join(IT_PLAY_ROOT, '..', 'it-knowledge-base');
const KB_COMPONENTS = path.join(KB_ROOT, 'src', 'components');
const KB_DOCS = path.join(KB_ROOT, 'docs');
const PLAYS_ROOT = path.join(IT_PLAY_ROOT, 'plays');
const DEMOS_DIR = path.join(IT_PLAY_ROOT, 'src', 'components', 'demos');
const KB_SHARED_DIR = path.join(IT_PLAY_ROOT, 'src', 'components', 'shared', 'kb');

const DRY_RUN = process.argv.includes('--dry-run');

/** Навигация Docusaurus и хабы — остаются в энциклопедии. */
const SKIP_COMPONENTS = new Set([
  'GettingStartedPaths',
  'CollectionHub',
  'LabTrainersHub',
  'RandomGameGenerator',
  'BlockBuilder',
]);

const TOOLS_CATEGORY_TITLES = {
  automation: 'Инструменты · Автоматизация',
  data: 'Инструменты · Данные',
  development: 'Инструменты · Разработка',
  documentation: 'Инструменты · Документация',
  games: 'Инструменты · Игры',
  misc: 'Инструменты · Разное',
  multimedia: 'Инструменты · Мультимedia',
  network: 'Инструменты · Сеть',
  security: 'Инструменты · Безопасность',
  system: 'Инструменты · ОС и система',
  testing: 'Инструменты · Тестирование',
};

function pascalToKebab(name) {
  return name
    .replace(/\.(jsx|js|tsx|ts)$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function resolveComponentFile(baseName) {
  for (const ext of ['.jsx', '.js', '.tsx', '.ts']) {
    const p = path.join(KB_COMPONENTS, baseName + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function parseDocImports(docPath) {
  const text = fs.readFileSync(docPath, 'utf8');
  const imports = [];
  const re = /import\s+(\w+)\s+from\s+'@site\/src\/components\/([^']+)'/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const baseName = m[2].replace(/\.(jsx|js)$/, '').split('/').pop();
    imports.push({localName: m[1], baseName, docPath});
  }
  return imports;
}

function collectDocFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectDocFiles(full));
    else if (/\.(md|mdx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function inferPlayMeta(baseName, docPath) {
  const rel = path.relative(KB_DOCS, docPath).replace(/\\/g, '/');
  const slug = pascalToKebab(baseName);
  const docUrl = `https://spirzen.ru/${rel.replace(/\.(md|mdx)$/, '')}`;

  if (rel.startsWith('about/')) {
    return {
      playSlug: `about/${slug}`,
      category: 'about',
      categoryTitle: 'О проекте',
      component: slug,
      encyclopediaUrl: docUrl,
    };
  }

  const toolsMatch = rel.match(/^tools\/([^/]+)\//);
  if (toolsMatch) {
    const sub = toolsMatch[1];
    const category = `tools-${sub}`;
    return {
      playSlug: `${category}/${slug}`,
      category,
      categoryTitle: TOOLS_CATEGORY_TITLES[sub] ?? `Инструменты · ${sub}`,
      component: slug,
      encyclopediaUrl: docUrl,
    };
  }

  return {
    playSlug: `misc/${slug}`,
    category: 'misc',
    categoryTitle: 'Разное',
    component: slug,
    encyclopediaUrl: docUrl,
  };
}

function humanTitle(baseName) {
  return baseName
    .replace(/Play$/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .trim();
}

function extractImports(source) {
  const imports = [];
  const re = /^\s*import\s+.+?\s+from\s+['"]([^'"]+)['"]/gm;
  let m;
  while ((m = re.exec(source)) !== null) {
    imports.push(m[1]);
  }
  return imports;
}

function transformSource(source, fileName) {
  let out = source;

  out = out.replace(/import BrowserOnly from '@docusaurus\/BrowserOnly';\n?/g, '');
  out = out.replace(/import Link from '@docusaurus\/Link';\n?/g, "import Link from '@/components/shared/KbLink';\n");
  out = out.replace(/import\s+\{[^}]*\}\s+from\s+'@site\/src\/[^']+';\n?/g, '');
  out = out.replace(/import\s+\w+\s+from\s+'@site\/src\/[^']+';\n?/g, '');
  out = out.replace(/import\s+.+?\s+from\s+'@theme\/[^']+';\n?/g, '');

  out = out.replace(
    /import\s+DemoShell(?:,\s*\{DemoCard\})?\s+from\s+'\.\/shared\/DemoShell';\n?/g,
    "import DemoShell, {DemoCard} from '@/components/shared/DemoShell';\n",
  );
  out = out.replace(
    /import\s+\{[^}]*\}\s+from\s+'\.\/shared\/demoFallback';\n?/g,
    '',
  );
  out = out.replace(/from '\.\/shared\//g, "from '@/components/shared/kb/");
  out = out.replace(/from "\.\/shared\//g, 'from "@/components/shared/kb/');

  // ./OtherComponent -> @/components/demos/OtherComponent (same folder after copy)
  out = out.replace(/from '\.\/([A-Z][^']+)'/g, "from '@/components/demos/$1'");
  out = out.replace(/from "\.\/([A-Z][^"]+)"/g, 'from "@/components/demos/$1"');

  out = out.replace(
    /export default function (\w+)\(([^)]*)\)\s*\{\s*return\s*\(\s*<BrowserOnly[^>]*>\s*\{\(\)\s*=>\s*<(\w+Inner)[^>]*([^/]*)\/>\s*\}\s*<\/BrowserOnly>\s*\);\s*\}/gs,
    'export default function $1($2) {\n  return <$3$4/>;\n}',
  );

  out = out.replace(
    /export default function (\w+)\(([^)]*)\)\s*\{\s*return\s*\(\s*<BrowserOnly[^>]*>\s*\{\(\)\s*=>\s*<(\w+)[^>]*([^/]*)\/>\s*\}\s*<\/BrowserOnly>\s*\);\s*\}/gs,
    'export default function $1($2) {\n  return <$3$4/>;\n}',
  );

  // styles from ./Component.module.css stay relative in demos folder
  return out;
}

function writeFile(filePath, content) {
  if (DRY_RUN) {
    console.log(`[dry-run] write ${filePath}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyAndTransform(srcPath, destPath) {
  const source = fs.readFileSync(srcPath, 'utf8');
  const transformed = transformSource(source, path.basename(srcPath));
  writeFile(destPath, transformed);
}

function collectSharedDeps(entryFiles) {
  const queue = [...entryFiles];
  const sharedFiles = new Set();
  const demoFiles = new Set();

  while (queue.length) {
    const filePath = queue.pop();
    if (!fs.existsSync(filePath)) continue;

    const source = fs.readFileSync(filePath, 'utf8');
    for (const imp of extractImports(source)) {
      if (imp.startsWith('./shared/') || imp.startsWith('./shared\\')) {
        const rel = imp.replace(/^\.\/shared[/\\]/, '');
        const base = path.join(KB_COMPONENTS, 'shared', rel);
        const candidates = [
          base,
          base + '.js',
          base + '.jsx',
          base + '.ts',
          base + '.tsx',
          base + '.css',
          base + '.module.css',
        ];
        for (const c of candidates) {
          if (fs.existsSync(c) && !sharedFiles.has(c)) {
            sharedFiles.add(c);
            queue.push(c);
          }
        }
      } else if (imp.startsWith('./') && /^\.\/[A-Z]/.test(imp)) {
        const baseName = imp.slice(2).replace(/\.(jsx|js)$/, '');
        const compFile = resolveComponentFile(baseName);
        if (compFile && !demoFiles.has(compFile)) {
          demoFiles.add(compFile);
          queue.push(compFile);
          const cssMod = compFile.replace(/\.(jsx|js)$/, '.module.css');
          if (fs.existsSync(cssMod)) queue.push(cssMod);
        }
      }
    }
  }

  return {sharedFiles: [...sharedFiles], demoFiles: [...demoFiles]};
}

function main() {
  const docDirs = [path.join(KB_DOCS, 'about'), path.join(KB_DOCS, 'tools')];
  const allImports = [];
  for (const dir of docDirs) {
    for (const doc of collectDocFiles(dir)) {
      allImports.push(...parseDocImports(doc));
    }
  }

  const componentMap = new Map();
  for (const imp of allImports) {
    if (SKIP_COMPONENTS.has(imp.baseName)) continue;
    if (!componentMap.has(imp.baseName)) {
      componentMap.set(imp.baseName, inferPlayMeta(imp.baseName, imp.docPath));
    }
  }

  console.log(`Components to migrate: ${componentMap.size}`);

  const entryFiles = [];
  for (const baseName of componentMap.keys()) {
    const src = resolveComponentFile(baseName);
    if (!src) {
      console.warn(`Missing component file: ${baseName}`);
      continue;
    }
    entryFiles.push(src);
    const cssMod = src.replace(/\.(jsx|js|tsx|ts)$/, '.module.css');
    if (fs.existsSync(cssMod)) entryFiles.push(cssMod);
  }

  const {sharedFiles, demoFiles} = collectSharedDeps(entryFiles);
  const allDemoFiles = new Set([...entryFiles, ...demoFiles]);

  // Copy shared (except DemoShell — use it-play version)
  for (const src of sharedFiles) {
    const base = path.basename(src);
    if (base === 'DemoShell.jsx' || base === 'DemoShell.tsx') continue;
    const dest = path.join(KB_SHARED_DIR, path.relative(path.join(KB_COMPONENTS, 'shared'), src));
    if (!DRY_RUN) fs.mkdirSync(path.dirname(dest), {recursive: true});
    if (DRY_RUN) {
      console.log(`[dry-run] copy shared ${base}`);
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  // Copy DemoShell deps for it-play shared
  for (const extra of ['useDemoFullscreen.js', 'demoFallback.jsx']) {
    const src = path.join(KB_COMPONENTS, 'shared', extra);
    if (fs.existsSync(src)) {
      const dest = path.join(IT_PLAY_ROOT, 'src', 'components', 'shared', extra.replace('.jsx', '.tsx'));
      if (!DRY_RUN && extra === 'useDemoFullscreen.js') {
        fs.copyFileSync(src, path.join(IT_PLAY_ROOT, 'src', 'components', 'shared', 'useDemoFullscreen.js'));
      }
    }
  }

  // Copy demo components
  for (const src of allDemoFiles) {
    if (!/\.(jsx|js|tsx|ts|css)$/.test(src)) continue;
    const base = path.basename(src);
    const dest = path.join(DEMOS_DIR, base);
    if (/\.(jsx|js|tsx|ts)$/.test(src)) {
      copyAndTransform(src, dest);
    } else if (!DRY_RUN) {
      fs.mkdirSync(path.dirname(dest), {recursive: true});
      fs.copyFileSync(src, dest);
    }
  }

  // meta.json for each play
  const manifest = {};
  let order = 1;
  for (const [baseName, meta] of componentMap) {
    if (!resolveComponentFile(baseName)) continue;

    const metaDir = path.join(PLAYS_ROOT, ...meta.playSlug.split('/'));
    const metaJson = {
      title: humanTitle(baseName),
      description: `Интерактивное демо «${humanTitle(baseName)}» — раздел ${meta.categoryTitle}.`,
      category: meta.category,
      categoryTitle: meta.categoryTitle,
      component: meta.component,
      tags: [meta.category.replace(/^tools-/, 'tools')],
      encyclopediaUrl: meta.encyclopediaUrl,
      order: order++,
    };

    writeFile(path.join(metaDir, 'meta.json'), JSON.stringify(metaJson, null, 2) + '\n');
    manifest[baseName] = {
      example: meta.playSlug,
      title: metaJson.title,
      component: meta.component,
    };
  }

  writeFile(
    path.join(IT_PLAY_ROOT, 'scripts', 'plays-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  console.log(`Done. Manifest: scripts/plays-manifest.json (${Object.keys(manifest).length} plays)`);
}

main();
