import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatusPill, Alert} from '@/components/shared/infra/InfraPlayUi';
import {BUCKET_POLICIES} from '@/components/shared/kb/infraSecurityEngines';

function PublicBucketMisconfigPlayInner() {
  const [policyId, setPolicyId] = useState(BUCKET_POLICIES[0].id);
  const pol = BUCKET_POLICIES.find((p) => p.id === policyId);

  return (
    <DemoShell>
      <DemoCard title="S3 bucket — публичный доступ?" subtitle="Block Public Access vs опасные ACL и bucket policy">
        <InfraRoot>
          <ChipRow>
            {BUCKET_POLICIES.map((p) => (
              <Chip key={p.id} active={policyId === p.id} warn={p.public} onClick={() => setPolicyId(p.id)}>{p.label}</Chip>
            ))}
          </ChipRow>
          <StatusPill tone={pol.public ? 'error' : 'success'}>
            {pol.public ? 'Публичный доступ — утечка данных' : 'Доступ заблокирован'}
          </StatusPill>
          {pol.public && <Alert tone="error">Включите Block Public Access, проверьте audit-логи и ротируйте ключи при чувствительных данных.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PublicBucketMisconfigPlayInner;
