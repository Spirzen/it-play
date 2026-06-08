import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ComputerBootSequence.module.css';

const NODES = [
  {id: 'psu', label: 'БП', icon: '⚡'},
  {id: 'bios', label: 'BIOS', icon: '💾'},
  {id: 'disk', label: 'Диск', icon: '💿'},
  {id: 'ram', label: 'ОЗУ', icon: '🔋'},
  {id: 'cpu', label: 'ЦП', icon: '🧠'},
];

const BOOT_STEPS = [
  {id: 'psu', label: 'Питание'},
  {id: 'bios', label: 'POST'},
  {id: 'disk', label: 'Загрузчик'},
  {id: 'ram', label: 'ОЗУ'},
];

/** SVG-координаты центров узлов (viewBox 0 0 300 200) */
const NODE_POS = {
  psu: {x: 50, y: 40},
  bios: {x: 150, y: 40},
  disk: {x: 250, y: 40},
  ram: {x: 50, y: 150},
  cpu: {x: 150, y: 150},
};

const EDGES = [
  ['psu', 'bios'],
  ['bios', 'disk'],
  ['disk', 'ram'],
  ['ram', 'cpu'],
];

const STATUS_TEXT = {
  off: 'Компьютер выключен. Включите питание, чтобы начать загрузку.',
  booting: 'Идёт загрузка: питание → POST → чтение с диска → инициализация ОЗУ.',
  running: 'Система работает. Откройте файл, чтобы увидеть путь данных.',
  closing: 'Завершение работы: сброс кэша ЦП → очистка ОЗУ → отключение.',
};

function edgeKey(a, b) {
  return `${a}-${b}`;
}

