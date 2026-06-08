import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';
import mmStyles from './multimediaToolsPlays.module.css';

const CATEGORIES = [
  {id: 'all', label: 'Все'},
  {id: 'audio', label: 'Аудио'},
  {id: 'video', label: 'Видео'},
  {id: 'raster', label: 'Растр'},
  {id: 'vector', label: 'Вектор'},
  {id: 'utility', label: 'Утилиты'},
];

const TOOLS = [
  {
    id: 'audacity',
    name: 'Audacity',
    cat: 'audio',
    license: 'free',
    os: 'Win, macOS, Linux',
    desc: 'Запись, нарезка, шумоподавление, VST/LADSPA.',
    link: 'https://www.audacityteam.org/',
  },
  {
    id: 'resolve',
    name: 'DaVinci Resolve',
    cat: 'video',
    license: 'free',
    os: 'Win, macOS, Linux',
    desc: 'Монтаж, цвет, Fairlight, Fusion — бесплатная версия мощная.',
    link: 'https://www.blackmagicdesign.com/products/davinciresolve/',
  },
  {
    id: 'gimp',
    name: 'GIMP',
    cat: 'raster',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'Слои, маски, плагины — аналог Photoshop для растра.',
    link: 'https://www.gimp.org/',
  },
  {
    id: 'inkscape',
    name: 'Inkscape',
    cat: 'vector',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'SVG, логотипы, типографика, экспорт PDF.',
    link: 'https://inkscape.org/',
  },
  {
    id: 'krita',
    name: 'Krita',
    cat: 'raster',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'Цифровая живопись, кисти, анимация кадров.',
    link: 'https://krita.org/',
  },
  {
    id: 'shotcut',
    name: 'Shotcut',
    cat: 'video',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'MLT, 4K, фильтры без конвертации исходников.',
    link: 'https://shotcut.org/',
  },
  {
    id: 'obs',
    name: 'OBS Studio',
    cat: 'video',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'Сцены, запись, RTMP-стрим, виртуальная камера.',
    link: 'https://obsproject.com/',
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    cat: 'utility',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'CLI: транскод, обрезка, стрим, извлечение дорожек.',
    link: 'https://ffmpeg.org/',
  },
  {
    id: 'handbrake',
    name: 'HandBrake',
    cat: 'utility',
    license: 'free',
    os: 'Кроссплатформа',
    desc: 'Пресеты под устройства, пакетное перекодирование.',
    link: 'https://handbrake.fr/',
  },
  {
    id: 'darktable',
    name: 'darktable',
    cat: 'raster',
    license: 'free',
    os: 'Linux, macOS, Win',
    desc: 'RAW, неразрушающие правки, каталог съёмки.',
    link: 'https://www.darktable.org/',
  },
  {
    id: 'photopea',
    name: 'Photopea',
    cat: 'raster',
    license: 'free',
    os: 'Браузер',
    desc: 'PSD/XCF в браузере — быстрые правки без установки.',
    link: 'https://www.photopea.com/',
  },
  {
    id: 'reaper',
    name: 'Reaper',
    cat: 'audio',
    license: 'paid',
    os: 'Win, macOS, Linux',
    desc: 'DAW с ReaScript, лёгкая установка, щедрый trial.',
    link: 'https://www.reaper.fm/',
  },
];

function MultimediaEditorsPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('audacity');

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
        title="Каталог мультимедиа-редакторов"
        subtitle="Фильтр по типу задачи — от записи подкаста до цветокоррекции и конвертации"
      >
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск: GIMP, FFmpeg, RAW…"
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
              <span
                className={clsx(
                  styles.badge,
                  active.license === 'free' ? mmStyles.licenseFree : mmStyles.licensePaid,
                )}
                style={{marginLeft: '0.3rem'}}
              >
                {active.license === 'free' ? 'Open / Free' : 'Коммерция / trial'}
              </span>
              <p style={{margin: '0.5rem 0 0', fontSize: '0.8rem'}}>
                <a href={active.link} target="_blank" rel="noopener noreferrer">
                  Официальный сайт →
                </a>
              </p>
            </div>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MultimediaEditorsPlayInner;
