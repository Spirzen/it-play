import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/FlexGridPlay.module.css';

const BOX_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fb8c00'];
const JUSTIFY = ['flex-start', 'center', 'space-between', 'space-around'];
const ALIGN = ['stretch', 'flex-start', 'center', 'flex-end'];

function FlexGridPlayInner() {
  const [mode, setMode] = useState('flex');
  const [justify, setJustify] = useState('center');
  const [align, setAlign] = useState('center');

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Flexbox и Grid" subtitle="Переключите режим и выравнивание четырёх блоков">
        <div className={styles.toolbar}>
          <button
            type="button"
            className={clsx('it-demo__btn', mode === 'flex' && 'it-demo__btn--primary')}
            onClick={() => setMode('flex')}
          >
            Flex
          </button>
          <button
            type="button"
            className={clsx('it-demo__btn', mode === 'grid' && 'it-demo__btn--primary')}
            onClick={() => setMode('grid')}
          >
            Grid
          </button>
        </div>
        <label className={styles.control}>
          <span className="it-demo__label">justify-content</span>
          <select className="it-demo__select" value={justify} onChange={(e) => setJustify(e.target.value)}>
            {JUSTIFY.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">align-items</span>
          <select className="it-demo__select" value={align} onChange={(e) => setAlign(e.target.value)}>
            {ALIGN.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div
          className={clsx(styles.container, mode === 'grid' && styles.containerGrid)}
          style={
            mode === 'flex'
              ? {display: 'flex', justifyContent: justify, alignItems: align}
              : {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  justifyContent: justify,
                  alignItems: align,
                }
          }
        >
          {BOX_COLORS.map((c, i) => (
            <div key={i} className={styles.box} style={{background: c}}>
              {i + 1}
            </div>
          ))}
        </div>
        <p className={styles.hint}>
          Режим: <code>{mode}</code>, justify: <code>{justify}</code>, align: <code>{align}</code>
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default FlexGridPlayInner;
