import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/TestingBasicsDemo.module.css';

const TABS = [
  {id: 'levels', label: 'Уровни'},
  {id: 'types', label: 'Типы'},
  {id: 'testcases', label: 'Test Cases'},
  {id: 'bugs', label: 'Баги'},
  {id: 'metrics', label: 'Метрики'},
];

const PYRAMID_LAYERS = [
  {id: 'e2e', name: 'E2E тесты', percent: 10, color: 'var(--test-e2e)', width: '50%', levelId: 'system'},
  {id: 'integration', name: 'Интеграционные', percent: 20, color: 'var(--test-integration)', width: '70%', levelId: 'integration'},
  {id: 'unit', name: 'Unit тесты', percent: 70, color: 'var(--test-unit)', width: '90%', levelId: 'unit'},
];

const TEST_LEVELS = [
  {
    id: 'unit',
    level: 'Unit testing',
    icon: '🧪',
    color: 'var(--test-unit)',
    description: 'Тестирование отдельных модулей/функций изолированно',
    tools: 'Jest, JUnit, PyTest, NUnit',
    who: 'Разработчики',
    when: 'Во время разработки',
    example: 'assert add(2, 2) === 4',
  },
  {
    id: 'integration',
    level: 'Integration testing',
    icon: '🔗',
    color: 'var(--test-integration)',
    description: 'Проверка взаимодействия между компонентами',
    tools: 'Postman, TestContainers, REST Assured',
    who: 'Разработчики, QA',
    when: 'После unit-тестов',
    example: 'POST /api/login → 200 + JWT в ответе',
  },
  {
    id: 'system',
    level: 'System testing',
    icon: '🖥️',
    color: 'var(--test-e2e)',
    description: 'Тестирование всей системы в целом',
    tools: 'Selenium, Cypress, Playwright',
    who: 'QA команда',
    when: 'После интеграции компонентов',
    example: 'Регистрация → корзина → оплата → чек',
  },
  {
    id: 'acceptance',
    level: 'Acceptance testing',
    icon: '✅',
    color: 'var(--test-accept)',
    description: 'Проверка соответствия требованиям заказчика',
    tools: 'Cucumber, FitNesse',
    who: 'Заказчик, QA, BA',
    when: 'Перед релизом',
    example: 'UAT: менеджер оформляет заказ по бизнес-сценарию',
  },
];

const TEST_TYPES = [
  {name: 'Функциональное', icon: '⚙️', desc: 'Соответствие функциональным требованиям'},
  {name: 'Нагрузочное', icon: '📊', desc: 'Производительность под нагрузкой'},
  {name: 'UI/UX', icon: '🎨', desc: 'Интерфейс и удобство использования'},
  {name: 'Безопасности', icon: '🔒', desc: 'Уязвимости и защита данных'},
  {name: 'Совместимости', icon: '🌐', desc: 'Браузеры, ОС, устройства'},
  {name: 'Регрессионное', icon: '🔄', desc: 'Новый код не ломает старый'},
];

const TEST_DESIGN = [
  {
    name: 'Эквивалентное разделение',
    desc: 'Входные данные делятся на классы эквивалентности',
    example: 'Возраст 0–120: тестируем 30, 60, 90 вместо всех значений',
  },
  {
    name: 'Анализ граничных значений',
    desc: 'Тестирование границ допустимых диапазонов',
    example: 'Пароль 6–20 символов: 5, 6, 20, 21',
  },
  {
    name: 'Попарное тестирование',
    desc: 'Комбинации параметров с минимальным покрытием',
    example: 'ОС × Браузер = 4 комбинации вместо полного перебора',
  },
  {
    name: 'State transition',
    desc: 'Переходы между состояниями системы',
    example: 'Заказ: Новый → Оплачен → Отправлен → Доставлен',
  },
];

