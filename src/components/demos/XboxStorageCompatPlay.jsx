import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  XBOX_CONSOLE_TYPE_OPTIONS,
  XBOX_EXTERNAL_OK_GAMES,
  XBOX_GEN_OPTIONS,
  xboxExternalDriveVerdict,
} from '@/components/shared/kb/toolsGamesData';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './automationPlays.module.css';

function verdictClass(verdict) {
  if (verdict.ok === true) return styles.verdictOk;
  if (verdict.ok === false) return styles.verdictBad;
  return styles.verdictWarn;
}

function XboxStorageCompatPlayInner() {
  const [gen, setGen] = useState('durango');
  const [consoleType, setConsoleType] = useState('aware');

  const verdict = useMemo(
    () => xboxExternalDriveVerdict(gen, consoleType),
    [gen, consoleType],
  );

  const genMeta = XBOX_GEN_OPTIONS.find((g) => g.id === gen);
  const typeMeta = XBOX_CONSOLE_TYPE_OPTIONS.find((c) => c.id === consoleType);

  return (
    <DemoShell>
      <DemoCard
        title="Xbox Series: внешний диск"
        subtitle="Симулятор полей Gen и ConsoleType из &quot;Сведения о файле&quot;"
      >
        <div className={styles.fieldGrid2}>
          <div className={styles.field}>
            <label htmlFor="xbox-gen">Gen</label>
            <select
              id="xbox-gen"
              value={gen}
              onChange={(e) => setGen(e.target.value)}
            >
              {XBOX_GEN_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="it-demo__hint" style={{marginTop: '0.25rem'}}>
              {genMeta?.hint}
            </span>
          </div>
          <div className={styles.field}>
            <label htmlFor="xbox-type">ConsoleType</label>
            <select
              id="xbox-type"
              value={consoleType}
              onChange={(e) => setConsoleType(e.target.value)}
            >
              {XBOX_CONSOLE_TYPE_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="it-demo__hint" style={{marginTop: '0.25rem'}}>
              {typeMeta?.hint}
            </span>
          </div>
        </div>

        <div
          className={clsx(styles.verdictBox, verdictClass(verdict))}
          role="status"
          aria-live="polite"
        >
          <strong>{verdict.title}</strong>
          <p style={{margin: '0.35rem 0 0', fontSize: '0.85rem'}}>{verdict.detail}</p>
        </div>

        <p className="it-demo__hint" style={{marginTop: '0.75rem'}}>
          Примеры игр, которые <strong>запускаются с USB</strong> на Series:{' '}
          {XBOX_EXTERNAL_OK_GAMES.slice(0, 5).join(', ')}… (полный список в статье).
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default XboxStorageCompatPlayInner;
