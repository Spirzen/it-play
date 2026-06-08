/** In-memory модель и сценарии для PhpDatabasePlay */

export const SUBSCRIBER_COLUMNS = ['id', 'name', 'email', 'created_at'];

export const INITIAL_SUBSCRIBERS = [
  {
    id: 1,
    name: 'Анна',
    email: 'anna@example.com',
    created_at: '2025-05-20 10:00:00',
  },
  {
    id: 2,
    name: 'Борис',
    email: 'boris@example.com',
    created_at: '2025-05-21 14:30:00',
  },
];

export const STACK_LAYERS = [
  {id: 'browser', label: 'Браузер', short: 'HTML', role: 'Форма, POST, cookie сессии'},
  {id: 'php', label: 'PHP-скрипт', short: '$_POST', role: 'Валидация, CSRF, password_hash'},
  {id: 'pdo', label: 'PDO', short: 'prepare', role: 'Подготовленные запросы, bind, fetch'},
  {id: 'driver', label: 'pdo_mysql', short: 'драйвер', role: 'Протокол MySQL over TCP'},
  {id: 'db', label: 'MySQL', short: 'InnoDB', role: 'Таблица subscribers, UNIQUE email'},
];

export const ACCESS_LAYERS = [
  {id: 'pdo', label: 'PDO', desc: 'prepare() + execute() — рекомендуемый способ'},
  {id: 'mysqli', label: 'mysqli', desc: 'bind_param, объектно-ориентированный API'},
  {id: 'unsafe', label: 'Конкатенация', desc: 'Уязвимо к SQL-инъекции — только для сравнения'},
];

export const CRUD_OPS = [
  {id: 'read', label: 'Read (SELECT)', verb: 'Чтение'},
  {id: 'create', label: 'Create (INSERT)', verb: 'Создание'},
  {id: 'update', label: 'Update (UPDATE)', verb: 'Обновление'},
  {id: 'delete', label: 'Delete (DELETE)', verb: 'Удаление'},
];

export const LIFECYCLE_STEPS = [
  {
    id: 'dsn',
    label: 'new PDO($dsn, $user, $pass, $options)',
    detail: 'DSN задаёт хост, базу и charset=utf8mb4. ERRMODE_EXCEPTION — ошибки как исключения.',
    layers: ['pdo', 'driver'],
    code: `$pdo = new PDO(
    'mysql:host=127.0.0.1;dbname=app;charset=utf8mb4',
    getenv('DB_USER') ?: 'app_user',
    getenv('DB_PASS') ?: '',
    [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ],
);`,
  },
  {
    id: 'prepare',
    label: '$pdo->prepare($sql)',
    detail: 'Шаблон SQL с плейсхолдерами ? или :name отправляется на сервер один раз.',
    layers: ['pdo', 'php'],
    code: `$stmt = $pdo->prepare(
    'INSERT INTO subscribers (name, email, created_at) VALUES (?, ?, ?)'
);`,
  },
  {
    id: 'execute',
    label: '$stmt->execute($params)',
    detail: 'Параметры передаются отдельно — строка из $_POST не попадает в SQL как код.',
    layers: ['pdo', 'db'],
    code: `$stmt->execute([
    $name,
    $email,
    date('Y-m-d H:i:s'),
]);`,
  },
  {
    id: 'fetch',
    label: 'fetch / fetchAll / rowCount',
    detail: 'SELECT — fetch(); INSERT — lastInsertId(); UPDATE/DELETE — rowCount().',
    layers: ['pdo', 'php'],
    code: `$row = $stmt->fetch(PDO::FETCH_ASSOC);
$rows = $stmt->fetchAll();
$newId = (int) $pdo->lastInsertId();`,
  },
  {
    id: 'transaction',
    label: 'beginTransaction · commit · rollBack',
    detail: 'Несколько запросов в одной транзакции — либо все, либо ни одного.',
    layers: ['pdo', 'db'],
    code: `try {
    $pdo->beginTransaction();
    // ... несколько execute()
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}`,
  },
  {
    id: 'close',
    label: 'unset($pdo) / конец запроса',
    detail: 'Соединение закрывается при уничтожении объекта; в FPM — пул переиспользует сокеты.',
    layers: ['php', 'driver'],
    code: `unset($stmt, $pdo);
// В долгоживущих CLI-скриптах явно null — хорошая привычка`,
  },
];

