import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, CardGrid, Alert, ActionRow} from '@/components/shared/infra/InfraPlayUi';
import {SCALING_TREE} from '@/components/shared/kb/infraSecurityEngines';

function ScalingWhenPlayInner() {
  const [idx, setIdx] = useState(0);
  const item = SCALING_TREE[idx];

  return (
    <DemoShell>
      <DemoCard title="Масштабирование по сигналу" subtitle="Усложняйте стек по измеренному узкому месту, а не по моде">
        <InfraRoot>
          <CardGrid items={SCALING_TREE.map((x, i) => ({id: String(i), title: x.signal.split(' ').slice(0, 4).join(' ') + '…', meta: `#${i + 1}`}))} activeId={String(idx)} onSelect={(id) => setIdx(Number(id))} />
          <Alert tone="success">✓ {item.action}</Alert>
          <Alert tone="error">✗ Антипаттерн: {item.wrong}</Alert>
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => setIdx((i) => (i + 1) % SCALING_TREE.length)}>Следующий сигнал</button>
          </ActionRow>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default ScalingWhenPlayInner;
