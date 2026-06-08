import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/VonNeumannArchitecturePlay.module.css';

/** Упрощённая "память" — программа и данные в одном адресном пространстве */
const MEMORY = [
  {addr: '0x00', value: 'LOAD A, [0x03]', kind: 'code', label: 'инструкция'},
  {addr: '0x01', value: 'ADD  A, [0x04]', kind: 'code', label: 'инструкция'},
  {addr: '0x02', value: 'STORE A, [0x05]', kind: 'code', label: 'инструкция'},
  {addr: '0x03', value: '5', kind: 'data', label: 'данные'},
  {addr: '0x04', value: '3', kind: 'data', label: 'данные'},
  {addr: '0x05', value: '—', kind: 'data', label: 'результат'},
];

const SCENARIOS = [
  {
    id: 'fetch',
    title: 'Цикл "выборка — выполнение"',
    short: 'Fetch',
    subtitle: 'Процессор последовательно читает команды из памяти по счётчику команд (PC)',
    steps: [
      {
        spotlight: ['cu', 'pc'],
        busFlow: null,
        highlightAddr: '0x00',
        pc: '0x00',
        label: 'PC указывает адрес следующей команды',
        detail: 'Устройство управления смотрит в счётчик команд: сейчас 0x00',
      },
      {
        spotlight: ['bus', 'memory'],
        busFlow: 'read',
        highlightAddr: '0x00',
        pc: '0x00',
        label: 'Выборка (Fetch)',
        detail: 'По системной шине из ячейки 0x00 в CPU попадает LOAD A, [0x03]',
      },
      {
        spotlight: ['cu'],
        busFlow: null,
        highlightAddr: '0x00',
        pc: '0x00',
        label: 'Декодирование (Decode)',
        detail: 'УУ определяет: загрузить значение из адреса 0x03 в регистр A',
      },
      {
        spotlight: ['alu', 'bus', 'memory'],
        busFlow: 'read',
        highlightAddr: '0x03',
        pc: '0x00',
        label: 'Выполнение (Execute)',
        detail: 'АЛУ не считает — но операнд 5 читается из памяти по той же шине',
      },
      {
        spotlight: ['pc', 'cu'],
        busFlow: null,
        highlightAddr: null,
        pc: '0x01',
        label: 'PC → 0x01',
        detail: 'Счётчик команд увеличен; следующая выборка — ADD A, [0x04]',
      },
    ],
  },
  {
    id: 'unified',
    title: 'Единое адресное пространство',
    short: 'Память',
    subtitle: 'Код и данные — те же ячейки; процессор не различает их "по смыслу"',
    steps: [
      {
        spotlight: ['memory'],
        busFlow: null,
        highlightAddr: '0x00',
        pc: '—',
        label: 'Одна память для всего',
        detail: 'Адреса 0x00–0x02 хранят команды, 0x03–0x05 — числа. Формат один: биты',
      },
      {
        spotlight: ['memory', 'alu'],
        busFlow: 'write',
        highlightAddr: '0x05',
        pc: '—',
        label: 'Запись результата',
        detail: 'После ADD в ячейку 0x05 записывается 8 — это обычная запись данных',
      },
      {
        spotlight: ['memory', 'cu'],
        busFlow: 'read',
        highlightAddr: '0x03',
        pc: '—',
        label: 'Теоретически байты 0x03 можно исполнить',
        detail: 'Если передать управление на адрес данных — CPU попытается их декодировать как код',
      },
    ],
  },
  {
    id: 'io',
    title: 'Ввод и вывод',
    short: 'I/O',
    subtitle: 'Периферия обменивается с CPU через ту же шину и память',
    steps: [
      {
        spotlight: ['io', 'bus'],
        busFlow: 'in',
        highlightAddr: null,
        pc: '—',
        label: 'Устройство ввода',
        detail: 'Клавиатура кладёт байт "7" на шину — контроллер прерывает CPU',
      },
      {
        spotlight: ['cu', 'bus', 'memory'],
        busFlow: 'write',
        highlightAddr: '0x04',
        pc: '—',
        label: 'CPU сохраняет в память',
        detail: 'УУ инициирует запись: в ячейку 0x04 вместо 3 теперь 7 (пример)',
      },
      {
        spotlight: ['alu', 'memory'],
        busFlow: 'read',
        highlightAddr: '0x03',
        pc: '—',
        label: 'Обработка',
        detail: 'ADD складывает 5 + 7; результат снова в регистре A',
      },
      {
        spotlight: ['io', 'bus'],
        busFlow: 'out',
        highlightAddr: '0x05',
        pc: '—',
        label: 'Вывод на экран',
        detail: 'Итог 12 уходит по шине на устройство вывода — монитор показывает число',
      },
    ],
  },
];

