import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/PortForwardingPlay.module.css';

const PUBLIC_IP = '203.0.113.5';
const SERVER_IP = '192.168.1.100';
const EXTERNAL_PORT = '8080';
const INTERNAL_PORT = '80';

const LAN_DEVICES = [
  {id: 'phone', label: 'Телефон', ip: '192.168.1.15', icon: '📱'},
  {id: 'pc', label: 'ПК (веб-сервер)', ip: SERVER_IP, icon: '💻', server: true},
  {id: 'tv', label: 'Телевизор', ip: '192.168.1.20', icon: '📺'},
];

const SCENARIOS = [
  {
    id: 'outgoing',
    title: 'Исходящее соединение',
    short: 'В интернет',
    subtitle: 'NAT подменяет адрес источника и помнит сессию в таблице',
    forwardRule: false,
    steps: [
      {
        spotlight: ['pc'],
        packet: 'out',
        label: 'ПК открывает сайт',
        detail: `GET example.com:443 с ${SERVER_IP}:54321`,
        log: 'Исходящий запрос из локальной сети',
      },
      {
        spotlight: ['router'],
        packet: 'nat',
        label: 'Роутер применяет NAT',
        detail: `Источник: ${SERVER_IP}:54321 → ${PUBLIC_IP}:50001. Запись в NAT-таблице`,
        log: 'Консьерж меняет обратный адрес на публичный',
      },
      {
        spotlight: ['external'],
        packet: 'out',
        label: 'Пакет уходит в интернет',
        detail: 'Сервер видит только публичный IP роутера',
        log: 'Почтальон доставляет запрос "на адрес дома"',
      },
      {
        spotlight: ['router', 'pc'],
        packet: 'in',
        label: 'Ответ возвращается',
        detail: 'По NAT-таблице роутер отдаёт пакет ПК в квартиру 100',
        log: 'Входящий ответ разрешён — сессия уже открыта изнутри',
      },
    ],
  },
  {
    id: 'blocked',
    title: 'Входящее без проброса',
    short: 'Заблокировано',
    subtitle: 'Роутер отбрасывает чужие входящие соединения',
    forwardRule: false,
    steps: [
      {
        spotlight: ['external'],
        packet: 'in',
        label: 'Друг открывает сайт',
        detail: `Браузер: http://${PUBLIC_IP}:${EXTERNAL_PORT}`,
        log: 'Внешний клиент стучится на порт роутера',
      },
      {
        spotlight: ['router'],
        packet: 'blocked',
        label: 'Пакет на WAN-порт',
        detail: `TCP SYN → ${PUBLIC_IP}:${EXTERNAL_PORT}. Статического правила нет`,
        log: 'Консьерж: "входящих без приглашения не пускаю"',
      },
      {
        spotlight: ['router'],
        packet: 'blocked',
        label: 'NAT не знает, куда слать',
        detail: 'Нет записи в NAT-таблице и нет правила port forward',
        log: 'Пакет отброшен (DROP)',
      },
      {
        spotlight: ['external'],
        packet: 'blocked',
        label: 'Соединение не установлено',
        detail: 'ПК с веб-сервером даже не получил запрос',
        log: 'Друг видит таймаут или "сайт недоступен"',
      },
    ],
  },
  {
    id: 'forward',
    title: 'Проброс портов',
    short: '8080 → 80',
    subtitle: `Правило: внешний :${EXTERNAL_PORT} → ${SERVER_IP}:${INTERNAL_PORT}`,
    forwardRule: true,
    steps: [
      {
        spotlight: ['external'],
        packet: 'in',
        label: 'Друг открывает сайт',
        detail: `http://${PUBLIC_IP}:${EXTERNAL_PORT} — снаружи порт ${EXTERNAL_PORT}`,
        log: 'Запрос приходит на публичный IP роутера',
      },
      {
        spotlight: ['router'],
        packet: 'nat',
        label: 'Срабатывает правило проброса',
        detail: `${EXTERNAL_PORT} (WAN) → ${SERVER_IP}:${INTERNAL_PORT} (LAN)`,
        log: 'Явное исключение из политики "блокировать входящие"',
      },
      {
        spotlight: ['pc'],
        packet: 'in',
        label: 'Пакет на веб-сервер',
        detail: `nginx слушает 0.0.0.0:${INTERNAL_PORT} на ${SERVER_IP}`,
        log: 'Сервис внутри сети принимает соединение',
      },
      {
        spotlight: ['external', 'router', 'pc'],
        packet: 'out',
        label: 'Ответ HTML возвращается',
        detail: 'Роутер подменяет адрес обратно: LAN → WAN для друга',
        log: 'Сайт открывается у внешнего пользователя',
      },
    ],
  },
];

