/** In-memory модель и сценарии для GoDatabasePlay */

export const USER_COLUMNS = ['id', 'name', 'email'];

export const INITIAL_USERS = [
  {id: 1, name: 'Timur', email: 'timur@universe.dev'},
  {id: 2, name: 'Anna', email: 'anna@example.com'},
  {id: 42, name: 'Dev', email: 'dev@go.dev'},
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Go-приложение', short: 'Код', role: 'handler, struct User, repository'},
  {id: 'sql', label: 'database/sql', short: 'sql.DB', role: 'Open · Query · Exec · Begin · Pool'},
  {id: 'driver', label: 'Драйвер', short: 'pgx/pq', role: '_ "github.com/lib/pq" · Register'},
  {id: 'pool', label: 'Пул соединений', short: 'Pool', role: 'SetMaxOpenConns · Ping · Conn'},
  {id: 'db', label: 'PostgreSQL', short: 'СУБД', role: 'Таблица users · ACID · $1 плейсхолдеры'},
];

export const ACCESS_LAYERS = [
  {id: 'sql', label: 'database/sql', desc: 'Прямой SQL, sql.DB, Rows.Scan'},
  {id: 'gorm', label: 'GORM', desc: 'Структуры, теги gorm, AutoMigrate'},
  {id: 'sqlc', label: 'sqlc', desc: 'SQL в .sql-файлах → типобезопасный Go'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'import',
    label: 'Импорт драйвера',
    detail: 'Пустой импорт регистрирует драйвер в database/sql через init().',
    layers: ['driver'],
    code: 'import (\n    "database/sql"\n    _ "github.com/lib/pq"\n)',
  },
  {
    id: 'open',
    label: 'sql.Open — пул, не соединение',
    detail: 'Open парсит DSN; реальное TCP — при первом Query/Ping.',
    layers: ['sql', 'pool'],
    code: 'db, err := sql.Open("postgres", dsn)\nif err != nil { log.Fatal(err) }\ndefer db.Close()',
  },
  {
    id: 'ping',
    label: 'db.Ping()',
    detail: 'Проверка доступности БД; выделяет conn из пула.',
    layers: ['pool', 'driver', 'db'],
    code: 'if err := db.Ping(); err != nil {\n    log.Fatal("failed to connect:", err)\n}',
  },
  {
    id: 'query',
    label: 'Query / QueryRow / Exec',
    detail: 'Параметры отдельно от SQL — защита от инъекций.',
    layers: ['sql', 'app'],
    code: 'var name string\nerr := db.QueryRow(\n    "SELECT name FROM users WHERE id = $1", 42,\n).Scan(&name)',
  },
  {
    id: 'rows',
    label: 'sql.Rows и Scan',
    detail: 'Итерация rows.Next(); обязательно rows.Close().',
    layers: ['sql'],
    code: 'rows, err := db.Query("SELECT id, name FROM users")\ndefer rows.Close()\nfor rows.Next() {\n    var u User\n    rows.Scan(&u.ID, &u.Name)\n}',
  },
  {
    id: 'tx',
    label: 'Транзакция Begin / Commit',
    detail: 'tx.Query и tx.Exec в одном ACID-блоке.',
    layers: ['sql', 'db'],
    code: 'tx, err := db.Begin()\n// ...\nif err != nil { tx.Rollback(); return err }\nreturn tx.Commit()',
  },
  {
    id: 'close',
    label: 'Закрытие Rows и Conn',
    detail: 'Утечка дескрипторов, если не закрыть Rows; db живёт до shutdown.',
    layers: ['pool', 'sql'],
    code: 'defer rows.Close()\n// db.Close() — при остановке процесса',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'QueryRow — одна строка',
    subtitle: 'Чтение name по id через $1',
    steps: [
      {
        spotlight: ['app'],
        label: 'Handler запрашивает пользователя',
        detail: 'repo.GetUser(ctx, 42)',
        packet: 'down',
        code: 'user, err := repo.GetUser(ctx, 42)',
      },
      {
        spotlight: ['sql', 'pool'],
        label: 'sql.DB выдаёт conn из пула',
        detail: 'QueryRow блокирует до Scan или ошибки',
        packet: 'down',
        code: 'row := db.QueryRowContext(ctx,\n    "SELECT name FROM users WHERE id = $1", 42)',
      },
      {
        spotlight: ['driver', 'db'],
        label: 'Драйвер отправляет SQL',
        detail: 'Протокол PostgreSQL, prepared statement',
        packet: 'request',
        code: 'SELECT name FROM users WHERE id = 42;',
      },
      {
        spotlight: ['sql', 'app'],
        label: 'Scan в переменную',
        detail: 'sql.ErrNoRows если id не найден',
        packet: 'up',
        code: 'var name string\nif err := row.Scan(&name); err != nil {\n    return "", err\n}',
      },
      {
        spotlight: ['pool'],
        label: 'Conn возвращается в пул',
        detail: 'TCP не рвётся — соединение переиспользуется',
        packet: 'up',
        code: '// conn idle в пуле до следующего запроса',
      },
    ],
  },
  {
    id: 'insert',
    title: 'Exec — INSERT',
    subtitle: 'Создание записи и LastInsertId / RETURNING',
    steps: [
      {
        spotlight: ['app'],
        label: 'struct User в памяти',
        detail: 'Поля name, email без id',
        packet: 'down',
        code: 'u := User{Name: "Alex", Email: "alex@example.com"}',
      },
      {
        spotlight: ['sql'],
        label: 'Exec с плейсхолдерами',
        detail: 'PostgreSQL: RETURNING id в том же запросе',
        packet: 'down',
        code: 'err := db.QueryRow(`INSERT INTO users (name, email)\nVALUES ($1, $2) RETURNING id`,\n    u.Name, u.Email).Scan(&u.ID)',
      },
      {
        spotlight: ['db'],
        label: 'СУБД вставляет строку',
        detail: 'UNIQUE на email, проверка ограничений',
        packet: 'request',
        code: 'INSERT INTO users (name, email) VALUES (...)\nRETURNING id;',
      },
      {
        spotlight: ['app'],
        label: 'ID в структуре',
        detail: 'Готово к ответу API',
        packet: 'up',
        code: 'return u, nil // u.ID заполнен',
      },
    ],
  },
  {
    id: 'tx',
    title: 'Транзакция',
    subtitle: 'Два INSERT в одном tx',
    steps: [
      {
        spotlight: ['sql'],
        label: 'db.Begin()',
        detail: 'Изоляция: оба запроса commit или rollback',
        packet: 'down',
        code: 'tx, err := db.Begin()\nif err != nil { return err }',
      },
      {
        spotlight: ['sql', 'db'],
        label: 'tx.Exec / tx.Query',
        detail: 'Тот же API, но на *sql.Tx',
        packet: 'down',
        code: '_, err = tx.Exec("INSERT INTO users ...")\n// второй запрос',
      },
      {
        spotlight: ['db'],
        label: 'COMMIT',
        detail: 'При ошибке — Rollback, данные не видны снаружи',
        packet: 'request',
        code: 'COMMIT;',
      },
      {
        spotlight: ['pool'],
        label: 'Conn в пул',
        detail: 'После Commit транзакция завершена',
        packet: 'up',
        code: 'return tx.Commit()',
      },
    ],
  },
  {
    id: 'gorm',
    title: 'GORM — Save',
    subtitle: 'ORM решает INSERT vs UPDATE',
    steps: [
      {
        spotlight: ['app'],
        label: 'Модель с тегами gorm',
        detail: 'db.Save(&user) по первичному ключу',
        packet: 'down',
        code: 'type User struct {\n    ID    uint   `gorm:"primaryKey"`\n    Name  string `gorm:"size:100"`\n    Email string `gorm:"uniqueIndex"`\n}',
      },
      {
        spotlight: ['sql', 'driver'],
        label: 'GORM генерирует SQL',
        detail: 'Логгер показывает запрос и время',
        packet: 'down',
        code: 'db.Save(&user) // INSERT или UPDATE',
      },
      {
        spotlight: ['db'],
        label: 'СУБД выполняет',
        detail: 'Можно Preload связей отдельным SELECT',
        packet: 'request',
        code: 'INSERT INTO "users" (...) VALUES (...);',
      },
      {
        spotlight: ['app'],
        label: 'Объект с ID',
        detail: 'Ошибка в .Error поле *gorm.DB',
        packet: 'up',
        code: 'if err := db.Save(&user).Error; err != nil { ... }',
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

export function runCrud(users, op, {id, name, email}) {
  const next = cloneUsers(users);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((u) => u.id === numId);
      return {users: next, rows: row ? [row] : [], message: row ? null : 'Пользователь не найден'};
    }
    return {users: next, rows: [...next], message: null};
  }

  if (op === 'create') {
    if (!name?.trim() || !email?.trim()) {
      return {users: next, rows: [], message: 'Заполните name и email'};
    }
    if (next.some((u) => u.email === email.trim())) {
      return {users: next, rows: [], message: 'Нарушение UNIQUE: email уже существует'};
    }
    const row = {id: nextUserId(next), name: name.trim(), email: email.trim()};
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
        return `SELECT id, name, email\nFROM users WHERE id = ${id};`;
      }
      return 'SELECT id, name, email FROM users ORDER BY id;';
    case 'create':
      return `INSERT INTO users (name, email)\nVALUES ('${params.name}', '${params.email}')\nRETURNING id;`;
    case 'update':
      return `UPDATE users\nSET name = '${params.name}', email = '${params.email}'\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM users WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function goCodeForLayer(layer, op, params) {
  const id = params.id ?? '42';
  const snippets = {
    sql: {
      read: params.id
        ? `var name string\nerr := db.QueryRow(\n    "SELECT name FROM users WHERE id = $1", ${id},\n).Scan(&name)`
        : `rows, err := db.Query("SELECT id, name, email FROM users")\ndefer rows.Close()\nfor rows.Next() {\n    var u User\n    rows.Scan(&u.ID, &u.Name, &u.Email)\n    users = append(users, u)\n}`,
      create: `var newID int64\nerr := db.QueryRow(\n    \`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id\`,\n    "${params.name}", "${params.email}",\n).Scan(&newID)`,
      update: `_, err := db.Exec(\n    "UPDATE users SET name = $1, email = $2 WHERE id = $3",\n    "${params.name}", "${params.email}", ${id},\n)`,
      delete: `_, err := db.Exec("DELETE FROM users WHERE id = $1", ${id})`,
    },
    gorm: {
      read: params.id
        ? `var u User\ndb.First(&u, ${id}) // SELECT ... LIMIT 1`
        : `var users []User\ndb.Find(&users)`,
      create: `u := User{Name: "${params.name}", Email: "${params.email}"}\ndb.Create(&u) // INSERT, u.ID заполнен`,
      update: `db.Model(&User{}).Where("id = ?", ${id}).Updates(map[string]interface{}{\n    "name": "${params.name}",\n    "email": "${params.email}",\n})`,
      delete: `db.Delete(&User{}, ${id})`,
    },
    sqlc: {
      read: params.id
        ? `// sql/queries.sql: -- name: GetUser :one\nuser, err := q.GetUser(ctx, ${id})`
        : `users, err := q.ListUsers(ctx, ListUsersParams{Limit: 50, Offset: 0})`,
      create: `user, err := q.CreateUser(ctx, CreateUserParams{\n    Name: "${params.name}",\n    Email: "${params.email}",\n})`,
      update: `user, err := q.UpdateUser(ctx, UpdateUserParams{\n    ID: ${id}, Name: "${params.name}", Email: "${params.email}",\n})`,
      delete: `err := q.DeleteUser(ctx, ${id})`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
