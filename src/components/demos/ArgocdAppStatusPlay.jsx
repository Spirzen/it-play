import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, Alert, StatusPill} from '@/components/shared/infra/InfraPlayUi';
import {ARGO_STATUSES} from '@/components/shared/kb/infraSecurityEngines';

const STATUS_COPY = {
  Synced: {tone: 'success', text: 'Кластер совпадает с Git. Health: Healthy.'},
  OutOfSync: {tone: 'error', text: 'Drift: image tag отличается. Нужен Sync или revert commit в Git.'},
  Progressing: {tone: 'warn', text: 'Rolling update: 1/3 pods ready — дождитесь завершения.'},
  Degraded: {tone: 'error', text: 'CrashLoopBackOff — проверьте логи и манифест Application.'},
};

function ArgocdAppStatusPlayInner() {
  const [status, setStatus] = useState('Synced');
  const meta = STATUS_COPY[status];

  return (
    <DemoShell>
      <DemoCard title="Argo CD Application" subtitle="Synced / OutOfSync / Progressing / Degraded — что делать инженеру">
        <InfraRoot>
          <ChipRow scroll>
            {ARGO_STATUSES.map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>
            ))}
          </ChipRow>
          <StatusPill tone={meta.tone}>{status}</StatusPill>
          <Alert tone={meta.tone === 'success' ? 'success' : meta.tone === 'warn' ? 'warn' : 'error'}>{meta.text}</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default ArgocdAppStatusPlayInner;
