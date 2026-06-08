import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import terminalStyles from './MiniDbTerminal.module.css';
import {useTerminalBodyScroll} from './useTerminalBodyScroll';

const LINE_CLASS = {
  banner: terminalStyles.banner,
  system: terminalStyles.system,
  muted: terminalStyles.muted,
  success: terminalStyles.success,
  error: terminalStyles.error,
  output: terminalStyles.output,
  command: terminalStyles.commandLine,
};

function TerminalLine({item, prompt}) {
  if (item.type === 'command') {
    return (
      <div className={terminalStyles.line}>
        <span className={terminalStyles.commandLine}>
          <span className={terminalStyles.prompt}>{prompt}</span> {item.command}
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

export default function MiniDbTerminal({
  prompt,
  welcomeLines,
  execute,
  hints = [],
  minHeight = 220,
  title,
}) {
  const [lines, setLines] = useState(welcomeLines);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const headerTitle = title ?? (prompt.replace(/\s*>+\s*$/, '').trim() || 'shell');

  useTerminalBodyScroll(scrollRef, [lines]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const run = useCallback(
    (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      setLines((prev) => [...prev, {type: 'command', command: cmd}]);
      setHistory((h) => [...h, cmd]);

      if (cmd === 'clear') {
        setLines(welcomeLines);
        return;
      }

      const result = execute(cmd);
      if (result.lines?.length) {
        setLines((prev) => [...prev, ...result.lines]);
      }
    },
    [execute, welcomeLines],
  );

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
      setInput('');
      setHistIdx(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const i = histIdx < history.length - 1 ? histIdx + 1 : histIdx;
      setHistIdx(i);
      setInput(history[history.length - 1 - i]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) {
        const i = histIdx - 1;
        setHistIdx(i);
        setInput(history[history.length - 1 - i]);
      } else {
        setHistIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div className={clsx(terminalStyles.shell, terminalStyles.shellEmbedded)}>
      <div className={terminalStyles.header}>
        <div className={terminalStyles.buttons}>
          <button
            type="button"
            className={clsx(terminalStyles.winBtn, terminalStyles.winBtnRed)}
            title="Очистить экран"
            aria-label="Очистить экран"
            onClick={() => run('clear')}
          />
          <button
            type="button"
            className={clsx(terminalStyles.winBtn, terminalStyles.winBtnGreen)}
            title="Фокус на ввод"
            aria-label="Фокус на ввод"
            onClick={focusInput}
          />
        </div>
        <div className={terminalStyles.title}>{headerTitle}</div>
        <span className={terminalStyles.status} aria-hidden>
          ● online
        </span>
      </div>

      <div
        ref={scrollRef}
        className={terminalStyles.body}
        style={{minHeight}}
        onClick={focusInput}
        role="presentation"
      >
        {lines.map((item, i) => (
          <TerminalLine key={`${item.type}-${i}`} item={item} prompt={prompt} />
        ))}
        <div className={terminalStyles.inputRow}>
          <span className={terminalStyles.prompt}>{prompt}</span>
          <span className={terminalStyles.inputWrap}>
            <input
              ref={inputRef}
              className={terminalStyles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Команда"
              placeholder="введите команду…"
            />
            {!input && <span className={terminalStyles.cursor} aria-hidden />}
          </span>
        </div>
      </div>

      {hints.length > 0 && (
        <div className={terminalStyles.hints}>
          {hints.map((hint) => (
            <button
              key={hint}
              type="button"
              className={terminalStyles.hintBtn}
              onClick={() => run(hint)}
            >
              {hint}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
