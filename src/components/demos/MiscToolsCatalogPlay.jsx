import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';

const CATEGORIES = [
  {id: 'all', label: 'Все'},
  {id: 'archive', label: 'Архивы'},
  {id: 'media', label: 'Медиа'},
  {id: 'sys', label: 'Система'},
  {id: 'net', label: 'Сеть'},
  {id: 'creative', label: 'Творчество'},
];

const TOOLS = [
  {id: '7zip', name: '7-Zip', cat: 'archive', os: 'Win, Linux', desc: 'Сжатие 7z/LZMA2, распаковка RAR/ZIP'},
  {id: 'peazip', name: 'PeaZip', cat: 'archive', os: 'Win, Linux', desc: '200+ форматов, шифрование, пакетная обработка'},
  {id: 'bandizip', name: 'Bandizip', cat: 'archive', os: 'Win, macOS', desc: 'Архивы ZIP/7z/RAR, предпросмотр, восстановление'},
  {id: 'vlc', name: 'VLC', cat: 'media', os: 'Кроссплатформа', desc: 'Плеер без кодеков, стрим, запись экрана'},
  {id: 'obs', name: 'OBS Studio', cat: 'media', os: 'Кроссплатформа', desc: 'Сцены, стрим, запись с микшером звука'},
  {id: 'handbrake', name: 'HandBrake', cat: 'media', os: 'Кроссплатформа', desc: 'Перекодирование видео, пресеты под устройства'},
  {id: 'audacity', name: 'Audacity', cat: 'media', os: 'Кроссплатформа', desc: 'Многодорожечный аудиоредактор, VST'},
  {id: 'calibre', name: 'Calibre', cat: 'media', os: 'Кроссплатформа', desc: 'Библиотека ePub/PDF, конвертация, синхронизация'},
  {id: 'everything', name: 'Everything', cat: 'sys', os: 'Windows', desc: 'Мгновенный поиск по NTFS-индексу'},
  {id: 'procexp', name: 'Process Explorer', cat: 'sys', os: 'Windows', desc: 'Дерево процессов, DLL, Sysinternals'},
  {id: 'hwinfo', name: 'HWiNFO', cat: 'sys', os: 'Windows', desc: 'Датчики, SMART, отчёты железа'},
  {id: 'crystaldisk', name: 'CrystalDiskInfo', cat: 'sys', os: 'Windows', desc: 'SMART дисков: температура, износ, предупреждения'},
  {id: 'windirstat', name: 'WinDirStat', cat: 'sys', os: 'Windows', desc: 'Карта занятости диска, удаление крупных файлов'},
  {id: 'wiztree', name: 'WizTree', cat: 'sys', os: 'Windows', desc: 'Быстрый анализ MFT — что занимает место'},
  {id: 'sharex', name: 'ShareX', cat: 'sys', os: 'Windows', desc: 'Скриншоты, запись, загрузка в облако, workflows'},
  {id: 'greenshot', name: 'Greenshot', cat: 'sys', os: 'Windows', desc: 'Захват экрана с аннотациями и экспортом'},
  {id: 'notepadpp', name: 'Notepad++', cat: 'sys', os: 'Windows', desc: 'Редактор с подсветкой синтаксиса и плагинами'},
  {id: 'keepass', name: 'KeePass', cat: 'sys', os: 'Win (+порты)', desc: 'Локальная зашифрованная база паролей'},
  {id: 'ccleaner', name: 'CCleaner', cat: 'sys', os: 'Win, macOS', desc: 'Очистка временных файлов и автозагрузки (осторожно с реестром)'},
  {id: 'autohotkey', name: 'AutoHotkey', cat: 'sys', os: 'Windows', desc: 'Макросы, переназначение клавиш, автоматизация'},
  {id: 'rufus', name: 'Rufus', cat: 'sys', os: 'Windows', desc: 'Загрузочные USB из ISO, UEFI/Legacy'},
  {id: 'libreoffice', name: 'LibreOffice', cat: 'sys', os: 'Кроссплатформа', desc: 'Офис: Writer, Calc, Impress; совместимость с MS Office'},
  {id: 'joplin', name: 'Joplin', cat: 'sys', os: 'Кроссплатформа', desc: 'Заметки Markdown, синхронизация WebDAV/Dropbox'},
  {id: 'putty', name: 'PuTTY', cat: 'net', os: 'Win, Unix', desc: 'SSH/Telnet клиент, сохранённые сессии'},
  {id: 'wireshark', name: 'Wireshark', cat: 'net', os: 'Кроссплатформа', desc: 'Захват и разбор пакетов, фильтры BPF'},
  {id: 'filezilla', name: 'FileZilla', cat: 'net', os: 'Кроссплатформа', desc: 'FTP/SFTP, очередь передач'},
  {id: 'anydesk', name: 'AnyDesk', cat: 'net', os: 'Кроссплатформа', desc: 'Удалённый рабочий стол, низкая задержка'},
  {id: 'teamviewer', name: 'TeamViewer', cat: 'net', os: 'Кроссплатформа', desc: 'Удалённая поддержка и встречи (коммерческая)'},
  {id: 'qbittorrent', name: 'qBittorrent', cat: 'net', os: 'Кроссплатформа', desc: 'Торрент-клиент с веб-UI и планировщиком'},
  {id: 'gimp', name: 'GIMP', cat: 'creative', os: 'Кроссплатформа', desc: 'Растровая графика, слои, плагины'},
  {id: 'inkscape', name: 'Inkscape', cat: 'creative', os: 'Кроссплатформа', desc: 'Вектор SVG, экспорт PDF/PNG'},
  {id: 'blender', name: 'Blender', cat: 'creative', os: 'Кроссплатформа', desc: '3D: моделирование, анимация, рендер'},
  {id: 'paintnet', name: 'Paint.NET', cat: 'creative', os: 'Windows', desc: 'Лёгкий растровый редактор со слоями'},
  {id: 'virtualbox', name: 'VirtualBox', cat: 'sys', os: 'Кроссплатформа', desc: 'Виртуальные машины, снимки, общие папки'},
  {id: 'ditto', name: 'Ditto', cat: 'sys', os: 'Windows', desc: 'История буфера обмена, поиск, сеть'},
  {id: 'sumatra', name: 'Sumatra PDF', cat: 'sys', os: 'Windows', desc: 'Лёгкий просмотр PDF/ePub без лишних функций'},
];

function MiscToolsCatalogPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('7zip');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      if (cat !== 'all' && t.cat !== cat) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.os.toLowerCase().includes(q)
      );
    });
  }, [cat, query]);

  const active = filtered.find((t) => t.id === activeId) ?? filtered[0];

  return (
    <DemoShell>
      <DemoCard
        title="Каталог утилит"
        subtitle="Фильтр по категории и поиск — краткие карточки вместо длинного списка"
      >
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск: VLC, SSH, архив…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, cat === c.id && toolStyles.chipActive)}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.grid2}>
          <ul className={styles.toolList}>
            {filtered.length === 0 ? (
              <li style={{cursor: 'default', opacity: 0.7}}>Ничего не найдено</li>
            ) : (
              filtered.map((t) => (
                <li
                  key={t.id}
                  className={active?.id === t.id ? styles.toolActive : undefined}
                  onClick={() => setActiveId(t.id)}
                >
                  {t.name}
                </li>
              ))
            )}
          </ul>
          {active && (
            <div className={styles.card}>
              <h5>{active.name}</h5>
              <p style={{margin: '0 0 0.35rem'}}>{active.desc}</p>
              <span className={styles.badge}>{active.os}</span>
              <span className={styles.badge} style={{marginLeft: '0.3rem'}}>
                {CATEGORIES.find((c) => c.id === active.cat)?.label ?? active.cat}
              </span>
            </div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MiscToolsCatalogPlayInner;
