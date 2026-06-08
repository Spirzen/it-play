/** Данные для CobolEcosystemPlay — статья 5-16-starye-yazyki/Cobol/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и запуск'},
  {id: 'modules', label: 'Модули и COPY'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'platform',
    tag: 'Платформа',
    label: 'IBM z/OS · LPAR',
    color: '#1e3a5f',
    icon: '🖥',
    items: ['JES2 · JCL · RACF', 'VSAM · DB2', 'CICS · IMS · MQ'],
    detail:
      'Мейнфрейм даёт пакетные очереди (JES), транзакционный CICS, файлы VSAM и безопасность RACF. COBOL-программа — один модуль в цепочке "JCL → load module → данные".',
  },
  {
    id: 'compiler',
    tag: 'Компилятор',
    label: 'Enterprise COBOL · GnuCOBOL',
    color: '#2563eb',
    icon: '⚙',
    items: ['cob2 / IGYC · bind', 'cobc -x · -std=cobol85', 'COPY · REPLACING'],
    detail:
      'На z/OS: компиляция → binder (IEWL) → load module в PDS/PDSE. На ПК: GnuCOBOL собирает один бинарник из .cbl и подключаемых COPY/subprogram.',
  },
  {
    id: 'data',
    tag: 'Данные',
    label: 'Файлы и хранилища',
    color: '#0d9488',
    icon: '📂',
    items: ['SELECT · FD · FILE', 'VSAM KSDS/ESDS', 'DB2 · IMS DB'],
    detail:
      'В ENVIRONMENT/DATA — SELECT и FD связывают логические имена с датасетами. Batch читает последовательно; VSAM даёт доступ по ключу; DB2 — SQL через EXEC SQL.',
  },
  {
    id: 'middleware',
    tag: 'Middleware',
    label: 'CICS · IMS · MQ',
    color: '#7c3aed',
    icon: '🔁',
    items: ['EXEC CICS', 'BMS maps', 'MQ · REST (z/OS Connect)'],
    detail:
      'CICS превращает COBOL в онлайн-обработчик: терминал, веб-адаптер или API-шлюз вызывает транзакцию. Тот же исходник может жить и в batch, и в CICS — разный JCL/установка.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Сопровождение legacy',
    color: '#db2777',
    icon: '🔧',
    items: ['IBM Z Open Editor', 'z/OSMF · USS', 'Micro Focus · Heirloom'],
    detail:
      'Редакторы с подсветкой COPYBOOK, анализ зависимостей, миграционные трансформеры. В CI — пакетная сборка GnuCOBOL для регрессии логики вне мейнфрейма.',
  },
  {
    id: 'app',
    tag: 'Программа',
    label: 'Ваш COBOL',
    color: '#6366f1',
    icon: '🏗',
    items: ['4 divisions', 'paragraphs · SECTION', 'CALL · COPY'],
    detail:
      'IDENTIFICATION → ENVIRONMENT (файлы) → DATA (WS, FD, LINKAGE) → PROCEDURE. Общие макеты — COPY; повторная логика — отдельная программа с CALL и LINKAGE SECTION.',
  },
];

export const DEP_NODES = [
  {id: 'jcl', label: 'PAYRUN.jcl', type: 'runtime', x: 200, y: 18},
  {id: 'payroll', label: 'PAYROLL.cbl', type: 'app', x: 200, y: 72},
  {id: 'copybook', label: 'CUSTREC.cpy', type: 'copy', x: 55, y: 130},
  {id: 'acctlog', label: 'ACCTLOG.cbl', type: 'sub', x: 345, y: 130},
  {id: 'vsam', label: 'CUST.VSAM KSDS', type: 'data', x: 55, y: 188},
  {id: 'outfile', label: 'PAYRPT.seq', type: 'data', x: 130, y: 188},
  {id: 'cics', label: 'CICSPGM + BMS', type: 'lazy', x: 285, y: 72},
  {id: 'db2', label: 'DB2 PLAN', type: 'lazy', x: 345, y: 188},
  {id: 'api', label: 'z/OS Connect', type: 'lazy', x: 200, y: 188},
];

export const DEP_EDGES = [
  ['jcl', 'payroll'],
  ['payroll', 'copybook'],
  ['payroll', 'acctlog'],
  ['payroll', 'vsam'],
  ['payroll', 'outfile'],
  ['payroll', 'cics'],
  ['payroll', 'db2'],
  ['payroll', 'api'],
  ['acctlog', 'copybook'],
  ['cics', 'copybook'],
  ['db2', 'copybook'],
  ['api', 'cics'],
];

export const NODE_TYPE_META = {
  runtime: {label: 'JCL / запуск', stroke: '#1e3a5f'},
  app: {label: 'Основная программа', stroke: '#6366f1'},
  copy: {label: 'COPYbook', stroke: '#0d9488'},
  sub: {label: 'Подпрограмма CALL', stroke: '#10b981'},
  data: {label: 'Файл / VSAM', stroke: '#f59e0b'},
  lazy: {label: 'Опционально', stroke: '#7c3aed', dash: '6 4'},
};

export const ARCH_PRESETS = [
  {
    id: 'batch-zos',
    label: 'Batch на z/OS',
    toolchain: 'JCL · Enterprise COBOL · VSAM · COPYBOOK · RACF',
    tree: [
      {
        type: 'dir',
        path: 'PAYROLL-APP',
        children: [
          {type: 'file', path: 'PAYROLL-APP/JCL/PAYRUN.jcl', role: 'Задание', hint: 'EXEC PGM=PAYROLL, DD INFILE/OUTFILE, COND, REGION'},
          {type: 'file', path: 'PAYROLL-APP/JCL/PROCACCT.proc', role: 'Процедура JCL', hint: 'Повторяемый шаблон шагов — INCLUDE в PAYRUN'},
          {
            type: 'dir',
            path: 'PAYROLL-APP/SRC',
            children: [
              {
                type: 'file',
                path: 'PAYROLL-APP/SRC/PAYROLL.cbl',
                role: 'Программа',
                hint: 'IDENTIFICATION · ENVIRONMENT (SELECT) · DATA (FD, WS) · PROCEDURE',
              },
              {
                type: 'file',
                path: 'PAYROLL-APP/SRC/CUSTREC.cpy',
                role: 'COPYbook',
                hint: 'COPY CUSTREC — общая 01 CUST-RECORD для PAYROLL и ACCTLOG',
              },
              {
                type: 'file',
                path: 'PAYROLL-APP/SRC/ACCTLOG.cbl',
                role: 'Подпрограмма',
                hint: 'LINKAGE SECTION · CALL из PAYROLL · запись в журнал',
              },
            ],
          },
          {
            type: 'dir',
            path: 'PAYROLL-APP/DATA',
            children: [
              {type: 'file', path: 'PAYROLL-APP/DATA/CUST.VSAM', role: 'VSAM KSDS', hint: 'KEY IS CUST-ID — READ/REWRITE в PROCEDURE'},
              {type: 'file', path: 'PAYROLL-APP/DATA/PAYRPT.PS', role: 'Выход PS', hint: 'Последовательный отчёт после batch-шага'},
            ],
          },
          {type: 'file', path: 'PAYROLL-APP/LOAD/PAYROLL.load', role: 'Load module', hint: 'Результат binder — имя в JCL EXEC PGM='},
        ],
      },
    ],
  },
  {
    id: 'cics-online',
    label: 'CICS онлайн',
    toolchain: 'CICS · BMS · EXEC CICS · VSAM/DB2',
    tree: [
      {
        type: 'dir',
        path: 'INQCICS',
        children: [
          {type: 'file', path: 'INQCICS/CSD/INQDEF.csd', role: 'Ресурсы CICS', hint: 'TRAN INQ1 · PROGRAM INQPGM · FILE CUSTFIL'},
          {
            type: 'file',
            path: 'INQCICS/SRC/INQPGM.cbl',
            role: 'Транзакционная программа',
            hint: 'EXEC CICS READ/WRITE · HANDLE CONDITION · RETURN',
          },
          {type: 'file', path: 'INQCICS/BMS/INQMAP.bms', role: 'Экран', hint: 'DFHMSD/DFHMDI — поля карты для 3270 или веб-адаптера'},
          {type: 'file', path: 'INQCICS/SRC/CUSTREC.cpy', role: 'COPYbook', hint: 'Тот же макет записи, что и в batch — единый контракт данных'},
          {type: 'file', path: 'INQCICS/JCL/INQCICS.jcl', role: 'Установка', hint: 'DFHCSDUP · CEMT SET PROG — не batch PAYRUN'},
        ],
      },
    ],
  },
  {
    id: 'gnucobol',
    label: 'GnuCOBOL (учебный)',
    toolchain: 'cobc -x · локальные SEQ · без JCL',
    tree: [
      {
        type: 'dir',
        path: 'payroll-lab',
        children: [
          {type: 'file', path: 'payroll-lab/Makefile', role: 'Сборка', hint: 'cobc -x -std=cobol85 -o payroll payroll.cbl'},
          {type: 'file', path: 'payroll-lab/payroll.cbl', role: 'Одна программа', hint: 'ORGANIZATION IS LINE SEQUENTIAL — customers.dat, report.txt'},
          {type: 'file', path: 'payroll-lab/custrec.cpy', role: 'COPY', hint: 'COPY custrec REPLACING — как на мейнфрейме, но пути локальные'},
          {type: 'file', path: 'payroll-lab/customers.dat', role: 'Вход', hint: 'Тестовые записи фиксированной длины'},
          {type: 'file', path: 'payroll-lab/report.txt', role: 'Выход', hint: 'Результат после cobc && ./payroll'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'jcl',
    label: 'JCL',
    cmd: `//PAYRUN  JOB (ACCT),'PAYROLL',CLASS=A
//STEP1    EXEC PGM=IGYCRCTL,REGION=0M
//STEPLIB  DD DSN=IGY.SIGYCOMP,DISP=SHR
//SYSIN    DD *
  CBL PAYROLL,...
//STEP2    EXEC PGM=IEWL,...
//STEP3    EXEC PGM=PAYROLL
//INFILE   DD DSN=CUST.VSAM,DISP=SHR
//OUTFILE  DD DSN=PAYRPT(+1),DISP=(NEW,CATLG)`,
    detail:
      'JCL описывает не логику COBOL, а ресурсы: компилятор, binder, load module, DD-имена файлов. Одна PAYROLL.cbl — разные JCL для теста и прода.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: `/* z/OS Enterprise COBOL */
