import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PlayControls, PlayMetrics, PlayStack, PlayToggle} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const STEPS = [
  {title: 'URL → DNS', detail: 'A/AAAA запрос, кэш ОС/браузера', ms: 35, icon: '🔍'},
  {title: 'TCP handshake', detail: 'SYN → SYN-ACK → ACK на :443', ms: 45, icon: '🤝'},
  {title: 'TLS', detail: 'ClientHello, сертификат, ключ сессии', ms: 80, icon: '🔐'},
  {title: 'HTTP GET', detail: 'GET / — запрос HTML', ms: 25, icon: '📄'},
  {title: 'Parse HTML', detail: 'DOM, обнаружены CSS/JS/img', ms: 40, icon: '🧩'},
  {title: 'Subresources', detail: 'Параллельные запросы (HTTP/2)', ms: 120, icon: '📦'},
  {title: 'First Paint', detail: 'Страница отрисована', ms: 15, icon: '🎨'},
];

export default function WebsiteLoadTimelinePlay() {
  const [step, setStep] = useState(0);
  const [dnsCached, setDnsCached] = useState(false);
  const [cdn, setCdn] = useState(false);

  const elapsed = STEPS.slice(0, step + 1).reduce(
    (sum, s, i) => sum + (i === 0 && dnsCached ? s.ms * 0.2 : s.ms) * (i >= 5 && cdn ? 0.5 : 1),
    0,
  );

  const reset = useCallback(() => setStep(0), []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Таймлайн загрузки сайта" subtitle="От DNS до First Paint — шаг за шагом">
        <PlayStack>
          <PlayToggle label="DNS в кэше" hint="Пропуск полного DNS-lookup" checked={dnsCached} onChange={setDnsCached} />
          <PlayToggle label="Статика с CDN" hint="Ближе к пользователю, меньше RTT" checked={cdn} onChange={setCdn} />

          <div className={styles.timeline} role="list">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="listitem"
                className={clsx(
                  styles.timelineStep,
                  i === step && styles.timelineStepActive,
                  i < step && styles.timelineStepDone,
                )}
                onClick={() => setStep(i)}
              >
                <span className={styles.timelineNum}>{i + 1}</span>
                <div>
                  <strong>
                    {s.icon} {s.title}
                  </strong>
                  <div className={styles.panelSub}>{s.detail}</div>
                  <span className={styles.sectionLabel}>
                    ~{Math.round((i === 0 && dnsCached ? s.ms * 0.2 : s.ms) * (i >= 5 && cdn ? 0.5 : 1))} ms
                  </span>
                </div>
              </button>
            ))}
          </div>

          <PlayMetrics
            grid
            items={[
              {label: 'Прошло времени', value: Math.round(elapsed), max: 500, display: `${Math.round(elapsed)} ms`},
              {label: 'Шагов выполнено', value: step + 1, max: STEPS.length},
            ]}
          />

          <PlayControls
            step={step}
            total={STEPS.length}
            onNext={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            onPrev={() => setStep((s) => Math.max(0, s - 1))}
            onReset={reset}
          />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
