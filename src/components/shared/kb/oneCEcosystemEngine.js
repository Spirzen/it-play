/** Данные для OneCEcosystemPlay — статья 5-27-1s/111. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф метаданных'},
  {id: 'structure', label: 'Сборка конфигурации'},
  {id: 'session', label: 'Проведение документа'},
  {id: 'connect', label: 'Подключение модулей'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'vendor',
    tag: 'Вендор',
    label: '1С · партнёры · облако',
    color: '#b45309',
    icon: '🏢',
    items: ['типовые конфигурации', '1С:Фреш · ITS', 'сертификация · франчайзи'],
    detail:
      'Компания "1С" выпускает платформу и продукты; партнёры внедряют, дорабатывают и сопровождают. Облако 1С:Фреш снимает задачу своей инфраструктуры у заказчика.',
  },
  {
    id: 'platform',
    tag: 'Платформа',
    label: '1С:Предприятие 8',
    color: '#d4a017',
    icon: '1С',
    items: ['клиент · сервер · СУБД', 'язык запросов · BSL', 'фоновые задания · RLS'],
    detail:
      'Среда исполнения: тонкий/толстый/веб-клиент, кластер серверов 1С, файловая или серверная БД. Компилирует модули конфигурации и выполняет бизнес-логику.',
  },
  {
    id: 'tools',
    tag: 'Инструменты',
    label: 'Конфигуратор · EDT · OneScript',
    color: '#0ea5e9',
    icon: '🛠',
    items: ['дерево метаданных', 'отладчик · сравнение', 'Git / хранилище', 'CI: Vanessa, 1testrunner'],
    detail:
      'Конфигуратор — классическая среда на Windows. EDT — проект в Eclipse для крупных команд. OneScript и утилиты сообщества автоматизируют сборку и тесты.',
  },
  {
    id: 'configs',
    tag: 'Прикладные решения',
    label: 'Конфигурации и расширения',
    color: '#10b981',
    icon: '📦',
    items: ['УТ · ERP · Бухгалтерия', 'отраслевые · региональные', 'расширения .cfe'],
    detail:
      'Конфигурация (.cf) — полный прикладной продукт. Расширение добавляет объекты и код без снятия с поддержки типовой. Внешние обработки (.epf) подключаются точечно.',
  },
  {
    id: 'integrations',
    tag: 'Интеграции',
    label: 'Обмен и API',
    color: '#8b5cf6',
    icon: '🔗',
    items: ['HTTP · OData', 'планы обмена · EnterpriseData', 'COM · внешние компоненты'],
    detail:
      'Веб-сервисы и HTTP-сервисы публикуют методы наружу. Планы обмена синхронизируют узлы. Внешние компоненты (.dll) расширяют платформу нативным кодом.',
  },
  {
    id: 'app',
    tag: 'Ваше решение',
    label: 'Метаданные и модули',
    color: '#6366f1',
    icon: '🏗',
    items: ['справочники · документы', 'регистры · отчёты', 'общие модули · подсистемы'],
    detail:
      'Разработчик описывает объекты в дереве метаданных и пишет BSL в модулях объектов, формах и общих модулях. Проведение документа двигает регистры и пишет в СУБД.',
  },
];

export const CONFIG_COMPARE = [
  {
    id: 'ut',
    label: 'УТ 11',
    scale: 3,
    custom: 4,
    cloud: 5,
    fit: 'Торговля, склад, закупки',
    color: '#10b981',
  },
  {
    id: 'erp',
    label: 'ERP 2',
    scale: 5,
    custom: 3,
    cloud: 4,
    fit: 'Производство, бюджет, казначейство',
    color: '#0ea5e9',
  },
  {
    id: 'acc',
    label: 'Бухгалтерия',
    scale: 2,
    custom: 5,
    cloud: 5,
    fit: 'Учёт, налоги, отчётность',
    color: '#d4a017',
  },
];

/** Узлы графа связей метаданных (viewBox 400×240). */
export const DEP_NODES = [
  {id: 'form', label: 'Форма документа', type: 'app', x: 200, y: 22},
  {id: 'docModule', label: 'Модуль объекта', type: 'module', x: 90, y: 88},
  {id: 'common', label: 'ОбщийМодуль', type: 'module', x: 210, y: 88},
  {id: 'extension', label: 'Расширение', type: 'lazy', x: 330, y: 88},
  {id: 'register', label: 'Регистр накопления', type: 'module', x: 210, y: 148},
  {id: 'query', label: 'Запрос → СУБД', type: 'platform', x: 70, y: 200},
  {id: 'http', label: 'HTTP-сервис', type: 'platform', x: 210, y: 200},
  {id: 'component', label: 'Внешняя компонента', type: 'platform', x: 350, y: 200},
];

export const DEP_EDGES = [
  ['form', 'docModule'],
  ['form', 'common'],
  ['form', 'extension'],
  ['docModule', 'common'],
  ['docModule', 'register'],
  ['docModule', 'extension'],
  ['common', 'register'],
  ['register', 'query'],
  ['common', 'http'],
  ['extension', 'http'],
  ['http', 'component'],
  ['query', 'component'],
];

