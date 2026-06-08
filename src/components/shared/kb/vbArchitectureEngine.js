/** Данные для VbArchitecturePlay — статья visual-basic/3. */

export const TABS = [
  {id: 'ecosystem', label: 'Экосистема'},
  {id: 'structure', label: 'Структура проекта'},
  {id: 'graph', label: 'Граф сборки'},
  {id: 'build', label: 'Сборка и запуск'},
  {id: 'refs', label: 'Библиотеки и модули'},
];

export const GENERATIONS = [
  {
    id: 'vb6',
    label: 'VB 6 / COM',
    accent: '#0078d4',
    tagline: 'Событийная модель, p-code/нативный EXE, реестр Windows, MSVBVM60.DLL',
  },
  {
    id: 'vbnet',
    label: 'VB.NET / CLR',
    accent: '#512bd4',
    tagline: 'ООП, IL-сборки, MSBuild, NuGet, WinForms · WPF · ASP.NET',
  },
];

export const ECOSYSTEM_BY_ERA = {
  vb6: [
    {
      id: 'ide',
      tag: 'IDE',
      label: 'Visual Basic 6 IDE',
      color: '#0078d4',
      icon: '🖥',
      items: ['Конструктор форм', 'Project Explorer', 'Object Browser'],
      detail:
        'Визуальная сборка UI: перетаскивание контролов на Form, двойной клик создаёт обработчик события. Связь событие→процедура генерируется средой автоматически.',
    },
    {
      id: 'project',
      tag: 'Проект',
      label: 'Файлы .vbp · .frm · .bas',
      color: '#0ea5e9',
      icon: '📁',
      items: ['Form (.frm + .frx)', 'Module (.bas)', 'Class Module (.cls)'],
      detail:
        'Проект — линейный набор файлов без пространств имён. Form хранит UI и код формы; Module — глобальные процедуры; Class Module — инкапсуляция без наследования.',
    },
    {
      id: 'com',
      tag: 'COM',
      label: 'Компоненты и OCX',
      color: '#8b5cf6',
      icon: '🔗',
      items: ['ActiveX / OCX', 'ADO · DAO', 'References в .vbp'],
      detail:
        'Внешние библиотеки подключаются через References: типовая библиотека (TLB) и ProgID. Развёртывание требует регистрации COM в реестре — риск DLL Hell.',
    },
    {
      id: 'runtime',
      tag: 'Runtime',
      label: 'MSVBVM60 · Win32',
      color: '#10b981',
      icon: '⚙',
      items: ['p-code или Native EXE', 'Очередь сообщений Windows', 'Reference counting'],
      detail:
        'Исполняемый файл вызывает MSVBVM60.DLL (p-code) или содержит нативный код. Память COM-объектов освобождается при счётчике ссылок = 0; утечки — частая проблема legacy.',
    },
    {
      id: 'deploy',
      tag: 'Развёртывание',
      label: 'Setup · реестр',
      color: '#f59e0b',
      icon: '📦',
      items: ['Inno Setup · InstallShield', 'regsvr32 для OCX', 'MDAC / Jet'],
      detail:
        'Установщик копирует EXE, регистрирует OCX, проверяет наличие VB6 Runtime. Зависимости жёстко привязаны к версии Windows и зарегистрированным CLSID.',
    },
  ],
  vbnet: [
    {
      id: 'ide',
      tag: 'IDE',
      label: 'Visual Studio',
      color: '#512bd4',
      icon: '🖥',
      items: ['WinForms Designer', 'WPF + XAML', 'Solution Explorer'],
      detail:
        'Единая среда для VB.NET, C# и F#. Дизайнер форм генерирует partial class; для WPF разметка в XAML, логика на VB в code-behind или ViewModel.',
    },
    {
      id: 'project',
      tag: 'Проект',
      label: 'MSBuild · .vbproj',
      color: '#6366f1',
      icon: '📁',
      items: ['.vb исходники', 'My Project', 'Embedded resources'],
      detail:
        'XML-проект MSBuild: TargetFramework, список Compile/EmbeddedResource, ссылки на сборки. Пространства имён предотвращают конфликты имён между файлами.',
    },
    {
      id: 'packages',
      tag: 'Пакеты',
      label: 'NuGet · BCL',
      color: '#10b981',
      icon: '📦',
      items: ['PackageReference', 'Entity Framework', 'System.Text.Json'],
      detail:
        'Зависимости версионируются в .csproj/.vbproj и восстанавливаются в obj/. Базовые типы — в BCL; прикладные библиотеки — с nuget.org без регистрации в реестре.',
    },
    {
      id: 'clr',
      tag: 'CLR',
      label: 'Сборки · IL · JIT',
      color: '#0ea5e9',
      icon: '⚙',
      items: ['.exe / .dll assembly', 'MSIL + metadata', 'Garbage Collector'],
      detail:
        'Компилятор vbc/roslyn эмитирует IL в PE-файл. CLR загружает сборку, JIT компилирует методы в нативный код. GC освобождает управляемую кучу; IDisposable — неуправляемые ресурсы.',
    },
    {
      id: 'ui',
      tag: 'UI',
      label: 'WinForms · WPF · ASP.NET',
      color: '#ef4444',
      icon: '🎨',
      items: ['System.Windows.Forms', 'WPF + MVVM', 'ASP.NET Core'],
      detail:
        'WinForms — обёртка Win32-контролов, событийная модель как в VB6. WPF — векторный UI, привязка данных. ASP.NET — HTTP-конвейер, контроллеры, DI-контейнер.',
    },
    {
      id: 'interop',
      tag: 'Интеграция',
      label: 'Interop · HTTP',
      color: '#ec4899',
      icon: '🌐',
      items: ['COM Interop (RCW/CCW)', 'HttpClient · gRPC', 'REST + JSON'],
      detail:
        'Legacy COM доступен через обёртки RCW. Современная интеграция — HTTP API, Entity Framework, микросервисы без привязки к реестру Windows.',
    },
  ],
};

