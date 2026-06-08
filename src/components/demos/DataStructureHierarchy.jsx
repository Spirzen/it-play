import React, {useState} from 'react';
import clsx from 'clsx';
import {
  DataStructureLayout,
  LangTabs,
  CodeBlock,
  VizSection,
  InfoNote,
  useCopyToClipboard,
} from '@/components/shared/kb/dataStructureDemo';
import styles from '@/components/shared/kb/dataStructureDemo.module.css';

const CONTENT = {
  xml: {
    title: 'XML (Extensible Markup Language)',
    subtitle:
      'Текстовый формат с вложенными тегами и атрибутами. Иерархия строится за счёт вложения элементов друг в друга.',
    code: `<library>
  <book id="101">
    <title lang="ru">Введение в программирование</title>
    <author>Иван Иванов</author>
    <year>2024</year>
    <price currency="RUB">1500</price>
  </book>
  <book id="102">
    <title lang="en">Advanced Algorithms</title>
    <author>Jane Doe</author>
    <year>2023</year>
    <price currency="USD">45</price>
  </book>
</library>`,
    tree: [
      {
        name: 'library',
        children: [
          {
            name: 'book (id=101)',
            children: [
              {name: 'title (lang=ru)', text: 'Введение в программирование'},
              {name: 'author', text: 'Иван Иванов'},
              {name: 'year', text: '2024'},
              {name: 'price (currency=RUB)', text: '1500'},
            ],
          },
          {
            name: 'book (id=102)',
            children: [
              {name: 'title (lang=en)', text: 'Advanced Algorithms'},
              {name: 'author', text: 'Jane Doe'},
              {name: 'year', text: '2023'},
              {name: 'price (currency=USD)', text: '45'},
            ],
          },
        ],
      },
    ],
  },
  json: {
    title: 'JSON (JavaScript Object Notation)',
    subtitle:
      'Лёгкий формат обмена данными: объекты, массивы и вложенность задают дерево "ключ → значение".',
    code: `{
  "library": {
    "books": [
      {
        "id": "101",
        "title": "Введение в программирование",
        "author": "Иван Иванов",
        "year": 2024,
        "price": { "amount": 1500, "currency": "RUB" }
      },
      {
        "id": "102",
        "title": "Advanced Algorithms",
        "author": "Jane Doe",
        "year": 2023,
        "price": { "amount": 45, "currency": "USD" }
      }
    ]
  }
}`,
    tree: [
      {
        name: 'root',
        children: [
          {
            name: 'library',
            children: [
              {
                name: 'books []',
                children: [
                  {
                    name: '{object}',
                    children: [
                      {name: 'id', value: '"101"'},
                      {name: 'title', value: '"Введение в программирование"'},
                      {name: 'author', value: '"Иван Иванов"'},
                      {name: 'year', value: '2024'},
                      {
                        name: 'price',
                        children: [
                          {name: 'amount', value: '1500'},
                          {name: 'currency', value: '"RUB"'},
                        ],
                      },
                    ],
                  },
                  {
                    name: '{object}',
                    children: [
                      {name: 'id', value: '"102"'},
                      {name: 'title', value: '"Advanced Algorithms"'},
                      {name: 'author', value: '"Jane Doe"'},
                      {name: 'year', value: '2023'},
                      {
                        name: 'price',
                        children: [
                          {name: 'amount', value: '45'},
                          {name: 'currency', value: '"USD"'},
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

const FORMAT_TABS = [
  {id: 'xml', label: 'XML'},
  {id: 'json', label: 'JSON'},
];

function TreeNode({node, format, depth = 0, path = '0'}) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = Boolean(node.children?.length);
  const label = node.name + (node.value ? ` = ${node.value}` : '');
  const textPreview =
    node.text && (node.text.length > 36 ? `${node.text.slice(0, 33)}…` : node.text);

  return (
    <div className={styles.treeNode}>
      <div className={styles.treeRow}>
        <button
          type="button"
          className={styles.treeToggle}
          onClick={() => setOpen((o) => !o)}
          disabled={!hasChildren}
          aria-expanded={hasChildren ? open : undefined}
        >
          {hasChildren ? (open ? '−' : '+') : '·'}
        </button>
        <span
          className={clsx(
            styles.treeTag,
            format === 'xml' ? styles.treeTagXml : styles.treeTagJson,
          )}
        >
          {label}
          {textPreview && <span className={styles.treeValue}> → {textPreview}</span>}
        </span>
      </div>
      {hasChildren && open && (
        <div className={styles.treeChildren}>
          {node.children.map((child, i) => (
            <TreeNode key={`${path}-${i}`} node={child} format={format} depth={depth + 1} path={`${path}-${i}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function HierarchyLogic() {
  const [activeTab, setActiveTab] = useState('xml');
  const {copied, copy} = useCopyToClipboard();
  const content = CONTENT[activeTab];

  return (
    <DataStructureLayout title={content.title} subtitle={content.subtitle}>
      <LangTabs active={activeTab} onChange={setActiveTab} tabs={FORMAT_TABS} />
      <CodeBlock code={content.code} copied={copied} onCopy={copy} />

      <VizSection label="Древовидная структура">
        <div className={styles.tree}>
          {content.tree.map((node, i) => (
            <TreeNode key={i} node={node} format={activeTab} path={String(i)} />
          ))}
        </div>
      </VizSection>

      <InfoNote>
        Корневой узел содержит дочерние элементы, те — свои подузлы. Так удобно хранить конфиги, документы и API-ответы.
      </InfoNote>
    </DataStructureLayout>
  );
}

export default function DataStructureHierarchy() {
  return <HierarchyLogic/>;
}
