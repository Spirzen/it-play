import React, {useMemo, useState} from 'react';
import {
  ChipRow,
  Field,
  Hint,
  MemoryStrip,
  MetricGrid,
  PlayRoot,
  Section,
  intToBytes,
  styles,
  toHexByte,
} from '@/components/shared/dataMarkupPlayKit';

export default function EndiannessBytePlay() {
  const [value, setValue] = useState(300);
  const [littleEndian, setLittleEndian] = useState(true);

  const bytes = useMemo(() => intToBytes(value, littleEndian), [value, littleEndian]);
  const cells = bytes.map((b, i) => ({
    addr: `0x${(0x1000 + i).toString(16).toUpperCase()}`,
    hex: toHexByte(b),
    hint: littleEndian
      ? i === 0
        ? 'младший'
        : i === 3
          ? 'старший'
          : `byte ${i}`
      : i === 0
        ? 'старший'
        : i === 3
          ? 'младший'
          : `byte ${i}`,
  }));

  const decoded =
    littleEndian
      ? bytes[0] + bytes[1] * 256 + bytes[2] * 65536 + bytes[3] * 16777216
      : bytes[0] * 16777216 + bytes[1] * 65536 + bytes[2] * 256 + bytes[3];

  return (
    <PlayRoot
      title="Endianness — порядок байтов"
      subtitle="Число uint32 в памяти: little-endian (x86) vs big-endian (сеть)"
    >
      <ChipRow
        value={littleEndian ? 'le' : 'be'}
        onChange={(id) => setLittleEndian(id === 'le')}
        options={[
          {id: 'le', label: 'Little-endian'},
          {id: 'be', label: 'Big-endian'},
        ]}
      />
      <Field label="Значение (0 … 4 294 967 295)">
        <input
          className={styles.input}
          type="number"
          min={0}
          max={4294967295}
          value={value}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
        />
      </Field>
      <Section title="Память">
        <MemoryStrip cells={cells} />
      </Section>
      <MetricGrid
        items={[
          {label: 'Hex (32-bit)', value: `0x${(value >>> 0).toString(16).toUpperCase().padStart(8, '0')}`},
          {label: 'Сборка', value: String(decoded >>> 0)},
          {label: 'Порядок', value: littleEndian ? 'LE' : 'BE', tone: 'success'},
        ]}
      />
      <Hint>На x86 младший байт лежит по младшему адресу. В сетевых протоколах часто big-endian.</Hint>
    </PlayRoot>
  );
}
