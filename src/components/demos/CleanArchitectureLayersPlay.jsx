import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {LAYERS, isDependencyAllowed} from '@/components/shared/kb/cleanArchLayersEngine';
import styles from '@/components/demos/CleanArchitectureLayersPlay.module.css';

function CleanArchitectureLayersPlayInner() {
  const [layerId, setLayerId] = useState('usecase');
  const [targetId, setTargetId] = useState('domain');
  const layer = LAYERS.find((l) => l.id === layerId) ?? LAYERS[1];
  const allowed = isDependencyAllowed(layerId, targetId);

  return (
    <DemoShell>
      <DemoCard
        title="Слои чистой архитектуры"
        subtitle="Проверьте, может ли слой зависеть от другого (зависимости только внутрь)"
      >
        <div className={styles.stack}>
          {[...LAYERS].reverse().map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.layer, layerId === l.id && styles.layerActive)}
              style={{
                borderColor: l.color,
                background:
                  layerId === l.id
                    ? `color-mix(in srgb, ${l.color} 16%, var(--ifm-background-surface-color))`
                    : undefined,
              }}
              onClick={() => setLayerId(l.id)}
            >
              <span>{l.label}</span>
              <span className={styles.dirs}>{l.dirs.join(', ')}</span>
            </button>
          ))}
        </div>

        <p className={styles.desc}>{layer.desc}</p>

        <div className={styles.check}>
          <label className="it-demo__label">
            Может ли "{layer.label}" зависеть от:
          </label>
          <select
            className="it-demo__select"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {LAYERS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
          <p className={clsx(styles.verdict, allowed ? styles.ok : styles.bad)}>
            {allowed
              ? 'Допустимо: зависимость направлена к ядру или равному слою.'
              : 'Нарушение: внешний слой не должен тянуть внутренний "вверх" через инфраструктуру.'}
          </p>
        </div>

        <p className="it-demo__hint" style={{margin: 0}}>
          Правило: domain не знает о БД и HTTP; infrastructure реализует ports из interface.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CleanArchitectureLayersPlayInner;
