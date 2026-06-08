/** Диагностика первого запуска ПК. */

export const SYMPTOMS = [
  {
    id: 'dead',
    label: 'Ничего не крутится',
    icon: '⬛',
    leds: [],
    fans: false,
    display: false,
    likely: ['psu', 'power_sw', 'short'],
  },
  {
    id: 'spin-no-video',
    label: 'Крутится, нет картинки',
    icon: '🌀',
    leds: ['cpu'],
    fans: true,
    display: false,
    likely: ['ram', 'gpu', 'cpu_pwr', 'monitor'],
  },
  {
    id: 'dram-led',
    label: 'Горит DRAM',
    icon: '💡',
    leds: ['dram'],
    fans: true,
    display: false,
    likely: ['ram'],
  },
  {
    id: 'vga-led',
    label: 'Горит VGA',
    icon: '💡',
    leds: ['vga'],
    fans: true,
    display: false,
    likely: ['gpu'],
  },
  {
    id: 'post-ok',
    label: 'Есть BIOS',
    icon: '✅',
    leds: [],
    fans: true,
    display: true,
    likely: [],
  },
];

export const CHECKS = {
  psu: {
    title: 'Блок питания',
    steps: ['Переключатель PSU = I (вкл)', 'Кабель в розетке', 'Тест скрепкой PS_ON# + GND'],
  },
  power_sw: {
    title: 'Кнопка Power',
    steps: ['Провод Power SW на F_PANEL', 'Замкнуть PWR_BTN отвёрткой'],
  },
  short: {
    title: 'Короткое замыкание',
    steps: ['Сборка "на столе" без корпуса', 'Лишние винты под платой', 'Стойки совпадают с отверстиями'],
  },
  ram: {
    title: 'Оперативная память',
    steps: ['Одна планка в слот A2', 'Щелчок обоих фиксаторов', 'Попробовать другую планку'],
  },
  gpu: {
    title: 'Видеокарта',
    steps: ['Монитор в GPU, не в материнке', 'PCIe power подключён', 'Переустановить в слот x16'],
  },
  cpu_pwr: {
    title: 'Питание CPU',
    steps: ['8-pin EPS рядом с сокетом', 'До щелчка разъёма'],
  },
  monitor: {
    title: 'Монитор',
    steps: ['Правильный вход HDMI/DP', 'Другой кабель и порт'],
  },
};

export function checksForSymptom(symptomId) {
  const s = SYMPTOMS.find((x) => x.id === symptomId);
  if (!s) return [];
  return s.likely.map((id) => CHECKS[id]).filter(Boolean);
}
