import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DigitalFormPlay.module.css';

const INITIAL = {
  fullName: '',
  email: '',
  phone: '',
  usesApp: '',
  appVersion: '',
  rating: '',
  comment: '',
  consent: false,
};

function validate(form, step) {
  const errors = {};
  if (step === 0) {
    if (!form.fullName.trim()) errors.fullName = 'Укажите ФИО';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Некорректный email';
  }
  if (step === 1) {
    if (!form.usesApp) errors.usesApp = 'Выберите вариант';
    if (form.usesApp === 'yes' && !form.appVersion.trim()) errors.appVersion = 'Укажите версию';
    if (!form.rating) errors.rating = 'Оцените по шкале 1–5';
  }
  if (step === 2 && !form.consent) errors.consent = 'Согласие на обработку ПДн обязательно';
  return errors;
}

function DigitalFormPlayInner() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [tried, setTried] = useState(false);

  const errors = useMemo(() => validate(form, step), [form, step]);
  const progress = ((step + (submitted ? 1 : 0)) / 3) * 100;

  const update = (key, value) => {
    setForm((f) => ({...f, [key]: value}));
    setSubmitted(false);
  };

  const next = () => {
    setTried(true);
    if (Object.keys(errors).length) return;
    setTried(false);
    if (step < 2) setStep((s) => s + 1);
    else setSubmitted(true);
  };

  const back = () => {
    setTried(false);
    setStep((s) => Math.max(0, s - 1));
    setSubmitted(false);
  };

  const preview = submitted
    ? JSON.stringify(
        {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone || null,
          usesApp: form.usesApp,
          appVersion: form.usesApp === 'yes' ? form.appVersion : null,
          rating: Number(form.rating),
          comment: form.comment || null,
          consentPd: form.consent,
          submittedAt: new Date().toISOString(),
        },
        null,
        2,
      )
    : 'Ответ появится после отправки — как запись в БД или JSON в document store.';

  return (
    <DemoShell>
      <DemoCard
        title="Конструктор формы и анкеты"
        subtitle="Валидация, шкала Лайкерта, ветвление по ответу и согласие на ПДн (152-ФЗ)"
      >
        <div className={styles.progress}>
          <div className={styles.progressBar} style={{width: `${progress}%`}} />
        </div>

        <div className={styles.layout}>
          <div>
            {!submitted && step === 0 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="df-name">ФИО *</label>
                  <input
                    id="df-name"
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    placeholder="Иванов Иван Иванович"
                  />
                  {tried && errors.fullName && <div className={styles.fieldError}>{errors.fullName}</div>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="df-email">Электронная почта *</label>
                  <input
                    id="df-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                  {tried && errors.email && <div className={styles.fieldError}>{errors.email}</div>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="df-phone">Телефон</label>
                  <input
                    id="df-phone"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </>
            )}

            {!submitted && step === 1 && (
              <>
                <div className={styles.field}>
                  <span className="it-demo__label">Пользуетесь мобильным приложением? *</span>
                  <div className={styles.checkRow}>
                    <label>
                      <input
                        type="radio"
                        name="usesApp"
                        checked={form.usesApp === 'yes'}
                        onChange={() => update('usesApp', 'yes')}
                      />
                      Да
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="usesApp"
                        checked={form.usesApp === 'no'}
                        onChange={() => {
                          update('usesApp', 'no');
                          update('appVersion', '');
                        }}
                      />
                      Нет
                    </label>
                  </div>
                  {tried && errors.usesApp && <div className={styles.fieldError}>{errors.usesApp}</div>}
                </div>
                {form.usesApp === 'yes' && (
                  <div className={styles.field}>
                    <label htmlFor="df-ver">Какая версия? *</label>
                    <input
                      id="df-ver"
                      value={form.appVersion}
                      onChange={(e) => update('appVersion', e.target.value)}
                      placeholder="2.4.1"
                    />
                    {tried && errors.appVersion && (
                      <div className={styles.fieldError}>{errors.appVersion}</div>
                    )}
                  </div>
                )}
                <div className={styles.field}>
                  <span className="it-demo__label">Оценка сервиса (шкала Лайкерта) *</span>
                  <div className={styles.scale}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={clsx(styles.scaleBtn, form.rating === String(n) && styles.scaleActive)}
                        onClick={() => update('rating', String(n))}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {tried && errors.rating && <div className={styles.fieldError}>{errors.rating}</div>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="df-comment">Комментарий</label>
                  <textarea
                    id="df-comment"
                    rows={3}
                    value={form.comment}
                    onChange={(e) => update('comment', e.target.value)}
                    placeholder="Что улучшить? (до 500 символов)"
                  />
                </div>
              </>
            )}

            {!submitted && step === 2 && (
              <div className={styles.field}>
                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update('consent', e.target.checked)}
                  />
                  Даю согласие на обработку персональных данных (152-ФЗ) *
                </label>
                {tried && errors.consent && <div className={styles.fieldError}>{errors.consent}</div>}
              </div>
            )}

            {submitted && (
              <p className="it-demo__hint" style={{color: '#2e7d32'}}>
                Форма отправлена. Данные прошли клиентскую проверку — на сервере нужна повторная валидация и
                защита от CSRF.
              </p>
            )}

            <div className={styles.nav}>
              {step > 0 && !submitted && (
                <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={back}>
                  Назад
                </button>
              )}
              {!submitted && (
                <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={next}>
                  {step < 2 ? 'Далее' : 'Отправить'}
                </button>
              )}
              {submitted && (
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary"
                  onClick={() => {
                    setForm(INITIAL);
                    setStep(0);
                    setSubmitted(false);
                    setTried(false);
                  }}
                >
                  Новый ответ
                </button>
              )}
            </div>
          </div>

          <div>
            <p className="it-demo__label">Сериализация ответа</p>
            <pre className={styles.preview}>{preview}</pre>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DigitalFormPlayInner;
