/** Сценарии и исходы для демо неопределённого поведения (образовательная симуляция). */

export const COMPILERS = [
  {id: 'gcc', label: 'GCC', accent: '#4078c0'},
  {id: 'clang', label: 'Clang', accent: '#262626'},
  {id: 'msvc', label: 'MSVC', accent: '#68217a'},
];

export const OPT_LEVELS = [
  {id: 'O0', label: '-O0', hint: 'Без оптимизаций — чаще "терпимое" поведение'},
  {id: 'O2', label: '-O2', hint: 'Агрессивные допущения: UB "не случается"'},
  {id: 'O3', label: '-O3', hint: 'Максимум оптимизаций — сильнее перестройка кода'},
];

export const UB_SCENARIOS = {
  increment: {
    id: 'increment',
    label: '++i + ++i',
    accent: '#e74c3c',
    code: `int i = 1;
i = ++i + ++i;
return i;`,
    hint: 'Две модификации i между точками следования — порядок побочных эффектов не задан стандартом C/C++.',
    articleRef: 'Выражение вида i = ++i + ++i',
  },
  array: {
    id: 'array',
    label: 'Выход за границу',
    accent: '#e67e22',
    code: `int arr[3] = {10, 20, 30};
int x = arr[5];
return x;`,
    hint: 'Чтение за пределами массива — классическое UB в C/C++: авария, мусор или "удачное" число.',
    articleRef: 'обращение к памяти за пределами выделенного массива',
  },
  uninit: {
    id: 'uninit',
    label: 'Неинициализированная',
    accent: '#9b59b6',
    code: `int x;
return x;`,
    hint: 'Чтение переменной до инициализации — содержимое стека/регистра непредсказуемо.',
    articleRef: 'использование переменной до её инициализации',
  },
  overflow: {
    id: 'overflow',
    label: 'Переполнение int',
    accent: '#16a085',
    code: `int x = INT_MAX;
x = x + 1;
return x;`,
    hint: 'Переполнение знакового int в C — неопределённое поведение (в Java — циклическое, в Python — BigInt).',
    articleRef: 'арифметические операции за пределами диапазона',
  },
  optimize: {
    id: 'optimize',
    label: 'Оптимизатор',
    accent: '#2980b9',
    code: `if (size < n) { /* проверка */ }
// ... далее UB ...
// компилятор мог удалить проверку`,
    hint: 'При -O2/-O3 компилятор предполагает отсутствие UB и может удалить "недостижимый" или "лишний" код.',
    articleRef: 'компилятор может удалить участки кода',
  },
};

export const BEHAVIOR_KINDS = {
  defined: {
    id: 'defined',
    label: 'Определённое',
    accent: '#2e7d32',
    code: 'int a = 2, b = 2;\nreturn a + b;',
    hint: 'Спецификация гарантирует результат: всегда 4 при тех же входных данных.',
  },
  unspecified: {
    id: 'unspecified',
    label: 'Неуточняемое',
    accent: '#ed6c02',
    code: 'f() + g();  // порядок вызовов',
    hint: 'Допустимы только описанные варианты (например, f до g или g до f), но выбор не фиксирован.',
  },
  implDefined: {
    id: 'implDefined',
    label: 'Зависит от реализации',
    accent: '#1565c0',
    code: 'sizeof(int);  // документируется реализацией',
    hint: 'На данной платформе результат фиксирован и описан в документации компилятора.',
  },
  undefined: {
    id: 'undefined',
    label: 'Неопределённое',
    accent: '#c62828',
    code: 'arr[100];  // за границей',
    hint: 'Нет гарантий: после UB программа может сделать что угодно.',
  },
};

const INCREMENT_OUTCOMES = [
  {
    value: 5,
    label: 'Результат: 5',
    detail: 'Сначала оба ++i, затем сложение: 2 + 3.',
    severity: 'info',
  },
  {
    value: 4,
    label: 'Результат: 4',
    detail: 'Промежуточные значения ++i чередуются иначе (типично для одного из порядков в старых GCC).',
    severity: 'warning',
  },
  {
    value: 3,
    label: 'Результат: 3',
    detail: 'Другой порядок применения побочных эффектов к одной переменной.',
    severity: 'warning',
  },
  {
    value: 2,
    label: 'Результат: 2',
    detail: 'Редкий, но возможный исход при нестандартном порядке чтения/записи.',
    severity: 'warning',
  },
];

const ARRAY_OUTCOMES = [
  {
    value: 'SIGSEGV',
    label: 'Аварийное завершение',
    detail: 'ОС зафиксировала обращение к недопустимому адресу.',
    severity: 'error',
  },
  {
    value: 0,
    label: 'Вернулось 0',
    detail: 'Память за массивом случайно обнулялась — программа "работает".',
    severity: 'warning',
  },
  {
    value: 738197504,
    label: '"Мусор": 738197504',
    detail: 'Прочитано содержимое соседнего стекового фрейма — похоже на правильный ответ.',
    severity: 'warning',
  },
  {
    value: 42,
    label: 'Вернулось 42',
    detail: 'Внешне корректный результат, но соседняя переменная могла быть повреждена.',
    severity: 'warning',
  },
];

const UNINIT_OUTCOMES = [
  {value: 0, label: 'Значение: 0', detail: 'Стековый слот ранее обнулялся.', severity: 'warning'},
  {
    value: 32767,
    label: 'Значение: 32767',
    detail: 'Остаток данных прошлого вызова функции.',
    severity: 'warning',
  },
  {
    value: -131380480,
    label: 'Значение: -131380480',
    detail: 'Случайный битовый паттерн — тесты могут "проходить" по совпадению.',
    severity: 'error',
  },
];

