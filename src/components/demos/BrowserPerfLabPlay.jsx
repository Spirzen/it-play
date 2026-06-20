import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayActionBar,
  PlayLog,
  PlayMetrics,
  PlayStack,
  PlayToggle,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

export default function BrowserPerfLabPlay() {
  const [lazyLoad, setLazyLoad] = useState(false);
  const [debounce, setDebounce] = useState(false);
  const [workers, setWorkers] = useState(false);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(null);

  const runBench = () => {
    setRunning(true);
    setTimeout(() => {
      let base = 4200;
      if (lazyLoad) base += 800;
      if (debounce) base += 600;
      if (workers) base += 500;
      setScore(base + Math.floor(Math.random() * 200));
      setRunning(false);
    }, 900);
  };

  const metrics = useMemo(() => {
    if (score == null) return null;
    const tti = Math.round(3200 - (lazyLoad ? 900 : 0) - (debounce ? 400 : 0));
    const js = Math.round(score / 10);
    return {tti, js, score};
  }, [score, lazyLoad, debounce]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Мини-бенчмарк в браузере" subtitle="JetStream-подобный тест: loop + DOM + оптимизации">
        <PlayStack>
          <PlayToggle label="Lazy-load изображений" hint="Меньше байт на первой отрисовке" checked={lazyLoad} onChange={setLazyLoad} />
          <PlayToggle label="Debounce input handlers" hint="Меньше лишних reflow" checked={debounce} onChange={setDebounce} />
          <PlayToggle label="Web Worker для тяжёлых задач" hint="Main thread свободнее" checked={workers} onChange={setWorkers} />

          <PlayActionBar>
            <button type="button" className="it-demo__btn it-demo__btn--primary" disabled={running} onClick={runBench}>
              {running ? 'Тест…' : 'Запустить бенчмарк'}
            </button>
          </PlayActionBar>

          {metrics && (
            <PlayMetrics
              grid
              items={[
                {label: 'JetStream score', value: metrics.score, max: 6000, display: String(metrics.score)},
                {label: 'TTI (оценка)', value: metrics.tti, max: 4000, display: `${metrics.tti} ms`},
                {label: 'JS ops/s ×100', value: metrics.js, max: 600},
              ]}
            />
          )}

          <PlayLog
            lines={
              score == null
                ? ['Включите оптимизации и запустите тест — сравните TTI и score']
                : [
                    `Score: ${score}`,
                    `TTI ~${metrics.tti} ms`,
                    lazyLoad ? '✓ Lazy load снизил начальную загрузку' : '',
                    debounce ? '✓ Debounce уменьшил лишние reflow' : '',
                    workers ? '✓ Worker разгрузил main thread' : '',
                  ].filter(Boolean)
            }
          />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
