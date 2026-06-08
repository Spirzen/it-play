import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CRON_FIELD_META,
  CRON_PRESETS,
  FIELD_CHOICES,
  SCHEDULER_PLATFORMS,
  buildCrontabLine,
  describeCron,
  partsToExpr,
  systemdOnCalendar,
} from '@/components/shared/kb/cronScheduleEngine';
import styles from './automationPlays.module.css';

const DEFAULT_PARTS = CRON_PRESETS[0].parts;

function CronSchedulePlayInner() {
  const [parts, setParts] = useState([...DEFAULT_PARTS]);
  const [presetId, setPresetId] = useState(CRON_PRESETS[0].id);
  const [platformId, setPlatformId] = useState('cron');
  const [cmd, setCmd] = useState(CRON_PRESETS[0].cmd);

  const expr = useMemo(() => partsToExpr(parts), [parts]);
  const human = useMemo(() => describeCron(parts), [parts]);
  const platform = SCHEDULER_PLATFORMS.find((p) => p.id === platformId) ?? SCHEDULER_PLATFORMS[0];

  const applyPreset = (preset) => {
    setPresetId(preset.id);
    setParts([...preset.parts]);
    setCmd(preset.cmd);
  };

  const setField = (idx, value) => {
    setParts((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    setPresetId('');
  };

  const crontabLine = buildCrontabLine(parts, cmd);
  const systemdLine = systemdOnCalendar(parts);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Планировщик: cron-выражение"
        subtitle="Соберите расписание из пяти полей — увидите строку crontab и аналоги в systemd / Windows"
      >
        <div className="it-demo__tabs" role="tablist">
          {CRON_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx('it-demo__tab', presetId === p.id && 'it-demo__tab--active')}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.fieldGrid}>
          {CRON_FIELD_META.map((meta, idx) => (
            <div key={meta.id} className={styles.field}>
              <label>
                {meta.label}
                <span style={{fontWeight: 400, opacity: 0.7}}> ({meta.range})</span>
              </label>
              <select value={parts[idx]} onChange={(e) => setField(idx, e.target.value)}>
                {FIELD_CHOICES[meta.id].map((c) => (
                  <option key={c.v} value={c.v}>
                    {c.v} — {c.d}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <pre className={styles.expr}>{expr}</pre>
        <p className={styles.human}>{human}</p>

        <span className="it-demo__label">Платформа</span>
        <div className={styles.platformRow}>
          {SCHEDULER_PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.platformBtn, platformId === p.id && styles.platformActive)}
              onClick={() => setPlatformId(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className={styles.platformNote}>
          <strong>{platform.name}</strong> ({platform.os}) — {platform.note}
          <br />
          <code style={{fontSize: '0.72rem'}}>{platform.config}</code>
          {platformId === 'cron' && (
            <>
              <pre className={styles.diffPane} style={{marginTop: '0.5rem'}}>
                {crontabLine}
              </pre>
            </>
          )}
          {platformId === 'systemd' && (
            <pre className={styles.diffPane} style={{marginTop: '0.5rem'}}>
              {`[Timer]\n${systemdLine}\nPersistent=true`}
            </pre>
          )}
          {platformId === 'windows' && (
            <pre className={styles.diffPane} style={{marginTop: '0.5rem'}}>
              {`schtasks /create /tn "Job" /tr "${cmd}" /sc daily /st ${parts[1].padStart(2, '0')}:${parts[0].padStart(2, '0')}`}
            </pre>
          )}
          {platformId === 'launchd' && (
            <pre className={styles.diffPane} style={{marginTop: '0.5rem'}}>
              {`<key>Hour</key><integer>${parts[1]}</integer>\n<key>Minute</key><integer>${parts[0]}</integer>`}
            </pre>
          )}
        </div>

        <label className="it-demo__label" style={{display: 'block', marginTop: '0.5rem'}}>
          Команда для запуска
          <input
            className="it-demo__input"
            style={{marginTop: '0.25rem', width: '100%'}}
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
          />
        </label>
      </DemoCard>
    </DemoShell>
  );
}

export default CronSchedulePlayInner;
