/** Данные для CppEcosystemPlay — статья 5-06-cpp/10. */

export const TABS = [
  {id: 'stack', label: 'Слои экосистемы'},
  {id: 'deps', label: 'Граф зависимостей'},
  {id: 'structure', label: 'Структура приложения'},
  {id: 'build', label: 'Сборка и линковка'},
  {id: 'packages', label: 'Зависимости и модули'},
];

export const ECOSYSTEM_LAYERS = [
  {
    id: 'toolchain',
    tag: 'Toolchain',
    label: 'Компилятор и линковка',
    color: '#00599c',
    icon: '⚙',
    items: ['GCC · Clang · MSVC', 'CMake · Ninja · MSBuild', 'Статическая / динамическая линковка'],
    detail:
      'Исходники (.cpp/.h) проходят препроцессор, компиляцию в объектные файлы (.o/.obj) и линковку в исполняемый файл или библиотеку (.a/.so/.dll). CMake — де-факто стандарт описания сборки кроссплатформенно. Сравнение GCC, Clang, MSVC, Intel oneAPI и MinGW — в статье 32 раздела C++.',
  },
  {
    id: 'stdlib',
    tag: 'Стандарт',
    label: 'STL · стандарт C++',
    color: '#3b82f6',
    icon: '📚',
    items: ['std::vector · std::string', 'std::thread · std::filesystem', 'ranges · coroutines (C++20)'],
    detail:
      'Стандартная библиотека входит в toolchain, но версия зависит от флага -std=c++20. Заголовки <iostream>, <memory>, <algorithm> — без отдельной установки; ABI совместимости между компиляторами нет.',
  },
  {
    id: 'deps',
    tag: 'Зависимости',
    label: 'vcpkg · Conan · FetchContent',
    color: '#10b981',
    icon: '📦',
    items: ['vcpkg.json · conanfile.txt', 'find_package · target_link_libraries', 'header-only vs compiled lib'],
    detail:
      'Сторонние библиотеки подключают как подмодули git, через менеджер пакетов или CMake FetchContent. В CMake: find_package(Boost) → target_link_libraries(app PRIVATE Boost::asio).',
  },
  {
    id: 'tooling',
    tag: 'Инструменты',
    label: 'Тесты · анализ · отладка',
    color: '#ec4899',
    icon: '🔧',
    items: ['Google Test · Catch2', 'ASan · TSan · Valgrind', 'clang-tidy · clang-format'],
    detail:
      'gtest/doctest интегрируются в CTest (ctest). AddressSanitizer и ThreadSanitizer включаются флагами -fsanitize=*. Valgrind — без перекомпиляции, но медленнее. clang-tidy ловит утечки unique_ptr и стиль.',
  },
  {
    id: 'frameworks',
    tag: 'Фреймворки',
    label: 'GUI · сеть · домены',
    color: '#06b6d4',
    icon: '🌐',
    items: ['Qt · wxWidgets · ImGui', 'Boost.Asio · Drogon · gRPC', 'OpenCV · Eigen · Unreal'],
    detail:
      'GUI: Qt (MOC + signals/slots), wxWidgets (нативные виджеты), Dear ImGui (immediate mode). Сервер: Asio, POCO, Drogon. Специализация: OpenCV, ROS, CUDA — каждая со своей моделью сборки.',
  },
  {
    id: 'app',
    tag: 'Приложение',
    label: 'Ваш код',
    color: '#6366f1',
    icon: '🏗',
    items: ['src/ · include/', 'CMake targets', 'plugins · static libs'],
    detail:
      'Типичная структура: include/ (публичные заголовки), src/ (реализация), tests/, third_party/. Несколько target в одном проекте: libcore (STATIC), app (EXE), plugin (MODULE).',
  },
];

export const DEP_NODES = [
  {id: 'main', label: 'src/main.cpp', type: 'app', x: 200, y: 24},
  {id: 'ui', label: 'src/ui/', type: 'module', x: 60, y: 90},
  {id: 'core', label: 'src/core/', type: 'module', x: 200, y: 90},
  {id: 'worker', label: 'src/worker/', type: 'lazy', x: 340, y: 90},
  {id: 'qt', label: 'Qt6::Widgets', type: 'lib', x: 40, y: 168},
  {id: 'asio', label: 'Boost::asio', type: 'lib', x: 120, y: 168},
  {id: 'spdlog', label: 'spdlog::spdlog', type: 'lib', x: 200, y: 168},
  {id: 'gtest', label: 'GTest::gtest', type: 'lib', x: 280, y: 168},
  {id: 'grpc', label: 'gRPC::grpc++', type: 'lib', x: 360, y: 168},
];

