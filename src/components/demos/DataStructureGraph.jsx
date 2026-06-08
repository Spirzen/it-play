import React, {useState, useEffect, useMemo} from 'react';
import clsx from 'clsx';
import {
  DataStructureLayout,
  LangTabs,
  TypeChips,
  CodeBlock,
  VizSection,
  InfoNote,
  resolveDataLang,
  useIsMobile,
  useCopyToClipboard,
} from '@/components/shared/kb/dataStructureDemo';
import styles from '@/components/shared/kb/dataStructureDemo.module.css';

const GRAPH_DATA = {
  directed: {
    title: 'Ориентированный граф',
    desc: 'Вершины и направленные рёбра. Каждое ребро задаёт направление — как односторонняя дорога или зависимость задач.',
    nodes: [
      {id: 'A', x: 50, y: 10},
      {id: 'B', x: 20, y: 50},
      {id: 'C', x: 80, y: 50},
      {id: 'D', x: 50, y: 90},
    ],
    edges: [
      {from: 'A', to: 'B'},
      {from: 'A', to: 'C'},
      {from: 'B', to: 'D'},
      {from: 'C', to: 'D'},
      {from: 'D', to: 'A'},
    ],
    order: ['A', 'B', 'C', 'D', 'A'],
  },
  undirected: {
    title: 'Неориентированный граф',
    desc: 'Связи двусторонние — можно "идти" в любую сторону. Подходит для социальных сетей и карт без одностороннего движения.',
    nodes: [
      {id: 'X', x: 30, y: 30},
      {id: 'Y', x: 70, y: 30},
      {id: 'Z', x: 50, y: 80},
    ],
    edges: [
      {from: 'X', to: 'Y'},
      {from: 'X', to: 'Z'},
      {from: 'Y', to: 'Z'},
    ],
    order: ['X', 'Y', 'Z'],
  },
  weighted: {
    title: 'Взвешенный граф',
    desc: 'У каждого ребра есть вес (расстояние, стоимость, время). Алгоритмы вроде Дейкстры ищут путь с минимальной суммой весов.',
    nodes: [
      {id: 'P', x: 40, y: 20},
      {id: 'Q', x: 60, y: 20},
      {id: 'R', x: 50, y: 70},
    ],
    edges: [
      {from: 'P', to: 'Q', weight: 5},
      {from: 'P', to: 'R', weight: 10},
      {from: 'Q', to: 'R', weight: 3},
    ],
    order: ['P', 'Q', 'R'],
  },
};

