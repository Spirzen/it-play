/**
 * Унифицированный SQL-движок браузерного тренажёра.
 * SELECT (WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, DISTINCT, JOIN),
 * INSERT, UPDATE, DELETE, UNION.
 */

import {
  parseSqlLiteral,
  parseWhereClause,
  matchesConditions,
  parseSetClause,
  validateUserField,
} from './sqlEngine';
import {TABLE_META, getTableRows, createShopDatabase} from './sqlShopSchema';

export {createShopDatabase};

function cloneDb(db) {
  return JSON.parse(JSON.stringify(db));
}

export function stripSqlComments(sql) {
  return sql
    .replace(/--[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim();
}

function nextId(db, table) {
  const meta = TABLE_META[table];
  if (!meta?.pk) {
    return db[table].length + 1;
  }
  if (!db._seq) {
    db._seq = {};
  }
  const id = db._seq[table] ?? db[table].length + 1;
  db._seq[table] = id + 1;
  return id;
}

function splitSelectList(selectRaw) {
  const items = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < selectRaw.length; i += 1) {
    const ch = selectRaw[i];
    if (ch === '(') {
      depth += 1;
    }
    if (ch === ')') {
      depth -= 1;
    }
    if (ch === ',' && depth === 0) {
      items.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    items.push(current.trim());
  }
  return items;
}

function parseSelectItem(item) {
  const trimmed = item.trim();
  if (trimmed === '*') {
    return {type: 'star'};
  }

  const asMatch = trimmed.match(/^(.+)\s+AS\s+(\w+)$/i);
  const expr = asMatch ? asMatch[1].trim() : trimmed;
  const alias = asMatch ? asMatch[2] : null;

  const aggMatch = expr.match(/^(COUNT|SUM|AVG|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)$/i);
  if (aggMatch) {
    return {
      type: 'agg',
      fn: aggMatch[1].toUpperCase(),
      col: aggMatch[2] === '*' ? '*' : aggMatch[2].toLowerCase(),
      alias: alias || expr,
    };
  }

  if (expr.includes('.')) {
    const [a, c] = expr.split('.');
    return {type: 'qualified', alias: a, column: c, outAlias: alias || expr};
  }

  return {type: 'column', column: expr.toLowerCase(), alias: alias || expr};
}

function computeAgg(fn, col, rows) {
  if (fn === 'COUNT') {
    if (col === '*') {
      return rows.length;
    }
    return rows.filter((r) => r[col] != null).length;
  }
  const nums = rows.map((r) => r[col]).filter((v) => typeof v === 'number');
  if (nums.length === 0) {
    return null;
  }
  if (fn === 'SUM') {
    return nums.reduce((a, b) => a + b, 0);
  }
  if (fn === 'AVG') {
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
  }
  if (fn === 'MIN') {
    return Math.min(...nums);
  }
  if (fn === 'MAX') {
    return Math.max(...nums);
  }
  return null;
}

function projectRows(rows, selectItems, flatMode = false) {
  if (selectItems.some((i) => i.type === 'star')) {
    if (rows.length === 0) {
      return {columns: [], rows: []};
    }
    const cols = Object.keys(rows[0]).filter((k) => !k.startsWith('__'));
    return {
      columns: cols,
      rows: rows.map((r) => {
        const o = {};
        cols.forEach((c) => {
          o[c] = r[c];
        });
        return o;
      }),
    };
  }

  const outRows = rows.map((row) => {
    const o = {};
    for (const item of selectItems) {
      if (item.type === 'column') {
        o[item.alias] = row[item.column];
      } else if (item.type === 'qualified') {
        const qKey = `${item.alias}.${item.column}`;
        o[item.outAlias] =
          row[qKey] ?? row[item.column] ?? row.__join?.[item.alias]?.[item.column] ?? null;
      } else if (item.type === 'agg') {
        o[item.alias] = computeAgg(item.fn, item.col, [row]);
      }
    }
    return o;
  });

  const columns =
    selectItems[0]?.type === 'agg' || selectItems.every((i) => i.alias)
      ? selectItems.map((i) => i.alias)
      : selectItems.map((i) => i.alias || i.column);

  return {columns, rows: outRows};
}

function applyWhere(rows, sql, stopBefore = 'GROUP|ORDER|LIMIT|HAVING') {
  const re = new RegExp(`WHERE\\s+(.+?)(?:\\s+(?:${stopBefore})\\b|$)`, 'is');
  const m = sql.match(re);
  if (!m) {
    return rows;
  }
  const groups = parseWhereClause(m[1].trim());
  return rows.filter((row) => matchesConditions(row, groups));
}

function resolveRowColumn(row, col) {
  const key = col.toLowerCase();
  if (key in row) {
    return row[key];
  }
  if (key.includes('.')) {
    return row[key];
  }
  const bare = key.replace(/^\w+\./, '');
  if (bare in row) {
    return row[bare];
  }
  return row[key];
}

function parseGroupBy(sql) {
  const m = sql.match(/GROUP\s+BY\s+(.+?)(?:\s+HAVING|\s+ORDER|\s+LIMIT|$)/is);
  if (!m) {
    return null;
  }
  return m[1].split(',').map((c) => c.trim().toLowerCase());
}

function filterHaving(rows, sql, selectItems) {
  const m = sql.match(/HAVING\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/is);
  if (!m) {
    return rows;
  }
  const clause = m[1].trim();
  const countStarM = clause.match(/COUNT\s*\(\s*\*\s*\)\s*(>=|>|<=|<|=)\s*(\d+)/i);
  if (countStarM) {
    const op = countStarM[1];
    const num = Number(countStarM[2]);
    const cntAlias = selectItems.find((i) => i.type === 'agg' && i.fn === 'COUNT')?.alias;
    return rows.filter((row) => {
      const v = cntAlias != null ? row[cntAlias] : 0;
      if (op === '>') {
        return v > num;
      }
      if (op === '>=') {
        return v >= num;
      }
      if (op === '<') {
        return v < num;
      }
      if (op === '<=') {
        return v <= num;
      }
      return v === num;
    });
  }
  return rows.filter((row) => matchesConditions(row, parseWhereClause(clause)));
}

function applyGroupBy(rows, groupCols, selectItems) {
  const map = new Map();
  for (const row of rows) {
    const key = groupCols.map((c) => String(resolveRowColumn(row, c) ?? '')).join('\0');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(row);
  }

  const result = [];
  for (const groupRows of map.values()) {
    const out = {};
    for (const item of selectItems) {
      if (item.type === 'agg') {
        out[item.alias] = computeAgg(item.fn, item.col, groupRows);
      } else if (item.type === 'qualified') {
        const colKey = `${item.alias}.${item.column}`;
        out[item.outAlias] = resolveRowColumn(groupRows[0], colKey);
      } else if (item.type === 'column') {
        out[item.alias] = resolveRowColumn(groupRows[0], item.column);
      }
    }
    for (const gc of groupCols) {
      const bare = gc.includes('.') ? gc : gc;
      const aliasCol = selectItems.find(
        (i) =>
          (i.type === 'qualified' && `${i.alias}.${i.column}` === gc) ||
          (i.type === 'column' && i.column === gc.replace(/^\w+\./, '')),
      );
      if (!aliasCol) {
        const label = gc.includes('.') ? gc.split('.')[1] : gc;
        if (!(label in out)) {
          out[label] = resolveRowColumn(groupRows[0], gc);
        }
      }
    }
    result.push(out);
  }
  return result;
}

function applyOrderBy(rows, sql, columnsHint) {
  const m = sql.match(/ORDER\s+BY\s+(.+?)(?:\s+LIMIT|$)/is);
  if (!m) {
    return rows;
  }
  const parts = m[1].split(',').map((p) => p.trim());
  const sorted = [...rows];
  sorted.sort((a, b) => {
    for (const part of parts) {
      const tokens = part.split(/\s+/);
      let col = tokens[0].toLowerCase().replace(/^\w+\./, '');
      const dir = tokens.includes('DESC') ? -1 : 1;
      const nullsFirst = tokens.includes('NULLS') && tokens.includes('FIRST');

      const aliasMatch = columnsHint?.find((c) => c === col || c.endsWith(col));
      if (aliasMatch) {
        col = aliasMatch;
      }

      const va = a[col];
      const vb = b[col];
      if (va == null && vb == null) {
        continue;
      }
      if (va == null) {
        return nullsFirst ? -1 : 1;
      }
      if (vb == null) {
        return nullsFirst ? 1 : -1;
      }
      if (va < vb) {
        return -1 * dir;
      }
      if (va > vb) {
        return 1 * dir;
      }
    }
    return 0;
  });
  return sorted;
}

function applyLimit(rows, sql) {
  const limitM = sql.match(/\bLIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?/i);
  if (!limitM) {
    const offsetOnly = sql.match(/\bOFFSET\s+(\d+)/i);
    if (offsetOnly) {
      return rows.slice(Number(offsetOnly[1]));
    }
    return rows;
  }
  const limit = Number(limitM[1]);
  const offset = limitM[2] ? Number(limitM[2]) : 0;
  return rows.slice(offset, offset + limit);
}

function flattenJoinRow(struct, aliases) {
  const flat = {};
  for (const al of aliases) {
    const part = struct[al];
    if (!part) {
      continue;
    }
    for (const [k, v] of Object.entries(part)) {
      flat[`${al}.${k}`] = v;
      if (!(k in flat)) {
        flat[k] = v;
      }
    }
  }
  flat.__join = struct;
  return flat;
}

function parseFromAndJoins(sql) {
  const fromM = sql.match(/FROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/i);
  if (!fromM) {
    throw new Error('Ожидается предложение FROM.');
  }

  const mainTable = fromM[1].toLowerCase();
  const mainAlias = (fromM[2] || fromM[1]).toLowerCase();

  const joins = [];
  const joinRe =
    /(INNER|LEFT|RIGHT|FULL\s+OUTER|CROSS)?\s*JOIN\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?(?:\s+ON\s+(.+?))?(?=\s+(?:(?:INNER|LEFT|RIGHT|FULL|CROSS)\s+)?JOIN\b|\s+WHERE\b|\s+GROUP\b|\s+ORDER\b|\s+LIMIT\b|$)/gis;

  let jm;
  while ((jm = joinRe.exec(sql)) !== null) {
    const type = (jm[1] || 'INNER').replace(/\s+/g, ' ').toUpperCase();
    joins.push({
      type: type === 'FULL OUTER' ? 'FULL OUTER JOIN' : `${type} JOIN`,
      table: jm[2].toLowerCase(),
      alias: (jm[3] || jm[2]).toLowerCase(),
      on: jm[4]?.trim() || null,
    });
  }

  return {mainTable, mainAlias, joins};
}

function matchJoinKeys(leftStruct, rightRow, rightAlias, onM) {
  const [, a1, c1, a2, c2] = onM;
  const leftAlias = a1 in leftStruct ? a1 : a2;
  const rightSide = leftAlias === a1 ? a2 : a1;
  const leftCol = leftAlias === a1 ? c1 : c2;
  const rightCol = leftAlias === a1 ? c2 : c1;
  const lv = leftStruct[leftAlias]?.[leftCol];
  const rv = rightSide === rightAlias ? rightRow[rightCol] : rightRow[rightCol];
  return lv === rv;
}

function executeJoinQuery(sql, db) {
  const {mainTable, mainAlias, joins} = parseFromAndJoins(sql);
  const mainData = getTableRows(db, mainTable);
  if (!mainData) {
    throw new Error(`Таблица "${mainTable}" не найдена. Доступны: ${Object.keys(TABLE_META).join(', ')}`);
  }

  let joined = mainData.map((row) => ({[mainAlias]: {...row}}));

  for (const j of joins) {
    const joinData = getTableRows(db, j.table);
    if (!joinData) {
      throw new Error(`Таблица "${j.table}" не найдена.`);
    }

    const next = [];

    if (j.type === 'CROSS JOIN') {
      for (const left of joined) {
        for (const jr of joinData) {
          next.push({...left, [j.alias]: {...jr}});
        }
      }
      joined = next;
      continue;
    }

    const onM = j.on?.match(/(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/i);
    if (!onM) {
      throw new Error('Условие JOIN: alias.column = alias.column');
    }

    if (j.type === 'INNER JOIN') {
      for (const left of joined) {
        for (const jr of joinData) {
          if (matchJoinKeys(left, jr, j.alias, onM)) {
            next.push({...left, [j.alias]: {...jr}});
          }
        }
      }
    } else if (j.type === 'LEFT JOIN') {
      for (const left of joined) {
        const hits = joinData.filter((jr) => matchJoinKeys(left, jr, j.alias, onM));
        if (hits.length === 0) {
          next.push({...left, [j.alias]: null});
        } else {
          for (const jr of hits) {
            next.push({...left, [j.alias]: {...jr}});
          }
        }
      }
    } else if (j.type === 'RIGHT JOIN') {
      for (const jr of joinData) {
        const hits = joined.filter((left) => matchJoinKeys(left, jr, j.alias, onM));
        if (hits.length === 0) {
          next.push({[mainAlias]: null, [j.alias]: {...jr}});
        } else {
          for (const left of hits) {
            next.push({...left, [j.alias]: {...jr}});
          }
        }
      }
    } else if (j.type === 'FULL OUTER JOIN') {
      const usedRight = new Set();
      for (const left of joined) {
        const hits = joinData.filter((jr) => matchJoinKeys(left, jr, j.alias, onM));
        if (hits.length === 0) {
          next.push({...left, [j.alias]: null});
        } else {
          for (const jr of hits) {
            usedRight.add(jr[j.table === j.alias ? 'id' : Object.keys(jr)[0]]);
            next.push({...left, [j.alias]: {...jr}});
          }
        }
      }
      for (const jr of joinData) {
        const hasLeft = joined.some((left) => matchJoinKeys(left, jr, j.alias, onM));
        if (!hasLeft) {
          next.push({[mainAlias]: null, [j.alias]: {...jr}});
        }
      }
    }

    joined = next;
  }

  const aliases = [mainAlias, ...joins.map((x) => x.alias)];
  let flatRows = joined.map((s) => flattenJoinRow(s, aliases));
  flatRows = applyWhere(flatRows, sql);

  const selectM = sql.match(/SELECT\s+(DISTINCT\s+)?(.+?)\s+FROM/is);
  const distinct = Boolean(selectM?.[1]);
  const selectItems = splitSelectList(selectM[2]).map(parseSelectItem);

  const groupCols = parseGroupBy(sql);
  let projected;
  if (groupCols) {
    let grouped = applyGroupBy(flatRows, groupCols, selectItems);
    grouped = filterHaving(grouped, sql, selectItems);
    projected = {columns: selectItems.map((i) => i.alias), rows: grouped};
  } else {
    projected = projectRows(flatRows, selectItems);
  }

  if (distinct) {
    const seen = new Set();
    projected.rows = projected.rows.filter((r) => {
      const k = JSON.stringify(r);
      if (seen.has(k)) {
        return false;
      }
      seen.add(k);
      return true;
    });
  }

  projected.rows = applyOrderBy(projected.rows, sql, projected.columns);
  projected.rows = applyLimit(projected.rows, sql);

  return {
    kind: 'select',
    ...projected,
    meta: {tables: [mainTable, ...joins.map((j) => j.table)]},
  };
}

function executeSimpleSelect(sql, db) {
  const fromM = sql.match(/FROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/i);
  if (!fromM) {
    throw new Error('Ожидается FROM table_name');
  }

  const table = fromM[1].toLowerCase();
  const data = getTableRows(db, table);
  if (!data) {
    throw new Error(`Таблица "${table}" не найдена. Доступны: ${Object.keys(TABLE_META).join(', ')}`);
  }

  let rows = data.map((r) => ({...r}));

  const selectM = sql.match(/SELECT\s+(DISTINCT\s+)?(.+?)\s+FROM/is);
  const distinct = Boolean(selectM?.[1]);
  const selectItems = splitSelectList(selectM[2]).map(parseSelectItem);

  const hasAgg = selectItems.some((i) => i.type === 'agg');
  const groupCols = parseGroupBy(sql);

  rows = applyWhere(rows, sql);

  let columns;
  if (groupCols || (hasAgg && !groupCols)) {
    if (hasAgg && !groupCols) {
      const out = {};
      for (const item of selectItems) {
        if (item.type === 'agg') {
          out[item.alias] = computeAgg(item.fn, item.col, rows);
        } else if (item.type === 'column') {
          out[item.alias] = rows[0]?.[item.column];
        }
      }
      rows = [out];
      columns = selectItems.map((i) => i.alias);
    } else {
      rows = applyGroupBy(rows, groupCols, selectItems);
      rows = filterHaving(rows, sql, selectItems);
      columns = selectItems.map((i) => i.alias);
    }
  } else {
    const projected = projectRows(rows, selectItems);
    rows = projected.rows;
    columns = projected.columns;
  }

  if (distinct) {
    const seen = new Set();
    rows = rows.filter((r) => {
      const k = JSON.stringify(r);
      if (seen.has(k)) {
        return false;
      }
      seen.add(k);
      return true;
    });
  }

  rows = applyOrderBy(rows, sql, columns);
  rows = applyLimit(rows, sql);

  return {kind: 'select', columns, rows, meta: {tables: [table]}};
}

function executeUnion(sql, db) {
  const parts = sql.split(/\bUNION\s+ALL\b/i);
  const useAll = parts.length > 1;
  const chunks = useAll ? parts : sql.split(/\bUNION\b/i);
  if (chunks.length < 2) {
    throw new Error('Некорректный UNION');
  }

  const results = chunks.map((part) => executeSelect(part.trim(), db));
  const columns = results[0].columns;
  let rows = [...results[0].rows];

  for (let i = 1; i < results.length; i += 1) {
    for (const row of results[i].rows) {
      if (useAll) {
        rows.push(row);
      } else {
        const k = JSON.stringify(row);
        if (!rows.some((r) => JSON.stringify(r) === k)) {
          rows.push(row);
        }
      }
    }
  }

  return {kind: 'select', columns, rows, meta: {union: true}};
}

export function executeSelect(sql, db) {
  const cleaned = stripSqlComments(sql);
  if (!cleaned.toUpperCase().startsWith('SELECT')) {
    throw new Error('Запрос должен начинаться с SELECT.');
  }

  if (/\bUNION\b/i.test(cleaned)) {
    return executeUnion(cleaned, db);
  }

  if (/\bJOIN\b/i.test(cleaned)) {
    return executeJoinQuery(cleaned, db);
  }

  return executeSimpleSelect(cleaned, db);
}

function executeInsert(sql, db) {
  const m = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/is);
  if (!m) {
    throw new Error('Синтаксис: INSERT INTO table (col1, col2) VALUES (val1, val2)');
  }

  const table = m[1].toLowerCase();
  const meta = TABLE_META[table];
  if (!meta) {
    throw new Error(`Таблица "${table}" недоступна.`);
  }

  const columns = m[2].split(',').map((c) => c.trim().toLowerCase());
  const values = parseValueList(m[3]);

  if (columns.length !== values.length) {
    throw new Error('Число столбцов и значений не совпадает.');
  }

  if (columns.includes(meta.pk)) {
    throw new Error(`Поле ${meta.pk} назначается автоматически.`);
  }

  const row = {};
  for (let i = 0; i < columns.length; i += 1) {
    const col = columns[i];
    let val = parseSqlLiteral(values[i]);
    if (val === 'null' || val === 'NULL') {
      val = null;
    }
    if (table === 'users') {
      validateUserField(col, val);
    }
    row[col] = val;
  }

  row[meta.pk] = nextId(db, table);
  db[table].push(row);

  return {
    kind: 'insert',
    rowsAffected: 1,
    message: `Добавлена 1 строка в "${table}".`,
    db,
  };
}

function parseValueList(raw) {
  const values = [];
  let current = '';
  let inQuotes = false;
  let q = '';
  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if ((ch === "'" || ch === '"') && raw[i - 1] !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        q = ch;
        current += ch;
      } else if (ch === q) {
        inQuotes = false;
        current += ch;
      } else {
        current += ch;
      }
    } else if (ch === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    values.push(current.trim());
  }
  return values;
}

function executeUpdate(sql, db) {
  const m = sql.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+))?$/is);
  if (!m) {
    throw new Error('Синтаксис: UPDATE table SET col = val [, ...] [WHERE ...]');
  }

  const table = m[1].toLowerCase();
  const data = getTableRows(db, table);
  if (!data) {
    throw new Error(`Таблица "${table}" не найдена.`);
  }

  const updates = parseSetClause(m[2]);
  const whereGroups = m[3] ? parseWhereClause(m[3]) : [];

  let count = 0;
  for (const row of data) {
    if (matchesConditions(row, whereGroups)) {
      for (const [col, val] of Object.entries(updates)) {
        if (table === 'users') {
          validateUserField(col, val);
        }
        row[col] = val;
      }
      count += 1;
    }
  }

  return {
    kind: 'update',
    rowsAffected: count,
    message: `Обновлено строк: ${count}.`,
    db,
  };
}

