import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './searchPlays.module.css';

const DOCS = {
  D1: {text: 'кошка спит на диване', tokens: ['кошка', 'спит', 'диван']},
  D2: {text: 'собака гоняется за кошкой', tokens: ['собака', 'гоняется', 'кошка']},
  D3: {text: 'диван старый кошка новая', tokens: ['диван', 'кошка']},
};

const STOP = new Set(['на', 'за', 'старый', 'новая', 'и', 'в', 'с']);

const PIPELINE = [
  {
    id: 'crawl',
    label: 'Краулер',
    detail:
      'Обходит ссылки от seed-URL, соблюдает robots.txt, ставит страницы в очередь и сохраняет HTML + метаданные.',
  },
  {
    id: 'parse',
    label: 'Парсинг',
    detail:
      'Удаляет разметку и рекламу, выделяет заголовки, определяет язык, нормализует текст (регистр, леммы).',
  },
  {
    id: 'index',
    label: 'Индекс',
    detail:
      'Строит инвертированный индекс: термин → список документов с позициями и весами (TF, поле title/h1).',
  },
  {
    id: 'rank',
    label: 'Ранжирование',
    detail:
      'BM25 и сотни сигналов: релевантность текста, ссылки, поведение, контекст пользователя → порядок выдачи.',
  },
  {
    id: 'serp',
    label: 'Выдача',
    detail: 'Сниппеты с подсветкой терминов, rich-блоки, фильтры; A/B-тесты улучшают "успешные" сессии.',
  },
];

function tokenize(raw) {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));
}

function buildIndex() {
  const map = new Map();
  for (const [docId, doc] of Object.entries(DOCS)) {
    doc.tokens.forEach((term, pos) => {
      if (!map.has(term)) map.set(term, []);
      map.get(term).push({docId, pos: pos + 1});
    });
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, 'ru'));
}

function bm25Score(queryTerms, docId, indexEntries) {
  const N = Object.keys(DOCS).length;
  let score = 0;
  for (const term of queryTerms) {
    const postings = indexEntries.find(([t]) => t === term)?.[1] ?? [];
    const df = postings.length;
    if (!df) continue;
    const tf = postings.filter((p) => p.docId === docId).length;
    if (!tf) continue;
    const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
    score += tf * idf;
  }
  return score;
}

function SearchPipelinePlayInner() {
  const [mode, setMode] = useState('index');
  const [pipeStep, setPipeStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [query, setQuery] = useState('кошка диван');

  const index = useMemo(() => buildIndex(), []);
  const queryTerms = useMemo(() => tokenize(query), [query]);

  const rankings = useMemo(() => {
    return Object.keys(DOCS)
      .map((docId) => ({
        docId,
        score: bm25Score(queryTerms, docId, index),
        text: DOCS[docId].text,
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [queryTerms, index]);

  const maxScore = rankings[0]?.score ?? 1;

  const playPipeline = useCallback(() => {
    setPlaying(true);
    setPipeStep(0);
    let i = 0;
    const tick = () => {
      setPipeStep(i);
      i += 1;
      if (i < PIPELINE.length) {
        setTimeout(tick, 900);
      } else {
        setTimeout(() => setPlaying(false), 400);
      }
    };
    tick();
  }, []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как устроена поисковая система"
        subtitle="Инвертированный индекс из статьи, упрощённый BM25 и пошаговый конвейер IR"
      >
        <div className={styles.tabs}>
          {[
            ['index', 'Индекс'],
            ['pipeline', 'Пайплайн'],
            ['rank', 'Ранжирование'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={clsx(styles.tab, mode === id && styles.tabActive)}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === 'index' && (
          <>
            <p className={styles.hint}>
              Три учебных документа из статьи. Запрос ищет термины в индексе — без полного перебора
              коллекции.
            </p>
            <label className="it-demo__label" htmlFor="ir-query">
              Запрос
            </label>
            <input
              id="ir-query"
              className={styles.queryInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="кошка диван"
            />
            <table className={styles.indexTable}>
              <thead>
                <tr>
                  <th>Токен</th>
                  <th>Документы (позиции)</th>
                </tr>
              </thead>
              <tbody>
                {index.map(([term, postings]) => {
                  const hit = queryTerms.includes(term);
                  return (
                    <tr key={term} className={hit ? styles.rowHit : undefined}>
                      <td>
                        <strong>{term}</strong>
                      </td>
                      <td>
                        {postings.map((p) => (
                          <span key={`${term}-${p.docId}`}>
                            {p.docId}[{p.pos}]{' '}
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={styles.hint}>
              Совпадения по запросу:{' '}
              {queryTerms.length
                ? queryTerms.join(', ')
                : '— введите слова без стоп-слов (на, за…)'}
            </p>
          </>
        )}

        {mode === 'pipeline' && (
          <>
            <div className={styles.playRow}>
              <button type="button" className={styles.playBtn} disabled={playing} onClick={playPipeline}>
                ▶ Пройти конвейер
              </button>
              <span className={styles.hint} style={{margin: 0}}>
                Клик по этапу — вручную
              </span>
            </div>
            <div className={styles.pipeline}>
              {PIPELINE.map((step, i) => (
                <React.Fragment key={step.id}>
                  <button
                    type="button"
                    className={clsx(styles.pipeStep, pipeStep === i && styles.pipeStepActive)}
                    onClick={() => !playing && setPipeStep(i)}
                    disabled={playing}
                  >
                    {step.label}
                  </button>
                  {i < PIPELINE.length - 1 && <span className={styles.pipeArrow}>→</span>}
                </React.Fragment>
              ))}
            </div>
            <div className={styles.pipeDetail}>
              <strong>{PIPELINE[pipeStep].label}.</strong> {PIPELINE[pipeStep].detail}
            </div>
          </>
        )}

        {mode === 'rank' && (
          <>
            <label className="it-demo__label" htmlFor="ir-query-rank">
              Запрос для BM25 (упрощённо)
            </label>
            <input
              id="ir-query-rank"
              className={styles.queryInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {rankings.length === 0 ? (
              <p className={styles.hint}>Нет документов с совпадающими терминами.</p>
            ) : (
              <ol className={styles.rankList}>
                {rankings.map((r, i) => (
                  <li key={r.docId} className={styles.rankItem}>
                    <span>
                      {i + 1}. <strong>{r.docId}</strong> — {r.text}
                    </span>
                    <div className={styles.rankBar}>
                      <div
                        className={styles.rankFill}
                        style={{width: `${(r.score / maxScore) * 100}%`}}
                      />
                    </div>
                    <code>{r.score.toFixed(2)}</code>
                  </li>
                ))}
              </ol>
            )}
            <p className={styles.hint}>
              В продакшене добавляют длину документа, веса полей, нейросетевой re-rank и
              гибрид с векторным поиском.
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default SearchPipelinePlayInner;
