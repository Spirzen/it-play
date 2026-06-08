import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  COVERAGE_LINES,
  DEAD_ISSUES,
  issuesForMode,
  linesOfSample,
} from '@/components/shared/kb/deadCodeEngine';
import styles from './executionPerfPlay.module.css';

const MODES = [
  {id: 'none', label: 'Исходник'},
  {id: 'static', label: 'Статический анализ'},
  {id: 'coverage', label: 'Покрытие тестами'},
];

function DeadCodeScannerPlayInner() {
  const [mode, setMode] = useState('none');
  const lines = useMemo(() => linesOfSample(), []);
  const issues = issuesForMode(mode);
  const issueLines = new Set(issues.map((i) => i.line));

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Поиск мёртвого кода"
        subtitle="Статический анализ и coverage — что видит инструмент"
      >
        <div className={styles.tabs}>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.tab, mode === m.id && styles.tabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          style={{
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: 8,
            padding: '0.5rem',
            maxHeight: 220,
            overflow: 'auto',
            background: 'var(--ifm-code-background)',
          }}
        >
          {lines.map((text, idx) => {
            const lineNo = idx + 1;
            const isIssue = issueLines.has(lineNo);
            const isCov = mode === 'coverage' && COVERAGE_LINES.includes(lineNo);
            return (
              <div
                key={lineNo}
                className={clsx(
                  styles.codeLine,
                  isIssue && styles.codeLineWarn,
                  isCov && !isIssue && styles.codeLineCov,
                )}
              >
                <span style={{color: 'var(--demo-muted)'}}>{lineNo}</span>
                <span>{text || ' '}</span>
              </div>
            );
          })}
        </div>

        {issues.length > 0 ? (
          <ul className={styles.issueList}>
            {issues.map((iss) => (
              <li key={iss.id}>
                <strong>{iss.title}</strong> (стр. {iss.line}) — {iss.detail}
              </li>
            ))}
          </ul>
        ) : (
          <p className="it-demo__hint" style={{margin: '0.5rem 0 0'}}>
            Выберите режим анализа: статика найдёт неиспользуемые сущности, coverage — что реально не
            выполнялось при тестах.
          </p>
        )}

        {mode === 'coverage' && (
          <p className="it-demo__hint" style={{margin: '0.35rem 0 0'}}>
            Зелёным — строки, которые прошли тест ProcessOrder; красным — недостижимое после return.
          </p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default DeadCodeScannerPlayInner;
