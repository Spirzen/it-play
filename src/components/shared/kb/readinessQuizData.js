/** Конфигурации диагностических тестов «Дорожная карта изучения». */

const NAVIGATOR_URL = 'https://lab.spirzen.ru/lab/Планы%20развития/7';

function mc(id, text, options, explanation) {
  return {id, text, options, explanation};
}

export const READINESS_QUIZZES = {
  programming: {
    id: 'programming',
    title: 'Готовность к программированию',
    subtitle: 'Логика, среда, инструменты и основы кода — без экзамена по синтаксису',
    accent: '#6366f1',
    emoji: '⌨️',
    passScore: 65,
    blocks: [
      {
        id: 'env',
        title: 'Среда и терминал',
        emoji: '🖥️',
        questions: [
          mc(
            'env-1',
            'Что делает операционная система для запущенной программы?',
            [
              {id: 'a', text: 'Только рисует окна на экране', correct: false},
              {id: 'b', text: 'Выделяет память, планирует потоки, даёт доступ к файлам и сети', correct: true},
              {id: 'c', text: 'Компилирует исходный код в exe', correct: false},
              {id: 'd', text: 'Хранит пароли пользователя', correct: false},
            ],
            'ОС — прослойка между железом и приложениями: память, CPU, файлы, сеть, изоляция процессов.',
          ),
          mc(
            'env-2',
            'Чем RAM отличается от файла на диске при выключении ПК?',
            [
              {id: 'a', text: 'RAM очищается, файл на диске остаётся', correct: true},
              {id: 'b', text: 'Оба сохраняются одинаково', correct: false},
              {id: 'c', text: 'Файл пропадает, RAM сохраняется', correct: false},
              {id: 'd', text: 'RAM медленнее диска', correct: false},
            ],
            'Оперативная память — энергозависима; постоянное хранение — на диске.',
          ),
          mc(
            'env-3',
            'Загрузка CPU 90% — это всегда плохо?',
            [
              {id: 'a', text: 'Да, процессор нельзя нагружать выше 50%', correct: false},
              {id: 'b', text: 'Нет: может быть тяжёлая задача; плохо, если так постоянно без причины', correct: true},
              {id: 'c', text: 'Да, это всегда вирус', correct: false},
              {id: 'd', text: 'Не имеет значения для разработчика', correct: false},
            ],
            'Кратковременная нагрузка нормальна; хроническая без задачи — повод разбираться.',
          ),
        ],
      },
      {
        id: 'code',
        title: 'Основы кода',
        emoji: '🧩',
        questions: [
          mc(
            'code-1',
            'Когда нужен if, а когда цикл?',
            [
              {id: 'a', text: 'if — ветвление по условию; цикл — повторение', correct: true},
              {id: 'b', text: 'if всегда быстрее цикла', correct: false},
              {id: 'c', text: 'Цикл только для массивов, if только для чисел', correct: false},
              {id: 'd', text: 'Это синонимы в современных языках', correct: false},
            ],
            'if выбирает путь; цикл повторяет блок, пока условие или счётчик позволяют.',
          ),
          mc(
            'code-2',
            'Зачем выносить код в функцию?',
            [
              {id: 'a', text: 'Чтобы программа занимала больше места на диске', correct: false},
              {id: 'b', text: 'Не дублировать логику, тестировать кусок отдельно, читать проще', correct: true},
              {id: 'c', text: 'Компилятор требует минимум 10 функций', correct: false},
              {id: 'd', text: 'Только для математических формул', correct: false},
            ],
            'Функция — именованный блок с одной ответственностью.',
          ),
          mc(
            'code-3',
            'Почему 10 / 4 в Python 3 даёт 2.5, а в C при int/int часто 2?',
            [
              {id: 'a', text: 'Python ошибается', correct: false},
              {id: 'b', text: 'Разные правила деления: float vs целочисленное', correct: true},
              {id: 'c', text: 'В C нет оператора деления', correct: false},
              {id: 'd', text: 'Зависит только от версии Windows', correct: false},
            ],
            'Типы операндов задают семантику: 2.5 vs усечённое целое 2.',
          ),
        ],
      },
      {
        id: 'tools',
        title: 'Разработка и инструменты',
        emoji: '🔧',
        questions: [
          mc(
            'tools-1',
            'Зачем Git, если файлы и так на диске?',
            [
              {id: 'a', text: 'История, ветки, откат, работа в команде без «файл_финал_2.zip»', correct: true},
              {id: 'b', text: 'Git ускоряет процессор', correct: false},
              {id: 'c', text: 'Без Git код не запускается', correct: false},
              {id: 'd', text: 'Только для JavaScript', correct: false},
            ],
            'VCS фиксирует снимки, ветки и слияния — основа командной разработки.',
          ),
          mc(
            'tools-2',
            'Breakpoint в отладчике — зачем?',
            [
              {id: 'a', text: 'Удалить строку кода', correct: false},
              {id: 'b', text: 'Остановить выполнение и посмотреть переменные', correct: true},
              {id: 'c', text: 'Автоматически исправить баг', correct: false},
              {id: 'd', text: 'Заменить Git commit', correct: false},
            ],
            'Точка останова — пауза для инспекции состояния программы.',
          ),
          mc(
            'tools-3',
            'Библиотека vs фреймворк — кто «ведёт» выполнение?',
            [
              {id: 'a', text: 'Библиотеку вызываете вы; фреймворк задаёт каркас приложения', correct: true},
              {id: 'b', text: 'Фреймворк — это устаревшая библиотека', correct: false},
              {id: 'c', text: 'Библиотека всегда больше по размеру', correct: false},
              {id: 'd', text: 'Разницы нет', correct: false},
            ],
            'Пример: вы вызываете lodash; Spring/Django задают точки входа и жизненный цикл.',
          ),
        ],
      },
      {
        id: 'ds',
        title: 'Структуры данных и ООП',
        emoji: '📦',
        questions: [
          mc(
            'ds-1',
            'Класс и объект — в чём разница?',
            [
              {id: 'a', text: 'Класс — чертёж; объект — экземпляр в памяти', correct: true},
              {id: 'b', text: 'Объект создаётся раньше класса', correct: false},
              {id: 'c', text: 'Класс существует только в Python', correct: false},
              {id: 'd', text: 'Это синонимы', correct: false},
            ],
            'Класс описывает структуру; объект — конкретный экземпляр с полями и методами.',
          ),
          mc(
            'ds-2',
            'Стек — какой принцип?',
            [
              {id: 'a', text: 'FIFO — первым пришёл, первым вышел', correct: false},
              {id: 'b', text: 'LIFO — последним пришёл, первым вышел', correct: true},
              {id: 'c', text: 'Случайный доступ', correct: false},
              {id: 'd', text: 'Только для сортировки', correct: false},
            ],
            'Стек — как стопка тарелок; очередь — FIFO.',
          ),
          mc(
            'ds-3',
            'Поиск в неотсортированном массиве из n элементов — порядок сложности?',
            [
              {id: 'a', text: 'O(1)', correct: false},
              {id: 'b', text: 'O(log n)', correct: false},
              {id: 'c', text: 'O(n) — линейный', correct: true},
              {id: 'd', text: 'O(n²) всегда', correct: false},
            ],
            'В худшем случае просматриваем каждый элемент один раз.',
          ),
        ],
      },
      {
        id: 'lang',
        title: 'Языки — ориентиры',
        emoji: '🌐',
        questions: [
          mc(
            'lang-1',
            'Какой язык выполняется в браузере без компиляции в отдельный exe?',
            [
              {id: 'a', text: 'JavaScript', correct: true},
              {id: 'b', text: 'C++', correct: false},
              {id: 'c', text: 'Go', correct: false},
              {id: 'd', text: 'Rust', correct: false},
            ],
            'JS — родной язык веб-страниц; остальные — компилируемые или через WASM.',
          ),
          mc(
            'lang-2',
            'Python часто берут для скриптов и данных — почему? (два фактора)',
            [
              {id: 'a', text: 'Простой синтаксис и богатая экосистема (pandas, ML, скрипты)', correct: true},
              {id: 'b', text: 'Единственный язык с переменными', correct: false},
              {id: 'c', text: 'Не требует установки', correct: false},
              {id: 'd', text: 'Работает только в Excel', correct: false},
            ],
            'Низкий порог входа + библиотеки для данных и автоматизации.',
          ),
          mc(
            'lang-3',
            'Go — одна фишка для серверов?',
            [
              {id: 'a', text: 'Горoutines, простой синтаксис, быстрая сборка, один бинарник', correct: true},
              {id: 'b', text: 'Только для мобильных приложений', correct: false},
              {id: 'c', text: 'Не поддерживает HTTP', correct: false},
              {id: 'd', text: 'Обязателен garbage collector вручную', correct: false},
            ],
            'Go заточен под сетевые сервисы и конкурентность.',
          ),
        ],
      },
    ],
    blockLinks: {
      env: {label: 'Терминал — о разделе', url: 'https://spirzen.ru/encyclopedia/2-system-network/2-05-terminal/intro'},
      code: {label: 'Что такое код', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-02-chto-takoe-kod-i-kak-on-rabotaet/intro'},
      tools: {label: 'Основы Git', url: 'https://spirzen.ru/encyclopedia/4-code-dev/4-13-osnovy-raboty-s-git/intro'},
      ds: {label: 'Структуры данных', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-02-struktury-dannyh/intro'},
      lang: {label: 'Классификация языков', url: 'https://spirzen.ru/encyclopedia/1-basics/1-24-osnovnye-yazyki/intro'},
    },
    navigatorUrl: NAVIGATOR_URL,
  },

  literacy: {
    id: 'literacy',
    title: 'Компьютерная грамотность',
    subtitle: 'Файлы, ОС, сеть, безопасность и цифровая этика',
    accent: '#0ea5e9',
    emoji: '🖱️',
    passScore: 60,
    blocks: [
      {
        id: 'os',
        title: 'ОС, файлы и повседневные действия',
        emoji: '📁',
        questions: [
          mc(
            'os-1',
            'Чем операционная система отличается от браузера?',
            [
              {id: 'a', text: 'ОС управляет железом и даёт среду приложениям; браузер — одно из приложений', correct: true},
              {id: 'b', text: 'Браузер — часть процессора', correct: false},
              {id: 'c', text: 'ОС работает только в интернете', correct: false},
              {id: 'd', text: 'Разницы нет', correct: false},
            ],
            'Windows/macOS/Linux — платформа; Chrome/Firefox — программы поверх неё.',
          ),
          mc(
            'os-2',
            'Файл сохранён на рабочий стол, а не в «Документы». Где искать?',
            [
              {id: 'a', text: 'На рабочем столе — это отдельная папка', correct: true},
              {id: 'b', text: 'Он автоматически переехал в Документы', correct: false},
              {id: 'c', text: 'Удалился', correct: false},
              {id: 'd', text: 'Только в облаке', correct: false},
            ],
            'Рабочий стол и Документы — разные каталоги; путь виден в Проводнике.',
          ),
          mc(
            'os-3',
            'В URL `https://example.com/news?id=42&lang=ru` часть после `?` — это…',
            [
              {id: 'a', text: 'Параметры запроса (query string)', correct: true},
              {id: 'b', text: 'Пароль пользователя', correct: false},
              {id: 'c', text: 'Имя файла на диске', correct: false},
              {id: 'd', text: 'Версия HTML', correct: false},
            ],
            'Сервер или фронтенд читают id, lang и другие параметры из строки запроса.',
          ),
        ],
      },
      {
        id: 'paths',
        title: 'Папки, пути и резервные копии',
        emoji: '🗂️',
        questions: [
          mc(
            'paths-1',
            'Из папки `Веб` относительный путь к `Документация/readme.txt` — …',
            [
              {id: 'a', text: '../Документация/readme.txt', correct: true},
              {id: 'b', text: 'C:\\readme.txt', correct: false},
              {id: 'c', text: './Веб/readme.txt', correct: false},
              {id: 'd', text: 'http://readme.txt', correct: false},
            ],
            'Относительный путь — от текущей папки вверх и в соседнюю ветку.',
          ),
          mc(
            'paths-2',
            'Правило резервного копирования 3-2-1 означает…',
            [
              {id: 'a', text: '3 копии, 2 типа носителей, 1 копия вне дома/офиса', correct: true},
              {id: 'b', text: '3 пароля, 2 браузера, 1 антивирус', correct: false},
              {id: 'c', text: 'Копировать раз в 3 года', correct: false},
              {id: 'd', text: 'Хранить только в ZIP', correct: false},
            ],
            'Смысл — пережить поломку диска, кражу или пожар.',
          ),
          mc(
            'paths-3',
            'Можно ли в одной папке хранить два файла `readme.txt`?',
            [
              {id: 'a', text: 'Нет — имена в одной папке должны различаться', correct: true},
              {id: 'b', text: 'Да, если разный цвет иконки', correct: false},
              {id: 'c', text: 'Да, Windows сам переименует', correct: false},
              {id: 'd', text: 'Только на Mac', correct: false},
            ],
            'Файловая система не допускает коллизий имён в одном каталоге.',
          ),
        ],
      },
      {
        id: 'apps',
        title: 'Программы и работа в ОС',
        emoji: '⚙️',
        questions: [
          mc(
            'apps-1',
            'Программа «не отвечает» в Windows. Какой инструмент завершит процесс?',
            [
              {id: 'a', text: 'Диспетчер задач (Ctrl+Shift+Esc)', correct: true},
              {id: 'b', text: 'Блокнот', correct: false},
              {id: 'c', text: 'Пaint', correct: false},
              {id: 'd', text: 'Калькулятор', correct: false},
            ],
            'Диспетчер задач → «Снять задачу» для зависшего процесса.',
          ),
          mc(
            'apps-2',
            'Зачем не забивать автозагрузку всем подряд?',
            [
              {id: 'a', text: 'Лишние программы замедляют вход в систему и занимают память', correct: true},
              {id: 'b', text: 'Windows запрещает больше 3 программ', correct: false},
              {id: 'c', text: 'Автозагрузка отключает интернет', correct: false},
              {id: 'd', text: 'Это влияет только на мышь', correct: false},
            ],
            'Каждый автостарт — время загрузки и RAM.',
          ),
          mc(
            'apps-3',
            'Portable-версия программы отличается от установленной тем, что…',
            [
              {id: 'a', text: 'Запускается из папки без инсталлятора в Program Files', correct: true},
              {id: 'b', text: 'Работает только offline', correct: false},
              {id: 'c', text: 'Не имеет интерфейса', correct: false},
              {id: 'd', text: 'Это всегда вирус', correct: false},
            ],
            'Portable не пишет в реестр и системные каталоги.',
          ),
        ],
      },
      {
        id: 'net',
        title: 'Сеть и браузер',
        emoji: '🌐',
        questions: [
          mc(
            'net-1',
            'Зачем устройству IP, если пользователь вводит доменное имя?',
            [
              {id: 'a', text: 'Сеть маршрутизирует по IP; DNS связывает имя с адресом', correct: true},
              {id: 'b', text: 'IP нужен только для Wi‑Fi пароля', correct: false},
              {id: 'c', text: 'Домен заменяет IP полностью', correct: false},
              {id: 'd', text: 'IP — это имя файла', correct: false},
            ],
            'DNS — «телефонная книга» интернета.',
          ),
          mc(
            'net-2',
            'Что гарантирует префикс https:// на бытовом уровне?',
            [
              {id: 'a', text: 'Шифрование трафика между браузером и сервером (TLS)', correct: true},
              {id: 'b', text: 'Сайт всегда легальный', correct: false},
              {id: 'c', text: 'Отсутствие рекламы', correct: false},
              {id: 'd', text: 'Бесплатный интернет', correct: false},
            ],
            'HTTPS ≠ доверие к содержимому, но защищает канал.',
          ),
          mc(
            'net-3',
            'Wi‑Fi подключён, сайты не открываются. Две правдоподобные причины:',
            [
              {id: 'a', text: 'Нужен вход через портал отеля или сбой DNS / неверный прокси', correct: true},
              {id: 'b', text: 'Сломался монитор', correct: false},
              {id: 'c', text: 'Закончилась оперативная память в роутере навсегда', correct: false},
              {id: 'd', text: 'Браузер не поддерживает HTML', correct: false},
            ],
            'Локальная связь есть, но выхода в интернет или резолвинга имён — нет.',
          ),
        ],
      },
      {
        id: 'sec',
        title: 'Безопасность',
        emoji: '🔒',
        questions: [
          mc(
            'sec-1',
            'Зачем разные пароли на разных сервисах?',
            [
              {id: 'a', text: 'Утечка с одного сайта не откроет все остальные аккаунты', correct: true},
              {id: 'b', text: 'Так требует закон о длине 8 символов', correct: false},
              {id: 'c', text: 'Один пароль медленнее вводить', correct: false},
              {id: 'd', text: 'Браузеры не поддерживают повтор', correct: false},
            ],
            'Credential stuffing — массовая проверка утёкших пар.',
          ),
          mc(
            'sec-2',
            '2FA добавляет, если пароль утёк…',
            [
              {id: 'a', text: 'Второй фактор без которого вход не завершить', correct: true},
              {id: 'b', text: 'Новый пароль автоматически', correct: false},
              {id: 'c', text: 'Блокировку интернета', correct: false},
              {id: 'd', text: 'Удаление аккаунта', correct: false},
            ],
            'Код из приложения, SMS или ключ — дополнительный барьер.',
          ),
          mc(
            'sec-3',
            'Признак фишингового письма «от банка»:',
            [
              {id: 'a', text: 'Срочность, чужой домен в ссылке, просьба ввести карту по email', correct: true},
              {id: 'b', text: 'Корректная подпись сотрудника без ссылок', correct: false},
              {id: 'c', text: 'Напоминание о личном визите в отделение', correct: false},
              {id: 'd', text: 'PDF со справкой без URL', correct: false},
            ],
            'Банк не просит реквизиты карты по ссылке из письма.',
          ),
        ],
      },
      {
        id: 'ethics',
        title: 'Этика, поиск и проверка источников',
        emoji: '🔍',
        questions: [
          mc(
            'ethics-1',
            'Можно ли вставить картинку из Google Картинок в презентацию «как нашлась»?',
            [
              {id: 'a', text: 'Обычно нет без лицензии; нужны CC, сток или своё фото', correct: true},
              {id: 'b', text: 'Да, всё в интернете бесплатно', correct: false},
              {id: 'c', text: 'Да, если уменьшить размер', correct: false},
              {id: 'd', text: 'Только запрещено в PDF', correct: false},
            ],
            'Авторское право и лицензии действуют и в учебных работах.',
          ),
          mc(
            'ethics-2',
            'Оператор `site:gov.ru` в поиске нужен, чтобы…',
            [
              {id: 'a', text: 'Ограничить выдачу одним доменом — отсечь мусорные сайты', correct: true},
              {id: 'b', text: 'Ускорить процессор', correct: false},
              {id: 'c', text: 'Скрыть результаты от других', correct: false},
              {id: 'd', text: 'Включить VPN', correct: false},
            ],
            'Полезно для официальных документов и регламентов.',
          ),
          mc(
            'ethics-3',
            'Цифровой след — это…',
            [
              {id: 'a', text: 'След из действий в сети: публикации, логи, история поиска', correct: true},
              {id: 'b', text: 'Пыль на мониторе', correct: false},
              {id: 'c', text: 'След от мыши на коврике', correct: false},
              {id: 'd', text: 'Только cookies рекламных сетей', correct: false},
            ],
            'Данные о вас сохраняются надолго — думайте перед публикацией.',
          ),
        ],
      },
    ],
    blockLinks: {
      os: {label: 'Основы компьютерной грамотности', url: 'https://spirzen.ru/encyclopedia/1-basics/1-035-bazovaya-informatika/101'},
      paths: {label: 'Исполняемые файлы и архивы', url: 'https://spirzen.ru/encyclopedia/1-basics/1-20-ispolnyaemye-fayly-i-arhivy/intro'},
      apps: {label: 'Операционная система', url: 'https://spirzen.ru/encyclopedia/2-system-network/2-01-operatsionnaya-sistema/intro'},
      net: {label: 'Сеть и интернет', url: 'https://spirzen.ru/encyclopedia/2-system-network/2-03-set-i-internet/intro'},
      sec: {label: 'Основы информационной безопасности', url: 'https://spirzen.ru/encyclopedia/2-system-network/2-08-osnovy-informatsionnoy-bezopasnosti/intro'},
      ethics: {label: 'Поиск информации', url: 'https://spirzen.ru/encyclopedia/1-basics/1-21-poisk-informatsii/intro'},
    },
    navigatorUrl: NAVIGATOR_URL,
  },

  data: {
    id: 'data',
    title: 'Готовность к работе с данными',
    subtitle: 'Структуры, качество, операции и базы данных',
    accent: '#10b981',
    emoji: '📊',
    passScore: 60,
    blocks: [
      {
        id: 'info',
        title: 'Данные и информация',
        emoji: '📋',
        questions: [
          mc(
            'info-1',
            'Строка лога `2026-01-14T08:23:11Z | user_4582 | login_success` — это…',
            [
              {id: 'a', text: 'Сырые данные; станут информацией после интерпретации', correct: true},
              {id: 'b', text: 'Уже готовый бизнес-отчёт', correct: false},
              {id: 'c', text: 'Только шум без смысла', correct: false},
              {id: 'd', text: 'XML-документ', correct: false},
            ],
            'Вопрос «сколько успешных входов за час?» превращает данные в информацию.',
          ),
          mc(
            'info-2',
            'В колонке email встречаются N/A, «-» и пустые строки. Это проблема…',
            [
              {id: 'a', text: 'Полноты (missing values) и согласованности формата', correct: true},
              {id: 'b', text: 'Только цвета ячеек', correct: false},
              {id: 'c', text: 'Скорости CPU', correct: false},
              {id: 'd', text: 'Лицензии Excel', correct: false},
            ],
            'Качество данных — основа аналитики.',
          ),
          mc(
            'info-3',
            'Пример неструктурированных данных:',
            [
              {id: 'a', text: 'Свободный текст письма без разметки', correct: true},
              {id: 'b', text: 'CSV с фиксированными колонками', correct: false},
              {id: 'c', text: 'JSON с полями id и name', correct: false},
              {id: 'd', text: 'SQL-таблица employees', correct: false},
            ],
            'Структурированные — таблицы, CSV, JSON с полями.',
          ),
        ],
      },
      {
        id: 'struct',
        title: 'Структуры данных',
        emoji: '🧱',
        questions: [
          mc(
            'struct-1',
            'Поиск пользователя по id в списке из 100 000 записей — почему «голый» массив неудобен?',
            [
              {id: 'a', text: 'Поиск O(n) — при частых запросах дорого', correct: true},
              {id: 'b', text: 'Массивы запрещены в Python', correct: false},
              {id: 'c', text: 'id нельзя хранить в памяти', correct: false},
              {id: 'd', text: 'Нужен только Excel', correct: false},
            ],
            'Hash map / словарь даёт O(1) в среднем по ключу.',
          ),
          mc(
            'struct-2',
            'Кнопка «Отменить» в редакторе — стек или очередь?',
            [
              {id: 'a', text: 'Стек (LIFO) — отменяется последнее действие', correct: true},
              {id: 'b', text: 'Очередь (FIFO)', correct: false},
              {id: 'c', text: 'Граф', correct: false},
              {id: 'd', text: 'Двоичное дерево поиска', correct: false},
            ],
            'Undo/redo — классический стек.',
          ),
          mc(
            'struct-3',
            'Маршруты между городами естественно моделировать как…',
            [
              {id: 'a', text: 'Граф (ориентированный)', correct: true},
              {id: 'b', text: 'Один числовой массив', correct: false},
              {id: 'c', text: 'Стек строк', correct: false},
              {id: 'd', text: 'Bitmap пикселей', correct: false},
            ],
            'Вершины — города, рёбра — рейсы/дороги.',
          ),
        ],
      },
      {
        id: 'ops',
        title: 'Операции с данными',
        emoji: '🔀',
        questions: [
          mc(
            'ops-1',
            'Чем фильтрация отличается от агрегации?',
            [
              {id: 'a', text: 'Фильтр отбирает строки; агрегация сворачивает много значений в одно', correct: true},
              {id: 'b', text: 'Это синонимы в SQL', correct: false},
              {id: 'c', text: 'Агрегация только в Excel', correct: false},
              {id: 'd', text: 'Фильтр всегда удаляет таблицу', correct: false},
            ],
            'WHERE vs SUM/COUNT/GROUP BY.',
          ),
          mc(
            'ops-2',
            'Inner join по user_id: пользователь без заказов попадёт в результат?',
            [
              {id: 'a', text: 'Нет — только совпадающие ключи', correct: true},
              {id: 'b', text: 'Да, с NULL во всех полях', correct: false},
              {id: 'c', text: 'Да, дублируется трижды', correct: false},
              {id: 'd', text: 'Join не работает с id', correct: false},
            ],
            'Для «всех пользователей, даже без заказов» — LEFT JOIN.',
          ),
          mc(
            'ops-3',
            'Обогащение данных — это…',
            [
              {id: 'a', text: 'Добавление полей из справочника, например координат к адресам', correct: true},
              {id: 'b', text: 'Удаление половины строк', correct: false},
              {id: 'c', text: 'Шифрование диска', correct: false},
              {id: 'd', text: 'Смена языка интерфейса', correct: false},
            ],
            'Enrichment дополняет записи внешними источниками.',
          ),
        ],
      },
      {
        id: 'sql',
        title: 'SQL и NoSQL',
        emoji: '🗄️',
        questions: [
          mc(
            'sql-1',
            'В реляционной БД структура таблиц задаётся…',
            [
              {id: 'a', text: 'В схеме (типы, ограничения)', correct: true},
              {id: 'b', text: 'В каждом документе по-своему', correct: false},
              {id: 'c', text: 'Только в README', correct: false},
              {id: 'd', text: 'Автоматически браузером', correct: false},
            ],
            'Схема — контракт таблиц и связей.',
          ),
          mc(
            'sql-2',
            'Документ MongoDB с вложенным массивом orders — модель…',
            [
              {id: 'a', text: 'Документная NoSQL', correct: true},
              {id: 'b', text: 'Графовая только', correct: false},
              {id: 'c', text: 'Колоночная OLAP', correct: false},
              {id: 'd', text: 'Ключ-значение Redis', correct: false},
            ],
            'JSON-подобные документы — document store.',
          ),
          mc(
            'sql-3',
            'Когда SQL предпочтительнее NoSQL (кратко)?',
            [
              {id: 'a', text: 'Транзакции, связи, сложные отчёты, строгая целостность', correct: true},
              {id: 'b', text: 'Когда нужны только мемы', correct: false},
              {id: 'c', text: 'Когда данных меньше 10 строк', correct: false},
              {id: 'd', text: 'Когда не нужны индексы', correct: false},
            ],
            'Финансы, учёт, ERP — классический реляционный стек.',
          ),
        ],
      },
    ],
    blockLinks: {
      info: {label: 'Данные и информация', url: 'https://spirzen.ru/encyclopedia/1-basics/1-09-dannye-i-informatsiya/intro'},
      struct: {label: 'Структуры данных', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-02-struktury-dannyh/intro'},
      ops: {label: 'Анализ данных', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-11-analiz-dannyh/intro'},
      sql: {label: 'Первые шаги с SQL', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-07-sql/101'},
    },
    navigatorUrl: NAVIGATOR_URL,
  },

  web: {
    id: 'web',
    title: 'Готовность к веб-разработке',
    subtitle: 'HTTP, архитектура, HTML, CSS и JavaScript',
    accent: '#f59e0b',
    emoji: '🌍',
    passScore: 60,
    blocks: [
      {
        id: 'http',
        title: 'Сеть и HTTP',
        emoji: '📡',
        questions: [
          mc(
            'http-1',
            'Пользователь вводит URL — четыре шага до HTML (упрощённо):',
            [
              {id: 'a', text: 'DNS → IP; TCP; HTTP-запрос; ответ и разбор браузером', correct: true},
              {id: 'b', text: 'Сразу скачивается exe', correct: false},
              {id: 'c', text: 'Только CSS без сервера', correct: false},
              {id: 'd', text: 'Git push origin main', correct: false},
            ],
            'Без мельчайших деталей TLS — общая цепочка веб-запроса.',
          ),
          mc(
            'http-2',
            'DNS_PROBE_FINISHED_NXDOMAIN означает…',
            [
              {id: 'a', text: 'DNS не нашёл имя (опечатка, домен не существует, сбой DNS)', correct: true},
              {id: 'b', text: 'Сайт заблокирован антивирусом навсегда', correct: false},
              {id: 'c', text: 'Закончился CSS', correct: false},
              {id: 'd', text: 'Нужен Python 3.12', correct: false},
            ],
            'NXDOMAIN — «такого имени нет».',
          ),
          mc(
            'http-3',
            'Форма логина с паролем — какой HTTP-метод и почему не GET?',
            [
              {id: 'a', text: 'POST — данные в теле, не в URL и истории браузера', correct: true},
              {id: 'b', text: 'GET — быстрее', correct: false},
              {id: 'c', text: 'DELETE — стандарт для логина', correct: false},
              {id: 'd', text: 'OPTIONS — единственный безопасный', correct: false},
            ],
            'GET оставляет параметры в адресной строке и логах.',
          ),
        ],
      },
      {
        id: 'arch',
        title: 'Фронтенд, бэкенд, API',
        emoji: '🏗️',
        questions: [
          mc(
            'arch-1',
            'Статический сайт vs веб-приложение для пользователя:',
            [
              {id: 'a', text: 'Статика — одни файлы всем; приложение — данные и UI меняются от действий', correct: true},
              {id: 'b', text: 'Нет разницы', correct: false},
              {id: 'c', text: 'Приложение не использует сервер', correct: false},
              {id: 'd', text: 'Статика требует PostgreSQL', correct: false},
            ],
            'Интерактивность и персонализация — признак приложения.',
          ),
          mc(
            'arch-2',
            'Заметки пропадают после F5 — чего не хватает?',
            [
              {id: 'a', text: 'Бэкенда и хранилища (БД или серверное API)', correct: true},
              {id: 'b', text: 'Только большего монитора', correct: false},
              {id: 'c', text: 'Компилятора C++', correct: false},
              {id: 'd', text: 'FTP вместо HTTP', correct: false},
            ],
            'localStorage — костыль; для «настоящего» приложения нужен сервер.',
          ),
          mc(
            'arch-3',
            'CORS-ошибка при POST с другого origin — кто должен разрешить?',
            [
              {id: 'a', text: 'Сервер API — заголовки Access-Control-Allow-*', correct: true},
              {id: 'b', text: 'Только браузер пользователя в настройках', correct: false},
              {id: 'c', text: 'DNS провайдер', correct: false},
              {id: 'd', text: 'React автоматически без сервера', correct: false},
            ],
            'Политика same-origin; сервер явно доверяет origin фронта.',
          ),
        ],
      },
      {
        id: 'html',
        title: 'HTML',
        emoji: '📝',
        questions: [
          mc(
            'html-1',
            'Зачем `<main>`, `<article>`, `<nav>` вместо одних `<div>`?',
            [
              {id: 'a', text: 'Семантика для SEO и скринридеров — не только «коробки»', correct: true},
              {id: 'b', text: 'div запрещён в HTML5', correct: false},
              {id: 'c', text: 'Только для красоты шрифта', correct: false},
              {id: 'd', text: 'Ускоряют CPU в 10 раз', correct: false},
            ],
            'Доступность и структура документа.',
          ),
          mc(
            'html-2',
            'Как связать `<label>` с полем ввода?',
            [
              {id: 'a', text: 'Атрибут for у label = id у input', correct: true},
              {id: 'b', text: 'Одинаковый class без id', correct: false},
              {id: 'c', text: 'Вложить label в footer', correct: false},
              {id: 'd', text: 'Только через JavaScript', correct: false},
            ],
            'Клик по label фокусирует связанное поле.',
          ),
          mc(
            'html-3',
            '`<img>` без alt — кому мешает?',
            [
              {id: 'a', text: 'Скринридерам и пользователям при ошибке загрузки', correct: true},
              {id: 'b', text: 'Только принтеру', correct: false},
              {id: 'c', text: 'Никому — alt необязателен', correct: false},
              {id: 'd', text: 'Только серверу nginx', correct: false},
            ],
            'alt — текстовая альтернатива изображения.',
          ),
        ],
      },
      {
        id: 'css',
        title: 'CSS',
        emoji: '🎨',
        questions: [
          mc(
            'css-1',
            '`box-sizing: border-box` при width: 80% означает…',
            [
              {id: 'a', text: 'Padding и border входят в 80%, блок не «раздувается»', correct: true},
              {id: 'b', text: 'Ширина игнорируется', correct: false},
              {id: 'c', text: 'Только для мобильных', correct: false},
              {id: 'd', text: 'Отключает margin', correct: false},
            ],
            'content-box по умолчанию добавляет padding/border сверх width.',
          ),
          mc(
            'css-2',
            'Сетка карточек: 1/2/3 колонки по breakpoints — удобнее…',
            [
              {id: 'a', text: 'CSS Grid с grid-template-columns и @media', correct: true},
              {id: 'b', text: 'Только таблицы HTML', correct: false},
              {id: 'c', text: 'Только inline style на каждой карточке', correct: false},
              {id: 'd', text: 'Один br между карточками', correct: false},
            ],
            'Grid — естественный инструмент для 2D-сеток.',
          ),
          mc(
            'css-3',
            'Почему не злоупотреблять `!important`?',
            [
              {id: 'a', text: 'Ломает каскад и усложняет поддержку', correct: true},
              {id: 'b', text: 'Замедляет интернет', correct: false},
              {id: 'c', text: 'Запрещено спецификацией', correct: false},
              {id: 'd', text: 'Удаляет HTML', correct: false},
            ],
            'Каскад — основа предсказуемых стилей.',
          ),
        ],
      },
      {
        id: 'js',
        title: 'JavaScript',
        emoji: '⚡',
        questions: [
          mc(
            'js-1',
            'DOM — это…',
            [
              {id: 'a', text: 'Дерево узлов HTML в памяти; JS меняет узлы — меняется страница', correct: true},
              {id: 'b', text: 'База данных PostgreSQL', correct: false},
              {id: 'c', text: 'Файл styles.css', correct: false},
              {id: 'd', text: 'Протокол TCP', correct: false},
            ],
            'Document Object Model — мост между JS и разметкой.',
          ),
          mc(
            'js-2',
            'Скрипт в `<head>` без defer — риск…',
            [
              {id: 'a', text: 'Выполнится до построения DOM — getElementById вернёт null', correct: true},
              {id: 'b', text: 'Удалит все стили', correct: false},
              {id: 'c', text: 'Заблокирует DNS', correct: false},
              {id: 'd', text: 'Нет рисков', correct: false},
            ],
            'defer/async или скрипт перед </body> — классические решения.',
          ),
          mc(
            'js-3',
            'fetch возвращает Promise — что проверить кроме response.json()?',
            [
              {id: 'a', text: 'response.ok, статус HTTP, сетевые ошибки в catch', correct: true},
              {id: 'b', text: 'Только цвет кнопки', correct: false},
              {id: 'c', text: 'Версию Windows', correct: false},
              {id: 'd', text: 'Ничего — fetch не падает', correct: false},
            ],
            '404/500 не бросают исключение автоматически.',
          ),
        ],
      },
    ],
    blockLinks: {
      http: {label: 'HTTP и HTTPS', url: 'https://spirzen.ru/encyclopedia/2-system-network/2-03-set-i-internet/11'},
      arch: {label: 'Фронтенд и бэкенд', url: 'https://spirzen.ru/encyclopedia/1-basics/1-23-frontend-i-bekend/intro'},
      html: {label: 'HTML — о разделе', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-09-html/intro'},
      css: {label: 'CSS — о разделе', url: 'https://spirzen.ru/encyclopedia/3-data-markup/3-10-css/intro'},
      js: {label: 'JavaScript — о разделе', url: 'https://spirzen.ru/encyclopedia/5-languages/5-01-javascript/intro'},
    },
    navigatorUrl: NAVIGATOR_URL,
  },
};

export function getReadinessQuiz(quizId) {
  return READINESS_QUIZZES[quizId] ?? null;
}

export function flattenQuestions(quiz) {
  const items = [];
  for (const block of quiz.blocks) {
    for (const question of block.questions) {
      items.push({...question, blockId: block.id, blockTitle: block.title, blockEmoji: block.emoji});
    }
  }
  return items;
}
