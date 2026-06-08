import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/EncryptionPlay.module.css';

const CLIENT_CIPHERS = [
  'chacha20-poly1305@openssh.com',
  'aes256-gcm@openssh.com',
  'aes128-ctr',
];
const SERVER_CIPHERS = ['aes128-ctr', 'aes256-gcm@openssh.com'];
const AGREED_CIPHER = 'aes256-gcm@openssh.com';

const SCENARIOS = [
  {
    id: 'plaintext',
    title: 'Без шифрования',
    short: 'Telnet',
    subtitle: 'Пароль и команды видны любому, кто слушает сеть',
    steps: [
      {
        spotlight: ['client'],
        wire: 'plain',
        payload: 'login: admin',
        label: 'Клиент подключается',
        detail: 'Telnet передаёт всё в открытом виде — без TLS и без SSH',
        log: 'Устаревшие протоколы так и работали',
      },
      {
        spotlight: ['client', 'network', 'attacker'],
        wire: 'plain',
        payload: 'PASSWORD=MySecret42',
        label: 'Пароль уходит в сеть',
        detail: 'Строка "PASSWORD=…" — обычный текст в TCP-пакете',
        log: 'Перехватчик на Wi‑Fi или у провайдера читает байты как есть',
      },
      {
        spotlight: ['attacker'],
        wire: 'plain',
        payload: 'PASSWORD=MySecret42',
        label: 'Перехват успешен',
        detail: 'Нет конфиденциальности: секрет скопирован за секунды',
        log: 'Именно поэтому Telnet заменили на SSH',
      },
      {
        spotlight: ['server'],
        wire: 'plain',
        payload: 'PASSWORD=MySecret42',
        label: 'Сервер получил пароль',
        detail: 'Аутентификация прошла, но канал не защищён',
        log: 'Целостность и подлинность тоже не гарантированы',
      },
    ],
  },
  {
    id: 'kex',
    title: 'Обмен ключами',
    short: 'KEX',
    subtitle: 'Диффи—Хеллман (или ECDH): общий секрет без передачи пароля по сети',
    steps: [
      {
        spotlight: ['client'],
        wire: 'kex',
        payload: 'client ephemeral → A_pub',
        label: 'Клиент генерирует временную пару',
        detail: 'curve25519-sha256: секрет остаётся только у клиента',
        log: 'Публичная часть можно отправлять открыто',
        sessionKey: false,
      },
      {
        spotlight: ['client', 'network', 'server'],
        wire: 'kex',
        payload: 'A_pub  ———→',
        label: 'Обмен публичными значениями',
        detail: 'Перехват A_pub и B_pub не даёт восстановить секрет',
        log: 'Свойство Диффи—Хеллмана',
        sessionKey: false,
      },
      {
        spotlight: ['server'],
        wire: 'kex',
        payload: '←———  B_pub',
        label: 'Сервер отвечает своей публичной частью',
        detail: 'Алгоритм тот же: curve25519-sha256 или DH-group-exchange',
        log: 'Симметрично с шагом клиента',
        sessionKey: false,
      },
      {
        spotlight: ['client', 'server'],
        wire: 'derive',
        payload: 'K_sess = KDF(A, B, hash)',
        label: 'Обе стороны вычисляют сессионный ключ',
        detail: 'Из общего секрета хешем получают ключи шифрования и MAC',
        log: 'Дальше весь трафик — только симметричным шифром',
        sessionKey: true,
      },
    ],
  },
  {
    id: 'encrypted',
    title: 'Зашифрованная сессия',
    short: 'SSH',
    subtitle: 'Согласование cipher, шифрование пакетов, перехватчик видит "шум"',
    steps: [
      {
        spotlight: ['client', 'server'],
        wire: 'negotiate',
        payload: `cipher: ${AGREED_CIPHER}`,
        label: 'Согласование алгоритмов',
        detail: `Клиент: ${CLIENT_CIPHERS[0]}, … → сервер поддерживает ${SERVER_CIPHERS.join(', ')} → выбран ${AGREED_CIPHER}`,
        log: 'Первый общий алгоритм из списка клиента',
        sessionKey: true,
        showCipherLists: true,
      },
      {
        spotlight: ['client'],
        wire: 'encrypt',
        payload: 'systemctl status nginx',
        label: 'Команда перед отправкой',
        detail: 'Открытый текст только на стороне клиента',
        log: 'Пакет: length | seq | payload | tag (AEAD)',
        sessionKey: true,
      },
      {
        spotlight: ['network', 'attacker'],
        wire: 'cipher',
        payload: 'a7:f3:9c:… e2:01:8b | poly1305 tag',
        label: 'В сети — только шифротекст',
        detail: 'Перехватчик не видит "systemctl" и не может подменить данные незаметно',
        log: 'Конфиденциальность + целостность (AEAD)',
        sessionKey: true,
      },
      {
        spotlight: ['server'],
        wire: 'decrypt',
        payload: 'systemctl status nginx',
        label: 'Сервер расшифровал пакет',
        detail: 'Тот же K_sess; ответ "active (running)" тоже шифруется обратно',
        log: 'Так работает защищённый канал SSH',
        sessionKey: true,
      },
    ],
  },
];

