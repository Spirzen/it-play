/** Данные и логика для демо Tinkercad Circuits / Arduino */

export const BRAND = '#f5a623';

export const WORKSPACE_ZONES = [
  {
    id: 'palette',
    label: 'Панель компонентов',
    place: 'Справа',
    desc: 'Каталог деталей: перетащите на рабочую область.',
    items: ['Резисторы', 'LED', 'Кнопки', 'Arduino Uno', 'micro:bit'],
  },
  {
    id: 'canvas',
    label: 'Рабочая область',
    place: 'Центр',
    desc: 'Сборка схемы на макетной плате, соединение проводов.',
    items: ['Breadboard', 'Провода', 'Привязка к сетке'],
  },
  {
    id: 'toolbar',
    label: 'Панель инструментов',
    place: 'Сверху',
    desc: 'Старт/стоп симуляции, редактор кода, скорость.',
    items: ['▶ Start', '⏹ Stop', 'Сброс', '0.1x–10x'],
  },
  {
    id: 'props',
    label: 'Свойства',
    place: 'Справа (при выборе)',
    desc: 'Сопротивление, цвет LED, номинал конденсатора.',
    items: ['220 Ω', 'Цвет маркировки', 'Подтяжка кнопки'],
  },
  {
    id: 'serial',
    label: 'Монитор порта',
    place: 'Внизу',
    desc: 'Serial.print / println и приём команд с ПК.',
    items: ['9600 бод', 'Текстовый вывод', 'Отладка датчиков'],
  },
];

export const ARDUINO_PINS = [
  {id: 'D0', side: 'top', label: '0', type: 'digital', pwm: false, note: 'RX (Serial)'},
  {id: 'D1', side: 'top', label: '1', type: 'digital', pwm: false, note: 'TX (Serial)'},
  {id: 'D2', side: 'top', label: '2', type: 'digital', pwm: false, note: 'Цифровой ввод/вывод'},
  {id: 'D3', side: 'top', label: '3', type: 'digital', pwm: true, note: 'ШИМ (~)'},
  {id: 'D4', side: 'top', label: '4', type: 'digital', pwm: false, note: 'Цифровой ввод/вывод'},
  {id: 'D5', side: 'top', label: '5', type: 'digital', pwm: true, note: 'ШИМ (~)'},
  {id: 'D6', side: 'top', label: '6', type: 'digital', pwm: true, note: 'ШИМ (~)'},
  {id: 'D7', side: 'top', label: '7', type: 'digital', pwm: false, note: 'Цифровой ввод/вывод'},
  {id: 'D8', side: 'top', label: '8', type: 'digital', pwm: false, note: 'Цифровой ввод/вывод'},
  {id: 'D9', side: 'top', label: '9', type: 'digital', pwm: true, note: 'ШИМ (~)'},
  {id: 'D10', side: 'top', label: '10', type: 'digital', pwm: true, note: 'ШИМ (~)'},
  {id: 'D11', side: 'top', label: '11', type: 'digital', pwm: true, note: 'ШИМ (~)'},
  {id: 'D12', side: 'top', label: '12', type: 'digital', pwm: false, note: 'Цифровой ввод/вывод'},
  {id: 'D13', side: 'top', label: '13', type: 'digital', pwm: false, note: 'Встроенный LED (L)'},
  {id: 'GND1', side: 'top', label: 'GND', type: 'power', pwm: false, note: 'Земля'},
  {id: 'AREF', side: 'top', label: 'AREF', type: 'power', pwm: false, note: 'Опорное для АЦП'},
  {id: 'SDA', side: 'top', label: 'SDA', type: 'bus', pwm: false, note: 'I²C данные'},
  {id: 'SCL', side: 'top', label: 'SCL', type: 'bus', pwm: false, note: 'I²C такт'},
  {id: 'A5', side: 'bottom', label: 'A5', type: 'analog', pwm: false, note: 'Аналог 0–1023'},
  {id: 'A4', side: 'bottom', label: 'A4', type: 'analog', pwm: false, note: 'Аналог 0–1023'},
  {id: 'A3', side: 'bottom', label: 'A3', type: 'analog', pwm: false, note: 'Аналог 0–1023'},
  {id: 'A2', side: 'bottom', label: 'A2', type: 'analog', pwm: false, note: 'Аналог 0–1023'},
  {id: 'A1', side: 'bottom', label: 'A1', type: 'analog', pwm: false, note: 'Аналог 0–1023'},
  {id: 'A0', side: 'bottom', label: 'A0', type: 'analog', pwm: false, note: 'Датчик / потенциометр'},
  {id: 'VIN', side: 'bottom', label: 'VIN', type: 'power', pwm: false, note: 'Внешнее питание'},
  {id: 'GND2', side: 'bottom', label: 'GND', type: 'power', pwm: false, note: 'Земля'},
  {id: '5V', side: 'bottom', label: '5V', type: 'power', pwm: false, note: '+5 В'},
  {id: '3V3', side: 'bottom', label: '3.3V', type: 'power', pwm: false, note: '+3.3 В'},
  {id: 'RESET', side: 'bottom', label: 'RESET', type: 'power', pwm: false, note: 'Сброс МК'},
  {id: 'IOREF', side: 'bottom', label: 'IOREF', type: 'power', pwm: false, note: 'Опорное I/O'},
];

