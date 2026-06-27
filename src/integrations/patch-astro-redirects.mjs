import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loaderMarkup} from './itu-loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loaderCss = await fs.readFile(path.join(__dirname, 'itu-loader.css'), 'utf8');

function resolveOutDir(dir) {
  if (typeof dir === 'string') {
    return dir;
  }
  if (dir instanceof URL) {
    return fileURLToPath(dir);
  }
  if (dir && typeof dir === 'object' && 'pathname' in dir) {
    return fileURLToPath(dir);
  }
  return String(dir);
}

function buildRedirectPage({toUrl, searchAnchorForwarding}) {
  const jsTarget = searchAnchorForwarding
    ? `'${toUrl}' + window.location.search + window.location.hash`
    : `'${toUrl}'`;

  return `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${toUrl}">
    <link rel="canonical" href="${toUrl}" />
    <meta name="robots" content="noindex" />
    <title>Вселенная IT</title>
    <style>${loaderCss}
body { margin: 0; }</style>
  </head>
  <body>
    <div class="itu-loader-host itu-loader-host--page">
      ${loaderMarkup({title: 'Вселенная IT', label: 'Переход на обновлённый раздел…'})}
    </div>
    <script>
      window.location.replace(${jsTarget});
    </script>
  </body>
</html>
`;
}

function extractRedirectTarget(content) {
  const refreshMatch = content.match(/content="\d+;url=([^"]+)"/i);
  if (refreshMatch) {
    return {toUrl: refreshMatch[1], searchAnchorForwarding: false};
  }

  const titleMatch = content.match(/<title>Redirecting to:\s*([^<]+)<\/title>/i);
  if (titleMatch) {
    return {toUrl: titleMatch[1].trim(), searchAnchorForwarding: false};
  }

  const linkMatch = content.match(/<a href="([^"]+)">Redirecting from/i);
  if (linkMatch) {
    return {toUrl: linkMatch[1], searchAnchorForwarding: false};
  }

  return null;
}

function isAstroRedirectStub(content) {
  return (
    content.includes('Redirecting from') ||
    content.includes('<title>Redirecting to:') ||
    /content="\d+;url=/.test(content)
  );
}

async function walkHtmlFiles(dir, files = []) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkHtmlFiles(full, files);
      continue;
    }
    if (entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

async function patchDir(outDir) {
  const files = await walkHtmlFiles(outDir);
  let patched = 0;

  await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, 'utf8');
      if (!isAstroRedirectStub(content) || content.includes('itu-loader')) {
        return;
      }

      const target = extractRedirectTarget(content);
      if (!target) {
        return;
      }

      const next = buildRedirectPage(target);
      await fs.writeFile(file, next, 'utf8');
      patched += 1;
    }),
  );

  if (patched > 0) {
    console.log(`itu-patch-astro-redirects: patched ${patched} redirect page(s)`);
  }
}

/** Post-build: заменить stub Astro.redirect на ITU loader. */
export default function patchAstroRedirects() {
  return {
    name: 'itu-patch-astro-redirects',
    hooks: {
      'astro:build:done': async ({dir}) => {
        await patchDir(resolveOutDir(dir));
      },
    },
  };
}
