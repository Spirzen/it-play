import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {GAME_ENGINES, MOBILE_OS} from '@/components/shared/kb/gameDevEngine';
import styles from '@/components/demos/GameDevDemo.module.css';

function GameMobilePlayInner() {
  const [osId, setOsId] = useState('android');
  const [engId, setEngId] = useState('unity');
  const os = MOBILE_OS.find((o) => o.id === osId) ?? MOBILE_OS[0];
  const eng = GAME_ENGINES.find((e) => e.id === engId) ?? GAME_ENGINES[0];
  const fragmentPct = osId === 'android' ? 88 : 32;

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Мобильные игры: Android и iOS"
        subtitle="Фрагментация устройств, сторы и выбор движка"
      >
        <div className={styles.engineGrid}>
          {MOBILE_OS.map((o) => (
            <button
              key={o.id}
              type="button"
              className={clsx(styles.engineCard, osId === o.id && styles.engineCardActive)}
              onClick={() => setOsId(o.id)}
            >
              <strong>{o.label}</strong>
              <p className={styles.hint} style={{margin: '0.2rem 0 0'}}>
                {o.langs.join(' / ')}
              </p>
            </button>
          ))}
        </div>

        <div className={styles.panel} style={{marginTop: '0.75rem'}}>
          <p className={styles.panelTitle}>{os.label}</p>
          <div className={styles.meterPair}>
            <div>
              <div className={styles.meterHead}>
                <span>Фрагментация тестирования</span>
                <span>{fragmentPct}%</span>
              </div>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${fragmentPct}%`,
                    background: osId === 'android' ? '#3ddc84' : '#007aff',
                  }}
                />
              </div>
            </div>
          </div>
          <p className={styles.hint}>
            <strong>IDE:</strong> {os.ide} · <strong>Store:</strong> {os.store}
          </p>
          <p className={styles.hint}>{os.note}</p>
        </div>

        <p className={styles.hint} style={{marginTop: '0.85rem'}}>
          Кроссплатформенный движок:
        </p>
        <div className={styles.tabs}>
          {GAME_ENGINES.filter((e) => e.id !== 'roblox').map((e) => (
            <button
              key={e.id}
              type="button"
              className={clsx(styles.tab, engId === e.id && styles.tabActive)}
              onClick={() => setEngId(e.id)}
            >
              {e.name}
            </button>
          ))}
        </div>
        <div className={styles.panel}>
          <p className={styles.hint}>
            <strong>{eng.name}</strong> ({eng.lang}) — {eng.strength}. На мобайле: {eng.weakness}
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default GameMobilePlayInner;
