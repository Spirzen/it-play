import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {MDA_EXAMPLES, MDA_LOOP} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function GameDesignMdaPlayInner() {
  const [mdaId, setMdaId] = useState('mechanics');
  const item = MDA_LOOP.find((m) => m.id === mdaId) ?? MDA_LOOP[0];
  const examples = MDA_EXAMPLES[mdaId] ?? [];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="MDA: от механик к эстетике"
        subtitle="Framework Hunicke et al. — как правила рождают переживание игрока"
      >
        <div className={styles.mdaRing}>
          {MDA_LOOP.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.mdaCard, mdaId === m.id && styles.mdaCardActive)}
              style={{'--mda-color': m.color}}
              onClick={() => setMdaId(m.id)}
            >
              <strong>{m.label}</strong>
            </button>
          ))}
        </div>
        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p className={styles.panelTitle}>{item.label}</p>
          <p className={styles.hint}>{item.desc}</p>
          <ul className={styles.checkList}>
            {examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </div>
        <p className={styles.hint}>
          Петля: <strong>Механики</strong> → emergent <strong>Динамика</strong> → perceived{' '}
          <strong>Эстетика</strong>. Дизайнер задаёт механики; игрок переживает эстетику.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameDesignMdaPlayInner;
