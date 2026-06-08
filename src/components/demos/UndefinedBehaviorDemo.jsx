import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BEHAVIOR_KINDS,
  COMPILERS,
  OPT_LEVELS,
  UB_SCENARIOS,
  formatOutcomeValue,
  simulateDefinedRun,
  simulateImplDefinedRun,
  simulateUbRun,
  simulateUnspecifiedRun,
} from '@/components/shared/kb/undefinedBehaviorEngine';
import styles from '@/components/demos/UndefinedBehaviorDemo.module.css';

const SEVERITY_CLASS = {
  info: styles.resultBoxInfo,
  warning: styles.resultBoxWarning,
  error: styles.resultBoxError,
};

function UndefinedBehaviorDemoInner() {
  const [tab, setTab] = useState('ub');
  const [scenarioId, setScenarioId] = useState('increment');
  const [compiler, setCompiler] = useState('gcc');
  const [opt, setOpt] = useState('O0');
  const [platformBits, setPlatformBits] = useState(4);
  const [runCount, setRunCount] = useState(0);
  const [lastRun, setLastRun] = useState(null);
  const [history, setHistory] = useState([]);

  const scenario = UB_SCENARIOS[scenarioId];
  const compilerMeta = COMPILERS.find((c) => c.id === compiler);
  const optMeta = OPT_LEVELS.find((o) => o.id === opt);

  const pushHistory = useCallback((entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 12));
  }, []);

  const runUb = useCallback(() => {
    const nextIndex = runCount + 1;
    setRunCount(nextIndex);
    const result = simulateUbRun(scenarioId, {compiler, opt, runIndex: nextIndex});
    setLastRun(result);
    pushHistory({
      id: `${Date.now()}-${nextIndex}`,
      tab: 'ub',
      ...result,
    });
  }, [runCount, scenarioId, compiler, opt, pushHistory]);

  const runKind = useCallback(
    (kindId) => {
      let payload;
      if (kindId === 'defined') payload = simulateDefinedRun();
      else if (kindId === 'unspecified') payload = simulateUnspecifiedRun(runCount);
      else if (kindId === 'implDefined') payload = simulateImplDefinedRun(platformBits);
      else {
        const nextIndex = runCount + 1;
        setRunCount(nextIndex);
        payload = simulateUbRun('array', {compiler, opt, runIndex: nextIndex});
        setLastRun(payload);
        pushHistory({id: `${Date.now()}-ub`, tab: 'ub', ...payload});
        return;
      }
      setLastRun({...payload, scenario: BEHAVIOR_KINDS[kindId], environmentLabel: '—'});
      pushHistory({
        id: `${Date.now()}-${kindId}`,
        tab: 'kinds',
        outcome: payload.outcome,
        guarantee: payload.guarantee,
        environmentLabel: '—',
        timestamp: payload.timestamp,
        scenario: BEHAVIOR_KINDS[kindId],
      });
      if (kindId === 'unspecified') setRunCount((c) => c + 1);
    },
    [runCount, compiler, opt, platformBits, pushHistory],
  );

  const reset = () => {
    setRunCount(0);
    setLastRun(null);
    setHistory([]);
  };

  const outcomeBoxClass = lastRun?.outcome?.severity
    ? SEVERITY_CLASS[lastRun.outcome.severity] ?? ''
    : '';

  const distinctResults = useMemo(() => {
    const values = new Set(history.map((h) => formatOutcomeValue(h.outcome?.value)));
    return values.size;
  }, [history]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Неопределённое поведение: симулятор"
        subtitle="Один и тот же код — разные исходы при смене компилятора, оптимизаций и запуска"
      >
        <div className={styles.modeBar}>
          <button
            type="button"
            className={clsx(styles.modeBtn, tab === 'ub' && styles.modeBtnActive)}
            style={{'--scenario-accent': '#c62828'}}
            onClick={() => setTab('ub')}
          >
            Примеры UB
          </button>
          <button
            type="button"
            className={clsx(styles.modeBtn, tab === 'kinds' && styles.modeBtnActive)}
            style={{'--scenario-accent': '#1565c0'}}
            onClick={() => setTab('kinds')}
          >
            Типы поведения
          </button>
        </div>

        {tab === 'ub' && (
          <>
            <div className={styles.modeBar}>
              {Object.values(UB_SCENARIOS).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={clsx(styles.modeBtn, scenarioId === s.id && styles.modeBtnActive)}
                  style={{'--scenario-accent': s.accent}}
                  onClick={() => {
                    setScenarioId(s.id);
                    setLastRun(null);
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className={styles.scenarioHint}>{scenario.hint}</p>

            <div className={styles.grid}>
              <div className={styles.codePanel}>
                <span className="it-demo__label">Фрагмент кода (C-подобный)</span>
                <pre className={styles.codeBlock}>{scenario.code}</pre>
                <div className={styles.envRow}>
                  <label className={styles.envField}>
                    <span className="it-demo__label">Компилятор</span>
                    <select
                      className="it-demo__select"
                      value={compiler}
                      onChange={(e) => setCompiler(e.target.value)}
                    >
                      {COMPILERS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.envField}>
                    <span className="it-demo__label">Оптимизация</span>
                    <select className="it-demo__select" value={opt} onChange={(e) => setOpt(e.target.value)}>
                      {OPT_LEVELS.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <p className="it-demo__alert it-demo__alert--info" style={{margin: 0, fontSize: '0.78rem'}}>
                  {optMeta?.hint}
                  {compilerMeta ? ` · ${compilerMeta.label}` : ''}
                </p>
              </div>

              <div className={styles.resultPanel}>
                <div className={clsx(styles.resultBox, outcomeBoxClass)}>
                  {lastRun ? (
                    <>
                      <div className={styles.resultValue}>
                        {lastRun.outcome.isDemon ? lastRun.outcome.value : formatOutcomeValue(lastRun.outcome.value)}
                      </div>
                      <div className={styles.resultLabel}>{lastRun.outcome.label}</div>
                      <p className={styles.resultDetail}>{lastRun.outcome.detail}</p>
                    </>
                  ) : (
                    <p className={styles.resultDetail} style={{margin: 0}}>
                      Нажмите "Запустить снова" — один и тот же исходный код может дать разный результат.
                    </p>
                  )}
                </div>
                {lastRun && <p className={styles.guarantee}>{lastRun.guarantee}</p>}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runUb}>
                Запустить снова
              </button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
                Сбросить журнал
              </button>
            </div>

            {runCount > 0 && (
              <p className={styles.runCount}>
                Запусков: {runCount}
                {distinctResults > 1 && (
                  <>
                    {' '}
                    · уникальных исходов в журнале: <strong>{distinctResults}</strong>
                  </>
                )}
              </p>
            )}
          </>
        )}

        {tab === 'kinds' && (
          <>
            <p className={styles.scenarioHint}>
              Сравните, где спецификация гарантирует результат, где допускает варианты, а где снимает все ограничения.
            </p>
            <div className={styles.kindBar}>
              {Object.values(BEHAVIOR_KINDS).map((k) => (
                <button
                  key={k.id}
                  type="button"
                  className={styles.modeBtn}
                  style={{'--scenario-accent': k.accent, width: '100%'}}
                  onClick={() => runKind(k.id)}
                >
                  {k.label}
                </button>
              ))}
            </div>
            <pre className={styles.codeBlock} style={{marginBottom: '0.75rem'}}>
              {lastRun?.scenario?.code ?? BEHAVIOR_KINDS.defined.code}
            </pre>
            {lastRun && (
              <>
                <div className={clsx(styles.resultBox, outcomeBoxClass, {marginBottom: '0.65rem'})}>
                  <div className={styles.resultValue}>{formatOutcomeValue(lastRun.outcome.value)}</div>
                  <div className={styles.resultLabel}>{lastRun.outcome.label}</div>
                  <p className={styles.resultDetail}>{lastRun.outcome.detail}</p>
                </div>
                <p className={styles.guarantee}>{lastRun.guarantee}</p>
              </>
            )}
            <label className={styles.envField} style={{maxWidth: 220, margin: '0.75rem auto 0', display: 'block'}}>
              <span className="it-demo__label">Размер int (для "зависит от реализации")</span>
              <select
                className="it-demo__select"
                value={platformBits}
                onChange={(e) => setPlatformBits(Number(e.target.value))}
              >
                <option value={4}>32-bit (4 байта)</option>
                <option value={8}>64-bit LP64 (8 байт)</option>
              </select>
            </label>
          </>
        )}

        <div className={styles.logPanel} style={{marginTop: '1rem'}}>
          <p className={styles.logTitle}>Журнал запусков</p>
          {history.length === 0 ? (
            <p className={styles.logEmpty}>Пока нет запусков — сравните несколько результатов подряд.</p>
          ) : (
            <ul className={styles.logList}>
              {history.map((entry) => (
                <li key={entry.id} className={styles.logItem}>
                  <span className={styles.logTime}>{entry.timestamp}</span>
                  <div>
                    <div className={styles.logOutcome}>
                      {entry.scenario?.label ?? '—'} → {entry.outcome?.label}
                    </div>
                    <div className={styles.logEnv}>{entry.environmentLabel}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="it-demo__alert it-demo__alert--warning" style={{marginTop: '0.85rem', marginBottom: 0, fontSize: '0.78rem'}}>
          Это <strong>образовательная симуляция</strong> в браузере, а не запуск C/C++. Она иллюстрирует идею: при
          неопределённом поведении нельзя полагаться на повторяемость результата.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default UndefinedBehaviorDemoInner;
