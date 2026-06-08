import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {WordSimulatorInner} from '@/components/demos/WordSimulator';
import {ExcelSimulatorInner} from '@/components/demos/ExcelSimulator';
import {WebBrowserSimulatorInner} from '@/components/demos/WebBrowserSimulator';
import {MediaPlayerSimulatorInner} from '@/components/demos/MediaPlayerSimulator';
import {MessengerSimulatorInner} from '@/components/demos/MessengerSimulator';
import {VideoConferenceSimulatorInner} from '@/components/demos/VideoConferenceSimulator';
import {ArchiveUtilitySimulatorInner} from '@/components/demos/ArchiveUtilitySimulator';
import styles from '@/components/demos/EndUserSoftwareHub.module.css';

const APPS = [
  {id: 'word', label: 'Word', tier: 'basic', Component: WordSimulatorInner},
  {id: 'excel', label: 'Excel', tier: 'basic', Component: ExcelSimulatorInner},
  {id: 'browser', label: 'Браузер', tier: 'basic', Component: WebBrowserSimulatorInner},
  {id: 'media', label: 'Медиаплеер', tier: 'basic', Component: MediaPlayerSimulatorInner},
  {id: 'messenger', label: 'Мессенджер', tier: 'basic', Component: MessengerSimulatorInner},
  {id: 'video', label: 'Видеосвязь', tier: 'basic', Component: VideoConferenceSimulatorInner},
  {id: 'archive', label: 'Архиватор', tier: 'advanced', Component: ArchiveUtilitySimulatorInner},
];

function EndUserSoftwareHubInner({tier = 'all', defaultApp = 'word'}) {
  const pool = APPS.filter((a) => tier === 'all' || a.tier === tier);
  const [active, setActive] = useState(
    pool.some((a) => a.id === defaultApp) ? defaultApp : pool[0]?.id,
  );

  const current = pool.find((a) => a.id === active) || pool[0];
  const ActiveComponent = current?.Component;

  return (
    <DemoShell>
      <DemoCard
        title="Софт пользователя — интерактивный хаб"
        subtitle="Переключайтесь между симуляторами офисных, сетевых и коммуникационных программ"
      >
        <div className={styles.tabs}>
          {pool.map((app) => (
            <button
              key={app.id}
              type="button"
              className={clsx(styles.tab, active === app.id && styles.tabActive)}
              onClick={() => setActive(app.id)}
            >
              {app.label}
              {app.tier === 'advanced' && <span className={styles.badge}>+</span>}
            </button>
          ))}
        </div>
        {ActiveComponent && <ActiveComponent compact />}
        <p className={styles.hint}>
          Симуляторы упрощены для обучения: интерфейс похож на реальные программы, но данные не
          сохраняются на диск.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default function EndUserSoftwareHub(props) {
  return <EndUserSoftwareHubInner {...props} />;
}
