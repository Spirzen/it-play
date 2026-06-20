import React, {useState} from 'react';
import {ChipRow, Panel, PlayRoot, styles} from '@/components/shared/dataMarkupPlayKit';

const DERIVATIONS = {
  balanced: {
    target: 'a+b',
    steps: ['S → a+b', 'S → a + B', 'S → a + b ✓'],
  },
  nested: {
    target: 'id+id*id',
    steps: ['E → E+T', 'E → T+T', 'E → id+T', 'E → id+T*F', 'E → id+id*F', 'E → id+id*id ✓'],
  },
};

export default function GrammarDerivationPlay() {
  const [key, setKey] = useState('balanced');
  const [step, setStep] = useState(0);
  const d = DERIVATIONS[key];
  const current = d.steps[Math.min(step, d.steps.length - 1)];

  return (
    <PlayRoot title="Вывод в КС-грамматике" subtitle="Пошаговый derivation дерева разбора">
      <ChipRow
        value={key}
        onChange={(id) => {
          setKey(id);
          setStep(0);
        }}
        options={[
          {id: 'balanced', label: 'S → a+b'},
          {id: 'nested', label: 'Выражение id+id*id'},
        ]}
      />
      <Panel title={`Цель: ${d.target}`}>
        <div className={styles.timeline}>
          {d.steps.map((s, i) => (
            <div key={s} className={styles.timelineStep + (i === step ? ` ${styles.timelineStepActive}` : '')}>
              {s}
            </div>
          ))}
        </div>
      </Panel>
      <div style={{display: 'flex', gap: '0.5rem'}}>
        <button type="button" className="it-demo__btn it-demo__btn--secondary" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          ←
        </button>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--primary"
          disabled={step >= d.steps.length - 1}
          onClick={() => setStep((s) => s + 1)}
        >
          Шаг →
        </button>
      </div>
      <p className="it-demo__hint">Текущая строка: <code>{current}</code></p>
    </PlayRoot>
  );
}
