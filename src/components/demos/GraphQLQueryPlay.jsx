import React, {useMemo, useState} from 'react';
import {PlayRoot, toolStyles} from '@/components/shared/dataMarkupPlayKit';

const DATA = {
  users: [
    {id: 1, name: 'Alice', posts: [{title: 'Hello'}]},
    {id: 2, name: 'Bob', posts: []},
  ],
};

function runQuery(query, data) {
  const m = query.match(/\{\s*users\s*\{\s*(\w+)/);
  if (!m) return {error: 'Поддерживается: { users { field } }'};
  const field = m[1];
  return {data: {users: data.users.map((u) => ({[field]: u[field]}))}};
}

export default function GraphQLQueryPlay() {
  const [query, setQuery] = useState('{ users { name } }');
  const result = useMemo(() => runQuery(query, DATA), [query]);

  return (
    <PlayRoot title="GraphQL — запрос" subtitle="Клиент выбирает поля — сервер возвращает только их">
      <textarea className={toolStyles.textareaMono} rows={4} value={query} onChange={(e) => setQuery(e.target.value)} spellCheck={false} />
      <label className="it-demo__label">Response</label>
      <pre className="it-demo__output">{JSON.stringify(result.error ? result : result.data, null, 2)}</pre>
    </PlayRoot>
  );
}
