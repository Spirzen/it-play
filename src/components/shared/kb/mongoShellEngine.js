const DB = {
  company_db: {
    employees: [
      {first_name: 'Ivan', last_name: 'Ivanov', email: 'ivanov@example.com', salary: 75000},
      {first_name: 'Maria', last_name: 'Petrova', email: 'petrova@example.com', salary: 82000},
    ],
  },
};

let currentDb = 'company_db';

function parseJsonArg(s) {
  try {
    return JSON.parse(s.replace(/'/g, '"'));
  } catch {
    return null;
  }
}

export function executeMongoCommand(line) {
  const trimmed = line.trim();
  if (!trimmed) return {lines: [], state: {db: currentDb}};

  if (trimmed.startsWith('use ')) {
    const name = trimmed.slice(4).replace(/;/g, '').trim();
    currentDb = name;
    return {
      lines: [{type: 'success', text: `switched to db ${name}`}],
      state: {db: currentDb},
    };
  }

  const collMatch = trimmed.match(/^db\.(\w+)\.(\w+)\((.*)\)\s*;?$/s);
  if (!collMatch) {
    return {
      lines: [{type: 'error', text: 'Неизвестная команда. Попробуйте: help'}],
      state: {db: currentDb},
    };
  }

  const [, coll, method, argsRaw] = collMatch;
  const db = DB[currentDb] ?? (DB[currentDb] = {});
  if (!db[coll]) db[coll] = [];

  if (method === 'insertOne') {
    const doc = parseJsonArg(argsRaw);
    if (!doc) return {lines: [{type: 'error', text: 'Неверный JSON документа'}], state: {db: currentDb}};
    db[coll].push(doc);
    return {
      lines: [{type: 'success', text: `{ acknowledged: true, insertedId: ObjectId("…") }`}],
      state: {db: currentDb},
    };
  }

  if (method === 'find') {
    const rows = db[coll];
    const preview = rows.length
      ? rows.map((r) => JSON.stringify(r)).join('\n')
      : '(пустая коллекция)';
    return {
      lines: [{type: 'output', text: preview}],
      state: {db: currentDb},
    };
  }

  if (method === 'countDocuments') {
    return {
      lines: [{type: 'output', text: String(db[coll].length)}],
      state: {db: currentDb},
    };
  }

  if (method === 'updateOne') {
    const parts = argsRaw.split(/,\s*(?=\{)/);
    const filter = parseJsonArg(parts[0] ?? '');
    const update = parseJsonArg(parts[1] ?? '');
    if (!filter || !update) {
      return {lines: [{type: 'error', text: 'updateOne: нужны filter и update (JSON)'}], state: {db: currentDb}};
    }
    const rows = db[coll];
    const idx = rows.findIndex((row) =>
      Object.entries(filter).every(([k, v]) => row[k] === v),
    );
    if (idx === -1) {
      return {
        lines: [{type: 'success', text: '{ acknowledged: true, matchedCount: 0, modifiedCount: 0 }'}],
        state: {db: currentDb},
      };
    }
    const setFields = update.$set ?? update;
    Object.assign(rows[idx], setFields);
    return {
      lines: [{type: 'success', text: '{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }'}],
      state: {db: currentDb},
    };
  }

  return {
    lines: [{type: 'error', text: `Метод ${method} не поддерживается в тренажёре`}],
    state: {db: currentDb},
  };
}

export const MONGO_HELP = `Команды тренажёра (упрощённая модель, не полный mongosh):
  use company_db
  db.employees.insertOne({ first_name: "Ivan", last_name: "Ivanov" })
  db.employees.find()
  db.employees.updateOne({ first_name: "Ivan" }, { $set: { salary: 80000 } })
  db.employees.countDocuments()
  help · clear`;

export function getMongoWelcome() {
  return [
    {type: 'banner', text: 'mongosh · Universe IT'},
    {type: 'muted', text: 'Порт 27017 · введите help'},
  ];
}
