import React, {useMemo, useState} from 'react';
import {ChipRow, MetricGrid, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const PROGRAMS = {
  increment: {
    tape: ['1', '1', '0', '1', '_', '_'],
    head: 0,
    rules: [
      {read: '1', write: '0', move: 1, next: 0},
      {read: '0', write: '1', move: -1, next: 1},
      {read: '_', write: '1', move: 0, next: 2},
    ],
    desc: 'Инкремент двоичного числа справа налево',
  },
  erase: {
    tape: ['1', '0', '1', '_', '_'],
    head: 0,
    rules: [{read: '1', write: '_', move: 1, next: 0}, {read: '0', write: '_', move: 1, next: 0}, {read: '_', write: '_', move: 0, next: 99}],
    desc: 'Стереть все 0/1 до blank',
  },
};

function stepMachine(state) {
  const cell = state.tape[state.head] ?? '_';
  const rule = state.rules.find((r) => r.read === cell) ?? state.rules[0];
  const tape = [...state.tape];
  tape[state.head] = rule.write;
  const head = Math.max(0, Math.min(tape.length - 1, state.head + rule.move));
  return {...state, tape, head, state: rule.next, halted: rule.next === 99};
}

export default function TuringMachinePlay() {
  const [prog, setProg] = useState('increment');
  const [machine, setMachine] = useState(() => ({...PROGRAMS.increment, state: 0, halted: false}));
  const [steps, setSteps] = useState(0);

  const reset = (id) => {
    setProg(id);
    setMachine({...PROGRAMS[id], state: 0, halted: false});
    setSteps(0);
  };

  const runStep = () => {
    if (machine.halted) return;
    setMachine((m) => stepMachine(m));
    setSteps((s) => s + 1);
  };

  const tapeView = useMemo(
    () => machine.tape.map((c, i) => (i === machine.head ? `[${c}]` : c)).join(' '),
    [machine],
  );

  return (
    <PlayRoot title="Машина Тьюринга" subtitle="Лента, головка, таблица переходов">
      <ChipRow
        value={prog}
        onChange={reset}
        options={[
          {id: 'increment', label: 'Increment'},
          {id: 'erase', label: 'Erase'},
        ]}
      />
      <Panel title="Лента">{tapeView}</Panel>
      <p className="it-demo__hint">{PROGRAMS[prog].desc}</p>
      <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={runStep} disabled={machine.halted}>
        Шаг
      </button>
      <MetricGrid items={[{label: 'Шагов', value: String(steps)}, {label: 'State', value: machine.halted ? 'HALT' : String(machine.state)}]} />
    </PlayRoot>
  );
}
