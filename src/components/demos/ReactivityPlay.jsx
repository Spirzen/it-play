import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  LpActionBar,
  LpArrow,
  LpChip,
  LpChipRow,
  LpLog,
  LpSection,
  LpStack,
} from './languagePlayUi';
import styles from './languageAdvancedPlays.module.css';

const STAGES = [
  {id: 'emit', label: 'emit', nodes: ['source'], log: 'source.next(42) — событие создано'},
  {id: 'map', label: 'map', nodes: ['source', 'map'], log: 'map: 42 → 84'},
  {id: 'filter', label: 'filter', nodes: ['source', 'map', 'filter'], log: 'filter: 84 > 50 — пропускаем дальше'},
  {id: 'sub', label: 'subscribe', nodes: ['source', 'map', 'filter', 'subscriber'], log: 'subscriber получает 84'},
];

const NODES = ['source', 'map', 'filter', 'subscriber'];

function ReactivityPlayInner() {
  const [stage, setStage] = useState(-1);
  const [mode, setMode] = useState('cold');

  const advance = useCallback(() => {
    setStage((s) => Math.min(s + 1, STAGES.length - 1));
  }, []);

  const reset = () => setStage(-1);

  const current = stage >= 0 ? STAGES[stage] : null;
  const activeSet = new Set(current?.nodes ?? []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Reactive pipeline"
        subtitle="RxJS / Observable — cold vs hot, операторы map и filter"
      >
        <LpStack>
          <LpChipRow>
            <LpChip active={mode === 'cold'} onClick={() => setMode('cold')}>
              Cold (lazy)
            </LpChip>
            <LpChip active={mode === 'hot'} onClick={() => setMode('hot')}>
              Hot (shared)
            </LpChip>
          </LpChipRow>

          <LpSection label="Pipeline">
            <div className={styles.flow}>
              {NODES.map((n, i) => (
                <React.Fragment key={n}>
                  {i > 0 && <LpArrow />}
                  <span className={clsx(styles.node, activeSet.has(n) && styles.nodeActive)}>{n}</span>
                </React.Fragment>
              ))}
            </div>
          </LpSection>

          <LpLog variant={current ? 'success' : 'info'}>
            {current?.log ??
              (mode === 'cold'
                ? 'Cold: новый pipeline на каждый subscribe — данные заново.'
                : 'Hot: один поток — несколько подписчиков делят события.')}
          </LpLog>

          <LpActionBar>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--sm it-demo__btn--primary"
              onClick={advance}
              disabled={stage >= STAGES.length - 1}
            >
              Следующий шаг
            </button>
            <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={reset}>
              Сброс
            </button>
          </LpActionBar>
        </LpStack>
      </DemoCard>
    </DemoShell>
  );
}

export default ReactivityPlayInner;
