import React, {useState} from 'react';
import clsx from 'clsx';
import {PlayRoot, styles} from '@/components/shared/dataMarkupPlayKit';

const RULES = [
  {id: 0, name: 'Фундамент', pg: 'SQL над таблицами, catalog в pg_catalog'},
  {id: 1, name: 'Реляционная модель', pg: 'Таблицы = relations, SQL SELECT'},
  {id: 2, name: 'Распределённость', pg: 'Частично — FDW, logical replication'},
  {id: 3, name: 'Независимость от размещения', pg: 'TABLESPACE, но приложение не знает путь'},
  {id: 4, name: 'Администрирование через SQL', pg: 'CREATE ROLE, GRANT — да'},
  {id: 5, name: 'Полнота SQL', pg: 'JOIN, VIEW, CTE — высокая'},
  {id: 6, name: 'Обновление VIEW', pg: 'Updatable views с ограничениями'},
  {id: 7, name: 'Высокоуровневые INSERT/UPDATE/DELETE', pg: 'Да'},
  {id: 8, name: 'Физическая независимость', pg: 'VACUUM, index — без правки приложения'},
  {id: 9, name: 'Логическая независимость', pg: 'VIEW / column add nullable'},
  {id: 10, name: 'Целостность в языке', pg: 'PK, FK, CHECK, NOT NULL'},
  {id: 11, name: 'Независимость от распределения', pg: 'Ограничена — sharding вне ядра'},
  {id: 12, name: 'Запрет подъязыков', pg: 'SQL + процедуры PL/pgSQL'},
];

export default function CoddRulesCheckerPlay() {
  const [open, setOpen] = useState(0);

  return (
    <PlayRoot title="12 правил Кодда" subtitle="Чек-лист «настоящей» реляционной СУБД — пример PostgreSQL">
      {RULES.map((r) => (
        <button
          key={r.id}
          type="button"
          className={clsx(styles.quizOption, open === r.id && styles.quizOptionGood)}
          onClick={() => setOpen(r.id)}
        >
          <strong>{r.id}.</strong> {r.name}
        </button>
      ))}
      <p className="it-demo__hint">{RULES[open].pg}</p>
    </PlayRoot>
  );
}
