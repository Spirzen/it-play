import React, {useCallback, useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CryptoVolatilityPlay.module.css';

const PRESETS = [
  {id: 'fiat', label: 'Фиат (индекс)', sigma: 0.008, color: '#5c6bc0'},
  {id: 'btc', label: 'BTC', sigma: 0.045, color: '#f59e0b'},
  {id: 'alt', label: 'Альткоин', sigma: 0.09, color: '#ef4444'},
];

function mulberry32(seed) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simulateDays(sigma, days, seed) {
  const rand = mulberry32(seed);
  let price = 100;
  const points = [{day: 0, price}];
  for (let d = 1; d <= days; d += 1) {
    const shock = (rand() - 0.5) * 2 * sigma;
    price = Math.max(20, price * (1 + shock));
    points.push({day: d, price});
  }
  return points;
}

function dayChangePct(points) {
  const last = points[points.length - 1]?.price ?? 100;
  const prev = points[points.length - 2]?.price ?? last;
  return prev ? ((last - prev) / prev) * 100 : 0;
}

function maxDrawdown(points) {
  let peak = points[0]?.price ?? 100;
  let maxDd = 0;
  points.forEach((p) => {
    if (p.price > peak) peak = p.price;
    const dd = peak ? ((peak - p.price) / peak) * 100 : 0;
    if (dd > maxDd) maxDd = dd;
  });
  return maxDd;
}

function CryptoVolatilityPlayInner() {
  const [presetId, setPresetId] = useState('btc');
  const [days, setDays] = useState(30);
  const [seed, setSeed] = useState(42);

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[1];
  const points = useMemo(
    () => simulateDays(preset.sigma, days, seed),
    [preset.sigma, days, seed],
  );

  const minP = Math.min(...points.map((p) => p.price));
  const maxP = Math.max(...points.map((p) => p.price));
  const range = maxP - minP || 1;
  const change24 = dayChangePct(points);
  const drawdown = maxDrawdown(points);

  const reroll = useCallback(() => setSeed((s) => s + 1), []);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Симулятор волатильности"
        subtitle="30 &quot;дней&quot; цены: сравните разброс BTC, альткоина и спокойного фиат-индекса"
      >
        <div className={styles.chips}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.chip, presetId === p.id && styles.chipActive)}
              style={presetId === p.id ? {'--chip': p.color} : undefined}
              onClick={() => setPresetId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <label className={styles.label}>
          Дней на графике: <strong>{days}</strong>
          <input
            type="range"
            min={14}
            max={90}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </label>

        <div className={styles.chart} role="img" aria-label="График цены">
          {points.map((p) => {
            const h = ((p.price - minP) / range) * 100;
            return (
              <div
                key={p.day}
                className={styles.bar}
                style={{height: `${Math.max(4, h)}%`, background: preset.color}}
                title={`День ${p.day}: ${p.price.toFixed(1)}`}
              />
            );
          })}
        </div>

        <div className={styles.stats}>
          <span>
            Изменение за последний "день":{' '}
            <strong className={change24 >= 0 ? styles.up : styles.down}>
              {change24 >= 0 ? '+' : ''}
              {change24.toFixed(1)}%
            </strong>
          </span>
          <span>
            Макс. просадка от пика: <strong>{drawdown.toFixed(1)}%</strong>
          </span>
          <span>
            σ сценария: <strong>{(preset.sigma * 100).toFixed(1)}%</strong> / день
          </span>
        </div>

        <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={reroll}>
          Новая случайная траектория
        </button>
        <p className={styles.hint}>
          На крипторынке колебания 10–30% за сутки возможны из‑за низкой капитализации, новостей и
          действий крупных держателей — на графике это видно как "рваные" столбцы.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CryptoVolatilityPlayInner;
