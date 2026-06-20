/** Weighted graph presets for Dijkstra / PageRank / Euler demos */

export const DIJKSTRA_GRAPH = {
  nodes: [
    {id: 'A', label: 'A', x: 80, y: 120},
    {id: 'B', label: 'B', x: 220, y: 60},
    {id: 'C', label: 'C', x: 80, y: 200},
    {id: 'D', label: 'D', x: 220, y: 180},
    {id: 'E', label: 'E', x: 360, y: 120},
  ],
  edges: [
    {from: 'A', to: 'B', w: 4},
    {from: 'A', to: 'C', w: 5},
    {from: 'B', to: 'D', w: 2},
    {from: 'C', to: 'D', w: 1},
    {from: 'B', to: 'E', w: 3},
    {from: 'D', to: 'E', w: 2},
  ],
};

export const PAGERANK_GRAPH = {
  nodes: [
    {id: 'A', label: 'A', x: 100, y: 80},
    {id: 'B', label: 'B', x: 280, y: 80},
    {id: 'C', label: 'C', x: 190, y: 180},
    {id: 'D', label: 'D', x: 100, y: 200},
    {id: 'E', label: 'E', x: 280, y: 200},
  ],
  edges: [
    {from: 'A', to: 'B'},
    {from: 'A', to: 'C'},
    {from: 'B', to: 'C'},
    {from: 'C', to: 'A'},
    {from: 'C', to: 'D'},
    {from: 'D', to: 'E'},
    {from: 'E', to: 'C'},
  ],
};

/** Königsberg bridges — multiedges as separate ids */
export const EULER_GRAPH = {
  nodes: [
    {id: 'N', label: 'Север', x: 190, y: 40},
    {id: 'I', label: 'Остров', x: 190, y: 130},
    {id: 'S', label: 'Юг', x: 190, y: 220},
    {id: 'E', label: 'Восток', x: 320, y: 130},
  ],
  edges: [
    {id: 'b1', from: 'N', to: 'I', label: '1'},
    {id: 'b2', from: 'N', to: 'I', label: '2'},
    {id: 'b3', from: 'N', to: 'E', label: '3'},
    {id: 'b4', from: 'I', to: 'S', label: '4'},
    {id: 'b5', from: 'I', to: 'S', label: '5'},
    {id: 'b6', from: 'I', to: 'E', label: '6'},
    {id: 'b7', from: 'S', to: 'E', label: '7'},
  ],
};

function buildAdj(graph) {
  const adj = {};
  for (const n of graph.nodes) adj[n.id] = [];
  for (const e of graph.edges) {
    const w = e.w ?? 1;
    adj[e.from].push({to: e.to, w, id: e.id ?? `${e.from}-${e.to}`});
    if (!e.directed) adj[e.to]?.push({to: e.from, w, id: e.id ?? `${e.to}-${e.from}`});
  }
  return adj;
}

export function dijkstraSteps(graph, startId) {
  const adj = buildAdj(graph);
  const dist = {};
  const prev = {};
  const visited = new Set();
  for (const n of graph.nodes) {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  }
  dist[startId] = 0;
  const steps = [{type: 'init', dist: {...dist}, current: null, visited: new Set()}];

  while (visited.size < graph.nodes.length) {
    let u = null;
    let best = Infinity;
    for (const n of graph.nodes) {
      if (!visited.has(n.id) && dist[n.id] < best) {
        best = dist[n.id];
        u = n.id;
      }
    }
    if (u == null || best === Infinity) break;
    visited.add(u);
    steps.push({type: 'pick', current: u, dist: {...dist}, visited: new Set(visited)});

    for (const {to, w} of adj[u] ?? []) {
      if (visited.has(to)) continue;
      const alt = dist[u] + w;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
        steps.push({
          type: 'relax',
          current: u,
          edge: {from: u, to, w},
          dist: {...dist},
          visited: new Set(visited),
        });
      }
    }
  }
  return {dist, prev, steps};
}

export function pageRankIterations(graph, beta = 0.85, iterations = 20) {
  const n = graph.nodes.length;
  const out = {};
  for (const node of graph.nodes) out[node.id] = [];
  for (const e of graph.edges) out[e.from].push(e.to);

  let rank = {};
  for (const node of graph.nodes) rank[node.id] = 1 / n;

  const history = [{iter: 0, rank: {...rank}}];
  for (let k = 1; k <= iterations; k += 1) {
    const next = {};
    for (const node of graph.nodes) next[node.id] = (1 - beta) / n;
    for (const e of graph.edges) {
      const src = e.from;
      const outs = out[src].length || n;
      const share = rank[src] / outs;
      if (out[src].length === 0) {
        for (const node of graph.nodes) next[node.id] += (beta * share) / n;
      } else {
        next[e.to] += beta * share;
      }
    }
    rank = next;
    history.push({iter: k, rank: {...rank}});
  }
  return history;
}

export function eulerVerdict(graph, traversedEdgeIds) {
  const degree = {};
  for (const n of graph.nodes) degree[n.id] = 0;
  for (const e of graph.edges) {
    degree[e.from] += 1;
    degree[e.to] += 1;
  }
  const odd = Object.values(degree).filter((d) => d % 2 !== 0).length;
  const allUsed = traversedEdgeIds.length === graph.edges.length;
  const hasEulerTrail = odd === 0 || odd === 2;
  return {degree, oddCount: odd, hasEulerTrail, allUsed, canComplete: hasEulerTrail && allUsed};
}

export function edgePath(fromId, toId, nodes) {
  const a = nodes.find((n) => n.id === fromId);
  const b = nodes.find((n) => n.id === toId);
  if (!a || !b) return '';
  return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}

export const BIG_O_CLASSES = [
  {id: 'c1', label: 'O(1)', fn: () => 1, color: '#22c55e'},
  {id: 'logn', label: 'O(log n)', fn: (n) => Math.log2(Math.max(n, 2)), color: '#06b6d4'},
  {id: 'n', label: 'O(n)', fn: (n) => n, color: '#3b82f6'},
  {id: 'nlogn', label: 'O(n log n)', fn: (n) => n * Math.log2(Math.max(n, 2)), color: '#8b5cf6'},
  {id: 'n2', label: 'O(n²)', fn: (n) => n * n, color: '#f59e0b'},
  {id: 'n3', label: 'O(n³)', fn: (n) => n ** 3, color: '#ef4444'},
  {id: 'exp', label: 'O(2ⁿ)', fn: (n) => Math.min(2 ** Math.min(n, 20), 1e12), color: '#ec4899'},
];