cob2 -q64 -c PAYROLL.cbl -o PAYROLL.o
/* GnuCOBOL */
cobc -c -std=cobol85 payroll.cbl
cobc -x -o payroll payroll.cbl acctlog.cbl`,
    detail:
      'COPY подставляется на этапе препроцессора. На z/OS объектный модуль идёт в binder; GnuCOBOL линкует сразу в исполняемый файл.',
  },
  {
    id: 'bind',
    label: 'Binder',
    cmd: `IEWL BIND MAP AMODE=31 RMODE=ANY -
     ENTRY PAYROLL -
     INCLUDE SYSLIB(PAYROLL) SYSLIB(ACCTLOG)`,
    detail:
      'Binder собирает load module из объектных модулей и резолвит CALL ACCTLOG. Имена в JCL EXEC PGM= должны совпадать с ENTRY.',
  },
  {
    id: 'run',
    label: 'Выполнение',
    cmd: `/* Batch */
SUBMIT PAYRUN.jcl
/* CICS */
CEMT SET PROG(INQPGM) NEWCOPY
/* Локально */
./payroll`,
    detail:
      'Batch: JES ставит job в очередь, шаги выполняются по COND. CICS: NEWCOPY подхватывает модуль без рестарта региона. Локально — просто запуск бинарника.',
  },
  {
    id: 'modern',
    label: 'Интеграция',
    cmd: `/* z/OS Connect EE — REST → CICS */
