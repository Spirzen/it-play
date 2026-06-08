import React, {useState} from 'react';

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

const CODE = {
  js: {
    array: `const list = ['A', 'B', 'C', 'D'];
console.log(list[2]); // O(1) — доступ по индексу
list.push('E');
list.splice(1, 1); // удаление со сдвигом O(n)`,
    linked: `class Node {
  constructor(value) { this.value = value; this.next = null; }
}
const head = new Node('A');
head.next = new Node('B');
// обход O(n)`,
  },
  py: {
    array: `my_list = ['A', 'B', 'C', 'D']
print(my_list[2])
my_list.append('E')
del my_list[1]`,
    linked: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None`,
  },
  java: {
    array: `String[] arr = {"A", "B", "C", "D"};
System.out.println(arr[2]); // O(1)
// массив фиксированного размера; для роста — ArrayList`,
    linked: `class Node {
    String value;
    Node next;
    Node(String value) { this.value = value; }
}
// обход O(n)`,
  },
  cs: {
    array: `var list = new List<string> { "A", "B", "C", "D" };
Console.WriteLine(list[2]);
list.Add("E");
list.RemoveAt(1);`,
    linked: `public class Node {
    public string Value { get; set; }
    public Node Next { get; set; }
}`,
  },
  dart: {
    array: `final list = ['A', 'B', 'C', 'D'];
print(list[2]); // O(1)
list.add('E');
list.removeAt(1); // O(n) — сдвиг элементов`,
    linked: `class Node {
  Node(this.value);
  final String value;
  Node? next;
}
final head = Node('A')..next = Node('B');`,
  },
  r: {
    array: `vec <- c("A", "B", "C", "D")
vec[3]           # O(1) — доступ по индексу
vec <- c(vec, "E")
vec <- vec[-2]   # удаление со сдвигом O(n)`,
    linked: `lst <- list("A", list("B"))
lst[[1]]
lst[[2]][[1]]    # вложенный список — обход O(n)`,
  },
  lua: {
    array: `local list = {"A", "B", "C", "D"}
print(list[3])        -- O(1), индексация с 1
table.insert(list, "E")
table.remove(list, 2) -- O(n) — сдвиг в таблице`,
    linked: `local function node(value, next)
  return {value = value, next = next}
end
local head = node("A", node("B", nil))
-- обход O(n)`,
  },
  groovy: {
    array: `def list = ['A', 'B', 'C', 'D']
println list[2]       // O(1)
list << 'E'
list.remove(1)      // O(n)`,
    linked: `def head = [value: 'A', next: [value: 'B', next: null]]
// обход O(n)`,
  },
  fortran: {
    array: `character(len=1), dimension(4) :: arr
arr = ['A', 'B', 'C', 'D']
print *, arr(3)     ! O(1), индексация с 1`,
    linked: `type :: Node
  character(len=1) :: val
  type(Node), pointer :: next
end type
! связный список — через POINTER, обход O(n)`,
  },
  bsl: {
    array: `Массив = Новый Массив;
Массив.Добавить("A");
Массив.Добавить("B");
Массив.Добавить("C");
Значение = Массив[1]; // O(1), индекс с 0`,
    linked: `// в 1С чаще Массив или СписокЗначений, не классический linked list
Список = Новый СписокЗначений;
Список.Добавить("A");
Список.Добавить("B");`,
  },
};

const TYPE_OPTIONS = [
  {id: 'array', label: 'Массив'},
  {id: 'linked', label: 'Связный список'},
];

