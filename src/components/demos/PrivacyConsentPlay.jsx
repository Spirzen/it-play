import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/PrivacyConsentPlay.module.css';

const OPTIONS = [
  {
    id: 'mic',
    label: 'Микрофон / голос',
    hint: 'Буфер + триггер "Окей"',
    data: ['аудиофрагмент', 'акцент', 'частота запросов'],
  },
  {
    id: 'geo',
    label: 'Геолокация',
    hint: 'GPS / Wi‑Fi positioning',
    data: ['координаты', 'часовой пояс', 'маршруты'],
  },
  {
    id: 'history',
    label: 'История и поиск',
    hint: 'Куки, clickstream',
    data: ['запросы', 'клики', 'интересы'],
  },
  {
    id: 'ads',
    label: 'Рекламный ID',
    hint: 'Кросс-приложенный трекинг',
    data: ['IDFA/GAID', 'ретаргетинг', 'look-alike'],
  },
];

function PrivacyConsentPlayInner() {
  const [consent, setConsent] = useState({
    mic: true,
    geo: false,
    history: true,
    ads: false,
  });

  const sent = useMemo(() => {
    const out = [];
    OPTIONS.forEach((o) => {
      if (consent[o.id]) out.push(...o.data);
    });
    return out;
  }, [consent]);

  const legalNote = useMemo(() => {
    const on = Object.values(consent).filter(Boolean).length;
    if (on === 0) {
      return 'Все сборы отключены — сервис может отказать в персонализации, но остаётся легальным при минимальной политике.';
    }
    if (on === 4) {
      return 'Максимальный сбор при согласии в EULA — легально, но этика и прозрачность требуют понятного UI и права на удаление данных (GDPR Art. 17).';
    }
    return `Передаётся ${sent.length} типов метаданных. Легальность зависит от информированного согласия; контролируемость — от настроек и экспорта данных.`;
  }, [consent, sent.length]);

  return (
    <DemoShell>
      <DemoCard
        title="Согласие и поток данных"
        subtitle="Переключите разрешения — посмотрите, что уходит на сервер поставщика"
      >
        <div className={styles.toggles}>
          {OPTIONS.map((o) => (
            <label key={o.id} className={styles.row}>
              <span className={styles.rowLabel}>
                {o.label}
                <span>{o.hint}</span>
              </span>
              <input
                type="checkbox"
                checked={consent[o.id]}
                onChange={(e) =>
                  setConsent((prev) => ({...prev, [o.id]: e.target.checked}))
                }
              />
            </label>
          ))}
        </div>

        <div className={styles.flow}>
          <div className={styles.box}>
            <strong>Устройство</strong>
            <br />
            {OPTIONS.map((o) =>
              o.data.map((d) => (
                <span
                  key={`${o.id}-${d}`}
                  className={clsx(styles.tag, !consent[o.id] && styles.tagBlocked)}
                >
                  {d}
                </span>
              )),
            )}
          </div>
          <span aria-hidden>→</span>
          <div className={clsx(styles.box, styles.boxCloud)}>
            <strong>Облако сервиса</strong>
            <br />
            {sent.length ? (
              sent.map((d) => (
                <span key={d} className={styles.tag}>
                  {d}
                </span>
              ))
            ) : (
              <span className={styles.tag}>только тех. heartbeat</span>
            )}
          </div>
        </div>

        <p className={styles.legal}>{legalNote}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default PrivacyConsentPlayInner;
