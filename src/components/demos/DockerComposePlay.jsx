import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  COMPOSE_YAML,
  composeDown,
  composeUpAll,
  initialComposeState,
  startService,
  promoteHealth,
} from '@/components/shared/kb/dockerComposeEngine';
import styles from '@/components/demos/DockerComposePlay.module.css';

const STATUS_LABEL = {
  stopped: 'stopped',
  starting: 'starting…',
  running: 'running',
  healthy: 'healthy',
};

function DockerComposePlayInner() {
  const [services, setServices] = useState(initialComposeState);
  const [commandLog, setCommandLog] = useState([]);

  const pushCmd = (line) => setCommandLog((prev) => [line, ...prev].slice(0, 8));

  const runUp = useCallback(() => {
    pushCmd('$ docker compose up -d');
    const result = composeUpAll(services);
    setServices(result.services);
    if (result.ok) pushCmd('✓ Created network frontend_default');
    else pushCmd('✗ app: dependency failed — db not healthy');
  }, [services]);

  const runDown = useCallback(() => {
    pushCmd('$ docker compose down');
    setServices(composeDown(services));
    pushCmd('✓ Network removed');
  }, [services]);

  const toggleService = (id) => {
    const svc = services.find((s) => s.id === id);
    if (svc?.status !== 'stopped') {
      setServices(
        services.map((s) => (s.id === id ? {...s, status: 'stopped', log: 'Stopped'} : s)),
      );
      return;
    }
    pushCmd(`$ docker compose up -d ${svc.name}`);
    const r = startService(services, id);
    let next = r.services;
    if (r.ok && r.promoteHealth) {
      setTimeout(() => {
        setServices((cur) => promoteHealth(cur, id));
        pushCmd(`✓ ${id}: healthcheck passed`);
      }, 1200);
    }
    setServices(next);
    if (!r.ok) pushCmd(`✗ ${id}: ${next.find((s) => s.id === id)?.log}`);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Docker Compose: стек из трёх сервисов"
        subtitle="depends_on + healthcheck: app стартует только после готовности PostgreSQL."
      >
        <div className={styles.arrows}>app → db, redis</div>
        <div className={styles.stack}>
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(
                styles.svc,
                s.status === 'running' && styles.svcOn,
                s.status === 'healthy' && styles.svcHealthy,
                s.status === 'starting' && styles.svcStarting,
              )}
              onClick={() => toggleService(s.id)}
            >
              <div className={styles.svcName}>{s.name}</div>
              <div className={styles.svcMeta}>{s.image}</div>
              <div className={styles.svcMeta}>ports: {s.ports}</div>
              <div className={styles.svcMeta}>{STATUS_LABEL[s.status] || s.status}</div>
            </button>
          ))}
        </div>

        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runUp}>
            docker compose up -d
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={runDown}>
            docker compose down
          </button>
        </div>

        <div className={styles.logBox}>
          {commandLog.length === 0 ? (
            <span style={{opacity: 0.65}}>Лог команд появится здесь</span>
          ) : (
            commandLog.map((l, i) => <div key={i}>{l}</div>)
          )}
        </div>

        <label className="it-demo__label" style={{marginTop: '0.75rem'}}>
          docker-compose.yml (фрагмент)
        </label>
        <pre className={styles.mono}>{COMPOSE_YAML}</pre>
      </DemoCard>
    </DemoShell>
  );
}

export default DockerComposePlayInner;
