import React, {useState} from 'react';
import {DataTable, MetricGrid, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const INITIAL = [
  {keys: '10, 20', type: 'leaf', pages: 1},
  {keys: '30, 40, 50', type: 'leaf', pages: 1},
];

export default function BTreePagePlay() {
  const [order, setOrder] = useState(3);
  const [insertKey, setInsertKey] = useState('');
  const [nodes, setNodes] = useState(INITIAL);
  const [splits, setSplits] = useState(0);

  const insert = () => {
    const k = Number(insertKey);
    if (!Number.isFinite(k)) return;
    const next = [...nodes];
    let target = next[next.length - 1];
    const keys = target.keys.split(',').map((x) => Number(x.trim())).filter(Boolean);
    keys.push(k);
    keys.sort((a, b) => a - b);
    if (keys.length > order) {
      const mid = Math.ceil(keys.length / 2);
      const left = keys.slice(0, mid).join(', ');
      const right = keys.slice(mid).join(', ');
      next[next.length - 1] = {keys: left, type: 'leaf', pages: 1};
      next.push({keys: right, type: 'leaf', pages: 1});
      setSplits((s) => s + 1);
    } else {
      target = {...target, keys: keys.join(', ')};
      next[next.length - 1] = target;
    }
    setNodes(next);
    setInsertKey('');
  };

  return (
    <PlayRoot
      title="B-дерево и страницы"
      subtitle="Упрощённый split листа при переполнении (order = max ключей)"
    >
      <label className="it-demo__label">Order (max ключей в узле): {order}</label>
      <input type="range" min={2} max={6} value={order} onChange={(e) => setOrder(Number(e.target.value))} />
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.75rem'}}>
        <input
          className="it-demo__input"
          placeholder="Ключ"
          value={insertKey}
          onChange={(e) => setInsertKey(e.target.value)}
        />
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={insert}>
          Вставить
        </button>
      </div>
      <DataTable columns={['keys', 'type', 'pages']} rows={nodes} />
      <Panel title="Идея">
        В СУБД один узел B-дерева ≈ одна страница на диске (~8 KB). Split уменьшает высоту дерева при росте данных.
      </Panel>
      <MetricGrid items={[{label: 'Splits', value: String(splits)}, {label: 'Nodes', value: String(nodes.length)}]} />
    </PlayRoot>
  );
}
