/** Этапы установки ОС */

export const INSTALL_STEPS = [
  {
    id: 'iso',
    label: 'Образ ISO',
    icon: '💿',
    detail: 'Скачивание официального образа с сайта вендора.',
    checklist: ['Проверка SHA-256', 'Версия LTS/Stable'],
  },
  {
    id: 'usb',
    label: 'Загрузочная флешка',
    icon: '🔌',
    detail: 'Запись ISO через Rufus, Ventoy или balenaEtcher.',
    checklist: ['GPT + UEFI', 'FAT32 / exFAT'],
  },
  {
    id: 'boot',
    label: 'BOOT Menu',
    icon: '⌨',
    detail: 'F12 / Esc — разовый выбор USB без смены приоритета в BIOS.',
    checklist: ['Secure Boot off (при необходимости)', 'Legacy vs UEFI'],
  },
  {
    id: 'install',
    label: 'Установщик',
    icon: '⚙',
    detail: 'Язык, диск, разметка GPT/MBR, копирование системных файлов.',
    checklist: ['10–30 минут', 'Не отключать питание'],
  },
  {
    id: 'user',
    label: 'Учётная запись',
    icon: '👤',
    detail: 'Имя пользователя, пароль, регион, лицензия.',
    checklist: ['Сложный пароль', 'Локальная vs Microsoft account'],
  },
  {
    id: 'post',
    label: 'После установки',
    icon: '🔄',
    detail: 'Обновления ОС, драйверы чипсета/GPU, резервная копия.',
    checklist: ['Windows Update / apt upgrade', 'Драйвер с сайта OEM'],
  },
];

export function installProgress(completed) {
  return {
    done: completed.length,
    total: INSTALL_STEPS.length,
    pct: Math.round((completed.length / INSTALL_STEPS.length) * 100),
  };
}
