/** Учебная симуляция XSS, CSRF и SQLi — без реального исполнения вредоносного кода. */

export const ATTACK_TABS = [
  {id: 'sqli', label: 'SQLi'},
  {id: 'xss', label: 'XSS'},
  {id: 'csrf', label: 'CSRF'},
];

const USERS = [
  {id: 1, login: 'admin', role: 'admin'},
  {id: 2, login: 'alice', role: 'user'},
  {id: 3, login: 'bob', role: 'user'},
];

export const SQLI_PRESETS = [
  {id: 'normal', label: 'Обычный логин', value: 'alice'},
  {id: 'bypass', label: 'Обход WHERE', value: "' OR '1'='1"},
  {id: 'union', label: 'UNION (учебный)', value: "' UNION SELECT login, role FROM Users--"},
];

export const XSS_PRESETS = [
  {id: 'safe', label: 'Текст', value: 'Привет, мир!'},
  {id: 'script', label: 'Скрипт', value: '<script>alert(document.cookie)</script>'},
  {id: 'img', label: 'onerror', value: '<img src=x onerror="steal()">'},
];

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Конкатенация (уязвимо) vs параметризованный запрос. */
export function simulateSqlLogin(userInput, usePrepared) {
  const trimmed = String(userInput ?? '').trim();
  if (usePrepared) {
    const user = USERS.find((u) => u.login === trimmed);
    return {
      mode: 'prepared',
      query: 'SELECT * FROM Users WHERE Login = ?',
      params: [trimmed],
      rows: user ? [user] : [],
      leaked: false,
      note: user
        ? 'Параметр передан отдельно — СУБД не интерпретирует кавычки как синтаксис SQL.'
        : 'Запрос выполнен, записей нет — логин не найден.',
    };
  }

  const query = `SELECT * FROM Users WHERE Login = '${trimmed}'`;
  const lowered = query.toLowerCase();
  const injection =
    trimmed.includes("'") ||
    lowered.includes(' or ') ||
    lowered.includes('union') ||
    lowered.includes('--');

  let rows = [];
  if (injection) {
    if (lowered.includes('union')) {
      rows = USERS.map((u) => ({login: u.login, role: u.role, via: 'UNION'}));
    } else {
      rows = [...USERS];
    }
  } else {
    const user = USERS.find((u) => u.login === trimmed);
    if (user) rows = [user];
  }

  return {
    mode: 'concat',
    query,
    params: null,
    rows,
    leaked: rows.length > 1 || (rows.length === 1 && rows[0].login !== trimmed),
    note: rows.length > 1
      ? 'Условие WHERE изменено — возвращены лишние строки (обход аутентификации).'
      : rows.length === 0
        ? 'Пользователь не найден.'
        : 'Один пользователь — ожидаемый результат.',
  };
}

/** Безопасный вывод vs innerHTML (учебная визуализация). */
export function simulateXssOutput(payload, safeMode) {
  const raw = String(payload ?? '');
  if (safeMode) {
    return {
      safe: true,
      displayHtml: escapeHtml(raw),
      executes: false,
      stolen: null,
      note: 'textContent / экранирование — браузер показывает теги как текст, скрипт не запускается.',
    };
  }

  const executes = /<\s*script|on\w+\s*=|javascript:/i.test(raw);
  return {
    safe: false,
    displayHtml: raw,
    executes,
    stolen: executes ? 'session_id=abc123; role=user' : null,
    note: executes
      ? 'innerHTML интерпретирует разметку — в реальном приложении здесь выполнился бы JS.'
      : 'Разметка вставлена как HTML, но явного исполняемого кода не обнаружено.',
  };
}

/** Межсайтовый POST с cookie сессии. */
export function simulateCsrf({hasSession, useToken, tokenValue, formToken}) {
  if (!hasSession) {
    return {
      allowed: false,
      status: '401',
      message: 'Нет cookie сессии — банк не выполнит перевод.',
      request: null,
    };
  }

  const request = {
    method: 'POST',
    url: 'https://bank.example/transfer',
    cookie: 'session=logged-in',
    body: {to: 'attacker', amount: 5000},
    csrfToken: useToken ? tokenValue : null,
    submittedToken: formToken ?? null,
  };

  if (!useToken) {
    return {
      allowed: true,
      status: '200 OK',
      message: 'Cookie отправлены автоматически — перевод выполнен без ведома пользователя.',
      request,
    };
  }

  if (formToken && formToken === tokenValue) {
    return {
      allowed: true,
      status: '200 OK',
      message: 'CSRF-токен совпал — запрос легитимен.',
      request,
    };
  }

  return {
    allowed: false,
    status: '403 Forbidden',
    message: 'Токен отсутствует или неверен — сервер отклонил подделанный запрос.',
    request,
  };
}

export function randomCsrfToken() {
  return `csrf_${Math.random().toString(36).slice(2, 10)}`;
}
