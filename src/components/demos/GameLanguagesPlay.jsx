import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GAME_LANGS} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function StatBar({label, value}) {
  return (
    <div className={styles.statBar}>
      <span style={{width: '5.5rem'}}>{label}</span>
      <div className={styles.statBarTrack}>
        <div className={styles.statBarFill} style={{width: `${value}%`}} />
      </div>
      <span>{value}</span>
    </div>
  );
}

function GameLanguagesPlayInner() {
  const [langId, setLangId] = useState('csharp');
  const lang = GAME_LANGS.find((l) => l.id === langId) ?? GAME_LANGS[2];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Языки программирования в играх"
        subtitle="Компромисс: производительность, продуктивность и безопасность памяти"
      >
        <div className={styles.compareGrid}>
          {GAME_LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.langCard, langId === l.id && styles.langCardActive)}
              onClick={() => setLangId(l.id)}
            >
              <strong>{l.name}</strong>
              <p className={styles.hint} style={{margin: '0.15rem 0 0'}}>
                {l.era}
              </p>
            </button>
          ))}
        </div>

        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p className={styles.panelTitle}>{lang.name}</p>
          <StatBar label="Перф" value={lang.perf} />
          <StatBar label="Скорость dev" value={lang.productivity} />
          <StatBar label="Безопасность" value={lang.safety} />
          <p className={styles.hint}>
            <strong>Движки:</strong> {lang.engines}
          </p>
          <p className={styles.hint}>{lang.note}</p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameLanguagesPlayInner;
