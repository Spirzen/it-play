import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/DbmsArchitecturePlay.module.css';

const TIERS = [
  {
    id: 'client',
    label: 'Клиентское приложение',
    short: 'Клиент',
    icon: '💻',
    nodes: [
      {id: 'app', label: 'Приложение', role: 'ORM · API · скрипт'},
      {id: 'client', label: 'Клиент СУБД', role: 'psql · sqlcmd · mysql'},
    ],
  },
  {
    id: 'access',
    label: 'Подключение и безопасность',
    short: 'Доступ',
    icon: '🔐',
    nodes: [
      {id: 'listener', label: 'Сетевой порт', role: '5432 · 1433 · 3306'},
      {id: 'auth', label: 'Аутентификация', role: 'pg_hba · GRANT · роли'},
    ],
  },
  {
    id: 'engine',
    label: 'Ядро СУБД',
    short: 'Движок',
    icon: '⚙️',
    nodes: [
      {id: 'parser', label: 'Парсер', role: 'Синтаксис · права'},
      {id: 'optimizer', label: 'Оптимизатор', role: 'План · индексы'},
      {id: 'executor', label: 'Исполнитель', role: 'Чтение · запись'},
    ],
  },
  {
    id: 'memory',
    label: 'Память и конкуренция',
    short: 'Память',
    icon: '🧠',
    nodes: [
      {id: 'buffer', label: 'Буферный пул', role: 'shared_buffers · кэш'},
      {id: 'locks', label: 'Блокировки', role: 'Транзакции · MVCC'},
    ],
  },
  {
    id: 'storage',
    label: 'Физическое хранилище',
    short: 'Диск',
    icon: '💾',
    nodes: [
      {id: 'data', label: 'Файлы данных', role: 'Таблицы · индексы'},
      {id: 'wal', label: 'Журнал WAL', role: 'Redo · binlog · txn log'},
    ],
  },
];

const ADMIN_CYCLE = [
  {id: 'monitor', icon: '📊', label: 'Мониторинг', role: 'pg_stat_activity · slow log'},
  {id: 'diagnose', icon: '🔍', label: 'Диагностика', role: 'Блокировки · план запроса'},
  {id: 'correct', icon: '🛠️', label: 'Коррекция', role: 'VACUUM · параметры · kill'},
  {id: 'verify', icon: '✅', label: 'Проверка', role: 'Метрики · повторный замер'},
];

