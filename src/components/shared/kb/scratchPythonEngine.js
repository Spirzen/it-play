/** Данные для таблицы Scratch ↔ Python (Lab / 1127) */

export const SCRATCH_CATEGORIES = [
  {id: 'events', label: 'События', color: '#ffbf00'},
  {id: 'control', label: 'Управление', color: '#ffab19'},
  {id: 'motion', label: 'Движение', color: '#4c97ff'},
  {id: 'looks', label: 'Внешний вид', color: '#9966ff'},
  {id: 'sensing', label: 'Сенсоры', color: '#5cb1d6'},
  {id: 'operators', label: 'Операторы', color: '#59c059'},
  {id: 'variables', label: 'Переменные', color: '#ff8c1a'},
  {id: 'pen', label: 'Перо', color: '#0fbd8c'},
];

export const BLOCK_MAPPINGS = [
  {
    id: 'flag',
    category: 'events',
    scratch: 'когда щёлкнут по ⚑',
    python: '# точка входа — тело программы или:\nif __name__ == "__main__":\n    main()',
    note: 'В Scratch событие запускает скрипт; в Python код выполняется сверху вниз.',
  },
  {
    id: 'click',
    category: 'events',
    scratch: 'когда щёлкнут по этому спрайту',
    python: '# GUI: обработчик клика (Tkinter, Pygame)\n# def on_click(event): ...',
    note: 'В консольном Python «клик» заменяют input() или события окна.',
  },
  {
    id: 'key',
    category: 'events',
    scratch: 'когда нажата клавиша [пробел]',
    python: '# в цикле: if keyboard.is_pressed("space"):\n# или pygame.event / tkinter bind',
    note: 'Scratch реагирует на клавиши автоматически; в Python нужен цикл опроса или GUI.',
  },
  {
    id: 'broadcast',
    category: 'events',
    scratch: 'передать сообщение [старт] и ждать',
    python: '# callback, queue или флаг:\nstarted = True  # другой поток/функция ждёт',
    note: 'Сообщения Scratch ≈ сигналы между частями программы.',
  },
  {
    id: 'repeat',
    category: 'control',
    scratch: 'повторить (10)\n  ...\nконец',
    python: 'for _ in range(10):\n    ...',
    note: 'Счётчик цикла в Python — range(n); _ если номер шага не нужен.',
  },
  {
    id: 'forever',
    category: 'control',
    scratch: 'всегда\n  ...\nконец',
    python: 'while True:\n    ...\n    time.sleep(0.02)  # пауза, как «ждать» в Scratch',
    note: 'Без sleep/turtle.update() цикл «съест» процессор.',
  },
  {
    id: 'while',
    category: 'control',
    scratch: 'повторять пока <условие>',
    python: 'while условие:\n    ...',
    note: 'Проверка условия — перед каждым повторением, как в Scratch.',
  },
  {
    id: 'if',
    category: 'control',
    scratch: 'если <условие> то\n  ...\nконец',
    python: 'if условие:\n    ...',
    note: 'Отступ 4 пробела = «карман» блока в Scratch.',
  },
  {
    id: 'ifelse',
    category: 'control',
    scratch: 'если <условие> то\n  ...\nиначе\n  ...\nконец',
    python: 'if условие:\n    ...\nelse:\n    ...',
    note: 'Ветки «то» и «иначе» — отдельные блоки с отступом.',
  },
  {
    id: 'wait',
    category: 'control',
    scratch: 'ждать (0.5) сек',
    python: 'import time\ntime.sleep(0.5)',
    note: 'Секунды — дробное число, как в Scratch.',
  },
  {
    id: 'stop',
    category: 'control',
    scratch: 'остановить [все v]',
    python: 'break  # выход из цикла\n# или sys.exit() — завершить программу',
    note: '«Остановить всё» ≈ break / return / exit в зависимости от контекста.',
  },
  {
    id: 'forward',
    category: 'motion',
    scratch: 'идти (10) шагов',
    python: 'import turtle\nt.forward(10)',
    note: 'В Turtle «шаги» = пиксели вперёд по направлению черепашки.',
  },
  {
    id: 'turn',
    category: 'motion',
    scratch: 'повернуть ↻ на (90) градусов',
    python: 't.left(90)   # или t.right(90)',
    note: 'Положительный угол в Scratch ↻ = left в Turtle.',
  },
  {
    id: 'goto',
    category: 'motion',
    scratch: 'идти в x: (0) y: (0)',
    python: 't.goto(0, 0)  # turtle\n# или x, y = 0, 0 в своей модели',
    note: 'Scratch: y вверх; Turtle — та же система координат.',
  },
  {
    id: 'setxy',
    category: 'motion',
    scratch: 'перейти в x: (0) y: (100)',
    python: 't.setpos(0, 100)',
    note: 'Мгновенный перенос без рисования линии (если перо поднято).',
  },
  {
    id: 'bounce',
    category: 'motion',
    scratch: 'если касается края?, отразиться от края',
    python: 'if abs(x) > 240:\n    dx = -dx\nif abs(y) > 180:\n    dy = -dy',
    note: 'В Python границы задают вручную (Scratch: ±240, ±180).',
  },
  {
    id: 'say',
    category: 'looks',
    scratch: 'сказать [Привет!] (2) сек',
    python: 'print("Привет!")\ntime.sleep(2)  # если нужна пауза',
    note: 'print — аналог «сказать» без пузыря на сцене.',
  },
  {
    id: 'show',
    category: 'looks',
    scratch: 'показать',
    python: 'visible = True  # в своей модели\n# t.showturtle() — для Turtle',
    note: 'В Scratch видимость спрайта; в Python — флаг или метод GUI.',
  },
  {
    id: 'hide',
    category: 'looks',
    scratch: 'спрятать',
    python: 'visible = False\n# t.hideturtle()',
    note: 'После «спрятать» спрайт не рисуется и часто не участвует в касаниях.',
  },
  {
    id: 'costume',
    category: 'looks',
    scratch: 'переключиться на костюм [спит v]',
    python: 'sprite_image = "sleep.png"  # смена картинки в Pygame/Tk',
    note: 'Костюмы Scratch ≈ смена файла/кадра анимации.',
  },
  {
    id: 'touching',
    category: 'sensing',
    scratch: 'касается [Мяч v]?',
    python: 'if distance(player, ball) < radius:\n    ...',
    note: 'Scratch проверяет пиксели; в Python — формула расстояния или hitbox.',
  },
  {
    id: 'keypressed',
    category: 'sensing',
    scratch: 'клавиша [→ v] нажата?',
    python: 'if keyboard.is_pressed("right"):\n    ...',
    note: 'В консоли — input(); в играх — опрос клавиш в цикле.',
  },
  {
    id: 'ask',
    category: 'sensing',
    scratch: 'спросить [Как тебя зовут?] и ждать',
    python: 'name = input("Как тебя зовут? ")',
    note: 'input() останавливает программу до Enter.',
  },
  {
    id: 'random',
    category: 'operators',
    scratch: 'случайное число от (1) до (10)',
    python: 'import random\nrandom.randint(1, 10)',
    note: 'randint включает оба конца диапазона, как Scratch.',
  },
  {
    id: 'compare',
    category: 'operators',
    scratch: '(счёт) > (10)',
    python: 'score > 10',
    note: 'Сравнения: ==, !=, <, >, <=, >=.',
  },
  {
    id: 'andor',
    category: 'operators',
    scratch: '<a> и <b>',
    python: 'a and b\na or b\nnot a',
    note: 'Логика «и/или/не» — те же правила, другие слова.',
  },
  {
    id: 'join',
    category: 'operators',
    scratch: 'объединить [Привет, ] [мир]',
    python: '"Привет, " + "мир"\n# или f"Привет, {name}"',
    note: 'f-строки удобны для подстановки переменных.',
  },
  {
    id: 'setvar',
    category: 'variables',
    scratch: 'установить [счёт v] в (0)',
    python: 'score = 0',
    note: 'Имя переменной — латиница и _, без пробелов.',
  },
  {
    id: 'changevar',
    category: 'variables',
    scratch: 'изменить [счёт v] на (1)',
    python: 'score += 1',
    note: '+=, -=, *= — сокращённая запись «изменить на».',
  },
  {
    id: 'listadd',
    category: 'variables',
    scratch: 'добавить [яблоко] к [список v]',
    python: 'items.append("яблоко")',
    note: 'Список Python ≈ список Scratch.',
  },
  {
    id: 'penDown',
    category: 'pen',
    scratch: 'опустить перо',
    python: 't.pendown()',
    note: 'Модуль «Перо» Scratch ≈ turtle.pendown().',
  },
  {
    id: 'penUp',
    category: 'pen',
    scratch: 'поднять перо',
    python: 't.penup()',
    note: 'Движение без линии на экране.',
  },
  {
    id: 'clear',
    category: 'pen',
    scratch: 'стереть всё',
    python: 't.clear()  # след\n# t.clearscreen() — всё окно',
    note: 'При старте игры часто сбрасывают переменные и фон.',
  },
];

