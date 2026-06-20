import React, {useMemo, useState} from 'react';
import {DataTable, PlayRoot, StepPipeline} from '@/components/shared/dataMarkupPlayKit';

const BASE = [
  {id: 1, region: 'West', amount: 120, active: true},
  {id: 2, region: 'East', amount: 80, active: false},
  {id: 3, region: 'West', amount: 200, active: true},
  {id: 4, region: 'East', amount: 150, active: true},
];

const STEPS = [
  {id: 'from', label: 'FROM'},
  {id: 'where', label: 'WHERE'},
  {id: 'group', label: 'GROUP BY'},
  {id: 'having', label: 'HAVING'},
  {id: 'select', label: 'SELECT'},
  {id: 'order', label: 'ORDER BY'},
];

function applyStep(step, rows) {
  if (step === 'from') return rows;
  if (step === 'where') return rows.filter((r) => r.active);
  if (step === 'group') {
    const m = {};
    rows.forEach((r) => {
      m[r.region] = (m[r.region] ?? 0) + r.amount;
    });
    return Object.entries(m).map(([region, total]) => ({region, total}));
  }
  if (step === 'having') return rows.filter((r) => r.total >= 200);
  if (step === 'select') return rows.map((r) => ({region: r.region, sum_amount: r.total}));
  if (step === 'order') return [...rows].sort((a, b) => b.sum_amount - a.sum_amount);
  return rows;
}

export default function SqlExecutionOrderPlay() {
  const [stepId, setStepId] = useState('order');

  const {rows, sql} = useMemo(() => {
    let r = BASE;
    const parts = [];
    STEPS.forEach((s) => {
      r = applyStep(s.id, r);
      if (STEPS.findIndex((x) => x.id === stepId) >= STEPS.findIndex((x) => x.id === s.id)) {
        parts.push(s.id);
      }
    });
    const idx = STEPS.findIndex((s) => s.id === stepId);
    let cur = BASE;
    for (let i = 0; i <= idx; i += 1) cur = applyStep(STEPS[i].id, cur);
    const sql = `SELECT region, SUM(amount) AS sum_amount
FROM sales
WHERE active
GROUP BY region
HAVING SUM(amount) >= 200
ORDER BY sum_amount DESC;`;
    return {rows: cur, sql};
  }, [stepId]);

  const cols = Object.keys(rows[0] ?? {empty: ''});

  return (
    <PlayRoot title="Порядок выполнения SQL" subtitle="Логический порядок этапов запроса">
      <StepPipeline steps={STEPS} activeId={stepId} onSelect={setStepId} />
      <pre className="it-demo__output" style={{fontSize: '0.78rem'}}>{sql}</pre>
      <DataTable columns={cols} rows={rows} highlight={() => true} />
    </PlayRoot>
  );
}
