import React, {useMemo, useState} from 'react';
import {ChipRow, MetricGrid, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const ROWS = 10000;
const COLS = ['id', 'name', 'city', 'amount'];

export default function ParquetColumnPlay() {
  const [mode, setMode] = useState('row');
  const [readCol, setReadCol] = useState('amount');

  const stats = useMemo(() => {
    const rowBytes = ROWS * COLS.length * 8;
    const colBytes = ROWS * 8;
    const readRow = rowBytes;
    const readColOnly = colBytes;
    const readColRow = mode === 'row' ? readRow : readColOnly;
    return {
      storage: mode === 'row' ? rowBytes : colBytes * COLS.length,
      read: readColRow,
      ratio: ((1 - readColRow / readRow) * 100).toFixed(0),
    };
  }, [mode, readCol]);

  return (
    <PlayRoot title="Parquet — колоночное хранение" subtitle="Чтение одной колонки vs всей строки">
      <ChipRow
        value={mode}
        onChange={setMode}
        options={[
          {id: 'row', label: 'Row store'},
          {id: 'column', label: 'Column store'},
        ]}
      />
      <ChipRow
        value={readCol}
        onChange={setReadCol}
        options={COLS.map((c) => ({id: c, label: `SELECT ${c}`}))}
      />
      <Panel title="Аналогия">
        {mode === 'row'
          ? 'Запрос одного поля читает все колонки каждой строки.'
          : 'Columnar: читается только выбранный столбец — predicate pushdown экономит I/O.'}
      </Panel>
      <MetricGrid
        items={[
          {label: 'Строк', value: String(ROWS)},
          {label: 'Bytes read (оценка)', value: String(stats.read)},
          {label: 'Экономия vs row', value: mode === 'column' ? `${stats.ratio}%` : '0%'},
        ]}
      />
    </PlayRoot>
  );
}
