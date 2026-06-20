/**
 * Добавляет ExternalPlayEmbed в статьи 1-basics (идемпотентно).
 * Usage: node scripts/add-basics-embeds.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_DOCS = path.join(__dirname, '..', '..', 'it-knowledge-base', 'docs', 'encyclopedia', '1-basics');

/** @type {Array<{file: string, embeds: Array<{example: string, title: string, minHeight?: number}>}>} */
const PLAN = [
  // --- готовые демо ---
  {file: '1-01-davayte-poznakomimsya/intro.md', embeds: [{example: 'about/interactive-roadmap', title: 'Interactive Roadmap', minHeight: 520}]},
  {file: '1-01-davayte-poznakomimsya/1.md', embeds: [{example: 'about/author-profile-play', title: 'Author Profile'}]},
  {file: '1-04-kak-vidyat-it-obychnye-lyudi/1.md', embeds: [{example: 'basics/org-hierarchy-play', title: 'Org Hierarchy'}]},
  {file: '1-04-kak-vidyat-it-obychnye-lyudi/intro.md', embeds: [{example: 'basics/it-roles-map-play', title: 'Карта IT-ролей'}]},
  {file: '1-22-kommunikatsiya-i-obschenie/1.md', embeds: [{example: 'basics/org-hierarchy-play', title: 'Org Hierarchy'}]},
  {file: '1-26-karera-v-it-i-mify/intro.md', embeds: [
    {example: 'basics/it-career-plan-play', title: 'Конструктор карьерного плана'},
    {example: 'basics/hiring-funnel-play', title: 'Воронка найма'},
    {example: 'basics/grade-ladder-play', title: 'Лестница грейдов'},
  ]},
  {file: '1-26-karera-v-it-i-mify/1.md', embeds: [
    {example: 'basics/it-career-plan-play', title: 'Конструктор карьерного плана'},
    {example: 'basics/market-segment-heatmap-play', title: 'Тепловая карта рынка'},
  ]},
  {file: '1-26-karera-v-it-i-mify/2.md', embeds: [{example: 'basics/grade-ladder-play', title: 'Лестница грейдов'}]},
  {file: '1-26-karera-v-it-i-mify/3.md', embeds: [{example: 'basics/grade-ladder-play', title: 'Лестница грейдов'}]},
  {file: '1-26-karera-v-it-i-mify/5.md', embeds: [{example: 'basics/star-answer-builder-play', title: 'Конструктор STAR'}]},
  {file: '1-26-karera-v-it-i-mify/6.md', embeds: [
    {example: 'basics/ats-resume-matcher-play', title: 'ATS: резюме и вакансия'},
    {example: 'basics/hiring-funnel-play', title: 'Воронка найма'},
  ]},
  {file: '1-05-preduprezhdenie/1.md', embeds: [
    {example: 'basics/market-segment-heatmap-play', title: 'Тепловая карта рынка'},
    {example: 'basics/employment-format-compare-play', title: 'Форматы занятости'},
  ]},
  {file: '1-17-audio-i-video/intro.md', embeds: [{example: 'tools-multimedia/multimedia-editors-play', title: 'Multimedia Editors'}]},
  {file: '1-17-audio-i-video/1.md', embeds: [
    {example: 'basics/sampling-theorem-play', title: 'Теорема отсчётов'},
    {example: 'basics/codec-ab-compare-play', title: 'Сравнение кодеков'},
    {example: 'basics/video-bitrate-budget-play', title: 'Бюджет битрейта видео'},
    {example: 'basics/hdr-tone-map-play', title: 'SDR vs HDR'},
  ]},
  {file: '1-17-audio-i-video/2.md', embeds: [{example: 'tools-multimedia/audio-tools-play', title: 'Audio Tools'}]},
  {file: '1-17-audio-i-video/3.md', embeds: [{example: 'basics/display-tech-play', title: 'Display Tech'}]},
  {file: '1-17-audio-i-video/5.md', embeds: [{example: 'tools-multimedia/multimedia-editors-play', title: 'Multimedia Editors'}]},
  {file: '1-17-audio-i-video/6.md', embeds: [{example: 'tools-multimedia/multimedia-editors-play', title: 'Multimedia Editors'}]},
  {file: '1-27-udalennaya-rabota/2.md', embeds: [{example: 'basics/video-conference-simulator', title: 'Video Conference Simulator'}]},
  {file: '1-27-udalennaya-rabota/3.md', embeds: [{example: 'basics/video-conference-simulator', title: 'Video Conference Simulator'}]},
  {file: '1-16-grafika/1.md', embeds: [
    {example: 'basics/raster-vector-compare-demo', title: 'Raster Vector Compare'},
    {example: 'basics/gpu-pipeline-play', title: 'Конвейер GPU'},
    {example: 'basics/fps-frame-budget-play', title: 'Бюджет кадра FPS'},
  ]},
  {file: '1-16-grafika/3.md', embeds: [
    {example: 'basics/raster-vector-compare-demo', title: 'Raster Vector Compare'},
    {example: 'basics/pixel-budget-calculator-play', title: 'Калькулятор растра'},
    {example: 'basics/color-space-picker-play', title: 'Цветовые пространства'},
  ]},
  {file: '1-24-osnovnye-yazyki/2.md', embeds: [{example: 'code-basics/block-builder', title: 'Block Builder'}]},
  {file: '1-23-frontend-i-bekend/intro.md', embeds: [{example: 'about/web-app-architecture-play', title: 'Web App Architecture'}]},
  {file: '1-23-frontend-i-bekend/4.md', embeds: [{example: 'about/web-app-architecture-play', title: 'Web App Architecture'}]},
  {file: '1-23-frontend-i-bekend/5.md', embeds: [{example: 'about/web-app-architecture-play', title: 'Web App Architecture'}]},
  {file: '1-23-frontend-i-bekend/6.md', embeds: [{example: 'about/web-app-architecture-play', title: 'Web App Architecture'}]},
  {file: '1-23-frontend-i-bekend/7.md', embeds: [{example: 'about/web-app-architecture-play', title: 'Web App Architecture'}]},
  // новые на 1-04/1
  {file: '1-04-kak-vidyat-it-obychnye-lyudi/1.md', embeds: [{example: 'basics/it-roles-map-play', title: 'Карта IT-ролей'}]},
];