function ComputerBootSequenceInner() {
  const [status, setStatus] = useState('off');
  const [activePath, setActivePath] = useState([]);
  const [fileLocation, setFileLocation] = useState('disk');
  const [bootPhase, setBootPhase] = useState(-1);
  const [log, setLog] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  const pushLog = useCallback((msg) => {
    setLog((prev) => [...prev.slice(-5), msg]);
  }, []);

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

  const animatePath = useCallback(
    (path, onDone) => {
      if (path.length < 2) {
        onDone?.();
        return;
      }
      let i = 0;
      const step = () => {
        const from = path[i];
        const to = path[i + 1];
        setActivePath([from, to]);
        setPacket({from: NODE_POS[from], to: NODE_POS[to], t: 0});
        const start = performance.now();
        const duration = 520;

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          setPacket({from: NODE_POS[from], to: NODE_POS[to], t});
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            i += 1;
            if (i < path.length - 1) step();
            else {
              setActivePath([]);
              setPacket(null);
              onDone?.();
            }
          }
        };
        requestAnimationFrame(tick);
      };
      step();
    },
    [],
  );

  const handlePowerOn = () => {
    if (status === 'booting' || status === 'running') return;
    clearTimers();
    setStatus('booting');
    setBootPhase(0);
    setLog([]);
    pushLog('Нажата кнопка питания');

    const path = ['psu', 'bios', 'disk', 'ram'];
    let phase = 0;
    const runPhase = () => {
      if (phase >= path.length - 1) {
        schedule(() => {
          setStatus('running');
          setBootPhase(-1);
          setFileLocation('disk');
          pushLog('ОС готова — файл на диске');
        }, 300);
        return;
      }
      setBootPhase(phase);
      const seg = [path[phase], path[phase + 1]];
      pushLog(
        phase === 0
          ? 'БП подаёт напряжение на плату'
          : phase === 1
            ? 'BIOS выполняет POST'
            : phase === 2
              ? 'Загрузчик читает ядро с диска'
              : 'Копирование в ОЗУ',
      );
      animatePath(seg, () => {
        phase += 1;
        schedule(runPhase, 120);
      });
    };
    schedule(runPhase, 200);
  };

  const handleOpenFile = () => {
    if (status !== 'running' || fileLocation === 'cpu') return;
    if (fileLocation === 'disk') {
      pushLog('Открытие: диск → ОЗУ → ЦП');
      animatePath(['disk', 'ram'], () => {
        setFileLocation('ram');
        schedule(() => animatePath(['ram', 'cpu'], () => setFileLocation('cpu')), 200);
      });
    } else if (fileLocation === 'ram') {
      pushLog('Обработка в ЦП');
      animatePath(['ram', 'cpu'], () => setFileLocation('cpu'));
    }
  };

  const handleCloseFile = () => {
    if (status !== 'running' || fileLocation === 'disk') return;
    if (fileLocation === 'cpu') {
      pushLog('Закрытие: ЦП → ОЗУ');
      animatePath(['cpu', 'ram'], () => {
        setFileLocation('ram');
        schedule(() => {
          pushLog('Сброс на диск');
          animatePath(['ram', 'disk'], () => setFileLocation('disk'));
        }, 200);
      });
    } else if (fileLocation === 'ram') {
      animatePath(['ram', 'disk'], () => setFileLocation('disk'));
    }
  };

  const handlePowerOff = () => {
    if (status === 'off' || status === 'booting') return;
    clearTimers();
    setStatus('closing');
    pushLog('Завершение работы…');
    animatePath(['cpu', 'ram'], () => {
      schedule(() => {
        animatePath(['ram', 'psu'], () => {
          schedule(() => {
            setStatus('off');
            setFileLocation('disk');
            setLog([]);
            pushLog('Питание отключено');
          }, 400);
        });
      }, 300);
    });
  };

  const isEdgeActive = (a, b) => activePath[0] === a && activePath[1] === b;

  const getNodeClass = (id) => {
    if (status === 'off') return styles.nodeOff;
    if (activePath.includes(id)) {
      if (id === 'cpu' && fileLocation === 'cpu') return styles.nodeProcessing;
      return styles.nodeActive;
    }
    if (status === 'running') return styles.nodeRunning;
    return undefined;
  };

  const fileLabel =
    fileLocation === 'cpu'
      ? {text: 'Обработка в ЦП', color: '#e65100'}
      : fileLocation === 'ram'
        ? {text: 'Файл в ОЗУ', color: '#2e7d32'}
        : {text: 'Файл на диске', color: '#757575'};

  let packetCircle = null;
  if (packet) {
    const x = packet.from.x + (packet.to.x - packet.from.x) * packet.t;
    const y = packet.from.y + (packet.to.y - packet.from.y) * packet.t;
    packetCircle = <circle className={styles.packet} cx={x} cy={y} r={6} />;
  }

  return (
    <DemoShell className={styles.root}>
      <div className={styles.header}>
        <h4 className={styles.title}>Жизненный цикл данных</h4>
        <p className={styles.subtitle}>Питание, загрузка и путь файла: диск → ОЗУ → ЦП</p>
      </div>

      <div className={styles.toolbar}>
        {status === 'off' && (
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={handlePowerOn}>
            Включить
          </button>
        )}
        {status === 'running' && (
          <>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              onClick={handleOpenFile}
              disabled={fileLocation === 'cpu'}
            >
              Открыть файл
            </button>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={handleCloseFile}
              disabled={fileLocation === 'disk'}
            >
              Закрыть файл
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--danger" onClick={handlePowerOff}>
              Выключить
            </button>
          </>
        )}
        {(status === 'booting' || status === 'closing') && (
          <button type="button" className="it-demo__btn" disabled>
            …
          </button>
        )}
      </div>

      {status === 'booting' && (
        <div className={styles.bootSteps}>
          {BOOT_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={clsx(
                styles.step,
                i < bootPhase && styles.stepDone,
                i === bootPhase && styles.stepActive,
              )}
            >
              {s.label}
            </span>
          ))}
        </div>
      )}

      <div className={styles.statusPanel}>
        {STATUS_TEXT[status]}
        {status === 'running' && (
          <>
            <br />
            <span className={styles.statusHighlight} style={{color: fileLabel.color}}>
              {fileLabel.text}
            </span>
          </>
        )}
      </div>

      <div className={styles.diagram}>
        <svg className={styles.svgLayer} viewBox="0 0 300 200" aria-hidden>
          {EDGES.map(([a, b]) => (
            <line
              key={edgeKey(a, b)}
              x1={NODE_POS[a].x}
              y1={NODE_POS[a].y}
              x2={NODE_POS[b].x}
              y2={NODE_POS[b].y}
              className={clsx(styles.flowPath, isEdgeActive(a, b) && styles.flowActive)}
            />
          ))}
          {packetCircle}
        </svg>
        <div className={styles.grid}>
          {NODES.map((n) => (
            <div
              key={n.id}
              id={n.id}
              className={clsx(styles.node, getNodeClass(n.id))}
            >
              <span className={styles.nodeIcon}>{n.icon}</span>
              <span>{n.label}</span>
              {status === 'running' && fileLocation === n.id && (
                <span
                  className={clsx(
                    styles.fileBadge,
                    n.id === 'disk' && styles.fileDisk,
                    n.id === 'ram' && styles.fileRam,
                    n.id === 'cpu' && styles.fileCpu,
                  )}
                >
                  📄
                </span>
              )}
            </div>
          ))}
          <div className={clsx(styles.node, styles.nodeHidden)} aria-hidden />
        </div>
      </div>

      {log.length > 0 && (
        <div className={styles.log} role="log" aria-live="polite">
          {log.map((line, i) => (
            <div key={`${i}-${line}`} className={styles.logLine}>
              › {line}
            </div>
          ))}
        </div>
      )}

      <p className={styles.footer}>Анимированные связи показывают направление сигнала и перемещение данных</p>
    </DemoShell>
  );
}

export default ComputerBootSequenceInner;
