import React, {useState, useMemo, useCallback} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/RequirementsAnalysisDemo.module.css';

const TABS = [
  {id: 'requirements', label: 'Требования'},
  {id: 'stakeholders', label: 'Стейкхолдеры'},
  {id: 'stories', label: 'Истории'},
  {id: 'elicitation', label: 'Сбор'},
  {id: 'traceability', label: 'Трассировка'},
];

const PRIORITY_COLORS = {
  Критичный: '#ef4444',
  Высокий: '#f59e0b',
  Средний: '#10b981',
  Низкий: '#6b7280',
};

const INITIAL_FUNCTIONAL = [
  {id: 1, text: 'Пользователь может авторизоваться по email/паролю', priority: 'Высокий', status: 'Утверждено', category: 'auth', moscow: 'Must'},
  {id: 2, text: 'Система должна отправлять email-уведомления', priority: 'Средний', status: 'На рассмотрении', category: 'notifications', moscow: 'Should'},
  {id: 3, text: 'Поиск товаров по категориям и фильтрам', priority: 'Высокий', status: 'Утверждено', category: 'search', moscow: 'Must'},
  {id: 4, text: 'Экспорт отчётов в PDF/Excel', priority: 'Низкий', status: 'Черновик', category: 'reports', moscow: 'Could'},
];

const INITIAL_NON_FUNCTIONAL = [
  {id: 5, text: 'Время отклика API менее 200 мс', priority: 'Высокий', status: 'Утверждено', metric: 'Производительность', moscow: 'Must'},
  {id: 6, text: 'Поддержка 1000+ одновременных пользователей', priority: 'Высокий', status: 'Утверждено', metric: 'Масштабируемость', moscow: 'Must'},
  {id: 7, text: '99.9% времени доступности (SLA)', priority: 'Средний', status: 'На рассмотрении', metric: 'Надёжность', moscow: 'Should'},
  {id: 8, text: 'Шифрование данных в покое и при передаче', priority: 'Критичный', status: 'Утверждено', metric: 'Безопасность', moscow: 'Must'},
];

const INITIAL_STAKEHOLDERS = [
  {id: 1, name: 'Иван Петров', role: 'Владелец продукта', influence: 0.9, interest: 0.9, concerns: 'ROI, соответствие рынку', strategy: 'Управлять внимательно'},
  {id: 2, name: 'Елена Смирнова', role: 'Технический лид', influence: 0.85, interest: 0.55, concerns: 'Архитектура, техдолг', strategy: 'Держать удовлетворённой'},
  {id: 3, name: 'Анна Козлова', role: 'Конечный пользователь', influence: 0.25, interest: 0.88, concerns: 'Юзабилити, функции', strategy: 'Держать в курсе'},
  {id: 4, name: 'Дмитрий Орлов', role: 'Специалист по безопасности', influence: 0.6, interest: 0.82, concerns: 'Комплаенс, защита данных', strategy: 'Держать удовлетворённым'},
];

const INITIAL_STORIES = [
  {id: 1, text: 'Как пользователь, я хочу видеть историю заказов, чтобы отслеживать статус доставки', acceptance: 'Список заказов с фильтрацией по дате', priority: 'Высокий', status: 'В разработке', moscow: 'Must'},
  {id: 2, text: 'Как администратор, я хочу управлять ролями пользователей, чтобы ограничить доступ к данным', acceptance: 'CRUD для ролей, назначение прав', priority: 'Средний', status: 'В бэклоге', moscow: 'Should'},
  {id: 3, text: 'Как менеджер, я хочу получать дашборд с KPI, чтобы принимать решения', acceptance: 'Визуализация метрик в реальном времени', priority: 'Высокий', status: 'На рассмотрении', moscow: 'Could'},
];

