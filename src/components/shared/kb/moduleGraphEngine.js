/** Граф модулей для демо DIP в архитектуре. */

export const MODULES = [
  {
    id: 'app',
    name: 'app',
    fullName: 'app (main)',
    type: 'entry',
    description: 'Точка входа, оркестрация сценариев',
    icon: '🚀',
    dependencies: ['core', 'notification'],
    usedBy: [],
    x: 200,
    y: 36,
  },
  {
    id: 'core',
    name: 'core',
    fullName: 'core (OrderService)',
    type: 'domain',
    description: 'Доменная логика заказов',
    icon: '🎯',
    dependencies: ['logger'],
    usedBy: ['app'],
    x: 72,
    y: 148,
  },
  {
    id: 'notification',
    name: 'notification',
    fullName: 'notification (Email)',
    type: 'infra',
    description: 'Отправка уведомлений (Email/SMS)',
    icon: '📧',
    dependencies: ['logger'],
    usedBy: ['app'],
    x: 328,
    y: 148,
  },
  {
    id: 'logger',
    name: 'logger',
    fullName: 'logger',
    type: 'shared',
    description: 'Общий модуль логирования',
    icon: '📝',
    dependencies: [],
    usedBy: ['core', 'notification'],
    x: 200,
    y: 248,
  },
];

export const MODE_LABELS = {
  monolith: {
    short: 'Монолит',
    long: 'Монолит — прямые зависимости',
    hint: 'Высокоуровневый app зависит от конкретной реализации notification.',
  },
  dip: {
    short: 'DIP',
    long: 'Компоненты — через абстракции',
    hint: 'app зависит от интерфейсов; реализации подключаются снаружи.',
  },
};

const TYPE_META = {
  entry: {label: 'Точка входа', color: 'var(--mg-entry)'},
  domain: {label: 'Домен', color: 'var(--mg-domain)'},
  infra: {label: 'Инфраструктура', color: 'var(--mg-infra)'},
  shared: {label: 'Общий', color: 'var(--mg-shared)'},
};

export function getTypeMeta(type) {
  return TYPE_META[type] ?? {label: type, color: 'var(--ifm-color-emphasis-500)'};
}

/** Рёбра графа: from → to с типом для стиля. */
export function getGraphEdges(mode) {
  if (mode === 'dip') {
    return [
      {from: 'app', to: 'core', type: 'abstraction', label: 'IOrderService'},
      {from: 'app', to: 'notification', type: 'abstraction', label: 'INotification'},
      {from: 'core', to: 'logger', type: 'direct', label: ''},
      {from: 'notification', to: 'logger', type: 'direct', label: ''},
    ];
  }
  return [
    {from: 'app', to: 'core', type: 'direct', label: ''},
    {from: 'app', to: 'notification', type: 'violation', label: 'нарушение DIP'},
    {from: 'core', to: 'logger', type: 'direct', label: ''},
    {from: 'notification', to: 'logger', type: 'direct', label: ''},
  ];
}

export function getDependenciesForMode(mode, moduleId) {
  if (mode === 'dip' && moduleId === 'app') {
    return [
      {target: 'core', type: 'abstraction', label: 'IOrderService'},
      {target: 'notification', type: 'abstraction', label: 'INotification'},
    ];
  }
  if (mode === 'monolith' && moduleId === 'app') {
    return [
      {target: 'core', type: 'direct', label: 'прямая'},
      {target: 'notification', type: 'violation', label: '❌ DIP'},
    ];
  }
  const mod = MODULES.find((m) => m.id === moduleId);
  return (mod?.dependencies ?? []).map((target) => ({target, type: 'direct', label: ''}));
}

export function getModuleInsight(mode, moduleId) {
  if (moduleId !== 'app') return null;
  if (mode === 'monolith') {
    return {
      variant: 'error',
      title: 'Проблема прямой зависимости',
      body: 'app импортирует конкретный EmailNotification. Замена на SMS потребует правок в app и усложнит тесты.',
    };
  }
  return {
    variant: 'success',
    title: 'Зависимость от абстракций',
    body: 'app знает только INotification и IOrderService. Реализации регистрируются в composition root (DI-контейнер).',
  };
}

export const LEGEND = [
  {type: 'direct', label: 'Прямая зависимость'},
  {type: 'abstraction', label: 'Через интерфейс (DIP)'},
  {type: 'violation', label: 'Нарушение DIP'},
];
