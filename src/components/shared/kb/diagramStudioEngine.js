/** Палитры и шаблоны для интерактивной студии BPMN / UML / C4 */

export const MODES = {
  flow: {id: 'flow', label: 'Архитектура', color: '#f59e0b'},
  bpmn: {id: 'bpmn', label: 'BPMN 2.0', color: '#0ea5e9'},
  uml: {id: 'uml', label: 'UML', color: '#8b5cf6'},
  c4: {id: 'c4', label: 'C4 Model', color: '#10b981'},
};

export const FLOW_PALETTE = [
  {type: 'flow-client', label: 'Клиент', shape: 'rect', w: 110, h: 52},
  {type: 'flow-service', label: 'Сервис', shape: 'rect', w: 130, h: 56},
  {type: 'flow-lb', label: 'Балансировщик', shape: 'rect', w: 140, h: 52},
  {type: 'flow-db', label: 'База данных', shape: 'db', w: 120, h: 72},
  {type: 'flow-queue', label: 'Очередь', shape: 'rect', w: 120, h: 52},
  {type: 'flow-worker', label: 'Воркер', shape: 'rect', w: 100, h: 48},
  {type: 'flow-gateway', label: 'API Gateway', shape: 'rect', w: 120, h: 52},
  {type: 'flow-port', label: 'Порт / интерфейс', shape: 'diamond', w: 72, h: 72},
];

export const BPMN_PALETTE = [
  {type: 'bpmn-start', label: 'Старт', shape: 'circle', w: 56, h: 56},
  {type: 'bpmn-task', label: 'Задача', shape: 'rect', w: 120, h: 64},
  {type: 'bpmn-gateway', label: 'Шлюз XOR', shape: 'diamond', w: 72, h: 72},
  {type: 'bpmn-end', label: 'Конец', shape: 'circle-thick', w: 56, h: 56},
  {type: 'bpmn-lane', label: 'Дорожка', shape: 'lane', w: 280, h: 100},
];

export const UML_DIAGRAM_TYPES = [
  {id: 'usecase', label: 'Use Case'},
  {id: 'class', label: 'Классы'},
  {id: 'sequence', label: 'Последовательность'},
];

export const UML_PALETTE = {
  usecase: [
    {type: 'uml-actor', label: 'Актёр', shape: 'actor', w: 64, h: 96},
    {type: 'uml-usecase', label: 'Use case', shape: 'ellipse', w: 130, h: 56},
    {type: 'uml-system', label: 'Система', shape: 'frame', w: 200, h: 160},
  ],
  class: [
    {type: 'uml-class', label: 'Класс', shape: 'class', w: 140, h: 100},
    {type: 'uml-interface', label: 'Интерфейс', shape: 'interface', w: 140, h: 90},
    {type: 'uml-note', label: 'Заметка', shape: 'note', w: 100, h: 60},
  ],
  sequence: [
    {type: 'uml-lifeline', label: 'Объект', shape: 'lifeline', w: 90, h: 200},
    {type: 'uml-message', label: 'Сообщение', shape: 'message', w: 160, h: 32},
  ],
};

export const C4_LEVELS = [
  {id: 'context', label: 'Context', desc: 'Система и внешние акторы'},
  {id: 'container', label: 'Containers', desc: 'Приложения, БД, очереди'},
  {id: 'component', label: 'Components', desc: 'Модули внутри контейнера'},
];

export const C4_PALETTE = {
  context: [
    {type: 'c4-person', label: 'Пользователь', shape: 'person', w: 100, h: 80},
    {type: 'c4-system', label: 'Система', shape: 'system', w: 160, h: 90},
    {type: 'c4-ext', label: 'Внешняя система', shape: 'system-ext', w: 160, h: 90},
  ],
  container: [
    {type: 'c4-container', label: 'Контейнер', shape: 'container', w: 150, h: 80},
    {type: 'c4-db', label: 'База данных', shape: 'db', w: 130, h: 80},
    {type: 'c4-queue', label: 'Очередь', shape: 'queue', w: 130, h: 70},
  ],
  component: [
    {type: 'c4-component', label: 'Компонент', shape: 'component', w: 140, h: 72},
  ],
};

export const BPMN_TEMPLATES = {
  secureSdlc: {
    label: 'Secure SDLC: моделирование угроз',
    nodes: [
      {id: 's1', type: 'bpmn-start', label: 'Проектирование', x: 40, y: 80},
      {id: 't1', type: 'bpmn-task', label: 'Моделирование угроз', x: 160, y: 68},
      {id: 'g1', type: 'bpmn-gateway', label: 'Риски?', x: 320, y: 68},
      {id: 't2', type: 'bpmn-task', label: 'Меры защиты', x: 420, y: 40},
      {id: 't3', type: 'bpmn-task', label: 'Утверждение архитектуры', x: 420, y: 120},
      {id: 'e1', type: 'bpmn-end', label: 'Начало кода', x: 580, y: 80},
    ],
    edges: [
      {from: 's1', to: 't1'},
      {from: 't1', to: 'g1'},
      {from: 'g1', to: 't2', label: 'да'},
      {from: 'g1', to: 't3', label: 'нет'},
      {from: 't2', to: 't3'},
      {from: 't3', to: 'e1'},
    ],
  },
  order: {
    label: 'Обработка заказа',
    nodes: [
      {id: 's1', type: 'bpmn-start', label: 'Заказ создан', x: 40, y: 80},
      {id: 't1', type: 'bpmn-task', label: 'Проверить оплату', x: 140, y: 68},
      {id: 'g1', type: 'bpmn-gateway', label: '', x: 300, y: 68},
      {id: 't2', type: 'bpmn-task', label: 'Собрать заказ', x: 400, y: 40},
      {id: 't3', type: 'bpmn-task', label: 'Уведомить клиента', x: 400, y: 120},
      {id: 'e1', type: 'bpmn-end', label: 'Завершено', x: 560, y: 80},
    ],
    edges: [
      {from: 's1', to: 't1'},
      {from: 't1', to: 'g1'},
      {from: 'g1', to: 't2', label: 'оплачен'},
      {from: 'g1', to: 't3', label: 'отмена'},
      {from: 't2', to: 'e1'},
      {from: 't3', to: 'e1'},
    ],
  },
};

export const UML_TEMPLATES = {
  auth: {
    label: 'Авторизация (Use Case)',
    umlType: 'usecase',
    nodes: [
      {id: 'a1', type: 'uml-actor', label: 'Пользователь', x: 40, y: 60},
      {id: 'uc1', type: 'uml-usecase', label: 'Войти в систему', x: 200, y: 50},
      {id: 'uc2', type: 'uml-usecase', label: 'Восстановить пароль', x: 200, y: 130},
    ],
    edges: [
      {from: 'a1', to: 'uc1'},
      {from: 'a1', to: 'uc2'},
    ],
  },
};

