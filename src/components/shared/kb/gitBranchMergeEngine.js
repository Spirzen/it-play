export const MERGE_SCENARIOS = [
  {
    id: 'fast-forward',
    label: 'Fast-forward',
    hint: 'main просто "переезжает" на tip feature — история линейная',
  },
  {
    id: 'merge-commit',
    label: 'Merge commit',
    hint: 'Появляется коммит слияния с двумя родителями',
  },
  {
    id: 'conflict',
    label: 'Конфликт',
    hint: 'Одна строка изменена в обеих ветках — нужно ручное разрешение',
  },
];

export function initialMergeState() {
  return {
    step: 0,
    head: 'main',
    branches: {
      main: {tip: 'm2', commits: ['m0', 'm1', 'm2']},
      feature: {tip: 'f2', commits: ['m0', 'm1', 'f1', 'f2'], fork: 'm1'},
    },
    files: {'app.js': 'console.log("v1");'},
    log: ['main: m0 → m1 → m2'],
  };
}

export function advanceMerge(state, scenarioId) {
  const s = {...state, log: [...state.log]};
  if (scenarioId === 'fast-forward') {
    if (s.step === 0) {
      s.step = 1;
      s.branches = {
        ...s.branches,
        main: {tip: 'f2', commits: ['m0', 'm1', 'f1', 'f2']},
      };
      s.head = 'main';
      s.log.push('git checkout main && git merge feature → FF, HEAD на f2');
      return s;
    }
  }
  if (scenarioId === 'merge-commit') {
    if (s.step === 0) {
      s.branches.main.commits = ['m0', 'm1', 'm2', 'm3'];
      s.branches.main.tip = 'm3';
      s.step = 1;
      s.log.push('На main добавлен m3 параллельно feature');
      return s;
    }
    if (s.step === 1) {
      s.branches.main.commits.push('merge1');
      s.branches.main.tip = 'merge1';
      s.step = 2;
      s.log.push('git merge feature → коммит merge1 (два родителя: m3, f2)');
      return s;
    }
  }
  if (scenarioId === 'conflict') {
    if (s.step === 0) {
      s.branches.feature.files = {'app.js': 'console.log("feature");'};
      s.branches.main.files = {'app.js': 'console.log("main fix");'};
      s.step = 1;
      s.conflict = true;
      s.log.push('CONFLICT in app.js — обе ветки изменили одну строку');
      return s;
    }
    if (s.step === 1) {
      s.conflict = false;
      s.files = {'app.js': 'console.log("merged");'};
      s.step = 2;
      s.log.push('Разрешили вручную → git add → git commit (merge)');
      return s;
    }
  }
  return s;
}
