/** Убирает лишние BrowserOnly-обёртки и экспортирует Inner-компоненты напрямую. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const DEMOS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'components', 'demos');

for (const name of fs.readdirSync(DEMOS_DIR)) {
  if (!/\.(jsx|js)$/.test(name)) continue;
  const filePath = path.join(DEMOS_DIR, name);
  let src = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (src.includes('BrowserOnly')) {
    src = src.replace(/import BrowserOnly from '@docusaurus\/BrowserOnly';\n?/g, '');
    src = src.replace(
      /return\s*\(\s*<BrowserOnly[^>]*>\s*\{\(\)\s*=>\s*(<[^>]+\/>)\s*\}\s*<\/BrowserOnly>\s*\)/g,
      'return $1',
    );
    src = src.replace(
      /return\s*<BrowserOnly[^>]*>\{\(\)\s*=>\s*(<[^>]+\/>)\}<\/BrowserOnly>/g,
      'return $1',
    );
    src = src.replace(
      /return\s*\(\s*<BrowserOnly[^>]*>\s*\{\(\)\s*=>\s*\(/g,
      'return (',
    );
    src = src.replace(/\)\s*\}\s*<\/BrowserOnly>\s*\);/g, ');');
    src = src.replace(/demoLoadingFallback\([^)]*\)/g, 'null');
    changed = true;
  }

  const wrapperRe =
    /export default function (\w+)\([^)]*\)\s*\{\s*return\s*<(\w+Inner)\s*\/?>\s*;\s*\}\s*$/;
  const m = src.match(wrapperRe);
  if (m) {
    src = src.replace(wrapperRe, `export default ${m[2]};\n`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, src, 'utf8');
    console.log('fixed', name);
  }
}
