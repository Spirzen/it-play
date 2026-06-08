/** Извлечение контента из DOM статьи (только в браузере). */

export function getArticleElement() {
  if (typeof document === 'undefined') {
    return null;
  }
  return (
    document.querySelector('main article') ||
    document.querySelector('.theme-doc-markdown') ||
    document.querySelector('article')
  );
}

export function pickRandom(items) {
  if (!items?.length) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

export function pickRandomDifferent(items, current, isSame = (a, b) => a === b) {
  if (!items?.length) {
    return null;
  }
  if (items.length === 1) {
    return items[0];
  }
  let next = current;
  let guard = 0;
  while (isSame(next, current) && guard < 20) {
    next = pickRandom(items);
    guard += 1;
  }
  return next;
}

/** Вопросы из нумерованных списков (чеклист самопроверки). */
export function extractChecklistQuestions(articleElement) {
  if (!articleElement) {
    return [];
  }
  const found = [];
  articleElement.querySelectorAll('ol').forEach((ol) => {
    ol.querySelectorAll('li').forEach((li) => {
      const text = li.textContent.trim();
      if (text.length > 5 && text.includes('?')) {
        found.push(text);
      }
    });
  });
  return [...new Set(found)];
}

/** Вопросы после заголовков "Вопрос" в лабораторных статьях. */
export function extractArticleQuestions(articleElement) {
  if (!articleElement) {
    return [];
  }

  const found = [];
  const questionHeaders = articleElement.querySelectorAll('h4');
  questionHeaders.forEach((header) => {
    const headingText = header.textContent.trim();
    if (!headingText || !headingText.startsWith('Вопрос')) {
      return;
    }

    let next = header.nextElementSibling;
    while (next) {
      if (next.tagName === 'HR' || /^H[1-6]$/.test(next.tagName)) {
        break;
      }

      const text = next.textContent?.trim();
      if (text && text.length > 3) {
        found.push(text);
        break;
      }
      next = next.nextElementSibling;
    }
  });

  if (found.length === 0) {
    const headers = articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
    Array.from(headers)
      .filter(
        (el) =>
          el.textContent.trim() === 'Вопрос' || el.textContent.trim().startsWith('Вопрос'),
      )
      .forEach((header) => {
        let next = header.nextElementSibling;
        let attempts = 0;
        while (next && next.tagName !== 'P' && attempts < 5) {
          next = next.nextElementSibling;
          attempts += 1;
        }
        if (next?.tagName === 'P') {
          const text = next.textContent.trim();
          if (text.length > 3) {
            found.push(text);
          }
        }
      });
  }

  if (found.length === 0) {
    const html = articleElement.innerHTML;
    const regex1 =
      /<h4[^>]*>Вопрос<\/h4>\s*<p[^>]*>([^<]+(?:<[^/][^>]*>[^<]*<\/[^>]+>)*[^<]*)<\/p>/gi;
    let match;
    while ((match = regex1.exec(html)) !== null) {
      const text = match[1].replace(/<[^>]*>/g, '').trim();
      if (text.length > 3) {
        found.push(text);
      }
    }
    if (found.length === 0) {
      const regex2 = /####\s*Вопрос\s*[\s\S]*?<p>(.*?)<\/p>/gi;
      while ((match = regex2.exec(html)) !== null) {
        const text = match[1].replace(/<[^>]*>/g, '').trim();
        if (text.length > 3) {
          found.push(text);
        }
      }
    }
  }

  return found;
}

/**
 * Вопросы экзамена из нумерованных списков под заголовками "Раздел".
 * @returns {{ sections: {id: string, title: string}[], questions: {id: string, number: number, text: string, sectionId: string, sectionTitle: string}[] }}
 */
export function extractExamQuestions(articleElement) {
  if (!articleElement) {
    return {sections: [], questions: []};
  }

  const root = articleElement.cloneNode(true);
  root.querySelectorAll('.it-demo').forEach((el) => el.remove());

  const sections = [];
  const questions = [];
  let currentSection = {id: 's0', title: 'Экзамен'};

  const ensureSection = (title) => {
    const normalized = title.trim();
    const existing = sections.find((s) => s.title === normalized);
    if (existing) {
      currentSection = existing;
      return;
    }
    const section = {id: `s${sections.length}`, title: normalized};
    sections.push(section);
    currentSection = section;
  };

  const parseList = (ol) => {
    ol.querySelectorAll(':scope > li').forEach((li) => {
      const raw = li.textContent.trim();
      if (raw.length < 8) {
        return;
      }
      const match = raw.match(/^(\d+)\.\s*(.+)$/s);
      const number = match ? parseInt(match[1], 10) : questions.length + 1;
      const text = match ? match[2].trim() : raw;
      questions.push({
        id: `q${number}`,
        number,
        text,
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
      });
    });
  };

  const visit = (node) => {
    if (!node || node.nodeType !== 1) {
      return;
    }
    const tag = node.tagName;
    if (tag === 'H2') {
      const title = node.textContent.trim();
      if (title && !/^Экзамен для/i.test(title)) {
        ensureSection(title);
      }
    } else if (tag === 'OL') {
      parseList(node);
    }
    Array.from(node.children).forEach(visit);
  };

  visit(root);

  if (questions.length === 0) {
    root.querySelectorAll('ol').forEach((ol) => {
      if (sections.length === 0) {
        ensureSection('Вопросы');
      }
      parseList(ol);
    });
  }

  const seen = new Set();
  const unique = questions.filter((q) => {
    const key = `${q.number}:${q.text}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  unique.sort((a, b) => a.number - b.number);

  return {sections, questions: unique};
}

const GAME_LINK_SELECTOR =
  'a[href*="store.steampowered.com"], a[href*="nintendo.com"], a[href*="animalcrossing.nintendo.com"]';

const SKIP_TITLE = /^(ссылка|перейти)$/i;

/** Названия игр со страницы (магазины Steam / Nintendo). */
export function extractGameTitles(root = document) {
  return extractGameEntries(root).map((e) => e.title);
}

/** Игры со страницы: название и ссылка на магазин. */
export function extractGameEntries(root = document) {
  const seen = new Set();
  const entries = [];
  root.querySelectorAll(GAME_LINK_SELECTOR).forEach((link) => {
    const title = link.innerText.trim();
    const href = link.getAttribute('href') || '';
    if (!title || SKIP_TITLE.test(title) || !href || seen.has(href)) {
      return;
    }
    seen.add(href);
    entries.push({title, href});
  });
  return entries;
}

/** Термины из таблиц на странице (английский словарь). */
export function extractTableVocabulary(root = document) {
  const rows = root.querySelectorAll('table tbody tr');
  const extracted = [];
  let cols = 0;

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length > cols) {
      cols = cells.length;
    }
    if (!cells.length) {
      return;
    }
    const texts = Array.from(cells).map((c) => c.textContent.trim());
    if (cols === 2 && texts[0] && texts[1]) {
      extracted.push({type: 'pair', term: texts[0], definition: texts[1]});
    } else if (cols >= 3 && texts[0]) {
      extracted.push({
        type: 'abbr',
        term: texts[0],
        definition: texts.slice(1).join(' '),
      });
    }
  });

  return {items: extracted, cols};
}
