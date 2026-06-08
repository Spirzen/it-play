import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import {
  ATTACK_TABS,
  SQLI_PRESETS,
  XSS_PRESETS,
  randomCsrfToken,
  simulateCsrf,
  simulateSqlLogin,
  simulateXssOutput,
} from '@/components/shared/kb/webAttackSimulatorEngine';
import styles from '@/components/demos/WebAttackSimulatorPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function WebAttackSimulatorPlayInner({initialTab = 'sqli'}) {
  const {isMobile} = useBreakpoint();
  const [tab, setTab] = useState(initialTab);

  const [sqlInput, setSqlInput] = useState(SQLI_PRESETS[0].value);
  const [sqlPrepared, setSqlPrepared] = useState(false);

  const [xssInput, setXssInput] = useState(XSS_PRESETS[0].value);
  const [xssSafe, setXssSafe] = useState(true);

  const [csrfSession, setCsrfSession] = useState(true);
  const [csrfProtect, setCsrfProtect] = useState(true);
  const [csrfToken] = useState(() => randomCsrfToken());
  const [csrfFormToken, setCsrfFormToken] = useState('');

  const sqlResult = useMemo(
    () => simulateSqlLogin(sqlInput, sqlPrepared),
    [sqlInput, sqlPrepared],
  );
  const xssResult = useMemo(() => simulateXssOutput(xssInput, xssSafe), [xssInput, xssSafe]);
  const csrfResult = useMemo(
    () =>
      simulateCsrf({
        hasSession: csrfSession,
        useToken: csrfProtect,
        tokenValue: csrfToken,
        formToken: csrfFormToken,
      }),
    [csrfSession, csrfProtect, csrfToken, csrfFormToken],
  );

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор веб-атак"
        subtitle="Учебная песочница: сравните уязвимый и защищённый сценарий для SQLi, XSS и CSRF."
      >
        <div className={toolStyles.chips} style={{marginBottom: '1rem'}}>
          {ATTACK_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(toolStyles.chip, tab === t.id && toolStyles.chipActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'sqli' && (
          <div className={styles.panel}>
            <div className={toolStyles.chips}>
              {SQLI_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx(toolStyles.chip, sqlInput === p.value && toolStyles.chipActive)}
                  onClick={() => setSqlInput(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <label className="it-demo__label">Логин пользователя</label>
            <input
              className="it-demo__input"
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              spellCheck={false}
            />
            <label className="it-demo__label" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={sqlPrepared}
                onChange={(e) => setSqlPrepared(e.target.checked)}
              />
              Параметризованный запрос (Prepared Statement)
            </label>
            <div
              className={clsx(
                styles.resultBox,
                sqlResult.leaked ? styles.resultVuln : styles.resultSafe,
              )}
            >
              <p style={{margin: 0}}>{sqlResult.note}</p>
              <pre className={styles.query}>{sqlResult.query}</pre>
              {sqlResult.params && (
                <p style={{margin: '0.35rem 0 0', fontSize: '0.82rem'}}>
                  Параметры: <code>{JSON.stringify(sqlResult.params)}</code>
                </p>
              )}
              {sqlResult.rows.length > 0 && (
                <table className={styles.rows}>
                  <thead>
                    <tr>
                      <th>login</th>
                      <th>role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sqlResult.rows.map((row, i) => (
                      <tr key={`${row.login}-${i}`}>
                        <td>{row.login}</td>
                        <td>{row.role ?? row.via ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'xss' && (
          <div className={styles.panel}>
            <div className={toolStyles.chips}>
              {XSS_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx(toolStyles.chip, xssInput === p.value && toolStyles.chipActive)}
                  onClick={() => setXssInput(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <label className="it-demo__label">Комментарий на странице</label>
            <textarea
              className={clsx('it-demo__textarea', toolStyles.textareaMono)}
              rows={isMobile ? 3 : 4}
              value={xssInput}
              onChange={(e) => setXssInput(e.target.value)}
              spellCheck={false}
            />
            <label className="it-demo__label" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <input type="checkbox" checked={xssSafe} onChange={(e) => setXssSafe(e.target.checked)} />
              Безопасный вывод (экранирование / textContent)
            </label>
            <p className="it-demo__label">Превью страницы</p>
            <div
              className={clsx(styles.preview, !xssSafe && xssResult.executes && styles.previewDanger)}
            >
              {xssSafe ? (
                <span>{xssResult.displayHtml}</span>
              ) : (
                <span dangerouslySetInnerHTML={{__html: xssResult.displayHtml}} />
              )}
            </div>
            <span
              className={clsx(
                styles.badge,
                xssResult.executes && !xssSafe ? styles.badgeDanger : styles.badgeSafe,
              )}
            >
              {xssResult.executes && !xssSafe ? 'Скрипт мог бы выполниться' : 'Исполнение заблокировано'}
            </span>
            {xssResult.stolen && (
              <p style={{margin: '0.5rem 0 0', fontSize: '0.82rem'}}>
                Утечка (симуляция): <code>{xssResult.stolen}</code>
              </p>
            )}
            <p style={{margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--ifm-color-content-secondary)'}}>
              {xssResult.note}
            </p>
          </div>
        )}

        {tab === 'csrf' && (
          <div className={styles.panel}>
            <label className="it-demo__label" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={csrfSession}
                onChange={(e) => setCsrfSession(e.target.checked)}
              />
              Пользователь авторизован в банке (cookie сессии)
            </label>
            <label className="it-demo__label" style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <input
                type="checkbox"
                checked={csrfProtect}
                onChange={(e) => setCsrfProtect(e.target.checked)}
              />
              Сервер требует CSRF-токен
            </label>
            <div className={styles.split}>
              <div className={clsx(styles.siteCard, styles.siteBank)}>
                <strong>bank.example</strong>
                <p style={{margin: '0.35rem 0', fontSize: '0.82rem'}}>
                  Секретный токен формы: <code>{csrfProtect ? csrfToken : '—'}</code>
                </p>
              </div>
              <div className={clsx(styles.siteCard, styles.siteEvil)}>
                <strong>evil.example</strong>
                <p style={{margin: '0.35rem 0', fontSize: '0.82rem'}}>
                  Скрытая форма: POST /transfer на bank.example
                </p>
                {csrfProtect && (
                  <>
                    <label className="it-demo__label">Токен в поддельной форме</label>
                    <input
                      className="it-demo__input"
                      placeholder="оставьте пустым для атаки"
                      value={csrfFormToken}
                      onChange={(e) => setCsrfFormToken(e.target.value)}
                    />
                    <button
                      type="button"
                      className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                      style={{marginTop: '0.35rem'}}
                      onClick={() => setCsrfFormToken(csrfToken)}
                    >
                      Подставить верный токен
                    </button>
                  </>
                )}
              </div>
            </div>
            <div
              className={clsx(
                styles.resultBox,
                csrfResult.allowed ? styles.resultVuln : styles.resultSafe,
              )}
            >
              <p style={{margin: 0}}>
                <strong>{csrfResult.status}</strong> — {csrfResult.message}
              </p>
            </div>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default WebAttackSimulatorPlayInner;
