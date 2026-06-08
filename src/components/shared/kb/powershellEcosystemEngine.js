/** Данные для PowerShellEcosystemPlay — статья 5-26-powershell/11. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура решения'},
  {id: 'build', label: 'Сборка и деплой'},
  {id: 'modules', label: 'Модули и манифесты'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'runtime',
    tag: 'Runtime',
    label: 'PowerShell 7 · .NET',
    color: '#012456',
    icon: '⚡',
    items: ['pwsh · .NET 8+', 'Windows PowerShell 5.1 (legacy)', 'Объекты в конвейере'],
    detail:
      'Движок на .NET выполняет скрипты и командлеты. Один синтаксис на Windows, Linux и macOS; вывод — объекты, а не текст.',
  },
  {
    id: 'host',
    tag: 'Среда',
    label: 'Терминал · IDE · профиль',
    color: '#5391fe',
    icon: '🖥',
    items: ['Windows Terminal · pwsh', 'VS Code + PowerShell extension', 'ISE (устар.) · $PROFILE'],
    detail:
      'Хост запускает сессию и подгружает профиль пользователя. Для разработки Microsoft рекомендует VS Code вместо ISE.',
  },
  {
    id: 'core',
    tag: 'Ядро',
    label: 'Командлеты · конвейер',
    color: '#6366f1',
    icon: '🔷',
    items: ['Get- · Set- · New- · Import-', 'Where-Object · ForEach-Object', 'PSProvider · remoting'],
    detail:
      'Командлеты — узкие команды с глаголом и существительным. Конвейер передаёт объекты между этапами без промежуточных файлов.',
  },
  {
    id: 'gallery',
    tag: 'Модули',
    label: 'PSGallery · Install-Module',
    color: '#10b981',
    icon: '📦',
    items: ['.psm1 · .psd1 манифест', 'Az · Microsoft.Graph', 'Pester · AWS.Tools.*'],
    detail:
      'Модуль упаковывает командлеты и функции. Install-Module кладёт пакет в $PSModulePath; Import-Module подгружает в сессию.',
  },
  {
    id: 'cloud',
    tag: 'Облако и M365',
    label: 'Azure · Graph · Power Platform',
    color: '#06b6d4',
    icon: '☁',
    items: ['Connect-AzAccount', 'Connect-MgGraph', 'ExchangeOnlineManagement', 'Dataverse / Xrm'],
    detail:
      'Официальные модули оборачивают REST API Azure, Microsoft 365 и Dynamics. Скрипты автоматизируют то, что в порталах делают вручную.',
  },
  {
    id: 'ops',
    tag: 'Операции',
    label: 'DSC · CI/CD · тесты',
    color: '#ec4899',
    icon: '⚙',
    items: ['Desired State Configuration', 'Azure DevOps · GitHub Actions', 'Pester · SecretManagement'],
    detail:
      'DSC описывает желаемое состояние узла. В пайплайнах PowerShell@2 выполняет deploy.ps1; Pester проверяет скрипты до релиза.',
  },
  {
    id: 'app',
    tag: 'Решение',
    label: 'Ваши скрипты и модули',
    color: '#f59e0b',
    icon: '🏗',
    items: ['deploy.ps1 · runbooks', 'Private/ · Public/', 'configurations · pipelines'],
    detail:
      'Прикладной слой: сценарии развёртывания, корпоративные модули, конфигурации DSC и шаги CI/CD под вашу инфраструктуру.',
  },
];

/** Узлы графа зависимостей (viewBox 400×240). */
export const DEP_NODES = [
  {id: 'script', label: 'deploy.ps1', type: 'app', x: 200, y: 22},
  {id: 'public', label: 'Public/', type: 'module', x: 70, y: 88},
  {id: 'private', label: 'Private/', type: 'module', x: 200, y: 88},
  {id: 'tests', label: 'Tests/', type: 'lazy', x: 330, y: 88},
  {id: 'az', label: 'Az', type: 'gallery', x: 55, y: 168},
  {id: 'graph', label: 'Microsoft.Graph', type: 'gallery', x: 155, y: 168},
  {id: 'pester', label: 'Pester', type: 'gallery', x: 255, y: 168},
  {id: 'dsc', label: 'PSDesiredStateConfiguration', type: 'gallery', x: 345, y: 168},
];

