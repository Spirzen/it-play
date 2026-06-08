/** Сценарии CDN и HTTP-кеширования для интерактивного демо. */

export const REGIONS = [
  {id: 'eu', label: 'Европа', edge: 'PoP Frankfurt', rttOriginMs: 140},
  {id: 'us', label: 'США', edge: 'PoP Ashburn', rttOriginMs: 12},
  {id: 'asia', label: 'Азия', edge: 'PoP Singapore', rttOriginMs: 180},
];

export const SCENARIOS = [
  {
    id: 'hit',
    short: 'HIT',
    title: 'Попадание в кэш edge',
    subtitle: 'Объект свежий — origin не вызывается, ответ с ближайшего PoP',
    cacheStatus: 'HIT',
    steps: [
      {
        spotlight: ['client'],
        phase: 'Запрос',
        label: 'Браузер запрашивает /app.js',
        detail: 'GET https://cdn.example.com/app.js',
        log: 'DNS вернул IP edge-узла в вашем регионе',
        latencyMs: null,
      },
      {
        spotlight: ['edge'],
        phase: 'Edge',
        label: 'Проверка кэша на PoP',
        detail: 'Cache-Control: max-age=86400, возраст объекта 2 ч',
        log: 'Age: 7200 — объект свежий',
        latencyMs: 18,
      },
      {
        spotlight: ['client', 'edge'],
        phase: 'Ответ',
        label: '200 OK из кэша',
        detail: 'X-Cache: HIT, CF-Cache-Status: HIT',
        log: 'Origin не нагружен — экономия RTT и трафика',
        latencyMs: 22,
      },
    ],
  },
  {
    id: 'miss',
    short: 'MISS',
    title: 'Промах кэша',
    subtitle: 'На edge нет копии — запрос уходит к origin, ответ кэшируется',
    cacheStatus: 'MISS',
    steps: [
      {
        spotlight: ['client'],
        phase: 'Запрос',
        label: 'Первый визит после деплоя',
        detail: 'GET /styles/main.css?v=2026-05-22',
        log: 'Новый URL — в кэше edge пусто',
        latencyMs: null,
      },
      {
        spotlight: ['edge'],
        phase: 'Edge',
        label: 'MISS на PoP',
        detail: 'Ключ кэша: host + path + Vary',
        log: 'X-Cache: MISS — идём к origin',
        latencyMs: 15,
      },
      {
        spotlight: ['edge', 'origin'],
        phase: 'Origin',
        label: 'Forward-запрос к серверу',
        detail: 'GET origin.example.com/styles/main.css',
        log: `Добавляется RTT до дата-центра origin`,
        latencyMs: null,
      },
      {
        spotlight: ['origin', 'edge'],
        phase: 'Кэш',
        label: 'Ответ сохраняется на edge',
        detail: 'Cache-Control: public, max-age=31536000',
        log: 'Следующий клиент в регионе получит HIT',
        latencyMs: null,
      },
      {
        spotlight: ['client', 'edge'],
        phase: 'Ответ',
        label: 'Клиент получает файл',
        detail: 'X-Cache: MISS (первый), затем HIT для других',
        log: 'Полная задержка = edge + origin RTT',
        latencyMs: null,
      },
    ],
  },
  {
    id: 'revalidate',
    short: '304',
    title: 'Условный запрос (revalidate)',
    subtitle: 'Кэш устарел по политике — проверка ETag без передачи тела',
    cacheStatus: 'REVALIDATED',
    steps: [
      {
        spotlight: ['client'],
        phase: 'Запрос',
        label: 'Повторное открытие страницы',
        detail: 'If-None-Match: "a1b2c3"',
        log: 'no-cache — нужна проверка актуальности',
        latencyMs: null,
      },
      {
        spotlight: ['edge', 'origin'],
        phase: 'Проверка',
        label: 'Edge спрашивает origin',
        detail: 'ETag на origin не изменился',
        log: 'Origin отвечает 304 Not Modified',
        latencyMs: 45,
      },
      {
        spotlight: ['client', 'edge'],
        phase: 'Ответ',
        label: '304 + тело из локального кэша',
        detail: 'Экономия трафика: заголовки без мегабайт CSS',
        log: 'Браузер использует disk cache',
        latencyMs: 48,
      },
    ],
  },
  {
    id: 'bypass',
    short: 'BYPASS',
    title: 'Обход кэша',
    subtitle: 'Cache-Control: no-store — каждый запрос на origin',
    cacheStatus: 'BYPASS',
    steps: [
      {
        spotlight: ['client'],
        phase: 'Запрос',
        label: 'GET /api/user/profile',
        detail: 'Authorization: Bearer …, Cache-Control: no-store',
        log: 'Персональные данные не кэшируются на CDN',
        latencyMs: null,
      },
      {
        spotlight: ['edge', 'origin'],
        phase: 'Origin',
        label: 'Прямой проход',
        detail: 'CDN не сохраняет ответ',
        log: 'X-Cache: BYPASS / DYNAMIC',
        latencyMs: null,
      },
      {
        spotlight: ['client', 'origin'],
        phase: 'Ответ',
        label: '200 OK только с origin',
        detail: 'Set-Cookie, private — только клиентский кэш запрещён',
        log: 'Типично для API и личных кабинетов',
        latencyMs: null,
      },
    ],
  },
];

export function totalLatencyForStep(scenarioId, stepIndex, regionId) {
  const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0];
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) return null;
  const edgeBase = 12 + Math.round(region.rttOriginMs * 0.08);
  if (scenarioId === 'hit') {
    return stepIndex >= 1 ? edgeBase + (stepIndex === 2 ? 4 : 0) : null;
  }
  if (scenarioId === 'miss') {
    if (stepIndex <= 1) return stepIndex === 1 ? edgeBase : null;
    if (stepIndex === 2) return edgeBase + region.rttOriginMs;
    if (stepIndex >= 3) return edgeBase + region.rttOriginMs + 8;
    return null;
  }
  if (scenarioId === 'revalidate') {
    return stepIndex >= 1 ? edgeBase + Math.round(region.rttOriginMs * 0.35) : null;
  }
  if (scenarioId === 'bypass') {
    return stepIndex >= 1 ? edgeBase + region.rttOriginMs : null;
  }
  return null;
}

export function hitRatioSimulation(requestCount, hitPct) {
  const hits = Math.round((requestCount * hitPct) / 100);
  return {hits, misses: requestCount - hits, hitPct};
}
