/** In-memory модель и сценарии для SwiftDatabasePlay */

export {cloneBooks, nextBookId, runCrud, sqlForOp} from './javaDatabaseEngine';

export const BOOK_COLUMNS = ['id', 'title', 'author', 'isbn', 'published_year', 'available'];

export const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'The Swift Programming Language',
    author: 'Apple Inc.',
    isbn: '978-1942878550',
    published_year: 2024,
    available: true,
  },
  {
    id: 2,
    title: 'Hacking with Swift',
    author: 'Paul Hudson',
    isbn: '978-1950325051',
    published_year: 2023,
    available: true,
  },
  {
    id: 3,
    title: 'Pro Swift',
    author: 'Paul Hudson',
    isbn: '978-1950325068',
    published_year: 2022,
    available: false,
  },
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Swift-приложение', short: 'Код', role: 'struct Book, Repository, async/await'},
  {id: 'api', label: 'Слой доступа', short: 'GRDB / Fluent', role: 'SQLite.swift · Core Data · Realm'},
  {id: 'driver', label: 'Драйвер / Store', short: 'Driver', role: 'SQLite C API · NSPersistentStore'},
  {id: 'file', label: 'Файл хранилища', short: '.sqlite3', role: 'database.sqlite3 · Realm file'},
  {id: 'db', label: 'Данные', short: 'SQLite', role: 'Таблица books · ACID · WAL'},
];

