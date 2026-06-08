import React, {useCallback, useEffect, useMemo, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  TABS,
  ECOSYSTEM_LAYERS,
  DEP_NODES,
  NODE_TYPE_META,
  ARCH_PRESETS,
  FRAMEWORK_COMPARE,
  REQUEST_STEPS,
  PHOENIX_PLUGS,
  MIX_SYSTEMS,
  RESTART_STRATEGIES,
  SUPERVISION_PRESETS,
  flattenArchFiles,
  getArchPreset,
  getSupervisionPreset,
  buildSupervisionTree,
  activeDepEdges,
  defaultEnabledNodes,
  bundleSummary,
} from '@/components/shared/kb/elixirEcosystemEngine';
import styles from '@/components/demos/ElixirEcosystemPlay.module.css';

function supIcon(type) {
  if (type === 'application') return '🏁';
  if (type === 'supervisor') return '🌳';
  return '⚙️';
}

function supBadgeClass(type) {
  if (type === 'application') return styles.supBadgeApp;
  if (type === 'supervisor') return styles.supBadgeSup;
  return styles.supBadgeWorker;
}

function SupervisionTreeNode({node, depth, selectedId, onSelect, crashedId}) {
  const isCrashed = crashedId === node.id;
  return (
    <div style={{marginLeft: `${depth * 0.85}rem`}}>
      <div
        role="button"
        tabIndex={0}
        className={clsx(styles.supNode, selectedId === node.id && styles.supNodeActive, isCrashed && styles.crashFlash)}
        onClick={() => onSelect(node.id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(node.id);
          }
        }}
      >
        <span className={styles.supIcon} aria-hidden>
          {supIcon(node.type)}
        </span>
        <span>{node.label}</span>
        <span className={clsx(styles.supBadge, supBadgeClass(node.type))}>{node.type}</span>
        {node.strategy && (
          <span className={clsx(styles.supBadge, styles.supBadgeSup)}>{node.strategy}</span>
        )}
        {isCrashed && <span style={{color: '#ef4444', fontWeight: 700}}>↻ restart</span>}
      </div>
      {node.children?.map((child) => (
        <SupervisionTreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          crashedId={crashedId}
        />
      ))}
    </div>
  );
}

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

