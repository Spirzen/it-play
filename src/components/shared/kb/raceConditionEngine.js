export const INITIAL_BALANCE = 1000;

export const OPERATIONS = [
  {thread: 1, amount: 200, delay: 100},
  {thread: 2, amount: -150, delay: 150},
  {thread: 3, amount: 300, delay: 80},
  {thread: 1, amount: -100, delay: 120},
  {thread: 2, amount: 250, delay: 90},
  {thread: 3, amount: -200, delay: 110},
];

export const SCENARIOS = {
  race: {
    id: 'race',
    label: 'Гонка данных',
    hint: 'Потоки читают и пишут баланс без блокировки — часть обновлений теряется.',
    accent: '#e74c3c',
  },
  mutex: {
    id: 'mutex',
    label: 'Мьютекс',
    hint: 'Только один поток в критической секции; остальные ждут освобождения.',
    accent: '#3498db',
  },
  semaphore: {
    id: 'semaphore',
    label: 'Семафор (2)',
    hint: 'До двух потоков одновременно в критической секции — баланс между скоростью и безопасностью.',
    accent: '#2ecc71',
  },
  atomic: {
    id: 'atomic',
    label: 'Атомарные',
    hint: 'Чтение–изменение–запись как неделимая операция на уровне "процессора".',
    accent: '#f39c12',
  },
};