export const DEP_EDGES = [
  ['main', 'ui'],
  ['main', 'core'],
  ['main', 'worker'],
  ['ui', 'qt'],
  ['ui', 'core'],
  ['core', 'asio'],
  ['core', 'spdlog'],
  ['core', 'grpc'],
  ['worker', 'asio'],
  ['worker', 'spdlog'],
  ['worker', 'core'],
  ['gtest', 'core'],
];

export const NODE_TYPE_META = {
  app: {label: 'Точка входа', stroke: '#6366f1'},
  module: {label: 'Модуль src/', stroke: '#10b981'},
  lazy: {label: 'Фоновый поток', stroke: '#f59e0b', dash: '6 4'},
  lib: {label: 'find_package', stroke: '#ec4899'},
};

export const ARCH_PRESETS = [
  {
    id: 'qt-desktop',
    label: 'Qt desktop (CMake)',
    toolchain: 'CMake · Qt6 · vcpkg · CTest · gtest',
    tree: [
      {
        type: 'dir',
        path: 'sensor-monitor',
        children: [
          {
            type: 'file',
            path: 'sensor-monitor/CMakeLists.txt',
            role: 'Корень проекта',
            hint: 'cmake_minimum_required, project(), add_subdirectory(src), enable_testing()',
          },
          {
            type: 'file',
            path: 'sensor-monitor/vcpkg.json',
            role: 'Зависимости',
            hint: '{"dependencies":["qtbase","spdlog","gtest"]} — vcpkg install',
          },
          {
            type: 'dir',
            path: 'sensor-monitor/src',
            children: [
              {
                type: 'file',
                path: 'sensor-monitor/src/main.cpp',
                role: 'main',
                hint: 'QApplication app; MainWindow w; return app.exec();',
              },
              {
                type: 'dir',
                path: 'sensor-monitor/src/ui',
                role: 'GUI',
                children: [
                  {
                    type: 'file',
                    path: 'sensor-monitor/src/ui/MainWindow.cpp',
                    role: 'Виджеты',
                    hint: 'Q_OBJECT, signals/slots, MOC генерируется CMake AUTOMOC',
                  },
                  {
                    type: 'file',
                    path: 'sensor-monitor/src/ui/MainWindow.h',
                    role: 'Заголовок',
                    hint: 'class MainWindow : public QMainWindow',
                  },
                ],
              },
              {
                type: 'dir',
                path: 'sensor-monitor/src/core',
                role: 'Логика',
                children: [
                  {
                    type: 'file',
                    path: 'sensor-monitor/src/core/SensorService.cpp',
                    role: 'Сервис',
                    hint: 'Чтение данных, spdlog, без Qt в core — тестируемо отдельно',
                  },
                ],
              },
            ],
          },
          {
            type: 'dir',
            path: 'sensor-monitor/tests',
            children: [
              {
                type: 'file',
                path: 'sensor-monitor/tests/test_sensor.cpp',
                role: 'gtest',
                hint: 'add_executable(tests ...) + target_link_libraries(tests GTest::gtest core)',
              },
            ],
          },
          {
            type: 'file',
            path: 'sensor-monitor/build/Release/sensor-monitor.exe',
            role: 'Артефакт',
            hint: 'Линковка Qt6Widgets.dll (Win) или .so (Linux) — windeployqt для деплоя',
          },
        ],
      },
    ],
  },
  {
    id: 'drogon-api',
    label: 'REST API (Drogon)',
    toolchain: 'CMake · Drogon · vcpkg · Docker · ASan',
    tree: [
      {
        type: 'dir',
        path: 'orders-api',
        children: [
          {
            type: 'file',
            path: 'orders-api/CMakeLists.txt',
            role: 'Сборка',
            hint: 'find_package(Drogon CONFIG) + add_executable(orders_api main.cc controllers/)',
          },
          {
            type: 'file',
            path: 'orders-api/vcpkg.json',
            role: 'Manifest',
            hint: 'drogon, jsoncpp, libpq — triplet x64-linux-release',
          },
          {
            type: 'file',
            path: 'orders-api/main.cc',
            role: 'Точка входа',
            hint: 'drogon::app().addListener("0.0.0.0", 8080).run();',
          },
          {
            type: 'dir',
            path: 'orders-api/controllers',
            role: 'HTTP слой',
            children: [
              {
                type: 'file',
                path: 'orders-api/controllers/OrderCtrl.cc',
                role: 'REST',
                hint: 'METHOD_ADD(OrderCtrl::list, "/orders", Get) — async co_await',
              },
            ],
          },
          {
            type: 'dir',
            path: 'orders-api/models',
            role: 'Данные',
            children: [
              {
                type: 'file',
                path: 'orders-api/models/Order.cc',
                role: 'ORM Drogon',
                hint: 'coroutine + DbClient, SQL через ORM или raw queries',
              },
            ],
          },
          {
            type: 'file',
            path: 'orders-api/Dockerfile',
            role: 'Контейнер',
            hint: 'multi-stage: cmake --build → distroless с libdrogon.so',
          },
          {
            type: 'file',
            path: 'orders-api/config.json',
            role: 'Конфиг Drogon',
            hint: 'listeners, db_clients, log — без перекомпиляции',
          },
        ],
      },
    ],
  },
  {
    id: 'engine-module',
    label: 'Игровой модуль / plugin',
    toolchain: 'CMake · static lib · ImGui · FetchContent',
    tree: [
      {
        type: 'dir',
        path: 'physics-plugin',
        children: [
          {
            type: 'file',
            path: 'physics-plugin/CMakeLists.txt',
            role: 'Targets',
            hint: 'add_library(physics STATIC ...) + add_library(physics_plugin MODULE ...)',
          },
          {
            type: 'dir',
            path: 'physics-plugin/include',
            role: 'Публичный API',
            children: [
              {
                type: 'file',
                path: 'physics-plugin/include/physics/World.h',
                role: 'Интерфейс',
                hint: 'export API — только заголовки без деталей реализации',
              },
            ],
          },
          {
            type: 'dir',
            path: 'physics-plugin/src',
            children: [
              {
                type: 'file',
                path: 'physics-plugin/src/World.cpp',
                role: 'Реализация',
                hint: 'SIMD, Eigen для матриц — PRIVATE линковка',
              },
              {
                type: 'file',
                path: 'physics-plugin/src/DebugPanel.cpp',
                role: 'ImGui',
                hint: 'Immediate-mode UI: ImGui::Begin каждый кадр, без MOC',
              },
            ],
          },
          {
            type: 'dir',
            path: 'physics-plugin/third_party',
            children: [
              {
                type: 'file',
                path: 'physics-plugin/third_party/CMakeLists.txt',
                role: 'FetchContent',
                hint: 'FetchContent_Declare(imgui ...) — git submodule альтернатива',
              },
            ],
          },
          {
            type: 'file',
            path: 'physics-plugin/build/libphysics.a',
            role: 'Static lib',
            hint: 'Линкуется в движок; plugin .dll экспортирует CreateModule()',
          },
        ],
      },
    ],
  },
];

