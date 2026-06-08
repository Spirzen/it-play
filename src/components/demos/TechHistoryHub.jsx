import React, {useState} from 'react';
import Link from '@/components/shared/KbLink';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {getHistory, HISTORY_COLLECTION} from '@/components/shared/kb/techHistoryEngine';
import styles from '@/components/demos/TechHistoryPlay.module.css';

const hubStyles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(11.5rem, 1fr))',
    gap: '0.55rem',
    marginTop: '0.75rem',
  },
  card: {
    display: 'block',
    padding: '0.65rem 0.75rem',
    borderRadius: '10px',
    border: '1px solid var(--ifm-color-emphasis-300)',
    background: 'var(--ifm-background-surface-color)',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  cardActive: {
    borderColor: 'var(--ifm-color-primary)',
    boxShadow: '0 0 0 2px color-mix(in srgb, var(--ifm-color-primary) 18%, transparent)',
  },
  cardIcon: {
    fontSize: '1.1rem',
    fontWeight: 800,
    marginBottom: '0.25rem',
  },
  cardTitle: {
    margin: 0,
    fontSize: '0.78rem',
    fontWeight: 700,
    lineHeight: 1.3,
  },
  cardYears: {
    margin: '0.2rem 0 0',
    fontSize: '0.65rem',
    color: 'var(--ifm-color-content-secondary)',
  },
  preview: {
    marginTop: '1rem',
  },
};

function TechHistoryHubInner() {
  const [active, setActive] = useState(HISTORY_COLLECTION[0]?.topic ?? 'javascript');
  const history = getHistory(active);
  const item = HISTORY_COLLECTION.find((c) => c.topic === active);
  const docPath = item ? `/${item.doc}` : '#';
  const allEvents = history?.sections?.length
    ? history.sections.flatMap((s) => s.events)
    : history?.events ?? [];
  const years = allEvents.map((e) => e.year).filter((y) => y != null);
  const yearRange =
    years.length > 0
      ? `${Math.min(...years)}–${Math.max(...years)}`
      : '—';

  return (
    <DemoShell>
      <DemoCard
        title="Подборка &quot;История&quot;"
        subtitle="Выберите тему — откроется интерактивная шкала в статье; здесь превью вех"
      >
        <div style={hubStyles.grid}>
          {HISTORY_COLLECTION.map((entry) => {
            const h = getHistory(entry.topic);
            const evs = h?.sections?.length
              ? h.sections.flatMap((s) => s.events)
              : h?.events ?? [];
            const ys = evs.map((e) => e.year).filter((y) => y != null);
            const range =
              ys.length > 0
                ? `${Math.min(...ys)}–${Math.max(...ys)}`
                : '';
            return (
              <button
                key={entry.topic}
                type="button"
                style={{
                  ...hubStyles.card,
                  ...(active === entry.topic ? hubStyles.cardActive : {}),
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
                onClick={() => setActive(entry.topic)}
              >
                <div style={hubStyles.cardIcon}>{entry.icon}</div>
                <p style={hubStyles.cardTitle}>{h?.title ?? entry.topic}</p>
                {range && <p style={hubStyles.cardYears}>{range}</p>}
              </button>
            );
          })}
        </div>

        {history && (
          <div style={hubStyles.preview} className={styles.root}>
            <div
              style={{'--accent': history.accentColor}}
            >
              <p className={styles.hint}>
                <strong>{history.title}</strong> ({yearRange}) —{' '}
                {allEvents.length} вех.{' '}
                <Link to={docPath}>Открыть статью →</Link>
              </p>
              <ul style={{margin: '0.5rem 0 0', paddingLeft: '1.1rem', fontSize: '0.82rem'}}>
                {allEvents.slice(0, 4).map((ev) => (
                  <li key={`${ev.year}-${ev.title}`}>
                    <strong>{ev.year ?? '—'}</strong> — {ev.title}
                  </li>
                ))}
                {allEvents.length > 4 && (
                  <li className={styles.hint}>…ещё {allEvents.length - 4} в статье</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default TechHistoryHubInner;
