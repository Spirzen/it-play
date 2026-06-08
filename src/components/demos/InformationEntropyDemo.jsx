import React, {useMemo, useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ENTROPY_PRESETS,
  formatBits,
  minCodeLengthBits,
  shannonEntropy,
} from '@/components/shared/kb/entropyEngine';
import styles from '@/components/demos/InformationEntropyDemo.module.css';

function InformationEntropyDemoInner() {
  const [presetId, setPresetId] = useState('russian');
  const [text, setText] = useState(ENTROPY_PRESETS[1].text);

  const preset = ENTROPY_PRESETS.find((p) => p.id === presetId) ?? ENTROPY_PRESETS[0];
  const stats = useMemo(() => shannonEntropy(text), [text]);
  const minBits = useMemo(() => minCodeLengthBits(text), [text]);
  const maxBar = stats.perChar[0]?.p ?? 1;

  const applyPreset = (id) => {
    const p = ENTROPY_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setText(p.text);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Энтропия Шеннона"
        subtitle="Средняя неопределённость символа — нижняя граница сжатия без потерь"
      >
        <div className={styles.layout}>
          <div className={styles.toolbar}>
            <select className={styles.select} value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              {ENTROPY_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <textarea className={styles.textarea} value={text} onChange={(e) => setText(e.target.value)} />
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>H (на символ)</div>
              <div className={styles.metricValue}>{formatBits(stats.entropy)}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Макс. для алфавита</div>
              <div className={styles.metricValue}>{formatBits(stats.maxEntropy)}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Уникальных символов</div>
              <div className={styles.metricValue}>{stats.unique}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Мин. объём (оценка)</div>
              <div className={styles.metricValue}>{Math.ceil(minBits)} бит</div>
            </div>
          </div>
          {stats.perChar.slice(0, 12).map((row) => (
            <div key={row.ch} className={styles.barRow}>
              <span>{row.ch}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{width: `${(row.p / maxBar) * 100}%`}} />
              </div>
              <span>
                {(row.p * 100).toFixed(0)}% · {row.bits.toFixed(2)}
              </span>
            </div>
          ))}
          <p className={styles.note}>{preset.note}</p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default InformationEntropyDemoInner;