export const BUILD_STEPS = [
  {
    id: 'cmake',
    label: 'CMakeLists',
    cmd: `cmake_minimum_required(VERSION 3.20)
project(orders-api CXX)
set(CMAKE_CXX_STANDARD 20)

find_package(Drogon CONFIG REQUIRED)
find_package(spdlog CONFIG REQUIRED)

add_executable(orders_api main.cc controllers/OrderCtrl.cc)
target_link_libraries(orders_api PRIVATE Drogon::Drogon spdlog::spdlog)`,
    detail:
      'CMake описывает targets, стандарт C++, пути include и зависимости. find_package ищет *Config.cmake от vcpkg или системы. PRIVATE/PUBLIC/INTERFACE управляют транзитивной линковкой.',
  },
  {
    id: 'configure',
    label: 'Конфигурация',
    cmd: `cmake -B build -S . \\
  -DCMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake \\
  -DCMAKE_BUILD_TYPE=Release

# или: cmake --preset release (CMakePresets.json)`,
    detail:
      'Генерация Ninja/Makefile/VS solution. vcpkg toolchain подставляет пути к библиотекам. Presets фиксируют флаги для команды — одинаковая сборка локально и в CI.',
  },
  {
    id: 'compile',
    label: 'Компиляция',
    cmd: `cmake --build build --config Release -j
# объектные файлы → линковка → bin/orders_api

# кросс-компиляция:
# cmake -DCMAKE_SYSTEM_NAME=Windows ...`,
    detail:
      'Компилятор обрабатывает каждый .cpp в .o, линкер собирает exe/so. Шаблоны и inline из заголовков компилируются в каждом TU — время сборки растёт с header-only библиотеками.',
  },
  {
    id: 'test',
    label: 'Тесты',
    cmd: `enable_testing()
add_executable(unit_tests tests/test_order.cpp)
target_link_libraries(unit_tests PRIVATE GTest::gtest_main core)

cmake --build build
ctest --test-dir build --output-on-failure`,
    detail:
      'Google Test/Catch2 регистрируются в CTest. gtest_main содержит main(). Фикстуры SetUp/TearDown изолируют БД и сеть. Моки через gmock или ручные интерфейсы.',
  },
  {
    id: 'analyze',
    label: 'Анализ',
    cmd: `# санитайзеры (Clang/GCC)
cmake -B build-asan -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined"

clang-tidy src/**/*.cpp -- -std=c++20
valgrind --leak-check=full ./build/orders_api`,
    detail:
      'ASan ловит use-after-free с ~2× overhead. TSan — гонки в std::thread. clang-tidy проверяет modernize-*, bugprone-*. Valgrind эмулирует память без пересборки.',
  },
  {
    id: 'ship',
    label: 'Деплой',
    cmd: `# Linux service
sudo cp orders_api /usr/local/bin/
sudo systemctl enable orders-api

# Qt Windows
windeployqt build/Release/sensor-monitor.exe

# Docker
docker build -t orders-api .`,
    detail:
      'Сервисы — systemd unit или Windows Service. Qt требует копирования DLL/plugins. Статическая линковка (musl, /MT) уменьшает зависимости, но увеличивает размер бинарника.',
  },
];

