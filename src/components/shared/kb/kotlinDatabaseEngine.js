/** In-memory модель и сценарии для KotlinDatabasePlay */

export {cloneBooks, nextBookId, runCrud, sqlForOp} from './javaDatabaseEngine';

export const BOOK_COLUMNS = ['id', 'title', 'author', 'isbn', 'published_year', 'available'];

export const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Kotlin in Action',
    author: 'Dmitry Jemerov',
    isbn: '978-1617293290',
    published_year: 2017,
    available: true,
  },
  {
    id: 2,
    title: 'Atomic Kotlin',
    author: 'Bruce Eckel',
    isbn: '978-0981872534',
    published_year: 2019,
    available: true,
  },
  {
    id: 3,
    title: 'Programming Kotlin',
    author: 'Venkat Subramaniam',
    isbn: '978-1491972735',
    published_year: 2019,
    available: false,
  },
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Kotlin-приложение', short: 'Код', role: 'Сервис, data class, репозиторий'},
  {id: 'jdbc', label: 'JDBC API', short: 'java.sql', role: 'Connection · PreparedStatement · ResultSet'},
  {id: 'driver', label: 'JDBC-драйвер', short: 'Driver', role: 'postgresql-42.x.jar'},
  {id: 'pool', label: 'Пул соединений', short: 'Pool', role: 'HikariCP · DataSource'},
  {id: 'db', label: 'СУБД', short: 'PostgreSQL', role: 'Таблица books · ACID'},
];

