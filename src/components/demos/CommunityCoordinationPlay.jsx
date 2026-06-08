import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CommunityCoordinationPlay.module.css';

function CommunityCoordinationPlayInner() {
  const [mode, setMode] = useState('natural');
  const [participants, setParticipants] = useState(40);
  const [rulesStrict, setRulesStrict] = useState(mode === 'artificial' ? 70 : 20);

  const metrics = useMemo(() => {
    const isNatural = mode === 'natural';
    const trust = isNatural
      ? Math.min(95, 35 + participants * 0.8 + (100 - rulesStrict) * 0.25)
      : Math.min(90, 50 + rulesStrict * 0.35);
    const speed = isNatural
      ? Math.min(85, 20 + participants * 0.4)
      : Math.min(95, 40 + rulesStrict * 0.45);
    const innovation = isNatural
      ? Math.min(92, 45 + (100 - rulesStrict) * 0.3)
      : Math.min(70, 25 + rulesStrict * 0.2);
    const overhead = isNatural
      ? Math.max(8, 45 - participants * 0.3)
      : Math.min(88, 30 + rulesStrict * 0.5);
    return {trust, speed, innovation, overhead};
  }, [mode, participants, rulesStrict]);

  const switchMode = (m) => {
    setMode(m);
    setRulesStrict(m === 'artificial' ? 70 : 20);
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Координация сообществ"
        subtitle="Естественная самоорганизация vs искусственные правила платформы"
      >
        <div className="it-demo__tabs">
          <button
            type="button"
            className={clsx('it-demo__tab', mode === 'natural' && 'it-demo__tab--active')}
            onClick={() => switchMode('natural')}
          >
            Естественная
          </button>
          <button
            type="button"
            className={clsx('it-demo__tab', mode === 'artificial' && 'it-demo__tab--active')}
            onClick={() => switchMode('artificial')}
          >
            Искусственная
          </button>
        </div>

        <label className={styles.slider}>
          Участников: <strong>{participants}</strong>
          <input
            type="range"
            min={5}
            max={200}
            value={participants}
            onChange={(e) => setParticipants(Number(e.target.value))}
          />
        </label>
        <label className={styles.slider}>
          Жёсткость правил / модерации: <strong>{rulesStrict}%</strong>
          <input
            type="range"
            min={0}
            max={100}
            value={rulesStrict}
            onChange={(e) => setRulesStrict(Number(e.target.value))}
          />
        </label>

        <div className={styles.bars}>
          {[
            {key: 'trust', label: 'Доверие / репутация', val: metrics.trust, good: true},
            {key: 'speed', label: 'Скорость координации', val: metrics.speed, good: true},
            {key: 'innov', label: 'Гибкость практик', val: metrics.innovation, good: true},
            {key: 'over', label: 'Админ-накладные расходы', val: metrics.overhead, good: false},
          ].map((m) => (
            <div key={m.key} className={styles.row}>
              <span>{m.label}</span>
              <div className={styles.barTrack}>
                <div
                  className={clsx(
                    styles.barFill,
                    m.good ? styles.good : styles.warn,
                  )}
                  style={{width: `${m.val}%`}}
                />
              </div>
              <span>{Math.round(m.val)}%</span>
            </div>
          ))}
        </div>

        <p className={styles.hint}>
          {mode === 'natural'
            ? 'Open-source и нишевые форумы: нормы из опыта, репутация важнее регламента.'
            : 'Фриланс-биржи и корпоративные чаты: предсказуемость ценой постоянной поддержки структуры.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CommunityCoordinationPlayInner;