export const PACKAGE_MODELS = [
  {
    id: 'header',
    label: 'Header-only',
    era: 'Eigen · nlohmann/json',
    color: '#00599c',
    syntax: `// CMakeLists.txt
add_library(project INTERFACE)
target_include_directories(project INTERFACE include/)
target_link_libraries(app PRIVATE project)

// include/math/vec3.hpp — весь код в .hpp
#include <math/vec3.hpp>`,
    traits: ['#include = компиляция в каждом TU', 'Нет отдельной линковки', 'Быстрый прототип, медленная сборка на больших проектах'],
    tools: 'INTERFACE target · FetchContent',
    use: 'Математика, JSON, мелкие утилиты',
  },
  {
    id: 'cmake',
    label: 'CMake + vcpkg',
    era: 'Сервис · desktop',
    color: '#10b981',
    syntax: `# vcpkg.json
{
  "dependencies": ["drogon", "spdlog", "gtest"]
}

# CMakeLists.txt
find_package(Drogon CONFIG REQUIRED)
target_link_libraries(app PRIVATE Drogon::Drogon)`,
    traits: ['Manifest фиксирует версии', 'Triplet: x64-linux, x64-windows-static', 'find_package после toolchain'],
    tools: 'vcpkg install · Conan 2 · Hunter',
    use: 'REST API, Qt-приложения, CI/CD',
  },
  {
    id: 'monorepo',
    label: 'Монорепо + submodules',
    era: 'Движок · платформа',
    color: '#8b5cf6',
    syntax: `# .gitmodules + add_subdirectory
add_subdirectory(third_party/imgui)
add_subdirectory(libs/core)
add_library(game MODULE plugin/src/entry.cpp)
target_link_libraries(game PRIVATE core imgui)

# или FetchContent_Declare(eigen GIT_TAG 3.4.0)`,
    traits: ['git submodule или FetchContent', 'Несколько STATIC/MODULE targets', 'Свой форк зависимостей'],
    tools: 'git submodule · CPM.cmake · Bazel (Abseil, TensorFlow)',
    use: 'Игровые движки, ROS, embedded',
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
  const hasWorker = enabledNodeIds.has('worker');
  const libCount = DEP_NODES.filter((n) => n.type === 'lib' && enabledNodeIds.has(n.id)).length;
  const artifacts = hasWorker
    ? ['orders_api (~8 MB + .so)', 'фоновый Asio thread', `линкуется: ${libCount} библиотек`]
    : ['orders_api (~6 MB)', 'без worker-потока', `линкуется: ${libCount - 1} библиотек`];
  return {artifacts, hasWorker, libCount};
}
