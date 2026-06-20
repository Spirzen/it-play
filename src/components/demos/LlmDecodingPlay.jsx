import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import shared from '@/components/demos/aiPlayShared.module.css';
import styles from '@/components/demos/LlmDecodingPlay.module.css';

const VOCAB = [
  {token: 'машинное', p: 0.35},
  {token: 'глубокое', p: 0.22},
  {token: 'статистическое', p: 0.18},
  {token: 'искусственное', p: 0.12},
  {token: 'нейро', p: 0.08},
  {token: 'обучение', p: 0.05},
];

function softmax(logits) {
  const max = Math.max(...logits);
  const exps = logits.map((x) => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function applyTemperature(probs, temp) {
  if (temp <= 0.01) {
    const max = Math.max(...probs);
    return probs.map((p) => (p === max ? 1 : 0));
  }
  const logits = probs.map((p) => Math.log(p + 1e-9) / temp);
  return softmax(logits);
}

function applyTopK(probs, k) {
  const indexed = probs.map((p, i) => ({p, i})).sort((a, b) => b.p - a.p);
  const keep = new Set(indexed.slice(0, k).map((x) => x.i));
  const filtered = probs.map((p, i) => (keep.has(i) ? p : 0));
  const sum = filtered.reduce((a, b) => a + b, 0);
  return filtered.map((p) => p / (sum || 1));
}

function applyTopP(probs, pThreshold) {
  const indexed = probs.map((p, i) => ({p, i})).sort((a, b) => b.p - a.p);
  let cum = 0;
  const keep = new Set();
  for (const {p, i} of indexed) {
    keep.add(i);
    cum += p;
    if (cum >= pThreshold) break;
  }
  const filtered = probs.map((p, i) => (keep.has(i) ? p : 0));
  const sum = filtered.reduce((a, b) => a + b, 0);
  return filtered.map((p) => p / (sum || 1));
}

function sample(probs, seed) {
  let r = seed % 1;
  for (let i = 0; i < probs.length; i++) {
    r -= probs[i];
    if (r <= 0) return VOCAB[i].token;
  }
  return VOCAB[0].token;
}

function Slider({label, value, display, min, max, step, onChange}) {
  return (
    <label className={shared.sliderField}>
      <div className={shared.sliderHead}>
        <span>{label}</span>
        <span className={shared.sliderValue}>{display}</span>
      </div>
      <input className={shared.range} type="range" min={min} max={max} step={step} value={value} onChange={onChange} />
    </label>
  );
}

function LlmDecodingPlayInner() {
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(4);
  const [topP, setTopP] = useState(0.9);
  const [seed, setSeed] = useState(1);

  const base = VOCAB.map((v) => v.p);
  const dist = useMemo(() => {
    let d = applyTemperature(base, temperature);
    d = applyTopK(d, topK);
    d = applyTopP(d, topP);
    return d;
  }, [temperature, topK, topP]);

  const pickedIdx = dist.indexOf(Math.max(...dist));
  const picked = VOCAB[pickedIdx]?.token ?? VOCAB[0].token;
  const sampled = sample(dist, seed);

  return (
    <DemoShell className={shared.root}>
      <DemoCard title="Параметры декодирования" subtitle="Распределение следующего токена после «… это»">
        <p className={styles.prompt}>Контекст: «Искусственный интеллект — это ___»</p>

        <div className={styles.layout}>
          <div className={styles.sliders}>
            <Slider label="temperature" display={temperature.toFixed(2)} min={0} max={2} step={0.05} value={temperature} onChange={(e) => setTemperature(+e.target.value)} />
            <Slider label="top_k" display={topK} min={1} max={6} step={1} value={topK} onChange={(e) => setTopK(+e.target.value)} />
            <Slider label="top_p" display={topP.toFixed(2)} min={0.5} max={1} step={0.05} value={topP} onChange={(e) => setTopP(+e.target.value)} />
          </div>

          <div className={styles.bars}>
            {VOCAB.map((v, i) => (
              <div key={v.token} className={styles.barRow}>
                <span className={styles.barLabel}>{v.token}</span>
                <div className={shared.meter}>
                  <div
                    className={clsx(shared.meterFill, (sampled === v.token || picked === v.token) && styles.barHighlight)}
                    style={{width: `${dist[i] * 100}%`}}
                  />
                </div>
                <span className={styles.barPct}>{(dist[i] * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={shared.controls}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={() => setSeed((s) => s + 0.17)}>
            Сэмплировать
          </button>
          <span className={styles.sampled}>
            Выбрано: <strong>{sampled}</strong>
          </span>
        </div>

        <p className={shared.hint}>
          Низкая <strong>temperature</strong> — предсказуемый ответ. Высокая + широкий <strong>top_p</strong> — креатив и риск «случайных» токенов.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default LlmDecodingPlayInner;
