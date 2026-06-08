/** Сценарии использования CC BY-NC-SA 4.0 для интерактива лицензии. */

export const LICENSE_SCENARIOS = [
  {
    id: 'read',
    label: 'Читаю на сайте',
    icon: '📖',
    verdict: 'allow',
    summary: 'Свободное чтение и изучение — основной сценарий проекта.',
    requirements: [],
  },
  {
    id: 'cite',
    label: 'Цитирую в статье',
    icon: '✍️',
    verdict: 'allow',
    summary: 'Цитирование разрешено при указании автора и ссылки на источник.',
    requirements: ['by'],
  },
  {
    id: 'edu',
    label: 'Учебная программа',
    icon: '🎓',
    verdict: 'allow',
    summary: 'Некоммерческое образовательное использование в вузе или курсе.',
    requirements: ['by'],
  },
  {
    id: 'fork',
    label: 'Производная работа',
    icon: '🔀',
    verdict: 'allow',
    summary: 'Можно адаптировать материалы, если сохраняете ту же лицензию (ShareAlike).',
    requirements: ['by', 'sa'],
  },
  {
    id: 'offline',
    label: 'Офлайн-копия для себя',
    icon: '💾',
    verdict: 'allow',
    summary: 'Личная офлайн-копия для обучения допустима.',
    requirements: [],
  },
  {
    id: 'commercial',
    label: 'Коммерческий курс',
    icon: '💼',
    verdict: 'contact',
    summary: 'Коммерческое использование требует письменного разрешения автора.',
    requirements: ['by', 'nc'],
  },
  {
    id: 'resell',
    label: 'Продажа PDF/книги',
    icon: '🚫',
    verdict: 'deny',
    summary: 'Перепродажа и коммерческая монетизация контента без согласия запрещены.',
    requirements: ['nc'],
  },
  {
    id: 'strip',
    label: 'Убрать указание автора',
    icon: '⚠️',
    verdict: 'deny',
    summary: 'Удаление атрибуции (BY) нарушает лицензию.',
    requirements: ['by'],
  },
];

export const LICENSE_BADGES = {
  by: {short: 'BY', label: 'Attribution — указать автора и источник'},
  nc: {short: 'NC', label: 'NonCommercial — без коммерции без разрешения'},
  sa: {short: 'SA', label: 'ShareAlike — производные под той же лицензией'},
};

export const CITATION_TEMPLATE = `Источник: Тагиров Т.В. "Вселенная IT" — открытая база знаний
URL: https://spirzen.github.io/it-knowledge-base/
Лицензия: CC BY-NC-SA 4.0`;
