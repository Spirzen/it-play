/** Общие данные и парсеры для SQL-тренажёров */

export const INITIAL_USERS = [
  { id: 1, name: 'Иван', age: 25, city: 'Москва', salary: 50000 },
  { id: 2, name: 'Мария', age: 30, city: 'Санкт-Петербург', salary: 65000 },
  { id: 3, name: 'Алексей', age: 22, city: 'Екатеринбург', salary: 45000 },
  { id: 4, name: 'Елена', age: 28, city: 'Москва', salary: 55000 },
  { id: 5, name: 'Дмитрий', age: 35, city: 'Новосибирск', salary: 70000 },
  { id: 6, name: 'Ольга', age: 27, city: null, salary: 48000 },
];

export const USER_COLUMNS = ['id', 'name', 'age', 'city', 'salary'];
export const USER_EDITABLE_COLUMNS = ['name', 'age', 'city', 'salary'];

export const JOIN_USERS = [
  { id: 1, name: 'Иван', age: 25, city_id: 1, salary: 50000 },
  { id: 2, name: 'Мария', age: 30, city_id: 2, salary: 65000 },
  { id: 3, name: 'Алексей', age: 22, city_id: 1, salary: 45000 },
  { id: 4, name: 'Елена', age: 28, city_id: 3, salary: 55000 },
  { id: 5, name: 'Дмитрий', age: 35, city_id: 2, salary: 70000 },
  { id: 6, name: 'Ольга', age: 27, city_id: null, salary: 48000 },
  { id: 7, name: 'Павел', age: 29, city_id: 4, salary: 52000 },
];

export const JOIN_CITIES = [
  { id: 1, name: 'Москва', population: 12500000, region: 'Центральный' },
  { id: 2, name: 'Санкт-Петербург', population: 5400000, region: 'Северо-Западный' },
  { id: 3, name: 'Екатеринбург', population: 1500000, region: 'Уральский' },
  { id: 4, name: 'Новосибирск', population: 1600000, region: 'Сибирский' },
  { id: 5, name: 'Казань', population: 1250000, region: 'Приволжский' },
];

export const JOIN_ORDERS = [
  { id: 1, user_id: 1, product: 'Ноутбук', amount: 50000, date: '2024-01-15' },
  { id: 2, user_id: 1, product: 'Мышь', amount: 1500, date: '2024-01-20' },
  { id: 3, user_id: 2, product: 'Телефон', amount: 30000, date: '2024-02-10' },
  { id: 4, user_id: 3, product: 'Клавиатура', amount: 3000, date: '2024-02-15' },
  { id: 5, user_id: 5, product: 'Монитор', amount: 20000, date: '2024-03-01' },
  { id: 6, user_id: 6, product: 'Наушники', amount: 5000, date: '2024-03-05' },
  { id: 7, user_id: 7, product: 'Планшет', amount: 25000, date: '2024-03-10' },
];

export function parseSqlLiteral(valueRaw) {
  let parsedValue = valueRaw.trim();

  if (
    (parsedValue.startsWith("'") && parsedValue.endsWith("'")) ||
    (parsedValue.startsWith('"') && parsedValue.endsWith('"'))
  ) {
    parsedValue = parsedValue.slice(1, -1);
  }

  if (!Number.isNaN(Number(parsedValue)) && parsedValue !== '') {
    const num = Number(parsedValue);
    if (!Number.isNaN(num)) {
      return num;
    }
  }

  return parsedValue;
}

function parseSingleCondition(trimmed) {
  if (!trimmed) {
    return null;
  }

  const isNotNull = trimmed.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
  if (isNotNull) {
    return { type: 'is_not_null', column: isNotNull[1].toLowerCase() };
  }

  const isNull = trimmed.match(/^(\w+)\s+IS\s+NULL$/i);
  if (isNull) {
    return { type: 'is_null', column: isNull[1].toLowerCase() };
  }

  const betweenMatch = trimmed.match(/^(\w+)\s+BETWEEN\s+(.+?)\s+AND\s+(.+)$/i);
  if (betweenMatch) {
    return {
      type: 'between',
      column: betweenMatch[1].toLowerCase(),
      low: parseSqlLiteral(betweenMatch[2]),
      high: parseSqlLiteral(betweenMatch[3]),
    };
  }

  const inMatch = trimmed.match(/^(\w+)\s+IN\s*\(([^)]+)\)$/i);
  if (inMatch) {
    const values = inMatch[2].split(',').map((v) => parseSqlLiteral(v.trim()));
    return { type: 'in', column: inMatch[1].toLowerCase(), values };
  }

  const match = trimmed.match(/^(\w+)\s*(>=|<=|=|>|<|LIKE)\s*(.+)$/i);
  if (match) {
    const [, column, operator, valueRaw] = match;
    return {
      type: 'compare',
      column: column.toLowerCase(),
      operator: operator.toUpperCase(),
      value: parseSqlLiteral(valueRaw),
    };
  }

  return null;
}

