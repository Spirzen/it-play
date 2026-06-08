import React, {useCallback, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import styles from '@/components/shared/kb/toolDemo.module.css';

const EXAMPLES = [
  {
    id: 'url',
    label: 'URL',
    value: 'https://example.com:8080/path/page?query=1&foo=bar#section',
  },
  {id: 'urn', label: 'URN', value: 'urn:isbn:0451450523'},
  {id: 'uri', label: 'URI', value: 'mailto:user@example.com'},
];

const TYPE_BADGE = {
  url: 'it-demo__badge--active',
  urn: 'it-demo__badge',
  uri: 'it-demo__badge',
};

function parseUri(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  let urlObj;
  let type = 'uri';
  let typeLabel = 'URI (Uniform Resource Identifier)';

  try {
    urlObj = new URL(trimmed);
    type = 'url';
    typeLabel = 'URL (Uniform Resource Locator)';
  } catch {
    if (trimmed.startsWith('urn:')) {
      type = 'urn';
      typeLabel = 'URN (Uniform Resource Name)';
    }
  }

  const components = {};
  const queryParams = [];

  if (type === 'url' && urlObj) {
    const search = urlObj.search?.replace(/^\?/, '') || '';
    if (search) {
      new URLSearchParams(search).forEach((val, key) => {
        queryParams.push({key, value: val});
      });
    }

    Object.assign(components, {
      scheme: urlObj.protocol.replace(':', ''),
      host: urlObj.hostname,
      port: urlObj.port || '(стандартный)',
      pathname: urlObj.pathname,
      search: urlObj.search || '(пусто)',
      hash: urlObj.hash || '(пусто)',
      username: urlObj.username || '(не указан)',
      password: urlObj.password ? '(скрыт)' : '(не указан)',
      authority: urlObj.host,
    });
  } else if (type === 'urn') {
    const parts = trimmed.split(':');
    if (parts.length >= 3) {
      Object.assign(components, {
        namespace: parts[1],
        nss: parts.slice(2).join(':'),
        fullUrn: trimmed,
      });
    } else {
      components.raw = trimmed;
      components.note = 'Не удалось распарсить структуру URN';
    }
  } else {
    const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
    if (schemeMatch) {
      const scheme = schemeMatch[1];
      const rest = trimmed.substring(scheme.length + 1);
      Object.assign(components, {
        scheme,
        authority: rest.startsWith('//') ? rest.substring(2).split('/')[0] : '(нет)',
        path: rest.startsWith('//') ? `/${rest.split('/').slice(1).join('/')}` : rest,
      });
    } else {
      components.raw = trimmed;
      components.note = 'Строка не содержит схемы URI';
    }
  }

  const diagram =
    type === 'url' && urlObj
      ? [
          {key: 'scheme', label: 'scheme', value: urlObj.protocol.replace(':', '')},
          {key: 'authority', label: 'authority', value: urlObj.host},
          {key: 'path', label: 'path', value: urlObj.pathname},
          {key: 'query', label: 'query', value: urlObj.search || '—'},
          {key: 'hash', label: 'fragment', value: urlObj.hash || '—'},
        ]
      : [];

  return {type, typeLabel, components, queryParams, diagram, note: components.note};
}

function formatKey(key) {
  const labels = {
    nss: 'NSS',
    fullUrn: 'Full URN',
    authority: 'Authority',
  };
  return labels[key] || key.toUpperCase();
}

function UrlUriRnConverterInner() {
  const [inputString, setInputString] = useState('');
  const [activeExample, setActiveExample] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const {copy, isCopied} = useCopyToClipboard();

  const runParse = useCallback(
    (value = inputString) => {
      setError(null);
      setParsed(null);
      const text = value.trim();
      if (!text) {
        return;
      }
      try {
        setParsed(parseUri(text));
      } catch (err) {
        setError(err.message);
      }
    },
    [inputString],
  );

  const resultText = useMemo(() => {
    if (!parsed) {
      return '';
    }
    return JSON.stringify({type: parsed.typeLabel, ...parsed.components}, null, 2);
  }, [parsed]);

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setInputString(ex.value);
    runParse(ex.value);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Анализатор URI / URL / URN"
        subtitle="Вставьте адрес — система определит тип и разберёт структуру. Ctrl+Enter для быстрого анализа."
      >
        <div className={styles.chips}>
          <span className="it-demo__label" style={{margin: 0, alignSelf: 'center'}}>
            Примеры:
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              className={clsx(styles.chip, activeExample === ex.id && styles.chipActive)}
              onClick={() => loadExample(ex)}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <label className="it-demo__label" htmlFor="uri-input">
          Строка для анализа
        </label>
        <textarea
          id="uri-input"
          className={clsx('it-demo__textarea', styles.textareaMono)}
          value={inputString}
          onChange={(e) => {
            setInputString(e.target.value);
            setActiveExample(null);
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              runParse();
            }
          }}
          placeholder="https://ru.wikipedia.org/wiki/URI"
          rows={3}
        />

        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => runParse()}>
            Анализировать
          </button>
          {parsed && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(resultText, 'json')}
            >
              {isCopied('json') ? 'Скопировано' : 'Копировать JSON'}
            </button>
          )}
        </div>

        {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

        {parsed && (
          <>
            <div className={styles.resultHeader}>
              <span className={clsx('it-demo__badge', TYPE_BADGE[parsed.type])}>{parsed.typeLabel}</span>
            </div>

            {parsed.diagram.length > 0 && (
              <div className={styles.uriDiagram} aria-label="Схема URI">
                {parsed.diagram.map((p) => (
                  <span key={p.key} className={styles.uriPart} title={p.value}>
                    <strong>{p.label}</strong>
                    <br />
                    {p.value || '—'}
                  </span>
                ))}
              </div>
            )}

            <div className="it-demo__table-wrap">
              <table className="it-demo__table">
                <thead>
                  <tr>
                    <th>Компонент</th>
                    <th>Значение</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(parsed.components)
                    .filter(([k]) => k !== 'note')
                    .map(([key, value]) => (
                      <tr key={key}>
                        <td>{formatKey(key)}</td>
                        <td className={styles.valueMono}>{String(value)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {parsed.queryParams.length > 0 && (
              <>
                <p className={styles.sectionTitle}>Query-параметры</p>
                <div className="it-demo__table-wrap">
                  <table className="it-demo__table">
                    <thead>
                      <tr>
                        <th>Ключ</th>
                        <th>Значение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.queryParams.map(({key, value}) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td className={styles.valueMono}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {parsed.note && <div className="it-demo__alert it-demo__alert--warning">{parsed.note}</div>}
          </>
        )}

        <div className="it-demo__alert it-demo__alert--info">
          Подсказка: <span className={styles.kbd}>Ctrl</span> + <span className={styles.kbd}>Enter</span> — разбор
          без клика по кнопке.
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UrlUriRnConverterInner;
