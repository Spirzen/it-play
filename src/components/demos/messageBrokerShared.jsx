import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import styles from './MessageBrokerDemo.module.css';

const LOG_COLORS = {
  info: 'var(--ifm-color-content)',
  success: 'var(--demo-success, #2e7d32)',
  warning: 'var(--demo-warning, #ed6c02)',
  error: 'var(--demo-error, #c62828)',
};

export function useBrokerLog(maxEntries = 60) {
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => {
      const next = [{id: `${Date.now()}-${Math.random()}`, message, type, timestamp}, ...prev];
      return next.slice(0, maxEntries);
    });
  }, [maxEntries]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return {logs, addLog, clearLogs, setLogs};
}

export function BrokerTrack({active, packetTick, durationMs = 1000, color, reverse}) {
  return (
    <div className={styles.track} aria-hidden={!active}>
      <div className={styles.trackInner}>
        <div className={clsx(styles.trackLine, active && styles.trackLineActive)}>
          {active && (
            <span
              key={packetTick}
              className={clsx(styles.packet, styles.packetVisible)}
              style={{
                '--packet-color': color || 'var(--ifm-color-primary)',
                '--packet-duration': `${durationMs}ms`,
              }}
            />
          )}
        </div>
        <span className={styles.trackArrow}>{reverse ? '←' : '→'}</span>
      </div>
    </div>
  );
}

export function BrokerNode({icon, title, hint, active, dim, accent, badge, children}) {
  return (
    <div
      className={clsx(styles.node, active && styles.nodeActive, dim && styles.nodeDim)}
      style={accent ? {'--node-accent': accent} : undefined}
    >
      {badge && <span className={styles.nodeBadge}>{badge}</span>}
      <div className={styles.nodeIcon} aria-hidden>
        {icon}
      </div>
      <p className={styles.nodeTitle}>{title}</p>
      {hint && <p className={styles.nodeHint}>{hint}</p>}
      {children}
    </div>
  );
}

export function SimulationLog({logs, title = 'Журнал событий'}) {
  return (
    <div>
      <p className="it-demo__label" style={{marginBottom: '0.35rem'}}>
        {title}
      </p>
      <div className="it-demo__log" role="log" aria-live="polite">
        {logs.length === 0 ? (
          <p style={{margin: 0, color: 'var(--demo-muted)'}}>Нет событий…</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="it-demo__log-entry" style={{color: LOG_COLORS[log.type] || LOG_COLORS.info}}>
              <span style={{opacity: 0.55}}>[{log.timestamp}]</span> {log.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function StepBar({steps, currentId}) {
  const currentIndex = steps.findIndex((s) => s.id === currentId);

  return (
    <div className="it-demo__steps" role="list" aria-label="Этапы симуляции">
      {steps.map((step, index) => {
        const isActive = step.id === currentId;
        const isDone = currentIndex > index;

        return (
          <div
            key={step.id}
            role="listitem"
            className={clsx(
              'it-demo__step',
              isActive && 'it-demo__step--active',
              isDone && 'it-demo__step--done',
            )}
            style={{cursor: 'default'}}
          >
            <div style={{fontWeight: 600}}>{step.label}</div>
            {step.hint && (
              <div style={{fontSize: '0.72rem', marginTop: '0.2rem', opacity: 0.85}}>{step.hint}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function StatsBar({items}) {
  return (
    <div className={styles.stats}>
      {items.map((item) => (
        <div key={item.label} className={styles.stat}>
          <p className={styles.statLabel}>{item.label}</p>
          <p className={styles.statValue}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
