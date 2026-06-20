import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import {
  ChipRow,
  Hint,
  MetricGrid,
  PlayRoot,
  Section,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const FLAGS = ['READ', 'WRITE', 'EXEC', 'HIDDEN', 'SYSTEM', 'ARCHIVE', 'LOCKED', 'ENCRYPT'];

function applyOp(a, b, op) {
  if (op === 'AND') return a & b;
  if (op === 'OR') return a | b;
  return a ^ b;
}

export default function BitMaskPlay() {
  const [a, setA] = useState(0b10101010);
  const [b, setB] = useState(0b11001100);
  const [op, setOp] = useState('AND');
  const result = useMemo(() => applyOp(a, b, op), [a, b, op]);

  const toggleBit = (setter, value, bit) => setter(value ^ (1 << bit));

  const renderRow = (value, setter, label, readonly) => (
    <Section title={label}>
      <div className={styles.bitRow}>
        {FLAGS.map((name, bit) => (
          <div key={name}>
            <button
              type="button"
              title={name}
              disabled={readonly}
              className={clsx(styles.bit, (value >> bit) & 1 ? styles.bitOn : undefined)}
              onClick={() => !readonly && toggleBit(setter, value, bit)}
            >
              {(value >> bit) & 1}
            </button>
            <div className={styles.bitLabel}>{name.slice(0, 3)}</div>
          </div>
        ))}
      </div>
    </Section>
  );

  return (
    <PlayRoot title="Битовые маски" subtitle="Флаги как биты — AND / OR / XOR">
      <ChipRow
        value={op}
        onChange={setOp}
        options={[
          {id: 'AND', label: 'AND'},
          {id: 'OR', label: 'OR'},
          {id: 'XOR', label: 'XOR'},
        ]}
      />
      {renderRow(a, setA, 'Маска A', false)}
      {renderRow(b, setB, 'Маска B', false)}
      {renderRow(result, () => {}, 'Результат', true)}
      <MetricGrid
        items={[
          {label: 'A', value: toHexByte(a)},
          {label: 'B', value: toHexByte(b)},
          {label: 'Result', value: toHexByte(result), tone: 'success'},
        ]}
      />
      <Hint>Клик по биту переключает флаг. В коде те же операции: <code>flags &amp; MASK</code>.</Hint>
    </PlayRoot>
  );
}

function toHexByte(n) {
  return `0x${(n & 0xff).toString(16).toUpperCase().padStart(2, '0')}`;
}
