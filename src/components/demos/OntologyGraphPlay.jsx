import React, {useMemo, useState} from 'react';
import {ChipRow, DataTable, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const TRIPLES = [
  {subject: 'Alice', predicate: 'type', object: 'Person'},
  {subject: 'Alice', predicate: 'worksAt', object: 'Acme'},
  {subject: 'Acme', predicate: 'type', object: 'Organization'},
  {subject: 'Bob', predicate: 'type', object: 'Person'},
  {subject: 'Bob', predicate: 'worksAt', object: 'Acme'},
];

const QUERIES = {
  people: (rows) => rows.filter((r) => r.predicate === 'type' && r.object === 'Person').map((r) => ({name: r.subject})),
  acme: (rows) =>
    rows
      .filter((r) => r.predicate === 'worksAt' && r.object === 'Acme')
      .map((r) => ({employee: r.subject, org: r.object})),
};

export default function OntologyGraphPlay() {
  const [query, setQuery] = useState('people');
  const result = useMemo(() => QUERIES[query](TRIPLES), [query]);

  return (
    <PlayRoot title="Онтология и граф знаний" subtitle="Triple store: subject — predicate → object">
      <ChipRow
        value={query}
        onChange={setQuery}
        options={[
          {id: 'people', label: '?person type Person'},
          {id: 'acme', label: '?x worksAt Acme'},
        ]}
      />
      <div className="it-demo__label">Triples</div>
      <DataTable columns={['subject', 'predicate', 'object']} rows={TRIPLES} />
      <div className="it-demo__label">Результат запроса</div>
      <DataTable columns={Object.keys(result[0] ?? {empty: ''})} rows={result} highlight={() => true} />
    </PlayRoot>
  );
}
