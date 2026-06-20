export const DECISION_STEPS = [
  {
    id: 'goal',
    question: 'Что хотите делать в первую очередь?',
    options: [
      {id: 'web', label: 'Веб-сайты и API'},
      {id: 'mobile', label: 'Мобильные приложения'},
      {id: 'data', label: 'Данные, ML, аналитика'},
      {id: 'systems', label: 'Системное / embedded'},
      {id: 'enterprise', label: 'Enterprise / ERP'},
      {id: 'games', label: 'Игры'},
    ],
  },
  {
    id: 'experience',
    question: 'Какой у вас опыт?',
    options: [
      {id: 'zero', label: 'С нуля — первый язык'},
      {id: 'script', label: 'Писал скрипты / HTML'},
      {id: 'oop', label: 'Есть ООП (Java/C#)'},
    ],
  },
];

export const LANGUAGE_RESULTS = {
  'web-zero': {
    primary: {name: 'JavaScript', path: '/encyclopedia/5-languages/5-01-javascript/intro', why: 'Браузер + Node.js, огромная экосистема, быстрый визуальный результат.'},
    secondary: {name: 'Python', path: '/encyclopedia/5-languages/5-02-python/intro', why: 'Проще синтаксис; backend через Django/FastAPI.'},
  },
  'web-script': {
    primary: {name: 'TypeScript', path: '/encyclopedia/5-languages/5-10-typescript/intro', why: 'Типы поверх JS — меньше ошибок в крупных проектах.'},
    secondary: {name: 'PHP', path: '/encyclopedia/5-languages/5-07-php/intro', why: 'Классический серверный веб, WordPress/Laravel.'},
  },
  'web-oop': {
    primary: {name: 'C#', path: '/encyclopedia/5-languages/5-05-csharp/intro', why: 'ASP.NET, сильная типизация, enterprise-веб.'},
    secondary: {name: 'Kotlin', path: '/encyclopedia/5-languages/5-09-kotlin/intro', why: 'Spring/Ktor для JVM-backend.'},
  },
  'mobile-zero': {
    primary: {name: 'Dart (Flutter)', path: '/encyclopedia/5-languages/5-22-dart/intro', why: 'Один код — iOS и Android.'},
    secondary: {name: 'Kotlin', path: '/encyclopedia/5-languages/5-09-kotlin/intro', why: 'Официальный язык Android.'},
  },
  'mobile-script': {
    primary: {name: 'Dart (Flutter)', path: '/encyclopedia/5-languages/5-22-dart/intro', why: 'Кроссплатформа с Material/Cupertino из коробки.'},
    secondary: {name: 'Swift', path: '/encyclopedia/5-languages/5-14-swift/intro', why: 'Нативный iOS и SwiftUI.'},
  },
  'mobile-oop': {
    primary: {name: 'Swift', path: '/encyclopedia/5-languages/5-14-swift/intro', why: 'Apple-стек, SwiftUI, performance.'},
    secondary: {name: 'Kotlin', path: '/encyclopedia/5-languages/5-09-kotlin/intro', why: 'Android + Compose, interop с Java.'},
  },
  'data-zero': {
    primary: {name: 'Python', path: '/encyclopedia/5-languages/5-02-python/intro', why: 'pandas, scikit-learn, Jupyter — стандарт индустрии.'},
    secondary: {name: 'R', path: '/encyclopedia/5-languages/5-23-r/intro', why: 'Статистика и ggplot2.'},
  },
  'data-script': {
    primary: {name: 'Python', path: '/encyclopedia/5-languages/5-02-python/intro', why: 'ML/DL библиотеки, notebooks, ETL.'},
    secondary: {name: 'Julia', path: '/encyclopedia/5-languages/5-24-julia/intro', why: 'Численные расчёты близко к C по скорости.'},
  },
  'data-oop': {
    primary: {name: 'Scala', path: '/encyclopedia/5-languages/5-18-scala/intro', why: 'Spark, big data на JVM.'},
    secondary: {name: 'Python', path: '/encyclopedia/5-languages/5-02-python/intro', why: 'Orchestration ML-пайплайнов.'},
  },
  'systems-zero': {
    primary: {name: 'Go', path: '/encyclopedia/5-languages/5-10-go/intro', why: 'Простой синтаксис, goroutines, CLI и сервисы.'},
    secondary: {name: 'Rust', path: '/encyclopedia/5-languages/5-13-rust/intro', why: 'Безопасность памяти без GC — сложнее старт.'},
  },
  'systems-script': {
    primary: {name: 'Rust', path: '/encyclopedia/5-languages/5-13-rust/intro', why: 'Системный код, WASM, performance + safety.'},
    secondary: {name: 'C++', path: '/encyclopedia/5-languages/5-06-cpp/intro', why: 'Игры, embedded, legacy-код.'},
  },
  'systems-oop': {
    primary: {name: 'C++', path: '/encyclopedia/5-languages/5-06-cpp/intro', why: 'Performance-critical, игровые движки.'},
    secondary: {name: 'Zig', path: '/encyclopedia/5-languages/5-20-zig/intro', why: 'Современная альтернатива C без hidden control flow.'},
  },
  'enterprise-zero': {
    primary: {name: 'C#', path: '/encyclopedia/5-languages/5-05-csharp/intro', why: '.NET, Visual Studio, корпоративный стек.'},
    secondary: {name: 'Java', path: '/encyclopedia/5-languages/5-03-java/intro', why: 'Spring Boot — самый распространённый enterprise backend.'},
  },
  'enterprise-script': {
    primary: {name: 'Java', path: '/encyclopedia/5-languages/5-03-java/intro', why: 'Spring, микросервисы, банки и госсектор.'},
    secondary: {name: 'C#', path: '/encyclopedia/5-languages/5-05-csharp/intro', why: 'Azure, ASP.NET, Windows-инфраструктура.'},
  },
  'enterprise-oop': {
    primary: {name: 'Java', path: '/encyclopedia/5-languages/5-03-java/intro', why: 'Зрелая экосystem, Kotlin как второй JVM-язык.'},
    secondary: {name: '1С', path: '/encyclopedia/5-languages/5-27-1s/intro', why: 'ERP/учёт в РФ и СНГ.'},
  },
  'games-zero': {
    primary: {name: 'C# (Unity)', path: '/encyclopedia/5-languages/5-05-csharp/intro', why: 'Unity — самый доступный вход в 3D/2D.'},
    secondary: {name: 'Lua', path: '/encyclopedia/5-languages/5-15-lua-i-luau/intro', why: 'Roblox Luau, скрипты в движках.'},
  },
  'games-script': {
    primary: {name: 'C# (Unity)', path: '/encyclopedia/5-languages/5-05-csharp/intro', why: 'Asset Store, огромное комьюнити.'},
    secondary: {name: 'C++', path: '/encyclopedia/5-languages/5-06-cpp/intro', why: 'Unreal Engine, AAA.'},
  },
  'games-oop': {
    primary: {name: 'C++', path: '/encyclopedia/5-languages/5-06-cpp/intro', why: 'Unreal, custom engines, performance.'},
    secondary: {name: 'Rust', path: '/encyclopedia/5-languages/5-13-rust/intro', why: 'Bevy, без GC в game loop.'},
  },
};

export function resolveLanguages(answers) {
  const key = `${answers.goal}-${answers.experience}`;
  return LANGUAGE_RESULTS[key] ?? LANGUAGE_RESULTS['web-zero'];
}