/** WHERE разбирается на OR-группы; внутри группы — AND условий */
export function parseWhereClause(clause) {
  if (!clause || clause.trim() === '') {
    return [];
  }

  const orGroups = clause.split(/\s+OR\s+/i);
  return orGroups
    .map((group) => {
      const andParts = group.split(/\s+AND\s+/i);
      return andParts.map((p) => parseSingleCondition(p.trim())).filter(Boolean);
    })
    .filter((g) => g.length > 0);
}

function matchesSingleCondition(row, cond) {
  const rowValue = row[cond.column];

  if (cond.type === 'is_null') {
    return rowValue === null || rowValue === undefined;
  }
  if (cond.type === 'is_not_null') {
    return rowValue !== null && rowValue !== undefined;
  }
  if (cond.type === 'between') {
    return rowValue >= cond.low && rowValue <= cond.high;
  }
  if (cond.type === 'in') {
    return cond.values.includes(rowValue);
  }

  const targetValue = cond.value;
  if (cond.operator === '=') {
    return rowValue === targetValue;
  }
  if (cond.operator === '>') {
    return rowValue > targetValue;
  }
  if (cond.operator === '<') {
    return rowValue < targetValue;
  }
  if (cond.operator === '>=') {
    return rowValue >= targetValue;
  }
  if (cond.operator === '<=') {
    return rowValue <= targetValue;
  }
  if (cond.operator === 'LIKE') {
    const pattern = String(targetValue).replace(/\*/g, '.*').replace(/%/g, '.*');
    return new RegExp(pattern, 'i').test(String(rowValue ?? ''));
  }
  return true;
}

export function matchesConditions(row, orGroups) {
  if (!orGroups || orGroups.length === 0) {
    return true;
  }

  return orGroups.some((andGroup) =>
    andGroup.every((cond) => matchesSingleCondition(row, cond)),
  );
}

export function parseSetClause(setClause) {
  const updates = {};
  const parts = setClause.split(/\s*,\s*/);

  for (const part of parts) {
    const match = part.match(/^(\w+)\s*=\s*(.+)$/i);
    if (!match) {
      throw new Error(`Неверный синтаксис в SET: ${part}`);
    }

    const [, column, valueRaw] = match;
    updates[column.toLowerCase()] = parseSqlLiteral(valueRaw);
  }

  return updates;
}

export function validateUserField(col, value) {
  if (col === 'name' && typeof value === 'string' && value.length < 2) {
    throw new Error('Имя должно содержать минимум 2 символа');
  }
  if (col === 'age' && (typeof value !== 'number' || value < 0 || value > 150)) {
    throw new Error('Возраст должен быть числом от 0 до 150');
  }
  if (col === 'salary' && (typeof value !== 'number' || value < 0)) {
    throw new Error('Зарплата должна быть положительным числом');
  }
}