POST /cics/banking/v1/inquiry
Content-Type: application/json

/* в COBOL — JSON GENERATE / PARSE (стандарт 2014+) */`,
    detail:
      'Внешний мир (мобильное приложение, микросервис) бьёт в API-шлюз; COBOL остаётся ядром транзакции. Альтернатива — MQ + преобразование сообщений.',
  },
];

export const MODULE_MODELS = [
  {
    id: 'monolith',
    label: 'Один .cbl',
    era: 'Учебник · утилита',
    color: '#2563eb',
    syntax: `IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO.
       PROCEDURE DIVISION.
           DISPLAY "HELLO".
           STOP RUN.`,
    traits: ['Все division в одном файле', 'Без CALL и COPY', 'cobc -x hello.cbl'],
    tools: 'GnuCOBOL · OpenCOBOL IDE',
    use: 'Первая программа, малые batch-утилиты',
  },
  {
    id: 'copy-call',
    label: 'COPY + CALL',
    era: 'Корпоративный batch',
    color: '#0d9488',
    syntax: `DATA DIVISION.
       COPY CUSTREC.
       LINKAGE SECTION.
       COPY CUSTREC REPLACING ==:TAG:== BY ==LNK==.
       PROCEDURE DIVISION.
           CALL "ACCTLOG" USING LNK-RECORD.`,
    traits: ['COPYbook — единый макет полей', 'LINKAGE — контракт CALL', 'Подпрограмма — отдельный load'],
    tools: 'Binder · catalog PDS',
    use: 'Платёжные, страховые, гос. системы',
  },
  {
    id: 'cics-copy',
    label: 'CICS + общий COPY',
    era: 'Онлайн + batch',
    color: '#7c3aed',
    syntax: `EXEC CICS READ
           FILE('CUSTFIL')
           INTO(CUST-RECORD)
           RIDFLD(CUST-ID)
       END-EXEC.
       COPY CUSTREC.`,
    traits: ['Тот же CUSTREC.cpy в batch и online', 'BMS — отдельный артефакт', 'CSD — метаданные CICS'],
    tools: 'CICS Explorer · DFHCSDUP',
    use: 'Банкоматы, операторские терминалы, веб-адаптеры',
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
  return new Set(['jcl', 'payroll', 'copybook', 'acctlog', 'vsam', 'outfile']);
}

export function bundleSummary(enabledNodeIds) {
  const hasCics = enabledNodeIds.has('cics');
  const hasDb2 = enabledNodeIds.has('db2');
  const hasApi = enabledNodeIds.has('api');
  const artifacts = ['PAYROLL.load (binder)'];
  if (hasCics) artifacts.push('CICS INQPGM + BMS map');
  if (hasDb2) artifacts.push('DB2 plan + DCLGEN copy');
  if (hasApi) artifacts.push('OpenAPI → z/OS Connect');
  if (!hasCics && !hasApi) artifacts.push('batch-only JCL PAYRUN');
  return {artifacts, hasCics, hasDb2, hasApi};
}
