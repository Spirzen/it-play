/** In-memory модель и сценарии для GroovyDatabasePlay */

export {cloneBooks, nextBookId, runCrud, sqlForOp} from './javaDatabaseEngine';

export const BOOK_COLUMNS = ['id', 'title', 'author', 'isbn', 'published_year', 'available'];

export const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Groovy in Action',
    author: 'Dierk König',
    isbn: '978-1932394848',
    published_year: 2015,
    available: true,
  },
  {
    id: 2,
    title: 'Programming Grails',
    author: 'Burt Beckwith',
    isbn: '978-1937785485',
    published_year: 2013,
    available: true,
  },
  {
    id: 3,
    title: 'Grails in Action',
    author: 'Glen Smith',
    isbn: '978-1617290961',
    published_year: 2014,
    available: false,
  },
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Groovy / Grails', short: 'Код', role: 'Контроллер, сервис, доменный класс'},
  {id: 'gorm', label: 'GORM', short: 'ORM', role: 'Active Record · Hibernate Session'},
  {id: 'jdbc', label: 'JDBC API', short: 'java.sql', role: 'PreparedStatement · ResultSet'},
  {id: 'driver', label: 'JDBC-драйвер', short: 'Driver', role: 'postgresql-42.x.jar'},
  {id: 'pool', label: 'Пул соединений', short: 'Pool', role: 'HikariCP · DataSource'},
  {id: 'db', label: 'СУБД', short: 'PostgreSQL', role: 'Таблица books · ACID'},
];