export const NODE_TYPE_META = {
  entry: {label: 'Точка входа', stroke: '#6366f1'},
  app: {label: 'Прикладной слой', stroke: '#10b981'},
  framework: {label: 'Фреймворк / BCL', stroke: '#0ea5e9'},
  package: {label: 'NuGet / COM', stroke: '#ec4899'},
  lazy: {label: 'Async / фон', stroke: '#f59e0b', dash: '6 4'},
};

export const DEP_GRAPH_BY_ERA = {
  vb6: {
    nodes: [
      {id: 'main', label: 'Sub Main / Form1', type: 'entry', x: 200, y: 22},
      {id: 'orders', label: 'frmOrders', type: 'app', x: 95, y: 78},
      {id: 'modDb', label: 'modDatabase.bas', type: 'app', x: 305, y: 78},
      {id: 'clsOrder', label: 'clsOrder.cls', type: 'app', x: 200, y: 128},
      {id: 'ado', label: 'ADODB.Connection', type: 'package', x: 95, y: 188},
      {id: 'grid', label: 'MSFlexGrid.ocx', type: 'package', x: 305, y: 188},
      {id: 'excel', label: 'Excel.Application', type: 'package', x: 200, y: 218},
    ],
    edges: [
      ['main', 'orders'],
      ['main', 'modDb'],
      ['orders', 'clsOrder'],
      ['modDb', 'ado'],
      ['orders', 'grid'],
      ['modDb', 'excel'],
    ],
    defaultOff: [],
    hint:
      'VB6: форма вызывает класс-модуль; modDatabase тянет ADO и автоматизацию Office через COM References в .vbp.',
  },
  vbnet: {
    nodes: [
      {id: 'main', label: 'Sub Main / MyApplication', type: 'entry', x: 200, y: 22},
      {id: 'form', label: 'Form1.vb', type: 'app', x: 120, y: 78},
      {id: 'svc', label: 'OrderService.vb', type: 'app', x: 280, y: 78},
      {id: 'ef', label: 'EntityFrameworkCore', type: 'package', x: 80, y: 148},
      {id: 'http', label: 'HttpClient (NuGet)', type: 'package', x: 200, y: 148},
      {id: 'winforms', label: 'System.Windows.Forms', type: 'framework', x: 320, y: 148},
      {id: 'job', label: 'BackgroundService', type: 'lazy', x: 200, y: 198},
      {id: 'host', label: 'Microsoft.Extensions.Hosting', type: 'package', x: 320, y: 210},
    ],
    edges: [
      ['main', 'form'],
      ['main', 'svc'],
      ['form', 'winforms'],
      ['svc', 'ef'],
      ['svc', 'http'],
      ['main', 'job'],
      ['job', 'host'],
      ['job', 'ef'],
    ],
    defaultOff: ['job'],
    hint:
      'VB.NET: WinForms-форма наследует Form; сервис получает EF и HttpClient из DI. Включите фоновую службу — появятся Hosting и связь с БД.',
  },
};

