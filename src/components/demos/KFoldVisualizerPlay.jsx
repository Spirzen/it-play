import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/KFoldVisualizerPlay.module.css';

const POINTS = Array.from({length: 15}, (_, i) => i);

function KFoldVisualizerPlayInner() {
  const [k, setK] = useState(5);
  const [fold, setFold] = useState(0);

  const folds = useMemo(() => {
    const size = Math.ceil(POINTS.length / k);
    return Array.from({length: k}, (_, fi) => POINTS.slice(fi * size, (fi + 1) * size));
  }, [k]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="K-fold CV" subtitle="Validation fold выделен — train остальные точки">
        <div className={shared.stack}>
          <div>
            <p className={shared.sectionTitle}>Число фолдов (k)</p>
            <div className={shared.chipRow}>
              {[3, 5, 10].map((n) => (
                <button key={n} type="button" className={clsx(shared.chip, k === n && shared.chipActive)} onClick={() => { setK(n); setFold(0); }}>
                  k = {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={shared.sectionTitle}>Текущий fold</p>
            <div className={shared.chipRowScroll}>
              {folds.map((_, i) => (
                <button key={i} type="button" className={clsx(shared.chip, fold === i && shared.chipActive)} onClick={() => setFold(i)}>
                  Fold {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            {POINTS.map((p) => {
              const inFold = folds[fold]?.includes(p);
              return (
                <div key={p} className={clsx(styles.point, inFold ? styles.val : styles.train)} title={inFold ? 'validation' : 'train'}>
                  {p + 1}
                </div>
              );
            })}
          </div>
        </div>

        <p className={shared.hint}>
          Fold {fold + 1}: <strong>{folds[fold]?.length ?? 0}</strong> val · <strong>{POINTS.length - (folds[fold]?.length ?? 0)}</strong> train. Test-set остаётся отдельно.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default KFoldVisualizerPlayInner;
