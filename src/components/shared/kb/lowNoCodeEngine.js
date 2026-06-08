export const LOW_CODE_EXAMPLES = {
  simpleButton: {
    name: 'Простая кнопка',
    code: `{
  type: "button",
  props: {
    text: "Нажми меня",
    onClick: () => alert("Привет из Low-Code!"),
    style: { backgroundColor: "#4CAF50", color: "white" }
  }
}`,
    result: 'Кнопка с зелёным фоном и обработчиком клика',
  },
  dataTable: {
    name: 'Таблица данных',
    code: `{
  type: "table",
  props: {
    data: [
      { name: "Анна", age: 25, city: "Москва" },
      { name: "Иван", age: 30, city: "СПб" },
      { name: "Мария", age: 28, city: "Казань" }
    ],
    columns: ["name", "age", "city"]
  }
}`,
    result: 'Таблица с тремя строками и сортировкой по клику на заголовок',
  },
  chart: {
    name: 'График продаж',
    code: `{
  type: "chart",
  props: {
    data: [120, 200, 150, 80, 70, 110, 130],
    labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    type: "line"
  }
}`,
    result: 'Столбчатый график продаж по дням недели',
  },
};

export const PALETTE = [
  {id: 'btn', type: 'button', icon: '🔘', name: 'Кнопка', defaultLabel: 'Новая кнопка'},
  {id: 'text', type: 'text', icon: '📝', name: 'Текст', defaultLabel: 'Текстовый блок'},
  {id: 'input', type: 'input', icon: '⌨️', name: 'Поле ввода', defaultLabel: 'Введите текст'},
  {id: 'card', type: 'card', icon: '🃏', name: 'Карточка', defaultLabel: 'Карточка'},
];

export const DEFAULT_CANVAS = [
  {id: 1, type: 'button', label: 'Кнопка', x: 48, y: 48},
  {id: 2, type: 'text', label: 'Текстовый блок', x: 48, y: 128},
  {id: 3, type: 'input', label: 'Поле ввода', x: 48, y: 208},
];

function matchString(code, key) {
  const re = new RegExp(`${key}:\\s*["']([^"']+)["']`, 'i');
  return code.match(re)?.[1];
}

function matchNumbers(code, key) {
  const re = new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`, 's');
  const block = code.match(re)?.[1];
  if (!block) return [];
  return [...block.matchAll(/-?\d+/g)].map((m) => Number(m[0]));
}

function matchObjectRows(code) {
  const rows = [];
  const re = /\{\s*name:\s*["']([^"']+)["'],\s*age:\s*(\d+),\s*city:\s*["']([^"']+)["']\s*\}/g;
  let m;
  while ((m = re.exec(code))) {
    rows.push({name: m[1], age: Number(m[2]), city: m[3]});
  }
  return rows;
}

export function parseLowCodeConfig(code) {
  const trimmed = code.trim();
  if (!trimmed) {
    return {ok: false, error: 'Вставьте конфигурацию или выберите пример слева.'};
  }

  if (/type:\s*["']button["']/i.test(trimmed)) {
    return {
      ok: true,
      type: 'button',
      props: {
        text: matchString(trimmed, 'text') ?? 'Кнопка',
        backgroundColor: matchString(trimmed, 'backgroundColor') ?? '#4CAF50',
        color: matchString(trimmed, 'color') ?? '#fff',
      },
    };
  }

  if (/type:\s*["']table["']/i.test(trimmed)) {
    const rows = matchObjectRows(trimmed);
    if (rows.length === 0) {
      return {ok: false, error: 'Не удалось разобрать строки таблицы в data: [ … ].'};
    }
    return {ok: true, type: 'table', props: {rows, columns: ['name', 'age', 'city']}};
  }

  if (/type:\s*["']chart["']/i.test(trimmed)) {
    const data = matchNumbers(trimmed, 'data');
    const labels = [...trimmed.matchAll(/["'](Пн|Вт|Ср|Чт|Пт|Сб|Вс|Mon|Tue|Wed|Thu|Fri|Sat|Sun)["']/gi)].map(
      (m) => m[1],
    );
    if (data.length === 0) {
      return {ok: false, error: 'Укажите массив data: [ числа ].'};
    }
    const fallbackLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return {
      ok: true,
      type: 'chart',
      props: {
        data,
        labels:
          labels.length >= data.length
            ? labels.slice(0, data.length)
            : fallbackLabels.slice(0, data.length),
      },
    };
  }

  return {ok: false, error: 'Неизвестный type. Поддерживаются: button, table, chart.'};
}

export function exportCanvasJson(components) {
  return JSON.stringify(
    components.map(({type, label, x, y}) => ({type, label, x, y})),
    null,
    2,
  );
}
