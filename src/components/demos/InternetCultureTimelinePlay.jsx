import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/InternetCultureTimelinePlay.module.css';

const ERAS = [
  {
    id: 'bbs',
    label: 'BBS / dial-up',
    years: '1980–1995',
    speed: 'Модем, секунды отклика',
    culture: 'Медленные тексты, дисциплина, админ = "хозяин"',
    tech: 'FidoNet, ночной обмен пакетов',
  },
  {
    id: 'web2',
    label: 'Web 1.0 → 2.0',
    years: '1995–2010',
    speed: 'Широкополосный HTTP',
    culture: 'Форумы, карма, длинные ветки, цитирование',
    tech: 'phpBB, vBulletin, CMS',
  },
  {
    id: 'feed',
    label: 'Соцсетевой фид',
    years: '2010–2016',
    speed: 'Мобильный, хронологическая лента',
    culture: 'Профиль в центре, лайки вместо ответов',
    tech: 'VK, Facebook, Twitter',
  },
  {
    id: 'algo',
    label: 'Алгоритмический шортс',
    years: '2016–н.в.',
    speed: 'Бесконечный скролл, <60 с',
    culture: 'Виральность, хуки, алгоритмическая грамотность',
    tech: 'TikTok, Reels, рекомендательные модели',
  },
];

function InternetCultureTimelinePlayInner() {
  const [eraId, setEraId] = useState('web2');
  const era = ERAS.find((e) => e.id === eraId) ?? ERAS[1];
  const idx = ERAS.findIndex((e) => e.id === eraId);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Эпохи интернет-культуры"
        subtitle="Листайте вехи — у каждой своя скорость сети и тип коммуникации"
      >
        <div className={styles.track} role="tablist">
          {ERAS.map((e, i) => (
            <button
              key={e.id}
              type="button"
              role="tab"
              aria-selected={eraId === e.id}
              className={clsx(styles.dot, eraId === e.id && styles.dotActive)}
              onClick={() => setEraId(e.id)}
            >
              <span className={styles.dotLabel}>{e.label}</span>
              {i < ERAS.length - 1 && <span className={styles.connector} aria-hidden />}
            </button>
          ))}
        </div>

        <div className={styles.card} style={{'--era-hue': `${idx * 55 + 200}`}}>
          <p className={styles.years}>{era.years}</p>
          <h5>{era.label}</h5>
          <dl>
            <div>
              <dt>Сеть</dt>
              <dd>{era.speed}</dd>
            </div>
            <div>
              <dt>Культура</dt>
              <dd>{era.culture}</dd>
            </div>
            <div>
              <dt>Технологии</dt>
              <dd>{era.tech}</dd>
            </div>
          </dl>
        </div>

        <div className={styles.nav}>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={idx <= 0}
            onClick={() => setEraId(ERAS[idx - 1].id)}
          >
            ← Раньше
          </button>
          <button
            type="button"
            className="it-demo__btn it-demo__btn--secondary"
            disabled={idx >= ERAS.length - 1}
            onClick={() => setEraId(ERAS[idx + 1].id)}
          >
            Позже →
          </button>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default InternetCultureTimelinePlayInner;
