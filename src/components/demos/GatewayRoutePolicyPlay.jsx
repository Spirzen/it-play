import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {InfraRoot, ChipRow, Chip, SliderField, StatusPill, StatPanel} from '@/components/shared/infra/InfraPlayUi';
import {GATEWAY_ROUTES} from '@/components/shared/kb/infraSecurityEngines';

function GatewayRoutePolicyPlayInner() {
  const [path, setPath] = useState(GATEWAY_ROUTES[0].path);
  const [hasToken, setHasToken] = useState(true);
  const [rps, setRps] = useState(50);
  const route = GATEWAY_ROUTES.find((r) => r.path === path);
  const rateLimited = rps > route.limit;
  const unauthorized = route.auth && !hasToken;
  const denied = unauthorized || rateLimited;

  return (
    <DemoShell>
      <DemoCard title="API Gateway — маршрут и политики" subtitle="Path → backend, JWT и rate limit на периметре">
        <InfraRoot>
          <ChipRow scroll>
            {GATEWAY_ROUTES.map((r) => (
              <Chip key={r.path} active={path === r.path} onClick={() => setPath(r.path)}>{r.path}</Chip>
            ))}
          </ChipRow>
          <SliderField label="Запросов в секунду" value={rps} min={1} max={250} onChange={setRps} displayValue={`${rps} rps (limit ${route.limit})`} />
          <label style={{display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.84rem'}}>
            <input type="checkbox" checked={hasToken} onChange={(e) => setHasToken(e.target.checked)} /> Bearer JWT
          </label>
          <StatusPill tone={denied ? 'error' : 'success'}>
            {unauthorized ? '401 Unauthorized' : rateLimited ? '429 Too Many Requests' : `→ ${route.backend}`}
          </StatusPill>
          <StatPanel rows={[
            {key: 'Backend', value: route.backend},
            {key: 'Auth required', value: route.auth ? 'да' : 'нет'},
          ]} />
        </InfraRoot>
      </DemoCard>
    </DemoShell>
  );
}
export default GatewayRoutePolicyPlayInner;
