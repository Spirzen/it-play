import React, {useState, useCallback, useEffect, useRef, useMemo} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/SoftwareLifecycleDemo.module.css';

const PHASES = [
  {
    id: 'plan',
    name: 'Планирование и инициация',
    shortName: 'Планирование',
    icon: '📋',
    color: 'var(--sdlc-plan)',
    duration: '2–4 недели',
    team: 'PM, Sponsor, Stakeholders',
    deliverables: 'Устав проекта, Business Case, Plan',
    activities: [
      'Определение целей и scope проекта',
      'Оценка ресурсов и бюджета',
      'Формирование команды',
      'Создание roadmap',
    ],
    tools: 'Jira, MS Project, Trello, Miro',
    risk: 'low',
    costPct: 8,
    sprint: 1,
    vSide: 'left',
    log: '📋 Charter утверждён, бюджет согласован',
  },
  {
    id: 'analyze',
    name: 'Анализ и сбор требований',
    shortName: 'Анализ',
    icon: '🔍',
    color: 'var(--sdlc-analyze)',
    duration: '3–6 недель',
    team: 'BA, Product Owner, Stakeholders',
    deliverables: 'SRS, User Stories, Use Cases',
    activities: [
      'Интервью с заказчиком',
      'Создание user stories',
      'Прототипирование интерфейсов',
      'Согласование требований',
    ],
    tools: 'Confluence, Jira, Figma, Draw.io',
    risk: 'mid',
    costPct: 12,
    sprint: 1,
    vSide: 'left',
    log: '🔍 SRS v1.2 — 47 user stories в backlog',
  },
  {
    id: 'design',
    name: 'Проектирование архитектуры',
    shortName: 'Архитектура',
    icon: '🏗️',
    color: 'var(--sdlc-design)',
    duration: '4–8 недель',
    team: 'Architect, Tech Lead, Senior Devs',
    deliverables: 'Architecture Design, UML, ERD',
    activities: [
      'Выбор технологического стека',
      'Проектирование БД',
      'Создание API-спецификаций',
      'Определение паттернов',
    ],
    tools: 'Draw.io, Lucidchart, PlantUML, Swagger',
    risk: 'high',
    costPct: 12,
    sprint: 2,
    vSide: 'left',
    log: '🏗️ Архитектура: микросервисы + PostgreSQL',
  },
  {
    id: 'dev',
    name: 'Реализация (разработка)',
    shortName: 'Разработка',
    icon: '💻',
    color: 'var(--sdlc-dev)',
    duration: '8–24 недели',
    team: 'Devs, QA (подготовка)',
    deliverables: 'Source Code, Unit Tests, API',
    activities: [
      'Написание кода',
      'Code review',
      'Unit-тестирование',
      'Интеграция компонентов',
    ],
    tools: 'VS Code, Git, Docker, Jira, CI/CD',
    risk: 'high',
    costPct: 45,
    sprint: 2,
    vSide: 'left',
    log: '💻 Sprint merge: +2 340 LOC, coverage 72%',
  },
  {
    id: 'test',
    name: 'Тестирование и верификация',
    shortName: 'Тестирование',
    icon: '🧪',
    color: 'var(--sdlc-test)',
    duration: '4–8 недель',
    team: 'QA, Devs (fixes)',
    deliverables: 'Test Reports, Bug Reports',
    activities: [
      'Функциональное тестирование',
      'Нагрузочное тестирование',
      'Тестирование безопасности',
      'Regression testing',
    ],
    tools: 'Jest, Selenium, Postman, JMeter',
    risk: 'mid',
    costPct: 17,
    sprint: 3,
    vSide: 'bottom',
    log: '🧪 QA: 12 критических багов закрыто, regression green',
  },
  {
    id: 'deploy',
    name: 'Внедрение (деплой)',
    shortName: 'Деплой',
    icon: '🚀',
    color: 'var(--sdlc-deploy)',
    duration: '1–2 недели',
    team: 'DevOps, Devs, QA',
    deliverables: 'Deployed App, Migration Scripts',
    activities: [
      'Подготовка production-окружения',
      'Миграция данных',
      'Deployment приложения',
      'Rollback-план',
    ],
    tools: 'K8s, Docker, Jenkins, Terraform',
    risk: 'critical',
    costPct: 7,
    sprint: 3,
    vSide: 'right',
    log: '🚀 Blue-green deploy в production — OK',
  },
  {
    id: 'ops',
    name: 'Эксплуатация и поддержка',
    shortName: 'Поддержка',
    icon: '🔄',
    color: 'var(--sdlc-ops)',
    duration: 'месяцы–годы',
    team: 'Support, DevOps, Devs (on-call)',
    deliverables: 'SLA, Monitoring, Patches',
    activities: [
      '24/7 мониторинг',
      'Исправление багов',
      'Performance optimization',
      'Customer support',
    ],
    tools: 'Grafana, Sentry, PagerDuty, Zendesk',
    risk: 'low',
    costPct: 12,
    sprint: 4,
    vSide: 'right',
    log: '🔄 SLA 99.9%, MTTR 18 мин за квартал',
  },
  {
    id: 'retire',
    name: 'Модернизация / вывод из эксплуатации',
    shortName: 'Модернизация',
    icon: '♻️',
    color: 'var(--sdlc-retire)',
    duration: '4–12 недель',
    team: 'Architect, PM, DBA',
    deliverables: 'Migration Plan, Archive, Documentation',
    activities: [
      'Анализ устаревших компонентов',
      'Миграция на новую версию',
      'Архивация данных',
      'Отключение сервисов',
    ],
    tools: 'Migration tools, Backup solutions',
    risk: 'high',
    costPct: 7,
    sprint: 4,
    vSide: 'right',
    log: '♻️ Legacy v2 выведен, данные архивированы',
  },
];