const INITIAL_TEST_CASES = [
  {
    id: 1,
    name: 'TC-001: Авторизация с валидными данными',
    type: 'Функциональное',
    steps: [
      'Открыть страницу логина',
      'Ввести email: user@example.com',
      'Ввести пароль: 123456',
      'Нажать "Войти"',
    ],
    expectedResult: 'Редирект на главную страницу',
    actualResult: '',
    status: 'pending',
    automation: true,
    outcome: 'pass',
  },
  {
    id: 2,
    name: 'TC-002: Неверный пароль',
    type: 'Функциональное',
    steps: [
      'Открыть страницу логина',
      'Ввести email: user@example.com',
      'Ввести пароль: wrongpass',
      'Нажать "Войти"',
    ],
    expectedResult: 'Сообщение "Неверный пароль"',
    actualResult: '',
    status: 'pending',
    automation: true,
    outcome: 'fail',
  },
  {
    id: 3,
    name: 'TC-003: Поиск под нагрузкой',
    type: 'Нагрузочное',
    steps: [
      'Запустить 1000 параллельных запросов /search',
      'Измерить p95 времени отклика',
      'Проверить точность результатов',
    ],
    expectedResult: 'p95 < 200 мс, точность 100%',
    actualResult: '',
    status: 'pending',
    automation: true,
    outcome: 'pass',
  },
];

const BUG_STAGES = ['Open', 'In Progress', 'Fixed', 'Verified', 'Closed'];

const INITIAL_BUGS = [
  {id: 1, title: 'Ошибка авторизации при пустом пароле', severity: 'Critical', status: 'Open', priority: 'High'},
  {id: 2, title: 'Некорректное отображение на мобильных', severity: 'Medium', status: 'In Progress', priority: 'Medium'},
  {id: 3, title: 'Медленная загрузка страницы отчётов', severity: 'Low', status: 'Fixed', priority: 'Low'},
];

const CI_STAGES = ['lint', 'unit', 'integration', 'e2e', 'report'];

const CI_LABELS = {lint: 'Lint', unit: 'Unit', integration: 'Integration', e2e: 'E2E', report: 'Report'};

const BEST_PRACTICES = [
  'Пишите тесты рано (Shift-left testing)',
  'Автоматизируйте регрессионные тесты',
  'Используйте техники тест-дизайна',
  'Поддерживайте тесты в актуальном состоянии',
  'Анализируйте покрытие кода',
  'Проводите code review тестов',
];

