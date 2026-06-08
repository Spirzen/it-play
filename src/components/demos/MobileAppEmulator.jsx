import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  DEFAULT_TODOS,
  LEARN_CARDS,
  TABS,
  loadStored,
  saveStored,
} from '@/components/shared/kb/mobileAppEngine';
import styles from '@/components/demos/MobileAppEmulator.module.css';

const STORAGE_COUNT = 'it-demo-mobile-count';
const STORAGE_TODOS = 'it-demo-mobile-todos';
const STORAGE_DARK = 'it-demo-mobile-dark';

function MobileAppEmulatorInner() {
  const [activeTab, setActiveTab] = useState('home');
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(DEFAULT_TODOS);
  const [newTodo, setNewTodo] = useState('');
  const [dark, setDark] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    setCount(loadStored(STORAGE_COUNT, 0));
    setTodos(loadStored(STORAGE_TODOS, DEFAULT_TODOS));
    setDark(loadStored(STORAGE_DARK, false));
  }, []);

  useEffect(() => {
    saveStored(STORAGE_COUNT, count);
  }, [count]);

  useEffect(() => {
    saveStored(STORAGE_TODOS, todos);
  }, [todos]);

  useEffect(() => {
    saveStored(STORAGE_DARK, dark);
  }, [dark]);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    setTodos((list) => [...list, {id: String(Date.now()), text, done: false}]);
    setNewTodo('');
  };

  const toggleTodo = (id) => {
    setTodos((list) => list.map((t) => (t.id === id ? {...t, done: !t.done} : t)));
  };

  const removeTodo = (id) => {
    setTodos((list) => list.filter((t) => t.id !== id));
  };

  const titles = {
    home: 'Счётчик',
    tasks: 'Задачи',
    learn: 'Концепции',
    about: 'О приложении',
  };

  return (
    <DemoShell className={styles.wrap}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className="it-demo__btn it-demo__btn--sm"
          onClick={() => setDark((d) => !d)}
        >
          {dark ? '☀️ Светлая' : '🌙 Тёмная'}
        </button>
        <button type="button" className="it-demo__btn it-demo__btn--sm it-demo__btn--secondary" onClick={() => setCount(0)}>
          Сброс счётчика
        </button>
      </div>

      <div className={styles.phone}>
        <div className={styles.notch} aria-hidden />
        <div className={clsx(styles.screen, dark && styles.screenDark)}>
          <div className={styles.statusBar}>
            <span>{time || '12:00'}</span>
            <span>📶 🔋 98%</span>
          </div>

          <header className={styles.appHeader}>
            <h2 className={styles.appTitle}>{titles[activeTab]}</h2>
          </header>

          <main className={styles.content}>
            {activeTab === 'home' && (
              <section className={styles.counter}>
                <div className={styles.counterValue}>{count}</div>
                <p className={styles.counterHint}>Значение сохраняется в localStorage</p>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.btnPrimary} onClick={() => setCount((c) => c + 1)}>
                    +1
                  </button>
                  <button type="button" className={styles.btnDanger} onClick={() => setCount((c) => c - 1)}>
                    −1
                  </button>
                  <button type="button" className={styles.btnGhost} onClick={() => setCount(0)}>
                    Сброс
                  </button>
                </div>
              </section>
            )}

            {activeTab === 'tasks' && (
              <>
                <ul className={styles.todoList}>
                  {todos.map((t) => (
                    <li key={t.id} className={styles.todoItem}>
                      <input
                        type="checkbox"
                        className={styles.todoCheck}
                        checked={t.done}
                        onChange={() => toggleTodo(t.id)}
                        aria-label={`Отметить: ${t.text}`}
                      />
                      <span className={clsx(styles.todoText, t.done && styles.todoDone)}>{t.text}</span>
                      <button type="button" className={styles.todoDel} onClick={() => removeTodo(t.id)} aria-label="Удалить">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className={styles.addRow}>
                  <input
                    className={styles.addInput}
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Новая задача…"
                  />
                  <button type="button" className={styles.btnPrimary} onClick={addTodo}>
                    +
                  </button>
                </div>
              </>
            )}

            {activeTab === 'learn' &&
              LEARN_CARDS.map((card) => (
                <article key={card.title} className={styles.learnCard}>
                  <h4>{card.title}</h4>
                  <p>{card.body}</p>
                </article>
              ))}

            {activeTab === 'about' && (
              <div className={styles.aboutText}>
                <p>Эмулятор экрана смартфона в статье энциклопедии.</p>
                <ul>
                  <li>Навигация по вкладкам (как TabBar в React Native)</li>
                  <li>Локальное состояние и персистентность</li>
                  <li>Светлая и тёмная тема внутри "приложения"</li>
                  <li>Адаптивная вёрстка без полноэкранного 100vh</li>
                </ul>
              </div>
            )}
          </main>

          <nav className={styles.tabBar} aria-label="Навигация приложения">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={clsx(styles.tab, activeTab === tab.id && styles.tabActive)}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon} aria-hidden>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
          <div className={styles.homeIndicator} aria-hidden />
        </div>
      </div>

      <p className={styles.hint}>
        Попробуйте переключить тему, изменить счётчик и обновить страницу — данные останутся в браузере, как в
        настоящем мобильном приложении с локальным хранилищем.
      </p>
    </DemoShell>
  );
}

export default MobileAppEmulatorInner;
