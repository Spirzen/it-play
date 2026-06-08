export const DELIVERY_MODELS = [
  {
    id: 'inhouse',
    label: 'In-house',
    timeMonths: [9, 14],
    costIndex: 85,
    control: 95,
    flexibility: 90,
    summary: 'Своя команда: полный контроль, долгий найм и фиксированный ФОТ.',
  },
  {
    id: 'outsource',
    label: 'Аутсорс',
    timeMonths: [6, 10],
    costIndex: 70,
    control: 55,
    flexibility: 75,
    summary: 'Внешний подрядчик: быстрее старт, риски коммуникации и ТЗ.',
  },
  {
    id: 'product',
    label: 'Коробка + доработка',
    timeMonths: [4, 8],
    costIndex: 60,
    control: 45,
    flexibility: 50,
    summary: 'Готовый продукт: быстрый старт, ограничения кастомизации.',
  },
  {
    id: 'lowcode',
    label: 'Low-code / No-code',
    timeMonths: [2, 5],
    costIndex: 45,
    control: 35,
    flexibility: 40,
    summary: 'Визуальная сборка: скорость MVP, потолок сложности и вендор-лок.',
  },
];

export const CIS_PHASES = [
  {id: 'need', label: 'Потребность', tasks: ['Интервью', 'AS-IS', 'Цели автоматизации']},
  {id: 'req', label: 'Требования', tasks: ['Функциональные', 'НФТ', 'Документ ТЗ']},
  {id: 'model', label: 'Модель', tasks: ['In-house / аутсорс / коробка', 'Бюджет', 'Риски']},
  {id: 'design', label: 'Проектирование', tasks: ['Архитектура', 'БД', 'UI-макеты']},
  {id: 'build', label: 'Разработка', tasks: ['Код', 'API', 'Интеграции']},
  {id: 'test', label: 'Тестирование', tasks: ['QA', 'Безопасность', 'Приёмка']},
  {id: 'rollout', label: 'Внедрение', tasks: ['Пилот', 'Обучение', 'Миграция']},
];

export const ROLLOUT_STRATEGIES = [
  {id: 'pilot', label: 'Пилот', risk: 'Низкий', speed: 'Медленно'},
  {id: 'phased', label: 'Поэтапно', risk: 'Средний', speed: 'Средне'},
  {id: 'parallel', label: 'Параллельно', risk: 'Средний', speed: 'Средне'},
  {id: 'bigbang', label: 'Big bang', risk: 'Высокий', speed: 'Быстро'},
];
