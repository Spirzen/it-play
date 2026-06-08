/** Сценарии беспроводных технологий. */

export const TECH = {
  wifi: {id: 'wifi', label: 'Wi-Fi 6', band: '5 ГГц', range: '~30 м', speed: 'до 9,6 Гбит/с', icon: '📶'},
  bluetooth: {id: 'bluetooth', label: 'Bluetooth LE', band: '2,4 ГГц', range: '~10 м', speed: 'до 2 Мбит/с', icon: '🔵'},
  lte: {id: 'lte', label: 'LTE / 5G NR', band: 'Sub-6 / mmWave', range: 'км (соты)', speed: 'до 1+ Гбит/с', icon: '📱'},
  nfc: {id: 'nfc', label: 'NFC', band: '13,56 МГц', range: '<10 см', speed: '424 кбит/с', icon: '📲'},
};

export const SCENARIOS = [
  {
    id: 'wifi-join',
    tech: 'wifi',
    short: 'Wi-Fi',
    title: 'Подключение к точке доступа',
    subtitle: 'Сканирование → аутентификация WPA3 → IP по DHCP',
    steps: [
      {spotlight: ['device'], label: 'Скан эфира', detail: 'Beacon-кадры от AP: SSID, канал, RSN', signal: -62},
      {spotlight: ['device', 'ap'], label: '4-way handshake', detail: 'SAE (WPA3) — согласование ключей', signal: -58},
      {spotlight: ['device', 'ap', 'router'], label: 'Ассоциация + DHCP', detail: 'IP 192.168.1.42, шлюз 192.168.1.1', signal: -55},
      {spotlight: ['device'], label: 'Передача данных', detail: 'OFDMA, 80 МГц канал', signal: -52},
    ],
  },
  {
    id: 'bt-pair',
    tech: 'bluetooth',
    short: 'Bluetooth',
    title: 'Сопряжение LE-устройства',
    subtitle: 'Advertising → pairing → GATT-сервисы',
    steps: [
      {spotlight: ['device'], label: 'Режим advertising', detail: 'Наушники транслируют UUID сервиса', signal: null},
      {spotlight: ['device', 'peer'], label: 'Сопряжение', detail: 'Just Works / PIN для LE Secure', signal: null},
      {spotlight: ['device', 'peer'], label: 'GATT: Battery Service', detail: 'Характеристика уровня заряда 87%', signal: null},
    ],
  },
  {
    id: 'lte-handover',
    tech: 'lte',
    short: 'LTE',
    title: 'Handover между сотами',
    subtitle: 'Переход на соседнюю базовую станцию без разрыва звонка',
    steps: [
      {spotlight: ['phone', 'tower1'], label: 'Сота A (RSRP -85 dBm)', detail: 'Активный bearer 4G', signal: -85},
      {spotlight: ['phone'], label: 'Измерение соседей', detail: 'Сота B сильнее (-72 dBm)', signal: -72},
      {spotlight: ['phone', 'tower2'], label: 'Handover X2', detail: 'Координация eNodeB, <50 мс', signal: -70},
      {spotlight: ['phone', 'tower2'], label: 'Сессия на соте B', detail: 'VoLTE продолжается', signal: -68},
    ],
  },
  {
    id: 'nfc-tap',
    tech: 'nfc',
    short: 'NFC',
    title: 'Касание NFC-метки',
    subtitle: 'Индукция на 13,56 МГц — инициализация другого канала',
    steps: [
      {spotlight: ['phone', 'tag'], label: 'Поле NFC', detail: 'Расстояние <4 см', signal: null},
      {spotlight: ['phone'], label: 'NDEF: URL записи', detail: 'https://example.com/promo', signal: null},
      {spotlight: ['phone'], label: 'Опционально Wi-Fi Direct', detail: 'Быстрое сопряжение для передачи файла', signal: null},
    ],
  },
];
