import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoLoadingFallback} from '@/components/shared/demoFallback';
import {isEmbedPage} from '@/lib/useEmbedPlayProps';
import {
  formatLanguageLabel,
  getLanguageIntro,
  KIND_LABELS,
  LANGUAGE_INTROS,
  OVERVIEW_ARTICLE,
} from '@/components/shared/kb/languageIntroData';
import TechIcon from '@/components/demos/TechIcon';
import styles from '@/components/demos/LanguageIntroPlay.module.css';

const TABS = [
  {id: 'about', label: 'Суть'},
  {id: 'uses', label: 'Где применяют'},
  {id: 'eco', label: 'Экосистема'},
];

const ACCENT_BY_KIND = {
  programming: '#6366f1',
  markup: '#e11d48',
  style: '#7c3aed',
  query: '#059669',
  platform: '#0ea5e9',
  shell: '#d97706',
};

export function LanguageIntroPlayInner({topic, embedded = false}) {
  const intro = useMemo(() => getLanguageIntro(topic), [topic]);
  const [tab, setTab] = useState('about');
  const [relatedTopic, setRelatedTopic] = useState(null);

  const display = relatedTopic ? getLanguageIntro(relatedTopic) : intro;

  if (!intro) {
    if (isEmbedPage() && !topic) {
      return demoLoadingFallback();
    }
    const missing = (
      <p className={styles.hint}>
        {topic
          ? `Обзор для темы «${topic}» пока не добавлен.`
          : 'Укажите параметр topic (например topic=javascript) в playProps.'}
      </p>
    );
    if (embedded) return missing;
    return (
      <DemoShell>
        <DemoCard title="Знакомство с языком">{missing}</DemoCard>
      </DemoShell>
    );
  }

  const accent = ACCENT_BY_KIND[display.kind] ?? '#6366f1';

  const body = (
        <div className={styles.root} style={{'--accent': accent}}>
          <div className={styles.header}>
            <TechIcon
              techId={display.id}
              variant="badge"
              size="sm"
              accent={accent}
              className={styles.icon}
              title={display.name}
            />
            <div className={styles.headText}>
              <h5 className={styles.title}>{display.name}</h5>
              <p className={styles.meta}>
                {display.category}
                {display.year ? ` · с ${display.year} г.` : ''}
                {' · '}
                {KIND_LABELS[display.kind] ?? display.kind}
              </p>
            </div>
          </div>

          <div className={styles.chips}>
            <span
              className={clsx(styles.chip, styles.chipKind)}
              style={{background: accent}}
            >
              {KIND_LABELS[display.kind]}
            </span>
            {display.traits.map((t) => (
              <span key={t} className={styles.chip}>
                {t}
              </span>
            ))}
          </div>

          <div className={styles.tabRow} role="tablist" aria-label="Разделы обзора">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={clsx(
                  'it-demo__btn it-demo__btn--sm',
                  tab !== t.id && 'it-demo__btn--secondary',
                )}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
            {relatedTopic && (
              <button
                type="button"
                className={clsx('it-demo__btn it-demo__btn--sm', 'it-demo__btn--secondary')}
                onClick={() => setRelatedTopic(null)}
              >
                ← {intro.name}
              </button>
            )}
          </div>

          <div className={styles.panel} role="tabpanel">
            {tab === 'about' && (
              <>
                <p className={styles.summary}>{display.summary}</p>
                {display.note && <p className={styles.note}>{display.note}</p>}
              </>
            )}
            {tab === 'uses' && (
              <ul className={styles.list}>
                {display.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            )}
            {tab === 'eco' && (
              <ul className={styles.list}>
                {display.ecosystem.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}
          </div>

          {display.related?.length > 0 && !relatedTopic && (
            <div className={styles.related}>
              <span className={styles.hint}>Рядом в обзоре:</span>
              {display.related
                .filter((id) => LANGUAGE_INTROS[id])
                .map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={styles.relatedBtn}
                    onClick={() => {
                      setRelatedTopic(id);
                      setTab('about');
                    }}
                  >
                    {formatLanguageLabel(LANGUAGE_INTROS[id])}
                  </button>
                ))}
            </div>
          )}

          <p className={styles.footer}>
            Полный обзор всех языков — в статье{' '}
            <a href={OVERVIEW_ARTICLE}>"Основные языки"</a>.
          </p>
        </div>
  );

  if (embedded) return body;

  return (
    <DemoShell>
      <DemoCard
        title="Краткое знакомство"
        subtitle="Обзор из раздела &quot;Основные языки&quot; — без углубления в синтаксис"
      >
        {body}
      </DemoCard>
    </DemoShell>
  );
}

export default LanguageIntroPlayInner;
