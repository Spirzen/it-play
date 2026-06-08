/** Данные для FortranEcosystemPlay — статья 5-16-starye-yazyki/Fortran/3. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура проекта'},
  {id: 'build', label: 'Сборка и линковка'},
  {id: 'modules', label: 'Модули и USE'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'hardware',
    tag: 'Платформа',
    label: 'HPC · кластеры · GPU',
    color: '#64748b',
    icon: '🖥',
    items: ['CPU · NUMA · векторизация', 'NVIDIA CUDA · OpenACC', 'Slurm · PBS · LSF'],
    detail:
      'Научные приложения часто запускают на суперкомпьютерах: планировщик заданий, MPI-процессы на узлах, опционально GPU через OpenACC/CUDA Fortran.',
  },
  {
    id: 'compilers',
    tag: 'Компиляторы',
    label: 'gfortran · ifx · nvfortran · NAG',
    color: '#734f96',
    icon: '⚙',
    items: ['GNU Fortran (gfortran)', 'Intel oneAPI (ifx)', 'NVIDIA HPC (nvfortran)', 'NAG · LFortran'],
    detail:
      'Компилятор проверяет интерфейсы модулей, генерирует .mod и объектные файлы, векторизует циклы и распараллеливает OpenMP. Выбор влияет на оптимизации и совместимость с библиотеками.',
  },
  {
    id: 'language',
    tag: 'Язык',
    label: 'Программные единицы Fortran',
    color: '#0ea5e9',
    icon: '📐',
    items: ['program · module', 'subroutine · function', 'derived type · interface'],
    detail:
      'Архитектура кода строится из program (точка входа), module (данные и процедуры), subroutine/function. Модули дают явные интерфейсы и файл .mod для зависимостей.',
  },
  {
    id: 'libs',
    tag: 'Библиотеки',
    label: 'BLAS · LAPACK · FFTW · I/O',
    color: '#10b981',
    icon: '📚',
    items: ['BLAS / LAPACK / ScaLAPACK', 'FFTW · PETSc', 'NetCDF · HDF5', 'ISO_C_BINDING'],
    detail:
      'Численные ядра подключаются при линковке (-lblas -llapack). Форматы науки — NetCDF/HDF5 через Fortran-интерфейсы. C/Python вызывают Fortran через BIND(C).',
  },
  {
    id: 'parallel',
    tag: 'Параллелизм',
    label: 'OpenMP · MPI · coarray',
    color: '#f59e0b',
    icon: '🔀',
    items: ['!$omp parallel do', 'mpi_f08 · mpif.h', 'coarray [remote]', 'DO CONCURRENT'],
    detail:
      'OpenMP — потоки на узле. MPI — распределённая память между процессами. Coarray — встроенный SPMD в стандарте Fortran 2008+.',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'CMake · fpm · тесты',
    color: '#ec4899',
    icon: '🔧',
    items: ['CMake · Make · Ninja', 'fpm (Fortran Package Manager)', 'pFUnit · FUnit', 'fprettify · ford'],
    detail:
      'CMake задаёт порядок компиляции модулей и флаги -J для каталога .mod. fpm упрощает пакеты и зависимости. pFUnit тестирует процедуры по модулям.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш расчётный код',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/*.f90', 'driver.f90 · lib', 'конфиг · restart-файлы'],
    detail:
      'Типичный проект: модули types/solver/io, program-driver, опционально статическая библиотека для вызова из C или тестового раннера без program.',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'climate.f90', type: 'program', x: 200, y: 22},
  {id: 'types', label: 'mod_types', type: 'module', x: 72, y: 88},
  {id: 'solver', label: 'mod_solver', type: 'module', x: 200, y: 88},
  {id: 'io', label: 'mod_io', type: 'optional', x: 328, y: 88},
  {id: 'blas', label: 'libblas', type: 'lib', x: 56, y: 168},
  {id: 'lapack', label: 'liblapack', type: 'lib', x: 148, y: 168},
  {id: 'netcdf', label: 'libnetcdf', type: 'lib', x: 248, y: 168},
  {id: 'mpi', label: 'libmpi', type: 'lib', x: 352, y: 168},
];

export const DEP_EDGES = [
  ['main', 'types'],
  ['main', 'solver'],
  ['main', 'io'],
  ['main', 'mpi'],
  ['solver', 'types'],
  ['solver', 'lapack'],
  ['solver', 'blas'],
  ['lapack', 'blas'],
  ['io', 'netcdf'],
  ['io', 'mpi'],
];

export const NODE_TYPE_META = {
  program: {label: 'PROGRAM (точка входа)', stroke: '#6366f1'},
  module: {label: 'MODULE (ваш код)', stroke: '#10b981'},
  optional: {label: 'Опциональный модуль', stroke: '#f59e0b', dash: '6 4'},
  lib: {label: 'Внешняя библиотека', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'cmake',
    label: 'CMake · научный проект',
    toolchain: 'add_library · target_link_libraries · порядок .mod',
    tree: [
      {
        type: 'dir',
        path: 'climate-model',
        children: [
          {type: 'file', path: 'climate-model/CMakeLists.txt', role: 'Сборка', hint: 'enable_language(Fortran); add_subdirectory(src)'},
          {type: 'file', path: 'climate-model/cmake/FindNetCDF.cmake', role: 'Зависимости', hint: 'Поиск NetCDF, LAPACK, MPI для линковки'},
          {
            type: 'dir',
            path: 'climate-model/src',
            children: [
              {type: 'file', path: 'climate-model/src/mod_types.f90', role: 'MODULE types', hint: 'Производные типы, константы, PUBLIC/PRIVATE'},
              {type: 'file', path: 'climate-model/src/mod_solver.f90', role: 'MODULE solver', hint: 'use types; процедуры time_step, pure functions'},
              {type: 'file', path: 'climate-model/src/mod_io.f90', role: 'MODULE io', hint: 'NetCDF open/write; restart-файлы'},
              {type: 'file', path: 'climate-model/src/climate.f90', role: 'PROGRAM climate', hint: 'use solver, io; call initialize; time loop'},
            ],
          },
          {
            type: 'dir',
            path: 'climate-model/tests',
            role: 'pFUnit',
            children: [
              {type: 'file', path: 'climate-model/tests/test_solver.pf', role: 'Модульные тесты', hint: 'assert для отдельных subroutine'},
            ],
          },
          {type: 'file', path: 'climate-model/build/mod/', role: 'Каталог .mod', hint: 'gfortran -J build/mod — метаданные модулей'},
        ],
      },
    ],
  },
  {
    id: 'fpm',
    label: 'fpm · пакет библиотеки',
    toolchain: 'fpm.toml · library + app · зависимости из registry',
    tree: [
      {
        type: 'dir',
        path: 'linalg-fpm',
        children: [
          {type: 'file', path: 'linalg-fpm/fpm.toml', role: 'Манифест', hint: 'name, version, [dependencies] lapack = "..."'},
          {
            type: 'dir',
            path: 'linalg-fpm/src',
            children: [
              {type: 'file', path: 'linalg-fpm/src/linalg.f90', role: 'MODULE linalg', hint: 'Публичный API: matmul_wrapper, solve'},
              {type: 'file', path: 'linalg-fpm/src/linalg_impl.f90', role: 'Внутренности', hint: 'PRIVATE процедуры; вызов LAPACK'},
            ],
          },
          {
            type: 'dir',
            path: 'linalg-fpm/app',
            children: [
              {type: 'file', path: 'linalg-fpm/app/demo.f90', role: 'PROGRAM demo', hint: 'use linalg; fpm run — точка входа'},
            ],
          },
          {type: 'file', path: 'linalg-fpm/build/', role: 'Артефакты fpm', hint: 'Объекты, .mod, исполняемый demo автоматически'},
        ],
      },
    ],
  },
  {
    id: 'lib-driver',
    label: 'Библиотека + C-драйвер',
    toolchain: 'Без PROGRAM · BIND(C) · вызов из Python/C',
    tree: [
      {
        type: 'dir',
        path: 'fortran-kernel',
        children: [
          {type: 'file', path: 'fortran-kernel/Makefile', role: 'Сборка', hint: 'libkernel.a из .f90; ar rcs'},
          {
            type: 'dir',
            path: 'fortran-kernel/src',
            children: [
              {type: 'file', path: 'fortran-kernel/src/kernel_api.f90', role: 'MODULE api', hint: 'subroutine integrate(...) bind(c, name="integrate")'},
              {type: 'file', path: 'fortran-kernel/src/kernel_core.f90', role: 'Ядро', hint: 'Численные циклы; use iso_fortran_env'},
            ],
          },
          {type: 'file', path: 'fortran-kernel/driver.c', role: 'C main', hint: 'extern void integrate(...); линковка -lkernel -lgfortran'},
          {type: 'file', path: 'fortran-kernel/wrapper.py', role: 'ctypes / f2py', hint: 'Python загружает .so/.dll с расчётным ядром'},
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'moddir',
    label: 'Каталог .mod',
    cmd: 'mkdir -p build/mod\n# флаг -J (gfortran) или -module (ifx)',
    detail:
      'Компилятор кладёт .mod — "заголовки" модулей с сигнатурами типов и процедур. Зависимые файлы ищут их через -I build/mod.',
  },
  {
    id: 'compile-base',
    label: 'Базовые модули',
    cmd: 'gfortran -std=f2018 -Jbuild/mod -c src/mod_types.f90\ngfortran -Jbuild/mod -c src/mod_solver.f90',
    detail:
      'Сначала компилируют модули без зависимостей (types), затем те, кто делает USE types (solver). Нарушение порядка → ошибка "mod file not found".',
  },
  {
    id: 'compile-main',
    label: 'PROGRAM / объекты',
    cmd: 'gfortran -Jbuild/mod -Ibuild/mod -c src/climate.f90',
    detail:
      'PROGRAM climate видит интерфейсы из .mod. Каждый .f90 → свой .o; перекомпиляция затрагивает только изменённые единицы.',
  },
  {
    id: 'link',
    label: 'Линковка',
    cmd: 'gfortran -o climate build/*.o -L/opt/netcdf/lib -lnetcdff -llapack -lblas',
    detail:
      'Линковщик собирает .o и внешние библиотеки в исполняемый файл. Порядок -l иногда важен: lapack после blas.',
  },
  {
    id: 'cmake',
    label: 'CMake',
    cmd: 'cmake -B build -DCMAKE_Fortran_COMPILER=gfortran\ncmake --build build\nctest --test-dir build',
    detail:
      'CMake вычисляет граф USE-зависимостей, прокидывает include-директории для .mod и флаги MPI/OpenMP на все цели.',
  },
  {
    id: 'run-mpi',
    label: 'Запуск HPC',
    cmd: 'mpirun -np 4 ./climate input.nc output.nc\n# или: srun ./climate ...',
    detail:
      'MPI-процессы — отдельные образы программы; каждый компилируется с тем же бинарником, данные обмениваются через mpi_f08.',
  },
];

export const MODULE_SYSTEMS = [
  {
    id: 'legacy',
    label: 'F77 · INCLUDE',
    era: 'Legacy · fixed-form',
    color: '#64748b',
    syntax: `C     COMMON /BLOCK/ A, B
      INCLUDE 'params.inc'
      CALL SOLVE(A, B)
C     нет проверки интерфейсов на этапе компиляции`,
    traits: ['COMMON-блоки', 'INCLUDE вместо module', 'Неявные интерфейсы'],
    tools: 'cpp · legacy Make · постепенная миграция',
    use: 'Старые кодовые базы; обёртка новых module вокруг legacy',
  },
  {
    id: 'f90mod',
    label: 'MODULE · USE',
    era: 'Fortran 90+ · free-form',
    color: '#734f96',
    syntax: `module types
  implicit none
  private
  type :: grid_t
    real, allocatable :: field(:,:)
  end type
  public :: grid_t
end module

program main
  use types, only: grid_t
end program`,
    traits: ['Файл .mod на единицу', 'PUBLIC / PRIVATE', 'Явные интерфейсы', 'Порядок компиляции'],
    tools: 'gfortran -J · ifx -module · fpm',
    use: 'Современные научные проекты; основа архитектуры из статьи',
  },
  {
    id: 'interop',
    label: 'ISO_C_BINDING',
    era: 'Смешанные системы',
    color: '#0ea5e9',
    syntax: `module c_api
  use iso_c_binding
  implicit none
contains
  subroutine integrate(x, n) bind(c, name="integrate")
    real(c_double), intent(inout) :: x(n)
  end subroutine
end module`,
    traits: ['BIND(C) имена', 'c_double ↔ real', 'Библиотека без PROGRAM'],
    tools: 'CMake IMPORTED · Python ctypes · линковка с C++',
    use: 'Ядро на Fortran в веб/ML-стеке; вызов из Python через wrapper',
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
  const hasIo = enabledNodeIds.has('io');
  const hasMpi = enabledNodeIds.has('mpi');
  const libCount = DEP_NODES.filter((n) => n.type === 'lib' && enabledNodeIds.has(n.id)).length;
  const layers = [
    'PROGRAM climate.f90',
    'MODULE types · solver' + (hasIo ? ' · io' : ''),
    `Внешние libs: ${libCount}` + (hasMpi ? ' · MPI' : ''),
  ];
  return {layers, hasIo, hasMpi, libCount};
}

/** Включить/выключить цепочку I/O (mod_io → NetCDF). */
export const IO_CHAIN_IDS = ['io', 'netcdf'];
