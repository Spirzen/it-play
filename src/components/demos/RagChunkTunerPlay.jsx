import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/RagChunkTunerPlay.module.css';

const DOC =
  'Компания Spirzen внедрила RAG для поддержки. Чанки индексируются в векторной БД. ' +
  'Размер чанка влияет на recall: слишком мелкие теряют контекст, крупные — шум. ' +
  'Overlap помогает не разрезать предложение пополам. Golden set проверяет попадание ответа.';

const QUESTIONS = [
  {q: 'Что влияет на recall?', needle: 'recall'},
  {q: 'Зачем нужен overlap?', needle: 'Overlap'},
  {q: 'Где хранятся чанки?', needle: 'векторной'},
];

function chunkText(text, size, overlap) {
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + size);
    chunks.push(text.slice(i, end));
    if (end >= text.length) break;
    i += Math.max(1, size - overlap);
  }
  return chunks;
}

function RagChunkTunerPlayInner() {
  const [chunkSize, setChunkSize] = useState(80);
  const [overlap, setOverlap] = useState(20);

  const chunks = useMemo(() => chunkText(DOC, chunkSize, overlap), [chunkSize, overlap]);
  const results = useMemo(
    () => QUESTIONS.map((q) => chunks.some((c) => c.toLowerCase().includes(q.needle.toLowerCase()))),
    [chunks],
  );
  const recall = results.filter(Boolean).length / QUESTIONS.length;

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Тюнер чанков RAG" subtitle="Размер и overlap — влияние на recall mini golden set">
        <label className={shared.sliderField}>
          <div className={shared.sliderHead}>
            <span>chunk size</span>
            <span className={shared.sliderValue}>{chunkSize}</span>
          </div>
          <input className={shared.range} type="range" min="40" max="160" step="10" value={chunkSize} onChange={(e) => setChunkSize(+e.target.value)} />
        </label>
        <label className={shared.sliderField}>
          <div className={shared.sliderHead}>
            <span>overlap</span>
            <span className={shared.sliderValue}>{overlap}</span>
          </div>
          <input className={shared.range} type="range" min="0" max="60" step="5" value={overlap} onChange={(e) => setOverlap(+e.target.value)} />
        </label>

        <div className={shared.statGrid}>
          <div className={shared.statBox}>
            <span className={shared.statValue}>{(recall * 100).toFixed(0)}%</span>
            <span className={shared.statLabel}>recall</span>
          </div>
          <div className={shared.statBox}>
            <span className={shared.statValue}>{chunks.length}</span>
            <span className={shared.statLabel}>чанков</span>
          </div>
        </div>

        <div className={clsx(shared.scrollArea, styles.chunks)}>
          {chunks.map((c, i) => (
            <div key={i} className={styles.chunk}>
              <span className={styles.chunkId}>#{i + 1}</span> {c}
            </div>
          ))}
        </div>

        <ul className={styles.qList}>
          {QUESTIONS.map((q, i) => (
            <li key={q.q} className={results[i] ? styles.hit : styles.miss}>
              {q.q} — {results[i] ? 'найдено' : 'промах'}
            </li>
          ))}
        </ul>

        <p className={shared.hint}>Подберите размер так, чтобы ключевые фразы не разрезались между чанками.</p>
      </DemoCard>
    </DemoShell>
  );
}

export default RagChunkTunerPlayInner;
