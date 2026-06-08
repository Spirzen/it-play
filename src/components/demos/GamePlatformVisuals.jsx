import React, {useState} from 'react';
import clsx from 'clsx';
import {
  PS5_FEATURES,
  STEAM_GAMES,
  STEAM_NAV,
  STEAM_VIEWS,
  SWITCH_MODES,
  XBOX_MODELS,
} from '@/components/shared/kb/gamePlatformVisualEngine';
import styles from '@/components/demos/GamePlatformPlay.module.css';

export function SteamClientVisual() {
  const [nav, setNav] = useState('library');
  const [gameId, setGameId] = useState('hl');
  const game = STEAM_GAMES.find((g) => g.id === gameId) ?? STEAM_GAMES[0];
  const view = STEAM_VIEWS[nav] ?? STEAM_VIEWS.library;

  return (
    <div className={styles.visualWrap} role="region" aria-label="Эмулятор клиента Steam">
      <div className={styles.visualLabel}>
        <span>Steam Client</span>
        <span>store.steampowered.com</span>
      </div>
      <div className={styles.steam}>
        <nav className={styles.steamSide}>
          {STEAM_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(styles.steamNavBtn, nav === item.id && styles.steamNavActive)}
              onClick={() => setNav(item.id)}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className={styles.steamMain}>
          <div className={styles.steamTop}>
            <input
              className={styles.steamSearch}
              readOnly
              value={`Поиск в ${view.headline}…`}
              aria-label="Поиск Steam"
            />
            <div className={styles.steamUser} title="Профиль Steam" />
          </div>
          {nav === 'library' ? (
            <>
              <div className={styles.steamGrid}>
                {STEAM_GAMES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={clsx(styles.steamTile, gameId === g.id && styles.steamTileActive)}
                    onClick={() => setGameId(g.id)}
                  >
                    <div
                      className={styles.steamCover}
                      style={{background: `linear-gradient(135deg, ${g.accent}, #171a21)`}}
                    >
                      {g.title}
                    </div>
                    <div className={styles.steamMeta}>{g.hours}</div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={clsx(
                  styles.steamAction,
                  game.status === 'install' && styles.steamActionSecondary,
                )}
              >
                {game.status === 'play' ? 'ИГРАТЬ' : 'УСТАНОВИТЬ'}
              </button>
            </>
          ) : (
            <div className={styles.steamFooter} style={{padding: '1rem 0.65rem'}}>
              <strong style={{color: '#66c0f4'}}>{view.headline}</strong>
              <p style={{margin: '0.5rem 0 0'}}>{view.hint}</p>
              <p style={{margin: '0.75rem 0 0', fontSize: '0.65rem'}}>
                Выбрана игра: {game.title} — можно вернуться в "Библиотеку".
              </p>
            </div>
          )}
          <p className={styles.steamFooter}>{view.hint}</p>
        </div>
      </div>
    </div>
  );
}

export function XboxConsoleVisual() {
  const [modelId, setModelId] = useState('seriesX');
  const [power, setPower] = useState(true);
  const model = XBOX_MODELS.find((m) => m.id === modelId) ?? XBOX_MODELS[0];
  const isX = model.shape === 'cube';

  return (
    <div className={styles.visualWrap} role="region" aria-label="Эмулятор Xbox Series X и Series S">
      <div className={styles.visualLabel}>
        <span>Xbox</span>
        <span>Game Pass · DirectX 12</span>
      </div>
      <div className={styles.xboxStage}>
        <div className={styles.xboxToggle}>
          {XBOX_MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.xboxToggleBtn, modelId === m.id && styles.xboxToggleActive)}
              onClick={() => setModelId(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div
          className={clsx(
            styles.xboxConsole,
            isX ? styles.xboxSeriesX : styles.xboxSeriesS,
          )}
        >
          <div
            className={clsx(
              styles.xboxBody,
              isX ? styles.xboxBodyDark : styles.xboxBodyLight,
            )}
          >
            <button
              type="button"
              className={clsx(styles.xboxPower, power && styles.xboxPowerOn)}
              aria-label={power ? 'Выключить' : 'Включить'}
              onClick={() => setPower((p) => !p)}
            />
            {model.vent === 'top-grid' ? (
              <div className={styles.xboxVentTop} />
            ) : (
              <div className={styles.xboxVentSide} />
            )}
            {isX && <div className={styles.xboxDisc} />}
            <div className={styles.xboxLogo} style={{opacity: power ? 1 : 0.35}}>
              X
            </div>
          </div>
        </div>
        <p className={styles.xboxSpec}>
          {model.label} — {model.spec}
          {!power && ' · Режим ожидания'}
        </p>
      </div>
    </div>
  );
}

export function NintendoSwitchVisual() {
  const [modeId, setModeId] = useState('handheld');
  const [homeLit, setHomeLit] = useState(false);
  const docked = modeId === 'docked';

  return (
    <div className={styles.visualWrap} role="region" aria-label="Эмулятор Nintendo Switch">
      <div className={styles.visualLabel}>
        <span>Nintendo Switch</span>
        <span>NVN · eShop</span>
      </div>
      <div className={styles.switchStage}>
        <div className={styles.switchToggle}>
          {SWITCH_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={clsx(styles.xboxToggleBtn, modeId === m.id && styles.xboxToggleActive)}
              onClick={() => setModeId(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className={clsx(styles.switchUnit, docked && styles.switchDocked)}>
          <div className={styles.switchJoyL} aria-hidden style={docked ? {opacity: 0.35, height: '1.2rem'} : undefined} />
          <div className={styles.switchScreen}>
            <div className={styles.switchBezel}>
              <div className={styles.switchIcons}>
                <span title="The Legend of Zelda">⚔</span>
                <span title="Mario">⭐</span>
                <span title="Animal Crossing">🏠</span>
              </div>
            </div>
            <button
              type="button"
              className={clsx(styles.switchHome, homeLit && styles.switchHomeLit)}
              aria-label="Кнопка Home"
              onClick={() => setHomeLit((h) => !h)}
            />
          </div>
          <div className={styles.switchJoyR} aria-hidden style={docked ? {opacity: 0.35, height: '1.2rem'} : undefined} />
          <div className={styles.switchDock} aria-hidden />
        </div>
        <p className={styles.switchHint}>
          {docked
            ? 'TV-режим: 1080p, Joy-Con на доке, отдельные профили производительности.'
            : 'Портатив: 720p экран, съёмные Joy-Con, акцент на автономность.'}
        </p>
      </div>
    </div>
  );
}

export function PlayStation5Visual() {
  const [on, setOn] = useState(true);
  const [features, setFeatures] = useState(() =>
    Object.fromEntries(PS5_FEATURES.map((f) => [f.id, f.on])),
  );

  const toggleFeature = (id) => {
    setFeatures((prev) => ({...prev, [id]: !prev[id]}));
  };

  const activeCount = Object.values(features).filter(Boolean).length;

  return (
    <div className={styles.visualWrap} role="region" aria-label="Эмулятор PlayStation 5">
      <div className={styles.visualLabel}>
        <span>PlayStation 5</span>
        <span>TRC · PS Store</span>
      </div>
      <div className={styles.ps5Stage}>
        <div
          className={styles.ps5Console}
          role="button"
          tabIndex={0}
          aria-label={on ? 'Выключить PS5' : 'Включить PS5'}
          onClick={() => setOn((v) => !v)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOn((v) => !v);
            }
          }}
        >
          <div className={styles.ps5WingL} />
          <div className={styles.ps5WingR} />
          <div className={styles.ps5Center} />
          <div className={clsx(styles.ps5Light, on && styles.ps5LightOn)} />
          <div className={styles.ps5Stand} />
        </div>
        <div className={styles.ps5Controller} aria-hidden>
          <div className={styles.ps5CtrlGripL} />
          <div className={styles.ps5CtrlGripR} />
          <div className={styles.ps5CtrlTouch} />
        </div>
        <div className={styles.ps5Features}>
          {PS5_FEATURES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(styles.ps5Chip, !features[f.id] && styles.ps5ChipOff)}
              onClick={() => toggleFeature(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className={styles.ps5Hint}>
          {on ? 'Рабочий режим' : 'Режим покоя'} · активно {activeCount}/{PS5_FEATURES.length}{' '}
          возможностей · клик по консоли — питание
        </p>
      </div>
    </div>
  );
}

const VISUALS = {
  pc: SteamClientVisual,
  xbox: XboxConsoleVisual,
  nintendo: NintendoSwitchVisual,
  ps: PlayStation5Visual,
};

export function PlatformVisual({platId}) {
  const Visual = VISUALS[platId];
  if (!Visual) return null;
  return <Visual />;
}
