import React, {useState} from 'react';
import {ChipRow, DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

export default function ConsistencyModelPlay() {
  const [model, setModel] = useState('strong');
  const [step, setStep] = useState(0);

  const timeline = {
    strong: [
      {t: 'W', node: 'Leader', val: 'v=2'},
      {t: 'W', node: 'Replica', val: 'v=2'},
      {t: 'R', node: 'Client', val: 'reads v=2'},
    ],
    eventual: [
      {t: 'W', node: 'Leader', val: 'v=2'},
      {t: 'R', node: 'Replica A', val: 'reads v=1 (stale)'},
      {t: 'sync', node: 'Replica A', val: 'v=2'},
      {t: 'R', node: 'Replica A', val: 'reads v=2'},
    ],
  }[model];

  const rows = timeline.slice(0, step + 1);

  return (
    <PlayRoot title="Модели согласованности" subtitle="Strong vs eventual — timeline read/write">
      <ChipRow
        value={model}
        onChange={(m) => {
          setModel(m);
          setStep(0);
        }}
        options={[
          {id: 'strong', label: 'Strong'},
          {id: 'eventual', label: 'Eventual'},
        ]}
      />
      <DataTable columns={['t', 'node', 'val']} rows={rows} highlight={() => true} />
      <button type="button" className="it-demo__btn it-demo__btn--primary" disabled={step >= timeline.length - 1} onClick={() => setStep((s) => s + 1)}>
        Следующий шаг
      </button>
    </PlayRoot>
  );
}
