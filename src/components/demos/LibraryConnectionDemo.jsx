import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CODE_SNIPPETS,
  CONNECTION_MODES,
  LIBRARY,
  PROJECT_FILES,
  getSteps,
  runDemo,
} from '@/components/shared/kb/libraryConnectionEngine';
import styles from '@/components/demos/LibraryConnectionDemo.module.css';

function ConnectionFlow({mode, stepId}) {
  const nodes =
    mode === 'cdn'
      ? [
          {id: 'html', label: 'index.html'},
          {id: 'use', label: 'CDN → _'},
          {id: 'run', label: 'app.js'},
        ]
      : [
          {id: 'manifest', label: 'package.json'},
          {id: 'install', label: 'npm install'},
          {id: 'import', label: 'import'},
          {id: 'run', label: 'вызов API'},
        ];

  return (
    <div className={styles.flow} aria-label="Цепочка подключения библиотеки">
      {nodes.map((node, i) => (
        <React.Fragment key={node.id}>
          {i > 0 && <span className={styles.flowArrow} aria-hidden>→</span>}
          <span
            className={clsx(styles.flowNode, stepId === node.id && styles.flowNodeActive)}
          >
            {node.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function ProjectTree({mode, highlightFiles}) {
  const files = PROJECT_FILES[mode];

  return (
    <ul className={styles.fileList}>
      {files.map((file) => {
        const highlighted = highlightFiles.includes(file.path);
        const icon =
          file.type === 'lib' ? '📦' : file.type === 'cdn' ? '☁️' : file.type === 'config' ? '⚙' : '📄';
        const iconClass =
          file.type === 'lib'
            ? styles.fileIconLib
            : file.type === 'cdn'
              ? styles.fileIconCdn
              : file.type === 'config'
                ? styles.fileIconConfig
                : undefined;

        return (
          <li key={file.path} className={styles.fileItem}>
            <span
              className={clsx(
                styles.fileBtn,
                highlighted && styles.fileBtnHighlight,
              )}
            >
              <span className={iconClass} aria-hidden>
                {icon}
              </span>
              {file.path}
            </span>
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
  );
}

function LibraryInsideCard({visible}) {
  if (!visible) return null;

  return (
    <div className={styles.libCard} aria-label="Содержимое пакета lodash">
      <div className={styles.libCardTitle}>
        📦 {LIBRARY.name}@{LIBRARY.version}
      </div>
      <p style={{margin: '0 0 0.4rem', opacity: 0.9}}>{LIBRARY.description}</p>
      {LIBRARY.exports.map((fn) => (
        <div key={fn.name} className={styles.exportRow}>
          <span className={styles.exportName}>{fn.name}</span>
          <span>{fn.signature}</span>
          <span style={{opacity: 0.75}}>{fn.example}</span>
        </div>
      ))}
    </div>
  );
}

function LibraryConnectionDemoInner() {
  const [mode, setMode] = useState('npm');
  const [stepIndex, setStepIndex] = useState(0);
  const [userInput, setUserInput] = useState('привет');
  const [output, setOutput] = useState('');

  const steps = useMemo(() => getSteps(mode), [mode]);
  const step = steps[stepIndex] ?? steps[0];
  const code = CODE_SNIPPETS[step.codeFile] ?? '';
  const modeMeta = CONNECTION_MODES[mode];
  const showLibraryInside =
    mode === 'npm' && (step.id === 'install' || step.id === 'import');
  const canRun = step.id === 'run';

  const resetForMode = useCallback((nextMode) => {
    setMode(nextMode);
    setStepIndex(0);
    setOutput('');
  }, []);

  const runSample = useCallback(() => {
    const result = runDemo(mode, userInput);
    setOutput(result.lines.join('\n'));
  }, [mode, userInput]);

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Библиотека: установка и подключение</h4>
        <p className={styles.subtitle}>
          Как выглядит пакет изнутри и как он попадает в ваш проект — через npm или CDN
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.modeBar} role="tablist" aria-label="Способ подключения">
          {Object.values(CONNECTION_MODES).map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(
                styles.modeBtn,
                mode === m.id && (m.id === 'cdn' ? styles.modeBtnActiveCdn : styles.modeBtnActiveNpm),
              )}
              onClick={() => resetForMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <p className={styles.hint}>{modeMeta.hint}</p>

        <ConnectionFlow mode={mode} stepId={step.id} />

        <div className={styles.stepBar} role="tablist" aria-label="Этапы подключения">
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

        <h5 style={{margin: '0 0 0.35rem', fontSize: '0.95rem'}}>{step.title}</h5>
        <p className={styles.descBlock} style={{marginTop: 0}}>
          {step.description}
        </p>

        <div className={styles.layout}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>Структура проекта</div>
            <div className={styles.panelBody}>
              <ProjectTree mode={mode} highlightFiles={step.highlightFiles} />
              <LibraryInsideCard visible={showLibraryInside} />
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHead}>{step.codeFile}</div>
            <pre className={styles.codeBlock}>{code}</pre>
            {step.terminal && (
              <div className={styles.terminal} aria-label="Терминал">
                {step.terminal.map((line, i) => (
                  <div
                    key={line}
                    className={clsx(styles.terminalLine, i > 0 && styles.terminalLineMuted)}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {step.insight && <p className={styles.insight}>{step.insight}</p>}

        {canRun && (
          <>
            <div className={styles.inputRow}>
              <label htmlFor="lib-demo-input">Строка для capitalize:</label>
              <input
                id="lib-demo-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                maxLength={40}
              />
            </div>
            <div className={styles.actions}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runSample}>
                ▶ Запустить пример
              </button>
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
                  className="it-demo__btn"
                  onClick={() => setStepIndex((i) => i + 1)}
                >
                  Далее →
                </button>
              )}
            </div>
            <div className={styles.output} aria-live="polite">
              {output || 'Нажмите "Запустить пример", чтобы увидеть результат вызова библиотеки.'}
            </div>
          </>
        )}

        {!canRun && (
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

export default LibraryConnectionDemoInner;
