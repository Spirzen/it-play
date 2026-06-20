import React, {useState} from 'react';
import {ChipRow, MetricGrid, Panel, PlayRoot, styles} from '@/components/shared/dataMarkupPlayKit';

const STEPS = [
  {id: 'write', label: '1. WAL record'},
  {id: 'flush', label: '2. fsync WAL'},
  {id: 'data', label: '3. Data page'},
  {id: 'crash', label: '4. CRASH'},
  {id: 'replay', label: '5. Replay WAL'},
  {id: 'ok', label: '6. Consistent'},
];

export default function WalRecoveryPlay() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  const detail = {
    write: 'Изменение записано в WAL (append-only), data page ещё в RAM.',
    flush: 'WAL сброшен на диск — commit durable.',
    data: 'Data page может быть записана позже (checkpoint).',
    crash: 'Питание пропало — RAM потерян.',
    replay: 'При старте PostgreSQL читает WAL с последнего checkpoint.',
    ok: 'Committed транзакции восстановлены; uncommitted откатаны.',
  }[current.id];

  return (
    <PlayRoot title="WAL и восстановление" subtitle="Write-Ahead Logging — crash recovery">
      <div className={styles.timeline}>
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={styles.timelineStep + (i === step ? ` ${styles.timelineStepActive}` : '')}
            onClick={() => setStep(i)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <Panel title={current.label}>{detail}</Panel>
      <MetricGrid items={[{label: 'WAL on disk', value: step >= 1 ? 'yes' : 'no'}, {label: 'Data durable', value: step >= 5 ? 'yes' : 'maybe'}]} />
    </PlayRoot>
  );
}
