import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/ExcelSimulator.module.css';

const COLS = ['A', 'B', 'C', 'D', 'E'];
const ROWS = 6;

const INITIAL = {
  A1: 'Продукт',
  B1: 'Кол-во',
  C1: 'Цена',
  A2: 'Лицензия',
  B2: '3',
  C2: '1200',
  A3: 'Поддержка',
  B3: '12',
  C3: '150',
  A4: 'Обучение',
  B4: '2',
  C4: '400',
};

function cellKey(col, row) {
  return `${col}${row}`;
}

function evalFormula(formula, cells) {
  const f = formula.trim().toUpperCase();
  const sumMatch = f.match(/^=SUM\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
  if (sumMatch) {
    const [, c1, r1, c2, r2] = sumMatch;
    let total = 0;
    for (let r = Number(r1); r <= Number(r2); r++) {
      for (let ci = COLS.indexOf(c1); ci <= COLS.indexOf(c2); ci++) {
        const v = parseFloat(cells[cellKey(COLS[ci], r)] || '');
        if (!Number.isNaN(v)) total += v;
      }
    }
    return String(total);
  }
  return '#ОШИБКА?';
}

export function ExcelSimulatorInner({compact}) {
  const [cells, setCells] = useState(INITIAL);
  const [selected, setSelected] = useState('B2');
  const [formula, setFormula] = useState('=SUM(B2:B4)');

  const displayValue = useMemo(() => {
    const raw = cells[selected] ?? '';
    if (raw.startsWith('=')) return evalFormula(raw, cells);
    return raw;
  }, [cells, selected]);

  const sumDemo = useMemo(() => evalFormula('=SUM(B2:B4)', cells), [cells]);

  const updateCell = (value) => {
    setCells((prev) => ({...prev, [selected]: value}));
  };

  const applyFormula = () => {
    if (formula.startsWith('=')) {
      setCells((prev) => ({...prev, [selected]: formula}));
    } else {
      updateCell(formula);
    }
  };

  const chrome = (
    <DesktopAppChrome
      title="Budget.xlsx — Microsoft Excel (симулятор)"
      accent="#217346"
      toolbar={
        <>
          <button type="button" onClick={() => setFormula('=SUM(B2:B4)')}>
            Σ SUM
          </button>
          <button type="button" onClick={() => setFormula('=SUM(C2:C4)')}>
            Σ по ценам
          </button>
          <span className={styles.formulaLabel}>fx</span>
          <input
            className={styles.formulaInput}
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFormula()}
          />
          <button type="button" className={styles.applyBtn} onClick={applyFormula}>
            Применить
          </button>
        </>
      }
      status={
        <>
          Ячейка {selected}: {displayValue || 'пусто'} · Демо SUM(B2:B4) = {sumDemo}
        </>
      }
    >
      <div className={styles.gridWrap}>
        <table className={styles.grid}>
          <thead>
            <tr>
              <th />
              {COLS.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length: ROWS}, (_, ri) => ri + 1).map((row) => (
              <tr key={row}>
                <th>{row}</th>
                {COLS.map((col) => {
                  const key = cellKey(col, row);
                  const raw = cells[key] ?? '';
                  const shown = raw.startsWith('=') ? evalFormula(raw, cells) : raw;
                  return (
                    <td key={key}>
                      <button
                        type="button"
                        className={clsx(styles.cell, selected === key && styles.cellSelected)}
                        onClick={() => {
                          setSelected(key);
                          setFormula(raw.startsWith('=') ? raw : raw);
                        }}
                      >
                        {shown}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор Microsoft Excel"
        subtitle="Ячейки, строка формул и функция SUM — мини-таблица для учебных расчётов"
      >
        {chrome}
        <p className={styles.hint}>
          В XLSX данные и формулы хранятся отдельно: ячейка может показывать результат, а в файле —
          выражение <code>=SUM(...)</code>.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ExcelSimulatorInner;
