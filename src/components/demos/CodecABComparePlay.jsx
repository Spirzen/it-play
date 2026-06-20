import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {codecQualityLoss, formatMB, pcmBitrate} from '@/components/shared/kb/mediaInteractiveEngines';
import {toolStyles, styles} from '@/components/shared/kb/basicsPlayUi';

const CODECS = [
  {id: 'mp3_128', label: 'MP3 128', bitrate: 128},
  {id: 'aac_128', label: 'AAC 128', bitrate: 128},
  {id: 'opus_96', label: 'Opus 96', bitrate: 96},
  {id: 'flac', label: 'FLAC', bitrate: 0},
];

function CodecPanel({title, value, onChange, quality, size}) {
  return (
    <div className={styles.codecCard}>
      <div className={styles.codecCardTitle}>Вариант {title}</div>
      <div className={toolStyles.chips}>
        {CODECS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={clsx(toolStyles.chip, value === c.id && toolStyles.chipActive)}
            onClick={() => onChange(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="it-demo__hint">
        Качество ~<strong>{quality}%</strong> · <strong>{formatMB(size)}</strong>
      </p>
      <div className={styles.meter}>
        <div className={clsx(styles.meterFill, styles.barFill)} style={{width: `${quality}%`}} />
      </div>
    </div>
  );
}

function CodecABComparePlayInner() {
  const [codecA, setCodecA] = useState('mp3_128');
  const [codecB, setCodecB] = useState('aac_128');
  const [seconds, setSeconds] = useState(180);

  const compare = useMemo(() => {
    const a = CODECS.find((c) => c.id === codecA);
    const b = CODECS.find((c) => c.id === codecB);
    const wavBytes = pcmBitrate(44100, 16, 2) * seconds / 8;
    const sizeA = a.id === 'flac' ? wavBytes * 0.55 : (a.bitrate * 1000 * seconds) / 8;
    const sizeB = b.id === 'flac' ? wavBytes * 0.55 : (b.bitrate * 1000 * seconds) / 8;
    return {
      qualityA: codecQualityLoss(a.id, a.bitrate || 900),
      qualityB: codecQualityLoss(b.id, b.bitrate || 900),
      sizeA,
      sizeB,
      wavBytes,
    };
  }, [codecA, codecB, seconds]);

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <DemoShell>
      <DemoCard
        title="Сравнение аудиокодеков"
        subtitle="Модель качества и размер файла — lossy vs lossless"
      >
        <div className={styles.grid2}>
          <CodecPanel title="A" value={codecA} onChange={setCodecA} quality={compare.qualityA} size={compare.sizeA} />
          <CodecPanel title="B" value={codecB} onChange={setCodecB} quality={compare.qualityB} size={compare.sizeB} />
        </div>

        <div className={styles.rangeRow} style={{marginTop: '0.75rem'}}>
          <label className="it-demo__label" htmlFor="codec-len" style={{margin: 0, textTransform: 'none'}}>
            Длина
          </label>
          <input
            id="codec-len"
            className="it-demo__range"
            type="range"
            min={60}
            max={600}
            step={30}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
          />
          <strong>{mm}:{ss}</strong>
        </div>
        <p className="it-demo__hint">Несжатый WAV за тот же отрезок: {formatMB(compare.wavBytes)}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default CodecABComparePlayInner;
