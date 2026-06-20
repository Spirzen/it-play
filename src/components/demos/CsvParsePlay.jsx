import React, {useMemo, useState} from 'react';
import {
  ChipRow,
  DataTable,
  PlayRoot,
  Section,
  SplitView,
  StatusBanner,
  parseCsv,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const SAMPLE = `id,name,city
1,"Alice, Jr.",SPB
2,Bob,MSK
3,"Carol ""C""",KZN`;

export default function CsvParsePlay() {
  const [text, setText] = useState(SAMPLE);
  const [sep, setSep] = useState(',');

  const parsed = useMemo(() => parseCsv(text, sep), [text, sep]);

  return (
    <PlayRoot title="CSV — разбор" subtitle="RFC 4180: кавычки, экранирование, разделитель">
      <ChipRow
        value={sep}
        onChange={setSep}
        scrollable
        options={[
          {id: ',', label: 'Запятая'},
          {id: ';', label: 'Точка с запятой'},
          {id: '\t', label: 'Tab'},
        ]}
      />
      <SplitView
        left={
          <Section title="CSV">
            <textarea className={styles.textarea} rows={8} value={text} onChange={(e) => setText(e.target.value)} spellCheck={false} />
          </Section>
        }
        right={
          <Section title="Таблица">
            {parsed.errors.length > 0 && (
              <StatusBanner tone="error">{parsed.errors.join(' · ')}</StatusBanner>
            )}
            <DataTable columns={parsed.headers} rows={parsed.rows} caption="Parsed CSV" />
          </Section>
        }
      />
    </PlayRoot>
  );
}
