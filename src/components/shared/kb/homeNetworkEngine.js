/** Домашняя сеть — топология и сценарии */

export const HOME_NODES = [
  {id: 'internet', label: 'Интернет', icon: '🌍', row: 0, col: 1},
  {id: 'router', label: 'Роутер', icon: '📡', row: 1, col: 1},
  {id: 'nas', label: 'NAS / ПК', icon: '💾', row: 2, col: 0},
  {id: 'printer', label: 'Принтер', icon: '🖨', row: 2, col: 1},
  {id: 'tv', label: 'Smart TV', icon: '📺', row: 2, col: 2},
  {id: 'phone', label: 'Смартфон', icon: '📱', row: 3, col: 0},
  {id: 'laptop', label: 'Ноутбук', icon: '💻', row: 3, col: 1},
  {id: 'console', label: 'Консоль', icon: '🎮', row: 3, col: 2},
];

export const HOME_EDGES = [
  ['internet', 'router'],
  ['router', 'nas'],
  ['router', 'printer'],
  ['router', 'tv'],
  ['router', 'phone'],
  ['router', 'laptop'],
  ['router', 'console'],
];

export const HOME_SCENARIOS = [
  {
    id: 'files',
    label: 'Общие файлы',
    title: 'Доступ к папке на NAS',
    steps: [
      {active: ['nas', 'laptop'], label: 'SMB-шара', detail: '\\\\NAS\\Media → 192.168.0.10\\share'},
      {active: ['nas', 'phone'], label: 'Мобильный клиент', detail: 'Приложение файлового менеджера по Wi-Fi'},
    ],
  },
  {
    id: 'print',
    label: 'Принтер',
    title: 'Сетевая печать',
    steps: [
      {active: ['printer', 'laptop'], label: 'Драйвер + очередь', detail: 'IPP или WSD — задание в spooler'},
      {active: ['printer', 'phone'], label: 'AirPrint / Mopria', detail: 'mDNS находит принтер в LAN'},
    ],
  },
  {
    id: 'lan-game',
    label: 'LAN-игра',
    title: 'Локальный мультиплеер',
    steps: [
      {active: ['console', 'laptop'], label: 'Без интернета', detail: 'UDP broadcast в подсети 192.168.0.0/24'},
      {active: ['router', 'console', 'laptop'], label: 'Коммутатор в роутере', detail: 'Задержка <2 мс внутри дома'},
    ],
  },
  {
    id: 'offline',
    label: 'Без WAN',
    title: 'Автономная сеть',
    steps: [
      {active: ['router', 'nas', 'tv', 'phone'], label: 'LAN работает', detail: 'DHCP и DNS локально — интернет не обязателен'},
      {active: ['internet'], label: 'WAN отключён', detail: 'Стриминг недоступен, файлы и печать — да'},
    ],
  },
];
