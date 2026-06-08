/** Многосекционные хронологии раздела 1-07 (зеркало mermaid timeline) */

function ev(year, title, detail, type = 'milestone') {
  const y =
    typeof year === 'number'
      ? year
      : typeof year === 'string' && /^\d{4}/.test(year)
        ? parseInt(year, 10)
        : null;
  return {year: y, title, detail, type};
}

export const SECTION_HISTORIES = {
  'it-overview': {
    title: 'История IT',
    tagline: 'От древних алгоритмов к цифровой среде и переосмыслению прогресса',
    accentColor: '#4f46e5',
    sections: [
      {
        id: 'foundations',
        label: 'До IT',
        events: [
          ev(-3200, 'Письменность', 'Фиксация знаний в Месопотамии.', 'origin'),
          ev(-100, 'Антикитерский механизм', 'Программируемый механизм для астрономии.', 'origin'),
          ev(100, 'Автоматы Герона', 'Механика как управляемый алгоритм.', 'origin'),
          ev(1000, 'Позиционная система', 'Ноль и эффективная арифметика в Индии.', 'origin'),
          ev(1440, 'Книгопечатание', 'Массовое копирование и распространение знаний.', 'milestone'),
        ],
      },
      {
        id: 'mechanics-electronics',
        label: 'Механика → электроника',
        events: [
          ev(1822, 'Разностная машина', 'Бэббидж — автоматизация таблиц.', 'origin'),
          ev(1837, 'Аналитическая машина', 'Программа отделена от аппаратуры.', 'origin'),
          ev(1843, 'Ада Лавлейс', 'Первый алгоритм для вычислительной машины.', 'milestone'),
          ev(1941, 'Z3', 'Цузе — программируемый цифровой компьютер на реле.', 'release'),
          ev(1945, 'EDVAC / фон Нейман', 'Программа и данные в памяти.', 'standard'),
          ev(1950, 'ПО отдельно от железа', 'Программирование как интеллектуальный труд.', 'milestone'),
        ],
      },
      {
        id: 'open-market',
        label: 'Рынок и open source',
        events: [
          ev(1971, 'Intel 4004', 'Начало персональных вычислений.', 'release'),
          ev(1975, 'Altair 8800', 'Сообщество хакеров и хобби-сборки.', 'ecosystem'),
          ev(1983, 'GNU', 'Идея свободного ПО.', 'ecosystem'),
          ev(1985, 'MS-DOS', 'Модель "платформа + экосистема".', 'release'),
          ev(1991, 'Linux', 'Ядро на базе GNU и хакерской культуры.', 'release'),
          ev(2018, 'GitHub → Microsoft', 'Open source в коммерческой инфраструктуре.', 'milestone'),
        ],
      },
      {
        id: 'digital-env',
        label: 'Цифровая среда',
        events: [
          ev(2000, 'Широкополосный интернет', 'Сеть как постоянный фон жизни.', 'milestone'),
          ev(2007, 'iPhone', 'Всегда включённые мобильные устройства.', 'release'),
          ev(2013, 'Docker', 'Стандарт контейнеризации.', 'ecosystem'),
          ev(2015, 'Kubernetes', 'Оркестрация микросервисов.', 'ecosystem'),
          ev(2016, 'SRE', 'Инженерия надёжности как профессия.', 'milestone'),
          ev(2020, 'Data Mesh', 'Данные как корпоративный актив.', 'ecosystem'),
        ],
      },
      {
        id: 'progress-myth',
        label: 'Прогресс',
        events: [
          ev(1946, 'ENIAC', 'Коллективная инженерная команда.', 'milestone'),
          ev(1969, 'UNIX', 'Совместная разработка в Bell Labs.', 'release'),
          ev(1974, 'TCP/IP', 'Стандартизация через IETF.', 'standard'),
          ev(1980, 'COBOL в банках', '"Устаревшие" технологии в критической инфраструктуре.', 'milestone'),
          ev(1991, 'Linux', 'Наследие GNU и сообщества.', 'ecosystem'),
          ev(2010, 'CLI-ренессанс', 'Возврат автоматизации через терминал.', 'milestone'),
        ],
      },
    ],
  },
  'pre-it-era': {
    title: 'До эпохи IT',
    tagline: 'Информация, алгоритмы и учёт до электронных машин',
    accentColor: '#78716c',
    sections: [
      {
        id: 'prehistoric',
        label: 'Доистория',
        events: [
          ev(-40000, 'Наскальная живопись', 'Фиксация состояния и символов.', 'origin'),
          ev(-10000, 'Орудия труда', 'Передача стандартизированных техник.', 'origin'),
          ev(-3500, 'Письменность', 'Кодирование информации.', 'origin'),
          ev(-2000, 'Колесо и плуг', 'Механизация труда.', 'origin'),
          ev(0, 'Римская логистика', 'Учёт и распределение ресурсов.', 'milestone'),
        ],
      },
      {
        id: 'paleolithic-math',
        label: 'Счёт',
        events: [
          ev(-35000, 'Насечки на костях', 'Ранние системы счисления.', 'origin'),
          ev(-25000, 'Лунные циклы', 'Прогнозирование природных явлений.', 'origin'),
          ev(-15000, 'Формальные символы', 'Однозначная интерпретация в сообществе.', 'origin'),
        ],
      },
      {
        id: 'neolithic',
        label: 'Неолит',
        events: [
          ev(-10000, 'Земледелие', 'Оседлость и складской учёт.', 'origin'),
          ev(-8000, 'Глиняные таблички', 'Оттиски печатей.', 'origin'),
          ev(-7000, 'Bullae', 'Контрольные шарики — прототип контрольной суммы.', 'origin'),
        ],
      },
      {
        id: 'writing',
        label: 'Письменность',
        events: [
          ev(-3400, 'Клинопись', 'Урук — учёт транзакций.', 'origin'),
          ev(-3000, 'Писцы', 'Специалисты по обработке информации.', 'origin'),
          ev(-2600, 'Дома табличек', 'Обучение письму.', 'ecosystem'),
        ],
      },
      {
        id: 'science',
        label: 'Наука',
        events: [
          ev(-300, 'Евклид', 'Формальная система с аксиомами.', 'standard'),
          ev(-100, 'Антикитерский механизм', 'Астрономический "компьютер".', 'release'),
          ev(1687, 'Ньютон', 'Вселенная как вычислимая система.', 'milestone'),
        ],
      },
      {
        id: 'empires',
        label: 'Империи',
        events: [
          ev(-221, 'Цинь', 'Унификация мер и архивов.', 'standard'),
          ev(628, 'Ноль', 'Брахмагупта формализует ноль.', 'milestone'),
          ev(1440, 'Печатный станок', 'Массовое копирование.', 'release'),
        ],
      },
      {
        id: 'pre-electric',
        label: 'До электричества',
        events: [
          ev(830, 'Алгебра', 'Аль-Хорезми — формальные алгоритмы.', 'origin'),
          ev(1440, 'Гутенберг', 'Массовая печать в Европе.', 'release'),
          ev(1799, 'Метрическая система', 'Стандартизация и воспроизводимость.', 'standard'),
        ],
      },
    ],
  },
  'computing-stack': {
    title: 'Эволюция вычислений',
    tagline: 'Архитектура, языки, ОС, ПО и облака',
    accentColor: '#0d9488',
    sections: [
      {
        id: 'von-neumann',
        label: 'фон Нейман',
        events: [
          ev(1945, 'ENIAC', 'Программа как физическое состояние.', 'origin'),
          ev(1945, 'Архитектура фон Неймана', 'Программа в памяти.', 'standard'),
          ev(1948, 'Manchester Baby', 'Первая хранимая программа.', 'release'),
          ev(1957, 'Fortran', 'Первый язык высокого уровня.', 'release'),
        ],
      },
      {
        id: 'harvard',
        label: 'Гарвард',
        events: [
          ev(1944, 'Harvard Mark I', 'Разделённая память команд и данных.', 'release'),
          ev(1996, 'AVR / Arduino', 'Гарвардская модель в embedded.', 'ecosystem'),
        ],
      },
      {
        id: 'languages',
        label: 'Языки',
        events: [
          ev(1957, 'Fortran', 'Высокий уровень для науки.', 'release'),
          ev(1959, 'COBOL', 'Бизнес-ориентированный язык.', 'release'),
          ev(1958, 'Lisp', 'Код как данные.', 'release'),
          ev(1960, 'ALGOL 60', 'BNF и формальная семантика.', 'standard'),
        ],
      },
      {
        id: 'os',
        label: 'ОС',
        events: [
          ev(1965, 'OS/360', 'Мультипрограммирование в массовом масштабе.', 'release'),
          ev(1969, 'UNIX', 'Ядро как менеджер ресурсов.', 'release'),
          ev(1973, 'UNIX на C', 'Переносимость ядра.', 'milestone'),
          ev(1989, 'ANSI C', 'Стандарт системного кода.', 'standard'),
        ],
      },
      {
        id: 'sw-arch',
        label: 'Архитектура ПО',
        events: [
          ev(1973, 'Xerox PARC', 'GUI и MVC.', 'origin'),
          ev(1984, 'Macintosh', 'Событийная модель в масс-маркете.', 'release'),
          ev(1994, 'GoF', 'Каталог паттернов проектирования.', 'standard'),
        ],
      },
      {
        id: 'databases',
        label: 'Базы данных',
        events: [
          ev(1970, 'Реляционная модель', 'Эдгар Кодд.', 'origin'),
          ev(2009, 'MongoDB', 'Документные БД.', 'release'),
          ev(2008, 'Cassandra', 'Колоночное распределённое хранение.', 'release'),
        ],
      },
      {
        id: 'cloud',
        label: 'Облако',
        events: [
          ev(2006, 'AWS', 'IaaS/PaaS/SaaS как норма.', 'release'),
          ev(2013, 'Docker', 'Контейнеризация.', 'ecosystem'),
          ev(2015, 'Kubernetes', 'Оркестрация микросервисов.', 'ecosystem'),
        ],
      },
    ],
  },
  internet: {
    title: 'История интернета',
    tagline: 'ARPANET, TCP/IP, DNS, WWW и современный веб',
    accentColor: '#0284c7',
    sections: [
      {
        id: 'birth',
        label: 'Зарождение',
        events: [
          ev(1958, 'ARPA', 'Ответ на запуск "Спутника-1".', 'origin'),
          ev(1964, 'Пакетная коммутация', 'Клейнрок, Баран, Дэвис.', 'origin'),
          ev(1969, 'ARPANET', 'Первые узлы UCLA, SRI, UCSB, Utah.', 'release'),
          ev(1976, 'X.25', 'Стандарт "умной сети" ITU.', 'standard'),
        ],
      },
      {
        id: 'protocols',
        label: 'Протоколы',
        events: [
          ev(1969, 'RFC 1', 'Культура документирования ARPANET.', 'standard'),
          ev(1971, 'Email', 'Первое массовое приложение сети.', 'ecosystem'),
          ev(1974, 'TCP', 'Серф и Кан — датаграммы.', 'release'),
          ev(1983, 'Flag Day', 'Переход ARPANET на TCP/IP.', 'milestone'),
          ev(1986, 'IETF', 'Кооперативная стандартизация.', 'ecosystem'),
        ],
      },
      {
        id: 'dns',
        label: 'DNS',
        events: [
          ev(1970, 'hosts.txt', 'Централизованный список имён.', 'origin'),
          ev(1983, 'DNS', 'RFC 882/883 — иерархия имён.', 'standard'),
          ev(1984, 'BIND', 'Первая реализация DNS в Berkeley Unix.', 'release'),
          ev(2005, 'DNSSEC', 'Целостность записей DNS.', 'standard'),
        ],
      },
      {
        id: 'www',
        label: 'WWW',
        events: [
          ev(1989, 'Proposal в CERN', 'Тим Бернерс-Ли — гипертекст.', 'origin'),
          ev(1990, 'Первый сервер и HTML', 'Браузер-редактор WorldWideWeb.', 'release'),
          ev(1991, 'Публичный WWW', 'Открытие веба внешним пользователям.', 'release'),
          ev(1996, 'HTTP/1.0', 'RFC 1945 — закрепление архитектуры.', 'standard'),
        ],
      },
      {
        id: 'performance',
        label: 'Скорость веба',
        events: [
          ev(1992, 'JPEG', 'Сжатие изображений для веба.', 'ecosystem'),
          ev(1998, 'Akamai', 'Первая коммерческая CDN.', 'ecosystem'),
          ev(2015, 'HTTP/2', 'Мультиплексирование и сжатие заголовков.', 'standard'),
          ev(2022, 'HTTP/3 / QUIC', 'UDP + TLS вместо TCP для веба.', 'standard'),
        ],
      },
      {
        id: 'modern',
        label: '2010–2020-е',
        events: [
          ev(2011, 'WebSocket / WebRTC', 'Асинхрон и P2P в браузере.', 'release'),
          ev(2015, 'Let\'s Encrypt', 'Массовый HTTPS.', 'ecosystem'),
          ev(2017, 'WebAssembly', 'Браузер как вычислительная платформа.', 'release'),
          ev(2023, 'WebGPU', 'GPU в браузере.', 'release'),
        ],
      },
    ],
  },
  'lang-evolution': {
    title: 'Эволюция языков',
    tagline: 'От ENIAC до Rust и TypeScript — смена парадигм',
    accentColor: '#ca8a04',
    sections: [
      {
        id: '1940s',
        label: '1940–50-е',
        events: [
          ev(1945, 'ENIAC', 'Временные диаграммы вместо кода.', 'origin'),
          ev(1949, 'EDSAC', 'Символическая запись программы.', 'release'),
          ev(1950, 'Ассемблеры', 'Мнемоника MOV, ADD.', 'release'),
        ],
      },
      {
        id: 'fortran',
        label: 'Fortran',
        events: [
          ev(1957, 'Fortran', 'Алгебраическая нотация C = A + B.', 'release'),
          ev(1957, 'Статическая типизация', 'Проверка операций при компиляции.', 'standard'),
        ],
      },
      {
        id: 'cobol',
        label: 'COBOL',
        events: [
          ev(1959, 'COBOL', 'Язык для бизнес-специалистов.', 'release'),
          ev(1959, 'Иерархия данных', 'Структуры 01/05 — доменная модель.', 'standard'),
        ],
      },
      {
        id: 'lisp',
        label: 'Lisp',
        events: [
          ev(1958, 'Lisp', 'Код как список — метапрограммирование.', 'release'),
          ev(1958, 'Лямбды', 'Анонимные функции и динамические типы.', 'origin'),
        ],
      },
      {
        id: 'algol',
        label: 'ALGOL',
        events: [
          ev(1960, 'ALGOL 60', 'BNF — формальная грамматика языка.', 'standard'),
          ev(1960, 'Блоки begin/end', 'Лексическая область видимости.', 'standard'),
        ],
      },
      {
        id: 'pascal',
        label: 'Pascal',
        events: [
          ev(1968, 'Структурное программирование', 'Дейкстра — отказ от goto.', 'milestone'),
          ev(1970, 'Pascal', 'Учебная дисциплина и строгие типы.', 'release'),
          ev(1983, 'Turbo Pascal', 'IDE с мгновенной компиляцией.', 'ecosystem'),
        ],
      },
      {
        id: 'c-lang',
        label: 'C',
        events: [
          ev(1972, 'C', 'Структурность + указатели и железо.', 'release'),
          ev(1972, 'Системное ПО', 'ОС и компиляторы на C.', 'ecosystem'),
        ],
      },
      {
        id: 'cpp',
        label: 'C++',
        events: [
          ev(1985, 'C++', 'ООП поверх C: классы, наследование.', 'release'),
          ev(1985, 'Шаблоны', 'Полиморфизм времени компиляции.', 'release'),
        ],
      },
      {
        id: 'java-js',
        label: 'Java / JS',
        events: [
          ev(1995, 'Java', 'JVM, GC, корпоративные системы.', 'release'),
          ev(1995, 'JavaScript', 'Скрипт в браузере за 10 дней.', 'release'),
        ],
      },
      {
        id: 'web-script',
        label: 'Perl / PHP',
        events: [
          ev(1987, 'Perl', 'Текстовая обработка и regex.', 'release'),
          ev(1995, 'PHP', 'Логика внутри HTML, mod_php.', 'release'),
        ],
      },
      {
        id: '2000s',
        label: '2000-е',
        events: [
          ev(2000, 'C# / .NET', 'Управляемый код и enterprise.', 'release'),
          ev(2004, 'Ruby on Rails', 'Convention over configuration.', 'ecosystem'),
        ],
      },
      {
        id: '2010s',
        label: '2010-е',
        events: [
          ev(2010, 'Rust', 'Безопасность памяти без GC.', 'origin'),
          ev(2012, 'TypeScript', 'Типы поверх JavaScript.', 'release'),
          ev(2011, 'Kotlin', 'Современная JVM для Android.', 'release'),
        ],
      },
    ],
  },
};
