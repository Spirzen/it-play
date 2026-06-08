/** In-memory модель и сценарии для CppDatabasePlay */

export const PERSON_COLUMNS = ['id', 'name', 'age'];

export const INITIAL_PERSONS = [
  {id: 1, name: 'Alice', age: 28},
  {id: 2, name: 'Bob', age: 35},
  {id: 3, name: 'Carol', age: 22},
];

export const STACK_LAYERS = [
  {id: 'app', label: 'C++-приложение', short: 'Код', role: 'Person, Repository, RAII-обёртки'},
  {id: 'api', label: 'Клиентский API', short: 'sqlite3 / SOCI', role: 'prepare · bind · step · fetch'},
  {id: 'driver', label: 'Нативная библиотека', short: 'libsqlite3', role: 'ODBC · libpq · Connector/C++'},
  {id: 'db', label: 'СУБД', short: 'SQLite', role: 'Файл app.db · таблица persons · ACID'},
];

export const ACCESS_LAYERS = [
  {id: 'sqlite3', label: 'SQLite3 C API', desc: 'Прямой SQL, sqlite3_* + RAII-обёртки'},
  {id: 'soci', label: 'SOCI', desc: 'Привязка переменных, без полного ORM'},
  {id: 'sqlpp11', label: 'sqlpp11', desc: 'SQL как C++ DSL, проверка на этапе сборки'},
  {id: 'odb', label: 'ODB', desc: 'ORM с генерацией кода, Unit of Work'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'open',
    label: 'sqlite3_open / RAII Connection',
    detail: 'Открытие файла app.db; обёртка Connection вызывает sqlite3_close в деструкторе.',
    layers: ['api', 'driver'],
    code: 'sqlite3* raw = nullptr;\nsqlite3_open("app.db", &raw);\nConnection conn(raw); // unique_ptr + custom deleter',
  },
  {
    id: 'prepare',
    label: 'sqlite3_prepare_v2',
    detail: 'SQL компилируется один раз; плейсхолдеры ? защищают от инъекций.',
    layers: ['api', 'app'],
    code: 'Statement stmt(conn.get(),\n  "SELECT id, name, age FROM persons WHERE id = ?");\n// stmt — RAII: finalize в ~Statement()',
  },
  {
    id: 'bind',
    label: 'sqlite3_bind_*',
    detail: 'Параметры привязываются по индексу (1-based в SQLite).',
    layers: ['api'],
    code: 'sqlite3_bind_int(stmt.get(), 1, person_id);',
  },
  {
    id: 'step',
    label: 'sqlite3_step',
    detail: 'SQLITE_ROW — строка готова; SQLITE_DONE — INSERT/UPDATE завершён.',
    layers: ['api', 'db'],
    code: 'while (sqlite3_step(stmt.get()) == SQLITE_ROW) {\n  int id = sqlite3_column_int(stmt.get(), 0);\n  // ...\n}',
  },
  {
    id: 'map',
    label: 'Маппинг в Person',
    detail: 'Строка ResultSet → struct/class; в ODB это делает сгенерированный код.',
    layers: ['app'],
    code: 'Person p;\np.id_ = sqlite3_column_int(stmt, 0);\np.name_ = reinterpret_cast<const char*>(\n  sqlite3_column_text(stmt, 1));\np.age_ = sqlite3_column_int(stmt, 2);',
  },
  {
    id: 'transaction',
    label: 'BEGIN … COMMIT',
    detail: 'Транзакция группирует изменения; ROLLBACK при исключении (RAII TransactionGuard).',
    layers: ['api', 'db'],
    code: 'TransactionGuard tx(conn);\n// INSERT / UPDATE\n// ~TransactionGuard → COMMIT или ROLLBACK',
  },
  {
    id: 'close',
    label: 'RAII: деструкторы',
    detail: 'Statement → Connection в обратном порядке; утечки и двойное закрытие исключены.',
    layers: ['app', 'driver'],
    code: '} // ~Statement → sqlite3_finalize\n  // ~Connection → sqlite3_close\n  // ~TransactionGuard уже отработал',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT по id',
    subtitle: 'Чтение Person через sqlite3_prepare и RAII',
    steps: [
      {
        spotlight: ['app'],
        label: 'Repository запрашивает Person',
        detail: 'personRepo.findById(2)',
        packet: 'down',
        code: 'std::optional<Person> PersonRepository::findById(long id) {\n  // ...\n}',
      },
      {
        spotlight: ['api', 'driver'],
        label: 'Connection из пула или RAII',
        detail: 'sqlite3_open или готовое соединение из пула потоков',
        packet: 'down',
        code: 'Connection conn("app.db");\n// conn.get() → sqlite3*',
      },
      {
        spotlight: ['api'],
        label: 'prepare + bind',
        detail: 'Prepared statement с параметром id = ?',
        packet: 'down',
        code: 'Statement stmt(conn.get(),\n  "SELECT id, name, age FROM persons WHERE id = ?");\nsqlite3_bind_int(stmt.get(), 1, id);',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'СУБД выполняет SELECT',
        detail: 'Индекс по PRIMARY KEY, одна строка',
        packet: 'request',
        code: '-- SQLite\nSELECT id, name, age FROM persons WHERE id = 2;',
      },
      {
        spotlight: ['api'],
        label: 'sqlite3_step → Person',
        detail: 'SQLITE_ROW: читаем столбцы, заполняем поля',
        packet: 'up',
        code: 'if (sqlite3_step(stmt.get()) == SQLITE_ROW) {\n  return mapPerson(stmt.get());\n}\nreturn std::nullopt;',
      },
      {
        spotlight: ['app'],
        label: 'RAII закрывает ресурсы',
        detail: '~Statement, ~Connection — без ручного finalize/close',
        packet: 'up',
        code: '} // деструкторы освобождают stmt и conn',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT новой записи',
    subtitle: 'Создание Person и last_insert_rowid()',
    steps: [
      {
        spotlight: ['app'],
        label: 'Person без id в памяти',
        detail: 'Transient-объект: id ещё не назначен СУБД',
        packet: 'down',
        code: 'Person p{"Dave", 31}; // id_ = 0',
      },
      {
        spotlight: ['api'],
        label: 'INSERT с плейсхолдерами',
        detail: 'sqlite3_bind_text для name, sqlite3_bind_int для age',
        packet: 'down',
        code: 'INSERT INTO persons (name, age) VALUES (?, ?)',
      },
      {
        spotlight: ['db'],
        label: 'СУБД вставляет строку',
        detail: 'AUTOINCREMENT назначает id = 4',
        packet: 'request',
        code: '-- id = 4',
      },
      {
        spotlight: ['api', 'app'],
        label: 'last_insert_rowid()',
        detail: 'p.id_ = sqlite3_last_insert_rowid(conn)',
        packet: 'up',
        code: 'p.id_ = sqlite3_last_insert_rowid(conn.get());\nreturn p;',
      },
    ],
  },
  {
    id: 'soci',
    title: 'SOCI: привязка переменных',
    subtitle: 'sql << … soci::use / soci::into',
    steps: [
      {
        spotlight: ['app'],
        label: 'Переменные C++',
        detail: 'int id, std::string name — без ручного bind',
        packet: 'down',
        code: 'int id = 2;\nstd::string name;',
      },
      {
        spotlight: ['api'],
        label: 'Один оператор <<',
        detail: 'SOCI связывает :id с use(id), столбец name — с into(name)',
        packet: 'down',
        code: 'sql << "SELECT name FROM persons WHERE id = :id",\n    soci::into(name), soci::use(id);',
      },
      {
        spotlight: ['db'],
        label: 'Выполнение на SQLite',
        detail: 'Бэкенд soci::sqlite3 транслирует в prepare/step',
        packet: 'request',
        code: 'SELECT name FROM persons WHERE id = 2;',
      },
      {
        spotlight: ['app'],
        label: 'name заполнен',
        detail: 'Результат уже в переменной C++',
        packet: 'up',
        code: 'std::cout << name; // "Bob"',
      },
    ],
  },
  {
    id: 'odb',
    title: 'ODB: Unit of Work',
    subtitle: 'Изменение без явного UPDATE',
    steps: [
      {
        spotlight: ['app'],
        label: 'db.query<Person>',
        detail: 'Загрузка managed-объекта из сессии ODB',
        packet: 'down',
        code: 'Person& p = db.query_one<Person>(\n  odb::query<Person>::id == 2);',
      },
      {
        spotlight: ['app'],
        label: 'Изменение поля в памяти',
        detail: 'p.age(36) — объект помечен dirty',
        packet: 'down',
        code: 'p.age(36);',
      },
      {
        spotlight: ['api', 'db'],
        label: 'db.update(p) / flush',
        detail: 'ODB генерирует UPDATE только для изменённых полей',
        packet: 'down',
        code: 'UPDATE persons SET age = 36 WHERE id = 2;',
      },
      {
        spotlight: ['db'],
        label: 'COMMIT транзакции',
        detail: 'db.commit() фиксирует изменения',
        packet: 'request',
        code: 'db.commit();',
      },
    ],
  },
];

export function clonePersons(persons) {
  return persons.map((p) => ({...p}));
}

export function nextPersonId(persons) {
  return persons.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

export function runCrud(persons, op, {id, name, age}) {
  const next = clonePersons(persons);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((p) => p.id === numId);
      return {persons: next, rows: row ? [row] : [], message: row ? null : 'Запись не найдена'};
    }
    return {persons: next, rows: next.filter((p) => p.age >= 25), message: null};
  }

  if (op === 'create') {
    if (!name?.trim()) {
      return {persons: next, rows: [], message: 'Укажите name'};
    }
    const numAge = Number(age);
    if (!Number.isFinite(numAge) || numAge < 0) {
      return {persons: next, rows: [], message: 'Некорректный age'};
    }
    const row = {id: nextPersonId(next), name: name.trim(), age: numAge};
    next.push(row);
    return {persons: next, rows: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((p) => p.id === numId);
    if (idx < 0) {
      return {persons: next, rows: [], message: 'Запись не найдена'};
    }
    next[idx] = {
      ...next[idx],
      name: name?.trim() || next[idx].name,
      age: Number.isFinite(Number(age)) ? Number(age) : next[idx].age,
    };
    return {persons: next, rows: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((p) => p.id === numId);
    if (idx < 0) {
      return {persons: next, rows: [], message: 'Запись не найдена'};
    }
    const removed = next.splice(idx, 1);
    return {persons: next, rows: removed, message: null};
  }

  return {persons: next, rows: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, name, age\nFROM persons WHERE id = ${id};`;
      }
      return 'SELECT id, name, age\nFROM persons WHERE age >= 25;';
    case 'create':
      return `INSERT INTO persons (name, age)\nVALUES ('${params.name}', ${params.age})\nRETURNING id;`;
    case 'update':
      return `UPDATE persons\nSET name = '${params.name}', age = ${params.age}\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM persons WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function cppCodeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    sqlite3: {
      read: params.id
        ? `std::optional<Person> findById(long id) {\n  Connection conn("app.db");\n  Statement stmt(conn.get(),\n    "SELECT id, name, age FROM persons WHERE id = ?");\n  sqlite3_bind_int(stmt.get(), 1, static_cast<int>(id));\n  if (sqlite3_step(stmt.get()) == SQLITE_ROW)\n    return mapPerson(stmt.get());\n  return std::nullopt;\n}`
        : `// все с age >= 25\nStatement stmt(conn.get(),\n  "SELECT id, name, age FROM persons WHERE age >= ?");\nsqlite3_bind_int(stmt.get(), 1, 25);\nwhile (sqlite3_step(stmt.get()) == SQLITE_ROW)\n  result.push_back(mapPerson(stmt.get()));`,
      create: `Statement stmt(conn.get(),\n  "INSERT INTO persons (name, age) VALUES (?, ?)");\nsqlite3_bind_text(stmt.get(), 1, "${params.name}", -1, SQLITE_TRANSIENT);\nsqlite3_bind_int(stmt.get(), 2, ${params.age});\nsqlite3_step(stmt.get());\nlong newId = sqlite3_last_insert_rowid(conn.get());`,
      update: `Statement stmt(conn.get(),\n  "UPDATE persons SET name = ?, age = ? WHERE id = ?");\nsqlite3_bind_text(stmt.get(), 1, "${params.name}", -1, SQLITE_TRANSIENT);\nsqlite3_bind_int(stmt.get(), 2, ${params.age});\nsqlite3_bind_int(stmt.get(), 3, ${id});\nsqlite3_step(stmt.get());`,
      delete: `Statement stmt(conn.get(),\n  "DELETE FROM persons WHERE id = ?");\nsqlite3_bind_int(stmt.get(), 1, ${id});\nsqlite3_step(stmt.get());`,
    },
    soci: {
      read: params.id
        ? `int id = ${id};\nstd::string name;\nint age = 0;\nsql << "SELECT name, age FROM persons WHERE id = :id",\n    soci::into(name), soci::into(age), soci::use(id);`
        : `std::vector<Person> people;\nsql << "SELECT id, name, age FROM persons WHERE age >= :min",\n    soci::into(people), soci::use(25);`,
      create: `Person p{"${params.name}", ${params.age}};\nsql << "INSERT INTO persons (name, age) VALUES (:name, :age)",\n    soci::use(p);`,
      update: `sql << "UPDATE persons SET name = :name, age = :age WHERE id = :id",\n    soci::use("${params.name}"), soci::use(${params.age}), soci::use(${id});`,
      delete: `int id = ${id};\nsql << "DELETE FROM persons WHERE id = :id", soci::use(id);`,
    },
    sqlpp11: {
      read: params.id
        ? `auto rows = db(select(person.name, person.age)\n             .from(person)\n             .where(person.id == ${id}));\nfor (const auto& row : rows) { /* ... */ }`
        : `auto rows = db(select(person.id, person.name, person.age)\n             .from(person)\n             .where(person.age >= 25));`,
      create: `db(insert_into(person)\n    .set(person.name = "${params.name}",\n         person.age = ${params.age}));`,
      update: `db(update(person)\n    .set(person.name = "${params.name}",\n         person.age = ${params.age})\n    .where(person.id == ${id}));`,
      delete: `db(remove_from(person).where(person.id == ${id}));`,
    },
    odb: {
      read: params.id
        ? `odb::transaction t(db.begin());\nauto p = db.query_one<Person>(\n  odb::query<Person>::id == ${id}L);\nt.commit();`
        : `odb::result<Person> r(\n  db.query<Person>(odb::query<Person>::age >= 25));`,
      create: `Person p("${params.name}", ${params.age});\ndb.persist(p); // INSERT при commit\ndb.commit(); // id_ заполнен`,
      update: `Person& p = db.load<Person>(${id}L);\np.age(${params.age});\ndb.update(p); // dirty tracking`,
      delete: `db.erase<Person>(${id}L);\ndb.commit();`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
