import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/ComputerArchitecturePlay.module.css';

/** Узлы "кабинета" — метафора из статьи 7.md */
const NODES = [
  {id: 'bp', label: 'БП', role: 'Свет', icon: '⚡', grid: 'span4'},
  {id: 'mb', label: 'МП', role: 'Начальник', icon: '🎛️'},
  {id: 'bios', label: 'BIOS', role: 'Завхоз', icon: '🗂️'},
  {id: 'arch', label: 'Архив', role: 'SSD/HDD', icon: '💾'},
  {id: 'os', label: 'ОС', role: 'Инструкция', icon: '📋'},
  {id: 'ram', label: 'ОЗУ', role: 'Стол', icon: '🪑'},
  {id: 'cpu', label: 'CPU', role: 'Работник', icon: '👷'},
  {id: 'input', label: 'Вход', role: 'Дверь', icon: '🚪'},
  {id: 'gpu', label: 'GPU', role: 'Художник', icon: '🎨'},
  {id: 'vram', label: 'VRAM', role: 'Мольберт', icon: '🖼️'},
  {id: 'sound', label: 'Звук', role: 'Музыкант', icon: '🎵'},
  {id: 'output', label: 'Выход', role: 'Монитор', icon: '🖥️'},
  {id: 'net', label: 'Сеть', role: 'Курьер', icon: '📡'},
  {id: 'ports', label: 'USB', role: 'Окна', icon: '🪟'},
];

const ACTS = [
  {
    id: 'power',
    title: 'Акт I — Включили свет',
    spectacle:
      'В кабинете включили свет, начальник проверил, все ли на месте; завхоз решает, с чего начать — с архива.',
    reality:
      'Блок питания подаёт ток; материнская плата выполняет POST; BIOS/UEFI выбирает источник загрузки (диск).',
    spotlight: ['bp', 'mb', 'bios', 'arch'],
    duration: 3200,
  },
  {
    id: 'boot',
    title: 'Акт II — Рабочий день',
    spectacle:
      'Архивариус передал инструкции для кабинета на стол; работник сразу ознакомился; руководство осталось под рукой.',
    reality:
      'Загрузка ОС: диск передаёт систему в ОЗУ; процессор выполняет инструкции; драйверы остаются в памяти.',
    spotlight: ['arch', 'os', 'ram', 'cpu'],
    duration: 3400,
  },
  {
    id: 'input',
    title: 'Акт III — Новый документ',
    spectacle:
      'Документ внесли через входную дверь; работник прочитал задачу, сходил в архив и положил дело на стол; краткие тезисы — в блокнотик.',
    reality:
      'Клавиатура/мышь → процессор ищет файл на диске → часть в ОЗУ; избыток остаётся на диске; кэш L1/L2/L3.',
    spotlight: ['input', 'cpu', 'arch', 'ram'],
    duration: 3600,
  },
  {
    id: 'process',
    title: 'Акт IV — Подготовка ответа',
    spectacle:
      'С текстом справляется сам работник; для картины зовёт художника (мольберт); для мелодии — музыканта.',
    reality:
      'CPU обрабатывает данные; GPU считает кадры в VRAM; звуковая карта готовит аудио; CPU координирует всех.',
    spotlight: ['cpu', 'gpu', 'vram', 'sound'],
    duration: 3400,
  },
  {
    id: 'cleanup',
    title: 'Акт V — Уборка',
    spectacle:
      'Работник убирает лишнее со стола в архив; если стол завален — часть во временный ящик; при отключении света всё со стола пропадёт.',
    reality:
      'Очистка ОЗУ, сохранение на диск; при переполнении — файл подкачки (swap); при сбое питания данные в RAM теряются.',
    spotlight: ['cpu', 'ram', 'arch'],
    duration: 3000,
  },
  {
    id: 'output',
    title: 'Акт VI — Ответ заявителю',
    spectacle:
      'Картину — в выходную дверь №1, мелодию — в дверь №2; документы можно отдать курьеру; у окон ждут наёмные рабочие.',
    reality:
      'Изображение на монитор (HDMI/DP); звук на колонки; сетевой адаптер отправляет пакеты; USB подключает устройства.',
    spotlight: ['gpu', 'output', 'sound', 'net', 'ports'],
    duration: 3600,
  },
  {
    id: 'shutdown',
    title: 'Акт VII — Конец дня',
    spectacle:
      'Всё убрали в архив; начальник спросил — все закончили? Свет выключили, все отдыхают.',
    reality:
      'ОС и CPU сохраняют данные на диск; процессы завершены; блок питания отключает компоненты.',
    spotlight: ['cpu', 'arch', 'mb', 'bp'],
    duration: 3200,
  },
];

