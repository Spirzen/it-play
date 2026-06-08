/** Имитация подключения и чтения метаданных СУБД для DatabaseSchemaViewerPlay */

export const DB_TYPES = [
  {id: 'postgresql', label: 'PostgreSQL', port: 5432},
  {id: 'mysql', label: 'MySQL', port: 3306},
  {id: 'mssql', label: 'MS SQL Server', port: 1433},
  {id: 'oracle', label: 'Oracle', port: 1521},
  {id: 'sqlite', label: 'SQLite', port: null},
];

export const DEFAULT_PORTS = Object.fromEntries(DB_TYPES.map((t) => [t.id, t.port]));

const MOCK_DATABASES = {
  postgresql: ['corp_demo', 'shop', 'analytics'],
  mysql: ['shop', 'blog', 'legacy'],
  mssql: ['Northwind', 'corp_demo', 'Reporting'],
  oracle: ['ORCL', 'HR', 'SALES'],
  sqlite: [],
};

function col(name, dataType, opts = {}) {
  return {
    name,
    data_type: dataType,
    nullable: opts.nullable ?? false,
    is_primary_key: opts.pk ?? false,
    is_foreign_key: opts.fk ?? false,
    default_value: opts.default ?? null,
  };
}

function fk(id, fromTable, fromCols, toTable, toCols, onDelete = 'RESTRICT') {
  return {
    id,
    name: `fk_${fromTable}_${toCols[0]}`,
    from_table: fromTable,
    from_columns: fromCols,
    to_table: toTable,
    to_columns: toCols,
    on_delete: onDelete,
    on_update: null,
  };
}

/** Демо-схема из Database Schema Viewer (sample/demo.db) */
const CORP_DEMO = {
  db_label: 'corp_demo',
  tables: [
    {
      name: 'departments',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INTEGER', {pk: true}),
        col('name', 'TEXT'),
        col('budget', 'REAL', {nullable: true, default: '0'}),
      ],
    },
    {
      name: 'employees',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INTEGER', {pk: true}),
        col('full_name', 'TEXT'),
        col('email', 'TEXT', {nullable: true}),
        col('department_id', 'INTEGER', {fk: true}),
        col('manager_id', 'INTEGER', {nullable: true, fk: true}),
        col('hired_at', 'TEXT', {nullable: true}),
      ],
    },
    {
      name: 'projects',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INTEGER', {pk: true}),
        col('title', 'TEXT'),
        col('department_id', 'INTEGER', {fk: true}),
        col('started_at', 'TEXT', {nullable: true}),
      ],
    },
    {
      name: 'project_assignments',
      schema: 'public',
      primary_key: ['project_id', 'employee_id'],
      columns: [
        col('project_id', 'INTEGER', {pk: true, fk: true}),
        col('employee_id', 'INTEGER', {pk: true, fk: true}),
        col('role', 'TEXT', {nullable: true, default: 'member'}),
      ],
    },
    {
      name: 'customers',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INTEGER', {pk: true}),
        col('company_name', 'TEXT'),
        col('contact_email', 'TEXT', {nullable: true}),
      ],
    },
    {
      name: 'orders',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INTEGER', {pk: true}),
        col('customer_id', 'INTEGER', {fk: true}),
        col('employee_id', 'INTEGER', {nullable: true, fk: true}),
        col('order_date', 'TEXT', {nullable: true}),
        col('total', 'REAL', {nullable: true, default: '0'}),
      ],
    },
    {
      name: 'order_items',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INTEGER', {pk: true}),
        col('order_id', 'INTEGER', {fk: true}),
        col('product_name', 'TEXT'),
        col('quantity', 'INTEGER', {nullable: true, default: '1'}),
        col('unit_price', 'REAL'),
      ],
    },
  ],
  foreign_keys: [
    fk('fk1', 'employees', ['department_id'], 'departments', ['id']),
    fk('fk2', 'employees', ['manager_id'], 'employees', ['id'], 'SET NULL'),
    fk('fk3', 'projects', ['department_id'], 'departments', ['id'], 'CASCADE'),
    fk('fk4', 'project_assignments', ['project_id'], 'projects', ['id'], 'CASCADE'),
    fk('fk5', 'project_assignments', ['employee_id'], 'employees', ['id'], 'CASCADE'),
    fk('fk6', 'orders', ['customer_id'], 'customers', ['id']),
    fk('fk7', 'orders', ['employee_id'], 'employees', ['id'], 'SET NULL'),
    fk('fk8', 'order_items', ['order_id'], 'orders', ['id'], 'CASCADE'),
  ],
};