const ELICITATION_METHODS = {
  interview: {
    name: 'Интервью',
    icon: '🎙️',
    description: 'Индивидуальные беседы с заинтересованными лицами',
    steps: ['Подготовка вопросов', 'Проведение интервью', 'Документирование', 'Согласование'],
    duration: '1–2 ч на человека',
    bestFor: 'Сложные требования, неявные потребности',
  },
  workshop: {
    name: 'Воркшоп',
    icon: '👥',
    description: 'Групповые сессии с заказчиком и командой',
    steps: ['Планирование сессии', 'Модерация обсуждения', 'Фиксация решений', 'Приоритизация'],
    duration: '2–4 ч',
    bestFor: 'Быстрое согласование, противоречивые требования',
  },
  survey: {
    name: 'Анкетирование',
    icon: '📋',
    description: 'Сбор требований через опросы',
    steps: ['Дизайн анкеты', 'Рассылка', 'Анализ результатов', 'Выявление паттернов'],
    duration: '3–7 дней',
    bestFor: 'Большая аудитория, количественные данные',
  },
  observation: {
    name: 'Наблюдение',
    icon: '👁️',
    description: 'Изучение текущих процессов',
    steps: ['Выбор процесса', 'Наблюдение', 'Фиксация проблем', 'Предложение улучшений'],
    duration: '2–5 дней',
    bestFor: 'Анализ AS-IS, выявление узких мест',
  },
};

const TRACEABILITY = [
  {req: 'FR-001: Авторизация', source: 'Интервью с владельцем продукта', test: 'TC-001: Тест логина', status: 'Покрыто'},
  {req: 'FR-002: Email-уведомления', source: 'Воркшоп', test: 'TC-005: Тест уведомлений', status: 'Покрыто'},
  {req: 'NFR-001: Производительность', source: 'SLA', test: 'TC-010: Нагрузочное тестирование', status: 'Ожидает'},
  {req: 'FR-003: Поиск', source: 'Обратная связь пользователей', test: 'TC-015: Тест поиска', status: 'В процессе'},
  {req: 'NFR-004: Шифрование', source: 'Security review', test: 'TC-020: Pen-test', status: 'Покрыто'},
];

const MOSCOW_COLS = [
  {key: 'Must', label: 'Must — обязательно', className: styles.moscowColMust},
  {key: 'Should', label: 'Should — важно', className: styles.moscowColShould},
  {key: 'Could', label: 'Could — желательно', className: styles.moscowColCould},
  {key: 'Wont', label: "Won't — не сейчас", className: styles.moscowColWont},
];

const SMART_LABELS = {
  specific: 'Конкретность',
  measurable: 'Измеримость',
  achievable: 'Достижимость',
  relevant: 'Значимость',
  timeBound: 'Ограниченность во времени',
};

const SMART_TIPS = {
  specific: 'Используйте "должен", "может", "система" — однозначная формулировка.',
  measurable: 'Добавьте числа: время, %, количество пользователей.',
  achievable: 'Проверьте реализуемость с командой и бюджетом.',
  relevant: 'Свяжите требование с бизнес-целью (минимум ~20 символов).',
  timeBound: 'Укажите срок: "в течение", "до", "к релизу N".',
};

const BEST_PRACTICES = [
  'Вовлекайте стейкхолдеров на ранних этапах и регулярно',
  'Валидируйте требования по SMART перед утверждением',
  'Ведите матрицу трассировки (RTM) с первого спринта',
  'Приоритизируйте методом MoSCoW на каждом ревью',
  'Документируйте допущения, ограничения и out-of-scope',
  'Проводите ревью требований до freeze scope',
];

function validateSmart(text) {
  const t = text.trim();
  return {
    specific: /\b(должен|должна|может|система|пользователь)\b/i.test(t),
    measurable: /\d+/.test(t),
    achievable: t.length >= 15,
    relevant: t.length >= 25,
    timeBound: /\b(в течение|до|к релизу|срок|недел)\b/i.test(t),
  };
}

function smartScore(smart) {
  return Object.values(smart).filter(Boolean).length;
}

function scoreColor(score) {
  if (score >= 4) return 'var(--demo-success, #2e7d32)';
  if (score >= 3) return 'var(--demo-warning, #ed6c02)';
  return 'var(--demo-error, #c62828)';
}

