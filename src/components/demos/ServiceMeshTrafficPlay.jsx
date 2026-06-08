import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {MESH_POLICIES, MESH_SERVICES} from '@/components/shared/kb/devopsCiCdEngines';
import styles from './devopsCiCdDemo.module.css';

function ServiceMeshTrafficPlayInner() {
  const [mtls, setMtls] = useState(true);
  const [canaryPct, setCanaryPct] = useState(10);
  const [policyIdx, setPolicyIdx] = useState(0);
  const [requestPath, setRequestPath] = useState([]);

  const policy = MESH_POLICIES[policyIdx];

  const sendRequest = () => {
    const hitCanary = Math.random() * 100 < canaryPct;
    setRequestPath([
      'client → ingress gateway',
      'Envoy sidecar (catalog)',
      hitCanary ? 'route: checkout v2-canary' : 'route: checkout v1',
      mtls ? 'mTLS: peer certificate verified' : '⚠ plaintext between pods',
      '200 OK',
    ]);
    setTimeout(() => setRequestPath([]), 4000);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Service Mesh: data plane и трафик"
        subtitle="Sidecar Envoy перехватывает весь трафик; Istiod (control plane) пушит политики"
      >
        <div className={styles.meshGrid}>
          {MESH_SERVICES.map((svc) => (
            <div key={svc.id} className={styles.meshPod}>
              <strong>{svc.label}</strong>
              <div>{svc.version}</div>
              <div className={styles.meshSidecar}>Envoy sidecar</div>
            </div>
          ))}
        </div>

        <div className={styles.chips}>
          {MESH_POLICIES.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.chip, policyIdx === i && styles.chipActive)}
              onClick={() => setPolicyIdx(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p style={{fontSize: '0.82rem', margin: '0 0 0.5rem'}}>{policy.detail}</p>

        <label className="it-demo__label">
          Canary на checkout: {canaryPct}% → v2
        </label>
        <input
          type="range"
          className={styles.slider}
          min={0}
          max={100}
          value={canaryPct}
          onChange={(e) => setCanaryPct(Number(e.target.value))}
        />
        <div className={styles.trafficBar}>
          <div className={styles.trafficOld} style={{width: `${100 - canaryPct}%`}}>
            v1 {100 - canaryPct}%
          </div>
          <div className={styles.trafficNew} style={{width: `${canaryPct}%`}}>
            v2 {canaryPct}%
          </div>
        </div>

        <label className="it-demo__label" style={{display: 'flex', gap: '0.4rem', alignItems: 'center'}}>
          <input type="checkbox" checked={mtls} onChange={(e) => setMtls(e.target.checked)} />
          mTLS STRICT между сервисами
        </label>

        {requestPath.length > 0 && (
          <div className={styles.logBox}>
            {requestPath.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        )}

        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={sendRequest}>
          Отправить запрос через mesh
        </button>
        <p className="it-demo__hint" style={{marginBottom: 0}}>
          Приложение не меняется — сетевая логика в sidecar и конфигурации control plane.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ServiceMeshTrafficPlayInner;
