import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/FirewallPlay.module.css';

const SERVER_IP = '203.0.113.10';
const MALICIOUS_IP = '198.51.100.66';

const RULES = [
  {id: 'established', text: 'ct state established,related', action: 'ACCEPT'},
  {id: 'blacklist', text: `-s ${MALICIOUS_IP}`, action: 'DROP'},
  {id: 'http', text: 'tcp dport 80', action: 'ACCEPT'},
  {id: 'default', text: '* (всё остальное)', action: 'DROP'},
];

const SCENARIOS = [
  {
    id: 'allow-http',
    title: 'Разрешённый HTTP',
    short: 'Порт 80',
    subtitle: 'Пакет совпал с правилом — трафик проходит на сервер',
    steps: [
      {
        spotlight: ['external'],
        packet: 'out',
        matchedRule: null,
        label: 'Клиент открывает сайт',
        detail: `GET / → ${SERVER_IP}:80 (TCP SYN)`,
        log: 'Запрос из интернета к веб-серверу',
      },
      {
        spotlight: ['firewall'],
        packet: 'check',
        matchedRule: 'http',
        label: 'Файерволл проверяет правила',
        detail: 'Сверху вниз: established — нет; blacklist — нет; tcp dport 80 — совпало',
        log: 'Первое совпадение → ACCEPT, дальше не смотрим',
      },
      {
        spotlight: ['server'],
        packet: 'in',
        matchedRule: 'http',
        label: 'Пакет дошёл до сервера',
        detail: 'nginx принимает соединение на 0.0.0.0:80',
        log: 'Разрешённый входящий трафик',
      },
      {
        spotlight: ['external', 'server'],
        packet: 'out',
        matchedRule: 'established',
        label: 'Ответ HTML возвращается',
        detail: 'Обратный трафик — по правилу established,related',
        log: 'Stateful-файерволл помнит сессию',
      },
    ],
  },
  {
    id: 'blocked-port',
    title: 'Закрытый порт',
    short: 'Порт 3389',
    subtitle: 'Нет подходящего правила — срабатывает политика по умолчанию (DROP)',
    steps: [
      {
        spotlight: ['external'],
        packet: 'out',
        matchedRule: null,
        label: 'Сканер стучится в RDP',
        detail: `TCP SYN → ${SERVER_IP}:3389`,
        log: 'Попытка удалённого рабочего стола',
      },
      {
        spotlight: ['firewall'],
        packet: 'blocked',
        matchedRule: 'default',
        label: 'Правила не совпали',
        detail: '80 — нет; blacklist — нет; дошли до * → DROP',
        log: 'Пакет молча отброшен, ответа нет',
      },
      {
        spotlight: ['external'],
        packet: 'blocked',
        matchedRule: 'default',
        label: 'Соединение не установлено',
        detail: 'Отправитель видит таймаут (типично для DROP)',
        log: 'Сервер даже не получил пакет',
      },
    ],
  },
  {
    id: 'blocked-ip',
    title: 'Чёрный список',
    short: 'Bad IP',
    subtitle: 'Блокировка по IP срабатывает раньше разрешения порта',
    steps: [
      {
        spotlight: ['external'],
        packet: 'out',
        matchedRule: null,
        label: 'Вредоносный хост шлёт трафик',
        detail: `Источник ${MALICIOUS_IP} → ${SERVER_IP}:80`,
        log: 'Даже на "открытый" порт 80',
      },
      {
        spotlight: ['firewall'],
        packet: 'blocked',
        matchedRule: 'blacklist',
        label: 'Сработало правило blacklist',
        detail: `-s ${MALICIOUS_IP} → DROP (правило выше, чем dport 80)`,
        log: 'Специфичные правила должны быть выше общих',
      },
      {
        spotlight: ['server'],
        packet: 'blocked',
        matchedRule: 'blacklist',
        label: 'Сервер защищён',
        detail: 'Пакет не прошёл через файерволл',
        log: 'Типичная защита от известных вредоносных IP',
      },
    ],
  },
  {
    id: 'stateful',
    title: 'Установленная сессия',
    short: 'Stateful',
    subtitle: 'Ответ на исходящее соединение разрешён без отдельного inbound-правила',
    steps: [
      {
        spotlight: ['server'],
        packet: 'out',
        matchedRule: null,
        label: 'Сервер сам запросил API',
        detail: 'Исходящий GET api.example.com:443 — сессия открыта изнутри',
        log: 'Правило "разрешить входящие на 443" не нужно',
      },
      {
        spotlight: ['external', 'firewall'],
        packet: 'out',
        matchedRule: null,
        label: 'Приходит ответ из интернета',
        detail: 'TCP ACK + данные → сервер (часть той же сессии)',
        log: 'Входящий пакет, но это не "новое" соединение',
      },
      {
        spotlight: ['firewall'],
        packet: 'check',
        matchedRule: 'established',
        label: 'Правило established сработало',
        detail: 'ct state established,related → ACCEPT (первое в списке)',
        log: 'Stateful-фильтрация отсекает случайный inbound',
      },
      {
        spotlight: ['server'],
        packet: 'in',
        matchedRule: 'established',
        label: 'Ответ доставлен приложению',
        detail: 'curl / wget получает JSON без открытия порта 443 снаружи',
        log: 'Только ответы на уже начатые сессии',
      },
    ],
  },
];

