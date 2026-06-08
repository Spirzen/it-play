import React, {useCallback, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {useTerminalBodyScroll} from '@/components/shared/kb/useTerminalBodyScroll';
import {
  BASH_LESSONS,
  INITIAL_CWD,
  evaluateLessonProgress,
  executeBashCommand,
  formatPromptPath,
  getCompletions,
  getLesson,
  getWelcomeLines,
} from '@/components/shared/kb/bashShellEngine';
import terminalStyles from '@/components/demos/TerminalEmulator.module.css';
import styles from '@/components/demos/BashShellPlay.module.css';

const BANNER = `╭─ universe-it · Bash тренажёр ───────────────╮
│  Tab — дополнение · ↑↓ — история · help     │
╰─────────────────────────────────────────────╯`;

const LINE_CLASS = {
  banner: terminalStyles.banner,
  system: terminalStyles.system,
  muted: terminalStyles.muted,
  success: terminalStyles.success,
  error: terminalStyles.error,
  output: terminalStyles.output,
  command: terminalStyles.commandLine,
};

function TerminalLine({item, cwd}) {
  if (item.type === 'banner') {
    return <pre className={terminalStyles.banner}>{BANNER}</pre>;
  }
  if (item.type === 'command') {
    const path = formatPromptPath(item.cwd ?? cwd);
    return (
      <div className={terminalStyles.line}>
        <span className={terminalStyles.commandLine}>
          <span className={terminalStyles.prompt}>guest@universe-it:{path}$</span> {item.command}
        </span>
      </div>
    );
  }
  return (
    <div className={clsx(terminalStyles.line, LINE_CLASS[item.type] ?? terminalStyles.output)}>
      {item.text}
    </div>
  );
}

function BashShellPlayInner({lesson: lessonProp = 'intro'}) {
  const lesson = useMemo(() => getLesson(lessonProp), [lessonProp]);
  const [lines, setLines] = useState(() => getWelcomeLines());
  const [cwd, setCwd] = useState(INITIAL_CWD);
  const [state, setState] = useState({cwd: INITIAL_CWD, commandHistory: [], vars: {}});
  const [inputValue, setInputValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabHint, setTabHint] = useState('');
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const progress = useMemo(
    () => evaluateLessonProgress(lesson.id, state.commandHistory, state),
    [lesson.id, state],
  );

  useTerminalBodyScroll(bodyRef, [lines]);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const runCommand = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;

      const result = executeBashCommand(cmd, state);

      if (result.clear) {
        setLines(getWelcomeLines().slice(0, 1));
        setState(result.state);
        setCwd(result.state.cwd);
        setTabHint('');
        return;
      }

      if (result.reboot) {
        setLines((prev) => [...prev, ...result.lines]);
        setTimeout(() => {
          setLines(getWelcomeLines());
          setCwd(INITIAL_CWD);
          setState({cwd: INITIAL_CWD, commandHistory: [], vars: {}});
          setInputValue('');
        }, 700);
        return;
      }

      setState(result.state);
      setCwd(result.state.cwd);
      setLines((prev) => [...prev, ...result.lines]);
      setTabHint('');
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
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = getCompletions(inputValue, cwd);
      if (matches.length === 1) {
        setInputValue(`${matches[0]} `);
        setTabHint('');
      } else if (matches.length > 1) {
        setTabHint(matches.join('  '));
      }
    }
  };

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const titlePath = formatPromptPath(cwd);

  return (
    <DemoShell>
      <DemoCard
        title="Эмулятор Bash"
        subtitle="Учебный терминал: команды Linux не выполняются на сервере — только симуляция для практики"
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

          <div className={terminalStyles.shell}>
            <div className={terminalStyles.header}>
              <div className={terminalStyles.buttons}>
                <button
                  type="button"
                  className={clsx(terminalStyles.winBtn, terminalStyles.winBtnRed)}
                  aria-label="Очистить"
                  onClick={() => runCommand('clear')}
                />
                <button
                  type="button"
                  className={clsx(terminalStyles.winBtn, terminalStyles.winBtnYellow)}
                  aria-label="Справка"
                  onClick={() => runCommand('help')}
                />
              </div>
              <div className={terminalStyles.title}>bash — guest@universe-it:{titlePath}</div>
            </div>
            <div
              ref={bodyRef}
              className={terminalStyles.body}
              onClick={focusInput}
              role="presentation">
              {lines.map((item, index) => (
                <TerminalLine key={`${index}-${item.type}`} item={item} cwd={cwd} />
              ))}
              <div className={terminalStyles.inputRow}>
                <span className={terminalStyles.prompt}>guest@universe-it:{titlePath}$</span>
                <input
                  ref={inputRef}
                  type="text"
                  className={terminalStyles.input}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setTabHint('');
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Команда Bash"
                />
              </div>
              {tabHint && <div className={clsx(terminalStyles.line, terminalStyles.muted)}>{tabHint}</div>}
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default BashShellPlayInner;