export function executeSelect(sql, data = INITIAL_USERS) {
  if (typeof sql !== 'string') {
    throw new Error('Ожидается текст SQL-запроса.');
  }
  const originalSql = sql.trim();
  const sqlUpper = originalSql.toUpperCase();

  if (!sqlUpper.startsWith('SELECT')) {
    throw new Error('Запрос должен начинаться с команды SELECT.');
  }

  let rows = [...data];
  const columns = USER_COLUMNS;

  if (sqlUpper.includes('WHERE')) {
    const whereMatch = originalSql.match(/WHERE\s+(.+?)(?:\s+ORDER\s+BY|\s+GROUP\s+BY|$)/i);
    if (whereMatch) {
      const conditions = parseWhereClause(whereMatch[1]);
      rows = rows.filter((row) => matchesConditions(row, conditions));
    }
  }

  if (sqlUpper.includes('ORDER BY')) {
    const orderByMatch = originalSql.match(/ORDER\s+BY\s+(.+?)(?:\s+GROUP\s+BY|$)/i);
    if (orderByMatch) {
      const orderParts = orderByMatch[1].trim().split(/\s+/);
      const orderCol = orderParts[0].toLowerCase();
      const orderDir = orderParts[1] && orderParts[1].toUpperCase() === 'DESC' ? -1 : 1;

      if (columns.includes(orderCol)) {
        rows.sort((a, b) => {
          const valA = a[orderCol];
          const valB = b[orderCol];
          if (typeof valA === 'string') {
            return orderDir * valA.localeCompare(valB);
          }
          return orderDir * (valA - valB);
        });
      }
    }
  }

  let selectedColumns = columns;

  if (!sqlUpper.includes('SELECT *')) {
    const selectMatch = originalSql.match(/SELECT\s+(.+?)\s+FROM/i);
    if (selectMatch) {
      const colsArray = selectMatch[1].split(',').map((c) => c.trim().toLowerCase());
      selectedColumns = colsArray.filter((c) => columns.includes(c));
      if (selectedColumns.length === 0) {
        selectedColumns = columns;
      }
    }
  }

  const resultRows = rows.map((row) => {
    const newRow = {};
    selectedColumns.forEach((col) => {
      newRow[col] = row[col];
    });
    return newRow;
  });

  return { columns: selectedColumns, rows: resultRows };
}

const clone = (data) => JSON.parse(JSON.stringify(data));

const JOIN_TABLES = {
  users: () => clone(JOIN_USERS),
  cities: () => clone(JOIN_CITIES),
  orders: () => clone(JOIN_ORDERS),
};

