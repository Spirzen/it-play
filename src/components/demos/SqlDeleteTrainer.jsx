import React, {useMemo, useState} from 'react';
import {INITIAL_USERS, USER_COLUMNS, matchesConditions, parseWhereClause} from '@/components/shared/kb/sqlEngine';
import {
  SqlBrowserOnly,
  SqlConfirmDialog,
  SqlDataTable,
  SqlExampleChips,
  SqlQueryEditor,
  SqlStatsBar,
  SqlToolbar,
  SqlTrainerCard,
} from '@/components/shared/kb/sqlTrainerDemo';

const DEFAULT_QUERY = "DELETE FROM users WHERE city = 'Москва'";

const EXAMPLES = [
  {id: 'moscow', label: 'Москва', sql: DEFAULT_QUERY},
  {id: 'young', label: 'Молодые', sql: 'DELETE FROM users WHERE age < 25'},
  {id: 'ivan', label: 'Иван', sql: "DELETE FROM users WHERE name = 'Иван'"},
];

function SqlDeleteTrainerInner() {
  const [data, setData] = useState(INITIAL_USERS);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [warning, setWarning] = useState(null);
  const [activeExample, setActiveExample] = useState('moscow');
  const [pendingDelete, setPendingDelete] = useState(null);

  const reset = () => {
    setData(INITIAL_USERS);
    setQuery(DEFAULT_QUERY);
    setError(null);
    setInfo(null);
    setWarning(null);
    setPendingDelete(null);
    setActiveExample('moscow');
  };

  const previewDelete = (sql = query) => {
    setError(null);
    setInfo(null);
    setWarning(null);
    setPendingDelete(null);

    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    if (!upper.startsWith('DELETE')) {
      setError('Ожидается команда DELETE.');
      return;
    }

    try {
      const tableMatch = trimmed.match(/DELETE\s+FROM\s+(\w+)/i);
      if (!tableMatch) {
        throw new Error('Не указано имя таблицы');
      }
      if (tableMatch[1].toLowerCase() !== 'users') {
        throw new Error('В тренажёре доступна только таблица users');
      }

      if (!upper.includes('WHERE')) {
        throw new Error('DELETE без WHERE запрещён — добавьте условие, иначе удалятся все строки.');
      }

      const whereMatch = trimmed.match(/WHERE\s+(.+)$/i);
      const conditions = parseWhereClause(whereMatch?.[1] ?? '');

      if (conditions.length === 0) {
        throw new Error('Условие WHERE не распознано. Используйте =, >, <, >=, <= или LIKE.');
      }

      const toDelete = data.filter((row) => matchesConditions(row, conditions));

      if (toDelete.length === 0) {
        setWarning('DELETE не затронет ни одной записи — проверьте WHERE.');
        return;
      }

      if (toDelete.length > 1) {
        setPendingDelete({sql: trimmed, rows: toDelete});
        return;
      }

      applyDelete(toDelete);
    } catch (err) {
      setError(err.message);
    }
  };

  const applyDelete = (rowsToDelete) => {
    const ids = new Set(rowsToDelete.map((r) => r.id));
    setData((prev) => prev.filter((row) => !ids.has(row.id)));
    setInfo(`Удалено записей: ${rowsToDelete.length}`);
    setPendingDelete(null);
  };

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setQuery(ex.sql);
  };

  const statsItems = useMemo(() => [{label: 'Записей', value: data.length}], [data.length]);

  return (
    <SqlTrainerCard
      accent="delete"
      command="DELETE"
      title="Удаление данных"
      subtitle="Удаляйте строки только с WHERE. При удалении более одной записи — подтверждение."
      stats={
        <SqlStatsBar
          items={statsItems}
          actions={
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
              Сбросить
            </button>
          }
        />
      }
      footer={
        <>
          Удалённые строки не восстанавливаются, кроме кнопки "Сбросить". DELETE без WHERE заблокирован.
        </>
      }
    >
      <SqlExampleChips examples={EXAMPLES} activeId={activeExample} onSelect={loadExample} />

      <SqlQueryEditor
        id="sql-delete-query"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveExample(null);
        }}
        onExecute={previewDelete}
        placeholder={DEFAULT_QUERY}
      />

      <SqlToolbar
        onExecute={() => previewDelete()}
        executeLabel="Выполнить DELETE"
        onReset={reset}
        extra={
          <span className="it-demo__badge" style={{color: 'var(--demo-error)'}}>
            Требуется WHERE
          </span>
        }
      />

      {pendingDelete && (
        <SqlConfirmDialog
          query={pendingDelete.sql}
          count={pendingDelete.rows.length}
          onConfirm={() => applyDelete(pendingDelete.rows)}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}
      {warning && <div className="it-demo__alert it-demo__alert--warning">{warning}</div>}
      {info && <div className="it-demo__alert it-demo__alert--success">{info}</div>}

      <SqlDataTable
        caption="Таблица users"
        columns={USER_COLUMNS}
        rows={data}
        emptyMessage="Таблица пуста. Нажмите &quot;Сбросить&quot;, чтобы восстановить учебные данные."
      />
    </SqlTrainerCard>
  );
}

export default function SqlDeleteTrainer() {
  return (
    <SqlBrowserOnly>
      <SqlDeleteTrainerInner />
    </SqlBrowserOnly>
  );
}
