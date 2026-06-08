import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import mmStyles from './multimediaToolsPlays.module.css';

const SCENES = [
  {
    id: 'intro',
    name: 'Заставка',
    sources: {cam: false, screen: false, logo: true, chat: false},
  },
  {
    id: 'talk',
    name: 'Камера + чат',
    sources: {cam: true, screen: false, logo: true, chat: true},
  },
  {
    id: 'demo',
    name: 'Демо экрана',
    sources: {cam: true, screen: true, logo: false, chat: true},
  },
  {
    id: 'brb',
    name: 'Перерыв',
    sources: {cam: false, screen: false, logo: true, chat: false},
  },
];

const DEFAULT_SOURCES = {cam: true, screen: false, logo: true, chat: false};

function ObsStreamStudioPlayInner() {
  const [sceneId, setSceneId] = useState('talk');
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [live, setLive] = useState(false);
  const [bitrate, setBitrate] = useState(4500);

  const scene = SCENES.find((s) => s.id === sceneId) ?? SCENES[1];

  const applyScene = (id) => {
    const s = SCENES.find((x) => x.id === id) ?? SCENES[0];
    setSceneId(id);
    setSources({...s.sources});
  };

  const toggleSource = (key) => {
    setSources((prev) => ({...prev, [key]: !prev[key]}));
  };

  const effectiveBitrate = useMemo(() => {
    let b = bitrate;
    if (sources.screen) b += 800;
    if (sources.cam) b += 400;
    if (live) b = Math.min(8000, b + 200);
    return b;
  }, [bitrate, sources, live]);

  return (
    <DemoShell>
      <DemoCard
        title="Студия OBS (симулятор)"
        subtitle="Сцены, источники и оценка битрейта — как перед реальным эфиром"
      >
        <div className={mmStyles.obsLayout}>
          <div>
            <p style={{fontSize: '0.72rem', margin: '0 0 0.35rem', opacity: 0.75}}>Сцены</p>
            <ul className={mmStyles.obsScenes}>
              {SCENES.map((s) => (
                <li
                  key={s.id}
                  className={sceneId === s.id ? mmStyles.obsSceneActive : undefined}
                  onClick={() => applyScene(s.id)}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={mmStyles.obsPreview}>
            {sources.screen && (
              <div
                className={mmStyles.obsLayer}
                style={{inset: '12%', background: '#1e3a5f', fontSize: '0.75rem'}}
              >
                Захват экрана
              </div>
            )}
            {sources.cam && (
              <div
                className={mmStyles.obsLayer}
                style={{
                  bottom: 12,
                  right: 12,
                  width: 88,
                  height: 66,
                  background: '#2d5a3d',
                  borderRadius: 6,
                }}
              >
                Webcam
              </div>
            )}
            {sources.logo && (
              <div
                className={mmStyles.obsLayer}
                style={{top: 10, left: 10, width: 72, height: 28, background: '#5c3d8f'}}
              >
                Лого
              </div>
            )}
            {sources.chat && (
              <div
                className={mmStyles.obsLayer}
                style={{
                  top: 10,
                  right: 10,
                  width: 70,
                  height: '55%',
                  background: 'rgba(0,0,0,0.5)',
                  fontSize: '0.65rem',
                }}
              >
                Чат overlay
              </div>
            )}
            <span style={{zIndex: 1, opacity: 0.85}}>
              {live ? '🔴 LIVE' : '⚫ Preview'} · {scene.name}
            </span>
          </div>

          <div className={mmStyles.obsSources}>
            <p style={{fontSize: '0.72rem', margin: '0 0 0.35rem', opacity: 0.75}}>Источники</p>
            {[
              ['cam', 'Камера'],
              ['screen', 'Экран'],
              ['logo', 'Логотип'],
              ['chat', 'Оверлей чата'],
            ].map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={!!sources[key]}
                  onChange={() => toggleSource(key)}
                />
                {label}
              </label>
            ))}
            <label style={{marginTop: '0.5rem', display: 'block', fontSize: '0.78rem'}}>
              Базовый битрейт: {bitrate} кбит/с
              <input
                type="range"
                min={1500}
                max={8000}
                step={100}
                value={bitrate}
                onChange={(e) => setBitrate(Number(e.target.value))}
                style={{width: '100%', marginTop: '0.25rem'}}
              />
            </label>
            <p style={{fontSize: '0.78rem', margin: '0.35rem 0'}}>
              Оценка: <strong>{effectiveBitrate}</strong> кбит/с
            </p>
            <button
              type="button"
              className={clsx(mmStyles.obsLive, live ? mmStyles.obsLiveOn : mmStyles.obsLiveOff)}
              onClick={() => setLive((v) => !v)}
            >
              {live ? 'Остановить эфир' : 'Начать стрим'}
            </button>
          </div>
        </div>
        <p className="it-demo__hint" style={{marginTop: '0.65rem', marginBottom: 0}}>
          В реальном OBS: сцены переключают горячими клавишами; вывод — RTMP на Twitch/YouTube или
          запись в MKV/MP4. Проверьте задержку аудио (Sync Offset) перед длинным эфиром.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ObsStreamStudioPlayInner;
