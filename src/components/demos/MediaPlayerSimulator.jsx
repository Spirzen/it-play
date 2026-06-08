import React, {useEffect, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/MediaPlayerSimulator.module.css';

const PLAYLIST = [
  {id: 1, title: 'Intro Theme', artist: 'Demo Audio', duration: 42},
  {id: 2, title: 'Tutorial Walkthrough', artist: 'IT Universe', duration: 58},
  {id: 3, title: 'Ambient Loop', artist: 'Royalty Free', duration: 36},
];

export function MediaPlayerSimulatorInner({compact}) {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(70);

  const track = PLAYLIST[trackIdx];

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => {
      setPosition((p) => {
        if (p >= track.duration) {
          setPlaying(false);
          return track.duration;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, track.duration]);

  const togglePlay = () => {
    if (position >= track.duration) setPosition(0);
    setPlaying((v) => !v);
  };

  const chrome = (
    <DesktopAppChrome
      title="VLC media player (симулятор)"
      accent="#ff8800"
      menu={
        <>
          <button type="button">Медиа</button>
          <button type="button">Воспроизведение</button>
          <button type="button">Аудио</button>
          <button type="button">Видео</button>
        </>
      }
      status={
        <>
          {track.title} — {formatTime(position)} / {formatTime(track.duration)} · Громкость{' '}
          {volume}%
        </>
      }
    >
      <div className={styles.layout}>
        <div className={styles.screen}>
          <div className={clsx(styles.visual, playing && styles.visualPlaying)}>
            <span>{playing ? '▶ Воспроизведение' : '⏸ Пауза'}</span>
            <strong>{track.title}</strong>
            <em>{track.artist}</em>
          </div>
          <div className={styles.controls}>
            <button type="button" onClick={() => setTrackIdx((i) => Math.max(0, i - 1))}>
              ⏮
            </button>
            <button type="button" className={styles.playBtn} onClick={togglePlay}>
              {playing ? '⏸' : '▶'}
            </button>
            <button
              type="button"
              onClick={() => setTrackIdx((i) => Math.min(PLAYLIST.length - 1, i + 1))}
            >
              ⏭
            </button>
            <input
              type="range"
              min={0}
              max={track.duration}
              value={position}
              onChange={(e) => setPosition(Number(e.target.value))}
              className={styles.seek}
            />
            <label className={styles.vol}>
              🔊
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </label>
          </div>
        </div>
        <ul className={styles.playlist}>
          {PLAYLIST.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                className={clsx(trackIdx === i && styles.plActive)}
                onClick={() => {
                  setTrackIdx(i);
                  setPosition(0);
                  setPlaying(false);
                }}
              >
                {t.title}
                <span>{formatTime(t.duration)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор медиаплеера"
        subtitle="Плейлист, перемотка и громкость — типичный интерфейс VLC/AIMP"
      >
        {chrome}
        <p className={styles.hint}>
          Плеер декодирует контейнер (MP4, MKV) и кодеки (H.264, AAC); без нужного кодека файл не
          откроется.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default MediaPlayerSimulatorInner;
