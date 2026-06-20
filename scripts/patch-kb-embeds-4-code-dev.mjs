/**
 * Insert ExternalPlayEmbed blocks into 4-code-dev articles.
 * Usage: node scripts/patch-kb-embeds-4-code-dev.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const KB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'it-knowledge-base');
const ROOT = path.join(KB, 'docs', 'encyclopedia', '4-code-dev');

const IMPORT = "import ExternalPlayEmbed from '@site/src/components/ExternalPlayEmbed';";

function ensureImport(content) {
  if (content.includes('ExternalPlayEmbed')) return content;
  const idx = content.indexOf('\n# ');
  if (idx === -1) return content;
  return `${content.slice(0, idx)}\n\n${IMPORT}\n${content.slice(idx)}`;
}

function insertAfter(content, marker, block) {
  if (content.includes(block.trim().split('\n')[0])) return content;
  const i = content.indexOf(marker);
  if (i === -1) {
    console.warn('Marker not found:', marker.slice(0, 40));
    return content;
  }
  const at = i + marker.length;
  return `${content.slice(0, at)}\n\n${block}\n${content.slice(at)}`;
}

function insertBefore(content, marker, block) {
  if (content.includes(block.trim().split('\n')[0])) return content;
  const i = content.indexOf(marker);
  if (i === -1) {
    console.warn('Marker not found:', marker.slice(0, 40));
    return content;
  }
  return `${content.slice(0, i)}\n${block}\n\n${content.slice(i)}`;
}

function embed(example, title, h = 480) {
  return `<ExternalPlayEmbed example="${example}" title="${title}" minHeight={${h}} />`;
}

const patches = [
  {
    file: '4-17-veb-razrabotka/intro.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertAfter(
        c,
        '<DocCardList />',
        embed('about/web-app-architecture-play', 'Архитектура веб-приложения', 520),
      );
    },
  },
  {
    file: '4-17-veb-razrabotka/1.md',
    fn: (c) => {
      c = ensureImport(c);
      c = insertAfter(
        c,
        '## HTTP — протокол запроса и ответа',
        `${embed('about/http-request-analyzer', 'Разбор HTTP-запроса', 560)}\n\n${embed('system-network/request-response-model', 'Модель запрос–ответ', 480)}`,
      );
      c = insertAfter(
        c,
        '## CRUD и REST',
        embed('code-dev/http-crud-play', 'REST CRUD — мини API', 520),
      );
      c = insertAfter(c, '## CORS', embed('code-dev/cors-gate-play', 'CORS — браузерный контроль', 520));
      return c;
    },
  },
  {
    file: '4-17-veb-razrabotka/4.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertAfter(
        c,
        'Материал опирается на разделы',
        embed('data-markup/beginner-web-stack-hub', 'Веб-стек для начинающего', 560),
      );
    },
  },
  {
    file: '4-17-veb-razrabotka/5.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertAfter(
        c,
        'Подробнее про путь от файла до экрана',
        embed('system-network/web-page-layers-play', 'Три слоя страницы', 560),
      );
    },
  },
  {
    file: '4-17-veb-razrabotka/6.md',
    fn: (c) => {
      c = ensureImport(c);
      c = insertAfter(
        c,
        '## Восемь этапов',
        `${embed('code-dev/web-project-pipeline-play', '8 этапов веб-проекта', 480)}\n\n${embed('system-network/website-builder-play', 'Конструктор страницы', 560)}`,
      );
      return c;
    },
  },
  {
    file: '4-01-algoritmy/311.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertAfter(
        c,
        '### Справочник классов сложности',
        `${embed('data-markup/complexity-demo', 'Сложность алгоритмов', 420)}\n\n${embed('code-dev/big-o-growth-play', 'Рост классов Big-O', 520)}`,
      );
    },
  },
  {
    file: '4-01-algoritmy/313.md',
    fn: (c) => ensureImport(c).includes('big-o-growth-play')
      ? c
      : insertAfter(
          ensureImport(c),
          '# ',
          embed('code-dev/big-o-growth-play', 'Рост классов Big-O', 520),
        ),
  },
  {
    file: '4-01-algoritmy/4.md',
    fn: (c) => {
      c = ensureImport(c);
      c = insertAfter(
        c,
        '## Как хранить граф в программе',
        `${embed('data-markup/graph-traversal-play', 'Обход графа (BFS)', 520)}\n\n${embed('code-dev/graph-representation-play', 'Представление графа', 520)}\n\n${embed('code-dev/euler-bridges-play', 'Мосты КёнигсBERG', 520)}`,
      );
      return c;
    },
  },
  {
    file: '4-01-algoritmy/41.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Постановка задачи', embed('code-dev/dijkstra-path-play', 'Дейкстра — пошагово', 560)),
  },
  {
    file: '4-01-algoritmy/42.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Модель "блуждающего пользователя"', embed('code-dev/pagerank-simulator-play', 'PageRank — симулятор', 560)),
  },
  {
    file: '4-01-algoritmy/11.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Тренировка алгоритмического мышления', embed('code-dev/algorithm-thinking-play', 'Сборка алгоритма', 520)),
  },
  {
    file: '4-10-orm-i-rabota-s-dannymi/1.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertAfter(
        c,
        '## Задачи',
        `${embed('data-markup/sql-insert-trainer', 'SQL INSERT — тренажёр', 480)}\n\n${embed('about/sql-join-trainer', 'SQL JOIN — тренажёр', 480)}\n\n${embed('code-dev/n-plus-one-query-play', 'N+1 запросов ORM', 520)}`,
      );
    },
  },
  {
    file: '4-10-orm-i-rabota-s-dannymi/114.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertAfter(
        c,
        '## Подходы к ORM',
        `${embed('code-dev/orm-demo', 'ORM — сопоставление', 560)}\n\n${embed('code-dev/orm-migration-play', 'Code First / Database First', 560)}`,
      );
    },
  },
  {
    file: '4-13-osnovy-raboty-s-git/intro.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertBefore(
        c,
        '<DocCardList />',
        `${embed('about/git-emulator', 'Git Emulator', 420)}\n\n${embed('infra-security/git-svn-compare-play', 'Git vs SVN', 480)}`,
      );
    },
  },
  {
    file: '4-13-osnovy-raboty-s-git/1.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Система контроля версий Git', embed('about/git-emulator', 'Git Emulator', 420)),
  },
  {
    file: '4-13-osnovy-raboty-s-git/112.md',
    fn: (c) =>
      insertAfter(c, '<ExternalPlayEmbed example="about/git-emulator"', embed('code-dev/git-three-trees-play', 'Три дерева Git', 520)),
  },
  {
    file: '4-13-osnovy-raboty-s-git/115.md',
    fn: (c) => ensureImport(c).includes('git-commands-play')
      ? c
      : insertAfter(ensureImport(c), '# ', embed('infra-security/git-commands-play', 'Команды Git', 520)),
  },
  {
    file: '4-13-osnovy-raboty-s-git/116.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '# ', embed('code-dev/git-ignore-matcher-play', '.gitignore — проверка', 560)),
  },
  {
    file: '4-16-parallelnye-vychisleniya/1.md',
    fn: (c) =>
      c.includes('amdahl-speedup-play')
        ? c
        : insertAfter(c, 'import ExternalPlayEmbed', `\n${embed('code-dev/amdahl-speedup-play', 'Закон Амдала', 520)}`, 1),
  },
  {
    file: '4-16-parallelnye-vychisleniya/2.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Таксономия Флинна (1966)', embed('code-dev/flynn-taxonomy-play', 'Таксономия Флинна', 480)),
  },
  {
    file: '4-16-parallelnye-vychisleniya/3.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Две фундаментальные модели памяти', embed('code-dev/shared-vs-distributed-memory-play', 'Shared vs Distributed', 520)),
  },
  {
    file: '4-12-mobilnye-prilozheniya/intro.md',
    fn: (c) => {
      c = ensureImport(c);
      return insertBefore(
        c,
        '<DocCardList />',
        `${embed('code-dev/mobile-stack-picker-play', 'Выбор мобильного стека', 480)}\n\n${embed('tools-documentation/cross-platform-mobile-play', 'Cross-platform mobile', 520)}`,
      );
    },
  },
  {
    file: '4-12-mobilnye-prilozheniya/1.md',
    fn: (c) =>
      c.includes('mobile-lifecycle-play')
        ? c
        : insertAfter(c, 'ExternalPlayEmbed', `\n\n${embed('code-dev/mobile-lifecycle-play', 'Жизненный цикл Activity', 520)}`),
  },
  {
    file: '4-11-desktopnye-prilozheniya/112.md',
    fn: (c) =>
      c.includes('event-loop-freeze-play')
        ? c
        : insertAfter(c, 'ExternalPlayEmbed', `\n\n${embed('code-dev/event-loop-freeze-play', 'UI-поток и блокировка', 520)}`),
  },
  {
    file: '4-05-asinhronnost/12.md',
    fn: (c) =>
      insertAfter(ensureImport(c), '## Асинхронность и синхронность', embed('code-dev/event-loop-freeze-play', 'Блокировка UI-потока', 520)),
  },
];

for (const {file, fn} of patches) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) {
    console.warn('Missing', file);
    continue;
  }
  const before = fs.readFileSync(full, 'utf8');
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(full, after);
    console.log('Patched', file);
  } else {
    console.log('Skip (unchanged)', file);
  }
}

// Fix parallel 1.md — insert after first heading block
{
  const file = '4-16-parallelnye-vychisleniya/1.md';
  const full = path.join(ROOT, file);
  let c = fs.readFileSync(full, 'utf8');
  if (!c.includes('amdahl-speedup-play')) {
    c = insertAfter(c, '<span class="complexity-badge">Инженеру</span>', `\n\n${embed('code-dev/amdahl-speedup-play', 'Закон Амдала', 520)}`);
    fs.writeFileSync(full, c);
    console.log('Patched', file, '(amdahl fix)');
  }
}

// Fix 313.md — insert after badges
{
  const file = '4-01-algoritmy/313.md';
  const full = path.join(ROOT, file);
  let c = fs.readFileSync(full, 'utf8');
  if (!c.includes('big-o-growth-play')) {
    c = ensureImport(c);
    c = insertAfter(c, '<span class="complexity-badge">Инженеру</span>', `\n\n${embed('code-dev/big-o-growth-play', 'Рост классов Big-O', 520)}`);
    fs.writeFileSync(full, c);
    console.log('Patched', file);
  }
}

// Fix git 112 — add after git-emulator embed line
{
  const file = '4-13-osnovy-raboty-s-git/112.md';
  const full = path.join(ROOT, file);
  let c = fs.readFileSync(full, 'utf8');
  if (!c.includes('git-three-trees-play')) {
    c = c.replace(
      '<ExternalPlayEmbed example="about/git-emulator" title="Git Emulator" minHeight={420} />',
      `<ExternalPlayEmbed example="about/git-emulator" title="Git Emulator" minHeight={420} />\n\n${embed('code-dev/git-three-trees-play', 'Три дерева Git', 520)}`,
    );
    fs.writeFileSync(full, c);
    console.log('Patched', file, '(trees fix)');
  }
}

console.log('Done.');