const MODELS = {
  waterfall: {
    name: 'Waterfall (каскадная)',
    description:
      'Последовательное выполнение фаз: каждая следующая начинается после завершения предыдущей.',
    pros: ['Простота управления', 'Чёткие этапы', 'Хорошая документация'],
    cons: ['Сложно вносить изменения', 'Позднее тестирование', 'Долгий цикл'],
    phaseMs: 1400,
  },
  agile: {
    name: 'Agile (гибкая)',
    description:
      'Итеративная разработка: короткие спринты, постоянная обратная связь и адаптация требований.',
    pros: ['Быстрая реакция на изменения', 'Ранний MVP', 'Постоянная обратная связь'],
    cons: ['Меньше документации', 'Требует дисциплины', 'Сложность в оценке сроков'],
    phaseMs: 1000,
  },
  vmodel: {
    name: 'V-Model',
    description:
      'Каждой фазе проектирования соответствует уровень тестирования — верификация "слева направо".',
    pros: ['Высокое качество', 'Раннее тестирование', 'Чёткие критерии приёмки'],
    cons: ['Дорого', 'Негибкий', 'Не для всех типов проектов'],
    phaseMs: 1300,
  },
};

const SPRINTS = [
  {id: 1, label: 'Спринт 1', phaseIds: ['plan', 'analyze']},
  {id: 2, label: 'Спринт 2', phaseIds: ['design', 'dev']},
  {id: 3, label: 'Спринт 3', phaseIds: ['test', 'deploy']},
  {id: 4, label: 'Спринт 4', phaseIds: ['ops', 'retire']},
];

const RISK_LABEL = {low: 'Низкий', mid: 'Средний', high: 'Высокий', critical: 'Очень высокий'};

const BEST_PRACTICES = [
  'Чёткое определение требований на старте',
  'Регулярные встречи с командой (Daily stand-ups)',
  'Автоматизация CI/CD pipelines',
  'Непрерывное тестирование (Shift-left)',
  'Актуальная техническая документация',
  'Post-mortem после инцидентов',
];

function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
}

function riskClass(risk) {
  if (risk === 'low') return styles.riskLow;
  if (risk === 'mid') return styles.riskMid;
  return styles.riskHigh;
}

function computeMetrics(completedCount, phaseIndex) {
  const progress = completedCount / PHASES.length;
  const inTestOrLater = phaseIndex >= 4;
  return {
    cpi: (0.92 + progress * 0.12).toFixed(2),
    spi: (0.88 + progress * 0.1).toFixed(2),
    defect: inTestOrLater ? (3.1 - progress * 1.4).toFixed(1) : (4.2 - progress * 0.5).toFixed(1),
    coverage: Math.min(92, Math.round(62 + progress * 32)),
  };
}

