import React, {useMemo, useState} from 'react';
import {MetricGrid, Panel, PlayRoot, toolStyles} from '@/components/shared/dataMarkupPlayKit';

export default function PgHbaRulePlay() {
  const [type, setType] = useState('host');
  const [db, setDb] = useState('mydb');
  const [user, setUser] = useState('app');
  const [addr, setAddr] = useState('10.0.0.0/24');
  const [method, setMethod] = useState('scram-sha-256');

  const line = useMemo(
    () => `${type}  ${db}  ${user}  ${addr}  ${method}`,
    [type, db, user, addr, method],
  );

  const allowed = addr.startsWith('10.') && method !== 'reject';

  return (
    <PlayRoot title="pg_hba.conf" subtitle="Конструктор правила доступа клиента">
      <div className="it-demo__grid it-demo__grid--2">
        <label>Type<select className="it-demo__input" value={type} onChange={(e) => setType(e.target.value)}><option>host</option><option>local</option></select></label>
        <label>Database<input className="it-demo__input" value={db} onChange={(e) => setDb(e.target.value)} /></label>
        <label>User<input className="it-demo__input" value={user} onChange={(e) => setUser(e.target.value)} /></label>
        <label>Address<input className="it-demo__input" value={addr} onChange={(e) => setAddr(e.target.value)} /></label>
        <label>Method<select className="it-demo__input" value={method} onChange={(e) => setMethod(e.target.value)}><option>scram-sha-256</option><option>reject</option><option>trust</option></select></label>
      </div>
      <pre className={toolStyles.mono}>{line}</pre>
      <MetricGrid items={[{label: 'Client 10.0.0.5', value: allowed ? 'ALLOW' : 'DENY'}]} />
      <Panel title="Порядок">Первое совпавшее правило в pg_hba.conf побеждает.</Panel>
    </PlayRoot>
  );
}