const SCENARIOS = [
  {
    id: 'select',
    title: 'Чтение — SELECT',
    subtitle: 'Путь запроса от приложения к таблице и обратно',
    sql: "SELECT name, city FROM users WHERE city = 'Москва';",
    layout: 'tiers',
    steps: [
      {
        spotlight: ['app', 'client'],
        label: 'Приложение отправляет SQL',
        detail: 'Драйвер или терминальный клиент формирует текстовый запрос и открывает сессию.',
        packet: 'down',
      },
      {
        spotlight: ['listener', 'auth'],
        label: 'Подключение и проверка прав',
        detail: 'СУБД принимает TCP-соединение, сверяет пользователя с pg_hba / GRANT и разрешает SELECT.',
        packet: 'down',
      },
      {
        spotlight: ['parser'],
        label: 'Разбор запроса',
        detail: 'Парсер проверяет синтаксис SQL и существование таблиц и столбцов.',
        packet: 'down',
      },
      {
        spotlight: ['optimizer'],
        label: 'Построение плана',
        detail: 'Оптимизатор выбирает индекс или seq scan по статистике (ANALYZE).',
        packet: 'down',
      },
      {
        spotlight: ['executor', 'buffer'],
        label: 'Чтение из буфера',
        detail: 'Исполнитель ищет страницы в shared_buffers; при промахе — читает с диска.',
        packet: 'down',
      },
      {
        spotlight: ['data'],
        label: 'Данные на диске',
        detail: 'Файлы таблиц и индексов — источник истины, если страницы ещё не в кэше.',
        packet: 'down',
      },
      {
        spotlight: ['executor', 'client', 'app'],
        label: 'Результат клиенту',
        detail: 'Строки сериализуются в протокол ответа и возвращаются приложению.',
        packet: 'up',
      },
    ],
  },
  {
    id: 'write',
    title: 'Запись — INSERT',
    subtitle: 'Транзакция, журнал WAL и фиксация на диске',
    sql: "BEGIN; INSERT INTO orders (user_id, total) VALUES (42, 1990); COMMIT;",
    layout: 'tiers',
    steps: [
      {
        spotlight: ['app', 'client'],
        label: 'Команда изменения данных',
        detail: 'INSERT/UPDATE/DELETE приходит в рамках транзакции (явной или автокоммит).',
        packet: 'down',
      },
      {
        spotlight: ['auth', 'parser', 'optimizer'],
        label: 'Проверка и план записи',
        detail: 'Права на INSERT, проверка ограничений (FK, UNIQUE), выбор плана.',
        packet: 'down',
      },
      {
        spotlight: ['executor', 'locks'],
        label: 'Блокировки строк',
        detail: 'Исполнитель удерживает блокировки, чтобы параллельные транзакции не конфликтовали.',
        packet: 'down',
      },
      {
        spotlight: ['wal'],
        label: 'Запись в журнал WAL',
        detail: 'Сначала в журнал — правило WAL: изменения должны быть устойчивы до сбоя питания.',
        packet: 'down',
      },
      {
        spotlight: ['buffer', 'data'],
        label: 'Обновление страниц данных',
        detail: 'Грязные страницы попадают в буфер; позже сбрасываются на диск (checkpoint).',
        packet: 'down',
      },
      {
        spotlight: ['executor', 'client'],
        label: 'COMMIT — подтверждение',
        detail: 'После fsync журнала клиент получает OK; транзакция видна другим сессиям.',
        packet: 'up',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Администрирование',
    subtitle: 'Цикл эксплуатации: мониторинг → диагностика → коррекция → проверка',
    layout: 'cycle',
    steps: [
      {
        spotlight: ['monitor'],
        label: 'Мониторинг активных сессий',
        detail: 'Администратор смотрит pg_stat_activity, wait events, загрузку CPU и диска.',
      },
      {
        spotlight: ['diagnose'],
        label: 'Диагностика узкого места',
        detail: 'Долгий запрос, блокировка (pg_locks), нехватка памяти или I/O на WAL-диске.',
      },
      {
        spotlight: ['correct'],
        label: 'Корректирующее действие',
        detail: 'Настройка work_mem, VACUUM, перестроение индекса, завершение "зависшей" сессии.',
      },
      {
        spotlight: ['verify'],
        label: 'Проверка результата',
        detail: 'Повторный замер времени запроса и метрик — цикл начинается снова при необходимости.',
      },
    ],
  },
];

function TierDiagram({spotlight, packet}) {
  const isActive = (nodeId) => spotlight.includes(nodeId);

  return (
    <div className={styles.diagram} aria-label="Слои СУБД">
      {TIERS.map((tier, tierIndex) => (
        <React.Fragment key={tier.id}>
          {tierIndex > 0 && (
            <div className={styles.connector} aria-hidden>
              <span
                className={clsx(
                  styles.connectorLine,
                  packet === 'down' && styles.connectorPulseDown,
                  packet === 'up' && styles.connectorPulseUp,
                )}
              />
              <span className={styles.connectorLabel}>
                {packet === 'up' ? 'ответ' : 'запрос'}
              </span>
            </div>
          )}
          <section
            className={clsx(styles.tier, tier.nodes.some((n) => isActive(n.id)) && styles.tierActive)}
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
  );
}

function CycleDiagram({spotlight}) {
  const isActive = (nodeId) => spotlight.includes(nodeId);

  return (
    <div className={styles.cycleDiagram} aria-label="Цикл администрирования">
      {ADMIN_CYCLE.map((node) => (
        <div
          key={node.id}
          className={clsx(styles.cycleNode, isActive(node.id) && styles.cycleNodeActive)}
        >
          <span className={styles.cycleIcon}>{node.icon}</span>
          <span className={styles.cycleName}>{node.label}</span>
          <span className={styles.cycleRole}>{node.role}</span>
        </div>
      ))}
    </div>
  );
}

function DbmsArchitecturePlayInner() {
  const [scenarioId, setScenarioId] = useState('select');
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
        schedule(() => run(i + 1), 2200);
      } else {
        schedule(() => setPlaying(false), 2200);
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

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как работает РСУБД"
        subtitle="Путь SQL-запроса, запись с журналом WAL и цикл администрирования"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии СУБД">
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
          {scenario.sql && <code className={styles.sqlChip}>{scenario.sql}</code>}
        </p>

        {scenario.layout === 'cycle' ? (
          <CycleDiagram spotlight={spotlight} />
        ) : (
          <TierDiagram spotlight={spotlight} packet={packet} />
        )}

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
          СУБД — не просто "файл с таблицами": это сервис с сетевым доступом, планировщиком
          запросов, буфером в памяти и журналом транзакций. Управление РСУБД — настройка всех
          этих слоёв под нагрузку и политику безопасности.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DbmsArchitecturePlayInner;
