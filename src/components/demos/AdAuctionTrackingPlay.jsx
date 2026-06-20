import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  PlayControls,
  PlayLog,
  PlayNodeRow,
  PlayStack,
  PlayTabs,
  PlayToggle,
} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const MODELS = [
  {id: 'cpm', label: 'CPM', desc: 'Cost per mille — оплата за 1000 показов'},
  {id: 'cpc', label: 'CPC', desc: 'Cost per click — оплата за клик'},
  {id: 'cpa', label: 'CPA', desc: 'Cost per action — оплата за конверсию'},
];

export default function AdAuctionTrackingPlay() {
  const [model, setModel] = useState('cpm');
  const [consent, setConsent] = useState(false);
  const [blocker, setBlocker] = useState(false);
  const [step, setStep] = useState(0);

  const flow = useMemo(() => {
    if (blocker) return ['Страница', '⛔ Ad blocked', 'Контент без рекламы'];
    if (!consent) return ['Страница', 'CMP: cookie?', 'Ожидание согласия'];
    return ['Страница', 'Ad tag → SSP', 'Аукцион RTB', 'Победитель → баннер', 'Pixel/click track'];
  }, [consent, blocker]);

  const logs = [
    MODELS.find((m) => m.id === model).desc,
    consent ? '✓ Consent granted — персонализация и 3rd-party cookies' : '○ Без consent — contextual ads only',
    blocker ? '🚫 Блокировщик: запрос к ads.example заблокирован' : 'Запрос к ad network выполнен',
    step >= 3 ? `Impression logged (${model.toUpperCase()})` : 'Показ ещё не состоялся',
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Рекламный аукцион и трекинг" subtitle="CPM/CPC, consent и блокировщик">
        <PlayStack>
          <PlayTabs tabs={MODELS} active={model} onChange={setModel} />

          <PlayToggle label="GDPR/consent принят" checked={consent} onChange={setConsent} />
          <PlayToggle label="Ad blocker" checked={blocker} onChange={setBlocker} />

          <PlayNodeRow
            nodes={flow.slice(0, 4).map((label, i) => ({
              key: String(i),
              icon: ['📰', '🏷️', '⚖️', '🖼️'][i] ?? '•',
              label,
              done: step > i,
            }))}
            activeKey={String(Math.min(step, 3))}
          />

          <PlayControls
            step={step}
            total={flow.length}
            onNext={() => setStep((s) => Math.min(flow.length - 1, s + 1))}
            onPrev={() => setStep((s) => Math.max(0, s - 1))}
            onReset={() => setStep(0)}
            nextLabel="Следующий шаг"
          />

          <PlayLog lines={logs} />
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
