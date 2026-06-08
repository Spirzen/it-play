import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/SocialNetworkArchPlay.module.css';

const TABS = [
  {id: 'graph', label: 'Граф связей'},
  {id: 'feed', label: 'Лента'},
  {id: 'arch', label: 'Сервисы'},
];

const SEED_POSTS = [
  {id: 'a', author: 'Аня', text: 'Запустили фичу в прод', likes: 12, fresh: 0.9, relation: 1},
  {id: 'b', author: 'Борис', text: 'Обзор Kubernetes', likes: 45, fresh: 0.5, relation: 0.3},
  {id: 'c', author: 'Саша', text: 'Фото с конференции', likes: 8, fresh: 1, relation: 0.8},
  {id: 'd', author: 'Дима', text: 'Вакансия в команде', likes: 3, fresh: 0.2, relation: 0.1},
];

function score(post, w) {
  return (
    w.fresh * post.fresh +
    w.likes * (post.likes / 50) +
    w.relation * post.relation
  );
}

function SocialNetworkArchPlayInner() {
  const [tab, setTab] = useState('feed');
  const [followB, setFollowB] = useState(true);
  const [weights, setWeights] = useState({fresh: 0.4, likes: 0.35, relation: 0.25});
  const [selected, setSelected] = useState('me');

  const ranked = useMemo(
    () => [...SEED_POSTS].sort((a, b) => score(b, weights) - score(a, weights)),
    [weights],
  );

  const nodes = [
    {id: 'me', label: 'Вы'},
    {id: 'a', label: 'Аня'},
    {id: 'b', label: 'Борис'},
    {id: 'c', label: 'Саша'},
  ];

  const edges = [
    ['me', 'a'],
    ['me', 'c'],
    ...(followB ? [['me', 'b']] : []),
    ['a', 'c'],
  ];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура социальной сети"
        subtitle="Граф подписок, ранжирование ленты и микросервисный контур"
      >
        <div className="it-demo__tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'graph' && (
          <>
            <label className={styles.check}>
              <input type="checkbox" checked={followB} onChange={(e) => setFollowB(e.target.checked)} />
              Подписка на Бориса
            </label>
            <div className={styles.graph}>
              {nodes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={clsx(styles.graphNode, selected === n.id && styles.graphNodeActive)}
                  onClick={() => setSelected(n.id)}
                >
                  {n.label}
                </button>
              ))}
              <svg className={styles.graphSvg} viewBox="0 0 280 120" aria-hidden>
                {edges.map(([from, to]) => {
                  const pos = {me: [40, 60], a: [120, 20], b: [120, 100], c: [220, 60]};
                  const [x1, y1] = pos[from];
                  const [x2, y2] = pos[to];
                  return (
                    <line key={`${from}-${to}`} x1={x1} y1={y1} x2={x2} y2={y2} className={styles.edge} />
                  );
                })}
              </svg>
            </div>
            <p className={styles.hint}>
              Узел "{nodes.find((n) => n.id === selected)?.label}" — {edges.filter((e) => e[0] === selected || e[1] === selected).length}{' '}
              связей в подсети.
            </p>
          </>
        )}

        {tab === 'feed' && (
          <>
            <div className={styles.weights}>
              {Object.entries(weights).map(([key, val]) => (
                <label key={key}>
                  <span>{key === 'fresh' ? 'Свежесть' : key === 'likes' ? 'Лайки' : 'Связь'}</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val * 100}
                    onChange={(e) =>
                      setWeights((w) => ({...w, [key]: Number(e.target.value) / 100}))
                    }
                  />
                </label>
              ))}
            </div>
            <ol className={styles.feed}>
              {ranked.map((p, i) => (
                <li key={p.id}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <strong>{p.author}</strong>: {p.text}
                  <span className={styles.score}>score {score(p, weights).toFixed(2)}</span>
                </li>
              ))}
            </ol>
          </>
        )}

        {tab === 'arch' && (
          <div className={styles.services}>
            {['API Gateway', 'Users', 'Posts', 'Feed', 'Media', 'Notify', 'Moderation'].map(
              (svc, i) => (
                <div key={svc} className={styles.svc} style={{animationDelay: `${i * 0.05}s`}}>
                  {svc}
                </div>
              ),
            )}
            <p className={styles.hint}>Запрос ленты: Gateway → Feed → Posts + Graph + Ranker → CDN для медиа.</p>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default SocialNetworkArchPlayInner;
