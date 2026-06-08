import React, {useCallback, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {SCENARIOS, TOKEN_CLASS, getScenario, tokenizePythonLine} from '@/components/shared/kb/ideWorkspaceEngine';
import styles from '@/components/demos/IDEWorkspaceDemo.module.css';

const TOKEN_CSS = {
  [TOKEN_CLASS.kw]: styles.tokenKw,
  [TOKEN_CLASS.fn]: styles.tokenFn,
  [TOKEN_CLASS.str]: styles.tokenStr,
  [TOKEN_CLASS.num]: styles.tokenNum,
  [TOKEN_CLASS.comment]: styles.tokenComment,
  [TOKEN_CLASS.p]: styles.tokenP,
  [TOKEN_CLASS.plain]: styles.tokenPlain,
};

function AutocompletePopup({items}) {
  return (
    <div className={styles.autocomplete} role="listbox" aria-label="Автодополнение">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={clsx(styles.acItem, i === 0 && styles.acItemActive)}
          role="option"
          aria-selected={i === 0}
        >
          <span className={styles.acKind} aria-hidden>
            ƒ
          </span>
          <span>{item.label}</span>
          <span className={styles.acDetail}>{item.detail}</span>
        </div>
      ))}
    </div>
  );
}

function CodeLine({line, lineNumber, scenario}) {
  const tokens = tokenizePythonLine(line, scenario.highlight);
  const hasError = scenario.errorLines?.includes(lineNumber);
  const isCurrent = scenario.currentLine === lineNumber;
  const hasBp = scenario.breakpointLine === lineNumber;

  return (
    <div
      className={clsx(
        styles.codeRow,
        hasError && styles.codeRowError,
        isCurrent && styles.codeRowCurrent,
      )}
    >
      <div className={styles.gutter}>
        <span
          className={clsx(styles.bpDot, hasBp && styles.bpDotOn)}
          aria-hidden={!hasBp}
          role="presentation"
        />
        <span className={styles.lineNum}>{lineNumber}</span>
      </div>
      <code className={styles.codeContent}>
        {tokens.map((tok, i) => (
          <span key={i} className={TOKEN_CSS[tok.t]}>
            {tok.v}
          </span>
        ))}
        {scenario.autocomplete?.line === lineNumber && (
          <AutocompletePopup items={scenario.autocomplete.items} />
        )}
      </code>
    </div>
  );
}

