/** Упрощённый разбор YAML для учебного демо (подмножество из статьи). */

export const YAML_PRESETS = [
  {
    id: 'dict',
    label: 'Словарь',
    yaml: `name: Alice
age: 25
isStudent: true
`,
  },
  {
    id: 'list',
    label: 'Список',
    yaml: `fruits:
  - apple
  - banana
  - cherry
`,
  },
  {
    id: 'nested',
    label: 'Вложенная структура',
    yaml: `server:
  host: localhost
  port: 8080
  users:
    - name: Alice
      role: admin
    - name: Bob
      role: user
`,
  },
  {
    id: 'compose',
    label: 'Docker Compose',
    yaml: `version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
`,
  },
  {
    id: 'k8s-deployment',
    label: 'Kubernetes Deployment',
    yaml: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 2
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:1.27-alpine
          ports:
            - containerPort: 80
`,
  },
  {
    id: 'tab-indent',
    label: 'Табуляция (ошибка)',
    yaml: `server:
\thost: localhost
  port: 8080
`,
  },
  {
    id: 'bad-colon',
    label: 'Без пробела после :',
    yaml: `name:Alice
age: 25
`,
  },
];

function parseScalar(raw) {
  const v = raw.trim();
  if (v === '' || v === '~' || v === 'null') {
    return null;
  }
  if (v === 'true') {
    return true;
  }
  if (v === 'false') {
    return false;
  }
  if (/^-?\d+$/.test(v)) {
    return Number(v);
  }
  if (/^-?\d+\.\d+$/.test(v)) {
    return Number(v);
  }
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function indentOf(line) {
  const m = /^(\s*)/.exec(line);
  return m ? m[1].length : 0;
}

/**
 * Минимальный YAML-парсер: отступы пробелами, key: value, списки - item.
 */
export function parseYaml(text) {
  const lines = text.split('\n');
  const issues = [];
  const root = {};
  const stack = [{indent: -1, value: root, kind: 'map'}];

  for (let lineNo = 0; lineNo < lines.length; lineNo += 1) {
    const line = lines[lineNo];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    if (line.includes('\t')) {
      issues.push({
        line: lineNo + 1,
        ok: false,
        message: 'Табуляция запрещена — используйте только пробелы для отступов.',
      });
    }
    const indent = indentOf(line);
    if (indent % 2 !== 0 && indent > 0) {
      issues.push({
        line: lineNo + 1,
        ok: false,
        message: `Нестандартный отступ (${indent} пробелов). В примерах статьи — шаг 2 пробела.`,
      });
    }

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];

    if (trimmed.startsWith('- ')) {
      const itemRaw = trimmed.slice(2).trim();
      let container = parent.value;
      if (parent.kind !== 'list') {
        issues.push({
          line: lineNo + 1,
          ok: false,
          message: 'Элемент списка (-) без родительского ключа — ожидается ключ со списком выше.',
        });
        continue;
      }
      if (itemRaw.includes(':') && !itemRaw.startsWith('"')) {
        const obj = {};
        const [k, ...rest] = itemRaw.split(':');
        obj[k.trim()] = parseScalar(rest.join(':'));
        container.push(obj);
        stack.push({indent, value: obj, kind: 'map'});
      } else {
        container.push(parseScalar(itemRaw));
      }
      continue;
    }

    const colon = trimmed.indexOf(':');
    if (colon === -1) {
      issues.push({
        line: lineNo + 1,
        ok: false,
        message: 'Ожидается пара ключ: значение или элемент списка (-).',
      });
      continue;
    }
    const key = trimmed.slice(0, colon).trim();
    const rest = trimmed.slice(colon + 1);
    if (!key) {
      issues.push({line: lineNo + 1, ok: false, message: 'Пустой ключ.'});
      continue;
    }
    if (rest.length > 0 && rest[0] !== ' ' && rest[0] !== '\t') {
      issues.push({
        line: lineNo + 1,
        ok: false,
        message: `После "${key}:" нужен пробел перед значением.`,
      });
    }
    const valuePart = rest.trim();

    if (parent.kind !== 'map' || typeof parent.value !== 'object' || Array.isArray(parent.value)) {
      issues.push({
        line: lineNo + 1,
        ok: false,
        message: 'Ключ внутри списка без объекта — используйте "- key: value".',
      });
      continue;
    }

    if (valuePart === '') {
      const nextLine = lines[lineNo + 1];
      const nextTrim = nextLine?.trim() ?? '';
      if (nextTrim.startsWith('- ')) {
        parent.value[key] = [];
        stack.push({indent, value: parent.value[key], kind: 'list'});
      } else {
        parent.value[key] = {};
        stack.push({indent, value: parent.value[key], kind: 'map'});
      }
    } else {
      parent.value[key] = parseScalar(valuePart);
    }
  }

  const valid = issues.filter((i) => !i.ok).length === 0;
  return {data: root, issues, valid};
}

export function yamlToDisplayLines(obj, prefix = '', lines = []) {
  if (obj === null || typeof obj !== 'object') {
    lines.push({key: prefix || '(root)', type: typeof obj, value: String(obj)});
    return lines;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      if (item !== null && typeof item === 'object') {
        lines.push({key: `${prefix}[${i}]`, type: 'object', value: `{…}`});
        yamlToDisplayLines(item, `${prefix}[${i}]`, lines);
      } else {
        lines.push({key: `${prefix}[${i}]`, type: typeof item, value: String(item)});
      }
    });
    return lines;
  }
  Object.entries(obj).forEach(([key, val]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val !== null && typeof val === 'object') {
      const type = Array.isArray(val) ? `list[${val.length}]` : `map{${Object.keys(val).length}}`;
      lines.push({key: path, type, value: ''});
      yamlToDisplayLines(val, path, lines);
    } else {
      lines.push({key: path, type: typeof val, value: String(val)});
    }
  });
  return lines;
}
