import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  ARDUINO_PINS,
  BRAND,
  CODE_MODES,
  COMPONENT_CATALOG,
  MICROBIT_PINS,
  PRODUCT_TABS,
  PROJECTS,
  WORKSPACE_ZONES,
  blinkStep,
  getSectionProduct,
  getSectionProject,
  mapAnalog,
  pwmBrightness,
} from '@/components/shared/kb/tinkercadCircuitsEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/TinkercadCircuitsPlay.module.css';

function BreadboardView() {
  const [linkedCol, setLinkedCol] = useState(4);

  return (
    <>
      <p className={styles.hint}>
        Верхние и нижние шины — питание и GND. В центре столбцы по 5 отверстий соединены между собой; разделитель изолирует левую и правую половины.
      </p>
      <div className={styles.breadboard} style={{maxWidth: '100%'}}>
        <div className={clsx(styles.rail, styles.railPlus)}>+ красная шина (5V)</div>
        <div className={clsx(styles.rail, styles.railMinus)}>− синяя шина (GND)</div>
        <div className={styles.cols}>
          {Array.from({length: 30}, (_, i) => (
            <button
              key={i}
              type="button"
              className={clsx(styles.colHole, linkedCol === i % 10 && styles.colHoleLinked)}
              onClick={() => setLinkedCol(i % 10)}
              aria-label={`Столбец ${(i % 10) + 1}`}
            />
          ))}
        </div>
        <div className={clsx(styles.rail, styles.railMinus)}>− GND (низ)</div>
        <div className={clsx(styles.rail, styles.railPlus)}>+ 5V (низ)</div>
      </div>
      <p className={styles.hint}>
        Нажмите отверстие: подсвечен весь столбец из 5 ячеек — так же соединяются контакты на реальной breadboard.
      </p>
    </>
  );
}

