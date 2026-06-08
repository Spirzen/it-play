/** Утилиты для демо мониторинга, метрик и логов. */

export const LOG_LEVELS = [
  {id: 'debug', label: 'DEBUG', color: '#78909c', priority: 0},
  {id: 'info', label: 'INFO', color: '#1976d2', priority: 1},
  {id: 'warn', label: 'WARN', color: '#ed6c02', priority: 2},
  {id: 'error', label: 'ERROR', color: '#c62828', priority: 3},
  {id: 'critical', label: 'CRITICAL', color: '#6a1b9a', priority: 4},
];

export const METRIC_TYPES = [
  {
    id: 'gauge',
    label: 'Gauge',
    desc: 'Мгновенное значение: память, CPU, активные соединения',
    example: 'memory_free_bytes',
  },
  {
    id: 'counter',
    label: 'Counter',
    desc: 'Монотонно растёт: запросы, ошибки, байты',
    example: 'http_requests_total',
  },
  {
    id: 'histogram',
    label: 'Histogram',
    desc: 'Распределение: p50, p95, p99 времени ответа',
    example: 'http_request_duration_seconds',
  },
];

export const MONITORING_TARGETS = [
  {id: 'web-01', name: 'web-01', job: 'api', up: true, latencyMs: 12},
  {id: 'web-02', name: 'web-02', job: 'api', up: true, latencyMs: 18},
  {id: 'db-primary', name: 'postgres-primary', job: 'database', up: true, latencyMs: 4},
  {id: 'redis', name: 'redis-cache', job: 'cache', up: true, latencyMs: 2},
  {id: 'worker', name: 'worker-queue', job: 'worker', up: false, latencyMs: 0},
];

const SERVICES = ['api-gateway', 'auth-service', 'order-service', 'payment-service'];

const LOG_TEMPLATES = [
  {level: 'info', msg: 'GET /api/health → 200', service: 'api-gateway'},
  {level: 'info', msg: 'User login success userId={id}', service: 'auth-service'},
  {level: 'debug', msg: 'Cache hit key=user:{id}', service: 'auth-service'},
  {level: 'warn', msg: 'Retry attempt {n}/3 gateway=stripe', service: 'payment-service'},
  {level: 'error', msg: 'Connection refused host=postgres-primary:5432', service: 'order-service'},
  {level: 'error', msg: 'HTTP 500 POST /api/orders traceId={trace}', service: 'order-service'},
  {level: 'critical', msg: 'OutOfMemoryError: heap space exhausted', service: 'order-service'},
  {level: 'info', msg: 'Deployment v2.4.1 started', service: 'api-gateway'},
  {level: 'warn', msg: 'p95 latency 890ms > threshold 500ms', service: 'api-gateway'},
  {level: 'debug', msg: 'SQL query duration=142ms', service: 'order-service'},
];

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function formatTime(d = new Date()) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0').slice(0, 3)}`;
}

export function randomId(len = 8) {
  return Math.random().toString(36).slice(2, 2 + len);
}

export function createLogEntry(overrides = {}) {
  const tpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
  const now = new Date();
  const traceId = randomId(12);
  const userId = 10000 + Math.floor(Math.random() * 90000);
  let message = tpl.msg
    .replace('{id}', userId)
    .replace('{n}', 1 + Math.floor(Math.random() * 3))
    .replace('{trace}', traceId);

  return {
    id: `log-${Date.now()}-${randomId(4)}`,
    timestamp: formatTime(now),
    level: tpl.level,
    service: tpl.service,
    host: `${tpl.service.split('-')[0]}-pod-${1 + Math.floor(Math.random() * 3)}`,
    message,
    traceId: tpl.level === 'error' || tpl.level === 'critical' ? traceId : undefined,
    ...overrides,
  };
}

export function createStructuredLog(entry) {
  return {
    timestamp: entry.timestamp,
    level: entry.level.toUpperCase(),
    host: entry.host,
    service: entry.service,
    message: entry.message,
    ...(entry.traceId ? {trace_id: entry.traceId} : {}),
  };
}

export function levelMeetsMin(level, minLevel) {
  const order = Object.fromEntries(LOG_LEVELS.map((l, i) => [l.id, i]));
  return order[level] >= order[minLevel];
}

