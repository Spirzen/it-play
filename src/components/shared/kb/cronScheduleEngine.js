/** Данные и разбор cron-выражений (5 полей) для учебного демо */

export const CRON_FIELD_META = [
  {id: 'min', label: 'Минута', range: '0–59'},
  {id: 'hour', label: 'Час', range: '0–23'},
  {id: 'dom', label: 'День месяца', range: '1–31'},
  {id: 'mon', label: 'Месяц', range: '1–12'},
  {id: 'dow', label: 'День недели', range: '0–7 (0 и 7 = вс)'},
];

export const CRON_PRESETS = [
  {
    id: 'daily-backup',
    label: 'Бэкап ночью',
    parts: ['0', '2', '*', '*', '*'],
    hint: 'Каждый день в 02:00 — классика для cron и Task Scheduler',
    cmd: '/home/user/backup.sh',
  },
  {
    id: 'quarter-hour',
    label: 'Каждые 15 минут',
    parts: ['*/15', '*', '*', '*', '*'],
    hint: 'Мониторинг, синхронизация метрик',
    cmd: '/opt/check-health.sh',
  },
  {
    id: 'weekday-morning',
    label: 'Будни в 09:00',
    parts: ['0', '9', '*', '*', '1-5'],
    hint: 'Отчёты по рабочим дням (пн–пт в cron)',
    cmd: 'python /opt/report.py',
  },
  {
    id: 'monthly',
    label: '1-е число месяца',
    parts: ['0', '0', '1', '*', '*'],
    hint: 'Архивация логов, закрытие периода',
    cmd: 'gzip /var/log/app/*.log',
  },
  {
    id: 'sunday',
    label: 'Воскресенье 03:00',
    parts: ['0', '3', '*', '*', '0'],
    hint: 'Тяжёлые задачи в "тихое" окно',
    cmd: 'vacuumdb --all',
  },
];

export const FIELD_CHOICES = {
  min: [
    {v: '*', d: 'каждую минуту'},
    {v: '0', d: 'в :00'},
    {v: '*/5', d: 'каждые 5 мин'},
    {v: '*/15', d: 'каждые 15 мин'},
    {v: '30', d: 'в :30'},
  ],
  hour: [
    {v: '*', d: 'каждый час'},
    {v: '0', d: 'полночь'},
    {v: '2', d: '02:00'},
    {v: '9', d: '09:00'},
    {v: '*/6', d: 'каждые 6 ч'},
  ],
  dom: [
    {v: '*', d: 'каждый день'},
    {v: '1', d: '1-е число'},
    {v: '15', d: '15-е число'},
  ],
  mon: [
    {v: '*', d: 'каждый месяц'},
    {v: '1', d: 'январь'},
    {v: '*/3', d: 'раз в квартал'},
  ],
  dow: [
    {v: '*', d: 'любой день'},
    {v: '1-5', d: 'пн–пт'},
    {v: '0', d: 'воскресенье'},
    {v: '6', d: 'суббота'},
  ],
};

export const SCHEDULER_PLATFORMS = [
  {
    id: 'cron',
    name: 'cron',
    os: 'Linux / macOS',
    config: 'crontab -e',
    note: 'Строка из 5 полей + команда',
  },
  {
    id: 'systemd',
    name: 'systemd timer',
    os: 'Linux (systemd)',
    config: '.timer + .service',
    note: 'OnCalendar= ежедневно, Persistent=true',
  },
  {
    id: 'windows',
    name: 'Task Scheduler',
    os: 'Windows',
    config: 'schtasks /create …',
    note: 'GUI или PowerShell Register-ScheduledTask',
  },
  {
    id: 'launchd',
    name: 'launchd',
    os: 'macOS',
    config: 'LaunchAgents/*.plist',
    note: 'StartCalendarInterval в plist',
  },
];

export function partsToExpr(parts) {
  return parts.join(' ');
}

export function describeCronPart(fieldId, value) {
  if (value === '*') {
    const any = {
      min: 'каждую минуту',
      hour: 'каждый час',
      dom: 'каждый день месяца',
      mon: 'каждый месяц',
      dow: 'любой день недели',
    };
    return any[fieldId];
  }
  if (value.startsWith('*/')) {
    const n = value.slice(2);
    const step = {
      min: `каждые ${n} мин`,
      hour: `каждые ${n} ч`,
      dom: `каждые ${n} дн`,
      mon: `каждые ${n} мес`,
      dow: `каждые ${n} дн недели`,
    };
    return step[fieldId];
  }
  if (value.includes('-')) {
    if (fieldId === 'dow') return `дни недели ${value} (0=вс)`;
    return `диапазон ${value}`;
  }
  const labels = {
    min: `в минуту :${value.padStart(2, '0')}`,
    hour: `в ${value}:00`,
    dom: `${value}-е число`,
    mon: `месяц ${value}`,
    dow: `день недели ${value}`,
  };
  return labels[fieldId] ?? value;
}

export function describeCron(parts) {
  const [min, hour, dom, mon, dow] = parts;
  const pieces = [
    describeCronPart('min', min),
    describeCronPart('hour', hour),
    describeCronPart('dom', dom),
    describeCronPart('mon', mon),
    describeCronPart('dow', dow),
  ];
  let summary = `Запуск: ${pieces.join('; ')}.`;
  if (min === '0' && hour !== '*' && dom === '*' && mon === '*' && dow === '*') {
    summary = `Ежедневно в ${hour.padStart(2, '0')}:00.`;
  }
  if (dow === '1-5' && dom === '*' && mon === '*') {
    summary += ' Только будние дни.';
  }
  return summary;
}

export function buildCrontabLine(parts, cmd = '/path/to/script.sh') {
  return `${partsToExpr(parts)} ${cmd}`;
}

export function systemdOnCalendar(parts) {
  const [, hour, dom] = parts;
  if (dom !== '*' && dom !== '1') return `OnCalendar=*-*-${dom} ${hour}:00:00`;
  if (hour === '*') return 'OnCalendar=hourly';
  return `OnCalendar=*-*-* ${hour}:00:00`;
}
