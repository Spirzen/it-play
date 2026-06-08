/** In-memory модель и сценарии для JavaDatabasePlay */

export const BOOK_COLUMNS = ['id', 'title', 'author', 'isbn', 'published_year', 'available'];

export const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Java Concurrency in Practice',
    author: 'Brian Goetz',
    isbn: '978-0321349606',
    published_year: 2006,
    available: true,
  },
  {
    id: 2,
    title: 'Effective Java',
    author: 'Joshua Bloch',
    isbn: '978-0134685991',
    published_year: 2018,
    available: true,
  },
  {
    id: 3,
    title: 'Spring in Action',
    author: 'Craig Walls',
    isbn: '978-1617294945',
    published_year: 2018,
    available: false,
  },
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Java-приложение', short: 'Код', role: 'Сервис, DTO, доменная модель'},
  {id: 'jdbc', label: 'JDBC API', short: 'java.sql', role: 'Connection · Statement · ResultSet'},
  {id: 'driver', label: 'JDBC-драйвер', short: 'Driver', role: 'postgresql-42.x.jar'},
  {id: 'pool', label: 'Пул соединений', short: 'Pool', role: 'HikariCP · DataSource'},
  {id: 'db', label: 'СУБД', short: 'PostgreSQL', role: 'Таблица books · ACID'},
];

