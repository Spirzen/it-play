import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ERROR_EXAMPLES,
  RESOURCE_EXAMPLES,
  VERSION_STRATEGIES,
  buildVersionPreview,
} from '@/components/shared/kb/apiDesignEngine';
import styles from '@/components/demos/ApiDesignPlay.module.css';

function ApiDesignPlayInner() {
  const [strategy, setStrategy] = useState('uri');
  const [version, setVersion] = useState(1);
  const [errorCode, setErrorCode] = useState(400);
  const [idempotency, setIdempotency] = useState(false);
  const [postCount, setPostCount] = useState(0);

  const preview = useMemo(() => buildVersionPreview(strategy, version), [strategy, version]);
  const err = ERROR_EXAMPLES[errorCode];

  const simulatePost = () => {
    if (idempotency && postCount > 0) {
      return;
    }
    setPostCount((n) => n + 1);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Проектирование REST API"
        subtitle="Версионирование, именование ресурсов, RFC 7807 и идемпотентный POST."
      >
        <label className="it-demo__label">Стратегия версионирования</label>
        <div className={styles.chips}>
          {VERSION_STRATEGIES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.chip, strategy === s.id && styles.chipActive)}
              onClick={() => setStrategy(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <label className="it-demo__label">
          Версия API: v{version}
          <input
            type="range"
            min={1}
            max={3}
            value={version}
            onChange={(e) => setVersion(Number(e.target.value))}
            style={{width: '100%', marginTop: '0.25rem'}}
          />
        </label>
        <div className={styles.urlBar}>{preview.url}</div>
        {preview.header && <div className={styles.headerLine}>{preview.header}</div>}
        <p className="it-demo__hint" style={{margin: 0}}>
          {VERSION_STRATEGIES.find((s) => s.id === strategy)?.pros} ·{' '}
          <span style={{opacity: 0.85}}>
            {VERSION_STRATEGIES.find((s) => s.id === strategy)?.cons}
          </span>
        </p>

        <label className="it-demo__label" style={{marginTop: '1rem'}}>
          Именование ресурсов
        </label>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Избегать</th>
              <th>Предпочтительно</th>
            </tr>
          </thead>
          <tbody>
            {RESOURCE_EXAMPLES.map((row) => (
              <tr key={row.bad}>
                <td className={styles.bad}>
                  <code>{row.bad}</code>
                </td>
                <td className={styles.good}>
                  <code>{row.good}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem'}}>
          <div>
            <label className="it-demo__label">Ошибка (Problem Details)</label>
            <div className={styles.chips}>
              {Object.keys(ERROR_EXAMPLES).map((code) => (
                <button
                  key={code}
                  type="button"
                  className={clsx(styles.chip, Number(errorCode) === Number(code) && styles.chipActive)}
                  onClick={() => setErrorCode(Number(code))}
                >
                  {code}
                </button>
              ))}
            </div>
            <pre className={styles.json}>{JSON.stringify(err.body, null, 2)}</pre>
          </div>
          <div>
            <label className="it-demo__label">Идемпотентный POST</label>
            <label style={{display: 'flex', gap: '0.35rem', fontSize: '0.8rem', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={idempotency}
                onChange={(e) => {
                  setIdempotency(e.target.checked);
                  setPostCount(0);
                }}
              />
              Idempotency-Key: 7e9f8a1b-…
            </label>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              style={{marginTop: '0.5rem'}}
              onClick={simulatePost}
            >
              POST /orders (повтор при таймауте)
            </button>
            <p className="it-demo__hint" style={{marginTop: '0.5rem'}}>
              {postCount === 0
                ? 'Запрос ещё не отправлялся'
                : idempotency && postCount === 1
                  ? 'Повтор с тем же ключом → 200 + сохранённый ответ (без дубля заказа)'
                  : !idempotency && postCount > 1
                    ? `Отправлено ${postCount} раз — риск дубликатов (at-least-once)`
                    : `Создано заказов: ${postCount}`}
            </p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ApiDesignPlayInner;