function WaterfallViz({activeIndex, doneSet}) {
  return (
    <div className={styles.waterfallFlow}>
      {PHASES.map((phase, idx) => (
        <React.Fragment key={phase.id}>
          {idx > 0 && (
            <span
              className={clsx(styles.waterfallArrow, {
                [styles.waterfallArrowLit]: doneSet.has(idx - 1) || activeIndex >= idx,
              })}
            >
              →
            </span>
          )}
          <span
            className={clsx(styles.waterfallBlock, {
              [styles.waterfallBlockActive]: activeIndex === idx,
              [styles.waterfallBlockDone]: doneSet.has(idx),
            })}
            style={{'--phase-color': phase.color}}
          >
            {phase.shortName}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function AgileViz({activeIndex, doneSet}) {
  const activeSprint = activeIndex >= 0 ? PHASES[activeIndex].sprint : null;
  return (
    <div className={styles.agileGrid}>
      {SPRINTS.map((sprint) => (
        <div
          key={sprint.id}
          className={clsx(styles.sprintCard, {[styles.sprintCardActive]: activeSprint === sprint.id})}
        >
          <p className={styles.sprintTitle}>{sprint.label}</p>
          <ul className={styles.sprintPhases}>
            {sprint.phaseIds.map((pid) => {
              const phase = PHASES.find((p) => p.id === pid);
              const idx = PHASES.findIndex((p) => p.id === pid);
              return (
                <li
                  key={pid}
                  className={clsx({
                    [styles.sprintPhasesLiActive]: activeIndex === idx || doneSet.has(idx),
                  })}
                >
                  {phase?.icon} {phase?.shortName}
                  {doneSet.has(idx) ? ' ✓' : ''}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function VModelViz({activeIndex, doneSet}) {
  const left = PHASES.filter((p) => p.vSide === 'left');
  const right = [...PHASES.filter((p) => p.vSide === 'right')].reverse();
  const bottom = PHASES.find((p) => p.vSide === 'bottom');
  const bottomIdx = PHASES.findIndex((p) => p.id === bottom?.id);

  const nodeState = (phase) => {
    const idx = PHASES.findIndex((p) => p.id === phase.id);
    return clsx(styles.vNode, {
      [styles.vNodeActive]: activeIndex === idx,
      [styles.vNodeDone]: doneSet.has(idx),
    });
  };

  return (
    <div className={styles.vDiagram}>
      <div className={styles.vColumn}>
        {left.map((phase) => (
          <div key={phase.id} className={nodeState(phase)} style={{'--phase-color': phase.color}}>
            {phase.icon} {phase.shortName}
          </div>
        ))}
      </div>

      <div className={styles.vCenter}>
        <div
          className={clsx(styles.vArm, {[styles.vArmLit]: activeIndex >= 0 && activeIndex <= 3})}
          style={{'--v-dir': '180deg'}}
        />
        {bottom && (
          <div
            className={clsx(styles.vBottom, {
              [styles.vBottomActive]: activeIndex === bottomIdx,
              [styles.vNodeDone]: doneSet.has(bottomIdx),
            })}
          >
            {bottom.icon} {bottom.shortName}
          </div>
        )}
        <div
          className={clsx(styles.vArm, {[styles.vArmLit]: activeIndex >= 5})}
          style={{'--v-dir': '0deg'}}
        />
      </div>

      <div className={styles.vColumn}>
        {right.map((phase) => (
          <div key={phase.id} className={nodeState(phase)} style={{'--phase-color': phase.color}}>
            {phase.icon} {phase.shortName}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModelViz({modelKey, activeIndex, doneSet}) {
  const labels = {
    waterfall: 'Каскадный поток',
    agile: 'Спринты Agile',
    vmodel: 'V-образная верификация',
  };
  return (
    <div className={styles.modelViz}>
      <p className={styles.modelVizLabel}>{labels[modelKey]}</p>
      {modelKey === 'waterfall' && <WaterfallViz activeIndex={activeIndex} doneSet={doneSet} />}
      {modelKey === 'agile' && <AgileViz activeIndex={activeIndex} doneSet={doneSet} />}
      {modelKey === 'vmodel' && <VModelViz activeIndex={activeIndex} doneSet={doneSet} />}
    </div>
  );
}

function PhaseDetail({phase, completionNote}) {
  return (
    <div className={clsx('it-demo__panel', styles.detail)}>
      <div className={styles.detailHeader}>
        <div className={styles.detailIcon} style={{background: `color-mix(in srgb, ${phase.color} 22%, transparent)`}}>
          {phase.icon}
        </div>
        <div>
          <h3 className={styles.detailTitle}>{phase.name}</h3>
          <p className={styles.detailMeta}>
            Фаза {PHASES.findIndex((p) => p.id === phase.id) + 1} из {PHASES.length}
            {phase.sprint && (
              <span className={styles.sprintBadge}>Спринт {phase.sprint}</span>
            )}
          </p>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.detailBlock}>
          <h5>Длительность</h5>
          <p>{phase.duration}</p>
          <h5 style={{marginTop: '0.85rem'}}>Команда</h5>
          <p>{phase.team}</p>
          <h5 style={{marginTop: '0.85rem'}}>Результаты</h5>
          <p>{phase.deliverables}</p>
        </div>
        <div className={styles.detailBlock}>
          <h5>Инструменты</h5>
          <p>{phase.tools}</p>
          <h5 style={{marginTop: '0.85rem'}}>Риск</h5>
          <p className={riskClass(phase.risk)}>{RISK_LABEL[phase.risk]}</p>
          <h5 style={{marginTop: '0.85rem'}}>Доля бюджета</h5>
          <p>~{phase.costPct}%</p>
        </div>
        <div className={styles.detailBlock}>
          <h5>Ключевые активности</h5>
          <ul>
            {phase.activities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      {completionNote && <p className={styles.simNote}>{completionNote}</p>}
    </div>
  );
}

function CostBar({highlightIndex, doneSet}) {
  return (
    <div className={styles.costSection}>
      <p className={styles.costTitle}>Распределение бюджета по фазам</p>
      <div className={styles.costBar} role="img" aria-label="Диаграмма бюджета по фазам SDLC">
        {PHASES.map((phase, idx) => (
          <div
            key={phase.id}
            className={clsx(styles.costSegment, {
              [styles.costSegmentDim]:
                highlightIndex >= 0 && highlightIndex !== idx && !doneSet.has(idx),
            })}
            style={{
              width: `${phase.costPct}%`,
              background: phase.color,
            }}
            title={`${phase.shortName}: ${phase.costPct}%`}
          />
        ))}
      </div>
      <div className={styles.costLegend}>
        {PHASES.map((phase) => (
          <span key={phase.id} className={styles.costLegendItem}>
            <span className={styles.costDot} style={{background: phase.color}} />
            {phase.shortName} ({phase.costPct}%)
          </span>
        ))}
      </div>
    </div>
  );
}

function SoftwareLifecycleDemoInner() {
  const [selectedModel, setSelectedModel] = useState('waterfall');
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [simPhase, setSimPhase] = useState(-1);
  const [simStatus, setSimStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [doneSet, setDoneSet] = useState(() => new Set());
  const [logEntries, setLogEntries] = useState([]);
  const [completionNotes, setCompletionNotes] = useState({});

  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const appendLog = useCallback((message) => {
    setLogEntries((prev) =>
      [{id: `${Date.now()}-${prev.length}`, time: formatTime(new Date()), message}, ...prev].slice(
        0,
        10,
      ),
    );
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setSimStatus('idle');
    setSimPhase(-1);
    setProgress(0);
    setDoneSet(new Set());
    setLogEntries([]);
    setCompletionNotes({});
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    clearTimer();
    setSimStatus('idle');
    setSimPhase(-1);
    setProgress(0);
    setDoneSet(new Set());
    setLogEntries([]);
    setCompletionNotes({});
    // eslint-disable-next-line react-hooks/exhaustive-deps -- сброс симуляции при смене модели
  }, [selectedModel]);

  const startSimulation = useCallback(() => {
    if (simStatus === 'running') return;

    clearTimer();
    setSimStatus('running');
    setSimPhase(0);
    setProgress(0);
    setDoneSet(new Set());
    setLogEntries([]);
    setCompletionNotes({});
    setSelectedPhase(0);
    appendLog(`Старт симуляции — модель ${MODELS[selectedModel].name}`);

    const phaseMs = MODELS[selectedModel].phaseMs;
    let index = 0;

    const runPhase = () => {
      if (index >= PHASES.length) {
        clearTimer();
        setSimStatus('done');
        setSimPhase(-1);
        setProgress(100);
        appendLog('✓ Проект завершён — все фазы пройдены');
        return;
      }

      const phase = PHASES[index];
      setSimPhase(index);
      setSelectedPhase(index);
      setProgress(Math.round(((index + 1) / PHASES.length) * 100));
      appendLog(phase.log);

      timerRef.current = setTimeout(() => {
        setDoneSet((prev) => new Set([...prev, index]));
        setCompletionNotes((prev) => ({
          ...prev,
          [index]: `Фаза завершена за ${Math.floor(Math.random() * 8) + 2} дн.`,
        }));
        index += 1;
        runPhase();
      }, phaseMs);
    };

    runPhase();
  }, [simStatus, selectedModel, clearTimer, appendLog]);

  const isRunning = simStatus === 'running';
  const displayActive = isRunning ? simPhase : selectedPhase;
  const vizActiveIndex = isRunning ? simPhase : selectedPhase;

  const metrics = useMemo(
    () => computeMetrics(doneSet.size, simPhase >= 0 ? simPhase : selectedPhase),
    [doneSet.size, simPhase, selectedPhase],
  );

  const model = MODELS[selectedModel];
  const currentPhase = PHASES[displayActive];

  const phaseBtnClass = (idx) =>
    clsx(styles.phaseBtn, {
      [styles.phaseBtnPending]: isRunning && simPhase >= 0 && idx > simPhase,
    });

  const phaseOrbClass = (idx) =>
    clsx(styles.phaseOrb, {
      [styles.phaseOrbActive]: displayActive === idx,
      [styles.phaseOrbDone]: doneSet.has(idx),
      [styles.phaseOrbRunning]: isRunning && simPhase === idx,
    });

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="SDLC: жизненный цикл ПО"
        subtitle="От идеи до вывода из эксплуатации — интерактивная карта фаз, моделей и метрик проекта."
      >
        <div className={styles.toolbar} role="tablist" aria-label="Модель разработки">
          {Object.entries(MODELS).map(([key, m]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selectedModel === key}
              className={clsx('it-demo__tab', {'it-demo__tab--active': selectedModel === key})}
              onClick={() => setSelectedModel(key)}
              disabled={isRunning}
            >
              {m.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <div className={styles.modelPanel}>
          <p className={styles.modelName}>{model.name}</p>
          <p className={styles.modelDesc}>{model.description}</p>
          <div className={styles.prosCons}>
            <span className={styles.pros}>✓ {model.pros.join(' · ')}</span>
            <span className={styles.cons}>✗ {model.cons.join(' · ')}</span>
          </div>
        </div>

        <ModelViz modelKey={selectedModel} activeIndex={vizActiveIndex} doneSet={doneSet} />

        {(progress > 0 || isRunning) && (
          <div style={{marginBottom: '1rem'}}>
            <div
              className="it-demo__row"
              style={{justifyContent: 'space-between', marginBottom: '0.35rem'}}
            >
              <span style={{fontSize: '0.8rem', color: 'var(--demo-muted)'}}>Прогресс проекта</span>
              <span style={{fontSize: '0.8rem', fontWeight: 600}}>{progress}%</span>
            </div>
            <div className="it-demo__progress">
              <div className="it-demo__progress-bar" style={{width: `${progress}%`}} />
            </div>
          </div>
        )}

        <div className={styles.timelineWrap}>
          <div className={styles.timelineTrack} aria-hidden>
            <div
              className={styles.timelineFill}
              style={{
                width: `${(doneSet.size / PHASES.length) * 100}%`,
              }}
            />
          </div>
          <div className={styles.timeline} role="list" aria-label="Фазы SDLC">
            {PHASES.map((phase, idx) => (
              <button
                key={phase.id}
                type="button"
                role="listitem"
                className={phaseBtnClass(idx)}
                style={{'--phase-color': phase.color}}
                onClick={() => !isRunning && setSelectedPhase(idx)}
                disabled={isRunning}
                aria-current={displayActive === idx ? 'step' : undefined}
                aria-label={`${phase.name}${doneSet.has(idx) ? ', завершена' : ''}`}
              >
                <div className={phaseOrbClass(idx)}>
                  {phase.icon}
                </div>
                <span
                  className={clsx(styles.phaseLabel, {
                    [styles.phaseLabelActive]: displayActive === idx,
                  })}
                >
                  {phase.shortName}
                </span>
                {doneSet.has(idx) && <span className={styles.phaseCheck}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {currentPhase && (
          <PhaseDetail
            phase={currentPhase}
            completionNote={completionNotes[displayActive]}
          />
        )}

        <CostBar highlightIndex={displayActive} doneSet={doneSet} />

        <div style={{marginTop: '1rem'}}>
          <p style={{margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--demo-muted)'}}>
            Метрики эффективности
            {isRunning && ' (обновляются в реальном времени)'}
          </p>
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>CPI (стоимость)</div>
              <div
                className={clsx(styles.metricValue, {
                  [styles.metricGood]: Number(metrics.cpi) >= 1,
                  [styles.metricWarn]: Number(metrics.cpi) < 1,
                })}
              >
                {metrics.cpi}
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>SPI (сроки)</div>
              <div
                className={clsx(styles.metricValue, {
                  [styles.metricGood]: Number(metrics.spi) >= 1,
                  [styles.metricWarn]: Number(metrics.spi) < 1,
                })}
              >
                {metrics.spi}
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Defect density</div>
              <div
                className={clsx(styles.metricValue, {
                  [styles.metricBad]: Number(metrics.defect) > 2.5,
                  [styles.metricWarn]: Number(metrics.defect) > 1.5 && Number(metrics.defect) <= 2.5,
                  [styles.metricGood]: Number(metrics.defect) <= 1.5,
                })}
              >
                {metrics.defect}/KLOC
              </div>
            </div>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Code coverage</div>
              <div className={clsx(styles.metricValue, styles.metricInfo)}>
                {metrics.coverage}%
              </div>
            </div>
          </div>
        </div>

        {logEntries.length > 0 && (
          <div style={{marginTop: '1rem'}}>
            <p style={{margin: '0 0 0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--demo-muted)'}}>
              Журнал проекта
            </p>
            <div className="it-demo__log" role="log" aria-live="polite">
              {logEntries.map((entry) => (
                <div key={entry.id} className="it-demo__log-entry">
                  <span style={{color: 'var(--demo-muted)', marginRight: '0.5rem'}}>[{entry.time}]</span>
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={clsx('it-demo__row', styles.controls)}>
          {simStatus !== 'running' && (
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={simStatus === 'done' ? reset : startSimulation}
            >
              {simStatus === 'done' ? 'Повторить симуляцию' : 'Симулировать проект'}
            </button>
          )}
          {simStatus === 'running' && (
            <span className="it-demo__badge it-demo__badge--active">Выполняется…</span>
          )}
          {simStatus === 'done' && (
            <span className="it-demo__badge it-demo__badge--active">Проект завершён</span>
          )}
          {(simStatus === 'running' || simStatus === 'done' || doneSet.size > 0) && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          )}
        </div>

        {simStatus === 'idle' && doneSet.size === 0 && (
          <div className="it-demo__alert it-demo__alert--info" style={{marginTop: '1rem'}}>
            Выберите модель, кликните фазу на таймлайне или запустите симуляцию — журнал и метрики
            обновятся по ходу "проекта".
          </div>
        )}

        <div className={styles.bestPractices}>
          <p className={styles.bestTitle}>Лучшие практики успешного проекта</p>
          <ul className={styles.bestList}>
            {BEST_PRACTICES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SoftwareLifecycleDemoInner;
