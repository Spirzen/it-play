import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/TechSupportLevelsPlay.module.css';

const TIERS = [
  {
    id: 'l1',
    badge: 'L1',
    label: 'Helpdesk',
    icon: '🎧',
    duties: 'Первый контакт, FAQ, типовые инструкции',
  },
  {
    id: 'l2',
    badge: 'L2',
    label: 'Technical Support',
    icon: '🔧',
    duties: 'Логи, настройки, API, глубокая диагностика',
  },
  {
    id: 'l3',
    badge: 'L3',
    label: 'Engineering',
    icon: '💻',
    duties: 'Баги, доработки кода, релизы',
  },
];

const SCENARIOS = [
  {
    id: 'password',
    title: 'Сброс пароля — L1',
    subtitle: 'Типовая задача закрывается на первой линии',
    ticketSubject: 'Забыл пароль',
    steps: [
      {
        spotlight: ['user'],
        ticketTier: 'user',
        label: 'Пользователь создаёт обращение',
        detail: 'Портал, почта или чат — тикет попадает в очередь L1',
      },
      {
        spotlight: ['l1'],
        ticketTier: 'l1',
        label: 'L1 принимает тикет',
        detail: 'Проверка личности по регламенту, поиск в базе знаний',
      },
      {
        spotlight: ['l1'],
        ticketTier: 'l1',
        label: 'Стандартное решение',
        detail: 'Сброс пароля / разблокировка учётки — без эскалации',
        resolved: true,
      },
    ],
  },
  {
    id: 'access',
    title: 'Доступ — L1 → L2',
    subtitle: 'Шаблоны L1 не помогли — тикет передают специалисту',
    ticketSubject: 'Не могу войти после смены пароля',
    steps: [
      {
        spotlight: ['user', 'l1'],
        ticketTier: 'l1',
        label: 'L1 проверяет типовые причины',
        detail: 'Кэш, другой браузер, время на сервере — проблема остаётся',
      },
      {
        spotlight: ['l1', 'l2'],
        ticketTier: 'l2',
        escalate: true,
        label: 'Эскалация на L2',
        detail: 'В тикете: что уже пробовали, логи входа, ID пользователя',
      },
      {
        spotlight: ['l2'],
        ticketTier: 'l2',
        label: 'L2 читает логи и AD/LDAP',
        detail: 'Рассинхронизация пароля между системами — правка на стороне инфраструктуры',
      },
      {
        spotlight: ['l2'],
        ticketTier: 'l2',
        label: 'Проблема решена',
        detail: 'Пользователь входит; L1 может закрыть тикет с комментарием L2',
        resolved: true,
      },
    ],
  },
  {
    id: 'bug',
    title: 'Баг UI — до L3',
    subtitle: 'Цепочка из статьи: доступ → интерфейс → разработка',
    ticketSubject: 'Кнопка "Оплатить" не срабатывает',
    steps: [
      {
        spotlight: ['l1'],
        ticketTier: 'l1',
        label: 'L1: обновление браузера и кэш',
        detail: 'На другом устройстве ошибка повторяется — не "локальная" проблема',
      },
      {
        spotlight: ['l1', 'l2'],
        ticketTier: 'l2',
        escalate: true,
        label: 'Передача на L2',
        detail: 'Нужны HAR, версия приложения, шаги воспроизведения',
      },
      {
        spotlight: ['l2'],
        ticketTier: 'l2',
        label: 'L2 воспроизводит и смотрит логи',
        detail: '500 на API checkout — похоже на дефект, а не настройку',
      },
      {
        spotlight: ['l2', 'l3'],
        ticketTier: 'l3',
        escalate: true,
        label: 'Эскалация на L3 (разработка)',
        detail: 'Баг в коде: исправление, тест, выкладка в релиз',
      },
      {
        spotlight: ['l3'],
        ticketTier: 'l3',
        label: 'Исправление в продукте',
        detail: 'Hotfix или плановый релиз; L2 уведомляет пользователя о сроках',
        resolved: true,
      },
    ],
  },
];

function TicketChip({subject, resolved}) {
  return (
    <div className={clsx(styles.ticket, resolved && styles.ticketResolved)} role="status">
      <span className={styles.ticketId}>#1042</span>
      <span className={styles.ticketSubject}>{subject}</span>
      {resolved && <span className={styles.ticketStatus}>Решено ✓</span>}
    </div>
  );
}

