import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {CLUSTER_NODES, QUERY_SCENARIOS, simulateQuery} from '@/components/shared/kb/cassandraPartitionEngine';
import styles from '@/components/demos/CassandraPartitionPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

function CassandraPartitionPlayInner() {
  const [scenarioId, setScenarioId] = useState('by_user');
  const result = useMemo(() => simulateQuery(scenarioId), [scenarioId]);

  return (
    <DemoShell>
      <DemoCard
        title="Cassandra: partition key и запросы"
        subtitle="Проектируйте таблицы под запросы: эффективный путь затрагивает одну партицию на узле кластера"
      >
        <label className="it-demo__label">Сценарий CQL</label>
        <div className={toolStyles.chips} style={{marginBottom: '0.5rem'}}>
          {QUERY_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, scenarioId === s.id && toolStyles.chipActive)}
              onClick={() => setScenarioId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={styles.cqlBox}>{result.scenario.cql}</div>

        <div
          className={clsx(
            styles.planBanner,
            result.scenario.efficient ? styles.planGood : styles.planBad,
          )}
        >
          {result.scenario.efficient ? 'Одна партиция' : 'Полный обход кластера'} — {result.scenario.detail}
        </div>

        <div className={styles.ring}>
          {CLUSTER_NODES.map((n) => (
            <div
              key={n}
              className={clsx(styles.node, result.nodesHit.includes(n) && styles.nodeHit)}
            >
              <strong>{n}</strong>
              <div style={{fontSize: '0.72rem', marginTop: '0.2rem'}}>
                {result.nodesHit.includes(n) ? 'задействован' : 'idle'}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.stats}>
          <span>
            Партиций: <strong>{result.partitionsScanned}</strong>
          </span>
          <span>
            Строк: <strong>{result.rows.length}</strong>
          </span>
          <span>
            Координатор ~<strong>{result.coordinatorMs} мс</strong>
          </span>
        </div>

        <div className={styles.partitionBox}>
          {result.rows.map((r) => (
            <div key={`${r.user_id}-${r.event_time}`} className={styles.rowLine}>
              PK({r.user_id}) · CK({r.event_time}) → {r.event_type}
            </div>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default CassandraPartitionPlayInner;
