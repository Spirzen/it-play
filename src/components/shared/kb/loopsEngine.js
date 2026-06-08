export const LOOP_SPEEDS = [
  {key: 'slow', label: 'Медленно', ms: 1400},
  {key: 'normal', label: 'Обычно', ms: 900},
  {key: 'fast', label: 'Быстро', ms: 450},
];

export const LOOPS = {
  for: {
    id: 'for',
    label: 'for',
    title: 'Цикл с известным числом итераций',
    description: 'Счётчик i от 1 до 5 — классический for.',
    code: `for (let i = 1; i <= 5; i++) {
  console.log("Итерация:", i);
}`,
    highlightLines: [0, 1],
    iterations: 5,
    run(step) {
      return {message: `Итерация ${step}`, value: step, detail: `i = ${step}`};
    },
    finalMessage(output) {
      return `Выполнено ${output.length} итераций (i: 1 → 5)`;
    },
    hints: [
      'Инициализация: let i = 1',
      'Условие: i <= 5 проверяется перед каждой итерацией',
      'Тело: console.log выполняется, пока условие истинно',
      'Инкремент: i++ — без него цикл не остановится',
    ],
  },
  while: {
    id: 'while',
    label: 'while',
    title: 'Цикл с условием в начале',
    description: 'Счётчик растёт, пока counter <= 5.',
    code: `let counter = 1;
while (counter <= 5) {
  console.log("Счётчик:", counter);
  counter++;
}`,
    highlightLines: [1, 2, 3],
    iterations: 5,
    run(step) {
      return {message: `Счётчик = ${step}`, value: step, detail: `counter = ${step}`};
    },
    finalMessage(output) {
      return `Цикл завершён: counter стал ${output.length + 1}`;
    },
    hints: [
      'counter объявлен до цикла',
      'Условие проверяется перед каждым входом в тело',
      'counter++ обязателен — иначе бесконечный цикл',
    ],
  },
  collection: {
    id: 'collection',
    label: 'for…of',
    title: 'Обход коллекции',
    description: 'Суммирование элементов массива.',
    code: `const numbers = [10, 20, 30, 40, 50];
let sum = 0;

for (const num of numbers) {
  sum += num;
  console.log("Сумма:", sum);
}`,
    items: [10, 20, 30, 40, 50],
    highlightLines: [3, 4],
    iterations: 5,
    run(step, items) {
      const slice = items.slice(0, step);
      const sum = slice.reduce((a, b) => a + b, 0);
      const last = items[step - 1];
      return {
        message: `+${last} → сумма ${sum}`,
        value: last,
        sum,
        detail: `num = ${last}`,
      };
    },
    finalMessage(output) {
      const last = output[output.length - 1];
      return `Итоговая сумма: ${last?.sum ?? 0}`;
    },
    hints: [
      'Массив numbers хранит данные',
      'num — текущий элемент на каждой итерации',
      'sum накапливает результат',
      'После последнего элемента цикл завершается сам',
    ],
  },
};
