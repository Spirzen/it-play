import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {BOX_TYPES, TEST_LEVELS_PYRAMID} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function TestingClassificationPlayInner() {
  const [boxId, setBoxId] = useState('black');
  const [levelId, setLevelId] = useState('unit');
  const box = BOX_TYPES.find((b) => b.id === boxId) ?? BOX_TYPES[0];
  const level = TEST_LEVELS_PYRAMID.find((l) => l.id === levelId) ?? TEST_LEVELS_PYRAMID[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Классификация: ящик и уровни"
        subtitle="Black / White / Gray-box и пирамида unit → integration → E2E"
      >
        <p className="it-demo__label">Доступ к коду</p>
        <div className={styles.grid3}>
          {BOX_TYPES.map((b) => (
            <button
              key={b.id}
              type="button"
              className={clsx(styles.card, boxId === b.id && styles.cardActive)}
              onClick={() => setBoxId(b.id)}
            >
              <span className={styles.cardLabel}>
                {b.icon} {b.label}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.detailBox}>
          <p>
            <strong>Видно:</strong> {box.sees.join(' · ')}
          </p>
          {box.hides[0] !== '—' && (
            <p>
              <strong>Скрыто:</strong> {box.hides.join(' · ')}
            </p>
          )}
          <p>
            <em>Пример:</em> {box.example}
          </p>
        </div>

        <p className="it-demo__label">Уровни (пирамида)</p>
        <div className={styles.pyramid}>
          {[...TEST_LEVELS_PYRAMID].reverse().map((layer) => (
            <button
              key={layer.id}
              type="button"
              className={clsx(
                styles.pyramidLayer,
                levelId === layer.id && styles.pyramidLayerActive,
              )}
              style={{width: `${layer.pct + 25}%`, background: layer.color}}
              onClick={() => setLevelId(layer.id)}
            >
              {layer.label} · {layer.pct}%
            </button>
          ))}
        </div>
        <p className={styles.cardHint}>{level.detail}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default TestingClassificationPlayInner;
