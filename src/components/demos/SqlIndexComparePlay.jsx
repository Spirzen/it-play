import React, {useMemo, useState} from 'react';
import {
  CheckField,
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
  SliderRow,
} from '@/components/shared/dataMarkupPlayKit';

const ROWS = 100000;

export default function SqlIndexComparePlay() {
  const [indexed, setIndexed] = useState(false);
  const [selectivity, setSelectivity] = useState(0.01);

  const stats = useMemo(() => {
    const matching = Math.floor(ROWS * selectivity);
    const seqPages = Math.ceil(ROWS / 100);
    const indexPages = indexed ? Math.ceil(Math.log2(ROWS)) + Math.ceil(matching / 100) : seqPages;
    return {
      plan: indexed ? 'Index Scan' : 'Seq Scan',
      pages: indexed ? indexPages : seqPages,
      rows: matching,
    };
  }, [indexed, selectivity]);

  return (
    <PlayRoot title="Seq Scan vs Index Scan" subtitle="Селективность условия и наличие индекса">
      <CheckField label="B-tree index on id" checked={indexed} onChange={setIndexed} />
      <SliderRow
        label="Selectivity"
        value={selectivity}
        displayValue={`${(selectivity * 100).toFixed(1)}%`}
        min={0.001}
        max={0.5}
        step={0.001}
        onChange={setSelectivity}
      />
      <Panel title="EXPLAIN (оценка)">
        {stats.plan} → rows={stats.rows}, pages≈{stats.pages}
      </Panel>
      <MetricGrid items={[{label: 'Plan', value: stats.plan}, {label: 'Pages read', value: String(stats.pages), tone: indexed ? 'success' : undefined}]} />
      <Hint>При низкой селективности Seq Scan может быть дешевле Index Scan — смотрите реальный EXPLAIN.</Hint>
    </PlayRoot>
  );
}
