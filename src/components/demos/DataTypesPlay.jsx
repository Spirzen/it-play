import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from './dataBasicsPlay.module.css';

const TYPES = [
  {
    id: 'bool',
    name: 'bool',
    size: '1 байт*',
    example: 'true',
    ops: 'and, or, not',
    valid: ['true', 'false'],
    invalid: '"yes", 1 + "a"',
    note: 'Основа условий и циклов; в C иногда 0/1, но семантика — логика.',
  },
  {
    id: 'int',
    name: 'int',
    size: '4–8 байт',
    example: '-128',
    ops: '+ − × ÷ %, побитовые',
    valid: ['42', '-5', '0'],
    invalid: '"42" + 1 без cast',
    note: 'Целые в дополнительном коде; переполнение — отдельная тема.',
  },
  {
    id: 'float',
    name: 'float / double',
    size: '4 / 8 байт',
    example: '3.14',
    ops: 'арифметика, sqrt, округление',
    valid: ['3.14', '1e-5'],
    invalid: '0.1 + 0.2 === 0.3 (часто false)',
    note: 'IEEE 754; для денег лучше decimal или копейки в int.',
  },
  {
    id: 'char',
    name: 'char',
    size: '1–4 байта',
    example: "'A'",
    ops: 'сравнение, код символа',
    valid: ["'Я'", "'\\n'"],
    invalid: 'обрезка UTF-8 посередине байта',
    note: 'Один кодовый символ Unicode; в Java char = UTF-16 unit.',
  },
  {
    id: 'string',
    name: 'string',
    size: 'переменная',
    example: '"Привет"',
    ops: 'concat, find, split, len',
    valid: ['"text"', '""'],
    invalid: 'число + строка в Python без str()',
    note: 'Последовательность символов; не путать с текстом в UI.',
  },
  {
    id: 'uuid',
    name: 'UUID / id',
    size: '16 байт',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    ops: 'сравнение, генерация',
    valid: ['GUID v4'],
    invalid: 'два одинаковых id в БД',
    note: 'Идентификатор объекта, не бизнес-поле.',
  },
];

function DataTypesPlayInner() {
  const [typeId, setTypeId] = useState('int');
  const [value, setValue] = useState('42');
  const t = TYPES.find((x) => x.id === typeId) ?? TYPES[1];

  const checkOk = () => {
    const v = value.trim();
    if (t.id === 'bool') return v === 'true' || v === 'false';
    if (t.id === 'int') return /^-?\d+$/.test(v);
    if (t.id === 'float') return /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v);
    if (t.id === 'char') return /^'.+'$/.test(v) || v.length === 1;
    if (t.id === 'string') return v.startsWith('"') && v.endsWith('"');
    if (t.id === 'uuid') return /^[0-9a-f-]{36}$/i.test(v);
    return false;
  };

  const ok = checkOk();

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Типы данных в программировании"
        subtitle="Тип задаёт размер, интерпретацию битов и допустимые операции."
      >
        <div className={styles.typeRow}>
          {TYPES.map((x) => (
            <button
              key={x.id}
              type="button"
              className={clsx(styles.typeChip, typeId === x.id && styles.typeChipActive)}
              onClick={() => {
                setTypeId(x.id);
                setValue(x.example);
              }}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div className={styles.statGrid}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{t.size}</span>
            <span className={styles.statLbl}>память</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal} style={{fontSize: '0.75rem'}}>
              {t.ops}
            </span>
            <span className={styles.statLbl}>операции</span>
          </div>
          <div className={styles.statBox}>
            <span className={clsx(styles.statVal, ok ? undefined : {color: '#c62828'})}>
              {ok ? '✓' : '✗'}
            </span>
            <span className={styles.statLbl}>проверка значения</span>
          </div>
        </div>

        <label className="it-demo__label" htmlFor="type-val">
          Значение для типа <code>{t.name}</code>
        </label>
        <input
          id="type-val"
          className="it-demo__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{width: '100%', marginBottom: '0.5rem', fontFamily: 'var(--ifm-font-family-monospace)'}}
        />

        <p className={styles.hint}>
          <strong>Пример:</strong> {t.example} · <strong>Нельзя:</strong> {t.invalid}
        </p>
        <p className={styles.hint}>{t.note}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default DataTypesPlayInner;
