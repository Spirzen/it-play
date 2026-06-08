import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {LANGUAGE_INTROS} from '@/components/shared/kb/languageIntroData';
import TechIcon from '@/components/demos/TechIcon';
import {LanguageIntroPlayInner} from '@/components/demos/LanguageIntroPlay';
import styles from '@/components/demos/LanguageIntroHub.module.css';

const ENTRIES = Object.values(LANGUAGE_INTROS)
  .filter((e) => e.id !== 'legacy-hub')
  .sort((a, b) => (a.name > b.name ? 1 : -1));

function LanguageIntroHubInner() {
  const [topic, setTopic] = useState('python');

  const groups = useMemo(() => {
    const map = new Map();
    for (const e of ENTRIES) {
      const g = e.category;
      if (!map.has(g)) map.set(g, []);
      map.get(g).push(e);
    }
    return [...map.entries()];
  }, []);

  return (
    <DemoShell>
      <DemoCard
        title="Обзор языков из энциклопедии"
        subtitle="Выберите язык — краткие сведения из раздела &quot;Основные языки&quot;"
      >
        <div className={styles.root}>
          {groups.map(([category, items]) => (
            <div key={category} className={styles.group}>
              <div className={styles.groupTitle}>{category}</div>
              <div className={styles.row}>
                {items.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className={clsx(
                      'it-demo__btn it-demo__btn--sm',
                      styles.langBtn,
                      topic !== e.id && 'it-demo__btn--secondary',
                    )}
                    onClick={() => setTopic(e.id)}
                  >
                    <TechIcon techId={e.id} variant="badge" size="sm" />
                    <span>{e.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.panel}>
            <LanguageIntroPlayInner topic={topic} embedded />
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LanguageIntroHubInner;
