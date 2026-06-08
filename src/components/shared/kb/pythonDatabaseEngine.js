/** In-memory модель и сценарии для PythonDatabasePlay */

export const BOOK_COLUMNS = ['id', 'title', 'author', 'isbn', 'published_year', 'available'];

export const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Fluent Python',
    author: 'Luciano Ramalho',
    isbn: '978-1492056358',
    published_year: 2022,
    available: true,
  },
  {
    id: 2,
    title: 'Effective Python',
    author: 'Brett Slatkin',
    isbn: '978-0134853989',
    published_year: 2019,
    available: true,
  },
  {
    id: 3,
    title: 'Django for Professionals',
    author: 'William Vincent',
    isbn: '978-1950148088',
    published_year: 2022,
    available: false,
  },
];

export const STACK_LAYERS = [
  {id: 'app', label: 'Python-приложение', short: 'Код', role: 'Сервис, dict, dataclass, модель'},
  {id: 'api', label: 'DB-API 2.0', short: 'PEP 249', role: 'connect · cursor · execute · fetch'},
  {id: 'driver', label: 'Драйвер / модуль', short: 'sqlite3', role: 'stdlib или psycopg2-binary'},
  {id: 'db', label: 'СУБД', short: 'SQLite', role: 'Файл example.db · таблица books'},
];

export const ACCESS_LAYERS = [
  {id: 'sqlite3', label: 'sqlite3', desc: 'Прямой SQL, параметры ?'},
  {id: 'sqlalchemy', label: 'SQLAlchemy', desc: 'Session, ORM-модели, Core'},
  {id: 'django', label: 'Django ORM', desc: 'Model.objects, QuerySet, миграции'},
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
    label: 'connect()',
    detail: 'sqlite3.connect("example.db") или psycopg2.connect(...). Файл SQLite создаётся автоматически.',
    layers: ['api', 'driver'],
    code: 'import sqlite3\n\nconn = sqlite3.connect("example.db")\n# conn.row_factory = sqlite3.Row  # опционально',
  },
  {
    id: 'cursor',
    label: 'cursor()',
    detail: 'Курсор — посредник для выполнения SQL и чтения строк.',
    layers: ['api', 'app'],
    code: 'cursor = conn.cursor()',
  },
  {
    id: 'execute',
    label: 'execute(sql, params)',
    detail: 'Плейсхолдеры ? — защита от SQL-инъекций; не подставляйте строки через f-string.',
    layers: ['api', 'db'],
    code: 'cursor.execute(\n    "SELECT * FROM books WHERE id = ?",\n    (book_id,),\n)',
  },
  {
    id: 'fetch',
    label: 'fetchone / fetchall',
    detail: 'SELECT возвращает кортежи; INSERT/UPDATE/DELETE — rowcount.',
    layers: ['api', 'app'],
    code: 'row = cursor.fetchone()\nrows = cursor.fetchall()',
  },
  {
    id: 'commit',
    label: 'commit() / rollback()',
    detail: 'Изменения фиксируются явно; при ошибке — rollback().',
    layers: ['api', 'db'],
    code: 'try:\n    cursor.execute("INSERT ...", values)\n    conn.commit()\nexcept Exception:\n    conn.rollback()\n    raise',
  },
  {
    id: 'context',
    label: 'with и закрытие',
    detail: 'Контекстный менеджер гарантирует close() даже при исключении.',
    layers: ['app', 'api'],
    code: 'with sqlite3.connect("example.db") as conn:\n    with conn.cursor() as cur:\n        cur.execute(...)\n    conn.commit()',
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'SELECT по id',
    subtitle: 'Чтение книги через sqlite3 и параметры ?',
    steps: [
      {
        spotlight: ['app'],
        label: 'Функция запрашивает книгу',
        detail: 'get_book(conn, book_id=2)',
        packet: 'down',
        code: 'def get_book(conn, book_id: int):\n    ...',
      },
      {
        spotlight: ['api', 'driver'],
        label: 'connect() и cursor()',
        detail: 'Соединение с файлом example.db',
        packet: 'down',
        code: 'conn = sqlite3.connect("example.db")\ncursor = conn.cursor()',
      },
      {
        spotlight: ['api'],
        label: 'execute с кортежем параметров',
        detail: 'Второй аргумент — tuple, не строка',
        packet: 'down',
        code: 'cursor.execute(\n    "SELECT id, title, author FROM books WHERE id = ?",\n    (2,),\n)',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'SQLite выполняет запрос',
        detail: 'Поиск по PRIMARY KEY',
        packet: 'request',
        code: 'SELECT id, title, author, isbn, published_year, available\nFROM books WHERE id = 2;',
      },
      {
        spotlight: ['api', 'app'],
        label: 'fetchone() → dict',
        detail: 'Кортеж можно преобразовать в словарь для приложения',
        packet: 'up',
        code: 'row = cursor.fetchone()\nif row:\n    return dict(zip(columns, row))',
      },
      {
        spotlight: ['app'],
        label: 'conn.close() или with',
        detail: 'Ресурс освобождён',
        packet: 'up',
        code: 'conn.close()  # или выход из with',
      },
    ],
  },
  {
    id: 'insert',
    title: 'INSERT и commit',
    subtitle: 'Создание строки и фиксация транзакции',
    steps: [
      {
        spotlight: ['app'],
        label: 'Данные в памяти',
        detail: 'Словарь или dataclass без id',
        packet: 'down',
        code: 'book = {"title": "Clean Code", "author": "Robert Martin", ...}',
      },
      {
        spotlight: ['api'],
        label: 'INSERT с ?',
        detail: 'lastrowid вернёт сгенерированный id',
        packet: 'down',
        code: 'cursor.execute(\n    """INSERT INTO books (title, author, isbn, published_year, available)\n       VALUES (?, ?, ?, ?, ?)""",\n    (title, author, isbn, year, True),\n)\nnew_id = cursor.lastrowid',
      },
      {
        spotlight: ['db'],
        label: 'SQLite записывает строку',
        detail: 'Проверка UNIQUE на isbn',
        packet: 'request',
        code: '-- id = 4 (AUTOINCREMENT)',
      },
      {
        spotlight: ['api', 'app'],
        label: 'conn.commit()',
        detail: 'Без commit изменения потеряются при close',
        packet: 'up',
        code: 'conn.commit()\nbook["id"] = new_id',
      },
    ],
  },
  {
    id: 'orm',
    title: 'SQLAlchemy Session',
    subtitle: 'ORM генерирует SQL при flush/commit',
    steps: [
      {
        spotlight: ['app'],
        label: 'session.query / session.get',
        detail: 'Работа с классом Book, не с сырым SQL',
        packet: 'down',
        code: 'book = session.get(Book, 2)',
      },
      {
        spotlight: ['api'],
        label: 'SQLAlchemy Core → драйвер',
        detail: 'Движок использует DB-API под капотом',
        packet: 'down',
        code: '# SELECT books.id, books.title ... WHERE books.id = ?',
      },
      {
        spotlight: ['db'],
        label: 'СУБД возвращает строку',
        detail: 'ORM маппит в объект Book',
        packet: 'up',
        code: 'return book  # managed instance',
      },
    ],
  },
];