/** Генерация временного ряда для спарклайна. */
export function generateSeries(length, base, variance, spikeAt = -1, spikeMul = 2) {
  const out = [];
  let v = base;
  for (let i = 0; i < length; i++) {
    v += (Math.random() - 0.5) * variance;
    v = Math.max(0, Math.min(100, v));
    if (i === spikeAt) v = Math.min(100, v * spikeMul);
    out.push(Math.round(v * 10) / 10);
  }
  return out;
}

export function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
}

export function computePercentiles(samples) {
  const sorted = [...samples].sort((a, b) => a - b);
  return {
    p50: percentile(sorted, 50),
    p95: percentile(sorted, 95),
    p99: percentile(sorted, 99),
    max: sorted[sorted.length - 1] ?? 0,
  };
}

export function simulateRequestLatencies(count, baseMs, concurrencyFactor) {
  const samples = [];
  for (let i = 0; i < count; i++) {
    let ms = baseMs + Math.random() * baseMs * 0.4;
    if (concurrencyFactor > 0.7 && Math.random() < 0.08) ms *= 4 + Math.random() * 3;
    samples.push(Math.round(ms));
  }
  return samples;
}

export const INCIDENT_SCENARIOS = {
  normal: {
    label: 'Штатная нагрузка',
    cpu: 35,
    memory: 52,
    errorRate: 0.3,
    qps: 120,
    logs: () => [createLogEntry({level: 'info', message: 'GET /api/products → 200', service: 'api-gateway'})],
  },
  spike: {
    label: 'Всплеск трафика',
    cpu: 78,
    memory: 61,
    errorRate: 1.2,
    qps: 340,
    logs: () => [
      createLogEntry({level: 'warn', message: 'p95 latency 620ms > SLO 500ms', service: 'api-gateway'}),
      createLogEntry({level: 'info', message: 'HPA: scaling 3 → 6 replicas', service: 'api-gateway'}),
    ],
  },
  db_down: {
    label: 'БД недоступна',
    cpu: 45,
    memory: 68,
    errorRate: 18,
    qps: 95,
    logs: () => [
      createLogEntry({
        level: 'error',
        message: 'Connection refused postgres-primary:5432',
        service: 'order-service',
      }),
      createLogEntry({
        level: 'error',
        message: 'HTTP 503 POST /api/orders — dependency unavailable',
        service: 'api-gateway',
      }),
      createLogEntry({level: 'critical', message: 'Circuit breaker OPEN → payment-service', service: 'payment-service'}),
    ],
  },
  deploy: {
    label: 'Деплой v2.5.0',
    cpu: 55,
    memory: 58,
    errorRate: 2.1,
    qps: 110,
    logs: () => [
      createLogEntry({level: 'info', message: 'Rolling update: 2/6 pods ready', service: 'api-gateway'}),
      createLogEntry({level: 'warn', message: 'Readiness probe failed /health (attempt 2)', service: 'auth-service'}),
      createLogEntry({level: 'error', message: 'NullReferenceException in OrderController.cs:142', service: 'order-service'}),
    ],
  },
};

export function buildSparklinePath(values, width, height, padding = 2) {
  if (!values.length) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = (width - padding * 2) / (values.length - 1 || 1);
  return values
    .map((v, i) => {
      const x = padding + i * step;
      const y = padding + (height - padding * 2) * (1 - (v - min) / range);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

export function promqlHint(metric) {
  const hints = {
    gauge: 'memory_free_bytes{instance="web-01"}',
    counter: 'rate(http_requests_total[5m])',
    histogram: 'histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))',
  };
  return hints[metric] ?? '';
}

export const ALERT_RULES = [
  {id: 'cpu', name: 'CPU > 85%', expr: 'avg(cpu_usage) > 85', for: '5m', severity: 'warning'},
  {id: 'errors', name: 'Error rate > 5%', expr: 'rate(http_5xx[5m]) / rate(http_total[5m]) > 0.05', for: '2m', severity: 'critical'},
  {id: 'disk', name: 'Disk < 10% free', expr: 'disk_free_percent < 10', for: '15m', severity: 'warning'},
  {id: 'latency', name: 'p95 > 500ms', expr: 'histogram_quantile(0.95, ...) > 0.5', for: '3m', severity: 'warning'},
];

export function randomService() {
  return SERVICES[Math.floor(Math.random() * SERVICES.length)];
}
