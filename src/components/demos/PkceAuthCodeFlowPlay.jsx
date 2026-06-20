import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, FlowStepper, Section, Alert} from '@/components/shared/infra/InfraPlayUi';
import {PKCE_STEPS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function PkceAuthCodeFlowPlayInner() {
  const [step, setStep] = useState(0);
  const current = PKCE_STEPS[step];

  return (
    <DemoShell>
      <DemoCard title="Authorization Code + PKCE" subtitle="Безопасный OAuth 2.0 для SPA и mobile — без client secret в браузере">
        <InfraRoot>
          <FlowStepper steps={PKCE_STEPS} activeIndex={step} onSelect={setStep} scroll />
          <div className={s.panel}>
            <strong>{current.label}</strong>
            <p style={{margin: '0.35rem 0 0', fontSize: '0.84rem', lineHeight: 1.45}}>{current.detail}</p>
          </div>
          <Alert>PKCE: code_verifier хранится только на клиенте; перехват authorization code без verifier бесполезен.</Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PkceAuthCodeFlowPlayInner;
