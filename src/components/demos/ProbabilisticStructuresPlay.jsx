import React, {useMemo, useState} from 'react';
import {MetricGrid, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

function bloomBits(items, size, hashes) {
  const bits = new Array(size).fill(0);
  items.forEach((item) => {
    for (let h = 0; h < hashes; h += 1) {
      let x = 0;
      for (let i = 0; i < item.length; i += 1) x = (x * 31 + item.charCodeAt(i) + h * 17) >>> 0;
      bits[x % size] = 1;
    }
  });
  return bits;
}

export default function ProbabilisticStructuresPlay() {
  const [size, setSize] = useState(32);
  const [k, setK] = useState(3);
  const [items, setItems] = useState(['user:1', 'user:7', 'user:9']);
  const [query, setQuery] = useState('user:42');

  const bits = useMemo(() => bloomBits(items, size, k), [items, size, k]);
  const mightContain = useMemo(() => {
    for (let h = 0; h < k; h += 1) {
      let x = 0;
      for (let i = 0; i < query.length; i += 1) x = (x * 31 + query.charCodeAt(i) + h * 17) >>> 0;
      if (!bits[x % size]) return false;
    }
    return true;
  }, [bits, k, query, size]);

  const fillRatio = (bits.filter(Boolean).length / size).toFixed(2);

  return (
    <PlayRoot title="Bloom filter" subtitle="Компактное «возможно есть» без хранения всех ключей">
      <label className="it-demo__label">m (бит): {size}</label>
      <input type="range" min={16} max={64} value={size} onChange={(e) => setSize(Number(e.target.value))} />
      <label className="it-demo__label">k (хеш-функций): {k}</label>
      <input type="range" min={1} max={5} value={k} onChange={(e) => setK(Number(e.target.value))} />
      <Panel title="Битовый массив">
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 2, fontFamily: 'monospace', fontSize: '0.75rem'}}>
          {bits.map((b, i) => (
            <span key={i} style={{width: 14, textAlign: 'center', color: b ? 'var(--ifm-color-primary)' : '#999'}}>
              {b}
            </span>
          ))}
        </div>
      </Panel>
      <label className="it-demo__label">Запрос</label>
      <input className="it-demo__input" value={query} onChange={(e) => setQuery(e.target.value)} />
      <MetricGrid
        items={[
          {label: 'Элементов', value: String(items.length)},
          {label: 'Fill ratio', value: fillRatio},
          {label: 'contains?', value: mightContain ? 'MAYBE (true/fp)' : 'NO'},
        ]}
      />
      <p className="it-demo__hint">Ложных «да» не бывает для вставленных ключей; «нет» — всегда точный.</p>
    </PlayRoot>
  );
}
