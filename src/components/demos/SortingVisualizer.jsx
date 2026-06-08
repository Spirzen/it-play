import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/SortingVisualizer.module.css';

function shuffleArr(n = 8) {
  const a = Array.from({length: n}, (_, i) => 20 + Math.floor(Math.random() * 80));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SortingVisualizerInner() {
  const [arr, setArr] = useState(() => shuffleArr());
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const [done, setDone] = useState(false);

  const reset = useCallback(() => {
    setArr(shuffleArr());
    setI(0);
    setJ(0);
    setSwapped(false);
    setDone(false);
  }, []);

  const nextStep = () => {
    if (done) return;
    let ni = i;
    let nj = j + 1;
    let next = [...arr];
    let didSwap = false;
    if (nj >= next.length - i) {
      ni = i + 1;
      nj = 0;
      if (ni >= next.length - 1) {
        setDone(true);
        setI(ni);
        setJ(0);
        setSwapped(false);
        return;
      }
    }
    if (next[nj] > next[nj + 1]) {
      [next[nj], next[nj + 1]] = [next[nj + 1], next[nj]];
      didSwap = true;
    }
    setArr(next);
    setI(ni);
    setJ(nj);
    setSwapped(didSwap);
  };

  const max = Math.max(...arr, 1);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Bubble sort" subtitle="Пошаговое сравнение соседних элементов">
        <div className={styles.chart} aria-label="Столбчатая диаграмма">
          {arr.map((v, idx) => (
            <div
              key={idx}
              className={clsx(
                styles.bar,
                idx === j && styles.barCompare,
                idx === j + 1 && styles.barCompare,
                swapped && (idx === j || idx === j + 1) && styles.barSwap,
              )}
              style={{height: `${(v / max) * 100}%`}}
              title={String(v)}
            />
          ))}
        </div>
        <p className={styles.status}>
          {done ? 'Готово — массив отсортирован' : `Проход ${i + 1}, сравниваем индексы ${j} и ${j + 1}`}
        </p>
        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={nextStep} disabled={done}>
            Следующий шаг
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сброс / перемешать
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SortingVisualizerInner;
