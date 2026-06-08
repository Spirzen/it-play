import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {SYNTAX_COMPARE_ROWS} from '@/components/shared/kb/beginnerWebStackData';
import styles from '@/components/demos/SyntaxComparePlay.module.css';

export function SyntaxComparePlayInner({compact = false, embedded = false}) {
  const [rowId, setRowId] = useState('hello');
  const row = SYNTAX_COMPARE_ROWS.find((r) => r.id === rowId) ?? SYNTAX_COMPARE_ROWS[0];

  const body = (
    <>
        <div className={styles.rowBar}>
          {SYNTAX_COMPARE_ROWS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(
                'it-demo__btn it-demo__btn--sm',
                rowId !== r.id && 'it-demo__btn--secondary',
              )}
              onClick={() => setRowId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className={styles.grid}>
          <div className={clsx(styles.col, styles.colJs)}>
            <div className={styles.colHead}>JavaScript</div>
            <pre>{row.js}</pre>
          </div>
          <div className={clsx(styles.col, styles.colPy)}>
            <div className={styles.colHead}>Python</div>
            <pre>{row.python}</pre>
          </div>
          <div className={clsx(styles.col, styles.colPhp)}>
            <div className={styles.colHead}>PHP</div>
            <pre>{row.php}</pre>
          </div>
        </div>
        <p className={styles.hint}>
          <strong>{row.label}:</strong> {row.hint}
        </p>
    </>
  );

  if (embedded) {
    return <div className={styles.root}>{body}</div>;
  }

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={compact ? 'Синтаксис: JS / Python / PHP' : 'Одна идея — три синтаксиса'}
        subtitle="Одна и та же логика — разный синтаксис"
      >
        {body}
      </DemoCard>
    </DemoShell>
  );
}

export default SyntaxComparePlayInner;