function PortForwardingPlayInner() {
  const [scenarioId, setScenarioId] = useState('blocked');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
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
    setPacket(null);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setPacket(step.packet ?? null);
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

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="NAT и проброс портов"
        subtitle="Три сценария: исходящий трафик, блокировка входящих и явное правило"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии NAT">
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

        <div className={styles.diagram} aria-label="Схема сети с NAT">
          <section
            className={clsx(styles.zone, styles.zoneExternal, isActive('external') && styles.zoneActive)}
          >
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🌐</span>
              <span className={styles.zoneLabel}>Интернет</span>
            </header>
            <div
              className={clsx(
                styles.externalNode,
                isActive('external') && styles.nodeActive,
                packet === 'blocked' && isActive('external') && styles.nodeBlocked,
              )}
            >
              <span className={styles.nodeName}>
                {scenarioId === 'outgoing' ? 'Сервер example.com' : 'Друг в браузере'}
              </span>
              <span className={styles.nodeRole}>
                {scenarioId === 'outgoing' ? 'Удалённый хост' : `→ ${PUBLIC_IP}:${EXTERNAL_PORT}`}
              </span>
            </div>
          </section>

          <div className={styles.connector} aria-hidden>
            <span
              className={clsx(
                styles.connectorLine,
                packet === 'out' && styles.connectorPulseDown,
                packet === 'in' && styles.connectorPulseUp,
                packet === 'blocked' && styles.connectorBlocked,
                packet === 'nat' && styles.connectorNat,
              )}
            />
            <span className={styles.connectorLabel}>
              {packet === 'blocked' ? '✕ DROP' : 'WAN'}
            </span>
          </div>

          <section
            className={clsx(styles.zone, styles.zoneRouter, isActive('router') && styles.zoneActive)}
          >
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🛡️</span>
              <span className={styles.zoneLabel}>Роутер (NAT)</span>
              <span className={styles.zoneIp}>{PUBLIC_IP}</span>
            </header>
            <div className={styles.routerBody}>
              <div className={styles.natTable}>
                <span className={styles.natTableTitle}>NAT / проброс</span>
                {scenario.forwardRule ? (
                  <code className={styles.natRule}>
                    :{EXTERNAL_PORT} → {SERVER_IP}:{INTERNAL_PORT}
                  </code>
                ) : (
                  <span className={styles.natMuted}>Статического правила нет</span>
                )}
              </div>
              {packet === 'blocked' && isActive('router') && (
                <span className={styles.blockBadge}>Входящее отклонено</span>
              )}
            </div>
          </section>

          <div className={styles.connector} aria-hidden>
            <span
              className={clsx(
                styles.connectorLine,
                packet === 'in' && styles.connectorPulseDown,
                packet === 'out' && styles.connectorPulseUp,
                packet === 'nat' && styles.connectorNat,
              )}
            />
            <span className={styles.connectorLabel}>LAN 192.168.1.0/24</span>
          </div>

          <section className={clsx(styles.zone, styles.zoneLan)}>
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🏠</span>
              <span className={styles.zoneLabel}>Домашняя сеть</span>
            </header>
            <div className={styles.lanGrid}>
              {LAN_DEVICES.map((d) => (
                <div
                  key={d.id}
                  className={clsx(
                    styles.lanDevice,
                    d.server && styles.lanDeviceServer,
                    isActive(d.id) && styles.nodeActive,
                  )}
                >
                  <span className={styles.lanIcon}>{d.icon}</span>
                  <span className={styles.nodeName}>{d.label}</span>
                  <span className={styles.nodeRole}>{d.ip}</span>
                  {d.server && (
                    <span className={styles.serverPort}>:{INTERNAL_PORT}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {currentStep && (
          <div className={styles.stepCard}>
            <span className={styles.stepBadge}>
              Шаг {stepIndex + 1} / {scenario.steps.length}
            </span>
            <p className={styles.stepTitle}>{currentStep.label}</p>
            <p className={styles.stepDetail}>{currentStep.detail}</p>
            {currentStep.log && <p className={styles.stepLog}>{currentStep.log}</p>}
          </div>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={playScenario}
            disabled={playing}
          >
            {playing ? 'Воспроизведение…' : 'Пройти сценарий'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => stepManual(-1)}
            disabled={playing || stepIndex <= 0}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => stepManual(1)}
            disabled={playing || stepIndex >= scenario.steps.length - 1}
          >
            Вперёд →
          </button>
          {stepIndex >= 0 && (
            <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          )}
        </div>

        <div className={styles.stepDots} aria-hidden>
          {scenario.steps.map((_, i) => (
            <span
              key={i}
              className={clsx(
                styles.stepDot,
                i <= stepIndex && styles.stepDotDone,
                i === stepIndex && styles.stepDotCurrent,
              )}
            />
          ))}
        </div>

        <p className={styles.footer}>
          Без проброса входящие соединения блокируются. С правилом роутер перенаправляет трафик на
          нужный хост внутри LAN — как в примере из статьи.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PortForwardingPlayInner;
