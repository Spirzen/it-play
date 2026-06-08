/** Данные для интерактивных демо раздела техподдержки. */

export const SUPPORT_TASKS = [
  {
    id: 'fix',
    label: 'Решение проблем',
    icon: '🔍',
    items: ['Диагностика', 'Устранение неполадок', 'Эскалация'],
  },
  {
    id: 'uptime',
    label: 'Бесперебойность',
    icon: '🛡️',
    items: ['Профилактика', 'Резервное копирование', 'Масштабирование'],
  },
  {
    id: 'edu',
    label: 'Обучение',
    icon: '📚',
    items: ['Инструкции', 'Вебинары', 'Внедрение'],
  },
  {
    id: 'feedback',
    label: 'Обратная связь',
    icon: '📊',
    items: ['Анализ запросов', 'Передача в разработку', 'Оценка сервиса'],
  },
  {
    id: 'cx',
    label: 'Клиентский опыт',
    icon: '🤝',
    items: ['Коммуникация', 'Честность сроков', 'Персонализация B2B'],
  },
];

export const SUPPORT_CHANNELS = [
  {
    id: 'phone',
    label: 'Телефон',
    speed: 95,
    detail: 35,
    async: false,
    hint: 'Быстро для простых вопросов, сложно показать экран',
  },
  {
    id: 'email',
    label: 'Почта',
    speed: 40,
    detail: 90,
    async: true,
    hint: 'История переписки, не мгновенно',
  },
  {
    id: 'chat',
    label: 'Онлайн-чат',
    speed: 85,
    detail: 75,
    async: false,
    hint: 'Файлы и скриншоты в реальном времени',
  },
  {
    id: 'ticket',
    label: 'Тикеты',
    speed: 55,
    detail: 95,
    async: true,
    hint: 'Структура и SLA, регистрация занимает время',
  },
  {
    id: 'social',
    label: 'Соцсети',
    speed: 70,
    detail: 45,
    async: false,
    hint: 'Публичные жалобы — быстрая реакция бренда',
  },
  {
    id: 'kb',
    label: 'База знаний',
    speed: 100,
    detail: 60,
    async: true,
    hint: '24/7 самообслуживание, не для уникальных кейсов',
  },
];

export const TICKET_FLOW_STEPS = [
  {
    id: 'create',
    label: 'Создание тикета',
    icon: '📝',
    detail: 'CRM-2047 · категория "Авторизация" · приоритет "Средний"',
    kbMatch: null,
  },
  {
    id: 'kb',
    label: 'Поиск в KB',
    icon: '📖',
    detail: 'NLP ищет похожие обращения — найдена статья на 78%',
    kbMatch: 78,
  },
  {
    id: 'assign',
    label: 'Назначение L1',
    icon: '🎧',
    detail: 'Маршрутизация в очередь Helpdesk',
    kbMatch: null,
  },
  {
    id: 'diag',
    label: 'Глубокая диагностика',
    icon: '🔬',
    detail: 'Логи, тестовая среда, метрики — воспроизведение сбоя',
    kbMatch: null,
  },
  {
    id: 'rca',
    label: 'Root Cause Analysis',
    icon: '🌳',
    detail: 'Причина: баг API checkout · эскалация в разработку',
    kbMatch: null,
  },
  {
    id: 'close',
    label: 'Закрытие',
    icon: '✅',
    detail: 'Уведомление клиента · обновление базы знаний',
    kbMatch: 100,
  },
];

export const RCA_CAUSES = [
  {id: 'user', label: 'Ошибка пользователя', pct: 22},
  {id: 'bug', label: 'Баг в коде', pct: 18},
  {id: 'infra', label: 'Сбой инфраструктуры', pct: 12},
  {id: 'compat', label: 'Совместимость', pct: 15},
  {id: 'docs', label: 'Недостаток документации', pct: 33},
];

export const KB_ARTICLES = [
  {
    id: 'auth',
    tags: ['авторизация', 'пароль', 'вход', 'логин'],
    title: 'Восстановление доступа к аккаунту',
    solve: 'Сброс пароля через email → проверка спама → смена на новый',
  },
  {
    id: 'form',
    tags: ['форма', 'отправ', 'ошибка'],
    title: 'Форма не отправляется',
    solve: 'Проверьте обязательные поля и соединение',
  },
  {
    id: 'pay',
    tags: ['оплата', 'платёж', 'карта'],
    title: 'Не прошла оплата',
    solve: 'Повторите попытку · проверьте реквизиты · банк',
  },
  {
    id: 'slow',
    tags: ['медленно', 'тормоз', 'производительность'],
    title: 'Система работает медленно',
    solve: 'Очистка кэша · L2 при сохранении проблемы',
  },
];

