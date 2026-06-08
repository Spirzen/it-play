import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CTE_CHAIN,
  buildRecursiveTree,
  computeCteStep,
} from '@/components/shared/kb/sqlCteEngine';
import styles from '@/components/demos/SqlCtePlay.module.css';

function SqlCtePlayInner() {
  const [mode, setMode] = useState('chain');
  const [stepId, setStepId] = useState('final');

  const step = CTE_CHAIN.find((s) => s.id === stepId) ?? CTE_CHAIN[3];
  const data = useMemo(() => computeCteStep(stepId), [stepId]);
  const tree = useMemo(() => buildRecursiveTree(), []);

  const fullSql =
    mode === 'chain'
      ? CTE_CHAIN.map((s) => s.sql).join('\n')
      : `WITH RECURSIVE иерархия_отделов AS (
  SELECT department_id, department_name, parent_department_id,
         department_name AS full_path, 1 AS level
  FROM departments WHERE parent_department_id IS NULL
  UNION ALL
  SELECT d.*, CONCAT(h.full_path, ' -> ', d.department_name), h.level + 1
  FROM departments d
  INNER JOIN иерархия_отделов h ON d.parent_department_id = h.department_id
)
SELECT * FROM иерархия_отделов ORDER BY full_path;`;

  return (
    <DemoShell>
      <DemoCard
        title="Общие табличные выражения (CTE)"
        subtitle="Цепочка WITH и рекурсивный обход иерархии — промежуточные результаты на каждом шаге"
      >
        <div className={styles.modeTabs}>
          <button
            type="button"
            className={clsx(styles.modeTab, mode === 'chain' && styles.modeTabActive)}
            onClick={() => setMode('chain')}
          >
            Цепочка CTE
          </button>
          <button
            type="button"
            className={clsx(styles.modeTab, mode === 'recursive' && styles.modeTabActive)}
            onClick={() => setMode('recursive')}
          >
            WITH RECURSIVE
          </button>
        </div>

        <div className={styles.sqlBox}>{fullSql}</div>

        {mode === 'chain' ? (
          <>
            <div className={styles.pipeline}>
              {CTE_CHAIN.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && <span className={styles.pipeArrow}>→</span>}
                  <button
                    type="button"
                    className={clsx(styles.pipeNode, stepId === s.id && styles.pipeNodeActive)}
                    onClick={() => setStepId(s.id)}
                  >
                    {s.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <p className="it-demo__hint" style={{marginTop: 0, marginBottom: '0.5rem'}}>
              {step.describe} · строк: <strong>{data.rows.length}</strong>
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {data.columns.map((c) => (
                      <th key={c}>{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, ri) => (
                    <tr key={ri}>
                      {data.columns.map((c) => (
                        <td key={c}>{row[c] ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <p className="it-demo__hint" style={{marginTop: 0, marginBottom: '0.5rem'}}>
              Якорный SELECT + UNION ALL: на каждой итерации добавляются дочерние отделы. Уровней:{' '}
              <strong>{Math.max(...tree.map((t) => t.level)) + 1}</strong>
            </p>
            <div className={styles.tableWrap}>
              {tree.map((row) => (
                <div key={row.department_id} className={styles.treeRow}>
                  <span className={styles.treeLevel}>L{row.level}</span>{' '}
                  {row.indent}
                  <strong>{row.department_name}</strong>
                  <span style={{color: 'var(--ifm-color-emphasis-600)', marginLeft: '0.5rem'}}>
                    {row.full_path}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default SqlCtePlayInner;
