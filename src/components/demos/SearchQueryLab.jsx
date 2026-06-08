import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './searchPlays.module.css';

const REFORM = [
  {
    chat: 'Как настроить Wi-Fi на ноутбуке?',
    pro: 'Wi-Fi настройка ноутбук Windows',
    note: 'Убрали "как", оставили сущности и контекст ОС.',
  },
  {
    chat: 'Что такое REST API?',
    pro: 'REST API определение',
    note: 'Вопросительная форма не нужна — ищем термины экспертов.',
  },
  {
    chat: 'Где скачать Visual Studio бесплатно?',
    pro: 'Visual Studio Community download site:microsoft.com',
    note: 'Уточнили редакцию и домен первоисточника.',
  },
];

const MOCK_RESULTS = [
  {
    title: 'Настройка беспроводной сети в Windows',
    url: 'support.microsoft.com/.../wifi',
    snippet: 'Пошаговая настройка Wi-Fi адаптера и профилей сети на ноутбуке…',
    terms: ['wi-fi', 'ноутбук', 'настройка'],
  },
  {
    title: 'REST API — архитектурный стиль',
    url: 'developer.mozilla.org/.../rest',
    snippet: 'REST API использует HTTP-методы и ресурсы без состояния на сервере…',
    terms: ['rest', 'api'],
  },
  {
    title: 'Visual Studio Community — загрузка',
    url: 'visualstudio.microsoft.com/.../community',
    snippet: 'Бесплатная IDE для учёбы и open source с полным набором инструментов…',
    terms: ['visual', 'studio', 'community', 'download'],
  },
];

const OPERATORS = [
  {id: 'phrase', label: '"фраза"', apply: (q, on) => (on ? `"${q.trim()}"` : q)},
  {
    id: 'site',
    label: 'site:',
    apply: (q, on, val) => (on ? `site:${val || 'stackoverflow.com'} ${q}` : q),
  },
  {id: 'minus', label: '-шум', apply: (q, on) => (on ? `${q} -forum -youtube` : q)},
  {
    id: 'file',
    label: 'filetype:',
    apply: (q, on) => (on ? `${q} filetype:pdf` : q),
  },
  {
    id: 'title',
    label: 'intitle:',
    apply: (q, on) => (on ? `intitle:${q.split(' ')[0] || 'error'} ${q}` : q),
  },
];

function highlightSnippet(text, terms) {
  if (!terms.length) return text;
  const lower = new Set(terms.map((t) => t.toLowerCase()));
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part && lower.has(part.toLowerCase()) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>,
  );
}

function SearchQueryLabInner() {
  const [reformIdx, setReformIdx] = useState(0);
  const [rawQuery, setRawQuery] = useState('REST API tutorial');
  const [ops, setOps] = useState({phrase: false, site: false, minus: false, file: false, title: false});
  const [siteDomain, setSiteDomain] = useState('developer.mozilla.org');

  const builtQuery = useMemo(() => {
    let q = rawQuery.trim();
    for (const op of OPERATORS) {
      q = op.apply(q, ops[op.id], siteDomain);
    }
    return q.replace(/\s+/g, ' ').trim();
  }, [rawQuery, ops, siteDomain]);

  const terms = useMemo(
    () =>
      builtQuery
        .toLowerCase()
        .replace(/site:|filetype:|intitle:|\*|"/g, ' ')
        .split(/\s+/)
        .filter((t) => t && !t.startsWith('-') && t.length > 2),
    [builtQuery],
  );

  const serp = useMemo(() => {
    return MOCK_RESULTS.map((r) => {
      const hits = terms.filter((t) =>
        [...r.terms, ...r.title.toLowerCase(), ...r.snippet.toLowerCase()].some((x) =>
          x.includes(t),
        ),
      ).length;
      return {...r, hits};
    })
      .filter((r) => r.hits > 0 || terms.length === 0)
      .sort((a, b) => b.hits - a.hits);
  }, [terms]);

  const toggleOp = (id) => setOps((prev) => ({...prev, [id]: !prev[id]}));

  const example = REFORM[reformIdx];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Лаборатория поискового запроса"
        subtitle="Переформулировка, операторы Google/Яндекс и учебная выдача с подсветкой"
      >
        <div className={styles.panel}>
          <span className={styles.panelTitle}>Разговорный → профессиональный</span>
          <div className={styles.tabs}>
            {REFORM.map((_, i) => (
              <button
                key={i}
                type="button"
                className={clsx(styles.tab, reformIdx === i && styles.tabActive)}
                onClick={() => setReformIdx(i)}
              >
                Пример {i + 1}
              </button>
            ))}
          </div>
          <p className={styles.bad}>
            <strong>Разговорно:</strong> {example.chat}
          </p>
          <p className={styles.good}>
            <strong>Эффективно:</strong> <code>{example.pro}</code>
          </p>
          <p className={styles.hint}>{example.note}</p>
        </div>

        <label className="it-demo__label" htmlFor="sq-raw">
          Ваш запрос (ключевые слова)
        </label>
        <input
          id="sq-raw"
          className={styles.queryInput}
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
          placeholder="REST API tutorial"
        />

        <p className={styles.hint} style={{marginBottom: '0.35rem'}}>
          Операторы (клик — вкл/выкл):
        </p>
        <div className={styles.opGrid}>
          {OPERATORS.map((op) => (
            <button
              key={op.id}
              type="button"
              className={clsx(styles.op, ops[op.id] && styles.opOn)}
              onClick={() => toggleOp(op.id)}
            >
              {op.label}
            </button>
          ))}
        </div>
        {ops.site && (
          <input
            className={styles.queryInput}
            value={siteDomain}
            onChange={(e) => setSiteDomain(e.target.value)}
            placeholder="домен для site:"
            aria-label="Домен site:"
          />
        )}

        <p className={styles.hint}>
          Итоговая строка в поисковике:
        </p>
        <pre className={styles.mono}>{builtQuery || '—'}</pre>

        <div className={styles.serp}>
          <h4 style={{margin: '0 0 0.35rem', fontSize: '0.85rem'}}>Учебная выдача</h4>
          {serp.length === 0 ? (
            <p className={styles.hint}>Нет совпадений с демо-индексом — попробуйте REST, Wi-Fi или Visual.</p>
          ) : (
            serp.map((r) => (
              <div key={r.url} className={styles.serpItem}>
                <div className={styles.serpTitle}>{r.title}</div>
                <div className={styles.serpUrl}>{r.url}</div>
                <p className={styles.serpSnippet}>{highlightSnippet(r.snippet, terms)}</p>
              </div>
            ))
          )}
        </div>

        <p className={styles.hint}>
          Для ошибок копируйте текст дословно в кавычки и добавьте версию стека:{' '}
          <code>&quot;Connection refused&quot; PostgreSQL 16</code>
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default SearchQueryLabInner;
