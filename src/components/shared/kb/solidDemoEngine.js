/** Данные и чистая логика для демо SOLID */

export const PRINCIPLES = [
  {
    id: 'srp',
    letter: 'S',
    name: 'Single Responsibility',
    label: 'Единственная ответственность',
    hint: 'У класса — одна причина для изменения.',
    color: '#2e7d32',
  },
  {
    id: 'ocp',
    letter: 'O',
    name: 'Open/Closed',
    label: 'Открытость / закрытость',
    hint: 'Расширяем через новые типы, не правя рабочий код.',
    color: '#1565c0',
  },
  {
    id: 'lsp',
    letter: 'L',
    name: 'Liskov Substitution',
    label: 'Подстановка Лисков',
    hint: 'Подтип не ломает ожидания кода, написанного для базового типа.',
    color: '#6a1b9a',
  },
  {
    id: 'isp',
    letter: 'I',
    name: 'Interface Segregation',
    label: 'Разделение интерфейса',
    hint: 'Клиент не зависит от методов, которые не вызывает.',
    color: '#e65100',
  },
  {
    id: 'dip',
    letter: 'D',
    name: 'Dependency Inversion',
    label: 'Инверсия зависимостей',
    hint: 'Верхний уровень зависит от абстракции, а не от деталей.',
    color: '#00838f',
  },
];

const ORDER_ITEMS = [{name: 'Книга', price: 100}, {name: 'Чехол', price: 50}];

const DISCOUNTS = {
  none: {id: 'none', label: 'Без скидки', factor: 1, badOnly: false, goodOnly: false},
  seasonal: {id: 'seasonal', label: 'Сезонная −10%', factor: 0.9, badOnly: false, goodOnly: false},
  vip: {id: 'vip', label: 'VIP −20%', factor: 0.8, badOnly: false, goodOnly: false},
  promo: {id: 'promo', label: 'Промо −15%', factor: 0.85, badOnly: false, goodOnly: false},
  loyalty: {id: 'loyalty', label: 'Лояльность −25%', factor: 0.75, badOnly: false, goodOnly: true},
};

export function getDiscountOptions(followsSolid) {
  return Object.values(DISCOUNTS).filter((d) => !d.goodOnly || followsSolid);
}

export function orderSubtotal() {
  return ORDER_ITEMS.reduce((s, i) => s + i.price, 0);
}

export function calculateTotal(discountId, followsSolid) {
  const subtotal = orderSubtotal();
  const discount = DISCOUNTS[discountId];
  if (!discount) return {subtotal, total: subtotal, blocked: false};

  if (!followsSolid && discount.goodOnly) {
    return {
      subtotal,
      total: subtotal,
      blocked: true,
      message: 'Новый тип скидки "Лояльность" — придётся дописать ветку в calculate_total().',
    };
  }

  if (!followsSolid && discountId === 'loyalty') {
    return {
      subtotal,
      total: subtotal,
      blocked: true,
      message: 'Тип скидки не описан в if/elif — функцию нужно менять.',
    };
  }

  return {subtotal, total: subtotal * discount.factor, blocked: false, factor: discount.factor};
}

export function registerUser(userName, email, followsSolid) {
  const lines = [];
  if (!followsSolid) {
    lines.push({level: 'info', text: `UserManager.save_user("${userName}") → users.txt`});
    lines.push({level: 'info', text: `UserManager.send_email("${email}", "Welcome!")`});
    lines.push({
      level: 'warn',
      text: 'Один класс меняют и при смене хранилища, и при смене почтового API.',
    });
    return lines;
  }
  lines.push({level: 'ok', text: `UserRepository.save("${userName}")`});
  lines.push({level: 'ok', text: `EmailService.send("${email}", "Welcome!")`});
  lines.push({level: 'ok', text: 'UserManager только координирует — каждый модуль меняется отдельно.'});
  return lines;
}

