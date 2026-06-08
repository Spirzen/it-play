import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/MemeLifecyclePlay.module.css';

const PHASES = [
  {
    id: 'birth',
    label: 'Рождение',
    caption: 'Первичный кадр + ирония → появляется шаблон',
    template: 'Две кнопки: "Сдать в срок" / "Перенести дедлайн"',
    reach: 5,
  },
  {
    id: 'viral',
    label: 'Виральность',
    caption: 'Узнаваемость без пояснений, репосты растут',
    template: 'Шаблон в 12 языках и 4 соцсетях',
    reach: 85,
  },
  {
    id: 'mutate',
    label: 'Мутация',
    caption: 'Ядро сохраняется, детали меняются',
    template: '"Disappointed" / "Hopeful" версии того же лица',
    reach: 60,
  },
  {
    id: 'fade',
    label: 'Устаревание',
    caption: 'Нужны пояснения — отсылка к эпохе',
    template: '"Как в 2016…" — ностальгический мета-мем',
    reach: 12,
  },
];

function MemeLifecyclePlayInner() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remix, setRemix] = useState(0);
  const phase = PHASES[phaseIdx];

  const advance = () => {
    setPhaseIdx((i) => (i + 1) % PHASES.length);
    setRemix(0);
  };

  const remixTemplate = () => {
    if (phase.id === 'mutate') setRemix((r) => (r + 1) % 3);
  };

  const remixLabels = ['Оригинал', 'Локальный контекст', 'Мета-ирония'];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Жизненный цикл мема"
        subtitle="Рождение → виральность → мутация → устаревание"
      >
        <div className={styles.steps}>
          {PHASES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.step, phaseIdx === i && styles.stepActive)}
              onClick={() => {
                setPhaseIdx(i);
                setRemix(0);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.stage}>
          <div className={styles.reach} style={{width: `${phase.reach}%`}} />
          <p className={styles.caption}>{phase.caption}</p>
          <div className={styles.template}>
            <span className={styles.emoji}>🖼</span>
            <p>
              {phase.template}
              {phase.id === 'mutate' && remix > 0 && (
                <em> — вариант: {remixLabels[remix]}</em>
              )}
            </p>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={advance}>
            Следующая фаза
          </button>
          {phase.id === 'mutate' && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={remixTemplate}
            >
              Мутировать шаблон
            </button>
          )}
        </div>
        <p className={styles.hint}>
          Охват аудитории: ~{phase.reach}% — на стадии мутации мем расщепляется на ветки, не исчезая
          сразу.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MemeLifecyclePlayInner;
