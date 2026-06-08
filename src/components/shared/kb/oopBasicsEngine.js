/** Данные и подсказки для демо "Основы ООП" (статья 4-08-oop/1). */

export const CAT_CLASS = {
  name: 'Cat',
  attributes: [
    {key: 'name', type: 'String', label: 'имя'},
    {key: 'color', type: 'String', label: 'окрас'},
    {key: 'age', type: 'int', label: 'возраст'},
    {key: 'breed', type: 'String', label: 'порода'},
  ],
  methods: [
    {key: 'meow', returns: 'void', label: 'мяукать'},
    {key: 'sleep', returns: 'void', label: 'спать'},
  ],
};

export const CONCEPT_TABS = [
  {
    id: 'class',
    label: 'Класс',
    hint: 'Шаблон: какие поля и методы есть у всех котов, но без конкретных значений.',
  },
  {
    id: 'constructor',
    label: 'Конструктор',
    hint: 'Специальный метод Cat(...): выделяет память и задаёт начальные значения полей.',
  },
  {
    id: 'object',
    label: 'Объект',
    hint: 'Экземпляр класса в памяти — у каждого свой набор значений атрибутов.',
  },
  {
    id: 'attributes',
    label: 'Атрибуты',
    hint: 'Поля объекта хранят состояние; у разных экземпляров — разные значения.',
  },
  {
    id: 'methods',
    label: 'Методы',
    hint: 'Поведение из класса; при вызове obj.meow() работает логика класса в контексте объекта.',
  },
];

export const CAT_PRESETS = [
  {
    varName: 'barsik',
    name: 'Барсик',
    color: 'orange',
    age: 3,
    breed: 'Мейн-кун',
  },
  {
    varName: 'persik',
    name: 'Персик',
    color: 'black',
    age: 5,
    breed: 'Британский короткошерстный',
  },
];

export const DEFAULT_CONSTRUCTOR_FORM = {
  varName: 'myCat',
  name: 'Мурзик',
  color: 'gray',
  age: 2,
  breed: 'Дворовый',
};

export function createCatInstance({varName, name, color, age, breed}) {
  return {
    id: `${varName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    varName: varName.trim() || 'cat',
    name: name.trim() || 'Кот',
    color: color.trim() || '—',
    age: Number.isFinite(Number(age)) ? Number(age) : 0,
    breed: breed.trim() || '—',
  };
}

export function formatConstructorCall(form) {
  const args = [`"${form.name}"`, form.age, `"${form.color}"`, `"${form.breed}"`];
  return `Cat ${form.varName} = new Cat(${args.join(', ')});`;
}

export function runCatMethod(methodKey, cat) {
  if (methodKey === 'meow') {
    return `${cat.name} мяукает: "Мяу!"`;
  }
  if (methodKey === 'sleep') {
    return `${cat.name} засыпает… zzz`;
  }
  return `${cat.name}: неизвестный метод`;
}
