export const DEFAULT_CODE = `let name = "Мир"
let greeting = "Привет, " + name
console.log(greeting)`;

export const EXAMPLE_CODES = {
  simple: `let x = 10
let y = 20
let z = x + y
console.log(z)`,
  strings: `let name = "Мир"
let greeting = "Привет, " + name
console.log(greeting)`,
  calc: `let a = 5
let b = 3
let sum = a + b
let product = a * b
console.log("Сумма: " + sum)
console.log("Произведение: " + product)`,
  error: `let a = 1
let b = 2
console.log(a + b)
console.log(c)`,
};

const LOG_PREFIX = 'console.log(';
const KEYWORDS = new Set(['let', 'const', 'var', 'console', 'log', 'true', 'false', 'null', 'undefined']);

export const COMPILE_PHASES = [
  { id: 'lex', label: 'Лексический анализ', icon: '🔤' },
  { id: 'parse', label: 'Синтаксический анализ', icon: '🌳' },
  { id: 'semantic', label: 'Семантика', icon: '✓' },
  { id: 'codegen', label: 'Генерация кода', icon: '⚙️' },
  { id: 'link', label: 'Линковка', icon: '🔗' },
];

export function cleanLine(line) {
  let clean = line.split('//')[0];
  clean = clean.replace(/;+$/, '');
  return clean.trim();
}

export function stripStringLiterals(code) {
  return code.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
}

export function extractIdentifiers(code) {
  const stripped = stripStringLiterals(code);
  const matches = stripped.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
  return matches ? matches.filter((id) => !KEYWORDS.has(id)) : [];
}

export function isDeclaration(line) {
  return line.startsWith('let ') || line.startsWith('const ') || line.startsWith('var ');
}

export function isLogStatement(line) {
  return line.startsWith(LOG_PREFIX) && line.endsWith(')');
}

export function getLogExpression(line) {
  if (!isLogStatement(line)) return null;
  return line.slice(LOG_PREFIX.length, -1).trim();
}

