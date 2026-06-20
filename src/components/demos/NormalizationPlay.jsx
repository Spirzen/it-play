import React, {useMemo, useState} from 'react';
import {ChipRow, DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const DENORM = [
  {order_id: 1, customer: 'Alice', product: 'Book', price: 10},
  {order_id: 1, customer: 'Alice', product: 'Pen', price: 2},
  {order_id: 2, customer: 'Bob', product: 'Book', price: 10},
];

export default function NormalizationPlay() {
  const [nf, setNf] = useState('0');

  const tables = useMemo(() => {
    if (nf === '0') return [{name: 'orders_denorm', rows: DENORM}];
    if (nf === '1') {
      return [
        {
          name: 'customers',
          rows: [
            {customer_id: 1, name: 'Alice'},
            {customer_id: 2, name: 'Bob'},
          ],
        },
        {
          name: 'order_lines',
          rows: [
            {order_id: 1, customer_id: 1, product: 'Book', price: 10},
            {order_id: 1, customer_id: 1, product: 'Pen', price: 2},
            {order_id: 2, customer_id: 2, product: 'Book', price: 10},
          ],
        },
      ];
    }
    return [
      {name: 'customers', rows: [{customer_id: 1, name: 'Alice'}, {customer_id: 2, name: 'Bob'}]},
      {name: 'products', rows: [{product_id: 1, name: 'Book', price: 10}, {product_id: 2, name: 'Pen', price: 2}]},
      {
        name: 'order_lines',
        rows: [
          {order_id: 1, customer_id: 1, product_id: 1},
          {order_id: 1, customer_id: 1, product_id: 2},
          {order_id: 2, customer_id: 2, product_id: 1},
        ],
      },
    ];
  }, [nf]);

  return (
    <PlayRoot title="Нормализация БД" subtitle="Денormalized → 1NF/2NF → 3NF (упрощённо)">
      <ChipRow
        value={nf}
        onChange={setNf}
        options={[
          {id: '0', label: 'Денormalized'},
          {id: '1', label: '1NF / 2NF'},
          {id: '2', label: '3NF'},
        ]}
      />
      {tables.map((t) => (
        <div key={t.name} style={{marginBottom: '1rem'}}>
          <div className="it-demo__label">{t.name}</div>
          <DataTable columns={Object.keys(t.rows[0] ?? {})} rows={t.rows} />
        </div>
      ))}
      <p className="it-demo__hint">Каждый шаг убирает дублирование и зависимости не от ключа.</p>
    </PlayRoot>
  );
}
