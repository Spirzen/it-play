import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, SliderField, Timeline, Alert} from '@/components/shared/infra/InfraPlayUi';
import {DISCLOSURE_TIMELINE} from '@/components/shared/kb/infraSecurityEngines';

function ResponsibleDisclosurePlayInner() {
  const maxDay = DISCLOSURE_TIMELINE[DISCLOSURE_TIMELINE.length - 1].day;
  const [day, setDay] = useState(0);
  const events = useMemo(() => DISCLOSURE_TIMELINE.filter((e) => e.day <= day), [day]);

  return (
    <DemoShell>
      <DemoCard title="Coordinated disclosure" subtitle="День 0 — private report → день 90 — публичное раскрытие">
        <InfraRoot>
          <SliderField label="День с момента находки" value={day} min={0} max={maxDay} onChange={setDay} displayValue={`D${day}`} />
          <Timeline events={events} maxDay={day} />
          <Alert>Стандарт: 90 дней на patch до публикации; bounty после fix в prod.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default ResponsibleDisclosurePlayInner;
