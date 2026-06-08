import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/EmbeddedSystemPlay.module.css';

const UART_REGS = [
  {addr: '0x40000000', name: 'UART_TX', value: '—', role: 'запись байта → передача'},
  {addr: '0x40000004', name: 'UART_STATUS', value: 'TX_READY=1', role: 'бит готовности'},
  {addr: '0x40000008', name: 'UART_RX', value: '—', role: 'приём с линии'},
];

const SCENARIOS = [
  {
    id: 'boot',
    short: 'Старт',
    title: 'Загрузка после сброса',
    subtitle: 'Питание → вектор сброса → Reset_Handler → main() → бесконечный цикл',
    steps: [
      {
        spotlight: ['mcu'],
        pc: '—',
        phase: 'Питание',
        label: 'Включили питание',
        detail: 'Микроконтроллер получает питание; тактовый генератор запускается.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['flash', 'cpu'],
        pc: '0x00000000',
        phase: 'Сброс',
        label: 'Вектор сброса',
        detail: 'CPU читает адрес 0x00000000: там указатель на Reset_Handler во Flash.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu', 'flash'],
        pc: 'Reset_Handler',
        phase: 'Init',
        label: 'Reset_Handler',
        detail: 'Инициализация .data и .bss, настройка тактирования, включение периферии.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu', 'ram'],
        pc: 'main()',
        phase: 'Приложение',
        label: 'Вход в main()',
        detail: 'Управление передано прикладной программе; переменные в RAM.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu', 'ram'],
        pc: 'while(1)',
        phase: 'Цикл',
        label: 'Бесконечный цикл',
        detail: 'main() не завершается: опрос датчиков, управление исполнительными устройствами.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
    ],
  },
  {
    id: 'mmap',
    short: 'MMIO',
    title: 'Memory-Mapped I/O (UART)',
    subtitle: 'Запись в регистр по адресу — то же действие, что обращение к памяти',
    steps: [
      {
        spotlight: ['cpu', 'regs'],
        pc: 'main',
        phase: 'Код',
        label: 'Программа готовит байт',
        detail: 'В коде: записать символ "A" (0x41) в регистр UART_TX.',
        ledOn: false,
        btnPressed: false,
        regHighlight: 'UART_TX',
        regValues: {UART_TX: '0x41 (пишем…)', UART_STATUS: 'TX_READY=1'},
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu', 'regs'],
        pc: 'STR → 0x40000000',
        phase: 'MMIO',
        label: 'Запись по адресу',
        detail: 'CPU выполняет store по адресу 0x40000000 — это не RAM, а регистр UART.',
        ledOn: false,
        btnPressed: false,
        regHighlight: 'UART_TX',
        regValues: {UART_TX: '0x41', UART_STATUS: 'TX_BUSY'},
        uartByte: 'A',
        sleeping: false,
      },
      {
        spotlight: ['regs', 'uart'],
        pc: '—',
        phase: 'Периферия',
        label: 'Контроллер UART',
        detail: 'Аппаратный UART сериализует 0x41 и отправляет биты на физическую линию TX.',
        ledOn: false,
        btnPressed: false,
        regHighlight: 'UART_TX',
        regValues: {UART_TX: '0x41', UART_STATUS: 'TX_BUSY'},
        uartByte: 'A',
        sleeping: false,
      },
      {
        spotlight: ['cpu', 'regs'],
        pc: 'LDR STATUS',
        phase: 'Опрос',
        label: 'Чтение STATUS',
        detail: 'Перед следующим байтом CPU читает 0x40000004 и проверяет бит TX_READY.',
        ledOn: false,
        btnPressed: false,
        regHighlight: 'UART_STATUS',
        regValues: {UART_TX: '—', UART_STATUS: 'TX_READY=1'},
        uartByte: null,
        sleeping: false,
      },
    ],
  },
  {
    id: 'irq',
    short: 'IRQ',
    title: 'Прерывание и главный цикл',
    subtitle: 'Событие на кнопке → ISR → флаг → реакция в main()',
    steps: [
      {
        spotlight: ['cpu', 'ram'],
        pc: 'while(1)',
        phase: 'main',
        label: 'Главный цикл',
        detail: 'main() опрашивает датчик температуры; LED выключен.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['btn'],
        pc: 'while(1)',
        phase: 'Событие',
        label: 'Нажата кнопка',
        detail: 'На линии GPIO — фронт сигнала; контроллер GPIO генерирует запрос прерывания.',
        ledOn: false,
        btnPressed: true,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['nvic', 'cpu'],
        pc: '→ ISR',
        phase: 'IRQ',
        label: 'Прерывание',
        detail: 'NVIC передаёт управление обработчику EXTI; main() приостановлен.',
        ledOn: false,
        btnPressed: true,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu', 'ram'],
        pc: 'Button_ISR',
        phase: 'ISR',
        label: 'Обработчик (ISR)',
        detail: 'Короткая функция: сброс флага кнопки, установка flag_pressed = 1 в RAM.',
        ledOn: false,
        btnPressed: true,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
        flagSet: true,
      },
      {
        spotlight: ['cpu', 'led'],
        pc: 'while(1)',
        phase: 'main',
        label: 'Возврат в main()',
        detail: 'main() видит flag_pressed и включает LED — без постоянного опроса кнопки.',
        ledOn: true,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
        flagSet: true,
      },
    ],
  },
  {
    id: 'sleep',
    short: 'Сон',
    title: 'Режим пониженного энергопотребления',
    subtitle: 'WFI / сон → пробуждение по прерыванию',
    steps: [
      {
        spotlight: ['cpu', 'sensor'],
        pc: 'active',
        phase: 'Активен',
        label: 'Активный режим',
        detail: 'CPU на полной частоте: опрос датчика, обработка данных.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu'],
        pc: 'WFI',
        phase: 'Сон',
        label: 'Команда WFI',
        detail: 'Wait For Interrupt — ядро останавливает тактирование до следующего IRQ.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: true,
      },
      {
        spotlight: ['btn', 'nvic'],
        pc: 'sleep',
        phase: 'Пробуждение',
        label: 'Прерывание будит CPU',
        detail: 'Таймер или кнопка подаёт IRQ — тактирование восстанавливается за микросекунды.',
        ledOn: false,
        btnPressed: true,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
      {
        spotlight: ['cpu'],
        pc: 'active',
        phase: 'Активен',
        label: 'Снова в работе',
        detail: 'Обработчик завершён; система возвращается к задачам или снова уходит в сон.',
        ledOn: false,
        btnPressed: false,
        regHighlight: null,
        uartByte: null,
        sleeping: false,
      },
    ],
  },
];

