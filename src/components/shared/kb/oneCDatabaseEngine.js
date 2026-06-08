/** In-memory модель и сценарии для OneCDatabasePlay */

export const ONE_C_DB_ACCENT = '#d4a017';

export const NOMENCLATURE_COLUMNS = ['Код', 'Наименование', 'Артикул', 'Активность'];

export const INITIAL_NOMENCLATURE = [
  {ref: 'r1', code: '000001', name: 'Ноутбук 15"', article: 'NB-15', active: true},
  {ref: 'r2', code: '000002', name: 'Монитор 27"', article: 'MN-27', active: true},
  {ref: 'r3', code: '000003', name: 'Клавиатура', article: 'KB-01', active: false},
];

export const INITIAL_STOCK = [
  {warehouse: 'Основной', item: 'Ноутбук 15"', qty: 12},
  {warehouse: 'Основной', item: 'Монитор 27"', qty: 8},
];

export const STORAGE_MODES = {
  file: {
    id: 'file',
    label: 'Файловый режим',
    subtitle: 'Один файл .1CD на диске — метаданные и данные в контейнере',
    layers: [
      {id: 'client', label: 'Толстый клиент', short: 'UI', role: 'Формы, отчёты, обработки'},
      {id: 'platform', label: 'Платформа 1С', short: 'runtime', role: 'Язык запросов, блокировки, транзакции'},
      {id: 'file', label: 'Файл .1CD', short: '1CD', role: 'Метаданные + таблицы данных + служебные области'},
    ],
  },
  server: {
    id: 'server',
    label: 'Клиент–сервер',
    subtitle: 'Сервер приложений 1С + внешняя СУБД (SQL Server, PostgreSQL…)',
    layers: [
      {id: 'client', label: 'Клиент 1С', short: 'UI', role: 'Тонкий/толстый клиент, веб-клиент'},
      {id: 'app', label: 'Сервер 1С', short: 'ragent', role: 'BSL, запросы, проведение, блокировки'},
      {id: 'platform', label: 'СУБД-драйвер', short: 'SQL', role: 'Преобразование запросов 1С → SQL'},
      {id: 'rdbms', label: 'СУБД', short: 'DB', role: 'Таблицы _Reference*, _Document*, _AccumReg*'},
    ],
  },
};

export const METADATA_OBJECTS = [
  {
    id: 'catalog',
    label: 'Справочник',
    icon: '📁',
    role: 'Постоянные сущности: номенклатура, контрагенты',
    fields: ['Код', 'Наименование', 'Реквизиты', 'Иерархия'],
    sample: 'Справочник.Номенклатура',
    bsl: `Элемент = Справочники.Номенклатура.СоздатьЭлемент();
Элемент.Наименование = "Монитор 27\\"";
Элемент.Записать();`,
  },
  {
    id: 'document',
    label: 'Документ',
    icon: '📄',
    role: 'Факт операции во времени; шапка + табличная часть',
    fields: ['Дата', 'Номер', 'Проведён', 'ТабличнаяЧасть'],
    sample: 'Документ.ПоступлениеТоваров',
    bsl: `Док = Документы.ПоступлениеТоваров.СоздатьДокумент();
Док.Дата = ТекущаяДата();
// ... строки ТЧ
Док.Записать(РежимЗаписиДокумента.Проведение);`,
  },
  {
    id: 'infoReg',
    label: 'Регистр сведений',
    icon: '📊',
    role: 'Срезы по измерениям: цены, курсы, статусы',
    fields: ['Измерения', 'Ресурсы', 'Периодичность'],
    sample: 'РегистрСведений.ЦеныНоменклатуры',
    bsl: `Менеджер = РегистрыСведений.ЦеныНоменклатуры.СоздатьМенеджерЗаписи();
Менеджер.Период = ТекущаяДата();
Менеджер.Номенклатура = СсылкаТовара;
Менеджер.Цена = 24500;
Менеджер.Записать();`,
  },
  {
    id: 'accReg',
    label: 'Регистр накопления',
    icon: '📈',
    role: 'Остатки и обороты; движения при проведении',
    fields: ['Измерения', 'Ресурсы', 'Вид (остатки/обороты)'],
    sample: 'РегистрНакопления.ОстаткиТоваров',
    bsl: `// Движения формируются в ОбработкаПроведения()
Движение = Движения.ОстаткиТоваров.Добавить();
Движение.ВидДвижения = ВидДвиженияНакопления.Приход;
Движение.Количество = 5;`,
  },
];