export const MICROBIT_PINS = [
  {id: 'P0', label: '0', role: 'Аналог / touch'},
  {id: 'P1', label: '1', role: 'Аналог'},
  {id: 'P2', label: '2', role: 'Аналог'},
  {id: 'P3', label: '3', role: 'Аналог (кнопка A)'},
  {id: 'P4', label: '4', role: 'Аналог'},
  {id: 'P5', label: '5', role: 'Кнопка A (встроенная)'},
  {id: 'P6', label: '6', role: 'Аналог'},
  {id: 'P7', label: '7', role: 'Аналог'},
  {id: 'P8', label: '8', role: 'Аналог'},
  {id: 'P9', label: '9', role: 'Аналог'},
  {id: 'P10', label: '10', role: 'Аналог'},
  {id: 'P11', label: '11', role: 'Аналог'},
  {id: 'P12', label: '12', role: 'Аналог'},
  {id: 'P13', label: '13', role: 'SPI SCK'},
  {id: 'P14', label: '14', role: 'SPI MISO'},
  {id: 'P15', label: '15', role: 'SPI MOSI'},
  {id: 'P16', label: '16', role: 'SPI CS'},
  {id: 'P19', label: '19', role: 'I²C SCL'},
  {id: 'P20', label: '20', role: 'I²C SDA'},
];

export const COMPONENT_CATALOG = [
  {id: 'resistor', icon: '⬛', name: 'Резистор', cat: 'Базовые', param: '220 Ω — цветовая маркировка'},
  {id: 'led', icon: '💡', name: 'Светодиод', cat: 'Базовые', param: 'Анод / катод, цвет свечения'},
  {id: 'cap', icon: '🔋', name: 'Конденсатор', cat: 'Базовые', param: 'Ёмкость в мкФ'},
  {id: 'battery', icon: '🔋', name: 'Батарейка', cat: 'Питание', param: '9V / блок питания'},
  {id: 'button', icon: '🔘', name: 'Кнопка', cat: 'Ввод', param: 'Тактовая, подтяжка 10 кОм'},
  {id: 'pot', icon: '🎚️', name: 'Потенциометр', cat: 'Ввод', param: '0–1023 на A0'},
  {id: 'lcd', icon: '📟', name: 'LCD', cat: 'Дисплеи', param: '16×2 символов'},
  {id: 'servo', icon: '⚙️', name: 'Сервопривод', cat: 'Актуаторы', param: 'Угол 0–180°'},
  {id: 'ultra', icon: '📡', name: 'HC-SR04', cat: 'Датчики', param: 'Ультразвук, см'},
  {id: 'photo', icon: '☀️', name: 'Фоторезистор', cat: 'Датчики', param: 'Освещённость → analogRead'},
];

export const CODE_MODES = [
  {
    id: 'blocks',
    label: 'Блоки (Blockly)',
    desc: 'Перетаскивание блоков "Управление", "Математика" — генерация C++.',
    blocks: ['setup', 'pinMode 13 OUTPUT', 'loop', 'digitalWrite HIGH', 'delay 1000'],
    code: `void setup() {\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(1000);\n}`,
  },
  {
    id: 'hybrid',
    label: 'Блоки + код',
    desc: 'Блок и текст синхронизируются — удобно учить синтаксис.',
    blocks: ['if digitalRead(2)', 'digitalWrite 13 HIGH', 'else LOW'],
    code: `if (digitalRead(2) == HIGH) {\n  digitalWrite(13, HIGH);\n} else {\n  digitalWrite(13, LOW);\n}`,
  },
  {
    id: 'text',
    label: 'Текст (C++)',
    desc: 'Подсветка синтаксиса, автодополнение, Serial.',
    blocks: null,
    code: `Serial.begin(9600);\nint v = analogRead(A0);\nSerial.println(v);`,
  },
];