const SHOP = {
  db_label: 'shop',
  tables: [
    {
      name: 'categories',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'SERIAL', {pk: true}),
        col('name', 'VARCHAR(100)'),
        col('slug', 'VARCHAR(120)'),
      ],
    },
    {
      name: 'products',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'SERIAL', {pk: true}),
        col('category_id', 'INTEGER', {fk: true}),
        col('title', 'VARCHAR(200)'),
        col('price', 'NUMERIC(10,2)'),
        col('stock', 'INTEGER', {nullable: true, default: '0'}),
      ],
    },
    {
      name: 'users',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'SERIAL', {pk: true}),
        col('email', 'VARCHAR(255)'),
        col('name', 'VARCHAR(120)'),
        col('created_at', 'TIMESTAMP', {nullable: true}),
      ],
    },
    {
      name: 'orders',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'SERIAL', {pk: true}),
        col('user_id', 'INTEGER', {fk: true}),
        col('status', 'VARCHAR(32)', {default: 'pending'}),
        col('total', 'NUMERIC(12,2)', {nullable: true}),
        col('placed_at', 'TIMESTAMP', {nullable: true}),
      ],
    },
    {
      name: 'order_items',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'SERIAL', {pk: true}),
        col('order_id', 'INTEGER', {fk: true}),
        col('product_id', 'INTEGER', {fk: true}),
        col('qty', 'INTEGER', {default: '1'}),
        col('unit_price', 'NUMERIC(10,2)'),
      ],
    },
  ],
  foreign_keys: [
    fk('s1', 'products', ['category_id'], 'categories', ['id']),
    fk('s2', 'orders', ['user_id'], 'users', ['id']),
    fk('s3', 'order_items', ['order_id'], 'orders', ['id'], 'CASCADE'),
    fk('s4', 'order_items', ['product_id'], 'products', ['id']),
  ],
};

const BLOG = {
  db_label: 'blog',
  tables: [
    {
      name: 'authors',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INT', {pk: true}),
        col('name', 'VARCHAR(100)'),
        col('bio', 'TEXT', {nullable: true}),
      ],
    },
    {
      name: 'posts',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INT', {pk: true}),
        col('author_id', 'INT', {fk: true}),
        col('title', 'VARCHAR(255)'),
        col('body', 'TEXT', {nullable: true}),
        col('published_at', 'DATETIME', {nullable: true}),
      ],
    },
    {
      name: 'comments',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'INT', {pk: true}),
        col('post_id', 'INT', {fk: true}),
        col('author_name', 'VARCHAR(80)'),
        col('text', 'TEXT'),
      ],
    },
    {
      name: 'tags',
      schema: 'public',
      primary_key: ['id'],
      columns: [col('id', 'INT', {pk: true}), col('name', 'VARCHAR(50)')],
    },
    {
      name: 'post_tags',
      schema: 'public',
      primary_key: ['post_id', 'tag_id'],
      columns: [
        col('post_id', 'INT', {pk: true, fk: true}),
        col('tag_id', 'INT', {pk: true, fk: true}),
      ],
    },
  ],
  foreign_keys: [
    fk('b1', 'posts', ['author_id'], 'authors', ['id']),
    fk('b2', 'comments', ['post_id'], 'posts', ['id'], 'CASCADE'),
    fk('b3', 'post_tags', ['post_id'], 'posts', ['id'], 'CASCADE'),
    fk('b4', 'post_tags', ['tag_id'], 'tags', ['id'], 'CASCADE'),
  ],
};

