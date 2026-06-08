import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/LaptopExplorerPlay.module.css';

const TYPES = [
  {
    id: 'ultra',
    label: 'Ультрабук',
    title: 'Ультрабук',
    tagline: 'Тонкий корпус, долгая автономность, минимум портов — мобильность важнее апгрейда.',
    lidA: '#4b5563',
    lidB: '#374151',
    screen: 'OLED 13″',
    hz: '60 Гц',
    metrics: {portability: 95, performance: 55, battery: 88, upgrade: 15},
    chips: ['< 1,5 кг', 'USB-C / Thunderbolt', 'LPDDR5', 'без дискретной GPU'],
    hint: 'Компромисс: почти всё распаяно на плате — после покупки память и SSD не расширить.',
    rgb: false,
    touchpad: false,
  },
  {
    id: 'gaming',
    label: 'Игровой',
    title: 'Игровой ноутбук',
    tagline: 'Мощный CPU/GPU, высокая частота экрана, активное охлаждение — цена: вес и шум.',
    lidA: '#7f1d1d',
    lidB: '#450a0a',
    screen: 'IPS 15″',
    hz: '144+ Гц',
    metrics: {portability: 35, performance: 92, battery: 40, upgrade: 45},
    chips: ['RTX / Radeon', 'MUX Switch', '2–3 вентилятора', '90+ Вт·ч'],
    hint: 'Два одинаковых i7 в разных корпусах дадут разный FPS — всё решает охлаждение и лимиты мощности.',
    rgb: true,
    touchpad: false,
  },
  {
    id: 'main',
    label: 'Универсальный',
    title: 'Универсальный (mainstream)',
    tagline: 'Баланс цены, портов и автономности — офис, учёба, веб, лёгкий монтаж.',
    lidA: '#1e3a5f',
    lidB: '#0f2744',
    screen: 'Full HD 15″',
    hz: '60 Гц',
    metrics: {portability: 65, performance: 62, battery: 72, upgrade: 55},
    chips: ['16 ГБ RAM', '512 ГБ SSD', 'USB-A + HDMI', 'Core i5 / Ryzen 7'],
    hint: 'Часто единственный слот M.2 и один SODIMM — планируйте объём RAM при покупке.',
    rgb: false,
    touchpad: false,
  },
  {
    id: 'transform',
    label: 'Трансформер',
    title: '2-in-1 трансформер',
    tagline: 'Шарнир 360° или съёмная клавиатура — ноутбук и планшет в одном корпусе.',
    lidA: '#5b21b6',
    lidB: '#3b0764',
    screen: 'сенсор + перо',
    hz: '120 Гц',
    metrics: {portability: 70, performance: 58, battery: 65, upgrade: 35},
    chips: ['тач + стилус', 'режим "палатка"', 'Windows / iPadOS', 'компактный SoC'],
    hint: 'Сенсор и перо требуют поддержки ОС — без неё это просто экран, который можно крутить.',
    rgb: false,
    touchpad: true,
  },
  {
    id: 'mac',
    label: 'MacBook',
    title: 'MacBook (Apple Silicon)',
    tagline: 'Высокая интеграция SoC, энергоэффективность и экосистема — минимум совместимости с "чужим" железом.',
    lidA: '#9ca3af',
    lidB: '#6b7280',
    screen: 'Liquid Retina',
    hz: 'ProMotion',
    metrics: {portability: 82, performance: 85, battery: 95, upgrade: 5},
    chips: ['M-чип SoC', '⌘ вместо Ctrl', 'Force Touch', '20+ ч автономии'],
    hint: 'Память и SSD в кристалле — конфигурацию выбирают один раз на годы вперёд.',
    rgb: false,
    touchpad: true,
  },
];

function MetricBar({label, value}) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricHead}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricVal}>{value}%</span>
      </div>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{width: `${value}%`}} />
      </div>
    </div>
  );
}

function LaptopExplorerPlayInner() {
  const [typeId, setTypeId] = useState('ultra');
  const [lidOpen, setLidOpen] = useState(true);
  const type = TYPES.find((t) => t.id === typeId) ?? TYPES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Классы ноутбуков"
        subtitle="Выберите тип — сравните компромиссы и посмотрите, как устроен &quot;книжный&quot; форм-фактор."
      >
        <div className={styles.tabs}>
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(styles.tab, typeId === t.id && styles.tabActive)}
              onClick={() => setTypeId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.laptopScene}>
            <div
              className={styles.laptop}
              style={{'--lid-a': type.lidA, '--lid-b': type.lidB}}
            >
              <div className={clsx(styles.lid, lidOpen && styles.lidOpen)}>
                <div className={styles.screenBezel}>
                  <div className={styles.screenContent}>
                    <span>{type.screen}</span>
                    <span className={styles.screenHz}>{type.hz}</span>
                  </div>
                </div>
              </div>
              <div className={styles.base} />
              <div className={styles.keyboardDeck}>
                <div className={styles.keyGrid} aria-hidden>
                  {Array.from({length: 36}, (_, i) => (
                    <span
                      key={i}
                      className={clsx(styles.key, type.rgb && i % 5 === 0 && styles.keyRgb)}
                    />
                  ))}
                </div>
                <div className={clsx(styles.touchpad, type.touchpad && styles.touchpadLarge)} />
              </div>
            </div>
            <button type="button" className={styles.hingeBtn} onClick={() => setLidOpen((o) => !o)}>
              {lidOpen ? 'Закрыть крышку' : 'Открыть крышку'}
            </button>
          </div>

          <div>
            <h4 className={styles.typeTitle}>{type.title}</h4>
            <p className={styles.typeTagline}>{type.tagline}</p>
            <MetricBar label="Переносимость" value={type.metrics.portability} />
            <MetricBar label="Производительность" value={type.metrics.performance} />
            <MetricBar label="Автономность" value={type.metrics.battery} />
            <MetricBar label="Расширяемость" value={type.metrics.upgrade} />
            <div className={styles.chips}>
              {type.chips.map((c) => (
                <span key={c} className={styles.chip}>
                  {c}
                </span>
              ))}
            </div>
            <p className={styles.hint}>{type.hint}</p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LaptopExplorerPlayInner;
