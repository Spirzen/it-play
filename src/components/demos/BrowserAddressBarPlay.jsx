import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/BrowserAddressBarPlay.module.css';

const SUGGESTIONS = [
  {text: 'spirzen.ru', url: 'https://spirzen.ru/', source: 'история'},
  {text: 'github.com/spirzen', url: 'https://github.com/spirzen', source: 'закладки'},
  {text: 'spirzen.ru/articles/address-bar', url: 'https://spirzen.ru/articles/address-bar', source: 'история'},
  {text: 'chrome://settings', url: 'chrome://settings', source: 'команда'},
];

const EXAMPLES = [
  {label: 'Сайт', value: 'spirzen.ru'},
  {label: 'Поиск', value: 'как устроен dns'},
  {label: 'Полный URL', value: 'https://example.com/path?page=2&lang=ru#section'},
  {label: 'Фишинг', value: 'g00gle.com'},
];

const PART_LABELS = {
  scheme: 'Протокол',
  host: 'Хост',
  port: 'Порт',
  pathname: 'Путь',
  search: 'Строка запроса',
  hash: 'Фрагмент',
  userinfo: 'Учётные данные',
};

const PHISHING_CHECKS = [
  {re: /g00gle|googIe|g0ogle/i, hint: 'google.com'},
  {re: /faceb00k|facbook/i, hint: 'facebook.com'},
  {re: /yourbank\.[a-z0-9-]+\.(ru|com)/i, hint: 'проверьте домен банка'},
];

