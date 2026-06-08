import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  DOCUMENT_PROPS,
  DOM_TREE,
  MODIFY_ACTIONS,
  NODE_META,
  QUERY_PRESETS,
  SCRIPT_SCENARIOS,
  getNodeClasses,
  getNodeText,
  getPathToNode,
} from '@/components/shared/kb/jsDomBridgeEngine';
import toolStyles from '@/components/shared/kb/toolDemo.module.css';
import styles from '@/components/demos/JsDomBridgePlay.module.css';

const MODES = [
  {id: 'bridge', label: 'document ↔ DOM'},
  {id: 'script', label: 'Порядок скрипта'},
  {id: 'query', label: 'Поиск элементов'},
];

function DomTreeNode({
  node,
  depth = 0,
  highlightIds,
  pathIds,
  selectedId,
  onSelect,
  defaultOpen = true,
}) {
  const meta = NODE_META[node.id] || {label: node.id};
  const hasChildren = (node.children?.length ?? 0) > 0;
  const [open, setOpen] = useState(defaultOpen || depth < 2);
  const isHit = highlightIds.has(node.id);
  const onPath = pathIds.has(node.id);
  const isSelected = selectedId === node.id;
  const selectable = meta.kind === 'element' || node.id === 'body';

  return (
    <div className={styles.treeNode}>
      <div
        className={clsx(
          styles.treeRow,
          selectable && styles.treeRowSelectable,
          isHit && styles.hit,
          onPath && !isHit && styles.pathHit,
          isSelected && styles.pathHit,
        )}
        style={{paddingLeft: `${depth * 0.15}rem`}}
        onClick={() => selectable && onSelect?.(node.id)}
        onKeyDown={(e) => {
          if (selectable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect?.(node.id);
          }
        }}
        role={selectable ? 'button' : undefined}
        tabIndex={selectable ? 0 : undefined}
      >
        {hasChildren ? (
          <button
            type="button"
            className={styles.treeToggle}
            aria-expanded={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            {open ? '▼' : '▶'}
          </button>
        ) : (
          <span className={styles.treeToggle} aria-hidden>
            ·
          </span>
        )}
        <span>{meta.label}</span>
      </div>
      {hasChildren && open && (
        <div className={styles.treeChildren}>
          {node.children.map((child) => (
            <DomTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              highlightIds={highlightIds}
              pathIds={pathIds}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MockPage({highlightIds, overrides, styles: inlineStyles, extraClasses}) {
  const cls = (id) =>
    clsx(
      highlightIds.has(id) && styles.hit,
      (extraClasses[id] || []).includes('highlighted') && styles.highlightedClass,
    );
  const style = (id) => inlineStyles[id] || {};

  return (
    <div className={styles.mockPage} aria-label="Учебная страница">
      <header id="pageHeader" className={cls('pageHeader')} style={style('pageHeader')}>
        {getNodeText('pageHeader', overrides)}
      </header>
      <main id="main-content" className={cls('main')} style={style('main')}>
        <p className={clsx(cls('p1'), ...getNodeClasses('p1', extraClasses))} style={style('p1')}>
          {getNodeText('p1', overrides)}
        </p>
        <p className={clsx(cls('p2'), ...getNodeClasses('p2', extraClasses))} style={style('p2')}>
          {getNodeText('p2', overrides)}
        </p>
        <button type="button" id="myButton" className={clsx(cls('myButton'), 'action-btn')} style={style('myButton')}>
          {getNodeText('myButton', overrides)}
        </button>
        <button type="button" className={clsx(cls('btn2'), 'action-btn')} style={style('btn2')}>
          {getNodeText('btn2', overrides)}
        </button>
        <div className={clsx('wrapper', cls('wrapper'))} style={style('wrapper')}>
          <span className={clsx('target', cls('target1'))} style={style('target1')}>
            {getNodeText('target1', overrides)}
          </span>
          <span className={clsx('target', cls('target2'))} style={style('target2')}>
            {getNodeText('target2', overrides)}
          </span>
        </div>
      </main>
    </div>
  );
}

function JsDomBridgePlayInner() {
  const [mode, setMode] = useState('bridge');
  const [scriptId, setScriptId] = useState('head-early');
  const [scriptStep, setScriptStep] = useState(0);
  const [queryId, setQueryId] = useState('byId');
  const [queryPulse, setQueryPulse] = useState(0);
  const [docPropIdx, setDocPropIdx] = useState(0);
  const [selectedNode, setSelectedNode] = useState('myButton');
  const [modifyState, setModifyState] = useState({
    overrides: {},
    styles: {},
    extraClasses: {},
  });

  const scriptScenario = SCRIPT_SCENARIOS.find((s) => s.id === scriptId) ?? SCRIPT_SCENARIOS[0];
  const queryPreset = QUERY_PRESETS.find((q) => q.id === queryId) ?? QUERY_PRESETS[0];
  const docProp = DOCUMENT_PROPS[docPropIdx] ?? DOCUMENT_PROPS[0];

  const highlightIds = useMemo(() => {
    if (mode === 'query') {
      return new Set(queryPreset.match);
    }
    if (mode === 'bridge' && docProp.nodeId) {
      return new Set([docProp.nodeId]);
    }
    if (mode === 'script' && scriptScenario.result) {
      return new Set([scriptScenario.result]);
    }
    return new Set();
  }, [mode, queryPreset, docProp, scriptScenario]);

  const pathIds = useMemo(() => {
    const target = [...highlightIds][0] || selectedNode;
    const path = getPathToNode(target);
    return new Set(path || []);
  }, [highlightIds, selectedNode, queryPulse]);

  const runQueryAnimation = useCallback(() => {
    setQueryPulse((n) => n + 1);
    if (queryPreset.match[0]) {
      setSelectedNode(queryPreset.match[0]);
    }
  }, [queryPreset]);

  useEffect(() => {
    if (mode !== 'script') {
      return undefined;
    }
    setScriptStep(0);
    const timers = scriptScenario.steps.map((_, i) =>
      window.setTimeout(() => setScriptStep(i), 400 + i * 650),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [mode, scriptId]);

  const applyModify = (action) => {
    if (!selectedNode || !NODE_META[selectedNode]?.tag) {
      return;
    }
    setModifyState((prev) => action.apply(selectedNode, prev));
  };

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="JavaScript и HTML: живая связь через DOM"
        subtitle="document, порядок загрузки скрипта, поиск узлов и изменение элементов на странице"
      >
        <div className={styles.tabs} role="tablist" aria-label="Режим демо">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={clsx(styles.tab, mode === m.id && styles.tabActive)}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'bridge' && (
          <>
            <div className={styles.bridgeRow}>
              <span className={styles.docBadge}>document</span>
              <span className={styles.bridgeArrow} aria-hidden>
                ⟷
              </span>
              <span className={styles.domLabel}>дерево DOM в памяти браузера</span>
            </div>
            <div className={styles.propsList}>
              {DOCUMENT_PROPS.map((p, i) => (
                <button
                  key={p.key}
                  type="button"
                  className={clsx(styles.propBtn, docPropIdx === i && styles.propBtnActive)}
                  onClick={() => setDocPropIdx(i)}
                >
                  <strong>{p.key}</strong> — {p.desc}
                </button>
              ))}
            </div>
            <p className="it-demo__hint">{docProp.desc}</p>
          </>
        )}

        {mode === 'script' && (
          <>
            <div className={toolStyles.chips}>
              {SCRIPT_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={clsx(toolStyles.chip, scriptId === s.id && toolStyles.chipActive)}
                  onClick={() => setScriptId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="it-demo__hint">{scriptScenario.hint}</p>
            <div className={clsx(styles.layout, styles.layoutSplit)}>
              <div>
                <div className={styles.miniDoc}>
                  <div className={styles.miniDocMuted}>&lt;!DOCTYPE html&gt;</div>
                  <div>&lt;html&gt;</div>
                  <div style={{marginLeft: '0.75rem'}}>&lt;head&gt;</div>
                  {scriptId !== 'body-end' && (
                    <div style={{marginLeft: '1.5rem'}} className={styles.miniDocScript}>
                      &lt;script&gt; … getElementById … &lt;/script&gt;
                    </div>
                  )}
                  {scriptId === 'defer' && (
                    <div style={{marginLeft: '1.5rem'}} className={styles.miniDocScript}>
                      &lt;script defer src=&quot;app.js&quot;&gt;
                    </div>
                  )}
                  <div style={{marginLeft: '0.75rem'}}>&lt;/head&gt;</div>
                  <div style={{marginLeft: '0.75rem'}}>&lt;body&gt;</div>
                  <div style={{marginLeft: '1.5rem'}} className={styles.miniDocBtn}>
                    &lt;button id=&quot;myButton&quot;&gt;
                  </div>
                  {scriptId === 'body-end' && (
                    <div style={{marginLeft: '1.5rem'}} className={styles.miniDocScript}>
                      &lt;script&gt; … &lt;/script&gt;
                    </div>
                  )}
                  <div style={{marginLeft: '0.75rem'}}>&lt;/body&gt;</div>
                </div>
                <pre className={styles.codeLine}>{scriptScenario.code}</pre>
              </div>
              <div>
                <div className={styles.timeline}>
                  {scriptScenario.steps.map((step, i) => (
                    <div
                      key={step.label}
                      className={clsx(
                        styles.timelineStep,
                        i <= scriptStep && styles.timelineStepDone,
                        i === scriptStep && styles.timelineStepActive,
                      )}
                    >
                      <span className={styles.timelineDot} />
                      {step.label}
                    </div>
                  ))}
                </div>
                <div
                  className={clsx(
                    styles.resultBox,
                    scriptScenario.result ? styles.resultOk : styles.resultWarn,
                  )}
                >
                  Результат: <strong>{scriptScenario.resultLabel}</strong>
                </div>
              </div>
            </div>
          </>
        )}

        {mode === 'query' && (
          <>
            <div className={toolStyles.chips}>
              {QUERY_PRESETS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  className={clsx(toolStyles.chip, queryId === q.id && toolStyles.chipActive)}
                  onClick={() => {
                    setQueryId(q.id);
                    setQueryPulse((n) => n + 1);
                    if (q.match[0]) setSelectedNode(q.match[0]);
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <p className="it-demo__hint">{queryPreset.hint}</p>
            <pre className={styles.codeLine}>{queryPreset.code}</pre>
            <p className="it-demo__hint" style={{marginTop: '0.35rem'}}>
              Возвращает: {queryPreset.returns}. Найдено узлов: <strong>{queryPreset.match.length}</strong>
            </p>
            <button
              type="button"
              className="it-demo__btn it-demo__btn--primary"
              style={{marginTop: '0.5rem'}}
              onClick={runQueryAnimation}
            >
              Показать на странице
            </button>
            <div className={styles.modifyBar}>
              {MODIFY_ACTIONS.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  className={styles.modifyBtn}
                  disabled={!selectedNode || !NODE_META[selectedNode]?.tag}
                  onClick={() => applyModify(act)}
                  title={act.code(selectedNode)}
                >
                  {act.label}
                </button>
              ))}
            </div>
            <p className="it-demo__hint" style={{marginTop: '0.35rem'}}>
              Выберите узел в дереве или на странице, затем примените свойство — изменения только в демо.
            </p>
          </>
        )}

        <div className={clsx(styles.layout, styles.layoutSplit, {marginTop: '1rem'})}>
          <div>
            <p className="it-demo__label">Страница в браузере</p>
            <MockPage
              highlightIds={highlightIds}
              overrides={modifyState.overrides}
              styles={modifyState.styles}
              extraClasses={modifyState.extraClasses}
            />
          </div>
          <div>
            <p className="it-demo__label">DOM-дерево</p>
            <div className={styles.treePanel}>
              <DomTreeNode
                node={DOM_TREE}
                highlightIds={highlightIds}
                pathIds={pathIds}
                selectedId={selectedNode}
                onSelect={setSelectedNode}
              />
            </div>
          </div>
        </div>
      </DemoCard>
    </DemoShell>
  );
}

export default JsDomBridgePlayInner;