export const ACCESS_LAYERS = [
  {id: 'jdbc', label: 'JDBC', desc: 'Прямой SQL, полный контроль'},
  {id: 'jpa', label: 'JPA / Hibernate', desc: 'Сущности, EntityManager, JPQL'},
  {id: 'spring', label: 'Spring Data JPA', desc: 'Репозиторий, query methods'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'driver',
    label: 'Драйвер в classpath',
    detail: 'Maven/Gradle подтягивает postgresql.jar; SPI регистрирует Driver.',
    layers: ['driver'],
    code: '// JDBC 4+: Class.forName не нужен\n// DriverManager находит драйвер по URL',
  },
  {
    id: 'pool',
    label: 'Пул выдаёт Connection',
    detail: 'HikariDataSource.getConnection() — готовое соединение из пула.',
    layers: ['pool', 'driver'],
    code: 'try (Connection conn = dataSource.getConnection()) { ... }',
  },
  {
    id: 'prepare',
    label: 'PreparedStatement',
    detail: 'SQL с ? — защита от инъекций, кэш плана на стороне СУБД.',
    layers: ['jdbc', 'app'],
    code: 'PreparedStatement ps = conn.prepareStatement(sql);\nps.setString(1, value);',
  },
  {
    id: 'execute',
    label: 'executeQuery / executeUpdate',
    detail: 'SELECT → ResultSet; INSERT/UPDATE/DELETE → число затронутых строк.',
    layers: ['jdbc', 'db'],
    code: 'ResultSet rs = ps.executeQuery();\n// или int n = ps.executeUpdate();',
  },
  {
    id: 'cursor',
    label: 'Курсор ResultSet',
    detail: 'rs.next() перемещает курсор; getLong/getString читают текущую строку.',
    layers: ['jdbc'],
    code: 'while (rs.next()) {\n  long id = rs.getLong("id");\n}',
  },
  {
    id: 'map',
    label: 'Маппинг в объект',
    detail: 'ResultSet → Book: ручной mapRow или ORM dirty checking.',
    layers: ['app'],
    code: 'Book b = mapRow(rs); // JDBC\n// или em.find(Book.class, id) // JPA',
  },
  {
    id: 'close',
    label: 'Закрытие ресурсов',
    detail: 'try-with-resources: ResultSet → Statement → Connection в обратном порядке.',
    layers: ['pool', 'jdbc'],
    code: '} // автоматически: rs.close(); ps.close(); conn.close();',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT по ID',
    subtitle: 'Чтение одной книги через PreparedStatement',
    steps: [
      {
        spotlight: ['app'],
        label: 'Сервис запрашивает книгу',
        detail: 'bookRepository.findById(2L)',
        packet: 'down',
        code: 'Optional<Book> book = repo.findById(2L);',
      },
      {
        spotlight: ['jdbc', 'pool'],
        label: 'Получение Connection из пула',
        detail: 'DataSource выдаёт соединение; autoCommit обычно true для чтения',
        packet: 'down',
        code: 'Connection conn = dataSource.getConnection();',
      },
      {
        spotlight: ['jdbc', 'driver'],
        label: 'Подготовка запроса',
        detail: 'PreparedStatement с параметром id = ?',
        packet: 'down',
        code: 'PreparedStatement ps = conn.prepareStatement(\n  "SELECT * FROM books WHERE id = ?");\nps.setLong(1, 2L);',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'СУБД выполняет SELECT',
        detail: 'Индекс по PK, возврат одной строки',
        packet: 'request',
        code: '-- PostgreSQL\nSELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = 2;',
      },
      {
        spotlight: ['jdbc'],
        label: 'ResultSet → Book',
        detail: 'rs.next() один раз; mapRow заполняет поля DTO',
        packet: 'up',
        code: 'if (rs.next()) return mapRow(rs);\nreturn Optional.empty();',
      },
      {
        spotlight: ['app', 'pool'],
        label: 'Возврат соединения в пул',
        detail: 'try-with-resources закрывает ResultSet, Statement, Connection',
        packet: 'up',
        code: '} // conn.close() → пул, не разрыв TCP',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT новой книги',
    subtitle: 'Создание записи и RETURNING id',
    steps: [
      {
        spotlight: ['app'],
        label: 'new Book(...) в памяти',
        detail: 'Transient-объект без id',
        packet: 'down',
        code: 'Book book = new Book("Clean Code", "Robert Martin", ...);',
      },
      {
        spotlight: ['jdbc'],
        label: 'INSERT с плейсхолдерами',
        detail: 'RETURNING id в PostgreSQL или getGeneratedKeys()',
        packet: 'down',
        code: 'INSERT INTO books (...) VALUES (?, ?, ?, ?, ?) RETURNING id',
      },
      {
        spotlight: ['db'],
        label: 'СУБД вставляет строку',
        detail: 'Проверка UNIQUE на isbn, default available = true',
        packet: 'request',
        code: '-- id = 4 назначен SERIAL/BIGSERIAL',
      },
      {
        spotlight: ['jdbc', 'app'],
        label: 'ID записан в объект',
        detail: 'book.setId(generatedKeys.getLong(1))',
        packet: 'up',
        code: 'book.setId(rs.getLong("id"));\nreturn book;',
      },
    ],
  },
  {
    id: 'jpa',
    title: 'JPA dirty checking',
    subtitle: 'Изменение без явного UPDATE',
    steps: [
      {
        spotlight: ['app'],
        label: '@Transactional метод',
        detail: 'em.find() загружает managed-сущность',
        packet: 'down',
        code: 'Book b = em.find(Book.class, id);\nb.setAvailable(false);',
      },
      {
        spotlight: ['jdbc'],
        label: 'Flush перед commit',
        detail: 'Hibernate генерирует UPDATE только для изменённых полей',
        packet: 'down',
        code: 'UPDATE books SET available = ? WHERE id = ?',
      },
      {
        spotlight: ['db'],
        label: 'COMMIT',
        detail: 'Транзакция фиксирует изменение; L1-кэш очищается при close EM',
        packet: 'request',
        code: 'tx.commit();',
      },
    ],
  },
];

export function cloneBooks(books) {
  return books.map((b) => ({...b}));
}

export function nextBookId(books) {
  return books.reduce((max, b) => Math.max(max, b.id), 0) + 1;
}

export function runCrud(books, op, {id, title, author, isbn, published_year, available}) {
  const next = cloneBooks(books);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((b) => b.id === numId);
      return {books: next, rows: row ? [row] : [], message: row ? null : 'Книга не найдена'};
    }
    return {books: next, rows: next.filter((b) => b.available), message: null};
  }

  if (op === 'create') {
    if (!title?.trim() || !author?.trim() || !isbn?.trim()) {
      return {books: next, rows: [], message: 'Заполните title, author и isbn'};
    }
    if (next.some((b) => b.isbn === isbn.trim())) {
      return {books: next, rows: [], message: 'Нарушение UNIQUE: isbn уже существует'};
    }
    const row = {
      id: nextBookId(next),
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      published_year: Number(published_year) || new Date().getFullYear(),
      available: available !== false,
    };
    next.push(row);
    return {books: next, rows: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((b) => b.id === numId);
    if (idx < 0) {
      return {books: next, rows: [], message: 'Книга не найдена'};
    }
    next[idx] = {
      ...next[idx],
      title: title?.trim() || next[idx].title,
      author: author?.trim() || next[idx].author,
      available: typeof available === 'boolean' ? available : next[idx].available,
    };
    return {books: next, rows: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((b) => b.id === numId);
    if (idx < 0) {
      return {books: next, rows: [], message: 'Книга не найдена'};
    }
    const removed = next.splice(idx, 1);
    return {books: next, rows: removed, message: null};
  }

  return {books: next, rows: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = ${id};`;
      }
      return 'SELECT id, title, author, isbn, published_year, available\nFROM books WHERE available = true;';
    case 'create':
      return `INSERT INTO books (title, author, isbn, published_year, available)\nVALUES ('${params.title}', '${params.author}', '${params.isbn}', ${params.published_year}, ${params.available})\nRETURNING id;`;
    case 'update':
      return `UPDATE books\nSET title = '${params.title}', available = ${params.available}\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM books WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function javaCodeForLayer(layer, op, params) {
  const id = params.id ?? '2L';
  const snippets = {
    jdbc: {
      read: params.id
        ? `try (Connection conn = dataSource.getConnection();\n     PreparedStatement ps = conn.prepareStatement(\n       "SELECT * FROM books WHERE id = ?")) {\n  ps.setLong(1, ${id}L);\n  try (ResultSet rs = ps.executeQuery()) {\n    if (rs.next()) return mapRow(rs);\n  }\n}\nreturn Optional.empty();`
        : `// список доступных\nString sql = "SELECT * FROM books WHERE available = true";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n  try (ResultSet rs = ps.executeQuery()) {\n    while (rs.next()) books.add(mapRow(rs));\n  }\n}`,
      create: `String sql = """\n  INSERT INTO books (title, author, isbn, published_year, available)\n  VALUES (?, ?, ?, ?, ?) RETURNING id\n""";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n  ps.setString(1, "${params.title}");\n  ps.setString(2, "${params.author}");\n  // ...\n  ps.executeUpdate();\n}`,
      update: `String sql = "UPDATE books SET title = ?, available = ? WHERE id = ?";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n  ps.setString(1, "${params.title}");\n  ps.setBoolean(2, ${params.available});\n  ps.setLong(3, ${id}L);\n  return ps.executeUpdate() > 0;\n}`,
      delete: `String sql = "DELETE FROM books WHERE id = ?";\ntry (PreparedStatement ps = conn.prepareStatement(sql)) {\n  ps.setLong(1, ${id}L);\n  return ps.executeUpdate() > 0;\n}`,
    },
    jpa: {
      read: params.id
        ? `EntityManager em = ...;\nBook book = em.find(Book.class, ${id}L);\n// managed-сущность или null`
        : `TypedQuery<Book> q = em.createQuery(\n  "SELECT b FROM Book b WHERE b.available = true", Book.class);\nList<Book> list = q.getResultList();`,
      create: `Book book = new Book("${params.title}", "${params.author}", ...);\nem.persist(book); // INSERT при flush/commit\n// id появится после commit`,
      update: `@Transactional\npublic void markUnavailable(Long id) {\n  Book b = em.find(Book.class, id);\n  b.setAvailable(false); // dirty checking → UPDATE\n}`,
      delete: `Book b = em.find(Book.class, ${id}L);\nem.remove(b); // DELETE при commit`,
    },
    spring: {
      read: params.id
        ? `Optional<Book> book = bookRepository.findById(${id}L);`
        : `List<Book> books = bookRepository.findByAvailableTrue();`,
      create: `Book book = new Book("${params.title}", "${params.author}", ...);\nreturn bookRepository.save(book);`,
      update: `bookRepository.findById(${id}L).ifPresent(b -> {\n  b.setAvailable(false);\n  // save() не нужен — dirty checking\n});`,
      delete: `bookRepository.deleteById(${id}L);`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
