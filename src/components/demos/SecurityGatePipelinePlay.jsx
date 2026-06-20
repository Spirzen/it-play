import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, LayerList, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {DEVSECOPS_GATES, simulateGates} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function SecurityGatePipelinePlayInner() {
  const [enabled, setEnabled] = useState(() => Object.fromEntries(DEVSECOPS_GATES.map((l) => [l.id, l.defaultOn])));
  const [run, setRun] = useState(null);
  const [running, setRunning] = useState(false);

  const toggle = (id) => { setEnabled((e) => ({...e, [id]: !e[id]})); setRun(null); };
  const execute = async () => {
    setRunning(true);
    setRun(null);
    await new Promise((r) => setTimeout(r, 450));
    setRun(simulateGates(DEVSECOPS_GATES, enabled));
    setRunning(false);
  };

  return (
    <DemoShell>
      <DemoCard title="DevSecOps security gates" subtitle="Включите слои shift-left и запустите симуляцию merge в prod">
        <InfraRoot>
          <LayerList layers={DEVSECOPS_GATES} enabled={enabled} results={run?.results} onToggle={toggle} />
          <ActionRow>
            <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={execute} disabled={running}>{running ? 'Пайплайн…' : 'Запустить gates'}</button>
            {run && <span className={`${s.resultLine} ${run.ok ? s.resultOk : s.resultBad}`}>{run.ok ? 'Deploy разрешён' : 'Pipeline failed — merge заблокирован'}</span>}
          </ActionRow>
          {run && !run.ok && <Alert tone="error">Включите SAST, secret scan и SBOM — без них риск supply chain в prod.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default SecurityGatePipelinePlayInner;
