import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from './programPlays.module.css';

export const PROGRAM_TYPE_ITEMS = [
  {
    id: 'utility',
    path: 'C:\\Tools\\ping.exe',
    icon: '⚙️',
    kind: 'Утилита',
    role: 'Узкая задача, часто из командной строки',
    detail:
      'Небольшая программа для одной операции: диагностика сети, архивация, проверка диска. Может работать без GUI.',
    examples: ['ping.exe', '7z.exe', 'curl.exe', 'tracert.exe'],
    tags: ['.exe', 'PE', 'CLI'],
  },
  {
    id: 'module',
    path: 'C:\\App\\bin\\auth.dll',
    icon: '🧩',
    kind: 'Модуль / библиотека',
    role: 'Часть большой системы, подключается при запуске',
    detail:
      'Скомпилированный фрагмент кода с API: его вызывает основная программа. Заменяют модуль — обновляют функцию без пересборки всего приложения.',
    examples: ['Newtonsoft.Json.dll', 'libssl.so', 'nvidia.ko'],
    tags: ['.dll', '.so', 'API'],
  },
  {
    id: 'plugin',
    path: 'C:\\Browser\\Extensions\\darkreader.crx',
    icon: '🔌',
    kind: 'Плагин / расширение',
    role: 'Дополнение к хост-программе по её API',
    detail:
      'Сторонний код, встраиваемый в редактор, браузер или DAW. Хост должен предусмотреть точки подключения (хуки, manifest).',
    examples: ['VST-плагин', 'расширение Chrome', 'плагин VS Code'],
    tags: ['.crx', '.vst3', 'manifest.json'],
  },
  {
    id: 'script-py',
    path: 'C:\\Scripts\\check_servers.py',
    icon: '🐍',
    kind: 'Скрипт (Python)',
    role: 'Текст → интерпретатор python.exe',
    detail:
      'Сам .py не PE-файл: запускает python.exe (или ассоциация в реестре). Быстро пишется, удобен для автоматизации.',
    examples: ['backup.py', 'миграция данных', 'cron-задачи'],
    tags: ['.py', 'интерпретация'],
  },
  {
    id: 'script-js',
    path: 'C:\\Scripts\\deploy.ps1',
    icon: '📜',
    kind: 'Скрипт (PowerShell)',
    role: 'Текст → powershell.exe',
    detail:
      'В Windows расширение .ps1 связано с PowerShell через реестр. Подходит для администрирования и развёртывания.',
    examples: ['deploy.ps1', 'backup.sh + bash', 'setup.bat + cmd'],
    tags: ['.ps1', '.bat', '.sh'],
  },
  {
    id: 'service',
    path: 'C:\\Windows\\System32\\spoolsv.exe',
    icon: '🔄',
    kind: 'Служба (фон)',
    role: 'Процесс без окна, автозапуск с системой',
    detail:
      'Работает в фоне: печать, обновления, веб-сервер. Управление — services.msc, sc, systemctl. Пользователь не взаимодействует напрямую.',
    examples: ['Spooler', 'nginx', 'postgresql', 'dockerd'],
    tags: ['служба', 'демон', 'фон'],
    isService: true,
  },
];

export function WindowsProgramTypesPlayInner({embedded = false}) {
  const [itemId, setItemId] = useState('utility');
  const item = PROGRAM_TYPE_ITEMS.find((i) => i.id === itemId) ?? PROGRAM_TYPE_ITEMS[0];

  const chrome = (
    <DesktopAppChrome
      title="Проводник — виды программ на диске"
      accent="#0078d4"
      status={
        <>
          Папка: <span className={styles.mono}>C:\Tools\</span> · выберите файл, чтобы увидеть тип
        </>
      }
    >
      <div className={styles.explorer}>
        <ul className={styles.tree} role="listbox" aria-label="Файлы">
          {PROGRAM_TYPE_ITEMS.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                role="option"
                aria-selected={itemId === f.id}
                className={clsx(styles.treeItem, itemId === f.id && styles.treeItemActive)}
                onClick={() => setItemId(f.id)}
              >
                <span aria-hidden>{f.icon}</span>
                <span className={styles.mono}>{f.path.split('\\').pop()}</span>
                {f.isService && <span className={styles.serviceBadge}>Running</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.detail}>
          <p className={styles.detailTitle}>{item.kind}</p>
          <p className={styles.detailRole}>{item.role}</p>
          <p>{item.detail}</p>
          <p className={styles.mono} style={{marginTop: '0.35rem'}}>
            {item.path}
          </p>
          <div className={styles.tagRow}>
            {item.tags.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>
          <p className={styles.hint} style={{marginBottom: 0}}>
            Примеры: {item.examples.join(' · ')}
          </p>
        </div>
      </div>
    </DesktopAppChrome>
  );

  if (embedded) return chrome;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Виды программ в файловой системе Windows"
        subtitle="Утилита, модуль, плагин, скрипт и служба — разные роли, разные расширения и способ запуска."
      >
        {chrome}
        <p className={styles.hint}>
          Исполняемый .exe запускается загрузчиком ОС напрямую; скрипты идут через интерпретатор; служба — отдельный
          долгоживущий процесс в фоне.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default WindowsProgramTypesPlayInner;
