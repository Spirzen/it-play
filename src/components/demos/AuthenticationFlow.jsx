import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import useBreakpoint from '@/components/shared/kb/useBreakpoint';
import styles from '@/components/demos/AuthenticationFlow.module.css';

const STEPS = [
  {
    id: 0,
    title: 'Начало',
    subtitle: 'Запрос к ресурсу',
    description:
      'Клиент запрашивает защищённую страницу. Сервер не находит активной сессии.',
    userAction: 'GET /dashboard',
    serverAction: 'Проверка cookie / JWT',
    icon: '🚪',
  },
  {
    id: 1,
    title: 'Идентификация',
    subtitle: 'Заявление личности',
    description: 'Пользователь сообщает логин или email — система получает идентификатор.',
    userAction: '"Я — Timur"',
    serverAction: 'Приём username',
    icon: '🆔',
  },
  {
    id: 2,
    title: 'Верификация',
    subtitle: 'Статус аккаунта',
    description: 'Проверка существования, блокировки и политик безопасности.',
    userAction: 'Ожидание',
    serverAction: 'SELECT user WHERE active=1',
    icon: '🛡️',
  },
  {
    id: 3,
    title: 'Аутентификация',
    subtitle: 'Подтверждение',
    description: 'Сравнение хеша пароля или проверка MFA / SSO.',
    userAction: 'Отправка пароля',
    serverAction: 'bcrypt.compare()',
    icon: '✅',
  },
  {
    id: 4,
    title: 'Авторизация',
    subtitle: 'Права доступа',
    description: 'Назначение ролей и формирование токена с claims.',
    userAction: 'Получение прав',
    serverAction: 'JWT с scope',
    icon: '🔑',
  },
  {
    id: 5,
    title: 'Доступ',
    subtitle: 'Работа в системе',
    description: 'Последующие запросы с токеном без повторного ввода пароля.',
    userAction: 'Работа с данными',
    serverAction: 'RBAC на каждый запрос',
    icon: '🎉',
  },
];

function FlowDiagram({step, isMobile}) {
  const nodes = [
    {key: 'client', label: 'Клиент', icon: '💻', isClient: true},
    ...STEPS.slice(1).map((s) => ({
      key: s.id,
      label: s.title,
      icon: s.icon,
      stepId: s.id,
    })),
    {key: 'done', label: 'Ресурс', icon: '🎯', stepId: 5},
  ];

  return (
    <div className={clsx(styles.flow, isMobile && styles.flowVertical)} aria-hidden={false}>
      {nodes.map((node, index) => (
        <React.Fragment key={node.key}>
          {index > 0 && <span className={styles.arrow}>{isMobile ? '↓' : '→'}</span>}
          <div
            className={clsx(styles.stepNode, {
              [styles.clientBadge]: node.isClient,
              [styles.stepNodeDone]: node.stepId != null && step > node.stepId,
              [styles.stepNodeCurrent]: node.stepId === step,
            })}
          >
            <span className={styles.stepIcon}>{node.icon}</span>
            <strong>{node.label}</strong>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function AuthenticationFlowInner() {
  const [step, setStep] = useState(0);
  const {isMobile} = useBreakpoint();
  const current = STEPS[step];
  const canNext = step < STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (canNext) setStep((s) => s + 1);
  }, [canNext]);

  const handleReset = useCallback(() => setStep(0), []);

  return (
    <DemoShell>
      <DemoCard
        title="Путь пользователя: от запроса до доступа"
        subtitle="Идентификация → верификация → аутентификация → авторизация"
      >
        <FlowDiagram step={step} isMobile={isMobile} />

        <div className={styles.panel}>
          <span className="it-demo__badge">
            Этап {step + 1} / {STEPS.length}
          </span>
          <h4 style={{margin: '0.5rem 0 0.15rem'}}>{current.title}</h4>
          <p style={{margin: 0, color: 'var(--demo-muted)', fontSize: '0.85rem'}}>
            {current.subtitle}
          </p>
          <p style={{margin: '0.75rem 0', lineHeight: 1.5, fontSize: '0.88rem'}}>
            {current.description}
          </p>

          <div className={styles.actionsGrid}>
            <div className={styles.actionCard}>
              <strong>Пользователь</strong>
              <br />
              {current.userAction}
            </div>
            <div className={styles.actionCard}>
              <strong>Сервер</strong>
              <br />
              {current.serverAction}
            </div>
          </div>

          <div className={styles.controls}>
            {step > 0 && (
              <button type="button" className="it-demo__btn" onClick={handleReset}>
                Сначала
              </button>
            )}
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={canNext ? handleNext : handleReset}
            >
              {canNext ? 'Следующий этап →' : 'Начать заново'}
            </button>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default AuthenticationFlowInner;