export function doubleWidth(shapeKind, width, height, followsSolid) {
  const newW = width * 2;
  if (shapeKind === 'rectangle') {
    return {
      width: newW,
      height,
      area: newW * height,
      surprise: false,
      note: 'Высота не менялась — поведение предсказуемо.',
    };
  }

  if (!followsSolid) {
    return {
      width: newW,
      height: newW,
      area: newW * newW,
      surprise: true,
      note: 'Square наследует Rectangle: set_width() меняет и высоту — контракт нарушен.',
    };
  }

  return {
    width: newW,
    height,
    area: newW * height,
    surprise: false,
    note: 'Square реализует Shape отдельно — нет общих сеттеров с Rectangle.',
  };
}

const DEVICE_ACTIONS = {
  print: {label: 'Печать', icon: '🖨️'},
  scan: {label: 'Скан', icon: '📠'},
  fax: {label: 'Факс', icon: '📠'},
};

export function deviceAction(deviceId, action, followsSolid) {
  const meta = DEVICE_ACTIONS[action];
  const doc = 'report.pdf';

  if (deviceId === 'simple' && action !== 'print') {
    if (!followsSolid) {
      return {
        ok: false,
        text: `${meta.icon} SimplePrinter.${action}() → NotImplementedError`,
        hint: 'Класс вынужден реализовать методы IMultiFunctionDevice, которыми не пользуется.',
      };
    }
    return {
      ok: false,
      text: `${meta.icon} У SimplePrinter нет интерфейса ${action === 'scan' ? 'IScanner' : 'IFax'}`,
      hint: 'Клиент запрашивает только IPrinter — лишних методов в контракте нет.',
    };
  }

  const verbs = {print: 'Печать', scan: 'Сканирование', fax: 'Отправка факса'};
  return {
    ok: true,
    text: `${meta.icon} ${verbs[action]}: ${doc}`,
    hint: deviceId === 'allinone' ? 'AllInOne реализует все нужные интерфейсы.' : 'Только IPrinter — без заглушек.',
  };
}

export function placeOrder(notifierId, followsSolid) {
  if (!followsSolid) {
    return {
      lines: [
        {level: 'info', text: 'OrderService.place_order()'},
        {level: 'info', text: 'EmailNotificationService.send("Order placed!")'},
        {level: 'warn', text: 'OrderService скомпилирован под SMTP — SMS потребует правки класса.'},
      ],
      notifierUsed: 'email',
    };
  }

  const channel = notifierId === 'sms' ? 'SMS' : 'Email';
  return {
    lines: [
      {level: 'ok', text: 'OrderService.place_order()'},
      {level: 'ok', text: `${channel}NotificationService.send("Order placed!")`},
      {level: 'ok', text: 'Зависимость от NotificationService — реализацию подставляем снаружи.'},
    ],
    notifierUsed: notifierId,
  };
}

export const CODE_SNIPPETS = {
  srp: {
    bad: `class UserManager:
    def save_user(self, data): ...
    def send_email(self, email, msg): ...`,
    good: `class UserRepository: ...
class EmailService: ...
class UserManager:
    def __init__(self, repo, mailer): ...`,
  },
  ocp: {
    bad: `def calculate_total(items, discount_type):
    if discount_type == "seasonal": ...
    elif discount_type == "vip": ...
    # + новая ветка при каждой скидке`,
    good: `class Discount(ABC):
    def apply(self, amount): ...

def calculate_total(items, discount: Discount):
    return discount.apply(sum(...))`,
  },
  lsp: {
    bad: `class Square(Rectangle):
    def set_width(self, w):
        self.width = self.height = w`,
    good: `class Shape(ABC): ...
class Rectangle(Shape): ...
class Square(Shape): ...`,
  },
  isp: {
    bad: `class SimplePrinter(IMultiFunctionDevice):
    def scan(self): raise NotImplementedError`,
    good: `class SimplePrinter(IPrinter): ...
class AllInOne(IPrinter, IScanner, IFax): ...`,
  },
  dip: {
    bad: `class OrderService:
    def __init__(self):
        self.notifier = EmailNotificationService()`,
    good: `class OrderService:
    def __init__(self, notifier: NotificationService):
        self.notifier = notifier`,
  },
};