export const FORM_FLOW_SCENARIOS = [
  {
    id: 'register',
    title: 'POST: регистрация подписчика',
    subtitle: 'Форма → $_POST → валидация → PDO INSERT → PRG',
    steps: [
      {
        spotlight: ['browser'],
        label: 'Пользователь отправляет форму',
        detail: 'method="POST", поля name и email, скрытый csrf_token',
        packet: 'down',
        code: '<form method="POST" action="/register.php">\n  <input name="name" required />\n  <input type="email" name="email" required />\n  <input type="hidden" name="csrf_token" value="..." />\n</form>',
      },
      {
        spotlight: ['browser', 'php'],
        label: 'HTTP POST в теле запроса',
        detail: 'Данные не в URL; браузер может предупредить о повторной отправке',
        packet: 'down',
        code: 'POST /register.php HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nname=Иван&email=ivan%40mail.ru&csrf_token=abc...',
      },
      {
        spotlight: ['php'],
        label: 'PHP: $_POST и валидация',
        detail: 'filter_var(FILTER_VALIDATE_EMAIL), trim, проверка CSRF через hash_equals',
        packet: 'down',
        code: `if ($_SERVER['REQUEST_METHOD'] !== 'POST') { /* показать форму */ }

$email = trim($_POST['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный email';
}`,
      },
      {
        spotlight: ['php', 'pdo'],
        label: 'prepare + execute с ?',
        detail: 'Пароль (если есть) — password_hash; email в запрос только как параметр',
        packet: 'down',
        code: `$stmt = $pdo->prepare(
    'INSERT INTO subscribers (name, email, created_at) VALUES (?, ?, ?)'
);
$stmt->execute([$name, $email, date('Y-m-d H:i:s')]);`,
      },
      {
        spotlight: ['db', 'driver'],
        label: 'MySQL: INSERT и UNIQUE',
        detail: 'Индекс uq_email отклонит дубликат — ловим PDOException',
        packet: 'request',
        code: 'INSERT INTO subscribers (name, email, created_at)\nVALUES (\'Иван\', \'ivan@mail.ru\', \'2025-05-26 12:00:00\');',
      },
      {
        spotlight: ['php', 'browser'],
        label: 'PRG: redirect 302',
        detail: 'header(\'Location: /thanks\'); exit; — безопасное обновление страницы',
        packet: 'up',
        code: `header('Location: /thanks.php');
exit;`,
      },
    ],
  },
  {
    id: 'select',
    title: 'SELECT по email',
    subtitle: 'Чтение одной строки через PDO',
    steps: [
      {
        spotlight: ['php'],
        label: 'Параметр из запроса или сессии',
        detail: 'Никогда не вставляйте $_GET напрямую в SQL',
        packet: 'down',
        code: '$email = $_GET[\'email\'] ?? \'\';',
      },
      {
        spotlight: ['pdo'],
        label: 'prepare + execute',
        detail: 'Один плейсхолдер для email',
        packet: 'down',
        code: `$stmt = $pdo->prepare('SELECT id, name, email FROM subscribers WHERE email = ?');
$stmt->execute([$email]);`,
      },
      {
        spotlight: ['db'],
        label: 'MySQL ищет по индексу',
        detail: 'UNIQUE KEY uq_email ускоряет поиск',
        packet: 'request',
        code: "SELECT id, name, email, created_at FROM subscribers WHERE email = 'boris@example.com';",
      },
      {
        spotlight: ['php'],
        label: 'fetch(PDO::FETCH_ASSOC)',
        detail: 'Ассоциативный массив для шаблона или JSON-ответа',
        packet: 'up',
        code: `$subscriber = $stmt->fetch();
if (!$subscriber) {
    http_response_code(404);
}`,
      },
    ],
  },
];

