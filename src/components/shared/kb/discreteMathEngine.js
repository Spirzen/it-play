/** Множества и обход графа для демо дискретной математики */

export const SET_PRESETS = [
  {
    id: 'roles',
    label: 'Роли пользователей',
    a: 'admin, editor, viewer',
    b: 'editor, guest',
    note: 'Пересечение — роли, которые есть в обоих списках (editor).',
  },
  {
    id: 'ports',
    label: 'Открытые порты',
    a: '80, 443, 8080',
    b: '443, 3306, 5432',
    note: 'Объединение — все уникальные порты из двух сканов.',
  },
  {
    id: 'ids',
    label: 'ID заказов',
    a: '101, 102, 103',
    b: '103, 104',
    note: 'Разность A \\ B — заказы только в первом наборе.',
  },
];

export function parseSet(input) {
  const items = input
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return new Set(items);
}

export function setToDisplay(set) {
  return [...set].sort((a, b) => a.localeCompare(b, 'ru'));
}

export function union(a, b) {
  return new Set([...a, ...b]);
}

export function intersection(a, b) {
  return new Set([...a].filter((x) => b.has(x)));
}

export function difference(a, b) {
  return new Set([...a].filter((x) => !b.has(x)));
}

export function symmetricDiff(a, b) {
  return new Set([...difference(a, b), ...difference(b, a)]);
}

export const DEMO_GRAPH = {
  id: 'services',
  label: 'Зависимости микросервисов',
  nodes: [
    {id: 'api', label: 'API Gateway'},
    {id: 'auth', label: 'Auth'},
    {id: 'orders', label: 'Orders'},
    {id: 'pay', label: 'Payments'},
    {id: 'db', label: 'DB'},
  ],
  edges: [
    ['api', 'auth'],
    ['api', 'orders'],
    ['orders', 'pay'],
    ['orders', 'db'],
    ['pay', 'db'],
    ['auth', 'db'],
  ],
  start: 'api',
  goal: 'db',
};

/** BFS: шаги для визуализации */
export function bfsSteps(graph, startId, goalId) {
  const adj = new Map();
  graph.nodes.forEach((n) => adj.set(n.id, []));
  graph.edges.forEach(([from, to]) => {
    adj.get(from)?.push(to);
    adj.get(to)?.push(from);
  });

  const visited = new Set();
  const queue = [startId];
  const parent = new Map([[startId, null]]);
  const steps = [{type: 'init', queue: [...queue], visited: [], current: null, path: null}];

  while (queue.length) {
    const current = queue.shift();
    if (!visited.has(current)) {
      visited.add(current);
      steps.push({
        type: 'visit',
        current,
        queue: [...queue],
        visited: [...visited],
        path: buildPath(parent, current),
      });
      if (current === goalId) {
        steps.push({
          type: 'found',
          current,
          path: buildPath(parent, current),
          queue: [...queue],
          visited: [...visited],
        });
        break;
      }
      for (const next of adj.get(current) ?? []) {
        if (!visited.has(next) && !parent.has(next)) {
          parent.set(next, current);
          queue.push(next);
          steps.push({
            type: 'enqueue',
            current,
            next,
            queue: [...queue],
            visited: [...visited],
            path: buildPath(parent, current),
          });
        }
      }
    }
  }
  if (!visited.has(goalId)) {
    steps.push({type: 'notfound', visited: [...visited], queue: []});
  }
  return steps;
}

function buildPath(parent, node) {
  const path = [];
  let cur = node;
  while (cur != null) {
    path.unshift(cur);
    cur = parent.get(cur);
  }
  return path;
}

export const GRAPH_LAYOUT = {
  api: {x: 50, y: 50},
  auth: {x: 18, y: 78},
  orders: {x: 82, y: 78},
  pay: {x: 65, y: 95},
  db: {x: 50, y: 115},
};
