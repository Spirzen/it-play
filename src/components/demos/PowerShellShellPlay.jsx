import React, {useCallback, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PS_INITIAL_CWD,
  PS_LESSONS,
  evaluatePsLesson,
  executePsCommand,
  formatPsPrompt,
  getPsLesson,
  getPsWelcomeLines,
} from '@/components/shared/kb/powershellShellEngine';
import {useTerminalBodyScroll} from '@/components/shared/kb/useTerminalBodyScroll';
import styles from '@/components/demos/PowerShellShellPlay.module.css';

const BANNER = `Windows PowerShell
(C) Microsoft Corporation. Учебный эмулятор universe-it`;

function PsLine({item, cwd}) {
  if (item.type === 'banner') {
    return <pre className={styles.banner}>{BANNER}</pre>;
  }
  if (item.type === 'command') {
    return (
      <div className={styles.line}>
        <span className={styles.prompt}>PS {formatPsPrompt(item.cwd ?? cwd)}&gt; </span>
        <span className={styles.commandLine}>{item.command}</span>
      </div>
    );
  }
  const tone = {
    success: styles.success,
    error: styles.error,
    system: styles.system,
    muted: styles.muted,
  }[item.type];
  return <div className={clsx(styles.line, tone ?? styles.output)}>{item.text}</div>;
}

function PowerShellShellPlayInner({lesson: lessonProp = 'intro'}) {
  const lesson = useMemo(() => getPsLesson(lessonProp), [lessonProp]);
  const [lines, setLines] = useState(() => getPsWelcomeLines());
  const [state, setState] = useState({cwd: PS_INITIAL_CWD, commandHistory: [], vars: {}});
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const progress = useMemo(
    () => evaluatePsLesson(lesson.id, state.commandHistory, state),
    [lesson.id, state],
  );

  useTerminalBodyScroll(bodyRef, [lines]);

  const runCommand = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      const result = executePsCommand(cmd, state);
      if (result.clear) {
        setLines(getPsWelcomeLines().slice(0, 1));
        setState(result.state);
        return;
      }
      setState(result.state);
      setLines((prev) => [...prev, ...result.lines]);
    },
    [state],
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(inputValue);
      setInputValue('');
      setHistoryIndex(-1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = state.commandHistory;
      if (!hist.length) return;
      const newIndex = historyIndex < hist.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInputValue(hist[hist.length - 1 - newIndex]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(state.commandHistory[state.commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <DemoShell>
      <DemoCard
        title="Эмулятор PowerShell"
        subtitle="Командлеты и конвейер в безопасной симуляции — без доступа к реальной Windows"
      >
        <div className={styles.wrap}>
          <div className={styles.lessonPanel}>
            <p className={styles.lessonTitle}>{lesson.title}</p>
            <p className={styles.lessonGoal}>{lesson.goal}</p>
            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{width: `${pct}%`}} />
              </div>
              <span>
                {progress.done}/{progress.total}
              </span>
              {progress.complete && <span className={styles.progressDone}>Готово</span>}
            </div>
            <div className={styles.hintRow}>
              {lesson.hints?.map((h) => (
                <button key={h} type="button" className={styles.hintBtn} onClick={() => runCommand(h)}>
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.shell}>
            <div className={styles.header}>
              <span className={styles.title}>Administrator: PowerShell</span>
            </div>
            <div
              ref={bodyRef}
              className={styles.body}
              onClick={() => inputRef.current?.focus()}
              role="presentation">
              {lines.map((item, index) => (
                <PsLine key={`${index}-${item.type}`} item={item} cwd={state.cwd} />
              ))}
              <div className={styles.inputRow}>
                <span className={styles.prompt}>PS {formatPsPrompt(state.cwd)}&gt; </span>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.input}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Команда PowerShell"
                />
              </div>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default PowerShellShellPlayInner;
