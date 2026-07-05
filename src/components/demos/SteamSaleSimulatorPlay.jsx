import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell from '@/components/shared/DemoShell';
import {
  CART_LIMIT,
  DEFAULT_STATE,
  REVIEW_LABELS,
  SALE_NAME,
  STARTING_WALLET,
  STEAM_GAMES,
  STORAGE_KEY,
  steamHeader,
} from '@/components/shared/kb/steamSaleData';
import styles from '@/components/demos/SteamSaleSimulatorPlay.module.css';

function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return {...DEFAULT_STATE, ...JSON.parse(raw)};
  } catch {
    return DEFAULT_STATE;
  }
}

function GameCard({game, owned, inCart, onAddCart, onAddWishlist}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardImageWrap}>
        <img
          src={steamHeader(game.appId)}
          alt={game.title}
          className={styles.cardImage}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/460x215/1b2838/66c0f4?text=${encodeURIComponent(game.title)}`;
          }}
        />
        {game.discount > 0 && <span className={styles.discountBadge}>-{game.discount}%</span>}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{game.title}</h3>
        <p className={styles.cardMeta}>
          {game.tags.slice(0, 3).join(' · ')} · {REVIEW_LABELS[game.reviewScore]}
        </p>
        <div className={styles.cardFooter}>
          <div>
            {game.discount > 0 && (
              <span className={styles.priceOriginal}>${game.originalPrice.toFixed(2)}</span>
            )}
            <span className={styles.priceSale}>
              {game.salePrice === 0 ? 'Бесплатно' : `$${game.salePrice.toFixed(2)}`}
            </span>
          </div>
          <div className={styles.cardActions}>
            {owned ? (
              <span className={styles.ownedLabel}>В библиотеке ✓</span>
            ) : inCart ? (
              <span className={styles.ownedLabel}>В корзине</span>
            ) : (
              <>
                <button
                  type="button"
                  className={styles.btnWishlist}
                  onClick={() => onAddWishlist(game)}
                  title="В список желаемого">
                  ♡
                </button>
                <button type="button" className={styles.btnCart} onClick={() => onAddCart(game)}>
                  В корзину
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function SteamSaleSimulatorPlayInner() {
  const [page, setPage] = useState('store');
  const [search, setSearch] = useState('');
  const [state, setState] = useState(loadState);
  const [toasts, setToasts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const simRef = useRef(null);
  const toastId = useRef(0);

  const ownedIds = useMemo(() => new Set(state.library.map((g) => g.id)), [state.library]);
  const cartIds = useMemo(() => new Set(state.cart.map((g) => g.id)), [state.cart]);
  const cartTotal = useMemo(
    () => state.cart.reduce((sum, g) => sum + g.salePrice, 0),
    [state.cart],
  );
  const cartSavings = useMemo(
    () => state.cart.reduce((sum, g) => sum + (g.originalPrice - g.salePrice), 0),
    [state.cart],
  );

  const filteredGames = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return STEAM_GAMES;
    return STEAM_GAMES.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [search]);

  const featured = useMemo(
    () => STEAM_GAMES.filter((g) => g.discount >= 50).slice(0, 4),
    [],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const pushToast = useCallback((message, type = 'info') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, {id, message, type}]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const addToCart = useCallback(
    (game) => {
      if (ownedIds.has(game.id)) {
        pushToast('Игра уже в библиотеке. Запускать не будем — так и задумано.', 'info');
        return false;
      }
      if (cartIds.has(game.id)) {
        pushToast('Уже в корзине', 'info');
        return false;
      }
      if (state.cart.length >= CART_LIMIT) {
        pushToast(`Корзина полна (${CART_LIMIT} игр). Пора покупать!`, 'sale');
        return false;
      }
      setState((s) => ({...s, cart: [...s.cart, game]}));
      pushToast(`«${game.title}» добавлена в корзину`, 'success');
      return true;
    },
    [cartIds, ownedIds, pushToast, state.cart.length],
  );

  const addToWishlist = useCallback(
    (game) => {
      if (ownedIds.has(game.id) || state.wishlist.some((w) => w.id === game.id)) return;
      setState((s) => ({
        ...s,
        wishlist: [...s.wishlist, game],
        stats: {...s.stats, wishlistAdds: s.stats.wishlistAdds + 1},
      }));
      pushToast(`«${game.title}» в списке желаемого (никогда не купим)`, 'info');
    },
    [ownedIds, pushToast, state.wishlist],
  );

  const checkout = useCallback(() => {
    if (state.cart.length === 0) {
      pushToast('Корзина пуста', 'info');
      return;
    }
    if (cartTotal > state.wallet) {
      pushToast('Недостаточно средств на кошельке Steam', 'info');
      return;
    }
    const now = Date.now();
    const newOwned = state.cart.map((game) => ({
      ...game,
      purchasedAt: now,
      hoursPlayed: 0,
    }));
    setState((s) => ({
      ...s,
      wallet: s.wallet - cartTotal,
      cart: [],
      library: [...s.library, ...newOwned],
      stats: {
        ...s.stats,
        totalSpent: s.stats.totalSpent + cartTotal,
        gamesPurchased: s.stats.gamesPurchased + newOwned.length,
        cartFillCount: s.stats.cartFillCount + 1,
      },
    }));
    pushToast(
      `Покупка завершена! ${newOwned.length} игр отправлены в библиотеку. Запускать не обязательно.`,
      'success',
    );
    setPage('library');
  }, [cartTotal, pushToast, state.cart, state.wallet]);

  const tryLaunchGame = useCallback(
    (game) => {
      pushToast(
        `Запуск «${game.title}» отменён. У вас есть Discord, TikTok и ещё ${state.library.length} непройденных игр.`,
        'info',
      );
    },
    [pushToast, state.library.length],
  );

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
    pushToast('Прогресс сброшен. Новая распродажа — новые необоснованные траты!', 'sale');
  }, [pushToast]);

  const runSimStep = useCallback(() => {
    setState((s) => {
      const owned = new Set(s.library.map((g) => g.id));
      const inCart = new Set(s.cart.map((g) => g.id));
      const available = STEAM_GAMES.filter((g) => !owned.has(g.id) && !inCart.has(g.id));

      if (available.length === 0 && s.cart.length === 0) {
        pushToast('Все игры куплены. Ни одна не запущена. Миссия выполнена.', 'sale');
        setIsSimulating(false);
        return s;
      }

      const roll = Math.random();

      if (s.cart.length >= CART_LIMIT || (s.cart.length > 0 && roll < 0.35)) {
        const total = s.cart.reduce((sum, g) => sum + g.salePrice, 0);
        if (total <= s.wallet && s.cart.length > 0) {
          const now = Date.now();
          const newOwned = s.cart.map((game) => ({
            ...game,
            purchasedAt: now,
            hoursPlayed: 0,
          }));
          pushToast(
            `🛒 Импульсивная покупка: ${newOwned.length} игр за $${total.toFixed(2)}. Играть — потом.`,
            'success',
          );
          return {
            ...s,
            wallet: s.wallet - total,
            cart: [],
            library: [...s.library, ...newOwned],
            stats: {
              ...s.stats,
              totalSpent: s.stats.totalSpent + total,
              gamesPurchased: s.stats.gamesPurchased + newOwned.length,
              cartFillCount: s.stats.cartFillCount + 1,
              impulseBuys: s.stats.impulseBuys + 1,
            },
          };
        }
      }

      if (available.length === 0) return s;

      const game = available[Math.floor(Math.random() * available.length)];

      if (roll < 0.15 && s.cart.length < CART_LIMIT) {
        pushToast(`«${game.title}» — скидка ${game.discount}%! В корзину!`, 'sale');
        return {...s, cart: [...s.cart, game]};
      }

      if (roll < 0.25) {
        const inWishlist = s.wishlist.some((w) => w.id === game.id);
        if (!inWishlist) {
          pushToast(`Добавили «${game.title}» в вишлист. Купим через 3 года.`, 'info');
          return {
            ...s,
            wishlist: [...s.wishlist, game],
            stats: {...s.stats, wishlistAdds: s.stats.wishlistAdds + 1},
          };
        }
      }

      if (s.cart.length < CART_LIMIT) {
        pushToast(`Смотрим обзор «${game.title}»... и сразу в корзину.`, 'sale');
        return {...s, cart: [...s.cart, game]};
      }

      return s;
    });
  }, [pushToast]);

  const startSimulator = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);
    pushToast('🤖 Симулятор типичного Steam-геймера активирован', 'sale');
    simRef.current = window.setInterval(runSimStep, 1800);
  }, [isSimulating, pushToast, runSimStep]);

  const stopSimulator = useCallback(() => {
    if (simRef.current) clearInterval(simRef.current);
    simRef.current = null;
    setIsSimulating(false);
    pushToast('Симулятор остановлен. Вы сами решите, что не играть.', 'info');
  }, [pushToast]);

  useEffect(() => () => {
    if (simRef.current) clearInterval(simRef.current);
  }, []);

  const fillCart = () => {
    setState((s) => {
      const owned = new Set(s.library.map((g) => g.id));
      const inCart = new Set(s.cart.map((g) => g.id));
      const next = [...s.cart];
      for (const game of STEAM_GAMES) {
        if (next.length >= CART_LIMIT) break;
        if (!owned.has(game.id) && !inCart.has(game.id)) {
          next.push(game);
          inCart.add(game.id);
        }
      }
      return {...s, cart: next};
    });
    pushToast(`Корзина заполнена (до ${CART_LIMIT} игр)`, 'sale');
    setPage('cart');
  };

  return (
    <DemoShell className={styles.shell} fullscreenable>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.saleStrip}>
            <span className={styles.saleBadge}>SALE</span>
            {SALE_NAME}
          </div>
          <div className={styles.headerInner}>
            <div className={styles.logo}>STEAM</div>
            <nav className={styles.nav}>
              {[
                {id: 'store', label: 'Магазин'},
                {id: 'library', label: 'Библиотека', badge: state.library.length || null},
                {id: 'wishlist', label: 'Желаемое', badge: state.wishlist.length || null},
                {id: 'cart', label: 'Корзина', badge: state.cart.length || null},
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={clsx(styles.navBtn, page === item.id && styles.navActive)}
                  onClick={() => setPage(item.id)}>
                  {item.label}
                  {item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
                </button>
              ))}
            </nav>
            <div className={styles.wallet}>
              <span className={styles.walletLabel}>Кошелёк</span>
              <span className={styles.walletValue}>${state.wallet.toFixed(2)}</span>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {page === 'store' && (
            <>
              <div className={styles.hero}>
                <h2 className={styles.heroTitle}>{SALE_NAME}</h2>
                <p className={styles.heroText}>
                  Учебный симулятор: покупайте игры со скидкой, заполняйте корзину и библиотеку — запускать необязательно.
                </p>
                <div className={styles.heroActions}>
                  <button type="button" className={styles.btnPrimary} onClick={fillCart}>
                    Заполнить корзину
                  </button>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => setSearch('Indie')}>
                    Indie за $2
                  </button>
                </div>
              </div>
              <h2 className={styles.pageTitle}>Рекомендуемые</h2>
              <div className={styles.grid} style={{marginBottom: '1rem'}}>
                {featured.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    owned={ownedIds.has(game.id)}
                    inCart={cartIds.has(game.id)}
                    onAddCart={addToCart}
                    onAddWishlist={addToWishlist}
                  />
                ))}
              </div>
              <input
                className={styles.search}
                placeholder="Поиск по названию или тегу…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className={styles.grid}>
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    owned={ownedIds.has(game.id)}
                    inCart={cartIds.has(game.id)}
                    onAddCart={addToCart}
                    onAddWishlist={addToWishlist}
                  />
                ))}
              </div>
            </>
          )}

          {page === 'cart' && (
            <>
              <h2 className={styles.pageTitle}>Корзина</h2>
              {state.cart.length === 0 ? (
                <div className={styles.empty}>Корзина пуста. Распродажа ждёт.</div>
              ) : (
                <div className={styles.cartLayout}>
                  <div>
                    {state.cart.map((game) => (
                      <div key={game.id} className={styles.cartItem}>
                        <img src={steamHeader(game.appId)} alt={game.title} />
                        <div style={{flex: 1}}>
                          <strong>{game.title}</strong>
                          <p className={styles.cardMeta}>{game.tags.join(' · ')}</p>
                          <span className={styles.priceSale}>${game.salePrice.toFixed(2)}</span>
                        </div>
                        <button
                          type="button"
                          className={styles.btnRemove}
                          onClick={() =>
                            setState((s) => ({
                              ...s,
                              cart: s.cart.filter((g) => g.id !== game.id),
                            }))
                          }>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <aside className={styles.cartSummary}>
                    <div className={styles.summaryRow}>
                      <span>Итого</span>
                      <span className={styles.summaryTotal}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>Экономия</span>
                      <span>${cartSavings.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.btnCheckout}
                      disabled={cartTotal > state.wallet}
                      onClick={checkout}>
                      {cartTotal > state.wallet ? 'Недостаточно средств' : 'Купить'}
                    </button>
                  </aside>
                </div>
              )}
            </>
          )}

          {page === 'library' && (
            <>
              <h2 className={styles.pageTitle}>Библиотека</h2>
              <div className={styles.libraryStats}>
                <span>
                  Игр: <strong>{state.library.length}</strong>
                </span>
                <span>
                  Часов сыграно: <strong>0</strong>
                </span>
                <span>
                  Потрачено: <strong>${state.stats.totalSpent.toFixed(2)}</strong>
                </span>
              </div>
              {state.library.length === 0 ? (
                <div className={styles.empty}>Библиотека пуста. Сначала купите, потом не играйте.</div>
              ) : (
                state.library.map((game) => (
                  <div key={game.id} className={styles.libraryItem}>
                    <div>
                      <strong>{game.title}</strong>
                      <p className={styles.cardMeta}>0 ч. · куплена, не запускалась</p>
                    </div>
                    <button type="button" className={styles.btnPlay} onClick={() => tryLaunchGame(game)}>
                      ИГРАТЬ
                    </button>
                  </div>
                ))
              )}
            </>
          )}

          {page === 'wishlist' && (
            <>
              <h2 className={styles.pageTitle}>Список желаемого</h2>
              {state.wishlist.length === 0 ? (
                <div className={styles.empty}>Вишлист пуст. Добавьте игры «на потом».</div>
              ) : (
                <div className={styles.grid}>
                  {state.wishlist.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      owned={ownedIds.has(game.id)}
                      inCart={cartIds.has(game.id)}
                      onAddCart={addToCart}
                      onAddWishlist={addToWishlist}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <p className={styles.hint}>
            Демо показывает типичное поведение на распродаже: корзина, импульсивные покупки, библиотека без запусков.
            Кошелёк: ${STARTING_WALLET}, лимит корзины: {CART_LIMIT} игр.
          </p>
        </main>

        <aside className={styles.simulator}>
          <div className={styles.simHeader}>
            <span aria-hidden>🤖</span>
            <div>
              <h3>Симулятор распродажи</h3>
              <p>Авто-режим: корзина → покупка → забвение</p>
            </div>
          </div>
          <div className={styles.simStats}>
            <div className={styles.simStat}>
              <span>Корзина</span>
              <strong>
                {state.cart.length}/{CART_LIMIT}
              </strong>
            </div>
            <div className={styles.simStat}>
              <span>Куплено</span>
              <strong>{state.library.length}</strong>
            </div>
            <div className={styles.simStat}>
              <span>Потрачено</span>
              <strong>${state.stats.totalSpent.toFixed(2)}</strong>
            </div>
            <div className={styles.simStat}>
              <span>Импульс. покупки</span>
              <strong>{state.stats.impulseBuys}</strong>
            </div>
            <div className={styles.simStat}>
              <span>Вишлист</span>
              <strong>{state.stats.wishlistAdds}</strong>
            </div>
          </div>
          <div className={styles.simActions}>
            {!isSimulating ? (
              <button type="button" className={styles.btnSimStart} onClick={startSimulator}>
                ▶ Запустить симулятор
              </button>
            ) : (
              <button type="button" className={styles.btnSimStop} onClick={stopSimulator}>
                ⏹ Остановить
              </button>
            )}
            <button type="button" className={styles.btnSimReset} onClick={resetAll}>
              ↺ Сбросить
            </button>
          </div>
          {isSimulating && (
            <div className={styles.simLive}>
              <span className={styles.pulseDot} />
              Симулируем типичное поведение…
            </div>
          )}
        </aside>

        <div className={styles.toastStack}>
          {toasts.map((t) => (
            <div
              key={t.id}
              className={clsx(
                styles.toast,
                t.type === 'success' && styles.toastSuccess,
                t.type === 'sale' && styles.toastSale,
              )}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </DemoShell>
  );
}

export default SteamSaleSimulatorPlayInner;
