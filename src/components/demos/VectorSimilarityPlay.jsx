import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {EMBEDDINGS, METRICS, nearest} from '@/components/shared/kb/vectorSimilarityEngine';
import styles from '@/components/demos/VectorSimilarityPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const GROUP_CLASS = {
  royal: styles.groupRoyal,
  fruit: styles.groupFruit,
  transport: styles.groupTransport,
};

function VectorSimilarityPlayInner() {
  const [queryId, setQueryId] = useState('king');
  const [metricId, setMetricId] = useState('cosine');
  const neighbors = useMemo(() => nearest(queryId, 4), [queryId]);
  const neighborIds = new Set(neighbors.map((n) => n.id));
  const metric = METRICS.find((m) => m.id === metricId) ?? METRICS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Векторный поиск: близость в пространстве эмбеддингов"
        subtitle="Похожие по смыслу объекты лежат рядом; запрос ищет k ближайших соседей по метрике расстояния"
      >
        <label className="it-demo__label">Запрос (эмбеддинг)</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {EMBEDDINGS.map((e) => (
            <button
              key={e.id}
              type="button"
              className={clsx(toolStyles.chip, queryId === e.id && toolStyles.chipActive)}
              onClick={() => setQueryId(e.id)}
            >
              {e.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label">Метрика</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {METRICS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(toolStyles.chip, metricId === m.id && toolStyles.chipActive)}
              onClick={() => setMetricId(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="it-demo__hint">{metric.desc}</p>

        <div className={styles.layout}>
          <div className={styles.canvasWrap}>
            {EMBEDDINGS.map((e) => (
              <React.Fragment key={e.id}>
                <button
                  type="button"
                  className={clsx(
                    styles.dot,
                    GROUP_CLASS[e.group],
                    e.id === queryId && styles.dotQuery,
                    neighborIds.has(e.id) && styles.dotNeighbor,
                  )}
                  style={{left: `${e.x * 100}%`, top: `${(1 - e.y) * 100}%`}}
                  onClick={() => setQueryId(e.id)}
                  title={e.label}
                  aria-label={e.label}
                />
                <span
                  className={styles.label}
                  style={{left: `${e.x * 100}%`, top: `${(1 - e.y) * 100}%`}}
                >
                  {e.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className={styles.results}>
            <p className="it-demo__label">Top-{neighbors.length} соседей</p>
            {neighbors.map((n) => (
              <div key={n.id} className={styles.resultRow}>
                <span>{n.label}</span>
                <span>{(n.score * 100).toFixed(1)}%</span>
              </div>
            ))}
            <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>
              Одна модель эмбеддингов для индекса и запроса — иначе векторы из разных пространств
              несопоставимы.
            </p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default VectorSimilarityPlayInner;
