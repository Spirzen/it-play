import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CHEAT_CATEGORIES} from '@/components/shared/kb/devOpsCheatSheetEngine';
import styles from '@/components/demos/DevOpsCheatSheetPlay.module.css';

function DevOpsCheatSheetPlayInner() {
  const [categoryId, setCategoryId] = useState('docker');
  const [activeIdx, setActiveIdx] = useState(0);
  const [ran, setRan] = useState(false);

  const category = CHEAT_CATEGORIES.find((c) => c.id === categoryId);
  const command = category.commands[activeIdx];

  const run = () => setRan(true);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Шпаргалка: Git · Docker · Kubernetes · CI/CD"
        subtitle="Выберите категорию и команду — увидите типичный вывод в терминале."
      >
        <div className={styles.layout}>
          <div>
            {CHEAT_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={clsx(styles.catBtn, categoryId === c.id && styles.catActive)}
                onClick={() => {
                  setCategoryId(c.id);
                  setActiveIdx(0);
                  setRan(false);
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div>
            <div className={styles.cmdList}>
              {category.commands.map((item, i) => (
                <button
                  key={item.cmd}
                  type="button"
                  className={clsx(styles.cmdRow, activeIdx === i && styles.cmdRowActive)}
                  onClick={() => {
                    setActiveIdx(i);
                    setRan(false);
                  }}
                >
                  <code>{item.cmd}</code>
                </button>
              ))}
            </div>
            <p className={styles.desc}>{command.desc}</p>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={run}>
              Выполнить
            </button>
            <div className={styles.terminal}>
              <div>
                <span className={styles.prompt}>PS&gt; </span>
                {command.cmd}
              </div>
              {ran && <div className={styles.out}>{command.out}</div>}
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DevOpsCheatSheetPlayInner;
