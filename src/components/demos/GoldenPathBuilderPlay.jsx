import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StackList, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {GOLDEN_PATHS} from '@/components/shared/kb/infraSecurityEngines';

function GoldenPathBuilderPlayInner() {
  const [id, setId] = useState(GOLDEN_PATHS[0].id);
  const path = GOLDEN_PATHS.find((p) => p.id === id);

  return (
    <DemoShell>
      <DemoCard title="Platform Engineering — golden path" subtitle="Self-service шаблон: репозиторий, CI, observability из коробки">
        <InfraRoot>
          <ChipRow>
            {GOLDEN_PATHS.map((p) => (
              <Chip key={p.id} active={id === p.id} onClick={() => setId(p.id)}>{p.label}</Chip>
            ))}
          </ChipRow>
          <StackList items={path.stack} />
          <StatPanel rows={[{key: 'До первого deploy', value: path.time}]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default GoldenPathBuilderPlayInner;