export const EXAMPLE_PROGRAMS = {
  square: {
    id: 'square',
    label: 'Квадрат',
    title: 'Квадрат — цикл «повторить 4»',
    description: 'Один цикл вместо четырёх копий одних и тех же блоков.',
    scratch: `когда щёлкнут по ⚑
опустить перо
повторить (4)
  идти (100) шагов
  повернуть ↻ на (90) градусов
конец
поднять перо`,
    python: `import turtle

t = turtle.Turtle()
t.pendown()

for _ in range(4):
    t.forward(100)
    t.left(90)

t.penup()
turtle.done()`,
    hints: [
      'Блок «повторить (4)» → for _ in range(4):',
      '«идти шагов» → t.forward(...)',
      '«повернуть на 90» → t.left(90)',
    ],
  },
  counter: {
    id: 'counter',
    label: 'Счётчик',
    title: 'Счётчик кликов',
    description: 'Переменная и условие — как «кот мяукает 5 раз» из энциклопедии.',
    scratch: `когда щёлкнут по ⚑
установить [счёт v] в (0)

когда щёлкнут по этому спрайту
изменить [счёт v] на (1)
сказать [Мяу!] (1) сек
если <(счёт) = (5)> то
  сказать [Устал…] (2) сек
  остановить [все v]
конец`,
    python: `score = 0

def on_sprite_click():
    global score
    score += 1
    print("Мяу!")
    if score == 5:
        print("Устал…")
        return True  # остановить цикл
    return False

# Упрощённо в консоли:
while True:
    input("Нажмите Enter (клик по коту)... ")
    if on_sprite_click():
        break`,
    hints: [
      '«установить счёт в 0» → score = 0',
      '«изменить на 1» → score += 1',
      '«если счёт = 5» → if score == 5:',
    ],
  },
  coins: {
    id: 'coins',
    label: 'Монеты',
    title: 'Сбор монет и счёт',
    description: 'Касание спрайта и скрытие — типичная механика из игр Scratch.',
    scratch: `когда щёлкнут по ⚑
установить [счёт v] в (0)

когда я коснусь [Монета v]
изменить [счёт v] на (1)
спрятать`,
    python: `score = 0
coins = [{"x": 50, "y": 30, "visible": True}]

def try_collect(player, coins_list):
    global score
    for coin in coins_list:
        if not coin["visible"]:
            continue
        if abs(player["x"] - coin["x"]) < 20:
            score += 1
            coin["visible"] = False
            print(f"Счёт: {score}")`,
    hints: [
      '«коснусь» → проверка расстояния или пересечения',
      '«спрятать» → visible = False',
      'Счётчик — глобальная переменная score',
    ],
  },
  rainbow: {
    id: 'rainbow',
    label: 'Радуга',
    title: 'Повторить + изменить цвет',
    description: 'Цикл с изменением эффекта — как в мини-проекте «радуга».',
    scratch: `когда щёлкнут по ⚑
опустить перо
повторить (36)
  изменить цвет ▶ на (10)
  идти (20) шагов
  повернуть ↻ на (10) градусов
конец`,
    python: `import turtle

t = turtle.Turtle()
t.speed(0)
t.pendown()
colors = ["red", "orange", "yellow", "green", "blue", "violet"]

for i in range(36):
    t.pencolor(colors[i % len(colors)])
    t.forward(20)
    t.left(10)

turtle.done()`,
    hints: [
      'Список цветов в Python заменяет «изменить цвет на»',
      'i % len(colors) — цикл по палитре',
    ],
  },
  ask: {
    id: 'ask',
    label: 'Вопрос',
    title: 'Спросить и ответить',
    description: 'Блок «спросить» → input() в Python.',
    scratch: `когда щёлкнут по ⚑
спросить [Как тебя зовут?] и ждать
сказать (объединить [Привет, ] (ответ))`,
    python: `name = input("Как тебя зовут? ")
print("Привет,", name)
# или: print(f"Привет, {name}")`,
    hints: [
      '«спросить и ждать» → input("...")',
      '«объединить» → + или f-строка',
      'Ответ хранится в переменной name',
    ],
  },
};

export function getBlocksByCategory(categoryId) {
  if (!categoryId) return BLOCK_MAPPINGS;
  return BLOCK_MAPPINGS.filter((b) => b.category === categoryId);
}

export function getCategoryMeta(categoryId) {
  return SCRATCH_CATEGORIES.find((c) => c.id === categoryId);
}
