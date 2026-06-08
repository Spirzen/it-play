import React, {useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ReactTreeDemo.module.css';

function Leaf({label, count}) {
  return (
    <div className={styles.leaf}>
      {label} — props.count={count}
    </div>
  );
}

function CounterBranch({onLog}) {
  const [n, setN] = useState(0);
  return (
    <div className={styles.branch}>
      <p>state: {n}</p>
      <button
        type="button"
        className="it-demo__btn it-demo__btn--primary"
        onClick={() => {
          setN((v) => v + 1);
          onLog(['CounterBranch', 'Child (props из state)']);
        }}
      >
        +1 (state)
      </button>
      <Leaf label="Child" count={n} />
    </div>
  );
}

function ReactTreeDemoInner() {
  const [propCount, setPropCount] = useState(0);
  const [log, setLog] = useState([]);

  const push = (names) => setLog((prev) => [...names.map((n) => `${n} перерисован`), ...prev].slice(0, 8));

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Дерево React" subtitle="state — ветка CounterBranch; props — только Leaf Sibling">
        <div className={styles.tree}>
          <div className={styles.rootNode}>App</div>
          <div className={styles.childRow}>
            <CounterBranch onLog={push} />
            <div className={styles.branch}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--secondary"
                onClick={() => {
                  setPropCount((c) => c + 1);
                  push(['Sibling']);
                }}
              >
                props +1
              </button>
              <Leaf label="Sibling" count={propCount} />
            </div>
          </div>
        </div>
        <ul className={styles.log}>
          {log.length === 0 ? <li className={styles.empty}>Нажмите кнопку</li> : log.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default ReactTreeDemoInner;
