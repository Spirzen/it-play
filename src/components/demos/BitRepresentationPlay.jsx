import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BIT_OPS,
  bits8,
  endianBytes32,
  float32Parts,
  formatBin8,
  formatHex8,
  signedFromTwos8,
  toU8,
} from '@/components/shared/kb/bitRepresentationEngine';
import styles from './executionPerfPlay.module.css';

const TABS = [
  {id: 'int', label: 'Целые'},
  {id: 'float', label: 'IEEE 754'},
  {id: 'endian', label: 'Эндианность'},
  {id: 'ops', label: 'Битовые операции'},
];

function BitStrip({bits, highlight}) {
  return (
    <div className={styles.bitRow}>
      {bits.map((b, i) => (
        <span
          key={i}
          className={clsx(styles.bit, b === 1 && styles.bitOn, highlight === i && styles.bitOn)}
        >
          {b}
        </span>
      ))}
    </div>
  );
}

function IntegerTab() {
  const [raw, setRaw] = useState(255);
  const u = toU8(raw);
  const signed = signedFromTwos8(u);

  return (
    <>
      <label className="it-demo__label" htmlFor="int-byte">
        Байт (0–255): {u}
      </label>
      <input
        id="int-byte"
        type="range"
        min={0}
        max={255}
        value={u}
        onChange={(e) => setRaw(Number(e.target.value))}
        className="it-demo__range"
        style={{width: '100%'}}
      />
      <BitStrip bits={bits8(u)} />
      <div className="it-demo__controls" style={{justifyContent: 'center', flexWrap: 'wrap'}}>
        <span>
          <strong>Без знака:</strong> {u}
        </span>
        <span>
          <strong>Знаковое (доп. код):</strong> {signed}
        </span>
        <span>
          <strong>Hex:</strong> {formatHex8(u)}
        </span>
      </div>
      <p className="it-demo__hint" style={{margin: 0}}>
        {formatBin8(u)} — один ноль в дополнительном коде; 0xFF = 255 без знака и −1 знаково.
      </p>
    </>
  );
}

function FloatTab() {
  const [value, setValue] = useState(0.1);
  const parts = useMemo(() => float32Parts(value), [value]);

  return (
    <>
      <label className="it-demo__label" htmlFor="float-val">
        Число (float32): {value}
      </label>
      <input
        id="float-val"
        type="range"
        min={-4}
        max={4}
        step={0.1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="it-demo__range"
        style={{width: '100%'}}
      />
      <div className="it-demo__controls" style={{justifyContent: 'center', gap: '1rem'}}>
        <span>
          <strong>Знак:</strong> {parts.sign ? '−' : '+'}
        </span>
        <span>
          <strong>Порядок:</strong> {parts.exp} (смещение 127)
        </span>
        <span>
          <strong>Мантисса:</strong> {parts.frac}
        </span>
      </div>
      <p className="it-demo__hint" style={{margin: 0}}>
        0.1 в двоичном виде — бесконечная дробь; в памяти хранится приближение → "0.1 + 0.2 ≠ 0.3".
      </p>
    </>
  );
}

function EndianTab() {
  const [endian, setEndian] = useState('le');
  const value = 0x12345678;
  const bytes = endianBytes32(value, endian);
  const labels = ['A', 'A+1', 'A+2', 'A+3'];

  return (
    <>
      <div className={styles.tabs}>
        <button
          type="button"
          className={clsx(styles.tab, endian === 'le' && styles.tabActive)}
          onClick={() => setEndian('le')}
        >
          Little-endian
        </button>
        <button
          type="button"
          className={clsx(styles.tab, endian === 'be' && styles.tabActive)}
          onClick={() => setEndian('be')}
        >
          Big-endian
        </button>
      </div>
      <p style={{textAlign: 'center', fontFamily: 'var(--ifm-font-family-monospace)'}}>
        0x12345678 в памяти
      </p>
      <div className={styles.addrRow}>
        {labels.map((addr, i) => (
          <div key={addr}>
            <div className="it-demo__label" style={{textAlign: 'center'}}>
              {addr}
            </div>
            <div className={styles.byteCell}>0x{bytes[i].toString(16).toUpperCase().padStart(2, '0')}</div>
          </div>
        ))}
      </div>
      <p className="it-demo__hint" style={{marginTop: '0.65rem', marginBottom: 0}}>
        x86 и ARM по умолчанию — little-endian; TCP/IP и многие форматы — big-endian (сетевой порядок).
      </p>
    </>
  );
}

function BitOpsTab() {
  const [a, setA] = useState(0b11001010);
  const [b, setB] = useState(0b10101100);
  const [opId, setOpId] = useState('and');
  const op = BIT_OPS.find((o) => o.id === opId) ?? BIT_OPS[0];
  const result = toU8(op.fn(a, b));

  return (
    <>
      <div className={styles.tabs}>
        {BIT_OPS.map((o) => (
          <button
            key={o.id}
            type="button"
            className={clsx(styles.tab, opId === o.id && styles.tabActive)}
            onClick={() => setOpId(o.id)}
          >
            {o.symbol}
          </button>
        ))}
      </div>
      <div className="it-demo__controls" style={{flexWrap: 'wrap'}}>
        <label className="it-demo__label">
          A
          <input
            type="number"
            min={0}
            max={255}
            className="it-demo__input"
            value={a}
            onChange={(e) => setA(toU8(Number(e.target.value)))}
          />
        </label>
        <label className="it-demo__label">
          B
          <input
            type="number"
            min={0}
            max={255}
            className="it-demo__input"
            value={b}
            onChange={(e) => setB(toU8(Number(e.target.value)))}
          />
        </label>
      </div>
      <BitStrip bits={bits8(a)} />
      <p style={{textAlign: 'center', margin: '0.25rem 0', fontWeight: 700}}>{op.symbol}</p>
      <BitStrip bits={bits8(b)} />
      <p style={{textAlign: 'center', margin: '0.25rem 0'}}>=</p>
      <BitStrip bits={bits8(result)} />
      <p className="it-demo__hint" style={{margin: 0, textAlign: 'center'}}>
        {formatBin8(a)} {op.symbol} {formatBin8(b)} = {formatBin8(result)} ({result})
      </p>
    </>
  );
}

function BitRepresentationPlayInner() {
  const [tab, setTab] = useState('int');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Биты, числа и порядок байтов"
        subtitle="Дополнительный код, float32 и побитовые операции"
      >
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, tab === t.id && styles.tabActive)}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'int' && <IntegerTab />}
        {tab === 'float' && <FloatTab />}
        {tab === 'endian' && <EndianTab />}
        {tab === 'ops' && <BitOpsTab />}
      </DemoCard>
    </DemoShell>
  );
}

export default BitRepresentationPlayInner;
