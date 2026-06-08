/** Данные и логика для демо "Наследование" (статья 4-08-oop/4). */

export const CONCEPT_TABS = [
  {
    id: 'subclass',
    label: 'Базовый и подкласс',
    hint: 'Автомобиль наследует поля модель и год и метод запустить() от Транспорт, добавляет своё и может переопределить метод.',
  },
  {
    id: 'override',
    label: 'Переопределение',
    hint: 'Один и тот же метод запустить() в подклассе заменяет реализацию родителя — вызывается версия Автомобиля.',
  },
  {
    id: 'interface',
    label: 'Интерфейс',
    hint: 'Интерфейс задаёт контракт (сигнатуру метода без тела). Класс обязан реализовать все методы интерфейса.',
  },
  {
    id: 'multi',
    label: 'Множественное',
    hint: 'Подкласс может наследовать сразу несколько родителей — методы Двигатель и Колёса доступны в Автомобиле.',
  },
];

export const BASE_TRANSPORT = {
  name: 'Транспорт',
  fields: [
    {key: 'модель', type: 'String'},
    {key: 'год', type: 'int'},
  ],
  methods: [{key: 'запустить', sig: 'запустить()', output: 'Транспорт запущен.'}],
};

export const CAR_CLASS = {
  name: 'Автомобиль',
  extends: 'Транспорт',
  extraFields: [{key: 'количество_колёс', type: 'int'}],
  extraMethods: [{key: 'ехать', sig: 'ехать()', output: 'Автомобиль едет.'}],
  overrideMethods: [
    {
      key: 'запустить',
      sig: 'запустить()',
      parentOutput: 'Транспорт запущен.',
      output: 'Автомобиль запущен!',
    },
  ],
};

export const DEFAULT_CAR = {
  varName: 'машина',
  model: 'Toyota Camry',
  year: 2022,
  wheels: 4,
};

export const STARTABLE_IFACE = {
  name: 'Запускаемый',
  methods: [{key: 'запустить', sig: 'запустить()'}],
};

export const MULTI_PARENTS = [
  {
    id: 'engine',
    name: 'Двигатель',
    method: 'завести()',
    output: 'Двигатель заведён.',
  },
  {
    id: 'wheels',
    name: 'Колёса',
    method: 'повернуть()',
    output: 'Колёса повернуты.',
  },
];

export const MULTI_CAR = {
  name: 'Автомобиль',
  extends: ['Двигатель', 'Колёса'],
  method: 'ехать()',
};

export function createCarState({varName, model, year, wheels}) {
  return {
    varName: varName.trim() || 'машина',
    model: model.trim() || '—',
    year: Number.isFinite(Number(year)) ? Number(year) : new Date().getFullYear(),
    wheels: Number.isFinite(Number(wheels)) ? Number(wheels) : 4,
  };
}

export function runTransportStart() {
  return BASE_TRANSPORT.methods[0].output;
}

export function runCarStart() {
  return CAR_CLASS.overrideMethods[0].output;
}

export function runCarDrive() {
  return CAR_CLASS.extraMethods[0].output;
}

export function runInterfaceStart() {
  return 'Автомобиль запущен.';
}

export function runMultiDrive(logSteps) {
  return {
    steps: logSteps ?? [
      MULTI_PARENTS[0].output,
      MULTI_PARENTS[1].output,
      'Автомобиль едет.',
    ],
    summary: 'завести() → повернуть() → "Автомобиль едет."',
  };
}

export function formatCall(varName, method) {
  return `${varName}.${method}`;
}
