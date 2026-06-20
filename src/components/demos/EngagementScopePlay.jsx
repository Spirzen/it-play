import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {ENGAGEMENT_TYPES} from '@/components/shared/kb/infraSecurityEngines';

function EngagementScopePlayInner() {
  const [id, setId] = useState(ENGAGEMENT_TYPES[0].id);
  const t = ENGAGEMENT_TYPES.find((e) => e.id === id);

  return (
    <DemoShell>
      <DemoCard title="Black / grey / white box" subtitle="Один target — разный объём знаний и глубина находок">
        <InfraRoot>
          <ChipRow>
            {ENGAGEMENT_TYPES.map((e) => (
              <Chip key={e.id} active={id === e.id} onClick={() => setId(e.id)}>{e.label}</Chip>
            ))}
          </ChipRow>
          <StatPanel rows={[
            {key: 'Знания тестировщика', value: t.knowledge},
            {key: 'Что найдёт', value: t.finds},
            {key: 'Может пропустить', value: t.miss},
          ]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default EngagementScopePlayInner;
