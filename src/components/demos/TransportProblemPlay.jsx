import React, {useMemo, useState} from 'react';
import {ChipRow, DataTable, MetricGrid, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const SUPPLY = [100, 150];
const DEMAND = [80, 120, 50];
const COST = [
  [2, 3, 4],
  [5, 1, 6],
];

function northWest(s, d, cost) {
  const alloc = cost.map((row) => row.map(() => 0));
  let i = 0;
  let j = 0;
  const ss = [...s];
  const dd = [...d];
  while (i < ss.length && j < dd.length) {
    const q = Math.min(ss[i], dd[j]);
    alloc[i][j] = q;
    ss[i] -= q;
    dd[j] -= q;
    if (ss[i] === 0) i += 1;
    if (dd[j] === 0) j += 1;
  }
  return alloc;
}

export default function TransportProblemPlay() {
  const [method, setMethod] = useState('nw');
  const alloc = useMemo(() => northWest(SUPPLY, DEMAND, COST), []);
  const totalCost = alloc.reduce((s, row, i) => s + row.reduce((t, v, j) => t + v * COST[i][j], 0), 0);

  const rows = [];
  for (let i = 0; i < SUPPLY.length; i += 1) {
    for (let j = 0; j < DEMAND.length; j += 1) {
      if (alloc[i][j] > 0) rows.push({from: `S${i + 1}`, to: `D${j + 1}`, units: alloc[i][j], cost: COST[i][j]});
    }
  }

  return (
    <PlayRoot title="Транспортная задача" subtitle="North-West corner — начальный допустимый план">
      <ChipRow value={method} onChange={setMethod} options={[{id: 'nw', label: 'North-West'}]} />
      <DataTable columns={['from', 'to', 'units', 'cost']} rows={rows} />
      <MetricGrid items={[{label: 'Total cost', value: String(totalCost)}, {label: 'Supply', value: SUPPLY.join('+')}, {label: 'Demand', value: DEMAND.join('+')}]} />
    </PlayRoot>
  );
}
