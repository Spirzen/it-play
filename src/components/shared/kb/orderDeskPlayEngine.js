/** In-memory симуляция OrderDesk: catalog-api (Python) + orders-api (C#) */

const API_KEY = 'dev-catalog-key-change-me';

let productSeq = 1;
let orderSeq = 1;
let resSeq = 1;

/** @type {Map<string, object>} */
const products = new Map();
/** @type {Map<string, object>} */
const reservations = new Map();
/** @type {Map<string, string>} idempotencyKey -> reservationId */
const idempotencyIndex = new Map();
/** @type {Map<string, object>} */
const orders = new Map();

let catalogDown = false;
let currentUser = null;

/** @type {object[]} */
let wsEvents = [];

function nowIso() {
  return new Date().toISOString();
}

function uid(prefix, n) {
  return `${prefix}_${n.toString(16).padStart(8, '0')}`;
}

export function orderDeskReset() {
  productSeq = 1;
  orderSeq = 1;
  resSeq = 1;
  products.clear();
  reservations.clear();
  idempotencyIndex.clear();
  orders.clear();
  catalogDown = false;
  currentUser = null;
  wsEvents = [];
}

export function orderDeskSetCatalogDown(down) {
  catalogDown = !!down;
}

export function orderDeskIsCatalogDown() {
  return catalogDown;
}

export function orderDeskGetState() {
  return {
    products: [...products.values()],
    orders: [...orders.values()],
    catalogDown,
    currentUser,
    wsEvents: [...wsEvents],
  };
}

function problem(status, title, detail, instance) {
  return {
    status,
    body: {
      type: `https://orderdesk.local/errors/${title.toLowerCase().replace(/\s+/g, '-')}`,
      title,
      status,
      detail,
      instance,
    },
  };
}

/** catalog-api */
export function catalogCreateProduct({sku, name, price, stockAvailable}) {
  if (catalogDown) {
    return {service: 'catalog', ...problem(503, 'Service Unavailable', 'catalog-api недоступен', '/api/v1/products')};
  }
  if (!sku?.trim() || !name?.trim() || price <= 0 || stockAvailable < 0) {
    return {service: 'catalog', ...problem(400, 'Validation Error', 'Некорректные поля товара', '/api/v1/products')};
  }
  for (const p of products.values()) {
    if (p.sku === sku) {
      return {service: 'catalog', ...problem(409, 'Conflict', 'SKU уже существует', '/api/v1/products')};
    }
  }
  const id = uid('prod', productSeq++);
  const row = {
    id,
    sku: sku.trim(),
    name: name.trim(),
    price: Number(price),
    stockAvailable: Number(stockAvailable),
    createdAt: nowIso(),
  };
  products.set(id, row);
  return {
    service: 'catalog',
    status: 201,
    method: 'POST',
    path: '/api/v1/products',
    body: row,
  };
}

export function catalogGetProduct(productId) {
  if (catalogDown) {
    return {service: 'catalog', ...problem(503, 'Service Unavailable', 'catalog-api недоступен', `/api/v1/products/${productId}`)};
  }
  const row = products.get(productId);
  if (!row) {
    return {service: 'catalog', ...problem(404, 'Not Found', 'Товар не найден', `/api/v1/products/${productId}`)};
  }
  return {service: 'catalog', status: 200, method: 'GET', path: `/api/v1/products/${productId}`, body: {...row}};
}

export function catalogCreateReservation(
  {productId, quantity, orderRef},
  {apiKey, idempotencyKey},
) {
  if (catalogDown) {
    return {service: 'catalog', ...problem(503, 'Service Unavailable', 'catalog-api недоступен', '/api/v1/reservations')};
  }
  if (apiKey !== API_KEY) {
    return {service: 'catalog', ...problem(401, 'Unauthorized', 'Invalid API key', '/api/v1/reservations')};
  }
  if (!idempotencyKey) {
    return {service: 'catalog', ...problem(400, 'Bad Request', 'Idempotency-Key обязателен', '/api/v1/reservations')};
  }
  const existingId = idempotencyIndex.get(idempotencyKey);
  if (existingId) {
    const existing = reservations.get(existingId);
    return {
      service: 'catalog',
      status: 201,
      method: 'POST',
      path: '/api/v1/reservations',
      body: reservationDto(existing),
      note: 'Идемпотентный повтор — остаток не списан повторно',
    };
  }
  const product = products.get(productId);
  if (!product || product.stockAvailable < quantity) {
    return {
      service: 'catalog',
      ...problem(409, 'Insufficient stock', `Недостаточно остатка для ${productId}`, '/api/v1/reservations'),
    };
  }
  product.stockAvailable -= quantity;
  const id = uid('res', resSeq++);
  const expiresAt = new Date(Date.now() + 3600_000).toISOString();
  const row = {id, productId, quantity, orderRef, idempotencyKey, expiresAt};
  reservations.set(id, row);
  idempotencyIndex.set(idempotencyKey, id);
  return {
    service: 'catalog',
    status: 201,
    method: 'POST',
    path: '/api/v1/reservations',
    headers: {'X-Api-Key': '••••', 'Idempotency-Key': idempotencyKey},
    body: reservationDto(row),
  };
}

