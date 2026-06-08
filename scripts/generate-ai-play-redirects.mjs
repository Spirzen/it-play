/**
 * Генерирует HTML-редиректы со старых about/lab URL на ai/ (play.spirzen.ru).
 * Usage: node scripts/generate-ai-play-redirects.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_ROOT = path.join(__dirname, '..', 'public');

const REDIRECTS = [
  {from: 'p/about/neural-network-demo', to: '/p/ai/neural-network-demo/'},
  {from: 'p/embed/about/neural-network-demo', to: '/p/embed/ai/neural-network-demo/'},
  {from: 'p/about/ai-agent-play', to: '/p/ai/ai-agent-play/'},
  {from: 'p/embed/about/ai-agent-play', to: '/p/embed/ai/ai-agent-play/'},
  {from: 'p/lab/prompt-pipeline-demo', to: '/p/ai/prompt-pipeline-demo/'},
  {from: 'p/embed/lab/prompt-pipeline-demo', to: '/p/embed/ai/prompt-pipeline-demo/'},
];

function redirectHtml(target) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=${target}" />
  <link rel="canonical" href="${target}" />
  <title>Redirect</title>
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
  <p><a href="${target}">Перейти к демо</a></p>
</body>
</html>
`;
}

let written = 0;
for (const {from, to} of REDIRECTS) {
  const dir = path.join(PUBLIC_ROOT, from);
  const file = path.join(dir, 'index.html');
  fs.mkdirSync(dir, {recursive: true});
  fs.writeFileSync(file, redirectHtml(to), 'utf8');
  written += 1;
  console.log(`${from}/ → ${to}`);
}

console.log(`Done. ${written} redirect(s) in public/`);