const OVERFLOW_OUTCOMES = [
  {
    value: -2147483648,
    label: 'INT_MIN (-2147483648)',
    detail: 'На этой платформе сложение "обернулось" — но для signed int в C это всё равно UB.',
    severity: 'warning',
  },
  {
    value: 'trap',
    label: 'Аппаратное исключение',
    detail: 'Процессор/компилятор вставил проверку переполнения.',
    severity: 'error',
  },
  {
    value: 2147483647,
    label: 'Осталось INT_MAX',
    detail: 'Оптимизатор удалил "невозможное" сложение, предполагая отсутствие UB.',
    severity: 'info',
  },
];

const OPTIMIZE_OUTCOMES = [
  {
    value: 'check_removed',
    label: 'Проверка удалена',
    detail: 'Компилятор решил, что size < n всегда ложно после анализа с UB — guard исчез из машинного кода.',
    severity: 'error',
  },
  {
    value: 'check_kept',
    label: 'Проверка сохранена',
    detail: 'Сборка -O0: исходная логика осталась, UB проявится позже.',
    severity: 'info',
  },
  {
    value: 'wrong_path',
    label: 'Выполнен "невозможный" путь',
    detail: 'Оптимизация перестроила CFG — отладчик показывает странный порядок строк.',
    severity: 'error',
  },
];

const NASAL_DEMON = {
  value: '👹 nasal demons',
  label: 'Демоны из носа',
  detail: 'Спецификация не ограничивает результат — ироничный пример из Usenet: "программа вправе сделать что угодно".',
  severity: 'error',
  isDemon: true,
};

const UNSPECIFIED_OUTCOMES = [
  {value: 'f() → g()', label: 'Сначала f(), затем g()', detail: 'Один из допустимых порядков.', severity: 'info'},
  {value: 'g() → f()', label: 'Сначала g(), затем f()', detail: 'Другой допустимый порядок — программа должна быть корректна в обоих случаях.', severity: 'info'},
];

function hashSeed(compiler, opt, scenarioId, runIndex) {
  const s = `${compiler}:${opt}:${scenarioId}:${runIndex}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickOutcome(pool, seed, compiler, opt) {
  const demonChance = opt === 'O3' ? 8 : opt === 'O2' ? 4 : 1;
  if (seed % 97 < demonChance) return NASAL_DEMON;

  let idx = seed % pool.length;
  if (compiler === 'clang') idx = (idx + 1) % pool.length;
  if (compiler === 'msvc') idx = (idx + 2) % pool.length;
  if (opt === 'O2') idx = (idx + 1) % pool.length;
  if (opt === 'O3') idx = (idx + pool.length - 1) % pool.length;
  return pool[idx];
}

/**
 * Симулирует один "запуск" программы с UB.
 * @returns {{ outcome, runIndex, environmentLabel, guarantee: string }}
 */
export function simulateUbRun(scenarioId, {compiler = 'gcc', opt = 'O0', runIndex = 0} = {}) {
  const scenario = UB_SCENARIOS[scenarioId];
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioId}`);

  const seed = hashSeed(compiler, opt, scenarioId, runIndex) + Date.now() % 1000;
  let pool;
  switch (scenarioId) {
    case 'increment':
      pool = INCREMENT_OUTCOMES;
      break;
    case 'array':
      pool = ARRAY_OUTCOMES;
      break;
    case 'uninit':
      pool = UNINIT_OUTCOMES;
      break;
    case 'overflow':
      pool = OVERFLOW_OUTCOMES;
      break;
    case 'optimize':
      pool = opt === 'O0' ? [OPTIMIZE_OUTCOMES[1], OPTIMIZE_OUTCOMES[0]] : [OPTIMIZE_OUTCOMES[0], OPTIMIZE_OUTCOMES[2]];
      break;
    default:
      pool = INCREMENT_OUTCOMES;
  }

  const outcome = pickOutcome(pool, seed, compiler, opt);
  const compilerLabel = COMPILERS.find((c) => c.id === compiler)?.label ?? compiler;
  const optLabel = OPT_LEVELS.find((o) => o.id === opt)?.label ?? opt;

  return {
    scenario,
    outcome,
    runIndex,
    environmentLabel: `${compilerLabel}, ${optLabel}`,
    guarantee: 'Спецификация не гарантирует результат — любой исход допустим.',
    timestamp: new Date().toLocaleTimeString(),
  };
}

export function simulateDefinedRun() {
  return {
    outcome: {value: 4, label: 'Результат: 4', detail: '2 + 2 всегда 4 — правило языка.', severity: 'info'},
    guarantee: 'Определённое поведение: повторные запуски дают тот же результат.',
    timestamp: new Date().toLocaleTimeString(),
  };
}

export function simulateUnspecifiedRun(runIndex = 0) {
  const outcome = UNSPECIFIED_OUTCOMES[runIndex % UNSPECIFIED_OUTCOMES.length];
  return {
    outcome,
    guarantee: 'Неуточняемое: допустимы только перечисленные варианты, выбор — за реализацией.',
    timestamp: new Date().toLocaleTimeString(),
  };
}

export function simulateImplDefinedRun(platformBits = 4) {
  const bits = platformBits === 8 ? 8 : 4;
  return {
    outcome: {
      value: bits,
      label: `sizeof(int) = ${bits}`,
      detail:
        bits === 4
          ? 'На этой платформе int — 4 байта (документировано в руководстве компилятора).'
          : 'На этой платформе int — 8 байт (LP64).',
      severity: 'info',
    },
    guarantee: 'Поведение, зависящее от реализации: на этой системе предсказуемо, между ОС может отличаться.',
    timestamp: new Date().toLocaleTimeString(),
  };
}

export function formatOutcomeValue(value) {
  if (value === 'trap' || value === 'SIGSEGV') return value;
  if (typeof value === 'string') return value;
  return String(value);
}
