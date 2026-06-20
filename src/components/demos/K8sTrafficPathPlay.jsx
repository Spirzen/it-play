import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, Pipeline, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {K8S_TRAFFIC_STEPS} from '@/components/shared/kb/infraSecurityEngines';

function K8sTrafficPathPlayInner() {
  const [step, setStep] = useState(0);

  return (
    <DemoShell>
      <DemoCard title="Сетевой путь в Kubernetes" subtitle="Client → Ingress → Service → kube-proxy → Pod">
        <InfraRoot>
          <Pipeline steps={K8S_TRAFFIC_STEPS} activeIndex={step} onSelect={setStep} vertical />
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" disabled={step >= K8S_TRAFFIC_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Следующий hop</button>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Назад</button>
          </ActionRow>
          {step === 3 && <Alert>kube-proxy применяет DNAT: ClusterIP → IP одного из Pod-бэкендов.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default K8sTrafficPathPlayInner;
