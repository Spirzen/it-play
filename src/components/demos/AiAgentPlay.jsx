import React, {useCallback, useEffect, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AiAgentPlay.module.css';

const HUB_VIEWS = [
  {id: 'loop', label: 'Цикл агента'},
  {id: 'arch', label: 'Архитектура'},
  {id: 'compare', label: 'Чат vs агент'},
  {id: 'levels', label: 'Уровни 0–2'},
  {id: 'multi', label: 'Мультиагенты'},
];

const SCENARIOS = {
  coffee: {
    id: 'coffee',
    label: 'Кофейня между офисами',
    mission: 'Найди уютную кофейню на полпути между офисом на Тверской и офисом на Арбате (рейтинг ≥ 4.0).',
    steps: [
      {
        phase: 'think',
        title: 'Планирование',
        body: 'Разбить задачу: геокод → середина маршрута → поиск заведений → сравнение отзывов.',
        context: 'Цель: кофейня, midpoint, Wi‑Fi, рейтинг ≥ 4.0',
        tool: null,
      },
      {
        phase: 'act',
        title: 'Действие: geocode',
        body: 'Вызов инструмента geocode("Тверская 12") и geocode("Арбат 10").',
        context: 'Цель + план из 4 шагов',
        tool: 'geocode(address) × 2',
      },
      {
        phase: 'observe',
        title: 'Наблюдение',
        body: 'Получены координаты: (55.76, 37.61) и (55.75, 37.59). Добавлено в контекст сессии.',
        context: '+ coords офисов',
        tool: null,
      },
      {
        phase: 'think',
        title: 'Следующий шаг',
        body: 'Вычислить midpoint, сформировать запрос places_search с фильтром rating≥4.',
        context: '+ coords, midpoint вычислен',
        tool: null,
      },
      {
        phase: 'act',
        title: 'Действие: places_search',
        body: 'places_search(lat=55.755, lng=37.60, query="кофейня", min_rating=4)',
        context: '+ midpoint район Арбат',
        tool: 'places_search(...)',
      },
      {
        phase: 'observe',
        title: 'Наблюдение',
        body: '3 кандидата: "Буфет", "Double B", "Кофемания". Отзывы и Wi‑Fi в ответе API.',
        context: '+ 3 заведения с метаданными',
        tool: null,
      },
      {
        phase: 'think',
        title: 'Синтез ответа',
        body: 'Сравнить по отзывам и цене. Рекомендовать Double B — рейтинг 4.6, Wi‑Fi, тихий зал.',
        context: 'Полный контекст миссии',
        tool: null,
      },
      {
        phase: 'act',
        title: 'Ответ пользователю',
        body: 'Финальный текст + опционально ask_for_confirmation() перед бронированием.',
        context: 'Миссия выполнена',
        tool: 'respond(user)',
        guard: 'ok',
      },
    ],
  },
  code: {
    id: 'code',
    label: 'Агент в IDE (как Cursor)',
    mission: 'Создай минимальный Java-проект HelloWorld: pom.xml, Main.java, собери и запусти.',
    steps: [
      {
        phase: 'think',
        title: 'План',
        body: '1) Проверить cwd 2) write_file pom.xml 3) write_file Main.java 4) run mvn package 5) java -jar',
        context: 'Цель: runnable HelloWorld',
        tool: null,
      },
      {
        phase: 'act',
        title: 'list_dir + read',
        body: 'list_dir(".") — папка пуста, можно создавать с нуля.',
        context: 'План из 5 шагов',
        tool: 'list_dir(".")',
      },
      {
        phase: 'observe',
        title: 'Наблюдение',
        body: '[] — файлов нет. Контекст обновлён.',
        context: '+ cwd пуст',
        tool: null,
      },
      {
        phase: 'act',
        title: 'write_file',
        body: 'Создан pom.xml и src/main/java/Main.java с public static void main.',
        context: '+ 2 файла созданы',
        tool: 'write_file × 2',
      },
      {
        phase: 'observe',
        title: 'Наблюдение',
        body: 'Файлы на диске. Linter: OK.',
        context: '+ структура проекта',
        tool: null,
      },
      {
        phase: 'think',
        title: 'Сборка',
        body: 'Запустить mvn -q package в sandbox с таймаутом 120s.',
        context: 'Исходники готовы',
        tool: null,
      },
      {
        phase: 'act',
        title: 'run_terminal',
        body: 'mvn -q package && java -cp target/classes Main',
        context: 'Сборка…',
        tool: 'run_terminal(cmd)',
      },
      {
        phase: 'observe',
        title: 'Готово',
        body: 'stdout: Hello, World! Агент сообщает пользователю об успехе.',
        context: 'Миссия ✓',
        tool: null,
        guard: 'ok',
      },
    ],
  },
};

const ARCH_BLOCKS = [
  {
    id: 'llm',
    icon: '🧠',
    title: 'Модель (LLM)',
    short: 'Мозг',
    desc: 'Интерпретирует цель, строит план, выбирает инструменты и параметры. Не выполняет действия сама — только рассуждает.',
  },
  {
    id: 'tools',
    icon: '🛠',
    title: 'Инструменты',
    short: 'Руки',
    desc: 'API, RAG, терминал, UI-автоматизация. Контракт: название, сигнатура, семантическое описание для модели.',
  },
  {
    id: 'orch',
    icon: '⚙️',
    title: 'Оркестрация',
    short: 'Нервная система',
    desc: 'Цикл Think–Act–Observe, состояние сессии, guardrails, трассировка OpenTelemetry, HITL.',
  },
];

const LEVELS = [
  {
    level: 0,
    name: 'Reasoning-only',
    question: 'Кто забил победный гол в матче "Зенита" вчера?',
    answer:
      'Модель отвечает из обучающих данных или признаёт незнание. Без интернета и API факт "вчера" недоступен — возможна галлюцинация.',
    hasTools: false,
  },
  {
    level: 1,
    name: 'Connected solver',
    question: 'Кто забил победный гол в матче "Зенита" вчера?',
    answer:
      'Агент вызывает web_search("Зенит матч вчера гол") → получает "Артём Дзюба, 87‑я минута" → формирует ответ на основе факта.',
    hasTools: true,
  },
  {
    level: 2,
    name: 'Strategic planner',
    question: 'Найди кофейню между двумя офисами с Wi‑Fi.',
    answer:
      'Многошаговый план: геокод → midpoint → поиск → анализ отзывов → сравнение. План перестраивается при ошибке API.',
    hasTools: true,
    multiStep: true,
  },
];

const MULTI_PATTERNS = [
  {
    id: 'manager',
    name: 'Координатор–исполнители',
    flow: 'PM-агент → MarketResearch + WebDev + Legal → сбор результатов → решение о следующем шаге',
  },
  {
    id: 'pipeline',
    name: 'Последовательный конвейер',
    flow: 'Extractor → Validator → ReportGen → Reviewer (строго по порядку)',
  },
  {
    id: 'refine',
    name: 'Итеративное уточнение',
    flow: 'Generator ↔ Critic (цикл до порога качества или лимита итераций)',
  },
  {
    id: 'hitl',
    name: 'Human-in-the-loop',
    flow: 'Риск/неоднозначность → ask_for_confirmation() → пауза до ответа человека',
  },
];

function phaseClass(phase) {
  if (phase === 'think') return styles.loopNodeThink;
  if (phase === 'act') return styles.loopNodeAct;
  return styles.loopNodeObserve;
}

function AiAgentLoopPanel() {
  const [scenarioId, setScenarioId] = useState('coffee');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const steps = scenario.steps;
  const current = steps[step];
  const contextHistory = useMemo(
    () => steps.slice(0, step + 1).map((s) => s.context).filter(Boolean),
    [steps, step],
  );

  const advance = useCallback(() => {
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }, [steps.length]);

  const reset = useCallback(() => {
    setStep(0);
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return undefined;
    if (step >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const t = window.setTimeout(advance, 2200);
    return () => window.clearTimeout(t);
  }, [playing, step, steps.length, advance]);

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [scenarioId]);

  return (
    <>
      <p className={styles.mission}>
        <strong>Миссия:</strong> {scenario.mission}
      </p>
      <div className={styles.scenarioTabs}>
        {Object.values(SCENARIOS).map((s) => (
          <button
            key={s.id}
            type="button"
            className={clsx(styles.scenarioTab, scenarioId === s.id && styles.scenarioTabActive)}
            onClick={() => setScenarioId(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.loop}>
        {['think', 'act', 'observe'].map((ph) => (
          <div
            key={ph}
            className={clsx(
              styles.loopNode,
              phaseClass(ph),
              current?.phase === ph && styles.loopNodeOn,
            )}
          >
            <span className={styles.loopLabel}>{ph}</span>
            <p className={styles.loopTitle}>
              {ph === 'think' ? 'Думай' : ph === 'act' ? 'Действуй' : 'Наблюдай'}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.progress}>
        {steps.map((_, i) => (
          <span
            key={i}
            className={clsx(
              styles.progressDot,
              i < step && styles.progressDotDone,
              i === step && styles.progressDotCurrent,
            )}
            title={`Шаг ${i + 1}`}
          />
        ))}
      </div>

      <div className={styles.stepDetail}>
        <strong>
          Шаг {step + 1}/{steps.length}: {current?.title}
        </strong>
        <p style={{margin: '0.35rem 0 0', fontSize: '0.85rem'}}>{current?.body}</p>
        {current?.tool && (
          <pre>{`→ ${current.tool}`}</pre>
        )}
        {current?.guard === 'ok' && (
          <p className={styles.guardOk}>✓ Guardrail: вызов прошёл валидацию политики</p>
        )}
      </div>

      <div className={styles.split}>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Контекст сессии</p>
          {contextHistory.length === 0 ? (
            <span className={styles.hint}>Пусто — первый think</span>
          ) : (
            contextHistory.map((line, i) => (
              <div key={i} className={styles.contextLine}>
                {line}
              </div>
            ))
          )}
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Активные инструменты</p>
          {steps.slice(0, step + 1)
            .filter((s) => s.tool)
            .map((s, i) => (
              <div key={i} className={styles.toolCall}>
                <code>{s.tool}</code>
              </div>
            ))}
          {!steps.slice(0, step + 1).some((s) => s.tool) && (
            <span className={styles.hint}>Пока только рассуждение</span>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          onClick={advance}
          disabled={step >= steps.length - 1}
        >
          Следующий шаг
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--secondary"
          onClick={() => setPlaying(true)}
          disabled={playing || step >= steps.length - 1}
        >
          Авто-прогон
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
          Сброс
        </button>
      </div>
      <p className={styles.hint}>
        Оркестратор крутит цикл, пока миссия не закрыта или не сработает лимит шагов / HITL.
      </p>
    </>
  );
}

function AiAgentArchPanel() {
  const [active, setActive] = useState('llm');
  const block = ARCH_BLOCKS.find((b) => b.id === active) ?? ARCH_BLOCKS[0];

  return (
    <>
      <div className={styles.arch}>
        {ARCH_BLOCKS.map((b, i) => (
          <React.Fragment key={b.id}>
            <button
              type="button"
              className={clsx(styles.archBlock, active === b.id && styles.archBlockActive)}
              onClick={() => setActive(b.id)}
            >
              <span className={styles.archIcon}>{b.icon}</span>
              <strong>{b.title}</strong>
              <br />
              <small>{b.short}</small>
            </button>
            {i < ARCH_BLOCKS.length - 1 && <span className={styles.archArrow}>↔</span>}
          </React.Fragment>
        ))}
      </div>
      <p className={styles.archDesc}>{block.desc}</p>
      <p className={styles.hint}>
        LLM ≠ агент. Агент — приложение, где модель, инструменты и оркестратор связаны циклом Think–Act–Observe.
      </p>
    </>
  );
}

function AiAgentComparePanel() {
  return (
    <div className={styles.compare}>
      <div className={clsx(styles.compareCol, styles.compareChat)}>
        <h5>Чат-бот (пассивная LLM)</h5>
        <ul>
          <li>Один запрос → один ответ</li>
          <li>Нет доступа к файлам, API, терминалу</li>
          <li>Не планирует и не действует сам</li>
          <li>Пример: веб-чат DeepSeek без Agent mode</li>
        </ul>
      </div>
      <div className={clsx(styles.compareCol, styles.compareAgent)}>
        <h5>ИИ-агент</h5>
        <ul>
          <li>Цель высокого уровня → план → шаги</li>
          <li>Инструменты: поиск, код, мессенджеры</li>
          <li>Цикл думай–действуй–наблюдай до результата</li>
          <li>Пример: Cursor Agent, Claude Code</li>
        </ul>
      </div>
    </div>
  );
}

function AiAgentLevelsPanel() {
  const [level, setLevel] = useState(1);
  const current = LEVELS.find((l) => l.level === level) ?? LEVELS[1];

  return (
    <>
      <div className={styles.levels}>
        {LEVELS.map((l) => (
          <button
            key={l.level}
            type="button"
            className={clsx(styles.levelCard, level === l.level && styles.levelCardActive)}
            onClick={() => setLevel(l.level)}
          >
            <span className={styles.levelBadge}>L{l.level}</span>
            <strong>{l.name}</strong>
            {l.hasTools && <span> — есть инструменты</span>}
            {l.multiStep && <span> — многошаговый план</span>}
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        <strong>Вопрос:</strong> {current.question}
      </p>
      <div className={styles.levelAnswer}>{current.answer}</div>
    </>
  );
}

function AiAgentMultiPanel() {
  const [patternId, setPatternId] = useState('manager');
  const pattern = MULTI_PATTERNS.find((p) => p.id === patternId) ?? MULTI_PATTERNS[0];

  return (
    <>
      <div className={styles.multiGrid}>
        {MULTI_PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={clsx(styles.multiCard, patternId === p.id && styles.multiCardActive)}
            onClick={() => setPatternId(p.id)}
          >
            <strong>{p.name}</strong>
          </button>
        ))}
      </div>
      <p className={styles.multiFlow}>{pattern.flow}</p>
      <p className={styles.hint}>
        Сложные задачи делят между специализированными агентами; координатор — узкое место, конвейер — проще аудит.
      </p>
    </>
  );
}

function AiAgentPlayInner() {
  const [view, setView] = useState('loop');

  const subtitles = {
    loop: 'Пошаговая симуляция Think–Act–Observe на реальных сценариях',
    arch: 'Три столпа агента: модель, инструменты, оркестрация',
    compare: 'Почему чат в браузере — не то же самое, что агент в IDE',
    levels: 'Таксономия Google: от изолированной LLM до стратегического планировщика',
    multi: 'Шаблоны мультиагентных систем из статьи',
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="ИИ-агенты — интерактив" subtitle={subtitles[view]}>
        <div className={styles.hubTabs}>
          {HUB_VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={clsx(styles.hubTab, view === v.id && styles.hubTabActive)}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
        {view === 'loop' && <AiAgentLoopPanel />}
        {view === 'arch' && <AiAgentArchPanel />}
        {view === 'compare' && <AiAgentComparePanel />}
        {view === 'levels' && <AiAgentLevelsPanel />}
        {view === 'multi' && <AiAgentMultiPanel />}
      </DemoCard>
    </DemoShell>
  );
}

export default AiAgentPlayInner;
