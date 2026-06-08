export const GRAPH_NODES = [
  {id: 'alice', label: 'Алиса', x: 80, y: 120},
  {id: 'bob', label: 'Боб', x: 220, y: 60},
  {id: 'carol', label: 'Карол', x: 220, y: 180},
  {id: 'dave', label: 'Дэйв', x: 360, y: 120},
  {id: 'eve', label: 'Ева', x: 500, y: 60},
  {id: 'frank', label: 'Фрэнк', x: 500, y: 180},
];

export const GRAPH_EDGES = [
  {from: 'alice', to: 'bob', type: 'FOLLOWS'},
  {from: 'alice', to: 'carol', type: 'FRIENDS'},
  {from: 'bob', to: 'dave', type: 'FOLLOWS'},
  {from: 'carol', to: 'dave', type: 'FRIENDS'},
  {from: 'dave', to: 'eve', type: 'FOLLOWS'},
  {from: 'dave', to: 'frank', type: 'WORKS_WITH'},
  {from: 'bob', to: 'eve', type: 'FOLLOWS'},
];

export const TRAVERSAL_PRESETS = [
  {
    id: 'friends',
    label: 'Друзья (глубина 1)',
    start: 'alice',
    depth: 1,
    edgeTypes: ['FRIENDS', 'FOLLOWS'],
    cypher: 'MATCH (a:User {name:"Алиса"})-[:FRIENDS|FOLLOWS]->(f) RETURN f',
    sqlJoins: 1,
  },
  {
    id: 'foaf',
    label: 'Друзья друзей (глубина 2)',
    start: 'alice',
    depth: 2,
    edgeTypes: ['FRIENDS', 'FOLLOWS'],
    cypher: 'MATCH (a:User)-[:FRIENDS|FOLLOWS*1..2]->(x) RETURN DISTINCT x',
    sqlJoins: 2,
  },
  {
    id: 'path_work',
    label: 'Путь к коллеге',
    start: 'alice',
    depth: 4,
    edgeTypes: null,
    target: 'frank',
    cypher: 'MATCH p=shortestPath((a)-[*]-(f:User {name:"Фрэнк"})) RETURN p',
    sqlJoins: 4,
  },
];

export function bfs(startId, depth, edgeTypes, targetId) {
  const visited = new Set([startId]);
  const frontier = [{id: startId, depth: 0}];
  const pathEdges = [];
  const found = [];

  while (frontier.length) {
    const {id, d} = frontier.shift();
    if (d >= depth) continue;
    const out = GRAPH_EDGES.filter((e) => e.from === id);
    for (const edge of out) {
      if (edgeTypes && !edgeTypes.includes(edge.type)) continue;
      pathEdges.push(edge);
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        found.push({id: edge.to, depth: d + 1});
        frontier.push({id: edge.to, depth: d + 1});
        if (targetId && edge.to === targetId) {
          return {visited: [...visited], pathEdges, found, reachedTarget: true};
        }
      }
    }
  }
  return {
    visited: [...visited],
    pathEdges,
    found,
    reachedTarget: targetId ? visited.has(targetId) : true,
  };
}
