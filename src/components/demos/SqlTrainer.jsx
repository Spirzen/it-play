import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import SpirzenOnlineToolLink from '@/components/demos/SpirzenOnlineToolLink';
import {createShopDatabase, executeSql} from '@/components/shared/kb/sqlTrainerEngine';
import {TABLE_META} from '@/components/shared/kb/sqlShopSchema';
import {
  SqlBrowserOnly,
  SqlDataTable,
  SqlExampleChips,
  SqlQueryEditor,
  SqlResultTable,
  SqlStatsBar,
  SqlToolbar,
  SqlTrainerCard,
} from '@/components/shared/kb/sqlTrainerDemo';
import styles from '@/components/shared/kb/sqlTrainerDemo.module.css';

const EXAMPLE_GROUPS = [
  {
    id: 'select',
    label: 'SELECT',
    examples: [
      {id: 'users_all', label: 'users *', sql: 'SELECT * FROM users'},
      {
        id: 'users_filter',
        label: 'Фильтр',
        sql: "SELECT name, city, salary FROM users WHERE city = 'Москва' OR salary > 65000",
      },
      {
        id: 'products',
        label: 'Товары',
        sql: 'SELECT name, price, category FROM products WHERE price BETWEEN 200 AND 1000 ORDER BY price DESC',
      },
      {
        id: 'null_email',
        label: 'IS NULL',
        sql: 'SELECT full_name, email FROM customers WHERE email IS NULL',
      },
    ],
  },
  {
    id: 'join',
    label: 'JOIN',
    examples: [
      {
        id: 'cust_orders',
        label: 'Клиенты',
        sql: `SELECT c.full_name, o.order_date, o.status
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.order_date`,
      },
      {
        id: 'order_lines',
        label: '4 таблицы',
        sql: `SELECT c.full_name, p.name, oi.quantity, oi.unit_price
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id`,
      },
      {
        id: 'left_cities',
        label: 'LEFT',
        sql: 'SELECT u.name, c.name AS city FROM users u LEFT JOIN cities c ON u.city_id = c.id',
      },
    ],
  },
  {
    id: 'agg',
    label: 'GROUP BY',
    examples: [
      {
        id: 'by_category',
        label: 'Категории',
        sql: `SELECT category, COUNT(*) AS cnt, AVG(price) AS avg_price
FROM products
GROUP BY category
HAVING COUNT(*) >= 1
ORDER BY avg_price DESC`,
      },
      {
        id: 'orders_sum',
        label: 'Позиции заказа',
        sql: `SELECT o.order_id, SUM(oi.quantity) AS qty_sum
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id
ORDER BY qty_sum DESC`,
      },
      {
        id: 'city_cnt',
        label: 'Города',
        sql: 'SELECT city, COUNT(*) AS cnt FROM customers GROUP BY city ORDER BY cnt DESC',
      },
    ],
  },
  {
    id: 'dml',
    label: 'DML',
    examples: [
      {
        id: 'ins',
        label: 'INSERT',
        sql: "INSERT INTO products (name, price, category, stock_qty) VALUES ('Наушники', 2499, 'Аксессуары', 10)",
      },
      {
        id: 'upd',
        label: 'UPDATE',
        sql: "UPDATE products SET stock_qty = 20 WHERE category = 'Книги'",
      },
      {
        id: 'del',
        label: 'DELETE',
        sql: "DELETE FROM orders WHERE status = 'new'",
      },
    ],
  },
  {
    id: 'union',
    label: 'UNION',
    examples: [
      {
        id: 'union_cities',
        label: 'Города',
        sql: `SELECT city AS place FROM customers
UNION
SELECT city AS place FROM users`,
      },
    ],
  },
];

const FLAT_EXAMPLES = EXAMPLE_GROUPS.flatMap((g) =>
  g.examples.map((ex) => ({...ex, group: g.id})),
);

const SCHEMA_TABS = Object.values(TABLE_META).map((meta) => ({
  id: meta.label,
  label: meta.label,
  columns: meta.columns,
}));