export const CRUD_OPS = [
  {id: 'read', label: 'Чтение (Запрос)', verb: 'Прочитать'},
  {id: 'create', label: 'Создание (Записать)', verb: 'Создать'},
  {id: 'update', label: 'Изменение (Записать)', verb: 'Изменить'},
  {id: 'delete', label: 'Удаление', verb: 'Удалить'},
];

export const ACCESS_STYLES = [
  {id: 'query', label: 'Язык запросов', desc: 'ВЫБРАТЬ … ИЗ … ГДЕ — универсальная выборка'},
  {id: 'manager', label: 'Менеджер объекта', desc: 'СоздатьЭлемент / ПолучитьОбъект / Записать'},
  {id: 'selection', label: 'Выборка', desc: 'Выбрать() — обход без загрузки всего в память'},
];

export const FLOW_SCENARIOS = [
  {
    id: 'select',
    title: 'Запрос к справочнику',
    subtitle: 'BSL → Запрос.Выполнить() → платформа → СУБД → таблица',
    storage: 'server',
    steps: [
      {
        spotlight: ['client'],
        label: 'Отчёт или обработка запускает код',
        detail: 'Модуль формы или общий модуль вызывает Запрос',
        packet: 'down',
        code: `Запрос = Новый Запрос;
Запрос.Текст =
"ВЫБРАТЬ
|    Ном.Код,
|    Ном.Наименование
|ИЗ
|    Справочник.Номенклатура КАК Ном
|ГДЕ
|    Ном.Активность = ИСТИНА";`,
      },
      {
        spotlight: ['client', 'app'],
        label: 'Запрос.УстановитьПараметр (если есть)',
        detail: 'Параметры &ДатаНач защищают от подстановки в текст',
        packet: 'down',
        code: `Запрос.УстановитьПараметр("Активность", Истина);
Результат = Запрос.Выполнить();`,
      },
      {
        spotlight: ['app', 'platform'],
        label: 'Платформа строит SQL для СУБД',
        detail: 'Внутренние таблицы _Reference*; индексы по полям ГДЕ',
        packet: 'request',
        code: `-- упрощённо для PostgreSQL
SELECT _Code, _Description
FROM _Reference${'{'}Номенклатура{'}'}
WHERE _Marked = FALSE AND _Fld… = TRUE;`,
      },
      {
        spotlight: ['rdbms', 'platform'],
        label: 'СУБД возвращает набор строк',
        detail: 'Курсор передаётся серверу 1С, затем клиенту',
        packet: 'up',
        code: `Выборка = Результат.Выбрать();
Пока Выборка.Следующий() Цикл
    Сообщить(Выборка.Наименование);
КонецЦикла;`,
      },
    ],
  },
  {
    id: 'post',
    title: 'Проведение документа',
    subtitle: 'Запись документа → движения регистра → фиксация транзакции',
    storage: 'server',
    steps: [
      {
        spotlight: ['client'],
        label: 'Пользователь нажимает "Провести"',
        detail: 'Документ переходит в состояние "Проведён"',
        packet: 'down',
        code: `ДокОбъект = Документы.Реализация.ПолучитьОбъект(Ссылка);
ДокОбъект.Записать(РежимЗаписиДокумента.Проведение);`,
      },
      {
        spotlight: ['app'],
        label: 'ОбработкаПроведения()',
        detail: 'Модуль объекта формирует движения регистров',
        packet: 'down',
        code: `Процедура ОбработкаПроведения(Отказ)
    Движение = Движения.ОстаткиТоваров.Добавить();
    Движение.ВидДвижения = ВидДвиженияНакопления.Расход;
    Движение.Количество = Строка.Количество;
КонецПроцедуры`,
      },
      {
        spotlight: ['app', 'platform'],
        label: 'НачалоТранзакции на сервере',
        detail: 'Документ + движения — одна атомарная операция',
        packet: 'request',
        code: `НачалоТранзакции();
// INSERT/UPDATE в _Document* и _AccumReg*
ЗафиксироватьТранзакцию();`,
      },
      {
        spotlight: ['rdbms'],
        label: 'СУБД фиксирует изменения',
        detail: 'При ошибке — ОтменитьТранзакцию(), откат всех записей',
        packet: 'up',
        code: `// Остатки пересчитываются по движениям регистра
Остаток = РегистрыНакопления.ОстаткиТоваров.Остатки(...);`,
      },
    ],
  },
  {
    id: 'fileRead',
    title: 'Чтение в файловом режиме',
    subtitle: 'Клиент и платформа работают с файлом .1CD напрямую',
    storage: 'file',
    steps: [
      {
        spotlight: ['client'],
        label: 'Открытие списка справочника',
        detail: 'Платформа читает таблицу из файла базы',
        packet: 'down',
        code: `// Тот же язык запросов — исполнение локально
Запрос = Новый Запрос("ВЫБРАТЬ ...");`,
      },
      {
        spotlight: ['platform', 'file'],
        label: 'Блокировка файла при записи',
        detail: 'Файл-блокировки эмулируют транзакции СУБД',
        packet: 'request',
        code: `// .1CD — единый контейнер метаданных и данных`,
      },
      {
        spotlight: ['client'],
        label: 'Результат в форме',
        detail: 'Один пользователь — без конкуренции; несколько — через утилиты синхронизации',
        packet: 'up',
        code: `Для Каждого Строка Из Результат.Выгрузить() Цикл
    // отображение в таблице формы
КонецЦикла;`,
      },
    ],
  },
];

