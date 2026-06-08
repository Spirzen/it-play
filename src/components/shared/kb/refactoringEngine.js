/** Данные для демо пошагового рефакторинга (мини-проект заказов). */

export const STEPS = [
  {
    id: 0,
    label: 'До рефакторинга',
    short: 'Хаос',
    technique: 'Запахи кода',
    insight:
      'Всё в одном файле: дублирование, магические числа, "божественный" метод и мёртвый код. Поведение работает, но менять страшно.',
    smells: ['Длинный метод', 'Дублирование', 'Магические числа', 'Мёртвый код', 'Неясные имена'],
    metrics: {files: 2, lines: 186, complexity: 28, duplication: 4, smells: 7},
    defaultFile: 'everything.js',
    tree: [
      {path: 'src/', type: 'dir', children: [{path: 'src/everything.js', type: 'file'}, {path: 'src/old_stuff.js', type: 'file'}]},
    ],
  },
  {
    id: 1,
    label: 'Извлечение метода',
    short: 'Методы',
    technique: 'Extract Method',
    insight:
      'Фрагменты расчёта скидки и итога вынесены в отдельные функции. Главный поток читается как сценарий, а не как простыня.',
    smells: ['Длинный метод', 'Дублирование', 'Магические числа', 'Мёртвый код'],
    metrics: {files: 2, lines: 178, complexity: 22, duplication: 3, smells: 5},
    defaultFile: 'src/everything.js',
    tree: [
      {path: 'src/', type: 'dir', children: [{path: 'src/everything.js', type: 'file'}, {path: 'src/old_stuff.js', type: 'file'}]},
    ],
  },
  {
    id: 2,
    label: 'Переименование',
    short: 'Имена',
    technique: 'Rename',
    insight:
      'Переменные и функции отражают предметную область: `calc` → `calculateOrderTotal`, `x` → `lineItems`. Комментарии "что делает код" становятся лишними.',
    smells: ['Дублирование', 'Магические числа', 'Мёртвый код', 'Неясные имена'],
    metrics: {files: 2, lines: 172, complexity: 20, duplication: 3, smells: 4},
    defaultFile: 'src/everything.js',
    tree: [
      {path: 'src/', type: 'dir', children: [{path: 'src/everything.js', type: 'file'}, {path: 'src/old_stuff.js', type: 'file'}]},
    ],
  },
  {
    id: 3,
    label: 'Константы и мёртвый код',
    short: 'Чистка',
    technique: 'Replace Magic Number · Remove Dead Code',
    insight:
      'Числа `0.1` и `3600` заменены константами. Неиспользуемые ветки и файл `old_stuff.js` удалены — меньше шума при поиске.',
    smells: ['Дублирование', 'Мёртвый код'],
    metrics: {files: 1, lines: 148, complexity: 18, duplication: 2, smells: 2},
    defaultFile: 'src/everything.js',
    tree: [{path: 'src/', type: 'dir', children: [{path: 'src/everything.js', type: 'file'}]}],
  },
  {
    id: 4,
    label: 'Выделение класса',
    short: 'Класс',
    technique: 'Extract Class',
    insight:
      'Логика заказа и расчётов перенесены в `Order` и `PricingService`. Файл перестаёт быть "божественным" объектом.',
    smells: ['Дублирование'],
    metrics: {files: 3, lines: 132, complexity: 12, duplication: 1, smells: 1},
    defaultFile: 'src/domain/Order.js',
    tree: [
      {
        path: 'src/',
        type: 'dir',
        children: [
          {
            path: 'src/domain/',
            type: 'dir',
            children: [
              {path: 'src/domain/Order.js', type: 'file'},
              {path: 'src/domain/PricingService.js', type: 'file'},
            ],
          },
          {path: 'src/app.js', type: 'file'},
        ],
      },
    ],
  },
  {
    id: 5,
    label: 'Структура проекта',
    short: 'Папки',
    technique: 'Move · Split Module',
    insight:
      'Код разложен по слоям: domain, application, infrastructure. Границы модулей видны в дереве файлов — проект читается как карта.',
    smells: [],
    metrics: {files: 6, lines: 128, complexity: 9, duplication: 0, smells: 0},
    defaultFile: 'src/application/ProcessOrder.js',
    tree: [
      {
        path: 'src/',
        type: 'dir',
        children: [
          {
            path: 'src/domain/',
            type: 'dir',
            children: [
              {path: 'src/domain/Order.js', type: 'file'},
              {path: 'src/domain/PricingService.js', type: 'file'},
            ],
          },
          {
            path: 'src/application/',
            type: 'dir',
            children: [{path: 'src/application/ProcessOrder.js', type: 'file'}],
          },
          {
            path: 'src/infrastructure/',
            type: 'dir',
            children: [{path: 'src/infrastructure/OrderRepository.js', type: 'file'}],
          },
          {path: 'src/app.js', type: 'file'},
          {path: 'tests/order.test.js', type: 'file'},
        ],
      },
    ],
  },
];

