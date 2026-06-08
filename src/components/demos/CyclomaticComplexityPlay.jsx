import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  COMPLEXITY_BLOCKS,
  REFACTOR_HINT,
  buildPseudoCode,
  calcCyclomatic,
  complexityZone,
  minTestsNeeded,
} from '@/components/shared/kb/cyclomaticEngine';
import styles from '@/components/demos/CyclomaticComplexityPlay.module.css';

function CyclomaticComplexityPlayInner() {
  const [active, setActive] = useState(['if', 'while']);

  const complexity = useMemo(() => calcCyclomatic(active), [active]);
  const zone = complexityZone(complexity);
  const code = useMemo(() => buildPseudoCode(active), [active]);

  const toggle = (id) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return [...next];
    });
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Цикломатическая сложность"
        subtitle="Добавляйте конструкции — счётчик M и зона риска обновляются сразу"
      >
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricVal}>{complexity}</span>
            <span className={styles.metricLbl}>M (сложность)</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricVal}>{minTestsNeeded(complexity)}</span>
            <span className={styles.metricLbl}>мин. сценариев для ветвей</span>
          </div>
          <div className={clsx(styles.zoneBadge, styles[zone.className])}>{zone.label}</div>
        </div>
        <p className="it-demo__hint">{zone.hint}</p>

        <div className={styles.blockGrid}>
          {COMPLEXITY_BLOCKS.map((b) => (
            <button
              key={b.id}
              type="button"
              className={clsx(styles.blockBtn, active.includes(b.id) && styles.blockBtnOn)}
              onClick={() => toggle(b.id)}
            >
              <strong>{b.label}</strong>
              <span>{b.points ? `+${b.points}` : '±0'}</span>
            </button>
          ))}
        </div>

        <pre className={styles.pre}>{code}</pre>

        {complexity > 10 && (
          <div className={styles.refactorTip}>
            <strong>Рефакторинг:</strong> {REFACTOR_HINT}
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default CyclomaticComplexityPlayInner;