export const DJANGO_FLOW_SCENARIOS = [
  {
    id: 'list',
    title: 'GET /blog/ → HTML',
    subtitle: 'URL → view → ORM → шаблон',
    steps: [
      {
        spotlight: ['app'],
        label: 'HTTP GET /blog/',
        detail: 'Браузер запрашивает список постов',
        packet: 'down',
        code: '# Запрос попадает в Django',
      },
      {
        spotlight: ['app'],
        label: 'ROOT_URLCONF → blog.urls',
        detail: "path('blog/', include('blog.urls'))",
        packet: 'down',
        code: "urlpatterns = [\n    path('blog/', include('blog.urls')),\n]",
      },
      {
        spotlight: ['app'],
        label: 'views.post_list(request)',
        detail: 'View вызывает ORM, не пишет SQL вручную',
        packet: 'down',
        code: 'def post_list(request):\n    posts = Post.objects.filter(published=True)',
      },
      {
        spotlight: ['api'],
        label: 'QuerySet → SQL',
        detail: 'Ленивая оценка: SQL при итерации или list()',
        packet: 'down',
        code: '# SELECT ... FROM blog_post WHERE published = 1',
      },
      {
        spotlight: ['db', 'driver'],
        label: 'СУБД выполняет SELECT',
        detail: 'SQLite (dev) или PostgreSQL (prod)',
        packet: 'request',
        code: 'SELECT "blog_post"."id", "blog_post"."title" ...',
      },
      {
        spotlight: ['app'],
        label: 'render() → HttpResponse',
        detail: 'Контекст {posts} передаётся в шаблон',
        packet: 'up',
        code: "return render(request, 'blog/post_list.html', {'posts': posts})",
      },
    ],
  },
  {
    id: 'admin',
    title: 'Админка: CRUD',
    subtitle: 'ModelAdmin без ручного SQL',
    steps: [
      {
        spotlight: ['app'],
        label: 'POST /admin/blog/post/4/change/',
        detail: 'Форма админки отправляет данные',
        packet: 'down',
        code: '# CsrfViewMiddleware проверяет токен',
      },
      {
        spotlight: ['app'],
        label: 'ModelForm.save()',
        detail: 'Валидация полей модели Post',
        packet: 'down',
        code: 'post = form.save(commit=False)\npost.published = True\npost.save()',
      },
      {
        spotlight: ['api'],
        label: 'UPDATE через ORM',
        detail: 'Сигналы pre_save / post_save (опционально)',
        packet: 'down',
        code: 'UPDATE blog_post SET published=1, title=? WHERE id=4',
      },
      {
        spotlight: ['db'],
        label: 'commit в транзакции',
        detail: 'Django оборачивает запрос в atomic() по умолчанию',
        packet: 'up',
        code: '# redirect с сообщением "Сохранено"',
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
      return 'SELECT id, title, author, isbn, published_year, available\nFROM books WHERE available = 1;';
    case 'create':
      return `INSERT INTO books (title, author, isbn, published_year, available)\nVALUES ('${params.title}', '${params.author}', '${params.isbn}', ${params.published_year}, ${params.available ? 1 : 0});`;
    case 'update':
      return `UPDATE books\nSET title = '${params.title}', available = ${params.available ? 1 : 0}\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM books WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function pythonCodeForLayer(layer, op, params) {
  const id = params.id ?? 2;
  const snippets = {
    sqlite3: {
      read: params.id
        ? `import sqlite3\n\nwith sqlite3.connect("example.db") as conn:\n    cur = conn.cursor()\n    cur.execute(\n        "SELECT * FROM books WHERE id = ?",\n        (${id},),\n    )\n    row = cur.fetchone()`
        : `with sqlite3.connect("example.db") as conn:\n    cur = conn.cursor()\n    cur.execute(\n        "SELECT * FROM books WHERE available = 1"\n    )\n    rows = cur.fetchall()`,
      create: `with sqlite3.connect("example.db") as conn:\n    cur = conn.cursor()\n    cur.execute(\n        """INSERT INTO books (title, author, isbn, published_year, available)\n           VALUES (?, ?, ?, ?, ?)""",\n        ("${params.title}", "${params.author}", "${params.isbn}", ${params.published_year}, 1),\n    )\n    conn.commit()\n    new_id = cur.lastrowid`,
      update: `with sqlite3.connect("example.db") as conn:\n    cur = conn.cursor()\n    cur.execute(\n        "UPDATE books SET title = ?, available = ? WHERE id = ?",\n        ("${params.title}", ${params.available ? 1 : 0}, ${id}),\n    )\n    conn.commit()`,
      delete: `with sqlite3.connect("example.db") as conn:\n    cur = conn.cursor()\n    cur.execute("DELETE FROM books WHERE id = ?", (${id},))\n    conn.commit()`,
    },
    sqlalchemy: {
      read: params.id
        ? `from sqlalchemy.orm import Session\n\nbook = session.get(Book, ${id})`
        : `books = session.query(Book).filter(Book.available.is_(True)).all()`,
      create: `new_book = Book(title="${params.title}", author="${params.author}", ...)\nsession.add(new_book)\nsession.commit()`,
      update: `book = session.get(Book, ${id})\nbook.available = False\nsession.commit()  # UPDATE при commit`,
      delete: `book = session.get(Book, ${id})\nsession.delete(book)\nsession.commit()`,
    },
    django: {
      read: params.id
        ? `book = Book.objects.get(pk=${id})`
        : `books = Book.objects.filter(available=True)`,
      create: `Book.objects.create(\n    title="${params.title}",\n    author="${params.author}",\n    isbn="${params.isbn}",\n)`,
      update: `Book.objects.filter(pk=${id}).update(available=False)`,
      delete: `Book.objects.filter(pk=${id}).delete()`,
    },
  };
  return snippets[layer]?.[op] ?? '# выберите операцию';
}