/** @type {Record<number, Record<string, string>>} */
export const FILE_CONTENTS = {
  0: {
    'src/everything.js': `// TODO: когда-нибудь разобрать этот файл
var d = 0.1; // скидка VIP??

function doAll(o, u) {
  var x = o.items;
  var s = 0;
  for (var i = 0; i < x.length; i++) {
    s = s + x[i].p * x[i].q;
  }
  // дубль расчёта — копипаста из exportReport
  var t = 0;
  for (var j = 0; j < x.length; j++) {
    t = t + x[j].p * x[j].q;
  }
  if (u === 'vip') s = s - s * d;
  if (u === 'vip') t = t - t * d; // снова то же
  o.total = s;
  o.reportTotal = t;
  if (o.status === 'DRAFT') o.status = 'OK';
  save(o);
  return s;
}

function exportReport(o, u) {
  var x = o.items;
  var t = 0;
  for (var j = 0; j < x.length; j++) {
    t = t + x[j].p * x[j].q;
  }
  if (u === 'vip') t = t - t * d;
  return { total: t, ts: Date.now() / 3600 };
}

function save(o) { /* db */ }

// мёртвый код — никто не вызывает
function legacyDiscount() { return 0.05; }`,
    'src/old_stuff.js': `// не трогать!!! старый прототип 2019
function unused() { return 42; }`,
  },
  1: {
    'src/everything.js': `var VIP_DISCOUNT = 0.1; // пока магическое

function sumLineItems(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].p * items[i].q;
  }
  return total;
}

function applyVipDiscount(total, userType) {
  if (userType === 'vip') return total - total * VIP_DISCOUNT;
  return total;
}

function doAll(o, u) {
  var subtotal = sumLineItems(o.items);
  o.total = applyVipDiscount(subtotal, u);
  o.reportTotal = applyVipDiscount(sumLineItems(o.items), u);
  if (o.status === 'DRAFT') o.status = 'OK';
  save(o);
  return o.total;
}

function exportReport(o, u) {
  var subtotal = sumLineItems(o.items);
  return { total: applyVipDiscount(subtotal, u), ts: Date.now() / 3600 };
}

function save(o) { /* db */ }
function legacyDiscount() { return 0.05; }`,
    'src/old_stuff.js': `function unused() { return 42; }`,
  },
  2: {
    'src/everything.js': `const VIP_DISCOUNT_RATE = 0.1;

function sumLineItems(lineItems) {
  return lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyVipDiscount(orderTotal, customerTier) {
  if (customerTier === 'vip') {
    return orderTotal - orderTotal * VIP_DISCOUNT_RATE;
  }
  return orderTotal;
}

function processOrder(order, customerTier) {
  const subtotal = sumLineItems(order.lineItems);
  order.total = applyVipDiscount(subtotal, customerTier);
  order.reportTotal = applyVipDiscount(sumLineItems(order.lineItems), customerTier);
  if (order.status === 'DRAFT') order.status = 'CONFIRMED';
  persistOrder(order);
  return order.total;
}

function buildExportReport(order, customerTier) {
  const subtotal = sumLineItems(order.lineItems);
  return {
    total: applyVipDiscount(subtotal, customerTier),
    exportedAtHours: Date.now() / 3600,
  };
}

function persistOrder(order) { /* db */ }
function legacyDiscount() { return 0.05; }`,
    'src/old_stuff.js': `function unused() { return 42; }`,
  },
  3: {
    'src/everything.js': `const VIP_DISCOUNT_RATE = 0.1;
const MS_PER_HOUR = 3600;

function sumLineItems(lineItems) {
  return lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function applyVipDiscount(orderTotal, customerTier) {
  if (customerTier === 'vip') {
    return orderTotal - orderTotal * VIP_DISCOUNT_RATE;
  }
  return orderTotal;
}

function calculateOrderTotal(lineItems, customerTier) {
  return applyVipDiscount(sumLineItems(lineItems), customerTier);
}

function processOrder(order, customerTier) {
  order.total = calculateOrderTotal(order.lineItems, customerTier);
  order.reportTotal = order.total;
  if (order.status === 'DRAFT') order.status = 'CONFIRMED';
  persistOrder(order);
  return order.total;
}

function buildExportReport(order, customerTier) {
  return {
    total: calculateOrderTotal(order.lineItems, customerTier),
    exportedAtHours: Date.now() / MS_PER_HOUR,
  };
}

function persistOrder(order) { /* db */ }`,
  },
  4: {
    'src/domain/Order.js': `export class Order {
  constructor({ id, lineItems, status = 'DRAFT' }) {
    this.id = id;
    this.lineItems = lineItems;
    this.status = status;
    this.total = 0;
  }

  confirm() {
    if (this.status === 'DRAFT') this.status = 'CONFIRMED';
  }
}`,
    'src/domain/PricingService.js': `const VIP_DISCOUNT_RATE = 0.1;

export class PricingService {
  sumLineItems(lineItems) {
    return lineItems.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  applyVipDiscount(total, customerTier) {
    if (customerTier === 'vip') {
      return total - total * VIP_DISCOUNT_RATE;
    }
    return total;
  }

  calculateTotal(lineItems, customerTier) {
    return this.applyVipDiscount(this.sumLineItems(lineItems), customerTier);
  }
}`,
    'src/app.js': `import { Order } from './domain/Order.js';
import { PricingService } from './domain/PricingService.js';

const pricing = new PricingService();

export function processOrder(order, customerTier) {
  order.total = pricing.calculateTotal(order.lineItems, customerTier);
  order.confirm();
  return order.total;
}`,
  },
  5: {
    'src/domain/Order.js': `export class Order {
  constructor({ id, lineItems, status = 'DRAFT' }) {
    this.id = id;
    this.lineItems = lineItems;
    this.status = status;
    this.total = 0;
  }

  confirm() {
    if (this.status === 'DRAFT') this.status = 'CONFIRMED';
  }
}`,
    'src/domain/PricingService.js': `const VIP_DISCOUNT_RATE = 0.1;

export class PricingService {
  calculateTotal(lineItems, customerTier) {
    const subtotal = lineItems.reduce((s, i) => s + i.price * i.quantity, 0);
    if (customerTier === 'vip') {
      return subtotal - subtotal * VIP_DISCOUNT_RATE;
    }
    return subtotal;
  }
}`,
    'src/application/ProcessOrder.js': `import { PricingService } from '../domain/PricingService.js';

export class ProcessOrder {
  constructor(orderRepository, pricing = new PricingService()) {
    this.orders = orderRepository;
    this.pricing = pricing;
  }

  execute(order, customerTier) {
    order.total = this.pricing.calculateTotal(order.lineItems, customerTier);
    order.confirm();
    this.orders.save(order);
    return order.total;
  }
}`,
    'src/infrastructure/OrderRepository.js': `export class OrderRepository {
  save(order) {
    // persistence adapter
    return order.id;
  }
}`,
    'src/app.js': `import { Order } from './domain/Order.js';
import { ProcessOrder } from './application/ProcessOrder.js';
import { OrderRepository } from './infrastructure/OrderRepository.js';

const useCase = new ProcessOrder(new OrderRepository());

export function bootstrap(orderDto, tier) {
  const order = new Order(orderDto);
  return useCase.execute(order, tier);
}`,
    'tests/order.test.js': `import { PricingService } from '../src/domain/PricingService.js';

test('VIP gets 10% discount', () => {
  const pricing = new PricingService();
  const total = pricing.calculateTotal(
    [{ price: 100, quantity: 1 }],
    'vip',
  );
  expect(total).toBe(90);
});`,
  },
};

export function flattenTree(nodes, prefix = '') {
  const out = [];
  for (const node of nodes) {
    if (node.type === 'file') {
      out.push(node.path);
    } else if (node.children) {
      out.push(...flattenTree(node.children));
    }
  }
  return out;
}

export function getStep(stepIndex) {
  const idx = Math.max(0, Math.min(stepIndex, STEPS.length - 1));
  return STEPS[idx];
}

export function getFileContent(stepIndex, filePath) {
  const files = FILE_CONTENTS[stepIndex] ?? FILE_CONTENTS[0];
  return files[filePath] ?? '// файл появится на следующем шаге';
}
