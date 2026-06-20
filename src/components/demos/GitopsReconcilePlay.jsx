import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, CodeGrid, StatusPill, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {GITOPS_CLUSTER, GITOPS_MANIFEST} from '@/components/shared/kb/infraSecurityEngines';

function GitopsReconcilePlayInner() {
  const [drift, setDrift] = useState(false);
  const synced = !drift;

  return (
    <DemoShell>
      <DemoCard title="GitOps reconcile" subtitle="Git — единственный источник истины; ручной kubectl создаёт drift">
        <InfraRoot>
          <StatusPill tone={synced ? 'success' : 'error'}>{synced ? 'Synced' : 'OutOfSync'}</StatusPill>
          <CodeGrid panes={[
            {label: 'Git (desired)', code: GITOPS_MANIFEST},
            {label: 'Cluster (actual)', code: drift ? GITOPS_CLUSTER : GITOPS_MANIFEST, diff: drift},
          ]} />
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={() => setDrift(true)}>kubectl set image</button>
            <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => setDrift(false)}>Sync from Git</button>
          </ActionRow>
          {drift && <Alert tone="warn">Drift: кластер отличается от Git. Revert commit или Sync приведёт prod к аудируемому состоянию.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default GitopsReconcilePlayInner;
