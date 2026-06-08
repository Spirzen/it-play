import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from './dataBasicsPlay.module.css';

const CSV_LINES = [
  '2025-01-01, -5',
  '2025-01-02, 0',
  '2025-01-03, 3',
];

const CONTEXTS = [
  {
    id: 'temp',
    label: 'Температура',
    info: 'Три дня зимы: −5 °C, 0 °C и +3 °C — осмысленный ряд измерений.',
    detail: 'Контекст: метеостанция, столбец "°C" в CSV.',
  },
  {
    id: 'battery',
    label: 'Заряд батареи',
    info: 'Уровень заряда устройства: пустой, средний, почти полный.',
    detail: 'Контекст: IoT-датчик, те же числа — другой смысл.',
  },
  {
    id: 'noise',
    label: 'Случайные числа',
    info: 'Просто три целых значения без привязки к физической величине.',
    detail: 'Без контекста данные остаются "мёртвыми" байтами.',
  },
];

const UNITS = [
  {name: 'Бит', example: '0 или 1'},
  {name: 'Байт', example: '8 бит'},
  {name: 'КБ', example: '1024 байта'},
  {name: 'МБ', example: '1024 КБ'},
  {name: 'ГБ', example: '1024 МБ'},
];

function valueInUnit(bits, unitIdx) {
  if (unitIdx === 0) return bits;
  const bytes = bits / 8;
  if (unitIdx === 1) return bytes;
  return bytes / 1024 ** (unitIdx - 1);
}

function textToUtf8Hex(text) {
  const bytes = [...new TextEncoder().encode(text)];
  return bytes.map((b) => b.toString(16).toUpperCase().padStart(2, '0'));
}

function DataInformationPlayInner() {
  const [contextId, setContextId] = useState('temp');
  const [unitIdx, setUnitIdx] = useState(1);
  const [bits, setBits] = useState(8);

  const csvText = CSV_LINES.join('\n');
  const hexBytes = useMemo(() => textToUtf8Hex(csvText), [csvText]);
  const context = CONTEXTS.find((c) => c.id === contextId) ?? CONTEXTS[0];
  const unit = UNITS[unitIdx];
  const inUnit = valueInUnit(bits, unitIdx);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Данные и информация"
        subtitle="Одни и те же байты — разный смысл в зависимости от контекста. Ниже — реальные байты текста CSV."
      >
        <div className={styles.split}>
          <div className={styles.dataCol}>
            <span className={styles.labelData}>Данные (байты)</span>
            <pre className={styles.mono}>{csvText}</pre>
            <div className={styles.byteTape}>
              {hexBytes.slice(0, 24).map((h, i) => (
                <span key={i} className={styles.byteCell}>
                  {h}
                </span>
              ))}
              {hexBytes.length > 24 && <span className={styles.byteCell}>…</span>}
            </div>
            <p className={styles.hint}>{hexBytes.length} байт в UTF-8 — без контекста это просто числа.</p>
          </div>
          <div className={styles.infoCol}>
            <span className={styles.labelInfo}>Информация (смысл)</span>
            <div className={styles.tabs}>
              {CONTEXTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={clsx(styles.tab, contextId === c.id && styles.tabActive)}
                  onClick={() => setContextId(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <p className={styles.mono} style={{margin: '0.35rem 0'}}>
              {context.info}
            </p>
            <p className={styles.hint}>{context.detail}</p>
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Размер данных" subtitle="Двоичные кратные степени 1024 (как в статье про файлы и ОЗУ).">
        <div className={styles.tabs}>
          {UNITS.map((u, i) => (
            <button
              key={u.name}
              type="button"
              className={clsx(styles.tab, unitIdx === i && styles.tabActive)}
              onClick={() => setUnitIdx(i)}
            >
              {u.name}
            </button>
          ))}
        </div>
        <label className="it-demo__label" htmlFor="bits-range">
          Сколько бит? {bits}
        </label>
        <input
          id="bits-range"
          type="range"
          min={1}
          max={64}
          value={bits}
          onChange={(e) => setBits(Number(e.target.value))}
          className="it-demo__range"
          style={{width: '100%', marginBottom: '0.5rem'}}
        />
        <div className={styles.statGrid}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{bits}</span>
            <span className={styles.statLbl}>бит</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>{(bits / 8).toFixed(bits % 8 === 0 ? 0 : 2)}</span>
            <span className={styles.statLbl}>байт</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>
              {inUnit >= 100 ? Math.round(inUnit) : inUnit.toFixed(inUnit < 1 ? 3 : 1)}
            </span>
            <span className={styles.statLbl}>{unit.name}</span>
          </div>
        </div>
        <p className={styles.hint}>
          {unit.example}. Маркетинговый 1 ТБ на диске = 10¹² байт; в Windows ≈ 931 ГиБ — из-за двоичной vs десятичной
          системы.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default DataInformationPlayInner;