function TechSupportLevelsPlayInner() {
  const [scenarioId, setScenarioId] = useState('password');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [ticketTier, setTicketTier] = useState(null);
  const [escalate, setEscalate] = useState(false);
  const [resolved, setResolved] = useState(false);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const currentStep = stepIndex >= 0 ? scenario.steps[stepIndex] : null;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setStepIndex(-1);
    setSpotlight([]);
    setTicketTier(null);
    setEscalate(false);
    setResolved(false);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setTicketTier(step.ticketTier ?? null);
      setEscalate(Boolean(step.escalate));
      setResolved(Boolean(step.resolved));
    },
    [scenario.steps],
  );

  const playScenario = useCallback(() => {
    clearTimers();
    reset();
    setPlaying(true);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        schedule(() => run(i + 1), 2400);
      } else {
        schedule(() => setPlaying(false), 2400);
      }
    };
    schedule(() => run(0), 300);
  }, [applyStep, clearTimers, reset, scenario.steps, schedule]);

  const selectScenario = (id) => {
    if (playing) return;
    setScenarioId(id);
    reset();
  };

  const stepManual = (delta) => {
    if (playing) return;
    const next = Math.max(0, Math.min(scenario.steps.length - 1, stepIndex + delta));
    applyStep(next);
  };

  const isActive = (tierId) => spotlight.includes(tierId);
  const ticketOnTier = (tierId) => ticketTier === tierId;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Уровни техподдержки L1–L3"
        subtitle="Как тикет движется по линиям — три сценария из статьи"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии техподдержки">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={scenarioId === s.id}
              disabled={playing}
              className={clsx(styles.scenarioTab, scenarioId === s.id && styles.scenarioTabActive)}
              onClick={() => selectScenario(s.id)}
            >
              {s.title.split(' — ')[0]}
            </button>
          ))}
        </div>

        <p className={styles.scenarioHint}>
          <strong>{scenario.title}</strong> — {scenario.subtitle}
        </p>

        <div className={styles.userRow}>
          <div
            className={clsx(styles.user, isActive('user') && styles.userActive)}
            aria-label="Пользователь"
          >
            <span className={styles.userIcon}>👤</span>
            <span className={styles.userLabel}>Пользователь</span>
            {ticketOnTier('user') && (
              <TicketChip subject={scenario.ticketSubject} resolved={resolved} />
            )}
          </div>
        </div>

        <div className={styles.diagram} aria-label="Линии техподдержки L1–L3">
          {TIERS.map((tier, tierIndex) => (
            <React.Fragment key={tier.id}>
              {tierIndex > 0 && (
                <div className={styles.connector} aria-hidden>
                  <span
                    className={clsx(
                      styles.connectorLine,
                      escalate && ticketTier === tier.id && styles.connectorPulseDown,
                    )}
                  />
                  <span className={styles.connectorLabel}>
                    {escalate && ticketTier === tier.id ? 'эскалация' : 'если не решено'}
                  </span>
                </div>
              )}
              <section
                className={clsx(
                  styles.tier,
                  styles[`tier_${tier.id}`],
                  isActive(tier.id) && styles.tierActive,
                )}
              >
                <header className={styles.tierHeader}>
                  <span className={styles.tierIcon}>{tier.icon}</span>
                  <span className={styles.tierBadge}>{tier.badge}</span>
                  <span className={styles.tierLabel}>{tier.label}</span>
                </header>
                <p className={styles.tierDuties}>{tier.duties}</p>
                {ticketOnTier(tier.id) && (
                  <TicketChip subject={scenario.ticketSubject} resolved={resolved} />
                )}
              </section>
            </React.Fragment>
          ))}
        </div>

        {currentStep && (
          <div className={styles.stepCard}>
            <span className={styles.stepBadge}>
              Шаг {stepIndex + 1} / {scenario.steps.length}
            </span>
            <p className={styles.stepTitle}>{currentStep.label}</p>
            <p className={styles.stepDetail}>{currentStep.detail}</p>
          </div>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={playScenario}
            disabled={playing}
          >
            {playing ? 'Воспроизведение…' : 'Пройти сценарий'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => stepManual(-1)}
            disabled={playing || stepIndex <= 0}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => stepManual(1)}
            disabled={playing || stepIndex >= scenario.steps.length - 1}
          >
            Вперёд →
          </button>
          {stepIndex >= 0 && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          )}
        </div>

        <div className={styles.stepDots} aria-hidden>
          {scenario.steps.map((_, i) => (
            <span
              key={i}
              className={clsx(
                styles.stepDot,
                i <= stepIndex && styles.stepDotDone,
                i === stepIndex && styles.stepDotCurrent,
              )}
            />
          ))}
        </div>

        <p className={styles.footer}>
          L1 отсекает шум и решает простое; сложное уходит на L2, дефекты продукта — на L3. При
          эскалации передавайте контекст: что уже пробовали и какие данные собрали.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportLevelsPlayInner;
