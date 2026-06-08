import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  LOG_LEVELS,
  createLogEntry,
  createStructuredLog,
  levelMeetsMin,
} from '@/components/shared/kb/observabilityEngine';
import {useTerminalBodyScroll} from '@/components/shared/kb/useTerminalBodyScroll';
import styles from '@/components/demos/LogExplorerDemo.module.css';

const LEVEL_STYLE = {
  debug: {color: 'var(--log-debug)'},
  info: {color: 'var(--log-info)'},
  warn: {color: 'var(--log-warn)'},
  error: {color: 'var(--log-error)'},
  critical: {color: 'var(--log-critical)'},
};

function LogExplorerDemoInner() {
  const [logs, setLogs] = useState(() =>
    Array.from({length: 12}, () => createLogEntry()),
  );
  const [minLevel, setMinLevel] = useState('info');
  const [search, setSearch] = useState('');
  const [jsonView, setJsonView] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef(null);
  const streamScrollRef = useRef(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((l) => {
      if (!levelMeetsMin(l.level, minLevel)) return false;
      if (!q) return true;
      return (
        l.message.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q) ||
        l.level.includes(q)
      );
    });
  }, [logs, minLevel, search]);

  const selected = logs.find((l) => l.id === selectedId) ?? filtered[filtered.length - 1];

  const pushLog = useCallback((entry) => {
    setLogs((prev) => [...prev.slice(-80), entry]);
  }, []);

  useEffect(() => {
    if (!streaming) return undefined;
    streamRef.current = setInterval(() => pushLog(createLogEntry()), 900);
    return () => clearInterval(streamRef.current);
  }, [streaming, pushLog]);

  useTerminalBodyScroll(streamScrollRef, [filtered.length]);

  const counts = useMemo(() => {
    const c = {};
    LOG_LEVELS.forEach((l) => {
      c[l.id] = logs.filter((x) => x.level === l.id).length;
    });
    return c;
  }, [logs]);

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Поток логов"
        subtitle="Фильтрация по уровню, поиск по тексту, структурированный JSON — как в ELK, Loki или journalctl">
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Поиск: error, postgres, userId…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className={styles.toggle}>
            <input type="checkbox" checked={jsonView} onChange={(e) => setJsonView(e.target.checked)} />
            JSON
          </label>
          <button
            type="button"
            className={clsx(styles.btn, styles.btnOutline)}
            onClick={() => setStreaming((s) => !s)}>
            {streaming ? '⏸ Пауза' : '▶ Поток'}
          </button>
        </div>

        <div className={styles.levelFilters}>
          {LOG_LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(
                styles.levelChip,
                levelMeetsMin(l.id, minLevel) && styles.levelChipOn,
              )}
              style={{borderColor: l.color, color: l.color}}
              onClick={() => setMinLevel(l.id)}>
              {l.label} ({counts[l.id] ?? 0})
            </button>
          ))}
        </div>

        <div className={styles.actions} style={{margin: '0.5rem 0'}}>
          <button
            type="button"
            className={styles.btn}
            onClick={() =>
              pushLog(createLogEntry({level: 'error', message: 'HTTP 500 — unhandled exception', service: 'order-service'}))
            }>
            + Ошибка
          </button>
          <button
            type="button"
            className={clsx(styles.btn, styles.btnOutline)}
            onClick={() =>
              pushLog(createLogEntry({level: 'warn', message: 'Deprecated API v1 — migrate to v2', service: 'api-gateway'}))
            }>
            + Warning
          </button>
          <button type="button" className={clsx(styles.btn, styles.btnOutline)} onClick={() => setLogs([])}>
            Очистить
          </button>
        </div>

        <div ref={streamScrollRef} className={styles.stream}>
          {filtered.map((l) => (
            <div
              key={l.id}
              role="button"
              tabIndex={0}
              className={clsx(styles.logLine, selected?.id === l.id && styles.logLineSelected)}
              onClick={() => setSelectedId(l.id)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedId(l.id)}>
              <span className={styles.ts}>{l.timestamp}</span>
              <span className={styles.lvl} style={LEVEL_STYLE[l.level]}>
                {l.level.toUpperCase().padEnd(5)}
              </span>
              <span className={styles.svc}>{l.service}</span>
              <span className={styles.msg}>{l.message}</span>
            </div>
          ))}
        </div>

        {selected && jsonView && (
          <pre className={styles.jsonPanel}>{JSON.stringify(createStructuredLog(selected), null, 2)}</pre>
        )}

        <div className={styles.stats}>
          <span>Показано: {filtered.length} / {logs.length}</span>
          <span>Мин. уровень: {minLevel.toUpperCase()}</span>
        </div>

        <p className={styles.stats} style={{marginTop: '0.35rem'}}>
          В продакшене DEBUG отключают, ERROR и CRITICAL уходят в алерты. Централизация (Loki/ELK) позволяет искать по
          trace_id одну цепочку запроса через все микросервисы.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default LogExplorerDemoInner;