export const ACCESS_LAYERS = [
  {id: 'gorm', label: 'GORM', desc: 'Book.get · save · findAllBy*'},
  {id: 'groovySql', label: 'groovy.sql.Sql', desc: 'Скрипты, ETL, миграции'},
  {id: 'jdbc', label: 'JDBC', desc: 'Прямой SQL без ORM'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'domain',
    label: 'Доменный класс Book',
    detail: 'Поля класса → столбцы; constraints в static constraints = { }.',
    layers: ['app', 'gorm'],
    code: 'class Book {\n    String title\n    String author\n    BigDecimal price\n    static constraints = {\n        title blank: false\n    }\n}',
  },
  {
    id: 'pool',
    label: 'DataSource выдаёт Connection',
    detail: 'Grails/Spring Boot: HikariCP из application.yml.',
    layers: ['pool', 'driver'],
    code: '// dataSource.url = jdbc:postgresql://localhost:5432/app',
  },
  {
    id: 'session',
    label: 'Hibernate Session',
    detail: 'GORM открывает сессию на время save/find; dirty checking.',
    layers: ['gorm', 'jdbc'],
    code: '// под капотом: SessionFactory.getCurrentSession()',
  },
  {
    id: 'prepare',
    label: 'PreparedStatement',
    detail: 'Hibernate генерирует SQL с ? — параметры отдельно от текста.',
    layers: ['jdbc', 'gorm'],
    code: 'SELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = ?',
  },
  {
    id: 'execute',
    label: 'executeQuery / flush',
    detail: 'SELECT → ResultSet; save() → INSERT/UPDATE при flush.',
    layers: ['jdbc', 'db'],
    code: 'book.save(failOnError: true)  // flush → SQL',
  },
  {
    id: 'map',
    label: 'Строка → объект Book',
    detail: 'Active Record: экземпляр знает, как сохранить себя.',
    layers: ['app', 'gorm'],
    code: 'Book book = Book.get(1L)\nbook.price = 39.99G\nbook.save()',
  },
  {
    id: 'transaction',
    label: 'withTransaction / @Transactional',
    detail: 'Несколько save в одной транзакции — commit или rollback.',
    layers: ['gorm', 'pool'],
    code: 'Book.withTransaction { status ->\n    if (!b.save()) status.setRollbackOnly()\n}',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'gorm_get',
    title: 'Book.get(id)',
    subtitle: 'Чтение через GORM → Hibernate → JDBC',
    steps: [
      {
        spotlight: ['app'],
        label: 'Контроллер или сервис',
        detail: 'Book book = Book.get(1L)',
        packet: 'down',
        code: 'Book book = Book.get(1L)',
      },
      {
        spotlight: ['gorm'],
        label: 'GORM строит запрос',
        detail: 'Динамический findBy* или get по первичному ключу',
        packet: 'down',
        code: '// Hibernate: session.get(Book.class, 1L)',
      },
      {
        spotlight: ['pool', 'jdbc'],
        label: 'Connection из пула',
        detail: 'Текущая сессия берёт соединение из DataSource',
        packet: 'down',
        code: 'dataSource.connection → PreparedStatement',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'PostgreSQL: SELECT',
        detail: 'Индекс по PK id = 1',
        packet: 'request',
        code: 'SELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = 1;',
      },
      {
        spotlight: ['gorm', 'app'],
        label: 'ResultSet → Book',
        detail: 'Объект в памяти; ленивые коллекции — при обращении',
        packet: 'up',
        code: 'println book.title  // "Groovy in Action"',
      },
      {
        spotlight: ['pool'],
        label: 'Соединение в пул',
        detail: 'После закрытия сессии/конца запроса',
        packet: 'up',
        code: '// conn.close() → пул, не разрыв TCP',
      },
    ],
  },
  {
    id: 'gorm_save',
    title: 'new Book().save()',
    subtitle: 'Create: валидация constraints → INSERT',
    steps: [
      {
        spotlight: ['app'],
        label: 'Объект в памяти',
        detail: 'new Book(title: "...", author: "...")',
        packet: 'down',
        code: 'def book = new Book(\n    title: "Groovy in Action",\n    author: "Dierk König",\n    price: 49.99G\n)',
      },
      {
        spotlight: ['gorm'],
        label: 'save() и constraints',
        detail: 'hasErrors() или failOnError: true',
        packet: 'down',
        code: 'book.save(failOnError: true)',
      },
      {
        spotlight: ['jdbc', 'db'],
        label: 'INSERT',
        detail: 'Hibernate назначает id (SERIAL/sequence)',
        packet: 'request',
        code: 'INSERT INTO books (title, author, price, ...)\nVALUES (?, ?, ?, ...);',
      },
      {
        spotlight: ['app', 'gorm'],
        label: 'book.id заполнен',
        detail: 'Объект "привязан" к строке — можно update/delete',
        packet: 'up',
        code: 'assert book.id != null',
      },
    ],
  },
  {
    id: 'dynamic_finder',
    title: 'findAllByPriceLessThan',
    subtitle: 'Динамический метод → SQL WHERE',
    steps: [
      {
        spotlight: ['app'],
        label: 'Вызов в коде',
        detail: 'List<Book> cheap = Book.findAllByPriceLessThan(50.0G)',
        packet: 'down',
        code: 'List<Book> cheap = Book.findAllByPriceLessThan(50.0G)',
      },
      {
        spotlight: ['gorm'],
        label: 'GORM генерирует WHERE',
        detail: 'Имя метода → price < ?',
        packet: 'down',
        code: '// criteria / HQL под капотом',
      },
      {
        spotlight: ['db'],
        label: 'SELECT с фильтром',
        detail: 'Индекс по price ускоряет выборку',
        packet: 'request',
        code: 'SELECT * FROM books WHERE price < 50.0;',
      },
      {
        spotlight: ['app'],
        label: 'Список доменов',
        detail: 'N+1 при author.books — нужен fetch join',
        packet: 'up',
        code: 'cheap.each { println it.title }',
      },
    ],
  },
  {
    id: 'groovy_sql',
    title: 'groovy.sql.Sql.eachRow',
    subtitle: 'Скрипт без GORM — тонкая обёртка JDBC',
    steps: [
      {
        spotlight: ['app'],
        label: 'Скрипт или задача ETL',
        detail: 'import groovy.sql.Sql',
        packet: 'down',
        code: "import groovy.sql.Sql\n\ndef sql = Sql.newInstance(url, user, pass, driver)",
      },
      {
        spotlight: ['jdbc', 'pool'],
        label: 'DriverManager / пул',
        detail: 'Один Connection на скрипт; sql.close() в конце',
        packet: 'down',
        code: "sql.eachRow('SELECT id, title FROM books WHERE price < ?', [50.0]) { row ->",
      },
      {
        spotlight: ['db'],
        label: 'Параметризованный SELECT',
        detail: '? — защита от SQL-инъекций',
        packet: 'request',
        code: 'SELECT id, title FROM books WHERE price < 50.0;',
      },
      {
        spotlight: ['app'],
        label: 'row.id, row.title',
        detail: 'GroovyRowResult — доступ как к свойствам',
        packet: 'up',
        code: '    println "${row.id}: ${row.title}"\n}\nsql.close()',
      },
    ],
  },
  {
    id: 'has_many',
    title: 'hasMany / belongsTo',
    subtitle: 'Связь Author ↔ Book',
    steps: [
      {
        spotlight: ['app'],
        label: 'Author и Book',
        detail: 'static hasMany = [books: Book]',
        packet: 'down',
        code: 'class Author {\n    String name\n    static hasMany = [books: Book]\n}',
      },
      {
        spotlight: ['gorm'],
        label: 'addToBooks',
        detail: 'author.addToBooks(new Book(...)).save()',
        packet: 'down',
        code: 'author.addToBooks(new Book(title: "Groovy in Action")).save()',
      },
      {
        spotlight: ['db'],
        label: 'FK book.author_id',
        detail: 'INSERT book + UPDATE FK или один INSERT с author_id',
        packet: 'request',
        code: 'INSERT INTO book (title, author_id) VALUES (?, ?);',
      },
      {
        spotlight: ['app'],
        label: 'author.books.each',
        detail: 'Ленивая загрузка — отдельный SELECT без join',
        packet: 'up',
        code: 'author.books.each { println it.title }',
      },
    ],
  },
];