const ANALYTICS = {
  db_label: 'analytics',
  tables: [
    {
      name: 'events',
      schema: 'public',
      primary_key: ['id'],
      columns: [
        col('id', 'BIGINT', {pk: true}),
        col('user_id', 'UUID', {nullable: true}),
        col('event_type', 'VARCHAR(64)'),
        col('payload', 'JSONB', {nullable: true}),
        col('created_at', 'TIMESTAMPTZ'),
      ],
    },
    {
      name: 'daily_metrics',
      schema: 'public',
      primary_key: ['metric_date', 'metric_name'],
      columns: [
        col('metric_date', 'DATE', {pk: true}),
        col('metric_name', 'VARCHAR(64)', {pk: true}),
        col('value', 'NUMERIC(18,4)'),
      ],
    },
  ],
  foreign_keys: [],
};

const SCHEMA_BY_DB = {
  corp_demo: CORP_DEMO,
  shop: SHOP,
  blog: BLOG,
  analytics: ANALYTICS,
  legacy: CORP_DEMO,
  Northwind: SHOP,
  Reporting: ANALYTICS,
  ORCL: CORP_DEMO,
  HR: BLOG,
  SALES: SHOP,
};

export function emptyConnection(dbType = 'postgresql') {
  const port = DEFAULT_PORTS[dbType] ?? 5432;
  return {
    db_type: dbType,
    host: 'localhost',
    port,
    username: '',
    password: '',
    database: '',
    file_path: '',
    schema: dbType === 'postgresql' ? 'public' : dbType === 'mssql' ? 'dbo' : '',
  };
}