function executeDelete(sql, db) {
  const m = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?$/is);
  if (!m) {
    throw new Error('Синтаксис: DELETE FROM table [WHERE ...]');
  }

  const table = m[1].toLowerCase();
  const data = getTableRows(db, table);
  if (!data) {
    throw new Error(`Таблица "${table}" не найдена.`);
  }

  const whereGroups = m[2] ? parseWhereClause(m[2]) : [];
  const before = data.length;
  db[table] = data.filter((row) => !matchesConditions(row, whereGroups));
  const count = before - db[table].length;

  return {
    kind: 'delete',
    rowsAffected: count,
    message: `Удалено строк: ${count}.`,
    db,
  };
}

/** Выполняет один SQL-запрос, возвращает результат и (при мутации) новое состояние БД */
export function executeSql(sql, db) {
  const cleaned = stripSqlComments(sql);
  if (!cleaned) {
    throw new Error('Пустой запрос.');
  }

  const head = cleaned.split(/\s+/)[0].toUpperCase();

  if (head === 'SELECT') {
    return executeSelect(cleaned, db);
  }
  if (head === 'INSERT') {
    return executeInsert(cleaned, cloneDb(db));
  }
  if (head === 'UPDATE') {
    return executeUpdate(cleaned, cloneDb(db));
  }
  if (head === 'DELETE') {
    return executeDelete(cleaned, cloneDb(db));
  }

  throw new Error('Поддерживаются: SELECT, INSERT, UPDATE, DELETE.');
}

/** Обратная совместимость для users-only SELECT */
export function executeSelectLegacy(sql) {
  const db = createShopDatabase();
  const r = executeSelect(sql, db);
  if (r.meta?.tables?.[0] === 'users') {
    return {columns: r.columns, rows: r.rows};
  }
  throw new Error('Для этого запроса используйте полный SQL-тренажёр (таблицы shop_data).');
}
