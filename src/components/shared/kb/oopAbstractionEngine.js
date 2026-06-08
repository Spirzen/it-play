/** Данные и логика для демо "Абстракция" (статья 4-08-oop/2). */

export const CONCEPT_TABS = [
  {
    id: 'client',
    label: 'Клиентский код',
    hint: 'Переменная типа Transport ссылается на Car или Airplane — вызываем move() и honk(), не зная деталей двигателя.',
  },
  {
    id: 'hierarchy',
    label: 'Иерархия',
    hint: 'Абстрактный класс задаёт контракт: move() без тела, honk() уже реализован. Наследники обязаны дописать move().',
  },
  {
    id: 'interface',
    label: 'Интерфейс',
    hint: 'Интерфейс — только контракт (все методы абстрактны). Класс может реализовать несколько интерфейсов.',
  },
];

export const TRANSPORT_IMPLS = [
  {
    id: 'car',
    className: 'Car',
    varName: 'car',
    label: 'Машина',
    icon: '🚗',
    presetName: 'Toyota',
    moveOutput: 'Car едет по дороге!',
    moveDetail: 'колёса → асфальт, ДВС, коробка передач',
    honkDetail: 'электромагнит в руле → сигнал "Би-бип!"',
  },
  {
    id: 'airplane',
    className: 'Airplane',
    varName: 'airplane',
    label: 'Самолёт',
    icon: '✈️',
    presetName: 'Boeing 747',
    moveOutput: 'Airplane летит в небе!',
    moveDetail: 'тяга реактивных двигателей, подъёмная сила крыла',
    honkDetail: 'сирена на ВПП (тот же honk(), другой звук)',
  },
];

export const ABSTRACT_TRANSPORT = {
  name: 'Transport',
  fields: [{key: 'name', access: 'private'}],
  abstractMethods: [{key: 'move', sig: 'void move()'}],
  concreteMethods: [{key: 'honk', sig: 'void honk()', body: 'name + " сигналит: Би-бип!"'}],
};

export const FLYABLE_EXAMPLE = {
  iface: 'Flyable',
  ifaceMethod: 'fly()',
  impl: 'Bird',
  flyOutput: 'Лечу как птица!',
  flyDetail: 'взмахи крыльев, аэродинамика',
};

export function getImpl(id) {
  return TRANSPORT_IMPLS.find((t) => t.id === id) ?? TRANSPORT_IMPLS[0];
}

export function runMove(impl) {
  return impl.moveOutput;
}

export function runHonk(impl) {
  return `${impl.presetName} сигналит: Би-бип!`;
}

export function formatClientCall(impl, method) {
  return `${impl.varName}.${method}();`;
}

export function formatTransportDecl(impl) {
  return `Transport ${impl.varName} = new ${impl.className}("${impl.presetName}");`;
}
