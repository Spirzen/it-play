import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  TABS,
  ECOSYSTEM_LAYERS,
  DEP_NODES,
  DEP_EDGES,
  NODE_TYPE_META,
  ARCH_PRESETS,
  BUILD_STEPS,
  MODULE_MODELS,
  flattenArchFiles,
  getArchPreset,
  activeDepEdges,
  defaultEnabledNodes,
  bundleSummary,
} from '@/components/shared/kb/pascalEcosystemEngine';
import styles from '@/components/demos/PascalEcosystemPlay.module.css';

function ArchTreeNode({node, depth, selectedPath, onSelect, defaultOpen}) {
  const [open, setOpen] = useState(defaultOpen ?? depth < 2);

  if (node.type === 'dir') {
    const name = node.path.split('/').filter(Boolean).pop() || node.path;
    return (
      <li>
        <div
          className={styles.treeDir}
          style={{paddingLeft: `${0.25 + depth * 0.6}rem`}}
          role="button"
          tabIndex={0}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
          aria-expanded={open}
        >
          <span aria-hidden>{open ? '▼' : '▶'}</span>
          <span aria-hidden>📁</span>
          <span>{name}</span>
        </div>
        {open && node.children?.length > 0 && (
          <ul className={styles.tree}>
            {node.children.map((child) => (
              <ArchTreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  const fileName = node.path.split('/').pop();
  return (
    <li>
      <button
        type="button"
        className={clsx(styles.treeBtn, selectedPath === node.path && styles.treeBtnActive)}
        style={{paddingLeft: `${0.25 + depth * 0.6}rem`}}
        onClick={() => onSelect(node.path)}
      >
        <span aria-hidden>📄</span>
        {fileName}
      </button>
    </li>
  );
}

function PascalEcosystemPlayInner() {
  const [tab, setTab] = useState('stack');
  const [layerId, setLayerId] = useState(ECOSYSTEM_LAYERS[0].id);
  const [enabledNodes, setEnabledNodes] = useState(defaultEnabledNodes);
  const [pickedNode, setPickedNode] = useState('program');
  const [archId, setArchId] = useState('lazarus-lcl');
  const [selectedPath, setSelectedPath] = useState(null);
  const [buildStepId, setBuildStepId] = useState(BUILD_STEPS[0].id);
  const [modId, setModId] = useState('unit-uses');

  const layer = ECOSYSTEM_LAYERS.find((l) => l.id === layerId) ?? ECOSYSTEM_LAYERS[0];
  const arch = getArchPreset(archId);
  const files = useMemo(() => flattenArchFiles(arch.tree), [arch]);
  const buildStep = BUILD_STEPS.find((s) => s.id === buildStepId) ?? BUILD_STEPS[0];
  const mod = MODULE_MODELS.find((m) => m.id === modId) ?? MODULE_MODELS[0];

  const edges = useMemo(() => activeDepEdges(enabledNodes), [enabledNodes]);
  const bundle = useMemo(() => bundleSummary(enabledNodes), [enabledNodes]);
  const picked = DEP_NODES.find((n) => n.id === pickedNode);

  useEffect(() => {
    const first = files[0];
    setSelectedPath(first?.path ?? null);
  }, [archId, files]);

  const toggleNode = useCallback((id) => {
    if (id === 'program') return;
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleDataLayer = useCallback((on) => {
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (on) {
        next.add('dm');
        next.add('zeos');
      } else {
        next.delete('dm');
        next.delete('zeos');
      }
      return next;
    });
  }, []);

  const toggleHttpApi = useCallback((on) => {
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (on) {
        next.add('horse');
      } else {
        next.delete('horse');
      }
      return next;
    });
  }, []);

  const selectedFile = files.find((f) => f.path === selectedPath);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура и экосистема Pascal"
        subtitle="Диалекты, RTL и UI-библиотеки, граф uses, структура проекта Lazarus/Delphi и сборка"
      >
        <div className="it-demo__tabs" role="tablist" aria-label="Режимы демо">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={clsx('it-demo__tab', tab === t.id && 'it-demo__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'stack' && (
          <>
            <div className={styles.stackCol}>
              {[...ECOSYSTEM_LAYERS].reverse().map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={clsx(styles.stackLayer, layerId === l.id && styles.stackLayerActive)}
                  style={{'--layer-color': l.color}}
                  onClick={() => setLayerId(l.id)}
                >
                  <span className={styles.stackIcon} aria-hidden>
                    {l.icon}
                  </span>
                  <div>
                    <span className={styles.stackTag}>{l.tag}</span>
                    <p className={styles.stackTitle}>{l.label}</p>
                    <ul className={styles.stackItems}>
                      {l.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </button>
              ))}
            </div>
            <div className={styles.detailPanel} style={{'--layer-color': layer.color}}>
              <strong>{layer.label}</strong> — {layer.detail}
            </div>
          </>
        )}

        {tab === 'deps' && (
          <>
            <div className={styles.toggleRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={enabledNodes.has('dm')}
                  onChange={(e) => toggleDataLayer(e.target.checked)}
                />
                DataModule + Zeos (слой БД)
              </label>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={enabledNodes.has('horse')}
                  onChange={(e) => toggleHttpApi(e.target.checked)}
                />
                REST API (Horse)
              </label>
            </div>
            <div className={styles.graphLegend}>
              {Object.entries(NODE_TYPE_META).map(([key, meta]) => (
                <span key={key} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{'--c': meta.stroke}} />
                  {meta.label}
                </span>
              ))}
            </div>
            <div className={styles.graphWrap}>
              <svg className={styles.graphSvg} viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet">
                {edges.map(([from, to]) => {
                  const a = DEP_NODES.find((n) => n.id === from);
                  const b = DEP_NODES.find((n) => n.id === to);
                  if (!a || !b) return null;
                  const lazy = a.type === 'lazy' || b.type === 'lazy';
                  return (
                    <line
                      key={`${from}-${to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      className={clsx(styles.graphEdge, lazy && styles.graphEdgeLazy)}
                    />
                  );
                })}
              </svg>
              <div className={styles.graphNodes}>
                {DEP_NODES.map((n) => {
                  const meta = NODE_TYPE_META[n.type];
                  const on = enabledNodes.has(n.id);
                  return (
                    <button
                      key={n.id}
                      type="button"
                      className={clsx(
                        styles.graphNode,
                        !on && styles.graphNodeOff,
                        pickedNode === n.id && styles.graphNodeActive,
                      )}
                      style={{
                        left: `${(n.x / 400) * 100}%`,
                        top: `${(n.y / 220) * 100}%`,
                        '--node-stroke': meta.stroke,
                      }}
                      onClick={() => {
                        setPickedNode(n.id);
                        if (n.id !== 'program') toggleNode(n.id);
                      }}
                      title={on ? 'Клик — исключить из графа' : 'Клик — включить'}
                    >
                      {n.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className={styles.hint}>
              {picked && (
                <>
                  <strong>{picked.label}</strong> ({NODE_TYPE_META[picked.type].label}).{' '}
                </>
              )}
              Секция <code>uses</code> связывает program, формы, units и RTL. Отключите DataModule — исчезнут Zeos и рёбра к
              слою данных; без Horse останется только GUI.
            </p>
            <div className={styles.bundleBox}>
              {bundle.artifacts.map((c) => (
                <span key={c} className={styles.bundleChip}>
                  {c}
                </span>
              ))}
            </div>
          </>
        )}

        {tab === 'structure' && (
          <>
            <div className="it-demo__tabs" style={{marginBottom: '0.5rem'}}>
              {ARCH_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx('it-demo__tab', archId === p.id && 'it-demo__tab--active')}
                  onClick={() => setArchId(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className={styles.hint} style={{marginTop: 0}}>
              {arch.toolchain}
            </p>
            <div className={styles.explorer}>
              <ul className={styles.tree}>
                {arch.tree.map((node) => (
                  <ArchTreeNode
                    key={node.path}
                    node={node}
                    depth={0}
                    selectedPath={selectedPath}
                    onSelect={setSelectedPath}
                    defaultOpen
                  />
                ))}
              </ul>
              <div className={styles.detailPanel}>
                {selectedFile ? (
                  <>
                    <strong>{selectedFile.path.split('/').pop()}</strong>
                    <p style={{margin: '0.35rem 0'}}>{selectedFile.role}</p>
                    <p style={{margin: 0}}>{selectedFile.hint}</p>
                  </>
                ) : (
                  <p style={{margin: 0}}>Выберите файл в дереве</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'build' && (
          <>
            <div className={styles.flow}>
              {BUILD_STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span className={styles.flowArrow} aria-hidden>
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    className={clsx(styles.flowStep, buildStepId === s.id && styles.flowStepActive)}
                    onClick={() => setBuildStepId(s.id)}
                  >
                    {s.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <pre className={styles.codeBlock}>{buildStep.cmd}</pre>
            <p className={styles.hint}>{buildStep.detail}</p>
          </>
        )}

        {tab === 'modules' && (
          <>
            <div className={styles.modGrid}>
              {MODULE_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={clsx(styles.modCard, modId === m.id && styles.modCardActive)}
                  style={{'--mod-color': m.color}}
                  onClick={() => setModId(m.id)}
                >
                  <span className={styles.modEra}>{m.era}</span>
                  <p className={styles.modLabel}>{m.label}</p>
                </button>
              ))}
            </div>
            <pre className={styles.codeBlock}>{mod.syntax}</pre>
            <p className={styles.hint}>
              <strong>Особенности:</strong> {mod.traits.join(' · ')}
            </p>
            <p className={styles.hint}>
              <strong>Инструменты:</strong> {mod.tools}
            </p>
            <p className={styles.hint}>
              <strong>Где встречается:</strong> {mod.use}
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default PascalEcosystemPlayInner;
