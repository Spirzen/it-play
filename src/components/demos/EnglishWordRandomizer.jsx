import React, {useCallback, useEffect, useState} from 'react';

import Link from '@/components/shared/KbLink';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoSkeletonFallback} from '@/components/shared/demoFallback';
import {extractTableVocabulary} from '@/components/shared/kb/articleExtract';
import {mergeVocabulary, shuffleArray} from '@/components/shared/kb/englishVocabulary';
import styles from '@/components/shared/kb/articleWidgets.module.css';

function EnglishWordRandomizerInner() {
  const [pool, setPool] = useState([]);
  const [items, setItems] = useState([]);
  const [cols, setCols] = useState(2);
  const [ready, setReady] = useState(false);

  const pickItems = useCallback((data, columnCount) => {
    const count = columnCount >= 3 ? 1 : 5;
    return shuffleArray(data).slice(0, Math.min(count, data.length));
  }, []);

  const refresh = useCallback(() => {
    const {items: tableItems, cols: columnCount} = extractTableVocabulary();
    const merged = mergeVocabulary(
      tableItems.map((i) => ({term: i.term, definition: i.definition})),
    );
    if (!merged.length) {
      setPool([]);
      setItems([]);
      setCols(columnCount || 2);
      setReady(true);
      return;
    }
    setPool(merged);
    setCols(columnCount >= 3 ? 3 : 2);
    setItems(pickItems(merged, columnCount));
    setReady(true);
  }, [pickItems]);

  useEffect(() => {
    const timer = window.setTimeout(refresh, 150);
    return () => window.clearTimeout(timer);
  }, [refresh]);

  if (!ready) {
    return demoSkeletonFallback();
  }

  if (!pool.length) {
    return (
      <DemoShell>
        <DemoCard title="Тренажёр терминов" subtitle="Словарь пока недоступен на этой странице.">
          <p className={styles.emptyState}>
            Откройте{' '}
            <Link to="/encyclopedia/1-basics/1-30-angliyskiy-yazyk/2">
              статью со словарём
            </Link>{' '}
            или полный тренажёр в{' '}
            <Link to="/lab/Тренажеры/1#practice/english">лаборатории</Link>.
          </p>
        </DemoCard>
      </DemoShell>
    );
  }

  const countLabel = cols >= 3 ? '1 термин' : '5 терминов';

  return (
    <DemoShell>
      <DemoCard
        title="Быстрый просмотр терминов"
        subtitle="Случайная подборка из общего словаря — раскройте карточку, чтобы увидеть перевод."
      >
        <span className={styles.poolBadge}>
          В словаре: {pool.length} · показано: {items.length}
        </span>

        <button
          type="button"
          className={`it-demo__btn it-demo__btn--primary ${styles.btnBlock}`}
          onClick={refresh}
        >
          Новый набор ({countLabel})
        </button>

        <div className={styles.flashList}>
          {items.map((item) => (
            <details key={`${item.term}-${item.definition.slice(0, 20)}`} className={styles.flashCard}>
              <summary className={styles.flashSummary}>
                <span className={styles.flashTerm}>{item.term}</span>
                <span className={styles.flashHint} aria-hidden>
                  ▼
                </span>
              </summary>
              <div className={styles.flashAnswer}>{item.definition}</div>
            </details>
          ))}
        </div>
        <p className={styles.footnote}>
          Полный тренажёр с карточками, викториной и прогрессом — ниже на странице или в{' '}
          <Link to="/lab/Тренажеры/1#practice/english">лаборатории</Link>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default EnglishWordRandomizerInner;
