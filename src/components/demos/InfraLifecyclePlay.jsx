import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, Pipeline, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {INFRA_LIFECYCLE} from '@/components/shared/kb/infraSecurityEngines';

function InfraLifecyclePlayInner() {
  const [active, setActive] = useState(0);
  const node = INFRA_LIFECYCLE[active];

  return (
    <DemoShell>
      <DemoCard title="Путь кода к пользователю" subtitle="От коммита до prod — роли и ответственность на каждом этапе">
        <InfraRoot>
          <Pipeline steps={INFRA_LIFECYCLE.map((n) => n.label)} activeIndex={active} onSelect={setActive} vertical />
          <StatPanel rows={[
            {key: 'Этап', value: node.label},
            {key: 'Роль', value: node.role},
            {key: 'Действия', value: node.detail},
          ]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default InfraLifecyclePlayInner;
