import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, SliderField, StatPanel, Alert} from '@/components/shared/infra/InfraPlayUi';

function RtoRpoSliderPlayInner() {
  const [backupHours, setBackupHours] = useState(6);
  const [restoreHours, setRestoreHours] = useState(1);
  const rpo = useMemo(() => `до ${backupHours}ч транзакций при сбое`, [backupHours]);
  const rto = useMemo(() => `${restoreHours}ч простоя до restore`, [restoreHours]);

  return (
    <DemoShell>
      <DemoCard title="RTO / RPO слайдеры" subtitle="Частота бэкапа и время восстановления — две независимые оси DR">
        <InfraRoot>
          <SliderField label="Интервал бэкапа (RPO)" value={backupHours} min={1} max={24} onChange={setBackupHours} displayValue={`${backupHours}ч`} />
          <SliderField label="Время restore (RTO)" value={restoreHours} min={0.5} max={8} step={0.5} onChange={setRestoreHours} displayValue={`${restoreHours}ч`} />
          <StatPanel rows={[
            {key: 'RPO — потеря данных', value: rpo},
            {key: 'RTO — простой', value: rto},
          ]} />
          <Alert>Узкий RPO → чаще pg_dump или WAL; узкий RTO → отрепетированный runbook и готовые образы.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default RtoRpoSliderPlayInner;
