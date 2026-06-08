/** Конечные автоматы для демо формальных языков */

export const DFA_PRESETS = [
  {
    id: 'ends-ab',
    label: 'Строка заканчивается на ab',
    alphabet: 'a, b',
    sampleOk: 'xxab',
    sampleFail: 'aba',
    states: [
      {id: 'q0', label: 'q₀', accept: false},
      {id: 'q1', label: 'q₁', accept: false},
      {id: 'q2', label: 'q₂', accept: true},
    ],
    start: 'q0',
    transitions: [
      {from: 'q0', on: 'a', to: 'q1'},
      {from: 'q0', on: 'b', to: 'q0'},
      {from: 'q1', on: 'a', to: 'q1'},
      {from: 'q1', on: 'b', to: 'q2'},
      {from: 'q2', on: 'a', to: 'q1'},
      {from: 'q2', on: 'b', to: 'q0'},
    ],
    note: 'Регулярный язык: лексер ищет суффиксы, протоколы — фиксированные окончания кадра.',
  },
  {
    id: 'even-a',
    label: 'Чётное число символов a',
    alphabet: 'a, b',
    sampleOk: 'aabba',
    sampleFail: 'aaa',
    states: [
      {id: 'even', label: 'чёт', accept: true},
      {id: 'odd', label: 'нечёт', accept: false},
    ],
    start: 'even',
    transitions: [
      {from: 'even', on: 'a', to: 'odd'},
      {from: 'even', on: 'b', to: 'even'},
      {from: 'odd', on: 'a', to: 'even'},
      {from: 'odd', on: 'b', to: 'odd'},
    ],
    note: 'ДКА с двумя состояниями — счётчик по модулю 2; основа проверки чётности битов.',
  },
  {
    id: 'has-01',
    label: 'Содержит подстроку 01',
    alphabet: '0, 1',
    sampleOk: '1001',
    sampleFail: '111',
    states: [
      {id: 's0', label: 'нет 01', accept: false},
      {id: 's1', label: 'видели 0', accept: false},
      {id: 's2', label: 'есть 01', accept: true},
    ],
    start: 's0',
    transitions: [
      {from: 's0', on: '0', to: 's1'},
      {from: 's0', on: '1', to: 's0'},
      {from: 's1', on: '0', to: 's1'},
      {from: 's1', on: '1', to: 's2'},
      {from: 's2', on: '0', to: 's1'},
      {from: 's2', on: '1', to: 's2'},
    ],
    note: 'После принятия строки автомат остаётся в принимающем состоянии.',
  },
];

export function runDfa(preset, input) {
  const steps = [];
  let state = preset.start;
  const chars = [...input];
  steps.push({index: -1, char: null, state, accept: isAccept(preset, state)});

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const tr = preset.transitions.find((t) => t.from === state && t.on === ch);
    if (!tr) {
      steps.push({
        index: i,
        char: ch,
        state,
        accept: false,
        error: `Нет перехода из ${state} по "${ch}"`,
      });
      return {steps, final: state, accepted: false, stuck: true};
    }
    state = tr.to;
    steps.push({
      index: i,
      char: ch,
      state,
      accept: isAccept(preset, state),
    });
  }
  const accepted = isAccept(preset, state);
  return {steps, final: state, accepted, stuck: false};
}

function isAccept(preset, stateId) {
  return preset.states.find((s) => s.id === stateId)?.accept ?? false;
}