function VonNeumannArchitecturePlayInner() {
  const [scenarioId, setScenarioId] = useState('fetch');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [busFlow, setBusFlow] = useState(null);
  const [highlightAddr, setHighlightAddr] = useState(null);
  const [pc, setPc] = useState('0x00');
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
    setBusFlow(null);
    setHighlightAddr(null);
    setPc('0x00');
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setBusFlow(step.busFlow ?? null);
      setHighlightAddr(step.highlightAddr ?? null);
      setPc(step.pc ?? '—');
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
        schedule(() => run(i + 1), 2800);
      } else {
        schedule(() => setPlaying(false), 2800);
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

  const isActive = (id) => spotlight.includes(id);

  const memoryDisplay = MEMORY.map((cell) => {
    if (scenarioId === 'io' && cell.addr === '0x04' && highlightAddr === '0x04') {
      return {...cell, value: '7', note: 'обновлено с клавиатуры'};
    }
    if (scenarioId === 'unified' && cell.addr === '0x05' && highlightAddr === '0x05') {
      return {...cell, value: '8', note: '5 + 3'};
    }
    return cell;
  });

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура фон Неймана"
        subtitle="CPU, единая память, ввод-вывод и системная шина — три сценария"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии архитектуры">
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
              {s.short}
            </button>
          ))}
        </div>

        <p className={styles.scenarioHint}>
          <strong>{scenario.title}</strong> — {scenario.subtitle}
        </p>

        <div className={styles.diagram} aria-label="Схема фон Неймана">
          <section className={clsx(styles.zone, styles.zoneCpu, isActive('cu') && styles.zoneActive)}>
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>⚙️</span>
              <span className={styles.zoneLabel}>Центральный процессор</span>
            </header>
            <div className={styles.cpuInner}>
              <div
                className={clsx(styles.cpuBlock, isActive('alu') && styles.blockActive)}
                aria-label="АЛУ"
              >
                <span className={styles.blockTitle}>АЛУ</span>
                <span className={styles.blockRole}>Арифметика и логика</span>
              </div>
              <div
                className={clsx(styles.cpuBlock, isActive('cu') && styles.blockActive)}
                aria-label="Устройство управления"
              >
                <span className={styles.blockTitle}>УУ</span>
                <span className={styles.blockRole}>Декодирование команд</span>
              </div>
            </div>
            <div
              className={clsx(styles.pcRow, isActive('pc') && styles.blockActive)}
              aria-label="Счётчик команд"
            >
              <span>PC</span>
              <code>{pc}</code>
            </div>
          </section>

          <div className={styles.busRow}>
            <span
              className={clsx(
                styles.busLine,
                isActive('bus') && styles.busActive,
                busFlow === 'read' && styles.busRead,
                busFlow === 'write' && styles.busWrite,
                busFlow === 'in' && styles.busIn,
                busFlow === 'out' && styles.busOut,
              )}
            />
            <span className={styles.busLabel}>
              {busFlow === 'read' && '← чтение по шине'}
              {busFlow === 'write' && '→ запись по шине'}
              {busFlow === 'in' && '← ввод'}
              {busFlow === 'out' && '→ вывод'}
              {!busFlow && 'Системная шина'}
            </span>
          </div>

          <div className={styles.lowerRow}>
            <section
              className={clsx(styles.zone, styles.zoneMemory, isActive('memory') && styles.zoneActive)}
            >
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>💾</span>
                <span className={styles.zoneLabel}>Память (код + данные)</span>
              </header>
              <ul className={styles.memList} aria-label="Ячейки памяти">
                {memoryDisplay.map((cell) => (
                  <li
                    key={cell.addr}
                    className={clsx(
                      styles.memRow,
                      cell.kind === 'code' ? styles.memCode : styles.memData,
                      highlightAddr === cell.addr && styles.memRowHighlight,
                    )}
                  >
                    <code className={styles.memAddr}>{cell.addr}</code>
                    <span className={styles.memValue}>{cell.value}</span>
                    <span className={styles.memKind}>{cell.note ?? cell.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={clsx(styles.zone, styles.zoneIo, isActive('io') && styles.zoneActive)}>
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>⌨️</span>
                <span className={styles.zoneLabel}>Ввод / вывод</span>
              </header>
              <div className={clsx(styles.ioNode, isActive('io') && styles.blockActive)}>
                <span>Клавиатура · Монитор</span>
                <span className={styles.blockRole}>Контроллеры I/O</span>
              </div>
            </section>
          </div>
        </div>

        {currentStep && (
          <div className={styles.stepPanel} aria-live="polite">
            <span className={styles.stepLabel}>
              Шаг {stepIndex + 1} / {scenario.steps.length}
            </span>
            <strong>{currentStep.label}</strong>
            <p>{currentStep.detail}</p>
          </div>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={playing}
            onClick={playScenario}
          >
            {playing ? 'Воспроизведение…' : 'Запустить сценарий'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={playing || stepIndex <= 0}
            onClick={() => stepManual(-1)}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={playing || stepIndex >= scenario.steps.length - 1}
            onClick={() => stepManual(1)}
          >
            Вперёд →
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" disabled={playing} onClick={reset}>
            Сброс
          </button>
        </div>

        <p className={styles.footer}>
          Упрощённая модель из статьи: в реальном CPU кэш, конвейер и параллелизм усложняют картину, но
          принцип единой памяти и шины остаётся
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default VonNeumannArchitecturePlayInner;