export const ARCH_PRESETS_BY_ERA = {
  vb6: [
    {
      id: 'vb6-desktop',
      label: 'VB6 Desktop',
      toolchain: 'IDE VB6 · References · p-code EXE · MSVBVM60',
      tree: [
        {
          type: 'dir',
          path: 'LegacyCRM',
          children: [
            {type: 'file', path: 'LegacyCRM/Project1.vbp', role: 'Файл проекта', hint: 'Список форм, модулей, References (COM), Version Info'},
            {type: 'file', path: 'LegacyCRM/frmMain.frm', role: 'Главная форма', hint: 'UI + код формы; Begin…End, обработчики Command1_Click'},
            {type: 'file', path: 'LegacyCRM/modGlobals.bas', role: 'Стандартный модуль', hint: 'Public Sub InitApp(), глобальные константы'},
            {type: 'file', path: 'LegacyCRM/clsCustomer.cls', role: 'Class Module', hint: 'Свойства и методы без наследования; Implements для интерфейсов'},
            {type: 'file', path: 'LegacyCRM/MSCOMCTL.OCX', role: 'ActiveX control', hint: 'Регистрация regsvr32; зависимость установщика'},
          ],
        },
      ],
    },
  ],
  vbnet: [
    {
      id: 'winforms',
      label: 'WinForms',
      toolchain: 'SDK-style .vbproj · NuGet · Application.Run',
      tree: [
        {
          type: 'dir',
          path: 'OrdersWin',
          children: [
            {type: 'file', path: 'OrdersWin/OrdersWin.vbproj', role: 'MSBuild-проект', hint: 'TargetFramework, PackageReference, RootNamespace'},
            {type: 'file', path: 'OrdersWin/Program.vb', role: 'Точка входа', hint: 'Sub Main → Application.Run(New Form1)'},
            {
              type: 'dir',
              path: 'OrdersWin/Forms',
              children: [
                {type: 'file', path: 'OrdersWin/Forms/Form1.vb', role: 'Форма', hint: 'Partial class; Handles Button1.Click'},
                {type: 'file', path: 'OrdersWin/Forms/Form1.Designer.vb', role: 'Дизайнер', hint: 'InitializeComponent — генерируется IDE'},
              ],
            },
            {
              type: 'dir',
              path: 'OrdersWin/Services',
              children: [
                {type: 'file', path: 'OrdersWin/Services/OrderService.vb', role: 'Бизнес-логика', hint: 'Инжектируется или создаётся в форме'},
              ],
            },
            {type: 'file', path: 'OrdersWin/My Project/Resources.resx', role: 'Ресурсы', hint: 'My.Resources для строк и изображений в сборке'},
          ],
        },
      ],
    },
    {
      id: 'wpf',
      label: 'WPF + MVVM',
      toolchain: 'XAML UI · code-behind / ViewModel на VB',
      tree: [
        {
          type: 'dir',
          path: 'WpfApp',
          children: [
            {type: 'file', path: 'WpfApp/WpfApp.vbproj', role: 'UseWPF=true', hint: 'SDK включает ApplicationDefinition и Page (XAML)'},
            {type: 'file', path: 'WpfApp/MainWindow.xaml', role: 'Разметка', hint: 'Grid, Button, Binding к ViewModel'},
            {type: 'file', path: 'WpfApp/MainWindow.xaml.vb', role: 'Code-behind', hint: 'Минимум логики; основное — в ViewModel'},
            {type: 'file', path: 'WpfApp/ViewModels/MainViewModel.vb', role: 'MVVM', hint: 'INotifyPropertyChanged, команды ICommand'},
          ],
        },
      ],
    },
    {
      id: 'aspnet',
      label: 'ASP.NET Core',
      toolchain: 'Kestrel · DI · Controllers на VB',
      tree: [
        {
          type: 'dir',
          path: 'ApiHost',
          children: [
            {type: 'file', path: 'ApiHost/ApiHost.vbproj', role: 'Web SDK', hint: 'Microsoft.NET.Sdk.Web, PackageReference EF Core'},
            {type: 'file', path: 'ApiHost/Program.vb', role: 'Host builder', hint: 'WebApplication.CreateBuilder, AddControllers, Run'},
            {
              type: 'dir',
              path: 'ApiHost/Controllers',
              children: [
                {type: 'file', path: 'ApiHost/Controllers/OrdersController.vb', role: 'API', hint: 'HTTP GET/POST; constructor injection сервисов'},
              ],
            },
            {type: 'file', path: 'ApiHost/appsettings.json', role: 'Конфиг', hint: 'ConnectionStrings, логирование — без реестра'},
          ],
        },
      ],
    },
  ],
};

