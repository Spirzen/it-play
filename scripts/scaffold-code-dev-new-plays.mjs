/**
 * Scaffold meta.json + plays-manifest entries for new code-dev plays.
 * Usage: node scripts/scaffold-code-dev-new-plays.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PLAYS = path.join(ROOT, 'plays', 'code-dev');
const MANIFEST = path.join(ROOT, 'scripts', 'plays-manifest.json');

const NEW = [
  {slug: 'dijkstra-path-play', title: 'Алгоритм Дейкстры — пошагово', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-01-algoritmy/41', order: 60},
  {slug: 'pagerank-simulator-play', title: 'PageRank — симулятор', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-01-algoritmy/42', order: 61},
  {slug: 'big-o-growth-play', title: 'Рост классов Big-O', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-01-algoritmy/311', order: 62},
  {slug: 'euler-bridges-play', title: 'Мосты КёнигсBERG', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-01-algoritmy/4', order: 63},
  {slug: 'algorithm-thinking-play', title: 'Алгоритмическое мышление', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-01-algoritmy/11', order: 64},
  {slug: 'http-crud-play', title: 'REST CRUD — мини API', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-17-veb-razrabotka/1', order: 65},
  {slug: 'cors-gate-play', title: 'CORS — браузерный контроль', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-17-veb-razrabotka/1', order: 66},
  {slug: 'web-project-pipeline-play', title: '8 этапов веб-проекта', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-17-veb-razrabotka/6', order: 67},
  {slug: 'n-plus-one-query-play', title: 'N+1 запросов ORM', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-10-orm-i-rabota-s-dannymi/1', order: 68},
  {slug: 'orm-migration-play', title: 'ORM Code First / Database First', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-10-orm-i-rabota-s-dannymi/114', order: 69},
  {slug: 'flynn-taxonomy-play', title: 'Таксономия Флинна', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-16-parallelnye-vychisleniya/2', order: 70},
  {slug: 'amdahl-speedup-play', title: 'Закон Амдала', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-16-parallelnye-vychisleniya/1', order: 71},
  {slug: 'shared-vs-distributed-memory-play', title: 'Shared vs Distributed memory', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-16-parallelnye-vychisleniya/3', order: 72},
  {slug: 'mobile-lifecycle-play', title: 'Жизненный цикл Activity', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-12-mobilnye-prilozheniya/1', order: 73},
  {slug: 'mobile-stack-picker-play', title: 'Выбор мобильного стека', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-12-mobilnye-prilozheniya/intro', order: 74},
  {slug: 'git-three-trees-play', title: 'Три дерева Git', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-13-osnovy-raboty-s-git/112', order: 75},
  {slug: 'git-ignore-matcher-play', title: '.gitignore — проверка пути', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-13-osnovy-raboty-s-git/116', order: 76},
  {slug: 'event-loop-freeze-play', title: 'UI-поток и блокировка', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-11-desktopnye-prilozheniya/112', order: 77},
];

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

for (const p of NEW) {
  const dir = path.join(PLAYS, p.slug);
  fs.mkdirSync(dir, {recursive: true});
  const meta = {
    title: p.title,
    description: `Интерактивное демо «${p.title}» — раздел Энциклопедия · Код и разработка.`,
    category: 'code-dev',
    categoryTitle: 'Энциклопедия · Код и разработка',
    component: p.slug,
    tags: ['code-dev', 'encyclopedia'],
    encyclopediaUrl: p.url,
    order: p.order,
  };
  fs.writeFileSync(path.join(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);

  const pascal = p.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  manifest[pascal] = {
    example: `code-dev/${p.slug}`,
    title: p.title,
    component: p.slug,
  };
}

fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Scaffolded ${NEW.length} plays in plays/code-dev/`);
