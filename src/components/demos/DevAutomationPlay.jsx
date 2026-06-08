import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  AUTOMATION_LAYERS,
  HOOK_STEPS,
  MAKE_TARGETS,
  SCAFFOLD_TEMPLATES,
  WATCH_SCENARIOS,
} from '@/components/shared/kb/devAutomationEngine';
import styles from './automationPlays.module.css';

function DevAutomationPlayInner() {
  const [view, setView] = useState('layers');
  const [templateId, setTemplateId] = useState('python');
  const [makeId, setMakeId] = useState('run');
  const [watchId, setWatchId] = useState('pytest');
  const [hookIdx, setHookIdx] = useState(-1);
  const [watchLog, setWatchLog] = useState('');
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const template = SCAFFOLD_TEMPLATES.find((t) => t.id === templateId) ?? SCAFFOLD_TEMPLATES[0];
  const makeTarget = MAKE_TARGETS.find((t) => t.id === makeId) ?? MAKE_TARGETS[0];
  const watch = WATCH_SCENARIOS.find((w) => w.id === watchId) ?? WATCH_SCENARIOS[0];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const playHooks = () => {
    clearTimers();
    setPlaying(true);
    setHookIdx(-1);
    HOOK_STEPS.forEach((_, i) => {
      const id = setTimeout(() => {
        setHookIdx(i);
        if (i === HOOK_STEPS.length - 1) setPlaying(false);
      }, i * 700);
      timers.current.push(id);
    });
  };

  const simulateWatch = () => {
    setWatchLog(`[watch] ${watch.trigger}\n→ ${watch.cmd}\n… running …\n✓ OK (0.4s)`);
  };

  const VIEWS = [
    {id: 'layers', label: 'Уровни'},
    {id: 'scaffold', label: 'Генератор'},
    {id: 'make', label: 'Make'},
    {id: 'hooks', label: 'Git hooks'},
    {id: 'watch', label: 'Watch'},
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Автоматизация рабочего процесса"
        subtitle="От однострочных скриптов до хуков и планировщика ОС"
      >
        <div className={styles.tabs} role="tablist">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={clsx(styles.tab, view === v.id && styles.tabActive)}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {view === 'layers' && (
          <div className={styles.layerGrid}>
            {AUTOMATION_LAYERS.map((layer) => (
              <div key={layer.id} className={styles.layerCard}>
                <strong>{layer.title}</strong>
                <ul>
                  {layer.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {view === 'scaffold' && (
          <>
            <div className={styles.batchRow}>
              {SCAFFOLD_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={clsx(styles.tab, templateId === t.id && styles.tabActive)}
                  onClick={() => setTemplateId(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <pre className={styles.expr}>{template.cmd}</pre>
            <pre className={styles.scaffoldTree}>
              {template.tree.map((line) => `${line}\n`).join('')}
            </pre>
          </>
        )}

        {view === 'make' && (
          <>
            <div className={styles.makeGraph}>
              {MAKE_TARGETS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={clsx(styles.makeNode, makeId === t.id && styles.makeActive)}
                  onClick={() => setMakeId(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className={styles.human} style={{marginTop: '0.5rem'}}>
              <strong>make {makeTarget.label}</strong> — {makeTarget.desc}
              {makeTarget.deps.length > 0 && (
                <> (сначала: {makeTarget.deps.map((d) => `make ${d}`).join(', ')})</>
              )}
            </p>
            <pre className={styles.diffPane}>{`$ make ${makeTarget.label}\n# ${makeTarget.desc}`}</pre>
          </>
        )}

        {view === 'hooks' && (
          <>
            <div className={styles.hookFlow}>
              {HOOK_STEPS.map((step, i) => (
                <React.Fragment key={step.id}>
                  <span className={clsx(styles.hookStep, i <= hookIdx && styles.hookStepDone)}>
                    {step.icon} {step.label}
                  </span>
                  {i < HOOK_STEPS.length - 1 && <span className={styles.hookArrow}>→</span>}
                </React.Fragment>
              ))}
            </div>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={playHooks}
              disabled={playing}
            >
              {playing ? 'Проверка…' : 'Симулировать pre-commit'}
            </button>
            <p className="it-demo__hint">В проекте удобнее фреймворк pre-commit, чем ручной shell-hook.</p>
          </>
        )}

        {view === 'watch' && (
          <>
            <div className={styles.batchRow}>
              {WATCH_SCENARIOS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={clsx(styles.tab, watchId === w.id && styles.tabActive)}
                  onClick={() => setWatchId(w.id)}
                >
                  {w.tool}
                </button>
              ))}
            </div>
            <pre className={styles.expr}>{watch.cmd}</pre>
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={simulateWatch}>
              Сохранить файл (симуляция)
            </button>
            {watchLog && <pre className={styles.watchLog}>{watchLog}</pre>}
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default DevAutomationPlayInner;
