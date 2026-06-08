import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './miscToolsPlays.module.css';
import mmStyles from './multimediaToolsPlays.module.css';

const PIPELINE = [
  {
    id: 'capture',
    label: 'Захват',
    title: 'Исходник',
    detail:
      'Камера, экран, карта захвата (Elgato), OBS — сырой поток или файл. Важны разрешение, частота кадров и цветовое пространство.',
    tools: ['OBS Studio', 'FFmpeg', 'Blackmagic Media Express'],
  },
  {
    id: 'edit',
    label: 'Монтаж',
    title: 'Сборка',
    detail:
      'Нарезка, титры, переходы, синхронизация звука. Прокси-файлы ускоряют работу на слабом ПК (Kdenlive, Resolve).',
    tools: ['DaVinci Resolve', 'Shotcut', 'Kdenlive', 'Premiere Pro'],
  },
  {
    id: 'grade',
    label: 'Цвет / VFX',
    title: 'Пост',
    detail:
      'Коррекция, маски, композитинг. Для роликов — встроенный Color в Resolve; для motion — After Effects / Natron.',
    tools: ['DaVinci Resolve', 'After Effects', 'Natron', 'Blender VSE'],
  },
  {
    id: 'encode',
    label: 'Кодек',
    title: 'Экспорт',
    detail:
      'H.264/H.265/AV1, битрейт, контейнер MP4/MKV. HandBrake и FFmpeg — пакетная обработка; LosslessCut — обрезка без перекода.',
    tools: ['HandBrake', 'FFmpeg', 'LosslessCut'],
  },
  {
    id: 'publish',
    label: 'Публикация',
    title: 'Доставка',
    detail:
      'YouTube, VK Video, корпоративный CDN. Адаптивный HLS/DASH для веба; для стримов — RTMP/SRT на платформу.',
    tools: ['YouTube Studio', 'Streamlabs', 'Mux (API)'],
  },
];

const TIERS = [
  {id: 'beginner', label: 'Новичок'},
  {id: 'creator', label: 'Креатор'},
  {id: 'pro', label: 'Профи'},
  {id: 'web', label: 'Веб / AI'},
];

const VIDEO_TOOLS = [
  {
    id: 'openshot',
    name: 'OpenShot',
    tier: 'beginner',
    os: 'Кроссплатформа',
    desc: 'Простой монтаж, ключевые кадры, бесплатно.',
  },
  {
    id: 'imovie',
    name: 'iMovie',
    tier: 'beginner',
    os: 'macOS, iOS',
    desc: 'Быстрые ролики в экосистеме Apple.',
  },
  {
    id: 'capcut',
    name: 'CapCut',
    tier: 'creator',
    os: 'Win, macOS, мобильные',
    desc: 'Shorts, шаблоны, автосубтитры.',
  },
  {
    id: 'shotcut',
    name: 'Shotcut',
    tier: 'creator',
    os: 'Кроссплатформа',
    desc: 'Открытый NLE, широкие форматы.',
  },
  {
    id: 'resolve',
    name: 'DaVinci Resolve',
    tier: 'pro',
    os: 'Кроссплатформа',
    desc: 'Монтаж + цвет + Fairlight в одном.',
  },
  {
    id: 'premiere',
    name: 'Premiere Pro',
    tier: 'pro',
    os: 'Win, macOS',
    desc: 'Индустрия, интеграция с After Effects.',
  },
  {
    id: 'avid',
    name: 'Avid Media Composer',
    tier: 'pro',
    os: 'Win, macOS',
    desc: 'Кино/TV, совместная работа в студии.',
  },
  {
    id: 'veed',
    name: 'VEED.IO',
    tier: 'web',
    os: 'Браузер',
    desc: 'Субтитры, озвучка, быстрый соц-контент.',
  },
  {
    id: 'descript',
    name: 'Descript',
    tier: 'web',
    os: 'Win, macOS, веб',
    desc: 'Монтаж через текст транскрипта.',
  },
  {
    id: 'ffmpeg',
    name: 'FFmpeg',
    tier: 'pro',
    os: 'Кроссплатформа',
    desc: 'CLI — основа автоматизации и серверов.',
  },
];

function VideoToolsPlayInner() {
  const [step, setStep] = useState('capture');
  const [tier, setTier] = useState('beginner');
  const [query, setQuery] = useState('');

  const pipe = PIPELINE.find((p) => p.id === step) ?? PIPELINE[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VIDEO_TOOLS.filter((t) => {
      if (t.tier !== tier) return false;
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
    });
  }, [tier, query]);

  return (
    <DemoShell>
      <DemoCard
        title="Видеопайплайн"
        subtitle="От захвата до публикации — на каждом этапе свои инструменты"
      >
        <div className={mmStyles.pipeline}>
          {PIPELINE.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(mmStyles.pipeStep, step === p.id && mmStyles.pipeStepActive)}
              onClick={() => setStep(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className={mmStyles.pipeDetail}>
          <strong>
            {pipe.title}: {pipe.label}
          </strong>
          {pipe.detail}
          <div style={{marginTop: '0.4rem', fontSize: '0.78rem'}}>
            Типично: {pipe.tools.join(' · ')}
          </div>
        </div>
      </DemoCard>

      <DemoCard title="Подбор редактора" subtitle="Уровень задачи и поиск по названию">
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TIERS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(toolStyles.chip, tier === t.id && toolStyles.chipActive)}
              onClick={() => setTier(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          className={styles.search}
          placeholder="Поиск в уровне…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul style={{margin: 0, paddingLeft: '1.1rem', fontSize: '0.84rem', lineHeight: 1.5}}>
          {filtered.length === 0 ? (
            <li style={{listStyle: 'none', marginLeft: '-1.1rem', opacity: 0.7}}>
              Нет совпадений — смените уровень или запрос
            </li>
          ) : (
            filtered.map((t) => (
              <li key={t.id}>
                <strong>{t.name}</strong> ({t.os}) — {t.desc}
              </li>
            ))
          )}
        </ul>
      </DemoCard>
    </DemoShell>
  );
}

export default VideoToolsPlayInner;
