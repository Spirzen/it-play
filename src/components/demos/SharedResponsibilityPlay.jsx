import React, {useMemo, useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, Alert} from '@/components/shared/infra/InfraPlayUi';
import {SHARED_RESP_ITEMS} from '@/components/shared/kb/infraSecurityEngines';
import {infraStyles as s} from '@/components/shared/infra/InfraPlayUi';

function SharedResponsibilityPlayInner() {
  const [owner, setOwner] = useState(() => Object.fromEntries(SHARED_RESP_ITEMS.map((i) => [i.id, i.owner])));
  const score = useMemo(() => SHARED_RESP_ITEMS.filter((i) => owner[i.id] === i.owner).length, [owner]);

  return (
    <DemoShell>
      <DemoCard title="Shared responsibility model" subtitle="Кто отвечает за физику, ОС, данные и ключи в облаке?">
        <InfraRoot>
          <div className={s.panel}>
            {SHARED_RESP_ITEMS.map((item) => (
              <div key={item.id} className={s.statRow}>
                <span className={s.statKey}>{item.label}</span>
                <select className={s.selectField} value={owner[item.id]} onChange={(e) => setOwner((o) => ({...o, [item.id]: e.target.value}))} aria-label={item.label}>
                  <option value="provider">Провайдер</option>
                  <option value="customer">Заказчик</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
            ))}
          </div>
          <span className={s.scoreBadge}>Верно: {score}/{SHARED_RESP_ITEMS.length}</span>
          {score === SHARED_RESP_ITEMS.length && <Alert tone="success">Модель shared responsibility: провайдер — гипервизор, вы — данные и IAM.</Alert>}
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default SharedResponsibilityPlayInner;