export const DEP_EDGES = [
  ['script', 'public'],
  ['script', 'private'],
  ['script', 'tests'],
  ['public', 'az'],
  ['private', 'az'],
  ['public', 'graph'],
  ['tests', 'pester'],
  ['private', 'dsc'],
  ['script', 'dsc'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#f59e0b'},
  module: {label: 'Функции модуля', stroke: '#10b981'},
  lazy: {label: 'Тесты (опц.)', stroke: '#f59e0b', dash: '6 4'},
  gallery: {label: 'Модуль PSGallery', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'azure-deploy',
    label: 'Azure automation',
    toolchain: 'deploy.ps1 · Az · resource group · VM',
    tree: [
      {
        type: 'dir',
        path: 'infra-azure',
        children: [
          {
            type: 'file',
            path: 'infra-azure/deploy.ps1',
            role: 'Точка входа',
            hint: 'Connect-AzAccount; New-AzResourceGroup; New-AzVm',
          },
          {
            type: 'file',
            path: 'infra-azure/Deploy.Azure.psd1',
            role: 'Манифест модуля',
            hint: 'RootModule, RequiredModules = Az.Accounts, Az.Compute',
          },
          {
            type: 'dir',
            path: 'infra-azure/Infra.Azure',
            children: [
              {
                type: 'dir',
                path: 'infra-azure/Infra.Azure/Public',
                role: 'Экспорт',
                children: [
                  {
                    type: 'file',
                    path: 'infra-azure/Infra.Azure/Public/New-AppVm.ps1',
                    role: 'Командлет-обёртка',
                    hint: 'Параметры -Name, -ResourceGroupName, -Image',
                  },
                ],
              },
              {
                type: 'dir',
                path: 'infra-azure/Infra.Azure/Private',
                role: 'Внутреннее',
                children: [
                  {
                    type: 'file',
                    path: 'infra-azure/Infra.Azure/Private/Get-AzContextSafe.ps1',
                    role: 'Хелпер',
                    hint: 'Проверка подписки перед созданием ресурсов',
                  },
                ],
              },
            ],
          },
          {
            type: 'file',
            path: 'infra-azure/azure-pipelines.yml',
            role: 'CI/CD',
            hint: 'task: PowerShell@2 · filePath: deploy.ps1 · pwsh: true',
          },
        ],
      },
    ],
  },
  {
    id: 'm365',
    label: 'Microsoft 365 / Graph',
    toolchain: 'Connect-MgGraph · пользователи · лицензии',
    tree: [
      {
        type: 'dir',
        path: 'm365-admin',
        children: [
          {
            type: 'file',
            path: 'm365-admin/Sync-Users.ps1',
            role: 'Скрипт',
            hint: 'Connect-MgGraph -Scopes User.ReadWrite.All',
          },
          {
            type: 'file',
            path: 'm365-admin/requirements.psd1',
            role: 'Зависимости сессии',
            hint: '#Requires -Modules Microsoft.Graph.Users',
          },
          {
            type: 'dir',
            path: 'm365-admin/lib',
            children: [
              {
                type: 'file',
                path: 'm365-admin/lib/Get-OnboardedUsers.ps1',
                role: 'Функция',
                hint: 'Get-MgUser -Filter ... | Select DisplayName',
              },
              {
                type: 'file',
                path: 'm365-admin/lib/Set-UserLicense.ps1',
                role: 'Лицензии',
                hint: 'Set-MgUserLicense · SKU из CSV',
              },
            ],
          },
          {
            type: 'file',
            path: 'm365-admin/Tests/User.Tests.ps1',
            role: 'Pester',
            hint: 'Mock Connect-MgGraph; Describe Sync-Users',
          },
        ],
      },
    ],
  },
  {
    id: 'dsc',
    label: 'DSC web-сервер',
    toolchain: 'configuration · MOF · LCM',
    tree: [
      {
        type: 'dir',
        path: 'dsc-web',
        children: [
          {
            type: 'file',
            path: 'dsc-web/WebServerConfig.ps1',
            role: 'Configuration',
            hint: 'configuration WebServerConfig { Node ... { WindowsFeature Web-Server } }',
          },
          {
            type: 'file',
            path: 'dsc-web/Deploy-Dsc.ps1',
            role: 'Применение',
            hint: 'WebServerConfig -OutputPath .\\mof; Start-DscConfiguration',
          },
          {
            type: 'file',
            path: 'dsc-web/WebServerConfig.mof',
            role: 'Скомпилировано',
            hint: 'MOF генерируется из блока configuration',
          },
          {
            type: 'dir',
            path: 'dsc-web/Modules',
            children: [
              {
                type: 'file',
                path: 'dsc-web/Modules/PSDesiredStateConfiguration',
                role: 'Ресурсы DSC',
                hint: 'WindowsFeature, File, Service, Registry',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'install',
    label: 'Установка',
    cmd: 'winget install Microsoft.PowerShell\npwsh -Version',
    detail: 'PowerShell 7 ставится отдельно от Windows PowerShell 5.1. На Linux/macOS — пакетный менеджер или Homebrew.',
  },
  {
    id: 'modules',
    label: 'Модули',
    cmd: 'Install-Module Az -Scope CurrentUser -Force\nInstall-Module Microsoft.Graph -Scope CurrentUser',
    detail: 'PSGallery — репозиторий модулей. -Scope CurrentUser не требует прав администратора. Зависимости подтягиваются автоматически.',
  },
  {
    id: 'import',
    label: 'Импорт',
    cmd: 'Import-Module .\\Infra.Azure\n# или\nImport-Module Az.Accounts, Az.Compute',
    detail: 'Import-Module загружает .psm1 и экспортирует командлеты в сессию. Манифест .psd1 задаёт RequiredModules.',
  },
  {
    id: 'run',
    label: 'Запуск',
    cmd: '.\\deploy.ps1 -ResourceGroupName prod-rg -Location westeurope',
    detail: 'Скрипт вызывает функции модуля и командлеты Az/Graph. ExecutionPolicy и роли Azure определяют, что реально выполнится.',
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    cmd: '# azure-pipelines.yml\n- task: PowerShell@2\n  inputs:\n    filePath: deploy.ps1\n    pwsh: true',
    detail: 'Пайплайн запускает тот же deploy.ps1 на агенте. Секреты — Variable groups / Azure Key Vault, не пароли в репозитории.',
  },
  {
    id: 'dsc',
    label: 'DSC',
    cmd: '. .\\WebServerConfig.ps1\nWebServerConfig -OutputPath .\\mof\nStart-DscConfiguration -Path .\\mof -Wait',
    detail: 'Конфигурация компилируется в MOF; LCM на узле приводит систему к описанному состоянию и периодически проверяет дрейф.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'script',
    label: 'Один скрипт',
    era: 'Быстрая автоматизация',
    color: '#012456',
    syntax: `# Sync-Service.ps1
param([string]$Name = 'Spooler')
Get-Service -Name $Name | Restart-Service -PassThru`,
    traits: ['Без манифеста', 'Подходит для одноразовых задач', 'Легко вставить в CI/CD'],
    tools: 'pwsh -File .\\Sync-Service.ps1',
    use: 'Админ-утилиты, runbook, шаг пайплайна',
  },
  {
    id: 'scriptmodule',
    label: 'Script Module (.psm1)',
    era: 'Библиотека функций',
    color: '#10b981',
    syntax: `# Infra.Azure.psm1
function Get-AzContextSafe { ... }
function New-AppVm { ... }
Export-ModuleMember -Function New-AppVm`,
    traits: ['Public/ и Private/', 'Export-ModuleMember', 'Версионирование через Git'],
    tools: 'Import-Module .\\Infra.Azure',
    use: 'Корпоративные модули, общие функции команды',
  },
  {
    id: 'manifest',
    label: 'Манифест (.psd1)',
    era: 'Публикация в PSGallery',
    color: '#5391fe',
    syntax: `@{
    RootModule        = 'Infra.Azure.psm1'
    ModuleVersion     = '1.2.0'
    GUID              = '...'
    RequiredModules   = @('Az.Accounts')
    FunctionsToExport = @('New-AppVm')
}`,
    traits: ['Метаданные и зависимости', 'Publish-Module', 'Совместимость версий'],
    tools: 'New-ModuleManifest · Publish-Module',
    use: 'Внутренний feed, PSGallery, Azure Automation',
  },
  {
    id: 'dsc',
    label: 'DSC configuration',
    era: 'Декларативная конфигурация',
    color: '#ec4899',
    syntax: `configuration WebServerConfig {
    Import-DscResource -ModuleName PSDesiredStateConfiguration
    Node 'Web01' {
        WindowsFeature WebServer { Ensure = 'Present'; Name = 'Web-Server' }
    }
}`,
    traits: ['MOF + LCM', 'Идемпотентность', 'Отчёты Test-DscConfiguration'],
    tools: 'Start-DscConfiguration · Azure Automation DSC',
    use: 'Серверы, роли IIS/SQL, соответствие политикам',
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
  const hasTests = enabledNodeIds.has('tests');
  const galleryCount = DEP_NODES.filter((n) => n.type === 'gallery' && enabledNodeIds.has(n.id)).length;
  const layers = hasTests
    ? ['deploy.ps1', 'Public/ · Private/ · Tests/', `PSGallery: ${galleryCount} модулей`]
    : ['deploy.ps1', 'Public/ · Private/', `PSGallery: ${galleryCount} модулей (без Pester)`];
  return {layers, hasTests, galleryCount};
}
