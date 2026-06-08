const KEYSPACE = {
  user_events: [
    {user_id: 'u-1', event_time: '2026-05-20T10:00', event_type: 'login'},
    {user_id: 'u-1', event_time: '2026-05-20T10:05', event_type: 'view'},
  ],
};

function hasPartitionKeyInSelect(q) {
  return /user_id\s*=\s*'[^']+'/i.test(q);
}

export function executeCql(line) {
  const q = line.trim().replace(/\s+/g, ' ');
  if (!q) return {lines: []};

  if (/^SELECT/i.test(q)) {
    if (!hasPartitionKeyInSelect(q) && !/ALLOW\s+FILTERING/i.test(q)) {
      return {
        lines: [
          {
            type: 'error',
            text: 'InvalidRequest: Cannot execute this query as it might involve data filtering and sorting. Укажите partition key: WHERE user_id = \'u-1\'',
          },
        ],
      };
    }
    const userMatch = q.match(/user_id\s*=\s*'([^']+)'/i);
    const rows = userMatch
      ? KEYSPACE.user_events.filter((r) => r.user_id === userMatch[1])
      : KEYSPACE.user_events;
    if (!rows.length) return {lines: [{type: 'muted', text: '(0 rows)'}]};
    const text = rows
      .map((r) => `${r.user_id} | ${r.event_time} | ${r.event_type}`)
      .join('\n');
    return {lines: [{type: 'output', text}]};
  }

  if (/^INSERT/i.test(q)) {
    const m = q.match(/VALUES\s*\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'/i);
    if (m) {
      KEYSPACE.user_events.push({
        user_id: m[1],
        event_time: m[2],
        event_type: m[3],
      });
      return {lines: [{type: 'success', text: 'Inserted 1 row'}]};
    }
  }

  if (/^DESCRIBE TABLE/i.test(q)) {
    return {
      lines: [
        {
          type: 'output',
          text: 'user_events (user_id uuid, event_time timestamp, event_type text, PRIMARY KEY (user_id, event_time))',
        },
      ],
    };
  }

  if (/^help/i.test(q)) {
    return {
      lines: [
        {
          type: 'output',
          text: "SELECT * FROM user_events WHERE user_id = 'u-1';\nINSERT INTO user_events (...) VALUES ('u-2', '…', 'login');\nDESCRIBE TABLE user_events;",
        },
      ],
    };
  }

  return {lines: [{type: 'error', text: 'Синтаксис не распознан. Введите help'}]};
}

export function getCqlWelcome() {
  return [
    {type: 'banner', text: 'cqlsh · Apache Cassandra'},
    {type: 'muted', text: 'Connected to cluster0 · keyspace demo'},
  ];
}
