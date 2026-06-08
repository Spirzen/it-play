import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/AttentionManipulationPlay.module.css';

const ORGANIC = [
  {id: 'o1', text: 'Разбор CVE в ядре Linux', likes: 42, bot: false},
  {id: 'o2', text: 'Мой pet-проект на Rust', likes: 18, bot: false},
  {id: 'o3', text: 'Вопрос по PostgreSQL индексам', likes: 31, bot: false},
];

function AttentionManipulationPlayInner() {
  const [botPct, setBotPct] = useState(25);
  const [showTruth, setShowTruth] = useState(false);

  const feed = useMemo(() => {
    const botPosts = Math.round((botPct / 100) * 80);
    const bots = Array.from({length: Math.max(0, botPosts)}, (_, i) => ({
      id: `b${i}`,
      text: `🔥 Тренд #${i + 1} — купи сейчас`,
      likes: 120 + i * 3,
      bot: true,
    }));
    return [...ORGANIC, ...bots].sort((a, b) => b.likes - a.likes).slice(0, 12);
  }, [botPct]);

  const visibleEngagement = feed.reduce((s, p) => s + p.likes, 0);
  const organicEngagement = feed.filter((p) => !p.bot).reduce((s, p) => s + p.likes, 0);
  const botShare = visibleEngagement
    ? Math.round(((visibleEngagement - organicEngagement) / visibleEngagement) * 100)
    : 0;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Искусственное усиление внимания"
        subtitle="Доля ботов в ленте — как меняется &quot;популярность&quot; темы"
      >
        <label className={styles.slider}>
          Доля ботов в активности: <strong>{botPct}%</strong>
          <input
            type="range"
            min={0}
            max={60}
            value={botPct}
            onChange={(e) => setBotPct(Number(e.target.value))}
          />
        </label>

        <label className={styles.check}>
          <input
            type="checkbox"
            checked={showTruth}
            onChange={(e) => setShowTruth(e.target.checked)}
          />
          Показать, какие посты от ботов
        </label>

        <ol className={styles.feed}>
          {feed.map((p, i) => (
            <li
              key={p.id}
              className={clsx(
                styles.item,
                showTruth && p.bot && styles.itemBot,
              )}
            >
              <span className={styles.rank}>#{i + 1}</span>
              {p.text}
              <span className={styles.likes}>♥ {p.likes}</span>
              {showTruth && p.bot && <span className={styles.tag}>bot</span>}
            </li>
          ))}
        </ol>

        <div className={styles.stats}>
          <span>
            Видимая вовлечённость: <strong>{visibleEngagement}</strong> лайков
          </span>
          <span>
            Реальная (органика): <strong>{organicEngagement}</strong> ({100 - botShare}%)
          </span>
        </div>
        <p className={styles.hint}>
          Боты раздувают метрики — реклама и алгоритм видят "горячую" тему, хотя живого обсуждения мало.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default AttentionManipulationPlayInner;
