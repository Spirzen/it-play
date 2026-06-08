import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CODE_SNIPPETS,
  COMPARISON_ROWS,
  CONTAINER_SNIPPET,
  INJECTION_TYPES,
  createEmailService,
  createUserService,
  registerUser,
  runContainerRegistration,
} from '@/components/shared/kb/diEngine';
import styles from '@/components/demos/DIDemo.module.css';

function InjectionFlow({step, injectionType, emailImpl}) {
  const active = (id) => {
    if (step === 'idle') return false;
    if (id === 'user') return true;
    if (id === 'service') return step === 'inject' || step === 'send' || step === 'done';
    if (id === 'email') return step === 'send' || step === 'done';
    return false;
  };

  return (
    <div className={styles.flow} aria-label="Поток внедрения зависимости">
      <div className={clsx(styles.flowNode, styles.flowUser, active('user') && styles.flowNodeActive)}>
        👤 User
      </div>
      <span className={styles.flowArrow}>→</span>
      <div className={clsx(styles.flowNode, styles.flowService, active('service') && styles.flowNodeActive)}>
        ⚙️ UserService
        <small style={{display: 'block', fontWeight: 400, opacity: 0.85}}>{injectionType}</small>
      </div>
      <span className={styles.flowArrow}>→</span>
      <div className={clsx(styles.flowNode, styles.flowEmail, active('email') && styles.flowNodeActive)}>
        {emailImpl === 'mock' ? '🎭' : '📧'} IEmailService
      </div>
    </div>
  );
}

