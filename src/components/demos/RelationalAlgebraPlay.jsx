import React, {useMemo, useState} from 'react';
import {ChipRow, DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const P = [
  {id: 1, name: 'Alice', city: 'SPB'},
  {id: 2, name: 'Bob', city: 'MSK'},
  {id: 3, name: 'Carol', city: 'SPB'},
];
const Q = [
  {id: 2, name: 'Bob', city: 'MSK'},
  {id: 4, name: 'Dan', city: 'KZN'},
];

function key(r) {
  return `${r.id}|${r.name}|${r.city}`;
}

function runOp(op, a, b) {
  const setA = new Map(a.map((r) => [key(r), r]));
  const setB = new Map(b.map((r) => [key(r), r]));
  if (op === 'union') {
    return [...new Map([...setA, ...setB]).values()];
  }
  if (op === 'intersect') {
    return a.filter((r) => setB.has(key(r)));
  }
  if (op === 'diff') {
    return a.filter((r) => !setB.has(key(r)));
  }
  const out = [];
  a.forEach((x) => b.forEach((y) => out.push({...x, ...y, id: `${x.id}-${y.id}`})));
  return out;
}

export default function RelationalAlgebraPlay() {
  const [op, setOp] = useState('union');
  const result = useMemo(() => runOp(op, P, Q), [op]);

  return (
    <PlayRoot title="Реляционная алгебра" subtitle="P и Q — отношения; операции ∪ ∩ \\ ×">
      <ChipRow
        value={op}
        onChange={setOp}
        options={[
          {id: 'union', label: 'P ∪ Q'},
          {id: 'intersect', label: 'P ∩ Q'},
          {id: 'diff', label: 'P \\ Q'},
          {id: 'product', label: 'P × Q'},
        ]}
      />
      <div className="it-demo__grid it-demo__grid--2">
        <div>
          <div className="it-demo__label">P</div>
          <DataTable columns={['id', 'name', 'city']} rows={P} />
        </div>
        <div>
          <div className="it-demo__label">Q</div>
          <DataTable columns={['id', 'name', 'city']} rows={Q} />
        </div>
      </div>
      <div className="it-demo__label">Результат ({result.length} строк)</div>
      <DataTable columns={Object.keys(result[0] ?? {id: ''})} rows={result} highlight={() => true} />
    </PlayRoot>
  );
}