function scoreVerdict(score) {
  if (score >= 5) return 'Отличное требование — готово к утверждению';
  if (score >= 4) return 'Хорошее требование — мелкие правки';
  if (score >= 3) return 'Среднее — доработайте по подсказкам';
  return 'Слабое требование — перепишите формулировку';
}

function StakeholderMatrix({stakeholders, selectedId, onSelect}) {
  return (
    <div className={styles.matrixWrap}>
      <p className="it-demo__subtitle" style={{margin: '0 0 0.75rem', textAlign: 'center'}}>
        Матрица власть / интерес — клик по аватару или карточке
      </p>
      <div className={styles.matrixPlot} aria-label="Матрица стейкхолдеров">
        <div className={styles.matrixAxisY}>
          <span>Высокая власть</span>
          <span>Низкая власть</span>
        </div>
        <div className={styles.matrixGrid}>
          <div className={clsx(styles.matrixCell, styles.matrixCellQ2)}>
            <p className={styles.matrixCellTitle}>Удовлетворять</p>
          </div>
          <div className={clsx(styles.matrixCell, styles.matrixCellQ1)}>
            <p className={styles.matrixCellTitle}>Управлять внимательно</p>
          </div>
          <div className={clsx(styles.matrixCell, styles.matrixCellQ4)}>
            <p className={styles.matrixCellTitle}>Мониторить</p>
          </div>
          <div className={clsx(styles.matrixCell, styles.matrixCellQ3)}>
            <p className={styles.matrixCellTitle}>Держать в курсе</p>
          </div>
        </div>
        <div className={styles.matrixOverlay}>
          {stakeholders.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.matrixDot, {[styles.matrixDotActive]: selectedId === s.id})}
              style={{left: `${s.interest * 100}%`, top: `${(1 - s.influence) * 100}%`}}
              title={`${s.name} — ${s.strategy}`}
              onClick={() => onSelect(s.id)}
              aria-label={s.name}
            >
              {s.name[0]}
            </button>
          ))}
        </div>
        <div className={styles.matrixAxisX}>
          <span>Низкий интерес</span>
          <span>Высокий интерес</span>
        </div>
      </div>
    </div>
  );
}

