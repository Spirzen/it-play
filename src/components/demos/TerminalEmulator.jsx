import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';

import {
  executeCommand,
  formatPromptPath,
  getCompletions,
  getWelcomeLines,
  INITIAL_CWD,
} from '@/components/shared/kb/terminalEngine';
import {useTerminalBodyScroll} from '@/components/shared/kb/useTerminalBodyScroll';
import styles from '@/components/demos/TerminalEmulator.module.css';

const BANNER = `╭─ universe-it ─────────────────────────────╮
│  ██╗████████╗   CLI · bash · учебный режим  │
│  ██║╚══██╔══╝   Tab — дополнение · ↑↓ — история │
╰─────────────────────────────────────────────╯`;

const QUICK_COMMANDS = [
  {label: 'help', cmd: 'help'},
  {label: 'ls', cmd: 'ls'},
  {label: 'pwd', cmd: 'pwd'},
  {label: 'tree', cmd: 'tree'},
  {label: 'cat readme', cmd: 'cat readme.txt'},
  {label: 'man ls', cmd: 'man ls'},
  {label: 'ping', cmd: 'ping localhost'},
];

const LINE_CLASS = {
  banner: styles.banner,
  system: styles.system,
  muted: styles.muted,
  success: styles.success,
  error: styles.error,
  output: styles.output,
  command: styles.commandLine,
};

function TerminalLine({item, cwd}) {
  if (item.type === 'banner') {
    return <pre className={styles.banner}>{BANNER}</pre>;
  }
  if (item.type === 'command') {
    const path = formatPromptPath(item.cwd ?? cwd);
    return (
      <div className={styles.line}>
        <span className={styles.commandLine}>
          <span className={styles.prompt}>guest@universe-it:{path}$</span> {item.command}
        </span>
      </div>
    );
  }
  return (
    <div className={clsx(styles.line, LINE_CLASS[item.type] ?? styles.output)}>{item.text}</div>
  );
}

function TerminalEmulatorInner() {
  const [lines, setLines] = useState(() => getWelcomeLines());
  const [cwd, setCwd] = useState(INITIAL_CWD);
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [rebooting, setRebooting] = useState(false);
  const [tabHint, setTabHint] = useState('');

  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useTerminalBodyScroll(bodyRef, [lines, rebooting]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const runCommand = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) {
        return;
      }

      const result = executeCommand(cmd, {cwd, commandHistory});

      if (result.reboot) {
        setLines((prev) => [...prev, ...result.lines]);
        setRebooting(true);
        setTimeout(() => {
          setLines(getWelcomeLines());
          setCwd(INITIAL_CWD);
          setCommandHistory([]);
          setHistoryIndex(-1);
          setInputValue('');
          setRebooting(false);
          setTabHint('');
        }, 900);
        return;
      }

      if (result.clear) {
        setLines(getWelcomeLines().slice(0, 1));
        setCommandHistory(result.state.commandHistory);
        setTabHint('');
        return;
      }

      setCwd(result.state.cwd);
      setCommandHistory(result.state.commandHistory);
      setLines((prev) => [...prev, ...result.lines]);
      setTabHint('');
    },
    [cwd, commandHistory],
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
      if (commandHistory.length === 0) {
        return;
      }
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      setTabHint('');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
      setTabHint('');
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = getCompletions(inputValue, cwd);
      if (matches.length === 0) {
        return;
      }
      if (matches.length === 1) {
        const parts = inputValue.trimStart().split(/\s+/);
        const cmd = parts[0]?.toLowerCase();
        const isPathCmd = ['ls', 'cd', 'cat'].includes(cmd) && parts.length > 1;
        if (isPathCmd || (parts.length > 1 && /\s$/.test(inputValue))) {
          const base = parts.slice(0, -1).join(' ');
          setInputValue(`${base} ${matches[0]}`.trimStart());
        } else if (parts.length > 1) {
          setInputValue(`${parts[0]} ${matches[0]}`);
        } else {
          setInputValue(`${matches[0]} `);
        }
        setTabHint('');
      } else {
        const common = matches.reduce((acc, m) => {
          let i = 0;
          while (i < acc.length && i < m.length && acc[i] === m[i]) {
            i += 1;
          }
          return acc.slice(0, i);
        });
        if (common.length > (inputValue.trim().split(/\s+/).pop()?.length ?? 0)) {
          const parts = inputValue.trimStart().split(/\s+/);
          if (parts.length > 1) {
            parts[parts.length - 1] = common;
            setInputValue(parts.join(' '));
          } else {
            setInputValue(common);
          }
        }
        setTabHint(matches.join('  '));
      }
    }
  };

  const titlePath = formatPromptPath(cwd);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <div className={styles.buttons}>
          <button
            type="button"
            className={clsx(styles.winBtn, styles.winBtnRed)}
            title="Очистить экран"
            aria-label="Очистить экран"
            onClick={() => runCommand('clear')}
          />
          <button
            type="button"
            className={clsx(styles.winBtn, styles.winBtnYellow)}
            title="Справка"
            aria-label="Справка"
            onClick={() => runCommand('help')}
          />
          <button
            type="button"
            className={clsx(styles.winBtn, styles.winBtnGreen)}
            title="Фокус на ввод"
            aria-label="Фокус на ввод"
            onClick={focusInput}
          />
        </div>
        <div className={styles.title}>bash — guest@universe-it:{titlePath}</div>
        <span className={styles.status} aria-hidden>
          ● online
        </span>
      </div>

      <div ref={bodyRef} className={styles.body} onClick={focusInput} role="presentation">
        {lines.map((item, index) => (
          <TerminalLine key={`${index}-${item.type}-${item.command ?? ''}`} item={item} cwd={cwd} />
        ))}

        {!rebooting && (
          <div className={styles.inputRow}>
            <span className={styles.prompt}>guest@universe-it:{titlePath}$</span>
            <span className={styles.inputWrap}>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setTabHint('');
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                aria-label="Команда терминала"
                placeholder="введите команду…"
              />
              {!inputValue && <span className={styles.cursor} aria-hidden />}
            </span>
          </div>
        )}

        {tabHint && (
          <div className={clsx(styles.line, styles.muted)} role="status">
            {tabHint}
          </div>
        )}

        {rebooting && <div className={styles.rebootOverlay}>Перезагрузка…</div>}
      </div>

      <div className={styles.hints}>
        {QUICK_COMMANDS.map(({label, cmd}) => (
          <button
            key={cmd}
            type="button"
            className={styles.hintBtn}
            onClick={() => runCommand(cmd)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TerminalEmulatorInner;
