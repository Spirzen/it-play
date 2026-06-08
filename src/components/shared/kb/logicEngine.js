/** Булева логика: разбор выражений и таблицы истинности для демо */

export const LOGIC_VARIABLES = ['A', 'B', 'C'];

export const LOGIC_PRESETS = [
  {
    id: 'and',
    label: 'A ∧ B (конъюнкция)',
    expr: 'A AND B',
    code: 'a && b',
    note: 'Истина только когда оба операнда истинны — основа составных условий в коде.',
  },
  {
    id: 'or',
    label: 'A ∨ B (дизъюнкция)',
    expr: 'A OR B',
    code: 'a || b',
    note: 'Ложь только когда оба операнда ложны. В языках — short-circuit: второй операнд может не вычисляться.',
  },
  {
    id: 'xor',
    label: 'A ⊕ B (исключающее ИЛИ)',
    expr: 'A XOR B',
    code: 'a ^ b  // побитово в C#; логического XOR нет в JS',
    note: 'Истина, когда ровно один операнд истинен — проверка чётности, переключатели флагов.',
  },
  {
    id: 'demorgan-and',
    label: '¬(A ∧ B) ≡ ¬A ∨ ¬B',
    expr: 'NOT (A AND B)',
    equivalent: 'NOT A OR NOT B',
    code: '!(a && b)  →  !a || !b',
    note: 'Закон де Моргана: отрицание конъюнкции превращается в дизъюнкцию отрицаний.',
  },
  {
    id: 'demorgan-or',
    label: '¬(A ∨ B) ≡ ¬A ∧ ¬B',
    expr: 'NOT (A OR B)',
    equivalent: 'NOT A AND NOT B',
    code: '!(a || b)  →  !a && !b',
    note: 'Частый рефакторинг: "не (заблокирован или неактивен)" → "не заблокирован и активен".',
  },
  {
    id: 'absorption',
    label: 'A ∨ (A ∧ B) ≡ A',
    expr: 'A OR (A AND B)',
    equivalent: 'A',
    code: 'a || (a && b)  →  a',
    note: 'Закон поглощения: лишнее слагаемое не меняет результат — упрощайте условия.',
  },
  {
    id: 'distribute',
    label: '(A ∧ B) ∨ (A ∧ C) ≡ A ∧ (B ∨ C)',
    expr: '(A AND B) OR (A AND C)',
    equivalent: 'A AND (B OR C)',
    code: '(a && b) || (a && c)  →  a && (b || c)',
    note: 'Вынесение общего множителя сокращает число проверок в ветвлениях.',
  },
];

const OP_PRECEDENCE = {NOT: 4, AND: 3, XOR: 2, OR: 1};

function tokenize(input) {
  const s = input
    .replace(/∧/g, ' AND ')
    .replace(/∨/g, ' OR ')
    .replace(/⊕/g, ' XOR ')
    .replace(/¬/g, ' NOT ')
    .replace(/&&/g, ' AND ')
    .replace(/\|\|/g, ' OR ')
    .replace(/\^/g, ' XOR ')
    .replace(/!/g, ' NOT ')
    .toUpperCase();
  const re =
    /\s+|\bNOT\b|\bAND\b|\bOR\b|\bXOR\b|([ABC])|(\()|(\))/gi;
  const tokens = [];
  let m;
  while ((m = re.exec(s)) !== null) {
    if (m[1]) tokens.push({type: 'var', name: m[1].toUpperCase()});
    else if (m[2]) tokens.push({type: 'lparen'});
    else if (m[3]) tokens.push({type: 'rparen'});
    else if (m[0].toUpperCase() === 'NOT') tokens.push({type: 'op', op: 'NOT', unary: true});
    else if (m[0].toUpperCase() === 'AND') tokens.push({type: 'op', op: 'AND'});
    else if (m[0].toUpperCase() === 'OR') tokens.push({type: 'op', op: 'OR'});
    else if (m[0].toUpperCase() === 'XOR') tokens.push({type: 'op', op: 'XOR'});
  }
  return tokens;
}

function parseExpr(tokens) {
  let pos = 0;

  function peek() {
    return tokens[pos];
  }
  function consume() {
    return tokens[pos++];
  }

  function parsePrimary() {
    const t = peek();
    if (!t) throw new Error('Ожидалось выражение');
    if (t.type === 'var') {
      consume();
      return {type: 'var', name: t.name};
    }
    if (t.type === 'lparen') {
      consume();
      const inner = parseOr();
      if (peek()?.type !== 'rparen') throw new Error('Ожидалась )');
      consume();
      return inner;
    }
    if (t.type === 'op' && t.op === 'NOT') {
      consume();
      return {type: 'not', arg: parsePrimary()};
    }
    throw new Error(`Неожиданный токен: ${t.op ?? t.type}`);
  }

  function parseBinary(level, parseChild, ops) {
    let left = parseChild();
    while (peek()?.type === 'op' && ops.includes(peek().op)) {
      const op = consume().op;
      const right = parseChild();
      left = {type: 'bin', op, left, right};
    }
    return left;
  }

  const parseAnd = () => parseBinary('and', parsePrimary, ['AND']);
  const parseXor = () => parseBinary('xor', parseAnd, ['XOR']);
  const parseOr = () => parseBinary('or', parseXor, ['OR']);

  const ast = parseOr();
  if (pos < tokens.length) throw new Error('Лишние символы в выражении');
  return ast;
}

function evalAst(ast, env) {
  switch (ast.type) {
    case 'var':
      return Boolean(env[ast.name]);
    case 'not':
      return !evalAst(ast.arg, env);
    case 'bin':
      if (ast.op === 'AND') return evalAst(ast.left, env) && evalAst(ast.right, env);
      if (ast.op === 'OR') return evalAst(ast.left, env) || evalAst(ast.right, env);
      if (ast.op === 'XOR') return evalAst(ast.left, env) !== evalAst(ast.right, env);
      throw new Error(`Неизвестная операция: ${ast.op}`);
    default:
      throw new Error('Пустое выражение');
  }
}

export function collectVariables(ast, set = new Set()) {
  if (!ast) return set;
  if (ast.type === 'var') set.add(ast.name);
  if (ast.type === 'not') collectVariables(ast.arg, set);
  if (ast.type === 'bin') {
    collectVariables(ast.left, set);
    collectVariables(ast.right, set);
  }
  return set;
}

export function parseLogicExpression(expr) {
  const tokens = tokenize(expr.trim());
  if (!tokens.length) throw new Error('Введите выражение');
  const ast = parseExpr(tokens);
  return ast;
}

export function evaluateLogic(expr, env) {
  const ast = parseLogicExpression(expr);
  return evalAst(ast, env);
}

export function buildTruthTable(expr) {
  const ast = parseLogicExpression(expr);
  const vars = [...collectVariables(ast)].sort();
  const rows = [];
  const n = vars.length;
  const total = 2 ** n;
  for (let i = 0; i < total; i++) {
    const env = {};
    vars.forEach((v, idx) => {
      env[v] = Boolean((i >> (n - 1 - idx)) & 1);
    });
    rows.push({
      env,
      result: evalAst(ast, env),
    });
  }
  return {vars, rows, ast};
}

export function formatBool(v) {
  return v ? 'истина' : 'ложь';
}

export function rowsEquivalent(rowsA, rowsB) {
  if (rowsA.length !== rowsB.length) return false;
  return rowsA.every((r, i) => r.result === rowsB[i].result);
}
