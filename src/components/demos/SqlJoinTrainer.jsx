import React, {useState} from 'react';
import clsx from 'clsx';
import {
  JOIN_CITIES,
  JOIN_ORDERS,
  JOIN_USERS,
  executeJoin,
} from '@/components/shared/kb/sqlEngine';
import styles from '@/components/shared/kb/sqlTrainerDemo.module.css';
import {
  SqlBrowserOnly,
  SqlExampleChips,
  SqlQueryEditor,
  SqlResultTable,
  SqlToolbar,
  SqlTrainerCard,
} from '@/components/shared/kb/sqlTrainerDemo';

const DEFAULT_QUERY =
  'SELECT u.name, c.name AS city FROM users u INNER JOIN cities c ON u.city_id = c.id';

const EXAMPLES = [
  {
    id: 'inner',
    label: 'INNER',
    sql: DEFAULT_QUERY,
  },
  {
    id: 'left',
    label: 'LEFT',
    sql: 'SELECT u.name, c.name AS city FROM users u LEFT JOIN cities c ON u.city_id = c.id',
  },
  {
    id: 'right',
    label: 'RIGHT',
    sql: 'SELECT u.name, c.name AS city FROM users u RIGHT JOIN cities c ON u.city_id = c.id',
  },
  {
    id: 'full',
    label: 'FULL',
    sql: 'SELECT u.name, c.name AS city FROM users u FULL OUTER JOIN cities c ON u.city_id = c.id',
  },
  {
    id: 'cross',
    label: 'CROSS',
    sql: 'SELECT u.name, c.name AS city FROM users u CROSS JOIN cities c',
  },
  {
    id: 'orders',
    label: '+ orders',
    sql: 'SELECT u.name, o.product, o.amount FROM users u INNER JOIN orders o ON u.id = o.user_id',
  },
];

const SCHEMA_TABS = [
  {id: 'users', label: 'users', data: JOIN_USERS, columns: ['id', 'name', 'age', 'city_id', 'salary']},
  {id: 'cities', label: 'cities', data: JOIN_CITIES, columns: ['id', 'name', 'population', 'region']},
  {id: 'orders', label: 'orders', data: JOIN_ORDERS, columns: ['id', 'user_id', 'product', 'amount', 'date']},
];

function SchemaTable({tab}) {
  return (
    <div className="it-demo__table-wrap">
      <table className="it-demo__table">
        <thead>
          <tr>
            {tab.columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tab.data.map((row) => (
            <tr key={row.id} className={row.city_id === null ? styles.rowHighlight : undefined}>
              {tab.columns.map((col) => (
                <td key={col}>
                  {row[col] === null || row[col] === undefined ? (
                    <span className={styles.nullCell}>NULL</span>
                  ) : (
                    String(row[col])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SqlJoinTrainerInner() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState(null);
  const [activeExample, setActiveExample] = useState('inner');
  const [schemaTab, setSchemaTab] = useState('users');

  const runQuery = (sql = query) => {
    setError(null);
    setResult(null);
    setMeta(null);

    try {
      const out = executeJoin(sql);
      setResult({columns: out.columns, rows: out.rows});
      setMeta(out.meta);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setQuery(ex.sql);
    runQuery(ex.sql);
  };

  const activeSchema = SCHEMA_TABS.find((t) => t.id === schemaTab) ?? SCHEMA_TABS[0];

  return (
    <SqlTrainerCard
      accent="join"
      command="JOIN"
      title="Объединение таблиц"
      subtitle="INNER, LEFT, RIGHT, FULL OUTER и CROSS JOIN на учебных таблицах users, cities, orders."
      footer={
        <div className={styles.joinSchema}>
          <strong>users ⟷ cities (по city_id):</strong> INNER — 6 строк (без Ольги); LEFT — 7 (NULL у
          Ольги); RIGHT — 5 (Казань без user); FULL — 8; CROSS — 35.
        </div>
      }
    >
      <div className="it-demo__tabs" role="tablist" aria-label="Схема данных">
        {SCHEMA_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={schemaTab === tab.id}
            className={clsx('it-demo__tab', schemaTab === tab.id && 'it-demo__tab--active')}
            onClick={() => setSchemaTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className={styles.hint} style={{marginTop: 0}}>
        {schemaTab === 'users' && 'У Ольги (id=6) city_id = NULL.'}
        {schemaTab === 'cities' && 'У Казани (id=5) нет пользователей в users.'}
        {schemaTab === 'orders' && 'user_id ссылается на users.id.'}
      </p>

      <SchemaTable tab={activeSchema} />

      <SqlExampleChips examples={EXAMPLES} activeId={activeExample} onSelect={loadExample} />

      <SqlQueryEditor
        id="sql-join-query"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveExample(null);
        }}
        onExecute={runQuery}
        placeholder={DEFAULT_QUERY}
        rows={3}
      />

      <SqlToolbar onExecute={runQuery} executeLabel="Выполнить JOIN" />

      {meta && (
        <div className="it-demo__alert it-demo__alert--info">
          <strong>{meta.type}</strong>: {meta.mainTable} ({meta.mainAlias}) ⟷ {meta.joinTable} (
          {meta.joinAlias})
          {result && ` — ${result.rows.length} строк`}
        </div>
      )}

      {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

      {result ? (
        <SqlResultTable columns={result.columns} rows={result.rows} />
      ) : (
        !error && (
          <p className="it-demo__alert it-demo__alert--info">
            Выберите тип JOIN или введите запрос — результат появится ниже.
          </p>
        )
      )}
    </SqlTrainerCard>
  );
}

export default function SqlJoinTrainer() {
  return (
    <SqlBrowserOnly>
      <SqlJoinTrainerInner />
    </SqlBrowserOnly>
  );
}