export const ACCESS_LAYERS = [
  {id: 'sqlite_swift', label: 'SQLite.swift', desc: 'Типобезопасный DSL, Expression<T>'},
  {id: 'grdb', label: 'GRDB', desc: 'Codable, миграции, DatabaseQueue'},
  {id: 'coredata', label: 'Core Data', desc: 'NSManagedObject, контексты, fetchRequest'},
  {id: 'fluent', label: 'Fluent (Vapor)', desc: 'Model, QueryBuilder, PostgreSQL'},
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
    label: 'Открытие Connection / Store',
    detail: 'GRDB: DatabaseQueue(path:) · SQLite.swift: Connection(path) · Core Data: NSPersistentContainer.loadPersistentStores',
    layers: ['api', 'file'],
    code: 'let dbQueue = try DatabaseQueue(path: dbPath)\n// или let db = try Connection(dbPath)',
  },
  {
    id: 'schema',
    label: 'Схема и миграции',
    detail: 'GRDB migrator · SQLite.swift create(table:) · Core Data .xcdatamodeld',
    layers: ['api', 'db'],
    code: 'try dbQueue.write { db in\n    try db.create(table: "books") { t in\n        t.autoIncrementedPrimaryKey("id")\n        t.column("title", .text).notNull()\n    }\n}',
  },
  {
    id: 'prepare',
    label: 'Подготовка запроса',
    detail: 'Параметры через ? или именованные плейсхолдеры — защита от SQL-инъекций.',
    layers: ['api', 'driver'],
    code: 'let sql = "SELECT * FROM books WHERE id = ?"\ntry dbQueue.read { db in\n    try Book.fetchOne(db, sql: sql, arguments: [id])\n}',
  },
  {
    id: 'execute',
    label: 'read / write / save',
    detail: 'GRDB: dbQueue.read { } / write { } · Core Data: context.save() внутри perform',
    layers: ['driver', 'db'],
    code: 'try dbQueue.write { db in\n    try book.insert(db)\n}',
  },
  {
    id: 'map',
    label: 'Маппинг в struct / NSManagedObject',
    detail: 'Book: Codable, FetchableRecord · Core Data: @NSManaged или @Model (SwiftData)',
    layers: ['app'],
    code: 'struct Book: Codable, FetchableRecord {\n    var id: Int64\n    var title: String\n    var available: Bool\n}',
  },
  {
    id: 'observe',
    label: 'Наблюдение за изменениями',
    detail: 'GRDB ValueObservation · Core Data NSFetchedResultsController · Realm live objects',
    layers: ['app', 'api'],
    code: 'let observation = ValueObservation\n    .tracking { db in try Book.fetchAll(db) }\nobservation.start(in: dbQueue) { books in ... }',
  },
  {
    id: 'close',
    label: 'Закрытие / deinit',
    detail: 'DatabaseQueue закрывается при deinit; Core Data — save() перед выходом из контекста.',
    layers: ['file', 'api'],
    code: '// dbQueue = nil → WAL checkpoint\n// context.save() перед background → foreground',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT по ID',
    subtitle: 'Чтение книги через GRDB и Codable',
    steps: [
      {
        spotlight: ['app'],
        label: 'Repository запрашивает книгу',
        detail: 'bookRepository.find(id: 2)',
        packet: 'down',
        code: 'let book = try await repository.find(id: 2)',
      },
      {
        spotlight: ['api', 'driver'],
        label: 'DatabaseQueue.read',
        detail: 'GRDB сериализует чтение; SQLite WAL допускает параллельные readers',
        packet: 'down',
        code: 'try dbQueue.read { db in\n    try Book.fetchOne(db, key: 2)\n}',
      },
      {
        spotlight: ['driver', 'file'],
        label: 'SQLite выполняет SELECT',
        detail: 'Индекс по PRIMARY KEY, одна строка из database.sqlite3',
        packet: 'request',
        code: 'SELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = 2;',
      },
      {
        spotlight: ['app', 'api'],
        label: 'Row → struct Book',
        detail: 'FetchableRecord декодирует столбцы в свойства Swift',
        packet: 'up',
        code: 'return try Book.fetchOne(db, key: id)',
      },
      {
        spotlight: ['app'],
        label: 'async/await возвращает результат',
        detail: 'UI обновляется на MainActor после await',
        packet: 'up',
        code: '@MainActor\nfunc loadBook(id: Int64) async { ... }',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT новой книги',
    subtitle: 'SQLite.swift DSL и автоинкремент id',
    steps: [
      {
        spotlight: ['app'],
        label: 'Book(...) без id',
        detail: 'struct в памяти — ещё не сохранена',
        packet: 'down',
        code: 'let book = Book(\n    title: "Server Side Swift",\n    author: "Paul Hudson",\n    ...\n)',
      },
      {
        spotlight: ['api'],
        label: 'SQLite.swift insert',
        detail: 'Expression<T> и оператор <- для значений',
        packet: 'down',
        code: 'try db.run(books.insert(\n    title <- book.title,\n    author <- book.author,\n    available <- true\n))',
      },
      {
        spotlight: ['db', 'file'],
        label: 'SQLite вставляет строку',
        detail: 'AUTOINCREMENT назначает id = 4; проверка UNIQUE на isbn',
        packet: 'request',
        code: 'INSERT INTO books (title, author, isbn, published_year, available)\nVALUES (?, ?, ?, ?, ?);',
      },
      {
        spotlight: ['app', 'api'],
        label: 'lastInsertRowId',
        detail: 'db.lastInsertRowid или RETURNING id в GRDB',
        packet: 'up',
        code: 'let newId = db.lastInsertRowid\nreturn book.with(id: newId)',
      },
    ],
  },
  {
    id: 'coredata',
    title: 'Core Data save',
    subtitle: 'NSManagedObjectContext и фоновая очередь',
    steps: [
      {
        spotlight: ['app'],
        label: 'Изменение managed object',
        detail: 'book.available = false на viewContext или backgroundContext',
        packet: 'down',
        code: 'let book = try context.fetch(request).first\nbook.available = false',
      },
      {
        spotlight: ['api', 'driver'],
        label: 'context.save()',
        detail: 'Coordinator записывает изменения в persistent store (SQLite)',
        packet: 'down',
        code: 'try context.save() // throws при конфликте версий',
      },
      {
        spotlight: ['db', 'file'],
        label: 'UPDATE в SQLite',
        detail: 'NSPersistentStoreCoordinator генерирует SQL под капотом',
        packet: 'request',
        code: 'UPDATE ZBOOK SET ZAVAILABLE = 0 WHERE Z_PK = 2;',
      },
      {
        spotlight: ['app'],
        label: 'NSFetchedResultsController / @FetchRequest',
        detail: 'UI автоматически получает diff изменений',
        packet: 'up',
        code: '@FetchRequest(sortDescriptors: [...])\nvar books: FetchedResults<BookEntity>',
      },
    ],
  },
  {
    id: 'fluent',
    title: 'Fluent + PostgreSQL (Vapor)',
    subtitle: 'Серверный Swift: async query и пул соединений',
    steps: [
      {
        spotlight: ['app'],
        label: 'Controller вызывает Model.query',
        detail: 'Vapor route handler на event loop',
        packet: 'down',
        code: 'let users = try await User.query(on: req.db)\n    .filter(\\.$age > 18)\n    .all()',
      },
      {
        spotlight: ['api', 'driver'],
        label: 'Fluent → PostgresNIO',
        detail: 'SQLBuilder генерирует параметризованный запрос',
        packet: 'down',
        code: 'SELECT "users".* FROM "users"\nWHERE "users"."age" > $1',
      },
      {
        spotlight: ['db'],
        label: 'PostgreSQL выполняет запрос',
        detail: 'Пул соединений на сервере; не тот же SQLite, что на iPhone',
        packet: 'request',
        code: '-- Vapor + postgres-nio\n-- результат → [User] через Codable',
      },
      {
        spotlight: ['app'],
        label: 'JSON-ответ клиенту',
        detail: 'Content encodable → HTTP 200 + application/json',
        packet: 'up',
        code: 'return try await users.encodeResponse(for: req)',
      },
    ],
  },
];

export function swiftCodeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    sqlite_swift: {
      read: params.id
        ? `let db = try Connection(dbPath)\nlet users = Table("books")\nlet idCol = Expression<Int64>("id")\n\nlet query = users.filter(idCol == ${id})\nfor row in try db.prepare(query) {\n    let book = Book(\n        id: row[idCol],\n        title: row[Expression<String>("title")]\n    )\n}`
        : `let query = users.filter(Expression<Bool>("available") == true)\nreturn try db.prepare(query).map { row in ... }`,
      create: `try db.run(users.create { t in\n    t.column(id, primaryKey: .autoincrement)\n    t.column(Expression<String>("title"))\n})\n\ntry db.run(users.insert(\n    Expression<String>("title") <- "${params.title}",\n    Expression<String>("author") <- "${params.author}"\n))`,
      update: `try db.run(users\n    .filter(id == ${id})\n    .update(\n        Expression<String>("title") <- "${params.title}",\n        Expression<Bool>("available") <- ${params.available}\n    ))`,
      delete: `try db.run(users.filter(id == ${id}).delete())`,
    },
    grdb: {
      read: params.id
        ? `try dbQueue.read { db in\n    try Book.fetchOne(db, key: ${id})\n}`
        : `try dbQueue.read { db in\n    try Book\n        .filter(Column("available") == true)\n        .fetchAll(db)\n}`,
      create: `try dbQueue.write { db in\n    var book = Book(\n        title: "${params.title}",\n        author: "${params.author}",\n        isbn: "${params.isbn}",\n        available: true\n    )\n    try book.insert(db)\n    return book\n}`,
      update: `try dbQueue.write { db in\n    var book = try Book.fetchOne(db, key: ${id})!\n    book.title = "${params.title}"\n    book.available = ${params.available}\n    try book.update(db)\n}`,
      delete: `try dbQueue.write { db in\n    _ = try Book.deleteOne(db, key: ${id})\n}`,
    },
    coredata: {
      read: params.id
        ? `let request = BookEntity.fetchRequest()\nrequest.predicate = NSPredicate(\n    format: "id == %d", ${id}\n)\nlet results = try viewContext.fetch(request)\nreturn results.first`
        : `let request = BookEntity.fetchRequest()\nrequest.predicate = NSPredicate(\n    format: "available == YES"\n)\nreturn try viewContext.fetch(request)`,
      create: `let entity = BookEntity(context: viewContext)\nentity.title = "${params.title}"\nentity.author = "${params.author}"\nentity.available = true\ntry viewContext.save()`,
      update: `let book = try fetchBook(id: ${id})\nbook.title = "${params.title}"\nbook.available = ${params.available}\ntry viewContext.save()`,
      delete: `let book = try fetchBook(id: ${id})\nviewContext.delete(book)\ntry viewContext.save()`,
    },
    fluent: {
      read: params.id
        ? `let book = try await Book.find(${id}, on: database)`
        : `let books = try await Book.query(on: database)\n    .filter(\\.$available == true)\n    .all()`,
      create: `let book = Book(\n    title: "${params.title}",\n    author: "${params.author}",\n    isbn: "${params.isbn}"\n)\ntry await book.save(on: database)`,
      update: `guard let book = try await Book.find(${id}, on: database) else {\n    throw Abort(.notFound)\n}\nbook.title = "${params.title}"\nbook.available = ${params.available}\ntry await book.save(on: database)`,
      delete: `try await Book.find(${id}, on: database)?.delete(on: database)`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
