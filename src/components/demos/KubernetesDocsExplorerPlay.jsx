import React, {useMemo, useState} from 'react';

import Link from '@/components/shared/KbLink';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from './programPlays.module.css';
import {K8S_DOC_FILTERS, KUBERNETES_DOC_ITEMS} from '@/components/shared/kb/kubernetesDocsCatalog';

function KubernetesDocsExplorerPlayInner() {
  const [section, setSection] = useState('all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(KUBERNETES_DOC_ITEMS[0]?.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KUBERNETES_DOC_ITEMS.filter((item) => {
      if (section !== 'all' && item.section !== section) return false;
      if (!q) return true;
      const blob = `${item.title} ${item.summary} ${item.lang}`.toLowerCase();
      return blob.includes(q);
    });
  }, [section, query]);

  const item =
    KUBERNETES_DOC_ITEMS.find((i) => i.id === picked) ?? filtered[0] ?? KUBERNETES_DOC_ITEMS[0];

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Навигатор документации Kubernetes"
        subtitle="Официальные разделы kubernetes.io с привязкой к главам энциклопедии"
      >
        <input
          type="search"
          className="it-demo__input"
          style={{width: '100%', marginBottom: '0.65rem'}}
          placeholder="API, kubectl, Ingress, RBAC…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по каталогу Kubernetes"
        />
        <div className={toolStyles.chips} style={{marginBottom: '0.65rem'}}>
          {K8S_DOC_FILTERS.map((s) => (
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
          <ul className={styles.tree} aria-label="Разделы документации Kubernetes">
            {filtered.length === 0 ? (
              <li className={styles.detailRole}>Ничего не найдено — смените фильтр или запрос.</li>
            ) : (
              filtered.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className={clsx(styles.treeItem, picked === r.id && styles.treeItemActive)}
                    onClick={() => setPicked(r.id)}
                  >
                    <span>{r.title}</span>
                    <span className={styles.ext}>{r.lang}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
          {item && (
            <div className={styles.detail}>
              <h4 className={styles.detailTitle}>{item.title}</h4>
              <p className={styles.detailRole}>Язык: {item.lang}</p>
              <p>{item.summary}</p>
              <p className={styles.detailRole}>
                В энциклопедии:{' '}
                <Link to={item.encyclopedia}>связанная глава</Link>
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="it-demo__btn it-demo__btn--primary"
                style={{display: 'inline-block', marginTop: '0.65rem', textDecoration: 'none'}}
              >
                Открыть на kubernetes.io ↗
              </a>
            </div>
          )}
        </div>
        <p className={styles.detailRole} style={{marginTop: '0.75rem'}}>
          Часть разделов переведена на русский; для сети, хранилища, безопасности и задач чаще актуальна{' '}
          <a href="https://kubernetes.io/docs/home/" target="_blank" rel="noopener noreferrer">
            английская версия
          </a>
          . Источник: CNCF / Kubernetes SIG Docs.
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default KubernetesDocsExplorerPlayInner;
