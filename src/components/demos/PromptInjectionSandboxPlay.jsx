import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StatusPill, Alert, Section} from '@/components/shared/infra/InfraPlayUi';
import {PROMPT_SCENARIOS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function PromptInjectionSandboxPlayInner() {
  const [id, setId] = useState(PROMPT_SCENARIOS[0].id);
  const [sandbox, setSandbox] = useState(true);
  const sc = PROMPT_SCENARIOS.find((x) => x.id === id);
  const blocked = sc.poisoned && sandbox;

  return (
    <DemoShell>
      <DemoCard title="Prompt injection sandbox" subtitle="MCP-агент с tool allowlist — опасные вызовы блокируются">
        <InfraRoot>
          <ChipRow>
            {PROMPT_SCENARIOS.map((x) => (
              <Chip key={x.id} active={id === x.id} warn={x.poisoned} onClick={() => setId(x.id)}>{x.id}</Chip>
            ))}
          </ChipRow>
          <label className={s.layerRow} style={{gridTemplateColumns: 'auto 1fr'}}>
            <input type="checkbox" checked={sandbox} onChange={(e) => setSandbox(e.target.checked)} />
            <span>Tool sandbox + allowlist</span>
          </label>
          <Section label="User input">
            <pre className={s.codeBlock}>{sc.input}</pre>
          </Section>
          {sc.toolCall && (
            <StatusPill tone={blocked ? 'error' : 'warn'}>
              {blocked ? `Blocked: ${sc.toolCall}` : `Allowed: ${sc.toolCall}`}
            </StatusPill>
          )}
          {!sandbox && sc.poisoned && <Alert tone="error">Без sandbox агент с admin kubeconfig выполнит деструктивную команду.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default PromptInjectionSandboxPlayInner;
