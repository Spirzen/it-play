/**
 * Копирует React-демо из docs/encyclopedia/2-system-network (it-knowledge-base) в it-play.
 * Usage: node scripts/migrate-system-network-from-kb.mjs [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IT_PLAY_ROOT = path.join(__dirname, '..');
const KB_ROOT = path.join(IT_PLAY_ROOT, '..', 'it-knowledge-base');
const KB_COMPONENTS = path.join(KB_ROOT, 'src', 'components');
const KB_DOCS = path.join(KB_ROOT, 'docs', 'encyclopedia', '2-system-network');
const PLAYS_ROOT = path.join(IT_PLAY_ROOT, 'plays');
const DEMOS_DIR = path.join(IT_PLAY_ROOT, 'src', 'components', 'demos');
const KB_SHARED_DIR = path.join(IT_PLAY_ROOT, 'src', 'components', 'shared', 'kb');
const MANIFEST_PATH = path.join(IT_PLAY_ROOT, 'scripts', 'plays-manifest.json');

const DRY_RUN = process.argv.includes('--dry-run');

const SKIP_COMPONENTS = new Set([
  'RandomChecklistItem',
  'ExternalPlayEmbed',
  'ExternalCodeEmbed',
]);

const NAMED_EXPORT_SOURCES = {};

const TITLE_MAP = {
  OsPlatformsHub: 'Операционные системы — хаб',
  OsStackPlay: 'Стек операционной системы',
  OsClassificationPlay: 'Классификация ОС',
  OsInstallFlowPlay: 'Установка операционной системы',
  KernelArchitecturePlay: 'Архитектура ядра',
  NetworkEmulatorPlay: 'Эмулятор сети',
  CdnCacheEmulatorPlay: 'Эмулятор CDN-кэша',
  CookieSessionPlay: 'Cookie и сессии',
  WirelessNetworkPlay: 'Беспроводные сети',
  ProxyServerPlay: 'Прокси-сервер',
  UrlUriRnConverter: 'Конвертер URL / URI / URN',
  WebPageLayersPlay: 'Слои веб-страницы',
  WebsiteBuilderPlay: 'Конструктор сайта',
  PushNotificationPlay: 'Push-уведомления',
  VonNeumannArchitecturePlay: 'Архитектура фон Неймана',
  PcAssemblyPlay: 'Сборка ПК',
  PcFirstBootDiagnosticPlay: 'Диагностика первого запуска ПК',
  EmbeddedSystemPlay: 'Встраиваемые системы',
  CloudServiceStackPlay: 'Стек облачных сервисов',
  BusinessPlatformsPlay: 'Бизнес-платформы',
  SocialNetworkArchPlay: 'Архитектура соцсети',
  HomeNetworkPlay: 'Домашняя сеть',
  PortForwardingPlay: 'Проброс портов',
  ItInfrastructurePlay: 'ИТ-инфраструктура',
  BackupDemo: 'Резервное копирование',
  TechSupportOverviewPlay: 'Техподдержка — обзор',
  TechSupportTicketFlowPlay: 'Жизненный цикл тикета',
  TechSupportLevelsPlay: 'Уровни поддержки',
  TechSupportKnowledgeBasePlay: 'База знаний поддержки',
  TechSupportItsmPlay: 'ITSM в поддержке',
  TechSupportMetricsPlay: 'Метрики поддержки',
  TechSupportItamPlay: 'ITAM в поддержке',
  IntegrationBasicsPlay: 'Основы интеграции',
  IntegrationDataFlowPlay: 'Потоки данных интеграции',
  IntegrationSolutionsPlay: 'Решения интеграции',
  WebServicePlay: 'Веб-сервисы',
  RequestResponseModel: 'Модель запрос–ответ',
  SessionInteraction: 'Сессионное взаимодействие',
  AsynchronousInteraction: 'Асинхронное взаимодействие',
  ReactiveInteraction: 'Реактивное взаимодействие',
  MessageBrokerOverviewPlay: 'Обзор брокеров сообщений',
  KafkaSimulation: 'Симуляция Kafka',
  SOAPTrainer: 'Тренажёр SOAP',
  SwaggerApiExplorer: 'Swagger API Explorer',
  AuthenticationFlow: 'Поток аутентификации',
  WebAttackSimulatorPlay: 'Симулятор веб-атак',
  MalwareRemediationPlay: 'Устранение вредоносного ПО',
  DataStructureQueue: 'Очередь (структура данных)',
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
  const defaultRe = /import\s+(\w+)\s+from\s+'@site\/src\/components\/([^']+)'/g;
  let m;
  while ((m = defaultRe.exec(text)) !== null) {
    const subPath = m[2].replace(/\.(jsx|js)$/, '');
    const fileBase = subPath.split('/').pop();
    imports.push({manifestKey: m[1], fileBase, docPath});
  }
  const namedRe = /import\s+\{(\w+)\}\s+from\s+'@site\/src\/components\/([^']+)'/g;
  while ((m = namedRe.exec(text)) !== null) {
    const subPath = m[2].replace(/\.(jsx|js)$/, '');
    const fileBase = subPath.split('/').pop();
    imports.push({manifestKey: m[1], fileBase, docPath, named: true});
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

function inferPlayMeta(manifestKey, docPath) {
  const rel = path.relative(path.join(KB_ROOT, 'docs'), docPath).replace(/\\/g, '/');
  const slug = pascalToKebab(manifestKey);
  const docUrl = `https://spirzen.ru/${rel.replace(/\.(md|mdx)$/, '')}`;

  return {
    playSlug: `system-network/${slug}`,
    category: 'system-network',
    categoryTitle: 'Энциклопедия · Система и сеть',
    component: slug,
    encyclopediaUrl: docUrl,
  };
}

function humanTitle(manifestKey) {
  if (TITLE_MAP[manifestKey]) return TITLE_MAP[manifestKey];
  return manifestKey
    .replace(/Play$/, '')
    .replace(/Demo$/, '')
    .replace(/Simulator$/, '')
    .replace(/Hub$/, ' Hub')
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
  out = out.replace(/import ExternalPlayEmbed from '\.\/ExternalPlayEmbed';\n?/g, '');
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
  if (fs.existsSync(destPath) && !DRY_RUN) {
    const existing = fs.readFileSync(destPath, 'utf8');
    const incoming = transformSource(fs.readFileSync(srcPath, 'utf8'));
    if (existing === incoming) return false;
  }
  const source = fs.readFileSync(srcPath, 'utf8');
  const transformed = transformSource(source);
  writeFile(destPath, transformed);
  return true;
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
      } else if (imp.startsWith('./') || imp.startsWith('../')) {
        const rel = imp.replace(/^\.\.?\//, '');
        const baseName = rel.replace(/\.(jsx|js|tsx|ts|css|module\.css)$/, '').split('/').pop();
        if (!baseName || baseName.endsWith('.module') || baseName.endsWith('.css')) continue;
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

function resolveFileBase(manifestKey, fileBase) {
  if (NAMED_EXPORT_SOURCES[manifestKey]) {
    return NAMED_EXPORT_SOURCES[manifestKey].fileBase;
  }
  return fileBase;
}

function createNamedExportWrapper(manifestKey) {
  const spec = NAMED_EXPORT_SOURCES[manifestKey];
  if (!spec) return null;
  const sourceFile = spec.fileBase;
  return `import {${spec.innerExport}} from '@/components/demos/${sourceFile}';\n\nexport default ${spec.innerExport};\n`;
}

function main() {
  if (!fs.existsSync(KB_DOCS)) {
    console.error(`Missing docs dir: ${KB_DOCS}`);
    process.exit(1);
  }

  const allImports = [];
  for (const doc of collectDocFiles(KB_DOCS)) {
    allImports.push(...parseDocImports(doc));
  }

  const componentMap = new Map();
  for (const imp of allImports) {
    if (SKIP_COMPONENTS.has(imp.manifestKey)) continue;
    const fileBase = resolveFileBase(imp.manifestKey, imp.fileBase);
    if (!componentMap.has(imp.manifestKey)) {
      componentMap.set(imp.manifestKey, {
        fileBase,
        meta: inferPlayMeta(imp.manifestKey, imp.docPath),
        named: Boolean(imp.named || NAMED_EXPORT_SOURCES[imp.manifestKey]),
      });
    }
  }

  console.log(`System-network components to migrate: ${componentMap.size}`);
  for (const name of componentMap.keys()) console.log(`  - ${name}`);

  const entryFiles = [];
  const fileBasesNeeded = new Set();
  for (const [, spec] of componentMap) {
    fileBasesNeeded.add(spec.fileBase);
  }

  for (const fileBase of fileBasesNeeded) {
    const src = resolveComponentFile(fileBase);
    if (!src) {
      console.warn(`Missing component file: ${fileBase}`);
      continue;
    }
    entryFiles.push(src);
    const cssMod = src.replace(/\.(jsx|js|tsx|ts)$/, '.module.css');
    if (fs.existsSync(cssMod)) entryFiles.push(cssMod);
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

  let copied = 0;
  let skipped = 0;
  for (const src of allDemoFiles) {
    if (!/\.(jsx|js|tsx|ts|css)$/.test(src)) continue;
    const dest = path.join(DEMOS_DIR, path.basename(src));
    if (/\.(jsx|js|tsx|ts)$/.test(src)) {
      const didWrite = copyAndTransform(src, dest);
      if (didWrite === false) skipped += 1;
      else copied += 1;
    } else if (!DRY_RUN) {
      fs.mkdirSync(path.dirname(dest), {recursive: true});
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        copied += 1;
      } else {
        skipped += 1;
      }
    }
  }

  for (const manifestKey of componentMap.keys()) {
    const wrapper = createNamedExportWrapper(manifestKey);
    if (!wrapper) continue;
    const dest = path.join(DEMOS_DIR, `${manifestKey}.jsx`);
    writeFile(dest, wrapper);
    copied += 1;
  }

  const existingManifest = loadExistingManifest();
  const manifest = {...existingManifest};
  let order =
    Math.max(0, ...Object.values(existingManifest).map((e) => e.order ?? 0)) + 1;

  for (const [manifestKey, spec] of componentMap) {
    if (!resolveComponentFile(spec.fileBase) && !NAMED_EXPORT_SOURCES[manifestKey]) continue;

    const meta = spec.meta;
    const metaDir = path.join(PLAYS_ROOT, ...meta.playSlug.split('/'));
    const metaJson = {
      title: humanTitle(manifestKey),
      description: `Интерактивное демо «${humanTitle(manifestKey)}» — раздел ${meta.categoryTitle}.`,
      category: meta.category,
      categoryTitle: meta.categoryTitle,
      component: meta.component,
      tags: ['system-network', 'encyclopedia'],
      encyclopediaUrl: meta.encyclopediaUrl,
      order: order++,
    };

    writeFile(path.join(metaDir, 'meta.json'), JSON.stringify(metaJson, null, 2) + '\n');
    manifest[manifestKey] = {
      example: meta.playSlug,
      title: metaJson.title,
      component: meta.component,
    };
  }

  writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`Done. Copied/updated ${copied}, skipped ${skipped} unchanged.`);
  console.log(`Manifest entries: ${Object.keys(manifest).length} (+${componentMap.size} system-network)`);
}

main();
