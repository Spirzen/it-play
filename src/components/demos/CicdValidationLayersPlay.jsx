import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CICD_VALIDATION_LAYERS, simulateValidation} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function CicdValidationLayersPlayInner() {
  const [enabled, setEnabled] = useState(() =>
    Object.fromEntries(CICD_VALIDATION_LAYERS.map((l) => [l.id, l.defaultOn])),
  );
  const [run, setRun] = useState(null);
  const [running, setRunning] = useState(false);

  const toggle = (id) => {
    setEnabled((e) => ({...e, [id]: !e[id]}));
    setRun(null);
  };

  const execute = async () => {
    setRunning(true);
    setRun(null);
    await new Promise((r) => setTimeout(r, 400));
    const result = simulateValidation(CICD_VALIDATION_LAYERS, enabled);
    setRun(result);
    setRunning(false);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Слои проверок CI/CD"
        subtitle="Включите pre-merge и deploy gates — запустите симуляцию пайплайна"
      >
        <div className={styles.layerList}>
          {CICD_VALIDATION_LAYERS.map((layer) => {
            const on = enabled[layer.id];
            const result = run?.results.find((r) => r.id === layer.id);
            return (
              <div
                key={layer.id}
                className={clsx(
                  styles.layerRow,
                  !on && styles.layerSkip,
                  result && (result.passed ? styles.layerPass : styles.layerFail),
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(layer.id)}
                  aria-label={layer.label}
                />
                <div>
                  <strong>{layer.label}</strong>
                  <div style={{fontSize: '0.75rem', opacity: 0.85}}>{layer.log}</div>
                </div>
                <span style={{fontSize: '0.8rem'}}>
                  {!on && '—'}
                  {result && (result.passed ? '✓' : '✗')}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.row} style={{marginTop: '0.75rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            onClick={execute}
            disabled={running}
          >
            {running ? 'Пайплайн…' : 'Запустить проверки'}
          </button>
          {run && (
            <span
              style={{
                fontWeight: 600,
                color: run.ok ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)',
              }}
            >
              {run.ok ? 'Merge разрешён' : 'Пайплайн failed — merge заблокирован'}
            </span>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CicdValidationLayersPlayInner;