export function getExpectedBalance() {
  return INITIAL_BALANCE + OPERATIONS.reduce((sum, op) => sum + op.amount, 0);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createRaceSimulator(hooks) {
  const {onBalance, onLog, onThreadActive, onThreadPhase, onSemaphoreSlots, onAtomicCount} = hooks;

  let balanceRef = INITIAL_BALANCE;
  let mutexHeld = false;
  let semaphoreActive = 0;
  let atomicCount = 0;
  let stopped = false;

  const stop = () => {
    stopped = true;
  };

  const reset = () => {
    balanceRef = INITIAL_BALANCE;
    mutexHeld = false;
    semaphoreActive = 0;
    atomicCount = 0;
    stopped = false;
    onBalance(INITIAL_BALANCE);
    onSemaphoreSlots(2);
    onAtomicCount(0);
  };

  const log = (message, type = 'info') => onLog({message, type});

  const setPhase = (threadId, phase) => onThreadPhase(threadId, phase);

  const publishBalance = () => {
    onBalance(balanceRef);
  };

  const criticalSection = async (threadId, amount, delay, runBody) => {
    setPhase(threadId, 'enter');
    await sleep(delay);
    if (stopped) return;

    const readValue = balanceRef;
    setPhase(threadId, 'read');
    log(`Поток ${threadId}: читает баланс = ${readValue}`, 'info');
    await sleep(50);
    if (stopped) return;

    const newValue = readValue + amount;
    setPhase(threadId, 'compute');
    log(
      `Поток ${threadId}: вычисляет ${readValue} ${amount >= 0 ? '+' : ''}${amount} = ${newValue}`,
      'info',
    );
    await sleep(50);
    if (stopped) return;

    await runBody(newValue);
    setPhase(threadId, 'write');
    balanceRef = newValue;
    publishBalance();
    log(
      `Поток ${threadId}: записывает баланс = ${newValue}`,
      amount >= 0 ? 'success' : 'warning',
    );
    await sleep(30);
    setPhase(threadId, 'idle');
  };

  const unsafeUpdate = async (threadId, amount, delay) => {
    onThreadActive(threadId, true);
    setPhase(threadId, 'read');
    const readValue = balanceRef;
    log(`Поток ${threadId}: читает баланс = ${readValue}`, 'info');
    await sleep(delay);
    if (stopped) return;

    setPhase(threadId, 'compute');
    const computed = readValue + amount;
    log(
      `Поток ${threadId}: вычисляет ${readValue} ${amount >= 0 ? '+' : ''}${amount} = ${computed}`,
      'info',
    );
    await sleep(50);
    if (stopped) return;

    setPhase(threadId, 'write');
    balanceRef = computed;
    publishBalance();
    log(`Поток ${threadId}: записывает баланс = ${computed}`, amount >= 0 ? 'success' : 'warning');
    setPhase(threadId, 'idle');
    onThreadActive(threadId, false);
  };

  const mutexUpdate = async (threadId, amount, delay) => {
    onThreadActive(threadId, true);
    while (mutexHeld && !stopped) {
      setPhase(threadId, 'wait');
      log(`Поток ${threadId}: ждёт мьютекс…`, 'warning');
      await sleep(40);
    }
    if (stopped) {
      onThreadActive(threadId, false);
      return;
    }

    mutexHeld = true;
    setPhase(threadId, 'lock');
    log(`Поток ${threadId}: захватил мьютекс`, 'warning');

    await criticalSection(threadId, amount, delay, async (newValue) => {
      balanceRef = newValue;
    });

    mutexHeld = false;
    log(`Поток ${threadId}: освободил мьютекс`, 'info');
    onThreadActive(threadId, false);
  };

  const semaphoreUpdate = async (threadId, amount, delay, max = 2) => {
    onThreadActive(threadId, true);
    while (semaphoreActive >= max && !stopped) {
      setPhase(threadId, 'wait');
      log(
        `Поток ${threadId}: ждёт семафор (${semaphoreActive}/${max} занято)`,
        'warning',
      );
      await sleep(50);
    }
    if (stopped) {
      onThreadActive(threadId, false);
      return;
    }

    semaphoreActive += 1;
    onSemaphoreSlots(max - semaphoreActive);
    setPhase(threadId, 'lock');
    log(`Поток ${threadId}: вошёл в семафор (${semaphoreActive}/${max})`, 'warning');

    await criticalSection(threadId, amount, delay, async (newValue) => {
      balanceRef = newValue;
    });

    semaphoreActive -= 1;
    onSemaphoreSlots(max - semaphoreActive);
    log(`Поток ${threadId}: вышел из семафора (${semaphoreActive}/${max})`, 'info');
    onThreadActive(threadId, false);
  };

  const atomicUpdate = async (threadId, amount, delay) => {
    onThreadActive(threadId, true);
    setPhase(threadId, 'lock');
    log(`Поток ${threadId}: атомарная операция…`, 'warning');
    await sleep(delay);
    if (stopped) {
      onThreadActive(threadId, false);
      return;
    }

    const prev = balanceRef;
    const next = prev + amount;
    balanceRef = next;
    atomicCount += 1;
    onAtomicCount(atomicCount);
    publishBalance();
    log(
      `Поток ${threadId}: атомарно ${prev} → ${next} (${amount >= 0 ? '+' : ''}${amount})`,
      'success',
    );
    setPhase(threadId, 'idle');
    onThreadActive(threadId, false);
  };

  const run = async (scenario) => {
    reset();
    const label = SCENARIOS[scenario]?.label ?? scenario;
    log(`Старт: режим "${label}"`, 'info');

    const runners = OPERATIONS.map(async (op) => {
      if (stopped) return;
      if (scenario === 'race') await unsafeUpdate(op.thread, op.amount, op.delay);
      else if (scenario === 'mutex') await mutexUpdate(op.thread, op.amount, op.delay);
      else if (scenario === 'semaphore') await semaphoreUpdate(op.thread, op.amount, op.delay);
      else if (scenario === 'atomic') await atomicUpdate(op.thread, op.amount, op.delay);
    });

    await Promise.all(runners);

    if (!stopped) {
      const expected = getExpectedBalance();
      const ok = balanceRef === expected;
      log(`Итог: баланс ${balanceRef} ₽ (ожидалось ${expected} ₽)`, ok ? 'success' : 'error');
      if (scenario === 'race' && !ok) {
        log('Обнаружена гонка данных: параллельные записи перезаписали друг друга.', 'error');
      } else if (scenario !== 'race' && ok) {
        log('Синхронизация сработала — результат корректен.', 'success');
      }
    }

    return {finalBalance: balanceRef, expected: getExpectedBalance()};
  };

  return {run, stop, reset};
}