export const PDO_FLOW_SCENARIOS = [
  {
    id: 'insert',
    title: 'INSERT и lastInsertId',
    subtitle: 'Создание строки без конкатенации SQL',
    steps: [
      {
        spotlight: ['php'],
        label: 'Данные после валидации',
        detail: 'Массив из $_POST уже очищен',
        packet: 'down',
        code: '$name = trim($_POST[\'name\'] ?? \'\');',
      },
      {
        spotlight: ['pdo'],
        label: 'prepare + execute',
        detail: 'Три плейсхолдера ?',
        packet: 'down',
        code: `$stmt = $pdo->prepare(
    'INSERT INTO subscribers (name, email, created_at) VALUES (?, ?, ?)'
);
$stmt->execute([$name, $email, $created]);`,
      },
      {
        spotlight: ['db'],
        label: 'AUTO_INCREMENT id',
        detail: 'InnoDB фиксирует строку',
        packet: 'request',
        code: '-- id = 3',
      },
      {
        spotlight: ['php'],
        label: 'lastInsertId()',
        detail: 'Возвращает id вставленной строки в этом соединении',
        packet: 'up',
        code: '$newId = (int) $pdo->lastInsertId();',
      },
    ],
  },
  {
    id: 'update',
    title: 'UPDATE с rowCount',
    subtitle: 'Проверка, затронута ли строка',
    steps: [
      {
        spotlight: ['pdo'],
        label: 'UPDATE … WHERE id = ?',
        detail: 'id из формы — после filter_var(…, FILTER_VALIDATE_INT)',
        packet: 'down',
        code: `$stmt = $pdo->prepare('UPDATE subscribers SET name = ? WHERE id = ?');
$stmt->execute([$name, $id]);`,
      },
      {
        spotlight: ['php'],
        label: 'rowCount() === 0',
        detail: 'Строка не найдена — отдельное сообщение пользователю',
        packet: 'up',
        code: `if ($stmt->rowCount() === 0) {
    $errors[] = 'Запись не найдена';
}`,
      },
    ],
  },
];

export function cloneSubscribers(rows) {
  return rows.map((r) => ({...r}));
}

export function nextSubscriberId(rows) {
  return rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
}

export function nowTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function runCrud(rows, op, {id, name, email}) {
  const next = cloneSubscribers(rows);
  const numId = Number(id);

  if (op === 'read') {
    if (numId) {
      const row = next.find((r) => r.id === numId);
      return {rows: next, hits: row ? [row] : [], message: row ? null : 'Подписчик не найден'};
    }
    if (email?.trim()) {
      const row = next.find((r) => r.email === email.trim());
      return {rows: next, hits: row ? [row] : [], message: row ? null : 'Email не найден'};
    }
    return {rows: next, hits: [...next], message: null};
  }

  if (op === 'create') {
    if (!name?.trim() || !email?.trim()) {
      return {rows: next, hits: [], message: 'Заполните name и email'};
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return {rows: next, hits: [], message: 'Некорректный формат email'};
    }
    if (next.some((r) => r.email === email.trim())) {
      return {rows: next, hits: [], message: 'Нарушение UNIQUE: email уже существует'};
    }
    const row = {
      id: nextSubscriberId(next),
      name: name.trim(),
      email: email.trim(),
      created_at: nowTimestamp(),
    };
    next.push(row);
    return {rows: next, hits: [row], message: null};
  }

  if (op === 'update') {
    const idx = next.findIndex((r) => r.id === numId);
    if (idx < 0) {
      return {rows: next, hits: [], message: 'Подписчик не найден'};
    }
    next[idx] = {
      ...next[idx],
      name: name?.trim() || next[idx].name,
      email: email?.trim() || next[idx].email,
    };
    if (next.filter((r, i) => i !== idx && r.email === next[idx].email).length) {
      return {rows: cloneSubscribers(rows), hits: [], message: 'Email уже занят другой записью'};
    }
    return {rows: next, hits: [next[idx]], message: null};
  }

  if (op === 'delete') {
    const idx = next.findIndex((r) => r.id === numId);
    if (idx < 0) {
      return {rows: next, hits: [], message: 'Подписчик не найден'};
    }
    const removed = next.splice(idx, 1);
    return {rows: next, hits: removed, message: null};
  }

  return {rows: next, hits: [], message: 'Неизвестная операция'};
}

