/** Шаги сборки ПК для визуального демо. */

export const BUILD_STEPS = [
  {
    id: 'psu',
    order: 1,
    title: 'Блок питания',
    icon: '⚡',
    hint: 'Переключатель 230V, закрепить в нише корпуса',
    parts: ['psu'],
    cables: [],
  },
  {
    id: 'cpu',
    order: 2,
    title: 'Процессор в сокет',
    icon: '🧠',
    hint: 'Совместить метку, не давить — только рычаг сокета',
    parts: ['cpu', 'mb'],
    cables: [],
  },
  {
    id: 'ram',
    order: 3,
    title: 'Оперативная память',
    icon: '📊',
    hint: 'Щелчок фиксаторов, для 2 модулей — слоты A2/B2',
    parts: ['cpu', 'mb', 'ram'],
    cables: [],
  },
  {
    id: 'm2',
    order: 4,
    title: 'SSD M.2',
    icon: '💾',
    hint: 'Под углом 30°, винт-стойка, при необходимости радиатор',
    parts: ['cpu', 'mb', 'ram', 'm2'],
    cables: [],
  },
  {
    id: 'cooler',
    order: 5,
    title: 'Кулер и термопаста',
    icon: '❄️',
    hint: 'Горошина пасты в центр IHS, равномерное давление',
    parts: ['cpu', 'mb', 'ram', 'm2', 'cooler'],
    cables: ['cpu_fan'],
  },
  {
    id: 'mb-mount',
    order: 6,
    title: 'Материнская плата в корпус',
    icon: '🎛️',
    hint: 'Стойки по форм-фактору, затягивать по диагонали',
    parts: ['cpu', 'mb', 'ram', 'm2', 'cooler', 'case'],
    cables: ['cpu_fan'],
  },
  {
    id: 'cables',
    order: 7,
    title: 'Кабели питания',
    icon: '🔌',
    hint: '24-pin ATX + 8-pin EPS, проложить за tray',
    parts: ['cpu', 'mb', 'ram', 'm2', 'cooler', 'case', 'psu'],
    cables: ['cpu_fan', 'atx24', 'eps8'],
  },
  {
    id: 'gpu',
    order: 8,
    title: 'Видеокарта',
    icon: '🎮',
    hint: 'PCIe x16 до щелчка, PCIe power 6+2 pin',
    parts: ['cpu', 'mb', 'ram', 'm2', 'cooler', 'case', 'psu', 'gpu'],
    cables: ['cpu_fan', 'atx24', 'eps8', 'gpu_pwr'],
  },
  {
    id: 'front',
    order: 9,
    title: 'Передняя панель',
    icon: '🔘',
    hint: 'Power SW, USB, HD Audio — по схеме из manual',
    parts: ['cpu', 'mb', 'ram', 'm2', 'cooler', 'case', 'psu', 'gpu'],
    cables: ['cpu_fan', 'atx24', 'eps8', 'gpu_pwr', 'front'],
  },
  {
    id: 'fans',
    order: 10,
    title: 'Вентиляторы корпуса',
    icon: '🌀',
    hint: 'Вдув спереди/снизу, выдув сверху/сзади',
    parts: ['cpu', 'mb', 'ram', 'm2', 'cooler', 'case', 'psu', 'gpu'],
    cables: ['cpu_fan', 'atx24', 'eps8', 'gpu_pwr', 'front', 'sys_fan'],
  },
];

export const PART_LABELS = {
  cpu: 'CPU',
  mb: 'Материнская плата',
  ram: 'RAM',
  m2: 'M.2 SSD',
  cooler: 'Кулер CPU',
  psu: 'Блок питания',
  gpu: 'Видеокарта',
  case: 'Корпус',
};

export function stepProgress(completedIds) {
  const total = BUILD_STEPS.length;
  const done = BUILD_STEPS.filter((s) => completedIds.includes(s.id)).length;
  return {done, total, pct: Math.round((done / total) * 100)};
}
