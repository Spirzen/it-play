import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {INFRA_LAYERS, INFRA_LINKS, describeLayer} from '@/components/shared/kb/itInfrastructureEngine';
import styles from '@/components/demos/ItInfrastructurePlay.module.css';

function ItInfrastructurePlayInner() {
  const [active, setActive] = useState('software');
  const layer = INFRA_LAYERS.find((l) => l.id === active) ?? INFRA_LAYERS[0];

  const isLinked = (id) =>
    INFRA_LINKS.some(([a, b]) => (a === active && b === id) || (b === active && a === id));

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Слои ИТ-инфраструктуры"
        subtitle="Железо, ПО, сеть, люди и правила — кликните слой и посмотрите связи"
      >
        <div className={styles.stack}>
          {[...INFRA_LAYERS].reverse().map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(
                styles.layer,
                active === l.id && styles.layerActive,
                isLinked(l.id) && active !== l.id && styles.layerLinked,
              )}
              style={{'--layer-color': l.color}}
              onClick={() => setActive(l.id)}
            >
              <span className={styles.layerIcon}>{l.icon}</span>
              <span className={styles.layerLabel}>{l.label}</span>
              <span className={styles.layerItems}>{l.items.join(' · ')}</span>
            </button>
          ))}
        </div>

        <div className={styles.panel}>
          <p className={styles.panelTitle}>{layer.icon} {layer.label}</p>
          <p className={styles.detail}>{describeLayer(layer.id)}</p>
          <ul className={styles.itemList}>
            {layer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <p className={styles.hint}>
          Стек замкнут: правила (SLA, backup) снова влияют на выбор железа и политик сети.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ItInfrastructurePlayInner;
