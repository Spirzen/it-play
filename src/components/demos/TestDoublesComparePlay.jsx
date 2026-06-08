import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {TEST_DOUBLES} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

const FAKE_DB = {1: {name: 'Alice'}};

function TestDoublesComparePlayInner() {
  const [kind, setKind] = useState('stub');
  const [log, setLog] = useState([]);

  const run = () => {
    const lines = [];
    const fetchUser = (id) => {
      if (kind === 'stub') return {name: 'Bob'};
      if (kind === 'fake') return FAKE_DB[id] ?? null;
      return {name: 'Bob'};
    };
    const name = fetchUser(1)?.name ?? '—';
    lines.push(`get_user_data(1) → "${name}"`);
    if (kind === 'mock') lines.push('mock.fetch_user.assert_called_once_with(1) ✓');
    if (kind === 'fake') lines.push('fake DB: insert/select в памяти');
    setLog(lines);
  };

  const d = TEST_DOUBLES.find((x) => x.id === kind) ?? TEST_DOUBLES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Stub, Mock, Fake" subtitle="Один вызов get_user_data — разное поведение дублёра">
        <div className={styles.grid3}>
          {TEST_DOUBLES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.card, kind === t.id && styles.cardActive)}
              onClick={() => {
                setKind(t.id);
                setLog([]);
              }}
            >
              <span className={styles.cardLabel}>{t.label}</span>
              <p className={styles.cardHint}>{t.role}</p>
            </button>
          ))}
        </div>
        <div className={styles.detailBox}>
          <p>{d.demo}</p>
          <p className={styles.cardHint}>Проверка вызовов: {d.checksCalls ? 'да' : 'нет'}</p>
        </div>
        <div className={styles.terminal}>{log.length ? log.join('\n') : '$ pytest test_user_service.py'}</div>
        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={run}>
          Выполнить тест с {d.label}
        </button>
      </DemoCard>
    </DemoShell>
  );
}

export default TestDoublesComparePlayInner;