function LinearLogic({defaultLang = 'js'}) {
  const [activeTab, setActiveTab] = useState(() => resolveDataLang(defaultLang, CODE));
  const [structureType, setStructureType] = useState('array');
  const [highlightIdx, setHighlightIdx] = useState(2);
  const isMobile = useIsMobile();
  const {copied, copy} = useCopyToClipboard();

  const renderArray = () => {
    const data = ['A', 'B', 'C', 'D'];
    const startX = isMobile ? 28 : 40;
    const cellW = isMobile ? 52 : 68;
    const svgW = isMobile ? 340 : 480;
    const y = isMobile ? 72 : 88;

    return (
      <svg viewBox={`0 0 ${svgW} 150`} className={styles.linearSvg} aria-label="Массив">
        <defs>
          <linearGradient id="arrGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="color-mix(in srgb, var(--ifm-color-primary) 15%, white)" />
            <stop offset="100%" stopColor="color-mix(in srgb, var(--ifm-color-primary) 8%, white)" />
          </linearGradient>
        </defs>
        {data.map((item, index) => {
          const x = startX + index * cellW;
          const active = index === highlightIdx;
          return (
            <g
              key={index}
              className={clsx(styles.arrayCell, active && styles.arrayCellHighlight)}
              onClick={() => setHighlightIdx(index)}
              style={{cursor: 'pointer'}}
            >
              <rect
                x={x}
                y={y - 22}
                width={cellW - 8}
                height={44}
                rx={6}
                fill={active ? 'var(--demo-highlight)' : 'url(#arrGrad)'}
                stroke="var(--ifm-color-primary)"
                strokeWidth={active ? 2.5 : 2}
              />
              <text x={x - 4} y={y - 30} fontSize={9} fill="var(--demo-muted)">
                [{index}]
              </text>
              <text x={x + (cellW - 8) / 2} y={y} textAnchor="middle" dominantBaseline="middle" fontWeight="700" fontSize={13}>
                {item}
              </text>
            </g>
          );
        })}
        <text x={svgW / 2} y={138} textAnchor="middle" fontSize={11} fill="var(--demo-muted)">
          Непрерывная память · клик по ячейке — доступ O(1)
        </text>
      </svg>
    );
  };

  const renderLinked = () => {
    const nodes = isMobile
      ? [
          {val: 'A', x: 55},
          {val: 'B', x: 130},
          {val: 'C', x: 205},
          {val: 'D', x: 280},
        ]
      : [
          {val: 'A', x: 70},
          {val: 'B', x: 170},
          {val: 'C', x: 270},
          {val: 'D', x: 370},
        ];
    const svgW = isMobile ? 360 : 480;
    const y = isMobile ? 78 : 92;
    const w = isMobile ? 48 : 56;

    return (
      <svg viewBox={`0 0 ${svgW} 150`} className={styles.linearSvg} aria-label="Связный список">
        <defs>
          <marker id="lnkArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--ifm-color-warning)" />
          </marker>
        </defs>
        {nodes.slice(0, -1).map((n, i) => (
          <line
            key={`l-${i}`}
            x1={n.x + w / 2}
            y1={y}
            x2={nodes[i + 1].x - w / 2}
            y2={y}
            stroke="var(--ifm-color-warning)"
            strokeWidth={2.5}
            strokeDasharray="6 4"
            markerEnd="url(#lnkArrow)"
            className={styles.graphEdgeAnim}
          />
        ))}
        {nodes.map((n, i) => (
          <g key={n.val} onClick={() => setHighlightIdx(i)} style={{cursor: 'pointer'}}>
            <rect
              x={n.x - w / 2}
              y={y - 22}
              width={w}
              height={44}
              rx={8}
              fill={highlightIdx === i ? 'var(--demo-highlight)' : 'color-mix(in srgb, var(--ifm-color-warning) 12%, white)'}
              stroke="var(--ifm-color-warning)"
              strokeWidth={2}
            />
            <text x={n.x} y={y} textAnchor="middle" dominantBaseline="middle" fontWeight="700">
              {n.val}
            </text>
            {i < nodes.length - 1 && (
              <text x={n.x + w / 2 + 14} y={y + 4} fontSize={9} fill="var(--demo-muted)">
                next →
              </text>
            )}
          </g>
        ))}
        <text x={svgW / 2} y={138} textAnchor="middle" fontSize={11} fill="var(--demo-muted)">
          Узлы разбросаны в памяти, связаны указателями
        </text>
      </svg>
    );
  };

  const tips = {
    array: 'Мгновенный доступ по индексу O(1), но вставка/удаление в середине — O(n) из‑за сдвига.',
    linked: 'Вставка в начало O(1), но поиск по индексу — O(n), нужен последовательный обход.',
  };

  return (
    <DataStructureLayout
      title="Линейные структуры данных"
      subtitle="Элементы идут друг за другом: у каждого (кроме крайних) есть ровно один предшественник и один последователь."
    >
      <TypeChips options={TYPE_OPTIONS} value={structureType} onChange={setStructureType} />
      <LangTabs active={activeTab} onChange={setActiveTab} />
      <CodeBlock
        code={(CODE[activeTab] ?? CODE.js)[structureType]}
        copied={copied}
        onCopy={copy}
      />

      <VizSection label="Схема в памяти">
        {structureType === 'array' ? renderArray() : renderLinked()}
      </VizSection>

      <InfoNote title={structureType === 'array' ? 'Массив:' : 'Связный список:'}>{tips[structureType]}</InfoNote>
    </DataStructureLayout>
  );
}

export default function DataStructureLinear({defaultLang = 'js'}) {
  return <LinearLogic/>;
}
