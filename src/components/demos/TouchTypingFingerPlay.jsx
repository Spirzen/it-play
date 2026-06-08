import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {normalizeCode} from '@/components/shared/kb/keyboardLayout';
import {
  BUMP_KEYS,
  DRILL_KEYS,
  FINGER_META,
  HOME_ROW_KEYS,
  TOUCH_TYPING_ROWS,
  fingerForKey,
  labelForKey,
} from '@/components/shared/kb/touchTypingLayout';
import styles from '@/components/demos/TouchTypingFingerPlay.module.css';

const UNIT_PX = 34;

function pickDrillKey(exclude) {
  const pool = DRILL_KEYS.filter((id) => id !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? DRILL_KEYS[0];
}

function TouchTypingFingerPlayInner() {
  const [layout, setLayout] = useState('ru');
  const [showHomeOnly, setShowHomeOnly] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const [selectedId, setSelectedId] = useState('KeyF');
  const [drillActive, setDrillActive] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [drillScore, setDrillScore] = useState({ok: 0, miss: 0});
  const wrapRef = useRef(null);

  const activeId = hoverId ?? selectedId;
  const activeFinger = fingerForKey(activeId);
  const activeMeta = activeFinger ? FINGER_META[activeFinger] : null;

  const visibleRows = useMemo(() => {
    if (!showHomeOnly) return TOUCH_TYPING_ROWS;
    return TOUCH_TYPING_ROWS.filter((row) => row.home);
  }, [showHomeOnly]);

  const startDrill = useCallback(() => {
    setDrillActive(true);
    setDrillScore({ok: 0, miss: 0});
    setTargetId(pickDrillKey(null));
    wrapRef.current?.focus();
  }, []);

  const stopDrill = useCallback(() => {
    setDrillActive(false);
    setTargetId(null);
  }, []);

  const onKeyHit = useCallback(
    (keyId) => {
      setSelectedId(keyId);
      if (!drillActive || !targetId) return;
      if (keyId === targetId) {
        setDrillScore((s) => ({...s, ok: s.ok + 1}));
        setTargetId(pickDrillKey(keyId));
      } else {
        setDrillScore((s) => ({...s, miss: s.miss + 1}));
      }
    },
    [drillActive, targetId],
  );

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!wrapRef.current?.contains(document.activeElement)) return;
      const code = normalizeCode(e.code);
      if (!code || !fingerForKey(code)) return;
      e.preventDefault();
      onKeyHit(code);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyHit]);

  const legend = Object.entries(FINGER_META).filter(([id]) => id !== 'rt');

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Зоны пальцев и домашний ряд"
        subtitle="Цвет показывает, каким пальцем нажимать физическую клавишу. На F и J — тактильные метки для ориентира без взгляда."
      >
        <div className={styles.toolbar}>
          <button
            type="button"
            className={clsx(styles.chip, layout === 'ru' && styles.chipActive)}
            onClick={() => setLayout('ru')}
          >
            Подписи ЙЦУКЕН
          </button>
          <button
            type="button"
            className={clsx(styles.chip, layout === 'en' && styles.chipActive)}
            onClick={() => setLayout('en')}
          >
            Подписи QWERTY
          </button>
          <button
            type="button"
            className={clsx(styles.chip, showHomeOnly && styles.chipActive)}
            onClick={() => setShowHomeOnly((v) => !v)}
          >
            {showHomeOnly ? 'Весь блок' : 'Только домашний ряд'}
          </button>
        </div>

        <div className={styles.legend} aria-hidden="true">
          {legend.map(([id, meta]) => (
            <span key={id} className={styles.legendItem}>
              <span className={styles.swatch} style={{background: meta.color}} />
              {meta.short}
            </span>
          ))}
          <span className={styles.legendItem}>
            <span className={styles.swatch} style={{background: FINGER_META.rt.color}} />
            {FINGER_META.rt.short}
          </span>
        </div>

        <div
          ref={wrapRef}
          className={styles.board}
          tabIndex={0}
          role="application"
          aria-label="Клавиатура зон пальцев"
          onClick={() => wrapRef.current?.focus()}
        >
          {visibleRows.map((row, ri) => (
            <div key={ri} className={styles.row}>
              {row.keys.map((keyDef) => {
                const finger = fingerForKey(keyDef.id);
                const meta = finger ? FINGER_META[finger] : null;
                const main = labelForKey(keyDef.id, layout);
                const sub =
                  layout === 'ru' && keyDef.en && keyDef.id !== 'Space' ? keyDef.en : null;

                return (
                  <button
                    key={keyDef.id}
                    type="button"
                    className={clsx(styles.key, {
                      [styles.keyHome]: HOME_ROW_KEYS.has(keyDef.id),
                      [styles.keyBump]: BUMP_KEYS.has(keyDef.id),
                      [styles.keyActive]: activeId === keyDef.id,
                      [styles.keyTarget]: drillActive && targetId === keyDef.id,
                    })}
                    style={{
                      width: keyDef.w * UNIT_PX,
                      background: meta?.color ?? 'var(--ifm-background-surface-color)',
                    }}
                    onMouseEnter={() => setHoverId(keyDef.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onClick={() => onKeyHit(keyDef.id)}
                    aria-pressed={activeId === keyDef.id}
                    aria-label={`${main}${sub ? `, ${sub}` : ''} — ${meta?.label ?? 'клавиша'}`}
                  >
                    <span>{main}</span>
                    {sub && <span className={styles.keySub}>{sub}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {activeMeta && (
          <div className={styles.info}>
            <p className={styles.infoTitle}>
              {labelForKey(activeId, layout)}
              {layout === 'ru' && labelForKey(activeId, 'en') !== labelForKey(activeId, 'ru') && (
                <span> ({labelForKey(activeId, 'en')})</span>
              )}
            </p>
            <p>
              Палец: <strong>{activeMeta.label}</strong>
              {HOME_ROW_KEYS.has(activeId) && ' — домашний ряд, возвращайтесь сюда после каждой клавиши.'}
              {BUMP_KEYS.has(activeId) && ' На этой клавише обычно есть выпуклая метка.'}
            </p>
          </div>
        )}

        <div className={styles.drillBar}>
          {!drillActive ? (
            <button type="button" className={styles.btnPrimary} onClick={startDrill}>
              Мини-дрилл: нажми нужную клавишу
            </button>
          ) : (
            <>
              <span className={styles.drillPrompt}>
                Нажмите: <strong>{labelForKey(targetId, layout)}</strong>
              </span>
              <span className={styles.drillStat}>
                Верно: {drillScore.ok} · промах: {drillScore.miss}
              </span>
              <button type="button" className={styles.btn} onClick={stopDrill}>
                Стоп
              </button>
            </>
          )}
        </div>

        <p className={styles.hint}>
          Кликните по схеме или сфокусируйте область и жмите клавиши на своей клавиатуре. Зоны
          привязаны к физическим позициям — при русской раскладке домашний ряд это «ф ы в а · о л
          д ж».
        </p>
      </DemoCard>
    </DemoShell>
  );
}

export default TouchTypingFingerPlayInner;