export const ACCESS_LAYERS = [
  {id: 'jdbc', label: 'JDBC', desc: 'Прямой SQL, расширения use / mapRow'},
  {id: 'exposed', label: 'Exposed', desc: 'SQL DSL и transaction { }'},
  {id: 'ktorm', label: 'Ktorm', desc: 'Иммутабельные data class, типобезопасный DSL'},
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
    detail: 'Gradle/Maven подтягивает postgresql.jar; SPI регистрирует Driver.',
    layers: ['driver'],
    code: '// JDBC 4+: Class.forName не нужен\n// DriverManager находит драйвер по URL',
  },
  {
    id: 'pool',
    label: 'Пул выдаёт Connection',
    detail: 'HikariDataSource.connection — готовое соединение из пула.',
    layers: ['pool', 'driver'],
    code: 'dataSource.connection.use { conn ->\n    // работа с conn\n}',
  },
  {
    id: 'prepare',
    label: 'PreparedStatement',
    detail: 'SQL с ? — защита от инъекций, кэш плана на стороне СУБД.',
    layers: ['jdbc', 'app'],
    code: 'val ps = conn.prepareStatement(sql)\nps.setLong(1, id)',
  },
  {
    id: 'execute',
    label: 'executeQuery / executeUpdate',
    detail: 'SELECT → ResultSet; INSERT/UPDATE/DELETE → число затронутых строк.',
    layers: ['jdbc', 'db'],
    code: 'val rs = ps.executeQuery()\n// или val n = ps.executeUpdate()',
  },
  {
    id: 'cursor',
    label: 'Курсор ResultSet',
    detail: 'rs.next() перемещает курсор; getLong/getString читают текущую строку.',
    layers: ['jdbc'],
    code: 'while (rs.next()) {\n    val id = rs.getLong("id")\n}',
  },
  {
    id: 'map',
    label: 'Маппинг в data class',
    detail: 'ResultSet → Book: mapRow или Exposed/Ktorm row mapper.',
    layers: ['app'],
    code: 'Book(id = rs.getLong("id"), name = rs.getString("title")!!)\n// Exposed: Users.select { ... }.map { ... }',
  },
  {
    id: 'close',
    label: 'Закрытие ресурсов',
    detail: 'Расширение use: ResultSet → Statement → Connection в обратном порядке.',
    layers: ['pool', 'jdbc'],
    code: '} // conn.close() → пул, не разрыв TCP',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT по ID',
    subtitle: 'Чтение книги через JDBC и расширение use',
    steps: [
      {
        spotlight: ['app'],
        label: 'Сервис запрашивает книгу',
        detail: 'bookRepository.findById(2L)',
        packet: 'down',
        code: 'val book: Book? = repo.findById(2L)',
      },
      {
        spotlight: ['jdbc', 'pool'],
        label: 'Connection из пула',
        detail: 'dataSource.connection.use { } — идиоматичный Kotlin',
        packet: 'down',
        code: 'dataSource.connection.use { conn ->\n    // autoCommit true для чтения\n}',
      },
      {
        spotlight: ['jdbc', 'driver'],
        label: 'PreparedStatement',
        detail: 'Параметр id = ? — без конкатенации строк',
        packet: 'down',
        code: 'val ps = conn.prepareStatement(\n    "SELECT * FROM books WHERE id = ?")\nps.setLong(1, 2L)',
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
        detail: 'rs.next() один раз; mapRow заполняет data class',
        packet: 'up',
        code: 'if (rs.next()) mapRow(rs) else null',
      },
      {
        spotlight: ['app', 'pool'],
        label: 'Возврат соединения в пул',
        detail: 'use закрывает ResultSet, Statement, Connection',
        packet: 'up',
        code: '} // conn.close() → пул',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT новой книги',
    subtitle: 'data class без id → RETURNING id',
    steps: [
      {
        spotlight: ['app'],
        label: 'Book(...) в памяти',
        detail: 'Объект без id — ещё не в БД',
        packet: 'down',
        code: 'val book = Book(\n    title = "Clean Architecture",\n    author = "Robert Martin",\n    ...\n)',
      },
      {
        spotlight: ['jdbc'],
        label: 'INSERT с плейсхолдерами',
        detail: 'RETURNING id в PostgreSQL',
        packet: 'down',
        code: 'INSERT INTO books (...) VALUES (?, ?, ?, ?, ?) RETURNING id',
      },
      {
        spotlight: ['db'],
        label: 'СУБД вставляет строку',
        detail: 'Проверка UNIQUE на isbn',
        packet: 'request',
        code: '-- id = 4 назначен SERIAL/BIGSERIAL',
      },
      {
        spotlight: ['jdbc', 'app'],
        label: 'copy с новым id',
        detail: 'book.copy(id = rs.getLong("id"))',
        packet: 'up',
        code: 'return book.copy(id = rs.getLong("id"))',
      },
    ],
  },
  {
    id: 'exposed',
    title: 'Exposed transaction',
    subtitle: 'Типобезопасный DSL внутри transaction { }',
    steps: [
      {
        spotlight: ['app'],
        label: 'Вызов репозитория',
        detail: 'suspend или blocking — transaction на Dispatchers.IO',
        packet: 'down',
        code: 'fun markUnavailable(id: Long) = transaction {\n    Users.update({ Users.available eq false }) {\n        Users.id eq id\n    }\n}',
      },
      {
        spotlight: ['jdbc'],
        label: 'Exposed генерирует SQL',
        detail: 'Параметры передаются безопасно, не через конкатенацию',
        packet: 'down',
        code: 'UPDATE books SET available = ? WHERE id = ?',
      },
      {
        spotlight: ['db'],
        label: 'COMMIT',
        detail: 'При успехе — commit; при исключении — rollback',
        packet: 'request',
        code: 'transaction { ... } // commit/rollback автоматически',
      },
    ],
  },
];

export function kotlinCodeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    jdbc: {
      read: params.id
        ? `dataSource.connection.use { conn ->\n    conn.prepareStatement(\n        "SELECT * FROM books WHERE id = ?"\n    ).use { ps ->\n        ps.setLong(1, ${id}L)\n        ps.executeQuery().use { rs ->\n            if (rs.next()) mapRow(rs) else null\n        }\n    }\n}`
        : `dataSource.connection.use { conn ->\n    conn.prepareStatement(\n        "SELECT * FROM books WHERE available = true"\n    ).use { ps ->\n        ps.executeQuery().use { rs ->\n            buildList {\n                while (rs.next()) add(mapRow(rs))\n            }\n        }\n    }\n}`,
      create: `dataSource.connection.use { conn ->\n    val sql = """\n        INSERT INTO books (title, author, isbn, published_year, available)\n        VALUES (?, ?, ?, ?, ?) RETURNING id\n    """.trimIndent()\n    conn.prepareStatement(sql).use { ps ->\n        ps.setString(1, "${params.title}")\n        ps.setString(2, "${params.author}")\n        // ...\n        ps.executeQuery().use { rs ->\n            rs.next()\n            rs.getLong("id")\n        }\n    }\n}`,
      update: `dataSource.connection.use { conn ->\n    conn.prepareStatement(\n        "UPDATE books SET title = ?, available = ? WHERE id = ?"\n    ).use { ps ->\n        ps.setString(1, "${params.title}")\n        ps.setBoolean(2, ${params.available})\n        ps.setLong(3, ${id}L)\n        ps.executeUpdate() > 0\n    }\n}`,
      delete: `dataSource.connection.use { conn ->\n    conn.prepareStatement("DELETE FROM books WHERE id = ?").use { ps ->\n        ps.setLong(1, ${id}L)\n        ps.executeUpdate() > 0\n    }\n}`,
    },
    exposed: {
      read: params.id
        ? `transaction {\n    Users.selectAll()\n        .where { Users.id eq ${id}L }\n        .map { row ->\n            Book(\n                id = row[Users.id],\n                title = row[Users.title],\n                ...\n            )\n        }\n        .singleOrNull()\n}`
        : `transaction {\n    Users.selectAll()\n        .where { Users.available eq true }\n        .map { /* row → Book */ }\n}`,
      create: `transaction {\n    Users.insert {\n        it[title] = "${params.title}"\n        it[author] = "${params.author}"\n        it[isbn] = "${params.isbn}"\n        it[available] = true\n    }[Users.id]\n}`,
      update: `transaction {\n    Users.update({ Users.title eq "${params.title}"; Users.available eq ${params.available} }) {\n        Users.id eq ${id}L\n    }\n}`,
      delete: `transaction {\n    Users.deleteWhere { Users.id eq ${id}L }\n}`,
    },
    ktorm: {
      read: params.id
        ? `database.from(Users)\n    .select()\n    .where { Users.id eq ${id} }\n    .map { it.mapper }\n    .singleOrNull()`
        : `database.from(Users)\n    .select()\n    .where { Users.available eq true }\n    .map { it.mapper }`,
      create: `database.insert(Users) {\n    set(it.title, "${params.title}")\n    set(it.author, "${params.author}")\n    set(it.isbn, "${params.isbn}")\n    set(it.available, true)\n}`,
      update: `database.update(Users) {\n    set(it.title, "${params.title}")\n    set(it.available, ${params.available})\n    where { Users.id eq ${id} }\n}`,
      delete: `database.delete(Users) { Users.id eq ${id} }`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
