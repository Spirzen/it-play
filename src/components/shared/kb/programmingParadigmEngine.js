export const PARADIGMS = [
  {
    id: 'imperative',
    label: 'Императивная',
    focus: 'Как выполнять: шаг за шагом, изменение состояния',
    langs: 'C, Pascal, Go (процедурный стиль)',
    task: 'Сумма элементов списка [1, 2, 3, 4]',
    code: `sum = 0
for i in range(len(numbers)):
    sum = sum + numbers[i]
print(sum)`,
    steps: [
      'sum ← 0',
      'i ← 0, взять numbers[0]=1, sum ← 1',
      'i ← 1, взять numbers[1]=2, sum ← 3',
      'i ← 2, взять numbers[2]=3, sum ← 6',
      'i ← 3, взять numbers[3]=4, sum ← 10',
      'вывод 10',
    ],
    traits: ['Явный порядок команд', 'Мутабельные переменные', 'Циклы и присваивания'],
  },
  {
    id: 'functional',
    label: 'Функциональная',
    focus: 'Что вычислить: функции без побочных эффектов',
    langs: 'Haskell, F#, Clojure; в Python — map/reduce',
    task: 'Та же сумма через рекурсию / reduce',
    code: `def total(xs):
    return 0 if not xs else xs[0] + total(xs[1:])

print(total([1, 2, 3, 4]))`,
    steps: [
      'total([1,2,3,4])',
      '→ 1 + total([2,3,4])',
      '→ 1 + 2 + total([3,4])',
      '→ 1 + 2 + 3 + total([4])',
      '→ 1 + 2 + 3 + 4 + total([])',
      '→ 10 (новых присваиваний sum нет)',
    ],
    traits: ['Неизменяемые данные', 'Рекурсия вместо цикла', 'Выражение результата'],
  },
  {
    id: 'oop',
    label: 'Объектная',
    focus: 'Кто делает: объекты с данными и поведением',
    langs: 'Java, C#, Python, Smalltalk',
    task: 'Сумма через объект-коллекцию',
    code: `class NumberList:
    def __init__(self, items):
        self._items = list(items)

    def sum(self):
        return sum(self._items)

nums = NumberList([1, 2, 3, 4])
print(nums.sum())`,
    steps: [
      'Создать NumberList([1,2,3,4])',
      'Вызвать nums.sum()',
      'Метод обращается к self._items',
      'Встроенный sum() → 10',
      'Сообщение "верни сумму" — контракт объекта',
    ],
    traits: ['Инкапсуляция данных', 'Методы как сообщения', 'Композиция объектов'],
  },
  {
    id: 'declarative',
    label: 'Декларативная (логика/SQL)',
    focus: 'Что нужно получить, а не как итерировать',
    langs: 'SQL, Prolog',
    task: 'Сумма как запрос / правило',
    code: `SELECT SUM(value) AS total
FROM numbers
WHERE value IN (1, 2, 3, 4);

-- Prolog-стиль:
sum([], 0).
sum([H|T], S) :- sum(T, Rest), S is H + Rest.`,
    steps: [
      'Описать множество numbers',
      'Планировщик выбирает агрегацию SUM',
      'Результат 10 без явного цикла в тексте',
      '"Как" — внутри СУБД / движка правил',
    ],
    traits: ['Правила и факты', 'Меньше управления потоком', 'Движок выводит ответ'],
  },
];
