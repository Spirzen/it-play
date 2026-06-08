export const CLUSTER_NODES = ['N1', 'N2', 'N3'];

export const EVENTS = [
  {user_id: 'u-101', event_time: '2026-05-20T10:00', event_type: 'login', payload: 'web'},
  {user_id: 'u-101', event_time: '2026-05-20T10:05', event_type: 'view', payload: 'catalog'},
  {user_id: 'u-101', event_time: '2026-05-20T10:12', event_type: 'cart', payload: 'add'},
  {user_id: 'u-202', event_time: '2026-05-19T09:00', event_type: 'login', payload: 'mobile'},
  {user_id: 'u-202', event_time: '2026-05-19T09:30', event_type: 'purchase', payload: 'ok'},
  {user_id: 'u-303', event_time: '2026-05-18T14:00', event_type: 'login', payload: 'api'},
];

export const QUERY_SCENARIOS = [
  {
    id: 'by_user',
    label: 'WHERE user_id = u-101',
    cql: 'SELECT * FROM user_events WHERE user_id = ?',
    partitionKey: 'u-101',
    efficient: true,
    detail: 'Одна партиция — данные лежат рядом на узле, без scatter-gather.',
  },
  {
    id: 'by_time',
    label: 'WHERE event_time > …',
    cql: 'SELECT * FROM user_events WHERE event_time > ? ALLOW FILTERING',
    partitionKey: null,
    efficient: false,
    detail: 'Фильтр не по partition key — полный обход всех партиций кластера.',
  },
];

function hashPartition(userId) {
  let h = 0;
  for (let i = 0; i < userId.length; i += 1) h = (h * 31 + userId.charCodeAt(i)) % CLUSTER_NODES.length;
  return CLUSTER_NODES[h];
}

export function partitionForUser(userId) {
  return hashPartition(userId);
}

export function simulateQuery(scenarioId) {
  const scenario = QUERY_SCENARIOS.find((s) => s.id === scenarioId) ?? QUERY_SCENARIOS[0];
  if (scenario.efficient) {
    const rows = EVENTS.filter((e) => e.user_id === scenario.partitionKey);
    const node = partitionForUser(scenario.partitionKey);
    return {
      scenario,
      rows,
      nodesHit: [node],
      partitionsScanned: 1,
      coordinatorMs: 2,
    };
  }
  return {
    scenario,
    rows: EVENTS.filter((e) => e.event_time >= '2026-05-19'),
    nodesHit: CLUSTER_NODES,
    partitionsScanned: 3,
    coordinatorMs: 48,
  };
}
