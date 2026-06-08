import React, {useState} from 'react';

import Link from '@/components/shared/KbLink';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {HUB_TOPICS, PIPELINE_STAGES} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function GameDevHubInner() {
  const [hover, setHover] = useState(HUB_TOPICS[0].title);
  const topic = HUB_TOPICS.find((t) => t.title === hover) ?? HUB_TOPICS[0];
  const firstStages = PIPELINE_STAGES.slice(0, 3).map((s) => s.label).join(' → ');

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Разработка игр — навигатор"
        subtitle="От процесса и движков до Roblox, Unity и гейм-дизайна"
      >
        <div className={styles.hubGrid}>
          {HUB_TOPICS.map((t) => (
            <Link
              key={t.doc}
              to={t.doc}
              className={styles.hubCard}
              onMouseEnter={() => setHover(t.title)}
              onFocus={() => setHover(t.title)}
            >
              <div style={{fontSize: '1.15rem'}}>{t.icon}</div>
              <p className={styles.hubTitle} style={{margin: '0.2rem 0 0', fontSize: '0.78rem', fontWeight: 700}}>
                {t.title}
              </p>
            </Link>
          ))}
        </div>
        <p className={styles.hint}>
          Выбрано: <strong>{topic.title}</strong> — <Link to={topic.doc}>статья →</Link>
        </p>
        <p className={styles.hint}>
          Типичный путь: {firstStages}… В статьях — интерактивные модели конвейера, движков и MDA.
          Референсы: <Link to="/tools/games/4">каталог игр с фильтром и случайным выбором</Link>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default GameDevHubInner;
