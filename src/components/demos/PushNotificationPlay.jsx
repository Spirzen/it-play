import React, {useCallback, useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/PushNotificationPlay.module.css';

const ACTORS = [
  {id: 'site', label: 'Сайт в браузере', role: 'Разрешение · токен', icon: '🌐'},
  {id: 'server', label: 'Сервер приложения', role: 'Хранит токены', icon: '🖥️'},
  {id: 'push', label: 'Push-сервис', role: 'FCM · Mozilla', icon: '☁️'},
  {id: 'sw', label: 'Service Worker', role: 'Событие push', icon: '⚙️'},
  {id: 'os', label: 'Уведомление ОС', role: 'Notifications API', icon: '🔔'},
];

const STEPS = [
  {
    spotlight: ['site'],
    label: 'Пользователь разрешает уведомления',
    detail:
      'Сайт вызывает Notification.requestPermission() после своей кнопки — не при первой загрузке.',
    packet: null,
  },
  {
    spotlight: ['site'],
    label: 'Браузер выдаёт push-токен',
    detail: 'Уникальный адрес доставки для этого устройства и профиля браузера.',
    packet: 'token',
  },
  {
    spotlight: ['site', 'server'],
    label: 'Токен сохраняется на сервере',
    detail: 'POST /api/push-subscribe — привязка токена к учётной записи пользователя.',
    packet: 'token',
  },
  {
    spotlight: ['server', 'push'],
    label: 'Сервер отправляет сообщение в облако',
    detail:
      'Сервер подписывает запрос и передаёт токен + payload в Firebase / Mozilla Push.',
    packet: 'out',
  },
  {
    spotlight: ['push', 'sw'],
    label: 'Push-сервис будит браузер',
    detail:
      'Соединение с сайтом разорвано — посредник доставляет сигнал по web push protocol.',
    packet: 'in',
  },
  {
    spotlight: ['sw'],
    label: 'Service Worker: событие push',
    detail:
      'Фоновый скрипт просыпается, читает payload и решает, показывать ли уведомление.',
    packet: null,
  },
  {
    spotlight: ['sw', 'os'],
    label: 'showNotification() на экране',
    detail:
      'self.registration.showNotification(title, { body, icon, data }) — даже при закрытой вкладке.',
    packet: null,
    showToast: true,
  },
];

const SAMPLE_NOTIFICATION = {
  title: 'Новое сообщение',
  body: 'Вам ответили в чате',
  site: 'example.ru',
};

function PushNotificationPlayInner() {
  const [stepIndex, setStepIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [spotlight, setSpotlight] = useState([]);
  const [packet, setPacket] = useState(null);
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [permission, setPermission] = useState('default');
  const timers = useRef([]);

  const currentStep = stepIndex >= 0 ? STEPS[stepIndex] : null;
  const showToast = Boolean(currentStep?.showToast);

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
    setPermissionOpen(false);
    setPermission('default');
  }, [clearTimers]);

  const applyStep = useCallback((index) => {
    const step = STEPS[index];
    if (!step) return;
    setStepIndex(index);
    setSpotlight(step.spotlight);
    setPacket(step.packet ?? null);
  }, []);

  const playFlow = useCallback(() => {
    clearTimers();
    setPlaying(true);
    setStepIndex(-1);
    setSpotlight([]);
    setPacket(null);
    const run = (i) => {
      applyStep(i);
      if (i < STEPS.length - 1) {
        schedule(() => run(i + 1), 2200);
      } else {
        schedule(() => setPlaying(false), 2200);
      }
    };
    schedule(() => run(0), 300);
  }, [applyStep, clearTimers, schedule]);

  const stepManual = (delta) => {
    if (playing) return;
    const next = Math.max(0, Math.min(STEPS.length - 1, stepIndex + delta));
    applyStep(next);
  };

  const isActive = (id) => spotlight.includes(id);

  const openPermission = () => {
    if (playing || permission === 'granted') return;
    setPermissionOpen(true);
  };

  const resolvePermission = (value) => {
    setPermission(value);
    setPermissionOpen(false);
    if (value === 'granted' && stepIndex < 0) {
      applyStep(0);
    }
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Как работает web push"
        subtitle="Симуляция цепочки из статьи — без реальной рассылки и без доступа к вашим уведомлениям"
      >
        <div className={styles.pipeline} aria-label="Цепочка web push">
          {ACTORS.map((actor, i) => (
            <React.Fragment key={actor.id}>
              {i > 0 && (
                <div className={styles.link} aria-hidden>
                  <span
                    className={clsx(
                      styles.linkArrow,
                      packet === 'token' && actor.id === 'server' && styles.linkPulse,
                      packet === 'out' && actor.id === 'push' && styles.linkPulse,
                      packet === 'in' && actor.id === 'sw' && styles.linkPulse,
                    )}
                  />
                </div>
              )}
              <div
                className={clsx(styles.actor, isActive(actor.id) && styles.actorActive)}
              >
                <span className={styles.actorIcon}>{actor.icon}</span>
                <span className={styles.actorName}>{actor.label}</span>
                <span className={styles.actorRole}>{actor.role}</span>
              </div>
            </React.Fragment>
          ))}

          <div
            className={clsx(styles.toast, showToast && styles.toastVisible)}
            role="status"
            aria-live="polite"
            aria-hidden={!showToast}
          >
            <span className={styles.toastSite}>{SAMPLE_NOTIFICATION.site}</span>
            <strong className={styles.toastTitle}>{SAMPLE_NOTIFICATION.title}</strong>
            <span className={styles.toastBody}>{SAMPLE_NOTIFICATION.body}</span>
          </div>
        </div>

        {permissionOpen && (
          <div className={styles.permOverlay} role="presentation">
            <div
              className={styles.permDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="push-perm-title"
            >
              <p id="push-perm-title" className={styles.permTitle}>
                {SAMPLE_NOTIFICATION.site} хочет отправлять вам уведомления
              </p>
              <p className={styles.permHint}>Системный диалог браузера (учебная имитация)</p>
              <div className={styles.permActions}>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
                  onClick={() => resolvePermission('denied')}
                >
                  Заблокировать
                </button>
                <button
                  type="button"
                  className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
                  onClick={() => resolvePermission('granted')}
                >
                  Разрешить
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep && (
          <div className={styles.stepCard}>
            <span className={styles.stepBadge}>
              Шаг {stepIndex + 1} / {STEPS.length}
            </span>
            <p className={styles.stepTitle}>{currentStep.label}</p>
            <p className={styles.stepDetail}>{currentStep.detail}</p>
          </div>
        )}

        <div className={styles.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={openPermission}
            disabled={playing || permission === 'granted'}
          >
            {permission === 'granted' ? 'Разрешение дано ✓' : 'Запросить разрешение'}
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={playFlow}
            disabled={playing}
          >
            {playing ? 'Воспроизведение…' : 'Пройти все 7 шагов'}
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
            disabled={playing || stepIndex >= STEPS.length - 1}
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
          {STEPS.map((_, i) => (
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
          Сайт не шлёт push напрямую в браузер — только через push-сервис и Service Worker. Токен
          храните конфиденциально и отправляйте только релевантные события.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PushNotificationPlayInner;
