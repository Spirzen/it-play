export const DEBUGGER_CODE = `function calculateSum(a, b) {
  let result = a + b;
  console.log("Сумма:", result);
  return result;
}

function multiplyByTwo(x) {
  let multiplied = x * 2;
  console.log("Умножено:", multiplied);
  return multiplied;
}

function main() {
  let number = 5;
  let sum = calculateSum(number, 3);
  let final = multiplyByTwo(sum);
  console.log("Финальный результат:", final);
  return final;
}

let output = main();
console.log("Программа завершена");`;

export const DEFAULT_BREAKPOINTS = [14, 15, 16];

export const TOKEN_CLASS = {
  comment: 'comment',
  kw: 'kw',
  fn: 'fn',
  v: 'v',
  str: 'str',
  num: 'num',
  p: 'p',
};

const KEYWORDS = new Set([
  'function',
  'let',
  'return',
  'const',
  'var',
  'if',
  'else',
  'for',
  'while',
]);

/** Простая подсветка строки JS для демо-редактора. */
export function tokenizeLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('//')) {
    return [{t: TOKEN_CLASS.comment, v: line}];
  }

  const tokens = [];
  const re =
    /("(?:[^"\\]|\\.)*")|(\b\d+\b)|(\b(?:function|let|return|const|var)\b)|(\b[a-zA-Z_$][\w$]*\b)|([{}();,=+\-*/])|(\s+)/g;
  let m;
  while ((m = re.exec(line)) !== null) {
    const [full, str, num, kw, ident, punct, space] = m;
    if (space) tokens.push({t: TOKEN_CLASS.p, v: full});
    else if (str) tokens.push({t: TOKEN_CLASS.str, v: full});
    else if (num) tokens.push({t: TOKEN_CLASS.num, v: full});
    else if (kw) tokens.push({t: TOKEN_CLASS.kw, v: full});
    else if (ident) {
      const next = line.slice(m.index + full.length).trimStart();
      const isCall = next.startsWith('(');
      const isFnDecl =
        KEYWORDS.has('function') &&
        line.slice(0, m.index).includes('function') &&
        !line.slice(m.index).trimStart().startsWith('(');
      const t =
        isCall || (line.includes('function ') && !line.includes('='))
          ? TOKEN_CLASS.fn
          : TOKEN_CLASS.v;
      tokens.push({t, v: full});
    } else if (punct) tokens.push({t: TOKEN_CLASS.p, v: full});
    else tokens.push({t: TOKEN_CLASS.p, v: full});
  }

  if (tokens.length === 0) {
    return [{t: TOKEN_CLASS.p, v: line}];
  }
  return tokens;
}

export function createInitialDebugContext(codeLines) {
  const mainLine = codeLines.findIndex((l) => l.trim().startsWith('function main')) + 1;
  return {
    programCounter: mainLine || 13,
    callStack: [],
    localVars: {},
    currentFunction: 'main',
    isProgramFinished: false,
  };
}

