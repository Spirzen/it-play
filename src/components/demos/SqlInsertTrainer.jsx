import React, {useState} from 'react';
import {INITIAL_USERS, USER_COLUMNS, parseSqlLiteral, validateUserField} from '@/components/shared/kb/sqlEngine';
import {
  SqlBrowserOnly,
  SqlDataTable,
  SqlExampleChips,
  SqlQueryEditor,
  SqlStatsBar,
  SqlToolbar,
  SqlTrainerCard,
} from '@/components/shared/kb/sqlTrainerDemo';

const DEFAULT_QUERY =
  "INSERT INTO users (name, age, city, salary) VALUES ('Анна', 27, 'Казань', 48000)";

const EXAMPLES = [
  {id: 'anna', label: 'Анна', sql: DEFAULT_QUERY},
  {
    id: 'oleg',
    label: 'Олег',
    sql: "INSERT INTO users (name, age, city, salary) VALUES ('Олег', 32, 'Сочи', 52000)",
  },
  {
    id: 'tanya',
    label: 'Татьяна',
    sql: "INSERT INTO users (name, age, city, salary) VALUES ('Татьяна', 29, 'Нижний Новгород', 61000)",
  },
];

function parseInsertQuery(sql) {
  const insertRegex = /INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i;
  const match = sql.match(insertRegex);

  if (!match) {
    throw new Error(
      'Неверный синтаксис INSERT. Используйте: INSERT INTO table (col1, col2) VALUES (val1, val2)',
    );
  }

  const [, tableName, columnsStr, valuesStr] = match;

  if (tableName.toLowerCase() !== 'users') {
    throw new Error('В тренажёре доступна только таблица users');
  }

  const columns = columnsStr.split(',').map((col) => col.trim().toLowerCase());
  const values = [];
  let currentValue = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < valuesStr.length; i += 1) {
    const char = valuesStr[i];

    if ((char === "'" || char === '"') && valuesStr[i - 1] !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
        currentValue += char;
      } else if (char === quoteChar) {
        inQuotes = false;
        currentValue += char;
      } else {
        currentValue += char;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  if (currentValue) {
    values.push(currentValue.trim());
  }

  if (columns.length !== values.length) {
    throw new Error(
      `Количество колонок (${columns.length}) не совпадает с количеством значений (${values.length})`,
    );
  }

  const row = {};
  for (let i = 0; i < columns.length; i += 1) {
    const column = columns[i];
    const value = parseSqlLiteral(values[i]);

    if (column === 'id') {
      throw new Error('ID назначается автоматически — не указывайте его в INSERT');
    }

    validateUserField(column, value);
    row[column] = value;
  }

  for (const col of ['name', 'age', 'city', 'salary']) {
    if (!(col in row)) {
      throw new Error(`Обязательное поле "${col}" отсутствует в запросе`);
    }
  }

  return row;
}

function SqlInsertTrainerInner() {
  const [data, setData] = useState(INITIAL_USERS);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastInsertId, setLastInsertId] = useState(null);
  const [activeExample, setActiveExample] = useState('anna');
  const [highlightIds, setHighlightIds] = useState(() => new Set());

  const reset = () => {
    setData(INITIAL_USERS);
    setQuery(DEFAULT_QUERY);
    setError(null);
    setSuccess(null);
    setLastInsertId(null);
    setHighlightIds(new Set());
    setActiveExample('anna');
  };

  const executeInsert = (sql = query) => {
    setError(null);
    setSuccess(null);
    setHighlightIds(new Set());

    if (!sql.trim().toUpperCase().startsWith('INSERT')) {
      setError('Ожидается команда INSERT.');
      return;
    }

    try {
      const newRow = parseInsertQuery(sql);
      const newId = data.length > 0 ? Math.max(...data.map((r) => r.id)) + 1 : 1;
      newRow.id = newId;

      setData((prev) => [...prev, newRow]);
      setLastInsertId(newId);
      setHighlightIds(new Set([newId]));
      setSuccess(`Запись добавлена (id = ${newId})`);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setQuery(ex.sql);
  };

  return (
    <SqlTrainerCard
      accent="insert"
      command="INSERT"
      title="Добавление записей"
      subtitle="Добавляйте строки в users. Поле id генерируется автоматически."
      stats={
        <SqlStatsBar
          items={[
            {label: 'Записей', value: data.length},
            ...(lastInsertId
              ? [{label: 'Последний id', value: lastInsertId, highlight: true}]
              : []),
          ]}
          actions={
            <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={reset}>
              Сбросить
            </button>
          }
        />
      }
      footer={
        <>
          Обязательные поля: name, age, city, salary. ID в запрос не включайте.
        </>
      }
    >
      <SqlExampleChips examples={EXAMPLES} activeId={activeExample} onSelect={loadExample} />

      <SqlQueryEditor
        id="sql-insert-query"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveExample(null);
        }}
        onExecute={executeInsert}
        placeholder={DEFAULT_QUERY}
      />

      <SqlToolbar onExecute={() => executeInsert()} executeLabel="Выполнить INSERT" onReset={reset} />

      {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}
      {success && <div className="it-demo__alert it-demo__alert--success">{success}</div>}

      <SqlDataTable
        caption="Таблица users"
        columns={USER_COLUMNS}
        rows={data}
        highlightIds={highlightIds}
        emptyMessage="Таблица пуста — добавьте первую запись через INSERT."
      />
    </SqlTrainerCard>
  );
}

export default function SqlInsertTrainer() {
  return (
    <SqlBrowserOnly>
      <SqlInsertTrainerInner />
    </SqlBrowserOnly>
  );
}
