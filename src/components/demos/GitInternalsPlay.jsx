import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GIT_TREE, flattenSelectable} from '@/components/shared/kb/gitInternalsEngine';
import styles from '@/components/demos/GitInternalsPlay.module.css';

function GitInternalsPlayInner() {
  const [selected, setSelected] = useState('head');
  const flat = useMemo(() => flattenSelectable(GIT_TREE), []);
  const node = flat.find((n) => n.id === selected) ?? flat[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Эксплорер .git"
        subtitle="Клик по элементу — что хранится внутри и зачем это нужно"
      >
        <div className={styles.layout}>
          <div className={styles.tree}>
            {flat.map((n) => (
              <button
                key={n.id}
                type="button"
                className={clsx(styles.treeBtn, selected === n.id && styles.treeBtnOn)}
                style={{paddingLeft: `${0.5 + n.depth * 0.55}rem`}}
                onClick={() => setSelected(n.id)}
              >
                {n.name}
              </button>
            ))}
          </div>
          <div className={styles.detail}>
            <h5>{node.name}</h5>
            <p>{node.desc}</p>
            {node.sample && <pre className={styles.pre}>{node.sample}</pre>}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GitInternalsPlayInner;