function EncryptionPlayInner() {
  const [scenarioId, setScenarioId] = useState('encrypted');
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [wire, setWire] = useState(null);
  const [payload, setPayload] = useState('');
  const [sessionKey, setSessionKey] = useState(false);
  const [showCipherLists, setShowCipherLists] = useState(false);
  const timers = useRef([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[2];
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
    setWire(null);
    setPayload('');
    setSessionKey(false);
    setShowCipherLists(false);
  }, [clearTimers]);

  const applyStep = useCallback(
    (index) => {
      const step = scenario.steps[index];
      if (!step) return;
      setStepIndex(index);
      setSpotlight(step.spotlight ?? []);
      setWire(step.wire ?? null);
      setPayload(step.payload ?? '');
      setSessionKey(Boolean(step.sessionKey));
      setShowCipherLists(Boolean(step.showCipherLists));
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

  const wireClass =
    wire === 'plain'
      ? styles.wirePlain
      : wire === 'cipher'
        ? styles.wireCipher
        : wire === 'kex' || wire === 'derive' || wire === 'negotiate'
          ? styles.wireKex
          : wire === 'encrypt' || wire === 'decrypt'
            ? styles.wireSecure
            : '';

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как работает шифрование в SSH"
        subtitle="Три сценария: открытый канал, обмен ключами и защищённый трафик"
      >
        <div className={styles.scenarioTabs} role="tablist" aria-label="Сценарии шифрования">
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

        <div className={styles.diagram} aria-label="Клиент, сеть и сервер">
          <section
            className={clsx(styles.zone, styles.zoneClient, isActive('client') && styles.zoneActive)}
          >
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>💻</span>
              <span className={styles.zoneLabel}>Клиент SSH</span>
            </header>
            {sessionKey && (
              <div className={styles.keyBadge} title="Сессионный ключ">
                🔑 K_sess
              </div>
            )}
            <div className={clsx(styles.node, isActive('client') && styles.nodeActive)}>
              <span className={styles.nodeName}>ssh user@host</span>
              <span className={styles.nodeRole}>
                {scenarioId === 'plaintext' ? 'telnet user@host' : 'OpenSSH client'}
              </span>
            </div>
          </section>

          <div className={styles.wireColumn}>
            <div
              className={clsx(
                styles.wireBox,
                wireClass,
                (isActive('network') || isActive('attacker')) && styles.wireBoxActive,
              )}
            >
              <span className={styles.wireLabel}>Канал связи</span>
              {payload ? (
                <code className={styles.wirePayload}>{payload}</code>
              ) : (
                <span className={styles.wireEmpty}>Нажмите "Пройти сценарий"</span>
              )}
              {wire === 'plain' && <span className={styles.wireTagDanger}>открытый текст</span>}
              {wire === 'cipher' && <span className={styles.wireTagSafe}>шифротекст</span>}
              {(wire === 'kex' || wire === 'derive') && (
                <span className={styles.wireTagKex}>обмен ключами</span>
              )}
            </div>

            <div
              className={clsx(
                styles.attacker,
                isActive('attacker') && styles.attackerActive,
                wire === 'cipher' && styles.attackerBlind,
              )}
            >
              <span className={styles.attackerIcon}>👁️</span>
              <span className={styles.attackerLabel}>Перехватчик</span>
              <span className={styles.attackerStatus}>
                {wire === 'plain'
                  ? 'Видит пароль'
                  : wire === 'cipher'
                    ? 'Только "шум"'
                    : wire === 'kex' || wire === 'derive'
                      ? 'Не восстановит K_sess'
                      : '—'}
              </span>
            </div>
          </div>

          <section
            className={clsx(styles.zone, styles.zoneServer, isActive('server') && styles.zoneActive)}
          >
            <header className={styles.zoneHeader}>
              <span className={styles.zoneIcon}>🖥️</span>
              <span className={styles.zoneLabel}>Сервер sshd</span>
            </header>
            {sessionKey && (
              <div className={styles.keyBadge} title="Тот же сессионный ключ">
                🔑 K_sess
              </div>
            )}
            <div className={clsx(styles.node, isActive('server') && styles.nodeActive)}>
              <span className={styles.nodeName}>Порт 22</span>
              <span className={styles.nodeRole}>Демон OpenSSH</span>
            </div>
          </section>
        </div>

        {showCipherLists && (
          <div className={styles.cipherPanel}>
            <div className={styles.cipherCol}>
              <span className={styles.cipherHeading}>Клиент предлагает</span>
              <ul className={styles.cipherList}>
                {CLIENT_CIPHERS.map((c) => (
                  <li
                    key={c}
                    className={clsx(c === AGREED_CIPHER && styles.cipherChosen)}
                  >
                    {c}
                    {c === AGREED_CIPHER && ' ✓'}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.cipherCol}>
              <span className={styles.cipherHeading}>Сервер поддерживает</span>
              <ul className={styles.cipherList}>
                {SERVER_CIPHERS.map((c) => (
                  <li
                    key={c}
                    className={clsx(c === AGREED_CIPHER && styles.cipherChosen)}
                  >
                    {c}
                    {c === AGREED_CIPHER && ' ✓'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

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
          Упрощённая схема из раздела про шифрование трафика: KEX → сессионный ключ → симметричный
          cipher (например ChaCha20-Poly1305 или AES-GCM). Реальная криптография сложнее, но идея та
          же.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default EncryptionPlayInner;