export const KB_COMPONENTS = [
  {id: 'cats', label: 'Категории', icon: '📁'},
  {id: 'articles', label: 'Статьи / FAQ', icon: '📄'},
  {id: 'search', label: 'Поиск', icon: '🔎'},
  {id: 'bot', label: 'Чат-бот', icon: '🤖'},
  {id: 'meta', label: 'Теги и метаданные', icon: '🏷️'},
  {id: 'versions', label: 'Версии', icon: '🔄'},
];

export const ITSM_BLOCKS = [
  {
    id: 'catalog',
    label: 'Каталог услуг',
    icon: '📋',
    processes: ['Service Catalog', 'SLM / SLA'],
  },
  {
    id: 'incident',
    label: 'Инциденты',
    icon: '🚨',
    processes: ['Incident Mgmt', 'Problem Mgmt', 'Event Mgmt'],
  },
  {
    id: 'change',
    label: 'Изменения',
    icon: '🔧',
    processes: ['Change Mgmt', 'CAB', 'Регламентные работы'],
  },
  {
    id: 'config',
    label: 'Конфигурации',
    icon: '🗂️',
    processes: ['CMDB', 'CI'],
  },
  {
    id: 'assets',
    label: 'Ресурсы',
    icon: '💼',
    processes: ['Asset Mgmt', 'License Mgmt'],
  },
];

export const ITSM_FLOW = [
  'Пользователь создаёт тикет (портал / email / чат)',
  'Тип: инцидент или запрос · категория · приоритет · SLA',
  'Автоназначение в рабочую группу',
  'Диагностика → CAB (если изменение) → решение',
  'Подтверждение пользователя · CSAT/NPS',
  'Аналитика: повторы, задержки, слабые услуги',
];

export const ITAM_LIFECYCLE = [
  {id: 'plan', label: 'Планирование', icon: '📐', detail: 'TCO, ROI, потребности бизнеса'},
  {id: 'buy', label: 'Закупка', icon: '🛒', detail: 'Контракты, серийные номера, гарантии'},
  {id: 'deploy', label: 'Развёртывание', icon: '🚀', detail: 'Инвентарный номер, интеграция'},
  {id: 'use', label: 'Эксплуатация', icon: '⚡', detail: 'Мониторинг, лицензии, инциденты'},
  {id: 'maint', label: 'Обслуживание', icon: '🔩', detail: 'Ремонт, обновления, поддержка'},
  {id: 'refresh', label: 'Модернизация', icon: '♻️', detail: 'Замена устаревшего парка'},
  {id: 'dispose', label: 'Списание', icon: '🗑️', detail: 'Стирание данных, утилизация'},
];

export const DEFAULT_METRICS = {
  mttr: 4,
  frt: 12,
  sla: 92,
  csat: 4.2,
  nps: 35,
  rwe: 68,
  volume: 420,
};

export function scoreSupportHealth(m) {
  const mttrScore = Math.max(0, 100 - m.mttr * 8);
  const frtScore = Math.max(0, 100 - m.frt * 4);
  const slaScore = m.sla;
  const csatScore = (m.csat / 5) * 100;
  const npsScore = Math.min(100, Math.max(0, m.nps + 50));
  const rweScore = m.rwe;
  return Math.round((mttrScore + frtScore + slaScore + csatScore + npsScore + rweScore) / 6);
}

export function searchKb(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  return KB_ARTICLES.map((a) => {
    let score = 0;
    words.forEach((w) => {
      if (a.title.toLowerCase().includes(w)) score += 3;
      if (a.tags.some((t) => t.includes(w))) score += 2;
    });
    return {...a, score};
  })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function licenseBalance(owned, installed) {
  const diff = owned - installed;
  return {
    owned,
    installed,
    diff,
    ok: diff >= 0,
    message:
      diff >= 0
        ? `Баланс +${diff}: лицензий достаточно`
        : `Дефицит ${Math.abs(diff)}: нарушение соглашения`,
  };
}
