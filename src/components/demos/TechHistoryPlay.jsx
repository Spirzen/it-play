import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {demoLoadingFallback} from '@/components/shared/demoFallback';
import {isEmbedPage} from '@/lib/useEmbedPlayProps';
import {
  EVENT_TYPES,
  getHistory,
  getHistoryEvents,
  HISTORY_COLLECTION,
  sortEvents,
  yearSpan,
} from '@/components/shared/kb/techHistoryEngine';
import styles from '@/components/demos/TechHistoryPlay.module.css';

function typeLabel(type) {
  return EVENT_TYPES[type]?.label ?? type;
}

function typeColor(type) {
  return EVENT_TYPES[type]?.color ?? '#6b7280';
}

function dotPosition(year, min, max) {
  if (year == null) return 100;
  if (min === max) return 50;
  return ((year - min) / (max - min)) * 100;
}

function TechHistoryPlayInner({topic}) {
  const history = getHistory(topic);
  const collectionEntry = HISTORY_COLLECTION.find((c) => c.topic === topic);
  const icon = collectionEntry?.icon ?? '⏳';
  const [sectionId, setSectionId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [idx, setIdx] = useState(0);

  const activeSectionId = useMemo(() => {
    if (!history?.sections?.length) return null;
    if (sectionId && history.sections.some((s) => s.id === sectionId)) {
      return sectionId;
    }
    return history.sections[0].id;
  }, [history, sectionId]);

  const rawEvents = useMemo(
    () => getHistoryEvents(history, activeSectionId),
    [history, activeSectionId],
  );

  const sorted = useMemo(() => sortEvents(rawEvents), [rawEvents]);

  const filtered = useMemo(
    () =>
      typeFilter === 'all'
        ? sorted
        : sorted.filter((e) => e.type === typeFilter),
    [sorted, typeFilter],
  );

  const safeIdx = Math.min(idx, Math.max(0, filtered.length - 1));
  const current = filtered[safeIdx];
  const span = yearSpan(sorted);
  const fillPct =
    filtered.length <= 1 ? 100 : (safeIdx / (filtered.length - 1)) * 100;

  const usedTypes = useMemo(
    () => [...new Set(sorted.map((e) => e.type))],
    [sorted],
  );

  if (!history) {
    if (isEmbedPage() && !topic) {
      return demoLoadingFallback();
    }
    return (
      <DemoShell>
        <DemoCard title="Хронология">
          <p className={styles.hint}>
            {topic
              ? `Тема «${topic}» не найдена в каталоге истории.`
              : 'Укажите параметр topic в playProps.'}
          </p>
        </DemoCard>
      </DemoShell>
    );
  }

  if (!filtered.length) {
    return (
      <DemoShell>
        <DemoCard title="Хронология">
          <p className={styles.hint}>Нет событий для выбранного фильтра.</p>
        </DemoCard>
      </DemoShell>
    );
  }

  return (
    <DemoShell>
      <DemoCard
        title="Интерактивная хронология"
        subtitle="Перемещайтесь по вехам — как на диаграмме timeline, но с деталями и фильтрами"
      >
        <div
          className={styles.root}
          style={{'--accent': history.accentColor}}
        >
          <div className={styles.header}>
            <span
              className={styles.icon}
              style={{background: history.accentColor}}
              aria-hidden
            >
              {icon}
            </span>
            <div className={styles.headText}>
              <h5 className={styles.title}>{history.title}</h5>
              {history.tagline && (
                <p className={styles.tagline}>{history.tagline}</p>
              )}
            </div>
          </div>

          {history.sections?.length > 0 && (
            <div className={styles.sectionRow} role="tablist" aria-label="Эпохи">
              {history.sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSectionId === sec.id}
                  className={clsx(
                    styles.sectionBtn,
                    activeSectionId === sec.id && styles.sectionBtnActive,
                  )}
                  onClick={() => {
                    setSectionId(sec.id);
                    setTypeFilter('all');
                    setIdx(0);
                  }}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          )}

          <div className={styles.filterRow}>
            <button
              type="button"
              className={clsx(
                styles.filterBtn,
                typeFilter === 'all' && styles.filterBtnActive,
              )}
              onClick={() => {
                setTypeFilter('all');
                setIdx(0);
              }}
            >
              Все
            </button>
            {usedTypes.map((t) => (
              <button
                key={t}
                type="button"
                className={clsx(
                  styles.filterBtn,
                  typeFilter === t && styles.filterBtnActive,
                )}
                onClick={() => {
                  setTypeFilter(t);
                  setIdx(0);
                }}
              >
                {typeLabel(t)}
              </button>
            ))}
          </div>

          <div className={styles.trackWrap}>
            <div className={styles.track} aria-hidden>
              <div
                className={styles.trackFill}
                style={{width: `${fillPct}%`}}
              />
              {filtered.map((ev, i) => (
                <button
                  key={`${ev.year}-${ev.title}-${i}`}
                  type="button"
                  className={clsx(
                    styles.dot,
                    i === safeIdx && styles.dotActive,
                  )}
                  style={{
                    left: `${dotPosition(ev.year, span.min, span.max)}%`,
                  }}
                  onClick={() => setIdx(i)}
                  aria-label={`${ev.year ?? '—'}: ${ev.title}`}
                  aria-current={i === safeIdx ? 'step' : undefined}
                />
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <h5 className={styles.eventTitle}>{current.title}</h5>
            <div className={styles.meta}>
              <span className={clsx(styles.badge, styles.badgeYear)}>
                {current.year ?? 'Сегодня'}
              </span>
              <span
                className={styles.badge}
                style={{background: typeColor(current.type)}}
              >
                {typeLabel(current.type)}
              </span>
            </div>
            <p className={styles.detail}>{current.detail}</p>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.navBtn}
              disabled={safeIdx <= 0}
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
            >
              ← Раньше
            </button>
            <input
              type="range"
              className={styles.slider}
              min={0}
              max={Math.max(0, filtered.length - 1)}
              value={safeIdx}
              onChange={(e) => setIdx(Number(e.target.value))}
              aria-label="Позиция на временной шкале"
            />
            <button
              type="button"
              className={styles.navBtn}
              disabled={safeIdx >= filtered.length - 1}
              onClick={() =>
                setIdx((i) => Math.min(filtered.length - 1, i + 1))
              }
            >
              Позже →
            </button>
          </div>
          <div className={styles.ticks}>
            <span>{span.min}</span>
            <span>
              {safeIdx + 1} / {filtered.length}
            </span>
            <span>{span.max}</span>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default TechHistoryPlayInner;
