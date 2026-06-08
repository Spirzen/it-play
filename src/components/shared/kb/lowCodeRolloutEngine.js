export const ROLLOUT_STAGES = [
  {
    id: 0,
    title: 'До цифровизации',
    deliverables: ['Бумажные заявки', 'Excel-таблицы', 'Потери и дубли'],
    ui: {form: false, notify: false, table: false, rules: false, integrations: false},
  },
  {
    id: 1,
    title: 'Этап 1: MVP',
    deliverables: ['Веб-форма заказа', 'Уведомление менеджеру', 'Список заявок'],
    ui: {form: true, notify: true, table: true, rules: false, integrations: false},
  },
  {
    id: 2,
    title: 'Этап 2: Анализ и архитектура',
    deliverables: ['Карта процессов', 'Модули CRM/Заказы', 'Интеграционный слой'],
    ui: {form: true, notify: true, table: true, rules: false, integrations: false},
  },
  {
    id: 3,
    title: 'Этап 3: Данные',
    deliverables: ['Таблицы Клиенты/Заказы', 'Связи 1-N', 'Валидация полей'],
    ui: {form: true, notify: true, table: true, rules: false, integrations: false},
  },
  {
    id: 4,
    title: 'Этап 4–5: Процессы и правила',
    deliverables: ['Маршрут согласования', 'Скидки и лимиты', 'SLA этапов'],
    ui: {form: true, notify: true, table: true, rules: true, integrations: false},
  },
  {
    id: 5,
    title: 'Этап 6–8: UI-логика и скрипты',
    deliverables: ['Экраны ролей', 'Кастомные скрипты', 'REST к 1С/почте'],
    ui: {form: true, notify: true, table: true, rules: true, integrations: true},
  },
  {
    id: 6,
    title: 'Этап 9–12: Права, тесты, релиз',
    deliverables: ['RBAC', 'UAT', 'Прод-развёртывание'],
    ui: {form: true, notify: true, table: true, rules: true, integrations: true},
  },
  {
    id: 7,
    title: 'Этап 13–14: Поддержка и развитие',
    deliverables: ['Мониторинг', 'Обратная связь', 'Новые модули'],
    ui: {form: true, notify: true, table: true, rules: true, integrations: true},
  },
];

export const SAMPLE_ORDERS = [
  {id: 101, client: 'ООО Ромашка', sum: 12400, status: 'Новая'},
  {id: 102, client: 'ИП Иванов', sum: 8900, status: 'В работе'},
];
