import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/SearchVisualizer.module.css';

const DATA = [3, 7, 12, 18, 24, 31, 40, 52];

function SearchVisualizerInner() {
  const [mode, setMode] = useState('linear');
  const [target, setTarget] = useState(24);
  const [step, setStep] = useState(-1);
  const [found, setFound] = useState(false);
  const [range, setRange] = useState([0, DATA.length - 1]);

  const reset = useCallback(() => {
    setStep(-1);
    setFound(false);
    setRange([0, DATA.length - 1]);
  }, []);

  const nextStep = () => {
    if (found) return;
    if (mode === 'linear') {
      const next = step + 1;
      if (next >= DATA.length) return;
      setStep(next);
      if (DATA[next] === target) setFound(true);
    } else {
      const [lo, hi] = range;
      if (lo > hi) return;
      const mid = Math.floor((lo + hi) / 2);
      setStep(mid);
      if (DATA[mid] === target) {
        setFound(true);
        return;
      }
      if (DATA[mid] < target) setRange([mid + 1, hi]);
      else setRange([lo, mid - 1]);
    }
  };

  const highlight = (idx) => {
    if (found && DATA[idx] === target) return styles.cellFound;
    if (mode === 'linear' && idx === step) return styles.cellActive;
    if (mode === 'binary') {
      if (idx === step) return styles.cellActive;
      const [lo, hi] = range;
      if (idx >= lo && idx <= hi && step >= 0) return styles.cellRange;
    }
    return '';
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Поиск в массиве" subtitle="Линейный O(n) vs бинарный O(log n) на отсортированных данных">
        <div className={styles.toolbar}>
          <button
            type="button"
            className={clsx('it-demo__btn', mode === 'linear' && 'it-demo__btn--primary')}
            onClick={() => {
              setMode('linear');
              reset();
            }}
          >
            Линейный
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn', mode === 'binary' && 'it-demo__btn--primary')}
            onClick={() => {
              setMode('binary');
              reset();
            }}
          >
            Бинарный
          </button>
        </div>
        <label className={styles.control}>
          <span className="it-demo__label">Искомое: {target}</span>
          <select className="it-demo__select" value={target} onChange={(e) => { setTarget(Number(e.target.value)); reset(); }}>
            {DATA.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
        <div className={styles.row}>
          {DATA.map((v, i) => (
            <div key={i} className={clsx(styles.cell, highlight(i))}>
              {v}
            </div>
          ))}
        </div>
        <p className={styles.status}>
          {found ? `Найдено: ${target}` : step < 0 ? 'Нажмите "Шаг"' : `Шаг ${mode === 'linear' ? step + 1 : 'mid=' + step}`}
        </p>
        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={nextStep} disabled={found}>
            Шаг
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SearchVisualizerInner;
