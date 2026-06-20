import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, StackList, ActionRow, Alert} from '@/components/shared/infra/InfraPlayUi';
import {VAULT_MODES} from '@/components/shared/kb/infraSecurityEngines';

function VaultUnsealFlowPlayInner() {
  const [mode, setMode] = useState('dev');
  const [unsealed, setUnsealed] = useState(true);
  const cfg = VAULT_MODES[mode];

  return (
    <DemoShell>
      <DemoCard title="Vault: dev vs prod unseal" subtitle="Только lab использует -dev с root token в памяти">
        <InfraRoot>
          <ChipRow>
            <Chip active={mode === 'dev'} onClick={() => { setMode('dev'); setUnsealed(true); }}>dev</Chip>
            <Chip active={mode === 'prod'} onClick={() => { setMode('prod'); setUnsealed(false); }}>prod HA</Chip>
          </ChipRow>
          <StackList items={cfg.steps} />
          {mode === 'prod' && (
            <ActionRow>
              <button type="button" className="it-demo__btn it-demo__btn--primary it-demo__btn--sm" onClick={() => setUnsealed(true)} disabled={unsealed}>Unseal (3/5 keys)</button>
            </ActionRow>
          )}
          <Alert tone={mode === 'dev' ? 'warn' : unsealed ? 'success' : 'error'}>
            {mode === 'dev' ? 'dev: auto-unseal, root token — только учебный стенд.' : unsealed ? 'Unsealed: KV и AppRole доступны.' : 'Sealed: секреты недоступны до unseal.'}
          </Alert>
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default VaultUnsealFlowPlayInner;