export function catalogDeleteReservation(reservationId, apiKey) {
  if (apiKey !== API_KEY) {
    return {service: 'catalog', ...problem(401, 'Unauthorized', 'Invalid API key', `/api/v1/reservations/${reservationId}`)};
  }
  const row = reservations.get(reservationId);
  if (!row) {
    return {service: 'catalog', ...problem(404, 'Not Found', 'Резерв не найден', `/api/v1/reservations/${reservationId}`)};
  }
  const product = products.get(row.productId);
  if (product) product.stockAvailable += row.quantity;
  reservations.delete(reservationId);
  if (row.idempotencyKey) idempotencyIndex.delete(row.idempotencyKey);
  return {service: 'catalog', status: 204, method: 'DELETE', path: `/api/v1/reservations/${reservationId}`, body: null};
}

function reservationDto(row) {
  return {
    reservationId: row.id,
    productId: row.productId,
    quantity: row.quantity,
    expiresAt: row.expiresAt,
  };
}

/** orders-api */
export function ordersAuth({username, password}) {
  if (username !== 'demo' || password !== 'demo') {
    return {service: 'orders', ...problem(401, 'Unauthorized', 'Неверный логин или пароль', '/api/v1/auth/token')};
  }
  currentUser = username;
  const body = {access_token: 'demo-jwt-token', token_type: 'Bearer', expires_in: 3600};
  return {service: 'orders', status: 200, method: 'POST', path: '/api/v1/auth/token', body};
}

export function ordersCreate({lines}, bearerToken) {
  if (!bearerToken) {
    return {service: 'orders', ...problem(401, 'Unauthorized', 'Bearer token required', '/api/v1/orders')};
  }
  if (!lines?.length) {
    return {service: 'orders', ...problem(422, 'Unprocessable', 'Заказ без строк', '/api/v1/orders')};
  }
  if (catalogDown) {
    return {
      service: 'orders',
      ...problem(502, 'Bad Gateway', 'catalog-api недоступен', '/api/v1/orders'),
      chain: [],
    };
  }

  const orderId = uid('ord', orderSeq++);
  const chain = [];
  const orderLines = [];
  let total = 0;

  for (const line of lines) {
    const productRes = catalogGetProduct(line.productId);
    chain.push({...productRes, from: 'orders-api → catalog-api'});
    if (productRes.status !== 200) {
      return {
        service: 'orders',
        status: productRes.status === 404 ? 422 : productRes.status,
        method: 'POST',
        path: '/api/v1/orders',
        body: productRes.body,
        chain,
      };
    }
    const reserveRes = catalogCreateReservation(
      {productId: line.productId, quantity: line.quantity, orderRef: orderId},
      {apiKey: API_KEY, idempotencyKey: `${orderId}:${line.productId}`},
    );
    chain.push({...reserveRes, from: 'orders-api → catalog-api'});
    if (reserveRes.status !== 201) {
      return {service: 'orders', status: 409, method: 'POST', path: '/api/v1/orders', body: reserveRes.body, chain};
    }
    const unitPrice = productRes.body.price;
    total += unitPrice * line.quantity;
    orderLines.push({
      productId: line.productId,
      quantity: line.quantity,
      unitPrice,
      reservationId: reserveRes.body.reservationId,
    });
  }

  const order = {
    id: orderId,
    status: 'reserved',
    userId: currentUser,
    lines: orderLines,
    total: Math.round(total * 100) / 100,
    createdAt: nowIso(),
  };
  orders.set(orderId, order);
  pushWsEvent(orderId, 'reserved');

  return {
    service: 'orders',
    status: 201,
    method: 'POST',
    path: '/api/v1/orders',
    body: order,
    chain,
  };
}