function SmartPanel({text}) {
  const smart = useMemo(() => validateSmart(text || ''), [text]);
  const score = smartScore(smart);

  if (!text?.trim()) {
    return (
      <div className="it-demo__alert it-demo__alert--info" style={{marginBottom: '1rem'}}>
        Выберите требование или начните ввод — SMART-проверка обновится автоматически.
      </div>
    );
  }

  const failed = Object.entries(smart).filter(([, v]) => !v).map(([k]) => SMART_TIPS[k]);

  return (
    <div className={styles.smartPanel}>
      <div className={styles.smartHeader}>
        <div className={styles.smartScore} style={{'--score-color': scoreColor(score)}}>
          <span className={styles.smartScoreNum}>{score}/5</span>
          <span className={styles.smartScoreLabel}>SMART</span>
        </div>
        <div style={{flex: 1, minWidth: '12rem'}}>
          <p style={{margin: 0, fontSize: '0.85rem', fontWeight: 600}}>SMART-валидация</p>
          <p style={{margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--demo-muted)'}}>{scoreVerdict(score)}</p>
          {text && <p style={{margin: '0.5rem 0 0', fontSize: '0.78rem', fontStyle: 'italic'}}>"{text}"</p>}
        </div>
      </div>
      <div className={styles.smartGrid}>
        {Object.entries(smart).map(([key, pass]) => (
          <div key={key} className={clsx(styles.smartCell, pass ? styles.smartPass : styles.smartFail)}>
            <div>{pass ? '✓' : '✗'}</div>
            <div>{SMART_LABELS[key]}</div>
          </div>
        ))}
      </div>
      {failed.length > 0 && text && (
        <p className={styles.smartTip}>
          <strong>Подсказки:</strong> {failed.join(' ')}
        </p>
      )}
    </div>
  );
}

function RequirementsAnalysisDemoInner() {
  const [activeTab, setActiveTab] = useState('requirements');
  const [functional, setFunctional] = useState(INITIAL_FUNCTIONAL);
  const [nonFunctional, setNonFunctional] = useState(INITIAL_NON_FUNCTIONAL);
  const [stakeholders] = useState(INITIAL_STAKEHOLDERS);
  const [userStories, setUserStories] = useState(INITIAL_STORIES);
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [selectedStakeholderId, setSelectedStakeholderId] = useState(null);
  const [elicitationMethod, setElicitationMethod] = useState('interview');
  const [checkedSteps, setCheckedSteps] = useState({});
  const [traceFilter, setTraceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newRequirement, setNewRequirement] = useState('');
  const [newUserStory, setNewUserStory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Средний');
  const [reqType, setReqType] = useState('functional');

  const allRequirements = useMemo(
    () => [...functional, ...nonFunctional],
    [functional, nonFunctional],
  );

  const selectedReq = useMemo(
    () => allRequirements.find((r) => r.id === selectedReqId),
    [allRequirements, selectedReqId],
  );

  const smartText = selectedReq?.text ?? newRequirement;

  const stats = useMemo(() => {
    const approved = allRequirements.filter((r) => r.status === 'Утверждено').length;
    const covered = TRACEABILITY.filter((t) => t.status === 'Покрыто').length;
    return {
      total: allRequirements.length,
      approvedPct: allRequirements.length ? Math.round((approved / allRequirements.length) * 100) : 0,
      stories: userStories.length,
      tracePct: Math.round((covered / TRACEABILITY.length) * 100),
      stakeholders: stakeholders.length,
    };
  }, [allRequirements, userStories.length, stakeholders.length]);

  const filterReqs = useCallback(
    (list) =>
      list.filter((r) => {
        const matchSearch = !searchQuery || r.text.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || r.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [searchQuery, statusFilter],
  );

  const filteredFunctional = useMemo(() => filterReqs(functional), [functional, filterReqs]);
  const filteredNfr = useMemo(() => filterReqs(nonFunctional), [nonFunctional, filterReqs]);

  const filteredTrace = useMemo(() => {
    if (traceFilter === 'all') return TRACEABILITY;
    return TRACEABILITY.filter((t) => {
      if (traceFilter === 'covered') return t.status === 'Покрыто';
      if (traceFilter === 'pending') return t.status === 'Ожидает';
      return t.status === 'В процессе';
    });
  }, [traceFilter]);

  const moscowItems = useMemo(() => {
    const items = [
      ...functional.map((r) => ({id: `fr-${r.id}`, text: r.text, moscow: r.moscow, type: 'FR'})),
      ...nonFunctional.map((r) => ({id: `nfr-${r.id}`, text: r.text, moscow: r.moscow, type: 'NFR'})),
      ...userStories.map((s) => ({id: `us-${s.id}`, text: s.text.slice(0, 60) + (s.text.length > 60 ? '…' : ''), moscow: s.moscow, type: 'US'})),
    ];
    return items;
  }, [functional, nonFunctional, userStories]);

  const cycleMoscow = useCallback((id, current) => {
    const order = ['Must', 'Should', 'Could', 'Wont'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    const apply = (list, prefix) =>
      list.map((item) => {
        const key = `${prefix}-${item.id}`;
        return key === id ? {...item, moscow: next} : item;
      });
    if (id.startsWith('fr-')) setFunctional((prev) => apply(prev, 'fr'));
    else if (id.startsWith('nfr-')) setNonFunctional((prev) => apply(prev, 'nfr'));
    else if (id.startsWith('us-')) setUserStories((prev) => apply(prev, 'us'));
  }, []);

  const addRequirement = () => {
    if (!newRequirement.trim()) return;
    const newReq = {
      id: Date.now(),
      text: newRequirement.trim(),
      priority: selectedPriority,
      status: 'Черновик',
      category: 'general',
      moscow: 'Should',
    };
    if (reqType === 'functional') setFunctional((prev) => [...prev, newReq]);
    else setNonFunctional((prev) => [...prev, {...newReq, metric: 'Общее'}]);
    setNewRequirement('');
    setSelectedReqId(newReq.id);
  };

  const addStory = () => {
    if (!newUserStory.trim()) return;
    const story = {
      id: Date.now(),
      text: newUserStory.trim(),
      acceptance: 'Будет определено на refinement',
      priority: 'Средний',
      status: 'Черновик',
      moscow: 'Should',
    };
    setUserStories((prev) => [...prev, story]);
    setNewUserStory('');
  };

  const toggleStep = (method, idx) => {
    const key = `${method}-${idx}`;
    setCheckedSteps((prev) => ({...prev, [key]: !prev[key]}));
  };

  const method = ELICITATION_METHODS[elicitationMethod];
  const methodProgress = useMemo(() => {
    const done = method.steps.filter((_, i) => checkedSteps[`${elicitationMethod}-${i}`]).length;
    return Math.round((done / method.steps.length) * 100);
  }, [method.steps, checkedSteps, elicitationMethod]);

  const renderReqCard = (req) => (
    <div
      key={req.id}
      role="button"
      tabIndex={0}
      className={clsx(styles.reqCard, {[styles.reqCardSelected]: selectedReqId === req.id})}
      style={{'--prio-color': PRIORITY_COLORS[req.priority] ?? '#888'}}
      onClick={() => setSelectedReqId(req.id)}
      onKeyDown={(e) => e.key === 'Enter' && setSelectedReqId(req.id)}
    >
      <p className={styles.reqText}>{req.text}</p>
      <div className={styles.reqMeta}>
        <span className={styles.badge}>{req.priority}</span>
        <span className={styles.badge}>{req.status}</span>
        {req.moscow && <span className={styles.badge}>MoSCoW: {req.moscow}</span>}
        {req.metric && <span className={styles.badge}>{req.metric}</span>}
      </div>
    </div>
  );

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Анализ требований"
        subtitle="Сбор, валидация SMART, матрица стейкхолдеров, user stories, MoSCoW и трассировка — интерактивная песочница BA."
      >
        <div className={styles.stats} aria-label="Сводка по артефактам">
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <p className={styles.statLabel}>Требований</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.approvedPct}%</div>
            <p className={styles.statLabel}>Утверждено</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.stories}</div>
            <p className={styles.statLabel}>User stories</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.tracePct}%</div>
            <p className={styles.statLabel}>Покрытие RTM</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.stakeholders}</div>
            <p className={styles.statLabel}>Стейкхолдеров</p>
          </div>
        </div>

        <div className={styles.toolbar} role="tablist" aria-label="Разделы анализа требований">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={clsx('it-demo__tab', {'it-demo__tab--active': activeTab === tab.id})}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'requirements' && (
          <div className={styles.panel}>
            <div className={styles.filters}>
              <input
                type="search"
                className={clsx('it-demo__input', styles.searchInput)}
                placeholder="Поиск по тексту…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="it-demo__select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Фильтр по статусу"
              >
                <option value="all">Все статусы</option>
                <option value="Утверждено">Утверждено</option>
                <option value="На рассмотрении">На рассмотрении</option>
                <option value="Черновик">Черновик</option>
              </select>
            </div>

            <SmartPanel text={smartText} />

            <div className={styles.reqGrid}>
              <section className={styles.reqColumn}>
                <h4 className={styles.reqColumnTitleFr}>Функциональные ({filteredFunctional.length})</h4>
                {filteredFunctional.length ? filteredFunctional.map(renderReqCard) : (
                  <p className={styles.emptyHint}>Нет совпадений</p>
                )}
              </section>
              <section className={styles.reqColumn}>
                <h4 className={styles.reqColumnTitleNfr}>Нефункциональные ({filteredNfr.length})</h4>
                {filteredNfr.length ? filteredNfr.map(renderReqCard) : (
                  <p className={styles.emptyHint}>Нет совпадений</p>
                )}
              </section>
            </div>

            <div className={styles.addForm}>
              <p style={{margin: 0, fontWeight: 600, fontSize: '0.85rem'}}>Добавить требование</p>
              <input
                type="text"
                className="it-demo__input"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onFocus={() => setSelectedReqId(null)}
                placeholder="Система должна… (проверка SMART в реальном времени)"
              />
              <div className={styles.addRow}>
                <select className="it-demo__select" value={reqType} onChange={(e) => setReqType(e.target.value)}>
                  <option value="functional">Функциональное</option>
                  <option value="nonfunctional">Нефункциональное</option>
                </select>
                <select
                  className="it-demo__select"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  {Object.keys(PRIORITY_COLORS).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={addRequirement}>
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stakeholders' && (
          <div className={styles.panel}>
            <StakeholderMatrix
              stakeholders={stakeholders}
              selectedId={selectedStakeholderId}
              onSelect={setSelectedStakeholderId}
            />
            <div className={styles.stakeholderCards}>
              {stakeholders.map((s) => (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  className={clsx(styles.stakeholderCard, {
                    [styles.stakeholderCardActive]: selectedStakeholderId === s.id,
                  })}
                  onClick={() => setSelectedStakeholderId(s.id)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedStakeholderId(s.id)}
                >
                  <div className={styles.stakeholderHead}>
                    <div className={styles.avatar}>{s.name[0]}</div>
                    <div>
                      <div style={{fontWeight: 700, fontSize: '0.9rem'}}>{s.name}</div>
                      <div style={{fontSize: '0.78rem', color: 'var(--demo-muted)'}}>{s.role}</div>
                    </div>
                  </div>
                  <p style={{margin: '0 0 0.35rem', fontSize: '0.8rem'}}>
                    <strong>Стратегия:</strong> {s.strategy}
                  </p>
                  <p style={{margin: 0, fontSize: '0.78rem', color: 'var(--demo-muted)'}}>
                    Ожидания: {s.concerns}
                  </p>
                  {selectedStakeholderId === s.id && (
                    <p className="it-demo__alert it-demo__alert--info" style={{marginTop: '0.65rem', fontSize: '0.75rem'}}>
                      Власть {Math.round(s.influence * 100)}% · интерес {Math.round(s.interest * 100)}%
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className={styles.panel}>
            <p style={{margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--demo-muted)'}}>
              Формат INVEST — независимые, обсуждаемые, ценные, оцениваемые, компактные, тестируемые истории
            </p>
            {userStories.map((story) => (
              <article key={story.id} className={styles.storyCard}>
                <p className={styles.storyText}>{story.text}</p>
                <p className={styles.storyAcceptance}>✓ {story.acceptance}</p>
                <div className={styles.reqMeta}>
                  <span className={styles.badge}>{story.priority}</span>
                  <span className={styles.badge}>{story.status}</span>
                  <span className={styles.badge}>MoSCoW: {story.moscow}</span>
                </div>
              </article>
            ))}
            <div className={styles.addForm} style={{marginTop: '1rem'}}>
              <p style={{margin: 0, fontWeight: 600, fontSize: '0.85rem'}}>Новая user story</p>
              <textarea
                className="it-demo__textarea"
                rows={3}
                value={newUserStory}
                onChange={(e) => setNewUserStory(e.target.value)}
                placeholder="Как [роль], я хочу [действие], чтобы [ценность]…"
              />
              <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={addStory}>
                Добавить историю
              </button>
            </div>
          </div>
        )}

        {activeTab === 'elicitation' && (
          <div className={styles.panel}>
            <div className={styles.elicitationGrid}>
              {Object.entries(ELICITATION_METHODS).map(([key, m]) => (
                <button
                  key={key}
                  type="button"
                  className={clsx(styles.methodCard, {[styles.methodCardActive]: elicitationMethod === key})}
                  onClick={() => {
                    setElicitationMethod(key);
                    setCheckedSteps({});
                  }}
                >
                  <div className={styles.methodIcon}>{m.icon}</div>
                  <p className={styles.methodName}>{m.name}</p>
                  <p className={styles.methodDesc}>{m.description}</p>
                </button>
              ))}
            </div>

            <div className="it-demo__panel" style={{marginBottom: '1rem'}}>
              <div className="it-demo__row" style={{justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <strong style={{fontSize: '0.9rem'}}>{method.icon} {method.name}</strong>
                <span style={{fontSize: '0.78rem', color: 'var(--demo-muted)'}}>Прогресс: {methodProgress}%</span>
              </div>
              <div className="it-demo__progress" style={{marginBottom: '0.85rem'}}>
                <div className="it-demo__progress-bar" style={{width: `${methodProgress}%`}} />
              </div>
              <ul className={styles.checklist}>
                {method.steps.map((step, idx) => {
                  const key = `${elicitationMethod}-${idx}`;
                  const done = !!checkedSteps[key];
                  return (
                    <li key={key} className={clsx(styles.checklistItem, done && styles.checklistItemDone)}>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleStep(elicitationMethod, idx)}
                        id={key}
                      />
                      <label htmlFor={key} style={{cursor: 'pointer', flex: 1}}>{step}</label>
                    </li>
                  );
                })}
              </ul>
              <p style={{margin: '0.75rem 0 0', fontSize: '0.8rem', color: 'var(--demo-muted)'}}>
                <strong>Длительность:</strong> {method.duration} · <strong>Лучше для:</strong> {method.bestFor}
              </p>
              {methodProgress === 100 && (
                <p className="it-demo__alert it-demo__alert--success" style={{marginTop: '0.65rem'}}>
                  Сессия сбора завершена — зафиксируйте артефакты в Confluence/Jira.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'traceability' && (
          <div className={styles.panel}>
            <div className={styles.coverageBar}>
              <div className={styles.coverageLabel}>
                <span>Покрытие тестами (RTM)</span>
                <span>{stats.tracePct}%</span>
              </div>
              <div className="it-demo__progress">
                <div className="it-demo__progress-bar" style={{width: `${stats.tracePct}%`}} />
              </div>
            </div>

            <div className={styles.traceFilter}>
              {[
                {id: 'all', label: 'Все'},
                {id: 'covered', label: 'Покрыто'},
                {id: 'pending', label: 'Ожидает'},
                {id: 'progress', label: 'В процессе'},
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={clsx('it-demo__tab', {'it-demo__tab--active': traceFilter === f.id})}
                  onClick={() => setTraceFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="it-demo__table-wrap">
              <table className="it-demo__table">
                <thead>
                  <tr>
                    <th>Требование</th>
                    <th>Источник</th>
                    <th>Тест-кейс</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrace.map((item) => (
                    <tr key={item.req}>
                      <td>{item.req}</td>
                      <td>{item.source}</td>
                      <td>{item.test}</td>
                      <td>
                        <span
                          className={clsx('it-demo__badge', {
                            'it-demo__badge--success': item.status === 'Покрыто',
                            'it-demo__badge--warning': item.status === 'Ожидает',
                          })}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{marginTop: '1.25rem'}}>
              <p style={{margin: '0 0 0.65rem', fontWeight: 600, fontSize: '0.85rem'}}>
                MoSCoW — клик по элементу для смены приоритета
              </p>
              <div className={styles.moscowBoard}>
                {MOSCOW_COLS.map((col) => (
                  <div key={col.key} className={clsx(styles.moscowCol, col.className)}>
                    <p className={styles.moscowTitle}>{col.label}</p>
                    {moscowItems
                      .filter((i) => i.moscow === col.key)
                      .map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={styles.moscowItem}
                          title="Клик — следующая категория MoSCoW"
                          onClick={() => cycleMoscow(item.id, item.moscow)}
                        >
                          [{item.type}] {item.text}
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className={styles.bestPractices}>
          <p className={styles.bestTitle}>Лучшие практики анализа требований</p>
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

export default RequirementsAnalysisDemoInner;
