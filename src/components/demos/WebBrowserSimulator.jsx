import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import DesktopAppChrome from '@/components/shared/kb/DesktopAppChrome';
import styles from '@/components/demos/WebBrowserSimulator.module.css';

const PAGES = {
  home: {
    title: 'Вселенная IT',
    url: 'https://spirzen.ru/',
    body: (
      <>
        <h3>Энциклопедия для изучения IT</h3>
        <p>Статьи, интерактивные демо и разделы от основ до архитектуры.</p>
        <ul>
          <li>Основы и софт пользователя</li>
          <li>Разработка и инфраструктура</li>
          <li>ИИ и проектная работа</li>
        </ul>
      </>
    ),
  },
  search: {
    title: 'Поиск — как устроен DNS',
    url: 'https://www.google.com/search?q=как+устроен+dns',
    body: (
      <>
        <p className={styles.searchMeta}>Результаты по запросу "как устроен dns"</p>
        <div className={styles.result}>
          <strong>DNS — система доменных имён</strong>
          <span>encyclopedia.example/dns</span>
          <p>Преобразует имена хостов в IP-адреса…</p>
        </div>
      </>
    ),
  },
  settings: {
    title: 'Настройки',
    url: 'chrome://settings',
    body: (
      <ul className={styles.settings}>
        <li>Приватность и безопасность</li>
        <li>Расширения</li>
        <li>Загрузки</li>
      </ul>
    ),
  },
};

function resolvePage(input) {
  const t = input.trim().toLowerCase();
  if (!t) return 'home';
  if (t.includes('settings') || t.startsWith('chrome://')) return 'settings';
  if (t.includes(' ') || (!t.includes('.') && !t.startsWith('http'))) return 'search';
  return 'home';
}

export function WebBrowserSimulatorInner({compact}) {
  const [tabs, setTabs] = useState([{id: 1, input: 'spirzen.ru', page: 'home'}]);
  const [activeId, setActiveId] = useState(1);
  const [bookmarks, setBookmarks] = useState(['spirzen.ru']);

  const active = tabs.find((t) => t.id === activeId) || tabs[0];
  const page = PAGES[active.page];

  const navigate = (input) => {
    const pageKey = resolvePage(input);
    setTabs((prev) =>
      prev.map((t) => (t.id === activeId ? {...t, input, page: pageKey} : t)),
    );
  };

  const addTab = () => {
    const id = Math.max(...tabs.map((t) => t.id), 0) + 1;
    setTabs((prev) => [...prev, {id, input: 'spirzen.ru', page: 'home'}]);
    setActiveId(id);
  };

  const chrome = (
    <DesktopAppChrome
      title="Веб-браузер (симулятор)"
      accent="#1a73e8"
      toolbar={
        <>
          <button type="button" onClick={() => navigate(active.input)} title="Назад">
            ←
          </button>
          <button type="button" onClick={() => navigate(active.input)} title="Вперёд">
            →
          </button>
          <button type="button" onClick={() => navigate(active.input)}>
            ↻
          </button>
          <input
            className={styles.url}
            value={active.input}
            onChange={(e) =>
              setTabs((prev) =>
                prev.map((t) => (t.id === activeId ? {...t, input: e.target.value} : t)),
              )
            }
            onKeyDown={(e) => e.key === 'Enter' && navigate(active.input)}
          />
          <button type="button" onClick={addTab}>
            + Вкладка
          </button>
        </>
      }
      status={
        <>
          {page.url} · Закладки: {bookmarks.join(', ')}
        </>
      }
    >
      <div className={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={clsx(styles.tab, t.id === activeId && styles.tabActive)}
            onClick={() => setActiveId(t.id)}
          >
            {PAGES[t.page].title}
          </button>
        ))}
      </div>
      <div className={styles.page}>
        {page.body}
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() =>
              setBookmarks((prev) =>
                prev.includes(active.input) ? prev : [...prev, active.input],
              )
            }
          >
            ☆ В закладки
          </button>
          <button type="button" onClick={() => navigate('chrome://settings')}>
            Настройки
          </button>
        </div>
      </div>
    </DesktopAppChrome>
  );

  if (compact) return chrome;

  return (
    <DemoShell>
      <DemoCard
        title="Симулятор веб-браузера"
        subtitle="Вкладки, адресная строка, поиск и закладки — без выхода в сеть"
      >
        {chrome}
        <p className={styles.hint}>
          Строка без пробелов обычно открывает сайт; текст с пробелами браузер отправляет в поиск.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default WebBrowserSimulatorInner;
