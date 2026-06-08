import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GAME_PLATFORMS} from '@/components/shared/kb/gameDevEngine';
import {PlatformVisual} from '@/components/demos/GamePlatformVisuals';
import styles from '@/components/demos/GameDevDemo.module.css';

function GamePlatformPlayInner({platform = 'pc', locked = false}) {
  const ids = Object.keys(GAME_PLATFORMS);
  const [platId, setPlatId] = useState(platform);
  const plat = GAME_PLATFORMS[platId] ?? GAME_PLATFORMS.pc;

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title={`Платформа: ${plat.label}`}
        subtitle="Интерактивная модель устройства или лаунчера + технические параметры"
      >
        {!locked && (
          <div className={styles.tabs}>
            {ids.map((id) => (
              <button
                key={id}
                type="button"
                className={clsx(styles.tab, platId === id && styles.tabActive)}
                onClick={() => setPlatId(id)}
              >
                {GAME_PLATFORMS[id].icon} {GAME_PLATFORMS[id].label}
              </button>
            ))}
          </div>
        )}

        <PlatformVisual platId={platId} />

        <div
          className={styles.panel}
          style={{
            marginTop: '0.65rem',
            borderColor: `color-mix(in srgb, ${plat.color} 40%, var(--ifm-color-emphasis-300))`,
          }}
        >
          <p className={styles.panelTitle}>
            {plat.icon} {plat.label}
          </p>
          <p className={styles.hint}>
            <strong>ОС:</strong> {plat.os.join(', ')}
          </p>
          <p className={styles.hint}>
            <strong>Графические API:</strong> {plat.apis.join(', ')}
          </p>
          <p className={styles.hint}>
            <strong>Дистрибуция:</strong> {plat.distro.join(', ')}
          </p>
          <p className={styles.hint}>
            <strong>Ограничение:</strong> {plat.constraint}
          </p>
          <p className={styles.hint}>
            <strong>Сертификация:</strong> {plat.cert}
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default function GamePlatformPlay(props) {
  return <GamePlatformPlayInner/>;
}

export function GamePcPlatformPlay() {
  return <GamePlatformPlay platform="pc" locked />;
}

export function GamePlayStationPlatformPlay() {
  return <GamePlatformPlay platform="ps" locked />;
}

export function GameNintendoPlatformPlay() {
  return <GamePlatformPlay platform="nintendo" locked />;
}

export function GameXboxPlatformPlay() {
  return <GamePlatformPlay platform="xbox" locked />;
}