export function ordersConfirm(orderId, bearerToken) {
  if (!bearerToken) {
    return {service: 'orders', ...problem(401, 'Unauthorized', 'Bearer token required', `/api/v1/orders/${orderId}/confirm`)};
  }
  const order = orders.get(orderId);
  if (!order) {
    return {service: 'orders', ...problem(404, 'Not Found', 'Заказ не найден', `/api/v1/orders/${orderId}/confirm`)};
  }
  order.status = 'confirmed';
  pushWsEvent(orderId, 'confirmed');
  return {
    service: 'orders',
    status: 200,
    method: 'POST',
    path: `/api/v1/orders/${orderId}/confirm`,
    body: {...order},
  };
}

export function ordersCancel(orderId, bearerToken) {
  if (!bearerToken) {
    return {service: 'orders', ...problem(401, 'Unauthorized', 'Bearer token required', `/api/v1/orders/${orderId}/cancel`)};
  }
  const order = orders.get(orderId);
  if (!order) {
    return {service: 'orders', ...problem(404, 'Not Found', 'Заказ не найден', `/api/v1/orders/${orderId}/cancel`)};
  }
  const chain = [];
  for (const line of order.lines) {
    if (line.reservationId) {
      const del = catalogDeleteReservation(line.reservationId, API_KEY);
      chain.push({...del, from: 'orders-api → catalog-api'});
    }
  }
  order.status = 'cancelled';
  pushWsEvent(orderId, 'cancelled');
  return {
    service: 'orders',
    status: 200,
    method: 'POST',
    path: `/api/v1/orders/${orderId}/cancel`,
    body: {...order},
    chain,
  };
}

function pushWsEvent(orderId, status) {
  wsEvents = [
    {
      v: 1,
      type: 'order.status_changed',
      payload: {orderId, status, at: nowIso()},
    },
    ...wsEvents,
  ].slice(0, 8);
}

export function orderDeskWsPing() {
  return {v: 1, type: 'pong'};
}

export const ORDER_DESK_SCENARIOS = [
  {
    id: 'happy',
    label: 'Сквозной сценарий',
    description: 'Товар → JWT → заказ → confirm → событие WS',
  },
  {
    id: 'stock',
    label: 'Нехватка остатка',
    description: 'Заказ на quantity больше остатка → 409',
  },
  {
    id: 'gateway',
    label: 'Catalog down',
    description: 'orders-api возвращает 502',
  },
  {
    id: 'idempotent',
    label: 'Идемпотентность',
    description: 'Повтор резерва с тем же ключом',
  },
];

/** Выполняет учебный сценарий, возвращает лог шагов */
export function runOrderDeskScenario(scenarioId) {
  orderDeskReset();
  const log = [];

  const push = (label, res) => log.push({label, ...res});

  if (scenarioId === 'happy' || scenarioId === 'stock' || scenarioId === 'idempotent') {
    push('1. POST /products', catalogCreateProduct({
      sku: 'DEMO-1',
      name: 'Учебный товар',
      price: 19.5,
      stockAvailable: scenarioId === 'stock' ? 1 : 25,
    }));
    const productId = log[0].body?.id;
    push('2. POST /auth/token', ordersAuth({username: 'demo', password: 'demo'}));
    const token = log[1].body?.access_token;
    push('3. POST /orders', ordersCreate({
      lines: [{productId, quantity: scenarioId === 'stock' ? 5 : 2}],
    }, token));
    if (scenarioId === 'happy' && log[2].status === 201) {
      push('4. POST /confirm', ordersConfirm(log[2].body.id, token));
      push('5. WS ping', {service: 'ws', status: 200, method: 'WS', path: '/ws/orders', body: orderDeskWsPing()});
    }
    if (scenarioId === 'idempotent' && productId) {
      orderDeskReset();
      catalogCreateProduct({sku: 'DEMO-2', name: 'X', price: 10, stockAvailable: 10});
      const p = [...products.values()][0];
      const key = 'same-key-1';
      push('1a. Резерв #1', catalogCreateReservation(
        {productId: p.id, quantity: 2, orderRef: 'ord_test'},
        {apiKey: API_KEY, idempotencyKey: key},
      ));
      push('1b. Резерв #2 (тот же ключ)', catalogCreateReservation(
        {productId: p.id, quantity: 2, orderRef: 'ord_test'},
        {apiKey: API_KEY, idempotencyKey: key},
      ));
    }
  }

  if (scenarioId === 'gateway') {
    orderDeskSetCatalogDown(true);
    push('1. POST /auth/token', ordersAuth({username: 'demo', password: 'demo'}));
    push('2. POST /orders (catalog down)', ordersCreate({
      lines: [{productId: 'prod_missing', quantity: 1}],
    }, log[0].body?.access_token));
  }

  return log;
}
