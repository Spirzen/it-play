import React, {useMemo, useState} from 'react';
import {ChipRow, Panel, PlayRoot} from '@/components/shared/dataMarkupPlayKit';

const QUESTIONS = [
  {id: 'graph', label: 'Граф связей / рекомендации', pick: 'Neo4j / graph DB'},
  {id: 'cache', label: 'Кэш сессий / TTL', pick: 'Redis'},
  {id: 'docs', label: 'Гибкая JSON-схема', pick: 'MongoDB'},
  {id: 'analytics', label: 'Wide-column / write-heavy', pick: 'Cassandra'},
  {id: 'sql', label: 'ACID + JOIN + отчёты', pick: 'PostgreSQL'},
];

export default function NosqlChooserPlay() {
  const [need, setNeed] = useState('graph');
  const answer = useMemo(() => QUESTIONS.find((q) => q.id === need)?.pick ?? 'PostgreSQL', [need]);

  return (
    <PlayRoot title="Выбор NoSQL" subtitle="Wizard: workload → тип хранилища">
      <ChipRow value={need} onChange={setNeed} options={QUESTIONS.map((q) => ({id: q.id, label: q.label}))} />
      <Panel title="Рекомендация">{answer}</Panel>
      <p className="it-demo__hint">Polyglot persistence: часто SQL + Redis + search engine в одном продукте.</p>
    </PlayRoot>
  );
}
