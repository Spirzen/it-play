import React, {useState, useCallback, useEffect} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AlgoCodeVisualizer.module.css';

const SCENARIOS = {
  morning: {
    label: 'Утро',
    hint: 'Алгоритм — это план на человеческом языке; код — те же шаги в синтаксисе языка программирования.',
    steps: [
      {algo: 'ПРОСНУТЬСЯ()', code: 'wakeUp();'},
      {algo: 'СОБРАТЬ ВЕЩИ()', code: 'packBag();'},
      {algo: "ЕСЛИ ПОГОДА == 'ДОЖДЬ'", code: "if (weather === 'rain') {"},
      {algo: '  ТО ОСТАТЬСЯ()', code: '  stayHome();'},
      {algo: '  ИНАЧЕ ГУЛЯТЬ()', code: '} else {\n  walk();\n}'},
    ],
  },
  sort: {
    label: 'Сортировка',
    hint: 'Один и тот же алгоритм можно записать по-разному — важна последовательность действий.',
    steps: [
      {algo: 'ВЗЯТЬ массив A', code: 'const arr = [3, 1, 4];'},
      {algo: 'ДЛЯ каждого i', code: 'for (let i = 0; i < arr.length; i++) {'},
      {algo: '  НАЙТИ минимум справа', code: '  let minIdx = findMin(arr, i);'},
      {algo: '  ПОМЕНЯТЬ A[i] и A[min]', code: '  swap(arr, i, minIdx);'},
      {algo: 'КОНЕЦ', code: '}'},
    ],
  },
  login: {
    label: 'Вход',
    hint: 'Ветвления в алгоритме становятся if/else в коде.',
    steps: [
      {algo: 'ВВОД логина и пароля', code: 'const creds = readInput();'},
      {algo: 'ПРОВЕРИТЬ в базе', code: 'const ok = db.verify(creds);'},
      {algo: 'ЕСЛИ ok', code: 'if (ok) {'},
      {algo: '  ОТКРЫТЬ сессию', code: '  openSession(user);'},
      {algo: 'ИНАЧЕ показать ошибку', code: '} else {\n  showError();\n}'},
    ],
  },
};

function AlgoCodeVisualizerInner() {
  const [scenarioKey, setScenarioKey] = useState('morning');
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const scenario = SCENARIOS[scenarioKey];
  const steps = scenario.steps;
  const last = steps.length - 1;

  const goNext = useCallback(() => {
    setStep((s) => (s < last ? s + 1 : 0));
  }, [last]);

  const goPrev = useCallback(() => {
    setStep((s) => (s > 0 ? s - 1 : last));
  }, [last]);

  useEffect(() => {
    setStep(0);
    setAutoPlay(false);
  }, [scenarioKey]);

  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = window.setInterval(goNext, 1800);
    return () => window.clearInterval(id);
  }, [autoPlay, goNext]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  return (
    <DemoShell>
      <DemoCard
        title="Алгоритм и код"
        subtitle="Сопоставьте шаги &quot;человеческого&quot; алгоритма с инструкциями для машины"
      >
        <div className={styles.scenarioBar}>
          {Object.entries(SCENARIOS).map(([key, s]) => (
            <button
              key={key}
              type="button"
              className={clsx('it-demo__btn it-demo__btn--sm', scenarioKey !== key && 'it-demo__btn--secondary')}
              onClick={() => setScenarioKey(key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.panels}>
          <div className={clsx(styles.panel, styles.panelAlgo)}>
            <div className={styles.panelHead}>Алгоритм (мысли)</div>
            <div className={styles.panelBody}>
              {steps.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    styles.stepLine,
                    idx === step && styles.stepLineActive,
                    idx < step && styles.stepLineDone,
                  )}
                >
                  <span className={styles.stepNum}>{idx < step ? '✓' : idx + 1}</span>
                  <span>{item.algo}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.connector} aria-hidden>
            <span className={clsx(autoPlay && styles.connectorPulse)}>⟷</span>
          </div>

          <div className={clsx(styles.panel, styles.panelCode)}>
            <div className={styles.panelHead}>Код (машина)</div>
            <div className={styles.panelBody}>
              {steps.map((item, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    styles.codeLine,
                    idx === step && styles.codeLineActive,
                    idx < step && styles.codeLineDone,
                  )}
                >
                  {item.code}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={goPrev}>
            ← Назад
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={goNext}>
            {step === last ? 'Сначала' : 'Далее →'}
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn it-demo__btn--sm', autoPlay ? 'it-demo__btn--primary' : 'it-demo__btn--secondary')}
            onClick={() => setAutoPlay((v) => !v)}
          >
            {autoPlay ? '⏸ Пауза' : '▶ Авто'}
          </button>
          <div className={styles.progressWrap}>
            <div className="it-demo__progress">
              <div
                className="it-demo__progress-bar"
                style={{width: `${((step + 1) / steps.length) * 100}%`}}
              />
            </div>
            <div style={{fontSize: '0.75rem', color: 'var(--demo-muted)', marginTop: '0.25rem', textAlign: 'center'}}>
              {step + 1} / {steps.length}
            </div>
          </div>
        </div>

        <div className={styles.hint}>{scenario.hint}</div>
      </DemoCard>
    </DemoShell>
  );
}

export default AlgoCodeVisualizerInner;