function BottomPanel({scenario}) {
  const tab = scenario.bottomTab;
  if (!tab) return null;

  const tabs = [
    {id: 'terminal', label: 'TERMINAL'},
    {id: 'problems', label: 'PROBLEMS'},
    {id: 'debug', label: 'DEBUG CONSOLE'},
  ].filter((t) => t.id === tab);

  return (
    <div className={styles.bottomPanel}>
      <div className={styles.bottomTabs}>
        {tabs.map((t) => (
          <span
            key={t.id}
            className={clsx(styles.bottomTab, t.id === tab && styles.bottomTabActive)}
          >
            {t.label}
            {t.id === 'problems' && scenario.problems?.length
              ? ` (${scenario.problems.length})`
              : ''}
          </span>
        ))}
      </div>
      <div className={styles.bottomBody}>
        {tab === 'terminal' &&
          scenario.terminal?.map((line, i) => (
            <div
              key={i}
              className={clsx(
                styles.terminalLine,
                i > 0 && i < scenario.terminal.length - 1 && styles.terminalOut,
              )}
            >
              {line || '\u00a0'}
            </div>
          ))}
        {tab === 'problems' &&
          scenario.problems?.map((p, i) => (
            <div key={i} className={styles.problemRow}>
              <span className={styles.problemIcon} aria-hidden>
                ✕
              </span>
              <span>
                [{p.line},{p.col}] {p.message}
              </span>
            </div>
          ))}
        {tab === 'debug' && scenario.variables && (
          <table className={styles.varTable}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              {scenario.variables.map((v) => (
                <tr key={v.name}>
                  <td className={styles.varName}>{v.name}</td>
                  <td className={styles.varValue}>{v.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function IDEWorkspaceDemoInner() {
  const [scenarioId, setScenarioId] = useState('plain');
  const scenario = getScenario(scenarioId);

  const onScenarioChange = useCallback((id) => {
    setScenarioId(id);
  }, []);

  const showExplorerFile = scenario.fileName != null;

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>Как выглядит IDE</h4>
        <p className={styles.subtitle}>
          Интерфейс VS Code: файлы, редактор, терминал, ошибки и отладка — переключайте этапы
        </p>
      </div>

      <div className={styles.bodyWrap}>
        <div className={styles.shell}>
          <div className={styles.titleBar}>
            <div className={styles.traffic} aria-hidden>
              <span className={styles.trafficClose} />
              <span className={styles.trafficMin} />
              <span className={styles.trafficMax} />
            </div>
            <span className={styles.titleText}>
              Visual Studio Code — {scenario.tabTitle}
            </span>
          </div>

          <div className={styles.scenarioBar} role="tablist" aria-label="Этапы работы в IDE">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={scenarioId === s.id}
                className={clsx(
                  styles.scenarioBtn,
                  scenarioId === s.id && styles.scenarioBtnActive,
                )}
                onClick={() => onScenarioChange(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className={styles.workspace}>
            <div className={styles.activityBar} aria-hidden>
              <span className={clsx(styles.activityIcon, styles.activityIconActive)} title="Explorer">
                📁
              </span>
              <span className={styles.activityIcon} title="Run">
                ▶
              </span>
              <span className={styles.activityIcon} title="Extensions">
                🧩
              </span>
            </div>

            <aside className={styles.explorer} aria-label="Обозреватель файлов">
              <div className={styles.explorerHead}>Explorer</div>
              <ul className={styles.explorerTree}>
                <li className={styles.explorerFolder}>📁 WORKSPACE</li>
                {showExplorerFile ? (
                  <li className={clsx(styles.explorerItem, styles.explorerItemActive)}>
                    <span aria-hidden>🐍</span>
                    {scenario.fileName}
                  </li>
                ) : (
                  <li className={styles.explorerItem} style={{opacity: 0.5}}>
                    <span aria-hidden>📄</span>
                    (нет сохранённых файлов)
                  </li>
                )}
              </ul>
            </aside>

            <div className={styles.editorCol}>
              <div className={styles.tabRow}>
                <span className={clsx(styles.fileTab, styles.fileTabActive)}>
                  <span className={styles.fileTabIcon} aria-hidden>
                    {scenario.highlight ? '🐍' : '📄'}
                  </span>
                  {scenario.tabTitle}
                  {scenario.extensionBadge && (
                    <span className={styles.extensionPill}>{scenario.extensionBadge}</span>
                  )}
                </span>
              </div>

              <div className={styles.editor} aria-label="Редактор кода">
                {scenario.code.map((line, index) => (
                  <CodeLine
                    key={`${scenarioId}-${index}`}
                    line={line}
                    lineNumber={index + 1}
                    scenario={scenario}
                  />
                ))}
              </div>

              {scenario.debugToolbar && (
                <div className={styles.debugBar} aria-label="Панель отладки">
                  <span className={styles.debugBtn}>▶ Continue</span>
                  <span className={clsx(styles.debugBtn, styles.debugBtnMuted)}>↷ Step Over</span>
                  <span className={clsx(styles.debugBtn, styles.debugBtnMuted)}>↓ Step Into</span>
                  <span className={clsx(styles.debugBtn, styles.debugBtnMuted)}>↑ Step Out</span>
                  <span className={clsx(styles.debugBtn, styles.debugBtnMuted)}>⏹ Stop</span>
                </div>
              )}

              <BottomPanel scenario={scenario} />
            </div>
          </div>
        </div>

        <p className={styles.caption}>{scenario.caption}</p>
      </div>
    </DemoShell>
  );
}

export default IDEWorkspaceDemoInner;
