/** In-memory модель и сценарии для RubyDatabasePlay */

export const USER_COLUMNS = ['id', 'name', 'email', 'active'];

export const INITIAL_USERS = [
  {id: 1, name: 'Тимур', email: 'timur@example.com', active: true},
  {id: 2, name: 'Анна', email: 'anna@example.com', active: true},
  {id: 3, name: 'Игорь', email: 'igor@example.com', active: false},
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Ruby-приложение', short: 'Код', role: 'Сервис, модель, контроллер Rails'},
  {id: 'orm', label: 'ORM / адаптер', short: 'AR', role: 'ActiveRecord · Sequel · connection_pool'},
  {id: 'driver', label: 'Драйвер', short: 'pg', role: 'Нативный гем: TCP, протокол PostgreSQL'},
  {id: 'pool', label: 'Пул соединений', short: 'Pool', role: 'ConnectionPool · AR pool (Puma)'},
  {id: 'db', label: 'СУБД', short: 'PostgreSQL', role: 'Таблица users · транзакции ACID'},
];

export const ACCESS_LAYERS = [
  {id: 'pg', label: 'pg (raw)', desc: 'PG.connect · exec с $1, $2'},
  {id: 'sequel', label: 'Sequel', desc: 'DB[:users].where — DSL без "магии"'},
  {id: 'activerecord', label: 'ActiveRecord', desc: 'User.find · save · Relation'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'connect',
    label: 'PG.connect / pool',
    detail: 'Прямое соединение или pool.with_connection — не открывайте conn на каждый HTTP-запрос.',
    layers: ['driver', 'pool'],
    code: "require 'pg'\n\nconn = PG.connect(\n  host: 'localhost',\n  dbname: 'myapp_dev',\n  user: 'timur',\n  password: 'secret'\n)",
  },
  {
    id: 'exec',
    label: 'exec(sql, params)',
    detail: 'Плейсхолдеры $1, $2 — значения отдельно от текста запроса (защита от инъекций).',
    layers: ['driver', 'db'],
    code: "res = conn.exec(\n  'SELECT id, name FROM users WHERE active = $1',\n  [true]\n)",
  },
  {
    id: 'iterate',
    label: 'res.each / to_a',
    detail: 'PG::Result — построчный перебор без загрузки всего ответа в память.',
    layers: ['driver', 'app'],
    code: "res.each do |row|\n  puts \"ID: #{row['id']}, Name: #{row['name']}\"\nend\nres.clear",
  },
  {
    id: 'transaction',
    label: 'transaction { }',
    detail: 'BEGIN … COMMIT; при исключении в блоке — автоматический ROLLBACK.',
    layers: ['driver', 'db'],
    code: "conn.transaction do\n  conn.exec('INSERT INTO logs VALUES ($1)', ['start'])\n  # raise → rollback\nend",
  },
  {
    id: 'pool',
    label: 'pool.with_connection',
    detail: 'Соединение возвращается в пул после блока — типично в Puma/Unicorn.',
    layers: ['pool', 'orm'],
    code: "pool.with_connection do |conn|\n  conn.exec('SELECT 1')\nend",
  },
  {
    id: 'close',
    label: 'conn.close',
    detail: 'При pool.close не нужен на каждый запрос — пул управляет жизненным циклом.',
    layers: ['pool', 'driver'],
    code: 'conn.close  # только если соединение взяли напрямую, не из пула',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT активных пользователей',
    subtitle: 'Драйвер pg и параметры $1',
    steps: [
      {
        spotlight: ['app'],
        label: 'Сервис запрашивает список',
        detail: 'UserService.active_users',
        packet: 'down',
        code: 'def active_users\n  # ниже — прямой pg\nend',
      },
      {
        spotlight: ['pool', 'driver'],
        label: 'pool.with_connection',
        detail: 'Свободное TCP-соединение из пула (size: 5)',
        packet: 'down',
        code: "pool.with_connection do |conn|",
      },
      {
        spotlight: ['driver'],
        label: 'exec с массивом параметров',
        detail: 'true передаётся как $1, не в строке SQL',
        packet: 'down',
        code: "conn.exec(\n  'SELECT id, name, email FROM users WHERE active = $1',\n  [true]\n)",
      },
      {
        spotlight: ['db', 'driver'],
        label: 'PostgreSQL выполняет запрос',
        detail: 'План с фильтром по active, индекс при наличии',
        packet: 'request',
        code: 'SELECT id, name, email FROM users WHERE active = true;',
      },
      {
        spotlight: ['driver', 'app'],
        label: 'res.each → хэши строк',
        detail: "Ключи — имена столбцов: row['name']",
        packet: 'up',
        code: "res.each { |row| users << row }\nres.clear",
      },
      {
        spotlight: ['pool', 'app'],
        label: 'Соединение возвращено в пул',
        detail: 'Готово к следующему HTTP-запросу',
        packet: 'up',
        code: 'end # pool.with_connection',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT в транзакции',
    subtitle: 'Атомарная запись и commit',
    steps: [
      {
        spotlight: ['app'],
        label: 'Данные нового пользователя',
        detail: 'Хэш в памяти до отправки в БД',
        packet: 'down',
        code: '{ name: "Мария", email: "maria@example.com", active: true }',
      },
      {
        spotlight: ['driver', 'db'],
        label: 'BEGIN + INSERT',
        detail: 'conn.transaction оборачивает блок',
        packet: 'down',
        code: "conn.transaction do\n  conn.exec(\n    'INSERT INTO users (name, email, active) VALUES ($1, $2, $3)',\n    ['Мария', 'maria@example.com', true]\n  )\nend",
      },
      {
        spotlight: ['db'],
        label: 'COMMIT',
        detail: 'Строка видна другим транзакциям после commit',
        packet: 'up',
        code: '-- id = 4 (SERIAL)',
      },
      {
        spotlight: ['app'],
        label: 'Объект с id в приложении',
        detail: 'RETURNING id можно добавить в INSERT',
        packet: 'up',
        code: 'user[:id] = 4',
      },
    ],
  },
  {
    id: 'ar_find',
    title: 'ActiveRecord User.find',
    subtitle: 'ORM генерирует SQL при обращении к БД',
    steps: [
      {
        spotlight: ['app'],
        label: 'user = User.find(42)',
        detail: 'Вызов в контроллере или сервисе',
        packet: 'down',
        code: 'user = User.find(42)',
      },
      {
        spotlight: ['orm'],
        label: 'Адаптер PostgreSQL',
        detail: 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter',
        packet: 'down',
        code: '# SELECT "users".* FROM "users" WHERE "users"."id" = $1',
      },
      {
        spotlight: ['pool', 'driver'],
        label: 'Соединение из пула Rails',
        detail: 'config/database.yml → pool: 5',
        packet: 'down',
        code: '# lease connection for duration of query',
      },
      {
        spotlight: ['db'],
        label: 'Строка → объект User',
        detail: 'Типы: int4 → Integer, timestamptz → Time',
        packet: 'up',
        code: '# user.name, user.email — геттеры столбцов',
      },
      {
        spotlight: ['app'],
        label: 'user.save при изменении',
        detail: 'UPDATE users SET name = … WHERE id = 42',
        packet: 'up',
        code: "user.name = 'Тимур'\nuser.save",
      },
    ],
  },
  {
    id: 'relation',
    title: 'Ленивый Relation',
    subtitle: 'SQL только при each / first / to_a',
    steps: [
      {
        spotlight: ['app'],
        label: 'scope = User.where(active: true)',
        detail: 'ActiveRecord::Relation — запрос ещё не ушёл в БД',
        packet: 'down',
        code: 'scope = User.where(active: true).order(:name)',
      },
      {
        spotlight: ['app'],
        label: 'Добавление условий',
        detail: 'Цепочка без выполнения',
        packet: 'down',
        code: 'scope = scope.limit(10) if params[:limit]',
      },
      {
        spotlight: ['orm'],
        label: 'SQL при @users = scope',
        detail: 'Рендер шаблона вызывает each → SELECT',
        packet: 'down',
        code: '@users = scope  # SQL при итерации в view',
      },
      {
        spotlight: ['db'],
        label: 'Один SELECT в логе',
        detail: 'User Load (0.8ms) SELECT …',
        packet: 'request',
        code: 'SELECT "users".* FROM "users" WHERE "users"."active" = $1 ORDER BY "users"."name"',
      },
    ],
  },
];

export const RAILS_FLOW_SCENARIOS = [
  {
    id: 'crud_save',
    title: 'CRUD: find → save',
    subtitle: 'Жизненный цикл записи ActiveRecord',
    steps: [
      {
        spotlight: ['app'],
        label: 'User.find(42)',
        detail: 'Загрузка строки в объект',
        packet: 'down',
        code: 'user = User.find(42)',
      },
      {
        spotlight: ['orm'],
        label: 'before_save коллбэки',
        detail: 'normalize_email и валидации',
        packet: 'down',
        code: 'user.name = "Тимур"\n# validates :email …',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'UPDATE … WHERE id = 42',
        detail: 'updated_at обновляется автоматически',
        packet: 'request',
        code: 'UPDATE users SET name = $1, updated_at = NOW() WHERE id = 42',
      },
      {
        spotlight: ['app'],
        label: 'after_commit (опционально)',
        detail: 'Побочные эффекты после успешного commit',
        packet: 'up',
        code: '# отправка email — только after_commit',
      },
    ],
  },
  {
    id: 'n_plus_one',
    title: 'N+1 и includes',
    subtitle: 'Один запрос против десятка',
    steps: [
      {
        spotlight: ['app'],
        label: 'User.all.each { |u| u.posts.count }',
        detail: 'Каждый user → отдельный SELECT COUNT',
        packet: 'down',
        code: '@users = User.all  # 1 запрос',
      },
      {
        spotlight: ['db'],
        label: 'N запросов к posts',
        detail: 'Классическая ошибка N+1',
        packet: 'request',
        code: '-- SELECT COUNT(*) FROM posts WHERE user_id = 1\n-- SELECT COUNT(*) FROM posts WHERE user_id = 2\n-- …',
      },
      {
        spotlight: ['app'],
        label: 'User.includes(:posts)',
        detail: 'preload / eager_load — 2 запроса вместо N+1',
        packet: 'down',
        code: '@users = User.includes(:posts).where(active: true)',
      },
      {
        spotlight: ['db'],
        label: 'SELECT users + SELECT posts',
        detail: 'Данные связей уже в памяти',
        packet: 'up',
        code: 'SELECT * FROM users WHERE active = true;\nSELECT * FROM posts WHERE user_id IN (…);',
      },
    ],
  },
];

export function cloneUsers(users) {
  return users.map((u) => ({...u}));
}

export function nextUserId(users) {
  return users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
}

export function runCrud(users, op, {id, name, email, active}) {
  const next = cloneUsers(users);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((u) => u.id === numId);
      return {users: next, rows: row ? [row] : [], message: row ? null : 'Пользователь не найден'};
    }
    return {users: next, rows: next.filter((u) => u.active), message: null};
  }

  if (op === 'create') {
    if (!name?.trim() || !email?.trim()) {
      return {users: next, rows: [], message: 'Заполните name и email'};
    }
    if (next.some((u) => u.email === email.trim())) {
      return {users: next, rows: [], message: 'Нарушение UNIQUE: email уже существует'};
    }
    const row = {
      id: nextUserId(next),
      name: name.trim(),
      email: email.trim(),
      active: active !== false,
    };
    next.push(row);
    return {users: next, rows: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((u) => u.id === numId);
    if (idx < 0) {
      return {users: next, rows: [], message: 'Пользователь не найден'};
    }
    next[idx] = {
      ...next[idx],
      name: name?.trim() || next[idx].name,
      email: email?.trim() || next[idx].email,
      active: typeof active === 'boolean' ? active : next[idx].active,
    };
    return {users: next, rows: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((u) => u.id === numId);
    if (idx < 0) {
      return {users: next, rows: [], message: 'Пользователь не найден'};
    }
    const removed = next.splice(idx, 1);
    return {users: next, rows: removed, message: null};
  }

  return {users: next, rows: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, name, email, active\nFROM users WHERE id = ${id};`;
      }
      return 'SELECT id, name, email, active\nFROM users WHERE active = true;';
    case 'create':
      return `INSERT INTO users (name, email, active)\nVALUES ('${params.name}', '${params.email}', ${params.active ? 'true' : 'false'});`;
    case 'update':
      return `UPDATE users\nSET name = '${params.name}', email = '${params.email}', active = ${params.active ? 'true' : 'false'}\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM users WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function rubyCodeForLayer(layer, op, params) {
  const id = params.id ?? 2;
  const snippets = {
    pg: {
      read: params.id
        ? `require 'pg'\n\npool.with_connection do |conn|\n  res = conn.exec(\n    'SELECT * FROM users WHERE id = $1',\n    [${id}]\n  )\n  row = res[0]\n  res.clear\nend`
        : `pool.with_connection do |conn|\n  res = conn.exec(\n    'SELECT * FROM users WHERE active = $1',\n    [true]\n  )\n  res.to_a\nend`,
      create: `pool.with_connection do |conn|\n  conn.exec(\n    'INSERT INTO users (name, email, active) VALUES ($1, $2, $3)',\n    ['${params.name}', '${params.email}', true]\n  )\nend`,
      update: `conn.exec(\n  'UPDATE users SET name = $1, active = $2 WHERE id = $3',\n  ['${params.name}', ${params.active ? 'true' : 'false'}, ${id}]\n)`,
      delete: `conn.exec('DELETE FROM users WHERE id = $1', [${id}])`,
    },
    sequel: {
      read: params.id
        ? `DB[:users].where(id: ${id}).first`
        : `DB[:users].where(active: true).order(:name).all`,
      create: `DB[:users].insert(\n  name: '${params.name}',\n  email: '${params.email}',\n  active: true\n)`,
      update: `DB[:users].where(id: ${id}).update(active: false)`,
      delete: `DB[:users].where(id: ${id}).delete`,
    },
    activerecord: {
      read: params.id ? `User.find(${id})` : `User.where(active: true).order(:name)`,
      create: `User.create!(\n  name: '${params.name}',\n  email: '${params.email}',\n  active: true\n)`,
      update: `user = User.find(${id})\nuser.update!(name: '${params.name}', active: ${params.active ? 'true' : 'false'})`,
      delete: `User.find(${id}).destroy!`,
    },
  };
  return snippets[layer]?.[op] ?? '# выберите операцию';
}