function embedBlock(embed) {
  const mh = embed.minHeight ? ` minHeight={${embed.minHeight}}` : '';
  return `<ExternalPlayEmbed example="${embed.example}" title="${embed.title}"${mh} />`;
}

function ensureEmbeds(filePath, embeds) {
  if (!fs.existsSync(filePath)) {
    console.warn('skip missing', filePath);
    return;
  }
  let text = fs.readFileSync(filePath, 'utf8');
  const missing = embeds.filter((e) => !text.includes(`example="${e.example}"`));
  if (!missing.length) {
    console.log('ok', path.relative(KB_DOCS, filePath));
    return;
  }

  if (!text.includes("import ExternalPlayEmbed")) {
    const fmEnd = text.indexOf('\n---\n', 4);
    const insertAt = fmEnd >= 0 ? fmEnd + 5 : 0;
    text = `${text.slice(0, insertAt)}\nimport ExternalPlayEmbed from '@site/src/components/ExternalPlayEmbed';\n\n${text.slice(insertAt)}`;
  }

  const blocks = missing.map(embedBlock).join('\n\n');
  const badgeIdx = text.indexOf('<span class="complexity-badge">');
  if (badgeIdx >= 0) {
    const lineEnd = text.indexOf('\n', badgeIdx);
    text = `${text.slice(0, lineEnd + 1)}\n${blocks}\n${text.slice(lineEnd + 1)}`;
  } else {
    const h1 = text.match(/^# .+$/m);
    if (h1) {
      const lineEnd = text.indexOf('\n', h1.index);
      text = `${text.slice(0, lineEnd + 1)}\n${blocks}\n${text.slice(lineEnd + 1)}`;
    } else {
      text = `${blocks}\n\n${text}`;
    }
  }

  fs.writeFileSync(filePath, text);
  console.log('updated', path.relative(KB_DOCS, filePath), '+', missing.length);
}

for (const item of PLAN) {
  ensureEmbeds(path.join(KB_DOCS, item.file), item.embeds);
}

console.log('Done.');