export const NODE_TYPE_META = {
  app: {label: 'Интерфейс (форма)', stroke: '#6366f1'},
  module: {label: 'Объект метаданных', stroke: '#10b981'},
  lazy: {label: 'Расширение .cfe', stroke: '#f59e0b', dash: '6 4'},
  platform: {label: 'Механизм платформы', stroke: '#d4a017'},
};

export const ARCH_PRESETS = [
  {
    id: 'ut-monolith',
    label: 'УТ (типовая)',
    toolchain: 'Конфигуратор · CF · клиент–сервер · PostgreSQL',
    tree: [
      {
        type: 'dir',
        path: 'ut-trade',
        children: [
          {
            type: 'file',
            path: 'ut-trade/Configuration.xml',
            role: 'Корень метаданных',
            hint: 'Версия платформы, режим совместимости, подсистемы',
          },
          {
            type: 'dir',
            path: 'ut-trade/Catalogs',
            role: 'Справочники',
            children: [
              {
                type: 'file',
                path: 'ut-trade/Catalogs/Номенклатура.xml',
                role: 'Номенклатура',
                hint: 'Реквизиты, формы, модуль менеджера',
              },
              {
                type: 'file',
                path: 'ut-trade/Catalogs/Контрагенты.xml',
                role: 'Контрагенты',
                hint: 'ИНН, договоры, контактная информация',
              },
            ],
          },
          {
            type: 'dir',
            path: 'ut-trade/Documents',
            children: [
              {
                type: 'file',
                path: 'ut-trade/Documents/ПоступлениеТоваров.xml',
                role: 'Документ',
                hint: 'Табличная часть, проведение, движения по регистрам',
              },
              {
                type: 'file',
                path: 'ut-trade/Documents/ПоступлениеТоваров/Ext/ObjectModule.bsl',
                role: 'Модуль объекта',
                hint: 'ОбработкаПроведения(), ПередЗаписью()',
              },
            ],
          },
          {
            type: 'dir',
            path: 'ut-trade/AccumulationRegisters',
            children: [
              {
                type: 'file',
                path: 'ut-trade/AccumulationRegisters/ОстаткиТоваров.xml',
                role: 'Регистр',
                hint: 'Остатки и обороты — источник отчётов',
              },
            ],
          },
          {
            type: 'dir',
            path: 'ut-trade/CommonModules',
            children: [
              {
                type: 'file',
                path: 'ut-trade/CommonModules/УчетТоваровСервер.bsl',
                role: 'Общий модуль',
                hint: 'Сервер · Вызов сервера · переиспользуемая логика',
              },
            ],
          },
          {
            type: 'file',
            path: 'ut-trade/1cv8.1cd',
            role: 'ИБ (файл)',
            hint: 'Файловый режим: метаданные + данные в одном контейнере',
          },
        ],
      },
    ],
  },
  {
    id: 'cluster',
    label: 'Кластер + СУБД',
    toolchain: 'ragent · rphost · SQL Server / PostgreSQL',
    tree: [
      {
        type: 'dir',
        path: 'cluster',
        children: [
          {type: 'file', path: 'cluster/ragent.exe', role: 'Агент кластера', hint: 'Управление процессами rphost, лицензии'},
          {type: 'file', path: 'cluster/1cv8srv.ini', role: 'Параметры', hint: 'Порты, каталоги, соединение с СУБД'},
          {
            type: 'dir',
            path: 'cluster/infobases',
            children: [
              {
                type: 'file',
                path: 'cluster/infobases/ut_prod',
                role: 'Информационная база',
                hint: 'Строка подключения к PostgreSQL, публикация веб-клиента',
              },
            ],
          },
          {
            type: 'dir',
            path: 'cluster/db',
            children: [
              {
                type: 'file',
                path: 'cluster/db/postgresql.conf',
                role: 'СУБД',
                hint: 'Таблицы _Reference*, _Document* — физическое хранение',
              },
            ],
          },
          {
            type: 'dir',
            path: 'cluster/Extensions',
            children: [
              {
                type: 'file',
                path: 'cluster/Extensions/CRM_patch.cfe',
                role: 'Расширение',
                hint: 'Подключается к базе без полной выгрузки CF',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'edt',
    label: 'EDT-проект',
    toolchain: 'Eclipse · src/ · Git · CI pipeline',
    tree: [
      {
        type: 'dir',
        path: 'edt-ut',
        children: [
          {type: 'file', path: 'edt-ut/.project', role: 'EDT', hint: 'Проект 1C:Enterprise Development Tools'},
          {type: 'file', path: 'edt-ut/src/Configuration/Configuration.mdo', role: 'MDO', hint: 'Метаданные в текстовом виде для Git'},
          {
            type: 'dir',
            path: 'edt-ut/src/Documents',
            children: [
              {
                type: 'file',
                path: 'edt-ut/src/Documents/ПоступлениеТоваров/ObjectModule.bsl',
                role: 'BSL',
                hint: 'Редактор, подсветка, запуск отладки на базе',
              },
            ],
          },
          {type: 'file', path: 'edt-ut/.gitignore', role: 'Git', hint: 'Исключение build/, кэшей, локальных настроек'},
          {type: 'file', path: 'edt-ut/ci/vanessa.yml', role: 'CI', hint: 'Vanessa-automation, выгрузка CF, прогон сценариев'},
        ],
      },
    ],
  },
];

export const SESSION_FLOW_STEPS = [
  {
    id: 'ui',
    label: 'Клиент',
    cmd: 'Пользователь нажимает "Провести" на форме ПоступлениеТоваров',
    detail: 'Тонкий клиент отправляет команду на сервер 1С. Валидация на клиенте — только то, что разрешено контекстом (&НаКлиенте).',
  },
  {
    id: 'server',
    label: 'Сервер 1С',
    cmd: 'Сервер: ОбработкаПроведения() в модуле документа',
    detail: 'Выполняется BSL на сервере: формируются движения регистров, проверяются остатки, вызываются общие модули.',
  },
  {
    id: 'transaction',
    label: 'Транзакция',
    cmd: 'НачатьТранзакцию() → запись движений → ЗафиксироватьТранзакцию()',
    detail: 'При ошибке — откат всех изменений в ИБ. Блокировки данных защищают от гонок при параллельном проведении.',
  },
  {
    id: 'db',
    label: 'СУБД',
    cmd: 'INSERT в таблицы регистра _AccumRg* ; UPDATE _Document*',
    detail: 'Платформа транслирует запросы в SQL (PostgreSQL / MS SQL). Файловый режим пишет внутрь .1CD без внешней СУБД.',
  },
  {
    id: 'async',
    label: 'Фон / обмен',
    cmd: 'Регламентное задание · HTTP-сервис · план обмена',
    detail: 'После проведения могут стартовать фоновые задания: выгрузка в маркетплейс, EDI, банк-клиент.',
  },
  {
    id: 'ui-back',
    label: 'Ответ клиенту',
    cmd: 'Статус "Проведён" · обновление списков · Сообщить()',
    detail: 'Клиент получает результат сеанса; отчёты читают уже записанные движения регистров.',
  },
];

export const CONNECT_SYSTEMS = [
  {
    id: 'extension',
    label: 'Расширение',
    era: 'Поставка',
    color: '#f59e0b',
    syntax: `// Подключение в ИБ: Администрирование → Расширения
// Файл: CRM_доработки.cfe
// Новые объекты + переопределение методов типовой`,
    traits: ['Без снятия с поддержки', 'Версионирование отдельно', 'Ограничения на изменение типовых'],
    tools: 'Конфигуратор, EDT, сравнение/объединение',
    use: 'Доработка УТ/ERP под заказчика',
  },
  {
    id: 'epf',
    label: 'Внешняя обработка',
    era: 'Точечно',
    color: '#10b981',
    syntax: `// Файл .epf — открыть из меню "Файл"
// Не входит в состав конфигурации ИБ
// Общий модуль не обязателен`,
    traits: ['Быстрый прототип', 'Обмен через файлы', 'Не попадает в CF поставки'],
    tools: 'Конфигуратор, толстый клиент',
    use: 'Разовые загрузки, утилиты, отчёты "на коленке"',
  },
  {
    id: 'common',
    label: 'Общий модуль',
    era: 'В составе CF',
    color: '#d4a017',
    syntax: `// Свойства: Сервер, Клиент, Вызов сервера, Глобальный
ОбщийМодуль.УчетТоваров.ПровестиДокумент(Документ);`,
    traits: ['Переиспользование BSL', 'Контекст выполнения задаётся флагами', 'API внутри конфигурации'],
    tools: 'Конфигуратор, EDT, Sonar для BSL',
    use: 'Ядро бизнес-логики типовой и своей конфигурации',
  },
  {
    id: 'component',
    label: 'Внешняя компонента',
    era: 'Native',
    color: '#8b5cf6',
    syntax: `// ПодключитьВнешнююКомпоненту("AddInNative", ...);
// DLL/SO с COM- или Native API
// Криптография, сканеры, драйверы`,
    traits: ['Код вне BSL', 'Регистрация в макете', 'Платформенные ограничения безопасности'],
    tools: 'MSVC, документация Native API 1С',
    use: 'ККТ, ЭЦП, оборудование, нестандартные протоколы',
  },
];

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPreset(id) {
  return ARCH_PRESETS.find((p) => p.id === id) ?? ARCH_PRESETS[0];
}

export function activeDepEdges(enabledNodeIds) {
  return DEP_EDGES.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes() {
  return new Set(DEP_NODES.map((n) => n.id));
}

export function bundleSummary(enabledNodeIds) {
  const hasExtension = enabledNodeIds.has('extension');
  const platformCount = DEP_NODES.filter((n) => n.type === 'platform' && enabledNodeIds.has(n.id)).length;
  const chunks = hasExtension
    ? ['Основная CF (УТ)', 'Расширение CRM_patch.cfe', 'Внешняя компонента (опц.)']
    : ['Основная CF (УТ)', 'Только типовые объекты'];
  return {chunks, hasExtension, platformCount};
}