export function sqlForOp(op, params) {
  const id = params.id ?? '?';
  const name = params.name ?? '…';
  const email = params.email ?? '…';
  switch (op) {
    case 'read':
      if (params.id) {
        return `SELECT id, name, email, created_at\nFROM subscribers WHERE id = ${id};`;
      }
      if (params.email) {
        return `SELECT id, name, email, created_at\nFROM subscribers WHERE email = '${email}';`;
      }
      return 'SELECT id, name, email, created_at\nFROM subscribers\nORDER BY id;';
    case 'create':
      return `INSERT INTO subscribers (name, email, created_at)\nVALUES ('${name}', '${email}', NOW());`;
    case 'update':
      return `UPDATE subscribers\nSET name = '${name}', email = '${email}'\nWHERE id = ${id};`;
    case 'delete':
      return `DELETE FROM subscribers WHERE id = ${id};`;
    default:
      return '--';
  }
}

export function phpCodeForLayer(layer, op, params) {
  const id = params.id ?? 2;
  const name = params.name ?? 'Борис';
  const email = params.email ?? 'boris@example.com';

  const pdo = {
    read: params.id
      ? `$stmt = $pdo->prepare('SELECT * FROM subscribers WHERE id = ?');
$stmt->execute([${id}]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);`
      : params.email
        ? `$stmt = $pdo->prepare('SELECT * FROM subscribers WHERE email = ?');
$stmt->execute(['${email}']);
$row = $stmt->fetch(PDO::FETCH_ASSOC);`
        : `$stmt = $pdo->query('SELECT * FROM subscribers ORDER BY id');
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);`,
    create: `$stmt = $pdo->prepare(
    'INSERT INTO subscribers (name, email, created_at) VALUES (?, ?, ?)'
);
$stmt->execute(['${name}', '${email}', date('Y-m-d H:i:s')]);
$newId = (int) $pdo->lastInsertId();`,
    update: `$stmt = $pdo->prepare('UPDATE subscribers SET name = ?, email = ? WHERE id = ?');
$stmt->execute(['${name}', '${email}', ${id}]);
if ($stmt->rowCount() === 0) { /* не найдено */ }`,
    delete: `$stmt = $pdo->prepare('DELETE FROM subscribers WHERE id = ?');
$stmt->execute([${id}]);`,
  };

  const mysqli = {
    read: `$stmt = $mysqli->prepare('SELECT * FROM subscribers WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();`,
    create: `$stmt = $mysqli->prepare('INSERT INTO subscribers (name, email, created_at) VALUES (?, ?, ?)');
$stmt->bind_param('sss', $name, $email, $created);
$stmt->execute();`,
    update: `$stmt = $mysqli->prepare('UPDATE subscribers SET name = ? WHERE id = ?');
$stmt->bind_param('si', $name, $id);
$stmt->execute();`,
    delete: `$stmt = $mysqli->prepare('DELETE FROM subscribers WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();`,
  };

  const unsafe = {
    read: `// ОПАСНО: SQL-инъекция
$sql = "SELECT * FROM subscribers WHERE email = '{$_GET['email']}'";
$result = $mysqli->query($sql);`,
    create: `$sql = "INSERT INTO subscribers (name, email) VALUES ('{$name}', '{$email}')";
$mysqli->query($sql);`,
    update: `$sql = "UPDATE subscribers SET name = '{$name}' WHERE id = {$id}";
$mysqli->query($sql);`,
    delete: `$sql = "DELETE FROM subscribers WHERE id = {$id}";
$mysqli->query($sql);`,
  };

  const snippets = {pdo, mysqli, unsafe};
  return snippets[layer]?.[op] ?? '// выберите операцию';
}

export function validateFormInput({name, email}) {
  const errors = [];
  const n = (name ?? '').trim();
  const e = (email ?? '').trim();
  if (!n) errors.push('Имя обязательно');
  if (!e) errors.push('Email обязателен');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errors.push('Некорректный email');
  return {ok: errors.length === 0, errors, name: n, email: e};
}