const CODE = {
  js: {
    directed: `const graph = { A: ['B','C'], B: ['D'], C: ['D'], D: ['A'] };
function dfs(node, visited = new Set()) {
  if (visited.has(node)) return;
  console.log(node);
  visited.add(node);
  graph[node]?.forEach(n => dfs(n, visited));
}
dfs('A');`,
    undirected: `const graph = { X: ['Y','Z'], Y: ['X','Z'], Z: ['X','Y'] };
function addEdge(u, v) {
  (graph[u] ??= []).push(v);
  (graph[v] ??= []).push(u);
}`,
    weighted: `const graph = { P: { Q: 5, R: 10 }, Q: { R: 3 } };
// Кратчайший путь P → Q → R = 8 (лучше, чем P → R = 10)`,
  },
  py: {
    directed: `graph = {'A': ['B','C'], 'B': ['D'], 'C': ['D'], 'D': ['A']}
def dfs(node, visited=None):
    visited = visited or set()
    if node in visited: return
    print(node); visited.add(node)
    for n in graph.get(node, []): dfs(n, visited)
dfs('A')`,
    undirected: `graph = {'X': ['Y','Z'], 'Y': ['X','Z'], 'Z': ['X','Y']}`,
    weighted: `graph = {'P': {'Q': 5, 'R': 10}, 'Q': {'R': 3}}`,
  },
  java: {
    directed: `Map<String, List<String>> graph = Map.of(
    "A", List.of("B", "C"),
    "B", List.of("D"),
    "C", List.of("D"),
    "D", List.of("A")
);
// обход DFS — рекурсия или стек`,
    undirected: `Map<String, Set<String>> graph = new HashMap<>();
// addEdge(u,v) добавляет связь в обе стороны`,
    weighted: `Map<String, Map<String, Integer>> graph = Map.of(
    "P", Map.of("Q", 5, "R", 10),
    "Q", Map.of("R", 3)
);`,
  },
  cs: {
    directed: `var graph = new Dictionary<string, List<string>> {
  ["A"] = new() { "B", "C" }, ["B"] = new() { "D" },
  ["C"] = new() { "D" }, ["D"] = new() { "A" }
};`,
    undirected: `// Рёбра добавляются в обе стороны`,
    weighted: `// Dictionary<string, Dictionary<string, int>>`,
  },
  dart: {
    directed: `final graph = <String, List<String>>{
  'A': ['B', 'C'],
  'B': ['D'],
  'C': ['D'],
  'D': ['A'],
};`,
    undirected: `// graph[u]!.add(v); graph[v]!.add(u);`,
    weighted: `final weights = <String, Map<String, int>>{
  'P': {'Q': 5, 'R': 10},
  'Q': {'R': 3},
};`,
  },
  r: {
    directed: `graph <- list(
  A = c("B", "C"), B = c("D"),
  C = c("D"), D = c("A")
)
# DFS: обход соседей graph[[node]]`,
    undirected: `graph <- list(X = c("Y","Z"), Y = c("X","Z"), Z = c("X","Y"))`,
    weighted: `graph <- list(P = list(Q = 5, R = 10), Q = list(R = 3))`,
  },
  lua: {
    directed: `local graph = {
  A = {"B", "C"}, B = {"D"},
  C = {"D"}, D = {"A"},
}`,
    undirected: `local graph = {X = {"Y","Z"}, Y = {"X","Z"}, Z = {"X","Y"}}`,
    weighted: `local graph = {P = {Q = 5, R = 10}, Q = {R = 3}}`,
  },
  groovy: {
    directed: `def graph = [
  A: ['B','C'], B: ['D'],
  C: ['D'], D: ['A'],
]`,
    undirected: `def graph = [X: ['Y','Z'], Y: ['X','Z'], Z: ['X','Y']]`,
    weighted: `def graph = [P: [Q: 5, R: 10], Q: [R: 3]]`,
  },
  fortran: {
    directed: `! список смежности: массив соседей для каждой вершины
integer, allocatable :: adj(:,:)
! или модуль с TYPE(Node) + POINTER`,
    undirected: `! каждое ребро (u,v) дублируется как (v,u)`,
    weighted: `real :: weight(n_edges)  ! веса рёбер отдельным массивом`,
  },
  bsl: {
    directed: `Граф = Новый Соответствие;
Граф.Вставить("A", Новый Массив("B", "C"));
Граф.Вставить("B", Новый Массив("D"));`,
    undirected: `// связь добавляется в обе стороны`,
    weighted: `// вес ребра — отдельное поле структуры`,
  },
};

const TYPE_OPTIONS = [
  {id: 'directed', label: 'Ориентированный'},
  {id: 'undirected', label: 'Неориентированный'},
  {id: 'weighted', label: 'Взвешенный'},
];

