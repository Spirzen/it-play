import React, {useCallback, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  ORDER_DESK_SCENARIOS,
  catalogCreateProduct,
  orderDeskGetState,
  orderDeskReset,
  orderDeskSetCatalogDown,
  orderDeskIsCatalogDown,
  orderDeskWsPing,
  ordersAuth,
  ordersCancel,
  ordersConfirm,
  ordersCreate,
  runOrderDeskScenario,
} from '@/components/shared/kb/orderDeskPlayEngine';
import styles from '@/components/demos/OrderDeskIntegrationPlay.module.css';

function statusClass(status) {
  if (!status) return '';
  return status < 400 ? styles.logEntryOk : styles.logEntryErr;
}

function LogEntry({entry}) {
  const bodyStr =
    entry.body == null
      ? ''
      : typeof entry.body === 'string'
        ? entry.body
        : JSON.stringify(entry.body, null, 2);
  const isWs = entry.service === 'ws';
  return (
    <div className={clsx(styles.logEntry, statusClass(entry.status))}>
      <span className={clsx(styles.badge, isWs ? styles.badgeWs : entry.status < 400 ? styles.badgeOk : styles.badgeErr)}>
        {entry.status ?? '—'}
      </span>
      <strong>
        {entry.label ?? `${entry.method} ${entry.path}`}
      </strong>
      {entry.from && (
        <span style={{opacity: 0.75}}> ({entry.from})</span>
      )}
      {entry.note && (
        <div style={{fontSize: '0.68rem', marginTop: '0.2rem', fontStyle: 'italic'}}>{entry.note}</div>
      )}
      {bodyStr && <pre className={styles.code}>{bodyStr}</pre>}
      {entry.chain?.length > 0 && (
        <div style={{marginTop: '0.35rem'}}>
          <div style={{fontSize: '0.68rem', fontWeight: 600}}>Цепочка к catalog-api:</div>
          {entry.chain.map((c, i) => (
            <div key={i} className={styles.code} style={{marginTop: '0.2rem'}}>
              [{c.status}] {c.method} {c.path}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDeskIntegrationPlayInner() {
  const [log, setLog] = useState([]);
  const [activeHost, setActiveHost] = useState(null);
  const [scenarioId, setScenarioId] = useState('happy');
  const [sku, setSku] = useState('DEMO-SKU');
  const [qty, setQty] = useState(2);
  const [token, setToken] = useState(null);
  const [lastProductId, setLastProductId] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [, tick] = useState(0);
  const refresh = () => tick((n) => n + 1);

  const state = orderDeskGetState();
  const catalogDown = orderDeskIsCatalogDown();

  const append = useCallback((label, res) => {
    setLog((prev) => [{label, ...res}, ...prev].slice(0, 12));
    if (res.service === 'catalog') setActiveHost('catalog');
    else if (res.service === 'orders') setActiveHost('orders');
    else if (res.service === 'ws') setActiveHost('ws');
    else setActiveHost('client');
    refresh();
  }, []);

  const resetAll = () => {
    orderDeskReset();
    setLog([]);
    setToken(null);
    setLastProductId(null);
    setLastOrderId(null);
    setActiveHost(null);
    refresh();
  };

  const runScenario = (id) => {
    setScenarioId(id);
    const steps = runOrderDeskScenario(id);
    setLog(steps.reverse());
    const authStep = steps.find((s) => s.path === '/api/v1/auth/token' && s.status === 200);
    if (authStep) setToken(authStep.body.access_token);
    const prodStep = steps.find((s) => s.path === '/api/v1/products' && s.status === 201);
    if (prodStep) setLastProductId(prodStep.body.id);
    const ordStep = steps.find((s) => s.path === '/api/v1/orders' && s.status === 201);
    if (ordStep) setLastOrderId(ordStep.body.id);
    refresh();
  };

  const product = lastProductId ? state.products.find((p) => p.id === lastProductId) : state.products[0];
  const order = lastOrderId ? state.orders.find((o) => o.id === lastOrderId) : state.orders[0];

  const manualSteps = useMemo(
    () => [
      {
        label: 'POST product',
        run: () => {
          const res = catalogCreateProduct({
            sku,
            name: 'Интерактивный товар',
            price: 24.99,
            stockAvailable: 20,
          });
          if (res.status === 201) setLastProductId(res.body.id);
          append('Catalog: создать товар', res);
        },
      },
      {
        label: 'POST token',
        run: () => {
          const res = ordersAuth({username: 'demo', password: 'demo'});
          if (res.status === 200) setToken(res.body.access_token);
          append('Orders: JWT', res);
        },
      },
      {
        label: 'POST order',
        run: () => {
          const pid = lastProductId ?? product?.id;
          const res = ordersCreate({lines: [{productId: pid, quantity: qty}]}, token);
          if (res.status === 201) setLastOrderId(res.body.id);
          append('Orders: создать заказ', res);
        },
      },
      {
        label: 'POST confirm',
        run: () => {
          const oid = lastOrderId ?? order?.id;
          append('Orders: подтвердить', ordersConfirm(oid, token));
        },
      },
      {
        label: 'POST cancel',
        run: () => {
          const oid = lastOrderId ?? order?.id;
          append('Orders: отменить', ordersCancel(oid, token));
        },
      },
      {
        label: 'WS ping',
        run: () =>
          append('WebSocket: ping → pong', {
            service: 'ws',
            status: 200,
            method: 'WS',
            path: '/ws/orders',
            body: orderDeskWsPing(),
          }),
      },
    ],
    [append, lastOrderId, lastProductId, order?.id, product?.id, qty, sku, token],
  );

  const toggleCatalog = () => {
    orderDeskSetCatalogDown(!catalogDown);
    refresh();
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="OrderDesk — REST и WebSocket"
        subtitle="Симуляция catalog-api (Python) и orders-api (C#) без локального сервера — те же статусы, что в Postman."
      >
        <div className={styles.lane}>
          <div
            className={clsx(styles.host, styles.hostClient, activeHost === 'client' && styles.hostActive)}
          >
            <strong>Postman / клиент</strong>
            <span>JWT, REST, WS</span>
          </div>
          <span className={styles.arrow}>→</span>
          <div
            className={clsx(styles.host, styles.hostCsharp, activeHost === 'orders' && styles.hostActive)}
          >
            <strong>orders-api</strong>
            <span>C# · :5200</span>
          </div>
          <span className={styles.arrow}>→</span>
          <div
            className={clsx(
              styles.host,
              styles.hostPython,
              activeHost === 'catalog' && styles.hostActive,
              catalogDown && {opacity: 0.55},
            )}
          >
            <strong>catalog-api</strong>
            <span>Python · :8100</span>
          </div>
        </div>

        <label className={styles.toggleRow}>
          <input type="checkbox" checked={catalogDown} onChange={toggleCatalog} />
          catalog-api недоступен (учебный 502 Bad Gateway)
        </label>

        <div className={styles.scenarios}>
          {ORDER_DESK_SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(styles.scenarioBtn, scenarioId === s.id && styles.scenarioBtnActive)}
              onClick={() => runScenario(s.id)}
            >
              <div className={styles.scenarioLabel}>{s.label}</div>
              <p className={styles.scenarioDesc}>{s.description}</p>
            </button>
          ))}
        </div>

        <div className={styles.stockPanel}>
          <div className={styles.miniCard}>
            <h4>Каталог</h4>
            {product ? (
              <>
                <div>
                  <strong>{product.name}</strong> ({product.id})
                </div>
                <div>
                  Остаток: <strong>{product.stockAvailable}</strong> · {product.price} ₽
                </div>
              </>
            ) : (
              <span style={{opacity: 0.7}}>Создайте товар</span>
            )}
          </div>
          <div className={styles.miniCard}>
            <h4>Заказ</h4>
            {order ? (
              <>
                <div>
                  {order.id} — <strong>{order.status}</strong>
                </div>
                <div>Сумма: {order.total} ₽</div>
              </>
            ) : (
              <span style={{opacity: 0.7}}>Создайте заказ</span>
            )}
          </div>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.formField} style={{flex: '1 1 6rem', minWidth: '5rem'}}>
            <label className="it-demo__label" htmlFor="od-sku">
              SKU
            </label>
            <input
              id="od-sku"
              className="it-demo__input"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
          <div className={styles.formField} style={{flex: '0 0 4rem'}}>
            <label className="it-demo__label" htmlFor="od-qty">
              qty
            </label>
            <input
              id="od-qty"
              type="number"
              min={1}
              className="it-demo__input"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />
          </div>
        </div>

        <div className={styles.toolbar}>
          {manualSteps.map((step) => (
            <button
              key={step.label}
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              onClick={step.run}
            >
              {step.label}
            </button>
          ))}
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={resetAll}>
            Сброс
          </button>
        </div>

        {state.wsEvents.length > 0 && (
          <div className={styles.wsPanel}>
            <div className={styles.wsTitle}>Лента WebSocket (/ws/orders)</div>
            {state.wsEvents.map((ev, i) => (
              <pre key={i} className={styles.code}>
                {JSON.stringify(ev, null, 2)}
              </pre>
            ))}
          </div>
        )}

        {log.length === 0 ? (
          <p className="it-demo__hint" style={{margin: 0, textAlign: 'center'}}>
            Выберите сценарий или пройдите шаги вручную. Сначала товар и JWT, затем заказ.
          </p>
        ) : (
          log.map((entry, i) => <LogEntry key={i} entry={entry} />)
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default OrderDeskIntegrationPlayInner;
