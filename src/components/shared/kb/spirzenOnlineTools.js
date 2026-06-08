/** Онлайн-инструменты автора на spirzen.github.io (отдельные от встроенных демо энциклопедии). */

export const SPIRZEN_ONLINE_TOOLS = {
  schemaMaker: {
    id: 'schemaMaker',
    name: 'Schema Maker Online',
    shortName: 'Schema Maker',
    href: 'https://spirzen.github.io/SchemaMakerOnline/',
    tagline: 'Минималистичный конструктор схем — быстро нарисовать и экспорт в PNG.',
  },
  sqlGenerator: {
    id: 'sqlGenerator',
    name: 'SQL Generator Online',
    shortName: 'SQL Generator',
    href: 'https://spirzen.github.io/SQLGeneratorOnline/',
    tagline:
      'Конструктор SQL-запросов по правилам языка; импорт из Excel в INSERT для загрузки в БД.',
  },
  archiStyler: {
    id: 'archiStyler',
    name: 'ArchiStyler Online',
    shortName: 'ArchiStyler',
    href: 'https://spirzen.github.io/ArchiStylerOnline/',
    tagline:
      'Архитектурные схемы программ: классы, связи, свойства; паттерны в пару кликов.',
  },
  randomManager: {
    id: 'randomManager',
    name: 'Random Manager',
    shortName: 'Random Manager',
    href: 'https://spirzen.github.io/RandomManager/',
    tagline:
      'Каталог фильмов, игр и книг: фильтры, поиск и случайный выбор с анимацией «рулетки».',
  },
  onlineCardGame: {
    id: 'onlineCardGame',
    name: 'Приключения Урала Батыра',
    shortName: 'Урал Батыр',
    href: 'https://spirzen.github.io/OnlineCardGame/',
    tagline:
      'Карточный roguelike по башкирскому эпосу: батыры, дивы, лор карт и поход к Шульгену. Браузер, PWA.',
  },
};

export const SPIRZEN_ONLINE_TOOLS_LIST = Object.values(SPIRZEN_ONLINE_TOOLS);