function regRowsForStep(step) {
  return UART_REGS.map((r) => {
    const override = step.regValues?.[r.name];
    return {
      ...r,
      value: override ?? r.value,
      highlight: step.regHighlight === r.name,
    };
  });
}

function EmbeddedSystemPlayInner() {
  const [scenarioId, setScenarioId] = useState('boot');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
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
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      if (index < 0 || index >= scenario.steps.length) {
        setStepIndex(-1);
        return;
      }
      setStepIndex(index);
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
        schedule(() => run(i + 1), 2600);
      } else {
        schedule(() => setPlaying(false), 2600);
      }
    };
    schedule(() => run(0), 280);
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

  const isActive = (id) => currentStep?.spotlight?.includes(id) ?? false;
  const showRegs = scenarioId === 'mmap' && currentStep;
  const regRows = currentStep ? regRowsForStep(currentStep) : UART_REGS;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как работает встраиваемая система"
        subtitle="Микроконтроллер, memory-mapped регистры, прерывания и энергосбережение"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии встраиваемой системы">
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

        <div className={styles.diagram} aria-label="Схема встраиваемой системы">
          <section className={clsx(styles.zone, styles.zoneMcu, isActive('mcu') && styles.zoneActive)}>
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🔲</span>
              <span className={styles.zoneLabel}>Микроконтроллер (SoC)</span>
            </header>
            <div className={styles.mcuGrid}>
              <div
                className={clsx(styles.mcuBlock, isActive('cpu') && styles.blockActive, currentStep?.sleeping && styles.cpuSleep)}
                aria-label="Ядро CPU"
              >
                <span className={styles.blockTitle}>CPU</span>
                <span className={styles.blockRole}>Cortex-M</span>
                {currentStep?.pc && (
                  <code className={styles.pcBadge}>{currentStep.pc}</code>
                )}
                {currentStep?.sleeping && <span className={styles.sleepBadge}>сон</span>}
              </div>
              <div className={clsx(styles.mcuBlock, isActive('flash') && styles.blockActive)} aria-label="Flash">
                <span className={styles.blockTitle}>Flash</span>
                <span className={styles.blockRole}>прошивка</span>
              </div>
              <div className={clsx(styles.mcuBlock, isActive('ram') && styles.blockActive)} aria-label="RAM">
                <span className={styles.blockTitle}>SRAM</span>
                <span className={styles.blockRole}>данные, стек</span>
                {currentStep?.flagSet && <span className={styles.flagBadge}>flag=1</span>}
              </div>
              <div className={clsx(styles.mcuBlock, isActive('nvic') && styles.blockActive)} aria-label="NVIC">
                <span className={styles.blockTitle}>NVIC</span>
                <span className={styles.blockRole}>прерывания</span>
              </div>
            </div>
            {currentStep?.phase && (
              <span className={styles.phaseChip}>{currentStep.phase}</span>
            )}
          </section>

          <div className={styles.busRow}>
            <span className={clsx(styles.busLine, (isActive('regs') || isActive('cpu')) && styles.busActive)} />
            <span className={styles.busLabel}>Шина адресов / данных (MMIO)</span>
          </div>

          {showRegs && (
            <section className={clsx(styles.zone, styles.zoneRegs, isActive('regs') && styles.zoneActive)}>
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>📟</span>
                <span className={styles.zoneLabel}>Регистры периферии (в адресном пространстве)</span>
              </header>
              <ul className={styles.regList}>
                {regRows.map((r) => (
                  <li key={r.addr} className={clsx(styles.regRow, r.highlight && styles.regRowHighlight)}>
                    <code className={styles.regAddr}>{r.addr}</code>
                    <span className={styles.regName}>{r.name}</span>
                    <span className={styles.regValue}>{r.value}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className={styles.periphRow}>
            <section className={clsx(styles.zone, styles.zonePeriph, isActive('uart') && styles.zoneActive)}>
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>📡</span>
                <span className={styles.zoneLabel}>UART</span>
              </header>
              <div className={clsx(styles.uartLine, currentStep?.uartByte && styles.uartActive)}>
                {currentStep?.uartByte ? (
                  <>
                    <span className={styles.uartTx}>TX →</span>
                    <code>{currentStep.uartByte}</code>
                    <span className={styles.uartBits}>01000001</span>
                  </>
                ) : (
                  <span className={styles.blockRole}>линия в простое</span>
                )}
              </div>
            </section>

            <section className={clsx(styles.zone, styles.zonePeriph, isActive('btn') && styles.zoneActive)}>
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>🔘</span>
                <span className={styles.zoneLabel}>Кнопка (GPIO)</span>
              </header>
              <div
                className={clsx(styles.gpioNode, currentStep?.btnPressed && styles.gpioPressed)}
                aria-pressed={currentStep?.btnPressed}
              >
                {currentStep?.btnPressed ? 'Нажата' : 'Отпущена'}
              </div>
            </section>

            <section className={clsx(styles.zone, styles.zonePeriph, isActive('led') && styles.zoneActive)}>
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>💡</span>
                <span className={styles.zoneLabel}>Светодиод</span>
              </header>
              <div
                className={clsx(styles.ledNode, currentStep?.ledOn && styles.ledOn)}
                aria-label={currentStep?.ledOn ? 'LED включён' : 'LED выключен'}
              />
            </section>

            <section className={clsx(styles.zone, styles.zonePeriph, isActive('sensor') && styles.zoneActive)}>
              <header className={styles.zoneHeader}>
                <span className={styles.zoneIcon}>🌡️</span>
                <span className={styles.zoneLabel}>Датчик</span>
              </header>
              <div className={styles.gpioNode}>
                <span>I2C / ADC</span>
                <span className={styles.blockRole}>температура</span>
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
          Упрощённая модель Cortex-M: в реальности — кэш, DMA, несколько шин APB/AHB и сотни регистров, но
          принцип MMIO и прерываний тот же
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default EmbeddedSystemPlayInner;
