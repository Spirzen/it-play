import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/MemoryAddressingDemo.module.css';

/** Упрощённая лента RAM: int x=42 (LE) и символ */
const TAPE_CELLS = [
  {addr: '0x1000', hex: '0x2A', dec: 42, group: 'x', hint: 'Младший байт int x = 42'},
  {addr: '0x1001', hex: '0x00', dec: 0, group: 'x', hint: 'Второй байт (нули в 32-bit LE)'},
  {addr: '0x1002', hex: '0x00', dec: 0, group: 'x', hint: 'Третий байт'},
  {addr: '0x1003', hex: '0x00', dec: 0, group: 'x', hint: 'Старший байт — вместе 4 байта = одно число'},
  {addr: '0x1004', hex: '0x41', dec: 65, group: 'c', hint: "Символ 'A' (ASCII 65) — 1 байт"},
  {addr: '0x1005', hex: '0x00', dec: 0, group: 'pad', hint: 'Выравнивание / padding'},
  {addr: '0x1006', hex: '0x00', dec: 0, group: 'pad', hint: 'Неиспользуемая ячейка'},
  {addr: '0x1007', hex: '0x00', dec: 0, group: 'pad', hint: 'Конец фрагмента'},
];

const READ_RAM = [
  {addr: '0x00', value: '0x2A'},
  {addr: '0x01', value: '0x00'},
  {addr: '0x02', value: '0x41'},
  {addr: '0x03', value: '0x7B'},
];

const SCENARIOS = [
  {
    id: 'tape',
    short: 'Байты',
    title: 'Ячейка и адрес',
    subtitle: 'Каждый адрес — один байт; несколько соседних адресов могут хранить одно значение',
    interactive: true,
    steps: [],
  },
  {
    id: 'read',
    short: 'MAR → MDR',
    title: 'Цикл чтения из памяти',
    subtitle: 'Процессор кладёт адрес в MAR, передаёт по адресной шине, получает байт в MDR',
    interactive: false,
    steps: [
      {
        spotlight: ['cpu', 'mar'],
        targetAddr: '0x02',
        mar: '0x02',
        mdr: '—',
        addrBus: false,
        dataBus: false,
        label: 'Запрос чтения',
        detail: 'Программа обращается к адресу 0x02 — в MAR записывается этот адрес.',
      },
      {
        spotlight: ['addrBus', 'mar'],
        targetAddr: '0x02',
        mar: '0x02',
        mdr: '—',
        addrBus: true,
        dataBus: false,
        label: 'Адресная шина',
        detail: 'MAR выставляет линии адресной шины: контроллер памяти узнаёт, какую ячейку выбрать.',
      },
      {
        spotlight: ['ram'],
        targetAddr: '0x02',
        mar: '0x02',
        mdr: '—',
        addrBus: true,
        dataBus: false,
        label: 'Выбор ячейки',
        detail: 'Контроллер RAM активирует строку/столбец (RAS/CAS) и находит байт 0x41.',
      },
      {
        spotlight: ['dataBus', 'mdr'],
        targetAddr: '0x02',
        mar: '0x02',
        mdr: '0x41',
        addrBus: false,
        dataBus: true,
        label: 'Шина данных → MDR',
        detail: 'Содержимое ячейки попадает в Memory Data Register — процессор может его использовать.',
      },
    ],
  },
  {
    id: 'virtual',
    short: 'MMU',
    title: 'Виртуальный и физический адрес',
    subtitle: 'Одинаковый виртуальный адрес в разных процессах → разные физические кадры',
    interactive: false,
    steps: [
      {
        spotlight: ['procA'],
        frameA: false,
        frameB: false,
        label: 'Процесс A читает 0x1000',
        detail: 'Программа видит виртуальный адрес 0x1000 — это логическое пространство процесса.',
      },
      {
        spotlight: ['mmu', 'procA'],
        frameA: false,
        frameB: false,
        label: 'MMU и таблица страниц',
        detail: 'Memory Management Unit по таблице страниц ОС переводит 0x1000 → физический кадр 0x5000.',
      },
      {
        spotlight: ['physical', 'frameA'],
        frameA: true,
        frameB: false,
        label: 'Физическая RAM',
        detail: 'В микросхемах RAM по адресу 0x5000 лежат данные процесса A (например, "Invoice").',
      },
      {
        spotlight: ['procB'],
        frameA: false,
        frameB: false,
        label: 'Процесс B — тот же виртуальный адрес',
        detail: 'У процесса B тоже есть виртуальный 0x1000, но это другая программа — другая таблица.',
      },
      {
        spotlight: ['mmu', 'procB'],
        frameA: false,
        frameB: false,
        label: 'Другой перевод',
        detail: 'MMU сопоставляет virt 0x1000 процесса B с физическим 0x8000 — изоляция процессов.',
      },
      {
        spotlight: ['physical', 'frameB'],
        frameA: false,
        frameB: true,
        label: 'Другой кадр в RAM',
        detail: 'По физическому 0x8000 — данные B ("User profile"). Сбой в A не портит память B.',
      },
    ],
  },
];

