import React, {useCallback, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  buildCSharpSnippet,
  buildFlags,
  buildHighlightSegments,
  FLAG_OPTIONS,
  PRESETS,
  replaceAll,
  runRegex,
  validateFullString,
} from '@/components/shared/kb/regexEngine';
import styles from '@/components/demos/RegexPlaygroundDemo.module.css';

const MODES = [
  {id: 'explore', label: 'Поиск', hint: 'Match / Matches'},
  {id: 'validate', label: 'Валидация', hint: 'IsMatch, вся строка'},
  {id: 'extract', label: 'Группы', hint: 'Match.Groups'},
  {id: 'replace', label: 'Замена', hint: 'Replace'},
];

const TOKENS = [
  {label: '\\d', insert: '\\d'},
  {label: '\\w', insert: '\\w'},
  {label: '.', insert: '.'},
  {label: '+', insert: '+'},
  {label: '*', insert: '*'},
  {label: '?', insert: '?'},
  {label: '{n,m}', insert: '{1,3}'},
  {label: '^$', insert: '^$'},
  {label: '()', insert: '()'},
  {label: '(?:)', insert: '(?:)'},
  {label: '|', insert: '|'},
  {label: '[ ]', insert: '[a-z]'},
];

function HighlightedText({text, matches, activeGroup}) {
  const segments = useMemo(
    () => buildHighlightSegments(text, matches, activeGroup),
    [text, matches, activeGroup],
  );
  return (
    <div className={styles.highlightBox} aria-label="Подсветка совпадений">
      {segments.map((seg, i) => {
        if (seg.type === 'match') {
          return (
            <mark key={i} className={styles.hitMatch}>
              {seg.text}
            </mark>
          );
        }
        if (seg.type === 'group') {
          return (
            <mark key={i} className={styles.hitGroup}>
              {seg.text}
            </mark>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </div>
  );
}

function RegexPlaygroundDemoInner() {
  const [mode, setMode] = useState('extract');
  const [pattern, setPattern] = useState(PRESETS[1].pattern);
  const [text, setText] = useState(PRESETS[1].text);
  const [flags, setFlags] = useState(new Set(PRESETS[1].flags));
  const [presetId, setPresetId] = useState('date');
  const [replacement, setReplacement] = useState('$<year>-$<month>-$<day>');
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [activeGroup, setActiveGroup] = useState(null);
  const [note, setNote] = useState(PRESETS[1].note);

  const flagStr = buildFlags(flags);

  const applyPreset = useCallback((preset) => {
    setPresetId(preset.id);
    setPattern(preset.pattern);
    setText(preset.text);
    setMode(preset.mode === 'compare' ? 'explore' : preset.mode);
    setFlags(new Set(preset.flags));
    setNote(preset.note);
    setSelectedMatch(0);
    setActiveGroup(null);
    if (preset.id === 'date') setReplacement('$<year>-$<month>-$<day>');
    if (preset.id === 'log') setReplacement('[$3] $4');
  }, []);

  const toggleFlag = (id) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const insertToken = (token) => {
    setPattern((p) => p + token);
  };

  const greedyPreset = PRESETS.find((p) => p.id === 'greedy');
  const isCompare = presetId === 'greedy';

  const exploreResult = useMemo(() => {
    if (mode === 'validate') return {matches: [], error: null};
    const p = isCompare ? greedyPreset.pattern : pattern;
    return runRegex(p, flagStr, text);
  }, [mode, pattern, flagStr, text, isCompare, greedyPreset]);

  const lazyResult = useMemo(() => {
    if (!isCompare || !greedyPreset?.patternLazy) return null;
    return runRegex(greedyPreset.patternLazy, flagStr, text);
  }, [isCompare, greedyPreset, flagStr, text]);

  const validateResult = useMemo(() => {
    if (mode !== 'validate') return null;
    return validateFullString(pattern, flagStr, text);
  }, [mode, pattern, flagStr, text]);

  const replaceResult = useMemo(() => {
    if (mode !== 'replace') return null;
    return replaceAll(pattern, flagStr, text, replacement);
  }, [mode, pattern, flagStr, text, replacement]);

  const matches = exploreResult.matches;
  const error =
    exploreResult.error ||
    validateResult?.error ||
    replaceResult?.error ||
    null;

  const currentMatch = matches[selectedMatch] ?? null;

  const csharp = buildCSharpSnippet(mode, pattern, flagStr, replacement);

  return (
    <DemoShell className={styles.shell}>
      <DemoCard
        title="Лаборатория регулярных выражений"
        subtitle="Меняйте шаблон и текст — сразу видно совпадения, группы и эквивалент на C#. Пресеты повторяют примеры из статьи."
      >
        <div className={styles.presets}>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={clsx(styles.presetBtn, presetId === p.id && styles.presetActive)}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {note && <p className={styles.note}>{note}</p>}

        <div className={styles.modes}>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              title={m.hint}
              className={clsx(styles.modeBtn, mode === m.id && styles.modeActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          <section className={styles.panel}>
            <h5 className={styles.panelTitle}>Шаблон</h5>
            <div className={styles.patternRow}>
              <span className={styles.patternSlash}>/</span>
              <input
                className={clsx('it-demo__input', styles.patternInput)}
                value={pattern}
                onChange={(e) => {
                  setPattern(e.target.value);
                  setPresetId('');
                }}
                spellCheck={false}
                aria-label="Регулярное выражение"
              />
              <span className={styles.patternSlash}>/{flagStr}</span>
            </div>
            <div className={styles.flags}>
              {FLAG_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  title={f.hint}
                  className={clsx(styles.flag, flags.has(f.id) && styles.flagOn)}
                  onClick={() => toggleFlag(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className={styles.tokenBar}>
              {TOKENS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className={styles.token}
                  onClick={() => insertToken(t.insert)}
                  title="Вставить в конец шаблона"
                >
                  {t.label}
                </button>
              ))}
            </div>
            {mode === 'replace' && (
              <label>
                <span className="it-demo__label">Замена (Regex.Replace)</span>
                <input
                  className="it-demo__input"
                  value={replacement}
                  onChange={(e) => setReplacement(e.target.value)}
                  spellCheck={false}
                />
              </label>
            )}
            <pre className={styles.csharp}>{csharp}</pre>
          </section>

          <section className={styles.panel}>
            <h5 className={styles.panelTitle}>Тестовый текст</h5>
            <textarea
              className={clsx('it-demo__textarea', styles.textArea)}
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
              aria-label="Строка для проверки"
            />
            {mode !== 'replace' && mode !== 'validate' && (
              <HighlightedText
                text={text}
                matches={matches}
                activeGroup={mode === 'extract' ? activeGroup : null}
              />
            )}
          </section>
        </div>

        <div className={styles.statusBar}>
          {error ? (
            <span className={styles.statusErr}>Ошибка: {error}</span>
          ) : mode === 'validate' && validateResult ? (
            <>
              <span>
                Проверено строк: <strong>{validateResult.results.length}</strong>
              </span>
              <span className={styles.statusOk}>
                ✓ {validateResult.results.filter((r) => r.ok).length}
              </span>
              <span className={styles.statusFail}>
                ✗ {validateResult.results.filter((r) => !r.ok).length}
              </span>
            </>
          ) : mode === 'replace' && replaceResult ? (
            <span>Замена применена ко всем совпадениям (флаг g)</span>
          ) : (
            <>
              <span>
                Совпадений: <strong>{matches.length}</strong>
              </span>
              {currentMatch && (
                <span>
                  Первое: позиция {currentMatch.index}…{currentMatch.end}
                </span>
              )}
            </>
          )}
        </div>

        {isCompare && !error && (
          <div className={styles.compareGrid}>
            <div className={styles.compareCol}>
              <div className={styles.compareLabel}>Жадный .*</div>
              <code>{greedyPreset.pattern}</code>
              <p>
                Захват: <strong>{exploreResult.matches[0]?.full ?? '—'}</strong>
              </p>
            </div>
            <div className={styles.compareCol}>
              <div className={styles.compareLabel}>Ленивый .*?</div>
              <code>{greedyPreset.patternLazy}</code>
              <p>
                Захват: <strong>{lazyResult?.matches[0]?.full ?? '—'}</strong>
              </p>
            </div>
          </div>
        )}

        {mode === 'validate' && validateResult && !error && (
          <div className={styles.validateLines}>
            {validateResult.results.map((r) => (
              <div
                key={r.line}
                className={clsx(styles.validateLine, r.ok ? styles.validateOk : styles.validateBad)}
              >
                <span>{r.ok ? '✓' : '✗'}</span>
                <span>
                  [{r.line}] {r.text || '(пустая строка)'}
                </span>
              </div>
            ))}
          </div>
        )}

        {mode === 'replace' && replaceResult && !error && (
          <div className={styles.replaceRow}>
            <pre className={styles.highlightBox}>{text}</pre>
            <span className={styles.replaceArrow} aria-hidden>
              →
            </span>
            <pre className={styles.highlightBox}>{replaceResult.output}</pre>
          </div>
        )}

        <div className={styles.bottomGrid}>
          {mode !== 'validate' && mode !== 'replace' && matches.length > 0 && (
            <section className={styles.panel}>
              <h5 className={styles.panelTitle}>Совпадения</h5>
              <div className={styles.matchList}>
                {matches.map((m, i) => (
                  <button
                    key={`${m.index}-${i}`}
                    type="button"
                    className={clsx(
                      styles.matchCard,
                      selectedMatch === i && styles.matchCardActive,
                    )}
                    onClick={() => {
                      setSelectedMatch(i);
                      setActiveGroup(null);
                    }}
                  >
                    <div className={styles.matchMeta}>
                      #{i + 1} · [{m.index}…{m.end}]
                    </div>
                    <div>{m.full || '(пустое)'}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {mode === 'extract' && currentMatch && (
            <section className={styles.panel}>
              <h5 className={styles.panelTitle}>
                Группы (Match #{selectedMatch + 1})
              </h5>
              <table className={styles.groupsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Имя</th>
                    <th>Значение</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    className={clsx(styles.groupRow, activeGroup === -1 && styles.groupRowActive)}
                    onClick={() => setActiveGroup(-1)}
                  >
                    <td>0</td>
                    <td>—</td>
                    <td>{currentMatch.full}</td>
                  </tr>
                  {currentMatch.groups.map((g, gi) => (
                    <tr
                      key={gi}
                      className={clsx(styles.groupRow, activeGroup === gi && styles.groupRowActive)}
                      onClick={() => setActiveGroup(gi)}
                    >
                      <td>{g.index ?? gi + 1}</td>
                      <td>{g.name || '—'}</td>
                      <td>{g.value ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={styles.note}>
                Клик по группе подсвечивает её внутри совпадения. В C#:{' '}
                <code>match.Groups[&quot;имя&quot;]</code> или <code>Groups[n]</code>.
              </p>
            </section>
          )}
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default RegexPlaygroundDemoInner;
