import React, {useMemo, useState} from 'react';
import {DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

function sqlTri(a, op, b) {
  const A = a === 'NULL' ? null : Number(a);
  const B = b === 'NULL' ? null : Number(b);
  if (op === 'IS NULL') return A === null ? 'TRUE' : 'FALSE';
  if (op === 'COALESCE') return String(A ?? B ?? 'NULL');
  if (op === '=') {
    if (A === null || B === null) return 'UNKNOWN';
    return A === B ? 'TRUE' : 'FALSE';
  }
  return 'UNKNOWN';
}

const OPS = ['=', 'IS NULL', 'COALESCE'];

export default function SqlNullLogicPlay() {
  const [a, setA] = useState('NULL');
  const [b, setB] = useState('5');
  const [op, setOp] = useState('=');

  const rows = useMemo(() => {
    const vals = ['NULL', '5', '0'];
    return OPS.flatMap((operation) =>
      vals.flatMap((va) =>
        vals.map((vb) => ({
          a: va,
          op: operation,
          b: vb,
          result: sqlTri(va, operation, vb),
        })),
      ),
    );
  }, []);

  const demo = sqlTri(a, op, b);

  return (
    <PlayRoot title="SQL и NULL" subtitle="Трёхзначная логика — NULL = NULL → UNKNOWN">
      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem'}}>
        <select className="it-demo__input" value={a} onChange={(e) => setA(e.target.value)}>
          {['NULL', '5', '0'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select className="it-demo__input" value={op} onChange={(e) => setOp(e.target.value)}>
          {OPS.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select className="it-demo__input" value={b} onChange={(e) => setB(e.target.value)}>
          {['NULL', '5', '0'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <strong>= {demo}</strong>
      </div>
      <DataTable columns={['a', 'op', 'b', 'result']} rows={rows.slice(0, 12)} />
    </PlayRoot>
  );
}
