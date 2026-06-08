import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/CssTransitionPlay.module.css';

const EASINGS = [
  {id: 'ease', label: 'ease'},
  {id: 'linear', label: 'linear'},
  {id: 'ease-in-out', label: 'ease-in-out'},
  {id: 'cubic-bezier(0.68,-0.55,0.27,1.55)', label: 'bounce'},
];

function CssTransitionPlayInner() {
  const [duration, setDuration] = useState(400);
  const [easing, setEasing] = useState('ease-in-out');
  const [active, setActive] = useState(false);
  const [clicked, setClicked] = useState(false);

  const transition = `transform ${duration}ms ${easing}, background ${duration}ms ${easing}`;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="CSS transitions" subtitle="Наведите и нажмите кнопку — смотрите transform и easing">
        <label className={styles.control}>
          <span className="it-demo__label">duration: {duration}ms</span>
          <input
            type="range"
            min={100}
            max={1200}
            step={50}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>
        <label className={styles.control}>
          <span className="it-demo__label">timing-function</span>
          <select className="it-demo__select" value={easing} onChange={(e) => setEasing(e.target.value)}>
            {EASINGS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.preview}>
          <button
            type="button"
            className={clsx(styles.demoBtn, active && styles.demoBtnHover, clicked && styles.demoBtnClick)}
            style={{transition}}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            onClick={() => setClicked((c) => !c)}
          >
            {clicked ? 'Нажато' : 'Наведи / кликни'}
          </button>
        </div>
        <pre className={styles.code}>{`transition: ${transition};`}</pre>
        <p className={styles.hint}>hover: scale(1.08) · click: rotate(8deg)</p>
      </DemoCard>
    </DemoShell>
  );
}

export default CssTransitionPlayInner;
