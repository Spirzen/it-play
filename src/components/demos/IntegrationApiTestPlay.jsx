import React, {useState} from 'react';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  integrationGetUser,
  integrationPostUser,
  integrationReset,
} from '@/components/shared/kb/testingPlayEngines';
import styles from '@/components/shared/kb/testingDemo.module.css';

function IntegrationApiTestPlayInner() {
  const [name, setName] = useState('Алексей Иванов');
  const [email, setEmail] = useState('alexey@example.com');
  const [lastId, setLastId] = useState(null);
  const [log, setLog] = useState([]);

  const push = (method, path, res) => {
    setLog((prev) => [
      {
        method,
        path,
        status: res.status,
        body: JSON.stringify(res.body, null, 2),
      },
      ...prev,
    ].slice(0, 5));
  };

  const post = () => {
    const res = integrationPostUser({name, email});
    if (res.status === 201) setLastId(res.body.id);
    push('POST', '/users/', res);
  };

  const get = () => {
    const id = lastId ?? 1;
    const res = integrationGetUser(id);
    push('GET', `/users/${id}`, res);
  };

  const reset = () => {
    integrationReset();
    setLastId(null);
    setLog([]);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Интеграция: клиент → API → БД"
        subtitle="Postman-сценарий без реального сервера — статусы 201, 200, 404, 409"
      >
        <div className={styles.lane}>
          <div className={styles.host}>
            <strong>Postman</strong>
            <span>клиент</span>
          </div>
          <div className={styles.track}>
            <div className={styles.pipeline}>
              <span className={styles.pipeNode}>FastAPI</span>
              <span className={styles.pipeArrow}>→</span>
              <span className={styles.pipeNode}>PostgreSQL</span>
            </div>
          </div>
          <div className={styles.host}>
            <strong>JSON</strong>
            <span>ответ</span>
          </div>
        </div>

        <div className={styles.form}>
          <div className={styles.formField}>
            <label htmlFor="int-name">name</label>
            <input id="int-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.formField}>
            <label htmlFor="int-email">email</label>
            <input id="int-email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={post}>
            POST /users/
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={get}>
            GET /users/{lastId ?? '{id}'}
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={reset}>
            TRUNCATE + сброс
          </button>
        </div>

        {log.map((entry, i) => (
          <div key={i} className={styles.detailBox}>
            <span className={entry.status < 400 ? styles.badgeOk : styles.badgeErr}>
              {entry.status}
            </span>{' '}
            <strong>
              {entry.method} {entry.path}
            </strong>
            <pre className={styles.codeBlock} style={{marginTop: '0.35rem'}}>
              {entry.body}
            </pre>
          </div>
        ))}
        {log.length === 0 && (
          <p className={styles.cardHint}>Создайте пользователя, затем прочитайте по id. Повторите POST с тем же email — увидите 409.</p>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default IntegrationApiTestPlayInner;