function ElixirEcosystemPlayInner() {
  const [tab, setTab] = useState('stack');
  const [layerId, setLayerId] = useState(ECOSYSTEM_LAYERS[0].id);
  const [enabledNodes, setEnabledNodes] = useState(defaultEnabledNodes);
  const [pickedNode, setPickedNode] = useState('application');
  const [archId, setArchId] = useState('phoenix');
  const [selectedPath, setSelectedPath] = useState(null);
  const [supId, setSupId] = useState('phoenix');
  const [supSelected, setSupSelected] = useState('processor');
  const [crashedId, setCrashedId] = useState(null);
  const [strategyId, setStrategyId] = useState('one_for_one');
  const [requestStepId, setRequestStepId] = useState(REQUEST_STEPS[0].id);
  const [mixId, setMixId] = useState('hex');

  const layer = ECOSYSTEM_LAYERS.find((l) => l.id === layerId) ?? ECOSYSTEM_LAYERS[0];
  const arch = getArchPreset(archId);
  const files = useMemo(() => flattenArchFiles(arch.tree), [arch]);
  const supPreset = getSupervisionPreset(supId);
  const supTree = useMemo(() => buildSupervisionTree(supPreset), [supPreset]);
  const requestStep = REQUEST_STEPS.find((s) => s.id === requestStepId) ?? REQUEST_STEPS[0];
  const mix = MIX_SYSTEMS.find((m) => m.id === mixId) ?? MIX_SYSTEMS[0];
  const strategy = RESTART_STRATEGIES.find((s) => s.id === strategyId) ?? RESTART_STRATEGIES[0];

  const edges = useMemo(() => activeDepEdges(enabledNodes), [enabledNodes]);
  const bundle = useMemo(() => bundleSummary(enabledNodes), [enabledNodes]);
  const picked = DEP_NODES.find((n) => n.id === pickedNode);

  useEffect(() => {
    const first = files[0];
    setSelectedPath(first?.path ?? null);
  }, [archId, files]);

  useEffect(() => {
    setCrashedId(null);
    const firstWorker = supPreset.nodes.find((n) => n.type === 'worker');
    setSupSelected(firstWorker?.id ?? 'root');
  }, [supId, supPreset]);

  const toggleNode = useCallback((id) => {
    if (id === 'application') return;
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleWorkers = useCallback((on) => {
    setEnabledNodes((prev) => {
      const next = new Set(prev);
      if (on) {
        next.add('workers');
        next.add('oban');
      } else {
        next.delete('workers');
        next.delete('oban');
      }
      return next;
    });
  }, []);

  const simulateCrash = useCallback(() => {
    if (supSelected && supSelected !== 'root') {
      setCrashedId(supSelected);
      window.setTimeout(() => setCrashedId(null), 1200);
    }
  }, [supSelected]);

  const selectedFile = files.find((f) => f.path === selectedPath);
  const selectedSupNode =
    supPreset.nodes.find((n) => n.id === supSelected) ??
    (supSelected === 'root' ? {label: supPreset.root, type: 'application'} : null);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Экосистема Elixir и архитектура BEAM"
        subtitle="Слои OTP/Phoenix, граф mix.exs, дерево супервизии, путь HTTP/LiveView и Mix/Hex/Release"
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
            {layerId === 'frameworks' && (
              <div className={styles.fwCompare} aria-label="Сравнение фреймворков">
                {FRAMEWORK_COMPARE.map((fw) => (
                  <div key={fw.id} className={styles.fwCard} style={{'--fw-color': fw.color}}>
                    <strong>{fw.label}</strong>
                    <br />
                    MVP: {'⭐'.repeat(fw.mvp)} · Масштаб: {'⭐'.repeat(fw.scale)}
                    <br />
                    {fw.fit}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'deps' && (
          <>
            <div className={styles.toggleRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={enabledNodes.has('workers')}
                  onChange={(e) => toggleWorkers(e.target.checked)}
                />
                Фоновые воркеры (OrderWorker + Oban)
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
              <svg className={styles.graphSvg} viewBox="0 0 420 250" preserveAspectRatio="xMidYMid meet">
                {edges.map(([from, to]) => {
                  const a = DEP_NODES.find((n) => n.id === from);
                  const b = DEP_NODES.find((n) => n.id === to);
                  if (!a || !b) return null;
                  const lazy = a.type === 'process' || b.type === 'process';
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
                        left: `${(n.x / 420) * 100}%`,
                        top: `${(n.y / 250) * 100}%`,
                        '--node-stroke': meta.stroke,
                      }}
                      onClick={() => {
                        setPickedNode(n.id);
                        if (n.id !== 'application') toggleNode(n.id);
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
              Отключите <code>OrderWorker</code> — исчезнут рёбра к Oban; Hex-пакеты в mix.exs остаются, но не стартуют без
              дочернего процесса в Application.
            </p>
            <div className={styles.bundleBox}>
              {bundle.layers.map((c) => (
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

        {tab === 'supervision' && (
          <>
            <div className="it-demo__tabs" style={{marginBottom: '0.5rem'}}>
              {SUPERVISION_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={clsx('it-demo__tab', supId === p.id && 'it-demo__tab--active')}
                  onClick={() => setSupId(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className={styles.hint} style={{marginTop: 0}}>
              Корень: <code>{supPreset.root}</code> · стратегия корня: <code>{supPreset.rootStrategy}</code>
            </p>
            <div className={styles.supTree} aria-label="Дерево супервизии">
              <SupervisionTreeNode
                node={supTree}
                depth={0}
                selectedId={supSelected}
                onSelect={setSupSelected}
                crashedId={crashedId}
              />
            </div>
            <div className={styles.crashSim}>
              <button type="button" className={styles.crashBtn} onClick={simulateCrash}>
                Симулировать crash: {selectedSupNode?.label ?? supSelected}
              </button>
              <span className={styles.hint} style={{margin: 0}}>
                Supervisor перезапустит по стратегии — см. подсказку ниже
              </span>
            </div>
            <p className={styles.hint}>{supPreset.crashHint}</p>
            <div className={styles.strategyGrid} aria-label="Стратегии перезапуска">
              {RESTART_STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={clsx(styles.strategyCard, strategyId === s.id && styles.strategyCardActive)}
                  onClick={() => setStrategyId(s.id)}
                >
                  <div className={styles.strategyLabel}>{s.label}</div>
                  <div>{s.desc}</div>
                  <div style={{marginTop: '0.25rem', opacity: 0.85}}>
                    <strong>Когда:</strong> {s.when}
                  </div>
                </button>
              ))}
            </div>
            {strategyId && (
              <p className={styles.hint}>
                Выбрано: <code>{strategy.label}</code> — {strategy.desc}
              </p>
            )}
          </>
        )}

        {tab === 'request' && (
          <>
            <div className={styles.flow}>
              {REQUEST_STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  {i > 0 && (
                    <span className={styles.flowArrow} aria-hidden>
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    className={clsx(styles.flowStep, requestStepId === s.id && styles.flowStepActive)}
                    onClick={() => setRequestStepId(s.id)}
                  >
                    {s.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <pre className={styles.codeBlock}>{requestStep.cmd}</pre>
            <p className={styles.hint}>{requestStep.detail}</p>
            <div className={styles.plugStack} aria-label="Цепочка Phoenix">
              {PHOENIX_PLUGS.map((plug) => (
                <div
                  key={plug.id}
                  className={clsx(styles.plugLayer, requestStep.activePlugs.includes(plug.id) && styles.plugLayerOn)}
                >
                  {requestStep.activePlugs.includes(plug.id) ? '▸ ' : '  '}
                  {plug.label}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'mix' && (
          <>
            <div className={styles.modGrid}>
              {MIX_SYSTEMS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={clsx(styles.modCard, mixId === m.id && styles.modCardActive)}
                  style={{'--mod-color': m.color}}
                  onClick={() => setMixId(m.id)}
                >
                  <span className={styles.modEra}>{m.era}</span>
                  <p className={styles.modLabel}>{m.label}</p>
                </button>
              ))}
            </div>
            <pre className={styles.codeBlock}>{mix.syntax}</pre>
            <p className={styles.hint}>
              <strong>Особенности:</strong> {mix.traits.join(' · ')}
            </p>
            <p className={styles.hint}>
              <strong>Инструменты:</strong> {mix.tools}
            </p>
            <p className={styles.hint}>
              <strong>Где встречается:</strong> {mix.use}
            </p>
          </>
        )}
      </DemoCard>
    </DemoShell>
  );
}

export default ElixirEcosystemPlayInner;
