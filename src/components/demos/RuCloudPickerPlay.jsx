import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatPanel, Alert} from '@/components/shared/infra/InfraPlayUi';
import {RU_CLOUD_SCENARIOS, RU_PROVIDERS} from '@/components/shared/kb/infraSecurityEngines';

function RuCloudPickerPlayInner() {
  const [id, setId] = useState(RU_CLOUD_SCENARIOS[0].id);
  const sc = RU_CLOUD_SCENARIOS.find((s) => s.id === id);
  const provider = RU_PROVIDERS[sc.best];

  return (
    <DemoShell>
      <DemoCard title="Облака РФ — подбор провайдера" subtitle="Сценарий → рекомендация с trade-offs для pet-проекта и compliance">
        <InfraRoot>
          <ChipRow scroll>
            {RU_CLOUD_SCENARIOS.map((item) => (
              <Chip key={item.id} active={id === item.id} onClick={() => setId(item.id)}>{item.label}</Chip>
            ))}
          </ChipRow>
          <StatPanel rows={[
            {key: 'Рекомендация', value: provider.name},
            {key: 'Почему', value: sc.why},
            {key: 'Теги сценария', value: sc.need.join(', ')},
          ]} />
          <Alert>Для 152-ФЗ важны ЦОД в РФ, IAM и audit — не только цена за vCPU.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default RuCloudPickerPlayInner;
