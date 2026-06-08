import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CrossContextMemePlay.module.css';

const PIPELINE = [
  {
    id: 'offline',
    label: 'Офлайн-событие',
    detail: 'Пресс-конференция: спорная фраза публичной фигуры',
    context: 'Новостной цикл, СМИ',
  },
  {
    id: 'encode',
    label: 'Мемификация',
    detail: 'Кадр + подпись + звук → шаблон для ремикса',
    context: 'Twitter / Telegram / Shorts',
  },
  {
    id: 'viral',
    label: 'Виральность',
    detail: 'Фраза отрывается от источника, становится идиомой',
    context: 'Миллионы вариаций за 48 ч',
  },
  {
    id: 'back',
    label: 'Обратно в офлайн',
    detail: 'Мем цитируют в ток-шоу и политических дебатах',
    context: 'Повестка дня смещается',
  },
];

function CrossContextMemePlayInner() {
  const [step, setStep] = useState(0);
  const current = PIPELINE[step];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Кросс-контекст: офлайн ↔ онлайн"
        subtitle="Событие проходит перекодирование и может вернуться в публичное пространство в новой форме"
      >
        <div className={styles.pipeline}>
          {PIPELINE.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={clsx(
                styles.node,
                i <= step && styles.nodeDone,
                i === step && styles.nodeActive,
              )}
              onClick={() => setStep(i)}
            >
              <span className={styles.num}>{i + 1}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.detail}>
          <h5>{current.label}</h5>
          <p>{current.detail}</p>
          <span className={styles.ctx}>{current.context}</span>
        </div>

        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={() => setStep((s) => (s >= PIPELINE.length - 1 ? 0 : s + 1))}
        >
          {step >= PIPELINE.length - 1 ? 'Сбросить цикл' : 'Следующий этап'}
        </button>
        <p className={styles.hint}>
          Двунаправленность: онлайн не зеркало офлайна — петля обратной связи меняет исходный смысл
          события.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CrossContextMemePlayInner;