function TapeView({selectedAddr, onSelect}) {
  const selected = TAPE_CELLS.find((c) => c.addr === selectedAddr) ?? TAPE_CELLS[0];

  return (
    <>
      <div className={styles.tapeLegend}>
        <span className={styles.legendItem}>
          <span className={clsx(styles.legendSwatch, styles.legendX)} />
          int x = 42 (4 байта)
        </span>
        <span className={styles.legendItem}>
          <span className={clsx(styles.legendSwatch, styles.legendC)} />
          char (1 байт)
        </span>
      </div>

      <div className={styles.tape} role="list" aria-label="Лента памяти">
        {TAPE_CELLS.map((cell) => (
          <button
            key={cell.addr}
            type="button"
            role="listitem"
            className={clsx(
              styles.tapeCell,
              cell.group === 'x' && styles.tapeCellGroupX,
              cell.group === 'c' && styles.tapeCellGroupC,
              selectedAddr === cell.addr && styles.tapeCellSelected,
            )}
            aria-pressed={selectedAddr === cell.addr}
            onClick={() => onSelect(cell.addr)}
          >
            <span className={styles.tapeAddr}>{cell.addr}</span>
            <span className={styles.tapeValue}>{cell.hex}</span>
          </button>
        ))}
      </div>

      <div className={styles.cellInfo} aria-live="polite">
        <strong>
          Адрес {selected.addr} → байт {selected.hex} ({selected.dec})
        </strong>
        {selected.hint}
        {selected.group === 'x' && (
          <p style={{margin: '0.5rem 0 0', fontSize: '0.8rem', color: 'var(--ifm-color-content-secondary)'}}>
            Все четыре ячейки 0x1000–0x1003 вместе образуют 32-битное число 42 (little-endian).
          </p>
        )}
      </div>
    </>
  );
}

