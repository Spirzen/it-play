/**
 * Копирует React-демо из docs/context и docs/lab (it-knowledge-base) в it-play.
 * Usage: node scripts/migrate-context-lab-from-kb.mjs [--dry-run]
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
const MANIFEST_PATH = path.join(IT_PLAY_ROOT, 'scripts', 'plays-manifest.json');

const DRY_RUN = process.argv.includes('--dry-run');

/** Остаются в энциклопедии (хабы, DOM-зависимые виджеты). */
const SKIP_COMPONENTS = new Set([
  'LabTrainersHub',
  'RandomQuestionFromArticle',
  'DeveloperExamPlay',
  'ExternalPlayEmbed',
  'ExternalCodeEmbed',
]);

const CONTEXT_EXTRA_FILES = [
  {src: 'context/domains.js', dest: 'ContextDomains.js'},
  {src: 'context/contextPlay.module.css', dest: 'contextPlay.module.css'},
];

function pascalToKebab(name) {
  return name
    .replace(/\.(jsx|js|tsx|ts)$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function resolveComponentFile(baseName, importSubPath) {
  const dirs = [];
  if (importSubPath?.startsWith('context/')) {
    dirs.push(path.join(KB_COMPONENTS, 'context'));
  }
  dirs.push(KB_COMPONENTS);

  for (const dir of dirs) {
    for (const ext of ['.jsx', '.js', '.tsx', '.ts']) {
      const p = path.join(dir, baseName + ext);
      if (fs.existsSync(p)) return p;
    }
  }
  return null;
}

function parseDocImports(docPath) {
  const text = fs.readFileSync(docPath, 'utf8');
  const imports = [];
  const re = /import\s+(\w+)\s+from\s+'@site\/src\/components\/([^']+)'/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const subPath = m[2].replace(/\.(jsx|js)$/, '');
    const baseName = subPath.split('/').pop();
    imports.push({localName: m[1], baseName, subPath, docPath});
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

  if (rel.startsWith('context/')) {
    return {
      playSlug: `context/${slug}`,
      category: 'context',
      categoryTitle: 'Контекст',
      component: slug,
      encyclopediaUrl: docUrl,
    };
  }

  if (rel.startsWith('lab/')) {
    return {
      playSlug: `lab/${slug}`,
      category: 'lab',
      categoryTitle: 'Лаборатория',
      component: slug,
      encyclopediaUrl: docUrl,
    };
  }

  return null;
}

