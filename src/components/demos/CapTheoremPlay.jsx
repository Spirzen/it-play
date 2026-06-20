import React, {useState} from 'react';
import {ChipRow, MetricGrid, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

export default function CapTheoremPlay() {
  const [partition, setPartition] = useState(false);
  const [choice, setChoice] = useState('CP');

  const result = partition
    ? choice === 'CP'
      ? 'Availability жертвуется — часть узлов недоступна, но Consistency сохранена'
      : choice === 'AP'
        ? 'Consistency ослаблена — eventual consistency, но система отвечает'
        : 'CA только без partition — не распределённая модель'
    : 'Без partition можно иметь C + A одновременно';

  return (
    <PlayRoot title="CAP-теорема" subtitle="Partition → выбор между C и A">
      <label className="it-demo__label">
        <input type="checkbox" checked={partition} onChange={(e) => setPartition(e.target.checked)} /> Network partition
      </label>
      <ChipRow
        value={choice}
        onChange={setChoice}
        options={[
          {id: 'CP', label: 'CP'},
          {id: 'AP', label: 'AP'},
          {id: 'CA', label: 'CA'},
        ]}
      />
      <Panel title="Итог">{result}</Panel>
      <MetricGrid items={[{label: 'Consistency', value: choice.includes('C') ? '✓' : '−'}, {label: 'Availability', value: choice.includes('A') ? '✓' : '−'}]} />
    </PlayRoot>
  );
}
