import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  KEYBOARD_ROWS,
  NAV_CLUSTER,
  SCAN_CODES,
  SHORTCUT_PRESETS,
  ZONE_LABELS,
  modifiersFromEvent,
  normalizeCode,
} from '@/components/shared/kb/keyboardLayout';
import styles from '@/components/demos/KeyboardPlay.module.css';

const UNIT_PX = 34;

const VARIANT_META = {
  explorer: {
    title: 'Карта клавиатуры',
    subtitle:
      'Нажимайте клавиши на схеме или на физической клавиатуре (кликните в область демо). Выберите сочетание — подсветятся нужные клавиши.',
    presets: 'explorer',
    showNav: true,
    showScan: false,
  },
  internals: {
    title: 'От нажатия к скан-коду',
    subtitle:
      'Клавиатура передаёт код физической клавиши; буква или команда появляются только после интерпретации в ОС и программе.',
    presets: 'internals',
    showNav: false,
    showScan: true,
  },
  windows: {
    title: 'Горячие клавиши Windows',
    subtitle:
      'Выберите сочетание из списка или повторите его на клавиатуре — подсветка покажет, какие клавиши задействованы.',
    presets: 'windows',
    showNav: true,
    showScan: false,
  },
};

function KeyButton({keyDef, active, chordFlash, onPress, onRelease}) {
  if (keyDef.gap) {
    return (
      <span
        className={styles.keyGap}
        style={{width: keyDef.w * UNIT_PX}}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      className={clsx(styles.key, {
        [styles.keyMod]: keyDef.mod,
        [styles.keySpace]: keyDef.id === 'Space',
        [styles.keyActive]: active,
        [styles.keyChord]: chordFlash,
      })}
      style={{width: keyDef.w * UNIT_PX}}
      onPointerDown={() => onPress(keyDef.id)}
      onPointerUp={() => onRelease(keyDef.id)}
      onPointerLeave={() => onRelease(keyDef.id)}
      aria-pressed={active}
      aria-label={keyDef.label || keyDef.id}
    >
      {keyDef.id === 'Space' ? 'Пробел' : keyDef.label}
    </button>
  );
}

function KeyboardRows({rows, activeSet, chordSet, zoneLabel, onPress, onRelease}) {
  let lastZone = null;

  return (
    <>
      {rows.map((row, ri) => {
        const showZone = row.zone && row.zone !== lastZone;
        if (showZone) lastZone = row.zone;

        return (
          <React.Fragment key={`${row.zone}-${ri}`}>
            {showZone && zoneLabel && (
              <div className={styles.zoneTag}>{ZONE_LABELS[row.zone] ?? row.zone}</div>
            )}
            <div className={styles.row}>
              {row.keys.map((k) => (
                <KeyButton
                  key={k.id}
                  keyDef={k}
                  active={activeSet.has(k.id)}
                  chordFlash={chordSet.has(k.id)}
                  onPress={onPress}
                  onRelease={onRelease}
                />
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}

function formatChordLabel(keys) {
  const names = {
    ControlLeft: 'Ctrl',
    ControlRight: 'Ctrl',
    AltLeft: 'Alt',
    AltRight: 'Alt',
    ShiftLeft: 'Shift',
    ShiftRight: 'Shift',
    MetaLeft: 'Win',
    MetaRight: 'Win',
    Space: 'Пробел',
    Tab: 'Tab',
    Escape: 'Esc',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
  };
  return keys
    .map((id) => {
      if (names[id]) return names[id];
      if (id.startsWith('Key')) return id.slice(3);
      if (id.startsWith('Digit')) return id.slice(5);
      if (id.startsWith('F')) return id;
      return id;
    })
    .join(' + ');
}

function KeyboardPlayInner({variant = 'explorer'}) {
  const meta = VARIANT_META[variant] ?? VARIANT_META.explorer;
  const presets = SHORTCUT_PRESETS[meta.presets] ?? SHORTCUT_PRESETS.explorer;

  const [pressed, setPressed] = useState(() => new Set());
  const [chordKeys, setChordKeys] = useState(() => new Set());
  const [selectedId, setSelectedId] = useState(presets[0]?.id ?? null);
  const [lastEvent, setLastEvent] = useState(null);
  const [log, setLog] = useState([]);
  const [listening, setListening] = useState(false);

  const wrapRef = useRef(null);
  const chordTimer = useRef(null);

  const selected = useMemo(
    () => presets.find((p) => p.id === selectedId) ?? presets[0],
    [presets, selectedId],
  );

  const activeSet = useMemo(() => {
    const s = new Set(pressed);
    if (selected?.keys) {
      selected.keys.forEach((k) => s.add(k));
    }
    return s;
  }, [pressed, selected]);

  const pushLog = useCallback((text) => {
    setLog((prev) => [{id: Date.now(), text}, ...prev].slice(0, 6));
  }, []);

  const flashChord = useCallback((keys) => {
    setChordKeys(new Set(keys));
    if (chordTimer.current) clearTimeout(chordTimer.current);
    chordTimer.current = setTimeout(() => setChordKeys(new Set()), 700);
  }, []);

  const applyPreset = useCallback(
    (preset) => {
      setSelectedId(preset.id);
      flashChord(preset.keys);
      pushLog(preset.label);
    },
    [flashChord, pushLog],
  );

  const pressKey = useCallback(
    (id) => {
      setPressed((prev) => new Set(prev).add(id));
      const scan = SCAN_CODES[id];
      setLastEvent({id, scan});
      pushLog(formatChordLabel([id]));
    },
    [pushLog],
  );

  const releaseKey = useCallback((id) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    flashChord(selected.keys);
  }, [selected, flashChord]);

  useEffect(() => {
    if (!listening) return undefined;

    const isFocused = () => {
      const el = document.activeElement;
      return el && wrapRef.current && (wrapRef.current === el || wrapRef.current.contains(el));
    };

    const onKeyDown = (e) => {
      if (!isFocused() || e.repeat) return;
      const codes = modifiersFromEvent(e);
      if (!codes.length) return;
      e.preventDefault();
      codes.forEach((id) => pressKey(id));

      const match = presets.find((p) => {
        if (p.keys.length !== codes.length) return false;
        const a = [...p.keys].sort().join();
        const b = [...codes].sort().join();
        return a === b;
      });
      if (match) {
        setSelectedId(match.id);
      }
    };

    const onKeyUp = (e) => {
      if (!isFocused()) return;
      const code = normalizeCode(e.code);
      if (code) releaseKey(code);
      if (!e.ctrlKey) releaseKey('ControlLeft');
      if (!e.altKey) releaseKey('AltLeft');
      if (!e.shiftKey) releaseKey('ShiftLeft');
      if (!e.metaKey) releaseKey('MetaLeft');
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [listening, presets, pressKey, releaseKey]);

  useEffect(() => () => {
    if (chordTimer.current) clearTimeout(chordTimer.current);
  }, []);

  const scanHint =
    meta.showScan && lastEvent?.scan
      ? `Скан-код ${lastEvent.scan}`
      : meta.showScan && selected?.scanFocus && SCAN_CODES[selected.scanFocus]
        ? `Скан-код ${SCAN_CODES[selected.scanFocus]}`
        : null;

  return (
    <DemoShell className={styles.root}>
      <DemoCard title={meta.title} subtitle={meta.subtitle}>
        <div
          ref={wrapRef}
          className={clsx(styles.layout, !meta.showNav && styles.compact)}
          tabIndex={0}
          role="application"
          aria-label="Интерактивная клавиатура"
          onFocus={() => setListening(true)}
          onBlur={() => {
            setListening(false);
            setPressed(new Set());
          }}
          onClick={() => wrapRef.current?.focus()}
        >
          <div className={styles.keyboardWrap}>
            <div className={styles.keyboard}>
              <div className={styles.mainBlock}>
                <KeyboardRows
                  rows={KEYBOARD_ROWS}
                  activeSet={activeSet}
                  chordSet={chordKeys}
                  zoneLabel
                  onPress={pressKey}
                  onRelease={releaseKey}
                />
              </div>
              {meta.showNav && (
                <div className={styles.navBlock}>
                  <KeyboardRows
                    rows={NAV_CLUSTER}
                    activeSet={activeSet}
                    chordSet={chordKeys}
                    zoneLabel
                    onPress={pressKey}
                    onRelease={releaseKey}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.sidePanel}>
            <span
              className={clsx(styles.focusBadge, !listening && styles.focusBadgeOff)}
            >
              {listening ? '● Физическая клавиатура активна' : 'Кликните сюда для ввода с клавиатуры'}
            </span>

            {selected && (
              <div className={styles.chordDisplay}>
                <p className={styles.chordLabel}>{selected.label}</p>
                <p className={styles.chordAction}>{selected.action}</p>
                {selected.hint && <p className={styles.hint}>{selected.hint}</p>}
                {scanHint && <p className={styles.scanLine}>{scanHint}</p>}
              </div>
            )}

            <div className={styles.presetList} role="list">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="listitem"
                  className={clsx(styles.presetBtn, selectedId === p.id && styles.presetBtnActive)}
                  onClick={() => applyPreset(p)}
                >
                  <kbd>{p.label}</kbd>
                  <span>{p.action}</span>
                </button>
              ))}
            </div>

            {log.length > 0 && (
              <ul className={styles.log} aria-label="Журнал нажатий">
                {log.map((e) => (
                  <li key={e.id}>{e.text}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default KeyboardPlayInner;