function ReadCycleView({step}) {
  const targetAddr = step?.targetAddr ?? null;
  const spotlight = step?.spotlight ?? [];

  const isOn = (id) => spotlight.includes(id);

  return (
    <div className={styles.readFlow}>
      <div className={clsx(styles.cpuBlock, isOn('cpu') && styles.cpuBlockActive)}>
        <div className={styles.cpuTitle}>Процессор</div>
        <div className={styles.regRow}>
          <div className={clsx(styles.register, isOn('mar') && styles.registerActive)}>
            <span className={styles.regLabel}>MAR (адрес)</span>
            <span className={styles.regValue}>{step?.mar ?? '—'}</span>
          </div>
          <div className={clsx(styles.register, isOn('mdr') && styles.registerActive)}>
            <span className={styles.regLabel}>MDR (данные)</span>
            <span className={styles.regValue}>{step?.mdr ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className={styles.busColumn}>
        <div className={clsx(styles.busLine, isOn('addrBus') && styles.busLineActive)} />
        <span className={styles.busCaption}>
          {isOn('addrBus') ? 'Адресная шина →' : 'Адресная шина'}
        </span>
      </div>

      <div className={clsx(styles.ramPanel, isOn('ram') && styles.ramPanelActive)}>
        <span className={styles.cpuTitle}>RAM</span>
        <div className={styles.ramGrid}>
          {READ_RAM.map((cell) => (
            <div
              key={cell.addr}
              className={clsx(styles.ramCell, targetAddr === cell.addr && styles.ramCellHighlight)}
            >
              <span className={styles.ramCellAddr}>{cell.addr}</span>
              {cell.value}
            </div>
          ))}
        </div>
      </div>

      {isOn('dataBus') && (
        <div className={styles.busColumn}>
          <div className={clsx(styles.busLine, styles.busLineActive)} />
          <span className={styles.busCaption}>← Шина данных</span>
        </div>
      )}
    </div>
  );
}

function VirtualMemoryView({step}) {
  const spotlight = step?.spotlight ?? [];
  const isOn = (id) => spotlight.includes(id);

  return (
    <>
      <div className={styles.virtualLayout}>
        <div className={clsx(styles.processBox, isOn('procA') && styles.processBoxActive)}>
          <div className={styles.processTitle}>Процесс A</div>
          <div className={styles.mapRow}>
            <span>virt</span>
            <span className={styles.mapArrow}>→</span>
            <span>0x1000</span>
          </div>
          <div style={{fontSize: '0.68rem', color: 'var(--ifm-color-content-secondary)'}}>
            "Invoice.pdf"
          </div>
        </div>

        <div className={clsx(styles.mmuBox, isOn('mmu') && styles.mmuBoxActive)}>
          MMU
          <br />
          <span style={{fontWeight: 400, fontSize: '0.62rem'}}>таблица страниц</span>
        </div>

        <div
          className={clsx(styles.processBox, isOn('procB') && styles.processBoxBActive)}
        >
          <div className={styles.processTitle}>Процесс B</div>
          <div className={styles.mapRow}>
            <span>virt</span>
            <span className={styles.mapArrow}>→</span>
            <span>0x1000</span>
          </div>
          <div style={{fontSize: '0.68rem', color: 'var(--ifm-color-content-secondary)'}}>
            "User profile"
          </div>
        </div>
      </div>

      <div className={clsx(styles.physicalRam, isOn('physical') && styles.physicalRamActive)}>
        <span className={styles.cpuTitle}>Физическая RAM</span>
        <div
          className={clsx(styles.frameRow, step?.frameA && styles.frameRowHighlight)}
        >
          <code>0x5000</code>
          <span>Кадр процесса A — Invoice.pdf</span>
        </div>
        <div
          className={clsx(styles.frameRow, step?.frameB && styles.frameRowHighlight)}
        >
          <code>0x8000</code>
          <span>Кадр процесса B — User profile</span>
        </div>
      </div>
    </>
  );
}

function MemoryAddressingDemoInner() {
  const [scenarioId, setScenarioId] = useState('tape');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [selectedAddr, setSelectedAddr] = useState(TAPE_CELLS[0].addr);
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
    setSelectedAddr(TAPE_CELLS[0].addr);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
    },
    [scenario.steps],
  );

  const playScenario = useCallback(() => {
    if (scenario.interactive) return;
    clearTimers();
    setPlaying(true);
    setStepIndex(-1);
    const run = (i) => {
      applyStep(i);
      if (i < scenario.steps.length - 1) {
        schedule(() => run(i + 1), 2600);
      } else {
        schedule(() => setPlaying(false), 2600);
      }
    };
    schedule(() => run(0), 250);
  }, [applyStep, clearTimers, scenario.interactive, scenario.steps, schedule]);

  const selectScenario = (id) => {
    if (playing) return;
    setScenarioId(id);
    reset();
  };

  const stepManual = (delta) => {
    if (playing || scenario.interactive) return;
    const next = Math.max(0, Math.min(scenario.steps.length - 1, stepIndex + delta));
    applyStep(next);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Адресация данных в памяти"
        subtitle="Байтовая лента, цикл MAR→MDR и перевод виртуального адреса в физический"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии адресации">
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

        {scenarioId === 'tape' && (
          <TapeView selectedAddr={selectedAddr} onSelect={setSelectedAddr} />
        )}
        {scenarioId === 'read' && <ReadCycleView step={currentStep} />}
        {scenarioId === 'virtual' && <VirtualMemoryView step={currentStep} />}

        {currentStep && !scenario.interactive && (
          <div className={styles.stepPanel} aria-live="polite">
            <span className={styles.stepLabel}>
              Шаг {stepIndex + 1} / {scenario.steps.length}
            </span>
            <strong>{currentStep.label}</strong>
            <p>{currentStep.detail}</p>
          </div>
        )}

        {!scenario.interactive && (
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
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              disabled={playing}
              onClick={reset}
            >
              Сброс
            </button>
          </div>
        )}

        <p className={styles.footer}>
          {scenarioId === 'tape'
            ? 'Кликните по ячейке: адрес — это номер байта, а не "поля" переменной целиком.'
            : 'Упрощённая модель из статьи: в реальности добавляются кэш, TLB и защита страниц.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MemoryAddressingDemoInner;
