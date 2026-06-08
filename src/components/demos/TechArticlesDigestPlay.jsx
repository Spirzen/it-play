import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const TAGS = [
  {id: 'all', label: 'Все'},
  {id: 'arch', label: 'Архитектура'},
  {id: 'practice', label: 'Практика'},
  {id: 'career', label: 'Карьера'},
  {id: 'deep', label: 'Глубоко'},
];

const ARTICLES = [
  {
    id: 'martin',
    tag: 'arch',
    title: 'martinfowler.com — блог и статьи',
    source: 'Martin Fowler',
    mins: 15,
    url: 'https://martinfowler.com/',
    note: 'Микросервисы, рефакторинг, паттерны интеграции — эталон для архитекторов.',
  },
  {
    id: '12factor',
    tag: 'arch',
    title: 'The Twelve-Factor App',
    source: 'Heroku / сообщество',
    mins: 25,
    url: 'https://12factor.net/ru/',
    note: '12 принципов облачных приложений: конфиг, логи, зависимости, процессы.',
  },
  {
    id: 'refactoring',
    tag: 'practice',
    title: 'Refactoring.Guru',
    source: 'Alexander Shvets',
    mins: 10,
    url: 'https://refactoring.guru/ru',
    note: 'Паттерны, запахи кода, рефакторинг — с наглядными схемами.',
  },
  {
    id: 'joel',
    tag: 'career',
    title: 'Joel on Software',
    source: 'Joel Spolsky',
    mins: 12,
    url: 'https://www.joelonsoftware.com/',
    note: 'Управление разработкой, качество, найм — классика индустрии.',
  },
  {
    id: 'google-eng',
    tag: 'practice',
    title: 'Google Engineering Blog',
    source: 'Google',
    mins: 20,
    url: 'https://developers.googleblog.com/',
    note: 'Как крупные команды решают масштаб, ML, инфраструктуру.',
  },
  {
    id: 'aws-arch',
    tag: 'arch',
    title: 'AWS Architecture Blog',
    source: 'Amazon',
    mins: 18,
    url: 'https://aws.amazon.com/blogs/architecture/',
    note: 'Кейсы облачных архитектур, отказоустойчивость, стоимость.',
  },
  {
    id: 'habr',
    tag: 'practice',
    title: 'Habr — лучшие посты по тегам',
    source: 'Habr',
    mins: 8,
    url: 'https://habr.com/ru/articles/',
    note: 'Русскоязычные разборы: DevOps, backend, безопасность, карьера.',
  },
  {
    id: 'highscalability',
    tag: 'deep',
    title: 'High Scalability',
    source: 'Todd Hoff',
    mins: 30,
    url: 'http://highscalability.com/',
    note: 'Как устроены системы у Netflix, Twitter, WhatsApp — нагрузка и trade-offs.',
  },
  {
    id: 'spirzen-tech',
    tag: 'practice',
    title: 'Техническое письмо — энциклопедия',
    source: 'Вселенная IT',
    mins: 20,
    url: '/encyclopedia/7-project/7-08-tehnicheskoe-pismo/1',
    note: 'Внутренний материал: зачем документировать и как писать понятно.',
    internal: true,
  },
  {
    id: 'spirzen-doc-arch',
    tag: 'arch',
    title: 'Документация как инструмент проектирования',
    source: 'Вселенная IT',
    mins: 15,
    url: '/encyclopedia/7-project/7-06-proektirovanie-i-arhitektura/design/1117',
    note: 'Living docs, C4, трассировка требований.',
    internal: true,
  },
];

function TechArticlesDigestPlayInner() {
  const [tag, setTag] = useState('all');
  const [picked, setPicked] = useState('martin');
  const [read, setRead] = useState(() => new Set());

  const filtered = useMemo(
    () => ARTICLES.filter((a) => tag === 'all' || a.tag === tag),
    [tag],
  );

  const article = ARTICLES.find((a) => a.id === picked) ?? filtered[0] ?? ARTICLES[0];

  const toggleRead = () => {
    setRead((prev) => {
      const next = new Set(prev);
      if (next.has(article.id)) next.delete(article.id);
      else next.add(article.id);
      return next;
    });
  };

  const progress = Math.round((read.size / ARTICLES.length) * 100);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Дайджест статей"
        subtitle="Отмечайте прочитанное — прогресс сохраняется в сессии браузера"
      >
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
          <div className={styles.ratioBar} style={{flex: 1, margin: 0}}>
            <div className={styles.ratioFill} style={{width: `${progress}%`}} />
          </div>
          <span className={styles.mono} style={{fontSize: '0.72rem'}}>
            {read.size}/{ARTICLES.length}
          </span>
        </div>
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={clsx(toolStyles.chip, tag === t.id && toolStyles.chipActive)}
              onClick={() => setTag(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree}>
            {filtered.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={clsx(styles.treeItem, picked === a.id && styles.treeItemActive)}
                  onClick={() => setPicked(a.id)}
                >
                  <span>{read.has(a.id) ? '✓ ' : ''}{a.title}</span>
                  <span className={styles.ext}>{a.mins} мин</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{article.title}</h4>
            <p className={styles.detailRole}>
              {article.source} · ~{article.mins} мин чтения
            </p>
            <p>{article.note}</p>
            <div className={toolStyles.chips} style={{marginTop: '0.65rem'}}>
              <button type="button" className={toolStyles.chip} onClick={toggleRead}>
                {read.has(article.id) ? 'Снять отметку' : 'Отметить прочитанным'}
              </button>
              <a
                href={article.url}
                {...(article.internal ? {} : {target: '_blank', rel: 'noopener noreferrer'})}
                className="it-demo__btn it-demo__btn--primary"
                style={{textDecoration: 'none'}}
              >
                {article.internal ? 'Открыть в энциклопедии' : 'Читать ↗'}
              </a>
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default TechArticlesDigestPlayInner;