function WorkspaceView({initialZone = 'canvas'}) {
  const [zoneId, setZoneId] = useState(initialZone);
  const zone = WORKSPACE_ZONES.find((z) => z.id === zoneId) ?? WORKSPACE_ZONES[1];

  return (
    <>
      <div className={styles.workspace}>
        {WORKSPACE_ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            className={clsx(
              styles.zone,
              z.id === 'toolbar' && styles.zoneToolbar,
              z.id === 'canvas' && styles.zoneCanvas,
              z.id === 'palette' && styles.zonePalette,
              z.id === 'serial' && styles.zoneSerial,
              zoneId === z.id && styles.zoneActive,
            )}
            onClick={() => setZoneId(z.id)}
          >
            <div className={styles.zoneTitle}>{z.label}</div>
            <div className={styles.zonePlace}>{z.place}</div>
            {z.id === 'canvas' && (
              <div className={styles.breadboard}>
                <div className={clsx(styles.rail, styles.railPlus)}>+ шина</div>
                <div className={clsx(styles.rail, styles.railMinus)}>− GND</div>
                <div className={styles.cols}>
                  {Array.from({length: 20}, (_, i) => (
                    <span key={i} className={clsx(styles.colHole, i % 5 === 2 && styles.colHoleLinked)} />
                  ))}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      <p className={styles.zoneDetail}>
        <strong>{zone.label}</strong> ({zone.place}): {zone.desc}
        <ul className={styles.zoneItems}>
          {zone.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </p>
    </>
  );
}

function ArduinoView({ledOn, highlightPin}) {
  const [pinId, setPinId] = useState('D13');
  const pin = ARDUINO_PINS.find((p) => p.id === pinId) ?? ARDUINO_PINS[13];
  const topPins = ARDUINO_PINS.filter((p) => p.side === 'top');
  const bottomPins = ARDUINO_PINS.filter((p) => p.side === 'bottom');

  useEffect(() => {
    if (highlightPin != null) {
      const match = ARDUINO_PINS.find((p) => p.label === String(highlightPin));
      if (match) setPinId(match.id);
    }
  }, [highlightPin]);

  return (
    <div className={styles.arduinoBoard}>
      <div className={styles.boardBody}>
        <div className={styles.boardLabel}>ARDUINO UNO R3</div>
        <div className={clsx(styles.boardLed, ledOn && styles.boardLedOn)} title="Встроенный LED (D13)" />
        <div className={styles.pinRow}>
          {topPins.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(
                styles.pin,
                pinId === p.id && styles.pinActive,
                p.pwm && styles.pinPwm,
                p.type === 'power' && styles.pinPower,
              )}
              onClick={() => setPinId(p.id)}
              title={p.note}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={clsx(styles.pinRow, styles.pinRowBottom)}>
          {bottomPins.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(
                styles.pin,
                pinId === p.id && styles.pinActive,
                p.type === 'analog' && styles.pinAnalog,
                p.type === 'power' && styles.pinPower,
              )}
              onClick={() => setPinId(p.id)}
              title={p.note}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.pinInfo}>
        <strong>Пин {pin.label}</strong> — {pin.note}
        {pin.pwm && ' · поддерживает analogWrite (ШИМ)'}
        {pin.type === 'analog' && ' · analogRead() → 0…1023'}
        {pin.type === 'digital' && !pin.pwm && ' · pinMode / digitalRead / digitalWrite'}
      </div>
    </div>
  );
}

function MicrobitView() {
  const [pinId, setPinId] = useState('P0');
  const pin = MICROBIT_PINS.find((p) => p.id === pinId) ?? MICROBIT_PINS[0];

  return (
    <>
      <div className={styles.microFace}>
        <div className={styles.microDisplay}>{pin.label}</div>
        <span>micro:bit · 25 LED + кнопки A/B</span>
      </div>
      <div className={styles.microGrid}>
        {MICROBIT_PINS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={clsx(styles.microPin, pinId === p.id && styles.microPinActive)}
            onClick={() => setPinId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        <strong>P{pin.label}</strong>: {pin.role}. В Tinkercad Circuits micro:bit программируется блоками MakeCode.
      </p>
    </>
  );
}

function ComponentsView() {
  const [compId, setCompId] = useState('led');
  const comp = COMPONENT_CATALOG.find((c) => c.id === compId) ?? COMPONENT_CATALOG[1];

  return (
    <>
      <div className={styles.compGrid}>
        {COMPONENT_CATALOG.map((c) => (
          <button
            key={c.id}
            type="button"
            className={clsx(styles.compCard, compId === c.id && styles.compCardActive)}
            onClick={() => setCompId(c.id)}
          >
            <div className={styles.compIcon}>{c.icon}</div>
            <div>{c.name}</div>
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        <strong>{comp.name}</strong> ({comp.cat}): {comp.param}. Перетащите из правой панели Tinkercad на breadboard.
      </p>
    </>
  );
}

function CodeView() {
  const [modeId, setModeId] = useState('blocks');
  const [step, setStep] = useState(0);
  const mode = CODE_MODES.find((m) => m.id === modeId) ?? CODE_MODES[0];
  const lines = mode.code.split('\n');

  useEffect(() => {
    setStep(0);
  }, [modeId]);

  return (
    <>
      <div className={toolStyles.chips}>
        {CODE_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={clsx(toolStyles.chip, modeId === m.id && toolStyles.chipActive)}
            onClick={() => setModeId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className={styles.hint}>{mode.desc}</p>
      <div className={styles.codeSplit}>
        {mode.blocks && (
          <div className={styles.blockStack}>
            {mode.blocks.map((b, i) => (
              <div
                key={b}
                className={clsx(
                  styles.block,
                  b.includes('setup') && styles.blockSetup,
                  b.includes('loop') && styles.blockLoop,
                  !b.includes('setup') && !b.includes('loop') && styles.blockStmt,
                  step === i && styles.codeLineActive,
                )}
              >
                {b}
              </div>
            ))}
          </div>
        )}
        <div className={styles.codePane}>
          {lines.map((line, i) => (
            <div key={i} className={clsx(styles.codeLine, step === i && styles.codeLineActive)}>
              {line || ' '}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.simBar}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
          onClick={() => setStep((s) => (s + 1) % Math.max(lines.length, 1))}
        >
          Шаг кода →
        </button>
      </div>
    </>
  );
}

function ProjectSim({projectId}) {
  const project = PROJECTS[projectId] ?? PROJECTS.blink;
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [potValue, setPotValue] = useState(512);
  const [buttonDown, setButtonDown] = useState(false);
  const [serialLines, setSerialLines] = useState([]);
  const timerRef = useRef(null);

  const stop = useCallback(() => {
    setRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = () => {
    stop();
    setRunning(true);
    setTick(0);
    setSerialLines([]);
    const speed = projectId === 'pwm' ? 40 : projectId === 'sensor' ? 350 : 500;
    timerRef.current = setInterval(() => {
      setTick((t) => t + 1);
      if (projectId === 'sensor') {
        setSerialLines((prev) => {
          const line = `Датчик: ${potValue}  Яркость: ${mapAnalog(potValue)}`;
          return [...prev.slice(-6), line];
        });
      }
    }, speed);
  };

  let ledOn = false;
  let brightness = 0;
  let activeLine = 0;

  if (projectId === 'blink') {
    const st = blinkStep(tick);
    ledOn = st.ledOn;
    activeLine = st.line;
  } else if (projectId === 'button') {
    ledOn = buttonDown;
    activeLine = buttonDown ? 3 : 4;
  } else if (projectId === 'pwm') {
    brightness = pwmBrightness(tick * 40);
    ledOn = brightness > 8;
    activeLine = 2 + (tick % 3);
  } else if (projectId === 'sensor') {
    brightness = mapAnalog(potValue);
    ledOn = brightness > 8;
    activeLine = 2 + (tick % 2);
  }

  const highlightPin = project.pwm ? project.pin : project.pin;

  return (
    <>
      <div className={styles.simBar}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
          onClick={running ? stop : start}
        >
          {running ? '⏹ Stop' : '▶ Start Simulation'}
        </button>
        {projectId === 'button' && (
          <button
            type="button"
            className={clsx('it-demo__btn it-demo__btn--sm', buttonDown && 'it-demo__btn--primary')}
            onMouseDown={() => setButtonDown(true)}
            onMouseUp={() => setButtonDown(false)}
            onMouseLeave={() => setButtonDown(false)}
            onTouchStart={() => setButtonDown(true)}
            onTouchEnd={() => setButtonDown(false)}
          >
            🔘 Кнопка (pin 2)
          </button>
        )}
        {projectId === 'sensor' && (
          <label className={styles.speedLabel}>
            Потенциометр A0
            <input
              type="range"
              min={0}
              max={1023}
              value={potValue}
              onChange={(e) => setPotValue(Number(e.target.value))}
            />
          </label>
        )}
      </div>
      <div className={styles.circuitRow}>
        <div className={styles.miniArduino}>
          UNO
          <br />
          pin {project.pin}
          {project.inputPin != null && (
            <>
              <br />
              in {project.inputPin}
            </>
          )}
        </div>
        <span aria-hidden>━━</span>
        <div
          className={clsx(styles.ledBulb, ledOn && styles.ledOn)}
          style={
            project.pwm || projectId === 'sensor'
              ? {opacity: 0.35 + (brightness / 255) * 0.65, boxShadow: ledOn ? `0 0 ${4 + brightness / 25}px #fbbf24` : undefined}
              : undefined
          }
          title="Светодиод"
        />
        {projectId === 'button' && (
          <button
            type="button"
            className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
            onMouseDown={() => setButtonDown(true)}
            onMouseUp={() => setButtonDown(false)}
          >
            🔘
          </button>
        )}
      </div>
      <ArduinoView ledOn={projectId === 'blink' && ledOn} highlightPin={highlightPin} />
      <div className={styles.codePane} style={{marginTop: '0.5rem'}}>
        {project.code.map((row, i) => (
          <div
            key={`${row.fn}-${row.line}`}
            className={clsx(styles.codeLine, running && activeLine === i && styles.codeLineActive)}
          >
            <span style={{color: 'var(--ifm-color-content-secondary)', marginRight: '0.35rem'}}>{row.fn}</span>
            {row.line}
          </div>
        ))}
      </div>
      {projectId === 'sensor' && (
        <div className={styles.serialOut} aria-live="polite">
          {serialLines.length === 0 ? (
            <span style={{opacity: 0.6}}>Serial Monitor @ 9600 baud…</span>
          ) : (
            serialLines.map((l, i) => <div key={i}>{l}</div>)
          )}
        </div>
      )}
      <p className={styles.hint}>
        Компоненты: {project.parts.join(' · ')}
      </p>
    </>
  );
}

function ProjectsView({initialProject}) {
  const [projectId, setProjectId] = useState(initialProject ?? 'blink');

  return (
    <>
      <div className={toolStyles.chips}>
        {Object.values(PROJECTS).map((p) => (
          <button
            key={p.id}
            type="button"
            className={clsx(toolStyles.chip, projectId === p.id && toolStyles.chipActive)}
            onClick={() => setProjectId(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      <ProjectSim projectId={projectId} />
    </>
  );
}

function TinkercadCircuitsPlayInner({section}) {
  const productFromSection = getSectionProduct(section);
  const projectFromSection = getSectionProject(section);
  const [product, setProduct] = useState(productFromSection ?? 'circuits');

  useEffect(() => {
    if (productFromSection) setProduct(productFromSection);
  }, [productFromSection]);

  const showTabs = !section || section === 'hub';

  const titles = {
    circuits: {title: 'Tinkercad Circuits', subtitle: 'Рабочая область симулятора в браузере'},
    arduino: {title: 'Arduino Uno R3', subtitle: 'Интерактивная карта выводов — нажмите на пин'},
    microbit: {title: 'BBC micro:bit', subtitle: 'Плата с LED-матрицей и кнопками в каталоге Circuits'},
    components: {title: 'Каталог компонентов', subtitle: 'Детали из правой панели Tinkercad'},
    code: {title: 'Режимы программирования', subtitle: 'Blockly, гибрид и текст C++'},
    projects: {title: 'Симуляция проектов', subtitle: 'Мигание, кнопка, ШИМ и аналоговый датчик'},
  };

  const meta = titles[product] ?? titles.circuits;

  if (projectFromSection) {
    const proj = PROJECTS[projectFromSection];
    return (
      <DemoShell className={styles.root}>
        <DemoCard title={proj.label} subtitle="Запустите симуляцию и меняйте входы">
          <ProjectSim projectId={projectFromSection} />
        </DemoCard>
      </DemoShell>
    );
  }

  if (section === 'breadboard') {
    return (
      <DemoShell className={styles.root}>
        <DemoCard title="Макетная плата (breadboard)" subtitle="Клик по столбцу — общая электрическая шина из 5 отверстий">
          <BreadboardView />
        </DemoCard>
      </DemoShell>
    );
  }

  const body = (() => {
    switch (product) {
      case 'arduino':
        return <ArduinoView />;
      case 'microbit':
        return <MicrobitView />;
      case 'components':
        return <ComponentsView />;
      case 'code':
        return <CodeView />;
      case 'projects':
        return <ProjectsView />;
      default:
        return <WorkspaceView />;
    }
  })();

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title={
          <span style={{color: BRAND}}>{meta.title}</span>
        }
        subtitle={meta.subtitle}
      >
        {showTabs && (
          <div className={styles.productTabs}>
            {PRODUCT_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={clsx(toolStyles.chip, product === t.id && toolStyles.chipActive)}
                onClick={() => setProduct(t.id)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}
        {body}
      </DemoCard>
    </DemoShell>
  );
}

/**
 * Интерактивные демо Tinkercad Circuits, Arduino, micro:bit и учебных схем.
 * @param {{ section?: 'hub'|'workspace'|'circuits'|'arduino'|'microbit'|'breadboard'|'components'|'code'|'simulate'|'projects'|'blink'|'button'|'pwm'|'sensor' }} props
 */
export default function TinkercadCircuitsPlay({section}) {
  return <TinkercadCircuitsPlayInner section={section} />;
}