const QUALITY_METRICS = [
  {name: 'Плотность дефектов', value: '2.3', unit: ' бага/KLOC', desc: 'Багов на 1000 строк кода'},
  {name: 'Эффективность тестов', value: '85', unit: '%', desc: 'Процент найденных дефектов'},
  {name: 'Покрытие кода', value: '78', unit: '%', desc: 'Код, покрытый автотестами'},
  {name: 'MTTF', value: '120', unit: ' ч', desc: 'Среднее время до отказа'},
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function severityStyle(severity) {
  if (severity === 'Critical') return {background: 'color-mix(in srgb, var(--demo-error) 18%, transparent)', color: 'var(--demo-error)'};
  if (severity === 'Medium') return {background: 'color-mix(in srgb, var(--demo-warning) 18%, transparent)', color: 'var(--demo-warning)'};
  return {background: 'color-mix(in srgb, var(--test-unit) 18%, transparent)', color: 'var(--test-unit)'};
}

function statusStyle(status) {
  if (status === 'Open') return {background: 'color-mix(in srgb, var(--demo-error) 15%, transparent)', color: 'var(--demo-error)'};
  if (status === 'In Progress') return {background: 'color-mix(in srgb, var(--demo-warning) 15%, transparent)', color: 'var(--demo-warning)'};
  if (status === 'Fixed' || status === 'Verified') return {background: 'color-mix(in srgb, var(--test-unit) 15%, transparent)', color: 'var(--test-unit)'};
  return {background: 'var(--ifm-background-surface-color)', color: 'var(--demo-muted)'};
}

function BoundaryDemo() {
  const [length, setLength] = useState(10);
  const min = 6;
  const max = 20;
  const valid = length >= min && length <= max;

  return (
    <div className={styles.boundaryPanel}>
      <p className={styles.boundaryTitle}>Интерактив: граничные значения пароля ({min}–{max} символов)</p>
      <label className="it-demo__label" htmlFor="pwd-len">
        Длина пароля: <strong>{length}</strong> символов
      </label>
      <input
        id="pwd-len"
        type="range"
        className={styles.boundarySlider}
        min={0}
        max={25}
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
      />
      <div className={clsx(valid ? styles.boundaryValid : styles.boundaryInvalid)}>
        {valid
          ? `✓ Валидный класс: ${length} ∈ [${min}, ${max}] — тест пройдёт`
          : length < min
            ? `✗ Нижняя граница: ${length} < ${min} — ожидаем ошибку валидации`
            : `✗ Верхняя граница: ${length} > ${max} — ожидаем ошибку валидации`}
      </div>
    </div>
  );
}

function TestingBasicsDemoInner() {
  const [activeTab, setActiveTab] = useState('levels');
  const [selectedLevel, setSelectedLevel] = useState('unit');
  const [selectedPyramid, setSelectedPyramid] = useState('unit');
  const [testCases, setTestCases] = useState(INITIAL_TEST_CASES);
  const [bugs, setBugs] = useState(INITIAL_BUGS);
  const [runningId, setRunningId] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [consoleLog, setConsoleLog] = useState([]);
  const [suiteRunning, setSuiteRunning] = useState(false);
  const [ciStage, setCiStage] = useState(null);
  const [ciStageStatus, setCiStageStatus] = useState({});
  const consoleRef = useRef(null);
  const runAbort = useRef(false);

  const metrics = useMemo(() => {
    const passed = testCases.filter((t) => t.status === 'passed').length;
    const failed = testCases.filter((t) => t.status === 'failed').length;
    const pending = testCases.filter((t) => t.status === 'pending').length;
    const total = testCases.length;
    const automationRate = Math.round((testCases.filter((t) => t.automation).length / total) * 100);
    return {total, passed, failed, pending, blocked: 0, automationRate};
  }, [testCases]);

  const passPct = metrics.total ? Math.round((metrics.passed / metrics.total) * 100) : 0;

  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [consoleLog]);

  const runSingleTest = useCallback(async (testCase, {fromSuite = false} = {}) => {
    if (!fromSuite && (runningId || suiteRunning)) return;
    runAbort.current = false;
    setRunningId(testCase.id);
    setCurrentStep(-1);
    setConsoleLog([`$ npx jest ${testCase.name.split(':')[0].toLowerCase()}`]);

    for (let i = 0; i < testCase.steps.length; i++) {
      if (runAbort.current) return;
      setCurrentStep(i);
      setConsoleLog((prev) => [...prev, `  ▶ Шаг ${i + 1}: ${testCase.steps[i]}`]);
      await delay(550);
    }

    const passed = testCase.outcome === 'pass';
    const actualResult = passed ? testCase.expectedResult : 'Ожидаемый результат не достигнут';
    const status = passed ? 'passed' : 'failed';

    setConsoleLog((prev) => [
      ...prev,
      passed ? `  ✓ PASS (${Date.now() % 1000}ms)` : `  ✗ FAIL — assertion error`,
      `  Expected: ${testCase.expectedResult}`,
      `  Actual:   ${actualResult}`,
    ]);

    setTestCases((prev) =>
      prev.map((tc) => (tc.id === testCase.id ? {...tc, actualResult, status} : tc)),
    );

    if (!passed) {
      setBugs((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          title: `Дефект: ${testCase.name}`,
          severity: 'Medium',
          status: 'Open',
          priority: 'High',
        },
      ]);
    }

    setRunningId(null);
    setCurrentStep(-1);
  }, [runningId, suiteRunning]);

  const runSuite = useCallback(async () => {
    if (runningId || suiteRunning) return;
    setSuiteRunning(true);
    setCiStageStatus({});
    setConsoleLog(['$ npm run test:ci — pipeline started']);

    for (const stage of CI_STAGES) {
      setCiStage(stage);
      setCiStageStatus((prev) => ({...prev, [stage]: 'active'}));
      setConsoleLog((prev) => [...prev, `  [CI] ${CI_LABELS[stage]}…`]);
      await delay(700);
      setCiStageStatus((prev) => ({...prev, [stage]: 'done'}));
    }

    const pending = testCases.filter((t) => t.status === 'pending');
    for (const tc of pending.length ? pending : testCases) {
      if (tc.status !== 'pending' && pending.length === 0) continue;
      await runSingleTest(tc, {fromSuite: true});
      await delay(300);
    }

    setRunningId(null);
    setCiStage(null);
    setSuiteRunning(false);
    setConsoleLog((prev) => [...prev, '✓ Pipeline finished']);
  }, [runningId, suiteRunning, testCases, runSingleTest]);

  const resetTests = useCallback(() => {
    runAbort.current = true;
    setTestCases(INITIAL_TEST_CASES);
    setBugs(INITIAL_BUGS);
    setRunningId(null);
    setSuiteRunning(false);
    setCiStage(null);
    setCiStageStatus({});
    setConsoleLog([]);
    setCurrentStep(-1);
  }, []);

  const advanceBug = useCallback((bugId) => {
    setBugs((prev) =>
      prev.map((b) => {
        if (b.id !== bugId) return b;
        const idx = BUG_STAGES.indexOf(b.status);
        if (idx < 0 || idx >= BUG_STAGES.length - 1) return b;
        return {...b, status: BUG_STAGES[idx + 1]};
      }),
    );
  }, []);

  const selectedLevelData = TEST_LEVELS.find((l) => l.id === selectedLevel);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Основы тестирования ПО"
        subtitle="Уровни, типы, test cases, баг-трекинг и метрики качества — попробуйте запустить тесты и продвинуть баг по жизненному циклу"
      >
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statValuePass}>
              {metrics.passed}/{metrics.total}
            </div>
            <p className={styles.statLabel}>Пройдено</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValueFail}>{metrics.failed}</div>
            <p className={styles.statLabel}>Провалено</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValueInfo}>{metrics.pending}</div>
            <p className={styles.statLabel}>Ожидает</p>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValueInfo}>{bugs.length}</div>
            <p className={styles.statLabel}>Багов</p>
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={toolStyles.chips}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={clsx(toolStyles.chip, activeTab === tab.id && toolStyles.chipActive)}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'levels' && (
          <div className={styles.panel}>
            <div className={styles.pyramidWrap}>
              <p className={styles.pyramidTitle}>Пирамида тестирования — клик по уровню</p>
              <div className={styles.pyramid}>
                {PYRAMID_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    type="button"
                    className={clsx(styles.pyramidLayer, selectedPyramid === layer.levelId && styles.pyramidLayerActive)}
                    style={{'--layer-width': layer.width, background: layer.color}}
                    onClick={() => {
                      setSelectedPyramid(layer.levelId);
                      setSelectedLevel(layer.levelId === 'system' ? 'system' : layer.levelId);
                    }}
                  >
                    {layer.name} ({layer.percent}%)
                  </button>
                ))}
              </div>
              <p className={styles.pyramidHint}>
                Чем выше уровень, тем меньше тестов, но выше стоимость поддержки
              </p>
            </div>

            <div className={styles.levelGrid}>
              {TEST_LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  className={clsx(styles.levelCard, selectedLevel === level.id && styles.levelCardActive)}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  <div className={styles.levelIcon}>{level.icon}</div>
                  <p className={styles.levelName} style={{color: level.color}}>
                    {level.level}
                  </p>
                  <p className={styles.levelDesc}>{level.description}</p>
                  {selectedLevel === level.id && (
                    <>
                      <p className={styles.levelMeta}>
                        <strong>Инструменты:</strong> {level.tools}
                      </p>
                      <p className={styles.levelMeta}>
                        <strong>Кто:</strong> {level.who}
                      </p>
                      <p className={styles.levelMeta}>
                        <strong>Когда:</strong> {level.when}
                      </p>
                      <div className={styles.levelExample}>Пример: {level.example}</div>
                    </>
                  )}
                </button>
              ))}
            </div>
            {selectedLevelData && (
              <p className="it-demo__alert it-demo__alert--info" style={{marginTop: '0.75rem'}}>
                Выбрано: <strong>{selectedLevelData.level}</strong> — {selectedLevelData.description}
              </p>
            )}
          </div>
        )}

        {activeTab === 'types' && (
          <div className={styles.panel}>
            <div className={styles.typeGrid}>
              {TEST_TYPES.map((type) => (
                <div key={type.name} className={styles.typeCard}>
                  <div className={styles.typeIcon}>{type.icon}</div>
                  <p className={styles.typeName}>{type.name}</p>
                  <p className={styles.typeDesc}>{type.desc}</p>
                </div>
              ))}
            </div>

            <BoundaryDemo />

            <p style={{margin: '0 0 0.65rem', fontWeight: 700, fontSize: '0.95rem'}}>Техники тест-дизайна</p>
            <div className={styles.techGrid}>
              {TEST_DESIGN.map((tech) => (
                <div key={tech.name} className={styles.techCard}>
                  <p className={styles.techName}>{tech.name}</p>
                  <p className={styles.techDesc}>{tech.desc}</p>
                  <p className={styles.techExample}>Пример: {tech.example}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testcases' && (
          <div className={styles.panel}>
            <div className={styles.suiteToolbar}>
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                disabled={!!runningId || suiteRunning}
                onClick={runSuite}
              >
                {suiteRunning ? 'CI pipeline…' : '▶ Запустить CI suite'}
              </button>
              <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetTests}>
                Сбросить
              </button>
            </div>

            {(suiteRunning || Object.keys(ciStageStatus).length > 0) && (
              <div className={styles.ciPipeline} aria-label="CI pipeline">
                {CI_STAGES.map((stage, idx) => (
                  <React.Fragment key={stage}>
                    <span
                      className={clsx(
                        styles.ciStage,
                        ciStage === stage && ciStageStatus[stage] === 'active' && styles.ciStageActive,
                        ciStageStatus[stage] === 'done' && styles.ciStageDone,
                        ciStageStatus[stage] === 'fail' && styles.ciStageFail,
                      )}
                    >
                      {CI_LABELS[stage]}
                    </span>
                    {idx < CI_STAGES.length - 1 && <span className={styles.ciArrow}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {consoleLog.length > 0 && (
              <div ref={consoleRef} className={styles.console} aria-live="polite">
                {consoleLog.map((line, i) => (
                  <p
                    key={`${i}-${line.slice(0, 20)}`}
                    className={clsx(
                      styles.consoleLine,
                      line.includes('PASS') && styles.consolePass,
                      line.includes('FAIL') && styles.consoleFail,
                    )}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )}

            <div className={styles.testGrid}>
              {testCases.map((testCase) => {
                const isRunning = runningId === testCase.id;
                return (
                  <div
                    key={testCase.id}
                    className={clsx(
                      styles.testCard,
                      testCase.status === 'passed' && styles.testCardPass,
                      testCase.status === 'failed' && styles.testCardFail,
                      isRunning && styles.testCardRunning,
                    )}
                  >
                    <div className={styles.testHeader}>
                      <p className={styles.testName}>{testCase.name}</p>
                      <span
                        className={
                          testCase.type === 'Нагрузочное' ? styles.badgeLoad : styles.badgeFunctional
                        }
                      >
                        {testCase.type}
                      </span>
                    </div>

                    <p style={{margin: '0 0 0.35rem', fontSize: '0.8rem', fontWeight: 600}}>Шаги:</p>
                    <ol className={styles.stepList}>
                      {testCase.steps.map((step, idx) => (
                        <li
                          key={step}
                          className={clsx(
                            isRunning && idx < currentStep && styles.stepDone,
                            isRunning && idx === currentStep && styles.stepCurrent,
                            isRunning && idx > currentStep && styles.stepPending,
                          )}
                        >
                          {step}
                        </li>
                      ))}
                    </ol>

                    <p style={{margin: 0, fontSize: '0.82rem'}}>
                      <strong>Ожидаемый:</strong> {testCase.expectedResult}
                    </p>
                    {testCase.actualResult && (
                      <p style={{margin: '0.5rem 0 0', fontSize: '0.82rem', padding: '0.5rem', background: 'var(--ifm-code-background)', borderRadius: 6}}>
                        <strong>Фактический:</strong> {testCase.actualResult}
                      </p>
                    )}

                    <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center'}}>
                      <button
                        type="button"
                        className={clsx(
                          'it-demo__btn',
                          testCase.status === 'failed' ? 'it-demo__btn--danger' : 'it-demo__btn--primary',
                        )}
                        style={{flex: 1}}
                        disabled={!!runningId || suiteRunning || testCase.status !== 'pending'}
                        onClick={() => runSingleTest(testCase)}
                      >
                        {isRunning
                          ? `Шаг ${currentStep + 1}/${testCase.steps.length}…`
                          : testCase.status === 'passed'
                            ? '✓ Пройден'
                            : testCase.status === 'failed'
                              ? '✗ Провален'
                              : '▶ Запустить'}
                      </button>
                      {testCase.automation && (
                        <span className={styles.testBadge} style={{background: 'color-mix(in srgb, var(--test-unit) 18%, transparent)', color: 'var(--test-unit)'}}>
                          auto
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'bugs' && (
          <div className={styles.panel}>
            <div className={styles.lifecycle} aria-hidden="true">
              {BUG_STAGES.map((stage) => (
                <span key={stage} className={styles.lifecycleStage}>
                  {stage}
                </span>
              ))}
            </div>

            <div className={styles.bugList}>
              {bugs.map((bug) => {
                const stageIdx = BUG_STAGES.indexOf(bug.status);
                return (
                  <button
                    key={bug.id}
                    type="button"
                    className={styles.bugCard}
                    onClick={() => advanceBug(bug.id)}
                    title="Клик — следующий этап жизненного цикла"
                  >
                    <div className={styles.bugCardHeader}>
                      <div>
                        <p className={styles.bugTitle}>{bug.title}</p>
                        <p className={styles.bugId}>BUG-{String(bug.id).padStart(3, '0')}</p>
                      </div>
                      <span className={styles.bugTag} style={severityStyle(bug.severity)}>
                        {bug.severity}
                      </span>
                    </div>
                    <div className={styles.bugTags}>
                      <span className={styles.bugTag} style={statusStyle(bug.status)}>
                        {bug.status}
                      </span>
                      <span className={styles.bugTag} style={statusStyle('Open')}>
                        Приоритет: {bug.priority}
                      </span>
                    </div>
                    <div className={styles.lifecycle} style={{margin: 0, justifyContent: 'flex-start'}}>
                      {BUG_STAGES.map((stage, idx) => (
                        <span
                          key={stage}
                          className={clsx(
                            styles.lifecycleStage,
                            idx <= stageIdx && styles.lifecycleStageActive,
                          )}
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className={styles.bugHint}>Клик по карточке бага продвигает его по жизненному циклу</p>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className={styles.panel}>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <div
                  className={styles.donut}
                  style={{
                    background: `conic-gradient(var(--test-unit) ${passPct}%, var(--demo-border) 0)`,
                  }}
                >
                  {passPct}%
                </div>
                <p className={styles.statLabel}>Pass rate</p>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricBig} style={{color: 'var(--test-unit)'}}>
                  {metrics.passed}/{metrics.total}
                </p>
                <p className={styles.statLabel}>Пройдено тестов</p>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{width: `${passPct}%`, background: 'var(--test-unit)'}}
                  />
                </div>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricBig} style={{color: 'var(--demo-error)'}}>
                  {metrics.failed}
                </p>
                <p className={styles.statLabel}>Провалено</p>
              </div>
              <div className={styles.metricCard}>
                <p className={styles.metricBig} style={{color: 'var(--ifm-color-primary)'}}>
                  {metrics.automationRate}%
                </p>
                <p className={styles.statLabel}>Автоматизация</p>
              </div>
            </div>

            <p style={{margin: '0 0 0.65rem', fontWeight: 700, fontSize: '0.95rem'}}>Ключевые метрики качества</p>
            <div className={styles.qualityList}>
              {QUALITY_METRICS.map((m) => (
                <div key={m.name} className={styles.qualityRow}>
                  <p className={styles.qualityName}>{m.name}</p>
                  <span className={styles.qualityValue}>
                    {m.value}
                    {m.unit}
                  </span>
                  <p className={styles.qualityDesc}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.bestPractices}>
          <p className={styles.bestTitle}>Лучшие практики тестирования</p>
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

export default TestingBasicsDemoInner;
