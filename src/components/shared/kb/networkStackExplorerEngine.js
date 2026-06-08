/** Шаги пути пакета, DNS-резолвинг и уровни OSI для учебных демо. */

export const VARIANTS = {
  basics: {id: 'basics', label: 'Сеть', defaultTab: 'path'},
  global: {id: 'global', label: 'Интернет', defaultTab: 'path'},
  dns: {id: 'dns', label: 'DNS', defaultTab: 'dns'},
  http: {id: 'http', label: 'HTTP', defaultTab: 'http'},
};

export const TABS = [
  {id: 'path', label: 'Путь пакета'},
  {id: 'layers', label: 'Уровни OSI'},
  {id: 'dns', label: 'DNS'},
  {id: 'http', label: 'HTTP-запрос'},
];

export const OSI_LAYERS = [
  {n: 7, name: 'Прикладной', proto: 'HTTP, DNS, SMTP', role: 'Сервисы для приложений и пользователя'},
  {n: 6, name: 'Представления', proto: 'TLS, JSON, кодировки', role: 'Формат, шифрование, сжатие'},
  {n: 5, name: 'Сеансовый', proto: 'RPC, сессии', role: 'Установление и поддержание сеанса'},
  {n: 4, name: 'Транспортный', proto: 'TCP, UDP', role: 'Надёжная доставка между хостами'},
  {n: 3, name: 'Сетевой', proto: 'IP, ICMP', role: 'Маршрутизация между сетями'},
  {n: 2, name: 'Канальный', proto: 'Ethernet, Wi‑Fi', role: 'Кадры внутри сегмента LAN'},
  {n: 1, name: 'Физический', proto: 'Сигнал, кабель', role: 'Передача битов по среде'},
];

export const PATH_BASICS = [
  {id: 'pc', label: 'Ваш ПК', detail: '192.168.1.5 — формирует IP-пакет'},
  {id: 'switch', label: 'Коммутатор', detail: 'MAC-адреса внутри LAN'},
  {id: 'router', label: 'Роутер / NAT', detail: 'Подмена адреса, таблица NAT'},
  {id: 'isp', label: 'Провайдер', detail: 'Магистраль до узла назначения'},
  {id: 'server', label: 'Сервер', detail: '93.184.216.34 — обработка на L7'},
];

export const PATH_GLOBAL = [
  {id: 'user', label: 'Пользователь', detail: 'Устройство в LAN или мобильной сети'},
  {id: 'isp3', label: 'ISP Tier 3', detail: 'Локальный доступ в интернет'},
  {id: 'isp2', label: 'ISP Tier 2', detail: 'Национальная магистраль'},
  {id: 'ixp', label: 'IXP / Tier 1', detail: 'Обмен трафиком между операторами'},
  {id: 'dc', label: 'ЦОД / CDN', detail: 'Серверы и кэш контента'},
  {id: 'target', label: 'Сервис', detail: 'Ответ по обратному маршруту'},
];

export const DNS_STEPS = [
  {id: 'browser', label: 'Браузер', detail: 'Запрос: google.com → A-запись'},
  {id: 'cache', label: 'Кэш ОС / роутера', detail: 'Попадание — ответ без сети'},
  {id: 'resolver', label: 'Рекурсивный резолвер', detail: '8.8.8.8 обходит цепочку'},
  {id: 'root', label: 'Корневые DNS', detail: 'Делегирование зоны .com'},
  {id: 'tld', label: 'Серверы .com', detail: 'NS для google.com'},
  {id: 'auth', label: 'Авторитативный DNS', detail: 'A: 142.250.185.46'},
];

export const HTTP_STEPS = [
  {id: 'app', label: 'Браузер (L7)', detail: 'GET /api/users HTTP/1.1'},
  {id: 'tls', label: 'TLS (L6)', detail: 'Шифрование тела и заголовков'},
  {id: 'tcp', label: 'TCP (L4)', detail: 'Соединение :443, сегменты'},
  {id: 'ip', label: 'IP (L3)', detail: 'src → dst, маршрутизация'},
  {id: 'eth', label: 'Ethernet (L2)', detail: 'Кадр до шлюза по MAC'},
  {id: 'wan', label: 'Интернет', detail: 'Маршрутизаторы, NAT, IXP'},
  {id: 'srv', label: 'Сервер', detail: 'Обратный путь + HTTP-ответ'},
];

export function getPathSteps(variant) {
  return variant === 'global' ? PATH_GLOBAL : PATH_BASICS;
}

export function getVariantMeta(variant) {
  return VARIANTS[variant] ?? VARIANTS.basics;
}