export const TRANSACTION_STEPS = [
  {
    id: 'begin',
    label: 'НачалоТранзакции()',
    detail: 'Все последующие изменения — в одной транзакции',
    state: 'active',
    code: 'НачалоТранзакции();',
  },
  {
    id: 'write1',
    label: 'Запись документа',
    detail: 'INSERT/UPDATE в таблицах документа',
    state: 'pending',
    code: 'ДокОбъект.Записать();',
  },
  {
    id: 'write2',
    label: 'Движения регистра',
    detail: 'Записи регистра накопления в той же транзакции',
    state: 'pending',
    code: 'Движения.ОстаткиТоваров.Записать();',
  },
  {
    id: 'commit',
    label: 'ЗафиксироватьТранзакцию()',
    detail: 'ACID: изменения становятся постоянными',
    state: 'done',
    code: 'ЗафиксироватьТранзакцию();',
  },
  {
    id: 'rollback',
    label: 'ОтменитьТранзакцию()',
    detail: 'При исключении — полный откат',
    state: 'rollback',
    code: `Попытка
    // операции
Исключение
    ОтменитьТранзакцию();
    ВызватьИсключение;
КонецПопытки;`,
  },
];

export function cloneNomenclature(rows) {
  return rows.map((r) => ({...r}));
}

export function rowToTable(row) {
  return {
    Код: row.code,
    Наименование: row.name,
    Артикул: row.article,
    Активность: row.active ? 'Да' : 'Нет',
  };
}

export function runCrud(rows, opId, params = {}) {
  const hits = [];
  let message = null;
  let next = cloneNomenclature(rows);

  if (opId === 'read') {
    const {code, name, activeOnly} = params;
    next = next.filter((r) => {
      if (code && r.code !== code) return false;
      if (name && !r.name.toLowerCase().includes(String(name).toLowerCase())) return false;
      if (activeOnly && !r.active) return false;
      return true;
    });
    hits.push(...next);
    return {rows: next, hits, message};
  }

  if (opId === 'create') {
    const {code, name, article} = params;
    if (!name?.trim()) return {rows: next, hits, message: 'Заполните наименование'};
    const dup = next.some((r) => r.code === code);
    if (code && dup) return {rows: next, hits, message: `Код ${code} уже существует`};
    const newRow = {
      ref: `r${Date.now()}`,
      code: code || String(100000 + next.length + 1).padStart(6, '0'),
      name: name.trim(),
      article: article?.trim() || '',
      active: true,
    };
    next.push(newRow);
    hits.push(newRow);
    return {rows: next, hits, message};
  }

  if (opId === 'update') {
    const {ref, name, article, active} = params;
    const idx = next.findIndex((r) => r.ref === ref);
    if (idx < 0) return {rows: next, hits, message: 'Элемент не найден'};
    next[idx] = {
      ...next[idx],
      ...(name !== undefined ? {name: name.trim()} : {}),
      ...(article !== undefined ? {article: article.trim()} : {}),
      ...(active !== undefined ? {active} : {}),
    };
    hits.push(next[idx]);
    return {rows: next, hits, message};
  }

  if (opId === 'delete') {
    const {ref} = params;
    const before = next.length;
    next = next.filter((r) => r.ref !== ref);
    if (next.length === before) return {rows: next, hits, message: 'Элемент не найден'};
    return {rows: next, hits, message: 'Элемент удалён'};
  }

  return {rows: next, hits, message};
}

