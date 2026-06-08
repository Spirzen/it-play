/** In-memory модель и сценарии для NodeDatabasePlay */

export const TASK_COLUMNS = ['id', 'title', 'status', 'created_at'];

export const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Научиться Node.js',
    status: 'todo',
    created_at: '2025-01-15',
  },
  {
    id: 2,
    title: 'Поднять PostgreSQL в Docker',
    status: 'in_progress',
    created_at: '2025-01-16',
  },
  {
    id: 3,
    title: 'Написать REST API на Express',
    status: 'done',
    created_at: '2025-01-17',
  },
];

export const STACK_LAYERS = [
  {id: 'client', label: 'Клиент', short: 'HTTP', role: 'curl · fetch · Postman · браузер'},
  {id: 'express', label: 'Express.js', short: 'HTTP', role: 'app.get/post · middleware · res.json()'},
  {id: 'app', label: 'Контроллер / модель', short: 'Код', role: 'TaskController · TaskModel · async/await'},
  {id: 'pg', label: 'pg (node-postgres)', short: 'Pool', role: 'pool.query(sql, params) · $1, $2'},
  {id: 'db', label: 'PostgreSQL', short: 'СУБД', role: 'Таблица tasks · ACID · индексы'},
];

export const ACCESS_LAYERS = [
  {id: 'pg', label: 'pg (raw SQL)', desc: 'Pool, параметры $1 — полный контроль'},
  {id: 'prisma', label: 'Prisma', desc: 'prisma.task.findMany(), схема, миграции'},
  {id: 'sequelize', label: 'Sequelize', desc: 'Task.findAll(), модели, hooks'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'env',
    label: 'Переменные окружения',
    detail: 'DATABASE_URL или DB_HOST/DB_USER/DB_PASSWORD — секреты не в коде.',
    layers: ['app'],
    code: '// .env (только dev)\nDB_HOST=localhost\nDB_USER=app\nDB_PASSWORD=secret\nDB_NAME=tasks',
  },
  {
    id: 'pool',
    label: 'new Pool({ ... })',
    detail: 'Один Pool на процесс; переиспользует TCP-соединения к PostgreSQL.',
    layers: ['pg'],
    code: "import { Pool } from 'pg';\n\nconst pool = new Pool({\n  host: process.env.DB_HOST,\n  user: process.env.DB_USER,\n  password: process.env.DB_PASSWORD,\n  database: process.env.DB_NAME,\n  port: 5432,\n  max: 20,\n});",
  },
  {
    id: 'query',
    label: 'pool.query(sql, params)',
    detail: 'Асинхронный вызов: event loop не блокируется, колбэк/Promise в libuv.',
    layers: ['pg', 'app'],
    code: "const result = await pool.query(\n  'SELECT * FROM tasks WHERE id = $1',\n  [taskId],\n);\nreturn result.rows[0];",
  },
  {
    id: 'rows',
    label: 'result.rows',
    detail: 'Массив объектов; rowCount — число затронутых строк для INSERT/UPDATE/DELETE.',
    layers: ['app'],
    code: 'const tasks = result.rows;\n// [{ id: 1, title: "...", status: "todo", ... }]',
  },
  {
    id: 'error',
    label: 'try/catch и pool.on("error")',
    detail: 'Ошибки соединения ловятся в async-функции; idle-клиент — глобальный обработчик.',
    layers: ['pg', 'express'],
    code: "pool.on('error', (err) => {\n  console.error('Unexpected pool error', err);\n});\n\ntry {\n  await pool.query(...);\n} catch (err) {\n  res.status(500).json({ error: 'DB error' });\n}",
  },
  {
    id: 'shutdown',
    label: 'pool.end() при shutdown',
    detail: 'Graceful shutdown: server.close() → pool.end() → process.exit().',
    layers: ['pg', 'express'],
    code: "process.on('SIGTERM', async () => {\n  server.close();\n  await pool.end();\n  process.exit(0);\n});",
  },
];