function DIDemoInner() {
  const [injectionType, setInjectionType] = useState('constructor');
  const [emailImpl, setEmailImpl] = useState('smtp');
  const [flowStep, setFlowStep] = useState('idle');
  const [status, setStatus] = useState({ok: true, message: 'Выбери тип инъекции и нажми "Зарегистрировать"'});
  const [emailPreview, setEmailPreview] = useState('');
  const [channel, setChannel] = useState('');

  const reset = useCallback(() => {
    setFlowStep('idle');
    setStatus({ok: true, message: 'Сброшено — можно попробовать снова'});
    setEmailPreview('');
    setChannel('');
  }, []);

  const runRegistration = useCallback(() => {
    setEmailPreview('');
    setFlowStep('inject');

    setTimeout(() => {
      try {
        const emailService = createEmailService(emailImpl);
        const service = createUserService(injectionType, emailService);
        setFlowStep('send');
        const message = registerUser(service, injectionType, emailService);
        const sent = emailService.send(message);
        setFlowStep('done');
        setEmailPreview(sent.message);
        setChannel(sent.channel);
        setStatus({
          ok: true,
          message: `✅ ${INJECTION_TYPES.find((t) => t.id === injectionType)?.name} injection — письмо отправлено`,
        });
      } catch (err) {
        setFlowStep('idle');
        setStatus({ok: false, message: `❌ ${err.message}`});
      }
    }, 320);
  }, [emailImpl, injectionType]);

  const runContainer = useCallback(() => {
    setFlowStep('inject');
    setTimeout(() => {
      try {
        const result = runContainerRegistration(emailImpl);
        setFlowStep('done');
        setEmailPreview(result.emailPreview);
        setChannel(result.channel);
        setStatus({ok: true, message: `✅ ${result.summary}`});
      } catch (err) {
        setFlowStep('idle');
        setStatus({ok: false, message: `❌ ${err.message}`});
      }
    }, 400);
  }, [emailImpl]);

  const currentType = INJECTION_TYPES.find((t) => t.id === injectionType);

  return (
    <DemoShell className={styles.root}>
      <div className={styles.headerBand}>
        <h4 className={styles.title}>💉 Dependency Injection (DI)</h4>
        <p className={styles.subtitle}>
          DIP — "что": зависеть от абстракций. DI — "как": передавать зависимости извне (конструктор, setter, IoC).
        </p>
      </div>

      <div className={styles.body}>
        <div className="it-demo__alert it-demo__alert--info" style={{marginBottom: '1rem'}}>
          <strong>DIP vs DI:</strong> принцип задаёт направление зависимостей, инъекция — механизм передачи
          реализации в класс.
        </div>

        <InjectionFlow step={flowStep} injectionType={injectionType} emailImpl={emailImpl} />

        <div className={styles.layout}>
          <div className={styles.panel}>
            <span className={styles.sectionLabel}>Способ внедрения</span>
            <div className={styles.typeGrid} role="listbox" aria-label="Тип инъекции">
              {INJECTION_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  role="option"
                  aria-selected={injectionType === type.id}
                  className={clsx(
                    styles.typeCard,
                    injectionType === type.id && styles.typeCardActive,
                    type.antiPattern && styles.typeCardAnti,
                  )}
                  onClick={() => {
                    setInjectionType(type.id);
                    reset();
                  }}
                >
                  <span className={styles.typeName}>
                    {type.name}
                    {type.recommended && <span className={styles.badgeGood}>рекомендуется</span>}
                    {type.antiPattern && <span className={styles.badgeBad}>anti-pattern</span>}
                  </span>
                  <span className={styles.typeDesc}>{type.desc}</span>
                </button>
              ))}
            </div>

            <details style={{marginTop: '0.75rem'}}>
              <summary style={{cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600}}>
                Сравнение способов
              </summary>
              <div className="it-demo__table-wrap" style={{marginTop: '0.5rem'}}>
                <table className="it-demo__table">
                  <thead>
                    <tr>
                      <th>Критерий</th>
                      <th>Constructor</th>
                      <th>Setter</th>
                      <th>Field</th>
                      <th>Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row) => (
                      <tr key={row.criterion}>
                        <td>{row.criterion}</td>
                        <td>{row.constructor}</td>
                        <td>{row.setter}</td>
                        <td>{row.field}</td>
                        <td>{row.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>

          <div className={styles.panel}>
            <span className={styles.sectionLabel}>Реализация IEmailService</span>
            <div className={styles.emailRow}>
              {[
                {id: 'smtp', label: '📧 SMTP'},
                {id: 'mock', label: '🎭 Mock (тесты)'},
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={clsx(styles.emailChip, emailImpl === opt.id && styles.emailChipActive)}
                  onClick={() => {
                    setEmailImpl(opt.id);
                    reset();
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="it-demo__row" style={{marginBottom: '0.75rem'}}>
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runRegistration}>
                Зарегистрировать пользователя
              </button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
                Сброс
              </button>
            </div>

            <div
              className={clsx(
                'it-demo__alert',
                status.ok ? 'it-demo__alert--success' : 'it-demo__alert--error',
                flowStep === 'done' && styles.statusPulse,
              )}
              role="status"
              aria-live="polite"
            >
              {status.message}
            </div>

            {emailPreview && (
              <div className={clsx(styles.mailPreview, channel === 'mock' && styles.mailMock)}>
                <strong>{channel === 'mock' ? '🎭 Mock:' : '📧 SMTP:'}</strong> {emailPreview}
              </div>
            )}

            <details style={{marginTop: '0.75rem'}}>
              <summary style={{cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600}}>
                Код: {currentType?.name}
              </summary>
              <pre className={styles.codeBlock}>{CODE_SNIPPETS[injectionType]}</pre>
            </details>

            <div className={styles.containerBox}>
              <span className={styles.sectionLabel}>IoC / DI-контейнер</span>
              <div className="it-demo__row">
                <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={runContainer}>
                  Resolve через контейнер
                </button>
              </div>
              <p className={styles.singletonHint}>
                IEmailService регистрируется как singleton — один экземпляр на всё приложение.
              </p>
              <pre className={styles.codeBlock}>{CONTAINER_SNIPPET}</pre>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

export default DIDemoInner;
