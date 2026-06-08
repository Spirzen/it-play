import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './dataToolsPlays.module.css';

const MODELS = [
  {
    id: 'document',
    label: 'Документная',
    icon: '{ }',
    sample: `{
  "_id": "ord-42",
  "customer": { "name": "Анна" },
  "items": [
    { "sku": "KB-01", "qty": 2 }
  ],
  "tags": ["b2c", "express"]
}`,
    query: 'db.orders.find({ "tags": "express" })',
    engines: 'MongoDB, CouchDB, RavenDB',
    tradeoff: 'Гибкая схема по документу; сложнее нормализованные связи many-to-many.',
  },
  {
    id: 'kv',
    label: 'Ключ–значение',
    icon: 'K→V',
    sample: `session:abc123 → {
  "user_id": 1001,
  "cart_items": 3,
  "ttl": 3600
}

rate:ip:203.0.113.8 → 42`,
    query: 'GET session:abc123\nHGETALL employee:1001',
    engines: 'Redis, DynamoDB, etcd',
    tradeoff: 'Микросекунды доступа; нет произвольных JOIN по полям значения.',
  },
  {
    id: 'column',
    label: 'Колоночная',
    icon: '▥▥',
    sample: `PARTITION (user_id=42)
  event_time | event_type | meta
  09:01:02   | login      | web
  09:01:15   | purchase   | mobile`,
    query: 'SELECT * FROM events WHERE user_id = 42 AND event_time > ?',
    engines: 'Cassandra, HBase, ScyllaDB',
    tradeoff: 'Линейное масштабирование записи; проектируйте таблицы под запросы.',
  },
  {
    id: 'graph',
    label: 'Графовая',
    icon: '○—○',
    sample: `(User:Anna)-[:FOLLOWS]->(User:Ivan)
(User:Anna)-[:BOUGHT]->(Product:KB-01)
(Product:KB-01)-[:IN_CATEGORY]->(Cat:Peripherals)`,
    query: 'MATCH (u:User)-[:FOLLOWS*1..2]->(friend) RETURN friend',
    engines: 'Neo4j, ArangoDB',
    tradeoff: 'Обход связей за O(1) на ребро; избыточна для плоских отчётов.',
  },
];

function NoSqlModelsPlayInner() {
  const [active, setActive] = useState('document');
  const m = MODELS.find((x) => x.id === active) ?? MODELS[0];

  return (
    <DemoShell>
      <DemoCard
        title="Четыре модели NoSQL"
        subtitle="Одни и те же бизнес-данные по-разному ложатся в хранилище — сравните представление и запрос"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem'}}>
          {MODELS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => setActive(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        <div className={styles.splitPanels}>
          <pre className={styles.codePane}>{m.sample}</pre>
          <div>
            <p className="it-demo__label">Типичный запрос</p>
            <pre className={styles.queryBox}>{m.query}</pre>
            <p className={styles.metaLine}>
              <strong>Движки:</strong> {m.engines}
            </p>
            <p className={styles.metaLine}>{m.tradeoff}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default NoSqlModelsPlayInner;
