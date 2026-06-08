import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CODE_SNIPPETS,
  FRAMEWORK,
  FRAMEWORK_STEPS,
  LIBRARY_SNIPPETS,
  PROJECT_FILES,
  VIEW_MODES,
  runFrameworkRequest,
  runLibrarySample,
} from '@/components/shared/kb/frameworkDemoEngine';
import styles from '@/components/demos/FrameworkDemo.module.css';

const REQUEST_LABELS = {
  browser: '🌐 Клиент',
  router: '⚙️ MiniWeb Router',
  handler: '📝 Ваш обработчик',
};

function ControlFlowBanner({mode}) {
  const meta = VIEW_MODES[mode];
  const [left, right] = meta.flow;

  return (
    <div className={styles.iocBanner} aria-label={meta.controlLabel}>
      <div className={styles.iocLabel}>{meta.controlLabel}</div>
      <span
        className={clsx(
          styles.iocNode,
          left.role === 'main' && styles.iocNodeMain,
          left.role === 'lib' && styles.iocNodeLib,
          left.role === 'framework' && styles.iocNodeFw,
        )}
      >
        {left.label}
      </span>
      <span className={styles.iocArrow} aria-hidden>
        {meta.arrow}
      </span>
      <span
        className={clsx(
          styles.iocNode,
          right.role === 'lib' && styles.iocNodeLib,
          right.role === 'yours' && styles.iocNodeMain,
          right.role === 'framework' && styles.iocNodeFw,
        )}
      >
        {right.label}
      </span>
    </div>
  );
}

