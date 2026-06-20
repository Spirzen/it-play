import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CdBtn,
  CdHint,
  CdMethodBadge,
  CdMono,
  CdStack,
  CdTextarea,
  CdToolbar,
  CdVerdict,
} from '@/components/shared/kb/codeDevPlayKit';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/CodeDevNewPlays.module.css';

const MOCK_DB = [
  {id: 1, title: 'Купить молоко', done: false},
  {id: 2, title: 'Написать отчёт', done: true},
  {id: 3, title: 'Позвонить клиенту', done: false},
];

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

function HttpCrudPlayInner() {
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/api/tasks');
  const [body, setBody] = useState('{"title":"Новая задача"}');
  const [log, setLog] = useState(null);

  const send = () => {
    let status = 200;
    let response = '';
    const idMatch = path.match(/\/(\d+)$/);
    const id = idMatch ? Number(idMatch[1]) : null;

    try {
      if (method === 'GET' && path === '/api/tasks') {
        response = JSON.stringify(MOCK_DB, null, 2);
      } else if (method === 'GET' && id) {
        const item = MOCK_DB.find((t) => t.id === id);
        status = item ? 200 : 404;
        response = item ? JSON.stringify(item, null, 2) : '{"error":"Not found"}';
      } else if (method === 'POST' && path === '/api/tasks') {
        response = JSON.stringify({id: 4, ...JSON.parse(body || '{}'), done: false}, null, 2);
        status = 201;
      } else if (method === 'PUT' && id) {
        response = JSON.stringify({id, ...JSON.parse(body || '{}')}, null, 2);
      } else if (method === 'DELETE' && id) {
        status = 204;
        response = '(пустое тело — 204 No Content)';
      } else {
        status = 404;
        response = '{"error":"Unknown route"}';
      }
    } catch {
      status = 400;
      response = '{"error":"Invalid JSON body"}';
    }

    setLog({method, path, status, response});
  };

  return (
    <DemoShell>
      <DemoCard title="REST CRUD — мини API" subtitle="Метод HTTP + путь → статус и JSON-ответ">
        <CdStack>
          <div className={toolStyles.chips}>
            {METHODS.map((m) => (
              <button
                key={m}
                type="button"
                className={clsx(toolStyles.chip, method === m && toolStyles.chipActive)}
                onClick={() => setMethod(m)}
              >
                {m}
              </button>
            ))}
          </div>

          <CdToolbar>
            <CdMethodBadge method={method} />
            <input value={path} onChange={(e) => setPath(e.target.value)} className={styles.input} style={{flex: 1, minWidth: 0}} aria-label="URL" />
            <CdBtn variant="primary" onClick={send}>
              Отправить
            </CdBtn>
          </CdToolbar>

          {(method === 'POST' || method === 'PUT') && (
            <CdTextarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} aria-label="JSON body" />
          )}

          {log ? (
            <>
              <CdVerdict tone={log.status < 400 ? 'success' : 'danger'}>
                <strong>
                  {log.method} {log.path}
                </strong>{' '}
                → HTTP {log.status}
              </CdVerdict>
              <CdMono>{log.response}</CdMono>
            </>
          ) : (
            <CdHint>Выберите метод и нажмите «Отправить». Попробуйте GET /api/tasks/2 или POST /api/tasks.</CdHint>
          )}
        </CdStack>
      </DemoCard>
    </DemoShell>
  );
}

export default HttpCrudPlayInner;
