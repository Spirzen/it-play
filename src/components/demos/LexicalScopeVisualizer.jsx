import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';
import {
  CODE_LINES,
  ENVIRONMENTS,
  PRESETS,
  SCOPE_LEVELS,
  formatValue,
  resolveVariable,
} from '@/components/shared/kb/lexicalScopeEngine';
import shared from '@/components/shared/kb/runtimeDemo.module.css';
import styles from '@/components/demos/LexicalScopeVisualizer.module.css';

const TOKEN_STYLE = {
  kw: styles.tokenKw,
  fn: styles.tokenFn,
  v: styles.tokenV,
  p: styles.tokenP,
};

function highlightTerm(part, term, active) {
  if (!active || !term || part.t !== 'v') return part.v;
  if (part.v !== term) return part.v;
  return <mark className={styles.tokenSearch}>{part.v}</mark>;
}

function LexicalScopeVisualizerInner() {
  const [searchTerm, setSearchTerm] = useState('z');
  const [pathIndex, setPathIndex] = useState(-1);
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState('idle');
  const runRef = useRef(0);

  const resolved = result ?? resolveVariable(searchTerm);
  const activeLevel = pathIndex >= 0 ? resolved.path[pathIndex] : null;

  const runSearch = useCallback(async (term) => {
    const id = ++runRef.current;
    const res = resolveVariable(term);
    setResult(null);
    setPhase('searching');
    setPathIndex(-1);

    for (let i = 0; i < res.path.length; i++) {
      if (runRef.current !== id) return;
      await new Promise((r) => window.setTimeout(r, 550));
      if (runRef.current !== id) return;
      setPathIndex(i);

      if (res.found && res.path[i] === res.level) {
        await new Promise((r) => window.setTimeout(r, 400));
        if (runRef.current !== id) return;
        setResult(res);
        setPhase('found');
        setPathIndex(-1);
        return;
      }
    }

    if (runRef.current !== id) return;
    setResult(res);
    setPhase(res.found ? 'found' : 'not-found');
    setPathIndex(-1);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    runSearch(searchTerm.trim());
  };

  const applyPreset = (name) => {
    setSearchTerm(name);
    runSearch(name);
  };

  useEffect(() => {
    runSearch('z');
    return () => {
      runRef.current += 1;
    };
  }, [runSearch]);

  return (
    <DemoShell className={shared.root}>
      <DemoCard
        title="Живая цепочка лексических окружений"
        subtitle="Поиск переменной от inner() к Global — как в движке JavaScript"
      >
        <div className={styles.layout}>
          <div>
            <div className={shared.codePanel}>
              {CODE_LINES.map((line) => (
                <div
                  key={line.num}
                  className={shared.codeLine}
                  style={line.indent ? {paddingLeft: `${0.75 + line.indent * 0.85}rem`} : undefined}
                >
                  <span className={shared.lineNum}>{line.num}</span>
                  <code>
                    {line.parts.length === 0 ? (
                      '\u00A0'
                    ) : (
                      line.parts.map((p, i) => (
                        <span key={i} className={TOKEN_STYLE[p.t] ?? styles.tokenP}>
                          {highlightTerm(p, searchTerm.trim(), phase !== 'idle')}
                        </span>
                      ))
                    )}
                  </code>
                </div>
              ))}
            </div>

            <div className={styles.presets}>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={clsx(
                    styles.presetBtn,
                    searchTerm === p.name && styles.presetBtnActive,
                  )}
                  title={p.hint}
                  onClick={() => applyPreset(p.name)}
                  disabled={phase === 'searching'}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className={styles.searchRow}>
              <input
                type="text"
                className={clsx('it-demo__input', styles.searchInput)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="x, y, z…"
                aria-label="Имя переменной"
              />
              <button
                type="button"
                className="it-demo__btn it-demo__btn--primary"
                onClick={handleSearch}
                disabled={phase === 'searching' || !searchTerm.trim()}
              >
                {phase === 'searching' ? 'Поиск…' : 'Найти'}
              </button>
            </div>

            <div className={styles.pathBar} aria-live="polite">
              {phase === 'idle' && !result && (
                <span>Введите имя и нажмите "Найти" или выберите пресет</span>
              )}
              {(phase === 'searching' || result) && resolved.path.length > 0 && (
                <>
                  <span>Путь:</span>
                  {resolved.path.map((lvl, i) => (
                    <React.Fragment key={lvl}>
                      {i > 0 && <span className={styles.pathArrow}>→</span>}
                      <span
                        className={clsx(
                          styles.pathStep,
                          pathIndex === i && styles.pathStepActive,
                          result?.found &&
                            result.level === lvl &&
                            phase === 'found' &&
                            styles.pathStepFound,
                        )}
                      >
                        {ENVIRONMENTS[lvl].label}
                      </span>
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>

            {phase === 'found' && result?.found && (
              <div className="it-demo__alert it-demo__alert--success">
                <strong>{result.term}</strong> = {formatValue(result.value)} — найдена в{' '}
                <strong>{ENVIRONMENTS[result.level].label}</strong>
                {result.level === 'outer' && result.term === 'x' && (
                  <span> (shadowing: global x=10 скрыт)</span>
                )}
              </div>
            )}
            {phase === 'not-found' && (
              <div className="it-demo__alert it-demo__alert--error">
                <strong>{result?.term ?? searchTerm}</strong> не найдена ни в одном лексическом
                окружении
              </div>
            )}
          </div>

          <div className={styles.chain} aria-label="Цепочка окружений">
            {SCOPE_LEVELS.map((levelId, idx) => {
              const env = ENVIRONMENTS[levelId];
              const isActive = activeLevel === levelId;
              const isFound =
                phase === 'found' && result?.found && result.level === levelId;
              const isMiss = phase === 'not-found' && levelId === 'global';

              return (
                <React.Fragment key={levelId}>
                  {idx > 0 && (
                    <div className={styles.connector} aria-hidden>
                      <div className={styles.connectorLine} />
                      <span className={styles.connectorArrow}>▼</span>
                    </div>
                  )}
                  <div
                    className={clsx(
                      styles.scopeCard,
                      isActive && styles.scopeCardActive,
                      isFound && styles.scopeCardFound,
                      isMiss && styles.scopeCardMiss,
                    )}
                  >
                    <div className={styles.scopeTitle}>{env.title}</div>
                    {Object.entries(env.variables).map(([k, v]) => {
                      const hit =
                        (isFound || isActive) &&
                        k === (result?.term ?? searchTerm.trim());
                      return (
                        <div
                          key={k}
                          className={clsx(styles.varRow, hit && styles.varHit)}
                        >
                          <span>{k}</span>
                          <span>= {formatValue(v)}</span>
                        </div>
                      );
                    })}
                    <div className={styles.outerRef}>
                      {env.outerRef
                        ? `[[Outer]] → ${ENVIRONMENTS[env.outerRef].label}`
                        : '[[Outer]] → null (корень)'}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default LexicalScopeVisualizerInner;
