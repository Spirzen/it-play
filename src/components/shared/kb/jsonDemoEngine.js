/** Пресеты и разбор JSON для интерактивного демо. */

export const JSON_PRESETS = [
  {
    id: 'valid',
    label: 'Валидный объект',
    json: `{
  "name": "Alice",
  "age": 25,
  "isStudent": true,
  "skills": ["Python", "JavaScript"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}`,
  },
  {
    id: 'config',
    label: 'Конфиг сервера',
    json: `{
  "server": {
    "host": "localhost",
    "port": 8080
  },
  "database": {
    "username": "admin",
    "password": "secret"
  }
}`,
  },
  {
    id: 'trailing-comma',
    label: 'Лишняя запятая',
    json: `{
  "name": "Alice",
  "age": 25,
}`,
  },
  {
    id: 'single-quotes',
    label: 'Одинарные кавычки',
    json: `{
  'name': 'Alice',
  "age": 25
}`,
  },
  {
    id: 'unquoted-key',
    label: 'Ключ без кавычек',
    json: `{
  name: "Alice",
  age: 25
}`,
  },
];

export function parseJson(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return {value: null, error: 'Документ пуст.', path: null, line: null, column: null};
  }
  try {
    const value = JSON.parse(trimmed);
    return {value, error: null, path: null, line: null, column: null};
  } catch (err) {
    const match = /position (\d+)/i.exec(err.message ?? '');
    let line = null;
    let column = null;
    if (match) {
      const pos = Number(match[1]);
      const before = trimmed.slice(0, pos);
      const lines = before.split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    return {
      value: null,
      error: err.message || 'Некорректный JSON.',
      path: null,
      line,
      column,
    };
  }
}

export function jsonTypeLabel(value) {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return `array[${value.length}]`;
  }
  if (typeof value === 'object') {
    return `object{${Object.keys(value).length}}`;
  }
  return typeof value;
}

export function flattenJsonTree(value, path = '$', depth = 0, rows = []) {
  if (depth > 6) {
    rows.push({path, type: '…', preview: 'глубокая вложенность'});
    return rows;
  }
  if (value === null || typeof value !== 'object') {
    rows.push({path, type: jsonTypeLabel(value), preview: String(value)});
    return rows;
  }
  if (Array.isArray(value)) {
    rows.push({path, type: 'array', preview: `[${value.length} элементов]`});
    value.slice(0, 8).forEach((item, index) => {
      flattenJsonTree(item, `${path}[${index}]`, depth + 1, rows);
    });
    if (value.length > 8) {
      rows.push({path: `${path}[…]`, type: '…', preview: `ещё ${value.length - 8}`});
    }
    return rows;
  }
  rows.push({path, type: 'object', preview: `{${Object.keys(value).length} ключей}`});
  Object.entries(value)
    .slice(0, 12)
    .forEach(([key, child]) => {
      flattenJsonTree(child, `${path}.${key}`, depth + 1, rows);
    });
  const keys = Object.keys(value);
  if (keys.length > 12) {
    rows.push({path: `${path}.…`, type: '…', preview: `ещё ${keys.length - 12} ключей`});
  }
  return rows;
}
