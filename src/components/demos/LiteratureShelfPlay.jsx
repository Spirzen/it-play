import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const CATEGORIES = [
  {id: 'all', label: 'Все'},
  {id: 'craft', label: 'Инженерия'},
  {id: 'lang', label: 'Языки'},
  {id: 'data', label: 'Данные'},
  {id: 'ops', label: 'DevOps'},
  {id: 'soft', label: 'Софт-скиллы'},
];

const BOOKS = [
  {id: 'clean-code', title: 'Чистый код', author: 'Роберт Мартин', cat: 'craft', level: 'middle', note: 'Именование, функции, тесты — база культуры кода.'},
  {id: 'clean-arch', title: 'Чистая архитектура', author: 'Роберт Мартин', cat: 'craft', level: 'middle', note: 'Слои, зависимости, границы модулей.'},
  {id: 'gof', title: 'Паттерны ООП (GoF)', author: 'Гамма и др.', cat: 'craft', level: 'middle', note: 'Классика; читать после практики, не до.'},
  {id: 'head-first', title: 'Head First. Паттерны', author: 'Фримен, Робсон', cat: 'craft', level: 'beginner', note: 'Мягкий вход в паттерны с визуализацией.'},
  {id: 'ddia', title: 'Высоконагруженные приложения', author: 'Мартин Клеппман', cat: 'data', level: 'advanced', note: 'Хранилища, репликация, потоки — must-read для backend.'},
  {id: 'sql-shields', title: 'SQL. Быстрое погружение', author: 'Уолтер Шилдс', cat: 'data', level: 'beginner', note: 'Практичный SQL без академизма.'},
  {id: 'pro-git', title: 'Git для профессионалиста', author: 'Чакон, Штрауб', cat: 'craft', level: 'middle', note: 'Ветки, rebase, workflow — дополняет Pro Git онлайн.'},
  {id: 'microservices', title: 'Создание микросервисов', author: 'Сэм Ньюмен', cat: 'ops', level: 'middle', note: 'Когда дробить монолит и какие компромиссы.'},
  {id: 'docker', title: 'Docker без секретов', author: 'Сайбал Гош', cat: 'ops', level: 'beginner', note: 'Контейнеры с нуля на русском.'},
  {id: 'ilyahov', title: 'Пиши, сокращай', author: 'Ильяхов, Сарычева', cat: 'soft', level: 'beginner', note: 'Ясные тексты — и для документации, и для тикетов.'},
  {id: 'tanenbaum-net', title: 'Компьютерные сети', author: 'Таненбаум', cat: 'ops', level: 'middle', note: 'Теория сетей; параллельно с разделом энциклопедии.'},
  {id: 'python-pavlov', title: 'Знакомьтесь, Python', author: 'Евгений Павлов', cat: 'lang', level: 'beginner', note: 'Профессиональные приёмы после синтаксиса.'},
];

const LEVEL_LABEL = {beginner: 'новичок', middle: 'средний', advanced: 'продвинутый'};

function LiteratureShelfPlayInner() {
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('clean-code');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOOKS.filter((b) => {
      if (cat !== 'all' && b.cat !== cat) return false;
      if (!q) return true;
      const hay = `${b.title} ${b.author} ${b.note}`.toLowerCase();
      return hay.includes(q);
    });
  }, [cat, query]);

  const book = BOOKS.find((b) => b.id === picked) ?? filtered[0] ?? BOOKS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Полка книг"
        subtitle="Фильтр по теме и поиск — подборка из статьи, не полный каталог"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="Автор, название, тема…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по книгам"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(toolStyles.chip, cat === c.id && toolStyles.chipActive)}
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree} aria-label="Список книг">
            {filtered.length === 0 ? (
              <li style={{padding: '0.5rem', fontSize: '0.8rem', opacity: 0.8}}>Ничего не найдено</li>
            ) : (
              filtered.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === b.id && styles.treeItemActive)}
                    onClick={() => setPicked(b.id)}
                  >
                    <span>{b.title}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{book.title}</h4>
            <p className={styles.detailRole}>
              {book.author} · уровень: {LEVEL_LABEL[book.level]}
            </p>
            <p>{book.note}</p>
            <p className={styles.mono} style={{fontSize: '0.72rem', marginTop: '0.5rem'}}>
              Совет: одна книга на спринт + заметки в базе знаний, а не "прочитать всё".
            </p>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LiteratureShelfPlayInner;
