import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CdBtn,
  CdHint,
  CdMetric,
  CdMetricGrid,
  CdMono,
  CdStack,
  CdVerdict,
} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const USERS = 8;

function NPlusOneQueryPlayInner() {
  const [mode, setMode] = useState('bad');
  const [running, setRunning] = useState(false);
  const [roundTrips, setRoundTrips] = useState([]);

  const run = async () => {
    setRunning(true);
    setRoundTrips([]);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    if (mode === 'bad') {
      setRoundTrips(['SELECT * FROM users LIMIT 8']);
      await wait(450);
      for (let i = 1; i <= USERS; i += 1) {
        setRoundTrips((t) => [...t, `SELECT * FROM orders WHERE user_id = ${i}`]);
        await wait(320);
      }
    } else {
      setRoundTrips([
        'SELECT u.*, o.* FROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nLIMIT 8',
      ]);
      await wait(650);
    }
    setRunning(false);
  };

  return (
    <DemoShell>
      <DemoCard title="N+1 запросов ORM" subtitle="Сравните число round-trip к базе при lazy vs eager loading">
        <CdStack>
          <div className={toolStyles.chips}>
            <button type="button" className={clsx(toolStyles.chip, mode === 'bad' && toolStyles.chipActive)} onClick={() => setMode('bad')}>
              N+1 (lazy)
            </button>
            <button type="button" className={clsx(toolStyles.chip, mode === 'good' && toolStyles.chipActive)} onClick={() => setMode('good')}>
              Eager JOIN
            </button>
          </div>

          <CdBtn variant="primary" disabled={running} onClick={run}>
            {running ? 'Выполняется…' : `Загрузить ${USERS} пользователей с заказами`}
          </CdBtn>

          <CdMetricGrid>
            <CdMetric label="SQL-запросов" value={roundTrips.length || '—'} tone={mode === 'bad' && roundTrips.length > 3 ? 'danger' : 'success'} />
            <CdMetric label="Round-trip" value={roundTrips.length || '—'} hint="каждая строка = поход в БД" />
          </CdMetricGrid>

          <CdMono className={styles.queryLog}>
            {roundTrips.length
              ? roundTrips.map((q, i) => (
                  <div key={i} className={styles.queryLine}>
                    {q}
                  </div>
                ))
              : 'Нажмите «Загрузить»'}
          </CdMono>

          <CdVerdict tone={mode === 'bad' ? 'warning' : 'success'}>
            {mode === 'bad'
              ? 'Классическая ловушка ORM: 1 запрос за список + N за связанные сущности.'
              : 'Один JOIN — предсказуемая нагрузка и меньше latency.'}
          </CdVerdict>
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default NPlusOneQueryPlayInner;
