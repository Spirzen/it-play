/** Данные и чистая логика для интерактивов раздела 7-05-testirovanie */

export function calcAdd(a, b, op = 'add') {
  return op === 'add' ? a + b : a - b;
}

export function validateRegistration({name, email, password}) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Поле имя обязательно для заполнения.';
  const em = email?.trim() ?? '';
  if (!em || !em.includes('@') || !em.includes('.')) {
    errors.email = 'Введите корректный адрес электронной почты.';
  }
  if ((password ?? '').length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов.';
  }
  return {ok: Object.keys(errors).length === 0, errors};
}

export const REGISTRATION_SCENARIOS = [
  {
    id: 'empty',
    label: 'Пустая форма',
    data: {name: '', email: '', password: ''},
    expect: 'errors-all',
  },
  {
    id: 'bad-email',
    label: 'Некорректный email',
    data: {name: 'Иван', email: 'ivanexample.com', password: '123456'},
    expect: 'error-email',
  },
  {
    id: 'short-pass',
    label: 'Короткий пароль',
    data: {name: 'Анна', email: 'anna@test.ru', password: '1234'},
    expect: 'error-password',
  },
  {
    id: 'valid',
    label: 'Валидные данные',
    data: {name: 'Анна', email: 'anna@test.ru', password: 'secret1'},
    expect: 'success',
  },
];

export const BOX_TYPES = [
  {
    id: 'black',
    label: 'Black-box',
    icon: '⬛',
    sees: ['Входы и выходы', 'UI, API-контракт', 'Требования'],
    hides: ['Исходный код', 'Ветвления if/else', 'Покрытие строк'],
    example: 'POST /login → 200 и JWT в ответе',
  },
  {
    id: 'white',
    label: 'White-box',
    icon: '⬜',
    sees: ['Код и архитектура', 'Пути выполнения', 'Покрытие веток'],
    hides: ['—'],
    example: 'Покрыть все ветки validateEmail()',
  },
  {
    id: 'gray',
    label: 'Gray-box',
    icon: '◧',
    sees: ['Схема БД, логи', 'Диаграммы API', 'Модель данных'],
    hides: ['Полный исходник сервиса'],
    example: 'Знаем таблицу users, но не код ORM',
  },
];

export const TEST_LEVELS_PYRAMID = [
  {id: 'unit', label: 'Unit', pct: 70, color: '#2e7d32', detail: 'Функции и классы изолированно'},
  {id: 'integration', label: 'Integration', pct: 20, color: '#1565c0', detail: 'Модули и API вместе'},
  {id: 'e2e', label: 'E2E / System', pct: 10, color: '#6a1b9a', detail: 'Сценарий пользователя целиком'},
];

export const LIFECYCLE_PHASES = [
  {
    id: 'plan',
    label: 'Планирование и контроль',
    icon: '📋',
    detail: 'Стратегия, план релиза, метрики прогресса, entry/exit criteria.',
  },
  {
    id: 'design',
    label: 'Анализ и проектирование',
    icon: '✏️',
    detail: 'Тестовые условия, тест-кейсы, матрица трассировки к требованиям.',
  },
  {
    id: 'run',
    label: 'Реализация и выполнение',
    icon: '▶️',
    detail: 'Подготовка данных, прогоны, фиксация фактических результатов.',
  },
  {
    id: 'eval',
    label: 'Оценка критериев',
    icon: '📊',
    detail: 'Сравнение с критериями выхода: покрытие, дефекты, риски.',
  },
  {
    id: 'close',
    label: 'Завершение',
    icon: '🏁',
    detail: 'Архивация артефактов, ретроспектива, уроки для следующего цикла.',
  },
];

export const STAGE_ORDER = [
  {id: 'unit', label: 'Модульное', when: 'После коммита функции'},
  {id: 'integration', label: 'Интеграционное', when: 'После сборки модулей'},
  {id: 'system', label: 'Системное', when: 'Полный стенд готов'},
  {id: 'acceptance', label: 'Приёмочное', when: 'Перед релизом заказчику'},
];

export const TEST_DOUBLES = [
  {
    id: 'stub',
    label: 'Stub',
    role: 'Возвращает заготовленные данные',
    checksCalls: false,
    demo: 'Курс валют всегда 90 ₽',
  },
  {
    id: 'mock',
    label: 'Mock',
    role: 'Проверяет факт и параметры вызова',
    checksCalls: true,
    demo: 'fetch_user(1) вызван ровно 1 раз',
  },
  {
    id: 'fake',
    label: 'Fake',
    role: 'Упрощённая, но рабочая реализация',
    checksCalls: false,
    demo: 'In-memory "БД" с insert/select',
  },
];

/** Симуляция нагрузки: users, rampSec → метрики */
export function simulateLoad({users, rampSec = 10, stress = false}) {
  const cap = stress ? users * 0.55 : users * 1.15;
  const overload = users > cap;
  const saturation = Math.min(1, cap / Math.max(users, 1));
  const baseLatency = 120 + (users / Math.max(cap, 1)) * 280;
  const latencyMs = Math.round(baseLatency * (stress && overload ? 2.4 : 1));
  const p95 = Math.round(latencyMs * 1.35);
  const p99 = Math.round(latencyMs * 1.85);
  const rps = Math.round(Math.min(users * 2.2, cap * 2.5) * saturation);
  const errorPct = overload ? Math.min(35, ((users - cap) / users) * 100) : 0;
  const cpuPct = Math.min(99, Math.round(40 + (users / cap) * 55));
  return {latencyMs, p95, p99, rps, errorPct, cpuPct, overload, cap: Math.round(cap)};
}

let integrationUserSeq = 1;
const integrationStore = new Map();

export function integrationReset() {
  integrationUserSeq = 1;
  integrationStore.clear();
}

export function integrationPostUser({name, email}) {
  if (!name?.trim() || !email?.includes('@')) {
    return {status: 400, body: {detail: 'Некорректные данные'}};
  }
  for (const u of integrationStore.values()) {
    if (u.email === email) {
      return {status: 409, body: {detail: 'Email уже занят'}};
    }
  }
  const id = integrationUserSeq++;
  const row = {id, name: name.trim(), email: email.trim()};
  integrationStore.set(id, row);
  return {status: 201, body: row};
}

export function integrationGetUser(id) {
  const row = integrationStore.get(Number(id));
  if (!row) return {status: 404, body: {detail: 'User not found'}};
  return {status: 200, body: row};
}

export const AAA_STEPS = [
  {id: 'arrange', label: 'Arrange', hint: 'a = 2, b = 3'},
  {id: 'act', label: 'Act', hint: 'result = add(a, b)'},
  {id: 'assert', label: 'Assert', hint: 'result === 5'},
];

export const INTEGRATION_SERVICES = [
  {id: 'orders', label: 'Order API', sends: '{ "item": "book", "qty": 1 }'},
  {id: 'crm', label: 'CRM', sends: 'createLead(userId, total)'},
  {id: 'pay', label: 'Payment', sends: 'charge(orderId, 990)'},
];

export function runIntegrationChain(stepIndex) {
  const msgs = [];
  if (stepIndex >= 0) msgs.push({from: 'Client', to: 'Order API', ok: true, text: 'POST /api/orders'});
  if (stepIndex >= 1) msgs.push({from: 'Order API', to: 'CRM', ok: true, text: 'createLead'});
  if (stepIndex >= 2) {
    msgs.push({
      from: 'CRM',
      to: 'Payment',
      ok: true,
      text: 'charge OK',
    });
  }
  return msgs;
}