export const C4_TEMPLATES = {
  shop: {
    label: 'Интернет-магазин (Context)',
    level: 'context',
    nodes: [
      {id: 'p1', type: 'c4-person', label: 'Покупатель', x: 40, y: 80},
      {id: 'sys', type: 'c4-system', label: 'Shop API', x: 220, y: 70},
      {id: 'pay', type: 'c4-ext', label: 'Платёжный шлюз', x: 420, y: 80},
    ],
    edges: [
      {from: 'p1', to: 'sys', label: 'оформляет заказ'},
      {from: 'sys', to: 'pay', label: 'оплата'},
    ],
  },
  orders: {
    label: 'Заказы (Container)',
    level: 'container',
    nodes: [
      {id: 'cust', type: 'c4-person', label: 'Покупатель', x: 30, y: 70},
      {id: 'web', type: 'c4-container', label: 'Веб-интерфейс', x: 180, y: 50},
      {id: 'api', type: 'c4-container', label: 'Order API', x: 360, y: 50},
      {id: 'odb', type: 'c4-db', label: 'Order DB', x: 360, y: 150},
      {id: 'inv', type: 'c4-container', label: 'Inventory Service', x: 540, y: 50},
    ],
    edges: [
      {from: 'cust', to: 'web', label: 'Использует'},
      {from: 'web', to: 'api', label: 'HTTP/JSON'},
      {from: 'api', to: 'odb', label: 'Чтение/запись'},
      {from: 'api', to: 'inv', label: 'gRPC'},
    ],
  },
};

