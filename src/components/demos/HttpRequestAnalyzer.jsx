import React, {useCallback, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import useCopyToClipboard from '@/components/shared/kb/useCopyToClipboard';
import styles from '@/components/shared/kb/toolDemo.module.css';

const EXAMPLES = [
  {
    id: 'get',
    label: 'GET',
    text: `GET /api/users HTTP/1.1\nHost: api.example.com\nAccept: application/json\nUser-Agent: DemoClient/1.0`,
  },
  {
    id: 'post',
    label: 'POST',
    text: `POST /login HTTP/1.1\nHost: auth.example.com\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 35\n\nusername=admin&password=secret`,
  },
];

const METHOD_CLASS = {
  GET: styles.methodGet,
  POST: styles.methodPost,
  PUT: styles.methodPut,
  DELETE: styles.methodDelete,
  PATCH: styles.methodPut,
  HEAD: styles.methodDefault,
  OPTIONS: styles.methodDefault,
};

function parseHttpRequest(raw) {
  const lines = raw.split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) {
    throw new Error('Входные данные пусты.');
  }

  const firstLine = lines[0];
  const parts = firstLine.split(/\s+/);
  if (parts.length < 2) {
    throw new Error('Ожидается: МЕТОД путь [версия]');
  }

  const method = parts[0].toUpperCase();
  const path = parts[1];
  const version = parts.length >= 3 ? parts.slice(2).join(' ') : '';

  const headers = {};
  let bodyStartIndex = -1;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '') {
      bodyStartIndex = i + 1;
      break;
    }
    const colon = line.indexOf(':');
    if (colon > 0) {
      headers[line.substring(0, colon).trim()] = line.substring(colon + 1).trim();
    }
  }

  let body = null;
  if (bodyStartIndex > -1 && bodyStartIndex < lines.length) {
    body = lines.slice(bodyStartIndex).join('\n');
  } else if (headers['Content-Length'] || headers['Transfer-Encoding']) {
    body = '(тело не передано, но заголовки указывают на его наличие)';
  }

  return {requestLine: firstLine, method, path, version, headers, body, hasBody: Boolean(body)};
}

function toCurl(parsed) {
  const host = parsed.headers.Host || parsed.headers.host || 'localhost';
  const url = parsed.path.startsWith('http') ? parsed.path : `https://${host}${parsed.path}`;
  let cmd = `curl -X ${parsed.method} '${url}'`;
  Object.entries(parsed.headers).forEach(([k, v]) => {
    if (k.toLowerCase() !== 'host') {
      cmd += ` \\\n  -H '${k}: ${v}'`;
    }
  });
  if (parsed.body && !parsed.body.startsWith('(')) {
    cmd += ` \\\n  -d '${parsed.body.replace(/'/g, "'\\''")}'`;
  }
  return cmd;
}

function HttpRequestAnalyzerInner() {
  const [inputText, setInputText] = useState('');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [activeExample, setActiveExample] = useState(null);
  const {copy, isCopied} = useCopyToClipboard();

  const runParse = useCallback(
    (text = inputText) => {
      setError(null);
      setParsed(null);
      const clean = text.trim();
      if (!clean) {
        return;
      }
      try {
        setParsed(parseHttpRequest(clean));
      } catch (err) {
        setError(err.message);
      }
    },
    [inputText],
  );

  const curl = useMemo(() => (parsed ? toCurl(parsed) : ''), [parsed]);

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setInputText(ex.text);
    runParse(ex.text);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Анализатор HTTP-запроса"
        subtitle="Разбор строки запроса, заголовков и тела. Можно сгенерировать эквивалент curl."
      >
        <div className={styles.chips}>
          <span className="it-demo__label" style={{margin: 0, alignSelf: 'center'}}>
            Шаблоны:
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

        <label className="it-demo__label" htmlFor="http-input">
          Сырой HTTP-запрос
        </label>
        <textarea
          id="http-input"
          className={clsx('it-demo__textarea', styles.textareaMono)}
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setActiveExample(null);
          }}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              runParse();
            }
          }}
          placeholder={'GET /index.html HTTP/1.1\nHost: example.com\n\n'}
          rows={7}
        />

        <div className={styles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => runParse()}>
            Проанализировать
          </button>
          {parsed && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={() => copy(curl, 'curl')}
            >
              {isCopied('curl') ? 'Скопировано' : 'Копировать curl'}
            </button>
          )}
        </div>

        {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

        {parsed && (
          <div className="it-demo__table-wrap">
            <p className={styles.sectionTitle}>Строка запроса</p>
            <table className="it-demo__table">
              <tbody>
                <tr>
                  <td>Метод</td>
                  <td>
                    <span className={clsx(styles.methodBadge, METHOD_CLASS[parsed.method] || styles.methodDefault)}>
                      {parsed.method}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Путь</td>
                  <td className={styles.valueMono}>{parsed.path}</td>
                </tr>
                <tr>
                  <td>Версия</td>
                  <td className={styles.valueMono}>{parsed.version || '—'}</td>
                </tr>
              </tbody>
            </table>

            <p className={styles.sectionTitle}>Заголовки</p>
            <table className="it-demo__table">
              <tbody>
                {Object.keys(parsed.headers).length === 0 ? (
                  <tr>
                    <td colSpan={2}>Заголовки отсутствуют</td>
                  </tr>
                ) : (
                  Object.entries(parsed.headers).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td className={styles.valueMono}>{value}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <p className={styles.sectionTitle}>Тело</p>
            <table className="it-demo__table">
              <tbody>
                <tr>
                  <td>Наличие</td>
                  <td>{parsed.hasBody ? 'Да' : 'Нет'}</td>
                </tr>
                {parsed.body && (
                  <tr>
                    <td>Содержимое</td>
                    <td>
                      <pre className={styles.mono} style={{margin: 0, whiteSpace: 'pre-wrap'}}>
                        {parsed.body}
                      </pre>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {curl && (
              <>
                <p className={styles.sectionTitle}>Эквивалент curl</p>
                <pre className="it-demo__terminal">{curl}</pre>
              </>
            )}
          </div>
        )}

        <div className="it-demo__alert it-demo__alert--info">
          Скопируйте запрос из DevTools (Network) или вывода <code className={styles.mono}>curl -v</code>. Пустая
          строка отделяет заголовки от тела.
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default HttpRequestAnalyzerInner;
