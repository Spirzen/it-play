import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {QUERY_PRESETS, SAMPLE_DOCS, runFind} from '@/components/shared/kb/mongoExplorerEngine';
import styles from '@/components/demos/MongoDbExplorerPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function MongoDbExplorerPlayInner() {
  const [queryId, setQueryId] = useState('all');
  const result = useMemo(() => runFind(SAMPLE_DOCS, queryId), [queryId]);
  const matchedIds = new Set(result.matched.map((d) => d._id));

  return (
    <DemoShell>
      <DemoCard
        title="MongoDB: иерархия и schema-on-read"
        subtitle="Коллекция без жёсткой схемы — каждый документ может иметь свой набор полей; find() отбирает по предикату"
      >
        <div className={styles.layout}>
          <div className={styles.tree}>
            <div>cluster0</div>
            <div> └─ shop_db</div>
            <div>     └─ <span className={styles.treeActive}>products</span> (3 docs)</div>
            <div>     └─ orders</div>
            <div> └─ analytics_db</div>
          </div>

          <div>
            <label className="it-demo__label">Запрос</label>
            <div className={toolStyles.chips}>
              {QUERY_PRESETS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  className={clsx(toolStyles.chip, queryId === q.id && toolStyles.chipActive)}
                  onClick={() => setQueryId(q.id)}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className={styles.filterBox}>{result.filterText}</div>

            <div className={styles.docGrid}>
              {SAMPLE_DOCS.map((doc) => (
                <pre
                  key={doc._id}
                  className={clsx(
                    styles.docCard,
                    !matchedIds.has(doc._id) && queryId !== 'all' && styles.docDim,
                    matchedIds.has(doc._id) && queryId !== 'all' && styles.docMatch,
                  )}
                >
                  {JSON.stringify(doc, null, 2)}
                </pre>
              ))}
            </div>

            <div className={styles.badgeRow}>
              <span className={styles.badge}>Найдено: {result.matched.length}</span>
              <span className={styles.badge}>BSON · _id обязателен</span>
              <span className={styles.badge}>Гибкая схема по записи</span>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MongoDbExplorerPlayInner;
