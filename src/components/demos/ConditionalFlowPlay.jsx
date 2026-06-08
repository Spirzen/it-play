import React, {useCallback, useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/ConditionalFlowPlay.module.css';

const CODE = [
  {id: 'l1', num: 1, text: 'age = получить_возраст()', branch: null},
  {id: 'l2', num: 2, text: 'if age > 18:', branch: 'check'},
  {id: 'l3', num: 3, text: '    пропустить()', branch: 'true', indent: true},
  {id: 'l4', num: 4, text: 'else:', branch: 'false'},
  {id: 'l5', num: 5, text: '    не_пускать()', branch: 'false', indent: true},
];

function buildSteps(age) {
  const cond = age > 18;
  return [
    {line: 'l1', log: `Вход: age = ${age}`, flags: '—', path: 'main'},
    {
      line: 'l2',
      log: `Проверка: ${age} > 18 → ${cond ? 'истина' : 'ложь'}`,
      flags: cond ? 'ZF=0, SF=0' : 'ZF=0, SF=1',
      path: 'branch',
    },
    {
      line: cond ? 'l3' : 'l5',
      log: cond ? 'Ветка if: вызов пропустить()' : 'Ветка else: вызов не_пускать()',
      flags: 'JMP на метку ветки',
      path: cond ? 'true' : 'false',
    },
    {line: null, log: 'Продолжение после if/else', flags: '—', path: 'done'},
  ];
}

function ConditionalFlowPlayInner() {
  const [age, setAge] = useState(19);
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const steps = buildSteps(age);
  const current = steps[Math.min(step, steps.length - 1)];

  const reset = useCallback(() => {
    setStep(0);
    setAutoPlay(false);
  }, []);

  useEffect(() => {
    reset();
  }, [age, reset]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : 0));
    }, 1400);
    return () => window.clearInterval(id);
  }, [autoPlay, steps.length]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Условный оператор: поток выполнения"
        subtitle="Пошагово: проверка условия, выбор ветки, флаги процессора"
      >
        <label className={styles.control}>
          <span className="it-demo__label">Возраст (вход)</span>
          <input
            type="range"
            min={10}
            max={25}
            value={age}
            className={styles.range}
            onChange={(e) => setAge(Number(e.target.value))}
          />
          <strong>{age}</strong>
        </label>

        <div className={shared.codePanel}>
          {CODE.map((line) => {
            const active = current.line === line.id;
            const branchClass =
              line.branch === 'true'
                ? styles.branchTrue
                : line.branch === 'false'
                  ? styles.branchFalse
                  : line.branch === 'check'
                    ? styles.branchCheck
                    : '';
            return (
              <div
                key={line.id}
                className={clsx(
                  shared.codeLine,
                  active && shared.codeLineActive,
                  branchClass,
                )}
                style={line.indent ? {paddingLeft: '2rem'} : undefined}
              >
                <span className={shared.lineNum}>{line.num}</span>
                <code>{line.text}</code>
              </div>
            );
          })}
        </div>

        <div className={styles.flow}>
          <div className={clsx(styles.node, current.path === 'main' && styles.nodeActive)}>Вход</div>
          <span>→</span>
          <div className={clsx(styles.node, current.path === 'branch' && styles.nodeActive)}>if?</div>
          <span>→</span>
          <div
            className={clsx(
              styles.node,
              styles.nodeTrue,
              current.path === 'true' && styles.nodeActive,
            )}
          >
            then
          </div>
          <span>/</span>
          <div
            className={clsx(
              styles.node,
              styles.nodeFalse,
              current.path === 'false' && styles.nodeActive,
            )}
          >
            else
          </div>
        </div>

        <p className={styles.log}>{current.log}</p>
        <p className={styles.flags}>
          <strong>Уровень CPU:</strong> {current.flags}
        </p>

        <div className="it-demo__toolbar">
          <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            ← Назад
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
            Вперёд →
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn it-demo__btn--sm', autoPlay && 'it-demo__btn--secondary')}
            onClick={() => setAutoPlay((a) => !a)}
          >
            {autoPlay ? 'Стоп' : 'Авто'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ConditionalFlowPlayInner;