export function sanitizeHostInput(host) {
  return host.replace(/^https?:\/\//i, '').replace(/\/+$/, '').trim();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function validateConnection(conn) {
  if (conn.db_type === 'sqlite') {
    if (!conn.file_path?.trim()) {
      return {ok: false, message: 'Укажите путь к файлу .db'};
    }
    return {ok: true};
  }

  if (!conn.host?.trim()) {
    return {ok: false, message: 'Укажите хост'};
  }
  if (!conn.username?.trim()) {
    return {ok: false, message: 'Укажите пользователя'};
  }
  if (!conn.database?.trim()) {
    return {ok: false, message: 'Выберите или введите имя базы'};
  }
  if (conn.password === 'fail') {
    return {ok: false, message: 'Ошибка аутентификации: неверный пароль'};
  }
  return {ok: true};
}

export async function simulateTestConnection(conn) {
  await delay(480 + Math.random() * 320);
  const check = validateConnection(conn);
  if (!check.ok) {
    return {ok: false, message: check.message};
  }
  const dbLabel = conn.db_type === 'sqlite' ? conn.file_path.split(/[/\\]/).pop() : conn.database;
  return {
    ok: true,
    message: `Соединение с ${dbLabel} установлено (${conn.host || 'local'})`,
  };
}

export async function simulateListDatabases(conn) {
  await delay(360 + Math.random() * 240);
  const check = validateConnection(conn);
  if (!check.ok && conn.db_type !== 'sqlite') {
    throw new Error(check.message);
  }
  if (conn.password === 'fail') {
    throw new Error('Ошибка аутентификации: неверный пароль');
  }
  return MOCK_DATABASES[conn.db_type] ?? ['corp_demo'];
}

export async function simulateFetchSchema(conn) {
  await delay(620 + Math.random() * 380);
  const check = validateConnection(conn);
  if (!check.ok) {
    throw new Error(check.message);
  }

  let key = conn.database?.trim() || 'corp_demo';
  if (conn.db_type === 'sqlite') {
    key = 'corp_demo';
  }

  const schema = SCHEMA_BY_DB[key] ?? CORP_DEMO;
  const dbLabel =
    conn.db_type === 'sqlite'
      ? conn.file_path.split(/[/\\]/).pop() || 'demo.db'
      : `${schema.db_label} (${conn.db_type})`;

  return {
    ...schema,
    db_label: dbLabel,
  };
}

export function describeFk(fkInfo) {
  const parts = [];
  for (let i = 0; i < fkInfo.from_columns.length; i += 1) {
    const fromCol = fkInfo.from_columns[i];
    const toCol = fkInfo.to_columns[i] ?? fkInfo.to_columns[0];
    parts.push(
      `Поле "${fromCol}" таблицы "${fkInfo.from_table}" связано с полем "${toCol}" таблицы "${fkInfo.to_table}"`,
    );
  }
  return parts.join(fkInfo.from_columns.length > 1 ? '; ' : '');
}

export function getRelatedTables(tableName, foreignKeys) {
  const related = new Set();
  for (const fk of foreignKeys) {
    if (fk.from_table === tableName) related.add(fk.to_table);
    if (fk.to_table === tableName) related.add(fk.from_table);
  }
  return related;
}

export function getColumnRelations(tableName, foreignKeys) {
  const result = [];
  for (const fkItem of foreignKeys) {
    if (fkItem.from_table === tableName) {
      for (let i = 0; i < fkItem.from_columns.length; i += 1) {
        result.push({
          fk: fkItem,
          direction: 'outgoing',
          localColumn: fkItem.from_columns[i],
          remoteTable: fkItem.to_table,
          remoteColumn: fkItem.to_columns[i] ?? fkItem.to_columns[0],
        });
      }
    }
    if (fkItem.to_table === tableName) {
      for (let i = 0; i < fkItem.to_columns.length; i += 1) {
        result.push({
          fk: fkItem,
          direction: 'incoming',
          localColumn: fkItem.to_columns[i],
          remoteTable: fkItem.from_table,
          remoteColumn: fkItem.from_columns[i] ?? fkItem.from_columns[0],
        });
      }
    }
  }
  return result;
}

/** Простая послойная раскладка таблиц для CSS-графа */
export function computeTableLayout(tables, foreignKeys) {
  const names = tables.map((t) => t.name);
  const maxLayer = Math.max(0, names.length - 1);
  const incoming = new Map(names.map((n) => [n, 0]));
  for (const fk of foreignKeys) {
    if (fk.from_table === fk.to_table) continue;
    if (incoming.has(fk.to_table)) {
      incoming.set(fk.to_table, (incoming.get(fk.to_table) || 0) + 1);
    }
  }

  const layers = new Map();
  const queue = names.filter((n) => (incoming.get(n) || 0) === 0);
  if (queue.length === 0 && names.length) queue.push(names[0]);

  for (const n of queue) layers.set(n, 0);
  let qi = 0;
  while (qi < queue.length) {
    const cur = queue[qi];
    qi += 1;
    const layer = layers.get(cur) ?? 0;
    for (const fk of foreignKeys) {
      if (fk.from_table !== cur || fk.from_table === fk.to_table) continue;
      if (!incoming.has(fk.to_table)) continue;
      const nextLayer = Math.min(layer + 1, maxLayer);
      const prev = layers.get(fk.to_table);
      if (prev === undefined || prev < nextLayer) {
        layers.set(fk.to_table, nextLayer);
        queue.push(fk.to_table);
      }
    }
  }

  for (const n of names) {
    if (!layers.has(n)) layers.set(n, 0);
  }

  const byLayer = new Map();
  for (const n of names) {
    const l = layers.get(n) ?? 0;
    if (!byLayer.has(l)) byLayer.set(l, []);
    byLayer.get(l).push(n);
  }

  const positions = {};
  for (const [layer, layerNames] of [...byLayer.entries()].sort((a, b) => a[0] - b[0])) {
    layerNames.forEach((name, row) => {
      positions[name] = {col: layer, row};
    });
  }
  return positions;
}

export function filterSchema(schema, query) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return {tables: schema.tables, matchingTables: new Set(schema.tables.map((t) => t.name))};
  }
  const matchingTables = new Set();
  for (const table of schema.tables) {
    if (table.name.toLowerCase().includes(q)) {
      matchingTables.add(table.name);
      continue;
    }
    for (const c of table.columns) {
      if (c.name.toLowerCase().includes(q)) {
        matchingTables.add(table.name);
        break;
      }
    }
  }
  return {tables: schema.tables, matchingTables};
}
