import React, {useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import styles from './osPlays.module.css';

const LAYERS = [
  {
    id: 'user',
    name: 'Пользователь',
    role: 'GUI и CLI',
    accent: '#7b1fa2',
    detail:
      'Вводит команды в терминале или щёлкает в графическом интерфейсе. ОС переводит действия в системные вызовы.',
    examples: ['Проводник / Finder', 'PowerShell, bash, zsh', 'Панель настроек'],
  },
  {
    id: 'apps',
    name: 'Приложения',
    role: 'Пользовательский режим',
    accent: '#1565c0',
    detail:
      'Браузер, редактор, игра — каждая программа в своём адресном пространстве. Не имеет прямого доступа к железу.',
    examples: ['Chrome.exe', 'ELF-бинарник', '.app bundle'],
  },
  {
    id: 'services',
    name: 'Системные службы',
    role: 'Фоновые процессы',
    accent: '#00838f',
    detail:
      'Обновления, DNS, печать, планировщик — работают без окна, но через API ядра и драйверов.',
    examples: ['systemd units', 'Windows Services', 'launchd'],
  },
  {
    id: 'kernel',
    name: 'Ядро',
    role: 'Привилегированный режим',
    accent: '#c62828',
    detail:
      'Планировщик, виртуальная память, VFS, сетевой стек. Сбой ядра — kernel panic или синий экран.',
    examples: ['Windows NT', 'Linux kernel', 'XNU (macOS)'],
    managers: ['Менеджер процессов', 'Планировщик', 'Менеджер памяти', 'Диспетчер устройств'],
  },
  {
    id: 'drivers',
    name: 'Драйверы',
    role: 'Абстракция железа',
    accent: '#ef6c00',
    detail:
      'Модули для GPU, диска, Wi‑Fi. Приложение пишет в файл — ядро вызывает драйвер конкретного контроллера.',
    examples: ['nvidia.ko', 'NTFS.sys', 'I/O Kit'],
  },
  {
    id: 'hardware',
    name: 'Оборудование',
    role: 'CPU, RAM, диск, сеть',
    accent: '#455a64',
    detail:
      'Без ОС — набор чипов. BIOS/UEFI передаёт управление загрузчику, затем ядру.',
    examples: ['x64, ARM64', 'NVMe, SSD', 'NIC'],
  },
];

const FS_TYPES = [
  {id: 'ntfs', label: 'NTFS', os: 'Windows', note: 'Права ACL, шифрование, файлы > 4 ГБ'},
  {id: 'ext4', label: 'ext4', os: 'Linux', note: 'Журнал, устойчивость к сбоям'},
  {id: 'apfs', label: 'APFS', os: 'macOS', note: 'Снапшоты, оптимизация под SSD'},
  {id: 'fat', label: 'FAT32 / exFAT', os: 'Универсально', note: 'Флешки; FAT32 — лимит 4 ГБ на файл'},
];

function OsStackPlayInner() {
  const [layerId, setLayerId] = useState('kernel');
  const [fsId, setFsId] = useState('ntfs');

  const layer = LAYERS.find((l) => l.id === layerId) ?? LAYERS[3];
  const fs = FS_TYPES.find((f) => f.id === fsId) ?? FS_TYPES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Слои операционной системы"
        subtitle="ОС — посредник между программами и железом. Нажмите слой, чтобы увидеть его роль."
      >
        <div className={styles.stack}>
          {[...LAYERS].reverse().map((l) => (
            <button
              key={l.id}
              type="button"
              className={clsx(styles.stackLayer, layerId === l.id && styles.stackLayerActive)}
              style={{'--layer-accent': l.accent}}
              onClick={() => setLayerId(l.id)}
            >
              <div>
                <div className={styles.stackName}>{l.name}</div>
                <div className={styles.stackRole}>{l.role}</div>
              </div>
              <span className={styles.stackBadge}>{l.id === 'kernel' ? 'ядро' : l.id}</span>
            </button>
          ))}
        </div>
        <div className={styles.stackDetail} style={{'--layer-accent': layer.accent}}>
          <p style={{margin: '0 0 0.35rem', fontWeight: 600}}>{layer.name}</p>
          <p className={styles.hint} style={{margin: 0}}>
            {layer.detail}
          </p>
          <p className={styles.mono} style={{marginTop: '0.5rem'}}>
            {layer.examples.join(' · ')}
          </p>
          {layer.managers && (
            <div className={styles.managerGrid}>
              {layer.managers.map((m) => (
                <span key={m} className={styles.managerChip}>
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </DemoCard>

      <DemoCard title="Файловые системы" subtitle="Способ хранения данных на диске — часть ядра (VFS + драйвер ФС).">
        <div className={styles.tabs}>
          {FS_TYPES.map((f) => (
            <button
              key={f.id}
              type="button"
              className={clsx(styles.tab, fsId === f.id && styles.tabActive)}
              onClick={() => setFsId(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p style={{margin: '0.35rem 0', fontWeight: 600}}>
          {fs.label}
          <span className={styles.badge}>{fs.os}</span>
        </p>
        <p className={styles.hint}>{fs.note}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default OsStackPlayInner;
