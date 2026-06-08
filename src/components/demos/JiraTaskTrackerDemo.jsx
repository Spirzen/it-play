import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/JiraTaskTrackerDemo.module.css';

const COLUMNS = [
  {id: 'todo', label: 'To Do'},
  {id: 'progress', label: 'In Progress'},
  {id: 'review', label: 'In Review'},
  {id: 'done', label: 'Done'},
];

const INITIAL_ISSUES = [
  {
    id: 'SHOP-1',
    type: 'epic',
    title: 'Модуль авторизации и сессий',
    status: 'progress',
    priority: 'medium',
    assignee: 'А. Петров',
    due: '2026-06-15',
    epicId: null,
    description:
      'Крупная цель: единый вход в личный кабинет, восстановление пароля, SSO для B2B.',
    subtasks: [],
    comments: [{author: 'PO', text: 'Приоритет на Q2', time: '10.05 09:00'}],
  },
  {
    id: 'SHOP-42',
    type: 'story',
    title: 'Исправить баг с авторизацией',
    status: 'progress',
    priority: 'high',
    assignee: 'М. Иванов',
    due: '2026-05-18',
    epicId: 'SHOP-1',
    description:
      'Пользователи не могут войти в систему: после нажатия "Войти" появляется ошибка валидации пароля, хотя пароль корректный.\n\nШаги:\n1. Открыть /login\n2. Ввести email и пароль\n3. Нажать "Войти"\n\nОжидание: редирект в кабинет.',
    subtasks: [
      {id: 'st1', title: 'Воспроизвести на staging', done: true},
      {id: 'st2', title: 'Написать unit-тест на валидатор', done: false},
      {id: 'st3', title: 'Проверить регрессию OAuth', done: false},
    ],
    comments: [
      {author: 'QA', text: 'Воспроизводится в Chrome 124, Safari ок', time: '19.05 11:20'},
      {author: 'Dev', text: 'Похоже на trim() в middleware', time: '19.05 14:05'},
    ],
  },
  {
    id: 'SHOP-43',
    type: 'task',
    title: 'Обновить схему JWT в документации',
    status: 'todo',
    priority: 'low',
    assignee: 'Тех. писатель',
    due: '2026-05-25',
    epicId: 'SHOP-1',
    description: 'После фикса — обновить Confluence и OpenAPI.',
    subtasks: [],
    comments: [],
  },
  {
    id: 'SHOP-51',
    type: 'bug',
    title: '500 при сбросе пароля по ссылке из письма',
    status: 'review',
    priority: 'high',
    assignee: 'М. Иванов',
    due: '2026-05-17',
    epicId: 'SHOP-1',
    description: 'Токен из email истекает, но UI показывает общую ошибку без кода.',
    subtasks: [],
    comments: [{author: 'Support', text: '5 обращений за неделю', time: '18.05 08:40'}],
  },
  {
    id: 'SHOP-12',
    type: 'task',
    title: 'Настроить напоминания о дедлайнах в Slack',
    status: 'done',
    priority: 'medium',
    assignee: 'DevOps',
    due: '2026-05-10',
    epicId: null,
    description: 'Webhook Jira → Slack #shop-dev',
    subtasks: [],
    comments: [],
  },
];

const TYPE_LABEL = {
  epic: 'Epic',
  story: 'Story',
  bug: 'Bug',
  task: 'Task',
};

