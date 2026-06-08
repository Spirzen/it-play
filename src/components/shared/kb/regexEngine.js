/** Утилиты для RegexPlaygroundDemo — поиск, валидация, замена, группы. */

export const FLAG_OPTIONS = [
  {id: 'g', label: 'g', hint: 'все совпадения (Matches)'},
  {id: 'i', label: 'i', hint: 'без учёта регистра'},
  {id: 'm', label: 'm', hint: '^ и $ для каждой строки'},
];

export const PRESETS = [
  {
    id: 'email',
    label: 'Email',
    pattern: String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`,
    text: 'contact@company.ru\nbad@@mail\nuser.name+tag@sub.domain.co',
    mode: 'validate',
    flags: ['g', 'm'],
    note: 'Проверка всей строки — как Regex.IsMatch с ^ и $',
  },
  {
    id: 'date',
    label: 'Дата ДД-ММ-ГГГГ',
    pattern: String.raw`(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})`,
    text: 'Событие 22-01-2026 и дубликат 22-01-2026 в тексте.',
    mode: 'extract',
    flags: ['g'],
    note: 'Именованные группы — как (?<имя>…) в C#',
  },
  {
    id: 'log',
    label: 'Строка лога',
    pattern: String.raw`^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+\[(\w+)\]\s+(.+)$`,
    text: `2026-01-22 14:30:05 [INFO] User login successful
2026-01-22 14:31:12 [ERROR] Connection timeout
noise line without structure`,
    mode: 'extract',
    flags: ['m'],
    note: 'Группы 1–4: дата, время, уровень, сообщение',
  },
  {
    id: 'ipv4',
    label: 'IPv4',
    pattern: String.raw`\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\b`,
    text: 'Сервер 192.168.0.1 и шлюз 10.0.0.1, ошибка 999.999.999.999',
    mode: 'explore',
    flags: ['g'],
    note: 'Несколько совпадений в одной строке',
  },
  {
    id: 'greedy',
    label: 'Жадный vs ленивый',
    pattern: String.raw`<div>.*</div>`,
    patternLazy: String.raw`<div>.*?</div>`,
    text: '<div>A</div> и <div>B</div> подряд',
    mode: 'compare',
    flags: ['g'],
    note: '.* захватывает максимум; .*? — минимум до первого </div>',
  },
];

export function buildFlags(flagSet) {
  return [...flagSet].sort().join('');
}

export function escapeForRegexLiteral(pattern) {
  return pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function serializeMatch(m) {
  const groups = [];
  const seenNames = new Set();

  if (m.groups) {
    for (const [name, value] of Object.entries(m.groups)) {
      seenNames.add(name);
      groups.push({
        index: null,
        name,
        value: value ?? '',
      });
    }
  }

  for (let i = 1; i < m.length; i += 1) {
    const value = m[i] ?? '';
    const named = m.groups
      ? Object.entries(m.groups).find(([, v]) => v === value)?.[0]
      : null;
    if (named && seenNames.has(named)) continue;
    groups.push({
      index: i,
      name: named,
      value,
    });
  }

  return {
    full: m[0],
    index: m.index,
    end: m.index + m[0].length,
    groups,
  };
}

export function runRegex(pattern, flagStr, text) {
  if (!pattern.trim()) {
    return {matches: [], error: 'Введите шаблон'};
  }
  try {
    const flags = flagStr.includes('g') ? flagStr : `${flagStr}g`;
    const re = new RegExp(pattern, flags);
    const matches = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      matches.push(serializeMatch(m));
      if (m[0].length === 0) re.lastIndex += 1;
      if (matches.length >= 200) break;
    }
    return {matches, error: null};
  } catch (e) {
    return {matches: [], error: e.message};
  }
}

export function validateFullString(pattern, flagStr, text) {
  const anchored = pattern.startsWith('^') && pattern.endsWith('$') ? pattern : `^(?:${pattern})$`;
  try {
    const re = new RegExp(anchored, flagStr.replace('g', ''));
    const lines = flagStr.includes('m') ? text.split('\n') : [text];
    const results = lines.map((line, i) => ({
      line: i + 1,
      ok: re.test(line),
      text: line,
    }));
    return {results, error: null, anchored};
  } catch (e) {
    return {results: [], error: e.message, anchored: pattern};
  }
}

export function replaceAll(pattern, flagStr, text, replacement) {
  try {
    const flags = flagStr.includes('g') ? flagStr : `${flagStr}g`;
    const re = new RegExp(pattern, flags);
    return {output: text.replace(re, replacement), error: null};
  } catch (e) {
    return {output: text, error: e.message};
  }
}

export function buildHighlightSegments(text, matches, activeGroup) {
  if (!matches.length) {
    return [{type: 'plain', text}];
  }

  const spans = [...matches]
    .sort((a, b) => a.index - b.index)
    .filter((m, i, arr) => i === 0 || m.index >= arr[i - 1].end);

  const segments = [];
  let pos = 0;

  for (const span of spans) {
    if (span.index > pos) {
      segments.push({type: 'plain', text: text.slice(pos, span.index)});
    }
    const matchText = text.slice(span.index, span.end);
    const group =
      activeGroup != null && activeGroup >= 0 ? span.groups[activeGroup] : null;

    if (group?.value) {
      const relStart = matchText.indexOf(group.value);
      if (relStart >= 0) {
        if (relStart > 0) {
          segments.push({type: 'match', text: matchText.slice(0, relStart)});
        }
        segments.push({type: 'group', text: group.value});
        const after = relStart + group.value.length;
        if (after < matchText.length) {
          segments.push({type: 'match', text: matchText.slice(after)});
        }
      } else {
        segments.push({type: 'match', text: matchText});
      }
    } else {
      segments.push({type: activeGroup === -1 ? 'group' : 'match', text: matchText});
    }
    pos = span.end;
  }

  if (pos < text.length) {
    segments.push({type: 'plain', text: text.slice(pos)});
  }
  return segments;
}

export function buildCSharpSnippet(mode, pattern, flags, replacement) {
  const escaped = escapeForRegexLiteral(pattern);
  const opts = [];
  if (flags.includes('i')) opts.push('RegexOptions.IgnoreCase');
  if (flags.includes('m')) opts.push('RegexOptions.Multiline');
  const opt = opts.length ? `, ${opts.join(' | ')}` : '';

  if (mode === 'validate') {
    return `bool ok = Regex.IsMatch(input, @"${escaped}"${opt});`;
  }
  if (mode === 'replace') {
    const rep = replacement.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `string result = Regex.Replace(input, @"${escaped}", "${rep}"${opt});`;
  }
  if (mode === 'extract') {
    return `Match m = Regex.Match(input, @"${escaped}"${opt});
if (m.Success) {
    string day = m.Groups["day"].Value; // или Groups[1]
}`;
  }
  return `foreach (Match m in Regex.Matches(input, @"${escaped}"${opt})) {
    // m.Value, m.Index, m.Groups
}`;
}
