import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CodeProtectionPlay.module.css';

const SOURCE = `def calculate_discount(price, rate):
    return price * (1 - rate)`;

const OBFUSCATED = `def a1b2c3d4e5f6(g7h8, i9j0):
    return g7h8 * (1 - i9j0)`;

const LICENSED_SNIPPET = `if (!LicenseValidator.IsValid()) {
    throw new LicenseException("Нет лицензии");
}
RunProtectedFeature();`;

function CodeProtectionPlayInner() {
  const [tab, setTab] = useState('license');
  const [licenseKey, setLicenseKey] = useState('');
  const [obfuscate, setObfuscate] = useState(false);
  const [runLog, setRunLog] = useState('');

  const validKey = licenseKey.trim().toUpperCase() === 'DEMO-2026-OK';

  const tryRun = () => {
    if (tab === 'license') {
      setRunLog(
        validKey
          ? '✓ Лицензия принята — функция выполнена.'
          : '✗ LicenseException: функциональность недоступна без лицензии.',
      );
      return;
    }
    if (tab === 'obfuscate') {
      setRunLog(
        obfuscate
          ? 'Декомпилятор видит a1b2c3d4e5f6 — смысл восстанавливается с трудом.'
          : 'Исходные имена price/rate читаются напрямую из байт-кода.',
      );
      return;
    }
    setRunLog('Запуск .exe: редактирование недоступно, только исполнение бинарника.');
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Защита кода от изменений"
        subtitle="Лицензия, обфускация и доставка только исполняемого артефакта"
      >
        <div className="it-demo__tabs" role="tablist">
          {[
            {id: 'license', label: 'Лицензия'},
            {id: 'obfuscate', label: 'Обфускация'},
            {id: 'binary', label: 'Только бинарник'},
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => {
                setTab(t.id);
                setRunLog('');
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'license' && (
          <>
            <pre className={styles.pre}>{LICENSED_SNIPPET}</pre>
            <label className="it-demo__label">Ключ лицензии (подсказка: DEMO-2026-OK)</label>
            <input
              className="it-demo__input"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="XXXX-XXXX-XX"
            />
          </>
        )}

        {tab === 'obfuscate' && (
          <>
            <label className={styles.toggle}>
              <input type="checkbox" checked={obfuscate} onChange={(e) => setObfuscate(e.target.checked)} />
              Применить обфускатор
            </label>
            <pre className={styles.pre}>{obfuscate ? OBFUSCATED : SOURCE}</pre>
          </>
        )}

        {tab === 'binary' && (
          <div className={styles.binaryBox}>
            <span>📦 app.dll</span>
            <span>🔒 Исходники не поставляются</span>
            <span>✍️ Подпись Authenticode проверяется при старте</span>
          </div>
        )}

        <button type="button" className="it-demo__btn it-demo__btn--sm" onClick={tryRun}>
          Симулировать запуск
        </button>
        {runLog && <p className={styles.log}>{runLog}</p>}
      </DemoCard>
    </DemoShell>
  );
}

export default CodeProtectionPlayInner;
