import React, {useMemo, useState} from 'react';
import {MetricGrid, PlayRoot, toolStyles} from '@/components/shared/dataMarkupPlayKit';

function encodeVarint(n) {
  const parts = [];
  let v = n >>> 0;
  do {
    let b = v & 0x7f;
    v >>>= 7;
    if (v) b |= 0x80;
    parts.push(b.toString(16).padStart(2, '0'));
  } while (v);
  return parts.join(' ');
}

export default function ProtobufWirePlay() {
  const [id, setId] = useState(42);
  const [name, setName] = useState('Alice');

  const wire = useMemo(() => {
    const field1 = `08 ${encodeVarint(id)}`;
    const nameBytes = [...name].map((c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    const field2 = `12 ${encodeVarint(name.length)} ${nameBytes}`;
    return `${field1}  ${field2}`;
  }, [id, name]);

  return (
    <PlayRoot title="Protobuf wire format" subtitle="Field tag + varint + length-delimited string">
      <label className="it-demo__label">id (field 1, varint)</label>
      <input className="it-demo__input" type="number" value={id} onChange={(e) => setId(Number(e.target.value))} />
      <label className="it-demo__label">name (field 2, string)</label>
      <input className="it-demo__input" value={name} onChange={(e) => setName(e.target.value)} />
      <label className="it-demo__label">Wire (hex)</label>
      <pre className={toolStyles.mono}>{wire}</pre>
      <MetricGrid items={[{label: 'Tag 1', value: '0x08 = field 1, wire 0'}, {label: 'Tag 2', value: '0x12 = field 2, wire 2'}]} />
    </PlayRoot>
  );
}
