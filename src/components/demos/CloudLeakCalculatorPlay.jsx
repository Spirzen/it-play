import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, LeakList, Alert} from '@/components/shared/infra/InfraPlayUi';
import {CLOUD_LEAKS} from '@/components/shared/kb/infraSecurityEngines';

const MAX = CLOUD_LEAKS.reduce((s, l) => s + l.cost, 0);

function CloudLeakCalculatorPlayInner() {
  const [on, setOn] = useState(() => Object.fromEntries(CLOUD_LEAKS.map((l) => [l.id, false])));
  const total = useMemo(() => CLOUD_LEAKS.filter((l) => on[l.id]).reduce((s, l) => s + l.cost, 0), [on]);
  const toggle = (id) => setOn((o) => ({...o, [id]: !o[id]}));

  return (
    <DemoShell>
      <DemoCard title="FinOps — калькулятор утечек" subtitle="Забытые ресурсы pet-проекта — включайте и смотрите счёт">
        <InfraRoot>
          <LeakList items={CLOUD_LEAKS} on={on} onToggle={toggle} total={total} max={MAX} />
          {total > 50 && <Alert tone="error">Бюджетный alert на $15–25 поймал бы это до нуля на карте.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default CloudLeakCalculatorPlayInner;
