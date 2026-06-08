/** Сценарий из статьи 113: OrderProcessor → ValidateOrder → CheckInventory */
export const CALL_TREE = {
  id: 'main',
  label: 'Main()',
  children: [
    {
      id: 'process',
      label: 'ProcessOrder(order)',
      children: [
        {
          id: 'validate',
          label: 'ValidateOrder(order)',
          children: [
            {id: 'inventory', label: 'CheckInventory(order)', children: []},
            {id: 'customer', label: 'ValidateCustomer(order)', children: []},
          ],
        },
        {id: 'total', label: 'CalculateTotal(order)', children: []},
        {id: 'save', label: 'SaveOrder(order)', children: []},
        {id: 'confirm', label: 'SendConfirmation(order)', children: []},
      ],
    },
  ],
};

export const CALL_STEPS = [
  {id: 0, nodeId: 'main', stack: ['Main()'], note: 'Точка входа программы.'},
  {id: 1, nodeId: 'process', stack: ['Main()', 'ProcessOrder(order)'], note: 'Main вызывает обработку заказа.'},
  {
    id: 2,
    nodeId: 'validate',
    stack: ['Main()', 'ProcessOrder(order)', 'ValidateOrder(order)'],
    note: 'Первая подзадача — валидация.',
  },
  {
    id: 3,
    nodeId: 'inventory',
    stack: [
      'Main()',
      'ProcessOrder(order)',
      'ValidateOrder(order)',
      'CheckInventory(order)',
    ],
    note: 'Самый глубокий фрейм: проверка склада.',
  },
  {
    id: 4,
    nodeId: 'customer',
    stack: ['Main()', 'ProcessOrder(order)', 'ValidateOrder(order)', 'ValidateCustomer(order)'],
    note: 'Возврат на уровень ValidateOrder — второй вызов.',
  },
  {
    id: 5,
    nodeId: 'total',
    stack: ['Main()', 'ProcessOrder(order)', 'CalculateTotal(order)'],
    note: 'ValidateOrder завершён — расчёт суммы.',
  },
  {
    id: 6,
    nodeId: 'save',
    stack: ['Main()', 'ProcessOrder(order)', 'SaveOrder(order)'],
    note: 'Сохранение после расчёта.',
  },
  {
    id: 7,
    nodeId: 'confirm',
    stack: ['Main()', 'ProcessOrder(order)', 'SendConfirmation(order)'],
    note: 'Уведомление клиента.',
  },
  {id: 8, nodeId: 'main', stack: ['Main()'], note: 'ProcessOrder вернул управление в Main.'},
];

export function activeNodeIdsForStep(stepId) {
  const step = CALL_STEPS.find((s) => s.id === stepId);
  if (!step) return new Set();
  const ids = new Set();
  const walk = (node) => {
    if (node.id === step.nodeId) {
      ids.add(node.id);
      return true;
    }
    for (const ch of node.children) {
      if (walk(ch)) {
        ids.add(node.id);
        return true;
      }
    }
    return false;
  };
  walk(CALL_TREE);
  return ids;
}
