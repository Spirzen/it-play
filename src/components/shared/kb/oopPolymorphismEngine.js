/** Данные и логика для демо "Полиморфизм" (статья 4-08-oop/5). */

export const CONCEPT_TABS = [
  {
    id: 'override',
    label: 'Переопределение',
    hint: 'Переменная типа Животное ссылается на Кот или Собаку — при вызове издатьЗвук() срабатывает реализация фактического типа.',
  },
  {
    id: 'shapes',
    label: 'Единый интерфейс',
    hint: 'Массив Фигура[]: один метод нарисовать(), разный результат у Круга и Прямоугольника.',
  },
  {
    id: 'overload',
    label: 'Перегрузка',
    hint: 'Одно имя метода сложить(), разные сигнатуры — компилятор выбирает реализацию по типам аргументов.',
  },
];

export const BASE_ANIMAL = {
  name: 'Животное',
  method: 'издатьЗвук()',
  defaultOutput: 'Животное издаёт звук.',
};

export const ANIMAL_IMPLS = [
  {
    id: 'cat',
    className: 'Кот',
    varName: 'кот',
    label: 'Кот',
    icon: '🐱',
    output: 'Мяу!',
  },
  {
    id: 'dog',
    className: 'Собака',
    varName: 'собака',
    label: 'Собака',
    icon: '🐕',
    output: 'Гав!',
  },
];

export const ZOO_SEQUENCE = [
  {implId: 'cat'},
  {implId: 'dog'},
  {implId: 'cat'},
];

export const BASE_FIGURE = {
  name: 'Фигура',
  method: 'нарисовать()',
  defaultOutput: 'Нарисована фигура.',
};

export const FIGURE_IMPLS = [
  {
    id: 'circle',
    className: 'Круг',
    varName: 'круг',
    label: 'Круг',
    icon: '⭕',
    output: 'Нарисован круг.',
  },
  {
    id: 'rect',
    className: 'Прямоугольник',
    varName: 'прямоугольник',
    label: 'Прямоугольник',
    icon: '▭',
    output: 'Нарисован прямоугольник.',
  },
];

export const CANVAS_SEQUENCE = [{implId: 'circle'}, {implId: 'rect'}, {implId: 'circle'}];

export const MATH_OVERLOADS = [
  {
    id: 'int',
    sig: 'сложить(целое a, целое b)',
    sampleCall: 'сложить(1, 2)',
    args: {a: 1, b: 2},
    output: '3',
    detail: 'арифметическое сложение',
  },
  {
    id: 'str',
    sig: 'сложить(строка a, строка b)',
    sampleCall: 'сложить("Привет", "мир")',
    args: {a: 'Привет', b: 'мир'},
    output: 'Привет мир',
    detail: 'конкатенация строк',
  },
];

export function getAnimal(id) {
  return ANIMAL_IMPLS.find((a) => a.id === id) ?? ANIMAL_IMPLS[0];
}

export function getFigure(id) {
  return FIGURE_IMPLS.find((f) => f.id === id) ?? FIGURE_IMPLS[0];
}

export function runAnimalSound(impl) {
  return impl.output;
}

export function runFigureDraw(impl) {
  return impl.output;
}

export function runZooLoop() {
  return ZOO_SEQUENCE.map((item, i) => {
    const impl = getAnimal(item.implId);
    return {
      index: i + 1,
      declType: BASE_ANIMAL.name,
      actualType: impl.className,
      call: `${impl.varName}.издатьЗвук()`,
      output: impl.output,
    };
  });
}

export function runCanvasLoop() {
  return CANVAS_SEQUENCE.map((item, i) => {
    const impl = getFigure(item.implId);
    return {
      index: i + 1,
      declType: BASE_FIGURE.name,
      actualType: impl.className,
      call: `${impl.varName}.нарисовать()`,
      output: impl.output,
    };
  });
}

export function runMathAdd(overload, customA, customB) {
  const a = customA ?? overload.args.a;
  const b = customB ?? overload.args.b;
  if (overload.id === 'int') {
    const na = Number(a);
    const nb = Number(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) {
      return {output: '—', error: 'Нужны целые числа'};
    }
    return {output: String(na + nb), a: na, b: nb};
  }
  const sa = String(a ?? '');
  const sb = String(b ?? '');
  return {output: `${sa} ${sb}`.trim(), a: sa, b: sb};
}

export function formatAnimalDecl(impl) {
  return `${BASE_ANIMAL.name} ${impl.varName} = new ${impl.className}();`;
}

export function formatFigureDecl(impl) {
  return `${BASE_FIGURE.name} ${impl.varName} = new ${impl.className}();`;
}

export function formatAnimalCall(impl) {
  return `${impl.varName}.издатьЗвук()`;
}

export function formatFigureCall(impl) {
  return `${impl.varName}.нарисовать()`;
}
