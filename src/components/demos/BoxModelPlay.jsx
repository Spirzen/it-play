import React, {useMemo, useState} from 'react';

import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/BoxModelPlay.module.css';

function Slider({label, value, min, max, onChange}) {
  return (
    <label className={styles.slider}>
      <span className="it-demo__label">{label}: {value}px</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function BoxModelPlayInner() {
  const [padding, setPadding] = useState(16);
  const [border, setBorder] = useState(4);
  const [margin, setMargin] = useState(12);
  const [contentW, setContentW] = useState(120);
  const [boxSizing, setBoxSizing] = useState('content-box');

  const total = useMemo(() => {
    const horizontal = padding * 2 + border * 2 + margin * 2;
    if (boxSizing === 'border-box') return contentW + margin * 2;
    return contentW + horizontal;
  }, [padding, border, margin, contentW, boxSizing]);

  const formula =
    boxSizing === 'border-box'
      ? `margin×2 + width = ${margin * 2} + ${contentW} = ${total}px`
      : `margin×2 + border×2 + padding×2 + content = ${margin * 2}+${border * 2}+${padding * 2}+${contentW} = ${total}px`;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Блочная модель CSS" subtitle="Ползунки меняют слои; снизу — итоговая ширина элемента">
        <div className={styles.sliders}>
          <Slider label="padding" value={padding} min={0} max={40} onChange={setPadding} />
          <Slider label="border" value={border} min={0} max={16} onChange={setBorder} />
          <Slider label="margin" value={margin} min={0} max={40} onChange={setMargin} />
          <Slider label="ширина content" value={contentW} min={60} max={200} onChange={setContentW} />
        </div>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={boxSizing === 'border-box'}
            onChange={(e) => setBoxSizing(e.target.checked ? 'border-box' : 'content-box')}
          />
          <span>box-sizing: {boxSizing}</span>
        </label>
        <div className={styles.stage}>
          <div className={styles.marginLayer} style={{padding: margin}}>
            <div
              className={styles.box}
              style={{boxSizing, width: contentW, padding, borderWidth: border}}
            >
              content
            </div>
          </div>
        </div>
        <p className={styles.formula}>
          <strong>Итого по горизонтали:</strong> {formula}
        </p>
        <p className={styles.hint}>
          {boxSizing === 'border-box'
            ? 'При border-box заданная width включает padding и border.'
            : 'При content-box width относится только к области content.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default BoxModelPlayInner;
