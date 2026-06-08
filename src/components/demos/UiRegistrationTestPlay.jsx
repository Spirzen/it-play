import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {REGISTRATION_SCENARIOS, validateRegistration} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function UiRegistrationTestPlayInner() {
  const [form, setForm] = useState({name: '', email: '', password: ''});
  const [submitted, setSubmitted] = useState(false);
  const [selenium, setSelenium] = useState(false);
  const [highlight, setHighlight] = useState(null);
  const [done, setDone] = useState(() => new Set());

  const {ok, errors} = validateRegistration(form);

  const applyScenario = (sc) => {
    setForm(sc.data);
    setSubmitted(false);
    setHighlight(selenium ? (sc.expect === 'error-email' ? 'email' : sc.expect === 'error-password' ? 'password' : 'name') : null);
  };

  const submit = () => {
    setSubmitted(true);
    if (ok) setDone((d) => new Set(d).add('valid'));
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Ручной и E2E-сценарий: форма регистрации"
        subtitle="Чек-лист слева, валидация справа; режим Selenium подсвечивает поля"
      >
        <div className={styles.grid2}>
          <div>
            <p className="it-demo__label">Чек-лист</p>
            {REGISTRATION_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                className={clsx(styles.checkRow, done.has(sc.id) && styles.checkRowDone)}
                onClick={() => applyScenario(sc)}
              >
                <span>{done.has(sc.id) ? '✓' : '○'}</span>
                {sc.label}
              </button>
            ))}
            <label style={{display: 'flex', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.72rem'}}>
              <input type="checkbox" checked={selenium} onChange={(e) => setSelenium(e.target.checked)} />
              Режим Selenium (find_element → send_keys → click)
            </label>
          </div>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className={clsx(styles.formField, highlight === 'name' && styles.highlight)}>
              <label htmlFor="reg-name">Имя</label>
              <input
                id="reg-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
              />
              {submitted && errors.name && <div className={styles.formError}>{errors.name}</div>}
            </div>
            <div className={clsx(styles.formField, highlight === 'email' && styles.highlight)}>
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                value={form.email}
                onChange={(e) => setForm((f) => ({...f, email: e.target.value}))}
              />
              {submitted && errors.email && <div className={styles.formError}>{errors.email}</div>}
            </div>
            <div className={clsx(styles.formField, highlight === 'password' && styles.highlight)}>
              <label htmlFor="reg-pass">Пароль</label>
              <input
                id="reg-pass"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({...f, password: e.target.value}))}
              />
              {submitted && errors.password && <div className={styles.formError}>{errors.password}</div>}
            </div>
            {submitted && ok && (
              <p className={styles.formSuccess}>Успешная регистрация! Переход к корзине…</p>
            )}
            <button type="submit" className="it-demo__btn it-demo__btn--primary">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default UiRegistrationTestPlayInner;
