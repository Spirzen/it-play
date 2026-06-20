import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdHint, CdStack, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const SCENARIOS = {
  coffee: {
    title: 'Кофейня',
    steps: ['Клиент подошёл', 'Проверить наличие зёрен', 'Сварить кофе', 'Выдать напиток'],
    pool: ['Клиент подошёл', 'Проверить наличие зёрен', 'Сварить кофе', 'Выдать напиток', 'Выключить свет', 'Закрыть смену'],
  },
  elevator: {
    title: 'Лифт',
    steps: ['Нажата кнопка', 'Лифт приехал', 'Двери открылись', 'Пассажир вышел'],
    pool: ['Нажата кнопка', 'Лифт приехал', 'Двери открылись', 'Пассажир вышел', 'Пожарная тревога', 'Техобслуживание'],
  },
};

function AlgorithmThinkingPlayInner() {
  const [key, setKey] = useState('coffee');
  const sc = SCENARIOS[key];
  const [built, setBuilt] = useState([]);
  const done = built.length === sc.steps.length;
  const ok = done && built.every((s, i) => s === sc.steps[i]);

  const pick = (step) => {
    if (done || built.includes(step)) return;
    setBuilt((b) => [...b, step]);
  };

  const reset = () => setBuilt([]);

  return (
    <DemoShell>
      <DemoCard title="Алгоритмическое мышление" subtitle="Соберите корректную последовательность шагов">
        <CdStack>
          <div className={toolStyles.chips}>
            {Object.entries(SCENARIOS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                className={clsx(toolStyles.chip, key === k && toolStyles.chipActive)}
                onClick={() => {
                  setKey(k);
                  reset();
                }}
              >
                {v.title}
              </button>
            ))}
          </div>

          <div className={styles.panel}>
            <p className={styles.sectionLabel}>Ваша цепочка</p>
            {built.length === 0 ? (
              <CdHint>Нажимайте шаги в правильном порядке</CdHint>
            ) : (
              <ol className={styles.chainList}>
                {built.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            )}
          </div>

          <div className={styles.cardPool}>
            {sc.pool.map((s) => (
              <button
                key={s}
                type="button"
                className={clsx(styles.stepCard, built.includes(s) && styles.stepCardUsed)}
                disabled={built.includes(s)}
                onClick={() => pick(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {done && (
            <CdVerdict tone={ok ? 'success' : 'danger'}>
              {ok ? 'Верно — линейный алгоритм без лишних веток.' : 'Порядок нарушен. Сбросьте и попробуйте снова.'}
            </CdVerdict>
          )}
          <CdBtn onClick={reset}>Сброс</CdBtn>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default AlgorithmThinkingPlayInner;
