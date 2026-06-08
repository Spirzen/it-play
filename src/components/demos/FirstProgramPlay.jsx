import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  buildCode,
  buildRunTimeline,
  getActiveSteps,
  getLangConfig,
  stepIndexForId,
} from '@/components/shared/kb/firstProgramEngine';
import styles from '@/components/demos/FirstProgramPlay.module.css';

const DEFAULT_MSG = 'Hello, World!';

function WebPreview({message, runCmd}) {
  return (
    <div className={styles.preview} aria-label="Предпросмотр в браузере">
      <p className={styles.previewTitle}>{message}</p>
      <p className={styles.previewUrl}>{runCmd}</p>
    </div>
  );
}

function FirstProgramPlayInner({language = 'python'}) {
  const config = useMemo(() => getLangConfig(language), [language]);
  const activeSteps = useMemo(() => getActiveSteps(config), [config]);

  const [message, setMessage] = useState(DEFAULT_MSG);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [consoleLines, setConsoleLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [highlightLine, setHighlightLine] = useState(-1);
  const runToken = useRef(0);

  const code = useMemo(() => buildCode(config, message), [config, message]);
  const codeLines = useMemo(() => code.split('\n'), [code]);

  const reset = useCallback(() => {
    runToken.current += 1;
    setRunning(false);
    setWorkflowStep(0);
    setConsoleLines([]);
    setHighlightLine(-1);
  }, []);

  useEffect(() => {
    reset();
  }, [language, reset]);

  const appendConsole = useCallback((entries) => {
    setConsoleLines((prev) => [
      ...prev,
      ...entries.map((e) => ({
        text: e.text,
        type: e.type === 'error' ? 'error' : e.text === message ? 'success' : 'info',
      })),
    ]);
  }, [message]);

  const runTimeline = useCallback(async () => {
    const token = ++runToken.current;
    setRunning(true);
    setConsoleLines([]);
    setHighlightLine(0);

    const timeline = buildRunTimeline(config, message);

    for (const block of timeline) {
      if (runToken.current !== token) return;

      const idx = stepIndexForId(activeSteps, block.stepId);
      if (idx >= 0) setWorkflowStep(idx);

      if (block.stepId === 'code') {
        setHighlightLine(Math.max(0, codeLines.length - 1));
      }

      appendConsole(block.lines);
      await new Promise((r) => setTimeout(r, block.delay));
    }

    if (runToken.current === token) {
      setRunning(false);
      setHighlightLine(-1);
    }
  }, [activeSteps, appendConsole, codeLines.length, config, message]);

  const goToStep = (idx) => {
    if (running) return;
    setWorkflowStep(idx);
    const stepId = activeSteps[idx]?.id;
    if (stepId === 'run' && config.runLogs) {
      setConsoleLines(
        config.runLogs(message.trim() || DEFAULT_MSG).map((text) => ({
          text,
          type: text === message ? 'success' : 'info',
        })),
      );
    } else if (stepId === 'setup') {
      setConsoleLines((config.setupLogs ?? []).map((text) => ({text, type: 'info'})));
    } else {
      setConsoleLines([]);
    }
  };

  const currentStepId = activeSteps[workflowStep]?.id ?? 'setup';
  const showWebPreview = config.previewType === 'web' && currentStepId === 'run';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={`Первая программа — ${config.label}`}
        subtitle={`${config.toolchain} · пошагово: среда → проект → код → ${config.buildLogs ? 'сборка → ' : ''}запуск`}
      >
        <div className={styles.msgField}>
          <label htmlFor={`fp-msg-${language}`}>Текст вывода:</label>
          <input
            id={`fp-msg-${language}`}
            type="text"
            value={message}
            disabled={running}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={80}
            aria-label="Сообщение программы"
          />
        </div>

        <div className={styles.stepTrack} role="tablist" aria-label="Этапы">
          {activeSteps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={idx === workflowStep}
              className={clsx(
                styles.stepChip,
                idx === workflowStep && styles.stepChipActive,
                idx < workflowStep && styles.stepChipDone,
              )}
              disabled={running}
              onClick={() => goToStep(idx)}
            >
              <span aria-hidden>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>

        {showWebPreview && <WebPreview message={message} runCmd={config.runCmd} />}

        <div className={styles.layout}>
          <div className={styles.ideTitle}>
            <span className={styles.ideDot} aria-hidden />
            {config.label} — {config.mainFile}
          </div>

          <aside className={styles.sidebar} aria-label="Файлы проекта">
            {config.tree.map((file) => (
              <span
                key={file}
                className={clsx(
                  styles.treeItem,
                  file === config.mainFile && styles.treeItemActive,
                )}
              >
                {file}
              </span>
            ))}
          </aside>

          <div className={styles.editorWrap}>
            <pre className={styles.codeBlock} aria-label="Исходный код">
              {codeLines.map((line, i) => (
                <span
                  key={`${i}-${line}`}
                  className={clsx(i === highlightLine && styles.codeLineActive)}
                >
                  {line || ' '}
                  {'\n'}
                </span>
              ))}
            </pre>
            <div className={styles.console} role="log" aria-live="polite" aria-label="Консоль">
              {consoleLines.length === 0 ? (
                <div className={styles.consoleLine}>Нажмите "Запустить" — здесь появятся команды и вывод</div>
              ) : (
                consoleLines.map((line, i) => (
                  <div
                    key={i}
                    className={clsx(
                      styles.consoleLine,
                      line.type === 'success' && styles.consoleSuccess,
                      line.type === 'error' && styles.consoleError,
                    )}
                  >
                    {line.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={running}
            onClick={runTimeline}
          >
            {running ? 'Выполняется…' : 'Запустить'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={running || workflowStep <= 0}
            onClick={() => goToStep(Math.max(0, workflowStep - 1))}
          >
            ← Шаг назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={running || workflowStep >= activeSteps.length - 1}
            onClick={() => goToStep(Math.min(activeSteps.length - 1, workflowStep + 1))}
          >
            Шаг вперёд →
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={running}
            onClick={reset}
          >
            Сброс
          </button>
        </div>

        <p className={styles.hint}>
          Упрощённая симуляция из статьи: реальные команды ({config.runCmd}) выполняются у вас локально после
          установки инструментов.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default FirstProgramPlayInner;
