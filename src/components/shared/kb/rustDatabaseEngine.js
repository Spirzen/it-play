/** In-memory модель и сценарии для RustDatabasePlay */

export {cloneBooks, nextBookId, runCrud, sqlForOp} from './javaDatabaseEngine';

export const BOOK_COLUMNS = ['id', 'title', 'author', 'isbn', 'published_year', 'available'];

export const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'The Rust Programming Language',
    author: 'Steve Klabnik',
    isbn: '978-1593278281',
    published_year: 2018,
    available: true,
  },
  {
    id: 2,
    title: 'Programming Rust',
    author: 'Jim Blandy',
    isbn: '978-1492052598',
    published_year: 2021,
    available: true,
  },
  {
    id: 3,
    title: 'Rust for Rustaceans',
    author: 'Jon Gjengset',
    isbn: '978-1718503105',
    published_year: 2021,
    available: false,
  },
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Rust-приложение', short: 'Код', role: 'Axum / Actix · сервис · DTO'},
  {id: 'orm', label: 'ORM / драйвер', short: 'API', role: 'SeaORM · Diesel · tokio-postgres'},
  {id: 'driver', label: 'Нативный драйвер', short: 'Crate', role: 'tokio-postgres · postgres · rusqlite'},
  {id: 'pool', label: 'Пул соединений', short: 'Pool', role: 'bb8 · r2d2 · встроенный пул SeaORM'},
  {id: 'db', label: 'СУБД', short: 'PostgreSQL', role: 'Таблица books · ACID · транзакции'},
];

