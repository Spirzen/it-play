import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {DFA_PRESETS, runDfa} from '@/components/shared/kb/finiteAutomatonEngine';
import styles from '@/components/demos/FiniteAutomatonDemo.module.css';

const STATE_POS = {
  'ends-ab': {q0: {left: '18%', top: '45%'}, q1: {left: '50%', top: '45%'}, q2: {left: '82%', top: '45%'}},
  'even-a': {even: {left: '35%', top: '50%'}, odd: {left: '65%', top: '50%'}},
  'has-01': {s0: {left: '20%', top: '50%'}, s1: {left: '50%', top: '50%'}, s2: {left: '80%', top: '50%'}},
};

function FiniteAutomatonDemoInner() {
  const [presetId, setPresetId] = useState('ends-ab');
  const [input, setInput] = useState('xxab');
  const [playIdx, setPlayIdx] = useState(-1);

  const preset = DFA_PRESETS.find((p) => p.id === presetId) ?? DFA_PRESETS[0];
  const run = useMemo(() => runDfa(preset, input), [preset, input]);
  const activeStep = playIdx >= 0 ? run.steps[playIdx] : run.steps[run.steps.length - 1];
  const positions = STATE_POS[presetId] ?? {};

  const applyPreset = (id) => {
    const p = DFA_PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setInput(p.sampleOk);
    setPlayIdx(-1);
  };

  const stepForward = () => {
    setPlayIdx((i) => Math.min(i + 1, run.steps.length - 1));
  };

  return (
    <DemoShell>
      <DemoCard
        title="Конечный автомат (ДКА)"
        subtitle="Пошаговое распознавание строки — модель лексера и регулярных языков"
      >
        <div className={styles.layout}>
          <div className={styles.row}>
            <select className={styles.select} value={presetId} onChange={(e) => applyPreset(e.target.value)}>
              {DFA_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <input
              className={styles.input}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setPlayIdx(-1);
              }}
              aria-label="Входная строка"
            />
            <button type="button" className={styles.btn} onClick={() => setPlayIdx(0)}>
              С начала
            </button>
            <button
              type="button"
              className={styles.btn}
              disabled={playIdx >= run.steps.length - 1}
              onClick={stepForward}
            >
              Символ →
            </button>
          </div>

          <div className={styles.diagram} aria-hidden>
            {preset.states.map((s) => {
              const pos = positions[s.id] ?? {left: '50%', top: '50%'};
              const active = activeStep?.state === s.id;
              return (
                <div
                  key={s.id}
                  className={clsx(styles.state, s.accept && styles.stateAccept, active && styles.stateActive)}
                  style={{left: pos.left, top: pos.top}}
                  title={s.label}
                >
                  {s.label}
                </div>
              );
            })}
          </div>

          <div className={styles.timeline}>
            {input.split('').map((ch, i) => (
              <span key={i} className={clsx(styles.char, activeStep?.index === i && styles.charActive)}>
                {ch}
              </span>
            ))}
            <span className={styles.char}>#</span>
          </div>

          <p className={clsx(styles.verdict, run.accepted ? styles.ok : styles.fail)}>
            {run.stuck
              ? `Отклонено: ${run.steps[run.steps.length - 1]?.error ?? 'нет перехода'}`
              : run.accepted
                ? `Принято в состоянии "${run.final}"`
                : `Отклонено (конечное состояние "${run.final}" не принимающее)`}
          </p>

          <p className={styles.note}>{preset.note}</p>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default FiniteAutomatonDemoInner;
