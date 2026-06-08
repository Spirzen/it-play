/** Данные для PascalEcosystemPlay — статья 5-16-starye-yazyki/Pascal/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и деплой'},
  {id: 'modules', label: 'Модули и uses'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'dialects',
    tag: 'Диалекты',
    label: 'ISO · FPC · Object Pascal',
    color: '#003399',
    icon: '📜',
    items: ['ISO 7185 — program без unit', 'Free Pascal / Lazarus', 'Delphi (Embarcadero)'],
    detail:
      'Стандарт ISO задаёт скелет program … begin … end. Turbo Pascal, FPC и Delphi добавили unit, uses, классы и компоненты. В одном проекте не смешивайте диалекты без проверки компилятора.',
  },
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'Компилятор и IDE',
    color: '#2563eb',
    icon: '⚙',
    items: ['fpc · lazbuild', 'dcc32/dcc64 (Delphi)', 'Lazarus · RAD Studio'],
    detail:
      'FPC компилирует .pas → .o/.ppu, линкует исполняемый файл. Lazarus — визуальный IDE поверх LCL. Delphi — нативная сборка под Windows/macOS/iOS/Android через MSBuild и dproj.',
  },
  {
    id: 'rtl',
    tag: 'RTL',
    label: 'Системные модули',
    color: '#0d9488',
    icon: '📚',
    items: ['System · SysUtils', 'Classes · TypInfo', 'Math · DateUtils'],
    detail:
      'System — базовые типы и встроенные процедуры. SysUtils — строки, файлы, исключения. Classes — TObject, списки, потоки. Подключаются через uses в program или unit.',
  },
  {
    id: 'ui',
    tag: 'UI-библиотеки',
    label: 'VCL · FMX · LCL',
    color: '#dc2626',
    icon: '🖼',
    items: ['VCL (Delphi Windows)', 'FMX (кроссплатформа)', 'LCL (Lazarus)'],
    detail:
      'VCL — компоненты TForm, TButton, DataModule. FMX — FireMonkey для мобильных и desktop. LCL повторяет идею VCL, но рисует через виджеты ОС (Win32, GTK, Cocoa).',
  },
  {
    id: 'packages',
    tag: 'Пакеты',
    label: 'Библиотеки и фреймворки',
    color: '#7c3aed',
    icon: '📦',
    items: ['GetIt · OPM (Lazarus)', 'Horse · mORMot', 'Zeos · Indy'],
    detail:
      'Delphi: GetIt и .bpl design-time/runtime packages. Lazarus: Online Package Manager. Веб — Horse, Brook; ORM — mORMot, FireDAC. Зависимости фиксируются в .lpi / .dproj, не в едином "npm для Pascal".',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['program / library', 'unit interface · implementation', 'Forms · DataModule'],
    detail:
      'Консоль: один .lpr + units. Desktop: MainForm + модули бизнес-логики. interface/implementation скрывает детали; uses связывает program, units и RTL.',
  },
];

export const DEP_NODES = [
  {id: 'program', label: 'program Shop.lpr', type: 'app', x: 200, y: 24},
  {id: 'mainform', label: 'MainForm.pas', type: 'form', x: 200, y: 88},
  {id: 'utils', label: 'unit Utils', type: 'unit', x: 70, y: 88},
  {id: 'dm', label: 'DataModule1', type: 'lazy', x: 330, y: 88},
  {id: 'sysutils', label: 'SysUtils', type: 'rtl', x: 50, y: 168},
  {id: 'classes', label: 'Classes', type: 'rtl', x: 130, y: 168},
  {id: 'forms', label: 'Forms / LCL', type: 'rtl', x: 210, y: 168},
  {id: 'zeos', label: 'ZeosLib', type: 'pkg', x: 290, y: 168},
  {id: 'horse', label: 'Horse (HTTP)', type: 'pkg', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['program', 'mainform'],
  ['program', 'utils'],
  ['program', 'dm'],
  ['mainform', 'utils'],
  ['mainform', 'forms'],
  ['mainform', 'sysutils'],
  ['utils', 'sysutils'],
  ['utils', 'classes'],
  ['dm', 'zeos'],
  ['dm', 'classes'],
  ['dm', 'sysutils'],
  ['program', 'horse'],
  ['horse', 'utils'],
  ['horse', 'sysutils'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа (program)', stroke: '#6366f1'},
  form: {label: 'Форма / UI', stroke: '#dc2626'},
  unit: {label: 'Свой unit', stroke: '#10b981'},
  lazy: {label: 'DataModule (опционально)', stroke: '#f59e0b', dash: '6 4'},
  rtl: {label: 'RTL / LCL', stroke: '#0d9488'},
  pkg: {label: 'Сторонний пакет', stroke: '#7c3aed'},
};

export const ARCH_PRESETS = [
  {
    id: 'lazarus-lcl',
    label: 'Lazarus + LCL',
    toolchain: 'Free Pascal · LCL · .lpi · lazbuild',
    tree: [
      {
        type: 'dir',
        path: 'shop-app',
        children: [
          {type: 'file', path: 'shop-app/shop.lpi', role: 'Проект Lazarus', hint: 'Пути к .lpr, units, LCL widgets, compiler options'},
          {type: 'file', path: 'shop-app/shop.lpr', role: 'program', hint: 'Application.Initialize; CreateForm(TMainForm); Run'},
          {type: 'file', path: 'shop-app/shop.lps', role: 'Сессия IDE', hint: 'Открытые файлы, breakpoints — не в git'},
          {
            type: 'dir',
            path: 'shop-app/lib',
            role: 'Скомпилированные unit',
            children: [
              {type: 'file', path: 'shop-app/lib/x86_64-linux/utils.ppu', role: '.ppu / .o', hint: 'Результат компиляции unit — пересборка при изменении interface'},
            ],
          },
          {
            type: 'dir',
            path: 'shop-app/src',
            children: [
              {type: 'file', path: 'shop-app/src/mainform.pas', role: 'Форма', hint: 'TForm, uses Utils; обработчики OnClick'},
              {type: 'file', path: 'shop-app/src/mainform.lfm', role: 'DFM-подобный', hint: 'Свойства компонентов в текстовом виде (LFM)'},
              {
                type: 'dir',
                path: 'shop-app/src/units',
                children: [
                  {type: 'file', path: 'shop-app/src/units/utils.pas', role: 'unit Utils', hint: 'interface — публичные типы; implementation — логика'},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'delphi-vcl',
    label: 'Delphi VCL',
    toolchain: 'dcc32 · VCL · .dproj · MSBuild',
    tree: [
      {
        type: 'dir',
        path: 'CRM',
        children: [
          {type: 'file', path: 'CRM/CRM.dproj', role: 'Проект Delphi', hint: 'Target platforms, packages, search path, deploy'},
          {type: 'file', path: 'CRM/CRM.dpr', role: 'program', hint: 'uses Forms, MainForm in MainForm.pas; Application.Run'},
          {
            type: 'dir',
            path: 'CRM/Source',
            children: [
              {type: 'file', path: 'CRM/Source/MainForm.pas', role: 'TForm', hint: '{$R *.dfm} — связь с MainForm.dfm'},
              {type: 'file', path: 'CRM/Source/MainForm.dfm', role: 'Форма дизайнера', hint: 'object Form1: TForm1 — свойства и иерархия компонентов'},
              {type: 'file', path: 'CRM/Source/DataModule1.pas', role: 'DataModule', hint: 'TFDConnection, TFDQuery — слой данных отдельно от UI'},
              {type: 'file', path: 'CRM/Source/Services.Order.pas', role: 'Сервис', hint: 'Класс TOrderService — бизнес-логика без VCL на форме'},
            ],
          },
          {
            type: 'dir',
            path: 'CRM/Packages',
            children: [
              {type: 'file', path: 'CRM/Packages/SharedUtils.bpl', role: 'Runtime package', hint: 'Повторное использование между проектами команды'},
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'fpc-console',
    label: 'FPC консоль + units',
    toolchain: 'fpc · без GUI · Makefile',
    tree: [
      {
        type: 'dir',
        path: 'calc-cli',
        children: [
          {type: 'file', path: 'calc-cli/Makefile', role: 'Сборка', hint: 'fpc -Fuunits calc.lpr'},
          {type: 'file', path: 'calc-cli/calc.lpr', role: 'program', hint: 'uses MathUtils, SysUtils; begin … end.'},
          {
            type: 'dir',
            path: 'calc-cli/units',
            children: [
              {type: 'file', path: 'calc-cli/units/mathutils.pas', role: 'unit', hint: 'interface function Factorial; implementation'},
            ],
          },
          {type: 'file', path: 'calc-cli/calc', role: 'Исполняемый', hint: 'Статическая линковка RTL в бинарник'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'compile-unit',
    label: 'Компиляция unit',
    cmd: 'fpc -Fuunits units/mathutils.pas\n# → mathutils.ppu + mathutils.o',
    detail:
      'Сначала компилируются зависимости из uses. Изменение секции interface unit заставляет пересобрать всех, кто его подключает.',
  },
  {
    id: 'link-program',
    label: 'Сборка program',
    cmd: 'fpc -Fuunits calc.lpr\n# или: lazbuild shop.lpi --build-mode=Release',
    detail:
      'Компилятор линкует .o/.ppu в исполняемый файл. Lazarus вызывает fpc с путями из .lpi. Delphi: MSBuild CRM.dproj /p:Config=Release.',
  },
  {
    id: 'packages',
    label: 'Пакеты',
    cmd: '# Lazarus OPM\nfpcupdeluxe --install zeos\n\n# Delphi GetIt\n# REST Client Components → .bpl в Library Path',
    detail:
      'Сторонние библиотеки добавляют пути поиска (-Fu) и новые имена в uses. Design-time пакеты регистрируют компоненты на палитре IDE.',
  },
  {
    id: 'test',
    label: 'Проверка',
    cmd: 'fpc -viwn testrunner.lpr\n# Delphi: DUnitX / TestInsight в IDE',
    detail:
      'Юнит-тесты — отдельный program или FPC test harness. Регрессия по interface: контракт модуля не ломать без версии API.',
  },
  {
    id: 'deploy',
    label: 'Деплой',
    cmd: '# Windows: CRM.exe + bpl/runtime DLL\n# Linux: ldd shop; AppImage\n# Mobile (FMX): deploy via PAServer',
    detail:
      'VCL — чаще один .exe + MS runtime. FMX — платформенные SDK и provision. Lazarus LCL — зависимости GTK на Linux.',
  },
];

export const MODULE_MODELS = [
  {
    id: 'iso',
    label: 'ISO 7185',
    era: 'Учебный · стандарт',
    color: '#003399',
    syntax: `program Example;
const Max = 100;
var x: integer;
begin
  x := 5;
  writeln(sqrt(x))
end.`,
    traits: ['Без unit и uses между файлами', 'Один файл или include реализации', 'writeln, sqrt — от компилятора'],
    tools: 'fpc -Miso · учебные компиляторы',
    use: 'Алгоритмы, экзамены, сравнение с историческим Pascal',
  },
  {
    id: 'unit-uses',
    label: 'unit + uses',
    era: 'FPC · Turbo Pascal',
    color: '#10b981',
    syntax: `unit MathUtils;
interface
  function Factorial(n: Integer): Int64;
implementation
  ...
end.

program Calc;
uses MathUtils, SysUtils;
begin
  WriteLn(Factorial(5));
end.`,
    traits: ['interface — публичный контракт', 'implementation — скрытая логика', 'Цепочка uses разрешается компилятором'],
    tools: 'fpc · lazbuild · fpdoc',
    use: 'Консоль, утилиты, серверы на FPC',
  },
  {
    id: 'component',
    label: 'Формы и компоненты',
    era: 'Delphi · Lazarus',
    color: '#dc2626',
    syntax: `// MainForm.pas
uses Classes, Forms, Utils;

type
  TForm1 = class(TForm)
    Button1: TButton;
    procedure Button1Click(Sender: TObject);
  end;

// MainForm.dfm / .lfm — дерево компонентов`,
    traits: ['DFM/LFM отделён от .pas', 'События OnClick → методы формы', 'DataModule для БД и API'],
    tools: 'RAD Studio · Lazarus designer',
    use: 'Desktop GUI, внутренние корпоративные приложения',
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
  const hasDm = enabledNodeIds.has('dm');
  const hasHorse = enabledNodeIds.has('horse');
  const pkgCount = DEP_NODES.filter((n) => n.type === 'pkg' && enabledNodeIds.has(n.id)).length;
  const artifacts = [
    hasHorse ? 'Shop.exe + HTTP listener (Horse)' : 'Shop.exe (только GUI)',
    hasDm ? 'Zeos + DataModule в рантайме' : 'без слоя БД',
    `uses RTL/пакетов: ${pkgCount + 3}`,
  ];
  return {artifacts, hasDm, hasHorse, pkgCount};
}
