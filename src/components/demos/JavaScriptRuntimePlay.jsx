import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BROWSER_PIPELINE,
  ECOSYSTEM_AREAS,
  ENGINES,
  EVENT_LOOP_SCENARIOS,
  JS_IMPACTS,
} from '@/components/shared/kb/jsRuntimeEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/JavaScriptRuntimePlay.module.css';

const TABS = [
  {id: 'eco', label: 'Где применяют'},
  {id: 'pipeline', label: 'Пайплайн браузера'},
  {id: 'eventloop', label: 'Event Loop'},
];

const FLOW_CHIPS = [
  {key: 'dom', label: 'DOM', color: '#e44d26'},
  {key: 'cssom', label: 'CSSOM', color: '#264de4'},
  {key: 'js', label: 'JS', color: '#f7df1e'},
  {key: 'render', label: 'Render Tree', color: '#7c3aed'},
  {key: 'layout', label: 'Layout', color: '#00897b'},
  {key: 'paint', label: 'Paint', color: '#ed6c02'},
  {key: 'composite', label: 'Composite', color: '#5c6bc0'},
];

function EcosystemPanel() {
  const [selected, setSelected] = useState('frontend');
  const area = ECOSYSTEM_AREAS.find((a) => a.id === selected) ?? ECOSYSTEM_AREAS[0];

  return (
    <>
      <div className={styles.ecoGrid} role="listbox" aria-label="Области применения JavaScript">
        {ECOSYSTEM_AREAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={selected === item.id}
            className={clsx(styles.ecoCard, selected === item.id && styles.ecoCardOn)}
            style={{'--eco-accent': item.color}}
            onClick={() => setSelected(item.id)}
          >
            <span className={styles.ecoIcon} aria-hidden>
              {item.icon}
            </span>
            <span className={styles.ecoLabel}>{item.label}</span>
            <span className={styles.ecoTools}>{item.tools}</span>
          </button>
        ))}
      </div>
      <div className={styles.ecoDetail} style={{'--eco-accent': area.color}}>
        <p className={styles.ecoDetailTitle}>
          {area.icon} {area.label}
        </p>
        <p style={{margin: 0}}>{area.summary}</p>
        <p style={{margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--demo-muted)'}}>
          <strong>Среда:</strong> {area.runtime}
        </p>
        <p style={{margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--demo-muted)'}}>
          <strong>Инструменты:</strong> {area.tools}
        </p>
      </div>
      <div className={styles.ecoEngines}>
        <span className="it-demo__label" style={{width: '100%', marginBottom: '0.15rem'}}>
          Движки ECMAScript (в браузере)
        </span>
        {ENGINES.map((eng) => (
          <span
            key={eng.name}
            className={styles.engineChip}
            style={{'--chip-color': eng.color}}
          >
            {eng.name} — {eng.hosts}
          </span>
        ))}
      </div>
    </>
  );
}

function PipelinePreview({step, jsModified, compositeLayer}) {
  const styled = step?.preview?.cssom && step?.preview?.render;
  const jsRan = step?.preview?.js;

  return (
    <div className={styles.previewPanel}>
      <div className={styles.previewBrowser}>
        <span className={styles.previewDot} style={{background: '#ef5350'}} />
        <span className={styles.previewDot} style={{background: '#ffca28'}} />
        <span className={styles.previewDot} style={{background: '#66bb6a'}} />
        <span>index.html</span>
      </div>
      <div
        className={clsx(
          styles.previewPage,
          styled ? styles.previewPageStyled : styles.previewPageUnstyled,
          compositeLayer && styles.previewComposite,
        )}
      >
        <h1>{jsModified ? 'JS изменил заголовок!' : 'Заголовок страницы'}</h1>
        <p>
          {styled
            ? 'Стили из CSSOM применены — текст синий, отступы на месте.'
            : 'Пока только DOM: разметка без оформления.'}
        </p>
        <button
          type="button"
          className={clsx(styles.previewBtn, jsRan && styles.previewBtnJs)}
        >
          {jsRan ? 'Обработчик click зарегистрирован' : 'Кнопка'}
        </button>
      </div>
    </div>
  );
}

