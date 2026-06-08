/** @typedef {{ u: string, t: string, d: string, s: string, a: string, h?: string }} DocSearchEntry */

/** @typedef {{ v: number, docs: DocSearchEntry[] }} DocSearchIndex */

/**
 * @param {string} text
 */
export function normalizeSearchText(text) {
  return text.toLocaleLowerCase('ru').replace(/\s+/g, ' ').trim();
}

/**
 * @param {DocSearchEntry} doc
 */
function haystack(doc) {
  return normalizeSearchText([doc.t, doc.d, doc.s, doc.a, doc.h, doc.u].filter(Boolean).join(' '));
}

/**
 * @param {DocSearchEntry[]} docs
 * @param {string} query
 * @param {number} [limit]
 * @returns {DocSearchEntry[]}
 */
export function searchDocs(docs, query, limit = 12) {
  const q = normalizeSearchText(query);
  if (q.length < 2) {
    return [];
  }

  const tokens = q.split(' ').filter(Boolean);
  /** @type {{ doc: DocSearchEntry, score: number }[]} */
  const scored = [];

  for (const doc of docs) {
    const title = normalizeSearchText(doc.t);
    const text = haystack(doc);
    let score = 0;

    if (title.includes(q)) {
      score += 120;
    }
    if (text.includes(q)) {
      score += 40;
    }

    for (const token of tokens) {
      if (title.includes(token)) {
        score += 35;
      } else if (text.includes(token)) {
        score += 12;
      }
    }

    if (score > 0) {
      scored.push({doc, score});
    }
  }

  scored.sort((a, b) => b.score - a.score || a.doc.t.localeCompare(b.doc.t, 'ru'));
  return scored.slice(0, limit).map((row) => row.doc);
}

/** @type {DocSearchIndex | null} */
let cachedIndex = null;

/**
 * @param {string} baseUrl
 * @returns {Promise<DocSearchIndex>}
 */
export async function loadDocSearchIndex(baseUrl) {
  if (cachedIndex) {
    return cachedIndex;
  }
  const url = `${baseUrl.replace(/\/?$/, '/')}doc-search-index.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`doc-search-index: HTTP ${response.status}`);
  }
  const data = await response.json();
  if (!data || !Array.isArray(data.docs)) {
    throw new Error('doc-search-index: invalid payload');
  }
  cachedIndex = data;
  return data;
}
