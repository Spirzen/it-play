/** Учебные данные и упрощённый "запуск" кода для демо 1С:Предприятие */

export const ONE_C_ACCENT = '#d4a017';

export const NAV_SECTIONS = [
  {
    id: 'catalogs',
    label: 'Справочники',
    items: [
      {id: 'nomenclature', label: 'Номенклатура', type: 'list'},
      {id: 'partners', label: 'Контрагенты', type: 'list'},
    ],
  },
  {
    id: 'documents',
    label: 'Документы',
    items: [{id: 'receipt', label: 'Поступление товаров', type: 'document'}],
  },
  {
    id: 'reports',
    label: 'Отчёты',
    items: [{id: 'stock', label: 'Остатки товаров', type: 'report'}],
  },
];

export const METADATA_TREE = [
  {
    id: 'md-catalogs',
    label: 'Справочники',
    children: [
      {id: 'md-nomenclature', label: 'Номенклатура', module: 'nomenclature'},
      {id: 'md-partners', label: 'Контрагенты', module: 'partners'},
    ],
  },
  {
    id: 'md-documents',
    label: 'Документы',
    children: [{id: 'md-receipt', label: 'ПоступлениеТоваров', module: 'receipt'}],
  },
  {
    id: 'md-registers',
    label: 'Регистры накопления',
    children: [{id: 'md-stock', label: 'ОстаткиТоваров', module: 'stock'}],
  },
];

export const LIST_DATA = {
  nomenclature: [
    {code: '000001', name: 'Ноутбук 15"', unit: 'шт', price: '89 900'},
    {code: '000002', name: 'Монитор 27"', unit: 'шт', price: '24 500'},
    {code: '000003', name: 'Клавиатура', unit: 'шт', price: '3 200'},
  ],
  partners: [
    {code: 'П00001', name: 'ООО "ТехноСнаб"', inn: '7701234567'},
    {code: 'П00002', name: 'ИП Иванов А.С.', inn: '772098765432'},
  ],
};

export const DOCUMENT_DEFAULT = {
  number: '000000042',
  date: '22.05.2026',
  partner: 'ООО "ТехноСнаб"',
  warehouse: 'Основной склад',
  lines: [
    {item: 'Ноутбук 15"', qty: 2, price: '89 900', sum: '179 800'},
    {item: 'Монитор 27"', qty: 3, price: '24 500', sum: '73 500'},
  ],
};

export const CODE_SAMPLES = {
  nomenclature: `Процедура ПриОткрытии()
    Сообщить("Открыт справочник Номенклатура");
КонецПроцедуры`,
  partners: `Процедура ПередЗаписью(Отказ)
    Если ПустаяСтрока(Наименование) Тогда
        Сообщить("Заполните наименование контрагента");
        Отказ = Истина;
    КонецЕсли;
КонецПроцедуры`,
  receipt: `Процедура ОбработкаПроведения()
    Для Каждого Строка Из ТабличнаяЧасть Цикл
        Сообщить("Проведена строка: " + Строка.Номенклатура);
    КонецЦикла;
    Сообщить("Документ проведён, остатки обновлены");
КонецПроцедуры`,
  stock: `Функция ПолучитьОстаток(Номенклатура)
    Остаток = 12;
    Возврат Остаток;
КонецФункции`,
  flow: `Процедура РассчитатьСкидку(Сумма)
    Если Сумма > 100000 Тогда
        Сообщить("Скидка 10%");
    ИначеЕсли Сумма > 50000 Тогда
        Сообщить("Скидка 5%");
    Иначе
        Сообщить("Скидка не применяется");
    КонецЕсли;
КонецПроцедуры`,
  variables: `Процедура ПримерПеременных()
    Количество = 3;
    Цена = 24900;
    Сумма = Количество * Цена;
    Сообщить("Сумма строки: " + Сумма);
КонецПроцедуры`,
};

export function getModuleCode(moduleKey) {
  return CODE_SAMPLES[moduleKey] ?? CODE_SAMPLES.receipt;
}

/** Упрощённый разбор: Сообщить, ветвления, циклы — для наглядности, не компилятор 1С */
export function runBslDemo(code) {
  const lines = [];
  const push = (text, type = 'info') => lines.push({text, type, time: timeNow()});

  const messages = [...code.matchAll(/Сообщить\s*\(\s*["']([^"']+)["']\s*\)/gi)];
  if (messages.length === 0) {
    push('В демо обрабатываются вызовы Сообщить("...") и ключевые ветвления.', 'warn');
    return lines;
  }

  push('Начало выполнения модуля…');

  if (/Если\s+.+\s+Тогда/i.test(code)) {
    const branches = [...code.matchAll(/ИначеЕсли|Иначе|Если/gi)].length;
    if (branches > 0) {
      push('Проверка условия (Если … Тогда … Иначе)');
    }
  }

  if (/Для\s+Каждого/i.test(code)) {
    const loopItems = ['Ноутбук 15"', 'Монитор 27"'];
    loopItems.forEach((name) => push(`Проведена строка: ${name}`));
  }

  messages.forEach((m) => push(m[1]));

  if (/Возврат/i.test(code)) {
    push('Функция вернула значение вызывающему коду');
  }

  push('Выполнение завершено', 'success');
  return lines;
}

function timeNow() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDocumentTotal(lines) {
  const sum = lines.reduce((acc, row) => {
    const n = parseInt(String(row.sum).replace(/\s/g, ''), 10);
    return acc + (Number.isNaN(n) ? 0 : n);
  }, 0);
  return sum.toLocaleString('ru-RU');
}