function ComputerArchitecturePlayInner() {
  const [phase, setPhase] = useState('idle');
  const [actIndex, setActIndex] = useState(-1);
  const [paused, setPaused] = useState(false);
  const [lit, setLit] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [log, setLog] = useState([]);
  const timers = useRef([]);
  const pausedRef = useRef(false);
  const phaseRef = useRef('idle');

  const pushLog = useCallback((msg) => {
    setLog((prev) => [...prev.slice(-6), msg]);
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

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const playAct = useCallback(
    (index) => {
      if (phaseRef.current === 'idle') return;
      const act = ACTS[index];
      if (!act) return;

      setActIndex(index);
      setSpotlight(act.spotlight);
      pushLog(`🎭 ${act.title}`);

      const advance = () => {
        if (phaseRef.current !== 'playing') return;
        if (pausedRef.current) {
          schedule(advance, 200);
          return;
        }
        if (index < ACTS.length - 1) {
          playAct(index + 1);
        } else {
          setPhase('done');
          setLit(false);
          setSpotlight([]);
          pushLog('Занавес. Компьютер в покое.');
        }
      };
      schedule(advance, act.duration);
    },
    [pushLog, schedule],
  );

  const startPlay = () => {
    clearTimers();
    setPaused(false);
    setPhase('playing');
    setLit(true);
    setActIndex(-1);
    setLog([]);
    setSpotlight([]);
    pushLog('🎬 Занавес поднят — начинаем спектакль');
    schedule(() => playAct(0), 500);
  };

  const reset = () => {
    clearTimers();
    setPhase('idle');
    setPaused(false);
    setLit(false);
    setActIndex(-1);
    setSpotlight([]);
    setLog([]);
  };

  const togglePause = () => {
    if (phase !== 'playing') return;
    setPaused((p) => !p);
  };

  const currentAct = actIndex >= 0 ? ACTS[actIndex] : null;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Спектакль &quot;Кабинет-компьютер&quot;"
        subtitle="Включите свет и пройдите все 7 актов — от POST до выключения"
      >
        <div aria-label="Акты спектакля" className={styles.actProgress}>
          {ACTS.map((act, i) => (
            <span
              key={act.id}
              className={clsx(
                styles.actDot,
                i < actIndex && styles.actDotDone,
                i === actIndex && phase === 'playing' && styles.actDotActive,
                phase === 'done' && styles.actDotDone,
              )}
              title={act.title}
            >
              {i + 1}
            </span>
          ))}
        </div>

        <div className={styles.stageFrame}>
          <span className={styles.stageLabel}>Кабинет (ПК)</span>
          <div className={styles.grid}>
            {NODES.map((n) => (
              <div
                key={n.id}
                className={clsx(
                  styles.node,
                  n.grid === 'span4' && styles.span4,
                  lit ? styles.nodeLit : styles.nodeOff,
                  spotlight.includes(n.id) && styles.nodeSpotlight,
                )}
              >
                <span className={styles.nodeIcon}>{n.icon}</span>
                <span>{n.label}</span>
                <span className={styles.nodeRole}>{n.role}</span>
              </div>
            ))}
          </div>
        </div>

        {currentAct && phase === 'playing' && (
          <div className={styles.narration}>
            <div className={clsx(styles.narrationBlock, styles.narrationSpectacle)}>
              <span className={styles.narrationLabel}>На сцене</span>
              {currentAct.spectacle}
            </div>
            <div className={clsx(styles.narrationBlock, styles.narrationReality)}>
              <span className={styles.narrationLabel}>В железе</span>
              {currentAct.reality}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className={styles.narration}>
            <div className={clsx(styles.narrationBlock, styles.narrationSpectacle)}>
              <span className={styles.narrationLabel}>Итог</span>
              Команда отработала слаженно: каждый компонент знает свою роль. Слабое звено тормозит
              всех — как в любом коллективе.
            </div>
          </div>
        )}

        <div className={styles.controls}>
          {phase === 'idle' && (
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={startPlay}>
              Включить свет — начать спектакль
            </button>
          )}
          {phase === 'playing' && (
            <>
              <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={togglePause}>
                {paused ? 'Продолжить' : 'Пауза'}
              </button>
              <span className="it-demo__badge it-demo__badge--active">
                {currentAct?.title ?? 'Подготовка…'}
              </span>
            </>
          )}
          {phase === 'done' && (
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reset}>
              Повторить спектакль
            </button>
          )}
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

        <p className={styles.footer}>
          Подсвеченные ячейки соответствуют участникам акта из таблицы "Спектакль" в статье
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ComputerArchitecturePlayInner;
