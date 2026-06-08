export const GOROUTINE_TASKS = [
  {id: 'http-1', label: 'HTTP /orders', kind: 'io'},
  {id: 'http-2', label: 'HTTP /health', kind: 'io'},
  {id: 'db-1', label: 'DB query', kind: 'io'},
  {id: 'json-1', label: 'JSON encode', kind: 'cpu'},
  {id: 'log-1', label: 'Structured log', kind: 'cpu'},
];

export const MIDDLEWARE_CHAIN = [
  {id: 'recover', label: 'recover', hint: 'panic → 500'},
  {id: 'trace', label: 'trace-id', hint: 'OpenTelemetry'},
  {id: 'auth', label: 'auth', hint: 'JWT / API key'},
  {id: 'ratelimit', label: 'rate limit', hint: '429 Too Many Requests'},
  {id: 'handler', label: 'handler', hint: 'бизнес-логика'},
];

export function initialGoroutineState() {
  return {
    workers: [
      {id: 'w0', queue: [], busy: false},
      {id: 'w1', queue: [], busy: false},
    ],
    inbox: [],
    done: 0,
  };
}

export function dispatchTask(state) {
  if (state.inbox.length >= 8) return {ok: false, reason: 'Очередь переполнена — нужен пул или backpressure'};
  const task = GOROUTINE_TASKS[Math.floor(Math.random() * GOROUTINE_TASKS.length)];
  const workerIdx = state.workers.reduce(
    (best, w, i, arr) => (w.queue.length < arr[best].queue.length ? i : best),
    0,
  );
  const workers = state.workers.map((w, i) =>
    i === workerIdx ? {...w, queue: [...w.queue, {...task, uid: `${task.id}-${Date.now()}`}]} : w,
  );
  return {
    ok: true,
    state: {...state, workers, inbox: [...state.inbox, task.label].slice(-6)},
    workerIdx,
    task,
  };
}

export function tickWorkers(state) {
  let done = state.done;
  const workers = state.workers.map((w) => {
    if (w.queue.length === 0) return {...w, busy: false};
    const [head, ...rest] = w.queue;
    if (rest.length === 0) done += 1;
    return {busy: true, queue: rest, id: w.id};
  });
  return {...state, workers, done};
}

export function runMiddlewareChain(request) {
  const steps = [];
  let blocked = false;
  for (const mw of MIDDLEWARE_CHAIN) {
    if (mw.id === 'auth' && !request.authenticated) {
      steps.push({...mw, status: 401, ok: false});
      blocked = true;
      break;
    }
    if (mw.id === 'ratelimit' && request.rateLimited) {
      steps.push({...mw, status: 429, ok: false});
      blocked = true;
      break;
    }
    steps.push({...mw, status: 200, ok: true});
  }
  return {steps, blocked, finalStatus: blocked ? steps[steps.length - 1].status : 200};
}

export const CHANNEL_SNIPPET = `ch := make(chan Result, 8)
go worker(ch)
select {
case r := <-ch:
    json.NewEncoder(w).Encode(r)
case <-ctx.Done():
    return ctx.Err()
}`;
