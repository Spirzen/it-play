import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './programPlays.module.css';

const TABS = [
  {id: 'config', label: 'Конфигурация'},
  {id: 'compute', label: 'Вычисление'},
  {id: 'process', label: 'Процессы и потоки'},
];

const CONFIG_UNITS = [
  {key: 'port', value: '8080', type: 'число'},
  {key: 'log_level', value: 'debug', type: 'строка'},
  {key: 'enable_tls', value: 'true', type: 'булево'},
];

const ENV_VARS = [
  {name: '%APPDATA%', sample: 'C:\\Users\\Admin\\AppData\\Roaming', role: 'Настройки приложений'},
  {name: '%PATH%', sample: 'C:\\Windows\\System32;…', role: 'Где искать exe'},
  {name: 'DATABASE_URL', sample: 'postgres://localhost/app', role: 'Строка подключения для кода'},
];

function ProgramBehaviorPlayInner() {
  const [tab, setTab] = useState('config');
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [showReturn, setShowReturn] = useState(false);
  const [procView, setProcView] = useState('process');

  const result = a + b;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Поведение программы"
        subtitle="Настройки, вычисления с return и многозадачность — из чего складывается реакция приложения."
      >
        <div className="it-demo__tabs" role="tablist" style={{marginBottom: '0.75rem'}}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'config' && (
          <>
            <p className="it-demo__hint" style={{marginTop: 0}}>
              Конфигурационные единицы — минимальные пары ключ/значение. Программа читает их при старте.
            </p>
            <table style={{width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign: 'left', padding: '0.35rem'}}>Ключ</th>
                  <th style={{textAlign: 'left', padding: '0.35rem'}}>Значение</th>
                  <th style={{textAlign: 'left', padding: '0.35rem'}}>Тип</th>
                </tr>
              </thead>
              <tbody>
                {CONFIG_UNITS.map((u) => (
                  <tr key={u.key}>
                    <td className={styles.mono} style={{padding: '0.35rem'}}>
                      {u.key}
                    </td>
                    <td style={{padding: '0.35rem'}}>{u.value}</td>
                    <td style={{padding: '0.35rem', color: 'var(--ifm-color-content-secondary)'}}>{u.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="it-demo__label" style={{marginTop: '0.75rem'}}>
              Переменные среды (Windows)
            </p>
            <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem'}}>
              {ENV_VARS.map((v) => (
                <li key={v.name} style={{marginBottom: '0.35rem'}}>
                  <code>{v.name}</code> = {v.sample}
                  <br />
                  <span className={styles.hint}>{v.role}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'compute' && (
          <>
            <p className="it-demo__hint" style={{marginTop: 0}}>
              Операнды + оператор → результат. <code>return</code> передаёт значение вызывающему коду.
            </p>
            <div className={styles.computeRow}>
              <label>
                a=
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(Number(e.target.value) || 0)}
                  style={{width: '3rem', marginLeft: '0.25rem'}}
                />
              </label>
              <span>+</span>
              <label>
                b=
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(Number(e.target.value) || 0)}
                  style={{width: '3rem', marginLeft: '0.25rem'}}
                />
              </label>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--sm"
                onClick={() => setShowReturn(true)}
              >
                Вызвать add()
              </button>
              {showReturn && (
                <>
                  <span>→</span>
                  <span className={styles.computeResult}>return {result}</span>
                </>
              )}
            </div>
            <pre className={styles.codeBlock}>{`def add(a, b):
    return a + b  # выход из функции + значение

x = add(${a}, ${b})  # x = ${showReturn ? result : '…'}`}</pre>
          </>
        )}

        {tab === 'process' && (
          <>
            <div className={styles.stateTrack}>
              <button
                type="button"
                className={clsx(styles.stateChip, procView === 'process' && styles.stateChipActive)}
                onClick={() => setProcView('process')}
              >
                Процесс (Chrome)
              </button>
              <button
                type="button"
                className={clsx(styles.stateChip, procView === 'threads' && styles.stateChipActive)}
                onClick={() => setProcView('threads')}
              >
                Потоки (вкладки)
              </button>
            </div>
            {procView === 'process' ? (
              <p style={{fontSize: '0.82rem', margin: 0}}>
                <strong>chrome.exe</strong> — отдельное адресное пространство, свои файлы и память. Закрытие одного
                блокнота не влияет на другой процесс.
              </p>
            ) : (
              <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem'}}>
                <li>Поток 1 — UI главного окна</li>
                <li>Поток 2 — загрузка вкладки A</li>
                <li>Поток 3 — загрузка вкладки B</li>
              </ul>
            )}
            <p className={styles.hint} style={{marginBottom: 0}}>
              Планировщик ОС переключает процессы и потоки тысячи раз в секунду — создаётся иллюзия параллельной работы.
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ProgramBehaviorPlayInner;