export function executeJoin(sql) {
  if (typeof sql !== 'string') {
    throw new Error('Ожидается текст SQL-запроса.');
  }
  const trimmed = sql.trim();

  if (!trimmed.toUpperCase().startsWith('SELECT')) {
    throw new Error('Запрос должен начинаться с SELECT.');
  }

  const joinTypes = ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'];
  let joinType = null;

  for (const type of joinTypes) {
    if (trimmed.toUpperCase().includes(type)) {
      joinType = type;
      break;
    }
  }

  if (!joinType) {
    throw new Error(
      'Поддерживаются JOIN: INNER, LEFT, RIGHT, FULL OUTER, CROSS. Пример: FROM users u INNER JOIN cities c ON u.city_id = c.id',
    );
  }

  const fromMatch = trimmed.match(/FROM\s+(\w+)\s+(\w+)/i);
  if (!fromMatch) {
    throw new Error('Используйте формат: FROM table alias');
  }

  const mainTable = fromMatch[1].toLowerCase();
  const mainAlias = fromMatch[2];

  let joinTable = null;
  let joinAlias = null;
  let joinCondition = null;

  if (joinType === 'CROSS JOIN') {
    const crossMatch = trimmed.match(/CROSS\s+JOIN\s+(\w+)\s+(\w+)/i);
    if (crossMatch) {
      joinTable = crossMatch[1].toLowerCase();
      joinAlias = crossMatch[2];
    }
  } else {
    const joinRegex = new RegExp(`${joinType}\\s+(\\w+)\\s+(\\w+)\\s+ON\\s+(.+)`, 'i');
    const joinMatch = trimmed.match(joinRegex);
    if (joinMatch) {
      joinTable = joinMatch[1].toLowerCase();
      joinAlias = joinMatch[2];
      joinCondition = joinMatch[3];
    }
  }

  if (!joinTable) {
    throw new Error('Не удалось разобрать JOIN-часть запроса');
  }

  const mainData = JOIN_TABLES[mainTable]?.();
  const joinData = JOIN_TABLES[joinTable]?.();

  if (!mainData || !joinData) {
    throw new Error('Доступные таблицы: users, cities, orders');
  }

  let joinedData = [];

  if (joinType === 'CROSS JOIN') {
    for (const mainRow of mainData) {
      for (const joinRow of joinData) {
        joinedData.push({
          [mainAlias]: {...mainRow},
          [joinAlias]: {...joinRow},
        });
      }
    }
  } else {
    const conditionMatch = joinCondition.match(/(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/);
    if (!conditionMatch) {
      throw new Error('Условие JOIN: alias.column = alias.column');
    }

    const leftAlias = conditionMatch[1];
    const leftColumn = conditionMatch[2];
    const rightAlias = conditionMatch[3];
    const rightColumn = conditionMatch[4];
    const isMainLeft = leftAlias === mainAlias;
    const mainKey = isMainLeft ? leftColumn : rightColumn;
    const joinKey = isMainLeft ? rightColumn : leftColumn;

    if (joinType === 'INNER JOIN') {
      joinedData = mainData
        .filter((mainRow) => joinData.some((joinRow) => mainRow[mainKey] === joinRow[joinKey]))
        .map((mainRow) => {
          const matchedJoin = joinData.find((joinRow) => mainRow[mainKey] === joinRow[joinKey]);
          return {[mainAlias]: {...mainRow}, [joinAlias]: {...matchedJoin}};
        });
    } else if (joinType === 'LEFT JOIN') {
      joinedData = mainData.map((mainRow) => {
        const matchedJoin = joinData.find((joinRow) => mainRow[mainKey] === joinRow[joinKey]);
        return {
          [mainAlias]: {...mainRow},
          [joinAlias]: matchedJoin ? {...matchedJoin} : null,
        };
      });
    } else if (joinType === 'RIGHT JOIN') {
      joinedData = joinData.map((joinRow) => {
        const matchedMain = mainData.find((mainRow) => mainRow[mainKey] === joinRow[joinKey]);
        return {
          [mainAlias]: matchedMain ? {...matchedMain} : null,
          [joinAlias]: {...joinRow},
        };
      });
    } else if (joinType === 'FULL OUTER JOIN') {
      const leftJoin = mainData.map((mainRow) => {
        const matchedJoin = joinData.find((joinRow) => mainRow[mainKey] === joinRow[joinKey]);
        return {
          [mainAlias]: {...mainRow},
          [joinAlias]: matchedJoin ? {...matchedJoin} : null,
        };
      });
      const rightJoin = joinData
        .filter((joinRow) => !mainData.some((mainRow) => mainRow[mainKey] === joinRow[joinKey]))
        .map((joinRow) => ({
          [mainAlias]: null,
          [joinAlias]: {...joinRow},
        }));
      joinedData = [...leftJoin, ...rightJoin];
    }
  }

  const selectMatch = trimmed.match(/SELECT\s+(.+?)\s+FROM/i);
  if (!selectMatch) {
    throw new Error('Не удалось разобрать SELECT');
  }

  const selectRaw = selectMatch[1];
  const selectItems = [];
  let current = '';
  let parenCount = 0;

  for (let i = 0; i < selectRaw.length; i += 1) {
    const char = selectRaw[i];
    if (char === '(') {
      parenCount += 1;
    }
    if (char === ')') {
      parenCount -= 1;
    }
    if (char === ',' && parenCount === 0) {
      selectItems.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current) {
    selectItems.push(current.trim());
  }

  const finalResult = joinedData.map((row) => {
    const newRow = {};
    for (const item of selectItems) {
      if (item === '*') {
        for (const alias of Object.keys(row)) {
          if (row[alias]) {
            for (const [col, val] of Object.entries(row[alias])) {
              newRow[`${alias}.${col}`] = val;
            }
          }
        }
      } else {
        let expression = item;
        let alias = null;
        const asMatch = item.match(/(.+)\s+AS\s+(\w+)$/i);
        if (asMatch) {
          expression = asMatch[1].trim();
          alias = asMatch[2];
        }

        let value = null;
        if (expression.includes('.')) {
          const [tableAlias, column] = expression.split('.');
          if (row[tableAlias]) {
            value = row[tableAlias][column];
          }
        } else {
          for (const tableAlias of Object.keys(row)) {
            if (row[tableAlias] && expression in row[tableAlias]) {
              value = row[tableAlias][expression];
              break;
            }
          }
        }

        newRow[alias || expression] = value !== undefined ? value : null;
      }
    }
    return newRow;
  });

  return {
    columns: finalResult.length > 0 ? Object.keys(finalResult[0]) : [],
    rows: finalResult,
    meta: {type: joinType, mainTable, joinTable, mainAlias, joinAlias},
  };
}
