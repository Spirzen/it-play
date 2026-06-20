import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {estimateVideoBitrate, formatMbps} from '@/components/shared/kb/mediaInteractiveEngines';
import {toolStyles, styles} from '@/components/shared/kb/basicsPlayUi';

const PRESETS = [
  {id: '720p30', label: '720p30', w: 1280, h: 720, fps: 30},
  {id: '1080p30', label: '1080p30', w: 1920, h: 1080, fps: 30},
  {id: '1080p60', label: '1080p60', w: 1920, h: 1080, fps: 60},
  {id: '4k30', label: '4K30', w: 3840, h: 2160, fps: 30},
];

const CODECS = [
  {id: 'h264', label: 'H.264'},
  {id: 'h265', label: 'H.265'},
  {id: 'av1', label: 'AV1'},
  {id: 'vp9', label: 'VP9'},
];

function VideoBitrateBudgetPlayInner() {
  const [presetId, setPresetId] = useState('1080p30');
  const [codec, setCodec] = useState('h265');
  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[1];

  const kbps = useMemo(
    () => estimateVideoBitrate(preset.w, preset.h, preset.fps, codec),
    [preset, codec],
  );

  const zoomOk = kbps < 4000;
  const streamOk = kbps < 8000;

  return (
    <DemoShell>
      <DemoCard
        title="Бюджет битрейта видео"
        subtitle="Оценка Мбит/с от разрешения, FPS и кодека"
      >
        <div className={toolStyles.chips}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(toolStyles.chip, presetId === p.id && toolStyles.chipActive)}
              onClick={() => setPresetId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={toolStyles.chips} style={{marginTop: '0.45rem'}}>
          {CODECS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, codec === c.id && toolStyles.chipActive)}
              onClick={() => setCodec(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className={styles.budgetHero}>
          <div className={styles.budgetValue}>{formatMbps(kbps * 1000)}</div>
          <p className="it-demo__hint">
            {preset.w}×{preset.h} · {preset.fps} FPS
          </p>
        </div>

        <div className={styles.budgetChecks}>
          <span className={zoomOk ? 'it-demo__badge it-demo__badge--success' : 'it-demo__badge it-demo__badge--warning'}>
            Zoom/Teams {zoomOk ? '✓' : '⚠ uplink'}
          </span>
          <span className={streamOk ? 'it-demo__badge it-demo__badge--success' : 'it-demo__badge it-demo__badge--warning'}>
            Стрим 1080p {streamOk ? '✓' : '⚠ канал'}
          </span>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default VideoBitrateBudgetPlayInner;