export const FLOW_SCENARIOS = [
  {
    id: 'get-list',
    title: 'GET /api/tasks',
    subtitle: 'Список задач: HTTP → Express → pool.query → JSON',
    steps: [
      {
        spotlight: ['client'],
        label: 'Клиент отправляет GET',
        detail: 'curl http://localhost:3000/api/tasks',
        packet: 'down',
        code: 'GET /api/tasks HTTP/1.1\nHost: localhost:3000',
      },
      {
        spotlight: ['express'],
        label: 'Express маршрутизирует запрос',
        detail: "app.use('/api/tasks', taskRoutes)",
        packet: 'down',
        code: "router.get('/', TaskController.list);",
      },
      {
        spotlight: ['app'],
        label: 'Контроллер вызывает модель',
        detail: 'async list(req, res) { const tasks = await TaskModel.findAll(); }',
        packet: 'down',
        code: 'static async findAll() {\n  const result = await pool.query(\n    "SELECT * FROM tasks ORDER BY created_at DESC"\n  );\n  return result.rows;\n}',
      },
      {
        spotlight: ['pg'],
        label: 'Pool берёт соединение из пула',
        detail: 'libuv отправляет запрос в фоновый поток; JS-поток свободен',
        packet: 'down',
        code: '// pool.query → client из пула → query(text, values)',
      },
      {
        spotlight: ['db', 'pg'],
        label: 'PostgreSQL выполняет SELECT',
        detail: 'Seq Scan или Index Scan по created_at',
        packet: 'request',
        code: 'SELECT id, title, status, created_at\nFROM tasks\nORDER BY created_at DESC;',
      },
      {
        spotlight: ['pg', 'app'],
        label: 'rows возвращаются в Promise',
        detail: 'await разрешается; event loop продолжает обработку',
        packet: 'up',
        code: 'return result.rows; // массив Task',
      },
      {
        spotlight: ['express', 'client'],
        label: 'res.json(tasks) → HTTP 200',
        detail: 'Content-Type: application/json',
        packet: 'up',
        code: 'res.json(tasks);\n// [{ "id": 1, "title": "...", ... }]',
      },
    ],
  },
  {
    id: 'post-create',
    title: 'POST /api/tasks',
    subtitle: 'Создание задачи с параметризованным INSERT',
    steps: [
      {
        spotlight: ['client'],
        label: 'POST с JSON-телом',
        detail: '{"title":"Новая задача","status":"todo"}',
        packet: 'down',
        code: 'curl -X POST .../api/tasks \\\n  -H "Content-Type: application/json" \\\n  -d \'{"title":"Новая задача"}\'',
      },
      {
        spotlight: ['express'],
        label: 'express.json() парсит body',
        detail: 'Middleware до маршрута; req.body доступен',
        packet: 'down',
        code: "app.use(express.json({ limit: '10mb' }));",
      },
      {
        spotlight: ['app'],
        label: 'Валидация и TaskModel.create',
        detail: 'Проверка title; status по умолчанию todo',
        packet: 'down',
        code: "const result = await pool.query(\n  'INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *',\n  [title, status ?? 'todo'],\n);",
      },
      {
        spotlight: ['db'],
        label: 'INSERT + RETURNING *',
        detail: 'SERIAL id; CHECK на status; created_at = NOW()',
        packet: 'request',
        code: "INSERT INTO tasks (title, status)\nVALUES ('Новая задача', 'todo')\nRETURNING *;",
      },
      {
        spotlight: ['express', 'client'],
        label: '201 Created + новая задача',
        detail: 'Клиент получает полный объект с id',
        packet: 'up',
        code: 'res.status(201).json(result.rows[0]);',
      },
    ],
  },
  {
    id: 'get-one',
    title: 'GET /api/tasks/:id',
    subtitle: 'Одна задача; защита от SQL-инъекций через $1',
    steps: [
      {
        spotlight: ['client'],
        label: 'GET /api/tasks/2',
        detail: 'req.params.id = "2"',
        packet: 'down',
        code: 'GET /api/tasks/2 HTTP/1.1',
      },
      {
        spotlight: ['express', 'app'],
        label: 'findById с параметром',
        detail: 'Никогда не конкатенируйте id в SQL-строку',
        packet: 'down',
        code: "const result = await pool.query(\n  'SELECT * FROM tasks WHERE id = $1',\n  [Number(req.params.id)],\n);",
      },
      {
        spotlight: ['db'],
        label: 'Index Scan по PRIMARY KEY',
        detail: 'Одна строка или пустой rows',
        packet: 'request',
        code: 'SELECT * FROM tasks WHERE id = 2;',
      },
      {
        spotlight: ['app', 'express'],
        label: '404 или 200',
        detail: 'if (!row) return res.status(404).json({ error: "Not found" })',
        packet: 'up',
        code: 'const task = result.rows[0];\nif (!task) return res.status(404).json({ error: "Not found" });\nres.json(task);',
      },
    ],
  },
];

