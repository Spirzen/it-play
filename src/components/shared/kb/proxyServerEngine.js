/** Сценарии прокси-серверов. */

export const SCENARIOS = [
  {
    id: 'forward-hit',
    short: 'Кэш HIT',
    title: 'Прямой прокси — попадание в кэш',
    subtitle: 'Корпоративный Squid отдаёт копию без выхода в интернет',
    mode: 'forward',
    steps: [
      {spotlight: ['client'], label: 'Запрос сотрудника', detail: 'GET http://cdn.debian.org/…/package.deb', log: 'Браузер настроен на proxy.corp:3128'},
      {spotlight: ['proxy'], label: 'Проверка кэша', detail: 'Squid: HIT — объект свежий 4 ч', log: 'Hit-ratio экономит 200 МБ × N пользователей'},
      {spotlight: ['client', 'proxy'], label: 'Ответ из кэша', detail: 'X-Cache: HIT from proxy.corp', log: 'Origin не вызывался'},
    ],
  },
  {
    id: 'forward-miss',
    short: 'Кэш MISS',
    title: 'Прямой прокси — промах',
    subtitle: 'Прокси запрашивает ресурс от своего имени и сохраняет ответ',
    mode: 'forward',
    steps: [
      {spotlight: ['client'], label: 'Новый URL', detail: 'GET http://example.com/logo.png', log: 'Прокси — видимый посредник для origin'},
      {spotlight: ['proxy'], label: 'MISS', detail: 'Кэш пуст — forward-запрос', log: 'Via: 1.1 proxy.corp'},
      {spotlight: ['proxy', 'origin'], label: 'Запрос к origin', detail: 'TCP к example.com:80, Host: example.com', log: 'Сервер видит IP прокси, не клиента'},
      {spotlight: ['proxy', 'client'], label: 'Сохранение и отдача', detail: 'Ответ кэшируется по Cache-Control', log: 'Следующий клиент — HIT'},
    ],
  },
  {
    id: 'reverse',
    short: 'Reverse',
    title: 'Обратный прокси (Nginx)',
    subtitle: 'Клиент обращается к edge, балансировщик выбирает backend',
    mode: 'reverse',
    steps: [
      {spotlight: ['client'], label: 'Пользователь → shop.example.com', detail: 'DNS → IP Nginx (реверс-прокси)', log: 'Реальные серверы скрыты'},
      {spotlight: ['proxy'], label: 'TLS termination', detail: 'Nginx расшифровывает HTTPS', log: 'Внутри DC — HTTP к app-серверам'},
      {spotlight: ['proxy', 'origin'], label: 'Балансировка', detail: 'least_conn → app-2:8080', log: 'Health-check исключил app-1'},
      {spotlight: ['client', 'proxy'], label: 'Ответ клиенту', detail: 'gzip, rate-limit, WAF уже применены', log: 'Типичная схема веб-приложений'},
    ],
  },
  {
    id: 'connect',
    short: 'CONNECT',
    title: 'Туннель HTTPS (CONNECT)',
    subtitle: 'Прокси не видит содержимое — только TCP-мост до :443',
    mode: 'forward',
    steps: [
      {spotlight: ['client'], label: 'CONNECT bank.example:443', detail: 'HTTP/1.1 метод CONNECT', log: 'Запрос полного URI не используется'},
      {spotlight: ['proxy', 'origin'], label: 'TCP-мост', detail: 'Прокси соединяет сокеты клиент↔сервер', log: 'TLS end-to-end между клиентом и банком'},
      {spotlight: ['client', 'origin'], label: 'Шифрованный поток', detail: 'Прокси пересылает байты без расшифровки', log: 'MITM возможен только с доверенным CA на клиенте'},
    ],
  },
];
