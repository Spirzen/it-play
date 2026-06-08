import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/shared/kb/testingDemo.module.css';

const CI_STEPS = ['git push', 'build', 'unit', 'integration', 'report'];

function TestAutomationRoiPlayInner() {
  const [cases, setCases] = useState(120);
  const [runsPerMonth, setRunsPerMonth] = useState(20);
  const [ciStep, setCiStep] = useState(-1);

  const manualHours = useMemo(() => ((cases * 3) / 60) * runsPerMonth, [cases, runsPerMonth]);
  const autoMinutes = useMemo(() => 5 + cases * 0.02, [cases]);
  const autoHoursMonth = (autoMinutes / 60) * runsPerMonth;
  const saved = Math.max(0, manualHours - autoHoursMonth);

  const runCi = () => {
    setCiStep(0);
    CI_STEPS.forEach((_, i) => {
      setTimeout(() => setCiStep(i), i * 700);
    });
    setTimeout(() => setCiStep(-1), CI_STEPS.length * 700 + 400);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Автоматизация: ROI и CI/CD"
        subtitle="Сравнение ручного регресса с прогоном пайплайна"
      >
        <div className={styles.sliderRow}>
          <label>Тест-кейсов в регрессе: {cases}</label>
          <input type="range" min={20} max={300} step={10} value={cases} onChange={(e) => setCases(+e.target.value)} />
        </div>
        <div className={styles.sliderRow}>
          <label>Прогонов в месяц: {runsPerMonth}</label>
          <input
            type="range"
            min={4}
            max={60}
            value={runsPerMonth}
            onChange={(e) => setRunsPerMonth(+e.target.value)}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.detailBox}>
            <strong>Ручной регресс</strong>
            <p>~{manualHours.toFixed(1)} ч/мес (3 мин × кейс)</p>
          </div>
          <div className={styles.detailBox}>
            <strong>Автотесты в CI</strong>
            <p>~{autoHoursMonth.toFixed(1)} ч/мес ({autoMinutes.toFixed(0)} мин/прогон)</p>
          </div>
        </div>
        <p className={styles.formSuccess}>Экономия ≈ {saved.toFixed(1)} ч/мес после окупаемости написания тестов</p>

        <p className="it-demo__label">Пайплайн</p>
        <div className={styles.pipeline}>
          {CI_STEPS.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className={styles.pipeArrow}>→</span>}
              <span
                className={
                  i === ciStep
                    ? `${styles.pipeNode} ${styles.pipeNodeActive}`
                    : i < ciStep
                      ? `${styles.pipeNode} ${styles.pipeNodeDone}`
                      : styles.pipeNode
                }
              >
                {s}
              </span>
            </React.Fragment>
          ))}
        </div>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runCi}>
          Запустить pipeline
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default TestAutomationRoiPlayInner;
