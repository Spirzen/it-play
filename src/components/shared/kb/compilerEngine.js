export const DEFAULT_CODE = `let name = "Мир"
let greeting = "Привет, " + name
print(greeting)`;

export const EXAMPLE_CODES = {
  simple: `let x = 10
let y = 20
let z = x + y
print(z)`,
  error: `let x = 10
y = x + z
print(y)`,
  strings: `let name = "Мир"
let greeting = "Привет, " + name
print(greeting)`,
  calc: `let a = 5
let b = 3
let sum = a + b
let product = a * b
print("Сумма: " + sum)
print("Произведение: " + product)`,
};

export function cleanLine(line) {
  let clean = line.split('//')[0];
  clean = clean.replace(/;+$/, '');
  return clean.trim();
}

export function isDeclaration(line) {
  return line.startsWith('let ') || line.startsWith('const ') || line.startsWith('var ');
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

export function evaluateExpression(expr, vars) {
  expr = expr.trim();

  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }

  if (expr.includes('+')) {
    const parts = expr.split('+').map((p) => p.trim());
    let result = '';
    let isStringConcat = false;

    for (const part of parts) {
      let value;

      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) {
        value = part.slice(1, -1);
        isStringConcat = true;
      } else if (!Number.isNaN(Number(part))) {
        value = Number(part);
      } else if (Object.prototype.hasOwnProperty.call(vars, part)) {
        value = vars[part];
        if (typeof value === 'string') isStringConcat = true;
      } else {
        throw new Error(`Переменная '${part}' не определена`);
      }

      if (isStringConcat) {
        result += String(value);
      } else if (result === '') {
        result = value;
      } else {
        result += value;
      }
    }

    return result;
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
      } else if (line.includes('=') && !line.startsWith('print')) {
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
      } else if (line.startsWith('print')) {
        let expr;
        if (line.startsWith('print(') && line.endsWith(')')) {
          expr = line.slice(6, -1);
        } else if (line.startsWith('print ')) {
          expr = line.slice(6);
        } else {
          throw new Error('Синтаксис: print(выражение) или print выражение');
        }

        const value = evaluateExpression(expr, vars);
        outputLines.push(String(value));
        logs.push({ type: 'output', text: `→ ${value}` });
      } else {
        const result = evaluateExpression(line, vars);
        logs.push({ type: 'info', text: `Результат: ${result}` });
      }

      onProgress?.({ lineIndex: i, vars: { ...vars }, output: [...outputLines], logs: [...logs] });
    } catch (err) {
      throw { index: i, message: err.message, logs };
    }
  }

  return { vars, outputLines, logs };
}

export function compileProgram(lines) {
  const errors = [];
  const warnings = [];
  const declaredVariables = new Set();

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
        errors.push({ index: i, message: 'Синтаксическая ошибка в объявлении переменной' });
      }
    }

    const varMatches = line.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
    if (varMatches && !isDeclaration(line)) {
      for (const v of varMatches) {
        if (!['print', 'let', 'const', 'var', 'true', 'false', 'null', 'undefined'].includes(v)) {
          if (!declaredVariables.has(v)) {
            errors.push({ index: i, message: `Переменная '${v}' не объявлена` });
          }
        }
      }
    }
  }

  return { errors, warnings, declaredVariables: [...declaredVariables] };
}

export const COMPILE_PHASES = [
  { id: 'lex', label: 'Лексический анализ', icon: '🔤' },
  { id: 'parse', label: 'Синтаксический анализ', icon: '🌳' },
  { id: 'semantic', label: 'Семантика', icon: '✓' },
  { id: 'codegen', label: 'Генерация кода', icon: '⚙️' },
  { id: 'link', label: 'Линковка', icon: '🔗' },
];
