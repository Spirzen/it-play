import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/AgentTraceExplorerPlay.module.css';

const SPANS = [
  {id: 'root', name: 'agent.run', type: 'trace', ms: 4200, indent: 0, meta: 'run_id=abc123'},
  {id: 'llm1', name: 'llm.completion', type: 'llm', ms: 890, indent: 1, meta: 'tokens_in=1200, out=45'},
  {id: 'tool1', name: 'tool.search_kb', type: 'tool', ms: 320, indent: 1, meta: 'query="отпуск", hits=3'},
  {id: 'llm2', name: 'llm.completion', type: 'llm', ms: 1100, indent: 1, meta: 'tokens_in=2400, out=120'},
  {id: 'tool2', name: 'tool.send_email', type: 'tool', ms: 180, indent: 1, meta: 'to=hr@corp.ru, status=blocked'},
  {id: 'decision', name: 'decision.hitl_gate', type: 'decision', ms: 0, indent: 1, meta: 'action=send_email → require_approval'},
];

const TABS = [
  {id: 'trace', label: 'Traces'},
  {id: 'logs', label: 'Logs'},
  {id: 'metrics', label: 'Metrics'},
];

function AgentTraceExplorerPlayInner() {
  const [active, setActive] = useState('root');
  const [tab, setTab] = useState('trace');
  const span = SPANS.find((s) => s.id === active) ?? SPANS[0];

  return (
    <DemoShell className={shared.rootWide}>
      <DemoCard title="Trace агента" subtitle="Waterfall: LLM → tools → decisions (AgentOps)">
        <div className={shared.chipRowScroll}>
          {TABS.map((t) => (
            <button key={t.id} type="button" className={clsx(shared.chip, tab === t.id && shared.chipActive)} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'trace' && (
          <div className={clsx(shared.scrollArea, styles.tree)}>
            {SPANS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={clsx(styles.span, styles[`type_${s.type}`], active === s.id && styles.spanActive)}
                style={{paddingLeft: `calc(0.5rem + ${s.indent} * 1.1rem)`}}
                onClick={() => setActive(s.id)}
              >
                <span className={styles.spanName}>{s.name}</span>
                <span className={styles.spanMs}>{s.ms} ms</span>
              </button>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <pre className={shared.codeBlock}>{`[INFO] prompt_hash=8f3a…\n[TOOL] search_kb → 3 chunks\n[WARN] send_email blocked by policy`}</pre>
        )}

        {tab === 'metrics' && (
          <div className={shared.statGrid}>
            <div className={shared.statBox}><span className={shared.statValue}>3.7k</span><span className={shared.statLabel}>tokens/run</span></div>
            <div className={shared.statBox}><span className={shared.statValue}>$0.04</span><span className={shared.statLabel}>cost</span></div>
            <div className={shared.statBox}><span className={shared.statValue}>1</span><span className={shared.statLabel}>tool errors</span></div>
            <div className={shared.statBox}><span className={shared.statValue}>0.87</span><span className={shared.statLabel}>eval score</span></div>
          </div>
        )}

        <div className={shared.panelAccent}>
          <strong className={styles.spanTitle}>{span.name}</strong>
          <p className={styles.meta}>{span.meta}</p>
        </div>

        <p className={shared.hint}>AgentOps делает <strong>decisions</strong> наблюдаемыми: tool, doc_id, HITL-gate.</p>
      </DemoCard>
    </DemoShell>
  );
}

export default AgentTraceExplorerPlayInner;
