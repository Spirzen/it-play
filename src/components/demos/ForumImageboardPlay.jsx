import React, {useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/ForumImageboardPlay.module.css';

const MODES = {
  forum: {
    label: 'Веб-форум',
    traits: [
      'Регистрация и профиль',
      'Раздел → тема → посты',
      'Долгоживущие ветки',
      'Карма / репутация',
      'Модерация и баны',
    ],
    posts: [
      {id: 1, author: 'user_42', role: 'Пользователь', text: 'Как настроить VPN на роутере?', time: '2 ч назад', sticky: false},
      {id: 2, author: 'mod_Alex', role: 'Модератор', text: 'Перенёс в подраздел "Сети". Добавьте модель роутера.', time: '1 ч назад', sticky: false},
      {id: 3, author: 'admin', role: 'Админ', text: 'Правила раздела обновлены — см. закреп.', time: 'вчера', sticky: true},
    ],
  },
  imageboard: {
    label: 'Имиджборд',
    traits: [
      'Анонимные номера постов',
      'Тред = OP + ответы',
      'Лимит бампов → архив',
      'Картинка обязательна в OP',
      'Минимум профилей и лайков',
    ],
    posts: [
      {id: 1, author: '№4829103', role: 'OP', text: '[img] Скрин ошибки ядра — что за паника?', time: 'бамп 1/300', sticky: true},
      {id: 2, author: '№4829155', role: '', text: 'проверь dmesg, похоже на OOM', time: '', sticky: false},
      {id: 3, author: '№4829201', role: '', text: '>>4829155 спасибо, помогло', time: '', sticky: false},
    ],
  },
};

function ForumImageboardPlayInner() {
  const [mode, setMode] = useState('forum');
  const [bumpCount, setBumpCount] = useState(12);
  const cfg = MODES[mode];
  const limit = 300;
  const nearArchive = mode === 'imageboard' && bumpCount > limit - 20;

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Форум vs имиджборд"
        subtitle="Переключите модель — сравните структуру, идентичность и жизненный цикл треда"
      >
        <div className="it-demo__tabs">
          {Object.entries(MODES).map(([id, m]) => (
            <button
              key={id}
              type="button"
              className={clsx('it-demo__tab', mode === id && 'it-demo__tab--active')}
              onClick={() => setMode(id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <ul className={styles.traits}>
          {cfg.traits.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        {mode === 'imageboard' && (
          <label className={styles.bump}>
            Бампов в треде: <strong>{bumpCount}</strong> / {limit}
            <input
              type="range"
              min={1}
              max={limit}
              value={bumpCount}
              onChange={(e) => setBumpCount(Number(e.target.value))}
            />
            {nearArchive && (
              <span className={styles.warn}>Тред скоро уйдёт в архив — нужен новый бамп</span>
            )}
          </label>
        )}

        <div className={styles.mock} aria-label="Макет ленты постов">
          {cfg.posts.map((p) => (
            <article
              key={p.id}
              className={clsx(styles.post, p.sticky && styles.postSticky)}
            >
              <header>
                <strong>{p.author}</strong>
                {p.role && <span className={styles.role}>{p.role}</span>}
                {p.time && <time>{p.time}</time>}
              </header>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <p className={styles.hint}>
          {mode === 'forum'
            ? 'Форум хранит историю и идентичность — удобен для длинных дискуссий и экспертизы.'
            : 'Имиджборд ускоряет обмен картинками и шутками, но треды эфемерны — культура "высказал и забыл".'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default ForumImageboardPlayInner;