function humanTitle(baseName) {
  const map = {
    ContextDomainPlay: 'Отраслевое демо',
    ContextDomainsHub: 'Карта отраслей',
    JsDomBridgePlay: 'JavaScript DOM',
    CssTransitionPlay: 'CSS-анимации',
    FlexGridPlay: 'Flex и Grid',
    YamlPlayDemo: 'YAML-манифесты',
    PromptPipelineDemo: 'Пайплайн промптов',
    FirstProgramPlay: 'Первая программа',
    TurtleGraphicsSimulator: 'Turtle Graphics',
    SqlTrainer: 'SQL-тренажёр',
    DockerfileBuilder: 'Dockerfile Builder',
    RegexPlaygroundDemo: 'Regex Playground',
    ExcelSimulator: 'Excel Simulator',
    TinkercadCircuitsPlay: 'Tinkercad Circuits',
    ScratchPythonTable: 'Scratch → Python',
    RoleDevelopmentPlanPlay: 'План развития',
    InterestNavigatorGameV2Play: 'Навигатор интересов',
  };
  if (map[baseName]) return map[baseName];
  return baseName
    .replace(/Play$/, '')
    .replace(/Demo$/, '')
    .replace(/Simulator$/, '')
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

function transformSource(source) {
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
    /import\s+DemoShell(?:,\s*\{DemoCard\})?\s+from\s+'\.\.\/shared\/DemoShell';\n?/g,
    "import DemoShell, {DemoCard} from '@/components/shared/DemoShell';\n",
  );
  out = out.replace(/import\s+\{[^}]*\}\s+from\s+'\.\.\/shared\/demoFallback';\n?/g, '');
  out = out.replace(/import\s+\{[^}]*\}\s+from\s+'\.\/shared\/demoFallback';\n?/g, '');
  out = out.replace(/from '\.\.\/shared\//g, "from '@/components/shared/kb/");
  out = out.replace(/from "\.\.\/shared\//g, 'from "@/components/shared/kb/');
  out = out.replace(/from '\.\/shared\//g, "from '@/components/shared/kb/");
  out = out.replace(/from "\.\/shared\//g, 'from "@/components/shared/kb/');

  out = out.replace(/from '\.\/domains'/g, "from './ContextDomains'");
  out = out.replace(/from "\.\/domains"/g, 'from "./ContextDomains"');

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

  return out;
}

function writeFile(filePath, content) {
  if (DRY_RUN) {
    console.log(`[dry-run] write ${path.relative(IT_PLAY_ROOT, filePath)}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), {recursive: true});
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyAndTransform(srcPath, destPath) {
  const source = fs.readFileSync(srcPath, 'utf8');
  const transformed = transformSource(source);
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
      if (imp.startsWith('./shared/') || imp.startsWith('../shared/')) {
        const rel = imp.replace(/^\.\.?\//, '').replace(/^shared[/\\]/, '');
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
      } else if ((imp.startsWith('./') || imp.startsWith('../')) && /[A-Z]/.test(imp)) {
        const rel = imp.replace(/^\.\.?\//, '');
        const baseName = rel.replace(/\.(jsx|js|tsx|ts|css|module\.css)$/, '').split('/').pop();
        const compFile = resolveComponentFile(baseName);
        if (compFile && !demoFiles.has(compFile)) {
          demoFiles.add(compFile);
          queue.push(compFile);
          const cssMod = compFile.replace(/\.(jsx|js|tsx|ts)$/, '.module.css');
          if (fs.existsSync(cssMod)) queue.push(cssMod);
        }
      }
    }
  }

  return {sharedFiles: [...sharedFiles], demoFiles: [...demoFiles]};
}

function loadExistingManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) return {};
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

function main() {
  const docDirs = [path.join(KB_DOCS, 'context'), path.join(KB_DOCS, 'lab')];
  const allImports = [];
  for (const dir of docDirs) {
    if (!fs.existsSync(dir)) continue;
    for (const doc of collectDocFiles(dir)) {
      allImports.push(...parseDocImports(doc));
    }
  }

  const componentMap = new Map();
  const importSubPaths = new Map();
  for (const imp of allImports) {
    if (SKIP_COMPONENTS.has(imp.baseName)) continue;
    const meta = inferPlayMeta(imp.baseName, imp.docPath);
    if (!meta) continue;
    if (!componentMap.has(imp.baseName)) {
      componentMap.set(imp.baseName, meta);
    }
    if (imp.subPath.startsWith('context/')) {
      importSubPaths.set(imp.baseName, imp.subPath);
    }
  }

  console.log(`Context/Lab components to migrate: ${componentMap.size}`);
  for (const name of componentMap.keys()) console.log(`  - ${name}`);

  const entryFiles = [];
  for (const baseName of componentMap.keys()) {
    const src = resolveComponentFile(baseName, importSubPaths.get(baseName));
    if (!src) {
      console.warn(`Missing component file: ${baseName}`);
      continue;
    }
    entryFiles.push(src);
    const cssMod = src.replace(/\.(jsx|js|tsx|ts)$/, '.module.css');
    if (fs.existsSync(cssMod)) entryFiles.push(cssMod);
  }

  for (const {src, dest} of CONTEXT_EXTRA_FILES) {
    const srcPath = path.join(KB_COMPONENTS, src);
    if (fs.existsSync(srcPath)) {
      entryFiles.push(srcPath);
    }
  }

  const {sharedFiles, demoFiles} = collectSharedDeps(entryFiles);
  const allDemoFiles = new Set([...entryFiles, ...demoFiles]);

  for (const src of sharedFiles) {
    const base = path.basename(src);
    if (base === 'DemoShell.jsx' || base === 'DemoShell.tsx') continue;
    const dest = path.join(KB_SHARED_DIR, path.relative(path.join(KB_COMPONENTS, 'shared'), src));
    if (DRY_RUN) {
      console.log(`[dry-run] copy shared ${base}`);
    } else {
      fs.mkdirSync(path.dirname(dest), {recursive: true});
      fs.copyFileSync(src, dest);
    }
  }

  for (const src of allDemoFiles) {
    if (!/\.(jsx|js|tsx|ts|css)$/.test(src)) continue;
    const rel = path.relative(KB_COMPONENTS, src).replace(/\\/g, '/');
    let destName = path.basename(src);
    if (rel === 'context/domains.js') destName = 'ContextDomains.js';
    const dest = path.join(DEMOS_DIR, destName);
    if (/\.(jsx|js|tsx|ts)$/.test(src) && !src.endsWith('domains.js')) {
      copyAndTransform(src, dest);
    } else if (!DRY_RUN) {
      fs.mkdirSync(path.dirname(dest), {recursive: true});
      fs.copyFileSync(src, dest);
    } else {
      console.log(`[dry-run] copy ${destName}`);
    }
  }

  const existingManifest = loadExistingManifest();
  const manifest = {...existingManifest};
  let order =
    Math.max(
      0,
      ...Object.values(existingManifest).map((e) => e.order ?? 0),
    ) + 1;

  for (const [baseName, meta] of componentMap) {
    if (!resolveComponentFile(baseName, importSubPaths.get(baseName))) continue;

    const metaDir = path.join(PLAYS_ROOT, ...meta.playSlug.split('/'));
    const metaJson = {
      title: humanTitle(baseName),
      description: `Интерактивное демо «${humanTitle(baseName)}» — раздел ${meta.categoryTitle}.`,
      category: meta.category,
      categoryTitle: meta.categoryTitle,
      component: meta.component,
      tags: [meta.category],
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

  writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`Done. Manifest entries: ${Object.keys(manifest).length} (${componentMap.size} new/updated context+lab)`);
}

main();