function GraphLogic({defaultLang = 'js'}) {
  const [activeTab, setActiveTab] = useState(() =>
    resolveDataLang(defaultLang, CODE, (id) => Boolean(CODE[id]?.directed)),
  );
  const [graphType, setGraphType] = useState('directed');
  const [hoverNode, setHoverNode] = useState(null);
  const [visited, setVisited] = useState([]);
  const [step, setStep] = useState(-1);
  const isMobile = useIsMobile();
  const {copied, copy} = useCopyToClipboard();

  const data = GRAPH_DATA[graphType];
  const padding = 24;
  const width = isMobile ? 300 : 420;
  const height = isMobile ? 220 : 260;
  const mapX = (v) => padding + (v / 100) * (width - padding * 2);
  const mapY = (v) => padding + (v / 100) * (height - padding * 2);
  const radius = isMobile ? 18 : 22;

  useEffect(() => {
    setVisited([]);
    setStep(-1);
    setHoverNode(null);
  }, [graphType]);

  useEffect(() => {
    if (step < 0 || step >= data.order.length) return undefined;
    const t = window.setTimeout(() => {
      setVisited((v) => [...new Set([...v, data.order[step]])]);
      setStep((s) => s + 1);
    }, 700);
    return () => window.clearTimeout(t);
  }, [step, data.order]);

  const startTraverse = () => {
    setVisited([]);
    setStep(0);
  };

  const activeNode = step >= 0 && step < data.order.length ? data.order[step] : null;
  const visitedSet = useMemo(() => new Set(visited), [visited]);

  const renderEdge = (edge, index) => {
    const from = data.nodes.find((n) => n.id === edge.from);
    const to = data.nodes.find((n) => n.id === edge.to);
    if (!from || !to) return null;

    const x1 = mapX(from.x);
    const y1 = mapY(from.y);
    const x2 = mapX(to.x);
    const y2 = mapY(to.y);
    const active =
      visitedSet.has(edge.from) && visitedSet.has(edge.to) &&
      data.order.indexOf(edge.to) === data.order.indexOf(edge.from) + 1;

    const line = (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        className={clsx(styles.graphEdge, active && styles.graphEdgeActive, graphType !== 'undirected' && styles.graphEdgeAnim)}
      />
    );

    if (graphType === 'undirected') return <g key={index}>{line}</g>;

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const hl = 9;
    const ax = x2 - hl * Math.cos(angle - Math.PI / 6);
    const ay = y2 - hl * Math.sin(angle - Math.PI / 6);
    const bx = x2 - hl * Math.cos(angle + Math.PI / 6);
    const by = y2 - hl * Math.sin(angle + Math.PI / 6);

    return (
      <g key={index}>
        {line}
        {graphType !== 'undirected' && (
          <polygon points={`${ax},${ay} ${x2},${y2} ${bx},${by}`} fill="var(--ds-edge)" />
        )}
        {edge.weight != null && (
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} className={styles.graphWeight}>
            {edge.weight}
          </text>
        )}
      </g>
    );
  };

  const infoText = {
    directed: 'Круги — вершины, стрелки — направление. Двигаться можно только по стрелкам.',
    undirected: 'Линии без направления: связанные вершины доступны в обе стороны.',
    weighted: 'Числа у рёбер — веса. Алгоритмы ищут путь с минимальной суммой.',
  };

  return (
    <DataStructureLayout title={data.title} subtitle={data.desc}>
      <TypeChips options={TYPE_OPTIONS} value={graphType} onChange={setGraphType} />
      <LangTabs active={activeTab} onChange={setActiveTab} />
      <CodeBlock
        code={(CODE[activeTab] ?? CODE.js)[graphType]}
        copied={copied}
        onCopy={copy}
      />

      <VizSection label="Визуализация">
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.graphSvg} role="img" aria-label="Граф">
          {data.edges.map(renderEdge)}
          {data.nodes.map((node) => {
            const cx = mapX(node.x);
            const cy = mapY(node.y);
            const isVisited = visitedSet.has(node.id);
            const isActive = activeNode === node.id || hoverNode === node.id;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoverNode(node.id)}
                onMouseLeave={() => setHoverNode(null)}
                style={{cursor: 'pointer'}}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  className={clsx(
                    styles.graphNode,
                    isActive && styles.graphNodeActive,
                    isVisited && styles.graphNodeVisited,
                  )}
                />
                <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontWeight="700" fontSize={isMobile ? 12 : 14}>
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        <div className={styles.graphControls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={startTraverse}>
            ▶ Обход по порядку
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            onClick={() => {
              setVisited([]);
              setStep(-1);
            }}
          >
            Сброс
          </button>
        </div>
      </VizSection>

      <InfoNote title="Подсказка:">{infoText[graphType]}</InfoNote>
    </DataStructureLayout>
  );
}

export default function DataStructureGraph({defaultLang = 'js'}) {
  return <GraphLogic/>;
}