export const ACCESS_LAYERS = [
  {id: 'tokio_postgres', label: 'tokio-postgres', desc: 'Асинхронный SQL, плейсхолдеры $1'},
  {id: 'diesel', label: 'Diesel', desc: 'Синхронный ORM, проверка схемы на этапе компиляции'},
  {id: 'seaorm', label: 'SeaORM', desc: 'Асинхронный Entity-ORM, QueryFilter, ActiveModel'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'config',
    label: 'Строка подключения из env',
    detail: 'DATABASE_URL в .env (только dev) или секрет в Kubernetes/Vault.',
    layers: ['app'],
    code: 'let url = std::env::var("DATABASE_URL")?;\n// никогда не хардкодить пароль в исходниках',
  },
  {
    id: 'pool',
    label: 'Пул выдаёт соединение',
    detail: 'Database::connect() (SeaORM) или Pool::builder() (r2d2 + Diesel).',
    layers: ['pool', 'driver'],
    code: 'let db = Database::connect(&url).await?;\n// внутри — bb8, готовые TCP-сессии',
  },
  {
    id: 'connect',
    label: 'Client / Connection',
    detail: 'tokio-postgres: connect + spawn(connection); Diesel: PgConnection::establish.',
    layers: ['driver', 'orm'],
    code: 'let (client, connection) =\n    tokio_postgres::connect(&url, NoTls).await?;\ntokio::spawn(async move { connection.await });',
  },
  {
    id: 'prepare',
    label: 'Параметризованный запрос',
    detail: 'Плейсхолдеры $1, $2 — значения не попадают в текст SQL.',
    layers: ['orm', 'app'],
    code: 'client.query(\n    "SELECT * FROM books WHERE id = $1",\n    &[&book_id],\n).await?;',
  },
  {
    id: 'execute',
    label: 'query / execute',
    detail: 'SELECT → Vec<Row>; INSERT/UPDATE/DELETE → число строк или RETURNING.',
    layers: ['driver', 'db'],
    code: 'let rows = client.query(sql, &params).await?;\n// Diesel: users.filter(...).load(conn)?',
  },
  {
    id: 'map',
    label: 'Маппинг в struct',
    detail: 'row.get(0) · Queryable · FromQueryResult — явные типы, Result вместо исключений.',
    layers: ['app'],
    code: 'let book = Book {\n    id: row.get("id"),\n    title: row.get("title"),\n    ...\n};',
  },
  {
    id: 'txn',
    label: 'Транзакция и commit',
    detail: 'conn.transaction() (Diesel) или db.begin().await? + commit (SeaORM).',
    layers: ['pool', 'db'],
    code: 'let txn = db.begin().await?;\nUser::insert(am).exec(&txn).await?;\ntxn.commit().await?;',
  },
  {
    id: 'drop',
    label: 'Возврат в пул (Drop)',
    detail: 'При drop Connection клиент возвращается в пул, TCP не рвётся каждый раз.',
    layers: ['pool'],
    code: '} // Drop connection → bb8/r2d2\n// ошибки — Result<_, DbErr>, не panic',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT по ID',
    subtitle: 'Асинхронное чтение через tokio-postgres',
    steps: [
      {
        spotlight: ['app'],
        label: 'Сервис запрашивает книгу',
        detail: 'book_repo.find_by_id(2).await? — Result<Option<Book>, Error>',
        packet: 'down',
        code: 'let book = repo.find_by_id(2).await?;',
      },
      {
        spotlight: ['pool', 'orm'],
        label: 'Соединение из пула',
        detail: 'bb8 выдаёт Client; отдельная задача держит connection alive',
        packet: 'down',
        code: 'let client = pool.get().await?;',
      },
      {
        spotlight: ['driver', 'orm'],
        label: 'Параметризованный SELECT',
        detail: 'Плейсхолдер $1 — защита от SQL-инъекций',
        packet: 'down',
        code: 'client.query(\n    "SELECT id, title, author FROM books WHERE id = $1",\n    &[&2i32],\n).await?;',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'СУБД выполняет SELECT',
        detail: 'Индекс по PK, одна строка в ответе',
        packet: 'request',
        code: '-- PostgreSQL\nSELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = 2;',
      },
      {
        spotlight: ['app', 'orm'],
        label: 'Row → struct Book',
        detail: 'row.get::<_, i32>(0) или десериализация через FromRow',
        packet: 'up',
        code: 'let id: i32 = row.get(0);\nlet title: &str = row.get(1);',
      },
      {
        spotlight: ['pool'],
        label: 'Connection возвращён в пул',
        detail: 'Drop client после await; TCP-сессия переиспользуется',
        packet: 'up',
        code: '} // pool idle connection',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT новой книги',
    subtitle: 'Создание записи и получение id',
    steps: [
      {
        spotlight: ['app'],
        label: 'struct без id в памяти',
        detail: 'NewBook или ActiveModel до сохранения',
        packet: 'down',
        code: 'let new_book = NewBook {\n    title: "Zero To Production".into(),\n    author: "Luca Palmieri".into(),\n    ...\n};',
      },
      {
        spotlight: ['orm', 'driver'],
        label: 'INSERT с $n',
        detail: 'RETURNING id в PostgreSQL',
        packet: 'down',
        code: 'INSERT INTO books (title, author, isbn, published_year, available)\nVALUES ($1, $2, $3, $4, $5) RETURNING id',
      },
      {
        spotlight: ['db'],
        label: 'СУБД вставляет строку',
        detail: 'UNIQUE на isbn; при нарушении — ошибка в Result',
        packet: 'request',
        code: '-- id = 4 (SERIAL); constraint isbn уникален',
      },
      {
        spotlight: ['app', 'orm'],
        label: 'id в модели',
        detail: 'Вставленная строка маппится в Book { id: 4, ... }',
        packet: 'up',
        code: 'Ok(Book { id: row.get("id"), ... })',
      },
    ],
  },
  {
    id: 'diesel',
    title: 'Diesel: проверка на compile-time',
    subtitle: 'DSL users::table.filter — ошибка схемы до запуска',
    steps: [
      {
        spotlight: ['app'],
        label: 'Запрос через Diesel DSL',
        detail: 'schema.rs сгенерирован diesel_cli',
        packet: 'down',
        code: 'users::table\n    .filter(users::email.eq(email))\n    .first::<User>(conn)?',
      },
      {
        spotlight: ['orm'],
        label: 'Компилятор проверяет типы',
        detail: 'Несуществующее поле → ошибка cargo build, не runtime panic',
        packet: 'down',
        code: '// users::wrong_column — E0425 на этапе сборки',
      },
      {
        spotlight: ['driver', 'db'],
        label: 'Статический SQL в рантайме',
        detail: 'Diesel генерирует предсказуемый SQL без динамической конкатенации',
        packet: 'request',
        code: 'SELECT "users"."id", ... FROM "users" WHERE ("users"."email" = $1)',
      },
    ],
  },
  {
    id: 'http',
    title: 'POST /users (Axum → SeaORM)',
    subtitle: 'Полный цикл: HTTP → serde → ORM → JSON-ответ',
    steps: [
      {
        spotlight: ['app'],
        label: 'HTTP POST /users',
        detail: 'Axum извлекает Json<CreateUserRequest> и State<DatabaseConnection>',
        packet: 'down',
        code: 'async fn create_user(\n    State(db): State<DatabaseConnection>,\n    Json(payload): Json<CreateUserRequest>,\n) -> Result<Json<UserResponse>, AppError>',
      },
      {
        spotlight: ['app'],
        label: 'serde + validator',
        detail: 'Неверный JSON → 400; validate() до обращения к БД',
        packet: 'down',
        code: 'payload.validate()?;\nlet am = User::from(payload);',
      },
      {
        spotlight: ['orm', 'pool'],
        label: 'SeaORM INSERT в транзакции',
        detail: 'Entity::insert(am).exec(&db).await? — асинхронный I/O',
        packet: 'down',
        code: 'let model = Entity::insert(am).exec(&db).await?;',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'COMMIT в PostgreSQL',
        detail: 'Нарушение UNIQUE → DbErr → 409 Conflict в API',
        packet: 'request',
        code: 'INSERT INTO users (...) VALUES (...);',
      },
      {
        spotlight: ['app'],
        label: 'DTO → JSON 201',
        detail: 'UserResponse: Serialize, без password_hash',
        packet: 'up',
        code: 'Ok(Json(UserResponse::from(model)))',
      },
    ],
  },
];

export function rustCodeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    tokio_postgres: {
      read: params.id
        ? `let rows = client\n    .query(\n        "SELECT * FROM books WHERE id = $1",\n        &[&${id}i32],\n    )\n    .await?;\nlet row = rows.first();\n// row.get::<_, i32>(0)`
        : `let rows = client\n    .query(\n        "SELECT * FROM books WHERE available = true",\n        &[],\n    )\n    .await?;`,
      create: `client\n    .execute(\n        "INSERT INTO books (title, author, isbn, published_year, available)\n         VALUES ($1, $2, $3, $4, $5)",\n        &[\n            &"${params.title}",\n            &"${params.author}",\n            &"${params.isbn}",\n            &${params.published_year ?? 2024}i32,\n            &true,\n        ],\n    )\n    .await?;`,
      update: `client\n    .execute(\n        "UPDATE books SET title = $1, available = $2 WHERE id = $3",\n        &[&"${params.title}", &${params.available}, &${id}i32],\n    )\n    .await?;`,
      delete: `client\n    .execute(\n        "DELETE FROM books WHERE id = $1",\n        &[&${id}i32],\n    )\n    .await?;`,
    },
    diesel: {
      read: params.id
        ? `use diesel::prelude::*;\n\nusers::table\n    .filter(users::id.eq(${id}))\n    .first::<Book>(conn)?`
        : `books::table\n    .filter(books::available.eq(true))\n    .load::<Book>(conn)?`,
      create: `diesel::insert_into(books::table)\n    .values((\n        books::title.eq("${params.title}"),\n        books::author.eq("${params.author}"),\n        books::isbn.eq("${params.isbn}"),\n    ))\n    .get_result(conn)?`,
      update: `diesel::update(books::table.find(${id}))\n    .set((\n        books::title.eq("${params.title}"),\n        books::available.eq(${params.available}),\n    ))\n    .execute(conn)?`,
      delete: `diesel::delete(books::table.find(${id})).execute(conn)?`,
    },
    seaorm: {
      read: params.id
        ? `Entity::find_by_id(${id})\n    .one(&db)\n    .await?`
        : `Entity::find()\n    .filter(Column::Available.eq(true))\n    .all(&db)\n    .await?`,
      create: `let am = ActiveModel {\n    title: Set("${params.title}".into()),\n    author: Set("${params.author}".into()),\n    ..Default::default()\n};\nEntity::insert(am).exec(&db).await?;`,
      update: `Entity::update_many()\n    .col_expr(Column::Available, Expr::value(${params.available}))\n    .filter(Column::Id.eq(${id}))\n    .exec(&db)\n    .await?;`,
      delete: `Entity::delete_by_id(${id}).exec(&db).await?;`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
