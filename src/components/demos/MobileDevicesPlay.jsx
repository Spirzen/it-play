import React, {useCallback, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/MobileDevicesPlay.module.css';

const EVOLUTION = [
  {
    id: 'button',
    label: 'Кнопочный',
    title: 'Кнопочный телефон',
    w: 120,
    h: 180,
    screenH: 48,
    keys: 12,
    screen: 'монохром\n1–2″',
    desc: 'T9-ввод, Series 30/40, недели автономности — минимум ОЗУ и приложений.',
  },
  {
    id: 'smart',
    label: 'Смартфон',
    title: 'Смартфон',
    w: 140,
    h: 280,
    screenH: 220,
    keys: 0,
    screen: 'OLED\n6–7″',
    desc: 'Полноценная ОС, App Store, мультитач, камеры, 5G — всё на одном SoC.',
  },
  {
    id: 'tablet',
    label: 'Планшет',
    title: 'Планшет',
    w: 200,
    h: 260,
    screenH: 220,
    keys: 0,
    screen: 'сенсор\n8–14″',
    desc: 'Крупный экран без клавиатуры по умолчанию — контент, рисование, видеосвязь.',
  },
];

const SOC_BLOCKS = [
  {
    id: 'cpu',
    name: 'CPU',
    role: 'Ядра big.LITTLE',
    accent: '#3b82f6',
    detail:
      'Переключает мощные и экономичные ядра: игры и монтаж — на P-cores, фоновая синхронизация — на E-cores.',
  },
  {
    id: 'gpu',
    name: 'GPU',
    role: 'Графика и UI',
    accent: '#8b5cf6',
    detail: 'Рендерит интерфейс, 2D/3D в играх и декодирует видео — часто тот же кристалл, что и CPU.',
  },
  {
    id: 'npu',
    name: 'NPU',
    role: 'ИИ на устройстве',
    accent: '#ec4899',
    detail: 'Распознавание лиц, HDR+, ночной режим камеры, голосовой ввод — без отправки в облако.',
  },
  {
    id: 'isp',
    name: 'ISP',
    role: 'Обработка камеры',
    accent: '#14b8a6',
    detail: 'Сшивает кадры RAW, шумоподавление, портретный режим — до 4–6 модулей одновременно.',
  },
  {
    id: 'modem',
    name: 'Modem',
    role: '4G / 5G',
    accent: '#f59e0b',
    detail: 'Сотовая связь и Wi-Fi часто в одном RF-чипе; 5G Sub-6 — баланс, mmWave — пиковая скорость.',
  },
  {
    id: 'mem',
    name: 'Память',
    role: 'LPDDR + UFS',
    accent: '#64748b',
    detail: 'ОЗУ и флеш в корпусе PoP над SoC — мало места на плате, зато короткие задержки.',
  },
];

function MobileDevicesPlayInner() {
  const [evId, setEvId] = useState('smart');
  const [socId, setSocId] = useState('cpu');
  const [touches, setTouches] = useState([]);
  const arenaRef = useRef(null);

  const ev = EVOLUTION.find((e) => e.id === evId) ?? EVOLUTION[1];
  const soc = SOC_BLOCKS.find((s) => s.id === socId) ?? SOC_BLOCKS[0];

  const updateTouches = useCallback((e) => {
    const rect = arenaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pts = [];
    if (e.touches?.length) {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        pts.push({id: t.identifier, x: t.clientX - rect.left, y: t.clientY - rect.top});
      }
    } else if (e.clientX != null) {
      pts.push({id: 0, x: e.clientX - rect.left, y: e.clientY - rect.top});
    }
    setTouches(pts);
  }, []);

  const clearTouch = useCallback(() => setTouches([]), []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard title="Эволюция форм-фактора" subtitle="От кнопочного телефона к смартфону и планшету.">
        <div className={styles.tabs}>
          {EVOLUTION.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(styles.tab, evId === item.id && styles.tabActive)}
              onClick={() => setEvId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.deviceSilhouette}>
          <div className={styles.phoneBody} style={{width: ev.w, height: ev.h}}>
            <div className={styles.phoneScreen} style={{width: ev.w - 16, height: ev.screenH, whiteSpace: 'pre-line'}}>
              {ev.screen}
            </div>
            {ev.keys > 0 && (
              <div className={styles.phoneKeys}>
                {Array.from({length: ev.keys}, (_, i) => (
                  <span key={i} className={styles.keyBtn} />
                ))}
              </div>
            )}
          </div>
          <p className={styles.evTitle}>{ev.title}</p>
          <p className={styles.evDesc}>{ev.desc}</p>
        </div>
      </DemoCard>

      <DemoCard title="Что внутри SoC" subtitle="Один кристалл — много специализированных блоков. Нажмите на модуль.">
        <div className={styles.socGrid}>
          {SOC_BLOCKS.map((block) => (
            <button
              key={block.id}
              type="button"
              className={clsx(styles.socBlock, socId === block.id && styles.socBlockActive)}
              onClick={() => setSocId(block.id)}
            >
              <p className={styles.socName}>{block.name}</p>
              <p className={styles.socRole}>{block.role}</p>
            </button>
          ))}
        </div>
        <p className={styles.socDetail} style={{'--accent': soc.accent}}>
          <strong>{soc.name}:</strong> {soc.detail}
        </p>
      </DemoCard>

      <DemoCard
        title="Ёмкостный тачскрин"
        subtitle="Касание пальцем меняет ёмкость сетки ITO — ОС получает координаты и мультитач."
      >
        <div
          ref={arenaRef}
          className={styles.touchArena}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            updateTouches(e);
          }}
          onPointerMove={updateTouches}
          onPointerUp={clearTouch}
          onPointerCancel={clearTouch}
          onTouchStart={(e) => {
            e.preventDefault();
            updateTouches(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            updateTouches(e);
          }}
          onTouchEnd={clearTouch}
        >
          {touches.map((t) => (
            <span
              key={t.id}
              className={styles.touchDot}
              style={{left: t.x, top: t.y}}
            />
          ))}
        </div>
        <div className={styles.touchStats}>
          <span>
            Точек касания: <strong>{touches.length}</strong>
          </span>
          {touches[0] && (
            <span>
              Первая точка: <strong>
                {Math.round(touches[0].x)}, {Math.round(touches[0].y)}
              </strong>
            </span>
          )}
        </div>
        <p className={styles.hint}>
          Современные экраны распознают до 10 касаний: жесты "щипок" и свайп обрабатывает драйвер и ОС, а не
          сама матрица.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default MobileDevicesPlayInner;
