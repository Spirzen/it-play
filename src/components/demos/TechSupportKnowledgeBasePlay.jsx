import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {KB_COMPONENTS, searchKb} from '@/components/shared/kb/techSupportEngines';
import styles from '@/components/shared/kb/techSupportDemo.module.css';

const SAMPLE_QUERIES = [
  'не могу войти пароль',
  'форма не отправляется',
  'оплата не прошла',
  'система медленно',
];

function TechSupportKnowledgeBasePlayInner() {
  const [query, setQuery] = useState('не могу войти');
  const [activeComponent, setActiveComponent] = useState('search');
  const results = useMemo(() => searchKb(query), [query]);
  const top = results[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="База знаний и типовые запросы"
        subtitle="Поиск статей, самообслуживание и структура KB"
      >
        <p className="it-demo__label">Компоненты базы знаний</p>
        <div className={styles.grid2}>
          {KB_COMPONENTS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={clsx(styles.card, activeComponent === c.id && styles.cardActive)}
              onClick={() => setActiveComponent(c.id)}
            >
              <span className={styles.cardIcon}>{c.icon}</span>
              <span className={styles.cardLabel}>{c.label}</span>
            </button>
          ))}
        </div>

        <label className="it-demo__label">Запрос пользователя</label>
        <input
          type="search"
          className="it-demo__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Опишите проблему…"
          style={{width: '100%', marginBottom: '0.45rem'}}
        />
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem'}}>
          {SAMPLE_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              className="it-demo__btn it-demo__btn--secondary"
              style={{fontSize: '0.72rem', padding: '0.25rem 0.5rem'}}
              onClick={() => setQuery(q)}
            >
              {q}
            </button>
          ))}
        </div>

        {top ? (
          <div className={styles.detailBox}>
            <p className={styles.detailTitle}>✓ {top.title}</p>
            <p className={styles.detailText}>{top.solve}</p>
            <p className={styles.detailText} style={{marginTop: '0.35rem'}}>
              Релевантность: {top.score} · L1 может отправить ссылку без эскалации
            </p>
          </div>
        ) : (
          <p className="it-demo__hint">Совпадений нет — тикет уходит на диагностику L1/L2.</p>
        )}

        {results.length > 1 && (
          <ul className={styles.cardList} style={{marginTop: '0.5rem'}}>
            {results.slice(1, 4).map((r) => (
              <li key={r.id}>
                {r.title} (score {r.score})
              </li>
            ))}
          </ul>
        )}

        <p className="it-demo__label" style={{marginTop: '0.75rem'}}>
          Типовые запросы из статьи
        </p>
        <table style={{width: '100%', fontSize: '0.72rem', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th style={{textAlign: 'left', padding: '0.25rem'}}>Категория</th>
              <th style={{textAlign: 'left', padding: '0.25rem'}}>Запрос</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Авторизация', 'Не могу войти'],
              ['Формы', 'Форма не отправляется'],
              ['Оплата', 'Не прошла оплата'],
            ].map(([cat, q]) => (
              <tr key={cat}>
                <td style={{padding: '0.25rem'}}>{cat}</td>
                <td style={{padding: '0.25rem'}}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--ifm-color-primary)',
                      cursor: 'pointer',
                      font: 'inherit',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                    onClick={() => setQuery(q)}
                  >
                    {q}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={styles.footer}>
          Если проблема возникла дважды — решение должно попасть в KB. Устаревшие статьи вреднее их
          отсутствия.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TechSupportKnowledgeBasePlayInner;
