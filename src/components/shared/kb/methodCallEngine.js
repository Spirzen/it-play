export const METHOD_PHASES = [
  {id: 'prep', label: 'Подготовка', steps: [0, 1, 2, 3]},
  {id: 'call', label: 'Вызов', steps: [4, 5, 6]},
  {id: 'exec', label: 'Выполнение', steps: [7, 8, 9, 10, 11]},
  {id: 'finish', label: 'Завершение', steps: [12, 13, 14]},
  {id: 'extra', label: 'Продвинутое', steps: [15, 16, 17, 18, 19, 20]},
];

export const METHOD_STEPS = [
  {id: 0, title: 'Инициализация', desc: 'Среда выполнения готова: стек, куча, регистры.'},
  {id: 1, title: 'Синтаксис вызова', desc: 'В коде: obj.calculateSum(10, 20). Компилятор проверяет сигнатуру.'},
  {id: 2, title: 'Разрешение метода', desc: 'Поиск calculateSum в VTable объекта.'},
  {id: 3, title: 'Аргументы', desc: 'this, 10 и 20 помещаются в стек / регистры.'},
  {id: 4, title: 'Фрейм стека', desc: 'RSP сдвигается — выделяется место под локальные переменные.'},
  {id: 5, title: 'Сохранение контекста', desc: 'Регистры вызывающего кода сохраняются.'},
  {id: 6, title: 'CALL', desc: 'Адрес возврата в стеке, RIP → начало метода.'},
  {id: 7, title: 'Декодирование', desc: 'CPU разбирает байт-код на микрооперации.'},
  {id: 8, title: 'ALU', desc: '10 + 20 = 30 в арифметико-логическом блоке.'},
  {id: 9, title: 'Память объекта', desc: 'Чтение поля value: base + offset.'},
  {id: 10, title: 'Зависимости', desc: 'Конвейер учитывает порядок инструкций.'},
  {id: 11, title: 'Спекуляция', desc: 'Предсказание ветвления (branch prediction).'},
  {id: 12, title: 'Исключение (опц.)', desc: 'При ошибке — переход к обработчику.'},
  {id: 13, title: 'return', desc: 'Результат 30 записывается в RAX.'},
  {id: 14, title: 'Восстановление', desc: 'Фрейм снят, RSP восстановлен, управление вызывающему.'},
  {id: 15, title: 'JIT', desc: 'Частый вызов — компиляция в нативный код.'},
  {id: 16, title: 'Escape analysis', desc: 'Проверка: объект не "убегает" из метода.'},
  {id: 17, title: 'Поток', desc: 'Выполнение в контексте thread.'},
  {id: 18, title: 'Memory barrier', desc: 'Барьер для согласованности в многопоточности.'},
  {id: 19, title: 'Прерывание', desc: 'Сигнал ОС может прервать выполнение.'},
  {id: 20, title: 'Power management', desc: 'Динамическая частота CPU (опционально).'},
];

const INITIAL_REGISTERS = {RIP: '0x0000', RSP: '0xF000', RAX: '0x0000'};

export function initialMethodState() {
  return {
    step: 0,
    callStack: [],
    heapObjects: [],
    registers: {...INITIAL_REGISTERS},
    activeFrame: null,
    exceptionMode: false,
    pipeline: [],
    jitHot: 0,
  };
}

export function applyMethodStep(state, nextId, options = {}) {
  const {simulateException = false} = options;
  const logs = [];
  let {
    callStack,
    heapObjects,
    registers,
    activeFrame,
    exceptionMode,
    pipeline,
    jitHot,
  } = state;

  const pushLog = (text) => logs.push(text);
  const stepMeta = METHOD_STEPS.find((s) => s.id === nextId);

  switch (nextId) {
    case 1:
      pushLog('Код: obj.calculateSum(10, 20)');
      heapObjects = [{addr: '0x1A40', type: 'Calculator', fields: {value: 0}}];
      break;
    case 2:
      pushLog('VTable → calculateSum @ 0x2000');
      break;
    case 3:
      callStack = [...callStack, {args: ['this→0x1A40', 10, 20], status: 'prepared'}];
      pushLog('Аргументы [this, 10, 20] в стеке');
      break;
    case 4:
      callStack = [...callStack, {locals: [], status: 'frame'}];
      registers = {...registers, RSP: decHex(registers.RSP, 16)};
      pushLog('Новый stack frame, RSP -= 16');
      break;
    case 5:
      pushLog('Контекст вызывающего сохранён');
      break;
    case 6:
      activeFrame = 'calculateSum';
      registers = {...registers, RIP: '0x2000'};
      pipeline = ['fetch', 'decode'];
      pushLog('CALL → переход на 0x2000');
      break;
    case 7:
      pipeline = ['fetch', 'decode', 'execute'];
      pushLog('Конвейер: decode активен');
      break;
    case 8:
      registers = {...registers, RAX: '0x001E'};
      pipeline = ['decode', 'execute', 'writeback'];
      pushLog('ALU: 10 + 20 = 30 (0x1E)');
      break;
    case 9:
      heapObjects = heapObjects.map((o) => ({...o, fields: {...o.fields, value: 30}}));
      pushLog('load [obj+offset] → кэш L1');
      break;
    case 10:
      pushLog('Проверка hazards между инструкциями');
      break;
    case 11:
      pushLog('Branch predictor: taken');
      break;
    case 12:
      if (simulateException) {
        exceptionMode = true;
        pushLog('⚠ ArithmeticException: деление на ноль');
      } else {
        pushLog('Исключений нет — шаг можно пропустить');
      }
      break;
    case 13:
      if (exceptionMode) {
        pushLog('Переход в catch-handler');
      } else {
        pushLog('return 30 → RAX');
      }
      break;
    case 14:
      registers = {...registers, RSP: incHex(registers.RSP, 16)};
      activeFrame = null;
      pipeline = [];
      pushLog('RET: фрейм снят, RIP восстановлен');
      break;
    case 15:
      jitHot += 1;
      pushLog(`JIT tier ${jitHot}: метод инлайнится при hotness ≥ 3`);
      break;
    default:
      pushLog(stepMeta?.desc ?? '');
  }

  return {
    step: nextId,
    callStack,
    heapObjects,
    registers,
    activeFrame,
    exceptionMode,
    pipeline,
    jitHot,
    logs,
  };
}

function decHex(hex, delta) {
  const n = parseInt(hex, 16) - delta;
  return `0x${n.toString(16).toUpperCase().padStart(4, '0')}`;
}

function incHex(hex, delta) {
  const n = parseInt(hex, 16) + delta;
  return `0x${n.toString(16).toUpperCase().padStart(4, '0')}`;
}

export function phaseForStep(stepId) {
  return METHOD_PHASES.find((p) => p.steps.includes(stepId)) ?? METHOD_PHASES[0];
}