export function executeSingleLine(line, context, codeLines, onLog) {
  const lineContent = codeLines[line - 1]?.trim() ?? '';
  const result = {nextLine: null, shouldStop: false};

  const log = (text, type = 'info') => onLog?.({text, type});

  if (
    lineContent.includes('function calculateSum') ||
    lineContent.includes('function multiplyByTwo') ||
    lineContent.includes('function main')
  ) {
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('let number = 5')) {
    context.localVars.number = 5;
    log('→ number = 5', 'exec');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('let sum = calculateSum(number, 3)')) {
    context.callStack.push({
      functionName: 'main',
      returnLine: line + 1,
      vars: {...context.localVars},
    });
    const calculateSumStart =
      codeLines.findIndex((l) => l.includes('function calculateSum')) + 2;
    context.localVars = {a: context.localVars.number, b: 3};
    context.currentFunction = 'calculateSum';
    log(`→ вызов calculateSum(${context.localVars.a}, ${context.localVars.b})`, 'call');
    result.nextLine = calculateSumStart;
    return result;
  }

  if (lineContent.includes('let result = a + b')) {
    const sum = (context.localVars.a || 0) + (context.localVars.b || 0);
    context.localVars.result = sum;
    log(`→ result = ${sum}`, 'exec');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('console.log("Сумма:")')) {
    log(`📝 Сумма: ${context.localVars.result}`, 'output');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('return result') && context.currentFunction === 'calculateSum') {
    const returnValue = context.localVars.result;
    const returnContext = context.callStack.pop();
    if (returnContext) {
      context.localVars = returnContext.vars;
      context.localVars.sum = returnValue;
      context.currentFunction = 'main';
      log(`← calculateSum вернула ${returnValue}`, 'return');
      result.nextLine = returnContext.returnLine;
    }
    return result;
  }

  if (lineContent.includes('let final = multiplyByTwo(sum)')) {
    context.callStack.push({
      functionName: 'main',
      returnLine: line + 1,
      vars: {...context.localVars},
    });
    const multiplyStart =
      codeLines.findIndex((l) => l.includes('function multiplyByTwo')) + 2;
    context.localVars = {x: context.localVars.sum};
    context.currentFunction = 'multiplyByTwo';
    log(`→ вызов multiplyByTwo(${context.localVars.x})`, 'call');
    result.nextLine = multiplyStart;
    return result;
  }

  if (lineContent.includes('let multiplied = x * 2')) {
    const multiplied = (context.localVars.x || 0) * 2;
    context.localVars.multiplied = multiplied;
    log(`→ multiplied = ${multiplied}`, 'exec');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('console.log("Умножено:")')) {
    log(`📝 Умножено: ${context.localVars.multiplied}`, 'output');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('return multiplied') && context.currentFunction === 'multiplyByTwo') {
    const returnValue = context.localVars.multiplied;
    const returnContext = context.callStack.pop();
    if (returnContext) {
      context.localVars = returnContext.vars;
      context.localVars.final = returnValue;
      context.currentFunction = 'main';
      log(`← multiplyByTwo вернула ${returnValue}`, 'return');
      result.nextLine = returnContext.returnLine;
    }
    return result;
  }

  if (lineContent.includes('console.log("Финальный результат:")')) {
    log(`📝 Финальный результат: ${context.localVars.final}`, 'output');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('return final')) {
    log(`→ main вернула ${context.localVars.final}`, 'return');
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('let output = main()')) {
    result.nextLine = line + 1;
    return result;
  }

  if (lineContent.includes('console.log("Программа завершена")')) {
    log('✅ Программа завершена', 'success');
    result.shouldStop = true;
    return result;
  }

  result.nextLine = line + 1;
  return result;
}

export function cloneContext(ctx) {
  return {
    programCounter: ctx.programCounter,
    callStack: ctx.callStack.map((f) => ({...f, vars: {...f.vars}})),
    localVars: {...ctx.localVars},
    currentFunction: ctx.currentFunction,
    isProgramFinished: ctx.isProgramFinished,
  };
}

export const OUTPUT_COLORS = {
  error: '#f48771',
  success: '#6a9955',
  warning: '#dcdcaa',
  call: '#9cdcfe',
  return: '#ce9178',
  breakpoint: '#f48771',
  step: '#4ec9b0',
  start: '#6a9955',
  exec: '#d4d4d4',
  output: '#b5cea8',
  info: '#d4d4d4',
};

export function functionAtLine(lineNum, codeLines) {
  const line = codeLines[lineNum - 1] ?? '';
  if (line.includes('function calculateSum')) return 'calculateSum';
  if (line.includes('function multiplyByTwo')) return 'multiplyByTwo';
  if (line.includes('function main')) return 'main';
  let fn = 'global';
  for (let i = 0; i < lineNum; i++) {
    const l = codeLines[i];
    if (l.includes('function calculateSum')) fn = 'calculateSum';
    else if (l.includes('function multiplyByTwo')) fn = 'multiplyByTwo';
    else if (l.includes('function main')) fn = 'main';
  }
  return fn;
}
