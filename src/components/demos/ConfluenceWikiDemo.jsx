import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/ConfluenceWikiDemo.module.css';

const SPACES = [
  {
    id: 'proj',
    name: 'Проект Shop',
    pages: [
      {id: 'vision', title: 'Vision & Scope', parent: null},
      {id: 'brd', title: 'BRD', parent: 'vision'},
      {id: 'api', title: 'API Spec', parent: 'brd'},
      {id: 'bpmn', title: 'Процесс заказа (BPMN)', parent: 'brd'},
    ],
  },
  {
    id: 'team',
    name: 'Команда',
    pages: [{id: 'onboard', title: 'Онбординг', parent: null}],
  },
];

const INITIAL_CONTENT = {
  vision: '# Vision\n\nЦель: единая платформа заказов.\n\n## Стейкхолдеры\n- Product Owner\n- Команда разработки',
  brd: '# BRD\n\n| ID | Требование | Приоритет |\n|----|------------|----------|\n| FR-01 | Оформление заказа | Must |',
  api: '# API\n\n```\nGET /api/v1/orders\nPOST /api/v1/orders\n```\n\nСм. Swagger.',
  bpmn: '# BPMN\n\nМакрос Draw.io / Mermaid:\n\n```mermaid\nflowchart LR\n  A[Старт] --> B[Оплата]\n```',
  onboard: '# Онбординг\n\n1. Доступ к Jira\n2. Пространство Confluence',
};

function ConfluenceWikiDemoInner() {
  const [spaceId, setSpaceId] = useState('proj');
  const [pageId, setPageId] = useState('vision');
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [comments, setComments] = useState([
    {page: 'brd', author: 'Аналитик', text: 'Добавить NFR по SLA', resolved: false},
  ]);
  const [newComment, setNewComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history] = useState([
    {ver: 3, who: 'Иван', when: 'сегодня 14:20', note: 'Уточнил FR-01'},
    {ver: 2, who: 'Анна', when: 'вчера', note: 'Черновик таблицы'},
    {ver: 1, who: 'Иван', when: '10.05', note: 'Создана страница'},
  ]);

  const space = SPACES.find((s) => s.id === spaceId);
  const pageComments = comments.filter((c) => c.page === pageId && !c.resolved);

  const renderTree = (parentId = null, depth = 0) =>
    space.pages
      .filter((p) => p.parent === parentId)
      .map((p) => (
        <React.Fragment key={p.id}>
          <button
            type="button"
            className={clsx(styles.treeItem, pageId === p.id && styles.treeActive)}
            style={{paddingLeft: 8 + depth * 12}}
            onClick={() => setPageId(p.id)}
          >
            📄 {p.title}
          </button>
          {renderTree(p.id, depth + 1)}
        </React.Fragment>
      ));

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор Confluence"
        subtitle="Пространства, дерево страниц, редактор, комментарии и история изменений"
      >
        <div className={styles.app}>
          <aside className={styles.left}>
            <label className={styles.spaceSelect}>
              Пространство
              <select value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
                {SPACES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className={styles.createPage}>
              + Создать страницу
            </button>
            <nav className={styles.tree}>{renderTree()}</nav>
          </aside>

          <main className={styles.editor}>
            <header className={styles.pageHead}>
              <h3>{space.pages.find((p) => p.id === pageId)?.title}</h3>
              <div className={styles.actions}>
                <button type="button" onClick={() => setShowHistory(!showHistory)}>
                  История
                </button>
                <button type="button">Поделиться</button>
                <button type="button">⋯ Jira</button>
              </div>
            </header>
            <div className={styles.toolbar}>
              <span>H1</span>
              <span>B</span>
              <span>≡</span>
              <span>🔗</span>
              <span>{'{ }'} Mermaid</span>
              <span>Draw.io</span>
            </div>
            <textarea
              className={styles.body}
              value={content[pageId] || ''}
              onChange={(e) =>
                setContent((prev) => ({...prev, [pageId]: e.target.value}))
              }
              rows={12}
            />
            {showHistory && (
              <ul className={styles.history}>
                {history.map((h) => (
                  <li key={h.ver}>
                    v{h.ver} — {h.who}, {h.when}: {h.note}
                  </li>
                ))}
              </ul>
            )}
          </main>

          <aside className={styles.comments}>
            <h4>Комментарии</h4>
            {pageComments.map((c, i) => (
              <div key={i} className={styles.comment}>
                <strong>{c.author}</strong>
                <p>{c.text}</p>
                <button
                  type="button"
                  className={styles.resolve}
                  onClick={() =>
                    setComments((prev) =>
                      prev.map((x, j) => (j === i ? {...x, resolved: true} : x)),
                    )
                  }
                >
                  Resolve
                </button>
              </div>
            ))}
            <textarea
              rows={2}
              placeholder="Комментарий к странице…"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="button"
              className={styles.post}
              onClick={() => {
                if (!newComment.trim()) return;
                setComments((prev) => [
                  ...prev,
                  {page: pageId, author: 'Вы', text: newComment, resolved: false},
                ]);
                setNewComment('');
              }}
            >
              Отправить
            </button>
          </aside>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default ConfluenceWikiDemoInner;