export function getVariableName(line) {
  const match = line.match(/^(let|const|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
  return match ? match[2] : null;
}

function getDeclarationExpression(line) {
  const equalIndex = line.indexOf('=');
  if (equalIndex === -1) return null;
  return line.slice(equalIndex + 1).trim();
}

function isStringLiteral(part) {
  return (part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"));
}

function isStringConcatExpression(expr, vars) {
  if (!expr.includes('+')) return false;

  const parts = expr.split('+').map((p) => p.trim());
  return parts.some((part) => {
    if (isStringLiteral(part)) return true;
    if (Object.prototype.hasOwnProperty.call(vars, part) && typeof vars[part] === 'string') return true;
    return false;
  });
}

function concatParts(expr, vars) {
  const parts = expr.split('+').map((p) => p.trim());
  return parts
    .map((part) => {
      if (isStringLiteral(part)) return part.slice(1, -1);
      if (!Number.isNaN(Number(part))) return String(Number(part));
      if (Object.prototype.hasOwnProperty.call(vars, part)) return String(vars[part]);
      throw new Error(`Переменная '${part}' не определена`);
    })
    .join('');
}

export function evaluateExpression(expr, vars) {
  expr = expr.trim();

  if (isStringLiteral(expr)) {
    return expr.slice(1, -1);
  }

  if (isStringConcatExpression(expr, vars)) {
    return concatParts(expr, vars);
  }

  if (!Number.isNaN(Number(expr))) {
    return Number(expr);
  }

  if (Object.prototype.hasOwnProperty.call(vars, expr)) {
    return vars[expr];
  }

  try {
    let evaluableExpr = expr;
    for (const [name, value] of Object.entries(vars)) {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      const repl = typeof value === 'string' ? `"${value}"` : String(value);
      evaluableExpr = evaluableExpr.replace(regex, repl);
    }

    const varMatches = evaluableExpr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
    if (varMatches) {
      for (const v of varMatches) {
        if (!Number.isNaN(Number(v))) continue;
        if (
          !Object.prototype.hasOwnProperty.call(vars, v) &&
          !['true', 'false', 'null', 'undefined'].includes(v)
        ) {
          throw new Error(`Переменная '${v}' не определена`);
        }
      }
    }

    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${evaluableExpr})`)();
  } catch (err) {
    if (err.message.includes('is not defined')) {
      throw new Error('Переменная не определена');
    }
    throw new Error(`Ошибка в выражении: ${err.message}`);
  }
}

export async function interpretProgram(lines, { delayMs = 300, onProgress } = {}) {
  const vars = {};
  const outputLines = [];
  const logs = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = cleanLine(rawLine);

    if (!line) continue;

    const short = line.length > 60 ? `${line.substring(0, 60)}…` : line;
    logs.push({ type: 'info', text: `Строка ${i + 1}: ${short}` });
    onProgress?.({ lineIndex: i, vars: { ...vars }, output: [...outputLines], logs: [...logs] });
    await new Promise((r) => setTimeout(r, delayMs));

    try {
      if (isDeclaration(line)) {
        const varName = getVariableName(line);
        if (!varName) throw new Error('Некорректное объявление переменной');

        const expr = getDeclarationExpression(line);
        const value = expr === null ? undefined : evaluateExpression(expr, vars);
        vars[varName] = value;
        logs.push({
          type: 'success',
          text: `${varName} = ${value === undefined ? 'undefined' : typeof value === 'string' ? `"${value}"` : value}`,
        });
      } else if (line.includes('=') && !isLogStatement(line)) {
        const equalIndex = line.indexOf('=');
        const varName = line.slice(0, equalIndex).trim();
        const valueExpr = line.slice(equalIndex + 1).trim();

        if (!Object.prototype.hasOwnProperty.call(vars, varName)) {
          throw new Error(`Переменная '${varName}' не объявлена. Используйте let ${varName} = …`);
        }

        const value = evaluateExpression(valueExpr, vars);
        vars[varName] = value;
        logs.push({
          type: 'success',
          text: `${varName} = ${typeof value === 'string' ? `"${value}"` : value}`,
        });
      } else if (isLogStatement(line)) {
        const expr = getLogExpression(line);
        if (!expr) throw new Error('Синтаксис: console.log(выражение)');

        const value = evaluateExpression(expr, vars);
        outputLines.push(String(value));
        logs.push({ type: 'output', text: `→ ${value}` });
      } else if (line.startsWith('console')) {
        throw new Error('Синтаксис: console.log(выражение)');
      } else {
        const result = evaluateExpression(line, vars);
        logs.push({ type: 'info', text: `Результат: ${result}` });
      }

      onProgress?.({ lineIndex: i, vars: { ...vars }, output: [...outputLines], logs: [...logs] });
    } catch (err) {
      throw { index: i, message: err.message, logs, vars: { ...vars }, outputLines: [...outputLines] };
    }
  }

  return { vars, outputLines, logs };
}

export function compileProgram(lines) {
  const errors = [];
  const warnings = [];
  const declaredVariables = new Set();
  const seenErrors = new Set();

  const pushError = (index, message) => {
    const key = `${index}:${message}`;
    if (seenErrors.has(key)) return;
    seenErrors.add(key);
    errors.push({ index, message });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = cleanLine(lines[i]);
    if (!line) continue;

    if (isDeclaration(line)) {
      const varName = getVariableName(line);
      if (varName) {
        if (declaredVariables.has(varName)) {
          warnings.push({ index: i, message: `Переменная '${varName}' уже объявлена` });
        }
        declaredVariables.add(varName);
      } else {
        pushError(i, 'Синтаксическая ошибка в объявлении переменной');
      }
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = cleanLine(lines[i]);
    if (!line) continue;

    const identifiers = extractIdentifiers(line);

    if (isDeclaration(line)) {
      const varName = getVariableName(line);
      for (const id of identifiers) {
        if (id !== varName && !declaredVariables.has(id)) {
          pushError(i, `Переменная '${id}' не объявлена`);
        }
      }
      continue;
    }

    if (line.includes('=') && !isLogStatement(line)) {
      const equalIndex = line.indexOf('=');
      const lhs = line.slice(0, equalIndex).trim();

      if (!declaredVariables.has(lhs)) {
        pushError(i, `Переменная '${lhs}' не объявлена`);
      }

      for (const id of identifiers) {
        if (id !== lhs && !declaredVariables.has(id)) {
          pushError(i, `Переменная '${id}' не объявлена`);
        }
      }
      continue;
    }

    for (const id of identifiers) {
      if (!declaredVariables.has(id)) {
        pushError(i, `Переменная '${id}' не объявлена`);
      }
    }
  }

  return { errors, warnings, declaredVariables: [...declaredVariables] };
}