export function queryTextForFilter({activeOnly, nameContains}) {
  const lines = ['ВЫБРАТЬ', '    Ном.Код,', '    Ном.Наименование,', '    Ном.Артикул'];
  const where = [];
  if (activeOnly) where.push('    Ном.Активность = ИСТИНА');
  if (nameContains) where.push(`    Ном.Наименование ПОДОБНО "%${nameContains}%"`);
  lines.push('ИЗ', '    Справочник.Номенклатура КАК Ном');
  if (where.length) {
    lines.push('ГДЕ', ...where);
  }
  lines.push('УПОРЯДОЧИТЬ ПО', '    Ном.Наименование');
  return lines.join('\n');
}

export function bslForStyle(styleId, opId, params = {}) {
  const {code, name, article, ref, activeOnly} = params;
  if (styleId === 'query') {
    if (opId === 'read') {
      return queryTextForFilter({activeOnly, nameContains: name});
    }
    if (opId === 'create') {
      return `// Запрос не создаёт записи — используйте менеджер:
Элемент = Справочники.Номенклатура.СоздатьЭлемент();
Элемент.Наименование = "${name || '…'}";
Элемент.Записать();`;
    }
    return '// Для изменения/удаления — менеджер объекта или набор записей';
  }
  if (styleId === 'selection') {
    return `Выборка = Справочники.Номенклатура.Выбрать();
Пока Выборка.Следующий() Цикл
    Если ${activeOnly ? 'Выборка.Активность' : 'Истина'} Тогда
        // обработка
    КонецЕсли;
КонецЦикла;`;
  }
  const ops = {
    read: `Ссылка = Справочники.Номенклатура.НайтиПоКоду("${code || '000001'}");
Объект = Ссылка.ПолучитьОбъект();
Сообщить(Объект.Наименование);`,
    create: `Элемент = Справочники.Номенклатура.СоздатьЭлемент();
Элемент.Код = "${code || ''}";
Элемент.Наименование = "${name || ''}";
Элемент.Артикул = "${article || ''}";
Элемент.Записать();`,
    update: `Объект = Справочники.Номенклатура.ПолучитьСсылку(/* ref */).ПолучитьОбъект();
Объект.Наименование = "${name || ''}";
Объект.Записать();`,
    delete: `Объект = Справочники.Номенклатура.ПолучитьСсылку(/* ref */).ПолучитьОбъект();
Объект.Удалить();`,
  };
  return ops[opId] ?? ops.read;
}

export function sqlForOp(opId, params, storageId = 'server') {
  if (storageId === 'file') {
    return '-- В файловом режиме SQL не уходит наружу;\n-- платформа читает таблицы внутри .1CD';
  }
  const table = '_ReferenceNomenclature';
  const ops = {
    read: `SELECT _Code, _Description, _Fld_article
FROM ${table}
WHERE _Marked = FALSE${params.activeOnly ? '\n  AND _Fld_active = TRUE' : ''};`,
    create: `INSERT INTO ${table} (_Code, _Description, ...)
VALUES ('${params.code || '000004'}', '${params.name || ''}', ...);`,
    update: `UPDATE ${table}
SET _Description = '${params.name || ''}'
WHERE _IDRRef = ...;`,
    delete: `UPDATE ${table} SET _Marked = TRUE WHERE _IDRRef = ...;`,
  };
  return ops[opId] ?? ops.read;
}

export function runQuery(rows, {activeOnly, nameContains}) {
  let filtered = cloneNomenclature(rows);
  if (activeOnly) filtered = filtered.filter((r) => r.active);
  if (nameContains?.trim()) {
    const q = nameContains.trim().toLowerCase();
    filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
  }
  filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  return filtered;
}

export function simulatePostDocument(stockRows, docLines) {
  const next = stockRows.map((s) => ({...s}));
  for (const line of docLines) {
    const row = next.find((s) => s.item === line.item && s.warehouse === line.warehouse);
    if (row) row.qty += line.qty;
    else next.push({warehouse: line.warehouse, item: line.item, qty: line.qty});
  }
  return next;
}

export const DEMO_DOC_LINES = [
  {warehouse: 'Основной', item: 'Клавиатура', qty: 10},
];
