import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  InfraRoot,
  FlowStepper,
  Section,
  Alert,
  ChipRow,
  Chip,
  StackList,
} from '@/components/shared/infra/InfraPlayUi';
import {WEBAUTHN_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function WebauthnChallengePlayInner() {
  const [mode, setMode] = useState('register');
  const [step, setStep] = useState(0);
  const flow = WEBAUTHN_STEPS.find((f) => f.id === mode);

  return (
    <DemoShell>
      <DemoCard title="WebAuthn challenge flow" subtitle="Пароль по сети не уходит — только криптографическая подпись challenge">
        <InfraRoot>
          <Section label="Сценарий">
            <ChipRow>
              {WEBAUTHN_STEPS.map((f) => (
                <Chip key={f.id} active={mode === f.id} onClick={() => { setMode(f.id); setStep(0); }}>
                  {f.label}
                </Chip>
              ))}
            </ChipRow>
          </Section>
          <FlowStepper
            steps={flow.steps.map((label, i) => ({id: i, label: `${i + 1}`}))}
            activeIndex={step}
            onSelect={setStep}
            scroll
          />
          <Section label={`Шаг ${step + 1}`}>
            <div className={s.panel}>{flow.steps[step]}</div>
          </Section>
          <StackList items={flow.steps.slice(0, step + 1)} />
          <Alert>Origin и rpId привязаны к домену — фишинговый клон не сможет использовать ключ.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default WebauthnChallengePlayInner;
