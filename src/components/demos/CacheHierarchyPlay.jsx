import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from './dataBasicsPlay.module.css';

const RAM = [
  {idx: 0, data: 'Кот'},
  {idx: 1, data: 'Собака'},
  {idx: 2, data: 'Гусь'},
];

const LEVELS = [
  {id: 'L1', label: 'L1', size: '32–64 КБ', latency: '~1 такт', color: '#2e7d32'},
  {id: 'L2', label: 'L2', size: '256 КБ – 1 МБ', latency: '~4–10 тактов', color: '#1565c0'},
  {id: 'L3', label: 'L3', size: '2–64 МБ', latency: '~20–50 тактов', color: '#7b1fa2'},
  {id: 'RAM', label: 'ОЗУ', size: 'ГБ', latency: 'сотни тактов', color: '#c62828'},
];

const POLICIES = [
  {id: 'lru', name: 'LRU', desc: 'Вытесняется запись, к которой дольше всего не обращались.'},
  {id: 'lfu', name: 'LFU', desc: 'Удаляется самая редко используемая строка.'},
  {id: 'fifo', name: 'FIFO', desc: 'Первым пришёл — первым вытеснен (простая очередь).'},
];

function CacheHierarchyPlayInner() {
  const [requestIdx, setRequestIdx] = useState(2);
  const [hitLevel, setHitLevel] = useState(null);
  const [stats, setStats] = useState({hits: 0, misses: 0});
  const [policyId, setPolicyId] = useState('lru');
  const [cacheLines, setCacheLines] = useState([
    {tag: 2, data: 'Гусь'},
    {tag: 0, data: 'Кот'},
  ]);

  const simulate = () => {
    setHitLevel(null);
    const idx = requestIdx;
    if (cacheLines.some((l) => l.tag === idx)) {
      window.setTimeout(() => {
        setHitLevel('L1');
        setStats((s) => ({...s, hits: s.hits + 1}));
      }, 200);
      return;
    }
    let step = 0;
    const order = ['L1', 'L2', 'L3', 'RAM'];
    const tick = () => {
      setHitLevel(order[step]);
      step += 1;
      if (step < order.length) {
        window.setTimeout(tick, 450);
      } else {
        setStats((s) => ({...s, misses: s.misses + 1}));
        const entry = RAM.find((r) => r.idx === idx);
        setCacheLines((prev) => [{tag: idx, data: entry?.data ?? '?'}, ...prev].slice(0, 2));
      }
    };
    window.setTimeout(tick, 200);
  };

  const policy = POLICIES.find((p) => p.id === policyId) ?? POLICIES[0];
  const total = stats.hits + stats.misses;
  const hitRate = total ? Math.round((stats.hits / total) * 100) : 0;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Иерархия кэша" subtitle="Запрос записи из ОЗУ: сначала L1, при промахе — L2, L3, затем RAM.">
        <label className="it-demo__label">Индекс в основной памяти (тег)</label>
        <div className={styles.tabs}>
          {RAM.map((r) => (
            <button
              key={r.idx}
              type="button"
              className={clsx(styles.tab, requestIdx === r.idx && styles.tabActive)}
              onClick={() => setRequestIdx(r.idx)}
            >
              [{r.idx}] {r.data}
            </button>
          ))}
        </div>

        <div className={styles.cacheStack}>
          {LEVELS.map((lv) => (
            <div
              key={lv.id}
              className={clsx(
                styles.cacheLevel,
                hitLevel === lv.id && styles.cacheLevelHit,
                hitLevel && hitLevel !== lv.id && lv.id !== 'RAM' && styles.cacheLevelMiss,
              )}
            >
              <strong style={{minWidth: '2.5rem'}}>{lv.label}</strong>
              <span>{lv.size}</span>
              <span style={{marginLeft: 'auto', color: 'var(--ifm-color-content-secondary)'}}>{lv.latency}</span>
            </div>
          ))}
        </div>

        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={simulate} style={{marginTop: '0.35rem'}}>
          Запросить запись [{requestIdx}]
        </button>

        <div className={styles.statGrid} style={{marginTop: '0.65rem'}}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{stats.hits}</span>
            <span className={styles.statLbl}>hit</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{stats.misses}</span>
            <span className={styles.statLbl}>miss</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{hitRate}%</span>
            <span className={styles.statLbl}>попаданий</span>
          </div>
        </div>

        <p className={styles.panelTitle} style={{marginTop: '0.75rem'}}>
          Строки кэша (тег → данные)
        </p>
        <ul className={styles.metaList}>
          {cacheLines.map((line, i) => (
            <li key={`${line.tag}-${i}`} className={styles.metaItem}>
              <span className={styles.metaKey}>тег {line.tag}</span>
              <span className={styles.metaVal}>{line.data}</span>
            </li>
          ))}
        </ul>
      </DemoCard>

      <DemoCard title="Политика замены" subtitle="При переполнении кэша одна строка освобождается под новую.">
        <div className={styles.tabs}>
          {POLICIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.tab, policyId === p.id && styles.tabActive)}
              onClick={() => setPolicyId(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className={styles.hint}>{policy.desc}</p>
        <p className={styles.hint}>
          Тот же принцип у page cache в ОС, кэша браузера и DNS: быстрая копия + риск устаревания (TTL, ETag,
          инвалидация).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CacheHierarchyPlayInner;
