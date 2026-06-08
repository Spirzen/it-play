export function buildFunctionSteps(arg) {
  const n = Number.isFinite(arg) ? arg : 0;
  const result = n * 2;

  return [
    {
      key: 'start',
      description: 'Интерпретатор читает программу сверху вниз',
      highlight: 'start',
      callStack: [],
    },
    {
      key: 'definition',
      description: 'Объявление double(x) — тело функции пока не выполняется',
      highlight: 'definition',
      callStack: [],
    },
    {
      key: 'call',
      description: `Вызов double(${n}) — аргумент подставляется в параметр x`,
      highlight: 'call',
      callStack: [],
      arg: n,
    },
    {
      key: 'enter',
      description: `Вход в функцию: x = ${n}`,
      highlight: 'body',
      callStack: [{name: 'double', param: n, line: 'return x * 2'}],
      arg: n,
    },
    {
      key: 'body',
      description: `Вычисление: ${n} × 2 = ${result}`,
      highlight: 'body',
      callStack: [{name: 'double', param: n, line: 'return x * 2'}],
      computation: `${n} × 2 = ${result}`,
      arg: n,
      result,
    },
    {
      key: 'return',
      description: `return ${result} — значение уходит вызывающему коду`,
      highlight: 'return',
      callStack: [],
      returnValue: result,
    },
    {
      key: 'result',
      description: `num = ${result}, print(num) выводит результат`,
      highlight: 'result',
      callStack: [],
      finalResult: result,
    },
  ];
}

export const FUNCTION_CODE_LINES = [
  {id: 'start', num: 1, parts: [{t: 'comment', v: '// Программа начинает выполнение'}]},
  {id: 'definition', num: 2, parts: [{t: 'kw', v: 'def'}, {t: 'fn', v: ' double'}, {t: 'p', v: '(x):'}]},
  {id: 'body', num: 3, indent: 1, parts: [{t: 'kw', v: 'return '}, {t: 'v', v: 'x * 2'}]},
  {id: 'gap', num: 4, parts: []},
  {id: 'call', num: 5, parts: [{t: 'v', v: 'num = '}, {t: 'fn', v: 'double'}, {t: 'p', v: '(ARG)'}]},
  {id: 'result', num: 6, parts: [{t: 'fn', v: 'print'}, {t: 'p', v: '(num)'}]},
];
