import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './dataToolsPlays.module.css';

const FAMILIES = [
  {
    id: 'relational',
    label: 'Реляционные',
    tag: 'SQL · ACID',
    examples: ['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'],
    fit: 'Транзакции, отчёты, строгая схема, JOIN между таблицами.',
    avoid: 'Горизонтальное масштабирование записи на петабайтах без шардинга.',
  },
  {
    id: 'document',
    label: 'Документные',
    tag: 'JSON/BSON',
    examples: ['MongoDB', 'CouchDB', 'Couchbase'],
    fit: 'Каталоги, CMS, профили с разной структурой полей.',
    avoid: 'Сложные многосторонние связи без денормализации.',
  },
  {
    id: 'kv',
    label: 'Ключ–значение',
    tag: 'In-memory',
    examples: ['Redis', 'DynamoDB', 'etcd'],
    fit: 'Кэш, сессии, очереди, rate limit, feature flags.',
    avoid: 'Аналитика по произвольным полям без вторичных индексов.',
  },
  {
    id: 'column',
    label: 'Колоночные',
    tag: 'Wide-column',
    examples: ['Cassandra', 'HBase', 'ClickHouse'],
    fit: 'Логи, телеметрия, OLAP, write-heavy потоки.',
    avoid: 'Частые UPDATE одной строки и ad-hoc JOIN.',
  },
  {
    id: 'graph',
    label: 'Графовые',
    tag: 'Узлы и рёбра',
    examples: ['Neo4j', 'ArangoDB (граф)'],
    fit: 'Соцсети, рекомендации, фрод, знаниевые графы.',
    avoid: 'Простые табличные отчёты — SQL проще.',
  },
  {
    id: 'embedded',
    label: 'Встраиваемые / OLAP',
    tag: 'Файл · аналитика',
    examples: ['SQLite', 'DuckDB', 'Realm'],
    fit: 'Прототипы, edge, локальная аналитика Parquet/CSV.',
    avoid: 'Многопользовательская запись с высокой конкуренцией.',
  },
];

function DbmsLandscapePlayInner() {
  const [active, setActive] = useState('relational');
  const f = FAMILIES.find((x) => x.id === active) ?? FAMILIES[0];

  return (
    <DemoShell>
      <DemoCard
        title="Ландшафт СУБД"
        subtitle="Выберите семейство — увидите типичные продукты и сценарии применения"
      >
        <div className={toolStyles.chips} style={{marginBottom: '0.75rem', flexWrap: 'wrap'}}>
          {FAMILIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(toolStyles.chip, active === item.id && toolStyles.chipActive)}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className={styles.lead}>
          <strong>{f.label}</strong> · {f.tag}
        </p>
        <div className={styles.exampleRow}>
          {f.examples.map((name) => (
            <span key={name} className={styles.pill}>
              {name}
            </span>
          ))}
        </div>
        <div className={styles.twoCol}>
          <div className={styles.noteGood}>
            <strong>Когда уместно</strong>
            <p>{f.fit}</p>
          </div>
          <div className={styles.noteWarn}>
            <strong>Осторожно</strong>
            <p>{f.avoid}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DbmsLandscapePlayInner;
