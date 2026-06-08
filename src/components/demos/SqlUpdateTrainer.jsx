import React, {useMemo, useState} from 'react';
import {
  INITIAL_USERS,
  USER_COLUMNS,
  USER_EDITABLE_COLUMNS,
  matchesConditions,
  parseSetClause,
  parseWhereClause,
  validateUserField,
} from '@/components/shared/kb/sqlEngine';
import {
  SqlBrowserOnly,
  SqlDataTable,
  SqlExampleChips,
  SqlQueryEditor,
  SqlStatsBar,
  SqlToolbar,
  SqlTrainerCard,
} from '@/components/shared/kb/sqlTrainerDemo';

const DEFAULT_QUERY = "UPDATE users SET salary = 75000 WHERE name = 'Дмитрий'";

const EXAMPLES = [
  {id: 'salary', label: 'Зарплата', sql: DEFAULT_QUERY},
  {
    id: 'age',
    label: 'Возраст',
    sql: "UPDATE users SET age = 26, city = 'Москва' WHERE name = 'Алексей'",
  },
  {
    id: 'city',
    label: 'Город',
    sql: "UPDATE users SET city = 'Казань' WHERE name = 'Мария'",
  },
];

function SqlUpdateTrainerInner() {
  const [data, setData] = useState(INITIAL_USERS);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [warning, setWarning] = useState(null);
  const [activeExample, setActiveExample] = useState('salary');
  const [highlightIds, setHighlightIds] = useState(() => new Set());

  const reset = () => {
    setData(INITIAL_USERS);
    setQuery(DEFAULT_QUERY);
    setError(null);
    setInfo(null);
    setWarning(null);
    setHighlightIds(new Set());
    setActiveExample('salary');
  };

  const executeUpdate = (sql = query) => {
    setError(null);
    setInfo(null);
    setWarning(null);
    setHighlightIds(new Set());

    const trimmed = sql.trim();
    if (!trimmed.toUpperCase().startsWith('UPDATE')) {
      setError('Ожидается команда UPDATE.');
      return;
    }

    try {
      const tableMatch = trimmed.match(/UPDATE\s+(\w+)/i);
      if (!tableMatch) {
        throw new Error('Не указано имя таблицы');
      }
      if (tableMatch[1].toLowerCase() !== 'users') {
        throw new Error('В тренажёре доступна только таблица users');
      }

      const setMatch = trimmed.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
      if (!setMatch) {
        throw new Error('Не указана секция SET');
      }

      const updates = parseSetClause(setMatch[1]);

      for (const col of Object.keys(updates)) {
        if (!USER_EDITABLE_COLUMNS.includes(col)) {
          if (col === 'id') {
            throw new Error('Нельзя изменять поле id');
          }
          throw new Error(
            `Колонка "${col}" недоступна. Доступны: ${USER_EDITABLE_COLUMNS.join(', ')}`,
          );
        }
        validateUserField(col, updates[col]);
      }

      let conditions = [];
      const whereMatch = trimmed.match(/WHERE\s+(.+)$/i);
      if (whereMatch) {
        conditions = parseWhereClause(whereMatch[1]);
      } else {
        setWarning('UPDATE без WHERE изменит все строки в таблице.');
      }

      const updatedIds = new Set();
      let count = 0;

      const newData = data.map((row) => {
        if (!matchesConditions(row, conditions)) {
          return row;
        }
        count += 1;
        updatedIds.add(row.id);
        return {...row, ...updates};
      });

      if (count === 0) {
        setWarning('UPDATE не затронул ни одной записи — проверьте условие WHERE.');
        return;
      }

      setData(newData);
      setHighlightIds(updatedIds);
      setInfo(`Обновлено записей: ${count}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setQuery(ex.sql);
  };

  const statsItems = useMemo(
    () => [
      {label: 'Записей', value: data.length},
      ...(highlightIds.size
        ? [{label: 'Изменено', value: highlightIds.size, highlight: true}]
        : []),
    ],
    [data.length, highlightIds.size],
  );

  return (
    <SqlTrainerCard
      accent="update"
      command="UPDATE"
      title="Изменение данных"
      subtitle="Меняйте поля через SET и ограничивайте выборку WHERE."
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
          Всегда проверяйте WHERE — без него обновятся все строки. Колонки: name, age, city, salary.
        </>
      }
    >
      <SqlExampleChips examples={EXAMPLES} activeId={activeExample} onSelect={loadExample} />

      <SqlQueryEditor
        id="sql-update-query"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveExample(null);
        }}
        onExecute={executeUpdate}
        placeholder={DEFAULT_QUERY}
      />

      <SqlToolbar onExecute={() => executeUpdate()} executeLabel="Выполнить UPDATE" onReset={reset} />

      {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}
      {warning && <div className="it-demo__alert it-demo__alert--warning">{warning}</div>}
      {info && <div className="it-demo__alert it-demo__alert--success">{info}</div>}

      <SqlDataTable
        caption="Таблица users"
        columns={USER_COLUMNS}
        rows={data}
        highlightIds={highlightIds}
      />
    </SqlTrainerCard>
  );
}

export default function SqlUpdateTrainer() {
  return (
    <SqlBrowserOnly>
      <SqlUpdateTrainerInner />
    </SqlBrowserOnly>
  );
}
