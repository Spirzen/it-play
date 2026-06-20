import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CdBtn, CdHint, CdLifecycleTrack, CdStack, CdVerdict} from '@/components/shared/kb/codeDevPlayKit';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const STATES = [
  {id: 'created', label: 'Created', hint: 'onCreate() — инициализация Activity/Fragment'},
  {id: 'started', label: 'Started', hint: 'onStart() — видим, но не в фокусе'},
  {id: 'resumed', label: 'Resumed', hint: 'onResume() — интерактивен, анимации'},
  {id: 'paused', label: 'Paused', hint: 'onPause() — частично скрыт, сохранить state'},
  {id: 'stopped', label: 'Stopped', hint: 'onStop() — не виден'},
  {id: 'destroyed', label: 'Destroyed', hint: 'onDestroy() — освобождение ресурсов'},
];

const TRANSITIONS = {
  created: ['started'],
  started: ['resumed', 'stopped'],
  resumed: ['paused'],
  paused: ['resumed', 'stopped'],
  stopped: ['started', 'destroyed'],
  destroyed: [],
};

function MobileLifecyclePlayInner() {
  const [state, setState] = useState('created');
  const [history, setHistory] = useState(['created']);

  const go = (next) => {
    if (!TRANSITIONS[state]?.includes(next)) return;
    setState(next);
    setHistory((h) => [...h, next]);
  };

  const current = STATES.find((s) => s.id === state);

  return (
    <DemoShell>
      <DemoCard title="Жизненный цикл экрана" subtitle="Android Activity / iOS ViewController — упрощённо">
        <CdStack>
          <CdLifecycleTrack states={STATES} active={state} allowed={TRANSITIONS[state] || []} onSelect={go} />

          <CdVerdict tone="info">{current.hint}</CdVerdict>

          <div className={styles.lifecycleActions}>
            {(TRANSITIONS[state] || []).map((t) => {
              const st = STATES.find((s) => s.id === t);
              return (
                <button key={t} type="button" className={styles.lifecycleBtn} onClick={() => go(t)}>
                  → {st?.label}
                </button>
              );
            })}
            {!TRANSITIONS[state]?.length && <CdHint>Конечное состояние — нажмите «Сброс».</CdHint>}
          </div>

          <p className={styles.sectionLabel}>История переходов</p>
          <div className={styles.historyTrail}>
            {history.map((h, i) => (
              <span key={i} className={`${styles.historyChip} ${i === history.length - 1 ? styles.historyChipActive : ''}`}>
                {STATES.find((s) => s.id === h)?.label}
              </span>
            ))}
          </div>

          <CdBtn onClick={() => { setState('created'); setHistory(['created']); }}>Сброс</CdBtn>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default MobileLifecyclePlayInner;
