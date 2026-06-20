import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'it-knowledge-base', 'docs', 'encyclopedia', '8-infra-security');

function walk(dir) {
  for (const ent of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith('.md')) fix(p);
  }
}

function fix(fp) {
  let c = fs.readFileSync(fp, 'utf8');
  const re = /(<\/div>)\s*(<ExternalPlayEmbed[\s\S]*?\/>)\s*(\n\s*<span class="complexity-badge">)/;
  if (!re.test(c)) return;
  c = c.replace(re, '$1\n\n$3$2\n');
  fs.writeFileSync(fp, c);
  console.log('fixed', path.relative(root, fp));
}

walk(root);
