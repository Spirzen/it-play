import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';
import mmStyles from './multimediaToolsPlays.module.css';

const CHAIN = [
  {
    id: 'input',
    label: 'Вход',
    tip: 'Микрофон, интерфейс (Focusrite), USB — выберите драйвер ASIO/WASAPI для низкой задержки.',
    level: 85,
  },
  {
    id: 'record',
    label: 'Запись',
    tip: 'DAW или Audacity: 48 kHz / 24 bit для видео; 44.1 kHz для музыки. Мониторинг с задержкой менее 10 ms.',
    level: 72,
  },
  {
    id: 'edit',
    label: 'Правка',
    tip: 'Обрезка, де-эссер, EQ, компрессия. Для подкаста — Auphonic или Hindenburg Journalist.',
    level: 58,
  },
  {
    id: 'mix',
    label: 'Микс',
    tip: 'Баланс дорожек, панорама, ревер. Reaper, Logic, Ardour — неограниченные шины.',
    level: 45,
  },
  {
    id: 'master',
    label: 'Мастер',
    tip: 'Лимитер, LUFS (−14 для стриминга). FFmpeg/sox — пакетная нормализация на сервере.',
    level: 38,
  },
  {
    id: 'out',
    label: 'Выход',
    tip: 'MP3/AAC для веба, WAV/FLAC для архива. Метаданные — ExifTool или встроенные теги DAW.',
    level: 90,
  },
];

const CATS = [
  {id: 'daw', label: 'DAW'},
  {id: 'editor', label: 'Редактор'},
  {id: 'dj', label: 'DJ'},
  {id: 'notation', label: 'Ноты'},
  {id: 'utility', label: 'Утилиты'},
];

const AUDIO_TOOLS = [
  {id: 'reaper', name: 'Reaper', cat: 'daw', desc: 'Гибкая DAW, ReaScript, низкая цена.'},
  {id: 'ardour', name: 'Ardour', cat: 'daw', desc: 'Open-source студия, JACK, LV2/VST.'},
  {id: 'lmms', name: 'LMMS', cat: 'daw', desc: 'Электроника, синты, бесплатно.'},
  {id: 'audacity', name: 'Audacity', cat: 'editor', desc: 'Подкасты, быстрые правки, VST.'},
  {id: 'ocenaudio', name: 'Ocenaudio', cat: 'editor', desc: 'Лёгкий редактор, превью эффектов.'},
  {id: 'rx', name: 'iZotope RX', cat: 'editor', desc: 'Восстановление шума, щелчков.'},
  {id: 'mixxx', name: 'Mixxx', cat: 'dj', desc: 'Open DJ, beatmatch, контроллеры.'},
  {id: 'traktor', name: 'Traktor Pro', cat: 'dj', desc: 'Профи DJ, Stems, Native Instruments.'},
  {id: 'musescore', name: 'MuseScore', cat: 'notation', desc: 'Партитуры, экспорт MIDI/PDF.'},
  {id: 'sox', name: 'SoX', cat: 'utility', desc: 'CLI: конвертация, эффекты, пакеты.'},
  {id: 'ffmpeg', name: 'FFmpeg', cat: 'utility', desc: 'Извлечь/заменить аудиодорожку в видео.'},
  {id: 'voicemeeter', name: 'Voicemeeter', cat: 'utility', desc: 'Виртуальный микшер для стрима.'},
];

function AudioToolsPlayInner() {
  const [node, setNode] = useState('input');
  const [cat, setCat] = useState('daw');
  const [gain, setGain] = useState(70);
  const [query, setQuery] = useState('');

  const step = CHAIN.find((c) => c.id === node) ?? CHAIN[0];
  const level = Math.min(100, Math.round((step.level * gain) / 100));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AUDIO_TOOLS.filter((t) => {
      if (t.cat !== cat) return false;
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    });
  }, [cat, query]);

  return (
    <DemoShell>
      <DemoCard
        title="Цепочка звука"
        subtitle="Пройдите этапы от микрофона до файла — подсказки для каждого звена"
      >
        <div className={mmStyles.chain}>
          {CHAIN.map((c, i) => (
            <React.Fragment key={c.id}>
              {i > 0 && <span className={mmStyles.chainArrow}>→</span>}
              <button
                type="button"
                className={clsx(mmStyles.chainNode, node === c.id && mmStyles.chainNodeActive)}
                onClick={() => setNode(c.id)}
              >
                {c.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <p className={styles.lead} style={{marginBottom: '0.5rem'}}>
          {step.tip}
        </p>
        <label className={mmStyles.meterRow}>
          Уровень сигнала (демо)
          <div className={mmStyles.meterBar}>
            <div className={mmStyles.meterFill} style={{width: `${level}%`}} />
          </div>
          <strong>{level}%</strong>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={gain}
          onChange={(e) => setGain(Number(e.target.value))}
          style={{width: '100%', marginBottom: '0.25rem'}}
        />
      </DemoCard>

      <DemoCard title="Инструменты по роли" subtitle="Категория и поиск">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {CATS.map((c) => (
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
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem'}}>
          {filtered.map((t) => (
            <li key={t.id}>
              <strong>{t.name}</strong> — {t.desc}
            </li>
          ))}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default AudioToolsPlayInner;