export const ASYNC_SCENARIOS = [
  {
    id: 'nonblock',
    title: 'Неблокирующий I/O',
    subtitle: 'Пока pg ждёт ответа СУБД, Node принимает другие запросы',
    steps: [
      {
        spotlight: ['client'],
        label: '10 одновременных GET /api/tasks',
        detail: 'Один поток JS, много открытых соединений',
        packet: 'down',
        code: '// 10 клиентов → 10 req в event loop',
      },
      {
        spotlight: ['express', 'pg'],
        label: '10 pool.query() без await-блокировки',
        detail: 'Каждый await отдаёт управление event loop',
        packet: 'down',
        code: 'await pool.query(...); // приостановка только этой async-функции',
      },
      {
        spotlight: ['db'],
        label: 'PostgreSQL обрабатывает параллельно',
        detail: 'Пул ограничивает max соединений (например 20)',
        packet: 'request',
        code: '-- до max активных backend-процессов PG',
      },
      {
        spotlight: ['express', 'client'],
        label: 'Ответы приходят по мере готовности',
        detail: 'Throughput выше, чем у потока на запрос',
        packet: 'up',
        code: 'res.json(rows); // каждый клиент получает свой ответ',
      },
    ],
  },
];

export function cloneTasks(tasks) {
  return tasks.map((t) => ({...t}));
}

export function nextTaskId(tasks) {
  return tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

export function runCrud(tasks, op, {id, title, status}) {
  const next = cloneTasks(tasks);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((t) => t.id === numId);
      return {tasks: next, rows: row ? [row] : [], message: row ? null : 'Задача не найдена'};
    }
    return {tasks: next, rows: next.filter((t) => t.status !== 'done'), message: null};
  }

  if (op === 'create') {
    if (!title?.trim()) {
      return {tasks: next, rows: [], message: 'Поле title обязательно'};
    }
    const row = {
      id: nextTaskId(next),
      title: title.trim(),
      status: status || 'todo',
      created_at: new Date().toISOString().slice(0, 10),
    };
    next.push(row);
    return {tasks: next, rows: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((t) => t.id === numId);
    if (idx < 0) {
      return {tasks: next, rows: [], message: 'Задача не найдена'};
    }
    next[idx] = {
      ...next[idx],
      title: title?.trim() || next[idx].title,
      status: status || next[idx].status,
    };
    return {tasks: next, rows: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((t) => t.id === numId);
    if (idx < 0) {
      return {tasks: next, rows: [], message: 'Задача не найдена'};
    }
    const removed = next.splice(idx, 1);
    return {tasks: next, rows: removed, message: null};
  }

  return {tasks: next, rows: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, title, status, created_at\nFROM tasks WHERE id = ${id};`;
      }
      return "SELECT id, title, status, created_at\nFROM tasks WHERE status != 'done';";
    case 'create':
      return `INSERT INTO tasks (title, status)\nVALUES ('${params.title}', '${params.status || 'todo'}')\nRETURNING *;`;
    case 'update':
      return `UPDATE tasks\nSET title = '${params.title}', status = '${params.status}'\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM tasks WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function jsCodeForLayer(layer, op, params) {
  const id = params.id ?? '2';
  const snippets = {
    pg: {
      read: params.id
        ? `const result = await pool.query(\n  'SELECT * FROM tasks WHERE id = $1',\n  [${id}],\n);\nreturn result.rows[0] ?? null;`
        : `const result = await pool.query(\n  "SELECT * FROM tasks WHERE status != 'done'"\n);\nreturn result.rows;`,
      create: `const result = await pool.query(\n  'INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *',\n  ['${params.title}', '${params.status || 'todo'}'],\n);\nreturn result.rows[0];`,
      update: `await pool.query(\n  'UPDATE tasks SET title = $1, status = $2 WHERE id = $3',\n  ['${params.title}', '${params.status}', ${id}],\n);`,
      delete: `await pool.query('DELETE FROM tasks WHERE id = $1', [${id}]);`,
    },
    prisma: {
      read: params.id
        ? `const task = await prisma.task.findUnique({\n  where: { id: ${id} },\n});\nreturn task;`
        : `return prisma.task.findMany({\n  where: { status: { not: 'done' } },\n  orderBy: { createdAt: 'desc' },\n});`,
      create: `return prisma.task.create({\n  data: {\n    title: '${params.title}',\n    status: '${params.status || 'todo'}',\n  },\n});`,
      update: `return prisma.task.update({\n  where: { id: ${id} },\n  data: { title: '${params.title}', status: '${params.status}' },\n});`,
      delete: `await prisma.task.delete({ where: { id: ${id} } });`,
    },
    sequelize: {
      read: params.id
        ? `const task = await Task.findByPk(${id});\nreturn task?.toJSON();`
        : `const tasks = await Task.findAll({\n  where: { status: { [Op.ne]: 'done' } },\n});\nreturn tasks.map(t => t.toJSON());`,
      create: `const task = await Task.create({\n  title: '${params.title}',\n  status: '${params.status || 'todo'}',\n});\nreturn task.toJSON();`,
      update: `await Task.update(\n  { title: '${params.title}', status: '${params.status}' },\n  { where: { id: ${id} } },\n);`,
      delete: `await Task.destroy({ where: { id: ${id} } });`,
    },
  };
  return snippets[layer]?.[op] ?? '// выберите операцию';
}
