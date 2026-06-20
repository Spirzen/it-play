import React, {useMemo, useState} from 'react';
import {ChipRow, DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const SALES = [
  {region: 'West', rep: 'Ann', amount: 120},
  {region: 'West', rep: 'Ann', amount: 80},
  {region: 'West', rep: 'Bob', amount: 200},
  {region: 'East', rep: 'Ann', amount: 150},
  {region: 'East', rep: 'Bob', amount: 90},
];

export default function SqlWindowFunctionsPlay() {
  const [fn, setFn] = useState('sum');

  const rows = useMemo(() => {
    const sorted = [...SALES].sort((a, b) => a.region.localeCompare(b.region) || a.rep.localeCompare(b.rep));
    const run = {};
    return sorted.map((row, i) => {
      run[row.region] = (run[row.region] ?? 0) + row.amount;
      const part = sorted.filter((r) => r.region === row.region);
      const rank = part.sort((a, b) => b.amount - a.amount).findIndex((r) => r.rep === row.rep && r.amount === row.amount) + 1;
      const prev = i > 0 ? sorted[i - 1] : null;
      return {
        ...row,
        running_sum: run[row.region],
        row_num: rank,
        lag_amount: prev && prev.region === row.region ? prev.amount : null,
      };
    });
  }, []);

  const col = fn === 'sum' ? 'running_sum' : fn === 'rank' ? 'row_num' : 'lag_amount';

  return (
    <PlayRoot title="SQL — оконные функции" subtitle="OVER (PARTITION BY region) — строки не схлопываются">
      <ChipRow
        value={fn}
        onChange={setFn}
        options={[
          {id: 'sum', label: 'SUM() OVER'},
          {id: 'rank', label: 'ROW_NUMBER'},
          {id: 'lag', label: 'LAG(amount)'},
        ]}
      />
      <DataTable columns={['region', 'rep', 'amount', col]} rows={rows.map((r) => ({...r, [col]: r[col]}))} highlight={() => true} />
    </PlayRoot>
  );
}
