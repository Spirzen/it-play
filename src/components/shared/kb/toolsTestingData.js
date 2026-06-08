/** Данные для интерактивов раздела tools/testing */

export const TEST_TOOL_FILTERS = [
  {id: 'all', label: 'Все'},
  {id: 'unit', label: 'Unit'},
  {id: 'integration', label: 'Integration'},
  {id: 'e2e', label: 'E2E'},
  {id: 'static', label: 'Статика'},
  {id: 'load', label: 'Нагрузка'},
  {id: 'mock', label: 'Моки'},
];

export const TEST_TOOLS = [
  {id: 'pytest', name: 'pytest', cat: 'unit', lang: 'Python', note: 'Фикстуры, параметризация, плагины'},
  {id: 'jest', name: 'Jest', cat: 'unit', lang: 'JS/TS', note: 'Снапшоты, моки, coverage'},
  {id: 'junit', name: 'JUnit / TestNG', cat: 'unit', lang: 'Java', note: 'Стандарт JVM-тестов'},
  {id: 'xunit', name: 'xUnit.net', cat: 'unit', lang: 'C#', note: 'Экосистема .NET'},
  {id: 'postman', name: 'Postman', cat: 'integration', lang: 'API', note: 'Коллекции REST, Newman в CI'},
  {id: 'supertest', name: 'Supertest', cat: 'integration', lang: 'Node', note: 'HTTP-assert без браузера'},
  {id: 'playwright', name: 'Playwright', cat: 'e2e', lang: 'Web', note: 'Кросс-браузер, auto-wait'},
  {id: 'selenium', name: 'Selenium', cat: 'e2e', lang: 'Web', note: 'WebDriver, зрелая экосистема'},
  {id: 'cypress', name: 'Cypress', cat: 'e2e', lang: 'Web', note: 'Интеграция + E2E в одном раннере'},
  {id: 'eslint', name: 'ESLint', cat: 'static', lang: 'JS/TS', note: 'Правила стиля и ошибок'},
  {id: 'sonar', name: 'SonarQube', cat: 'static', lang: 'Multi', note: 'Качество кода в CI'},
  {id: 'k6', name: 'k6', cat: 'load', lang: 'Go scripts', note: 'Нагрузка как код'},
  {id: 'jmeter', name: 'JMeter', cat: 'load', lang: 'GUI/CLI', note: 'Сценарии HTTP, JDBC'},
  {id: 'mockito', name: 'Mockito', cat: 'mock', lang: 'Java', note: 'Моки и verify вызовов'},
  {id: 'wiremock', name: 'WireMock', cat: 'mock', lang: 'HTTP', note: 'Стаб внешних API'},
];

export const PROFILER_FILTERS = [
  {id: 'all', label: 'Все'},
  {id: 'system', label: 'Система'},
  {id: 'lang', label: 'По языку'},
  {id: 'viz', label: 'Визуализация'},
];

export const PROFILERS = [
  {
    id: 'perf',
    name: 'perf (Linux)',
    cat: 'system',
    lang: 'Любой процесс',
    metric: 'CPU, cache misses, flamegraph',
    install: 'linux-tools-generic',
  },
  {
    id: 'vtune',
    name: 'Intel VTune',
    cat: 'system',
    lang: 'C/C++, .NET',
    metric: 'CPU, память, GPU',
    install: 'intel.com/vtune',
  },
  {
    id: 'pyspy',
    name: 'py-spy',
    cat: 'lang',
    lang: 'Python',
    metric: 'Flamegraph без остановки процесса',
    install: 'pip install py-spy',
  },
  {
    id: 'cprofile',
    name: 'cProfile',
    cat: 'lang',
    lang: 'Python',
    metric: 'Встроенный профиль вызовов',
    install: 'python -m cProfile',
  },
  {
    id: 'devtools',
    name: 'Chrome DevTools',
    cat: 'lang',
    lang: 'JS / браузер',
    metric: 'Performance, Memory, Network',
    install: 'F12 → Performance',
  },
  {
    id: 'pprof',
    name: 'pprof (Go)',
    cat: 'lang',
    lang: 'Go',
    metric: 'CPU, heap, goroutines',
    install: 'net/http/pprof',
  },
  {
    id: 'dottrace',
    name: 'dotTrace',
    cat: 'lang',
    lang: 'C# / .NET',
    metric: 'Timeline, память',
    install: 'JetBrains Profiler',
  },
  {
    id: 'jfr',
    name: 'Java Flight Recorder',
    cat: 'lang',
    lang: 'Java',
    metric: 'Низкий overhead в проде',
    install: 'JDK -XX:+FlightRecorder',
  },
  {
    id: 'flame',
    name: 'FlameGraph',
    cat: 'viz',
    lang: 'Универсальный',
    metric: 'Визуализация стека',
    install: 'github.com/brendangregg/FlameGraph',
  },
  {
    id: 'speedscope',
    name: 'speedscope',
    cat: 'viz',
    lang: 'Универсальный',
    metric: 'Интерактивный просмотр профиля',
    install: 'speedscope.app',
  },
];

export const LINTER_LANGS = [
  {id: 'js', label: 'JavaScript'},
  {id: 'py', label: 'Python'},
  {id: 'go', label: 'Go'},
  {id: 'shell', label: 'Shell'},
];

export const LINTER_SAMPLES = {
  js: {
    bad: `var x=1\nif(x==1)console.log("ok")`,
    good: `const x = 1;\nif (x === 1) {\n  console.log('ok');\n}`,
    rules: ['prefer-const', 'eqeqeq', 'semi', 'quotes'],
    tools: ['ESLint', 'Prettier'],
  },
  py: {
    bad: `def f( a,b ):\n return a+b`,
    good: `def f(a: int, b: int) -> int:\n    return a + b`,
    rules: ['E302', 'E225', 'ANN'],
    tools: ['Ruff', 'Black', 'mypy'],
  },
  go: {
    bad: `package main\nimport "fmt"\nfunc main(){fmt.Println("hi")}`,
    good: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("hi")\n}`,
    rules: ['gofmt', 'govet', 'staticcheck'],
    tools: ['golangci-lint'],
  },
  shell: {
    bad: `for i in $*; do echo $i; done`,
    good: `for i in "$@"; do\n  printf '%s\\n' "$i"\ndone`,
    rules: ['SC2068', 'SC2086'],
    tools: ['ShellCheck', 'shfmt'],
  },
};

export const LINTERS = [
  {id: 'eslint', name: 'ESLint', lang: 'js', note: 'Плагины, flat config, CI'},
  {id: 'ruff', name: 'Ruff', lang: 'py', note: 'Замена Flake8 + isort, очень быстрый'},
  {id: 'golangci', name: 'golangci-lint', lang: 'go', note: 'Мета-линтер: 50+ анализаторов'},
  {id: 'shellcheck', name: 'ShellCheck', lang: 'shell', note: 'Ошибки bash/sh до запуска'},
  {id: 'semgrep', name: 'Semgrep', lang: 'multi', note: 'Правила безопасности в YAML'},
  {id: 'sonarlint', name: 'SonarLint', lang: 'multi', note: 'Подсказки прямо в IDE'},
];
