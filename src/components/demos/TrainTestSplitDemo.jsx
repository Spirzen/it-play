import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/TrainTestSplitDemo.module.css';

const POINTS = [
  {id: 1, x: 12, y: 70},
  {id: 2, x: 28, y: 55},
  {id: 3, x: 45, y: 40},
  {id: 4, x: 62, y: 62},
  {id: 5, x: 78, y: 35},
  {id: 6, x: 88, y: 50},
];

function TrainTestSplitDemoInner() {
  const [split, setSplit] = useState({});
  const counts = useMemo(() => {
    const train = Object.values(split).filter((v) => v === 'train').length;
    const test = Object.values(split).filter((v) => v === 'test').length;
    return {train, test};
  }, [split]);

  const toggle = (id) => {
    setSplit((s) => {
      const cur = s[id];
      const next = cur === 'train' ? 'test' : cur === 'test' ? undefined : 'train';
      const copy = {...s};
      if (next) copy[id] = next;
      else delete copy[id];
      return copy;
    });
  };

  const overfitHint =
    counts.train >= 5 && counts.test <= 1
      ? 'Мало test — риск переобучения: модель "запомнит" train.'
      : counts.test >= 2
        ? 'Есть test-выборка — можно честно оценить обобщение.'
        : 'Кликните точки: train (синий) / test (оранжевый).';

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Train / Test split" subtitle="Назначьте точки — смотрите баланс выборок">
        <svg className={styles.svg} viewBox="0 0 100 80" role="img" aria-label="Scatter plot">
          {POINTS.map((p) => {
            const role = split[p.id];
            return (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r="5"
                className={clsx(
                  styles.dot,
                  role === 'train' && styles.dotTrain,
                  role === 'test' && styles.dotTest,
                )}
                onClick={() => toggle(p.id)}
              />
            );
          })}
        </svg>
        <p className={styles.legend}>
          Train: {counts.train} · Test: {counts.test}
        </p>
        <p className={styles.hint}>{overfitHint}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default TrainTestSplitDemoInner;
