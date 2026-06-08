import React, {useState} from 'react';
import Link from '@/components/shared/KbLink';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {ECOSYSTEM_LAYERS, HUB_SECTIONS} from '@/components/shared/kb/gameIndustryEngine';
import styles from '@/components/demos/GameIndustryDemo.module.css';

function GameIndustryHubInner() {
  const [preview, setPreview] = useState(HUB_SECTIONS[0].id);
  const section = HUB_SECTIONS.find((s) => s.id === preview) ?? HUB_SECTIONS[0];
  const layer = ECOSYSTEM_LAYERS[0];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Игровая индустрия — навигатор"
        subtitle="Ключевые темы раздела и связь с цепочкой создания игры"
      >
        <div className={styles.hubGrid}>
          {HUB_SECTIONS.map((s) => (
            <Link
              key={s.id}
              to={s.doc}
              className={styles.hubCard}
              onMouseEnter={() => setPreview(s.id)}
              onFocus={() => setPreview(s.id)}
            >
              <div className={styles.hubIcon}>{s.icon}</div>
              <p className={styles.hubTitle}>{s.title}</p>
            </Link>
          ))}
        </div>
        <p className={styles.hint}>
          Сейчас: <strong>{section.title}</strong> —{' '}
          <Link to={section.doc}>открыть статью →</Link>
        </p>
        <p className={styles.hint}>
          Цепочка индустрии: {ECOSYSTEM_LAYERS.map((l) => l.label).join(' → ')}. Подраздел{' '}
          <Link to="/encyclopedia/9-spinoff/9-03-igrovaya-industriya/game-studies/intro">Игроведение</Link>{' '}
          — 25 интерактивных серий с хронологией релизов. Практика:{' '}
          <Link to="/tools/games/4">каталог игр для знакомства с жанрами</Link>.
        </p>
        <div className={styles.layerDetail} style={{'--layer-color': layer.color}}>
          <span className={styles.layerTag}>{layer.tag}</span>
          <p className={styles.layerTitle}>
            {layer.icon} Старт с уровня "{layer.label}"
          </p>
          <p className={styles.hint} style={{marginBottom: 0}}>
            {layer.actors.slice(0, 2).join(', ')}…
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameIndustryHubInner;