function ProjectTree({highlightFiles, showFrameworkInside}) {
  return (
    <>
    <ul className={styles.fileList}>
      {PROJECT_FILES.map((file) => {
        const highlighted = highlightFiles.includes(file.path);
        const icon =
          file.type === 'fw'
            ? '🏗️'
            : file.type === 'yours'
              ? '✏️'
              : file.type === 'bootstrap'
                ? '▶️'
                : '⚙';
        const iconClass =
          file.type === 'fw'
            ? styles.fileIconFw
            : file.type === 'yours'
              ? styles.fileIconYours
              : file.type === 'config'
                ? styles.fileIconConfig
                : undefined;

        return (
          <li key={file.path} className={styles.fileItem}>
            <div className={clsx(styles.fileRow, highlighted && styles.fileRowHighlight)}>
              <span className={iconClass} aria-hidden>
                {icon}
              </span>
              {file.path}
            </div>
            {file.children && highlighted && (
              <ul className={styles.fileChildren}>
                {file.children.map((child) => (
                  <li key={child}>└ {child}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
      {showFrameworkInside && (
        <div className={styles.fwCard} aria-label="Возможности фреймворка">
          <div className={styles.fwCardTitle}>
            🏗️ {FRAMEWORK.name}@{FRAMEWORK.version}
          </div>
          <p style={{margin: '0 0 0.35rem', opacity: 0.9}}>{FRAMEWORK.tagline}</p>
          {FRAMEWORK.provides.map((item) => (
            <div key={item.name} className={styles.provideRow}>
              <span className={styles.provideName}>{item.name}</span>
              <span> — {item.desc}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function RequestFlowDiagram({activeNodes}) {
  const order = ['browser', 'router', 'handler'];
  return (
    <div className={styles.requestFlow} aria-label="Путь HTTP-запроса">
      {order.map((id, i) => (
        <React.Fragment key={id}>
          {i > 0 && <span className={styles.iocArrow} aria-hidden>→</span>}
          <span
            className={clsx(
              styles.requestNode,
              id === 'handler' && styles.requestNodeYours,
              activeNodes?.includes(id) && styles.requestNodeActive,
            )}
          >
            {REQUEST_LABELS[id]}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function FrameworkDemoInner() {
  const [viewMode, setViewMode] = useState('framework');
  const [stepIndex, setStepIndex] = useState(0);
  const [userInput, setUserInput] = useState('привет');
  const [output, setOutput] = useState('');

  const isFramework = viewMode === 'framework';
  const steps = isFramework ? FRAMEWORK_STEPS : [];
  const step = steps[stepIndex] ?? steps[0];
  const modeMeta = VIEW_MODES[viewMode];

  const code = isFramework
    ? CODE_SNIPPETS[step?.codeFile] ?? ''
    : LIBRARY_SNIPPETS['src/app.js'];

  const showFrameworkInside =
    isFramework && (step?.id === 'scaffold' || step?.id === 'request');
  const canSimulate =
    (isFramework && (step?.id === 'request' || step?.id === 'response')) ||
    !isFramework;

  const resetView = useCallback((nextMode) => {
    setViewMode(nextMode);
    setStepIndex(0);
    setOutput('');
  }, []);

  const runSimulation = useCallback(() => {
    if (isFramework) {
      const result = runFrameworkRequest();
      setOutput(result.lines.join('\n'));
    } else {
      const result = runLibrarySample(userInput);
      setOutput(result.lines.join('\n'));
    }
  }, [isFramework, userInput]);

  const highlightFiles = useMemo(() => {
    if (!isFramework) return ['src/app.js'];
    return step?.highlightFiles ?? [];
  }, [isFramework, step]);

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Фреймворк: каркас и применение</h4>
        <p className={styles.subtitle}>
          Структура проекта, инверсия управления и путь HTTP-запроса на примере MiniWeb
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.modeBar} role="tablist" aria-label="Сравнение с библиотекой">
          {Object.values(VIEW_MODES).map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={viewMode === m.id}
              className={clsx(
                styles.modeBtn,
                viewMode === m.id &&
                  (m.id === 'library' ? styles.modeBtnActiveLib : styles.modeBtnActiveFw),
              )}
              onClick={() => resetView(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className={styles.hint}>{modeMeta.hint}</p>

        <ControlFlowBanner mode={viewMode} />

        {isFramework && (
          <div className={styles.stepBar} role="tablist" aria-label="Этапы применения фреймворка">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={stepIndex === idx}
                className={clsx(
                  styles.stepChip,
                  stepIndex === idx && styles.stepChipActive,
                  idx < stepIndex && styles.stepChipDone,
                )}
                onClick={() => {
                  setStepIndex(idx);
                  setOutput('');
                }}
              >
                {s.short}
              </button>
            ))}
          </div>
        )}

        {isFramework && step && (
          <>
            <h5 style={{margin: '0 0 0.35rem', fontSize: '0.95rem'}}>{step.title}</h5>
            <p className={styles.descBlock}>{step.description}</p>
          </>
        )}

        {!isFramework && (
          <>
            <h5 style={{margin: '0 0 0.35rem', fontSize: '0.95rem'}}>Вызов библиотеки из своего кода</h5>
            <p className={styles.descBlock}>
              Программа сама решает, когда импортировать lodash и вызвать capitalize. Поток
              выполнения полностью под вашим контролем — в отличие от фреймворка.
            </p>
          </>
        )}

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              {isFramework ? 'Структура проекта на фреймворке' : 'Ваш проект'}
            </div>
            <div className={styles.panelBody}>
              <ProjectTree
                highlightFiles={highlightFiles}
                showFrameworkInside={showFrameworkInside}
              />
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>
              {isFramework ? step?.codeFile ?? 'код' : 'src/app.js'}
            </div>
            <pre className={styles.codeBlock}>{code}</pre>
            {isFramework && step?.terminal && (
              <div className={styles.terminal} aria-label="Консоль">
                {step.terminal.map((line, i) => (
                  <div
                    key={line}
                    className={clsx(i > 0 && styles.terminalLineMuted)}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isFramework && step?.requestFlow && (
          <RequestFlowDiagram activeNodes={step.requestFlow} />
        )}

        {isFramework && step?.insight && <p className={styles.insight}>{step.insight}</p>}

        {canSimulate && (
          <>
            {!isFramework && (
              <div className={styles.inputRow}>
                <label htmlFor="fw-lib-input">Строка для capitalize:</label>
                <input
                  id="fw-lib-input"
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  maxLength={40}
                />
              </div>
            )}
            <div className={styles.actions}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={runSimulation}
              >
                {isFramework ? '▶ Симулировать GET /api/posts' : '▶ Запустить пример'}
              </button>
              {isFramework && stepIndex > 0 && (
                <button
                  type="button"
                  className="it-demo__btn"
                  onClick={() => {
                    setStepIndex((i) => i - 1);
                    setOutput('');
                  }}
                >
                  ← Назад
                </button>
              )}
              {isFramework && stepIndex < steps.length - 1 && (
                <button
                  type="button"
                  className="it-demo__btn"
                  onClick={() => {
                    setStepIndex((i) => i + 1);
                    setOutput('');
                  }}
                >
                  Далее →
                </button>
              )}
            </div>
            <div className={styles.output} aria-live="polite">
              {output ||
                (isFramework
                  ? 'Нажмите "Симулировать", чтобы увидеть, как фреймворк обрабатывает запрос и вызывает ваш код.'
                  : 'Нажмите "Запустить пример", чтобы увидеть вызов библиотеки.')}
            </div>
          </>
        )}

        {isFramework && !canSimulate && (
          <div className={styles.actions}>
            {stepIndex > 0 && (
              <button
                type="button"
                className="it-demo__btn"
                onClick={() => setStepIndex((i) => i - 1)}
              >
                ← Назад
              </button>
            )}
            {stepIndex < steps.length - 1 && (
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={() => setStepIndex((i) => i + 1)}
              >
                Далее →
              </button>
            )}
          </div>
        )}
      </div>
    </DemoShell>
  );
}

export default FrameworkDemoInner;
