import React from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, DataTable} from '@/components/shared/infra/InfraPlayUi';
import {ENV_COMPARE} from '@/components/shared/kb/infraSecurityEngines';

function DevStagingProdPlayInner() {
  return (
    <DemoShell>
      <DemoCard title="dev / staging / prod" subtitle="Среды отличаются не только URL — данные, секреты и политика деплоя">
        <InfraRoot>
          <DataTable
            columns={['Параметр', 'dev', 'staging', 'prod']}
            rows={ENV_COMPARE.map((row) => ({key: row.key, cells: [row.key, row.dev, row.staging, row.prod]}))}
          />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default DevStagingProdPlayInner;
