import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {PlayStack, PlayTabs} from '@/components/shared/systemNetworkPlayKit';
import styles from '@/components/demos/SystemNetworkPlays.module.css';

const PERMS = ['Камера', 'Микрофон', 'Файлы', 'Уведомления', 'Фон', 'Bluetooth'];
const PLATFORMS = {
  windows: {label: 'Windows 11', values: ['partial', 'yes', 'yes', 'yes', 'yes', 'yes']},
  ios: {label: 'iOS', values: ['yes', 'yes', 'partial', 'yes', 'partial', 'partial']},
  android: {label: 'Android', values: ['yes', 'yes', 'yes', 'yes', 'yes', 'yes']},
};

const PLATFORM_NOTES = {
  ios: 'iOS: строгий sandbox, фон — только зарегистрированные режимы (BGTask, push).',
  android: 'Android: runtime permissions с Android 6+, scoped storage с 10+.',
  windows: 'Windows: UWP vs Win32 — разные модели capability и UAC.',
};

function cell(v) {
  if (v === 'yes') return <span className={styles.permYes}>✓</span>;
  if (v === 'partial') return <span className={styles.permPartial}>~</span>;
  return <span className={styles.permNo}>—</span>;
}

export default function PlatformPermissionsMatrixPlay({defaultPlatform = 'windows'}) {
  const [platform, setPlatform] = useState(defaultPlatform);
  const p = PLATFORMS[platform];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Матрица разрешений ОС" subtitle="Как Windows, iOS и Android ограничивают доступ приложений">
        <PlayStack>
          <PlayTabs
            tabs={Object.entries(PLATFORMS).map(([id, meta]) => ({id, label: meta.label}))}
            active={platform}
            onChange={setPlatform}
          />

          <div className={styles.tableWrap}>
            <table className={styles.permTable}>
              <thead>
                <tr>
                  <th>Разрешение</th>
                  <th>{p.label}</th>
                </tr>
              </thead>
              <tbody>
                {PERMS.map((perm, i) => (
                  <tr key={perm}>
                    <td>{perm}</td>
                    <td>{cell(p.values[i])}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.panelSub}>{PLATFORM_NOTES[platform]}</p>
        </PlayStack>
      </DemoCard>
    </DemoShell>
  );
}
