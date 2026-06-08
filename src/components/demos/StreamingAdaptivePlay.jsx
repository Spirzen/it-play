import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/StreamingAdaptivePlay.module.css';

const QUALITIES = [
  {id: '4k', label: '4K', bitrate: 20, minMbps: 18},
  {id: '1080', label: '1080p', bitrate: 5, minMbps: 6},
  {id: '720', label: '720p', bitrate: 2.5, minMbps: 3},
  {id: '480', label: '480p', bitrate: 1.2, minMbps: 1.5},
];

const CHUNKS = 8;

function StreamingAdaptivePlayInner() {
  const [bandwidth, setBandwidth] = useState(8);
  const [chunkIdx, setChunkIdx] = useState(0);
  const [buffer, setBuffer] = useState(3);

  const quality = useMemo(() => {
    const sorted = [...QUALITIES].sort((a, b) => b.minMbps - a.minMbps);
    return sorted.find((q) => bandwidth >= q.minMbps) ?? QUALITIES[QUALITIES.length - 1];
  }, [bandwidth]);

  const nextChunk = () => {
    setChunkIdx((c) => (c + 1) % CHUNKS);
    setBuffer((b) => Math.max(0, b - 1));
    if (bandwidth < quality.minMbps) {
      setBuffer((b) => Math.max(0, b - 2));
    } else {
      setBuffer((b) => Math.min(6, b + 1));
    }
  };

  const rebuffer = buffer <= 0;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Адаптивный стриминг (HLS/DASH)"
        subtitle="Клиент выбирает качество чанка по измеренной скорости канала"
      >
        <label className={styles.label}>
          Скорость канала: <strong>{bandwidth} Мбит/с</strong>
          <input
            type="range"
            min={0.5}
            max={25}
            step={0.5}
            value={bandwidth}
            onChange={(e) => setBandwidth(Number(e.target.value))}
          />
        </label>

        <div className={styles.player}>
          <div className={styles.screen}>
            {rebuffer ? (
              <span className={styles.spinner}>⏳ Rebuffering…</span>
            ) : (
              <span>
                Чанк {chunkIdx + 1}/{CHUNKS} · {quality.label} · {quality.bitrate} Мбит/с
              </span>
            )}
          </div>
          <div className={styles.buffer}>
            Буфер:{' '}
            {Array.from({length: 6}).map((_, i) => (
              <span
                key={i}
                className={clsx(styles.seg, i < buffer && styles.segFull)}
              />
            ))}
          </div>
        </div>

        <div className={styles.qualities}>
          {QUALITIES.map((q) => (
            <span
              key={q.id}
              className={clsx(styles.q, quality.id === q.id && styles.qActive)}
            >
              {q.label}
              <small>≥{q.minMbps} Мбит/с</small>
            </span>
          ))}
        </div>

        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={nextChunk}>
          Загрузить следующий чанк
        </button>
        <p className={styles.hint}>
          Манифест M3U8/DASH перечисляет чанки и битрейты — плеер переключает профиль без остановки
          воспроизведения, если пропускная способность падает.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default StreamingAdaptivePlayInner;
