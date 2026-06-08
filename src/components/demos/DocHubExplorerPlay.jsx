import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';

const SECTIONS = [
  {id: 'all', label: 'Все'},
  {id: 'web', label: 'Веб'},
  {id: 'lang', label: 'Языки'},
  {id: 'data', label: 'БД'},
  {id: 'ops', label: 'DevOps'},
  {id: 'sec', label: 'Безопасность'},
  {id: 'os', label: 'ОС'},
];

const RESOURCES = [
  {id: 'mdn', section: 'web', name: 'MDN Web Docs', url: 'https://developer.mozilla.org/ru/', lang: 'RU/EN', note: 'Эталон по HTML, CSS, JS и Web API.'},
  {id: 'devdocs', section: 'web', name: 'DevDocs.io', url: 'https://devdocs.io/', lang: 'EN', note: 'Агрегатор справок, офлайн-режим, быстрый поиск.'},
  {id: 'learnjs', section: 'web', name: 'learn.javascript.ru', url: 'https://learn.javascript.ru/', lang: 'RU', note: 'Полный курс JS на русском.'},
  {id: 'django', section: 'web', name: 'Django Documentation', url: 'https://docs.djangoproject.com/', lang: 'EN', note: 'Официальный учебник и справочник; см. 5.02/301.'},
  {id: 'fastapi', section: 'web', name: 'FastAPI', url: 'https://fastapi.tiangolo.com/ru/', lang: 'RU/EN', note: 'OpenAPI, Pydantic, async; см. 5.02/3432.'},
  {id: 'metanit', section: 'lang', name: 'Metanit.com', url: 'https://metanit.com/', lang: 'RU', note: 'C#, Java, Python, Go, C++, SQL и др.'},
  {id: 'java-gitbook', section: 'lang', name: 'Java — GitBook (Ivantsov)', url: 'https://andrey-ivantsov.gitbook.io/java', lang: 'RU', note: 'Краткий конспект Core Java; см. 5.03/intro.'},
  {id: 'java-proglang', section: 'lang', name: 'Java — proglang.su', url: 'http://proglang.su/java', lang: 'RU', note: 'Самоучитель: коллекции, классы JDK, примеры.'},
  {id: 'oracle-java', section: 'lang', name: 'Oracle Java SE Docs', url: 'https://docs.oracle.com/en/java/javase/', lang: 'EN', note: 'Эталон спецификации JDK; см. 5.03/294.'},
  {id: 'pyru', section: 'lang', name: 'Python docs (RU)', url: 'https://docs.python.org/3/ru/', lang: 'RU', note: 'Официальная документация языка; см. 5.02/intro.'},
  {id: 'go-docs', section: 'lang', name: 'Go Documentation', url: 'https://go.dev/doc/', lang: 'EN', note: 'Тур, Effective Go, stdlib; см. 5.10/intro.'},
  {id: 'ms-csharp', section: 'lang', name: 'Microsoft Learn — C#', url: 'https://learn.microsoft.com/ru/dotnet/csharp/', lang: 'RU', note: 'Тур по языку, справочник, примеры.'},
  {id: 'ms-aspnet', section: 'web', name: 'ASP.NET Core 10 Docs', url: 'https://learn.microsoft.com/ru-ru/aspnet/core/?view=aspnetcore-10.0', lang: 'RU', note: 'MVC, Blazor, Minimal API, Docker; см. главу 5.05/455.'},
  {id: 'rust-book', section: 'lang', name: 'The Rust Book (RU)', url: 'https://doc.rust-lang.ru/book/', lang: 'RU', note: 'Полный перевод официальной книги.'},
  {id: 'postgrespro', section: 'data', name: 'PostgreSQL (Postgres Pro)', url: 'https://postgrespro.ru/docs/postgresql', lang: 'RU', note: 'Локализованная документация PostgreSQL.'},
  {id: 'docker', section: 'ops', name: 'Docker Docs', url: 'https://docs.docker.com/', lang: 'EN', note: 'Dockerfile, Compose, engine; см. 8.06/intro.'},
  {id: 'k8s-ru', section: 'ops', name: 'Kubernetes (RU)', url: 'https://kubernetes.io/ru/docs/home/', lang: 'RU', note: 'Концепции и справка по объектам кластера.'},
  {id: 'k8s-nav', section: 'ops', name: 'Kubernetes — навигатор (IT)', url: '/tools/documentation/7', lang: 'RU/EN', note: 'Курируемая карта разделов kubernetes.io с фильтрами.'},
  {id: 'terraform', section: 'ops', name: 'Terraform Docs', url: 'https://developer.hashicorp.com/terraform/docs', lang: 'EN', note: 'HCL, провайдеры, state; IaC в 8.04.'},
  {id: 'progit', section: 'ops', name: 'Pro Git (книга)', url: 'https://git-scm.com/book/ru/v2', lang: 'RU', note: 'Рекомендуемый учебник по Git.'},
  {id: 'owasp', section: 'sec', name: 'OWASP', url: 'https://owasp.org/', lang: 'EN', note: 'Top 10, Cheat Sheets, ASVS; см. 8.07/intro.'},
  {id: 'archwiki', section: 'os', name: 'Arch Wiki', url: 'https://wiki.archlinux.org/', lang: 'EN', note: 'Глубокая база по Linux; часто используют как справочник.'},
  {id: 'win-docs', section: 'os', name: 'Windows Developer Docs', url: 'https://learn.microsoft.com/ru/windows/', lang: 'RU', note: 'Разработка и администрирование Windows.'},
  {id: 'ms-powershell', section: 'os', name: 'Microsoft Learn — PowerShell', url: 'https://learn.microsoft.com/ru-ru/powershell/', lang: 'RU', note: 'Установка, обзор, примеры; Gallery — powershellgallery.com.'},
];

function DocHubExplorerPlayInner() {
  const [section, setSection] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('mdn');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (section !== 'all' && r.section !== section) return false;
      if (!q) return true;
      return `${r.name} ${r.note} ${r.lang}`.toLowerCase().includes(q);
    });
  }, [section, query]);

  const item = RESOURCES.find((r) => r.id === picked) ?? filtered[0] ?? RESOURCES[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Навигатор документации"
        subtitle="Выберите раздел, найдите ресурс и откройте официальный источник"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="MDN, Git, PostgreSQL…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск ресурсов"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={clsx(toolStyles.chip, section === s.id && toolStyles.chipActive)}
              onClick={() => setSection(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.explorer}>
          <ul className={styles.tree}>
            {filtered.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={clsx(styles.treeItem, picked === r.id && styles.treeItemActive)}
                  onClick={() => setPicked(r.id)}
                >
                  <span>{r.name}</span>
                  <span className={styles.ext}>{r.lang}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.detail}>
            <h4 className={styles.detailTitle}>{item.name}</h4>
            <p className={styles.detailRole}>Язык: {item.lang}</p>
            <p>{item.note}</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="it-demo__btn it-demo__btn--primary"
              style={{display: 'inline-block', marginTop: '0.65rem', textDecoration: 'none'}}
            >
              Открыть сайт ↗
            </a>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default DocHubExplorerPlayInner;
