import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/VariableLifecyclePlay.module.css';

const STEPS = [
  {
    id: 'declare',
    title: 'Объявление',
    stack: [{name: 'age', value: '—', addr: '[rbp-4]'}],
    heap: [],
    note: 'Компилятор резервирует 4 байта в стеке под int age.',
  },
  {
    id: 'assign',
    title: 'Присвоение age = 30',
    stack: [{name: 'age', value: '30 (0x1E)', addr: '[rbp-4]'}],
    heap: [],
    note: 'Процессор записывает биты 00011110 в ячейку стека.',
  },
  {
    id: 'reassign',
    title: 'Изменение age = 31',
    stack: [{name: 'age', value: '31 (0x1F)', addr: '[rbp-4]'}],
    heap: [],
    note: 'Тот же адрес — новое значение (перезапись).',
  },
  {
    id: 'string',
    title: 'Строка в куче',
    stack: [{name: 'name', value: 'ref → 0xA400', addr: '[rbp-8]'}],
    heap: [{label: '"Иван" @ 0xA400', bytes: '49 00 76 00 61 00 6E'}],
    note: 'Переменная в стеке хранит ссылку; символы — в куче.',
  },
  {
    id: 'exit',
    title: 'Выход из функции',
    stack: [],
    heap: [{label: '"Иван" (пока есть ссылка)', bytes: '…'}],
    note: 'Фрейм стека удалён (pop). Объект в куче ждёт сборщика мусора.',
  },
];

function VariableLifecyclePlayInner() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const current = STEPS[Math.min(step, STEPS.length - 1)];

  const goNext = useCallback(() => {
    setStep((s) => (s < STEPS.length - 1 ? s + 1 : 0));
  }, []);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(goNext, 1800);
    return () => window.clearInterval(id);
  }, [autoPlay, goNext]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Жизненный цикл переменной"
        subtitle="Стек, куча, адрес и момент освобождения памяти"
      >
        <div className="it-demo__progress" style={{marginBottom: '0.5rem'}}>
          <div
            className="it-demo__progress-fill"
            style={{width: `${((step + 1) / STEPS.length) * 100}%`}}
          />
        </div>
        <p className={styles.stepTitle}>
          Шаг {step + 1}/{STEPS.length}: {current.title}
        </p>

        <div className={styles.memGrid}>
          <div className={styles.region}>
            <div className={styles.regionHead}>Стек (LIFO)</div>
            {current.stack.length === 0 ? (
              <p className={styles.empty}>Фрейм освобождён — локальные переменные недоступны</p>
            ) : (
              <ul className={styles.varList}>
                {current.stack.map((v) => (
                  <li key={v.name}>
                    <code>{v.name}</code>
                    <span>{v.value}</span>
                    <span className={styles.addr}>{v.addr}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.region}>
            <div className={styles.regionHead}>Куча (heap)</div>
            {current.heap.length === 0 ? (
              <p className={styles.empty}>Нет объектов в куче на этом шаге</p>
            ) : (
              <ul className={styles.varList}>
                {current.heap.map((h) => (
                  <li key={h.label}>
                    <span>{h.label}</span>
                    <span className={styles.addr}>{h.bytes}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className={styles.note}>{current.note}</p>

        <div className="it-demo__toolbar">
          <button
            type="button"
            className="it-demo__btn it-demo__btn--sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ←
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={goNext}>
            →
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn it-demo__btn--sm', autoPlay && 'it-demo__btn--secondary')}
            onClick={() => setAutoPlay((a) => !a)}
          >
            {autoPlay ? 'Стоп' : 'Авто'}
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default VariableLifecyclePlayInner;
