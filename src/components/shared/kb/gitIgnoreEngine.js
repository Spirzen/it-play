/** Minimal gitignore matcher for teaching (not full git spec). */

function escapeRegex(s) {
  return s.replace(/[.+^${}()|[\]\\]/g, '\\$&');
}

function patternToRegex(line) {
  let p = line.trim();
  if (!p || p.startsWith('#')) return null;
  let anchored = false;
  if (p.startsWith('/')) {
    anchored = true;
    p = p.slice(1);
  }
  p = escapeRegex(p).replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
  if (p.endsWith('/')) p = p.slice(0, -1) + '(/.*)?';
  const prefix = anchored ? '^' : '(^|.*/)';
  return new RegExp(`${prefix}${p}$`);
}

export function parseGitignore(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

export function isIgnored(path, patterns) {
  const normalized = path.replace(/\\/g, '/').replace(/^\.\//, '');
  let ignored = false;
  for (const line of patterns) {
    const rx = patternToRegex(line);
    if (!rx) continue;
    if (rx.test(normalized)) ignored = true;
    if (line.startsWith('!')) {
      const neg = patternToRegex(line.slice(1));
      if (neg?.test(normalized)) ignored = false;
    }
  }
  return ignored;
}

export function matchGitIgnore(text, path) {
  const patterns = parseGitignore(text);
  let matchedRule = null;
  const normalized = path.replace(/\\/g, '/').replace(/^\.\//, '');
  let ignored = false;
  for (const line of patterns) {
    const rx = patternToRegex(line);
    if (!rx) continue;
    if (rx.test(normalized)) {
      ignored = true;
      matchedRule = line;
    }
    if (line.startsWith('!')) {
      const neg = patternToRegex(line.slice(1));
      if (neg?.test(normalized)) {
        ignored = false;
        matchedRule = line;
      }
    }
  }
  return {ignored, rule: matchedRule};
}

export const GITIGNORE_PRESETS = {
  node: `node_modules/\n.env\n.env.*\ndist/\nbuild/\n*.log\n`,
  python: `__pycache__/\n*.pyc\n.venv/\nvenv/\n.env\n.pytest_cache/\n`,
  dotnet: `bin/\nobj/\n*.user\n*.suo\n.vs/\n`,
};
