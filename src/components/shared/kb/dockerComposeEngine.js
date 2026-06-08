export const COMPOSE_SERVICES = [
  {
    id: 'web',
    name: 'app',
    image: 'build: .',
    ports: '3000:3000',
    depends: ['db', 'redis'],
    health: null,
  },
  {
    id: 'db',
    name: 'db',
    image: 'postgres:15',
    ports: '—',
    depends: [],
    health: 'pg_isready',
  },
  {
    id: 'redis',
    name: 'redis',
    image: 'redis:7-alpine',
    ports: '—',
    depends: [],
    health: null,
  },
];

export const COMPOSE_YAML = `services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_started }
  db:
    image: postgres:15
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
  redis:
    image: redis:7-alpine`;

export function initialComposeState() {
  return COMPOSE_SERVICES.map((s) => ({...s, status: 'stopped', log: ''}));
}

export function canStartService(services, id) {
  const svc = services.find((s) => s.id === id);
  if (!svc) return false;
  return svc.depends.every((depId) => {
    const dep = services.find((s) => s.id === depId);
    return dep?.status === 'running' || (dep?.status === 'healthy' && dep.health);
  });
}

export function startService(services, id) {
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return {ok: false, services};
  if (!canStartService(services, id)) {
    return {
      ok: false,
      services: services.map((s, i) =>
        i === idx ? {...s, log: 'depends_on: ждём готовности зависимостей'} : s,
      ),
    };
  }
  const next = services.map((s, i) => {
    if (i !== idx) return s;
    const status = s.health ? 'starting' : 'running';
    return {
      ...s,
      status,
      log: status === 'starting' ? 'healthcheck: interval 10s…' : 'Up',
    };
  });
  return {ok: true, services: next, promoteHealth: services[idx].health};
}

export function promoteHealth(services, id) {
  return services.map((s) =>
    s.id === id && s.status === 'starting' ? {...s, status: 'healthy', log: 'healthy ✓'} : s,
  );
}

export function composeUpAll(services) {
  let current = services;
  const order = ['db', 'redis', 'web'];
  for (const id of order) {
    const r = startService(current, id);
    current = r.services;
    if (!r.ok) return {ok: false, services: current};
    if (r.promoteHealth) {
      current = promoteHealth(current, id);
    }
  }
  return {ok: true, services: current};
}

export function composeDown(services) {
  return services.map((s) => ({...s, status: 'stopped', log: 'Removed'}));
}