function isOverdue(due, status) {
  if (status === 'done' || !due) return false;
  return new Date(due) < new Date('2026-05-21');
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function JiraTaskTrackerDemoInner() {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [selectedId, setSelectedId] = useState('SHOP-42');
  const [view, setView] = useState('board');
  const [commentDraft, setCommentDraft] = useState('');

  const selected = issues.find((i) => i.id === selectedId);
  const epic = selected?.epicId ? issues.find((i) => i.id === selected.epicId) : null;

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, []]));
    issues.forEach((issue) => {
      if (map[issue.status]) map[issue.status].push(issue);
    });
    return map;
  }, [issues]);

  const updateIssue = (id, patch) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? {...i, ...patch} : i)));
  };

  const moveStatus = (id, status) => updateIssue(id, {status});

  const toggleSubtask = (issueId, subId) => {
    setIssues((prev) =>
      prev.map((i) => {
        if (i.id !== issueId) return i;
        return {
          ...i,
          subtasks: i.subtasks.map((s) =>
            s.id === subId ? {...s, done: !s.done} : s,
          ),
        };
      }),
    );
  };

  const addComment = () => {
    if (!commentDraft.trim() || !selected) return;
    const entry = {
      author: 'Вы',
      text: commentDraft.trim(),
      time: new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    updateIssue(selected.id, {comments: [...selected.comments, entry]});
    setCommentDraft('');
  };

  const renderCard = (issue) => {
    const overdue = isOverdue(issue.due, issue.status);
    return (
      <button
        key={issue.id}
        type="button"
        className={clsx(styles.card, {
          [styles.cardSelected]: selectedId === issue.id,
          [styles.cardOverdue]: overdue,
        })}
        onClick={() => setSelectedId(issue.id)}
      >
        <div className={styles.cardTop}>
          <span
            className={clsx(styles.typeBadge, {
              [styles.typeEpic]: issue.type === 'epic',
              [styles.typeStory]: issue.type === 'story',
              [styles.typeBug]: issue.type === 'bug',
              [styles.typeTask]: issue.type === 'task',
            })}
          >
            {TYPE_LABEL[issue.type]}
          </span>
          <span className={styles.issueKey}>{issue.id}</span>
        </div>
        <p className={styles.cardTitle}>{issue.title}</p>
        <div className={styles.cardMeta}>
          <span
            className={clsx(styles.priority, {
              [styles.pHigh]: issue.priority === 'high',
              [styles.pMedium]: issue.priority === 'medium',
              [styles.pLow]: issue.priority === 'low',
            })}
          >
            {issue.priority === 'high' ? '▲ High' : issue.priority === 'medium' ? '● Med' : '▼ Low'}
          </span>
          <span className={styles.avatar} title={issue.assignee}>
            {initials(issue.assignee)}
          </span>
        </div>
        {overdue && <span className={styles.overdueTag}>Просрочено</span>}
      </button>
    );
  };

  const renderDetail = () => {
    if (!selected) {
      return (
        <div className={styles.detailEmpty}>
          Выберите задачу на доске или в бэклоге
        </div>
      );
    }

    const overdue = isOverdue(selected.due, selected.status);
    const subDone = selected.subtasks.filter((s) => s.done).length;

    return (
      <div className={styles.detail}>
        <div className={styles.detailHead}>
          <span
            className={clsx(styles.typeBadge, {
              [styles.typeEpic]: selected.type === 'epic',
              [styles.typeStory]: selected.type === 'story',
              [styles.typeBug]: selected.type === 'bug',
              [styles.typeTask]: selected.type === 'task',
            })}
          >
            {TYPE_LABEL[selected.type]}
          </span>
          <span className={styles.issueKey}> {selected.id}</span>
          <h3>{selected.title}</h3>
          {epic && (
            <button
              type="button"
              className={styles.epicLink}
              onClick={() => setSelectedId(epic.id)}
            >
              ↑ {epic.id} {epic.title}
            </button>
          )}
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label>Статус</label>
            <select
              value={selected.status}
              onChange={(e) => moveStatus(selected.id, e.target.value)}
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Приоритет</label>
            <select
              value={selected.priority}
              onChange={(e) => updateIssue(selected.id, {priority: e.target.value})}
            >
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Исполнитель</label>
            <input
              value={selected.assignee}
              onChange={(e) => updateIssue(selected.id, {assignee: e.target.value})}
            />
          </div>
          <div className={styles.field}>
            <label>Дедлайн</label>
            <input
              type="date"
              value={selected.due}
              onChange={(e) => updateIssue(selected.id, {due: e.target.value})}
            />
          </div>
        </div>

        {overdue && (
          <p className={styles.overdueTag}>
            Дедлайн прошёл — задача подсвечена на доске
          </p>
        )}

        <p className={styles.desc}>{selected.description}</p>

        {selected.subtasks.length > 0 && (
          <div className={styles.subtasks}>
            <h4>
              Подзадачи ({subDone}/{selected.subtasks.length})
            </h4>
            {selected.subtasks.map((st) => (
              <label key={st.id} className={styles.subtask}>
                <input
                  type="checkbox"
                  checked={st.done}
                  onChange={() => toggleSubtask(selected.id, st.id)}
                />
                {st.title}
              </label>
            ))}
          </div>
        )}

        <div className={styles.moveRow}>
          {COLUMNS.filter((c) => c.id !== selected.status).map((c) => (
            <button
              key={c.id}
              type="button"
              className={styles.moveBtn}
              onClick={() => moveStatus(selected.id, c.id)}
            >
              → {c.label}
            </button>
          ))}
        </div>

        <div className={styles.comments}>
          <h4>Комментарии ({selected.comments.length})</h4>
          {selected.comments.map((c, idx) => (
            <div key={`${c.time}-${idx}`} className={styles.comment}>
              <strong>{c.author}</strong>
              <time>{c.time}</time>
              <p>{c.text}</p>
            </div>
          ))}
          <div className={styles.commentInput}>
            <input
              placeholder="Добавить комментарий…"
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
            />
            <button type="button" className={styles.btn} onClick={addComment}>
              Отправить
            </button>
          </div>
        </div>
      </div>
    );
  };

  const epics = issues.filter((i) => i.type === 'epic');
  const backlogChildren = (epicId) =>
    issues.filter((i) => i.epicId === epicId && i.type !== 'epic');
  const orphan = issues.filter((i) => !i.epicId && i.type !== 'epic');

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Симулятор Jira"
        subtitle="Эпик, story, подзадачи, канбан-доска, статусы, дедлайн и комментарии — как в типичном задачнике"
      >
        <div className={styles.app}>
          <nav className={styles.rail} aria-label="Навигация Jira">
            <button type="button" className={styles.railBtn} title="Проекты">
              ◫
            </button>
            <button
              type="button"
              className={clsx(styles.railBtn, view === 'board' && styles.railActive)}
              title="Доска"
              onClick={() => setView('board')}
            >
              ▦
            </button>
            <button
              type="button"
              className={clsx(styles.railBtn, view === 'backlog' && styles.railActive)}
              title="Бэклог"
              onClick={() => setView('backlog')}
            >
              ≡
            </button>
          </nav>

          <div className={styles.main}>
            <header className={styles.topbar}>
              <span className={styles.logo}>Jira</span>
              <span className={styles.breadcrumb}>
                Проекты / <strong>SHOP</strong> /{' '}
                {view === 'board' ? 'Kanban Board' : 'Backlog'}
              </span>
              <div className={styles.tabs}>
                <button
                  type="button"
                  className={clsx(styles.tab, view === 'board' && styles.tabActive)}
                  onClick={() => setView('board')}
                >
                  Доска
                </button>
                <button
                  type="button"
                  className={clsx(styles.tab, view === 'backlog' && styles.tabActive)}
                  onClick={() => setView('backlog')}
                >
                  Бэклог
                </button>
              </div>
            </header>

            <div className={styles.content}>
              <div className={styles.split}>
                <div>
                  {view === 'board' && (
                    <div className={styles.board}>
                      {COLUMNS.map((col) => (
                        <section key={col.id} className={styles.column}>
                          <div className={styles.colHead}>
                            {col.label}
                            <span className={styles.colCount}>
                              {byColumn[col.id]?.length ?? 0}
                            </span>
                          </div>
                          <div className={styles.colBody}>
                            {(byColumn[col.id] ?? []).map(renderCard)}
                          </div>
                        </section>
                      ))}
                    </div>
                  )}

                  {view === 'backlog' && (
                    <div className={styles.backlog}>
                      {epics.map((ep) => (
                        <div key={ep.id} className={styles.backlogGroup}>
                          <button
                            type="button"
                            className={styles.backlogEpic}
                            onClick={() => setSelectedId(ep.id)}
                          >
                            <span className={clsx(styles.typeBadge, styles.typeEpic)}>
                              Epic
                            </span>
                            {ep.id} — {ep.title}
                          </button>
                          {backlogChildren(ep.id).map((issue) => (
                            <button
                              key={issue.id}
                              type="button"
                              className={styles.backlogItem}
                              onClick={() => setSelectedId(issue.id)}
                            >
                              <span className={styles.issueKey}>{issue.id}</span>
                              {issue.title}
                            </button>
                          ))}
                        </div>
                      ))}
                      {orphan.length > 0 && (
                        <div className={styles.backlogGroup}>
                          <div className={styles.backlogEpic} style={{cursor: 'default'}}>
                            Без эпика
                          </div>
                          {orphan.map((issue) => (
                            <button
                              key={issue.id}
                              type="button"
                              className={styles.backlogItem}
                              onClick={() => setSelectedId(issue.id)}
                            >
                              <span className={styles.issueKey}>{issue.id}</span>
                              {issue.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {renderDetail()}
              </div>

              <p className={styles.hint}>
                Попробуйте: откройте SHOP-42 (story из статьи), отметьте подзадачи, смените
                статус на доске, добавьте комментарий — так команда фиксирует "кто, что и
                когда".
              </p>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default JiraTaskTrackerDemoInner;
