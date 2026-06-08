import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  TABS,
  GENERATIONS,
  ECOSYSTEM_BY_ERA,
  NODE_TYPE_META,
  DEP_GRAPH_BY_ERA,
  BUILD_STEPS_BY_ERA,
  REF_SYSTEMS_BY_ERA,
  flattenArchFiles,
  getArchPresets,
  getArchPreset,
  activeDepEdges,
  defaultEnabledNodes,
  bundleSummary,
} from '@/components/shared/kb/vbArchitectureEngine';
import styles from '@/components/demos/VbArchitecturePlay.module.css';

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

function VbArchitecturePlayInner() {
  const [era, setEra] = useState('vbnet');
  const [tab, setTab] = useState('ecosystem');
  const [layerId, setLayerId] = useState(null);
  const [enabledNodes, setEnabledNodes] = useState(() => defaultEnabledNodes('vbnet'));
  const [pickedNode, setPickedNode] = useState('main');
  const [archId, setArchId] = useState('winforms');
  const [selectedPath, setSelectedPath] = useState(null);
  const [buildStepId, setBuildStepId] = useState(null);
  const [refId, setRefId] = useState(null);

  const generation = GENERATIONS.find((g) => g.id === era) ?? GENERATIONS[1];
  const layers = ECOSYSTEM_BY_ERA[era] ?? ECOSYSTEM_BY_ERA.vbnet;
  const layer = layers.find((l) => l.id === layerId) ?? layers[0];
  const graph = DEP_GRAPH_BY_ERA[era] ?? DEP_GRAPH_BY_ERA.vbnet;
  const archPresets = getArchPresets(era);
  const arch = getArchPreset(era, archId);
  const files = useMemo(() => flattenArchFiles(arch.tree), [arch]);
  const buildSteps = BUILD_STEPS_BY_ERA[era] ?? BUILD_STEPS_BY_ERA.vbnet;
  const buildStep = buildSteps.find((s) => s.id === buildStepId) ?? buildSteps[0];
  const refSystems = REF_SYSTEMS_BY_ERA[era] ?? REF_SYSTEMS_BY_ERA.vbnet;
  const refSys = refSystems.find((r) => r.id === refId) ?? refSystems[0];

  const edges = useMemo(() => activeDepEdges(era, enabledNodes), [era, enabledNodes]);
  const bundle = useMemo(() => bundleSummary(era, enabledNodes), [era, enabledNodes]);
  const picked = graph.nodes.find((n) => n.id === pickedNode);
  const selectedFile = files.find((f) => f.path === selectedPath);

  const switchEra = useCallback((nextEra) => {
    setEra(nextEra);
    setLayerId(null);
    setEnabledNodes(defaultEnabledNodes(nextEra));
    setPickedNode('main');
    const presets = getArchPresets(nextEra);
    setArchId(presets[0]?.id ?? 'winforms');
    const steps = BUILD_STEPS_BY_ERA[nextEra];
    setBuildStepId(steps?.[0]?.id ?? null);
    const refs = REF_SYSTEMS_BY_ERA[nextEra];
    setRefId(refs?.[0]?.id ?? null);
  }, []);

  useEffect(() => {
    const first = files[0];
    setSelectedPath(first?.path ?? null);
  }, [archId, era, files]);

  useEffect(() => {
    document.documentElement.style.setProperty('--vb-accent', generation.accent);
  }, [generation.accent]);

  const toggleNode = useCallback(
    (id) => {
      if (id === 'main') return;
      setEnabledNodes((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [],
  );

  const toggleBackground = useCallback(
    (on) => {
      setEnabledNodes((prev) => {
        const next = new Set(prev);
        if (on) {
          next.add('job');
          next.add('host');
          next.add('ef');
        } else {
          next.delete('job');
          next.delete('host');
        }
        return next;
      });
    },
    [],
  );

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Архитектура Visual Basic"
        subtitle="VB6/COM и VB.NET/CLR: экосистема, структура проекта, граф зависимостей, сборка и подключение библиотек"
      >
        <div className={styles.eraRow} role="group" aria-label="Поколение Visual Basic">
          {GENERATIONS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={clsx(styles.eraBtn, era === g.id && styles.eraBtnActive)}
              style={{'--era-accent': g.accent}}
              onClick={() => switchEra(g.id)}
            >
              <span className={styles.eraLabel}>{g.label}</span>
              <span className={styles.eraTagline}>{g.tagline}</span>
            </button>
          ))}
        </div>

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

        {tab === 'ecosystem' && (
          <>
            <div className={styles.stackCol}>
              {[...layers].reverse().map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={clsx(styles.stackLayer, layer.id === l.id && styles.stackLayerActive)}
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

        {tab === 'structure' && (
          <>
            {archPresets.length > 1 && (
              <div className="it-demo__tabs" style={{marginBottom: '0.5rem'}}>
                {archPresets.map((p) => (
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
            )}
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
                  <p style={{margin: 0}}>Выберите файл в дереве проекта</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'graph' && (
          <>
            {era === 'vbnet' && (
              <div className={styles.toggleRow}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={enabledNodes.has('job')}
                    onChange={(e) => toggleBackground(e.target.checked)}
                  />
                  Фоновая служба (BackgroundService + Hosting)
                </label>
              </div>
            )}
            <div className={styles.graphLegend}>
              {Object.entries(NODE_TYPE_META).map(([key, meta]) => (
                <span key={key} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{'--c': meta.stroke}} />
                  {meta.label}
                </span>
              ))}
            </div>
            <div className={styles.graphWrap}>
              <svg className={styles.graphSvg} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet">
                {edges.map(([from, to]) => {
                  const a = graph.nodes.find((n) => n.id === from);
                  const b = graph.nodes.find((n) => n.id === to);
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
                {graph.nodes.map((n) => {
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
                        top: `${(n.y / 240) * 100}%`,
                        '--node-stroke': meta.stroke,
                      }}
                      onClick={() => {
                        setPickedNode(n.id);
                        if (n.id !== 'main') toggleNode(n.id);
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
              {graph.hint}
            </p>
            <div className={styles.bundleBox}>
              {bundle.chips.map((c) => (
                <span key={c} className={styles.bundleChip}>
                  {c}
                </span>
              ))}
            </div>
          </>
        )}

        {tab === 'build' && (
          <>
            <div className={styles.flow}>
              {buildSteps.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span className={styles.flowArrow} aria-hidden>
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    className={clsx(styles.flowStep, buildStep.id === s.id && styles.flowStepActive)}
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

        {tab === 'refs' && (
          <>
            <div className={styles.modGrid}>
              {refSystems.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={clsx(styles.modCard, refSys.id === m.id && styles.modCardActive)}
                  style={{'--mod-color': m.color}}
                  onClick={() => setRefId(m.id)}
                >
                  <span className={styles.modEra}>{m.era}</span>
                  <p className={styles.modLabel}>{m.label}</p>
                </button>
              ))}
            </div>
            <pre className={styles.codeBlock}>{refSys.syntax}</pre>
            <p className={styles.hint}>
              <strong>Особенности:</strong> {refSys.traits.join(' · ')}
            </p>
            <p className={styles.hint}>
              <strong>Инструменты:</strong> {refSys.tools}
            </p>
            <p className={styles.hint}>
              <strong>Где встречается:</strong> {refSys.use}
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default VbArchitecturePlayInner;
