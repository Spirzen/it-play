import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GAMEDEV_DISCIPLINES, PROJECT_CONTEXTS} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function GameDevRoadmapPlayInner() {
  const [ctxId, setCtxId] = useState('indie');
  const [discId, setDiscId] = useState('code');
  const ctx = PROJECT_CONTEXTS.find((c) => c.id === ctxId) ?? PROJECT_CONTEXTS[1];
  const disc = GAMEDEV_DISCIPLINES.find((d) => d.id === discId) ?? GAMEDEV_DISCIPLINES[0];

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Дорожная карта геймдева"
        subtitle="Контекст проекта (AAA / indie / art) и глубина vs широта компетенций"
      >
        <div className={styles.engineGrid}>
          {PROJECT_CONTEXTS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.engineCard, ctxId === c.id && styles.engineCardActive)}
              style={{'--eng-color': c.color}}
              onClick={() => setCtxId(c.id)}
            >
              <strong>{c.label}</strong>
              <p className={styles.hint} style={{margin: '0.2rem 0 0'}}>
                {c.team} · {c.horizon}
              </p>
            </button>
          ))}
        </div>

        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p className={styles.panelTitle}>{ctx.label}</p>
          <p className={styles.hint}>{ctx.trait}</p>
          <div className={styles.meterPair}>
            <div>
              <div className={styles.meterHead}>
                <span>Глубина специализации</span>
                <span>{ctx.depth}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{width: `${ctx.depth}%`, background: ctx.color}}
                />
              </div>
            </div>
            <div>
              <div className={styles.meterHead}>
                <span>Широта смежных знаний</span>
                <span>{ctx.breadth}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{width: `${ctx.breadth}%`, background: 'var(--ifm-color-info)'}}
                />
              </div>
            </div>
          </div>
          <p className={styles.hint}>
            <strong>Типичный риск:</strong> {ctx.risk}
          </p>
        </div>

        <p className={styles.hint} style={{marginTop: '0.85rem'}}>
          Выберите дисциплину — что учить в первую очередь в этом контексте:
        </p>
        <div className={styles.tabs}>
          {GAMEDEV_DISCIPLINES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={clsx(styles.tab, discId === d.id && styles.tabActive)}
              onClick={() => setDiscId(d.id)}
            >
              {d.icon} {d.label}
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>
            {disc.icon} {disc.label}
          </p>
          <div className={styles.chipRow}>
            {disc.layers.map((l) => (
              <span key={l} className={styles.chip}>
                {l}
              </span>
            ))}
          </div>
          <ul className={styles.checkList}>
            {disc.mustKnow.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <p className={styles.hint}>
            В {ctx.label.toLowerCase()}-контексте{' '}
            {ctx.id === 'aaa'
              ? 'достаточно мастерства в одном слое "' + disc.layers[0] + '".'
              : ctx.id === 'indie'
                ? 'нужно понимать соседние дисциплины хотя бы на уровне handoff.'
                : 'важен документированный процесс и связь механик с эстетикой.'}
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameDevRoadmapPlayInner;
