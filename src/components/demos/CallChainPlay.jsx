import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CALL_STEPS,
  CALL_TREE,
  activeNodeIdsForStep,
} from '@/components/shared/kb/callChainEngine';
import styles from './executionPerfPlay.module.css';

function renderTree(node, activeIds, depth = 0) {
  const pad = '  '.repeat(depth);
  const active = activeIds.has(node.id);
  return (
    <div key={node.id}>
      <div className={clsx(active && styles.treeActive)}>
        {pad}
        {active ? '▶ ' : '  '}
        {node.label}
      </div>
      {node.children.map((ch) => renderTree(ch, activeIds, depth + 1))}
    </div>
  );
}

function CallChainPlayInner() {
  const [step, setStep] = useState(0);
  const current = CALL_STEPS[step] ?? CALL_STEPS[0];
  const activeIds = activeNodeIdsForStep(step);
  const max = CALL_STEPS.length - 1;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Цепочка вызовов и стек"
        subtitle="Сценарий OrderProcessor — кто кого вызвал и глубина стека"
      >
        <div className="it-demo__progress" style={{marginBottom: '0.35rem'}}>
          <div
            className="it-demo__progress-bar"
            style={{width: `${(step / max) * 100}%`}}
          />
        </div>
        <p style={{textAlign: 'right', fontSize: '0.75rem', color: 'var(--demo-muted)', margin: '0 0 0.75rem'}}>
          Шаг {step + 1} / {CALL_STEPS.length}
        </p>

        <div className={styles.memGrid}>
          <div>
            <span className="it-demo__label">Дерево вызовов</span>
            <div className={styles.tree}>{renderTree(CALL_TREE, activeIds)}</div>
          </div>
          <div>
            <span className="it-demo__label">Стек вызовов (снизу — текущий)</span>
            <div className={styles.stackList}>
              {current.stack.map((frame, i) => (
                <div
                  key={`${frame}-${i}`}
                  className={clsx(
                    styles.frame,
                    i === current.stack.length - 1 && styles.stackFrameActive,
                  )}
                >
                  {frame}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="it-demo__hint" style={{margin: '0.65rem 0'}}>
          {current.note}
        </p>

        <div className="it-demo__controls">
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={step <= 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            ← Назад
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--primary"
            disabled={step >= max}
            onClick={() => setStep((s) => Math.min(max, s + 1))}
          >
            Вперёд →
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => setStep(0)}
          >
            Сброс
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CallChainPlayInner;