function SqlTrainerInner() {
  const [db, setDb] = useState(() => createShopDatabase());
  const [query, setQuery] = useState(FLAT_EXAMPLES[0].sql);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);
  const [activeExample, setActiveExample] = useState('users_all');
  const [activeGroup, setActiveGroup] = useState('select');
  const [schemaTab, setSchemaTab] = useState('customers');
  const [showSchema, setShowSchema] = useState(true);

  const tableStats = useMemo(() => {
    return SCHEMA_TABS.map((t) => ({
      label: t.label,
      value: (db[t.id] || []).length,
    }));
  }, [db]);

  const runQuery = useCallback(
    (sql = query) => {
      setError(null);
      setResult(null);
      setFeedback(null);
      const started = performance.now();
      try {
        const out = executeSql(sql, db);
        const ms = Math.round(performance.now() - started);
        if (out.kind === 'select') {
          setResult({columns: out.columns, rows: out.rows, ms, meta: out.meta});
          setFeedback(`SELECT: ${out.rows.length} строк за ${ms} мс`);
        } else {
          setDb(out.db);
          setFeedback(`${out.message} (${ms} мс)`);
        }
      } catch (err) {
        setError(err.message);
      }
    },
    [query, db],
  );

  const resetDb = () => {
    setDb(createShopDatabase());
    setResult(null);
    setFeedback(null);
    setError(null);
    setActiveExample(null);
  };

  const loadExample = (ex) => {
    setActiveExample(ex.id);
    setActiveGroup(ex.group || 'select');
    setQuery(ex.sql);
    runQuery(ex.sql);
  };

  const activeGroupExamples =
    EXAMPLE_GROUPS.find((g) => g.id === activeGroup)?.examples ?? FLAT_EXAMPLES;

  const schemaData = db[schemaTab] || [];

  return (
    <SqlTrainerCard
      accent="select"
      command="SQL"
      title="SQL-тренажёр"
      subtitle="Интерактивная учебная БД: customers, products, orders, order_items и users. SELECT, JOIN, GROUP BY, DML."
      stats={
        <SqlStatsBar
          items={[
            ...tableStats,
            ...(result
              ? [{label: 'Результат', value: result.rows.length, highlight: true}]
              : []),
          ]}
        />
      }
      footer={
        <>
          Поддерживаются: <code>SELECT</code> (WHERE, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT,
          DISTINCT, UNION), <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>.
          Синтаксис близок к PostgreSQL; выполнение локальное в браузере.
          <SpirzenOnlineToolLink toolId="sqlGenerator" />
        </>
      }
    >
      <div className={styles.schemaTabs}>
        {EXAMPLE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={clsx(styles.schemaTab, activeGroup === g.id && styles.schemaTabActive)}
            onClick={() => setActiveGroup(g.id)}
          >
            {g.label}
          </button>
        ))}
        <button
          type="button"
          className={clsx(styles.schemaTab, showSchema && styles.schemaTabActive)}
          onClick={() => setShowSchema((v) => !v)}
          style={{marginLeft: 'auto'}}
        >
          {showSchema ? 'Скрыть схему' : 'Схема БД'}
        </button>
      </div>

      <SqlExampleChips
        examples={activeGroupExamples}
        activeId={activeExample}
        onSelect={loadExample}
      />

      {showSchema && (
        <div className={styles.schemaPanel}>
          <div className={styles.schemaTabs}>
            {SCHEMA_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className={clsx(styles.schemaTab, schemaTab === t.id && styles.schemaTabActive)}
                onClick={() => setSchemaTab(t.id)}
              >
                {t.label} ({(db[t.id] || []).length})
              </button>
            ))}
          </div>
          <p className={styles.hint} style={{margin: '0.35rem 0'}}>
            {TABLE_META[schemaTab]?.description}
          </p>
          <SqlDataTable
            caption={`Таблица ${schemaTab}`}
            columns={SCHEMA_TABS.find((t) => t.id === schemaTab)?.columns ?? []}
            rows={schemaData}
            emptyMessage="Таблица пуста."
          />
        </div>
      )}

      <SqlQueryEditor
        id="sql-trainer-query"
        label="SQL-запрос"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveExample(null);
        }}
        onExecute={runQuery}
        rows={6}
        placeholder={`SELECT c.full_name, p.name
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
WHERE o.status = 'completed'`}
      />

      <SqlToolbar
        onExecute={runQuery}
        executeLabel="Выполнить"
        onReset={resetDb}
        resetLabel="Сбросить БД"
      />

      {error && <div className="it-demo__alert it-demo__alert--error">{error}</div>}

      {feedback && !error && (
        <div className="it-demo__alert it-demo__alert--success" style={{marginTop: '0.5rem'}}>
          {feedback}
        </div>
      )}

      {result && <SqlResultTable columns={result.columns} rows={result.rows} />}
    </SqlTrainerCard>
  );
}

export default function SqlTrainer() {
  return (
    <SqlBrowserOnly>
      <SqlTrainerInner />
    </SqlBrowserOnly>
  );
}