export const FLOW_TEMPLATES = {
  horizontalLb: {
    label: 'Балансировщик + узлы',
    nodes: [
      {id: 'c', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 110, h: 52, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик', x: 200, y: 96, w: 140, h: 52, shape: 'rect'},
      {id: 'n1', type: 'flow-service', label: 'Узел 1', x: 400, y: 40, w: 100, h: 48, shape: 'rect'},
      {id: 'n2', type: 'flow-service', label: 'Узел 2', x: 400, y: 100, w: 100, h: 48, shape: 'rect'},
      {id: 'n3', type: 'flow-service', label: 'Узел 3', x: 400, y: 160, w: 100, h: 48, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'БД / кэш', x: 560, y: 88, w: 120, h: 72, shape: 'db'},
    ],
    edges: [
      {from: 'c', to: 'lb'},
      {from: 'lb', to: 'n1'},
      {from: 'lb', to: 'n2'},
      {from: 'lb', to: 'n3'},
      {from: 'n1', to: 'db'},
      {from: 'n2', to: 'db'},
      {from: 'n3', to: 'db'},
    ],
  },
  messageQueue: {
    label: 'Очередь + воркеры',
    nodes: [
      {id: 'p', type: 'flow-client', label: 'Продюсер', x: 40, y: 90, w: 110, h: 52, shape: 'rect'},
      {id: 'q', type: 'flow-queue', label: 'Очередь', x: 200, y: 90, w: 120, h: 52, shape: 'rect'},
      {id: 'w1', type: 'flow-worker', label: 'Воркер 1', x: 380, y: 40, w: 100, h: 48, shape: 'rect'},
      {id: 'w2', type: 'flow-worker', label: 'Воркер 2', x: 380, y: 100, w: 100, h: 48, shape: 'rect'},
      {id: 'w3', type: 'flow-worker', label: 'Воркер 3', x: 380, y: 160, w: 100, h: 48, shape: 'rect'},
    ],
    edges: [
      {from: 'p', to: 'q'},
      {from: 'q', to: 'w1'},
      {from: 'q', to: 'w2'},
      {from: 'q', to: 'w3'},
    ],
  },
  sharding: {
    label: 'Шардинг',
    nodes: [
      {id: 'app', type: 'flow-client', label: 'Приложение', x: 40, y: 100, w: 110, h: 52, shape: 'rect'},
      {id: 'rt', type: 'flow-gateway', label: 'Роутер шардов', x: 200, y: 96, w: 130, h: 52, shape: 'rect'},
      {id: 's1', type: 'flow-db', label: 'Шард A', x: 400, y: 40, w: 110, h: 72, shape: 'db'},
      {id: 's2', type: 'flow-db', label: 'Шард B', x: 400, y: 130, w: 110, h: 72, shape: 'db'},
      {id: 's3', type: 'flow-db', label: 'Шард C', x: 400, y: 220, w: 110, h: 72, shape: 'db'},
    ],
    edges: [
      {from: 'app', to: 'rt'},
      {from: 'rt', to: 's1'},
      {from: 'rt', to: 's2'},
      {from: 'rt', to: 's3'},
    ],
  },
  microservices: {
    label: 'Микросервисы',
    nodes: [
      {id: 'web', type: 'flow-client', label: 'Веб-клиент', x: 30, y: 90, w: 110, h: 52, shape: 'rect'},
      {id: 'gw', type: 'flow-gateway', label: 'API Gateway', x: 170, y: 90, w: 120, h: 52, shape: 'rect'},
      {id: 'us', type: 'flow-service', label: 'Users', x: 340, y: 40, w: 110, h: 48, shape: 'rect'},
      {id: 'ord', type: 'flow-service', label: 'Orders', x: 340, y: 110, w: 110, h: 48, shape: 'rect'},
      {id: 'udb', type: 'flow-db', label: 'users DB', x: 500, y: 30, w: 100, h: 64, shape: 'db'},
      {id: 'odb', type: 'flow-db', label: 'orders DB', x: 500, y: 110, w: 100, h: 64, shape: 'db'},
    ],
    edges: [
      {from: 'web', to: 'gw'},
      {from: 'gw', to: 'us'},
      {from: 'gw', to: 'ord'},
      {from: 'us', to: 'udb'},
      {from: 'ord', to: 'odb'},
    ],
  },
  layered: {
    label: 'Слоистая архитектура',
    nodes: [
      {id: 'pres', type: 'flow-service', label: 'Презентация', x: 80, y: 40, w: 160, h: 48, shape: 'rect'},
      {id: 'app', type: 'flow-service', label: 'Приложение', x: 80, y: 110, w: 160, h: 48, shape: 'rect'},
      {id: 'port', type: 'flow-port', label: 'IRepository', x: 80, y: 180, w: 72, h: 72, shape: 'diamond'},
      {id: 'infra', type: 'flow-service', label: 'Инфраструктура', x: 80, y: 270, w: 160, h: 48, shape: 'rect'},
    ],
    edges: [
      {from: 'pres', to: 'app', label: 'зависит'},
      {from: 'app', to: 'port'},
      {from: 'infra', to: 'port', label: 'реализует'},
    ],
  },
  localArch: {
    label: 'Локальная архитектура',
    nodes: [
      {id: 'root', type: 'flow-service', label: 'Локальное приложение', x: 200, y: 30, w: 180, h: 52, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'Встроенная БД', x: 80, y: 120, w: 120, h: 64, shape: 'db'},
      {id: 'logic', type: 'flow-service', label: 'Логика', x: 220, y: 120, w: 110, h: 48, shape: 'rect'},
      {id: 'stor', type: 'flow-service', label: 'Локальное хранилище', x: 360, y: 120, w: 140, h: 48, shape: 'rect'},
      {id: 'bound', type: 'flow-port', label: 'Нет сети', x: 220, y: 210, w: 72, h: 72, shape: 'diamond'},
    ],
    edges: [
      {from: 'root', to: 'db'},
      {from: 'root', to: 'logic'},
      {from: 'root', to: 'stor'},
      {from: 'root', to: 'bound'},
    ],
  },
  fileServer: {
    label: 'Файл-сервер',
    nodes: [
      {id: 'fs', type: 'flow-service', label: 'Файловый сервер', x: 220, y: 30, w: 150, h: 52, shape: 'rect'},
      {id: 'c1', type: 'flow-client', label: 'Клиент A', x: 40, y: 120, w: 100, h: 48, shape: 'rect'},
      {id: 'c2', type: 'flow-client', label: 'Клиент B', x: 40, y: 190, w: 100, h: 48, shape: 'rect'},
      {id: 'file', type: 'flow-db', label: 'Общий файл', x: 220, y: 140, w: 120, h: 64, shape: 'db'},
      {id: 'r1', type: 'flow-port', label: 'Конфликты', x: 400, y: 110, w: 72, h: 72, shape: 'diamond'},
    ],
    edges: [
      {from: 'c1', to: 'file', label: 'R/W'},
      {from: 'c2', to: 'file', label: 'R/W'},
      {from: 'file', to: 'fs'},
      {from: 'file', to: 'r1'},
    ],
  },
  clientServerOverview: {
    label: 'Клиент-сервер',
    nodes: [
      {id: 'cli', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 100, h: 48, shape: 'rect'},
      {id: 'srv', type: 'flow-service', label: 'Сервер', x: 220, y: 90, w: 120, h: 56, shape: 'rect'},
      {id: 'mon', type: 'flow-service', label: 'Монолит', x: 400, y: 40, w: 100, h: 44, shape: 'rect'},
      {id: 'soa', type: 'flow-service', label: 'SOA', x: 400, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'ms', type: 'flow-service', label: 'Микросервисы', x: 400, y: 160, w: 120, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'cli', to: 'srv', label: 'запрос'},
      {from: 'srv', to: 'cli', label: 'ответ'},
      {from: 'srv', to: 'mon'},
      {from: 'srv', to: 'soa'},
      {from: 'srv', to: 'ms'},
    ],
  },
  monolith: {
    label: 'Монолит',
    nodes: [
      {id: 'm', type: 'flow-service', label: 'Монолит (единый процесс)', x: 180, y: 30, w: 200, h: 52, shape: 'rect'},
      {id: 'req', type: 'flow-service', label: 'Обработка запросов', x: 60, y: 120, w: 140, h: 44, shape: 'rect'},
      {id: 'logic', type: 'flow-service', label: 'Бизнес-логика', x: 220, y: 120, w: 120, h: 44, shape: 'rect'},
      {id: 'da', type: 'flow-service', label: 'Доступ к данным', x: 360, y: 120, w: 120, h: 44, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'Единая БД', x: 220, y: 210, w: 120, h: 64, shape: 'db'},
    ],
    edges: [
      {from: 'm', to: 'req'},
      {from: 'm', to: 'logic'},
      {from: 'm', to: 'da'},
      {from: 'da', to: 'db'},
    ],
  },
  twoTier: {
    label: 'Двухзвенная',
    nodes: [
      {id: 'fat', type: 'flow-client', label: 'Толстый клиент', x: 40, y: 90, w: 140, h: 52, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'БД + процедуры', x: 260, y: 90, w: 130, h: 64, shape: 'db'},
    ],
    edges: [{from: 'fat', to: 'db', label: 'прямое соединение'}],
  },
  threeTier: {
    label: 'Трёхзвенная',
    nodes: [
      {id: 'pres', type: 'flow-client', label: 'Презентация (SPA)', x: 80, y: 40, w: 150, h: 48, shape: 'rect'},
      {id: 'app', type: 'flow-service', label: 'Уровень приложения', x: 80, y: 120, w: 150, h: 48, shape: 'rect'},
      {id: 'data', type: 'flow-db', label: 'Уровень данных', x: 80, y: 200, w: 130, h: 64, shape: 'db'},
    ],
    edges: [
      {from: 'pres', to: 'app', label: 'HTTP/API'},
      {from: 'app', to: 'data'},
    ],
  },
  soa: {
    label: 'SOA + ESB',
    nodes: [
      {id: 'esb', type: 'flow-gateway', label: 'Enterprise Service Bus', x: 200, y: 90, w: 160, h: 52, shape: 'rect'},
      {id: 's1', type: 'flow-service', label: 'Сервис A', x: 40, y: 40, w: 110, h: 44, shape: 'rect'},
      {id: 's2', type: 'flow-service', label: 'Сервис B', x: 40, y: 140, w: 110, h: 44, shape: 'rect'},
      {id: 's3', type: 'flow-service', label: 'Сервис C', x: 40, y: 240, w: 110, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 's1', to: 'esb'},
      {from: 's2', to: 'esb'},
      {from: 's3', to: 'esb'},
    ],
  },
  microservicesIsolated: {
    label: 'Микросервисы (свои БД)',
    nodes: [
      {id: 's1', type: 'flow-service', label: 'Сервис A', x: 40, y: 50, w: 110, h: 48, shape: 'rect'},
      {id: 's2', type: 'flow-service', label: 'Сервис B', x: 220, y: 50, w: 110, h: 48, shape: 'rect'},
      {id: 's3', type: 'flow-service', label: 'Сервис C', x: 400, y: 50, w: 110, h: 48, shape: 'rect'},
      {id: 'd1', type: 'flow-db', label: 'БД A', x: 50, y: 140, w: 90, h: 60, shape: 'db'},
      {id: 'd2', type: 'flow-db', label: 'БД B', x: 230, y: 140, w: 90, h: 60, shape: 'db'},
      {id: 'd3', type: 'flow-db', label: 'БД C', x: 410, y: 140, w: 90, h: 60, shape: 'db'},
    ],
    edges: [
      {from: 's1', to: 'd1'},
      {from: 's2', to: 'd2'},
      {from: 's3', to: 'd3'},
      {from: 's1', to: 's2', label: 'API'},
      {from: 's2', to: 's3', label: 'события'},
    ],
  },
  hexagonal: {
    label: 'Гексагон (Ports & Adapters)',
    nodes: [
      {id: 'core', type: 'flow-service', label: 'Ядро', x: 220, y: 100, w: 120, h: 56, shape: 'rect'},
      {id: 'p1', type: 'flow-port', label: 'IUserRepo', x: 220, y: 200, w: 72, h: 72, shape: 'diamond'},
      {id: 'a1', type: 'flow-client', label: 'HTTP', x: 40, y: 80, w: 90, h: 44, shape: 'rect'},
      {id: 'a2', type: 'flow-service', label: 'SqlRepo', x: 400, y: 200, w: 100, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'a1', to: 'p1'},
      {from: 'core', to: 'p1'},
      {from: 'a2', to: 'p1', label: 'реализует'},
    ],
  },
  cleanArchitecture: {
    label: 'Чистая архитектура',
    nodes: [
      {id: 'ent', type: 'flow-service', label: 'Entities', x: 200, y: 30, w: 120, h: 44, shape: 'rect'},
      {id: 'uc', type: 'flow-service', label: 'Use Cases', x: 200, y: 90, w: 120, h: 44, shape: 'rect'},
      {id: 'adp', type: 'flow-service', label: 'Adapters', x: 200, y: 150, w: 120, h: 44, shape: 'rect'},
      {id: 'drv', type: 'flow-service', label: 'Frameworks', x: 200, y: 210, w: 120, h: 44, shape: 'rect'},
      {id: 'ifc', type: 'flow-port', label: 'IRepository', x: 60, y: 150, w: 72, h: 72, shape: 'diamond'},
    ],
    edges: [
      {from: 'uc', to: 'ent'},
      {from: 'adp', to: 'uc'},
      {from: 'drv', to: 'adp'},
      {from: 'drv', to: 'ifc', label: 'реализует'},
      {from: 'adp', to: 'ifc'},
    ],
  },
  eventDriven: {
    label: 'Event-Driven',
    nodes: [
      {id: 'prod', type: 'flow-service', label: 'OrderService', x: 40, y: 90, w: 120, h: 48, shape: 'rect'},
      {id: 'bus', type: 'flow-queue', label: 'Шина (Kafka)', x: 200, y: 90, w: 130, h: 52, shape: 'rect'},
      {id: 'c1', type: 'flow-worker', label: 'Inventory', x: 380, y: 40, w: 110, h: 44, shape: 'rect'},
      {id: 'c2', type: 'flow-worker', label: 'Notify', x: 380, y: 100, w: 100, h: 44, shape: 'rect'},
      {id: 'c3', type: 'flow-worker', label: 'Analytics', x: 380, y: 160, w: 100, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'prod', to: 'bus'},
      {from: 'bus', to: 'c1'},
      {from: 'bus', to: 'c2'},
      {from: 'bus', to: 'c3'},
    ],
  },
  componentBased: {
    label: 'Компонентная сборка',
    nodes: [
      {id: 'sys', type: 'flow-gateway', label: 'Система', x: 220, y: 30, w: 120, h: 52, shape: 'rect'},
      {id: 'c1', type: 'flow-service', label: 'Компонент A', x: 60, y: 130, w: 120, h: 48, shape: 'rect'},
      {id: 'c2', type: 'flow-service', label: 'Компонент B', x: 220, y: 130, w: 120, h: 48, shape: 'rect'},
      {id: 'c3', type: 'flow-service', label: 'Компонент C', x: 380, y: 130, w: 120, h: 48, shape: 'rect'},
    ],
    edges: [
      {from: 'c1', to: 'sys'},
      {from: 'c2', to: 'sys'},
      {from: 'c3', to: 'sys'},
      {from: 'c1', to: 'c2', label: 'контракт'},
      {from: 'c2', to: 'c3', label: 'контракт'},
    ],
  },
  modularSystem: {
    label: 'Модульная система (СЭД)',
    nodes: [
      {id: 'hub', type: 'flow-gateway', label: 'СЭД', x: 220, y: 30, w: 120, h: 52, shape: 'rect'},
      {id: 'm1', type: 'flow-service', label: 'Ввод заявок', x: 40, y: 120, w: 110, h: 44, shape: 'rect'},
      {id: 'm2', type: 'flow-service', label: 'Согласование', x: 160, y: 120, w: 110, h: 44, shape: 'rect'},
      {id: 'm3', type: 'flow-service', label: 'Хранение', x: 280, y: 120, w: 100, h: 44, shape: 'rect'},
      {id: 'm4', type: 'flow-service', label: 'Уведомления', x: 400, y: 120, w: 110, h: 44, shape: 'rect'},
      {id: 'm5', type: 'flow-service', label: 'Интеграции', x: 220, y: 200, w: 110, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'hub', to: 'm1'},
      {from: 'hub', to: 'm2'},
      {from: 'hub', to: 'm3'},
      {from: 'hub', to: 'm4'},
      {from: 'hub', to: 'm5'},
    ],
  },
  archLevels: {
    label: 'Уровни архитектуры',
    nodes: [
      {id: 'f', type: 'flow-service', label: 'Функционал', x: 200, y: 30, w: 130, h: 44, shape: 'rect'},
      {id: 'd', type: 'flow-service', label: 'Предметная область', x: 200, y: 90, w: 160, h: 44, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'Прикладная архитектура', x: 200, y: 150, w: 170, h: 44, shape: 'rect'},
      {id: 't', type: 'flow-service', label: 'Технологии', x: 200, y: 210, w: 130, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'f', to: 'd'},
      {from: 'd', to: 'a'},
      {from: 'a', to: 't'},
    ],
  },
  networkDmz: {
    label: 'Сеть и DMZ',
    nodes: [
      {id: 'u', type: 'flow-client', label: 'Пользователь', x: 40, y: 90, w: 110, h: 48, shape: 'rect'},
      {id: 'fw', type: 'flow-port', label: 'Firewall', x: 180, y: 90, w: 72, h: 72, shape: 'diamond'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик', x: 300, y: 90, w: 120, h: 48, shape: 'rect'},
      {id: 'w1', type: 'flow-service', label: 'Web 1', x: 460, y: 50, w: 90, h: 44, shape: 'rect'},
      {id: 'w2', type: 'flow-service', label: 'Web 2', x: 460, y: 120, w: 90, h: 44, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'БД', x: 460, y: 200, w: 90, h: 60, shape: 'db'},
    ],
    edges: [
      {from: 'u', to: 'fw'},
      {from: 'fw', to: 'lb'},
      {from: 'lb', to: 'w1'},
      {from: 'lb', to: 'w2'},
      {from: 'w1', to: 'db'},
      {from: 'w2', to: 'db'},
    ],
  },
  scalingApiStack: {
    label: 'Масштабируемый API-стек',
    nodes: [
      {id: 'api', type: 'flow-gateway', label: 'API (облако)', x: 200, y: 30, w: 140, h: 52, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'Database', x: 80, y: 120, w: 110, h: 64, shape: 'db'},
      {id: 'stor1', type: 'flow-service', label: 'Storage 1', x: 220, y: 120, w: 100, h: 44, shape: 'rect'},
      {id: 'stor2', type: 'flow-service', label: 'Storage 2', x: 340, y: 120, w: 100, h: 44, shape: 'rect'},
      {id: 'srv', type: 'flow-service', label: 'Server', x: 220, y: 200, w: 110, h: 48, shape: 'rect'},
    ],
    edges: [
      {from: 'api', to: 'db'},
      {from: 'api', to: 'stor1'},
      {from: 'api', to: 'stor2'},
      {from: 'api', to: 'srv'},
      {from: 'db', to: 'srv'},
      {from: 'stor1', to: 'srv'},
    ],
  },
  clientGatewayStack: {
    label: 'Клиент → Gateway → сервисы',
    nodes: [
      {id: 'cli', type: 'flow-client', label: 'Клиентское приложение', x: 30, y: 90, w: 130, h: 52, shape: 'rect'},
      {id: 'rp', type: 'flow-lb', label: 'Nginx / Reverse Proxy', x: 190, y: 90, w: 150, h: 52, shape: 'rect'},
      {id: 'gw', type: 'flow-gateway', label: 'API Gateway', x: 370, y: 90, w: 120, h: 52, shape: 'rect'},
      {id: 'auth', type: 'flow-service', label: 'Сервис авторизации', x: 530, y: 40, w: 130, h: 48, shape: 'rect'},
      {id: 'biz', type: 'flow-service', label: 'Бизнес-сервис', x: 530, y: 110, w: 120, h: 48, shape: 'rect'},
      {id: 'udb', type: 'flow-db', label: 'БД пользователей', x: 700, y: 30, w: 110, h: 60, shape: 'db'},
      {id: 'mdb', type: 'flow-db', label: 'Основная БД', x: 700, y: 110, w: 100, h: 60, shape: 'db'},
      {id: 'mq', type: 'flow-queue', label: 'Message Broker', x: 530, y: 190, w: 120, h: 48, shape: 'rect'},
      {id: 'notify', type: 'flow-worker', label: 'Уведомления', x: 700, y: 190, w: 110, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'cli', to: 'rp', label: 'HTTP/HTTPS'},
      {from: 'rp', to: 'gw'},
      {from: 'gw', to: 'auth'},
      {from: 'gw', to: 'biz'},
      {from: 'auth', to: 'udb'},
      {from: 'biz', to: 'mdb'},
      {from: 'biz', to: 'mq', label: 'событие'},
      {from: 'mq', to: 'notify'},
    ],
  },
  apiGatewayMesh: {
    label: 'API Gateway и event mesh',
    nodes: [
      {id: 'gw', type: 'flow-gateway', label: 'API Gateway', x: 40, y: 90, w: 120, h: 52, shape: 'rect'},
      {id: 'auth', type: 'flow-service', label: 'Аутентификация', x: 220, y: 30, w: 120, h: 44, shape: 'rect'},
      {id: 'users', type: 'flow-service', label: 'Пользователи', x: 220, y: 90, w: 110, h: 44, shape: 'rect'},
      {id: 'orders', type: 'flow-service', label: 'Заказы', x: 220, y: 150, w: 100, h: 44, shape: 'rect'},
      {id: 'catalog', type: 'flow-service', label: 'Каталог', x: 220, y: 210, w: 100, h: 44, shape: 'rect'},
      {id: 'kafka', type: 'flow-queue', label: 'Kafka / RabbitMQ', x: 400, y: 150, w: 130, h: 52, shape: 'rect'},
      {id: 'notify', type: 'flow-worker', label: 'Уведомления', x: 580, y: 90, w: 110, h: 44, shape: 'rect'},
      {id: 'analytics', type: 'flow-worker', label: 'Аналитика', x: 580, y: 150, w: 100, h: 44, shape: 'rect'},
      {id: 'logs', type: 'flow-worker', label: 'Логирование', x: 580, y: 210, w: 110, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'gw', to: 'auth'},
      {from: 'gw', to: 'users'},
      {from: 'gw', to: 'orders'},
      {from: 'gw', to: 'catalog'},
      {from: 'orders', to: 'kafka'},
      {from: 'users', to: 'kafka'},
      {from: 'catalog', to: 'kafka'},
      {from: 'kafka', to: 'notify'},
      {from: 'kafka', to: 'analytics'},
      {from: 'kafka', to: 'logs'},
    ],
  },
  eventTransportLayer: {
    label: 'Транспортный слой событий',
    nodes: [
      {id: 'src', type: 'flow-service', label: 'Источник события', x: 30, y: 90, w: 130, h: 48, shape: 'rect'},
      {id: 'broker', type: 'flow-queue', label: 'Брокер (Kafka/NATS)', x: 200, y: 70, w: 140, h: 52, shape: 'rect'},
      {id: 'topics', type: 'flow-port', label: 'Топики / очереди', x: 200, y: 150, w: 72, h: 72, shape: 'diamond'},
      {id: 'guar', type: 'flow-port', label: 'Гарантии доставки', x: 360, y: 70, w: 72, h: 72, shape: 'diamond'},
      {id: 'sub1', type: 'flow-worker', label: 'Обработка', x: 480, y: 40, w: 100, h: 44, shape: 'rect'},
      {id: 'sub2', type: 'flow-worker', label: 'Аналитика', x: 480, y: 100, w: 100, h: 44, shape: 'rect'},
      {id: 'sub3', type: 'flow-worker', label: 'Аудит', x: 480, y: 160, w: 90, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'src', to: 'broker', label: 'публикация'},
      {from: 'broker', to: 'topics'},
      {from: 'broker', to: 'guar'},
      {from: 'broker', to: 'sub1'},
      {from: 'broker', to: 'sub2'},
      {from: 'broker', to: 'sub3'},
    ],
  },
  gofAdapter: {
    label: 'Паттерн Adapter',
    nodes: [
      {id: 'client', type: 'flow-client', label: 'Client', x: 40, y: 90, w: 90, h: 44, shape: 'rect'},
      {id: 'target', type: 'flow-port', label: 'Target', x: 180, y: 90, w: 72, h: 72, shape: 'diamond'},
      {id: 'adapter', type: 'flow-service', label: 'Adapter', x: 320, y: 50, w: 100, h: 44, shape: 'rect'},
      {id: 'adaptee', type: 'flow-service', label: 'Adaptee', x: 320, y: 130, w: 100, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'client', to: 'target', label: 'использует'},
      {from: 'adapter', to: 'target', label: 'реализует'},
      {from: 'adapter', to: 'adaptee', label: 'делегирует'},
    ],
  },
  signalRHub: {
    label: 'SignalR Hub',
    nodes: [
      {id: 'c1', type: 'flow-client', label: 'Клиент 1', x: 30, y: 40, w: 90, h: 44, shape: 'rect'},
      {id: 'c2', type: 'flow-client', label: 'Клиент 2', x: 30, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'cn', type: 'flow-client', label: 'Клиент N', x: 30, y: 160, w: 90, h: 44, shape: 'rect'},
      {id: 'hub', type: 'flow-gateway', label: 'SignalR Hub', x: 200, y: 90, w: 130, h: 52, shape: 'rect'},
      {id: 'logic', type: 'flow-service', label: 'Бизнес-логика', x: 200, y: 200, w: 120, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c1', to: 'hub', label: 'WS/SSE'},
      {from: 'c2', to: 'hub'},
      {from: 'cn', to: 'hub'},
      {from: 'hub', to: 'c1', label: 'push'},
      {from: 'hub', to: 'c2'},
      {from: 'logic', to: 'hub'},
    ],
  },
  polyglotPipeline: {
    label: 'Polyglot: Python → Java → C#',
    nodes: [
      {id: 'cli', type: 'flow-client', label: 'Клиент / API GW', x: 30, y: 90, w: 120, h: 52, shape: 'rect'},
      {id: 'py', type: 'flow-service', label: 'Python: заявки', x: 190, y: 50, w: 130, h: 48, shape: 'rect'},
      {id: 'java', type: 'flow-service', label: 'Java: заказы', x: 190, y: 130, w: 120, h: 48, shape: 'rect'},
      {id: 'csharp', type: 'flow-worker', label: 'C#: уведомления', x: 380, y: 130, w: 130, h: 48, shape: 'rect'},
      {id: 'db', type: 'flow-db', label: 'PostgreSQL', x: 360, y: 40, w: 110, h: 64, shape: 'db'},
      {id: 'mq', type: 'flow-queue', label: 'RabbitMQ', x: 360, y: 200, w: 100, h: 48, shape: 'rect'},
    ],
    edges: [
      {from: 'cli', to: 'py', label: 'REST POST'},
      {from: 'py', to: 'db'},
      {from: 'java', to: 'db'},
      {from: 'java', to: 'mq'},
      {from: 'mq', to: 'csharp'},
      {from: 'csharp', to: 'cli', label: 'notify'},
    ],
  },
  pointToPointMesh: {
    label: 'Point-to-Point (mesh)',
    nodes: [
      {id: 'a', type: 'flow-service', label: 'Сервис А', x: 40, y: 90, w: 100, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервис Б', x: 200, y: 40, w: 100, h: 44, shape: 'rect'},
      {id: 'c', type: 'flow-service', label: 'Сервис В', x: 200, y: 140, w: 100, h: 44, shape: 'rect'},
      {id: 'd', type: 'flow-service', label: 'Сервис Г', x: 360, y: 90, w: 100, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'a', to: 'b', label: 'API'},
      {from: 'a', to: 'c', label: 'API'},
      {from: 'b', to: 'c', label: 'API'},
      {from: 'b', to: 'd', label: 'API'},
      {from: 'c', to: 'd', label: 'API'},
    ],
  },
  integrationEventBus: {
    label: 'Событийная шина (Kafka)',
    nodes: [
      {id: 'a', type: 'flow-service', label: 'Сервис А', x: 40, y: 40, w: 100, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервис Б', x: 40, y: 110, w: 100, h: 44, shape: 'rect'},
      {id: 'c', type: 'flow-service', label: 'Сервис В', x: 40, y: 180, w: 100, h: 44, shape: 'rect'},
      {id: 'bus', type: 'flow-queue', label: 'Шина событий (Kafka)', x: 220, y: 90, w: 150, h: 52, shape: 'rect'},
      {id: 'd', type: 'flow-worker', label: 'Сервис Г', x: 420, y: 40, w: 100, h: 44, shape: 'rect'},
      {id: 'e', type: 'flow-worker', label: 'Сервис Д', x: 420, y: 110, w: 100, h: 44, shape: 'rect'},
      {id: 'f', type: 'flow-worker', label: 'Сервис Е', x: 420, y: 180, w: 100, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'a', to: 'bus', label: 'publish'},
      {from: 'b', to: 'bus'},
      {from: 'c', to: 'bus'},
      {from: 'bus', to: 'd'},
      {from: 'bus', to: 'e'},
      {from: 'bus', to: 'f'},
    ],
  },
  k8sIngressStack: {
    label: 'Kubernetes: Ingress и сервисы',
    nodes: [
      {id: 'ing', type: 'flow-gateway', label: 'Ingress', x: 220, y: 30, w: 110, h: 48, shape: 'rect'},
      {id: 'fe', type: 'flow-client', label: 'Frontend (Angular)', x: 80, y: 120, w: 140, h: 48, shape: 'rect'},
      {id: 'be', type: 'flow-service', label: 'Backend', x: 260, y: 120, w: 120, h: 48, shape: 'rect'},
      {id: 'wrk', type: 'flow-worker', label: 'Workers (KEDA)', x: 420, y: 120, w: 120, h: 48, shape: 'rect'},
      {id: 'data', type: 'flow-db', label: 'Данные', x: 260, y: 210, w: 100, h: 64, shape: 'db'},
    ],
    edges: [
      {from: 'ing', to: 'fe'},
      {from: 'ing', to: 'be'},
      {from: 'be', to: 'wrk'},
      {from: 'be', to: 'data'},
      {from: 'wrk', to: 'data'},
    ],
  },
  dockerLifecycle: {
    label: 'Жизненный цикл Docker-образа',
    nodes: [
      {id: 'ctr', type: 'flow-service', label: 'Контейнер', x: 40, y: 90, w: 110, h: 48, shape: 'rect'},
      {id: 'img', type: 'flow-service', label: 'Образ', x: 200, y: 90, w: 90, h: 48, shape: 'rect'},
      {id: 'local', type: 'flow-db', label: 'Локальное хранилище', x: 360, y: 50, w: 150, h: 64, shape: 'db'},
      {id: 'reg', type: 'flow-gateway', label: 'Docker Registry / Hub', x: 360, y: 150, w: 160, h: 52, shape: 'rect'},
      {id: 'df', type: 'flow-client', label: 'Dockerfile', x: 200, y: 180, w: 100, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'ctr', to: 'img', label: 'из образа'},
      {from: 'img', to: 'local'},
      {from: 'local', to: 'reg', label: 'push/pull'},
      {from: 'reg', to: 'local', label: 'pull'},
      {from: 'df', to: 'img', label: 'build'},
    ],
  },
  k8sHierarchy: {
    label: 'Иерархия Kubernetes',
    nodes: [
      {id: 'cluster', type: 'flow-gateway', label: 'Кластер', x: 200, y: 30, w: 110, h: 48, shape: 'rect'},
      {id: 'node', type: 'flow-service', label: 'Узел (Node)', x: 200, y: 110, w: 120, h: 48, shape: 'rect'},
      {id: 'pod', type: 'flow-service', label: 'Под (Pod)', x: 200, y: 190, w: 110, h: 48, shape: 'rect'},
      {id: 'ctr', type: 'flow-worker', label: 'Контейнер(ы)', x: 200, y: 270, w: 120, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'cluster', to: 'node', label: 'состоит из'},
      {from: 'node', to: 'pod', label: 'запускает'},
      {from: 'pod', to: 'ctr', label: 'содержит'},
    ],
  },
  messengerRelay: {
    label: 'Мессенджер: клиенты и сервер',
    nodes: [
      {id: 'm', type: 'flow-client', label: 'Клиент-смартфон', x: 30, y: 40, w: 120, h: 44, shape: 'rect'},
      {id: 'pc', type: 'flow-client', label: 'Клиент-ПК', x: 30, y: 100, w: 100, h: 44, shape: 'rect'},
      {id: 'web', type: 'flow-client', label: 'Веб-клиент', x: 30, y: 160, w: 100, h: 44, shape: 'rect'},
      {id: 'srv', type: 'flow-gateway', label: 'Сервер', x: 220, y: 100, w: 110, h: 52, shape: 'rect'},
    ],
    edges: [
      {from: 'm', to: 'srv', label: 'данные'},
      {from: 'srv', to: 'm', label: 'ответ'},
      {from: 'pc', to: 'srv'},
      {from: 'srv', to: 'pc'},
      {from: 'web', to: 'srv'},
      {from: 'srv', to: 'web'},
      {from: 'srv', to: 'm', label: 'пересылка'},
      {from: 'srv', to: 'pc', label: 'пересылка'},
    ],
  },
  lbRoundRobin: {
    label: 'Round-Robin',
    nodes: [
      {id: 'c', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик (Round-Robin)', x: 180, y: 96, w: 180, h: 52, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'Сервер A', x: 420, y: 40, w: 90, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервер B', x: 420, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 's', type: 'flow-service', label: 'Сервер C', x: 420, y: 160, w: 90, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c', to: 'lb'},
      {from: 'lb', to: 'a', label: 'A→B→C'},
      {from: 'lb', to: 'b'},
      {from: 'lb', to: 's'},
    ],
  },
  lbLeastConnections: {
    label: 'Least Connections',
    nodes: [
      {id: 'c', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик (Least Connections)', x: 160, y: 96, w: 200, h: 52, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'Сервер A (5 соед.)', x: 420, y: 40, w: 130, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервер B (2 соед.)', x: 420, y: 100, w: 130, h: 44, shape: 'rect'},
      {id: 's', type: 'flow-service', label: 'Сервер C (7 соед.)', x: 420, y: 160, w: 130, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c', to: 'lb'},
      {from: 'lb', to: 'b', label: 'мин. соединений'},
    ],
  },
  lbWeightedRR: {
    label: 'Weighted Round-Robin',
    nodes: [
      {id: 'c', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик (WRR)', x: 180, y: 96, w: 170, h: 52, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'Сервер A (вес 3)', x: 400, y: 40, w: 120, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервер B (вес 2)', x: 400, y: 100, w: 120, h: 44, shape: 'rect'},
      {id: 's', type: 'flow-service', label: 'Сервер C (вес 1)', x: 400, y: 160, w: 120, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c', to: 'lb'},
      {from: 'lb', to: 'a', label: '3×A'},
      {from: 'lb', to: 'b', label: '2×B'},
      {from: 'lb', to: 's', label: '1×C'},
    ],
  },
  lbWeightedLC: {
    label: 'Weighted Least Connections',
    nodes: [
      {id: 'c', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик (WLC)', x: 160, y: 96, w: 180, h: 52, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'A: 6/3=2.0', x: 400, y: 40, w: 110, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'B: 3/2=1.5', x: 400, y: 100, w: 110, h: 44, shape: 'rect'},
      {id: 's', type: 'flow-service', label: 'C: 2/1=2.0', x: 400, y: 160, w: 110, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c', to: 'lb'},
      {from: 'lb', to: 'b', label: 'соед./вес'},
    ],
  },
  lbIpHash: {
    label: 'IP Hash',
    nodes: [
      {id: 'c1', type: 'flow-client', label: 'Клиент 192.168.1.10', x: 30, y: 60, w: 150, h: 44, shape: 'rect'},
      {id: 'c2', type: 'flow-client', label: 'Клиент 192.168.1.11', x: 30, y: 130, w: 150, h: 44, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик (IP Hash)', x: 220, y: 96, w: 170, h: 52, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'Сервер A', x: 440, y: 40, w: 90, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервер B', x: 440, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 's', type: 'flow-service', label: 'Сервер C', x: 440, y: 160, w: 90, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c1', to: 'lb'},
      {from: 'c2', to: 'lb'},
      {from: 'lb', to: 'a', label: 'hash→A'},
      {from: 'lb', to: 'b', label: 'hash→B'},
    ],
  },
  lbRandom: {
    label: 'Random',
    nodes: [
      {id: 'c', type: 'flow-client', label: 'Клиент', x: 40, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 'lb', type: 'flow-lb', label: 'Балансировщик (Random)', x: 180, y: 96, w: 170, h: 52, shape: 'rect'},
      {id: 'a', type: 'flow-service', label: 'Сервер A', x: 400, y: 40, w: 90, h: 44, shape: 'rect'},
      {id: 'b', type: 'flow-service', label: 'Сервер B', x: 400, y: 100, w: 90, h: 44, shape: 'rect'},
      {id: 's', type: 'flow-service', label: 'Сервер C', x: 400, y: 160, w: 90, h: 44, shape: 'rect'},
    ],
    edges: [
      {from: 'c', to: 'lb'},
      {from: 'lb', to: 'a', label: 'случайно'},
      {from: 'lb', to: 'b'},
      {from: 'lb', to: 's'},
    ],
  },
};

let nodeSeq = 0;
export function nextNodeId(prefix = 'n') {
  nodeSeq += 1;
  return `${prefix}-${nodeSeq}`;
}

export function getPalette(mode, subMode) {
  if (mode === 'flow') return FLOW_PALETTE;
  if (mode === 'bpmn') return BPMN_PALETTE;
  if (mode === 'uml') return UML_PALETTE[subMode] || UML_PALETTE.usecase;
  if (mode === 'c4') return C4_PALETTE[subMode] || C4_PALETTE.context;
  return [];
}

export function getDefaultSubMode(mode) {
  if (mode === 'uml') return 'usecase';
  if (mode === 'c4') return 'context';
  return null;
}

export function createNodeFromPalette(item, x, y) {
  return {
    id: nextNodeId(item.type.split('-')[0]),
    type: item.type,
    label: item.label,
    x: Math.round(x / 20) * 20,
    y: Math.round(y / 20) * 20,
    w: item.w,
    h: item.h,
    shape: item.shape,
  };
}

export function loadTemplate(mode, key) {
  const map =
    mode === 'flow'
      ? FLOW_TEMPLATES
      : mode === 'bpmn'
        ? BPMN_TEMPLATES
        : mode === 'uml'
          ? UML_TEMPLATES
          : C4_TEMPLATES;
  const tpl = map[key];
  if (!tpl) return {nodes: [], edges: [], subMode: getDefaultSubMode(mode)};
  return {
    nodes: tpl.nodes.map((n) => ({...n})),
    edges: tpl.edges.map((e) => ({...e})),
    subMode: tpl.umlType || tpl.level || getDefaultSubMode(mode),
  };
}

export function exportMermaid(mode, nodes, edges, subMode) {
  if (mode === 'flow') {
    const lines = ['flowchart TD'];
    nodes.forEach((n) => {
      const id = n.id.replace(/-/g, '_');
      if (n.type === 'flow-db') lines.push(`  ${id}[("${n.label}")]`);
      else if (n.type === 'flow-port') lines.push(`  ${id}{${n.label}}`);
      else lines.push(`  ${id}["${n.label}"]`);
    });
    edges.forEach((e) => {
      const lbl = e.label ? `|${e.label}|` : '';
      lines.push(`  ${e.from.replace(/-/g, '_')} -->${lbl} ${e.to.replace(/-/g, '_')}`);
    });
    return lines.join('\n');
  }

  if (mode === 'c4' && (subMode === 'context' || subMode === 'container')) {
    const people = nodes.filter((n) => n.type === 'c4-person');
    const containers = nodes.filter((n) => n.type === 'c4-container' || n.type === 'c4-component');
    const dbs = nodes.filter((n) => n.type === 'c4-db');
    const systems = nodes.filter(
      (n) =>
        n.type.startsWith('c4-') &&
        n.type !== 'c4-person' &&
        n.type !== 'c4-container' &&
        n.type !== 'c4-component' &&
        n.type !== 'c4-db',
    );
    const header = subMode === 'container' ? 'C4Container' : 'C4Context';
    const lines = [header, '  title Диаграмма'];
    people.forEach((p) => lines.push(`  Person(${p.id}, "${p.label}")`));
    systems.forEach((s) => {
      const fn = s.type === 'c4-ext' ? 'System_Ext' : 'System';
      lines.push(`  ${fn}(${s.id}, "${s.label}")`);
    });
    containers.forEach((c) =>
      lines.push(`  Container(${c.id}, "${c.label}", "")`),
    );
    dbs.forEach((d) => lines.push(`  ContainerDb(${d.id}, "${d.label}", "")`));
    edges.forEach((e) => {
      const lbl = e.label ? `, "${e.label}"` : '';
      lines.push(`  Rel(${e.from}, ${e.to}${lbl})`);
    });
    return lines.join('\n');
  }

  if (mode === 'uml' && subMode === 'usecase') {
    const lines = ['flowchart LR'];
    nodes.forEach((n) => {
      const id = n.id.replace(/-/g, '_');
      if (n.type === 'uml-actor') lines.push(`  ${id}(["👤 ${n.label}"])`);
      else if (n.type === 'uml-usecase') lines.push(`  ${id}(("${n.label}"))`);
      else lines.push(`  ${id}["${n.label}"]`);
    });
    edges.forEach((e) => {
      const lbl = e.label ? `|${e.label}|` : '';
      lines.push(`  ${e.from.replace(/-/g, '_')} -->${lbl} ${e.to.replace(/-/g, '_')}`);
    });
    return lines.join('\n');
  }

  if (mode === 'bpmn') {
    const lines = ['flowchart LR'];
    nodes.forEach((n) => {
      const id = n.id.replace(/-/g, '_');
      if (n.type === 'bpmn-start') lines.push(`  ${id}(("${n.label || 'Старт'}"))`);
      else if (n.type === 'bpmn-end') lines.push(`  ${id}(["${n.label || 'Конец'}"])`);
      else if (n.type === 'bpmn-gateway') lines.push(`  ${id}{${n.label || '?'}}`);
      else lines.push(`  ${id}["${n.label}"]`);
    });
    edges.forEach((e) => {
      const lbl = e.label ? `|${e.label}|` : '';
      lines.push(`  ${e.from.replace(/-/g, '_')} -->${lbl} ${e.to.replace(/-/g, '_')}`);
    });
    return lines.join('\n');
  }

  return `%% ${mode} / ${subMode}\n${nodes.map((n) => `${n.type}: ${n.label}`).join('\n')}`;
}

/** Краткий справочник BPMN для статьи 129 */
export const BPMN_REFERENCE = [
  {id: 'start', category: 'События', name: 'Start Event', class: 'bpmn:startEvent', hint: 'Тонкая граница, белая заливка'},
  {id: 'end', category: 'События', name: 'End Event', class: 'bpmn:endEvent', hint: 'Жирная граница'},
  {id: 'timer', category: 'События', name: 'Timer', class: 'timerEventDefinition', hint: 'PT30M, timeCycle'},
  {id: 'message', category: 'События', name: 'Message', class: 'messageEventDefinition', hint: 'messageRef на объявление'},
  {id: 'task', category: 'Действия', name: 'User Task', class: 'bpmn:userTask', hint: 'assignee, candidateGroups'},
  {id: 'service', category: 'Действия', name: 'Service Task', class: 'bpmn:serviceTask', hint: 'REST, delegateExpression'},
  {id: 'subprocess', category: 'Действия', name: 'Subprocess', class: 'bpmn:subProcess', hint: 'collapsed для декомпозиции'},
  {id: 'xor', category: 'Шлюзы', name: 'Exclusive Gateway', class: 'bpmn:exclusiveGateway', hint: 'Один исходящий поток'},
  {id: 'and', category: 'Шлюзы', name: 'Parallel Gateway', class: 'bpmn:parallelGateway', hint: 'Все ветки параллельно'},
  {id: 'or', category: 'Шлюзы', name: 'Inclusive Gateway', class: 'bpmn:inclusiveGateway', hint: 'Один или несколько путей'},
  {id: 'pool', category: 'Зоны', name: 'Pool', class: 'bpmn:participant', hint: 'Участник процесса'},
  {id: 'lane', category: 'Зоны', name: 'Lane', class: 'bpmn:lane', hint: 'Роль внутри пула'},
  {id: 'data', category: 'Артефакты', name: 'Data Object', class: 'bpmn:dataObject', hint: 'Входные/выходные данные'},
  {id: 'annotation', category: 'Артефакты', name: 'Text Annotation', class: 'bpmn:textAnnotation', hint: 'Пояснение без семантики'},
];
