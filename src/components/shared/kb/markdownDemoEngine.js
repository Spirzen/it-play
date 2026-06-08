/** Рендер подмножества Markdown из статьи 3.04.5 (без внешних библиотек). */

export const MARKDOWN_PRESETS = [
  {
    id: 'basics',
    label: 'Основы',
    md: `# Заголовок 1
## Заголовок 2

**Жирный** и *курсив* и \`код\`.

> Цитата из документации.

- пункт списка
- ещё пункт
`,
  },
  {
    id: 'links',
    label: 'Ссылки и код',
    md: `[GitHub](https://github.com)

\`\`\`json
{ "ok": true }
\`\`\`
`,
  },
  {
    id: 'table',
    label: 'Таблица',
    md: `| Формат | Назначение |
|--------|------------|
| JSON | API |
| YAML | CI/CD |
`,
  },
  {
    id: 'task',
    label: 'Чек-лист',
    md: `## Релиз

- [x] Сборка
- [ ] Деплой
- [ ] Мониторинг
`,
  },
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineFormat(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/_([^_]+)_/g, '<em>$1</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return out;
}

export function renderMarkdownToHtml(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let inCode = false;
  let codeLang = '';
  let codeBuf = [];
  let listType = null;
  let tableRows = [];

  const flushList = () => {
    if (listType) {
      html.push(listType === 'ol' ? '</ol>' : '</ul>');
      listType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length === 0) {
      return;
    }
    const [head, ...body] = tableRows;
    html.push('<table><thead><tr>');
    head.forEach((cell) => html.push(`<th>${inlineFormat(cell.trim())}</th>`));
    html.push('</tr></thead><tbody>');
    body.forEach((row) => {
      html.push('<tr>');
      row.forEach((cell) => html.push(`<td>${inlineFormat(cell.trim())}</td>`));
      html.push('</tr>');
    });
    html.push('</tbody></table>');
    tableRows = [];
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (!inCode) {
        flushList();
        flushTable();
        inCode = true;
        codeLang = line.trim().slice(3).trim();
        codeBuf = [];
      } else {
        const langAttr = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
        html.push(`<pre><code${langAttr}>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
        inCode = false;
        codeLang = '';
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const cells = line
        .trim()
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      const next = lines[i + 1]?.trim() ?? '';
      if (/^\|?[\s:-]+\|/.test(next)) {
        i += 1;
        continue;
      }
      tableRows.push(cells);
      continue;
    }
    flushTable();

    if (!line.trim()) {
      flushList();
      html.push('<br />');
      continue;
    }

    const hr = /^(\*{3,}|-{3,}|_{3,})\s*$/.exec(line.trim());
    if (hr) {
      flushList();
      html.push('<hr />');
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      flushList();
      const level = heading[1].length;
      html.push(`<h${level}>${inlineFormat(heading[2])}</h${level}>`);
      continue;
    }

    if (line.startsWith('> ')) {
      flushList();
      html.push(`<blockquote>${inlineFormat(line.slice(2))}</blockquote>`);
      continue;
    }

    const task = /^- \[([ xX])\]\s+(.+)$/.exec(line);
    if (task) {
      if (listType !== 'task') {
        flushList();
        html.push('<ul class="md-task-list">');
        listType = 'task';
      }
      const checked = task[1].toLowerCase() === 'x' ? ' checked' : '';
      html.push(
        `<li><label><input type="checkbox" disabled${checked} /> ${inlineFormat(task[2])}</label></li>`,
      );
      continue;
    }

    const ul = /^[-*+]\s+(.+)$/.exec(line);
    if (ul) {
      if (listType !== 'ul') {
        flushList();
        html.push('<ul>');
        listType = 'ul';
      }
      html.push(`<li>${inlineFormat(ul[1])}</li>`);
      continue;
    }

    const ol = /^\d+\.\s+(.+)$/.exec(line);
    if (ol) {
      if (listType !== 'ol') {
        flushList();
        html.push('<ol>');
        listType = 'ol';
      }
      html.push(`<li>${inlineFormat(ol[1])}</li>`);
      continue;
    }

    flushList();
    html.push(`<p>${inlineFormat(line)}</p>`);
  }

  flushList();
  flushTable();
  if (inCode) {
    html.push(`<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
  }

  return html.join('\n');
}

export function markdownStats(text) {
  const lines = text.split('\n');
  const headings = (text.match(/^#{1,6}\s/gm) ?? []).length;
  const links = (text.match(/\[[^\]]+\]\([^)]+\)/g) ?? []).length;
  const codeBlocks = (text.match(/^```/gm) ?? []).length / 2;
  return {
    lines: lines.length,
    chars: text.length,
    headings,
    links,
    codeBlocks: Math.floor(codeBlocks),
  };
}