export const PROJECTS = {
  blink: {
    id: 'blink',
    label: 'Мигающий LED',
    pin: 13,
    code: [
      {fn: 'setup', line: 'pinMode(13, OUTPUT);'},
      {fn: 'loop', line: 'digitalWrite(13, HIGH);'},
      {fn: 'loop', line: 'delay(1000);'},
      {fn: 'loop', line: 'digitalWrite(13, LOW);'},
      {fn: 'loop', line: 'delay(1000);'},
    ],
    parts: ['Arduino Uno', 'LED', '220 Ω', 'Провода'],
  },
  button: {
    id: 'button',
    label: 'Кнопка → LED',
    pin: 13,
    inputPin: 2,
    code: [
      {fn: 'setup', line: 'pinMode(13, OUTPUT);'},
      {fn: 'setup', line: 'pinMode(2, INPUT);'},
      {fn: 'loop', line: 'if (digitalRead(2) == HIGH)'},
      {fn: 'loop', line: '  digitalWrite(13, HIGH);'},
      {fn: 'loop', line: 'else digitalWrite(13, LOW);'},
    ],
    parts: ['Кнопка', '10 кОм подтяжка', 'LED', '220 Ω'],
  },
  pwm: {
    id: 'pwm',
    label: 'Плавная яркость',
    pin: 9,
    pwm: true,
    code: [
      {fn: 'setup', line: 'pinMode(9, OUTPUT);'},
      {fn: 'loop', line: 'for (b=0; b<=255; b+=5)'},
      {fn: 'loop', line: '  analogWrite(9, b);'},
      {fn: 'loop', line: '  delay(20);'},
    ],
    parts: ['LED на пин 9 (~PWM)', '220 Ω'],
  },
  sensor: {
    id: 'sensor',
    label: 'Аналоговый датчик',
    pin: 9,
    analogPin: 'A0',
    code: [
      {fn: 'setup', line: 'Serial.begin(9600);'},
      {fn: 'loop', line: 'int s = analogRead(A0);'},
      {fn: 'loop', line: 'analogWrite(9, map(s,0,1023,0,255));'},
      {fn: 'loop', line: 'Serial.println(s);'},
    ],
    parts: ['Потенциометр / фоторезистор', 'LED PWM', 'Монитор порта'],
  },
};

/** Шаг симуляции мигающего LED */
export function blinkStep(tick) {
  const phase = Math.floor(tick / 2) % 2;
  return {ledOn: phase === 0, pin13: phase === 0 ? 'HIGH' : 'LOW', line: phase === 0 ? 1 : 3};
}

export function pwmBrightness(t) {
  const cycle = 5200;
  const p = (t % cycle) / cycle;
  const up = p < 0.5;
  const local = up ? p * 2 : (1 - p) * 2;
  return Math.round(local * 255);
}

export function mapAnalog(value) {
  return Math.round((value / 1023) * 255);
}

export const PRODUCT_TABS = [
  {id: 'circuits', label: 'Tinkercad Circuits', icon: '⚡'},
  {id: 'arduino', label: 'Arduino Uno', icon: '🟢'},
  {id: 'microbit', label: 'micro:bit', icon: '🔷'},
  {id: 'components', label: 'Компоненты', icon: '🧩'},
  {id: 'code', label: 'Программирование', icon: '📝'},
  {id: 'projects', label: 'Проекты', icon: '🔬'},
];

export function getSectionProduct(section) {
  const map = {
    workspace: 'circuits',
    circuits: 'circuits',
    arduino: 'arduino',
    microbit: 'microbit',
    breadboard: 'circuits',
    components: 'components',
    code: 'code',
    simulate: 'projects',
    projects: 'projects',
    blink: 'projects',
    button: 'projects',
    pwm: 'projects',
    sensor: 'projects',
  };
  return map[section] ?? null;
}

export function getSectionProject(section) {
  if (PROJECTS[section]) return section;
  return null;
}
