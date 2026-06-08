import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import styles from '@/components/demos/CreatorRolesPlay.module.css';

const ROLES = [
  {id: 'blogger', label: 'Блогер', group: 'producer', desc: 'Регулярные публикации, узнаваемый авторский голос'},
  {id: 'streamer', label: 'Стример', group: 'producer', desc: 'Live + чат, синхронная обратная связь'},
  {id: 'micro', label: 'Микроблогер', group: 'producer', desc: 'Короткие посты, быстрая реакция на тренды'},
  {id: 'commenter', label: 'Комментатор', group: 'consumer', desc: 'Обсуждение чужого контента, модерация тона'},
  {id: 'lurker', label: 'Луркер', group: 'consumer', desc: 'Потребление без публикации — "тихое большинство"'},
  {id: 'donor', label: 'Донатер', group: 'economic', desc: 'Монетизация внимания через донаты и подписки'},
  {id: 'mod', label: 'Модератор чата', group: 'transform', desc: 'Регуляция общения, фильтр токсичности'},
  {id: 'remixer', label: 'Ремиксер', group: 'transform', desc: 'Пересборка мемов, фан-арт, пародии'},
];

const GROUPS = {
  producer: {label: 'Производитель', color: '#5c6bc0'},
  consumer: {label: 'Потребитель', color: '#26a69a'},
  economic: {label: 'Экономика', color: '#f59e0b'},
  transform: {label: 'Трансформация', color: '#ab47bc'},
};

function CreatorRolesPlayInner() {
  const [selected, setSelected] = useState(['streamer', 'mod']);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const activeRoles = useMemo(
    () => ROLES.filter((r) => selected.includes(r.id)),
    [selected],
  );

  const groupsUsed = useMemo(
    () => [...new Set(activeRoles.map((r) => r.group))],
    [activeRoles],
  );

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Роли в интернет-культуре"
        subtitle="Соберите набор ролей одного участника — в реальности они часто совмещаются"
      >
        <div className={styles.chips}>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={clsx(styles.chip, selected.includes(r.id) && styles.chipOn)}
              style={
                selected.includes(r.id)
                  ? {'--c': GROUPS[r.group].color}
                  : undefined
              }
              onClick={() => toggle(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        {activeRoles.length === 0 ? (
          <p className={styles.empty}>Выберите хотя бы одну роль</p>
        ) : (
          <ul className={styles.list}>
            {activeRoles.map((r) => (
              <li key={r.id}>
                <span
                  className={styles.badge}
                  style={{background: GROUPS[r.group].color}}
                >
                  {GROUPS[r.group].label}
                </span>
                <strong>{r.label}</strong> — {r.desc}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.summary}>
          {groupsUsed.length >= 3
            ? 'Гибридная идентичность: вы одновременно создаёте, потребляете и регулируете контент.'
            : groupsUsed.length === 2
              ? 'Двойная роль типична: например, стример + модератор своего чата.'
              : 'Одна доминирующая функция — но контекст платформы может добавить вторую.'}
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default CreatorRolesPlayInner;