function PipelinePanel() {
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [impact, setImpact] = useState(null);
  const timerRef = useRef(null);

  const step = BROWSER_PIPELINE[stepIdx];
  const jsModified = step?.jsEffect === 'title' && stepIdx >= 2;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const play = () => {
    clearTimer();
    setPlaying(true);
    setStepIdx(0);
    setImpact(null);
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      if (i >= BROWSER_PIPELINE.length) {
        clearTimer();
        setPlaying(false);
        return;
      }
      setStepIdx(i);
    }, 1400);
  };

  const impactItem = JS_IMPACTS.find((x) => x.id === impact);

  return (
    <>
      <div className={styles.pipelineLayout}>
        <div>
          <span className="it-demo__label">Этапы обработки страницы</span>
          <div className={styles.pipelineSteps}>
            {BROWSER_PIPELINE.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={clsx(
                  styles.pipeStep,
                  i === stepIdx && styles.pipeStepOn,
                  i < stepIdx && styles.pipeStepDone,
                )}
                onClick={() => {
                  clearTimer();
                  setPlaying(false);
                  setStepIdx(i);
                }}
              >
                <span className={styles.pipeNum}>{i + 1}</span>
                <span>
                  <strong>{s.label}</strong>
                  <span style={{display: 'block', fontSize: '0.68rem', color: 'var(--demo-muted)'}}>
                    {s.short}
                  </span>
                </span>
                {s.blocking && <span className={styles.blockBadge}>блокирует парсинг</span>}
              </button>
            ))}
          </div>
        </div>
        <PipelinePreview
          step={step}
          jsModified={jsModified}
          compositeLayer={step?.compositeLayer}
        />
      </div>

      <div className={styles.flowStrip} aria-hidden>
        {FLOW_CHIPS.map((chip) => (
          <span
            key={chip.key}
            className={clsx(styles.flowChip, step?.preview?.[chip.key] && styles.flowChipOn)}
            style={{'--chip-color': chip.color}}
          >
            {chip.label}
          </span>
        ))}
      </div>

      <p className={styles.hint}>{step?.detail}</p>

      <div className={styles.impactRow}>
        <span className="it-demo__label">Влияние JS на отрисовку:</span>
        {JS_IMPACTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={clsx(
              styles.impactBtn,
              impact === item.id && styles[`impactBtn${item.cost === 'high' ? 'High' : item.cost === 'medium' ? 'Medium' : 'Low'}`],
            )}
            onClick={() => setImpact(item.id === impact ? null : item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {impactItem && (
        <p className="it-demo__hint" style={{marginTop: '0.45rem'}}>
          <strong>{impactItem.effect}:</strong> {impactItem.hint}
        </p>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={play}
          disabled={playing}
        >
          {playing ? 'Воспроизведение…' : '▶ Пройти пайплайн'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => {
            clearTimer();
            setPlaying(false);
            setStepIdx(0);
            setImpact(null);
          }}
        >
          Сброс
        </button>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{width: `${((stepIdx + 1) / BROWSER_PIPELINE.length) * 100}%`}}
          />
        </div>
      </div>
    </>
  );
}

function EventLoopPanel() {
  const [scenarioKey, setScenarioKey] = useState('micro');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [printed, setPrinted] = useState([]);
  const timerRef = useRef(null);

  const scenario = EVENT_LOOP_SCENARIOS[scenarioKey];
  const steps = scenario.steps;
  const current = steps[stepIdx] ?? steps[0];
  const codeLines = scenario.code.split('\n');

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const rebuildPrinted = useCallback(
    (uptoIdx) => {
      const logs = [];
      for (let j = 0; j <= uptoIdx; j += 1) {
        const log = steps[j]?.log;
        if (log) logs.push(log);
      }
      setPrinted(logs);
    },
    [steps],
  );

  const play = () => {
    clearTimer();
    setPlaying(true);
    setStepIdx(0);
    setPrinted([]);
    let i = 0;

    const tick = () => {
      rebuildPrinted(i);
      setStepIdx(i);
      if (i >= steps.length - 1) {
        setPlaying(false);
        return;
      }
      i += 1;
      timerRef.current = setTimeout(tick, 900);
    };

    timerRef.current = setTimeout(tick, 400);
  };

  const reset = () => {
    clearTimer();
    setPlaying(false);
    setStepIdx(0);
    setPrinted([]);
  };

  const stackFrames = useMemo(() => {
    const frames = current.stack ?? [];
    return [...frames].reverse();
  }, [current.stack]);

  return (
    <>
      <div className="it-demo__row" style={{marginBottom: '0.65rem', flexWrap: 'wrap'}}>
        {Object.entries(EVENT_LOOP_SCENARIOS).map(([key, sc]) => (
          <button
            key={key}
            type="button"
            className={clsx(
              'it-demo__btn it-demo__btn--sm',
              scenarioKey !== key && 'it-demo__btn--secondary',
            )}
            onClick={() => {
              setScenarioKey(key);
              reset();
            }}
          >
            {sc.label}
          </button>
        ))}
      </div>

      <div className={styles.elGrid}>
        <div>
          <span className="it-demo__label">Код</span>
          <pre className={styles.elCode}>
            {codeLines.map((line, i) => (
              <div
                key={`line-${i}`}
                className={clsx(
                  styles.elCodeLine,
                  current.line === i && styles.elCodeLineActive,
                  current.line > i && current.line >= 0 && styles.elCodeLineDone,
                )}
              >
                <span className={styles.elLineNum}>{i + 1}</span>
                <code>{line || ' '}</code>
              </div>
            ))}
          </pre>
        </div>

        <div>
          <span className="it-demo__label">Среда выполнения</span>
          <div className={styles.runtimeGrid}>
            <div className={styles.runtimeCol}>
              <p className={styles.runtimeColTitle}>Call Stack</p>
              <div className={shared.stackCol}>
                {stackFrames.length === 0 ? (
                  <span style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>пуст</span>
                ) : (
                  stackFrames.map((frame, i) => (
                    <div
                      key={`${frame}-${i}`}
                      className={clsx(
                        shared.stackFrame,
                        i === 0 && shared.stackFrameActive,
                      )}
                    >
                      {frame}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.runtimeCol}>
              <p className={styles.runtimeColTitle}>Microtask Queue</p>
              <div className={styles.queueList}>
                {(current.micro ?? []).length === 0 ? (
                  <span style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>пусто</span>
                ) : (
                  current.micro.map((task) => (
                    <div
                      key={task}
                      className={clsx(
                        styles.queueItem,
                        current.action === 'micro' && styles.queueItemActive,
                      )}
                    >
                      {task}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.runtimeCol}>
              <p className={styles.runtimeColTitle}>Macrotask Queue</p>
              <div className={styles.queueList}>
                {(current.macro ?? []).length === 0 ? (
                  <span style={{fontSize: '0.72rem', color: 'var(--demo-muted)'}}>пусто</span>
                ) : (
                  current.macro.map((task) => (
                    <div
                      key={task}
                      className={clsx(
                        styles.queueItem,
                        current.action === 'macro' && styles.queueItemActive,
                      )}
                    >
                      {task}
                    </div>
                  ))
                )}
              </div>
              {current.webApi && (
                <div className={styles.webApiBox}>Web API: {current.webApi}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.outputRow}>
        <span className={styles.outputLabel}>console.log →</span>
        {scenario.output.map((val) => (
          <span
            key={val}
            className={clsx(styles.outputChip, printed.includes(val) && styles.outputChipDone)}
          >
            {val}
          </span>
        ))}
      </div>

      <p className={styles.hint}>
        {current.action === 'sync' && current.log && `Синхронно: вывод "${current.log}".`}
        {current.action === 'delegate' &&
          'setTimeout делегируется Web API — коллбэк попадёт в macrotask queue после синхронного кода.'}
        {current.action === 'enqueueMicro' &&
          'Promise.then попадает в microtask queue — выполнится раньше macrotask.'}
        {current.action === 'micro' && `Event Loop опустошает microtasks: "${current.log}".`}
        {current.action === 'macro' && `Стек свободен — берётся macrotask: "${current.log}".`}
      </p>

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={play}
          disabled={playing}
        >
          {playing ? 'Выполняется…' : '▶ Пошагово'}
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          disabled={stepIdx <= 0 || playing}
          onClick={() => {
            const prev = Math.max(0, stepIdx - 1);
            setStepIdx(prev);
            rebuildPrinted(prev);
          }}
        >
          ← Назад
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          disabled={stepIdx >= steps.length - 1 || playing}
          onClick={() => {
            const next = Math.min(steps.length - 1, stepIdx + 1);
            setStepIdx(next);
            rebuildPrinted(next);
          }}
        >
          Вперёд →
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
          Сброс
        </button>
      </div>
    </>
  );
}

function JavaScriptRuntimePlayInner() {
  const [tab, setTab] = useState('eco');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="JavaScript: где работает и как выполняется"
        subtitle="Экосистема, пайплайн браузера и цикл событий — три режима одного демо"
      >
        <div className={styles.tabs} role="tablist" aria-label="Режимы демо">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div role="tabpanel">
          {tab === 'eco' && <EcosystemPanel />}
          {tab === 'pipeline' && <PipelinePanel />}
          {tab === 'eventloop' && <EventLoopPanel />}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default JavaScriptRuntimePlayInner;
