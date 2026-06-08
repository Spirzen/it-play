/** Учебный граф задач проекта (зависимости). */
export const TASK_NODES = [
  {id: 'a', label: 'ТЗ', x: 70, y: 120},
  {id: 'b', label: 'API', x: 200, y: 60},
  {id: 'c', label: 'UI', x: 200, y: 180},
  {id: 'd', label: 'Тесты', x: 340, y: 120},
];

export const TASK_EDGES = [
  {from: 'a', to: 'b'},
  {from: 'a', to: 'c'},
  {from: 'b', to: 'd'},
  {from: 'c', to: 'd'},
];

export function adjacencyList() {
  const adj = Object.fromEntries(TASK_NODES.map((n) => [n.id, []]));
  for (const e of TASK_EDGES) {
    adj[e.from].push(e.to);
  }
  return adj;
}

export function adjacencyMatrix() {
  const ids = TASK_NODES.map((n) => n.id);
  const idx = Object.fromEntries(ids.map((id, i) => [id, i]));
  const n = ids.length;
  const m = Array.from({length: n}, () => Array(n).fill(0));
  for (const e of TASK_EDGES) {
    m[idx[e.from]][idx[e.to]] = 1;
  }
  return {ids, matrix: m};
}

export function bfsSteps(start = 'a') {
  const adj = adjacencyList();
  const visited = [];
  const order = [];
  const queue = [start];
  const seen = new Set();

  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    order.push(id);
    visited.push(id);
    for (const next of adj[id] ?? []) {
      if (!seen.has(next)) queue.push(next);
    }
  }
  return {order, visited};
}
