import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {COLOR_SPACES} from '@/components/shared/kb/mediaInteractiveEngines';
import {toolStyles, styles} from '@/components/shared/kb/basicsPlayUi';

const SWATCHES = [
  {label: 'Красный', srgb: '#e53935', p3: '#ff453a', rec: '#ff1744'},
  {label: 'Зелёный', srgb: '#43a047', p3: '#30d158', rec: '#00e676'},
  {label: 'Синий', srgb: '#1e88e5', p3: '#0a84ff', rec: '#2979ff'},
];

function ColorSpacePickerPlayInner() {
  const [spaceId, setSpaceId] = useState('srgb');
  const space = COLOR_SPACES.find((s) => s.id === spaceId) ?? COLOR_SPACES[0];

  const pickColor = (sw) => {
    if (spaceId === 'p3') return sw.p3;
    if (spaceId === 'rec2020') return sw.rec;
    return sw.srgb;
  };

  return (
    <DemoShell>
      <DemoCard
        title="Цветовые пространства"
        subtitle="sRGB для веба, Display P3 и Rec.2020 — шире гамма на современных дисплеях"
      >
        <div className={toolStyles.chips}>
          {COLOR_SPACES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, spaceId === s.id && toolStyles.chipActive)}
              onClick={() => setSpaceId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.swatchGrid}>
          {SWATCHES.map((sw) => (
            <div key={sw.label} className={styles.swatchCard}>
              <div className={styles.swatch} style={{background: pickColor(sw)}} />
              <div className={styles.swatchLabel}>{sw.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.panelAccent} style={{marginTop: '0.75rem'}}>
          <p className="it-demo__hint" style={{margin: 0}}>
            Охват относительно sRGB: <strong>~{space.gamut}%</strong>. {space.note}
          </p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ColorSpacePickerPlayInner;