function FirewallPlayInner() {
  const [scenarioId, setScenarioId] = useState('allow-http');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const [matchedRule, setMatchedRule] = useState(null);
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
    setPacket(null);
    setMatchedRule(null);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight);
      setPacket(step.packet ?? null);
      setMatchedRule(step.matchedRule ?? null);
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

  const externalLabel =
    scenarioId === 'blocked-ip'
      ? `Ботнет ${MALICIOUS_IP}`
      : scenarioId === 'stateful'
        ? 'api.example.com'
        : scenarioId === 'blocked-port'
          ? 'Сканер портов'
          : 'Пользователь в браузере';

  const externalDetail =
    scenarioId === 'allow-http'
      ? `→ ${SERVER_IP}:80`
      : scenarioId === 'blocked-port'
        ? `→ ${SERVER_IP}:3389`
        : scenarioId === 'blocked-ip'
          ? `→ ${SERVER_IP}:80`
          : scenarioId === 'stateful'
            ? '← ответ HTTPS'
            : '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как файерволл принимает решение"
        subtitle="Четыре сценария: правило, DROP, blacklist и stateful-сессия"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии файерволла">
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

        <div className={styles.diagram} aria-label="Схема: интернет — файерволл — сервер">
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
              <span className={styles.nodeName}>{externalLabel}</span>
              <span className={styles.nodeRole}>{externalDetail}</span>
            </div>
          </section>

          <div className={styles.connector} aria-hidden>
            <span
              className={clsx(
                styles.connectorLine,
                packet === 'out' && styles.connectorPulseDown,
                packet === 'in' && styles.connectorPulseUp,
                packet === 'blocked' && styles.connectorBlocked,
                packet === 'check' && styles.connectorCheck,
              )}
            />
            <span className={styles.connectorLabel}>
              {packet === 'blocked' ? '✕ DROP' : packet === 'check' ? 'Проверка' : 'INPUT'}
            </span>
          </div>

          <section
            className={clsx(styles.zone, styles.zoneFirewall, isActive('firewall') && styles.zoneActive)}
          >
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🛡️</span>
              <span className={styles.zoneLabel}>Файерволл (INPUT)</span>
            </header>
            <ul className={styles.rulesList} aria-label="Правила chain input">
              {RULES.map((rule, i) => (
                <li
                  key={rule.id}
                  className={clsx(
                    styles.ruleRow,
                    matchedRule === rule.id && styles.ruleRowMatch,
                    matchedRule && matchedRule !== rule.id && styles.ruleRowDim,
                  )}
                >
                  <span className={styles.ruleNum}>{i + 1}</span>
                  <code className={styles.ruleText}>{rule.text}</code>
                  <span
                    className={clsx(
                      styles.ruleAction,
                      rule.action === 'ACCEPT' ? styles.ruleAccept : styles.ruleDrop,
                    )}
                  >
                    {rule.action}
                  </span>
                </li>
              ))}
            </ul>
            {packet === 'blocked' && isActive('firewall') && (
              <span className={styles.blockBadge}>Пакет отброшен</span>
            )}
          </section>

          <div className={styles.connector} aria-hidden>
            <span
              className={clsx(
                styles.connectorLine,
                packet === 'in' && styles.connectorPulseDown,
                packet === 'out' && styles.connectorPulseUp,
                packet === 'blocked' && styles.connectorBlocked,
                packet === 'check' && styles.connectorCheck,
              )}
            />
            <span className={styles.connectorLabel}>LAN / DMZ</span>
          </div>

          <section
            className={clsx(styles.zone, styles.zoneServer, isActive('server') && styles.zoneActive)}
          >
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🖥️</span>
              <span className={styles.zoneLabel}>Сервер</span>
              <span className={styles.zoneIp}>{SERVER_IP}</span>
            </header>
            <div
              className={clsx(
                styles.serverNode,
                isActive('server') && styles.nodeActive,
                packet === 'blocked' && isActive('server') && styles.nodeBlocked,
              )}
            >
              <span className={styles.nodeName}>Веб-сервер / хост</span>
              <span className={styles.nodeRole}>
                {scenarioId === 'stateful' ? 'исходящий → api:443' : 'слушает :80'}
              </span>
              {scenarioId !== 'stateful' && scenarioId !== 'blocked-port' && (
                <span className={styles.serverPort}>:80</span>
              )}
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
          Правила читаются сверху вниз: при первом совпадении выполняется действие. Политика "запретить
          всё, разрешить явно" — как в примере nftables из статьи.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default FirewallPlayInner;
