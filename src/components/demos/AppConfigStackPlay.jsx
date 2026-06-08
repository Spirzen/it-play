import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './programPlays.module.css';

const FORMATS = {
  ini: {
    label: 'INI / .cfg',
    sample: `[server]
port = 8080
log_level = info

[database]
host = localhost`,
  },
  json: {
    label: 'JSON',
    sample: `{
  "server": { "port": 8080, "log_level": "info" },
  "database": { "host": "localhost" }
}`,
  },
  yaml: {
    label: 'YAML',
    sample: `server:
  port: 8080
  log_level: info
database:
  host: localhost`,
  },
  env: {
    label: 'Переменная среды',
    sample: `APP_PORT=8080
LOG_LEVEL=info
DATABASE_HOST=localhost`,
  },
};

const PRIORITY_SOURCES = [
  {id: 'default', rank: 5, label: 'Значение по умолчанию в коде', value: '3000', note: 'Вшито в программу, самый слабый приоритет.'},
  {id: 'file', rank: 4, label: 'config.json / appsettings', value: '8080', note: 'Файл в /etc или %ProgramData%.'},
  {id: 'env', rank: 3, label: 'Переменная среды APP_PORT', value: '9000', note: 'Задаётся в Docker -e или системных настройках.'},
  {id: 'cli', rank: 1, label: 'Флаг --port=3001', value: '3001', note: 'Аргумент командной строки — побеждает всё при запуске.'},
];

function AppConfigStackPlayInner() {
  const [formatId, setFormatId] = useState('yaml');
  const [activeSource, setActiveSource] = useState('cli');

  const format = FORMATS[formatId] ?? FORMATS.yaml;
  const resolved = useMemo(() => {
    const sorted = [...PRIORITY_SOURCES].sort((a, b) => a.rank - b.rank);
    return sorted[0]?.value ?? '8080';
  }, []);

  const active = PRIORITY_SOURCES.find((s) => s.id === activeSource) ?? PRIORITY_SOURCES[3];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Конфигурация: форматы и приоритет источников"
        subtitle="Один параметр port может быть задан в файле, среде и CLI — побеждает самый &quot;сильный&quot; источник."
      >
        <p className="it-demo__label" style={{marginBottom: '0.35rem'}}>
          Формат конфигурационного файла
        </p>
        <div className={styles.formatGrid}>
          {Object.entries(FORMATS).map(([id, f]) => (
            <button
              key={id}
              type="button"
              className={clsx(styles.formatBtn, formatId === id && styles.formatBtnActive)}
              onClick={() => setFormatId(id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <pre className={styles.codeBlock}>{format.sample}</pre>

        <p className="it-demo__label" style={{margin: '0.85rem 0 0.35rem'}}>
          Приоритет при загрузке (нажмите источник)
        </p>
        <div className={styles.priorityLadder}>
          {[...PRIORITY_SOURCES].sort((a, b) => a.rank - b.rank).map((src) => (
            <button
              key={src.id}
              type="button"
              className={clsx(styles.priorityStep, activeSource === src.id && styles.priorityStepActive)}
              onClick={() => setActiveSource(src.id)}
            >
              <span className={styles.priorityRank}>{src.rank}</span>
              <span>
                <strong>{src.label}</strong>
                <span className={styles.mono}> → port={src.value}</span>
              </span>
              <span className={styles.tag}>{src.rank === 1 ? 'сильнее' : ''}</span>
            </button>
          ))}
        </div>

        <div className={styles.resolved}>
          Итоговый <code>port</code> при запуске: <strong>{resolved}</strong> (взято из{' '}
          <strong>{PRIORITY_SOURCES.find((s) => s.value === resolved)?.label}</strong>)
        </div>
        <p className={styles.hint} style={{marginTop: '0.5rem'}}>
          {active.note} Конфигурационная единица — пара "ключ + значение"; настройка в GUI обычно пишет ту же пару в
          JSON или реестр.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AppConfigStackPlayInner;