export const BUILD_STEPS_BY_ERA = {
  vb6: [
    {
      id: 'sources',
      label: 'Исходники',
      cmd: 'Project1.vbp  →  frm*.frm, *.bas, *.cls',
      detail: 'IDE хранит ссылки на файлы и COM References. Свойства контролов — в .frm; бинарные ресурсы формы — .frx.',
    },
    {
      id: 'compile',
      label: 'Make EXE',
      cmd: 'File → Make Project1.exe  (p-code | Native Code)',
      detail: 'Компилятор VB6 генерирует EXE. p-code требует MSVBVM60 на целевой машине; Native встраивает часть runtime в EXE.',
    },
    {
      id: 'comreg',
      label: 'COM / OCX',
      cmd: 'regsvr32 MSCOMCTL.OCX  ·  ADO в References',
      detail: 'ActiveX должны быть зарегистрированы. ADO — через "References" к msadoXX.dll; без регистрации типовая библиотека недоступна.',
    },
    {
      id: 'run',
      label: 'Запуск',
      cmd: 'Load Form1  →  Show  →  цикл сообщений Win32',
      detail: 'Sub Main или автозагрузка стартовой формы. События UI попадают в очередь; обработчики выполняются синхронно в UI-потоке.',
    },
    {
      id: 'deploy',
      label: 'Setup',
      cmd: 'Setup.exe + VB6 Runtime + MDAC + ваши OCX',
      detail: 'Установщик копирует EXE, проверяет runtime, регистрирует компоненты. Обновление — переустановка или патч версий DLL.',
    },
  ],
  vbnet: [
    {
      id: 'restore',
      label: 'Restore',
      cmd: 'dotnet restore  →  obj/project.assets.json',
      detail: 'NuGet подтягивает PackageReference в кэш. Версии фиксируются в lock или assets — воспроизводимая сборка на CI.',
    },
    {
      id: 'compile',
      label: 'Build IL',
      cmd: 'vbc / dotnet build  →  bin/Debug/net8.0/App.dll',
      detail: 'Roslyn компилирует .vb в MSIL внутри сборки с метаданными типов, ссылок и embedded resources.',
    },
    {
      id: 'publish',
      label: 'Publish',
      cmd: 'dotnet publish -c Release  (framework-dependent | self-contained)',
      detail: 'Публикация копирует runtime (при self-contained) или только приложение + зависимости. ReadyToRun/AOT — опционально.',
    },
    {
      id: 'clr',
      label: 'CLR load',
      cmd: 'Assembly.Load  →  JIT  →  нативный код',
      detail: 'Загрузчик читает манифест, разрешает ссылки на BCL и NuGet-сборки. Первый вызов метода компилируется JIT.',
    },
    {
      id: 'run',
      label: 'Run',
      cmd: 'WinForms: Application.Run  |  Web: Kestrel + middleware',
      detail: 'Sub Main настраивает UI или host. GC и финализаторы при завершении; IDisposable для файлов и COM Interop.',
    },
  ],
};

