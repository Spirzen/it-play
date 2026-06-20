import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdHint, CdMono, CdStack, CdToolbar} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const INITIAL = {
  working: {README: 'WIP', 'app.js': 'console.log(1)'},
  index: {},
  head: {README: 'Initial', 'app.js': 'console.log(0)'},
};

function GitThreeTreesPlayInner() {
  const [trees, setTrees] = useState(INITIAL);
  const [log, setLog] = useState([]);

  const editWorking = () => {
    setTrees((t) => ({
      ...t,
      working: {...t.working, 'app.js': 'console.log(2) // edited'},
    }));
    setLog((l) => [...l, 'edit app.js in Working Directory']);
  };

  const stage = () => {
    setTrees((t) => ({
      ...t,
      index: {...t.index, 'app.js': t.working['app.js']},
    }));
    setLog((l) => [...l, 'git add app.js → Index updated']);
  };

  const commit = () => {
    setTrees((t) => ({
      ...t,
      head: {...t.head, ...t.index},
      index: {},
    }));
    setLog((l) => [...l, 'git commit → HEAD snapshot updated, Index cleared']);
  };

  const reset = () => {
    setTrees(INITIAL);
    setLog([]);
  };

  const renderTree = (name, data, tone) => (
    <div className={clsx(styles.gitTree, styles[`gitTree_${tone}`])}>
      <p className={styles.sectionLabel}>{name}</p>
      <CdMono>{Object.keys(data).length ? Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n') : '(пусто)'}</CdMono>
    </div>
  );

  return (
    <DemoShell>
      <DemoCard title="Git: три дерева" subtitle="Working Directory → Index → HEAD">
        <CdStack>
          <div className={styles.gitTreesGrid}>
            {renderTree('Working Directory', trees.working, 'work')}
            {renderTree('Index (Staging)', trees.index, 'index')}
            {renderTree('HEAD (last commit)', trees.head, 'head')}
          </div>

          <CdToolbar>
            <CdBtn onClick={editWorking}>Изменить app.js</CdBtn>
            <CdBtn onClick={stage}>git add</CdBtn>
            <CdBtn variant="primary" onClick={commit}>
              git commit
            </CdBtn>
            <CdBtn onClick={reset}>Сброс</CdBtn>
          </CdToolbar>

          {log.length ? <CdMono>{log.join('\n')}</CdMono> : <CdHint>Измените файл, добавьте в index и закоммитьте — увидите поток данных между деревьями.</CdHint>}
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default GitThreeTreesPlayInner;