function classifyInput(text) {
  const t = text.trim();
  if (!t) return null;
  if (/\s/.test(t)) return 'search';
  if (/^https?:\/\//i.test(t) || /^[a-z][a-z0-9+.-]*:/i.test(t)) return 'url';
  if (/^[\w.-]+\.[a-z]{2,}([\/?#]|$)/i.test(t)) return 'url';
  if (t.includes('.') && /^[\w./?#&=%@-]+$/i.test(t)) return 'url';
  return 'search';
}

function parseUrl(text) {
  const t = text.trim();
  if (!t) return null;
  try {
    if (/^https?:\/\//i.test(t) || /^[a-z][a-z0-9+.-]*:/i.test(t)) {
      return new URL(t);
    }
    return new URL(`https://${t}`);
  } catch {
    return null;
  }
}

function getPhishingWarning(hostname) {
  if (!hostname) return null;
  for (const {re, hint} of PHISHING_CHECKS) {
    if (re.test(hostname)) {
      return `Похоже на подделку. Сравните с настоящим доменом: ${hint}`;
    }
  }
  return null;
}

function buildParts(urlObj) {
  const parts = [];
  const scheme = urlObj.protocol.replace(':', '');
  parts.push({key: 'scheme', value: scheme, display: `${scheme}://`});

  if (urlObj.username) {
    parts.push({
      key: 'userinfo',
      value: `${urlObj.username}${urlObj.password ? ':***' : ''}@`,
      display: '(скрыто в браузере)',
      hidden: true,
    });
  }

  parts.push({key: 'host', value: urlObj.hostname, display: urlObj.hostname});

  if (urlObj.port) {
    parts.push({key: 'port', value: urlObj.port, display: `:${urlObj.port}`});
  }

  if (urlObj.pathname && urlObj.pathname !== '/') {
    parts.push({key: 'pathname', value: urlObj.pathname, display: urlObj.pathname});
  }

  if (urlObj.search) {
    parts.push({key: 'search', value: urlObj.search, display: urlObj.search});
  }

  if (urlObj.hash) {
    parts.push({key: 'hash', value: urlObj.hash, display: urlObj.hash});
  }

  return parts;
}

function displayUrl(urlObj, focused) {
  if (!urlObj) return '';
  let s = urlObj.href;
  if (!focused && urlObj.protocol === 'https:') {
    s = s.replace(/^https:\/\//i, '');
    if (s.startsWith('www.')) s = s.replace(/^www\./i, '');
  }
  return s;
}

function UrlHighlight({parts}) {
  return (
    <p className={styles.urlBreakdown} aria-label="Разбор URL по частям">
      {parts.map((p, i) => (
        <span key={p.key} className={clsx(styles.urlPart, styles[`urlPart_${p.key}`])}>
          {p.hidden ? (
            <span className={styles.urlPartHidden} title={p.value}>
              {p.display}
            </span>
          ) : (
            p.display
          )}
        </span>
      ))}
    </p>
  );
}

function BrowserAddressBarPlayInner() {
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const inputRef = useRef(null);
  const loadTimer = useRef(null);

  const filteredSuggestions = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q || q.length < 1) return [];
    return SUGGESTIONS.filter(
      (s) => s.text.toLowerCase().includes(q) || s.url.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [draft]);

  const showSuggestions = focused && draft.trim().length > 0 && filteredSuggestions.length > 0;

  const submit = useCallback((text) => {
    const raw = (text ?? draft).trim();
    if (!raw) return;

    if (loadTimer.current) clearTimeout(loadTimer.current);
    setLoading(true);
    setFocused(false);
    setHighlightIdx(-1);
    inputRef.current?.blur();

    loadTimer.current = setTimeout(() => {
      const kind = classifyInput(raw);
      if (kind === 'search') {
        setResult({
          kind: 'search',
          query: raw,
          pageTitle: `Поиск: "${raw}"`,
          pageBody: 'Браузер отправил запрос в поисковую систему по умолчанию — текст не похож на адрес сайта.',
        });
      } else {
        const urlObj = parseUrl(raw);
        if (!urlObj) {
          setResult({
            kind: 'search',
            query: raw,
            pageTitle: `Поиск: "${raw}"`,
            pageBody: 'Не удалось разобрать как URL — браузер интерпретировал ввод как поиск.',
          });
        } else {
          const parts = buildParts(urlObj);
          const secure = urlObj.protocol === 'https:';
          const phishing = getPhishingWarning(urlObj.hostname);
          setResult({
            kind: 'url',
            urlObj,
            parts,
            secure,
            insecure: urlObj.protocol === 'http:',
            phishing,
            pageTitle: urlObj.hostname,
            pageBody: secure
              ? 'Страница загружена по HTTPS — данные между браузером и сервером шифруются.'
              : urlObj.protocol === 'http:'
                ? 'Соединение без шифрования (HTTP). Браузер может показать предупреждение.'
                : 'Специальный адрес или внутренняя команда браузера.',
          });
        }
      }
      setDraft(raw);
      setLoading(false);
    }, 550);
  }, [draft]);

  useEffect(
    () => () => {
      if (loadTimer.current) clearTimeout(loadTimer.current);
    },
    [],
  );

  const onKeyDown = (e) => {
    if (!showSuggestions) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx((i) => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const pick = highlightIdx >= 0 ? filteredSuggestions[highlightIdx] : null;
      if (pick) {
        setDraft(pick.url.replace(/^https:\/\//i, focused ? pick.url : pick.text));
        submit(pick.url);
      } else {
        submit();
      }
    } else if (e.key === 'Escape') {
      setHighlightIdx(-1);
    }
  };

  const barValue =
    focused || !result?.urlObj
      ? draft
      : result.kind === 'url'
        ? displayUrl(result.urlObj, false)
        : draft;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Omnibox: адрес или поиск"
        subtitle="Введите адрес сайта, поисковый запрос или выберите пример. Браузер решит, куда направить ввод, и покажет разбор URL."
      >
        <div className={styles.browser} aria-label="Упрощённое окно браузера">
          <div className={styles.toolbar}>
            <span className={styles.navBtn} aria-hidden title="Назад">
              ←
            </span>
            <span className={styles.navBtn} aria-hidden title="Вперёд">
              →
            </span>
            <span
              className={clsx(styles.navBtn, loading && styles.navBtnSpin)}
              aria-hidden
              title={loading ? 'Загрузка' : 'Обновить'}
            >
              {loading ? '◌' : '↻'}
            </span>
          </div>

          <div className={styles.omniboxRow}>
            <span
              className={clsx(styles.lock, {
                [styles.lockSecure]: result?.secure,
                [styles.lockInsecure]: result?.insecure,
                [styles.lockNeutral]: !result || result.kind === 'search',
              })}
              title={
                result?.secure
                  ? 'HTTPS — соединение защищено'
                  : result?.insecure
                    ? 'HTTP — без шифрования'
                    : 'Состояние соединения'
              }
              aria-hidden
            >
              {result?.secure ? '🔒' : result?.insecure ? '⚠' : '○'}
            </span>

            <div className={styles.omniboxWrap}>
              <input
                ref={inputRef}
                type="text"
                className={styles.omnibox}
                value={barValue}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setHighlightIdx(-1);
                }}
                onFocus={() => {
                  setFocused(true);
                  if (result?.urlObj) setDraft(displayUrl(result.urlObj, true));
                }}
                onBlur={() => {
                  setTimeout(() => setFocused(false), 150);
                }}
                onKeyDown={onKeyDown}
                placeholder="Адрес или поисковый запрос…"
                aria-label="Адресная строка"
                aria-autocomplete="list"
                aria-expanded={showSuggestions}
                autoComplete="off"
                spellCheck={false}
              />
              {showSuggestions && (
                <ul className={styles.suggestions} role="listbox">
                  {filteredSuggestions.map((s, i) => (
                    <li key={s.url} role="option" aria-selected={highlightIdx === i}>
                      <button
                        type="button"
                        className={clsx(styles.suggestionBtn, highlightIdx === i && styles.suggestionActive)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setDraft(s.text);
                          submit(s.url);
                        }}
                      >
                        <span className={styles.suggestionText}>{s.text}</span>
                        <span className={styles.suggestionMeta}>{s.source}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div
            className={clsx(styles.page, loading && styles.pageLoading, result?.phishing && styles.pageDanger)}
          >
            {loading ? (
              <p className={styles.pagePlaceholder}>Загрузка…</p>
            ) : result ? (
              <>
                <p className={styles.pageTitle}>{result.pageTitle}</p>
                <p className={styles.pageBody}>{result.pageBody}</p>
              </>
            ) : (
              <p className={styles.pagePlaceholder}>
                Введите текст в адресную строку и нажмите Enter
              </p>
            )}
          </div>
        </div>

        {result && (
          <div className={styles.analysis}>
            <p className={styles.analysisBadge}>
              <span
                className={clsx(
                  'it-demo__badge',
                  result.kind === 'url' ? 'it-demo__badge--active' : 'it-demo__badge',
                )}
              >
                {result.kind === 'url' ? 'Переход по URL' : 'Поисковый запрос'}
              </span>
            </p>

            {result.kind === 'url' && result.parts?.length > 0 && (
              <div className={styles.partsBlock}>
                <p className={styles.partsTitle}>Структура URL в строке</p>
                <UrlHighlight parts={result.parts} />
                <ul className={styles.partsLegend}>
                  {result.parts.map((p) => (
                    <li key={p.key}>
                      <span className={clsx(styles.legendSwatch, styles[`urlPart_${p.key}`])} />
                      <strong>{PART_LABELS[p.key] ?? p.key}</strong>
                      <code>{p.hidden ? '(скрыто)' : p.value}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.phishing && (
              <div className={styles.warning} role="alert">
                <strong>Внимание:</strong> {result.phishing}
              </div>
            )}
          </div>
        )}

        <div className={styles.examples}>
          <span className={styles.examplesLabel}>Примеры:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
              onClick={() => {
                setDraft(ex.value);
                submit(ex.value);
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>

        <p className={styles.hint}>
          <kbd>Ctrl</kbd>+<kbd>L</kbd> (или <kbd>Cmd</kbd>+<kbd>L</kbd>) — фокус в адресной строке. При
          вводе браузер подсказывает историю и закладки, как в omnibox.
        </p>

        <div className="it-demo__row" style={{marginTop: '0.5rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={() => {
              setDraft('');
              setResult(null);
              setLoading(false);
              inputRef.current?.focus();
            }}
          >
            Сбросить
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default BrowserAddressBarPlayInner;
