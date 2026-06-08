import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {VCS_OPERATIONS} from '@/components/shared/kb/gitSvnCompareEngine';
import styles from '@/components/demos/GitSvnComparePlay.module.css';

function GitSvnComparePlayInner() {
  const [opId, setOpId] = useState('clone');
  const op = VCS_OPERATIONS.find((o) => o.id === opId) ?? VCS_OPERATIONS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Git и SVN: одна задача — разные команды"
        subtitle="Сопоставление из таблицы статьи в интерактивном виде"
      >
        <div className={styles.chips}>
          {VCS_OPERATIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              className={clsx(styles.chip, opId === o.id && styles.chipActive)}
              onClick={() => setOpId(o.id)}
            >
              {o.task}
            </button>
          ))}
        </div>

        <p className={styles.task}>{op.task}</p>

        <div className={styles.compare}>
          <div className={styles.col}>
            <span className={styles.colTitle}>Git</span>
            <pre>{op.git}</pre>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>SVN</span>
            <pre>{op.svn}</pre>
          </div>
        </div>

        <p className="it-demo__hint">{op.note}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default GitSvnComparePlayInner;
