import React, {useCallback, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/MemcachedCachePlay.module.css';

const BACKEND = {
  'user:profile:42': {name: 'Мария С.', role: 'analyst', city: 'Москва'},
  'page:home': {blocks: ['banner', 'news', 'footer'], updated: '2026-05-20'},
};

const MAX_SLOTS = 4;

function MemcachedCachePlayInner() {
  const [cache, setCache] = useState({});
  const [order, setOrder] = useState([]);
  const [key, setKey] = useState('user:profile:42');
  const [ttl, setTtl] = useState(60);
  const [lastHit, setLastHit] = useState(null);
  const [log, setLog] = useState(['Memcached :11211 · cache-aside готов']);

  const append = (line) => setLog((prev) => [...prev.slice(-8), line]);

  const evictIfNeeded = useCallback((nextOrder, nextCache) => {
    if (nextOrder.length <= MAX_SLOTS) return {order: nextOrder, cache: nextCache};
    const victim = nextOrder[0];
    const o = nextOrder.slice(1);
    const c = {...nextCache};
    delete c[victim];
    append(`EVICT ${victim} (LRU, лимит ${MAX_SLOTS} ключей)`);
    return {order: o, cache: c};
  }, []);

  const doGet = () => {
    if (cache[key]) {
      setLastHit(true);
      append(`GET ${key} → HIT (${cache[key].bytes} B)`);
      setOrder((o) => [...o.filter((k) => k !== key), key]);
      return;
    }
    setLastHit(false);
    append(`GET ${key} → MISS`);
    if (BACKEND[key]) {
      append(`→ SQL/backend 28 ms`);
      const value = JSON.stringify(BACKEND[key]);
      setCache((c) => {
        const next = {...c, [key]: {value, bytes: value.length, ttl}};
        const ord = [...order.filter((k) => k !== key), key];
        const {order: o, cache: nc} = evictIfNeeded(ord, next);
        setOrder(o);
        return nc;
      });
      append(`SET ${key} TTL=${ttl}`);
    } else {
      append(`→ backend: ключ не найден`);
    }
  };

  const doDelete = () => {
    setCache((c) => {
      const next = {...c};
      delete next[key];
      return next;
    });
    setOrder((o) => o.filter((k) => k !== key));
    append(`DELETE ${key}`);
    setLastHit(null);
  };

  return (
    <DemoShell>
      <DemoCard
        title="Memcached: cache-aside и LRU"
        subtitle="Не БД, а буфер латентности: GET → при промахе backend → SET с TTL; при переполнении вытесняется старый ключ"
      >
        <div className="it-demo__grid it-demo__grid--2" style={{marginBottom: '0.65rem'}}>
          <div>
            <label className="it-demo__label">Ключ</label>
            <input
              className="it-demo__input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div>
            <label className="it-demo__label">TTL (сек)</label>
            <input
              className="it-demo__input"
              type="number"
              min={1}
              max={3600}
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value) || 60)}
            />
          </div>
        </div>

        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
          <button type="button" className="it-demo__btn it-demo__btn--primary" onClick={doGet}>
            GET
          </button>
          <button type="button" className="it-demo__btn it-demo__btn--secondary" onClick={doDelete}>
            DELETE
          </button>
        </div>

        {lastHit !== null && (
          <div
            className={clsx(styles.hitBanner, lastHit ? styles.hit : styles.miss)}
            style={{marginTop: '0.65rem'}}
          >
            {lastHit ? 'Cache HIT — backend не вызывался' : 'Cache MISS — данные подгружены с backend'}
          </div>
        )}

        <div className={styles.diagram}>
          <div className={clsx(styles.node, lastHit === false && styles.nodeActive)}>
            <strong>Приложение</strong>
            <p style={{margin: '0.35rem 0 0', fontSize: '0.78rem'}}>cache-aside</p>
          </div>
          <span aria-hidden style={{alignSelf: 'center'}}>
            ⇄
          </span>
          <div className={clsx(styles.node, styles.nodeActive)}>
            <strong>Memcached</strong>
            <span className="it-demo__badge">:11211</span>
            <div className={styles.hashTable}>
              {order.length === 0 ? (
                <div className={styles.slot}>пусто</div>
              ) : (
                order.map((k) => (
                  <div key={k} className={styles.slot}>
                    {k} ({cache[k]?.bytes} B)
                  </div>
                ))
              )}
            </div>
          </div>
          <span aria-hidden style={{alignSelf: 'center'}}>
            →
          </span>
          <div className={clsx(styles.node, lastHit === false && styles.nodeActive)}>
            <strong>Backend / SQL</strong>
            <p style={{margin: '0.35rem 0 0', fontSize: '0.78rem'}}>источник истины</p>
          </div>
        </div>

        <div className={styles.log}>
          {log.map((line, i) => (
            <div key={`${line}-${i}`}>{line}</div>
          ))}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default MemcachedCachePlayInner;
