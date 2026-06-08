import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CodeRunPlacePlay.module.css';

const SCENARIOS = [
  {
    id: 'static',
    label: 'Только HTML+CSS+JS',
    steps: [
      {
        active: ['browser'],
        packet: null,
        label: 'Открыли index.html в браузере',
        detail: 'Файл лежит на диске или пришёл с сервера как готовый HTML. PHP и Python не участвуют.',
        browserCode: '<h1>Привет</h1>\n<style>h1{color:blue}</style>',
        serverCode: null,
      },
      {
        active: ['browser'],
        packet: null,
        label: 'JavaScript меняет страницу',
        detail: 'Скрипт выполняется в браузере. Сервер в этот момент "молчит".',
        browserCode: "document.querySelector('h1').textContent = 'Клик!';",
        serverCode: null,
      },
    ],
  },
  {
    id: 'php',
    label: 'Страница с PHP',
    steps: [
      {
        active: ['browser'],
        packet: 'request',
        label: 'Браузер: GET /index.php',
        detail: 'Пользователь вводит адрес — уходит HTTP-запрос на сервер.',
        browserCode: 'Адресная строка: site.ru/index.php',
        serverCode: null,
      },
      {
        active: ['server'],
        packet: 'work',
        label: 'Сервер выполняет PHP',
        detail: 'Интерпретатор PHP читает файл, подставляет имя из запроса, собирает HTML.',
        browserCode: null,
        serverCode: '<?php\n$name = $_GET["name"] ?? "Гость";\necho "<h1>Привет, $name</h1>";\n?>',
      },
      {
        active: ['browser'],
        packet: 'response',
        label: 'Браузер получает готовый HTML',
        detail: 'Исходный PHP пользователь не видит — только результат echo.',
        browserCode: '<h1>Привет, Аня</h1>',
        serverCode: null,
      },
    ],
  },
  {
    id: 'python',
    label: 'Python на сервере (API)',
    steps: [
      {
        active: ['browser'],
        packet: 'request',
        label: 'JS в браузере: fetch("/api/score")',
        detail: 'Страница уже загружена; JavaScript запрашивает данные без перезагрузки.',
        browserCode: "fetch('/api/score')\n  .then(r => r.json())",
        serverCode: null,
      },
      {
        active: ['server'],
        packet: 'work',
        label: 'Python (Flask/Django) обрабатывает запрос',
        detail: 'Сервер считает ответ и отдаёт JSON — не HTML-страницу целиком.',
        browserCode: null,
        serverCode: '@app.get("/api/score")\ndef score():\n    return {"points": 42}',
      },
      {
        active: ['browser'],
        packet: 'response',
        label: 'JS обновляет цифру на экране',
        detail: 'Типичная связка: Python на бэкенде, JavaScript на фронте.',
        browserCode: 'el.textContent = data.points;',
        serverCode: null,
      },
    ],
  },
];

export function CodeRunPlacePlayInner({embedded = false}) {
  const [scenarioId, setScenarioId] = useState('static');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];
  const step = scenario.steps[stepIdx] ?? scenario.steps[0];

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
    clearTimers();
  }, [scenarioId, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const play = () => {
    clearTimers();
    setPlaying(true);
    setStepIdx(0);
    const delays = scenario.steps.map((_, i) => (i === 0 ? 0 : 2200));
    let acc = 0;
    scenario.steps.forEach((_, i) => {
      acc += i === 0 ? 0 : 2200;
      schedule(() => setStepIdx(i), acc);
    });
    schedule(() => setPlaying(false), acc + 2200);
  };

  const browserOn = step.active.includes('browser');
  const serverOn = step.active.includes('server');

  const body = (
    <>
        <div className={styles.scenarioBar}>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                'it-demo__btn it-demo__btn--sm',
                scenarioId !== s.id && 'it-demo__btn--secondary',
              )}
              onClick={() => setScenarioId(s.id)}
              disabled={playing}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.stage}>
          <div
            className={clsx(styles.zone, styles.zoneBrowser, browserOn && styles.zoneActive)}
            aria-current={browserOn ? 'step' : undefined}
          >
            <div className={styles.zoneHead}>
              <span aria-hidden>🌐</span> Браузер
            </div>
            <ul className={styles.zoneList}>
              <li>HTML, CSS</li>
              <li>JavaScript</li>
            </ul>
            {step.browserCode && <pre className={styles.codeMini}>{step.browserCode}</pre>}
          </div>

          <div className={styles.arrowCol}>
            {step.packet && <span className={styles.packet}>{step.packet}</span>}
            <span aria-hidden>{step.packet === 'request' ? '→' : step.packet === 'response' ? '←' : '↔'}</span>
          </div>

          <div
            className={clsx(styles.zone, styles.zoneServer, serverOn && styles.zoneActive)}
            aria-current={serverOn ? 'step' : undefined}
          >
            <div className={styles.zoneHead}>
              <span aria-hidden>🖥️</span> Сервер
            </div>
            <ul className={styles.zoneList}>
              <li>PHP (страницы)</li>
              <li>Python (API, скрипты)</li>
            </ul>
            {step.serverCode && <pre className={styles.codeMini}>{step.serverCode}</pre>}
          </div>
        </div>

        <p className={styles.stepLabel}>
          <strong>
            Шаг {stepIdx + 1}/{scenario.steps.length}:
          </strong>{' '}
          {step.label} — {step.detail}
        </p>

        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={clsx(styles.dot, styles.dotClient)} /> в браузере
          </span>
          <span className={styles.legendItem}>
            <span className={clsx(styles.dot, styles.dotServer)} /> на сервере
          </span>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={play}
            disabled={playing}
          >
            {playing ? 'Показ…' : 'Проиграть сценарий'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={playing || stepIdx <= 0}
            onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={playing || stepIdx >= scenario.steps.length - 1}
            onClick={() => setStepIdx((i) => Math.min(scenario.steps.length - 1, i + 1))}
          >
            Вперёд →
          </button>
        </div>
    </>
  );

  if (embedded) {
    return <div className={styles.root}>{body}</div>;
  }

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Где выполняется код"
        subtitle="Браузер и сервер: HTML, JavaScript, PHP и Python"
      >
        {body}
      </DemoCard>
    </DemoShell>
  );
}

export default CodeRunPlacePlayInner;
