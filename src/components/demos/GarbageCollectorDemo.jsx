import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  GC_PHASE,
  createMemoryBlock,
  toggleBlockReachable,
  markBlocks,
  sweepBlocks,
  memoryStats,
} from '@/components/shared/kb/gcEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/GarbageCollectorDemo.module.css';

const MAX_LOG = 12;
const MARK_MS = 700;
const SWEEP_MS = 700;

function StatCard({value, label, color}) {
  return (
    <div className={shared.stat}>
      <div className={shared.statValue} style={{color}}>
        {value}
      </div>
      <div className={shared.statLabel}>{label}</div>
    </div>
  );
}

function HeapPanel({stats, phase, phaseLabel, roots, blocks, isCollecting, onToggle}) {
  return (
    <div className={styles.heap}>
      <div className={styles.heapHead}>
        <span>Куча (heap){stats.total ? ` · ${stats.total} KB` : ''}</span>
        <span
          className={clsx(
            styles.phaseBadge,
            phase === GC_PHASE.mark && styles.phaseMark,
            phase === GC_PHASE.sweep && styles.phaseSweep,
            phase === GC_PHASE.idle && styles.phaseIdle,
          )}
        >
          {phaseLabel}
        </span>
      </div>

      {roots.length > 0 && (
        <div className={styles.roots}>
          <span>GC roots:</span>
          {roots.map((b) => (
            <span key={b.id} className={styles.rootChip}>
              → {b.name}
            </span>
          ))}
        </div>
      )}

      {blocks.length === 0 ? (
        <div className={styles.emptyHeap}>
          Нажмите "Выделить память", затем переключайте достижимость кликом по блоку
        </div>
      ) : (
        <div className={styles.blocks}>
          {blocks.map((block) => (
            <button
              key={block.id}
              type="button"
              className={clsx(
                styles.block,
                block.reachable || block.rooted ? styles.blockAlive : styles.blockGarbage,
                block.marked && styles.blockMarked,
                block.rooted && styles.blockRooted,
              )}
              onClick={() => onToggle(block.id)}
              disabled={isCollecting}
              title="Клик — переключить достижимость"
            >
              <strong>{block.name}</strong>
              <span className={styles.blockMeta}>{block.size} KB</span>
              <span className={styles.blockMeta}>
                {block.rooted ? 'root' : block.reachable ? 'reachable' : 'garbage'}
              </span>
              {block.marked && <span className={styles.blockMarkedTag}>marked</span>}
            </button>
          ))}
        </div>
      )}

      {isCollecting && (
        <div className={styles.collectingBar}>
          {phase === GC_PHASE.mark ? 'Mark…' : 'Sweep…'} · помечено:{' '}
          {blocks.filter((b) => b.marked).length}
        </div>
      )}
    </div>
  );
}

