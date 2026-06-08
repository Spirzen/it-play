import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CiaTriadPlay.module.css';

const PRESETS = [
  {id: 'balanced', label: 'Баланс', values: {c: 70, i: 70, a: 70}},
  {id: 'bank', label: 'Банк (C↑)', values: {c: 95, i: 85, a: 60}},
  {id: 'cdn', label: 'CDN (A↑)', values: {c: 50, i: 60, a: 95}},
  {id: 'ledger', label: 'Реестр (I↑)', values: {c: 75, i: 95, a: 55}},
];

const TRADEOFFS = [
  {
    test: (c, i, a) => c > 85 && a < 55,
    text: 'Сильная конфиденциальность (MFA, шифрование, DLP) замедляет доступ — пользователи ждут проверок.',
  },
  {
    test: (c, i, a) => a > 85 && c < 55,
    text: 'Максимальная доступность (минимум проверок) открывает риск утечек и перехвата сессий.',
  },
  {
    test: (c, i, a) => i > 85 && a < 55,
    text: 'Жёсткая целостность (подписи, immutable-логи) усложняет быстрые изменения и откаты.',
  },
  {
    test: (c, i, a) => Math.min(c, i, a) > 75 && Math.max(c, i, a) - Math.min(c, i, a) < 20,
    text: 'Сбалансированная триада: ни один столп не доминирует — типичная цель корпоративной ИБ.',
  },
];

function CiaTriadPlayInner() {
  const [values, setValues] = useState(PRESETS[0].values);
  const [focus, setFocus] = useState('c');

  const {c, i, a} = values;
  const dominant = useMemo(() => {
    const entries = [
      ['c', c, 'Конфиденциальность'],
      ['i', i, 'Целостность'],
      ['a', a, 'Доступность'],
    ];
    entries.sort((x, y) => y[1] - x[1]);
    return entries[0];
  }, [c, i, a]);

  const feedback = useMemo(() => {
    const hit = TRADEOFFS.find((t) => t.test(c, i, a));
    if (hit) return hit.text;
    const [key, score, label] = dominant;
    return `Приоритет — ${label} (${score}%). Подкрутите слайдеры и посмотрите, как меняется компромисс между столпами CIA.`;
  }, [c, i, a, dominant]);

  const setSlider = (key, v) => {
    setFocus(key);
    setValues((prev) => ({...prev, [key]: Number(v)}));
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Триада CIA: баланс столпов"
        subtitle="Двигайте приоритеты конфиденциальности, целостности и доступности — система показывает компромиссы"
      >
        <div className={styles.presetBar}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary"
              onClick={() => {
                setValues(p.values);
                setFocus('c');
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.triangleWrap}>
          <div className={styles.triangle} aria-hidden>
            <div
              className={clsx(styles.node, styles.nodeC, focus === 'c' && styles.nodeActive)}
              style={{opacity: 0.4 + c / 140}}
            >
              <span>C</span>
              <span>{c}%</span>
            </div>
            <div
              className={clsx(styles.node, styles.nodeI, focus === 'i' && styles.nodeActive)}
              style={{opacity: 0.4 + i / 140}}
            >
              <span>I</span>
              <span>{i}%</span>
            </div>
            <div
              className={clsx(styles.node, styles.nodeA, focus === 'a' && styles.nodeActive)}
              style={{opacity: 0.4 + a / 140}}
            >
              <span>A</span>
              <span>{a}%</span>
            </div>
          </div>
        </div>

        <div className={styles.sliders}>
          {[
            {key: 'c', label: 'Конфиденциальность', color: styles.nodeC},
            {key: 'i', label: 'Целостность', color: styles.nodeI},
            {key: 'a', label: 'Доступность', color: styles.nodeA},
          ].map((s) => (
            <div key={s.key} className={styles.sliderRow}>
              <label>
                <span>{s.label}</span>
                <span>{values[s.key]}%</span>
              </label>
              <input
                type="range"
                min={20}
                max={100}
                value={values[s.key]}
                onChange={(e) => setSlider(s.key, e.target.value)}
                onFocus={() => setFocus(s.key)}
                aria-label={s.label}
              />
            </div>
          ))}
        </div>

        <p className={styles.feedback}>{feedback}</p>
      </DemoCard>
    </DemoShell>
  );
}

export default CiaTriadPlayInner;