export function groovyCodeForLayer(layer, op, params) {
  const id = params.id ?? '1';
  const snippets = {
    gorm: {
      read: params.id
        ? `Book book = Book.get(${id}L)`
        : `List<Book> books = Book.findAllByAvailable(true)`,
      create: `def book = new Book(\n    title: "${params.title}",\n    author: "${params.author}",\n    isbn: "${params.isbn}",\n    available: true\n)\nbook.save(failOnError: true)`,
      update: `Book book = Book.get(${id}L)\nbook.title = "${params.title}"\nbook.available = ${params.available}\nbook.save()`,
      delete: `Book book = Book.get(${id}L)\nbook.delete()`,
    },
    groovySql: {
      read: params.id
        ? `sql.firstRow(\n    'SELECT * FROM books WHERE id = ?',\n    [${id}]\n)`
        : `sql.eachRow(\n    'SELECT * FROM books WHERE available = ?',\n    [true]\n) { row ->\n    println row.title\n}`,
      create: `sql.executeInsert(\n    'INSERT INTO books (title, author, isbn, available) VALUES (?, ?, ?, ?)',\n    ["${params.title}", "${params.author}", "${params.isbn}", true]\n)`,
      update: `sql.executeUpdate(\n    'UPDATE books SET title = ?, available = ? WHERE id = ?',\n    ["${params.title}", ${params.available}, ${id}]\n)`,
      delete: `sql.executeUpdate(\n    'DELETE FROM books WHERE id = ?',\n    [${id}]\n)`,
    },
    jdbc: {
      read: params.id
        ? `def conn = dataSource.connection\ntry {\n    def ps = conn.prepareStatement('SELECT * FROM books WHERE id = ?')\n    ps.setLong(1, ${id}L)\n    def rs = ps.executeQuery()\n    if (rs.next()) mapRow(rs)\n} finally {\n    conn.close()\n}`
        : `// аналогично: WHERE available = true`,
      create: `// INSERT через PreparedStatement и RETURNING id`,
      update: `// UPDATE books SET ... WHERE id = ?`,
      delete: `// DELETE FROM books WHERE id = ?`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
