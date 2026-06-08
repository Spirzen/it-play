/** Жизненный цикл HTTP-куки и сессии. */

export const SCENARIOS = [
  {
    id: 'login',
    short: 'Вход',
    title: 'Создание сессии',
    subtitle: 'Сервер выдаёт Set-Cookie после успешной аутентификации',
    steps: [
      {spotlight: ['browser'], label: 'POST /login', detail: 'login=user&password=***', cookie: null, log: 'Пока cookie нет'},
      {spotlight: ['server'], label: 'Проверка учётных данных', detail: 'Сессия #48291 в Redis/БД', cookie: null, log: 'Сервер создаёт session_id'},
      {spotlight: ['server', 'browser'], label: 'Set-Cookie', detail: 'session_id=abc123; HttpOnly; Secure; SameSite=Lax; Max-Age=3600', cookie: 'abc123', log: 'Браузер сохраняет в cookie-jar'},
    ],
  },
  {
    id: 'request',
    short: 'Запрос',
    title: 'Авторизованные запросы',
    subtitle: 'Браузер автоматически прикладывает Cookie к каждому запросу',
    steps: [
      {spotlight: ['browser'], label: 'GET /dashboard', detail: 'Cookie: session_id=abc123', cookie: 'abc123', log: 'Stateless HTTP + cookie = состояние'},
      {spotlight: ['server'], label: 'Валидация сессии', detail: 'Сессия активна, user_id=12874', cookie: 'abc123', log: 'Показ личного кабинета'},
      {spotlight: ['browser', 'server'], label: '200 OK', detail: 'Без повторного ввода пароля', cookie: 'abc123', log: 'Path=/ ограничивает область отправки'},
    ],
  },
  {
    id: 'logout',
    short: 'Выход',
    title: 'Завершение сессии',
    subtitle: 'Сервер инвалидирует сессию, браузер удаляет cookie',
    steps: [
      {spotlight: ['browser'], label: 'POST /logout', detail: 'Cookie: session_id=abc123', cookie: 'abc123', log: 'Запрос на завершение'},
      {spotlight: ['server'], label: 'Удаление сессии', detail: 'Запись #48291 удалена на сервере', cookie: null, log: 'Set-Cookie: Max-Age=0'},
      {spotlight: ['browser'], label: 'Cookie удалена', detail: 'Повторный GET /dashboard → 401', cookie: null, log: 'Требуется новый вход'},
    ],
  },
  {
    id: 'third-party',
    short: '3rd party',
    title: 'Сторонняя cookie',
    subtitle: 'Трекер через iframe — отдельный домен, ограничения браузера',
    steps: [
      {spotlight: ['browser'], label: 'Страница shop.example', detail: '<iframe src="ads.tracker.net">', cookie: 'shop_sess', log: 'First-party: shop.example'},
      {spotlight: ['tracker'], label: 'Запрос к tracker.net', detail: 'Set-Cookie: uid=xyz (домен .tracker.net)', cookie: 'uid=xyz', log: 'Third-party context'},
      {spotlight: ['browser'], label: 'Блокировка ITP/CHIPS', detail: 'Safari/Chrome ограничивают cross-site cookie', cookie: 'uid (partitioned)', log: 'Реклама и аналитика под давлением приватности'},
    ],
  },
];
