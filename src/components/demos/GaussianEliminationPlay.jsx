import React, {useMemo, useState} from 'react';
import {DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

function clone(m) {
  return m.map((r) => [...r]);
}

function jordanStep(matrix, col) {
  const m = clone(matrix);
  const pivot = m.findIndex((row) => Math.abs(row[col]) > 1e-9);
  if (pivot < 0) return m;
  const div = m[pivot][col];
  m[pivot] = m[pivot].map((v) => v / div);
  for (let r = 0; r < m.length; r += 1) {
    if (r === pivot) continue;
    const f = m[r][col];
    m[r] = m[r].map((v, j) => v - f * m[pivot][j]);
  }
  return m;
}

const START = [
  [1, 1, 1, 8],
  [1, 2, 0, 6],
  [0, 1, 1, 5],
];

export default function GaussianEliminationPlay() {
  const [step, setStep] = useState(0);

  const matrix = useMemo(() => {
    let m = clone(START);
    for (let c = 0; c <= step && c < 3; c += 1) m = jordanStep(m, c);
    return m;
  }, [step]);

  const rows = matrix.map((r, i) => ({
    row: `R${i + 1}`,
    c1: r[0].toFixed(2),
    c2: r[1].toFixed(2),
    c3: r[2].toFixed(2),
    rhs: r[3].toFixed(2),
  }));

  return (
    <PlayRoot title="Жордан–Гаусс" subtitle="Приведение расширенной матрицы к единичным столбцам">
      <DataTable columns={['row', 'c1', 'c2', 'c3', 'rhs']} rows={rows} />
      <button type="button" className="it-demo__btn it-demo__btn--primary" disabled={step >= 3} onClick={() => setStep((s) => s + 1)}>
        Шаг жordan
      </button>
      <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={() => setStep(0)}>
        Сброс
      </button>
    </PlayRoot>
  );
}
