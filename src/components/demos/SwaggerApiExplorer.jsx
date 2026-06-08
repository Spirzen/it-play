import React, {useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from '@/components/demos/SwaggerApiExplorer.module.css';

const SPEC = {
  openapi: '3.0.3',
  info: {title: 'Shop API', version: '1.2.0', description: 'Демо OpenAPI для обучения'},
  servers: [{url: 'https://api.example.com/v1'}],
  paths: {
    '/orders': {
      get: {
        summary: 'Список заказов',
        tags: ['Orders'],
        parameters: [
          {name: 'status', in: 'query', schema: {type: 'string', enum: ['new', 'paid', 'shipped']}},
          {name: 'limit', in: 'query', schema: {type: 'integer', default: 20}},
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                example: {items: [{id: 1, total: 4990}], total: 1},
              },
            },
          },
        },
      },
      post: {
        summary: 'Создать заказ',
        tags: ['Orders'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {type: 'object', properties: {productId: {type: 'integer'}, qty: {type: 'integer'}}},
              example: {productId: 42, qty: 2},
            },
          },
        },
        responses: {201: {description: 'Created'}},
      },
    },
    '/orders/{id}': {
      get: {
        summary: 'Заказ по ID',
        tags: ['Orders'],
        parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'integer'}}],
        responses: {200: {description: 'OK'}, 404: {description: 'Not found'}},
      },
    },
    '/auth/login': {
      post: {
        summary: 'Авторизация',
        tags: ['Auth'],
        requestBody: {
          content: {
            'application/json': {
              example: {email: 'user@example.com', password: '***'},
            },
          },
        },
        responses: {200: {description: 'JWT token'}},
      },
    },
  },
};

const METHOD_COLORS = {
  get: '#61affe',
  post: '#49cc90',
  put: '#fca130',
  delete: '#f93e3e',
};

function flattenPaths(spec) {
  const rows = [];
  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, op]) => {
      rows.push({path, method, ...op});
    });
  });
  return rows;
}

function SwaggerApiExplorerInner() {
  const endpoints = useMemo(() => flattenPaths(SPEC), []);
  const [tag, setTag] = useState('all');
  const [active, setActive] = useState(endpoints[0]);
  const [tryBody, setTryBody] = useState('{\n  "productId": 42,\n  "qty": 2\n}');
  const [tryResult, setTryResult] = useState(null);

  const tags = ['all', ...new Set(endpoints.flatMap((e) => e.tags || []))];
  const filtered = tag === 'all' ? endpoints : endpoints.filter((e) => e.tags?.includes(tag));

  const executeTry = () => {
    setTryResult({
      status: active.method === 'post' ? 201 : 200,
      time: '124 ms',
      body:
        active.method === 'get'
          ? JSON.stringify({items: [{id: 1, status: 'paid'}], total: 1}, null, 2)
          : tryBody,
    });
  };

  return (
    <DemoShell>
      <DemoCard
        title="Swagger UI — симулятор API-документации"
        subtitle="OpenAPI 3: эндпоинты, параметры, Try it out и примеры ответов"
      >
        <div className={styles.swagger}>
          <header className={styles.top}>
            <div>
              <h3 className={styles.title}>{SPEC.info.title}</h3>
              <span className={styles.version}>v{SPEC.info.version}</span>
              <p className={styles.desc}>{SPEC.info.description}</p>
              <code className={styles.server}>{SPEC.servers[0].url}</code>
            </div>
            <span className={styles.badge}>OpenAPI 3.0</span>
          </header>

          <div className={styles.tags}>
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                className={clsx(styles.tag, tag === t && styles.tagActive)}
                onClick={() => setTag(t)}
              >
                {t === 'all' ? 'Все' : t}
              </button>
            ))}
          </div>

          <div className={styles.split}>
            <div className={styles.list}>
              {filtered.map((ep) => {
                const key = `${ep.method}-${ep.path}`;
                return (
                  <button
                    key={key}
                    type="button"
                    className={clsx(
                      styles.row,
                      active?.path === ep.path && active?.method === ep.method && styles.rowActive,
                    )}
                    onClick={() => {
                      setActive(ep);
                      setTryResult(null);
                    }}
                  >
                    <span
                      className={styles.method}
                      style={{background: METHOD_COLORS[ep.method]}}
                    >
                      {ep.method.toUpperCase()}
                    </span>
                    <span className={styles.path}>{ep.path}</span>
                    <span className={styles.summary}>{ep.summary}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.detail}>
              {active && (
                <>
                  <div className={styles.detailHead}>
                    <span
                      className={styles.method}
                      style={{background: METHOD_COLORS[active.method]}}
                    >
                      {active.method.toUpperCase()}
                    </span>
                    <code>{active.path}</code>
                  </div>
                  <p>{active.summary}</p>

                  {active.parameters?.length > 0 && (
                    <>
                      <h4>Parameters</h4>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>In</th>
                            <th>Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {active.parameters.map((p) => (
                            <tr key={p.name}>
                              <td>
                                <code>{p.name}</code>
                                {p.required && ' *'}
                              </td>
                              <td>{p.in}</td>
                              <td>{p.schema?.type || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}

                  {active.requestBody && (
                    <>
                      <h4>Request body</h4>
                      <textarea
                        className={styles.bodyInput}
                        value={tryBody}
                        onChange={(e) => setTryBody(e.target.value)}
                        rows={5}
                      />
                    </>
                  )}

                  <button type="button" className={styles.tryBtn} onClick={executeTry}>
                    Try it out
                  </button>

                  {tryResult && (
                    <div className={styles.response}>
                      <div className={styles.resHead}>
                        <span className={styles.resOk}>{tryResult.status}</span>
                        <span>{tryResult.time}</span>
                      </div>
                      <pre>{tryResult.body}</pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default SwaggerApiExplorerInner;