export const REF_SYSTEMS_BY_ERA = {
  vb6: [
    {
      id: 'references',
      label: 'Project References',
      era: 'VB6 · COM',
      color: '#0078d4',
      syntax: `' Project → References (checkbox)
' Microsoft ActiveX Data Objects 2.x Library
' Microsoft Excel 16.0 Object Library

Dim conn As New ADODB.Connection
conn.Open "Provider=SQLOLEDB;..."`,
      traits: ['Типовая библиотека (TLB)', 'Early / Late binding', 'ProgID + CLSID в реестре', 'Версия привязана к установленному Office/MDAC'],
      tools: 'Object Browser, regsvr32, Dependency Walker',
      use: 'ADO, Excel Automation, сторонние OCX',
    },
    {
      id: 'components',
      label: 'Components (OCX)',
      era: 'ActiveX на форме',
      color: '#8b5cf6',
      syntax: `' Project → Components → MSCOMCTL.OCX
' На форме: MSFlexGrid, CommonDialog

Private Sub Form_Load()
  MSFlexGrid1.Col = 0
End Sub`,
      traits: ['Визуальные и невизуальные OCX', 'Лицензирование design-time', 'Должны быть на целевой машине'],
      tools: 'regsvr32, установщик с redistributable',
      use: 'Таблицы, диалоги, графики в legacy UI',
    },
    {
      id: 'declare',
      label: 'Declare Win32 API',
      era: 'DllImport предшественник',
      color: '#f59e0b',
      syntax: `Private Declare Function GetTickCount Lib "kernel32" () As Long

' Прямой вызов Win32 без COM-обёртки`,
      traits: ['Ansi/Unicode Declare', 'Ручные типы и структуры', 'Опасность x86/x64'],
      tools: 'MSDN Win32, Alias для имён',
      use: 'Низкоуровневые API, когда нет COM-обёртки',
    },
  ],
  vbnet: [
    {
      id: 'nuget',
      label: 'NuGet PackageReference',
      era: 'Современный стандарт',
      color: '#512bd4',
      syntax: `<!-- OrdersWin.vbproj -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
<PackageReference Include="Newtonsoft.Json" Version="13.0.3" />`,
      traits: ['Семантическое версионирование', 'Транзитивные зависимости', 'Без реестра', 'Central Package Management в крупных решениях'],
      tools: 'dotnet add package, Visual Studio NuGet UI',
      use: 'EF Core, Polly, Serilog, любые библиотеки .NET',
    },
    {
      id: 'projectref',
      label: 'Project / Assembly Reference',
      era: 'Многослойные решения',
      color: '#10b981',
      syntax: `<ProjectReference Include="..\Orders.Core\Orders.Core.vbproj" />

Imports Orders.Core.Services`,
      traits: ['Сборка за сборкой', 'Чёткие границы слоёв', 'Компиляция в одном solution'],
      tools: 'Solution Explorer, dotnet sln add',
      use: 'Domain, Infrastructure, UI в отдельных проектах',
    },
    {
      id: 'cominterop',
      label: 'COM Interop',
      era: 'Мост к legacy',
      color: '#ec4899',
      syntax: `' Add Reference → COM → Excel
Dim app As New Microsoft.Office.Interop.Excel.Application
' RCW освобождает COM; используйте Marshal.ReleaseComObject при циклах`,
      traits: ['Primary Interop Assembly (PIA)', 'RCW / CCW', 'x86 для 32-bit COM', 'Осторожно с утечками COM'],
      tools: 'tlbimp, Embed Interop Types',
      use: 'Office, старые DLL без .NET SDK',
    },
  ],
};

export function flattenArchFiles(tree, acc = []) {
  for (const node of tree) {
    if (node.type === 'file') acc.push(node);
    if (node.children) flattenArchFiles(node.children, acc);
  }
  return acc;
}

export function getArchPresets(era) {
  return ARCH_PRESETS_BY_ERA[era] ?? ARCH_PRESETS_BY_ERA.vbnet;
}

export function getArchPreset(era, id) {
  const list = getArchPresets(era);
  return list.find((p) => p.id === id) ?? list[0];
}

export function activeDepEdges(era, enabledNodeIds) {
  const {edges} = DEP_GRAPH_BY_ERA[era] ?? DEP_GRAPH_BY_ERA.vbnet;
  return edges.filter(([from, to]) => enabledNodeIds.has(from) && enabledNodeIds.has(to));
}

export function defaultEnabledNodes(era) {
  const graph = DEP_GRAPH_BY_ERA[era] ?? DEP_GRAPH_BY_ERA.vbnet;
  const off = new Set(graph.defaultOff ?? []);
  return new Set(graph.nodes.filter((n) => !off.has(n.id)).map((n) => n.id));
}

export function bundleSummary(era, enabledNodeIds) {
  const graph = DEP_GRAPH_BY_ERA[era] ?? DEP_GRAPH_BY_ERA.vbnet;
  const pkgCount = graph.nodes.filter((n) => n.type === 'package' && enabledNodeIds.has(n.id)).length;
  if (era === 'vb6') {
    return {
      chips: [
        'References в .vbp',
        `COM/ADO узлов: ${pkgCount}`,
        enabledNodeIds.has('excel') ? 'Late binding Excel' : 'Без Office interop',
        'Развёртывание: Setup + regsvr32',
      ],
    };
  }
  const hasBg = enabledNodeIds.has('job');
  return {
    chips: [
      'NuGet restore → bin/',
      `Пакетов в графе: ${pkgCount}`,
      hasBg ? 'Host + BackgroundService' : 'Только UI-поток',
      'Target: net8.0-windows / net8.0',
    ],
  };
}
