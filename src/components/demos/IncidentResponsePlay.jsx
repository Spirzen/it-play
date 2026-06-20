import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, FlowStepper, Section, ActionRow} from '@/components/shared/infra/InfraPlayUi';
import {INCIDENT_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function IncidentResponsePlayInner() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell>
      <DemoCard title="Инцидент → rollback" subtitle="Алерт, триаж, откат деплоя и postmortem">
        <InfraRoot>
          <FlowStepper steps={INCIDENT_STEPS} activeIndex={step} onSelect={setStep} scroll />
          <Section label="Лог / действие">
            <pre className={s.codeBlock}>{INCIDENT_STEPS[step].log}</pre>
          </Section>
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= INCIDENT_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Далее</button>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Назад</button>
          </ActionRow>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default IncidentResponsePlayInner;
