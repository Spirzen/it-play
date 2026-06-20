import React, {useMemo, useState} from 'react';
import {
  CheckField,
  Hint,
  MetricGrid,
  Panel,
  PlayRoot,
  SliderRow,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

function hashKey(key, buckets) {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % buckets;
}

const BAD_KEYS = ['aa', 'bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh'];
const GOOD_KEYS = ['user_1', 'order_42', 'sku_991', 'session_x'];

export default function HashCollisionPlay() {
  const [buckets, setBuckets] = useState(8);
  const [badHash, setBadHash] = useState(false);
  const keys = badHash ? BAD_KEYS : GOOD_KEYS;

  const table = useMemo(() => {
    const map = Array.from({length: buckets}, () => []);
    keys.forEach((k) => {
      const idx = badHash ? k.charCodeAt(0) % buckets : hashKey(k, buckets);
      map[idx].push(k);
    });
    return map;
  }, [buckets, badHash, keys]);

  const maxChain = Math.max(...table.map((b) => b.length), 0);

  return (
    <PlayRoot title="Коллизии хеш-таблицы" subtitle="Плохая hash vs равномерное распределение">
      <SliderRow label="Корзин" value={buckets} displayValue={String(buckets)} min={4} max={16} step={1} onChange={setBuckets} />
      <CheckField label="Плохая hash (первый символ)" checked={badHash} onChange={setBadHash} />
      <div className={styles.bucketGrid}>
        {table.map((chain, i) => (
          <Panel key={i} title={`#${i}`}>
            <span className={styles.monoText}>{chain.length ? chain.join(', ') : '—'}</span>
          </Panel>
        ))}
      </div>
      <MetricGrid
        items={[
          {label: 'Max chain', value: String(maxChain), tone: maxChain > 3 ? 'error' : 'success'},
          {label: 'Avg load', value: (keys.length / buckets).toFixed(2)},
          {label: 'Lookup', value: maxChain > 3 ? 'O(n) ⚠' : 'O(1) ✓', tone: maxChain > 3 ? 'error' : 'success'},
        ]}
      />
      <Hint>Hash-flooding — атака или плохая функция — превращает O(1) в O(n).</Hint>
    </PlayRoot>
  );
}
