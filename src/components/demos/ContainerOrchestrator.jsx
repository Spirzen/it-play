import React, {useState, useCallback, useEffect} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DOCKER_STEPS,
  K8S_STEPS,
  makeContainer,
  scalePods,
} from '@/components/shared/kb/orchestratorEngine';
import styles from '@/components/demos/ContainerOrchestrator.module.css';

function ContainerOrchestratorInner() {
  const [mode, setMode] = useState('docker');
  const [stepIndex, setStepIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const [containers, setContainers] = useState([]);
  const [replicas, setReplicas] = useState(3);
  const [pods, setPods] = useState(() => scalePods(3));
  const [log, setLog] = useState([]);

  const steps = mode === 'docker' ? DOCKER_STEPS : K8S_STEPS;

  const appendLog = useCallback((msg) => {
    setLog((prev) => [`[${new Date().toLocaleTimeString('ru-RU')}] ${msg}`, ...prev].slice(0, 6));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(-1);
    setRunning(false);
    setContainers([]);
    setPods(scalePods(replicas));
    setLog([]);
  }, [replicas]);

  const runDemo = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStepIndex(0);
    setLog([]);
    appendLog(mode === 'docker' ? 'docker build -t myapp:1.0 .' : 'kubectl apply -f deployment.yaml');

    let i = 0;
    const tick = () => {
      if (i >= steps.length) {
        setRunning(false);
        appendLog('✓ Готово');
        return;
      }
      setStepIndex(i);
      const step = steps[i];
      appendLog(step.desc);
      if (mode === 'docker' && step.id === 'run') {
        setContainers([makeContainer(1, 'myapp-web')]);
      }
      if (mode === 'k8s' && step.id === 'schedule') {
        setPods(scalePods(replicas));
      }
      i += 1;
      setTimeout(tick, 1400);
    };
    tick();
  }, [running, mode, steps, replicas, appendLog]);

  useEffect(() => {
    setPods(scalePods(replicas));
  }, [replicas]);

  useEffect(() => {
    reset();
  }, [mode, reset]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Контейнеры и оркестрация"
        subtitle="Сравните одиночный Docker на хосте и управление репликами в Kubernetes."
      >
        <div className={styles.modeTabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'docker'}
            className={clsx('it-demo__btn', mode === 'docker' && 'it-demo__btn--primary')}
            onClick={() => setMode('docker')}
          >
            Docker
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'k8s'}
            className={clsx('it-demo__btn', mode === 'k8s' && 'it-demo__btn--primary')}
            onClick={() => setMode('k8s')}
          >
            Kubernetes
          </button>
        </div>

        <div className={styles.host}>
          <span className={styles.hostLabel}>
            {mode === 'docker' ? 'Docker Host (Linux)' : 'Worker Node'}
          </span>

          {mode === 'docker' ? (
            <div className={styles.containers}>
              {containers.length === 0 ? (
                <span style={{fontSize: '0.85rem', color: 'var(--demo-muted)'}}>
                  Контейнеры появятся после шага "Запуск"
                </span>
              ) : (
                containers.map((c) => (
                  <div key={c.id} className={clsx(styles.containerCard, styles.containerCardEnter)}>
                    <strong>{c.name}</strong>
                    <div>status: {c.status}</div>
                    <div>CPU {c.cpu} · RAM {c.mem}</div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <div className={styles.podGrid}>
                {pods.map((p) => (
                  <div
                    key={p.id}
                    className={clsx(styles.pod, p.status === 'Pending' && styles.podPending)}
                  >
                    <div>{p.name}</div>
                    <div>{p.status}</div>
                    <div style={{opacity: 0.7}}>↻ {p.restarts}</div>
                  </div>
                ))}
              </div>
              <div className={styles.serviceBox}>
                Service myapp-svc → ClusterIP 10.96.0.42:{replicas} endpoints
              </div>
            </>
          )}
        </div>

        {mode === 'k8s' && (
          <div className={styles.controlPanel}>
            <div className={styles.sliderRow}>
              <label htmlFor="replicas">Replicas:</label>
              <input
                id="replicas"
                type="range"
                min={1}
                max={8}
                value={replicas}
                disabled={running}
                onChange={(e) => setReplicas(Number(e.target.value))}
              />
              <strong>{replicas}</strong>
            </div>
          </div>
        )}

        <ul className={styles.stepList} aria-label="Этапы">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className={clsx(styles.stepItem, {
                [styles.stepItemActive]: stepIndex === index,
                [styles.stepItemDone]: stepIndex > index,
              })}
            >
              <strong>{step.label}.</strong> {step.desc}
            </li>
          ))}
        </ul>

        {log.length > 0 && (
          <div className="it-demo__log" style={{marginTop: '0.75rem'}} role="log">
            {log.map((entry, idx) => (
              <div key={idx} className="it-demo__log-entry">
                {entry}
              </div>
            ))}
          </div>
        )}

        <div className="it-demo__row" style={{marginTop: '1rem'}}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={running}
            onClick={runDemo}
          >
            {running ? 'Выполняется…' : 'Запустить сценарий'}
          </button>
          <button type="button" className="it-demo__btn" onClick={reset} disabled={running}>
            Сброс
          </button>
        </div>

        <div className="it-demo__alert it-demo__alert--info" style={{marginTop: '1rem'}}>
          Контейнер — экземпляр образа на одном хосте. Kubernetes координирует множество pod
          на кластере: масштабирование, self-healing и балансировка через Service.
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ContainerOrchestratorInner;
