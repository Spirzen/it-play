import React, {useState} from 'react';
import {ChipRow, Panel, PlayRoot, styles} from '@/components/shared/dataMarkupPlayKit';

const EVENTS = [
  {t: 'T0', label: 'Full backup'},
  {t: 'T1', label: 'WAL archive'},
  {t: 'T2', label: 'Commit tx #100'},
  {t: 'T3', label: 'CRASH'},
  {t: 'T4', label: 'Restore base'},
  {t: 'T5', label: 'Replay WAL → T2'},
];

export default function BackupRestoreTimelinePlay() {
  const [target, setTarget] = useState('T2');
  const idx = EVENTS.findIndex((e) => e.t === target);

  return (
    <PlayRoot title="Backup и PITR" subtitle="Base backup + WAL → point-in-time recovery">
      <ChipRow
        value={target}
        onChange={setTarget}
        options={EVENTS.filter((e) => e.t !== 'T3').map((e) => ({id: e.t, label: e.label}))}
      />
      <div className={styles.timeline}>
        {EVENTS.map((e, i) => (
          <div key={e.t} className={styles.timelineStep + (i <= idx ? ` ${styles.timelineStepActive}` : '')}>
            {e.t}: {e.label}
          </div>
        ))}
      </div>
      <Panel title="PITR target">Восстановление до {target}: replay WAL после base backup до выбранного LSN/времени.</Panel>
    </PlayRoot>
  );
}
