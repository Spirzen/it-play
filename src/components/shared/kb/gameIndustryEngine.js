/** Данные для демо раздела "Игровая индустрия". */

export const ECOSYSTEM_LAYERS = [
  {
    id: 'upstream',
    label: 'Разработка',
    tag: 'Upstream',
    color: '#7c3aed',
    icon: '🛠',
    actors: ['Студии AAA и indie', 'Аутсорс (арт, локализация)', 'Движки: Unity, Unreal'],
    output: 'Играбельный билд, ассеты, GDD',
  },
  {
    id: 'midstream',
    label: 'Издательство',
    tag: 'Midstream',
    color: '#2563eb',
    icon: '💰',
    actors: ['Издатели', 'Венчур и гранты', 'Краудфандинг'],
    output: 'Бюджет, маркетинг, юридика',
  },
  {
    id: 'downstream',
    label: 'Дистрибуция',
    tag: 'Downstream',
    color: '#059669',
    icon: '📦',
    actors: ['Steam, Epic, консольные Store', 'Розница и ключи'],
    output: 'Доступ игроку, DRM, обновления',
  },
  {
    id: 'ecosystem',
    label: 'Инфраструктура',
    tag: 'Ecosystem',
    color: '#d97706',
    icon: '☁',
    actors: ['Серверы и матчмейкинг', 'Аналитика', 'Twitch, Discord, медиа'],
    output: 'Live-ops, метрики, сообщество',
  },
];

export const RELEASE_FLOW = [
  {id: 'proto', label: 'Прототип', who: 'Разработчик', action: 'Проверка core loop и рисков'},
  {id: 'publish', label: 'Финансирование', who: 'Издатель / инвестор', action: 'Бюджет, сроки, KPI'},
  {id: 'infra', label: 'Инфраструктура', who: 'Партнёры', action: 'Серверы, аналитика, локализация'},
  {id: 'platform', label: 'Платформа', who: 'Sony / Microsoft / Valve', action: 'TRC, сертификация, публикация'},
  {id: 'marketing', label: 'Маркетинг', who: 'PR и медиа', action: 'Трейлеры, инфлюенсеры, ивенты'},
  {id: 'players', label: 'Игроки', who: 'Аудитория', action: 'Покупка, отзывы, live-ops данные'},
];

export const STUDIO_MODELS = {
  aaa: {
    id: 'aaa',
    label: 'AAA-студия',
    team: '100–500+',
    cycle: '3–7 лет',
    budget: '$50M–$300M+',
    engine: 'Unreal / собственный',
    process: 'Agile + waterfall, CI/CD, Perforce',
    risk: 'Координация сотен людей, сдвиг сроков',
    examples: 'CD Projekt, Naughty Dog, FromSoftware',
  },
  indie: {
    id: 'indie',
    label: 'Indie',
    team: '1–10',
    cycle: '6 мес – 3 года',
    budget: '$0–$2M (часто bootstrap)',
    engine: 'Unity, Godot, GameMaker',
    process: 'Прототип → MVP → Early Access',
    risk: 'Выгорание, нехватка навыков',
    examples: 'Team Cherry, ConcernedApe, Toby Fox',
  },
};

export const MONETIZATION_MODELS = [
  {
    id: 'premium',
    label: 'Премиум',
    desc: 'Разовая покупка игры или издания',
    share: 38,
    pros: ['Предсказуемый доход при релизе', 'Проще для игрока'],
    cons: ['Нужен сильный маркетинг', 'Нет recurring revenue'],
  },
  {
    id: 'f2p',
    label: 'Free-to-play',
    desc: 'Бесплатный вход + внутриигровые покупки',
    share: 42,
    pros: ['Огромный охват', 'Масштабируемый ARPU'],
    cons: ['Баланс pay-to-win', 'Затраты на live-ops'],
  },
  {
    id: 'sub',
    label: 'Подписка',
    desc: 'Game Pass, PS Plus Extra, MMO-подписки',
    share: 12,
    pros: ['Стабильный MRR', 'Открытие каталога'],
    cons: ['Доля выручки платформе', 'Каннибализация продаж'],
  },
  {
    id: 'hybrid',
    label: 'Гибрид',
    desc: 'База + DLC + сезонный pass + косметика',
    share: 8,
    pros: ['Гибкость ценообразования', 'Долгий lifecycle'],
    cons: ['Сложность коммуникации', 'Усталость от battle pass'],
  },
];

/** Условные доли рынка ПК-цифры (учебная модель). */
export const PC_STORES = [
  {id: 'steam', label: 'Steam', share: 62, fee: '20–30%', note: 'Steamworks, Workshop, Proton'},
  {id: 'epic', label: 'Epic Games Store', share: 14, fee: '12%', note: 'Эксклюзивы, Unreal-связка'},
  {id: 'gog', label: 'GOG', share: 4, fee: '30%', note: 'DRM-free, классика'},
  {id: 'other', label: 'Остальные', share: 20, fee: '—', note: 'itch.io, Humble, лаунчеры издателей'},
];

export const HUB_SECTIONS = [
  {
    id: 'overview',
    title: 'Индустрия',
    doc: '/encyclopedia/9-spinoff/9-03-igrovaya-industriya/1',
    icon: '🌐',
  },
  {
    id: 'studios',
    title: 'Студии',
    doc: '/encyclopedia/9-spinoff/9-03-igrovaya-industriya/111',
    icon: '🏢',
  },
  {
    id: 'publishers',
    title: 'Издатели',
    doc: '/encyclopedia/9-spinoff/9-03-igrovaya-industriya/112',
    icon: '📢',
  },
  {
    id: 'stores',
    title: 'Магазины',
    doc: '/encyclopedia/9-spinoff/9-03-igrovaya-industriya/113',
    icon: '🛒',
  },
  {
    id: 'platforms',
    title: 'Платформы',
    doc: '/encyclopedia/9-spinoff/9-03-igrovaya-industriya/114',
    icon: '🎮',
  },
  {
    id: 'studies',
    title: 'Игроведение',
    doc: '/encyclopedia/9-spinoff/9-03-igrovaya-industriya/game-studies/intro',
    icon: '📚',
  },
];
