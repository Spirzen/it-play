import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/WebAppArchitecturePlay.module.css';

const TIERS = [
  {
    id: 'presentation',
    label: 'Презентационный слой',
    short: 'Клиент',
    icon: '🌐',
    nodes: [
      {id: 'user', label: 'Пользователь', role: 'Действия'},
      {id: 'browser', label: 'Браузер', role: 'HTML · CSS · JS'},
    ],
  },
  {
    id: 'application',
    label: 'Сервисный слой',
    short: 'Сервер',
    icon: '⚙️',
    nodes: [
      {id: 'api', label: 'API', role: 'REST / GraphQL'},
      {id: 'logic', label: 'Бизнес-логика', role: 'Правила · валидация'},
    ],
  },
  {
    id: 'data',
    label: 'Слой данных',
    short: 'Хранилище',
    icon: '🗄️',
    nodes: [
      {id: 'cache', label: 'Кэш', role: 'Redis'},
      {id: 'db', label: 'БД', role: 'PostgreSQL…'},
    ],
  },
];

const SCENARIOS = [
  {
    id: 'mpa',
    title: 'MPA — загрузка страницы',
    subtitle: 'Полная перезагрузка, HTML с сервера',
    steps: [
      {
        spotlight: ['user', 'browser'],
        label: 'Пользователь открывает URL',
        detail: 'Браузер: DNS → TCP → TLS → GET /catalog',
      },
      {
        spotlight: ['api'],
        label: 'Сервер формирует HTML',
        detail: 'Маршрутизация, шаблон, данные из БД',
        packet: 'request',
      },
      {
        spotlight: ['logic', 'db'],
        label: 'Бизнес-логика читает данные',
        detail: 'SELECT товаров, проверка сессии',
        packet: 'down',
      },
      {
        spotlight: ['browser'],
        label: 'Ответ: HTML-документ',
        detail: 'Парсинг DOM, CSS, выполнение JS',
        packet: 'response',
      },
    ],
  },
  {
    id: 'spa',
    title: 'SPA — запрос к API',
    subtitle: 'Страница уже загружена, только JSON',
    steps: [
      {
        spotlight: ['user', 'browser'],
        label: 'Клик без перезагрузки',
        detail: 'History API меняет URL; Fetch POST /api/cart',
      },
      {
        spotlight: ['api', 'logic'],
        label: 'API принимает JSON',
        detail: 'Аутентификация, валидация, лимиты',
        packet: 'request',
      },
      {
        spotlight: ['cache', 'db'],
        label: 'Чтение и запись',
        detail: 'Кэш корзины; INSERT в таблицу заказов',
        packet: 'down',
      },
      {
        spotlight: ['browser'],
        label: 'Ответ JSON → обновление UI',
        detail: 'React/Vue перерисовывает компоненты',
        packet: 'response',
      },
    ],
  },
  {
    id: 'ssr',
    title: 'SSR — гибрид',
    subtitle: 'HTML на сервере, затем гидратация',
    steps: [
      {
        spotlight: ['user', 'browser'],
        label: 'Первый запрос страницы',
        detail: 'Нужен быстрый First Contentful Paint',
      },
      {
        spotlight: ['api', 'logic', 'db'],
        label: 'Сервер рендерит HTML',
        detail: 'Данные из БД встроены в разметку',
        packet: 'request',
      },
      {
        spotlight: ['browser'],
        label: 'Браузер показывает HTML',
        detail: 'Пользователь сразу видит контент',
        packet: 'response',
      },
      {
        spotlight: ['browser', 'logic'],
        label: 'Гидратация JavaScript',
        detail: 'Клиент "оживляет" DOM и дальше как SPA',
        packet: 'down',
      },
    ],
  },
];

function WebAppArchitecturePlayInner() {
  const [scenarioId, setScenarioId] = useState('mpa');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
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
    setPacket(null);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setPacket(step.packet ?? null);
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

  const isActive = (nodeId) => spotlight.includes(nodeId);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура веб-приложения"
        subtitle="Трёх звена и путь запроса — выберите сценарий и пройдите шаги"
      >
        <div
          className={styles.scenarioTabs}
          role="tablist"
          aria-label="Сценарии архитектуры"
        >
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

        <div className={styles.diagram} aria-label="Трёхзвенная архитектура">
          {TIERS.map((tier, tierIndex) => (
            <React.Fragment key={tier.id}>
              {tierIndex > 0 && (
                <div className={styles.connector} aria-hidden>
                  <span
                    className={clsx(
                      styles.connectorLine,
                      packet === 'request' && tierIndex === 1 && styles.connectorPulseDown,
                      packet === 'down' && tierIndex === 2 && styles.connectorPulseDown,
                      packet === 'response' && tierIndex === 2 && styles.connectorPulseUp,
                    )}
                  />
                  <span className={styles.connectorLabel}>HTTP</span>
                </div>
              )}
              <section
                className={clsx(
                  styles.tier,
                  tier.nodes.some((n) => isActive(n.id)) && styles.tierActive,
                )}
              >
                <header className={styles.tierHeader}>
                  <span className={styles.tierIcon}>{tier.icon}</span>
                  <span className={styles.tierLabel}>{tier.label}</span>
                  <span className={styles.tierShort}>{tier.short}</span>
                </header>
                <div className={styles.tierNodes}>
                  {tier.nodes.map((node) => (
                    <div
                      key={node.id}
                      className={clsx(styles.node, isActive(node.id) && styles.nodeActive)}
                    >
                      <span className={styles.nodeName}>{node.label}</span>
                      <span className={styles.nodeRole}>{node.role}</span>
                    </div>
                  ))}
                </div>
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
          Клиент не обращается к БД напрямую — только через сервисный слой. Критическая логика
          проверяется на сервере, даже если форма уже проверена в браузере.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default WebAppArchitecturePlayInner;