function EventLog({log}) {
  return (
    <div style={{marginTop: '1rem'}}>
      <div className="it-demo__label">Журнал</div>
      <div className="it-demo__log">
        {log.map((entry, idx) => (
          <div
            key={`${idx}-${entry.slice(0, 24)}`}
            className="it-demo__log-entry"
            style={{color: idx === 0 ? 'var(--ifm-color-content)' : 'var(--demo-muted)'}}
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
}

function GarbageCollectorDemoInner() {
  const [blocks, setBlocks] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [phase, setPhase] = useState(GC_PHASE.idle);
  const [log, setLog] = useState(['Готово. Выделите объекты или включите авто-GC.']);
  const [autoCollect, setAutoCollect] = useState(false);
  const runId = useRef(0);

  const pushLog = useCallback((msg) => {
    setLog((prev) => [msg, ...prev.slice(0, MAX_LOG - 1)]);
  }, []);

  const isCollecting = phase !== GC_PHASE.idle;
  const stats = memoryStats(blocks);

  const allocate = () => {
    if (isCollecting) return;
    const block = createMemoryBlock(nextId);
    setBlocks((prev) => [...prev, block]);
    setNextId((id) => id + 1);
    pushLog(
      `+ ${block.name} (${block.size} KB) — ${block.reachable ? 'достижим' : 'мусор'}${block.rooted ? ', root' : ''}`,
    );
  };

  const runGc = useCallback(async () => {
    if (isCollecting || blocks.length === 0) return;
    const id = ++runId.current;

    setPhase(GC_PHASE.mark);
    pushLog('Mark: обход от корней (GC roots)…');
    await delay(MARK_MS);
    if (id !== runId.current) return;

    setBlocks((prev) => markBlocks(prev));
    setPhase(GC_PHASE.sweep);
    pushLog('Sweep: удаление непомеченных…');
    await delay(SWEEP_MS);
    if (id !== runId.current) return;

    setBlocks((prev) => {
      const {kept, removed} = sweepBlocks(prev);
      if (removed.length) {
        pushLog(
          `Удалено: ${removed.map((b) => b.name).join(', ')} (−${removed.reduce((s, b) => s + b.size, 0)} KB)`,
        );
      } else {
        pushLog('Мусора не найдено');
      }
      return kept;
    });

    setPhase(GC_PHASE.idle);
    pushLog('Сборка завершена');
  }, [blocks.length, isCollecting, pushLog]);

  useEffect(() => {
    if (!autoCollect || blocks.length === 0) return undefined;
    const timer = setInterval(() => {
      if (phase === GC_PHASE.idle) runGc();
    }, 6000);
    return () => clearInterval(timer);
  }, [autoCollect, blocks.length, phase, runGc]);

  const reset = () => {
    runId.current += 1;
    setBlocks([]);
    setNextId(1);
    setPhase(GC_PHASE.idle);
    setLog(['Демо сброшено']);
  };

  const onToggle = (blockId) => {
    if (isCollecting) return;
    setBlocks((prev) => {
      const b = prev.find((x) => x.id === blockId);
      const next = toggleBlockReachable(prev, blockId);
      const now = next.find((x) => x.id === blockId);
      if (b && now) {
        pushLog(`${b.name}: ${now.reachable ? 'достижим' : 'мусор'}`);
      }
      return next;
    });
  };

  const phaseLabel =
    phase === GC_PHASE.mark ? 'Mark' : phase === GC_PHASE.sweep ? 'Sweep' : 'Ожидание';

  const roots = blocks.filter((b) => b.rooted);

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Сборщик мусора (Mark-and-Sweep)"
        subtitle="Клик по блоку меняет достижимость. Корни (roots) защищают объекты от удаления."
      >
        <div className={shared.stats}>
          <StatCard value={stats.count} label="Объектов" color="var(--ifm-color-primary)" />
          <StatCard value={`${stats.alive} KB`} label="Живая память" color="var(--demo-success, #2e7d32)" />
          <StatCard value={`${stats.garbage} KB`} label="Мусор" color="var(--demo-error, #c62828)" />
          <StatCard value={stats.rooted} label="Корней" color="var(--ifm-color-primary)" />
        </div>

        <div className={shared.controls}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary it-demo__btn--sm"
            onClick={allocate}
            disabled={isCollecting}
          >
            Выделить память
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm"
            onClick={runGc}
            disabled={isCollecting || blocks.length === 0}
          >
            Запустить GC
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--danger it-demo__btn--sm"
            onClick={reset}
            disabled={isCollecting}
          >
            Сброс
          </button>
          <label className={styles.autoLabel}>
            <input
              type="checkbox"
              checked={autoCollect}
              onChange={(e) => setAutoCollect(e.target.checked)}
              disabled={isCollecting}
            />
            Авто-GC (6 с)
          </label>
        </div>

        <HeapPanel
          stats={stats}
          phase={phase}
          phaseLabel={phaseLabel}
          roots={roots}
          blocks={blocks}
          isCollecting={isCollecting}
          onToggle={onToggle}
        />

        <EventLog log={log} />

        <div className={shared.hint}>
          <strong>Mark-and-Sweep:</strong> сначала помечаются объекты, достижимые от корней (globals,
          стек), затем удаляется всё непомеченное. В реальных VM часто добавляют поколения и
          инкрементальную сборку.
        </div>
      </DemoCard>
    </DemoShell>
  );
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default GarbageCollectorDemoInner;
