import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  BASE_PRICE,
  PRICE_SIGNALS,
  calcPersonalizedPrice,
  formatRub,
} from '@/components/shared/kb/personalizedPricingEngine';
import styles from '@/components/demos/PersonalizedPricingPlay.module.css';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';

const SEGMENT_COLORS = ['#c62828', '#d84315', '#ef6c00', '#f9a825', '#7b1fa2', '#5e35b1'];

function PersonalizedPricingPlayInner() {
  const [signals, setSignals] = useState({
    rush: true,
    night: false,
    loyal: true,
    salary: false,
    iphone: true,
    impulse: false,
  });

  const result = useMemo(() => calcPersonalizedPrice(signals), [signals]);

  const toggle = (id) => setSignals((s) => ({...s, [id]: !s[id]}));

  const resetProfile = () =>
    setSignals({
      rush: false,
      night: false,
      loyal: false,
      salary: false,
      iphone: false,
      impulse: false,
    });

  const applyGreedyProfile = () =>
    setSignals({
      rush: true,
      night: true,
      loyal: true,
      salary: true,
      iphone: true,
      impulse: true,
    });

  const segmentWidths = useMemo(() => {
    if (!result.active.length) return [{id: 'base', pct: 100, color: '#78909c'}];
    const parts = result.active.map((s, i) => ({
      id: s.id,
      pct: (s.markup / result.markupPct) * (result.markupPct / (100 + result.markupPct)) * 100,
      color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
      label: s.label,
    }));
    const basePct = (100 / (100 + result.markupPct)) * 100;
    return [{id: 'base', pct: basePct, color: '#78909c', label: 'База'}, ...parts];
  }, [result]);

  return (
    <DemoShell>
      <DemoCard
        title="Персонализированная цена"
        subtitle="Сервис собирает сигналы о вас и подбирает цену в &quot;допустимом&quot; диапазоне — сравните с базовой"
      >
        <div className={toolStyles.toolbar}>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={resetProfile}>
            Режим "инкогнито"
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary it-demo__btn--sm" onClick={applyGreedyProfile}>
            Профиль "максимум сигналов"
          </button>
        </div>

        <div className={styles.priceHero}>
          <div className={clsx(styles.priceCard, styles.priceCardBase)}>
            <div className={styles.priceLabel}>Базовая (рынок / новый профиль)</div>
            <div className={styles.priceValue}>{formatRub(BASE_PRICE)}</div>
          </div>
          <div className={styles.priceCard}>
            <div className={styles.priceLabel}>Ваша персональная цена</div>
            <div className={clsx(styles.priceValue, styles.priceValueYou)}>{formatRub(result.price)}</div>
            <div className={styles.priceDelta}>
              {result.delta > 0
                ? `+${formatRub(result.delta)} (+${result.markupPct}%)`
                : 'Наценок нет — профиль "холодный"'}
            </div>
          </div>
        </div>

        <div className={styles.signals}>
          {PRICE_SIGNALS.map((sig) => (
            <label
              key={sig.id}
              className={clsx(styles.signalRow, signals[sig.id] && styles.signalRowActive)}
            >
              <input type="checkbox" checked={Boolean(signals[sig.id])} onChange={() => toggle(sig.id)} />
              <span>
                {sig.label}
                <span className="it-demo__hint" style={{display: 'block', marginTop: '0.1rem'}}>
                  {sig.hint}
                </span>
              </span>
              <span className={styles.signalMarkup}>+{sig.markup}%</span>
            </label>
          ))}
        </div>

        {result.markupPct > 0 && (
          <div className={styles.breakdown}>
            <div className="it-demo__label">Из чего сложилась наценка</div>
            <div className={styles.breakdownBar}>
              {segmentWidths.map((seg) => (
                <div
                  key={seg.id}
                  className={styles.breakdownSeg}
                  style={{width: `${seg.pct}%`, background: seg.color}}
                  title={seg.label}
                />
              ))}
            </div>
            <div className={styles.legend}>
              {segmentWidths.map((seg) => (
                <span key={seg.id} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background: seg.color}} />
                  {seg.label ?? 'База'}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="it-demo__hint" style={{marginBottom: 0, marginTop: '0.75rem'}}>
          Отдельно для каждого сигнала наценка небольшая, но в сумме даёт ощутимую разницу — её сложно заметить без
          сравнения с "чужим" профилем.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default PersonalizedPricingPlayInner;
